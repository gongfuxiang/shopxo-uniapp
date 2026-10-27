<template>
    <view v-if="show_bar" class="oh" :style="style_container">
        <view :style="style_img_container">
            <view class="paid-member flex-row align-c jc-sb" :class="'theme' + theme" :style="card_style" :data-value="view.panel_url" @tap="url_event">
                <view v-if="theme == '2'" class="accent-bar" :style="accent_bar_style"></view>
                <view class="left flex-row align-c oh flex-1 flex-width">
                    <view v-if="is_show('badge') && show_badge" class="badge flex-row align-c jc-c" :class="{ 'badge-plain': badge_shape != 'badge' || !badge_has_bg, 'badge-nobg': !badge_has_bg }" :style="badge_style">
                        <image v-if="badge_is_img" class="badge-media" :src="badge_img" mode="aspectFit" :style="badge_img_style"></image>
                        <iconfont v-else-if="badge_type == 'icon' && badge_icon" :name="'icon-' + badge_icon" :size="badge_icon_size * 2 + 'rpx'" :color="badge_color" propContainerDisplay="flex"></iconfont>
                        <text v-else>{{ badge_text }}</text>
                    </view>
                    <view v-if="is_show('text') || is_show('amount')" class="text-line-1 flex-1 flex-width" :style="text_style">
                        <text v-if="is_show('text')">{{ view.prefix }}</text>
                        <text v-if="is_show('amount') && view.amount"> {{ view.amount }} </text>
                        <text v-if="is_show('text') && view.unit">{{ view.unit }}</text>
                    </view>
                </view>
                <view v-if="is_show('action') && view.action_text" class="action flex-row align-c nowrap" :style="action_style" :data-value="action_url" @tap.stop="url_event">
                    <text>{{ view.action_text }}</text>
                    <iconfont v-if="theme == '0'" name="icon-arrow-right" :size="action_icon_size * 2 + 'rpx'" :color="action_color" propContainerDisplay="flex"></iconfont>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import { isEmpty, common_styles_computer, common_img_computer, gradient_handle, background_computer, padding_computer, radius_computer, border_computer } from '@/common/js/common/common.js';
    import { on_goods_detail_page } from './goods-detail-common.js';
    const field_allow = ['badge', 'text', 'amount', 'action'];
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
            propVipTips: {
                type: Object,
                default: null,
            },
        },
        data() {
            return {
                theme: '0',
                field_show: field_allow.slice(),
                view: {
                    is_show: 1,
                    prefix: '',
                    amount: '',
                    unit: '',
                    action_text: '',
                    is_login: 0,
                    buy_url: '/pages/plugins/vip/buy/buy',
                    login_url: '/pages/login/login',
                    panel_url: '/pages/plugins/vip/index/index',
                },
                show_bar: false,
                badge_type: 'text',
                badge_text: 'SVIP',
                badge_icon: '',
                badge_img: '',
                badge_shape: 'badge',
                badge_has_bg: true,
                badge_style: '',
                badge_img_style: '',
                badge_color: 'rgba(232, 211, 176, 1)',
                badge_icon_size: 14,
                style_container: '',
                style_img_container: '',
                card_style: '',
                text_style: '',
                action_style: '',
                action_color: 'rgba(196, 122, 58, 1)',
                action_icon_size: 11,
                accent_bar_style: '',
            };
        },
        computed: {
            badge_is_img() {
                return this.badge_type == 'icon' && !isEmpty(this.badge_img);
            },
            show_badge() {
                if (this.badge_is_img) {
                    return true;
                }
                if (this.badge_type == 'icon') {
                    return !isEmpty(this.badge_icon);
                }
                return this.badge_text !== '';
            },
            action_url() {
                return String(this.view.is_login) == '1' ? this.view.buy_url : this.view.login_url;
            },
        },
        watch: {
            propKey() {
                this.init();
            },
            propValue() {
                this.init();
            },
            propVipTips() {
                this.init();
            },
        },
        created() {
            this.init();
        },
        methods: {
            isEmpty,
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
                const badge_type = String(content.badge_type) == 'icon' ? 'icon' : 'text';
                const badge_img = Array.isArray(content.badge_img) && content.badge_img.length > 0 ? content.badge_img[0].url || '' : '';
                const color_list = style.content_color_list || [];
                const has_bg = Array.isArray(color_list) && color_list.some((item) => item && item.color);
                const bg = has_bg ? gradient_handle(color_list, style.content_direction || '90deg') : '';
                const bg_img = background_computer({
                    background_img: style.content_background_img || [],
                    background_img_style: style.content_background_img_style || '2',
                });
                const badge_bg = typeof style.badge_bg == 'string' ? style.badge_bg : '';
                const badge_size = style.badge_size || 10;
                const badge_icon_size = Number(style.badge_icon_size) || 14;
                const action_color = style.action_color || 'rgba(196,122,58,1)';
                const action_bg = typeof style.action_bg == 'string' ? style.action_bg : '';
                const action_border = border_computer({
                    border_is_show: style.action_border_is_show || '0',
                    border_color: style.action_border_color || action_color,
                    border_style: style.action_border_style || 'solid',
                    border_size: style.action_border_size,
                });
                const card_border = style.card_border ? 'border:1px solid ' + style.card_border + ';box-sizing:border-box;' : '';
                this.setData({
                    theme: theme,
                    field_show: field_show,
                    badge_type: badge_type,
                    badge_text: content.badge_text == null ? 'SVIP' : String(content.badge_text),
                    badge_icon: content.badge_icon == null ? '' : String(content.badge_icon),
                    badge_img: badge_img,
                    badge_shape: style.badge_shape == 'plain' ? 'plain' : 'badge',
                    badge_has_bg: badge_bg !== '',
                    badge_color: style.badge_color || 'rgba(232,211,176,1)',
                    badge_icon_size: badge_icon_size,
                    badge_img_style: 'width:' + badge_icon_size * 2 + 'rpx;height:' + badge_icon_size * 2 + 'rpx;',
                    badge_style: (badge_type == 'icon' ? '' : 'color:' + (style.badge_color || 'rgba(232,211,176,1)') + ';font-size:' + badge_size * 2 + 'rpx;') + (badge_bg ? 'background:' + badge_bg + ';--badge-bg:' + badge_bg + ';' : '') + padding_computer(style.badge_padding) + radius_computer(style.badge_radius),
                    style_container: common_styles_computer(style.common_style || {}),
                    style_img_container: common_img_computer(style.common_style || {}, this.propIndex),
                    card_style: bg + bg_img + radius_computer(style.content_radius) + 'overflow:hidden;' + padding_computer(style.content_padding) + card_border + (theme == '2' ? 'position:relative;' : ''),
                    text_style: 'color:' + (style.text_color || '#333') + ';font-size:' + (Number(style.text_size) || 12) * 2 + 'rpx;',
                    action_color: action_color,
                    action_icon_size: Number(style.action_icon_size) || 11,
                    action_style: 'color:' + action_color + ';font-size:' + (Number(style.action_size) || 12) * 2 + 'rpx;box-sizing:border-box;' + radius_computer(style.action_radius) + padding_computer(style.action_padding) + (action_bg ? 'background:' + action_bg + ';' : '') + action_border,
                    accent_bar_style: 'background:' + (style.accent_bar_color || 'rgba(196,122,58,1)') + ';',
                });
                const saved = content.view_data;
                if (on_goods_detail_page()) {
                    const from_page = vip_tips_from_detail(this.propVipTips);
                    if (from_page) {
                        this.apply_view(from_page, field_show);
                    } else if (saved && typeof saved == 'object' && saved.is_show != null) {
                        this.apply_view(saved, field_show);
                    } else {
                        this.apply_view({ is_show: 0 }, field_show);
                    }
                    return;
                }
                if (saved && typeof saved == 'object' && saved.is_show != null) {
                    this.apply_view(saved, field_show);
                    return;
                }
                this.get_view(field_show);
            },
            normalize_field_show(field_show) {
                if (!Array.isArray(field_show)) {
                    return field_allow.slice();
                }
                const filtered = field_show.map(String).filter((key) => field_allow.indexOf(key) !== -1);
                return field_show.length > 0 && filtered.length === 0 ? field_allow.slice() : filtered;
            },
            apply_view(view, field_show) {
                const show = String(view.is_show) == '1' && (field_show.indexOf('badge') !== -1 || field_show.indexOf('text') !== -1 || field_show.indexOf('amount') !== -1 || field_show.indexOf('action') !== -1);
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
            get_view(field_show) {
                const data = {};
                const goods_id = this.page_goods_id();
                if (goods_id) {
                    data.goods_id = goods_id;
                }
                uni.request({
                    url: app.globalData.get_request_url('goodstipsdata', 'diyapi', 'vip'),
                    method: 'POST',
                    data: data,
                    dataType: 'json',
                    success: (res) => {
                        const body = res.data || {};
                        if (body.code == 0 && body.data) {
                            this.apply_view(body.data, field_show);
                        }
                    },
                });
            },
            url_event(e) {
                app.globalData.url_event(e);
            },
        },
    };
    function vip_tips_from_detail(data) {
        if (!data || typeof data !== 'object') {
            return null;
        }
        return {
            is_show: 1,
            prefix: data.tips_text || data.prefix || '',
            amount: data.amount || '',
            unit: data.unit || '',
            action_text: data.btn_text || data.action_text || '',
            is_login: data.is_login || 0,
            buy_url: data.buy_url || '/pages/plugins/vip/buy/buy',
            login_url: data.login_url || '/pages/login/login',
            panel_url: data.panel_url || '/pages/plugins/vip/index/index',
        };
    }
</script>
<style lang="scss" scoped>
.paid-member {
    width: 100%;
    box-sizing: border-box;
    min-height: 72rpx;
    gap: 16rpx;
}
.left {
    min-width: 0;
    gap: 12rpx;
}
.badge {
    position: relative;
    line-height: 1.3;
    margin-left: 10rpx;
    flex-shrink: 0;
}
.badge::before {
    content: '';
    position: absolute;
    left: -10rpx;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-top: 10rpx solid transparent;
    border-bottom: 10rpx solid transparent;
    border-right: 10rpx solid var(--badge-bg, #2b2b2b);
}
.badge-plain,
.badge-nobg {
    margin-left: 0;
}
.badge-plain::before,
.badge-nobg::before {
    display: none;
}
.badge-media {
    display: block;
}
.action {
    line-height: 1.2;
    flex-shrink: 0;
    gap: 4rpx;
}
.theme2 {
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
