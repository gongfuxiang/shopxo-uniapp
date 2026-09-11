/**
 * 客服分包文案（非 Vue 模块用）
 * 依赖 pages/plugins/chat/locale 合并进 uni.$shopxoI18n
 */
export function chat_t(key, values) {
	var k = String(key || '');
	if (k.indexOf('chat.') !== 0 && k.indexOf('pages.') !== 0 && k.indexOf('common.') !== 0) {
		k = 'chat.' + k;
	}
	var text = k;
	try {
		var i18n = (typeof uni !== 'undefined' && uni.$shopxoI18n) ? uni.$shopxoI18n : null;
		if (!i18n && typeof getApp === 'function') {
			var app = getApp();
			i18n = (app && (app.$i18n || (app.$vm && app.$vm.$i18n))) || null;
		}
		if (i18n && typeof i18n.t === 'function') {
			text = i18n.t(k, values || {});
			if (!text || text === k) {
				text = k;
			}
		}
	} catch (e) {}
	if (values && typeof values === 'object') {
		Object.keys(values).forEach(function (vk) {
			var val = values[vk];
			text = String(text).replace(new RegExp('\\{:' + vk + '\\}', 'g'), val);
			text = String(text).replace(new RegExp('\\{' + vk + '\\}', 'g'), val);
		});
	}
	return text;
}

export default { chat_t };
