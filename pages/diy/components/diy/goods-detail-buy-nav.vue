<template>
    <view class="diy-buy-nav-fixed">
        <view class="bottom-line-exclude">
            <view :style="style_container">
                <view class="bar flex-row align-c" :style="style_img_container">
                    <view v-if="icons.length > 0" class="icons flex-row align-c">
                        <view v-for="(item, index) in icons" :key="item.key || index" class="icon-item flex-col align-c jc-c">
                            <view v-if="item.key == 'cart' && cartCount > 0" class="cart-badge">
                                <component-badge :propNumber="cartCount"></component-badge>
                            </view>
                            <image v-if="item.img_url" :src="item.img_url" mode="aspectFit" class="gbn-icon-img" :style="icon_img_style"></image>
                            <iconfont v-else-if="item.icon_name" :name="item.icon_name" :size="icon_font_size" :color="item.icon_color" propContainerDisplay="flex"></iconfont>
                            <text class="gbn-icon-label" :style="item.text_style">{{ item.name }}</text>
                            <!-- 小程序图标是独立组件，点击不会冒泡到外层。盖一层原生热区。微信客服必须是 open-type=contact 的按钮，脚本点不出来。 -->
                            <!-- #ifdef MP-WEIXIN || MP-TOUTIAO || MP-BAIDU || MP-KUAISHOU -->
                            <button v-if="item.native_contact" class="icon-hit icon-hit-btn" open-type="contact" hover-class="none" :show-message-card="true" :send-message-title="contact_title" :send-message-path="contact_path" :send-message-img="contact_img"></button>
                            <!-- #endif -->
                            <!-- #ifdef MP-ALIPAY -->
                            <button v-if="item.native_contact" class="icon-hit icon-hit-btn" open-type="contact" hover-class="none">
                                <contact-button class="alipay-hit" :tnt-inst-id="alipay_tnt" :scene="alipay_scene" :alipay-card-no="alipay_openid || ''" :icon="contact_img" size="100%*100%" />
                            </button>
                            <!-- #endif -->
                            <view v-if="!item.native_contact" class="icon-hit" @tap.stop="icon_tap(index)"></view>
                        </view>
                    </view>
                    <view class="btns flex-1 flex-row align-c" :class="theme == '2' ? 'connected' : 'gap-btn'">
                        <view v-for="(btn, index) in action_btns" :key="index" class="action-btn" :style="btn.style" @tap.stop="submit_tap(index)">{{ btn.text }}</view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import { border_computer, common_styles_computer, common_img_computer, padding_computer, radius_computer } from '@/common/js/common/common.js';
    import { call_page, icon_name, page_vm } from './goods-detail-common.js';
    import componentBadge from '@/components/badge/badge';
    export default {
        components: {
            componentBadge,
        },
        props: {
            propValue: {
                type: Object,
                default: function () {
                    return {};
                },
            },
            propCartCount: {
                type: [Number, String],
                default: 0,
            },
            propFavored: {
                type: [Boolean, Number, String],
                default: false,
            },
            propBuyButton: {
                type: Object,
                default: function () {
                    return null;
                },
            },
        },
        data() {
            return {
                theme: '0',
                icons: [],
                action_btns: [],
                icon_font_size: '40rpx',
                icon_img_style: '',
                style_container: '',
                style_img_container: '',
                cartCount: 0,
                contact_title: '',
                contact_img: '',
                contact_path: '',
                alipay_tnt: '',
                alipay_scene: '',
                alipay_openid: '',
            };
        },
        watch: {
            propValue: {
                handler() {
                    this.init();
                },
                deep: true,
                immediate: true,
            },
            propCartCount(val) {
                this.cartCount = parseInt(val || 0);
            },
            propFavored() {
                this.init();
            },
            propBuyButton: {
                handler() {
                    this.init();
                },
                deep: true,
                immediate: true,
            },
        },
        methods: {
            init() {
                var content = (this.propValue && this.propValue.content) || {};
                var style = (this.propValue && this.propValue.style) || {};
                var theme = String(content.theme == null ? '0' : content.theme);
                if (['0', '1', '2', '3', '4'].indexOf(theme) == -1) {
                    theme = '0';
                }
                var icon_color = this.safe_color(style.icon_color, 'rgba(51,51,51,1)');
                var text_color = this.safe_color(style.icon_text_color, 'rgba(51,51,51,1)');
                var icon_size = parseInt(style.icon_size || 20);
                var text_size = parseInt(style.icon_text_size || 10);
                var text_style = 'color:' + text_color + ';font-size:' + text_size * 2 + 'rpx;';
                var favored = this.propFavored == 1 || this.propFavored === true || this.propFavored === '1';
                var list = Array.isArray(content.icon_list) ? content.icon_list : [];
                var native_contact = this.service_native_contact();
                var icons = [];
                for (var i = 0; i < list.length; i++) {
                    var row = list[i] || {};
                    if (String(row.is_show == null ? '1' : row.is_show) === '0') {
                        continue;
                    }
                    var link = row.link && typeof row.link == 'object' ? row.link : {};
                    var page = link.page || '';
                    var img = Array.isArray(row.img) && row.img.length > 0 ? row.img[0] : null;
                    var img_url = img && img.url ? img.url : '';
                    var icon = row.icon || '';
                    var item_icon_color = icon_color;
                    var item_text_style = text_style;
                    var is_favor = String(row.key || '') == 'favor' || page == 'goods-detail://favor';
                    if (is_favor && favored) {
                        var active_img = Array.isArray(style.favor_active_img) && style.favor_active_img.length > 0 ? style.favor_active_img[0] : null;
                        if (active_img && active_img.url) {
                            img_url = active_img.url;
                            icon = '';
                        } else if (style.favor_active_icon) {
                            img_url = '';
                            icon = style.favor_active_icon;
                        } else if (style.favor_active_icon == null && !img_url) {
                            icon = 'heart';
                        }
                        if (style.favor_active_icon_color) {
                            item_icon_color = this.safe_color(style.favor_active_icon_color, 'rgba(255, 0, 54, 1)');
                        } else if (style.favor_active_icon_color == null) {
                            item_icon_color = 'rgba(255, 0, 54, 1)';
                        }
                        var active_text = text_color;
                        if (style.favor_active_text_color) {
                            active_text = this.safe_color(style.favor_active_text_color, 'rgba(255, 0, 54, 1)');
                        } else if (style.favor_active_text_color == null) {
                            active_text = 'rgba(255, 0, 54, 1)';
                        }
                        item_text_style = 'color:' + active_text + ';font-size:' + text_size * 2 + 'rpx;';
                    }
                    var item_key = String(row.key || row.id || i);
                    var is_service = item_key == 'service' || page == 'goods-detail://chat';
                    icons.push({
                        key: item_key,
                        name: row.name == null ? '' : row.name,
                        icon_name: img_url ? '' : icon_name(icon || 'setup', 'icon-setup'),
                        icon_color: item_icon_color,
                        img_url: img_url,
                        text_style: item_text_style,
                        link: link,
                        native_contact: is_service && native_contact,
                    });
                }
                var card = this.contact_card();
                var common = Object.assign({}, style.common_style || {});
                if (!Array.isArray(common.background_img)) {
                    common.background_img = [];
                }
                this.setData({
                    theme: theme,
                    icons: icons,
                    cartCount: parseInt(this.propCartCount || 0),
                    action_btns: this.build_action_btns(content, style, theme),
                    icon_font_size: icon_size * 2 + 'rpx',
                    icon_img_style: 'width:' + icon_size * 2 + 'rpx;height:' + icon_size * 2 + 'rpx;',
                    style_container: common_styles_computer(common),
                    style_img_container: common_img_computer(common) + 'box-sizing:border-box;',
                    contact_title: card.title,
                    contact_img: card.img,
                    contact_path: card.path,
                    alipay_tnt: app.globalData.get_config('config.common_app_mini_alipay_tnt_inst_id', '') || '',
                    alipay_scene: app.globalData.get_config('config.common_app_mini_alipay_scene', '') || '',
                    alipay_openid: app.globalData.get_user_cache_info('alipay_openid') || '',
                });
            },
            /** 没有自有客服、自定义链接、企业微信时，小程序只能靠按钮 open-type=contact */
            service_native_contact() {
                var native = false;
                // #ifdef MP-WEIXIN || MP-TOUTIAO || MP-BAIDU || MP-KUAISHOU || MP-ALIPAY
                if (parseInt(app.globalData.get_config('config.common_app_is_online_service', 0) || 0) != 1) {
                    return false;
                }
                var is_chat = parseInt(app.globalData.get_config('plugins_base.chat.data.is_mobile_chat', 0) || 0);
                var chat_url = app.globalData.get_config('plugins_base.chat.data.chat_url');
                if (is_chat == 1 && chat_url) {
                    return false;
                }
                var client = app.globalData.application_client_type();
                var custom_map = app.globalData.get_config('config.common_app_customer_service_custom', null);
                var custom_url = custom_map && custom_map[client] ? custom_map[client] : null;
                var corpid = app.globalData.get_config('config.common_app_customer_service_company_weixin_corpid', null);
                var wxurl = app.globalData.get_config('config.common_app_customer_service_company_weixin_url', null);
                if (custom_url || (corpid && wxurl)) {
                    return false;
                }
                native = true;
                // #endif
                return native;
            },
            contact_card() {
                var page = page_vm();
                var goods = page && page.goods;
                var title = '';
                var img = '';
                var path = '';
                if (goods) {
                    title = goods.title || '';
                    img = goods.images;
                    if (Array.isArray(img)) {
                        var first = img.length ? img[0] : '';
                        img = first && typeof first == 'object' ? (first.url || '') : (first || '');
                    } else if (img && typeof img == 'object') {
                        img = img.url || '';
                    }
                    path = '/pages/goods-detail/goods-detail?id=' + (goods.id || '');
                }
                return { title: title || '', img: img || '', path: path };
            },
            safe_color(color, fallback) {
                var value = color == null || color === '' ? fallback : String(color);
                if (value.indexOf('#') == -1 && value.indexOf('rgba') == -1) {
                    return fallback;
                }
                return value;
            },
            button_face(style, which, theme) {
                var bg = style[which + '_btn_bg'] || (which == 'cart' ? 'rgba(246, 193, 51, 1)' : 'rgba(255, 0, 54, 1)');
                var color = style[which + '_btn_color'] || 'rgba(255, 255, 255, 1)';
                var radius_css = '';
                if (style[which + '_radius'] && typeof style[which + '_radius'] == 'object') {
                    radius_css = radius_computer(style[which + '_radius']);
                } else {
                    var n = style.btn_radius == null || style.btn_radius === '' ? 20 : Number(style.btn_radius);
                    var r = n * 2;
                    if (String(theme) == '2') {
                        radius_css = which == 'cart' ? 'border-radius:' + r + 'rpx 0 0 ' + r + 'rpx;' : 'border-radius:0 ' + r + 'rpx ' + r + 'rpx 0;';
                    } else {
                        radius_css = 'border-radius:' + r + 'rpx;';
                    }
                }
                var pad_css = padding_computer(style[which + '_padding']);
                var border_css = '';
                if (style[which + '_border_is_show'] != null) {
                    border_css = border_computer({
                        border_is_show: style[which + '_border_is_show'] || '0',
                        border_color: style[which + '_border_color'] || '',
                        border_style: style[which + '_border_style'] || 'solid',
                        border_size: style[which + '_border_size'],
                    });
                } else if (which == 'cart' && style.cart_btn_border) {
                    border_css = 'border:1px solid ' + style.cart_btn_border + ';box-sizing:border-box;';
                }
                return 'background:' + bg + ';color:' + color + ';box-sizing:border-box;' + radius_css + pad_css + border_css;
            },
            button_text(type, live_name, content) {
                var live = live_name == null ? '' : String(live_name);
                if (type == 'cart') {
                    var cart_text = content.cart_btn_text == null ? '' : String(content.cart_btn_text);
                    if (cart_text && cart_text !== '加入购物车') {
                        return cart_text;
                    }
                    return live || cart_text || '加入购物车';
                }
                if (type == 'buy') {
                    var buy_text = content.buy_btn_text == null ? '' : String(content.buy_btn_text);
                    if (buy_text && buy_text !== '立即购买') {
                        return buy_text;
                    }
                    return live || buy_text || '立即购买';
                }
                return live;
            },
            /** 商品购买导航。小程序跨包组件上对象属性可能还没传进来，这时读详情页上的 buy_button */
            live_buy_button() {
                var from_prop = this.propBuyButton;
                if (from_prop && Array.isArray(from_prop.data)) {
                    return from_prop;
                }
                var page = page_vm();
                var from_page = page && page.buy_button;
                if (from_page && Array.isArray(from_page.data)) {
                    return from_page;
                }
                return null;
            },
            build_action_btns(content, style, theme) {
                var buy_button = this.live_buy_button();
                var live = buy_button ? buy_button.data : null;
                var rows = [];
                if (live) {
                    if (live.length == 0) {
                        var error = (buy_button && buy_button.error) || '';
                        if (error) {
                            rows.push({ text: error, type: '', value: '', business: '', disabled: true, pair: false });
                        }
                    } else {
                        for (var i = 0; i < live.length; i++) {
                            var item = live[i] || {};
                            if ((item.name || null) == null || (item.type || null) == null) {
                                continue;
                            }
                            var pair = (item.color || 'main') != 'main';
                            rows.push({
                                text: this.button_text(item.type, item.name, content),
                                type: item.type,
                                value: item.value == null ? '' : item.value,
                                business: item.business || '',
                                disabled: false,
                                pair: pair,
                            });
                        }
                    }
                } else {
                    rows.push({
                        text: content.cart_btn_text == null || content.cart_btn_text === '' ? '加入购物车' : content.cart_btn_text,
                        type: 'cart',
                        value: '',
                        business: '',
                        disabled: false,
                        pair: true,
                    });
                    rows.push({
                        text: content.buy_btn_text == null || content.buy_btn_text === '' ? '立即购买' : content.buy_btn_text,
                        type: 'buy',
                        value: '',
                        business: '',
                        disabled: false,
                        pair: false,
                    });
                }
                var buttons = [];
                for (var n = 0; n < rows.length; n++) {
                    var row_item = rows[n];
                    var face = this.button_face(style, row_item.pair ? 'cart' : 'buy', theme);
                    var css = row_item.disabled ? 'background:#f5f5f5;color:#999;' + face.replace(/^background:[^;]*;color:[^;]*;/, '') : face;
                    buttons.push({
                        text: row_item.text,
                        type: row_item.type,
                        value: row_item.value,
                        business: row_item.business,
                        disabled: row_item.disabled,
                        style: css,
                    });
                }
                return buttons;
            },
            icon_tap(index) {
                var item = this.icons[index] || {};
                var page = (item.link && item.link.page) || '';
                var action = '';
                if (page.indexOf('goods-detail://') === 0) {
                    action = page.substr(15);
                } else if (!page) {
                    if (item.key == 'favor') {
                        action = 'favor';
                    } else if (item.key == 'service') {
                        action = 'chat';
                    } else if (item.key == 'share') {
                        action = 'share';
                    }
                }
                if (action == 'favor') {
                    call_page('goods_favor_event');
                    return;
                }
                if (action == 'chat') {
                    call_page('goods_detail_chat_event');
                    return;
                }
                if (action == 'share') {
                    call_page('popup_share_event');
                    return;
                }
                if (page) {
                    app.globalData.url_open(page);
                }
            },
            submit_tap(index) {
                if (index && typeof index == 'object') {
                    index = index.currentTarget && index.currentTarget.dataset ? index.currentTarget.dataset.index : -1;
                }
                var btn = this.action_btns[index] || {};
                if (btn.disabled || !btn.type) {
                    return;
                }
                // 直接把购买导航里的 type 交给详情页。小程序自定义组件 $emit 会包一层事件，详情页读不到插件改过的标识，就会落到默认购买。
                call_page('nav_buy_submit_event', {
                    type: btn.type,
                    value: btn.value == null ? '' : btn.value,
                    business: btn.business || '',
                });
            },
        },
    };
