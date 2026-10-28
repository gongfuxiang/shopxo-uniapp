<template>
    <view v-if="show_bar" class="oh" :style="style_container">
        <view :style="style_img_container">
            <view class="distribution flex-row align-c jc-sb" :class="'theme-' + theme" :style="card_style">
                <view v-if="theme == '2'" class="accent-bar" :style="accent_bar_style"></view>
                <view class="left flex-row align-c oh flex-1 flex-width" :data-value="view.panel_url" @tap="url_event">
                    <image v-if="is_show('icon') && view.icon" class="level" :src="view.icon" mode="aspectFit" :style="icon_style"></image>
                    <view class="copy text-line-1 flex-1 flex-width">
                        <text :style="text_style">{{ view.text }}</text>
                        <text v-if="view.amount" class="amount" :style="amount_style">{{ view.amount }}</text>
                    </view>
                </view>
                <view v-if="is_show('action') && view.action_text" class="action nowrap" :style="action_style" :data-value="view.panel_url" @tap.stop="action_event">
                    <text>{{ view.action_text }}</text>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import { common_styles_computer, common_img_computer, gradient_handle, background_computer, padding_computer, radius_computer, border_computer } from '@/common/js/common/common.js';
    import { on_goods_detail_page } from './goods-detail-common.js';
    const field_allow = ['icon', 'action'];
    export default {
        props: {
            propValue: {
                type: Object,
                default: () => ({}),
            },
            propKey: {
                type: [String, Number],
                default: '',
            },
            propIndex: {
                type: Number,
                default: 0,
            },
            propDistributionTips: {
                type: Object,
                default: null,
            },
        },
        data() {
            return {
                theme: '0',
                field_show: field_allow.slice(),
                view: {
                    is_show: 0,
                    text: '',
                    amount: '',
                    action_text: '',
                    icon: '',
                    panel_url: '/pages/plugins/distribution/user/user',
                    goods_id: 0,
                },
                show_bar: false,
                style_container: '',
                style_img_container: '',
                card_style: '',
                icon_style: '',
                text_style: '',
                amount_style: '',
                action_style: '',
                accent_bar_style: '',
            };
        },
        watch: {
            propKey() {
                this.init();
            },
            propValue() {
                this.init();
            },
            propDistributionTips() {
                this.init();
            },
        },
        created() {
            this.init();
        },
        methods: {
            is_show(key) {
                return this.field_show.indexOf(key) !== -1;
            },
            init() {
                const content = this.propValue.content || null;
                const style = this.propValue.style || null;
                if (content == null || style == null) {
                    return;
                }
                const theme = ['0', '1', '2'].indexOf(String(content.theme == null ? '0' : content.theme)) === -1 ? '0' : String(content.theme);
                const field_show = this.normalize_field_show(content.field_show);
                const color_list = style.content_color_list || [];
                const has_bg = Array.isArray(color_list) && color_list.some((item) => item && item.color);
                const bg = has_bg ? gradient_handle(color_list, style.content_direction || '90deg') : '';
                const bg_img = background_computer({
                    background_img: style.content_background_img || [],
                    background_img_style: style.content_background_img_style || '2',
                });
                const action_color = style.action_color || '#fff';
                const action_bg = typeof style.action_bg == 'string' ? style.action_bg : '';
                const action_border = border_computer({
                    border_is_show: style.action_border_is_show || '0',
                    border_color: style.action_border_color || action_color,
                    border_style: style.action_border_style || 'solid',
                    border_size: style.action_border_size,
                });
                const card_border = style.card_border ? 'border:1px solid ' + style.card_border + ';box-sizing:border-box;' : '';
                const icon_size = Number(style.icon_size) || 28;
                this.setData({
                    theme: theme,
                    field_show: field_show,
                    style_container: common_styles_computer(style.common_style || {}),
                    style_img_container: common_img_computer(style.common_style || {}, this.propIndex),
                    card_style: bg + bg_img + radius_computer(style.content_radius) + 'overflow:hidden;' + padding_computer(style.content_padding) + card_border + (theme == '2' ? 'position:relative;' : ''),
                    icon_style: 'width:' + icon_size * 2 + 'rpx;height:' + icon_size * 2 + 'rpx;',
                    text_style: 'color:' + (style.text_color || 'rgba(166,58,58,1)') + ';font-size:' + (Number(style.text_size) || 13) * 2 + 'rpx;',
                    amount_style: 'color:' + (style.amount_color || 'rgba(230,48,48,1)') + ';font-size:' + (Number(style.amount_size) || 15) * 2 + 'rpx;font-weight:bold;',
                    action_style: 'color:' + action_color + ';font-size:' + (Number(style.action_size) || 13) * 2 + 'rpx;box-sizing:border-box;' + radius_computer(style.action_radius) + padding_computer(style.action_padding) + (action_bg ? 'background:' + action_bg + ';' : '') + action_border,
                    accent_bar_style: 'background:' + (style.accent_bar_color || 'rgba(242,72,84,1)') + ';',
                });
                const saved = content.view_data;
                if (on_goods_detail_page()) {
                    const from_page = distribution_tips_from_detail(this.propDistributionTips);
                    if (from_page) {
                        this.apply_view(from_page);
                    } else if (saved && typeof saved == 'object' && saved.is_show != null) {
                        this.apply_view(saved);
                    } else {
                        this.apply_view({ is_show: 0 });
                    }
                    return;
                }
                const page_goods_id = this.page_goods_id();
                if (saved && typeof saved == 'object' && saved.is_show != null) {
                    const saved_goods = String(saved.goods_id || '');
                    if (String(saved.is_show) == '1' || !page_goods_id || saved_goods == String(page_goods_id)) {
                        this.apply_view(saved);
                        return;
                    }
                }
                this.get_view();
            },
            normalize_field_show(field_show) {
                if (!Array.isArray(field_show)) {
                    return field_allow.slice();
                }
                const filtered = field_show.map(String).filter((key) => field_allow.indexOf(key) !== -1);
                return field_show.length > 0 && filtered.length === 0 ? field_allow.slice() : filtered;
            },
            apply_view(view) {
                const show = String(view.is_show) == '1' && !!(view.text || view.amount || view.action_text);
                this.setData({
                    view: Object.assign({}, this.view, view),
                    show_bar: show,
                });
            },
            page_goods_id() {
                const pages = getCurrentPages();
                const cur = pages && pages.length ? pages[pages.length - 1] : null;
                if (!cur) {
                    return '';
                }
                const route = cur.route || '';
                const opt = cur.options || {};
                if (route.indexOf('goods-detail') !== -1) {
                    return opt.goods_id || opt.id || '';
                }
                return opt.goods_id || '';
            },
            get_view() {
                const data = {};
                const goods_id = this.page_goods_id();
                if (goods_id) {
                    data.goods_id = goods_id;
                }
                uni.request({
                    url: app.globalData.get_request_url('goodstipsdata', 'diyapi', 'distribution'),
                    method: 'POST',
                    data: data,
                    dataType: 'json',
                    success: (res) => {
                        const body = res.data || {};
                        if (body.code == 0 && body.data) {
                            this.apply_view(body.data);
                        }
                    },
                });
            },
            action_event(e) {
                const pages = getCurrentPages();
                const cur = pages && pages.length ? pages[pages.length - 1] : null;
                const vm = cur && (cur.$vm || cur);
                if (vm && typeof vm.popup_share_event === 'function') {
                    vm.popup_share_event(e);
                    return;
                }
                app.globalData.url_event(e);
            },
            url_event(e) {
                app.globalData.url_event(e);
            },
        },
    };
    function distribution_tips_from_detail(data) {
        if (!data || typeof data !== 'object') {
            return null;
        }
        const symbol = data.currency_symbol || '';
        const price = data.profit_price_text || '';
        const amount = data.amount || ((symbol || price) ? (symbol + ' ' + price).trim() : '');
        return {
            is_show: 1,
            text: data.tips_text || data.text || '',
            amount: amount,
            action_text: data.btn_text || data.action_text || '',
            icon: data.level_icon || data.icon || '',
            panel_url: data.panel_url || '/pages/plugins/distribution/user/user',
            goods_id: data.goods_id || 0,
            is_goods_detail_poster: data.is_goods_detail_poster || 0,
        };
    }
</script>
<style lang="scss" scoped>
.distribution {
    width: 100%;
    box-sizing: border-box;
    min-height: 88rpx;
    gap: 16rpx;
}
.left,
.copy {
    min-width: 0;
}
.copy {
    line-height: 1.4;
}
.amount {
    margin-left: 8rpx;
}
.level {
    display: block;
    flex-shrink: 0;
    margin-right: 16rpx;
}
.action {
    line-height: 1.2;
    flex-shrink: 0;
}
.theme-2 {
    padding-left: 32rpx !important;
}
.accent-bar {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 6rpx;
}
.nowrap {
    white-space: nowrap;
}
</style>
