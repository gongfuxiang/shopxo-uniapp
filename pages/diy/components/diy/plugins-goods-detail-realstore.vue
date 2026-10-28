<template>
    <view v-if="stores.length" class="oh" :style="outer_style">
        <view :style="outer_img">
            <view class="wrap" :style="wrap_style">
                <view v-if="show_header" class="header" :style="header_box_style">
                    <view v-if="show_header_row" class="header-row" :class="'align-' + header_align">
                        <view class="header-left">
                            <view v-if="show_title_bar && title_bar_type == 'line'" class="title-bar" :style="title_bar_style"></view>
                            <image v-else-if="show_title_bar && title_bar_img" class="title-bar-img" :style="title_bar_img_style" :src="title_bar_img" mode="heightFix"></image>
                            <iconfont v-else-if="show_title_bar && title_bar_icon" :name="title_bar_icon" :size="title_bar_icon_size" :color="title_bar_icon_color"></iconfont>
                            <text v-if="show('title') && title_text" class="title" :style="title_style">{{ title_text }}</text>
                        </view>
                        <view v-if="show_header_right" class="header-right" :class="{ pill: show_pill }" :style="header_right_style" :data-value="more_url" @tap.stop="open_url">
                            <text v-if="right_text">{{ right_text }}</text>
                            <iconfont name="icon-arrow-right" :size="arrow_size" :color="arrow_color"></iconfont>
                        </view>
                    </view>
                </view>
                <view v-if="show_list" class="list" :style="list_style">
                    <view v-for="(item, index) in stores" :key="index" class="card" :style="card_style" :data-value="item.url" @tap="open_url">
                        <view v-if="show_top" class="top">
                            <image v-if="show('logo') && item.logo" class="logo" :style="logo_style" :src="item.logo" mode="aspectFill"></image>
                            <view class="info">
                                <view v-if="show('name') || show_actions" class="name-row">
                                    <text v-if="show('name')" class="name" :style="name_style">{{ item.name }}</text>
                                    <view v-if="show_actions" class="actions">
                                        <view v-if="show('phone') && item.phone" class="action" :data-value="item.phone" @tap.stop="call_tel">
                                            <iconfont name="icon-tel" size="28rpx" :color="action_color"></iconfont>
                                        </view>
                                        <view v-if="show('nav') && item.can_nav" class="action" :data-index="index" @tap.stop="open_map">
                                            <iconfont name="icon-send-linear" size="28rpx" :color="action_color"></iconfont>
                                        </view>
                                    </view>
                                </view>
                                <view v-if="show('state') || show('hours')" class="status">
                                    <iconfont name="icon-time" size="24rpx" :color="icon_color"></iconfont>
                                    <text v-if="show('state') && item.state" class="state" :style="state_style">{{ item.state }}</text>
                                    <text v-if="show('hours') && item.hours" class="hours" :style="hours_style">{{ item.hours }}</text>
                                </view>
                            </view>
                        </view>
                        <view v-if="show_address_line" class="line"></view>
                        <view v-if="show('address')" class="addr">
                            <iconfont name="icon-location" size="24rpx" :color="icon_color"></iconfont>
                            <text class="addr-text" :style="address_style">{{ item.address }}</text>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import { common_styles_computer, common_img_computer, gradient_handle, background_computer, padding_computer, radius_computer } from '@/common/js/common/common.js';
    import { page_vm, media_url, icon_name } from './goods-detail-common.js';
    const fields = ['title', 'more', 'logo', 'name', 'phone', 'nav', 'state', 'hours', 'address'];
    export default {
        props: {
            propValue: { type: Object, default: () => ({}) },
            propGoods: { type: Object, default: null },
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
            header_align() {
                const align = String(this.content.header_align || 'left');
                return align === 'center' || align === 'right' ? align : 'left';
            },
            title_text() {
                if (this.content.title_text == null) return '相关门店';
                return String(this.content.title_text);
            },
            right_text() {
                if (this.content.right_text == null) return this.header_theme === '1' ? '查看全部' : '更多';
                return String(this.content.right_text);
            },
            show_title_bar() { return String(this.content.title_bar_show == null ? '1' : this.content.title_bar_show) !== '0'; },
            title_bar_type() { return this.content.title_bar_type === 'img-icon' ? 'img-icon' : 'line'; },
            title_bar_img() { return media_url(this.content.title_bar_img); },
            title_bar_icon() {
                const name = this.content.title_bar_icon;
                if (name == null || name === '') return '';
                return icon_name(name, '');
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
            show_pill() { return (this.header_theme === '0' || this.header_theme === '2') && this.show('more'); },
            show_header_right() { return this.header_theme === '1' ? true : this.show('more'); },
            header_right_style() {
                const size = px(this.style.more_size, 12);
                const line = Math.max(px(this.style.title_size, 15), size, 20) * 2;
                const color = this.style.more_color || 'rgba(153,153,153,1)';
                const base = 'color:' + color + ';font-size:' + (size * 2) + 'rpx;line-height:' + line + 'rpx;';
                if (!this.show_pill) return base;
                const bg = this.style.more_pill_bg ? 'background:' + this.style.more_pill_bg + ';' : '';
                const radius = this.style.more_radius ? radius_computer(this.style.more_radius) : '';
                const pad = this.style.more_padding ? padding_computer(this.style.more_padding) : '';
                return bg + base + radius + pad + 'box-sizing:border-box;';
            },
            arrow_size() { return (px(this.style.arrow_size, 12) * 2) + 'rpx'; },
            arrow_color() { return this.style.arrow_color || this.style.more_color || 'rgba(153,153,153,1)'; },
            show_header_left() { return this.show_title_bar || (this.show('title') && this.title_text !== ''); },
            show_header_row() { return this.show_header_left || this.show_header_right; },
            show_header() { return this.show_header_row; },
            show_actions() { return this.show('phone') || this.show('nav'); },
            show_top() { return this.show('logo') || this.show('name') || this.show_actions || this.show('state') || this.show('hours'); },
            show_address_line() { return this.show('address') && this.show_top; },
            show_list() { return this.show_top || this.show('address'); },
            stores() {
                const goods = this.propGoods || {};
                const page = page_vm();
                const block = page && page.plugins_realstore_data;
                const list = block && Array.isArray(block.data) ? block.data : [];
                return list.map((item) => {
                    const status = (item && item.status_info) || {};
                    const tel = item && item.service_data && item.service_data.service_tel;
                    const lat = Number(item && item.lat);
                    const lng = Number(item && item.lng);
                    const query = goods.id ? '&source_goods_id=' + goods.id : '';
                    return {
                        name: (item && item.name) || '',
                        logo: (item && item.logo) || '',
                        state: status.msg || '',
                        hours: status.time || '',
                        address: ((item && item.province_name) || '') + ((item && item.city_name) || '') + ((item && item.county_name) || '') + ((item && item.address) || ''),
                        phone: tel || '',
                        lat: lat,
                        lng: lng,
                        can_nav: Number.isFinite(lat) && Number.isFinite(lng) && lat !== 0 && lng !== 0,
                        url: ((item && item.url) || '') + query,
                    };
                });
            },
            more_url() {
                const goods = this.propGoods || {};
                return '/pages/plugins/realstore/search/search?goods_id=' + (goods.id || '');
            },
            outer_style() { return common_styles_computer(this.style.common_style || {}); },
            outer_img() { return common_img_computer(this.style.common_style || {}, this.propIndex); },
            wrap_style() { return 'gap:' + (px(this.style.header_gap, 10) * 2) + 'rpx;'; },
            header_box_style() {
                const colors = this.style.header_color_list || [];
                const has = Array.isArray(colors) && colors.some((item) => item && item.color);
                const bg = has ? gradient_handle(colors, this.style.header_direction || '90deg') : (this.style.header_bg ? 'background:' + this.style.header_bg + ';' : '');
                const imgs = this.style.header_background_img || [];
                const img = Array.isArray(imgs) && imgs.length ? background_computer({ background_img: imgs, background_img_style: this.style.header_background_img_style || '2' }) : '';
                const radius = this.style.header_radius ? radius_computer(this.style.header_radius) : '';
                const pad = this.style.header_padding && typeof this.style.header_padding === 'object' ? padding_computer(this.style.header_padding) : '';
                return bg + img + radius + pad + 'box-sizing:border-box;overflow:hidden;';
            },
            list_style() { return 'gap:' + (px(this.style.card_gap, 10) * 2) + 'rpx;'; },
            card_style() {
                const colors = this.style.card_color_list || [];
                const has = Array.isArray(colors) && colors.some((item) => item && item.color);
                const bg = has ? gradient_handle(colors, this.style.card_direction || '90deg') : '';
                const imgs = this.style.card_background_img || [];
                const img = Array.isArray(imgs) && imgs.length ? background_computer({ background_img: imgs, background_img_style: this.style.card_background_img_style || '2' }) : '';
                const pad = this.style.card_padding && typeof this.style.card_padding === 'object' ? padding_computer(this.style.card_padding) : 'padding:24rpx;box-sizing:border-box;';
                return bg + img + radius_computer(corner(this.style.card_radius, 10)) + 'overflow:hidden;' + pad;
            },
            logo_style() {
                const size = px(this.style.logo_size, 40) * 2;
                return 'width:' + size + 'rpx;height:' + size + 'rpx;border-radius:' + (px(this.style.logo_radius, 20) * 2) + 'rpx;';
            },
            name_style() {
                return 'color:' + (this.style.name_color || 'rgba(51,51,51,1)') + ';font-size:' + (px(this.style.name_size, 14) * 2) + 'rpx;font-weight:' + (this.style.name_typeface || 'bold') + ';';
            },
            state_style() { return 'color:' + (this.style.state_color || 'rgba(82,196,26,1)') + ';font-size:' + (px(this.style.info_size, 12) * 2) + 'rpx;'; },
            hours_style() { return 'color:' + (this.style.hours_color || 'rgba(153,153,153,1)') + ';font-size:' + (px(this.style.info_size, 12) * 2) + 'rpx;'; },
            address_style() { return 'color:' + (this.style.address_color || 'rgba(153,153,153,1)') + ';font-size:' + (px(this.style.info_size, 12) * 2) + 'rpx;'; },
            icon_color() { return this.style.icon_color || 'rgba(192,196,204,1)'; },
            action_color() { return this.style.action_color || 'rgba(232,93,76,1)'; },
        },
        methods: {
            show(key) { return this.field_show.indexOf(key) !== -1; },
            open_url(e) {
                if (!e.currentTarget.dataset.value) return;
                app.globalData.url_event(e);
            },
            call_tel(e) { app.globalData.call_tel(e); },
            open_map(e) {
                const index = Number(e.currentTarget.dataset.index);
                const item = this.stores[index];
                if (!item || !item.can_nav) {
                    app.globalData.showToast('地址有误');
                    return;
                }
                app.globalData.open_location(item.lng, item.lat, item.name, item.address);
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
        const filtered = list.map(String).filter((key) => allow.indexOf(key) !== -1);
        return list.length > 0 && filtered.length === 0 ? allow.slice() : filtered;
    }
    function corner(value, fallback) {
        if (value && typeof value === 'object' && value.radius_top_left != null) return value;
        const n = Number(value);
        const r = Number.isFinite(n) ? n : fallback;
        return { radius: r, radius_top_left: r, radius_top_right: r, radius_bottom_right: r, radius_bottom_left: r };
    }
</script>
<style lang="scss" scoped>
.wrap, .header, .list { width: 100%; box-sizing: border-box; display: flex; flex-direction: column; }
.header-row, .header-left, .header-right, .top, .name-row, .actions, .status, .addr { display: flex; flex-direction: row; align-items: center; }
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
.title, .name, .hours, .addr-text { min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.card { box-sizing: border-box; display: flex; flex-direction: column; gap: 16rpx; }
.top { gap: 20rpx; }
.logo { display: block; overflow: hidden; flex-shrink: 0; }
.info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 8rpx; }
.name-row { gap: 16rpx; }
.name { flex: 1; line-height: 1.3; }
.actions { gap: 16rpx; flex-shrink: 0; }
.action { width: 52rpx; height: 52rpx; border-radius: 12rpx; background: rgba(255,241,240,1); display: flex; align-items: center; justify-content: center; }
.status, .addr { gap: 8rpx; }
.hours { flex: 1; }
.line { border-top: 1px dashed rgba(230,230,230,1); }
</style>
