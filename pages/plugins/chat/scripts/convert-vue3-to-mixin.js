/**
 * Vue3 script setup → Vue2 mixin (v2)
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'index/index.vue.source');

if (!fs.existsSync(SRC)) {
	console.error('index.vue.source 已移除，迁移已完成，无需再运行本脚本。');
	process.exit(0);
}

function balancedEnd(src, start, open, close) {
	let d = 0;
	for (let i = start; i < src.length; i++) {
		if (src[i] === open) d++;
		else if (src[i] === close) {
			d--;
			if (d === 0) return i;
		}
	}
	return -1;
}

function removePattern(src, regex) {
	let m;
	while ((m = src.match(regex))) {
		const idx = m.index;
		if (regex.source.includes('ref\\(')) {
			const p = src.indexOf('ref(', idx);
			const end = balancedEnd(src, p + 3, '(', ')');
			src = src.slice(0, idx) + src.slice(end + 2);
		} else if (regex.source.includes('computed\\(')) {
			const p = src.indexOf('computed(', idx);
			const end = balancedEnd(src, p + 8, '(', ')');
			src = src.slice(0, idx) + src.slice(end + 2);
		} else {
			src = src.slice(0, idx) + src.slice(idx + m[0].length);
		}
	}
	return src;
}

function extractAll(src, pattern, openToken, closeToken) {
	const items = [];
	let m;
	const re = new RegExp(pattern, 'g');
	while ((m = re.exec(src)) !== null) {
		const name = m[1];
		const openIdx = m.index + m[0].indexOf(openToken) + openToken.length - 1;
		const end = balancedEnd(src, openIdx, '(', ')');
		const inner = src.slice(openIdx + 1, end);
		items.push({ name, inner, start: m.index, end: end + 2 });
	}
	return items;
}

function transformImports(script) {
	const lines = [];
	const importRe = /^import[\s\S]*?;$/gm;
	let m;
	while ((m = importRe.exec(script)) !== null) {
		const line = m[0];
		if (line.includes("from 'vue'") || line.includes("from '@dcloudio/uni-app'")) continue;
		if (line.includes('chat_push.js') || line.includes('chat_media_auth_hooks') || line.includes('chat_user_init_hooks')) continue;
		if (line.includes('lxw-video-frame')) {
			lines.push('// #ifdef APP-PLUS');
			lines.push("// import { callVideoFrameInfo, releaseVideoFrame } from '@/uni_modules/lxw-video-frame';");
			lines.push('// #endif');
			continue;
		}
		lines.push(line
			.replace(/@\/common\/js\/common\.js/g, '../common/chat-host.js')
			.replace(/@\/common\/js\/chat_upload\.js/g, '../common/chat-upload.js')
			.replace(/@\/common\/js\/chat_pick_file\.js/g, '../common/chat-pick-file.js')
			.replace(/@\/common\/js\/chat_socket\.js/g, '../common/chat-socket.js')
			.replace(/@\/common\/js\/request\.js/g, '../common/chat-request.js')
			.replace(/\.\.\/customer-service\/components\//g, '../components/'));
	}
	if (!lines.some((l) => l.includes('chat-user-init'))) {
		lines.push("import { ensure_chat_user_init, apply_chat_user_page_config } from '../common/chat-user-init.js';");
	}
	// socket imports block - ensure from chat-host
	if (!lines.some((l) => l.includes('chat-host'))) {
		lines.unshift("import { isEmpty, showToast, page_back_prev_event, get_global_data, open_web_view } from '../common/chat-host.js';");
	}
	return lines;
}

function transformRefs(script, refNames) {
	let s = script;
	for (const name of refNames.sort((a, b) => b.length - a.length)) {
		s = s.replace(new RegExp('\\b' + name + '\\.value\\b', 'g'), 'this.' + name);
	}
	return s;
}

function extractWatches(script) {
	const watches = [];
	const re = /^watch\(/gm;
	let m;
	while ((m = re.exec(script)) !== null) {
		const end = balancedEnd(script, m.index + 5, '(', ')');
		watches.push(script.slice(m.index, end + 2));
	}
	return watches;
}

function parseWatchStmt(stmt) {
	const inner = stmt.slice(6, -2);
	// find last comma before =>
	const arrow = inner.lastIndexOf('=>');
	const left = inner.slice(0, arrow).replace(/,\s*$/, '').trim();
	let handler = inner.slice(arrow + 2).trim();
	if (handler.startsWith('{') && handler.endsWith('}')) handler = handler.slice(1, -1).trim();
	const sources = [];
	if (left.startsWith('[')) {
		left.slice(1, -1).split(',').forEach((x) => {
			const n = x.trim().replace(/\.value$/, '');
			if (n) sources.push(n);
		});
	} else {
		sources.push(left.replace(/\.value$/, '').trim());
	}
	return sources.map((src) => ({ src, handler }));
}

function extractLifecycles(script) {
	const map = {
		onLoad: 'chat_page_on_load',
		onShow: 'chat_page_on_show',
		onHide: 'chat_page_on_hide',
		onUnload: 'chat_page_on_unload',
		onReady: 'chat_page_on_ready',
		onPageScroll: 'chat_page_on_scroll',
	};
	const out = {};
	for (const [lc, method] of Object.entries(map)) {
		const re = new RegExp('^' + lc + '\\(', 'm');
		const m = script.match(re);
		if (!m) continue;
		const idx = m.index;
		const end = balancedEnd(script, idx + lc.length, '(', ')');
		let body = script.slice(idx + lc.length + 1, end).trim();
		if (body.match(/^\([^)]*\)\s*=>/)) {
			const ai = body.indexOf('=>');
			body = body.slice(ai + 2).trim();
		}
		if (body.startsWith('{') && body.endsWith('}')) body = body.slice(1, -1).trim();
		out[method] = { body, start: idx, end: end + 2 };
	}
	return out;
}

function constArrowToMethods(code) {
	const methods = [];
	const re = /^const (\w+) = (async )?(\([^)]*\))\s*=>\s*\{/gm;
	let m;
	const spans = [];
	while ((m = re.exec(code)) !== null) {
		const name = m[1];
		const asyncKw = m[2] || '';
		const params = m[3];
		const bodyStart = m.index + m[0].length - 1;
		const bodyEnd = balancedEnd(code, bodyStart, '{', '}');
		methods.push({ name, asyncKw, params, body: code.slice(bodyStart + 1, bodyEnd), start: m.index, end: bodyEnd + 1 });
		spans.push({ start: m.index, end: bodyEnd + 1 });
	}
	// single line arrows
	const re2 = /^const (\w+) = (async )?(\([^)]*\))\s*=>\s*([^\n{][^\n]*);/gm;
	while ((m = re2.exec(code)) !== null) {
		if (spans.some((s) => m.index >= s.start && m.index < s.end)) continue;
		methods.push({ name: m[1], asyncKw: m[2] || '', params: m[3], body: m[4].trim(), single: true, start: m.index, end: m.index + m[0].length });
		spans.push({ start: m.index, end: m.index + m[0].length });
	}
	// remove spans from code for module leftovers
	let moduleCode = code;
	spans.sort((a, b) => b.start - a.start).forEach((s) => {
		moduleCode = moduleCode.slice(0, s.start) + moduleCode.slice(s.end);
	});
	moduleCode = moduleCode
		.replace(/^const page_instance = getCurrentInstance\(\);\s*/m, '')
		.replace(/^let page_alive = true;\s*/m, '')
		.replace(/^onUnmounted\([\s\S]*?\);\s*/m, '')
		.replace(/\n{3,}/g, '\n\n')
		.trim();
	return { methods, moduleCode };
}

