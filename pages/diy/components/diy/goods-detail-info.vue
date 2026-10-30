<template>
    <view v-if="propGoods" class="oh" :style="outer.container">
        <view :style="outer.img">
            <view v-if="slide_total" class="hero pr" :style="'height:' + height + ';'">
                <goods-detail-hero-swiper ref="hero" :photos="view.photos" :video="video" :video-poster="video_poster" :height="height" :vertical="vertical" :prop-key="propKey" :ctrl-icons="ctrl_icons" :ctrl-style="ctrl_style" :is-roll="is_roll" :interval-time="interval_time" :scroll-duration="scroll_duration" @change="photo_change" @preview="photo_preview" @ctrl="on_ctrl"></goods-detail-hero-swiper>
                <view v-if="show_indicator && indicator_type == 'media'" class="indicator" :class="indicator_class" :style="indicator_box_style">
                    <view class="media-switch" :style="media_box_style">
                        <view v-if="video" class="media-item" :style="media_item_style(photo_index === 0)" @tap.stop="media_jump(0)">{{ video_label }}</view>
                        <view class="media-item" :style="media_item_style(photo_index > 0 || !video)" @tap.stop="media_jump(video ? 1 : 0)">{{ album_text }}</view>
                    </view>
                </view>
                <view v-else-if="show_indicator" class="indicator" :class="indicator_type == 'line' ? 'is-line' : indicator_class" :style="indicator_type == 'line' ? line_layout.box : indicator_box_style">
                    <text v-if="indicator_type == 'number'" class="num">{{ photo_index + 1 }}/{{ slide_total }}</text>
                    <block v-else>
                        <view v-for="index in slide_total" :key="index" :class="indicator_type == 'line' ? 'line' : 'dot'" :style="mark_style(index - 1)"></view>
                    </block>
                </view>
                <!-- #ifdef H5 -->
                <view v-if="show_h5_ctrls" class="video-ctrl-layer">
                    <view class="horn-btn" :style="ctrl_style.btn" @tap.stop="hero_toggle_pause">
                        <image v-if="h5_pause_img" class="horn-img" :src="h5_pause_img" :style="ctrl_style.img" mode="aspectFit"></image>
                        <text v-else class="horn-icon" :class="h5_pause_class" :style="ctrl_style.icon">{{ h5_pause_text }}</text>
                    </view>
                    <view class="horn-btn" :style="ctrl_style.btn + (ctrl_style.gap || '')" @tap.stop="hero_toggle_mute">
                        <image v-if="h5_mute_img" class="horn-img" :src="h5_mute_img" :style="ctrl_style.img" mode="aspectFit"></image>
                        <text v-else class="horn-icon" :class="h5_mute_class" :style="ctrl_style.icon">{{ h5_mute_text }}</text>
                    </view>
                </view>
                <!-- #endif -->
                <scroll-view v-if="theme == '0' && show('sku') && view.sku.length" scroll-x class="hero-sku" :style="hero_sku_style" :show-scrollbar="false" @tap.stop="spec_tap">
                    <view class="sku-row" :style="theme0_row_style">
                        <block v-for="(item, index) in sku_show" :key="index">
                            <image v-if="item.img" class="thumb theme0" :class="item.active ? 'active' : ''" :style="theme0_thumb_style(item.active)" :src="item.img" mode="aspectFill"></image>
                            <view v-else class="thumb theme0 thumb-name" :class="item.active ? 'active' : ''" :style="theme0_thumb_style(item.active)">{{ item.name }}</view>
                        </block>
                        <view class="more theme0" :style="theme0_more_style">{{ view.sku.length }}款可选</view>
                    </view>
                </scroll-view>
                <scroll-view v-if="theme == '3' && show('sku') && view.sku.length" scroll-x class="hero-float" :style="hero_float_style" :show-scrollbar="false" @tap.stop="spec_tap">
                    <view class="sku-row">
                        <view v-for="(item, index) in sku_show" :key="index" class="float-item" :class="item.active ? 'active' : ''" :style="float_item_style(item)">
                            <image v-if="item.img" class="float-img" :style="sku_img_style" :src="item.img" mode="aspectFill"></image>
                            <text :style="name_style(item.active)">{{ item.name }}</text>
                        </view>
                    </view>
                </scroll-view>
            </view>
            <view class="card" :style="card">
                <block v-if="theme == '1' && show('sku') && view.sku.length">
                    <scroll-view scroll-x class="sku-scroll" :show-scrollbar="false" @tap="spec_tap">
                        <view class="sku-row" :style="bar_row_style">
                            <view v-for="(item, index) in sku_show" :key="index" class="bar-item" :style="bar_item_style(item)">
                                <image v-if="item.img" class="thumb sm" :style="bar_thumb_style" :src="item.img" mode="aspectFill"></image>
                                <text :style="name_style(item.active)">{{ item.name }}</text>
                            </view>
                            <view class="more bar-count" :style="count_style">
                                <text>共{{ view.sku.length }}款</text>
                                <iconfont name="icon-arrow-right" :size="arrow_size" :color="arrow_color"></iconfont>
                            </view>
                        </view>
                    </scroll-view>
                </block>
                <block v-if="theme != '4'">
                    <view v-if="show('price') || show('price_label') || (show('market_price') && view.origin)" class="price-row">
                        <text v-if="show('price_label')" :style="pack.label">{{ view.label }}</text>
                        <text v-if="show('price')">
                            <text :style="pack.symbol">{{ view.symbol }}</text>
                            <text :style="pack.price">{{ view.price }}</text>
                        </text>
                        <text v-if="show('market_price') && view.origin" :style="pack.market">{{ view.origin_symbol }}{{ view.origin }}</text>
                    </view>
                    <view v-if="show('title') || tag_before_list.length" class="title" :style="show('title') ? pack.title : ''">
                        <text v-for="(tag, index) in tag_before_list" :key="index" class="tag" :style="pack.tag">{{ tag }}</text>
                        <text v-if="show('title')">{{ view.title }}</text>
                    </view>
                    <view v-if="show_brief_text" class="brief" :style="pack.brief">{{ view.brief }}</view>
                </block>
                <block v-else>
                    <view v-if="show('title') || tag_before_list.length" class="title" :style="show('title') ? pack.title : ''">
                        <text v-for="(tag, index) in tag_before_list" :key="index" class="tag" :style="pack.tag">{{ tag }}</text>
                        <text v-if="show('title')">{{ view.title }}</text>
                    </view>
                    <view v-if="show_brief_text" class="brief" :style="pack.brief">{{ view.brief }}</view>
                    <view class="price-action">
                        <view class="flex-1">
                            <view v-if="show('price') || show('price_label')" class="price-row">
                                <text v-if="show('price_label')" class="member" :style="pack.member">{{ view.label }}</text>
                                <text v-if="show('price')">
                                    <text :style="pack.symbol">{{ view.symbol }}</text>
                                    <text :style="pack.price">{{ view.price }}</text>
                                </text>
                            </view>
                            <text v-if="show('market_price') && view.origin" :style="pack.market">{{ view.origin_symbol }}{{ view.origin }}</text>
                        </view>
                        <view class="actions">
                            <view v-if="show('share')" class="action" :style="pack.action" @tap="share_event">
                                <iconfont :name="share_icon" :size="pack.action_icon" :color="pack.action_color"></iconfont>
                                <text>{{ share_text }}</text>
                            </view>
                            <view v-if="show('collect')" class="action" :style="pack.action" @tap="favor_event">
                                <iconfont :name="collect_icon" :size="pack.action_icon" :color="view.favored ? pack.accent : pack.action_color"></iconfont>
                                <text>{{ view.favored ? '已收藏' : collect_text }}</text>
                            </view>
                        </view>
                    </view>
                </block>
                <view v-if="show_meta_line" class="divider" :style="pack.divider"></view>
                <view v-if="show_meta" class="meta" :style="meta_box">
                    <text v-if="show('views')" :style="pack.meta">浏览量: {{ view.views }}</text>
                    <text v-if="show('stock') && view.show_stock" :style="pack.meta">库存: {{ view.stock }}</text>
                    <text v-if="show('sales') && view.show_sales" :style="pack.meta">销量: {{ view.sales }}</text>
                </view>
                <view v-if="show('tags') && !tag_before && view.tags.length" class="tags">
                    <text v-for="(tag, index) in view.tags" :key="index" class="tag" :style="pack.tag">{{ tag }}</text>
                </view>
                <view v-if="show_sku_line" class="divider" :style="pack.sku_divider"></view>
                <view v-if="theme == '2' && show('sku') && view.sku.length" class="grid" :style="sku_box" @tap="spec_tap">
                    <view v-for="(item, index) in sku_show" :key="index" class="grid-item" :style="grid_item_style">
                        <image v-if="item.img" class="grid-thumb" :class="item.active ? 'active' : ''" :style="sku_img_style + (item.active ? active_border : '')" :src="item.img" mode="aspectFill"></image>
                        <view v-else-if="sku_has_img" :style="sku_img_style"></view>
                        <text class="grid-name" :class="sku_has_img ? '' : 'solo'" :style="name_style(item.active)">{{ item.name }}</text>
                    </view>
                    <view class="more grid-more" :style="grid_more_style">
                        <text>{{ view.sku.length }}款可选</text>
                        <iconfont name="icon-arrow-right" :size="arrow_size" :color="arrow_color"></iconfont>
                    </view>
                </view>
                <view v-if="theme == '4' && show('sku')" class="sku-select" :style="sku_box" @tap="spec_tap">
                    <text>规格</text>
                    <text class="flex-1 sku-text">{{ sku_text }}</text>
                    <iconfont name="icon-arrow-right" size="24rpx" color="#999"></iconfont>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
    import { field_on, show_brief, goods_view, goods_video, media_url, resolve_video_poster, outer_style, card_style, price_pack, hero_height, preview_photos, open_spec, call_page, icon_name, page_vm, visible_sku, indicator_layout, media_indicator_styles, video_ctrl_icons, video_ctrl_styles } from './goods-detail-common.js';
    import GoodsDetailHeroSwiper from './goods-detail-hero-swiper.vue';
    export default {
        components: { GoodsDetailHeroSwiper },
        props: {
            propValue: { type: Object, default: () => ({}) },
            propGoods: { type: Object, default: null },
            propKey: { type: [String, Number], default: '' },
            propIndex: { type: Number, default: 0 },
        },
        data() {
            return {
                photo_index: 0,
                video_playing: false,
                video_paused: false,
                video_muted: false,
                video_fullscreen: false,
            };
        },
        computed: {
            content() { return (this.propValue && this.propValue.content) || {}; },
            style() { return (this.propValue && this.propValue.style) || {}; },
            theme() {
                const theme = String(this.content.theme == null ? '0' : this.content.theme);
                return ['0', '1', '2', '3', '4'].indexOf(theme) === -1 ? '0' : theme;
            },
            view() { return goods_view(this.propGoods); },
            video() { return goods_video(this.propGoods); },
            video_poster() { return resolve_video_poster(this.content, this.propGoods); },
            slide_total() { return this.view.photos.length + (this.video ? 1 : 0); },
            outer() { return outer_style(this.style); },
            /** 对齐 DIY：有相册时信息卡上叠主图 margin-top = 外边距上 - 圆角 */
            card() {
                let style = card_style(this.style);
                if (this.view.photos.length) {
                    const margin = this.style.content_margin || {};
                    const top = Number(margin.margin_top);
                    const margin_top = Number.isFinite(top) ? top : 0;
                    const overlap = margin_top - this.content_radius_px;
                    style += 'margin-top:' + (overlap * 2) + 'rpx;';
                }
                return style;
            },
            pack() { return price_pack(this.style); },
            height() { return hero_height(this.style); },
            vertical() { return this.content.scroll_direction === 'vertical'; },
            is_roll() { return this.content.is_roll != '0'; },
            interval_time() {
                const n = Number(this.content.interval_time);
                return Number.isFinite(n) && n > 0 ? n : 3;
            },
            scroll_duration() {
                const n = Number(this.content.scroll_duration);
                return Number.isFinite(n) && n > 0 ? n : 400;
            },
            indicator_type() {
                const type = String(this.content.indicator_type || 'dot');
                if (type === 'line' || type === 'number' || type === 'media') return type;
                return 'dot';
            },
            show_indicator() {
                const shown = this.content.indicator_show == null ? true : this.content.indicator_show !== false;
                if (!shown) return false;
                if (this.indicator_type === 'media') return this.view.photos.length > 0 || !!this.video;
                return this.slide_total >= 2;
            },
            indicator_class() { return 'is-' + String(this.content.indicator_position || 'center-bottom'); },
            /** 信息卡圆角（px），对齐 DIY --gi-radius */
            content_radius_px() {
                const box = this.style.content_radius;
                if (box && typeof box === 'object') {
                    const n = Math.max(Number(box.radius_top_left) || 0, Number(box.radius_top_right) || 0);
                    return Number.isFinite(n) ? n : 16;
                }
                const n = Number(box);
                return Number.isFinite(n) ? n : 16;
            },
            /** 指示器边距配置（px），允许为 0 */
            indicator_gap_px() {
                if (this.style.indicator_bottom == null || this.style.indicator_bottom === '') return 20;
                const gap = Number(this.style.indicator_bottom);
                return Number.isFinite(gap) ? Math.max(0, gap) : 20;
            },
            /** 相册上叠规格时，把底部指示器抬到规格条上方（对齐 DIY） */
            hero_sku_overlay() {
                if (!this.show('sku') || !this.view.sku.length) return false;
                return this.theme == '0' || this.theme == '3';
            },
            /**
             * DIY:
             * - 无规格：radius + indicator_bottom
             * - 风格0：radius + 52 + indicator_bottom
             * - 风格3：radius + 14 + 8 + sku_img + indicator_bottom
             */
            indicator_lift_bottom_rpx() {
                const r = this.content_radius_px;
                const g = this.indicator_gap_px;
                if (!this.hero_sku_overlay) {
                    return (r + g) * 2;
                }
                if (this.theme == '3') {
                    return (r + 14 + 8 + this.sku_img_px + g) * 2;
                }
                return (r + 52 + g) * 2;
            },
            indicator_box_style() {
                const pos = String(this.content.indicator_position || 'center-bottom');
                if (pos.indexOf('top') >= 0) {
                    return '';
                }
                // 底部指示器（含默认 center-bottom）上移，避免被规格挡住
                if (pos.indexOf('bottom') >= 0 || pos === '' || pos === 'center' || pos === 'left' || pos === 'right') {
                    return 'bottom:' + this.indicator_lift_bottom_rpx + 'rpx;';
                }
                return '';
            },
            line_layout() {
                // extra.bottom 为 px，indicator_layout 内再 *2；与 gap(indicator_bottom) 相加
                const r = this.content_radius_px;
                let bottom = r;
                if (this.theme == '0' && this.show('sku') && this.view.sku.length) {
                    bottom = r + 52;
                } else if (this.theme == '3' && this.show('sku') && this.view.sku.length) {
                    bottom = r + 14 + 8 + this.sku_img_px;
                }
                return indicator_layout(this.content, this.style, { gap: 20, bottom: bottom });
            },
            /** DIY: pad_x = content_padding.padding_left，默认 14 */
            pad_x_px() {
                const pad = this.style.content_padding;
                if (pad && typeof pad === 'object') {
                    const n = Number(pad.padding_left);
                    return Number.isFinite(n) ? n : 14;
                }
                return 14;
            },
            /** DIY: hero-sku bottom = radius + 12，padding: 0 pad_x */
            hero_sku_style() {
                const pad = this.pad_x_px * 2;
                return 'bottom:' + ((this.content_radius_px + 12) * 2) + 'rpx;padding:0 ' + pad + 'rpx;box-sizing:border-box;';
            },
            /** DIY: float-sku bottom = radius + 14，padding: 0 pad_x */
            hero_float_style() {
                const pad = this.pad_x_px * 2;
                return 'bottom:' + ((this.content_radius_px + 14) * 2) + 'rpx;padding:0 ' + pad + 'rpx;box-sizing:border-box;';
            },
            video_label() {
                return this.content.indicator_video_text == null ? '视频' : String(this.content.indicator_video_text);
            },
            album_label() {
                return this.content.indicator_album_text == null ? '图集' : String(this.content.indicator_album_text);
            },
            album_count() {
                const total = this.view.photos.length;
                if (!total) return '';
                if (this.video && this.photo_index === 0) return String(total);
                const pos = this.video ? this.photo_index : this.photo_index + 1;
                return pos + '/' + total;
            },
            album_text() {
                if (this.album_label && this.album_count) return this.album_label + ' ' + this.album_count;
                return this.album_label || this.album_count;
            },
            media_styles() {
                return media_indicator_styles(this.style);
            },
            media_box_style() {
                return this.media_styles.box;
            },
            ctrl_icons() {
                return video_ctrl_icons(this.content);
            },
            ctrl_style() {
                return video_ctrl_styles(this.style);
            },
            show_h5_ctrls() {
                return !!this.video && this.photo_index === 0 && this.video_playing && !this.video_fullscreen;
            },
            h5_pause_img() {
                const icons = this.ctrl_icons || {};
                const item = this.video_paused ? icons.play : icons.pause;
                return (item && item.img) || '';
            },
            h5_mute_img() {
                const icons = this.ctrl_icons || {};
                const item = this.video_muted ? icons.mute : icons.sound;
                return (item && item.img) || '';
            },
            h5_pause_class() {
                return '';
            },
            h5_mute_class() {
                return '';
            },
            h5_pause_text() {
                if (this.h5_pause_img) return '';
                return this.video_paused ? '▶' : '❚❚';
            },
            h5_mute_text() {
                if (this.h5_mute_img) return '';
                return this.video_muted ? '🔇' : '🔊';
            },
            tag_before() { return this.content.tag_position !== 'row'; },
            tag_before_list() { return this.show('tags') && this.tag_before ? this.view.tags : []; },
            sku_show() { return visible_sku(this.view.sku, 6); },
            sku_has_img() {
                return (this.view.sku || []).some((item) => item && item.img);
            },
            sku_text() {
                const picked = [];
                (this.view.levels || []).forEach((level) => {
                    (level.options || []).forEach((opt) => {
                        if (opt.active && opt.name) picked.push(opt.name);
                    });
                });
                if (picked.length) return picked.join(' / ');
                const page = page_vm();
                if (page && page.goods_spec_selected_text) return page.goods_spec_selected_text;
                return '请选择';
            },
            active_color() { return this.style.sku_active_color || '#ff4d4f'; },
            active_border() { return 'border-color:' + this.active_color + ';'; },
            float_active_style() {
                return 'background:' + (this.style.sku_float_active_bg || '#fff') + ';border-color:' + this.active_color + ';';
            },
            show_meta() {
                return (this.show('views') && this.view.views !== '') || (this.show('stock') && this.view.show_stock) || (this.show('sales') && this.view.show_sales);
            },
            show_meta_line() { return this.content.divider_show !== false && this.show_meta; },
            sku_line_on() {
                if (this.content.sku_divider_show == null || this.content.sku_divider_show === '') {
                    return this.content.divider_show !== false;
                }
                return this.content.sku_divider_show !== false;
            },
            has_above_sku() {
                return this.show_meta || this.show_brief_text || (this.show('title') && !!this.view.title) || (this.show('tags') && this.view.tags.length) || this.show('price') || this.show('price_label') || this.show('market_price') || this.show('share') || this.show('collect');
            },
            show_sku_line() {
                if (this.theme !== '2' && this.theme !== '4') return false;
                if (!this.show('sku') || !this.has_above_sku) return false;
                if (this.theme === '2' && !this.view.sku.length) return false;
                return this.sku_line_on;
            },
            sku_box() {
                if (this.theme !== '2' && this.theme !== '4') return '';
                const top = this.show_sku_line ? 0 : (this.has_above_sku ? this.pack.sku_gap : 0);
                return 'margin-top:' + top + 'rpx;';
            },
            sku_img_px() {
                const n = Number(this.style.sku_img_size);
                return Number.isFinite(n) && n > 0 ? n : 44;
            },
            bar_img_px() {
                return Math.max(22, Math.round(this.sku_img_px * 0.64));
            },
            bar_thumb_style() {
                const s = this.bar_img_px * 2;
                return 'width:' + s + 'rpx;height:' + s + 'rpx;margin-right:12rpx;border-radius:8rpx;';
            },
            bar_row_style() {
                return 'gap:16rpx;';
            },
            count_style() {
                const size = this.px(this.style.sku_count_size, 11) * 2;
                const color = this.style.sku_count_color || '#ff4d4f';
                return 'margin-left:4rpx;padding:0;background:transparent;font-size:' + size + 'rpx;color:' + color + ';';
            },
            grid_more_style() {
                const size = this.px(this.style.sku_count_size, 11) * 2;
                const color = this.style.sku_count_color || '#ff4d4f';
                const text = 'padding:0;background:transparent;font-size:' + size + 'rpx;color:' + color + ';';
                if (!this.sku_has_img) {
                    return text + 'height:auto;';
                }
                return text + 'height:' + (this.sku_img_px * 2) + 'rpx;';
            },
            arrow_size() {
                return (this.px(this.style.sku_arrow_size, 12) * 2) + 'rpx';
            },
            arrow_color() {
                return this.style.sku_arrow_color || this.style.sku_count_color || '#ff4d4f';
            },
            sku_img_style() {
                const s = this.sku_img_px * 2;
                return 'width:' + s + 'rpx;height:' + s + 'rpx;';
            },
            theme0_row_style() {
                return 'gap:16rpx;';
            },
            theme0_more_style() {
                if (!this.sku_has_img) {
                    const size = this.px(this.style.sku_count_size, 11) * 2;
                    return 'height:auto;padding:4rpx 16rpx;border-radius:12rpx;font-size:' + size + 'rpx;line-height:1.4;background:rgba(255,255,255,0.92);';
                }
                const s = this.sku_img_px * 2;
                return 'height:' + s + 'rpx;padding:0 16rpx;border-radius:12rpx;font-size:22rpx;line-height:' + s + 'rpx;background:rgba(255,255,255,0.92);';
            },
            grid_item_style() {
                if (!this.sku_has_img) {
                    return '';
                }
                const text = Number(this.style.sku_text_size);
                const text_px = Number.isFinite(text) && text > 0 ? text : 12;
                const width = Math.max(this.sku_img_px, text_px * 4) * 2;
                return 'width:' + width + 'rpx;';
            },
            show_brief_text() { return show_brief(this.content) && !!this.view.brief; },
            meta_box() {
                const top = this.show_meta_line ? 0 : this.pack.meta_gap;
                return this.pack.meta + 'margin-top:' + top + 'rpx;';
            },
            share_text() { return this.content.share_text || '分享'; },
            collect_text() { return this.content.collect_text || '收藏'; },
            share_icon() { return icon_name(this.content.share_icon, 'icon-share-circle'); },
            collect_icon() { return icon_name(this.view.favored ? 'heart' : (this.content.collect_icon || 'collect'), 'icon-heart'); },
        },
        methods: {
            show(key) { return field_on(this.content, key); },
            px(value, fallback) {
                if (value == null || value === '') return fallback;
                const n = Number(value);
                return Number.isFinite(n) ? n : fallback;
            },
            photo_change(index) { this.photo_index = index || 0; },
            photo_preview(index) { preview_photos(this.view.photos, index || 0); },
            media_item_style(on) {
                return on ? this.media_styles.active : this.media_styles.idle;
            },
            media_jump(index) {
                const hero = this.$refs.hero;
                if (hero && hero.jump) hero.jump(index);
            },
            on_ctrl(state) {
                state = state || {};
                this.video_playing = !!state.playing;
                this.video_paused = !!state.paused;
                this.video_muted = !!state.muted;
                this.video_fullscreen = !!state.fullscreen;
            },
            hero_toggle_pause() {
                const hero = this.$refs.hero;
                if (hero && hero.toggle_pause) hero.toggle_pause();
            },
            hero_toggle_mute() {
                const hero = this.$refs.hero;
                if (hero && hero.toggle_mute) hero.toggle_mute();
            },
            mark_style(index) {
                const active = this.style.indicator_active_color == null ? this.pack.accent : this.style.indicator_active_color;
                const idle = this.style.indicator_color == null ? 'rgba(255,255,255,0.75)' : this.style.indicator_color;
                const bg = index == this.photo_index ? active : idle;
                if (this.indicator_type != 'line') {
                    return 'background:' + bg + ';';
                }
                return this.line_layout.item + 'background:' + bg + ';';
            },
            bar_item_style(item) {
                const active = item && item.active;
                const bg = this.style.sku_bg_color || '#f5f5f5';
                const border = active ? this.active_color : 'transparent';
                const box = 'background:' + bg + ';border:1px solid ' + border + ';border-radius:12rpx;margin-right:0;box-sizing:border-box;align-items:center;';
                if (!this.sku_has_img) {
                    return box + 'padding:8rpx 16rpx;';
                }
                const pad = item && item.img ? '6rpx 16rpx 6rpx 6rpx' : '0 16rpx';
                return box + 'padding:' + pad + ';height:' + (this.bar_img_px * 2 + 16) + 'rpx;';
            },
            float_item_style(item) {
                const active = item && item.active;
                let style = active ? this.float_active_style : '';
                if (!this.sku_has_img) {
                    return style;
                }
                const pad = item && item.img ? '8rpx 16rpx 8rpx 8rpx' : '0 16rpx';
                return style + 'height:' + (this.sku_img_px * 2 + 20) + 'rpx;padding:' + pad + ';box-sizing:border-box;align-items:center;';
            },
            theme0_thumb_style(active) {
                const border = 'margin-right:0;border-radius:12rpx;box-sizing:border-box;border:1px solid ' + (active ? this.active_color : 'transparent') + ';';
                if (!this.sku_has_img) {
                    const n = Number(active ? this.style.sku_active_size : this.style.sku_text_size);
                    const px = Number.isFinite(n) && n > 0 ? n : 12;
                    const color = active ? this.active_color : (this.style.sku_text_color || '#333');
                    return border + 'width:auto;height:auto;padding:4rpx 16rpx;font-size:' + (px * 2) + 'rpx;line-height:1.4;color:' + color + ';background:rgba(255,255,255,0.92);';
                }
                const s = this.sku_img_px * 2;
                return border + 'width:' + s + 'rpx;height:' + s + 'rpx;';
            },
            name_style(active) {
                const n = Number(active ? this.style.sku_active_size : this.style.sku_text_size);
                const px = Number.isFinite(n) && n > 0 ? n : 12;
                const color = active ? this.active_color : (this.style.sku_text_color || '');
                return 'font-size:' + (px * 2) + 'rpx;' + (color ? 'color:' + color + ';' : '');
            },
            spec_tap() { open_spec(); },
            share_event(e) { call_page('popup_share_event', e); },
            favor_event(e) { call_page('goods_favor_event', e); },
        },
    };
