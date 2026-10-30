<template>
    <view v-if="show_bar" class="oh" :style="style_container">
        <view :style="style_img_container">
            <view v-if="theme == '0'" class="banner theme0" :style="content_bg_style" :data-value="view.panel_url" @tap="url_event">
                <view class="content-img" :style="content_bg_img_style">
                    <view class="inner flex-row align-c jc-sb">
                        <view class="flex-row align-c oh flex-1 flex-width">
                            <image v-if="icon_show == '1' && icon_src" class="level-img" :src="icon_src" mode="aspectFill" :style="icon_wrap_style"></image>
                            <view v-else-if="icon_show == '1'" class="level-img level-icon flex-row align-c jc-c" :style="icon_wrap_style">
                                <iconfont name="icon-admin-store-vip" :color="icon_color" :size="icon_font_size" propContainerDisplay="flex"></iconfont>
                            </view>
                            <view v-if="title_show == '1' || show_expire" class="flex-col oh flex-1 flex-width">
                                <view v-if="title_show == '1'" class="text-line-1 title-name title-chip" :class="title_is_bold ? 'is-bold' : ''" :style="title_style">{{ view.title }}</view>
                                <view v-if="show_expire" class="expire text-line-1" :style="end_time_style">
                                    <text v-if="view.expire_prefix">{{ view.expire_prefix }}</text>
                                    <text v-if="view.expire_prefix && view.end_time" class="expire-split"></text>
                                    <text v-if="view.end_time">{{ view.end_time }}</text>
                                </view>
                            </view>
                        </view>
                        <view v-if="show_button" class="btn-pill nowrap" :style="button_style" :data-value="button_url" @tap.stop="url_event">{{ view.button_text }}</view>
                    </view>
                </view>
            </view>
            <view v-else-if="theme == '1'" class="banner theme1" :style="content_bg_style" :data-value="view.panel_url" @tap="url_event">
                <view class="content-img" :style="content_bg_img_style">
                    <view class="inner flex-row align-c jc-sb">
                        <view class="flex-row align-c oh flex-1 flex-width">
                            <image v-if="icon_show == '1' && icon_src" class="level-img" :src="icon_src" mode="aspectFill" :style="icon_wrap_style"></image>
                            <view v-else-if="icon_show == '1'" class="level-img level-icon flex-row align-c jc-c" :style="icon_wrap_style">
                                <iconfont name="icon-admin-store-vip" :color="icon_color" :size="icon_font_size" propContainerDisplay="flex"></iconfont>
                            </view>
                            <view v-if="title_show == '1' || show_expire" class="flex-col oh flex-1 flex-width">
                                <view v-if="title_show == '1'" class="text-line-1 title-name title-chip" :class="title_is_bold ? 'is-bold' : ''" :style="title_style">{{ view.title }}</view>
                                <view v-if="show_expire" class="expire text-line-1" :style="end_time_style">
                                    <text v-if="view.expire_prefix">{{ view.expire_prefix }}</text>
                                    <text v-if="view.expire_prefix && view.end_time" class="expire-split"></text>
                                    <text v-if="view.end_time">{{ view.end_time }}</text>
                                </view>
                            </view>
                        </view>
                        <view v-if="show_button" class="btn-text flex-row align-c nowrap" :style="button_style" :data-value="button_url" @tap.stop="url_event">
                            <text>{{ view.button_text }}</text>
                            <iconfont name="icon-arrow-right" size="24rpx" :color="button_text_color" propContainerDisplay="flex"></iconfont>
                        </view>
                    </view>
                </view>
            </view>
            <view v-else-if="theme == '5'" class="banner theme2" :style="content_bg_style" :data-value="view.panel_url" @tap="url_event">
                <view class="content-img" :style="content_bg_img_style">
                    <view class="body flex-col align-c">
                        <image v-if="icon_show == '1' && icon_src" class="level-img" :src="icon_src" mode="aspectFill" :style="icon_wrap_style"></image>
                            <view v-else-if="icon_show == '1'" class="level-img level-icon flex-row align-c jc-c" :style="icon_wrap_style">
                                <iconfont name="icon-admin-store-vip" :color="icon_color" :size="icon_font_size" propContainerDisplay="flex"></iconfont>
                            </view>
                        <view v-if="title_show == '1'" class="tc title-name title-chip" :class="title_is_bold ? 'is-bold' : ''" :style="title_style">{{ view.title }}</view>
                        <view v-if="show_expire" class="expire text-line-1 tc" :style="end_time_style">
                            <text v-if="view.expire_prefix">{{ view.expire_prefix }}</text>
                            <text v-if="view.expire_prefix && view.end_time" class="expire-split"></text>
                            <text v-if="view.end_time">{{ view.end_time }}</text>
                        </view>
                        <view v-if="show_button" class="btn-bar w tc" :style="button_style" :data-value="button_url" @tap.stop="url_event">{{ view.button_text }}</view>
                    </view>
                </view>
            </view>
            <view v-else-if="theme == '3'" class="banner" :style="content_bg_style" :data-value="view.panel_url" @tap="url_event">
                <view class="content-img" :style="content_bg_img_style">
                    <view class="flex-col">
                        <view v-if="icon_show == '1' || title_show == '1' || rules_show == '1'" class="flex-row align-c jc-sb">
                            <view class="flex-row align-c oh flex-1 flex-width">
                                <image v-if="icon_show == '1' && icon_src" class="level-img" :src="icon_src" mode="aspectFill" :style="icon_wrap_style"></image>
                                <view v-else-if="icon_show == '1'" class="level-img level-icon flex-row align-c jc-c" :style="icon_wrap_style">
                                    <iconfont name="icon-admin-store-vip" :color="icon_color" :size="icon_font_size" propContainerDisplay="flex"></iconfont>
                                </view>
                                <view v-if="title_show == '1'" class="text-line-1 title-name title-chip" :class="title_is_bold ? 'is-bold' : ''" :style="title_style">{{ view.title }}</view>
                            </view>
                            <view v-if="rules_show == '1'" class="rules-link flex-row align-c nowrap" :style="rules_box_style">
                                <text :style="rules_style">{{ rules_text }}</text>
                                <image v-if="rules_arrow_img" class="rules-arrow-img" :src="rules_arrow_img" mode="aspectFit" :style="rules_arrow_img_style"></image>
                                <iconfont v-else-if="rules_arrow_icon" :name="'icon-' + rules_arrow_icon" :size="rules_arrow_size * 2 + 'rpx'" :color="rules_arrow_color" propContainerDisplay="flex"></iconfont>
                            </view>
                        </view>
                        <view v-if="show_expire" class="expire text-line-1" :style="end_time_style">
                            <text v-if="view.expire_prefix">{{ view.expire_prefix }}</text>
                            <text v-if="view.expire_prefix && view.end_time" class="expire-split"></text>
                            <text v-if="view.end_time">{{ view.end_time }}</text>
                        </view>
                        <view v-if="progress_show == '1' || show_button" class="flex-row align-c theme3-action">
                            <view v-if="progress_show == '1'" class="flex-1 flex-width flex-col theme3-progress">
                                <view v-if="view.progress_tip" class="text-line-1" :style="tip_style">{{ view.progress_tip }}</view>
                                <view class="progress-line flex-row align-c">
                                    <view class="progress-track" :style="progress_track_style"><view class="progress-fill" :style="progress_fill_style"></view></view>
                                    <view class="progress-percent" :style="percent_style">{{ progress_text }}</view>
                                </view>
                            </view>
                            <view v-if="show_button" class="btn-pill theme3-btn flex-row align-c nowrap" :style="button_style" :data-value="button_url" @tap.stop="url_event">
                                <text>{{ view.button_text }}</text>
                                <iconfont name="icon-arrow-right" size="22rpx" :color="button_text_color" propContainerDisplay="flex"></iconfont>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <view v-else-if="theme == '4'" class="banner" :style="content_bg_style" :data-value="view.panel_url" @tap="url_event">
                <view class="content-img" :style="content_bg_img_style">
                    <view class="flex-col">
                        <view class="flex-row align-c jc-sb">
                            <view class="flex-row align-c oh flex-1 flex-width">
                                <image v-if="icon_show == '1' && icon_src" class="level-img" :src="icon_src" mode="aspectFill" :style="icon_wrap_style"></image>
                            <view v-else-if="icon_show == '1'" class="level-img level-icon flex-row align-c jc-c" :style="icon_wrap_style">
                                <iconfont name="icon-admin-store-vip" :color="icon_color" :size="icon_font_size" propContainerDisplay="flex"></iconfont>
                            </view>
                                <view v-if="title_show == '1' || show_expire" class="flex-col oh flex-1 flex-width">
                                    <view v-if="title_show == '1'" class="text-line-1 title-name title-chip" :class="title_is_bold ? 'is-bold' : ''" :style="title_style">{{ view.title }}</view>
                                    <view v-if="show_expire" class="expire text-line-1" :style="end_time_style">
                                        <text v-if="view.expire_prefix">{{ view.expire_prefix }}</text>
                                        <text v-if="view.expire_prefix && view.end_time" class="expire-split"></text>
                                        <text v-if="view.end_time">{{ view.end_time }}</text>
                                    </view>
                                </view>
                            </view>
                            <view v-if="show_button" class="btn-pill flex-row align-c nowrap" :style="button_style" :data-value="button_url" @tap.stop="url_event">
                                <text>{{ view.button_text }}</text>
                                <iconfont name="icon-arrow-right" size="22rpx" :color="button_text_color" propContainerDisplay="flex"></iconfont>
                            </view>
                        </view>
                        <view v-if="progress_show == '1'" class="flex-col">
                            <view class="progress-line flex-row align-c">
                                <view class="progress-track" :style="progress_track_style"><view class="progress-fill" :style="progress_fill_style"></view></view>
                                <view class="progress-percent" :style="percent_style">{{ progress_text }}</view>
                            </view>
                            <view class="flex-row align-c jc-sb">
                                <view v-if="view.progress_tip" class="text-line-1 flex-1 flex-width" :style="tip_style">{{ view.progress_tip }}</view>
                                <view v-if="rules_show == '1'" class="rules-link flex-row align-c nowrap" :style="rules_box_style">
                                    <text :style="rules_style">{{ rules_text }}</text>
                                    <image v-if="rules_arrow_img" class="rules-arrow-img" :src="rules_arrow_img" mode="aspectFit" :style="rules_arrow_img_style"></image>
                                    <iconfont v-else-if="rules_arrow_icon" :name="'icon-' + rules_arrow_icon" :size="rules_arrow_size * 2 + 'rpx'" :color="rules_arrow_color" propContainerDisplay="flex"></iconfont>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <view v-else class="banner" :style="content_bg_style" :data-value="view.panel_url" @tap="url_event">
                <view class="content-img" :style="content_bg_img_style">
                    <view class="inner flex-row align-c jc-sb">
                        <view class="flex-row align-c oh flex-1 flex-width">
                            <image v-if="icon_show == '1' && icon_src" class="level-img" :src="icon_src" mode="aspectFill" :style="icon_wrap_style"></image>
                            <view v-else-if="icon_show == '1'" class="level-img level-icon flex-row align-c jc-c" :style="icon_wrap_style">
                                <iconfont name="icon-admin-store-vip" :color="icon_color" :size="icon_font_size" propContainerDisplay="flex"></iconfont>
                            </view>
                            <view v-if="title_show == '1' || show_expire" class="flex-col oh flex-1 flex-width">
                                <view v-if="title_show == '1'" class="text-line-1 title-name title-chip" :class="title_is_bold ? 'is-bold' : ''" :style="title_style">{{ view.title }}</view>
                                <view v-if="show_expire" class="expire text-line-1" :style="end_time_style">
                                    <text v-if="view.expire_prefix">{{ view.expire_prefix }}</text>
                                    <text v-if="view.expire_prefix && view.end_time" class="expire-split"></text>
                                    <text v-if="view.end_time">{{ view.end_time }}</text>
                                </view>
                            </view>
                        </view>
                        <view v-if="show_button" class="btn-pill flex-row align-c nowrap" :style="button_style" :data-value="button_url" @tap.stop="url_event">
                            <text>{{ view.button_text }}</text>
                            <iconfont name="icon-arrow-right" size="22rpx" :color="button_text_color" propContainerDisplay="flex"></iconfont>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import { common_styles_computer, common_img_computer, gradient_handle, background_computer, padding_computer, radius_computer, border_computer } from '@/common/js/common/common.js';
    import { on_goods_detail_page } from './goods-detail-common.js';
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
        },
        data() {
            return {
                theme: '0',
                title_show: '1',
                icon_show: '1',
                button_show: '1',
                progress_show: '1',
                rules_show: '1',
                level_tag_show: '1',
                rules_text: '规则',
                rules_arrow_icon: 'arrow-right',
                rules_arrow_img: '',
                rules_arrow_img_style: '',
                rules_arrow_color: 'rgba(255,255,255,0.9)',
                rules_arrow_size: 10,
                rules_style: '',
                rules_box_style: '',
                view: {
                    is_show: 0,
                    title: '',
                    button_text: '',
                    button_enable: 0,
                    end_time: '',
                    expire_prefix: '',
                    level_tag: '',
                    progress_tip: '',
                    progress_percent: 0,
                    icon: '',
                    panel_url: '/pages/plugins/vip/index/index',
                    button_url: '/pages/plugins/vip/buy/buy',
                    login_url: '/pages/login/login',
                    is_login: 0,
                },
                show_bar: false,
                style_container: '',
                style_img_container: '',
                content_bg_style: '',
                content_bg_img_style: '',
                title_style: '',
                title_is_bold: false,
                end_time_style: '',
                button_style: '',
                button_text_color: '#e8d3b0',
                tip_style: '',
                progress_track_style: '',
                progress_fill_style: '',
                percent_style: '',
                icon_wrap_style: '',
                icon_color: 'rgba(232, 211, 176, 1)',
                icon_font_size: '44rpx',
            };
        },
        computed: {
            show_button() {
                return this.button_show == '1' && String(this.view.button_enable) != '0' && !!this.view.button_text;
            },
            show_expire() {
                return !!(this.view.expire_prefix || this.view.end_time);
            },
            icon_src() {
                return this.view.icon || '';
            },
            progress_text() {
                const n = Number(this.view.progress_percent);
                const value = isFinite(n) ? Math.max(0, Math.min(100, Math.round(n))) : 0;
                return value + '%';
            },
            button_url() {
                if (String(this.view.is_login) != '1' && this.view.login_url && this.view.button_url == this.view.login_url) {
                    return this.view.login_url;
                }
                return this.view.button_url || this.view.panel_url;
            },
        },
        watch: {
            propKey() {
                this.init();
            },
            propValue() {
                this.init();
            },
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                const content = this.propValue.content || null;
                const style = this.propValue.style || null;
                if (content == null || style == null) {
                    return;
                }
                const theme = String(content.theme == null ? '0' : content.theme);
                const size_by_theme = { '0': 32, '1': 44, '4': 24, '5': 44 };
                const icon_size = Number(style.icon_size) > 0 ? Number(style.icon_size) : size_by_theme[theme] || 32;
                const color_list = style.content_color_list || [];
                const has_bg = Array.isArray(color_list) && color_list.some((item) => item && item.color);
                const bg = has_bg ? gradient_handle(color_list, style.content_direction || '90deg') : '';
                const button_color = style.button_text_color || '#e8d3b0';
                const button_bg = style.button_bg_color == null ? 'rgba(51, 51, 51, 1)' : style.button_bg_color || 'transparent';
                const button_border = border_computer({
                    border_is_show: style.button_border_is_show || '0',
                    border_color: style.button_border_color || 'rgba(51, 51, 51, 1)',
                    border_style: style.button_border_style || 'solid',
                    border_size: style.button_border_size,
                });
                const rules_bg = style.rules_bg_color ? 'background:' + style.rules_bg_color + ';' : '';
                const rules_border = border_computer({
                    border_is_show: style.rules_border_is_show || '0',
                    border_color: style.rules_border_color || style.rules_color || 'rgba(255,255,255,0.9)',
                    border_style: style.rules_border_style || 'solid',
                    border_size: style.rules_border_size,
                });
                const arrow_size = Number(style.rules_arrow_size) || 10;
                const arrow_img = Array.isArray(content.rules_arrow_img) && content.rules_arrow_img.length > 0 ? content.rules_arrow_img[0].url || '' : '';
                const is_pill = theme == '3';
                let title_color = style.title_color || '#333';
                let title_bg = style.title_bg_color;
                if (title_bg == null) {
                    if (is_pill && title_color == 'rgba(80, 45, 10, 1)') {
                        title_color = 'rgba(255, 248, 232, 1)';
                    }
                    title_bg = is_pill ? 'rgba(80, 45, 10, 0.55)' : '';
                }
                const title_padding = style.title_padding && typeof style.title_padding == 'object'
                    ? style.title_padding
                    : (is_pill
                        ? { padding_top: 1, padding_right: 5, padding_bottom: 1, padding_left: 5 }
                        : { padding_top: 0, padding_right: 0, padding_bottom: 0, padding_left: 0 });
                let title_size = Number(style.title_size);
                if (!title_size) {
                    title_size = is_pill ? 12 : 15;
                } else if (is_pill && style.title_size_ready != '1' && title_size === 15) {
                    title_size = 12;
                }
                const title_radius_size = is_pill ? 4 : 0;
                const title_radius = style.title_radius && typeof style.title_radius == 'object'
                    ? style.title_radius
                    : { radius_top_left: title_radius_size, radius_top_right: title_radius_size, radius_bottom_right: title_radius_size, radius_bottom_left: title_radius_size };
                const percent = 0;
                this.setData({
                    theme: theme,
                    title_show: '1',
                    icon_show: content.icon_show == null ? '1' : String(content.icon_show),
                    button_show: content.button_show == null ? '1' : String(content.button_show),
                    progress_show: content.progress_show == null ? '1' : String(content.progress_show),
                    rules_show: content.rules_show == null ? '1' : String(content.rules_show),
                    level_tag_show: content.level_tag_show == null ? '1' : String(content.level_tag_show),
                    rules_text: content.rules_text == null ? '规则' : content.rules_text,
                    rules_arrow_icon: content.rules_arrow_icon == null ? 'arrow-right' : content.rules_arrow_icon,
                    rules_arrow_img: arrow_img,
                    rules_arrow_size: arrow_size,
                    rules_arrow_color: style.rules_arrow_color || style.rules_color || 'rgba(255,255,255,0.9)',
                    rules_arrow_img_style: 'width:' + arrow_size * 2 + 'rpx;height:' + arrow_size * 2 + 'rpx;',
                    rules_style: 'color:' + (style.rules_color || 'rgba(255,255,255,0.9)') + ';font-size:' + (Number(style.rules_size) || 11) * 2 + 'rpx;',
                    rules_box_style: 'box-sizing:border-box;' + rules_bg + padding_computer(style.rules_padding) + radius_computer(style.rules_radius) + rules_border,
                    style_container: common_styles_computer(style.common_style || {}),
                    style_img_container: common_img_computer(style.common_style || {}, this.propIndex),
                    content_bg_style: bg + radius_computer(style.banner_radius) + 'overflow:hidden;',
                    content_bg_img_style: background_computer({
                        background_img: style.content_background_img || [],
                        background_img_style: style.content_background_img_style || '0',
                    }) + padding_computer(style.content_padding),
                    title_is_bold: String(style.title_bold) == '1',
                    title_style: 'color:' + title_color + ';font-size:' + title_size * 2 + 'rpx;line-height:1.4;box-sizing:border-box;' + (title_bg ? 'background:' + title_bg + ';' : '') + padding_computer(title_padding) + radius_computer(title_radius),
                    end_time_style: 'color:' + (style.end_time_color || style.desc_color || 'rgba(120,100,70,1)') + ';font-size:' + (Number(style.end_time_size) || 11) * 2 + 'rpx;',
                    tip_style: 'color:' + (style.tip_color || 'rgba(255,255,255,0.85)') + ';font-size:' + (Number(style.tip_size) || 11) * 2 + 'rpx;',
                    percent_style: 'color:' + (style.progress_percent_color || style.tip_color || 'rgba(120,70,30,0.9)') + ';font-size:' + (Number(style.progress_percent_size) || 11) * 2 + 'rpx;',
                    button_text_color: button_color,
                    button_style: 'background:' + button_bg + ';color:' + button_color + ';font-size:' + (Number(style.button_size) || 12) * 2 + 'rpx;box-sizing:border-box;' + padding_computer(style.button_padding) + radius_computer(style.button_radius) + button_border,
                    progress_track_style: 'background:' + (style.progress_bg_color || 'rgba(255,255,255,0.35)') + ';',
                    progress_fill_style: 'background:' + (style.progress_fill_color || 'rgba(255,140,60,1)') + ';width:' + percent + '%;',
                    icon_wrap_style: 'width:' + icon_size * 2 + 'rpx;height:' + icon_size * 2 + 'rpx;',
                    icon_color: style.icon_color || 'rgba(232, 211, 176, 1)',
                    icon_font_size: Math.round(icon_size * 1.3) + 'rpx',
                });
                const saved = content.view_data;
                if (on_goods_detail_page()) {
                    if (saved && typeof saved == 'object' && saved.is_show != null) {
                        this.apply_view(saved, style);
                    } else {
                        this.setData({ show_bar: false });
                    }
                    return;
                }
                if (saved && typeof saved == 'object' && saved.is_show != null) {
                    this.apply_view(saved, style);
                    return;
                }
                this.get_view(style);
            },
            apply_view(view, style) {
                const percent = Number(view.progress_percent) > 0 ? Number(view.progress_percent) : 0;
                const fill = (style && style.progress_fill_color) || 'rgba(255,140,60,1)';
                this.setData({
                    view: Object.assign({}, this.view, view),
                    show_bar: String(view.is_show) == '1',
                    progress_fill_style: 'background:' + fill + ';width:' + percent + '%;',
                });
            },
            get_view(style) {
                uni.request({
                    url: app.globalData.get_request_url('opendata', 'diyapi', 'vip'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
                        const body = res.data || {};
                        if (body.code == 0 && body.data) {
                            this.apply_view(body.data, style);
                        }
                    },
                });
            },
            url_event(e) {
                app.globalData.url_event(e);
            },
        },
    };
