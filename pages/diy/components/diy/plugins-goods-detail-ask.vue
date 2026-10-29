<template>
    <view class="oh" :style="outer_style">
        <view :style="outer_img">
            <view class="wrap" :style="wrap_style">
                <view v-if="show_header" class="header" :style="header_box_style">
                    <view v-if="show_header_row" class="header-row" :class="'align-' + header_align">
                        <view class="header-left">
                            <view v-if="show_title_bar && title_bar_type == 'line'" class="title-bar" :style="title_bar_style"></view>
                            <image v-else-if="show_title_bar && title_bar_img" class="title-bar-img" :style="title_bar_img_style" :src="title_bar_img" mode="heightFix"></image>
                            <iconfont v-else-if="show_title_bar && title_bar_icon" :name="title_bar_icon" :size="title_bar_icon_size" :color="title_bar_icon_color"></iconfont>
                            <text v-if="show('title') && title_text" class="title" :style="title_style">{{ title_text }}</text>
                            <text v-if="show('count')" class="count" :style="count_style">({{ count }})</text>
                        </view>
                        <view v-if="show_header_right" class="header-right" :class="{ pill: show_pill }" :style="header_right_style" :data-value="list_url" @tap.stop="open_url">
                            <text v-if="right_text">{{ right_text }}</text>
                            <iconfont name="icon-arrow-right" :size="arrow_size" :color="arrow_color"></iconfont>
                        </view>
                    </view>
                </view>
                <view class="body" :style="body_style">
                    <scroll-view v-if="list_theme == '2' && questions.length" class="list-scroll" scroll-x>
                        <view class="slide-row" :style="list_style">
                            <view v-for="(item, index) in questions" :key="index" class="qa-item" :style="slide_item_style" :data-value="item.url" @tap="open_url">
                                <view class="line-2" :style="question_style"><text class="qa-tag" :style="q_tag_style">问</text>{{ item.question }}</view>
                                <view v-if="item.answer" class="line-2" :style="answer_style"><text class="qa-tag" :style="a_tag_style">答</text>{{ item.answer }}</view>
                            </view>
                        </view>
                    </scroll-view>
                    <view v-else-if="questions.length" class="list" :style="list_style">
                        <view v-for="(item, index) in questions" :key="index" class="qa-item" :class="{ 'item-line': use_line }" :style="use_line ? item_line_style : item_style" :data-value="item.url" @tap="open_url">
                            <view class="line-2" :style="question_style"><text class="qa-tag" :style="q_tag_style">问</text>{{ item.question }}</view>
                            <view v-if="item.answer" class="line-2" :style="answer_style"><text class="qa-tag" :style="a_tag_style">答</text>{{ item.answer }}</view>
                        </view>
                    </view>
                    <view v-else class="empty" :style="empty_style">{{ $t('common.no_data') }}</view>
                    <view v-if="show_ask" class="footer" :style="action_style" :data-value="form_url" @tap="open_url">
                        <text>{{ ask_text }}</text>
                        <image v-if="ask_img" class="ask-img" :style="ask_img_style" :src="ask_img" mode="aspectFit"></image>
                        <iconfont v-else-if="ask_icon" :name="ask_icon" :size="ask_arrow_size" :color="ask_arrow_color"></iconfont>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import { common_styles_computer, common_img_computer, gradient_handle, background_computer, padding_computer, radius_computer, margin_computer } from '@/common/js/common/common.js';
    import { page_vm, media_url, icon_name } from './goods-detail-common.js';
    const fields = ['title', 'count', 'more'];
    export default {
        props: {
            propValue: { type: Object, default: () => ({}) },
            propGoods: { type: Object, default: null },
            propAskData: { type: Object, default: null },
            propKey: { type: [String, Number], default: '' },
            propIndex: { type: Number, default: 0 },
        },
        computed: {
            content() { return (this.propValue && this.propValue.content) || {}; },
            style() { return (this.propValue && this.propValue.style) || {}; },
            field_show() { return field_list(this.content.field_show, fields); },
            header_theme() {
                const theme = String(this.content.header_theme == null ? '0' : this.content.header_theme);
                return theme === '1' || theme === '2' ? theme : '0';
            },
            list_theme() {
                const theme = String(this.content.list_theme == null ? '0' : this.content.list_theme);
                return theme === '1' || theme === '2' ? theme : '0';
            },
            use_line() { return this.list_theme === '0'; },
            header_align() {
                const align = String(this.content.header_align || 'left');
                return align === 'center' || align === 'right' ? align : 'left';
            },
            title_text() {
                if (this.content.title_text == null) return '商品问答';
                return String(this.content.title_text);
            },
            right_text() {
                if (this.content.right_text == null) return this.header_theme === '1' ? '查看全部' : '去提问';
                return String(this.content.right_text);
            },
            ask_text() {
                if (this.content.ask_text == null) return '我要提问';
                return String(this.content.ask_text);
            },
            show_ask() { return String(this.content.ask_show) !== '0' && this.ask_text !== ''; },
            ask_img() { return media_url(this.content.ask_img); },
            ask_icon() {
                const name = this.content.ask_icon == null ? 'arrow-right' : String(this.content.ask_icon);
                return icon_name(name, '');
            },
            show_title_bar() { return String(this.content.title_bar_show == null ? '1' : this.content.title_bar_show) !== '0'; },
            title_bar_type() { return this.content.title_bar_type === 'img-icon' ? 'img-icon' : 'line'; },
            title_bar_img() { return media_url(this.content.title_bar_img); },
            title_bar_icon() {
                const name = this.content.title_bar_icon;
                if (name == null || name === '') return '';
                return icon_name(name, '');
            },
            show_pill() { return (this.header_theme === '0' || this.header_theme === '2') && this.show('more'); },
            show_header_right() { return this.header_theme === '1' ? true : this.show('more'); },
            show_header_left() { return this.show_title_bar || (this.show('title') && this.title_text !== '') || this.show('count'); },
            show_header_row() { return this.show_header_left || this.show_header_right; },
            show_header() { return this.show_header_row; },
            ask_data() {
                if (this.propAskData) {
                    return this.propAskData;
                }
                const page = page_vm();
                return (page && page.plugins_ask_data) || null;
            },
            empty_style() {
                return 'color:' + (this.style.answer_color || '#999') + ';font-size:' + (px(this.style.answer_size, 12) * 2) + 'rpx;';
            },
            count() {
                const total = this.ask_data && this.ask_data.ask_total;
                return total == null ? 0 : total;
            },
            questions() {
                const goods = this.propGoods;
                const raw = this.ask_data && Array.isArray(this.ask_data.ask_data) ? this.ask_data.ask_data : [];
                return raw.map((item) => ({
                    question: plain(item && (item.title || item.content)),
                    answer: ask_answer(item),
                    url: (item && item.url) || '',
                })).filter((item) => item.question);
            },
            goods_id() {
                const goods = this.propGoods || {};
                return goods.id || '';
            },
            list_url() { return '/pages/plugins/ask/goods-list/goods-list?goods_id=' + this.goods_id; },
            form_url() { return '/pages/plugins/ask/form/form?goods_id=' + this.goods_id; },
            outer_style() { return common_styles_computer(this.style.common_style || {}); },
            outer_img() { return common_img_computer(this.style.common_style || {}, this.propIndex); },
            wrap_style() {
                const gap = Number(this.style.header_gap);
                return 'gap:' + ((Number.isFinite(gap) ? gap : 8) * 2) + 'rpx;';
            },
            header_box_style() {
                const colors = this.style.header_color_list || [];
                const has = Array.isArray(colors) && colors.some((item) => item && item.color);
                const bg = has ? gradient_handle(colors, this.style.header_direction || '90deg') : (this.style.header_bg ? 'background:' + this.style.header_bg + ';' : '');
                const imgs = this.style.header_background_img || [];
                const img = Array.isArray(imgs) && imgs.length ? background_computer({ background_img: imgs, background_img_style: this.style.header_background_img_style || '2' }) : '';
                const radius = radius_computer(this.style.header_radius || {});
                const pad = this.style.header_padding && typeof this.style.header_padding === 'object'
                    ? padding_computer(this.style.header_padding)
                    : 'padding:0;box-sizing:border-box;';
                return bg + img + radius + pad + 'overflow:hidden;';
            },
            body_style() {
                const colors = this.style.content_color_list || [];
                const has = Array.isArray(colors) && colors.some((item) => item && item.color);
                const bg = has ? gradient_handle(colors, this.style.content_direction || '90deg') : '';
                const imgs = this.style.content_background_img || [];
                const img = Array.isArray(imgs) && imgs.length ? background_computer({ background_img: imgs, background_img_style: this.style.content_background_img_style || '2' }) : '';
                const margin = this.style.content_margin && typeof this.style.content_margin === 'object' ? margin_computer(this.style.content_margin) : '';
                const pad = this.style.content_padding && typeof this.style.content_padding === 'object' ? padding_computer(this.style.content_padding) : 'padding:0;box-sizing:border-box;';
                return bg + img + margin + pad + radius_computer(this.style.content_radius || {}) + 'overflow:hidden;gap:24rpx;';
            },
            title_bar_icon_size() { return (px(this.style.title_bar_size, 14) * 2) + 'rpx'; },
            title_bar_icon_color() { return this.style.title_bar_icon_color || this.style.title_bar_color || 'rgba(255,105,120,1)'; },
            title_bar_img_style() { return 'height:' + (px(this.style.title_bar_size, 14) * 2) + 'rpx;width:auto;max-width:100%;'; },
            title_bar_style() {
                const bar = px(this.style.title_bar_size, 14);
                const title = px(this.style.title_size, 15);
                const h = Math.max(bar, Math.round(title * 0.9), 14) * 2;
                const c1 = this.style.title_bar_color || 'rgba(255,105,120,1)';
                const c2 = this.style.title_bar_color_end || c1;
                return 'width:6rpx;height:' + h + 'rpx;border-radius:4rpx;background:linear-gradient(180deg,' + c1 + ',' + c2 + ');';
            },
            title_style() {
                const size = px(this.style.title_size, 15);
                const line = Math.max(size, px(this.style.more_size, 12), 20) * 2;
                return 'color:' + (this.style.title_color || '#333') + ';font-size:' + (size * 2) + 'rpx;font-weight:' + (this.style.title_weight || 'bold') + ';line-height:' + line + 'rpx;';
            },
            count_style() {
                const line = Math.max(px(this.style.title_size, 15), px(this.style.more_size, 12), 20) * 2;
                return 'color:' + (this.style.count_color || '#999') + ';font-size:' + (px(this.style.count_size, 12) * 2) + 'rpx;line-height:' + line + 'rpx;';
            },
            header_right_style() {
                const size = px(this.style.more_size, 12);
                const line = Math.max(px(this.style.title_size, 15), size, 20) * 2;
                const color = this.style.more_color || 'rgba(153,153,153,1)';
                const base = 'color:' + color + ';font-size:' + (size * 2) + 'rpx;line-height:' + line + 'rpx;';
                if (!this.show_pill) return base;
                const bg = this.style.more_pill_bg ? 'background:' + this.style.more_pill_bg + ';' : '';
                return bg + base + radius_computer(this.style.more_radius || {}) + padding_computer(this.style.more_padding || {}) + 'box-sizing:border-box;';
            },
            arrow_size() { return (px(this.style.arrow_size, 12) * 2) + 'rpx'; },
            arrow_color() { return this.style.arrow_color || this.style.more_color || 'rgba(153,153,153,1)'; },
            action_style() {
                const width = this.style.ask_width === 'auto' ? 'width:fit-content;max-width:100%;align-self:center;' : 'width:100%;';
                const bg = this.style.ask_bg ? 'background:' + this.style.ask_bg + ';' : '';
                const color = this.style.action_color || 'rgba(153,153,153,1)';
                const size = (px(this.style.action_size, 13) * 2) + 'rpx';
                const radius = radius_computer(this.style.ask_radius || {});
                const pad = this.style.ask_padding && typeof this.style.ask_padding === 'object' ? padding_computer(this.style.ask_padding) : 'padding:0;box-sizing:border-box;';
                return bg + width + 'color:' + color + ';font-size:' + size + ';' + radius + pad;
            },
            ask_arrow_size() { return (px(this.style.ask_arrow_size, 12) * 2) + 'rpx'; },
            ask_arrow_color() { return this.style.ask_arrow_color || this.style.action_color || 'rgba(153,153,153,1)'; },
            ask_img_style() {
                const s = px(this.style.ask_arrow_size, 12) * 2;
                return 'width:' + s + 'rpx;height:' + s + 'rpx;';
            },
            question_style() { return 'color:' + (this.style.question_color || '#333') + ';font-size:' + (px(this.style.question_size, 13) * 2) + 'rpx;'; },
            answer_style() { return 'color:' + (this.style.answer_color || '#999') + ';font-size:' + (px(this.style.answer_size, 12) * 2) + 'rpx;'; },
            q_tag_style() { return 'color:' + (this.style.question_tag_color || '#ff6978') + ';'; },
            a_tag_style() { return 'color:' + (this.style.answer_tag_color || '#5b8ff9') + ';'; },
            item_gap() {
                const gap = Number(this.style.item_gap);
                const fallback = this.list_theme === '2' ? 12 : 10;
                return (Number.isFinite(gap) && gap > 0 ? gap : fallback) * 2;
            },
            list_style() {
                if (this.list_theme === '0') return '';
                return 'gap:' + this.item_gap + 'rpx;';
            },
            item_pad_css() {
                const pad = this.style.item_padding;
                if (pad && typeof pad === 'object') return padding_computer(pad);
                if (typeof pad === 'number') return 'padding:' + (pad * 2) + 'rpx;box-sizing:border-box;';
                return 'padding:24rpx;box-sizing:border-box;';
            },
            item_style() {
                if (this.list_theme !== '1') return '';
                const bg = this.style.item_bg || 'rgba(255,255,255,1)';
                return 'background:' + bg + ';' + radius_computer(this.style.item_radius || {}) + this.item_pad_css;
            },
            slide_item_style() {
                if (this.list_theme !== '2') return '';
                const bg = this.style.item_bg || 'rgba(255,255,255,1)';
                const w = (Number(this.style.slide_width) > 0 ? Number(this.style.slide_width) : 260) * 2;
                return 'background:' + bg + ';' + radius_computer(this.style.item_radius || {}) + this.item_pad_css + 'width:' + w + 'rpx;';
            },
            divider_color() {
                const color = this.style.divider_color;
                if (color == null || color === '' || color === 'rgba(240, 240, 240, 1)' || color === 'rgba(238, 238, 238, 1)' || color === '#f0f0f0' || color === '#eee') {
                    return 'rgba(247, 247, 247, 1)';
                }
                return color;
            },
            item_line_style() {
                return this.item_pad_css + 'border-bottom:1px solid ' + this.divider_color + ';';
            },
        },
        methods: {
            show(key) { return this.field_show.indexOf(key) !== -1; },
            open_url(e) {
                if (!e.currentTarget.dataset.value) return;
                app.globalData.url_event(e);
            },
        },
    };
    function px(value, fallback) {
        if (value == null || value === '') return fallback;
        const n = Number(value);
        return Number.isFinite(n) ? n : fallback;
    }
    function field_list(list, allow) {
        if (!Array.isArray(list)) return allow.slice();
        const raw = list.map(String).filter((key) => key !== 'empty');
        const filtered = raw.filter((key) => allow.indexOf(key) !== -1);
        return raw.length > 0 && filtered.length === 0 ? allow.slice() : filtered;
    }
    function plain(value) {
        return String(value || '').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
    }
    function ask_answer(item) {
        if (!item) return '';
        if (item.reply) return plain(item.reply);
        const list = item.comments_list;
        if (Array.isArray(list) && list[0]) return plain(list[0].content || list[0].title || '');
        return '';
    }