</script>
<style lang="scss" scoped>
.hero, .swiper, .slide { width: 100%; }
.slide { display: block; }
.indicator { position: absolute; z-index: 2; display: flex; gap: 8rpx; align-items: center; pointer-events: none; }
.video-ctrl-layer {
    position: absolute;
    right: 16rpx;
    bottom: 100rpx;
    z-index: 6;
    display: flex;
    flex-direction: column;
    align-items: center;
    pointer-events: auto;
}
.video-ctrl-layer .horn-btn {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    line-height: 1;
    color: #fff;
    box-sizing: border-box;
}
.video-ctrl-layer .horn-icon {
    color: #fff;
    text-align: center;
    overflow: hidden;
}
.video-ctrl-layer .horn-img {
    display: block;
}
.indicator.is-line { left: auto; right: auto; top: auto; bottom: auto; gap: 0; }
.indicator.is-center-bottom { left: 0; right: 0; bottom: 24rpx; justify-content: center; }
.media-switch { display: flex; flex-direction: row; align-items: center; box-sizing: border-box; pointer-events: auto; }
.media-item { box-sizing: border-box; text-align: center; pointer-events: auto; }
.indicator .num, .indicator .dot, .indicator .line { pointer-events: auto; }
.indicator.is-left-bottom { left: 24rpx; bottom: 24rpx; }
.indicator.is-right-bottom { right: 24rpx; bottom: 24rpx; }
.indicator.is-center-top { left: 0; right: 0; top: 24rpx; justify-content: center; }
.dot { width: 12rpx; height: 12rpx; border-radius: 50%; background: rgba(255,255,255,0.75); }
.line { width: 28rpx; height: 6rpx; border-radius: 6rpx; background: rgba(255,255,255,0.75); }
.num { color: #fff; background: rgba(0,0,0,0.45); border-radius: 20rpx; padding: 4rpx 16rpx; font-size: 22rpx; }
.hero-sku, .hero-float { position: absolute; left: 0; right: 0; z-index: 3; white-space: nowrap; }
.sku-row, .price-row, .meta, .tags, .grid, .price-action, .actions, .sku-select { display: flex; flex-direction: row; align-items: center; }
.thumb { width: 88rpx; height: 88rpx; border-radius: 12rpx; margin-right: 12rpx; background: #fff; box-sizing: border-box; }
.thumb.theme0 { margin-right: 0; }
.thumb-name { display: flex; align-items: center; justify-content: center; overflow: hidden; font-size: 20rpx; color: #333; text-align: center; line-height: 1.2; background: rgba(255,255,255,0.92); }
.thumb.sm { width: 56rpx; height: 56rpx; margin-right: 12rpx; border-radius: 8rpx; }
.thumb.active { border: 1px solid #ff4d4f; }
.more { font-size: 22rpx; color: #666; background: rgba(255,255,255,0.9); border-radius: 8rpx; padding: 8rpx 12rpx; }
.card { width: 100%; position: relative; z-index: 3; }
.price-row { flex-wrap: wrap; gap: 8rpx; }
.title { margin-top: 12rpx; line-height: 1.45; }
.brief { line-height: 1.5; }
.tag { display: inline-block; margin-right: 12rpx; }
.meta, .tags { justify-content: space-between; flex-wrap: wrap; }
.tags { margin-top: 16rpx; }
.tags { justify-content: flex-start; gap: 12rpx; }
.divider { height: 1px; }
.bar-item, .float-item { display: inline-flex; flex-direction: row; align-items: center; margin-right: 0; padding: 6rpx 16rpx 6rpx 6rpx; background: #f5f5f5; border-radius: 12rpx; font-size: 24rpx; border: 1px solid transparent; box-sizing: border-box; }
.float-item.active { border: 1px solid #ff4d4f; }
.float-item { margin-right: 16rpx; padding: 8rpx 16rpx; border-radius: 16rpx; background: rgba(255,255,255,0.92); max-width: 280rpx; }
.float-img { border-radius: 8rpx; margin-right: 12rpx; flex-shrink: 0; }
.grid { flex-wrap: nowrap; gap: 24rpx; margin-top: 16rpx; align-items: flex-start; }
.grid-item { flex-shrink: 0; display: flex; flex-direction: column; align-items: center; }
.grid-thumb { border-radius: 12rpx; background: #f4fcff; }
.grid-thumb.active { border: 1px solid #ff4d4f; }
.grid-name { margin-top: 12rpx; width: 100%; overflow: hidden; white-space: nowrap; text-align: center; line-height: 1.3; }
.grid-name.solo { margin-top: 0; }
.grid-more, .bar-count { display: inline-flex; flex-direction: row; align-items: center; }
.price-action { justify-content: space-between; margin-top: 16rpx; }
.actions { gap: 24rpx; }
.action { display: flex; flex-direction: column; align-items: center; }
.member { margin-right: 8rpx; }
.sku-select { margin-top: 16rpx; }
.sku-text { margin: 0 12rpx; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; color: #666; }
.sku-scroll { white-space: nowrap; margin-bottom: 16rpx; }
.flex-1 { flex: 1; min-width: 0; }
</style>
