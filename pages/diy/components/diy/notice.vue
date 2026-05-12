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
                            <view :style="title_style" class="padding-horizontal-sm border-radius-sm">{{ form_content.title || '公告' }}</view>
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
            <!-- 样式三：marquee，中间区 uni-notice-bar 横向滚动或静态一行 -->
            <template v-else-if="form_content.notice_style == 'marquee'">
                <view class="news-box" :style="container_background_style + container_height">
                    <view class="flex-row align-c gap-8" :style="container_background_img_style">
                        <view class="flex-row align-c flex-shrink">
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
                        <!-- 样式三滚动区：直接使用 uni-notice-bar（与官方实现一致，小程序端可正常滚动） -->
                        <view
                            class="notice-marquee-host flex-1 oh notice-marquee-uni-wrap"
                            :style="container_height"
                        >
                            <uni-notice-bar
                                v-if="marquee_scroll_on"
                                :key="marquee_notice_bar_key"
                                :scrollable="true"
                                :show-icon="false"
                                :show-get-more="false"
                                :single="false"
                                :text="marquee_display_text"
                                :speed="marquee_notice_speed"
                                :color="marquee_notice_color"
                                :font-size="marquee_notice_font_px"
                                background-color="rgba(0,0,0,0)"
                                @click.stop="marquee_uni_click"
                            />
                            <view
                                v-else
                                class="flex-row align-c ht-auto notice-marquee-static"
                                :style="container_height + marquee_body_text_style"
                                :data-value="marquee_link_page"
                                @tap="url_event"
                            >
                                <view class="text-line-1 flex-1">{{ marquee_display_text }}</view>
                            </view>
                        </view>
                        <view v-if="form_content.is_right_button == '1'" class="flex-row align-c flex-shrink" :style="'color: ' + form_style.right_button_color + ';font-size:' + form_style.right_button_size * 2 + 'rpx;'" :data-value="form_content.more_link.page" @tap="url_event">
                            {{ form_content.right_title }}
                            <view class="pr">
                                <iconfont name="icon-arrow-right" :color="form_style.right_button_color || '#999'" :size="form_style.right_button_size * 2 + 'rpx'" propContainerDisplay="flex"></iconfont>
                            </view>
                        </view>
                    </view>
                </view>
            </template>
            <!-- 样式二：默认卡片，标题区 + 序号列表 -->
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
    import uniNoticeBar from '@/uni_modules/uni-notice-bar/components/uni-notice-bar/uni-notice-bar.vue';
    /**
     * DIY 公告：notice_style = inherit | marquee | 其他(卡片列表)
     * 样式三横向滚动使用 uni-notice-bar（仅 mounted 内测宽算速），故跑马灯相关字段随 init 写入并靠 key 重建子组件。
     */
    export default {
        components: {
            uniNoticeBar,
        },
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
                // 轮播间隔 ms：与 DIY 一致优先 content.interval_time，其次 style，默认 3s
                interval_time: 3000,
                // 样式三平移周期参考；样式一 swiper 仍用 interval_time
                swiper_duration: 500,
                // 轮播图滚动方向（仅样式一）
                direction_type: 'vertical',
                // 公告数据
                notice_list: [],
                /** 样式三（marquee）由 init / setData 维护 */
                marquee_scroll_on: true,
                marquee_display_text: '',
                marquee_notice_speed: 35,
                marquee_notice_bar_key: '',
                marquee_notice_font_px: 14,
                marquee_notice_color: '#333333',
                marquee_link_page: '',
                /** 仅样式三：关闭滚动时正文行（原 marquee_item_style） */
                marquee_body_text_style: '',
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
                const time =
                    (() => {
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

                // ---------- 资讯标题字号（样式一/二在模板里拼 color；样式三静态行用 marquee_body_text_style） ----------
                const content_title_style = `font-size: ${new_style.news_size * 2}rpx; font-weight: ${new_style.news_typeface};`;

                // ---------- 样式三：marquee_scroll、文案、链接、uni-notice-bar 的 speed/font/color/key ----------
                // marquee_scroll：'0' / 0 / false 关闭自动滚动，其余视为开启
                const scroll_v = new_content.marquee_scroll;
                const marquee_scroll_on = !(scroll_v === '0' || scroll_v === 0 || scroll_v === false);
                // 展示文案：优先 content.marquee_content，否则取列表首条标题
                let marquee_display_text = String(new_content.marquee_content ?? '').trim();
                if (!marquee_display_text && new_notice_list.length > 0 && new_notice_list[0].notice_title != null) {
                    marquee_display_text = String(new_notice_list[0].notice_title).trim();
                }
                // 点击跳转：首条公告链接，无则用「更多」链接
                let marquee_link_page = '';
                if (new_notice_list[0] && new_notice_list[0].notice_link && new_notice_list[0].notice_link.page != null) {
                    marquee_link_page = new_notice_list[0].notice_link.page;
                }
                if (marquee_link_page === '' && new_content.more_link && new_content.more_link.page != null) {
                    marquee_link_page = new_content.more_link.page;
                }
                // speed（像素/秒）：uni-notice-bar 内部 duration = textWidth/speed；105000 = 35×3000，使默认 3s 间隔对应官方默认 speed≈35
                const ms = Number(time) > 0 ? Number(time) : 3000;
                const marquee_notice_speed = Math.max(6, Math.min(120, Math.round(105000 / ms)));
                // 子组件 key：interval、speed、文案任一变化即重建，否则改间隔不重新 initSize
                const marquee_notice_bar_key =
                    String(this.propKey) +
                    '-ub-' +
                    String(ms) +
                    '-' +
                    String(marquee_notice_speed) +
                    '-' +
                    String(marquee_display_text || '');
                // uni-notice-bar 的 fontSize 为 px：DIY news_size 为设计值，×2 为 rpx 再 upx2px
                const news_sz = Number(new_style && new_style.news_size);
                const news_base = Number.isFinite(news_sz) && news_sz > 0 ? news_sz : 14;
                const news_rpx = news_base * 2;
                let marquee_notice_font_px = 14;
                try {
                    if (typeof uni !== 'undefined' && typeof uni.upx2px === 'function') {
                        marquee_notice_font_px = Math.max(10, Math.round(uni.upx2px(news_rpx)));
                    } else {
                        throw new Error('no upx2px');
                    }
                } catch (e) {
                    const w = (typeof uni !== 'undefined' && uni.getSystemInfoSync && uni.getSystemInfoSync().windowWidth) || 375;
                    marquee_notice_font_px = Math.max(10, Math.round((news_rpx * w) / 750));
                }
                const news_c = new_style && new_style.news_color;
                const marquee_notice_color = news_c != null && news_c !== '' ? news_c : '#333333';
                // 样式三关闭滚动时：与原先 content_title_style + color 一致
                const marquee_body_text_style = content_title_style + 'color:' + marquee_notice_color;

                this.setData({
                    // —— 通用 ——
                    form_content: new_content,
                    form_style: new_style,
                    container_height: 'height:' + new_style.container_height * 2 + 'rpx',
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
                    marquee_scroll_on,
                    marquee_display_text,
                    marquee_notice_speed,
                    marquee_notice_bar_key,
                    marquee_notice_font_px,
                    marquee_notice_color,
                    marquee_link_page,
                    marquee_body_text_style,
                });
            },
            // 跳转链接
            url_event(e) {
                app.globalData.url_event(e);
            },
            /** uni-notice-bar 的 click 无 dataset，与 url_event 对齐 */
            marquee_uni_click() {
                const v = this.marquee_link_page;
                if (v === '' || v == null) {
                    return;
                }
                app.globalData.url_event({
                    currentTarget: { dataset: { value: v } },
                });
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
    .notice-marquee-uni-wrap {
        min-width: 0;
        flex: 1;
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    /* 嵌入 DIY 一行：去掉官方默认外边距/内边距，避免占不满 flex */
    .notice-marquee-uni-wrap ::v-deep .uni-noticebar {
        width: 100%;
        padding: 0 !important;
        margin: 0 !important;
        margin-bottom: 0 !important;
        box-sizing: border-box;
        background-color: transparent !important;
    }
    .notice-marquee-uni-wrap ::v-deep .uni-noticebar__content-wrapper--scrollable {
        flex: 1;
        min-width: 0;
    }
    .notice-marquee-static {
        min-width: 0;
        overflow: hidden;
    }
</style>
