<template>
    <view v-if="!isEmpty(list)" class="oh" :style="style_container">
        <view :style="style_img_container">
            <view :class="outer_class" :style="outer_style">
                <template v-if="theme != '2'">
                    <view v-for="(item, index) in list" :key="'feed-' + index" class="oh sns-feed-card" :style="layout_style">
                        <view class="oh wh-auto flex-col gap-10" :style="layout_img_style">
                            <view v-if="is_show('user')" class="flex-row align-c gap-10" :data-value="item.user_home_url || ''" @tap.stop="url_event">
                                <image class="sns-feed-avatar" :style="avatar_style" :src="user_avatar(item)" mode="aspectFill"></image>
                                <text :style="user_style">{{ user_name(item) }}</text>
                            </view>
                            <view :class="title_class" :style="title_style" :data-value="item.url || ''" @tap.stop="url_event">{{ item.content || item.title }}</view>
                            <view v-if="is_show('topic') && topic_list(item).length" class="flex-row flex-wrap" :style="topic_box_style" @tap.stop="">
                                <text v-for="(topic, ti) in topic_list(item)" :key="ti" class="sns-feed-topic" :style="topic_style" :data-value="topic_url(item, ti)" @tap.stop="url_event">#{{ topic.name || topic }}</text>
                            </view>
                            <view v-if="is_show('images') && image_list(item).length" class="sns-feed-media" :style="media_grid_style" @tap.stop="">
                                <image v-for="(img, ii) in image_list(item)" :key="ii" class="sns-feed-media-item" :style="images_radius_style" :src="img" mode="aspectFill" @tap.stop="preview_images_event(item, ii)"></image>
                            </view>
                            <view v-if="is_show('video') && item.video_url" class="sns-feed-video" :style="video_radius_style" @tap.stop="">
                                <video class="sns-feed-video-el" :src="item.video_url" :poster="cover_url(item) || ''" controls object-fit="cover"></video>
                            </view>
                            <view v-if="is_show('goods') && goods_info(item)" class="sns-feed-goods flex-row align-c" :style="goods_box_style" @tap.stop="">
                                <image v-if="goods_info(item).images" class="sns-feed-goods-cover" :style="goods_img_style" :src="goods_info(item).images" mode="aspectFill" :data-value="goods_info(item).url || ''" @tap.stop="url_event"></image>
                                <view class="flex-1 flex-width text-line-1" :style="goods_style" :data-value="goods_info(item).url || ''" @tap.stop="url_event">{{ goods_info(item).title }}</view>
                                <view class="sns-feed-goods-buy flex-row align-c jc-c" :style="goods_buy_style" :data-value="goods_info(item).url || ''" @tap.stop="url_event">
                                    <text v-if="goods_buy_is_text">{{ goods_buy_label_text }}</text>
                                    <image v-else-if="goods_buy_label_img" class="sns-feed-goods-buy-icon" :style="goods_buy_icon_box" :src="goods_buy_label_img" mode="aspectFit"></image>
                                    <iconfont v-else-if="goods_buy_label_icon" :name="'icon-' + goods_buy_label_icon" :size="goods_buy_icon_size * 2 + 'rpx'" :color="goods_buy_icon_color" propClass="va-m"></iconfont>
                                    <text v-else>{{ goods_buy_label_text }}</text>
                                </view>
                            </view>
                            <view v-if="meta_visible" class="sns-feed-meta flex-row flex-wrap align-c gap-10" :style="meta_box_style" @tap.stop="">
                                <view v-for="m in meta_items(item)" :key="m.key" class="sns-meta-item flex-row align-c">
                                    <template v-if="meta_number_left(m.key)">
                                        <text :style="meta_number_style(m.key)">{{ m.count }}</text>
                                        <text v-if="meta_is_text(m.key)" :style="meta_label_style(m.key)">{{ meta_label_text(m.key) }}</text>
                                        <image v-else-if="meta_label_img(m.key)" class="sns-meta-icon" :style="meta_label_icon_box(m.key)" :src="meta_label_img(m.key)" mode="aspectFit"></image>
                                        <iconfont v-else-if="meta_label_icon(m.key)" :name="'icon-' + meta_label_icon(m.key)" :size="meta_icon_size(m.key) * 2 + 'rpx'" :color="meta_icon_color(m.key)" propClass="va-m"></iconfont>
                                    </template>
                                    <template v-else>
                                        <text v-if="meta_is_text(m.key)" :style="meta_label_style(m.key)">{{ meta_label_text(m.key) }}</text>
                                        <image v-else-if="meta_label_img(m.key)" class="sns-meta-icon" :style="meta_label_icon_box(m.key)" :src="meta_label_img(m.key)" mode="aspectFit"></image>
                                        <iconfont v-else-if="meta_label_icon(m.key)" :name="'icon-' + meta_label_icon(m.key)" :size="meta_icon_size(m.key) * 2 + 'rpx'" :color="meta_icon_color(m.key)" propClass="va-m"></iconfont>
                                        <text :style="meta_number_style(m.key)">{{ m.count }}</text>
                                    </template>
                                </view>
                                <view v-if="is_show('detail') && item.url" class="sns-meta-item flex-row align-c" :data-value="item.url || ''" @tap.stop="url_event">
                                    <text v-if="meta_is_text('detail')" :style="meta_label_style('detail')">{{ meta_label_text('detail') }}</text>
                                    <image v-else-if="meta_label_img('detail')" class="sns-meta-icon" :style="meta_label_icon_box('detail')" :src="meta_label_img('detail')" mode="aspectFit"></image>
                                    <iconfont v-else-if="meta_label_icon('detail')" :name="'icon-' + meta_label_icon('detail')" :size="meta_icon_size('detail') * 2 + 'rpx'" :color="meta_icon_color('detail')" propClass="va-m"></iconfont>
                                    <iconfont v-else name="icon-detail" :size="meta_icon_size('detail') * 2 + 'rpx'" :color="meta_icon_color('detail')" propClass="va-m"></iconfont>
                                </view>
                                <text v-if="is_show('time_text')" class="sns-feed-time" :style="time_text_style">{{ item.add_time_text || item.add_time_date }}</text>
                                <text v-if="is_show('time')" class="sns-feed-time" :style="time_style">{{ item.add_time_date }}</text>
                            </view>
                        </view>
                    </view>
                </template>
                <template v-else>
                    <swiper circular="true" :autoplay="new_style.is_roll == '1'" :interval="(new_style.interval_time || 3) * 1000" :duration="500" :next-margin="new_style.rolling_fashion == 'translation' ? '-' + content_outer_spacing_magin : '0rpx'" :display-multiple-items="slides_per_group" :style="{ width: '100%', height: (Math.max(new_style.content_outer_height || 110, 320) * new_scale) + 'px' }">
                        <swiper-item v-for="(item1, index1) in sns_content_list" :key="index1">
                            <view class="flex-row wh-auto ht-auto" :style="outer_style">
                                <view v-for="(item, index) in item1.split_list" :key="index" class="pr oh" :style="layout_style">
                                    <template v-if="!isEmpty(item)">
                                        <view class="oh ht-auto flex-col gap-10" :style="layout_img_style">
                                            <view v-if="is_show('user')" class="flex-row align-c gap-10" :data-value="item.user_home_url || ''" @tap.stop="url_event">
                                                <image class="sns-feed-avatar" :style="avatar_style" :src="user_avatar(item)" mode="aspectFill"></image>
                                                <text :style="user_style">{{ user_name(item) }}</text>
                                            </view>
                                            <view :class="title_class" :style="title_style" :data-value="item.url || ''" @tap.stop="url_event">{{ item.content || item.title }}</view>
                                            <view v-if="is_show('topic') && topic_list(item).length" class="flex-row flex-wrap" :style="topic_box_style" @tap.stop="">
                                                <text v-for="(topic, ti) in topic_list(item)" :key="ti" class="sns-feed-topic" :style="topic_style" :data-value="topic_url(item, ti)" @tap.stop="url_event">#{{ topic.name || topic }}</text>
                                            </view>
                                            <view v-if="is_show('images') && image_list(item).length" class="sns-feed-media" :style="media_grid_style" @tap.stop="">
                                                <image v-for="(img, ii) in image_list(item)" :key="ii" class="sns-feed-media-item" :style="images_radius_style" :src="img" mode="aspectFill" @tap.stop="preview_images_event(item, ii)"></image>
                                            </view>
                                            <view v-if="is_show('video') && item.video_url" class="sns-feed-video" :style="video_radius_style" @tap.stop="">
                                                <video class="sns-feed-video-el" :src="item.video_url" :poster="cover_url(item) || ''" controls object-fit="cover"></video>
                                            </view>
                                            <view v-if="is_show('goods') && goods_info(item)" class="sns-feed-goods flex-row align-c" :style="goods_box_style" @tap.stop="">
                                                <image v-if="goods_info(item).images" class="sns-feed-goods-cover" :style="goods_img_style" :src="goods_info(item).images" mode="aspectFill" :data-value="goods_info(item).url || ''" @tap.stop="url_event"></image>
                                                <view class="flex-1 flex-width text-line-1" :style="goods_style" :data-value="goods_info(item).url || ''" @tap.stop="url_event">{{ goods_info(item).title }}</view>
                                                <view class="sns-feed-goods-buy flex-row align-c jc-c" :style="goods_buy_style" :data-value="goods_info(item).url || ''" @tap.stop="url_event">
                                                    <text v-if="goods_buy_is_text">{{ goods_buy_label_text }}</text>
                                                    <image v-else-if="goods_buy_label_img" class="sns-feed-goods-buy-icon" :style="goods_buy_icon_box" :src="goods_buy_label_img" mode="aspectFit"></image>
                                                    <iconfont v-else-if="goods_buy_label_icon" :name="'icon-' + goods_buy_label_icon" :size="goods_buy_icon_size * 2 + 'rpx'" :color="goods_buy_icon_color" propClass="va-m"></iconfont>
                                                    <text v-else>{{ goods_buy_label_text }}</text>
                                                </view>
                                            </view>
                                            <view v-if="meta_visible" class="sns-feed-meta flex-row flex-wrap align-c gap-10" :style="meta_box_style" @tap.stop="">
                                                <view v-for="m in meta_items(item)" :key="m.key" class="sns-meta-item flex-row align-c">
                                                    <template v-if="meta_number_left(m.key)">
                                                        <text :style="meta_number_style(m.key)">{{ m.count }}</text>
                                                        <text v-if="meta_is_text(m.key)" :style="meta_label_style(m.key)">{{ meta_label_text(m.key) }}</text>
                                                        <image v-else-if="meta_label_img(m.key)" class="sns-meta-icon" :style="meta_label_icon_box(m.key)" :src="meta_label_img(m.key)" mode="aspectFit"></image>
                                                        <iconfont v-else-if="meta_label_icon(m.key)" :name="'icon-' + meta_label_icon(m.key)" :size="meta_icon_size(m.key) * 2 + 'rpx'" :color="meta_icon_color(m.key)" propClass="va-m"></iconfont>
                                                    </template>
                                                    <template v-else>
                                                        <text v-if="meta_is_text(m.key)" :style="meta_label_style(m.key)">{{ meta_label_text(m.key) }}</text>
                                                        <image v-else-if="meta_label_img(m.key)" class="sns-meta-icon" :style="meta_label_icon_box(m.key)" :src="meta_label_img(m.key)" mode="aspectFit"></image>
                                                        <iconfont v-else-if="meta_label_icon(m.key)" :name="'icon-' + meta_label_icon(m.key)" :size="meta_icon_size(m.key) * 2 + 'rpx'" :color="meta_icon_color(m.key)" propClass="va-m"></iconfont>
                                                        <text :style="meta_number_style(m.key)">{{ m.count }}</text>
                                                    </template>
                                                </view>
                                                <view v-if="is_show('detail') && item.url" class="sns-meta-item flex-row align-c" :data-value="item.url || ''" @tap.stop="url_event">
                                                    <text v-if="meta_is_text('detail')" :style="meta_label_style('detail')">{{ meta_label_text('detail') }}</text>
                                                    <image v-else-if="meta_label_img('detail')" class="sns-meta-icon" :style="meta_label_icon_box('detail')" :src="meta_label_img('detail')" mode="aspectFit"></image>
                                                    <iconfont v-else-if="meta_label_icon('detail')" :name="'icon-' + meta_label_icon('detail')" :size="meta_icon_size('detail') * 2 + 'rpx'" :color="meta_icon_color('detail')" propClass="va-m"></iconfont>
                                                    <iconfont v-else name="icon-detail" :size="meta_icon_size('detail') * 2 + 'rpx'" :color="meta_icon_color('detail')" propClass="va-m"></iconfont>
                                                </view>
                                                <text v-if="is_show('time_text')" class="sns-feed-time" :style="time_text_style">{{ item.add_time_text || item.add_time_date }}</text>
                                                <text v-if="is_show('time')" class="sns-feed-time" :style="time_style">{{ item.add_time_date }}</text>
                                            </view>
                                        </view>
                                    </template>
                                </view>
                            </view>
                        </swiper-item>
                    </swiper>
                </template>
            </view>
        </view>
    </view>
