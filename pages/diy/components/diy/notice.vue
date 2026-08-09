<template>
    <!-- 公告 -->
    <view :style="style_container">
        <view :style="style_img_container">
            <!-- 样式一：inherit，swiper 轮播多条公告标题 -->
            <template v-if="form_content.notice_style == 'inherit'">
                <view class="news-box" :style="container_background_style + container_height">
                    <view class="flex-row align-c gap-8" :style="container_background_img_style">
                        <template v-if="form_content.title_type == 'img-icon'">
                            <view v-if="form_content.icon_class">
                                <iconfont :name="'icon-' + form_content.icon_class" :size="form_style.icon_size * 2 + 'rpx'" :color="form_style.icon_color" propContainerDisplay="flex"></iconfont>
                            </view>
                            <view v-else>
                                <image v-if="form_content.img_src.length > 0" :src="form_content.img_src[0].url" class="border-radius-sm dis-block" mode="aspectFill" :style="img_style"></image>
                            </view>
                        </template>
                        <template v-else>
                            <view :style="title_style" class="padding-horizontal-sm border-radius-sm">{{ form_content.title || $t('common.notice') }}</view>
                        </template>
                        <swiper class="swiper flex-1" circular :indicator-dots="false" :autoplay="true" :interval="interval_time" :vertical="direction_type == 'vertical'" :style="container_height">
                            <swiper-item v-for="(item, index) in notice_list" :key="index">
                                <view class="swiper-item flex-row align-c ht-auto" :style="content_title_style + 'color:' + form_style.news_color" :data-value="item.notice_link.page" @tap="url_event">
                                    <view class="text-line-1">{{ item.notice_title }}</view>
                                </view>
                            </swiper-item>
                        </swiper>
                        <view v-if="form_content.is_right_button == '1'" class="flex-row align-c" :style="'color: ' + form_style.right_button_color + ';font-size:' + form_style.right_button_size * 2 + 'rpx;'" :data-value="form_content.more_link.page" @tap="url_event">
                            {{ form_content.right_title }}
                            <view class="pr">
                                <iconfont name="icon-arrow-right" :color="form_style.right_button_color || '#999'" :size="form_style.right_button_size * 2 + 'rpx'"  propContainerDisplay="flex"></iconfont>
                            </view>
                        </view>
                    </view>
                </view>
            </template>
            <!-- 样式三：marquee；is_full_display 全部显示 / marquee_scroll 横向滚动 -->
            <template v-else-if="form_content.notice_style == 'marquee'">
                <!-- 全部显示：高度随内容；非全部显示：固定 container_height -->
                <view
                    class="news-box news-box-marquee"
                    :class="{ 'news-box-marquee--full': is_marquee_full_display }"
                    :style="marquee_box_style"
                >
                    <!-- 全部显示时 news-marquee-row--full 使子项 stretch，配合图标容器 align-items 实现居上/居中/居下 -->
                    <view
                        class="news-marquee-row flex-row gap-8"
                        :class="{ 'news-marquee-row--full': is_marquee_full_display }"
                        :style="container_background_img_style"
                    >
                        <!-- 左图标/标题：全部显示时用 left_icon_container_style（对齐+外边距），否则 align-c 垂直居中 -->
                        <view
                            class="flex-shrink-0 flex-row"
                            :class="{ 'align-c': !is_marquee_full_display }"
                            :style="left_icon_container_style"
                        >
                            <template v-if="form_content.title_type == 'img-icon'">
                                <view v-if="form_content.img_src && form_content.img_src.length > 0">
                                    <image :src="form_content.img_src[0].url" class="border-radius-sm dis-block" mode="aspectFill" :style="img_style"></image>
                                </view>
                                <view v-else-if="form_content.icon_class">
                                    <iconfont :name="'icon-' + form_content.icon_class" :size="form_style.icon_size * 2 + 'rpx'" :color="form_style.icon_color" propContainerDisplay="flex"></iconfont>
                                </view>
                            </template>
                            <template v-else>
                                <view :style="title_style" class="padding-horizontal-sm border-radius-sm">{{ form_content.title || '' }}</view>
                            </template>
                        </view>
                        <!-- 全部显示：换行完整展示，不设 line-height -->
                        <template v-if="form_content.is_full_display === '1'">
                            <view class="news-marquee-full flex-1 flex-width">
                                <view class="news-marquee-full-text" :style="marquee_full_text_style" :data-value="marquee_link_page" @tap="url_event">{{ marquee_display_text }}</view>
                            </view>
                        </template>
                        <!-- 非全部显示：开启滚动=单条从右滚入；关闭滚动=单行省略 -->
                        <template v-else>
                            <view v-if="marquee_scroll_on && marquee_display_text" class="news-marquee-scroll flex-1 flex-width" :style="marquee_content_height" :data-value="marquee_link_page">
                                <view class="news-marquee-scroll-box">
                                    <text :id="marquee_text_id" class="news-marquee-scroll-text" :class="{ 'news-marquee-scroll-text--run': marquee_scroll_running }" :style="marquee_scroll_anim_style + marquee_body_text_style">{{ marquee_display_text }}</text>
                                </view>
                            </view>
                            <view v-else-if="marquee_display_text" class="news-marquee-static flex-1 flex-width" :style="marquee_content_height" :data-value="marquee_link_page">
                                <view class="news-marquee-static-text" :style="marquee_body_text_style">{{ marquee_display_text }}</view>
                            </view>
                        </template>
                        <!-- 右侧更多：全部显示时合并 right_icon_container_style 与文字样式 -->
                        <view
                            v-if="form_content.is_right_button == '1'"
                            class="flex-row flex-shrink-0"
                            :class="{ 'align-c': !is_marquee_full_display }"
                            :style="right_button_style"
                            :data-value="form_content.more_link.page"
                            @tap="url_event"
                        >
                            {{ form_content.right_title }}
                            <view class="pr">
                                <iconfont name="icon-arrow-right" :color="form_style.right_button_color || '#999'" :size="form_style.right_button_size * 2 + 'rpx'" propContainerDisplay="flex"></iconfont>
                            </view>
                        </view>
                    </view>
                </view>
            </template>
            <!-- 样式二：card，标题区 + 序号列表 -->
            <template v-else>
                <view class="news-card" :style="container_background_style">
                    <view class="flex-col gap-10" :style="container_background_img_style">
                        <view class="flex-row wh-auto jc-sb align-c">
                            <template v-if="form_content.title_type == 'img-icon'">
                                <template v-if="form_content.icon_class">
                                    <iconfont :name="'icon-' + form_content.icon_class" :size="form_style.icon_size * 2 + 'rpx'" :color="form_style.icon_color" propContainerDisplay="flex"></iconfont>
                                </template>
                                <template v-else>
                                    <image v-if="form_content.img_src.length > 0" :src="form_content.img_src[0].url" class="border-radius-sm dis-block" mode="aspectFill" :style="img_style"></image>
                                </template>
                            </template>
                            <template v-else>
                                <view :style="title_style" class="padding-horizontal-sm border-radius-sm">{{ form_content.title }}</view>
                            </template>
                            <view v-if="form_content.is_right_button == '1'" class="flex-row align-c" :style="'color: ' + form_style.right_button_color + ';font-size:' + form_style.right_button_size * 2 + 'rpx;'" :data-value="form_content.more_link.page" @tap="url_event">
                                {{ form_content.right_title }}
                                <view class="pr">
                                    <iconfont name="icon-arrow-right" :color="form_style.right_button_color || '#999'" :size="form_style.right_button_size * 2 + 'rpx'" propContainerDisplay="flex"></iconfont>
                                </view>
                            </view>
                        </view>
                        <view v-for="(item, index) in notice_list" :key="index" class="flex-row" :style="content_title_style" :data-value="item.notice_link.page" @tap="url_event">
                            <view class="num" :class="'one' + (index + 1)">{{ index + 1 }}</view>
                            <view class="break" :style="'color:' + form_style.news_color">{{ item.notice_title }}</view>
                        </view>
                    </view>
                </view>
            </template>
        </view>
    </view>