function build() {
	let content = fs.readFileSync(SRC, 'utf8');
	// fix paths in source for uniapp components
	content = content
		.replace(/\.\.\/customer-service\/components\//g, '../components/')
		.replace(/@\/hooks\/chat_user_init_hooks\.js/g, '../common/chat-user-init.js')
		.replace(/@\/common\/js\//g, '../common/')
		.replace(/chat_upload\.js/g, 'chat-upload.js')
		.replace(/chat_pick_file\.js/g, 'chat-pick-file.js')
		.replace(/chat_socket\.js/g, 'chat-socket.js');

	const template = content.match(/<template>([\s\S]*?)<\/template>/)[1];
	const style = content.match(/<style[^>]*>([\s\S]*?)<\/style>/)[1];
	let script = content.match(/<script setup>([\s\S]*?)<\/script>/)[1];

	const imports = transformImports(script);

	const refs = extractAll(script, 'const (\\w+) = ref\\(', 'ref(', ')');
	const refNames = refs.map((r) => r.name);

	const computeds = extractAll(script, 'const (\\w+) = computed\\(', 'computed(', ')');

	// remove refs, computeds, watches, lifecycles from script copy
	let body = script;
	[...refs, ...computeds].sort((a, b) => b.start - a.start).forEach((item) => {
		body = body.slice(0, item.start) + body.slice(item.end);
	});
	const lifecycles = extractLifecycles(body);
	Object.values(lifecycles).sort((a, b) => b.start - a.start).forEach((lc) => {
		body = body.slice(0, lc.start) + body.slice(lc.end);
	});
	const watchStmts = extractWatches(body);
	watchStmts.forEach((w) => { body = body.replace(w, ''); });
	body = body.replace(/^import[\s\S]*?;\n?/gm, '');

	const refNamesAll = refNames;
	body = transformRefs(body, refNamesAll);
	body = body.replace(/\bpage_alive\b/g, 'this.page_alive');
	body = body.replace(/\bnextTick\(/g, 'this.$nextTick(');
	body = body.replace(/page_instance\s*\?\s*\(page_instance\.proxy\s*\|\|\s*page_instance\)\s*:\s*null/g, 'this');
	body = body.replace(/page_instance\s*&&\s*page_instance\.proxy/g, 'this');

	const { methods, moduleCode } = constArrowToMethods(body);

	const dataLines = refs.map((r) => `\t\t\t${r.name}: ${r.inner},`);

	const computedLines = computeds.map((c) => {
		let b = transformRefs(c.inner, refNamesAll);
		b = b.replace(/^async\s*\(\)\s*=>\s*/, '');
		b = b.replace(/^\(\)\s*=>\s*/, '');
		if (b.startsWith('{') && !b.startsWith('{ return')) {
			return `\t\t${c.name}() ${b}`;
		}
		return `\t\t${c.name}() {\n\t\t\treturn ${b};\n\t\t}`;
	});

	const watchLines = [];
	watchStmts.forEach((stmt) => {
		parseWatchStmt(stmt).forEach(({ src, handler }) => {
			const h = transformRefs(handler, refNamesAll).replace(/\bpage_alive\b/g, 'this.page_alive');
			watchLines.push(`\t\t${src}(val) {\n\t\t\t${h}\n\t\t}`);
		});
	});

	const methodLines = methods.map((m) => {
		if (m.single) {
			return `\t\t${m.asyncKw}${m.name}${m.params} {\n\t\t\treturn ${m.body};\n\t\t}`;
		}
		return `\t\t${m.asyncKw}${m.name}${m.params} {\n${m.body.split('\n').map((l) => '\t\t\t' + l).join('\n')}\n\t\t}`;
	});

	const lcLines = Object.entries(lifecycles).map(([method, lc]) => {
		let b = transformRefs(lc.body, refNamesAll);
		b = b.replace(/\bpage_alive\b/g, 'this.page_alive');
		const param = method === 'chat_page_on_load' ? 'params' : method === 'chat_page_on_scroll' ? 'e' : '';
		return `\t\t${method}(${param}) {\n${b.split('\n').map((l) => '\t\t\t' + l).join('\n')}\n\t\t}`;
	});

	const stubs = `
const bind_chat_push = () => {};
const request_chat_push_auth = () => {};
const create_chat_local_push = () => {};
const request_chat_media_auth = () => {
\ttry { uni.authorize && uni.authorize({ scope: 'scope.record' }); } catch (e) {}
};
const ensure_chat_media_auth_before_pick = () => Promise.resolve(true);
`;

	const mixin = `${imports.join('\n')}
${stubs}

${moduleCode}

export default {
\tdata() {
\t\treturn {
\t\t\tpage_alive: true,
${dataLines.join('\n')}
\t\t};
\t},
\tcomputed: {
${computedLines.join(',\n\n')}
\t},
${watchLines.length ? `\twatch: {\n${watchLines.join(',\n\n')},\n\t},` : ''}
\tmethods: {
\t\tisEmpty,
\t\tshowToast,
\t\tpage_back_prev_event,
\t\tget_global_data,
\t\topen_web_view,
${[...methodLines, ...lcLines].join(',\n\n')}
\t},
};
`;

	fs.writeFileSync(path.join(ROOT, 'common/chat-page-mixin.js'), mixin);
	fs.writeFileSync(path.join(ROOT, 'index/index.css'), style.trim() + '\n');

	const tpl = transformTemplate(template);
	fs.writeFileSync(path.join(ROOT, 'index/index.vue'), buildShell(tpl));

	console.log('OK', { refs: refs.length, computeds: computeds.length, methods: methods.length, mixinLines: mixin.split('\n').length });
}

function transformTemplate(tpl) {
	let t = tpl.replace(/<view class="page-chat"/, '<view :class="theme_view + \' chat-page page-chat\'"');
	const map = { 'arrow-left': 'icon-angle-left', search: 'icon-search', speak: 'icon-speaker', enlarge: 'icon-enlarge', emoji: 'icon-emoji', add: 'icon-add', 'close-line': 'icon-close-line', delete: 'icon-delete', 'arrow-down': 'icon-arrow-bottom', 'close-round': 'icon-close-round', 'sending-surface': 'icon-sending-surface' };
	t = t.replace(/<u-icon([^>]*)name="([^"]+)"([^>]*)size="(\d+)"([^>]*)color="([^"]+)"([^>]*)><\/u-icon>/g, (_, a, name, b, size, c, color) => {
		const ic = map[name] || ('icon-' + name);
		return `<iconfont name="${ic}" size="${Number(size) * 2}rpx" color="${color}"></iconfont>`;
	});
	t = t.replace(/<u-icon([^>]*)name="([^"]+)"([^>]*)size="(\d+)"([^]*?):color="([^"]+)"([^>]*)><\/u-icon>/g, (_, a, name, b, size, c, color) => {
		const ic = map[name] || ('icon-' + name);
		return `<iconfont name="${ic}" size="${Number(size) * 2}rpx" :color="${color}"></iconfont>`;
	});
	t = t.replace(/<u-icon([^>]*) :name="([^"]+)"([^>]*)size="(\d+)"([^>]*)color="([^"]+)"([^>]*)><\/u-icon>/g, (_, a, nameExpr, b, size, c, color) => {
		return `<iconfont :name="${nameExpr}" size="${Number(size) * 2}rpx" color="${color}"></iconfont>`;
	});
	return t;
}

function buildShell(template) {
	return `<template>
${template}
</template>

<script>
\tconst app = getApp();
\timport componentCommon from '@/components/common/common';
\timport chatPageMixin from '../common/chat-page-mixin.js';
\timport ChatMessageItem from '../components/chat-message-item.vue';
\timport ChatVoiceMask from '../components/chat-voice-mask.vue';
\timport ChatMsgSearch from '../components/chat-msg-search.vue';
\timport ChatVideoPopup from '../components/chat-video-popup.vue';
\timport ChatMsgMenu from '../components/chat-msg-menu.vue';

\texport default {
\t\tmixins: [chatPageMixin],
\t\tcomponents: {
\t\t\tcomponentCommon,
\t\t\tChatMessageItem,
\t\t\tChatVoiceMask,
\t\t\tChatMsgSearch,
\t\t\tChatVideoPopup,
\t\t\tChatMsgMenu,
\t\t},
\t\tdata() {
\t\t\treturn {
\t\t\t\ttheme_view: app.globalData.get_theme_value_view(),
\t\t\t};
\t\t},
\t\tonLoad(params) {
\t\t\tparams = app.globalData.launch_params_handle(params);
\t\t\tapp.globalData.page_event_onload_handle(params);
\t\t\tthis.chat_page_on_load(params);
\t\t},
\t\tonShow() {
\t\t\tapp.globalData.page_event_onshow_handle && app.globalData.page_event_onshow_handle();
\t\t\tthis.chat_page_on_show();
\t\t},
\t\tonHide() {
\t\t\tthis.chat_page_on_hide();
\t\t},
\t\tonUnload() {
\t\t\tthis.chat_page_on_unload();
\t\t},
\t\tonReady() {
\t\t\tthis.chat_page_on_ready();
\t\t},
\t\tonPageScroll(e) {
\t\t\tthis.chat_page_on_scroll(e);
\t\t},
\t};
</script>

<style lang="scss" scoped src="./index.css"></style>
`;
}

build();