</template>

<script>
    const app = getApp();
    import { isEmpty, common_styles_computer, common_img_computer, gradient_handle, padding_computer, radius_computer, background_computer, border_computer, box_shadow_computer, margin_computer, get_swiper_list } from '@/common/js/common/common.js';
    var system = app.globalData.get_system_info(null, null, true);
    var sys_width = app.globalData.window_width_handle(system.windowWidth);
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
            propIsCommonStyle: {
                type: Boolean,
                default: true,
            },
        },
        data() {
            return {
                form: {},
                new_style: {},
                list: [],
                theme: '',
                outer_class: '',
                outer_style: '',
                layout_style: '',
                layout_img_style: '',
                style_container: '',
                style_img_container: '',
                sns_content_list: [],
                slides_per_group: 1,
                title_class: '',
                title_style: '',
                user_style: '',
                avatar_style: '',
                topic_style: '',
                topic_box_style: '',
                goods_style: '',
                goods_img_style: '',
                goods_box_style: '',
                goods_buy_style: '',
                goods_buy_is_text: true,
                goods_buy_label_text: '查看商品',
                goods_buy_label_icon: '',
                goods_buy_label_img: '',
                goods_buy_icon_size: 11,
                goods_buy_icon_color: '#666',
                goods_buy_icon_box: '',
                time_style: '',
                time_text_style: '',
                meta_box_style: '',
                media_grid_style: '',
                images_radius_style: '',
                video_radius_style: '',
                content_outer_spacing_magin: '',
                new_scale: 1,
                meta_visible: false,
                meta_default_text: {
                    like: '赞',
                    comment: '评论',
                    page_view: '浏览',
                    detail: '详情',
                },
            };
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
            isEmpty,
            init() {
                const new_form = this.propValue.content || null;
                const new_style = this.propValue.style || null;
                if (new_form == null || new_style == null) {
                    return;
                }
                let new_list = [];
                if (!isEmpty(new_form.data_list) && new_form.data_type == '0') {
                    new_list = new_form.data_list.map((item) => ({
                        ...item.data,
                        title: !isEmpty(item.new_title) ? item.new_title : item.data.title,
                        new_cover: item.new_cover,
                    }));
                } else if (!isEmpty(new_form.data_auto_list) && new_form.data_type == '1') {
                    new_list = new_form.data_auto_list;
                }
                let layout_theme = new_form.theme;
                if (layout_theme == '3') {
                    layout_theme = '0';
                }
                if (!['0', '1', '2'].includes(layout_theme)) {
                    layout_theme = '0';
                }
                new_form.theme = layout_theme;
                if (Array.isArray(new_form.is_show) && new_form.is_show.includes('cover')) {
                    new_form.is_show = new_form.is_show.filter((v) => v !== 'cover');
                    if (!new_form.is_show.includes('images')) {
                        new_form.is_show.push('images');
                    }
                }
                let images_col = Number(new_form.images_col || 3);
                if (!Number.isFinite(images_col) || images_col < 1 || images_col > 20) {
                    images_col = 3;
                } else {
                    images_col = Math.floor(images_col);
                }
                new_form.images_col = images_col;
                const images_spacing = new_style.images_spacing ?? 6;
                const avatar_size = new_style.user_avatar_size ?? 36;
                const goods_img_size = new_style.goods_img_size ?? 32;
                const flex = ['0', '2'].includes(layout_theme) ? 'flex-col ' : 'container ';
                const wrap = layout_theme == '2' ? '' : 'flex-wrap ';
                const scale = sys_width / 390;
                this.setData({
                    form: new_form,
                    new_style: new_style,
                    outer_class: flex + wrap + 'oh',
                    outer_style: ['0', '2'].includes(layout_theme) ? `gap: ${new_style.content_outer_spacing * 2 + 'rpx'};` : `column-gap: ${new_style.content_outer_spacing * 2 + 'rpx'}`,
                    content_outer_spacing_magin: new_style.content_outer_spacing * 2 + 'rpx',
                    list: new_list,
                    new_scale: scale,
                    theme: layout_theme,
                    title_class: new_form.title_display_method == '0' ? '' : 'text-line-' + new_form.title_display_method,
                    title_style: this.get_content_top_margin(new_style, 'title_content_spacing') + this.trends_config('title', new_style) + 'word-break: break-all;white-space: pre-wrap;',
                    user_style: this.trends_config('user', new_style),
                    avatar_style: `width:${avatar_size * 2}rpx;height:${avatar_size * 2}rpx;${this.radius_style(new_style.user_avatar_radius, 100)}overflow:hidden;flex-shrink:0;`,
                    topic_style: this.trends_config('topic', new_style) || 'color:#2f86f6;font-size:12px;',
                    topic_box_style: this.get_content_top_margin(new_style, 'topic_content_spacing') + `gap:${(new_style.topic_spacing ?? 8) * 2}rpx;`,
                    goods_style: this.trends_config('goods', new_style) || 'color:#333;font-size:12px;',
                    goods_img_style: `width:${goods_img_size * 2}rpx;height:${goods_img_size * 2}rpx;${this.radius_style(new_style.goods_img_radius, 4)}overflow:hidden;flex-shrink:0;`,
                    goods_box_style: this.get_goods_box_style(new_style),
                    goods_buy_style: this.get_goods_buy_style(new_form, new_style),
                    goods_buy_is_text: (new_form.goods_buy_label_type || 'text') !== 'icon',
                    goods_buy_label_text: new_form.goods_buy_label_text || '查看商品',
                    goods_buy_label_icon: (['shop-o', 'shop'].includes(new_form.goods_buy_label_icon) ? 'admin-goods' : (new_form.goods_buy_label_icon || '')),
                    goods_buy_label_img: this.get_goods_buy_label_img(new_form),
                    goods_buy_icon_size: new_style.ask_goods_buy_size ?? 11,
                    goods_buy_icon_color: new_style.ask_goods_buy_color || '#666',
                    goods_buy_icon_box: `width:${(new_style.ask_goods_buy_size ?? 11) * 2}rpx;height:${(new_style.ask_goods_buy_size ?? 11) * 2}rpx;`,
                    time_style: this.trends_config('time', new_style),
                    time_text_style: this.trends_config('time_text', new_style),
                    meta_box_style: this.get_content_top_margin(new_style, 'meta_content_spacing'),
                    media_grid_style: `${this.get_content_top_margin(new_style, 'images_content_spacing')}grid-template-columns: repeat(${images_col}, 1fr);gap:${images_spacing * 2}rpx;`,
                    images_radius_style: `${this.get_media_size_style('images', new_form, new_style)}${this.radius_style(new_style.images_radius, 4)}overflow:hidden;`,
                    video_radius_style: `${this.get_content_top_margin(new_style, 'video_content_spacing')}${this.get_media_size_style('video', new_form, new_style)}${this.radius_style(new_style.video_radius, 6)}overflow:hidden;`,
                    sns_content_list: get_swiper_list(new_list, new_form.carousel_col, new_style.rolling_fashion),
                    layout_style: this.get_layout_style(new_form, new_style),
                    layout_img_style: this.get_layout_img_style(new_style),
                    slides_per_group: new_style.rolling_fashion == 'translation' ? new_form.carousel_col : 1,
                    style_container: this.propIsCommonStyle ? common_styles_computer(new_style.common_style) : '',
                    style_img_container: this.propIsCommonStyle ? common_img_computer(new_style.common_style, this.propIndex) : '',
                    meta_visible: this.check_meta_visible(new_form),
                });
            },
            normalize_radius(value, fallback) {
                if (value && typeof value === 'object') {
                    return value;
                }
                const n = Number(value);
                const size = Number.isFinite(n) ? n : fallback;
                return {
                    radius: size,
                    radius_top_left: size,
                    radius_top_right: size,
                    radius_bottom_left: size,
                    radius_bottom_right: size,
                };
            },
            radius_style(value, fallback) {
                return radius_computer(this.normalize_radius(value, fallback));
            },
            get_content_top_margin(new_style, key, fallback = 10) {
                // 父级 flex 有 gap-10(20rpx)，上间距要能真正控到 0，需抵消这段固定间距
                const spacing = Number(new_style[key] ?? fallback);
                return `margin-top:${(spacing - 10) * 2}rpx;`;
            },
            get_media_size_style(prefix, form, new_style) {
                // 优先内容配置，兼容旧数据写在样式里
                const type = form[`${prefix}_size_type`] || new_style[`${prefix}_size_type`] || 'ratio';
                if (type === 'height') {
                    const height = Number(form[`${prefix}_height`] ?? new_style[`${prefix}_height`] ?? 80);
                    return `width:100%;height:${height * 2}rpx;aspect-ratio:auto;`;
                }
                const ratio = Number(form[`${prefix}_width_ratio`] ?? new_style[`${prefix}_width_ratio`] ?? (prefix === 'images' ? 100 : 50));
                return `width:100%;height:auto;aspect-ratio:100 / ${ratio};`;
            },
            get_goods_box_style(new_style) {
                const bg = new_style.goods_bg_color ? `background:${new_style.goods_bg_color};` : 'background:transparent;';
                const padding = padding_computer(new_style.goods_padding || {
                    padding: 8,
                    padding_top: 8,
                    padding_bottom: 8,
                    padding_left: 8,
                    padding_right: 8,
                });
                const radius = this.radius_style(new_style.goods_radius, 6);
                const border = border_computer({
                    border_is_show: new_style.goods_border_is_show || '0',
                    border_color: new_style.goods_border_color || '#eee',
                    border_style: new_style.goods_border_style || 'solid',
                    border_size: new_style.goods_border_size || { padding: 1, padding_top: 1, padding_right: 1, padding_bottom: 1, padding_left: 1 },
                });
                // 父级 flex 有 gap-10(20rpx)，上间距要能真正控到 0，需抵消这段固定间距
                const content_spacing = Number(new_style.goods_content_spacing ?? 10);
                const margin_top = `margin-top:${(content_spacing - 10) * 2}rpx;`;
                const gap = `gap:${(new_style.goods_inner_spacing ?? 10) * 2}rpx;`;
                return `${bg}${padding}${radius}${border}${margin_top}${gap}box-sizing:border-box;width:100%;`;
            },
            get_goods_buy_label_img(form) {
                const img = form.goods_buy_label_img;
                if (!isEmpty(img) && Array.isArray(img) && img[0]?.url) {
                    return img[0].url;
                }
                return '';
            },
            get_goods_buy_style(form, new_style) {
                const is_text = (form.goods_buy_label_type || 'text') !== 'icon';
                const text = is_text ? (this.trends_config('goods_buy', new_style) || 'color:#666;font-size:11px;') : '';
                const bg = new_style.ask_goods_buy_bg_color ? `background:${new_style.ask_goods_buy_bg_color};` : 'background:transparent;';
                const padding = padding_computer(new_style.ask_goods_buy_padding || {
                    padding: 4,
                    padding_top: 2,
                    padding_bottom: 2,
                    padding_left: 8,
                    padding_right: 8,
                });
                const radius = this.radius_style(new_style.ask_goods_buy_radius, 100);
                const border = border_computer({
                    border_is_show: new_style.ask_goods_buy_border_is_show || '0',
                    border_color: new_style.ask_goods_buy_border_color || '#ddd',
                    border_style: new_style.ask_goods_buy_border_style || 'solid',
                    border_size: new_style.ask_goods_buy_border_size || { padding: 1, padding_top: 1, padding_right: 1, padding_bottom: 1, padding_left: 1 },
                });
                return `${text}${bg}${padding}${radius}${border}flex-shrink:0;line-height:1.6;`;
            },
            check_meta_visible(form) {
                const keys = ['like', 'comment', 'time', 'time_text', 'page_view', 'detail'];
                return keys.some((key) => Array.isArray(form.is_show) && form.is_show.includes(key));
            },
            trends_config(key, new_style) {
                return this.style_config(new_style[`ask_${key}_typeface`], new_style[`ask_${key}_size`], new_style[`ask_${key}_color`]);
            },
            style_config(typeface, size, color) {
                return `font-weight:${typeface || 400}; font-size: ${size || 11}px;color: ${color || '#999'};line-height: 1.5;`;
            },
            get_layout_style(form, new_style) {
                const { ask_margin, ask_radius, ask_color_list, ask_direction } = new_style;
                const radius = radius_computer(ask_radius);
                const margin = form.theme == '1' ? {
                    ...ask_margin,
                    margin_bottom: (new_style.ask_margin?.margin_bottom || 0) + new_style.content_outer_spacing,
                } : ask_margin;
                let size_style = ``;
                const ask_left_right_width = ask_margin.margin_left + ask_margin.margin_right;
                if (form.theme == '2') {
                    if (new_style.rolling_fashion != 'translation') {
                        size_style = `width: ${this.get_multicolumn_columns_width(new_style, form)};min-width: ${this.get_multicolumn_columns_width(new_style, form)};height: ${new_style.content_outer_height * (sys_width / 390) + 'px'};`;
                    } else {
                        size_style = `margin-right: ${(new_style.content_outer_spacing * 2) + (ask_margin.margin_right * 2)}rpx;width: 100%;height: 100%;`;
                    }
                } else if (form.theme == '0') {
                    size_style = `width: calc(100% - ${ask_left_right_width * 2}rpx);`;
                }
                const gradient = gradient_handle(ask_color_list, ask_direction) + margin_computer(margin) + border_computer(new_style) + box_shadow_computer(new_style);
                return `${radius} ${gradient} ${size_style}`;
            },
            get_multicolumn_columns_width(new_style, form) {
                const { carousel_col } = form;
                let gap = (new_style.content_outer_spacing * (carousel_col - 1)) / carousel_col;
                return `calc(${100 / carousel_col}% - ${gap * 2}rpx)`;
            },
            get_layout_img_style(new_style) {
                const { ask_padding, ask_background_img_style, ask_background_img } = new_style;
                const padding = padding_computer(ask_padding);
                const data = {
                    background_img_style: ask_background_img_style,
                    background_img: ask_background_img,
                };
                return padding + background_computer(data);
            },
            is_show(val) {
                return Array.isArray(this.form.is_show) && this.form.is_show.includes(val);
            },
            cover_url(item) {
                if (!isEmpty(item?.new_cover) && Array.isArray(item.new_cover) && item.new_cover[0]?.url) {
                    return item.new_cover[0].url;
                }
                if (!isEmpty(item?.cover)) {
                    return item.cover;
                }
                const imgs = this.image_list(item);
                return imgs[0] || '';
            },
            user_avatar(item) {
                return (item.user && item.user.avatar) || '';
            },
            user_name(item) {
                return (item.user && item.user.user_name_view) || '';
            },
            topic_list(item) {
                if (!isEmpty(item.topic_list) && Array.isArray(item.topic_list)) {
                    return item.topic_list;
                }
                if (!isEmpty(item.topic_names)) {
                    return String(item.topic_names).split(',').map((name) => ({ name: name.trim() })).filter((t) => !!t.name);
                }
                return [];
            },
            topic_url(item, index) {
                const list = this.topic_list(item);
                const topic = list[index] || {};
                if (topic.id) {
                    return '/pages/plugins/sns/topic/topic?id=' + topic.id;
                }
                return '';
            },
            image_list(item) {
                if (!isEmpty(item?.new_cover) && Array.isArray(item.new_cover) && item.new_cover[0]?.url) {
                    return [item.new_cover[0].url];
                }
                const imgs = item?.images;
                if (isEmpty(imgs) || !Array.isArray(imgs)) {
                    return [];
                }
                return imgs.map((img) => {
                    if (typeof img === 'string') {
                        return img;
                    }
                    return img?.images || img?.url || '';
                }).filter((url) => !!url);
            },
            goods_info(item) {
                if (!isEmpty(item.goods) && item.goods.id) {
                    return item.goods;
                }
                if (!isEmpty(item.goods_list) && Array.isArray(item.goods_list) && item.goods_list[0]?.id) {
                    return item.goods_list[0];
                }
                return null;
            },
            meta_items(item) {
                const rows = [];
                if (this.is_show('like')) {
                    rows.push({ key: 'like', count: item.like_count || 0 });
                }
                if (this.is_show('comment')) {
                    rows.push({ key: 'comment', count: item.comment_count || 0 });
                }
                if (this.is_show('page_view')) {
                    rows.push({ key: 'page_view', count: item.access_count || 0 });
                }
                return rows;
            },
            meta_content_val(key, field) {
                const content_key = `${key}_label_${field}`;
                if (this.form[content_key] != null && this.form[content_key] !== '') {
                    return this.form[content_key];
                }
                return this.new_style[`ask_${key}_label_${field}`];
            },
            meta_is_text(key) {
                return (this.meta_content_val(key, 'type') || 'text') !== 'icon';
            },
            meta_label_text(key) {
                const text = this.meta_content_val(key, 'text');
                return text == null || text === '' ? (this.meta_default_text[key] || '') : text;
            },
            meta_label_icon(key) {
                const name = this.meta_content_val(key, 'icon') || '';
                if (name) {
                    return name;
                }
                return key === 'detail' ? 'detail' : '';
            },
            preview_images_event(item, index) {
                const urls = this.image_list(item);
                if (!urls.length) {
                    return;
                }
                const current = urls[index] || urls[0];
                uni.previewImage({
                    current,
                    urls,
                });
            },
            meta_label_img(key) {
                const img = this.meta_content_val(key, 'img');
                if (!isEmpty(img) && Array.isArray(img) && img[0]?.url) {
                    return img[0].url;
                }
                return '';
            },
            meta_number_left(key) {
                return (this.meta_content_val(key, 'position') || '0') !== '1';
            },
            meta_number_style(key) {
                return this.style_config(this.new_style[`ask_${key}_typeface`], this.new_style[`ask_${key}_size`], this.new_style[`ask_${key}_color`]);
            },
            meta_label_style(key) {
                const typeface = this.new_style[`ask_${key}_label_typeface`] || this.new_style[`ask_${key}_typeface`];
                const size = this.new_style[`ask_${key}_label_size`] ?? this.new_style[`ask_${key}_size`];
                const color = this.new_style[`ask_${key}_label_color`] || this.new_style[`ask_${key}_color`];
                return this.style_config(typeface, size, color);
            },
            meta_icon_size(key) {
                return this.new_style[`ask_${key}_label_size`] ?? this.new_style[`ask_${key}_size`] ?? 11;
            },
            meta_icon_color(key) {
                return this.new_style[`ask_${key}_label_color`] || this.new_style[`ask_${key}_color`] || '#999';
            },
            meta_label_icon_box(key) {
                const size = this.meta_icon_size(key);
                return `width:${size}px;height:${size}px;`;
            },
            url_event(e) {
                app.globalData.url_event(e);
            },
        },
    };
</script>

<style scoped lang="scss">
.container {
    column-count: 2;
}
.gap-10 {
    gap: 20rpx;
}
.sns-meta-item {
    gap: 4rpx;
}
.sns-meta-icon {
    width: 1.2em;
    height: 1.2em;
    flex-shrink: 0;
}
.sns-feed-avatar {
    flex-shrink: 0;
    overflow: hidden;
}
.sns-feed-topic {
    color: #2f86f6;
}
.sns-feed-media {
    display: grid;
    width: 100%;
}
.sns-feed-media-item {
    width: 100%;
    overflow: hidden;
}
.sns-feed-video {
    position: relative;
    width: 100%;
    overflow: hidden;
    background: #111;
}
.sns-feed-video-el {
    width: 100%;
    height: 100%;
}
.sns-feed-goods {
    width: 100%;
}
.sns-feed-goods-cover {
    flex-shrink: 0;
    overflow: hidden;
}
.sns-feed-goods-buy {
    flex-shrink: 0;
}
.sns-feed-goods-buy-icon {
    flex-shrink: 0;
}
.sns-feed-meta {
    width: 100%;
}
.sns-feed-time {
    margin-left: auto;
}
</style>