</template>

<script>
    const app = getApp();
    import { background_computer, common_styles_computer, common_img_computer, gradient_computer, gradient_handle, radius_computer, padding_computer, isEmpty } from '@/common/js/common/common.js';
    /**
     * DIY 公告组件
     * notice_style：inherit 样式一 | card 样式二 | marquee 样式三
     * 样式三：is_full_display 控制全部显示；marquee_scroll 控制横向滚动
     */
    export default {
        props: {
            propValue: {
                type: Object,
                default: () => ({}),
            },
            propKey: {
                type: [String,Number],
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
                form_content: {},
                form_style: {},
                style_container: '',
                style_img_container: '',
                // 容器高度
                container_height: '',
                // 容器背景
                container_background_style: '',
                // 图片设置
                img_style: '',
                // 标题的设置
                title_style: '',
                // 内容标题设置
                content_title_style: '',
                // 指示器的样式
                // 样式一 swiper 轮播间隔（ms）
                interval_time: 3000,
                /** 样式三横向滚动：content.interval_time（秒），与 DIY 配置一致 */
                marquee_interval_sec: 0,
                // 样式三平移周期参考；样式一 swiper 仍用 interval_time
                swiper_duration: 500,
                // 轮播图滚动方向（仅样式一）
                direction_type: 'vertical',
                // 公告数据
                notice_list: [],
                /** 样式三：是否全部显示（高度随内容、图标可配置对齐） */
                is_marquee_full_display: false,
                /** 样式三：外层容器内联样式（含固定/自适应高度） */
                marquee_box_style: '',
                /** 样式三：非全部显示时中间内容区固定高度 */
                marquee_content_height: '',
                /** 样式三全部显示：左图标容器样式（align-items + margin） */
                left_icon_container_style: '',
                /** 样式三全部显示：右按钮图标容器样式（align-items + margin） */
                right_icon_container_style: '',
                /** 样式三：是否开启横向滚动 */
                marquee_scroll_on: true,
                /** 样式三：展示文案（marquee_content 或首条公告标题） */
                marquee_display_text: '',
                /** 样式三滚动：文案节点 id，供 sync_marquee_scroll 测量宽度 */
                marquee_text_id: 'notice-marquee-text',
                /** 样式三滚动：animation-duration / delay 动态样式 */
                marquee_scroll_anim_style: '',
                /** 样式三滚动：动画是否运行 */
                marquee_scroll_running: false,
                /** 样式三：点击跳转链接 */
                marquee_link_page: '',
                /** 样式三：滚动/静态单行文案样式（含 line-height） */
                marquee_body_text_style: '',
                /** 样式三：全部显示文案样式（不含 line-height，便于多行换行） */
                marquee_full_text_style: '',
                /** 样式三：右侧更多按钮完整样式（全部显示含对齐与外边距） */
                right_button_style: '',
            };
        },
        watch: {
            propKey() {
                this.init();
            },
            /** DIY 只改间隔/样式、propKey 不变时也要同步 interval_time */
            propValue: {
                deep: true,
                handler() {
                    this.init();
                },
            },
        },
        created() {
            this.init();
        },
        methods: {
            /** 样式三滚动间隔（秒）：content.interval_time，无则读 style.interval_time，默认 3 */
            get_marquee_interval_sec(content, style) {
                const raw =
                    content && content.interval_time !== undefined && content.interval_time !== null && content.interval_time !== ''
                        ? content.interval_time
                        : style && style.interval_time;
                if (raw === undefined || raw === null || raw === '') {
                    return 3;
                }
                const sec = Number(raw);
                return Number.isFinite(sec) && sec > 0 ? sec : 3;
            },
            /**
             * 解析 propValue（content/style），算出模板所需字符串与样式三跑马灯参数，一次 setData。
             */
            init() {
                const new_content = this.propValue.content || {};
                const new_style = this.propValue.style || {};

                // ---------- 容器：渐变、圆角、背景图、内边距 ----------
                const { container_color_list, container_direction, container_background_img_style, container_background_img, container_padding = '' } = new_style;
                const temp_obj = {
                    color_list: container_color_list,
                    direction: container_direction,
                    background_img: container_background_img,
                    background_img_style: container_background_img_style,
                };
                // 新增容器内边距
                let padding = '';
                // 不等于空的时候使用新数据
                if (!isEmpty(container_padding)) {
                    padding = padding_computer(container_padding);
                } else {
                    // 为空的时候使用默认数据
                    let old_padding = { padding: 15, padding_top: 15, padding_right: 15, padding_bottom: 15, padding_left: 15 };
                    if (new_content.notice_style === 'inherit' || new_content.notice_style === 'marquee') {
                        old_padding = { padding: 0, padding_top: 0, padding_right: 10, padding_bottom: 0, padding_left: 10, }
                    }
                    padding = padding_computer(old_padding);
                }
                const temp_container_background_style = gradient_computer(temp_obj) + radius_computer(new_style.container_radius) + `overflow:hidden;`;
                const temp_container_background_img_style = background_computer(temp_obj) + padding + 'box-sizing: border-box;';

                // ---------- 标题区渐变色（左侧「公告」文案） ----------
                const gradient = gradient_handle(new_style.title_color_list, '90deg');

                // ---------- 轮播间隔：DIY 填秒，存为 interval_time（毫秒）；样式一 swiper 使用 ----------
                const time = (() => {
                    const rawIv =
                        new_content.interval_time !== undefined && new_content.interval_time !== null && new_content.interval_time !== ''
                            ? new_content.interval_time
                            : new_style.interval_time;
                    const sec = Number(rawIv) > 0 ? Number(rawIv) : 3;
                    return sec * 1000;
                })();
                const raw_duration = new_style.swiper_duration;
                const swiper_duration =
                    raw_duration !== undefined && raw_duration !== null && raw_duration !== '' && !Number.isNaN(Number(raw_duration))
                        ? Number(raw_duration)
                        : 500;
                const direction = new_content.direction;

                // ---------- 公告列表：仅 is_show == '1' ----------
                const list_src = Array.isArray(new_content.notice_list) ? new_content.notice_list : [];
                const new_notice_list = list_src.filter((item) => item.is_show == '1');

                const container_h = Number(new_style.container_height) > 0 ? Number(new_style.container_height) : 44;
                const news_sz = Number(new_style && new_style.news_size);
                const news_base = Number.isFinite(news_sz) && news_sz > 0 ? news_sz : 12;

                // ---------- 资讯标题字号（样式一/二在模板里拼 color；样式三静态行用 marquee_body_text_style） ----------
                const content_title_style = `font-size: ${news_base * 2}rpx; font-weight: ${new_style.news_typeface || 400};`;

                // ---------- 样式三：is_full_display、marquee_scroll、图标位置、文案 ----------
                const is_full_raw = new_content.is_full_display;
                const is_full_display = is_full_raw === null || is_full_raw === undefined || is_full_raw === '' ? '1' : String(is_full_raw);
                const is_marquee_full_display = new_content.notice_style === 'marquee' && is_full_display === '1';
                const scroll_v = new_content.marquee_scroll;
                const marquee_scroll_on = !(scroll_v === '0' || scroll_v === 0 || scroll_v === false);
                let marquee_display_text = String(new_content.marquee_content ?? '').trim();
                if (!marquee_display_text && new_notice_list.length > 0 && new_notice_list[0].notice_title != null) {
                    marquee_display_text = String(new_notice_list[0].notice_title).trim();
                }
                if (!marquee_display_text) {
                    marquee_display_text = '';
                }
                const marquee_interval_sec = this.get_marquee_interval_sec(new_content, new_style);
                const news_c = new_style && new_style.news_color;
                const marquee_notice_color = news_c != null && news_c !== '' ? news_c : '#333333';
                const marquee_text_base = content_title_style + 'color:' + marquee_notice_color + ';';
                // 全部显示不加 line-height；滚动/静态单行需 line-height 与容器等高
                const marquee_full_text_style = marquee_text_base;
                const marquee_body_text_style = marquee_text_base + 'line-height:' + container_h * 2 + 'rpx;';
                
                const marquee_text_id = 'notice-marquee-text-' + String(this.propKey);
                let left_icon_container_style = '';
                let right_icon_container_style = '';
                // 全部显示：行 stretch + 图标容器 align-items，实现 left/right_icon_position 与 margin
                if (is_marquee_full_display) {
                    /** 垂直对齐：top/center/bottom → flex-start/center/flex-end */
                    const get_icon_align = (position) => {
                        const alignMap = { top: 'flex-start', center: 'center', bottom: 'flex-end' };
                        return alignMap[position] || 'center';
                    };
                    const default_icon_margin = { padding: 0, padding_top: 0, padding_right: 0, padding_bottom: 0, padding_left: 0 };
                    /** 构建图标容器样式：align-self:stretch 撑满行高后再对齐子元素 */
                    const build_icon_container_style = (position, margin) => {
                        const align = get_icon_align(position || 'center');
                        const m = margin || default_icon_margin;
                        const mt = Number(m.padding_top || 0) * 2;
                        const mr = Number(m.padding_right || 0) * 2;
                        const mb = Number(m.padding_bottom || 0) * 2;
                        const ml = Number(m.padding_left || 0) * 2;
                        return `display:flex;flex-direction:row;align-self:stretch;align-items:${align};margin-top:${mt}rpx;margin-right:${mr}rpx;margin-bottom:${mb}rpx;margin-left:${ml}rpx;`;
                    };
                    const legacy_position = new_style.icon_position;
                    const legacy_margin = new_style.icon_margin;
                    left_icon_container_style = build_icon_container_style(
                        new_style.left_icon_position || legacy_position || 'center',
                        new_style.left_icon_margin || legacy_margin || default_icon_margin
                    );
                    right_icon_container_style = build_icon_container_style(
                        new_style.right_icon_position || legacy_position || 'center',
                        new_style.right_icon_margin || legacy_margin || default_icon_margin
                    );
                }
                // 右侧更多：非全部显示仅颜色字号；全部显示叠加图标对齐与外边距
                let right_button_style =
                    'color:' +
                    (new_style.right_button_color || '#999') +
                    ';font-size:' +
                    (Number(new_style.right_button_size) > 0 ? Number(new_style.right_button_size) : 12) * 2 +
                    'rpx;';
                if (is_marquee_full_display) {
                    right_button_style = right_icon_container_style + right_button_style;
                }
                const marquee_content_height = is_marquee_full_display ? '' : 'height:' + container_h * 2 + 'rpx;';
                const marquee_box_style = temp_container_background_style + (is_marquee_full_display ? 'height:auto;' : 'height:' + container_h * 2 + 'rpx;');
                // 点击跳转：首条公告链接，无则用「更多」链接
                let marquee_link_page = '';
                if (new_notice_list[0] && new_notice_list[0].notice_link && new_notice_list[0].notice_link.page != null) {
                    marquee_link_page = new_notice_list[0].notice_link.page;
                }
                if (marquee_link_page === '' && new_content.more_link && new_content.more_link.page != null) {
                    marquee_link_page = new_content.more_link.page;
                }

                const form_content_out = { ...new_content };
                if (form_content_out.is_full_display == null || form_content_out.is_full_display === undefined || form_content_out.is_full_display === '') {
                    form_content_out.is_full_display = is_full_display;
                }

                this.setData({
                    // —— 通用 ——
                    form_content: form_content_out,
                    form_style: new_style,
                    container_height: is_marquee_full_display ? '' : 'height:' + container_h * 2 + 'rpx',
                    container_background_style: temp_container_background_style,
                    container_background_img_style: temp_container_background_img_style,
                    img_style: `height: ${new_style.title_height * 2}rpx; width: ${new_style.title_width * 2}rpx`,
                    title_style: `color:${new_style.title_color}; font-size: ${new_style.title_size * 2}rpx; font-weight: ${new_style.title_typeface}; ${gradient}`,
                    content_title_style,
                    notice_list: new_notice_list,
                    interval_time: time,
                    swiper_duration: swiper_duration,
                    direction_type: direction,
                    style_container: common_styles_computer(new_style.common_style),
                    style_img_container: common_img_computer(new_style.common_style, this.propIndex),
                    // —— 仅样式三模板使用 ——
                    is_marquee_full_display,
                    marquee_box_style,
                    marquee_content_height,
                    left_icon_container_style,
                    right_icon_container_style,
                    marquee_scroll_on,
                    marquee_interval_sec,
                    marquee_display_text,
                    marquee_text_id,
                    marquee_scroll_anim_style: '',
                    marquee_scroll_running: false,
                    marquee_link_page,
                    marquee_body_text_style,
                    marquee_full_text_style,
                    right_button_style,
                }, () => {
                    this.sync_marquee_scroll();
                });
            },
            /**
             * 样式三滚动：测量容器与文案宽度，计算 animation-duration / delay
             * 单条从右侧滚入，非双份文案并排
             */
            sync_marquee_scroll() {
                const sec = Number(this.marquee_interval_sec);
                if (!this.marquee_scroll_on || this.is_marquee_full_display || !this.marquee_display_text || !Number.isFinite(sec) || sec <= 0) {
                    return;
                }
                const run = () => {
                    const query = uni.createSelectorQuery().in(this);
                    query.select('.news-marquee-scroll-box').boundingClientRect();
                    query.select('#' + this.marquee_text_id).boundingClientRect();
                    query.exec((res) => {
                        const box = res && res[0];
                        const text = res && res[1];
                        let anim_style = 'animation-duration:' + sec + 's;animation-delay:0s;';
                        if (box && text && box.width && text.width) {
                            const speed = Math.max(30, text.width / sec);
                            const duration = text.width / speed;
                            const delay = -(box.width / speed);
                            anim_style = 'animation-duration:' + duration + 's;animation-delay:' + delay + 's;';
                        }
                        this.setData({
                            marquee_scroll_anim_style: anim_style,
                            marquee_scroll_running: true,
                        });
                    });
                };
                if (typeof this.$nextTick === 'function') {
                    this.$nextTick(run);
                } else {
                    setTimeout(run, 50);
                }
                // #ifdef MP-WEIXIN
                setTimeout(run, 150);
                // #endif
            },
            // 公告链接跳转
            url_event(e) {
                app.globalData.url_event(e);
            },
        },
    };