</script>
<style scoped>
    .diy-buy-nav-fixed {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 2;
        width: 100%;
        box-sizing: border-box;
    }
    .bar {
        width: 100%;
        min-height: 72rpx;
    }
    .icons {
        flex-shrink: 0;
    }
    .icon-item {
        position: relative;
        min-width: 72rpx;
        max-width: 96rpx;
        padding: 0 8rpx;
    }
    .icon-hit {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 3;
    }
    .icon-hit-btn {
        padding: 0;
        margin: 0;
        background: transparent;
        border: 0;
        border-radius: 0;
        line-height: 1;
        min-height: 0;
    }
    .icon-hit-btn::after {
        border: none;
    }
    .gbn-icon-img {
        display: block;
    }
    /* 勿用 icon-label / icon-img：会与 iconfont 同名类冲突，文字前多出一个图标 */
    .gbn-icon-label {
        line-height: 1.2;
        margin-top: 4rpx;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
    }
    .btns {
        min-width: 0;
    }
    .gap-btn {
        gap: 16rpx;
    }
    .connected {
        gap: 0;
        overflow: hidden;
    }
    .action-btn {
        flex: 1;
        min-height: 72rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        font-size: 26rpx;
        font-weight: 500;
        line-height: 1.2;
        white-space: nowrap;
        box-sizing: border-box;
    }
    .cart-badge {
        position: absolute;
        top: 0;
        right: 8rpx;
        z-index: 1;
    }
</style>
