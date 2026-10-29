<template>
    <view v-if="propGoods" class="oh" :style="outer.container">
        <view :style="outer.img">
            <view class="wrap" :style="wrap_style">
                <view v-if="show_header" class="header" :style="header_box_style">
                    <view v-if="show_header_row" class="header-row" :class="'align-' + header_align" @tap="more_event">
                        <view class="header-left">
                            <view v-if="show_title_bar && title_bar_type == 'line'" class="title-bar" :style="title_bar_style"></view>
                            <image v-else-if="show_title_bar && title_bar_img" class="title-bar-img" :style="title_bar_img_style" :src="title_bar_img" mode="heightFix"></image>
                            <view v-else-if="show_title_bar && title_bar_icon" class="title-mark">
                                <iconfont :name="title_bar_icon" :size="title_bar_icon_size" :color="title_bar_icon_color"></iconfont>
                            </view>
                            <text v-if="show('title') && title_text" class="header-text" :style="title_style">{{ title_text }}</text>
                            <text v-if="show('count')" class="header-text" :style="count_style">({{ view.comment_count }})</text>
                        </view>
                        <view v-if="show_header_right" class="header-right" :class="{ pill: show_rate_pill }" :style="header_right_style">
                            <text v-if="header_right_text" class="header-text">{{ header_right_text }}</text>
                            <iconfont :name="'icon-arrow-right'" :size="arrow_size" :color="arrow_color"></iconfont>
                        </view>
                    </view>
                    <view v-if="show_score_panel" class="score-panel" :style="score_panel_style" @tap="more_event">
                        <view class="score-num-box">
                            <text class="score-num" :style="score_num_style">{{ view.comment_avg }}</text>
                            <view v-if="show('score')" class="stars">
                                <text v-for="s in 5" :key="s" class="star" :style="star_style(view.comment_avg, s)">★</text>
                            </view>
                        </view>
                        <view class="score-side">
                            <view v-if="show('rate')" class="score-line">
                                <text class="line-1" :style="rate_style">{{ score_rate_text }}</text>
                            </view>
                            <view v-if="show('count')" class="score-line">
                                <text class="line-1" :style="count_style">共 {{ view.comment_count }} 条评价</text>
                            </view>
                        </view>
                    </view>
                </view>
                <view class="body" :style="body_style">
                    <scroll-view v-if="show_list && list_theme == '5' && comments.length" scroll-x class="slide-scroll" :show-scrollbar="false">
                        <view class="slide-row" :style="list_style">
                            <view v-for="(item, index) in comments" :key="index" class="slide" :style="slide_item_style">
                                <view v-if="show_user_row(item)" class="user">
                                    <image v-if="show('avatar') && item.avatar" class="avatar" :style="avatar_style" :src="item.avatar" mode="aspectFill"></image>
                                    <view v-else-if="show('avatar')" class="avatar" :style="avatar_style"></view>
                                    <view class="user-stack">
                                        <text v-if="show('nickname')" class="line-1" :style="nickname_style">{{ item.nickname }}</text>
                                        <view v-if="show('score')" class="stars">
                                            <text v-for="s in 5" :key="s" class="star" :style="star_style(item.score, s)">★</text>
                                        </view>
                                    </view>
                                </view>
                                <view v-if="show('content')" class="content line-2" :style="content_style">{{ item.content }}</view>
                                <view v-if="show('images') && item.images.length" class="imgs" :style="imgs_style">
                                    <view v-for="(img, ix) in item.preview" :key="ix" class="img-box" :style="img_box_style">
                                        <image class="img" :src="img" mode="aspectFill" :data-index="index" :data-ix="ix" @tap.stop="preview"></image>
                                        <view v-if="ix == 3 && item.more > 0" class="more-mask" :style="more_mask_style">+{{ item.more }}</view>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </scroll-view>
                    <view v-else-if="show_list && comments.length" class="list" :style="list_style">
                        <view v-for="(item, index) in comments" :key="index" class="item" :style="item_style_of(index)">
                            <view v-if="show_user_row(item)" class="user">
                                <image v-if="show('avatar') && item.avatar" class="avatar" :style="avatar_style" :src="item.avatar" mode="aspectFill"></image>
                                <view v-else-if="show('avatar')" class="avatar" :style="avatar_style"></view>
                                <view v-if="user_layout == 'stack'" class="user-stack">
                                    <text v-if="show('nickname')" class="line-1" :style="nickname_style">{{ item.nickname }}</text>
                                    <view v-if="show('score')" class="stars">
                                        <text v-for="s in 5" :key="s" class="star" :style="star_style(item.score, s)">★</text>
                                    </view>
                                </view>
                                <view v-else-if="user_layout == 'content'" class="user-stack">
                                    <view class="user-inline">
                                        <text v-if="show('nickname')" class="line-1" :style="nickname_style">{{ item.nickname }}</text>
                                        <view v-if="show('score')" class="stars">
                                            <text v-for="s in 5" :key="s" class="star" :style="star_style(item.score, s)">★</text>
                                        </view>
                                    </view>
                                    <view v-if="show('content')" class="content line-2" :style="content_style">{{ item.content }}</view>
                                </view>
                                <view v-else-if="user_layout == 'time'" class="user-inline">
                                    <text v-if="show('nickname')" class="line-1 nick-shrink" :style="nickname_style">{{ item.nickname }}</text>
                                    <view v-if="show('score')" class="stars">
                                        <text v-for="s in 5" :key="s" class="star" :style="star_style(item.score, s)">★</text>
                                    </view>
                                    <text v-if="show('time')" class="time" :style="time_style">{{ item.time }}</text>
                                </view>
                                <view v-else class="user-inline" :class="{ 'score-right': list_theme == '2' }">
                                    <text v-if="show('nickname')" class="line-1" :class="{ 'nick-grow': list_theme == '2' }" :style="nickname_style">{{ item.nickname }}</text>
                                    <view v-if="show('score')" class="stars">
                                        <text v-for="s in 5" :key="s" class="star" :style="star_style(item.score, s)">★</text>
                                    </view>
                                </view>
                            </view>
                            <view v-if="show('content') && list_theme != '3'" class="content line-2" :style="content_style + (list_theme == '4' ? content_indent : '')">{{ item.content }}</view>
                            <view v-if="show('images') && item.images.length" class="imgs" :style="imgs_style + (list_theme == '4' ? content_indent : '')">
                                <view v-for="(img, ix) in item.preview" :key="ix" class="img-box" :style="img_box_style">
                                    <image class="img" :src="img" mode="aspectFill" :data-index="index" :data-ix="ix" @tap.stop="preview"></image>
                                    <view v-if="ix == 3 && item.more > 0" class="more-mask" :style="more_mask_style">+{{ item.more }}</view>
                                </view>
                            </view>
                        </view>
                    </view>
                    <view v-else-if="show_list" class="empty" :style="empty_style">{{ $t('common.no_data') }}</view>
                    <view v-if="show_review" class="review" :style="review_style" :data-value="review_url" @tap.stop="review_event">
                        <text>{{ review_text }}</text>
                        <image v-if="review_img" class="review-img" :style="review_img_style" :src="review_img" mode="aspectFit"></image>
                        <iconfont v-else-if="review_icon" :name="review_icon" :size="review_icon_size" :color="review_icon_color"></iconfont>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
    import { gradient_handle, background_computer, padding_computer, radius_computer, margin_computer } from '@/common/js/common/common.js';
    import { field_on, goods_view, outer_style, open_comments, page_vm, media_url, icon_name } from './goods-detail-common.js';
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
            view() { return goods_view(this.propGoods); },
            header_theme() {
                const theme = String(this.content.header_theme == null ? '0' : this.content.header_theme);
                return theme === '1' || theme === '2' ? theme : '0';
            },
            list_theme() {
                const theme = String(this.content.list_theme == null ? '0' : this.content.list_theme);
                return ['0', '1', '2', '3', '4', '5'].indexOf(theme) === -1 ? '0' : theme;
            },
            header_align() {
                const align = String(this.content.header_align || 'left');
                return align === 'center' || align === 'right' ? align : 'left';
            },
            user_layout() {
                if (this.list_theme === '0' || this.list_theme === '5') return 'stack';
                if (this.list_theme === '3') return 'content';
                if (this.list_theme === '4') return 'time';
                return 'inline';
            },
            use_line() { return this.list_theme === '1' || this.list_theme === '4'; },
            comments() {
                return (this.view.comments || []).map((item) => {
                    const images = this.image_list(item && item.images);
                    const user = (item && item.user) || {};
                    return {
                        nickname: user.user_name_view || '',
                        avatar: user.avatar || '',
                        score: Number(item && item.rating) || 0,
                        time: (item && item.add_time_date) || '',
                        content: (item && item.content) || '',
                        images: images,
                        preview: images.slice(0, 4),
                        more: images.length > 4 ? images.length - 4 : 0,
                    };
                });
            },
            title_text() {
                if (this.content.title_text == null) return '商品评价';
                return String(this.content.title_text);
            },
            right_text() {
                if (this.content.right_text == null) return this.header_theme === '1' ? '查看全部' : '好评率';
                return String(this.content.right_text);
            },
            rate_text() {
                const rate = this.view.comment_rate;
                if (rate == null || rate === '') return '0%';
                const text = String(rate);
                return text.indexOf('%') >= 0 ? text : text + '%';
            },
            header_right_text() {
                if (this.header_theme === '1') return this.right_text;
                if (!this.right_text) return this.rate_text;
                return this.rate_text + ' ' + this.right_text;
            },
            score_rate_text() {
                const label = this.header_theme === '1' ? '好评率' : this.right_text;
                return label ? this.rate_text + ' ' + label : this.rate_text;
            },
            show_title_bar() { return String(this.content.title_bar_show == null ? '1' : this.content.title_bar_show) !== '0'; },
            show_rate_pill() { return (this.header_theme === '0' || this.header_theme === '2') && this.show('rate'); },
            show_header_right() { return this.header_theme === '1' || this.show('rate'); },
            show_header_left() { return this.show_title_bar || (this.show('title') && !!this.title_text) || this.show('count'); },
            show_header_row() { return this.show_header_left || this.show_header_right; },
            show_score_panel() { return this.list_theme === '2' && String(this.content.score_panel_show == null ? '1' : this.content.score_panel_show) !== '0'; },
            show_header() { return this.show_header_row || this.show_score_panel; },
            show_list() {
                return this.show('avatar') || this.show('nickname') || this.show('score') || this.show('time') || this.show('content') || this.show('images');
            },
            empty_style() {
                return 'color:' + (this.style.content_color || '#999') + ';font-size:' + (this.px(this.style.content_size, 12) * 2) + 'rpx;';
            },
            title_bar_type() { return this.content.title_bar_type === 'img-icon' ? 'img-icon' : 'line'; },
            title_bar_img() { return media_url(this.content.title_bar_img); },
            title_bar_icon() {
                const name = this.content.title_bar_icon;
                if (name == null || name === '') return '';
                return icon_name(name, '');
            },
            title_bar_icon_size() { return (this.px(this.style.title_bar_size, 14) * 2) + 'rpx'; },
            title_bar_icon_color() { return this.style.title_bar_icon_color || this.style.title_bar_color || 'rgba(255,105,120,1)'; },
            title_bar_img_style() {
                const s = this.px(this.style.title_bar_size, 14) * 2;
                return 'height:' + s + 'rpx;width:auto;max-width:100%;';
            },
            title_bar_style() {
                const bar = this.px(this.style.title_bar_size, 14);
                const title = this.px(this.style.title_size, 15);
                const h = Math.max(bar, Math.round(title * 0.9)) * 2;
                const c1 = this.style.title_bar_color || 'rgba(255,105,120,1)';
                const c2 = this.style.title_bar_color_end || '';
                const bg = c2 ? 'linear-gradient(180deg,' + c1 + ',' + c2 + ')' : c1;
                return 'width:6rpx;height:' + h + 'rpx;background:' + bg + ';';
            },
            title_style() {
                const size = this.px(this.style.title_size, 15);
                const rate = this.px(this.style.rate_size, 12);
                const line = Math.max(size, rate, 20) * 2;
                return 'color:' + (this.style.title_color || '#333') + ';font-size:' + (size * 2) + 'rpx;font-weight:' + (this.style.title_weight || 'bold') + ';line-height:' + line + 'rpx;';
            },
            count_style() {
                const size = this.px(this.style.count_size, 12);
                const line = Math.max(this.px(this.style.title_size, 15), this.px(this.style.rate_size, 12), 20) * 2;
                return 'color:' + (this.style.count_color || '#999') + ';font-size:' + (size * 2) + 'rpx;line-height:' + line + 'rpx;';
            },
            rate_color() {
                return this.style.rate_color || (this.header_theme === '2' ? 'rgba(255,77,79,1)' : 'rgba(153,153,153,1)');
            },
            rate_style() {
                const size = this.px(this.style.rate_size, 12);
                const line = Math.max(this.px(this.style.title_size, 15), size, 20) * 2;
                return 'color:' + this.rate_color + ';font-size:' + (size * 2) + 'rpx;line-height:' + line + 'rpx;';
            },
            header_right_style() {
                if (!this.show_rate_pill) return this.rate_style;
                const box = this.rate_box();
                const radius = this.style.rate_radius && typeof this.style.rate_radius === 'object' ? this.style.rate_radius : box.radius;
                const pad = this.style.rate_padding && typeof this.style.rate_padding === 'object' ? this.style.rate_padding : box.padding;
                const bg = this.style.rate_pill_bg ? 'background:' + this.style.rate_pill_bg + ';' : (box.bg ? 'background:' + box.bg + ';' : '');
                return bg + this.rate_style + radius_computer(radius) + padding_computer(pad);
            },
            arrow_size() { return (this.px(this.style.arrow_size, 12) * 2) + 'rpx'; },
            arrow_color() { return this.style.arrow_color || this.rate_color; },
            wrap_style() {
                const radius = this.corner(this.style.content_radius, 0);
                const gap = this.px(this.style.header_gap, 8) * 2;
                return radius_computer(radius) + 'overflow:hidden;gap:' + gap + 'rpx;';
            },
            header_box_style() {
                const colors = Array.isArray(this.style.header_color_list) ? this.style.header_color_list : (this.style.header_bg ? [{ color: this.style.header_bg }] : []);
                const gradient = this.has_color(colors) ? gradient_handle(colors, this.style.header_direction || '90deg') : '';
                const imgs = this.style.header_background_img || [];
                const img = Array.isArray(imgs) && imgs.length ? background_computer({ background_img: imgs, background_img_style: this.style.header_background_img_style || '2' }) : '';
                const radius = this.style.header_radius && typeof this.style.header_radius === 'object' ? radius_computer(this.style.header_radius) : '';
                const pad = this.style.header_padding && typeof this.style.header_padding === 'object' ? padding_computer(this.style.header_padding) : 'padding:0;box-sizing:border-box;';
                return gradient + img + radius + pad + 'overflow:hidden;box-sizing:border-box;';
            },
            body_style() {
                const colors = this.style.content_color_list || [];
                const gradient = this.has_color(colors) ? gradient_handle(colors, this.style.content_direction || '90deg') : '';
                const imgs = this.style.content_background_img || [];
                const img = Array.isArray(imgs) && imgs.length ? background_computer({ background_img: imgs, background_img_style: this.style.content_background_img_style || '2' }) : '';
                const margin = this.style.content_margin && typeof this.style.content_margin === 'object' ? margin_computer(this.style.content_margin) : '';
                const pad = this.style.content_padding && typeof this.style.content_padding === 'object' ? padding_computer(this.style.content_padding) : 'padding:0 0 28rpx 0;box-sizing:border-box;';
                return gradient + img + margin + pad + 'box-sizing:border-box;gap:24rpx;';
            },
            list_style() {
                const gap = this.px(this.style.item_gap, this.use_line ? 0 : 10) * 2;
                if (this.list_theme === '5') return 'gap:' + gap + 'rpx;';
                if (this.use_line) {
                    const bg = this.style.item_bg || 'rgba(255,255,255,1)';
                    return 'background:' + bg + ';' + radius_computer(this.item_radius(10)) + 'overflow:hidden;';
                }
                return 'gap:' + gap + 'rpx;';
            },
            inner_gap() {
                return 'gap:' + (this.list_theme === '0' ? 16 : 12) + 'rpx;';
            },
            item_style() {
                const bg = this.style.item_bg ? 'background:' + this.style.item_bg + ';' : '';
                return bg + radius_computer(this.item_radius(10)) + this.item_padding() + this.inner_gap + 'box-sizing:border-box;';
            },
            divider_color() {
                const color = this.style.divider_color;
                if (color == null || color === '' || color === 'rgba(240, 240, 240, 1)' || color === 'rgba(238, 238, 238, 1)' || color === '#f0f0f0' || color === '#eee') {
                    return 'rgba(247, 247, 247, 1)';
                }
                return color;
            },
            item_line_style() {
                return this.item_padding() + this.inner_gap + 'box-sizing:border-box;border-bottom:1px solid ' + this.divider_color + ';';
            },
            slide_item_style() {
                const bg = this.style.item_bg ? 'background:' + this.style.item_bg + ';' : '';
                const width = this.px(this.style.slide_width, 260) * 2;
                return bg + radius_computer(this.item_radius(12)) + this.item_padding() + this.inner_gap + 'width:' + width + 'rpx;box-sizing:border-box;';
            },
            nickname_style() {
                return 'color:' + (this.style.nickname_color || '#333') + ';font-size:' + (this.px(this.style.nickname_size, 13) * 2) + 'rpx;';
            },
            content_style() {
                return 'color:' + (this.style.content_text_color || '#333') + ';font-size:' + (this.px(this.style.content_text_size, 13) * 2) + 'rpx;line-height:1.5;';
            },
            time_style() {
                return 'color:' + (this.style.time_color || '#999') + ';font-size:' + (this.px(this.style.time_size, 11) * 2) + 'rpx;';
            },
            star_active_style() {
                return 'color:' + (this.style.star_active_color || '#ff4d4f') + ';font-size:' + (this.px(this.style.star_size, 12) * 2) + 'rpx;';
            },
            star_inactive_style() {
                return 'color:' + (this.style.star_inactive_color || '#dcdcdc') + ';font-size:' + (this.px(this.style.star_size, 12) * 2) + 'rpx;';
            },
            avatar_style() {
                const size = this.px(this.style.avatar_size, 32) * 2;
                return 'width:' + size + 'rpx;height:' + size + 'rpx;';
            },
            img_box_style() {
                const size = this.px(this.style.img_size, 64) * 2;
                const radius = this.px(this.style.img_radius, 6) * 2;
                return 'width:' + size + 'rpx;height:' + size + 'rpx;border-radius:' + radius + 'rpx;';
            },
            imgs_style() {
                return 'gap:' + (this.px(this.style.img_gap, 6) * 2) + 'rpx;';
            },
            more_mask_style() {
                return 'background:' + (this.style.more_mask_color || 'rgba(0,0,0,0.45)') + ';color:' + (this.style.more_text_color || '#fff') + ';';
            },
            content_indent() {
                if (!this.show('avatar')) return '';
                const indent = (this.px(this.style.avatar_size, 32) + 8) * 2;
                return 'padding-left:' + indent + 'rpx;';
            },
            score_panel_style() {
                return 'background:' + (this.style.score_panel_bg || 'rgba(255,245,245,1)') + ';' + radius_computer(this.item_radius(10)) + 'padding:24rpx;margin-top:20rpx;box-sizing:border-box;';
            },
            score_num_style() {
                return 'color:' + (this.style.score_num_color || '#ff4d4f') + ';font-size:' + (this.px(this.style.score_num_size, 28) * 2) + 'rpx;font-weight:bold;line-height:1;';
            },
            review_text() {
                if (this.content.review_text == null) return '我要评价';
                return String(this.content.review_text);
            },
            review_img() { return media_url(this.content.review_img); },
            review_icon() {
                if (this.content.review_icon == null) return icon_name('arrow-right', '');
                if (this.content.review_icon === '') return '';
                return icon_name(this.content.review_icon, '');
            },
            review_icon_size() { return (this.px(this.style.review_arrow_size, 12) * 2) + 'rpx'; },
            review_icon_color() { return this.style.review_arrow_color || this.style.action_color || 'rgba(153,153,153,1)'; },
            review_img_style() {
                const s = this.px(this.style.review_arrow_size, 12) * 2;
                return 'width:' + s + 'rpx;height:' + s + 'rpx;';
            },
            show_review() {
                if (String(this.content.review_show) === '0') return false;
                if (!String(this.review_text || '').trim()) return false;
                const page = page_vm();
                const data = page && page.plugins_intellectstools_data;
                return data != null && (data.is_comments_add || 0) == 1 && !!(this.propGoods && this.propGoods.id);
            },
            review_url() {
                const id = this.propGoods && this.propGoods.id ? this.propGoods.id : '';
                return '/pages/plugins/intellectstools/goods-comments/goods-comments?goods_id=' + id;
            },
            review_style() {
                const bg = this.style.review_bg ? 'background:' + this.style.review_bg + ';' : '';
                const width = this.style.review_width === 'auto' ? 'width:fit-content;max-width:100%;align-self:center;' : 'width:100%;';
                const color = this.style.action_color || 'rgba(153,153,153,1)';
                const size = this.px(this.style.action_size, 13) * 2;
                const radius = this.style.review_radius && typeof this.style.review_radius === 'object' ? radius_computer(this.style.review_radius) : '';
                const pad = this.style.review_padding && typeof this.style.review_padding === 'object' ? padding_computer(this.style.review_padding) : '';
                return bg + width + 'color:' + color + ';font-size:' + size + 'rpx;' + radius + pad + 'box-sizing:border-box;';
            },
            outer() { return outer_style(this.style); },
        },
        methods: {
            show(key) { return field_on(this.content, key); },
            px(value, fallback) {
                if (value == null || value === '') return fallback;
                const n = Number(value);
                return Number.isFinite(n) ? n : fallback;
            },
            corner(value, fallback) {
                if (value && typeof value === 'object') return value;
                const n = Number(value);
                const r = Number.isFinite(n) ? n : fallback;
                return { radius: r, radius_top_left: r, radius_top_right: r, radius_bottom_right: r, radius_bottom_left: r };
            },
            item_radius(fallback) {
                return this.corner(this.style.item_radius, this.list_theme === '5' ? 12 : fallback);
            },
            item_padding() {
                const pad = this.style.item_padding;
                if (typeof pad === 'number') {
                    return padding_computer({ padding_top: pad, padding_right: pad, padding_bottom: pad, padding_left: pad });
                }
                if (pad && typeof pad === 'object') return padding_computer(pad);
                return 'padding:24rpx;box-sizing:border-box;';
            },
            rate_box() {
                const capsule = this.header_theme === '2';
                const n = capsule ? 20 : 0;
                const radius = { radius: n, radius_top_left: n, radius_top_right: n, radius_bottom_right: n, radius_bottom_left: n };
                const side = capsule ? 10 : 0;
                return {
                    bg: capsule ? 'rgba(255,240,240,1)' : '',
                    radius: radius,
                    padding: { padding_top: 0, padding_right: side, padding_bottom: 0, padding_left: side },
                };
            },
            has_color(list) {
                return Array.isArray(list) && list.some((item) => item && item.color);
            },
            image_list(images) {
                let list = images;
                if (!list) return [];
                if (typeof list === 'string') {
                    try { list = JSON.parse(list); } catch (e) { return list ? [list] : []; }
                }
                if (!Array.isArray(list)) return [];
                return list.map((img) => {
                    if (!img) return '';
                    if (typeof img === 'string') return img;
                    return img.url || img.src || img.images || '';
                }).filter(Boolean);
            },
            show_user_row() {
                return this.show('avatar') || this.show('nickname') || this.show('score') || (this.list_theme === '4' && this.show('time')) || (this.list_theme === '3' && this.show('content'));
            },
            star_style(score, index) {
                return index <= Math.round(Number(score) || 0) ? this.star_active_style : this.star_inactive_style;
            },
            item_style_of(index) {
                if (this.use_line) {
                    const last = index === this.comments.length - 1;
                    return this.item_line_style + (last ? 'border-bottom:none;' : '');
                }
                return this.item_style;
            },
            more_event() { open_comments(this.propGoods); },
            review_event(e) {
                const page = page_vm();
                if (page && typeof page.url_event === 'function') {
                    page.url_event(e);
                    return;
                }
                const app = getApp();
                if (app && app.globalData && typeof app.globalData.url_event === 'function') {
                    app.globalData.url_event(e);
                }
            },
            preview(e) {
                const index = e.currentTarget.dataset.index || 0;
                const ix = e.currentTarget.dataset.ix || 0;
                const images = (this.comments[index] && this.comments[index].images) || [];
                if (!images.length) return;
                uni.previewImage({ current: images[ix], urls: images });
            },
        },
    };