</script>
<style lang="scss" scoped>
.banner {
    position: relative;
    overflow: hidden;
}
.content-img,
.inner,
.body {
    position: relative;
    z-index: 1;
}
.inner {
    gap: 20rpx;
}
.body {
    gap: 16rpx;
}
.flex-col {
    gap: 12rpx;
}
.title-chip {
    width: fit-content;
    max-width: 100%;
    box-sizing: border-box;
    line-height: 1.4;
}
.title-name {
    font-weight: normal;
}
.title-name.is-bold {
    font-weight: bold;
}
.level-img {
    border-radius: 50%;
    flex-shrink: 0;
    margin-right: 16rpx;
}
.level-icon {
    box-sizing: border-box;
}
.btn-pill,
.btn-text,
.btn-bar {
    line-height: 1.2;
    flex-shrink: 0;
}
.btn-bar {
    margin-top: 8rpx;
}
.expire-split {
    display: inline-block;
    width: 1px;
    height: 0.9em;
    margin: 0 0.6em;
    background: currentColor;
    opacity: 0.45;
}
.progress-line {
    min-width: 0;
}
.progress-line .progress-track {
    flex: 1;
    width: auto;
    min-width: 0;
}
.progress-percent {
    margin-left: 16rpx;
    line-height: 1;
    flex-shrink: 0;
}
.theme3-progress {
    min-width: 0;
    overflow: hidden;
}
.theme3-progress + .theme3-btn {
    margin-left: 32rpx;
}
.progress-track {
    width: 100%;
    height: 8rpx;
    border-radius: 999px;
    overflow: hidden;
}
.progress-fill {
    height: 100%;
    border-radius: 999px;
}
.rules-link {
    opacity: 0.95;
    gap: 8rpx;
}
.level-badge {
    gap: 8rpx;
    margin-right: 12rpx;
    flex-shrink: 0;
}
.level-v {
    width: 32rpx;
    height: 32rpx;
    border-radius: 50%;
    background: rgba(120, 70, 20, 0.35);
    color: #5a3a12;
    font-size: 20rpx;
    font-weight: 800;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}
.level-tag {
    padding: 2rpx 10rpx;
    border-radius: 8rpx;
    background: rgba(80, 45, 10, 0.55);
    color: #fff8e8;
    font-size: 20rpx;
    font-weight: 700;
    line-height: 1.4;
}
.nowrap {
    white-space: nowrap;
}
</style>