</script>
<style lang="scss" scoped>
.wrap, .header, .body, .list { width: 100%; box-sizing: border-box; display: flex; flex-direction: column; }
.header-row, .header-left, .header-right, .footer { display: flex; flex-direction: row; align-items: center; }
.header-row { width: 100%; min-height: 40rpx; justify-content: flex-start; }
.header-row.align-left { justify-content: space-between; }
.header-row.align-right .header-left { flex: 1; justify-content: flex-end; }
.header-row.align-center { display: grid; grid-template-columns: 1fr auto 1fr; }
.header-row.align-center .header-left { grid-column: 2; justify-content: center; }
.header-row.align-center .header-right { grid-column: 3; justify-self: end; }
.header-left { min-width: 0; max-width: 100%; gap: 12rpx; }
.header-right { flex-shrink: 0; gap: 4rpx; white-space: nowrap; }
.title-bar { flex-shrink: 0; align-self: center; }
.title-bar-img { flex: 0 1 auto; min-width: 0; max-width: 100%; }
.title, .count { flex-shrink: 0; }
.qa-item { width: 100%; box-sizing: border-box; display: flex; flex-direction: column; gap: 12rpx; }
.item-line:last-child { border-bottom: none !important; }
.qa-tag { margin-right: 12rpx; font-weight: bold; }
.line-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.5; }
.list-scroll { width: 100%; white-space: nowrap; }
.slide-row { display: inline-flex; flex-direction: row; flex-wrap: nowrap; }
.slide-row .qa-item { width: auto; flex-shrink: 0; }
.footer { justify-content: center; gap: 4rpx; }
.empty { text-align: center; padding: 24rpx 0; }
.ask-img { display: block; flex-shrink: 0; }
</style>