</script>

<style lang="scss" scoped>
    .news-box {
        overflow: hidden;
        background: #fff;
    }
    .news-card {
        background: #fff;
    }
    .num {
        padding-right: 14rpx;
        color: #999;
    }
    .one1 {
        color: #ea3323;
    }
    .one2 {
        color: #ff7303;
    }
    .one3 {
        color: #ffc300;
    }
    .two-style {
        width: 48rpx;
        height: 48rpx;
    }
    .break {
        word-break: break-word;
        overflow-wrap: break-word;
        word-wrap: break-word;
    }
    /* ---------- 样式三 marquee ---------- */
    .news-box-marquee {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    /* 全部显示：容器高度随内容 */
    .news-box-marquee--full {
        height: auto;
        min-height: 0;
    }
    .news-marquee-row {
        width: 100%;
        align-items: center;
    }
    /* 全部显示：子项 stretch，左/右图标才能在同高容器内居上/居中/居下 */
    .news-marquee-row--full {
        align-items: stretch;
    }
    .flex-width {
        min-width: 0;
    }
    .news-marquee-full {
        flex: 1 1 0;
        min-width: 0;
        overflow: visible;
        display: flex;
        align-items: center;
        align-self: center;
    }
    /* 全部显示：多行换行 */
    .news-marquee-full-text {
        width: 100%;
        min-width: 0;
        overflow: visible;
        white-space: normal;
        word-break: break-all;
        word-wrap: break-word;
    }
    .news-marquee-scroll {
        min-width: 0;
        align-self: center;
    }
    .news-marquee-scroll-box {
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: relative;
    }
    /* 横向滚动：单条 padding-left:100% 从右侧进入 */
    .news-marquee-scroll-text {
        position: absolute;
        top: 0;
        left: 0;
        display: inline-block;
        height: 100%;
        white-space: nowrap;
        padding-left: 100%;
        animation-name: notice-marquee-single;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
        animation-play-state: paused;
    }
    .news-marquee-scroll-text--run {
        animation-play-state: running;
    }
    @keyframes notice-marquee-single {
        100% {
            transform: translate3d(-100%, 0, 0);
        }
    }
    .news-marquee-static {
        min-width: 0;
        overflow: hidden;
        display: flex;
        align-items: center;
        align-self: center;
    }
    /* 关闭滚动：单行省略 */
    .news-marquee-static-text {
        width: 100%;
        min-width: 0;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
</style>