</script>
<style lang="scss" scoped>
.wrap, .header, .body, .list { width: 100%; box-sizing: border-box; }
.wrap, .body, .header, .list { display: flex; flex-direction: column; }
.header-row, .header-left, .header-right, .user, .user-inline, .stars, .imgs, .slide-row, .score-panel { display: flex; flex-direction: row; align-items: center; }
.header-row { width: 100%; min-height: 40rpx; justify-content: flex-start; }
.header-row.align-left { justify-content: space-between; }
.header-row.align-right .header-left { flex: 1; justify-content: flex-end; }
.header-row.align-center { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; }
.header-row.align-center .header-left { grid-column: 2; justify-content: center; }
.header-row.align-center .header-right { grid-column: 3; justify-self: end; }
.header-left { min-width: 0; max-width: 100%; gap: 12rpx; }
.header-right { flex-shrink: 0; gap: 4rpx; white-space: nowrap; }
.header-text { display: inline-block; }
.title-bar { border-radius: 4rpx; flex-shrink: 0; align-self: center; }
.title-bar-img { flex: 0 1 auto; min-width: 0; max-width: 100%; align-self: center; }
.title-mark { flex-shrink: 0; }
.score-panel { width: 100%; align-items: center; gap: 24rpx; }
.score-num-box { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; gap: 4rpx; }
.score-side { flex: 1; min-width: 0; display: flex; flex-direction: column; align-items: flex-start; gap: 8rpx; }
.score-line { width: 100%; }
.user { width: 100%; gap: 16rpx; align-items: center; }
.user-stack { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4rpx; }
.user-inline { flex: 1; min-width: 0; gap: 12rpx; }
.user-inline.score-right { justify-content: space-between; }
.nick-grow { flex: 1; min-width: 0; }
.nick-shrink { flex-shrink: 0; }
.avatar { border-radius: 50%; background: #f5f5f5; flex-shrink: 0; overflow: hidden; }
.stars { gap: 4rpx; flex-shrink: 0; }
.star { line-height: 1; }
.time { flex: 1; min-width: 0; text-align: right; white-space: nowrap; }
.content { width: 100%; }
.item, .slide { min-width: 0; box-sizing: border-box; display: flex; flex-direction: column; }
.imgs { width: 100%; flex-wrap: wrap; }
.img-box { position: relative; overflow: hidden; background: #f5f5f5; flex-shrink: 0; }
.img { width: 100%; height: 100%; }
.more-mask { position: absolute; left: 0; top: 0; right: 0; bottom: 0; display: flex; align-items: center; justify-content: center; font-size: 26rpx; font-weight: 600; }
.slide-scroll { width: 100%; white-space: nowrap; }
.slide-row { display: inline-flex; flex-wrap: nowrap; }
.slide { flex-shrink: 0; white-space: normal; }
.line-1 { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.line-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; white-space: normal; }
.empty { text-align: center; padding: 24rpx 0; }
.review { display: flex; flex-direction: row; align-items: center; justify-content: center; margin-top: 8rpx; gap: 4rpx; }
.review-img { flex-shrink: 0; }
</style>
