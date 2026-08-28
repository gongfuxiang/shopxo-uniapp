<template>
    <!-- 直播列表 -->
    <view class="oh" :style="style_container">
        <view class="oh" :style="style_img_container">
            <view class="pr oh" :style="style">
                <view v-if="!['4'].includes(plugins_live_theme)" class="flex-wrap" :class="plugins_live_theme_class" :style="plugins_live_theme !== '3' ? plugins_live_spacing : ''">
                    <view v-for="(item, index) in data_list" :key="index" class="item oh" :style="plugins_live_style" :data-value="live_item_url(item)" @tap="url_event">
                        <template v-if="plugins_live_theme == '3'">
                            <view v-if="field_show.includes('0') || field_show.includes('1') || field_show.includes('2') || field_show.includes('3')" class="jc-sb flex-1 flex-row align-c" :style="content_padding">
                                <view class="live-noimg-row flex-row align-c flex-1 flex-width">
                                    <text v-if="field_show.includes('0')" class="title text-line-1 live-noimg-title" :style="plugins_live_name">{{ live_item_title(item) }}</text>
                                    <view v-if="field_show.includes('3') && should_show_live_status(item.data)" class="live-status-tag live-status-tag--inline" :class="'status-' + get_live_room_status(item.data)">
                                        <view v-if="get_live_room_status(item.data) === 1" class="live-status-dots">
                                            <text class="dot"></text><text class="dot"></text><text class="dot"></text>
                                        </view>
                                        <text>{{ get_live_room_status_name(item.data) }}</text>
                                    </view>
                                </view>
                                <view class="flex-row jc-sb gap-8 margin-left">
                                    <text class="text-line-1" :style="plugins_live_seller_name">{{ field_show.includes('1') ? live_seller_name(item) : '' }}</text>
                                    <view v-show="field_show.includes('2')" class="flex-row align-c gap-3 live-page-view" :style="plugins_live_page_view">
                                        <iconfont name="icon-eye" propContainerDisplay="flex" :size="plugins_live_page_view_icon_size"></iconfont>
                                        <text>{{ live_viewer_count(item) }}</text>
                                    </view>
                                </view>
                            </view>
                        </template>
                        <view v-else :class="plugins_live_theme == '0' ? 'flex-row oh' : 'flex-col oh h'" :style="plugins_live_img_style">
                            <view class="oh pr flex-row">
                                <template v-if="item.new_cover && item.new_cover.length > 0">
                                    <image :src="item.new_cover[0].url" class="img" :style="img_radius + img_size" mode="aspectFill" />
                                </template>
                                <template v-else>
                                    <image :src="item.data.cover" class="img" :style="img_radius + img_size" mode="aspectFill" />
                                </template>
                                <view v-if="field_show.includes('3') && should_show_live_status(item.data)" class="live-status-tag" :class="'status-' + get_live_room_status(item.data)">
                                    <view v-if="get_live_room_status(item.data) === 1" class="live-status-dots">
                                        <text class="dot"></text><text class="dot"></text><text class="dot"></text>
                                    </view>
                                    <text>{{ get_live_room_status_name(item.data) }}</text>
                                </view>
                            </view>
                            <view v-if="field_show.includes('0') || field_show.includes('1') || field_show.includes('2') || field_show.includes('3')" class="jc-sb flex-1 flex-col" :style="plugins_live_theme !== '0' ? content_padding : ''">
                                <view class="flex-col">
                                    <text v-if="field_show.includes('0')" class="title text-line-2" :style="plugins_live_name">{{ live_item_title(item) }}</text>
                                </view>
                                <view class="flex-row jc-sb gap-8 align-e margin-top">
                                    <text class="text-line-1" :style="plugins_live_seller_name">{{ field_show.includes('1') ? live_seller_name(item) : '' }}</text>
                                    <view v-show="field_show.includes('2')" class="flex-row align-c gap-3 live-page-view" :style="plugins_live_page_view">
                                        <iconfont name="icon-eye" propContainerDisplay="flex" :size="plugins_live_page_view_icon_size"></iconfont>
                                        <text>{{ live_viewer_count(item) }}</text>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
                <view v-else class="oh" :class="plugins_live_theme_class">
                    <swiper class="swiper" circular :autoplay="is_roll ? true : false" :interval="interval_time" :next-margin="next_margin" :display-multiple-items="slides_per_group" :style="'height:' + carousel_height_computer">
                        <swiper-item v-for="(item1, index1) in plugins_live_carousel_list" :key="index1">
                            <view class="flex-row ht-auto" :style="plugins_live_spacing">
                                <view v-for="(item, index) in item1.split_list" :key="index" class="item oh ht-auto" :style="plugins_live_style" :data-value="live_item_url(item)" @tap="url_event">
                                    <template v-if="!isEmpty(item)">
                                        <view class="oh flex-col ht-auto" :style="plugins_live_img_style">
                                            <view class="oh pr wh-auto ht-auto flex-row">
                                                <template v-if="item.new_cover && item.new_cover.length > 0">
                                                    <image :src="item.new_cover[0].url" class="img" :style="img_radius + 'height:100%;'" mode="aspectFill" />
                                                </template>
                                                <template v-else>
                                                    <image :src="item.data.cover" class="img" :style="img_radius + 'height:100%;'" mode="aspectFill" />
                                                </template>
                                                <text v-if="field_show.includes('0') && name_float == '1'" class="text-line-1" :style="plugins_live_name + float_name_style">{{ live_item_title(item) }}</text>
                                                <view v-if="field_show.includes('3') && should_show_live_status(item.data)" class="live-status-tag" :class="'status-' + get_live_room_status(item.data)">
                                                    <view v-if="get_live_room_status(item.data) === 1" class="live-status-dots">
                                                        <text class="dot"></text><text class="dot"></text><text class="dot"></text>
                                                    </view>
                                                    <text>{{ get_live_room_status_name(item.data) }}</text>
                                                </view>
                                            </view>
                                            <view v-if="field_show.includes('1') || field_show.includes('2') || (field_show.includes('0') && name_float == '0')" class="jc-sb flex-1 flex-col" :style="plugins_live_theme !== '0' ? content_padding : ''">
                                                <view class="flex-col">
                                                    <text v-if="field_show.includes('0') && name_float == '0'" class="title text-line-2" :style="plugins_live_name + plugins_live_name_height_computer">{{ live_item_title(item) }}</text>
                                                </view>
                                                <view :class="'flex-row jc-sb gap-8 align-e' + ((field_show.includes('0') && name_float == '0') ? ' margin-top' : '')">
                                                    <text :style="plugins_live_seller_name">{{ field_show.includes('1') ? live_seller_name(item) : '' }}</text>
                                                    <view v-show="field_show.includes('2')" class="flex-row align-c gap-3 live-page-view" :style="plugins_live_page_view">
                                                        <iconfont name="icon-eye" propContainerDisplay="flex" :size="plugins_live_page_view_icon_size"></iconfont>
                                                        <text>{{ live_viewer_count(item) }}</text>
                                                    </view>
                                                </view>
                                            </view>
                                        </view>
                                    </template>
                                </view>
                            </view>
                        </swiper-item>
                    </swiper>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    const app = getApp();
    import { isEmpty, common_styles_computer, common_img_computer, padding_computer, radius_computer, get_math, gradient_handle, background_computer, gradient_computer, margin_computer, box_shadow_computer, border_computer, old_margin, get_swiper_list } from '@/common/js/common/common.js';
    import { get_live_room_status, get_live_room_status_name, get_live_online_count, should_show_live_status, format_live_status, format_live_is_recommended } from '@/pages/diy/components/diy/modules/plugins-live-status.js';
    var system = app.globalData.get_system_info(null, null, true);
    var sys_width = app.globalData.window_width_handle(system.windowWidth);
    export default {
        props: {
            propValue: {
                type: Object,
                default: () => {},
            },
            // 是否使用公共样式
            propIsCommonStyle: {
                type: Boolean,
                default: true,
            },
            // 关键key
            propKey: {
                type: [String, Number],
                default: '',
            },
            // 组件渲染的下标
            propIndex: {
                type: Number,
                default: 1000000,
            },
        },
        data() {
            return {
                style_container: '',
                style_img_container: '',
                style: '',
                // 数据
                data_list: [],
                // 风格
                plugins_live_theme: '0',
                // 是否显示
                field_show: ['0', '1', '2', '3'],
                // 标题
                plugins_live_name: '',
                // 卖家
                plugins_live_seller_name: '',
                // 观看人数
                plugins_live_page_view: '',
                plugins_live_page_view_icon_size: '24rpx',
                // 内容圆角
                content_radius: '',
                // 图片圆角
                img_radius: '',
                // 内间距
                content_padding: '',
                // 内容间距
                content_spacing: '',
                // 直播间距
                plugins_live_spacing: '',
                plugins_live_style: '',
                plugins_live_img_style: '',
                // 轮播图定时轮播
                interval_time: 3000,
                // 轮播图是否滚动
                is_roll: 1,
                plugins_live_theme_class: '',
                // 轮播高度
                carousel_height_computer: '',
                // 直播内容高度
                plugins_live_name_height_computer: '',
                // 直播名称浮动样式
                float_name_style: '',
                name_float: '0',
                // 图片大小
                img_size: '',
                // 直播轮播数据
                plugins_live_carousel_list: [],
                // 一行显示的数量
                slides_per_group: 1,
                next_margin: '0rpx',
            };
        },
        watch: {
            propKey(val) {
                // 初始化
                this.init();
            },
        },
        created() {
            this.init();
        },
        methods: {
            isEmpty,
            get_live_room_status,
            get_live_room_status_name,
            should_show_live_status,
            // 直播标题
            live_item_title(item) {
                if (!item) return '';
                return item.new_title ? item.new_title : (item.data && item.data.title) || '';
            },
            // 卖家名称
            live_seller_name(item) {
                const name = item && item.data && item.data.seller_name;
                return name != null && String(name).trim() !== '' ? String(name) : '';
            },
            // 观看人数
            live_viewer_count(item) {
                return get_live_online_count(item && item.data);
            },
            // 跳转链接
            live_item_url(item) {
                if (!item || !item.data) return '';
                return item.data.url || item.data.page_url || '';
            },
            // 统一列表数据结构
            normalize_list_item(item) {
                if (item && item.data) return item;
                return { id: get_math(), new_title: '', new_cover: [], data: item || {} };
            },
            // 显示字段
            resolve_field_show(raw) {
                if (!Array.isArray(raw) || raw.length === 0) return ['0', '1', '2', '3'];
                return raw.map((v) => String(v));
            },
            // 自动获取直播列表
            get_auto_data_list(content, new_style) {
                const recommended = format_live_is_recommended(content.is_recommended);
                const post_data = {
                    live_keywords: content.keywords || '',
                    live_status: format_live_status(content.live_status),
                    live_order_by_type: content.order_by_type ?? 0,
                    live_order_by_rule: content.order_by_rule ?? 0,
                    live_number: content.number,
                };
                if (recommended !== undefined) post_data.live_is_recommended = recommended;
                uni.request({
                    url: app.globalData.get_request_url('autolivelist', 'diylive', 'live'),
                    method: 'POST',
                    data: post_data,
                    dataType: 'json',
                    success: (res) => {
                        const body = res.data || {};
                        let list = [];
                        if (body.code == 0 && Array.isArray(body.data)) {
                            list = body.data.map((child) => this.normalize_list_item(child));
                        }
                        this.setData({ data_list: list });
                        this.apply_theme_styles(content, new_style);
                    },
                });
            },
            // 直播主题样式
            apply_theme_styles(new_content, new_style) {
                const theme = new_content.theme;
                // 默认数据
                const product_style_list = [
                    { name: this.$t('diy.single_column_display'), value: '0', width: 110, height: 83 },
                    { name: this.$t('diy.two_column_vertical'), value: '1', width: 180, height: 180 },
                    { name: this.$t('diy.large_image_display'), value: '2', width: 0, height: 180 },
                    { name: this.$t('diy.no_image_mode'), value: '3', width: 0, height: 0 },
                    { name: this.$t('diy.horizontal_slide_display'), value: '4', width: 0, height: 0 },
                ];
                const scale = sys_width / 390;
                let img_style = '';
                if (['0'].includes(new_content.theme)) {
                    // 图片宽度
                    if (typeof new_style.content_img_width == 'number') {
                        img_style += `width: ${new_style.content_img_width * scale}px;`;
                    } else {
                        const list = product_style_list.filter((item) => item.value == new_content.theme);
                        img_style += list.length > 0 ? `width: ${list[0].width * scale}px;` : 'width: auto;';
                    }
                }
                if (!['3', '4'].includes(new_content.theme)) {
                    // 图片高度
                    if (typeof new_style.content_img_height == 'number') {
                        img_style += `height: ${new_style.content_img_height * scale}px;`;
                    } else {
                        const list = product_style_list.filter((item) => item.value == new_content.theme);
                        img_style += list.length > 0 ? `height: ${list[0].height * scale}px;` : 'height: auto;';
                    }
                }
                // 背景图的处理
                const plugins_live_data = {
                    background_img_style: new_style?.plugins_live_background_img_style || '',
                    background_img: new_style?.plugins_live_background_img || [],
                };
                const plugins_live_margin = new_style.margin || old_margin;
                const margin_width = (plugins_live_margin.margin_left || 0) + (plugins_live_margin.margin_right || 0);
                // 渐变效果
                const all_style = gradient_handle(new_style?.plugins_live_color_list || [], new_style?.plugins_live_direction || '') + margin_computer(plugins_live_margin) + box_shadow_computer(new_style) + border_computer(new_style);
                // 直播样式
                if (theme == '0') {
                    this.setData({
                        style: '',
                        img_size: img_style,
                        plugins_live_style: this.content_radius + all_style,
                        plugins_live_img_style: this.content_spacing + this.content_padding + background_computer(plugins_live_data),
                    });
                } else if (theme == '1') {
                    this.setData({
                        style: '',
                        img_size: img_style,
                        plugins_live_style: `width: calc(50% - ${(new_style.plugins_live_spacing + margin_width * 2) / 2}px);` + this.content_radius + all_style,
                        plugins_live_img_style: background_computer(plugins_live_data),
                    });
                } else if (theme == '2') {
                    this.setData({
                        style: '',
                        img_size: img_style,
                        plugins_live_style: this.content_radius + all_style,
                        plugins_live_img_style: background_computer(plugins_live_data),
                    });
                } else if (theme == '3') {
                    // 无图模式：外层仅背景+圆角；条目内 padding（与 DIY 两层一致，不再叠加 content_spacing）
                    this.setData({
                        style: `background:#fff;` + this.content_radius,
                        plugins_live_style: '',
                        plugins_live_img_style: '',
                    });
                } else if (theme == '4') {
                    const temp_carousel_col = new_content.carousel_col || '1';
                    // 计算间隔的空间。(gap * gap数量) / 模块数量
                    const gap_num = Number(temp_carousel_col) || 1;
                    const gap = temp_carousel_col !== '0' ? ((new_style.plugins_live_spacing * gap_num - 1) + margin_width * gap_num) / gap_num : 0;
                    const multicolumn_columns_width = new_style.rolling_fashion == 'translation' ? `margin-right: ${new_style.plugins_live_spacing + (plugins_live_margin.margin_right || 0)}px;width:100%;` : `width:calc(${100 / (gap_num + 1)}% - ${gap * 2}rpx);min-width:calc(${100 / (gap_num + 1)}% - ${gap * 2}rpx);`;
                    const { name_bg_color_list = [], name_bg_direction = '180deg', name_bg_radius, name_bg_padding, name_bg_margin } = new_style;
                    const data = { color_list: name_bg_color_list, direction: name_bg_direction };
                    let location = 'position:absolute;bottom:0;left:0;right:0;';
                    // 每页显示的数量
                    const num = Number(temp_carousel_col) + 1;
                    this.setData({
                        style: '',
                        // 滚动时间
                        interval_time: (new_style.interval_time || 3) * 1000,
                        // 是否滚动修改
                        is_roll: new_style.is_roll,
                        plugins_live_style: this.content_radius + all_style + multicolumn_columns_width,
                        // 轮播高度
                        carousel_height_computer: new_style.plugins_live_height * scale + 'px',
                        // 直播内容高度
                        plugins_live_name_height_computer: `height:${new_style.name_size * 2.4 * 2}rpx;line-height:${new_style.name_size * 1.2 * 2}rpx;`,
                        float_name_style: gradient_computer(data) + (!isEmpty(name_bg_radius) ? radius_computer(name_bg_radius) : '') + (!isEmpty(name_bg_padding) ? padding_computer(name_bg_padding) : '') + (!isEmpty(name_bg_margin) ? margin_computer(name_bg_margin) : '') + location,
                        plugins_live_img_style: background_computer(plugins_live_data),
                        plugins_live_carousel_list: get_swiper_list(this.data_list, num, new_style.rolling_fashion),
                    });
                }
            },
            // 初始化数据
            init() {
                const new_content = this.propValue.content || {};
                const new_style = this.propValue.style || {};
                const data_list =
                    new_content.data_type == '0'
                        ? (new_content.data_list || []).map((item) => this.normalize_list_item(item))
                        : new_content.data_auto_list && new_content.data_auto_list.length > 0
                        ? new_content.data_auto_list.map((item) => this.normalize_list_item(item))
                        : [];
                this.setData({
                    name_float: !isEmpty(new_content.name_float) ? new_content.name_float : '0',
                    // 判断是自动还是手动
                    data_list,
                    plugins_live_theme_class: this.plugins_live_theme_class_computer(new_content.theme),
                    plugins_live_theme: new_content.theme,
                    field_show: this.resolve_field_show(new_content.field_show),
                    // 样式
                    plugins_live_name: 'font-size:' + new_style.name_size * 2 + 'rpx;' + 'font-weight:' + new_style.name_weight + ';' + 'color:' + new_style.name_color + ';',
                    plugins_live_seller_name: 'font-size:' + new_style.time_size * 2 + 'rpx;' + 'font-weight:' + new_style.time_weight + ';' + 'color:' + new_style.time_color + ';',
                    plugins_live_page_view: 'font-size:' + new_style.page_view_size * 2 + 'rpx;line-height:1;' + 'font-weight:' + new_style.page_view_weight + ';' + 'color:' + new_style.page_view_color + ';',
                    plugins_live_page_view_icon_size: new_style.page_view_size * 2 + 'rpx',
                    content_radius: radius_computer(new_style.content_radius),
                    img_radius: radius_computer(new_style.img_radius),
                    // 内间距
                    content_padding: padding_computer(new_style.padding),
                    // 内容间距
                    content_spacing: `gap: ${new_style.content_spacing}px;`,
                    // 直播间距
                    plugins_live_spacing: `gap: ${new_style.plugins_live_spacing}px;`,
                    next_margin: new_style.rolling_fashion == 'translation' ? '-' + new_style.plugins_live_spacing * 2 + 'rpx' : '0rpx',
                    slides_per_group: new_style.rolling_fashion == 'translation' ? Number(new_content.carousel_col) + 1 : 1,
                });
                if (new_content.data_type == '1' && data_list.length === 0) {
                    this.get_auto_data_list(new_content, new_style);
                } else {
                    this.apply_theme_styles(new_content, new_style);
                }
                if (this.propIsCommonStyle) {
                    this.setData({
                        style_container: common_styles_computer(new_style.common_style),
                        style_img_container: common_img_computer(new_style.common_style, this.propIndex),
                    });
                }
            },
            // 直播主题class计算
            plugins_live_theme_class_computer(theme) {
                switch (theme) {
                    case '0':
                        return 'style1 flex-col';
                    case '1':
                        return 'style2 flex-row flex-wrap';
                    case '2':
                        return 'style3 flex-col';
                    case '3':
                        return 'style4 flex-col';
                    default:
                        return 'style5';
                }
            },
            // 跳转链接
            url_event(e) {
                app.globalData.url_event(e);
            },
        },
    };
</script>
<style lang="scss" scoped>
    .h {
        height: 100%;
    }
    .style1 {
        .item {
            max-width: 100%;
        }
    }
    .style2 {
        .item {
            .img {
                width: 100%;
            }
        }
    }
    .style3 {
        .item {
            width: 100%;
            .img {
                width: 100%;
            }
        }
    }
    .style4 {
        .item {
            width: 100%;
            &:not(:last-child) {
                border-bottom: 2rpx solid #eee;
            }
        }
    }
    .live-page-view {
        line-height: 1;
        .iconfont-container {
            display: flex;
            align-items: center;
            line-height: 1;
        }
        text {
            line-height: 1;
        }
    }
    /* 直播状态标签（与 pages/plugins/live 一致，有封面时绝对定位） */
    .live-status-tag {
        position: absolute;
        top: 10rpx;
        left: 10rpx;
        z-index: 2;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 6rpx;
        padding: 4rpx 12rpx;
        font-size: 22rpx;
        line-height: 28rpx;
        color: #fff;
        background-color: #999;
        border-radius: 4rpx;
    }
    /* 无图模式：标题左对齐，状态在标题右侧 */
    .live-noimg-row {
        gap: 16rpx;
        min-width: 0;
    }
    .live-status-tag.live-status-tag--inline {
        position: static;
        top: auto;
        left: auto;
        z-index: auto;
        flex-shrink: 0;
        align-self: center;
    }
    .style4 .live-noimg-row .live-noimg-title {
        flex: 0 1 auto;
        min-width: 0;
        text-align: left;
    }
    .style4 .live-noimg-row .live-status-tag--inline {
        flex-shrink: 0;
    }
    /* status-1 直播中 / status-2 离开 / status-3 封禁，默认灰为离线 */
    .live-status-tag.status-1 {
        background-color: #e93633;
    }
    .live-status-tag.status-2 {
        background-color: #f5c242;
    }
    .live-status-tag.status-3 {
        background-color: #666;
    }
    /* 直播中竖条跳动动画 */
    .live-status-dots {
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        height: 16rpx;
        gap: 4rpx;
    }
    .live-status-dots .dot {
        width: 4rpx;
        background-color: #fff;
        border-radius: 2rpx;
        transform-origin: bottom;
    }
    .live-status-dots .dot:nth-child(1) {
        animation: live-bar1-random 1.1s infinite ease-in-out both;
    }
    .live-status-dots .dot:nth-child(2) {
        animation: live-bar2-random 1.4s infinite ease-in-out both;
    }
    .live-status-dots .dot:nth-child(3) {
        animation: live-bar3-random 1.2s infinite ease-in-out both;
    }
    @keyframes live-bar1-random {
        0% {
            height: 4rpx;
        }
        50% {
            height: 14rpx;
        }
        100% {
            height: 4rpx;
        }
    }
    @keyframes live-bar2-random {
        0% {
            height: 6rpx;
        }
        50% {
            height: 12rpx;
        }
        100% {
            height: 6rpx;
        }
    }
    @keyframes live-bar3-random {
        0% {
            height: 5rpx;
        }
        50% {
            height: 13rpx;
        }
        100% {
            height: 5rpx;
        }
    }
    .style5 {
        .item {
            width: 100%;
            .img {
                width: 100%;
            }
        }
    }
</style>
