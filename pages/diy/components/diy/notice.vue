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
            <!-- 样式三：marquee；is_full_display 全部显示 / marquee_scroll 横向滚动 -->
            <template v-else-if="form_content.notice_style == 'marquee'">
                <view
                    class="news-box news-box-marquee"
                    :class="{ 'news-box-marquee--full': is_marquee_full_display }"
                    :style="marquee_box_style"
                >
                    <view class="news-marquee-row flex-row gap-8" :style="container_background_img_style">
                        <view class="flex-shrink-0 flex-row align-c" :style="is_marquee_full_display ? left_icon_container_style : ''">
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
                        <!-- 全部显示：完整展示，超出换行，高度随内容 -->
                        <template v-if="form_content.is_full_display === '1'">
                            <view class="news-marquee-full flex-1 flex-width">
                                <view class="news-marquee-full-text" :style="marquee_body_text_style" :data-value="marquee_link_page" @tap="url_event">{{ marquee_display_text }}</view>
                            </view>
                        </template>
                        <!-- 非全部显示：滚动或单行省略 -->
                        <template v-else>
                            <view v-if="marquee_scroll_on" class="notice-marquee-host flex-1 flex-width oh notice-marquee-uni-wrap" :style="marquee_content_height">
                                <!-- 用于测量文案真实宽度，speed = 宽度 / interval_time（与 DIY swiper 整段平移一致） -->
                                <view
                                    :id="marquee_measure_id"
                                    class="notice-marquee-measure"
                                    :style="marquee_body_text_style"
                                >{{ marquee_display_text }}</view>
                                <uni-notice-bar
                                    v-if="marquee_notice_bar_ready"
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
                            </view>
                            <view
                                v-else
                                class="news-marquee-static flex-1 flex-width"
                                :style="marquee_content_height"
                                :data-value="marquee_link_page"
                                @tap="url_event"
                            >
                                <view class="news-marquee-static-text" :style="marquee_body_text_style">{{ marquee_display_text }}</view>
                            </view>
                        </template>
                        <view
                            v-if="form_content.is_right_button == '1'"
                            class="flex-row align-c flex-shrink-0"
                            :style="(is_marquee_full_display ? right_icon_container_style : '') + 'color: ' + form_style.right_button_color + ';font-size:' + form_style.right_button_size * 2 + 'rpx;'"
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
    import uniNoticeBar from '@/uni_modules/uni-notice-bar/components/uni-notice-bar/uni-notice-bar.vue';
    /**
     * DIY 公告：notice_style = inherit | marquee | card
     * 样式三滚动：测文案宽度后 speed = 宽度/interval_time，与 DIY swiper 在间隔时间内滚完全文一致
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
                /** 样式三（marquee）由 init / setData 维护 */
                is_marquee_full_display: false,
                marquee_box_style: '',
                marquee_content_height: '',
                left_icon_container_style: '',
                right_icon_container_style: '',
                marquee_scroll_on: true,
                marquee_display_text: '',
                marquee_measure_id: 'notice-marquee-measure',
                marquee_notice_bar_ready: false,
                marquee_notice_speed: 100,
                marquee_notice_bar_key: '',
                marquee_notice_font_px: 14,
                marquee_notice_color: '#333333',
                marquee_link_page: '',
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
            /** 样式三滚动间隔（秒）：仅读 content.interval_time */
            get_marquee_interval_sec(content) {
                const raw = content && content.interval_time;
                if (raw === undefined || raw === null || raw === '') {
                    return 0;
                }
                const sec = Number(raw);
                return Number.isFinite(sec) && sec > 0 ? sec : 0;
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
                // 图标位置/外边距仅在「全部显示」开启时生效（与 DIY 配置面板一致）
                let left_icon_container_style = '';
                let right_icon_container_style = '';
                if (is_marquee_full_display) {
                    const get_icon_align = (position) => {
                        const alignMap = { top: 'flex-start', center: 'center', bottom: 'flex-end' };
                        return alignMap[position] || 'center';
                    };
                    const default_icon_margin = { padding: 0, padding_top: 0, padding_right: 0, padding_bottom: 0, padding_left: 0 };
                    const build_icon_container_style = (position, margin) => {
                        const align = get_icon_align(position || 'center');
                        const m = margin || default_icon_margin;
                        const mt = Number(m.padding_top || 0) * 2;
                        const mr = Number(m.padding_right || 0) * 2;
                        const mb = Number(m.padding_bottom || 0) * 2;
                        const ml = Number(m.padding_left || 0) * 2;
                        return `align-items: ${align}; margin-top: ${mt}rpx; margin-right: ${mr}rpx; margin-bottom: ${mb}rpx; margin-left: ${ml}rpx;`;
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
                const marquee_content_height = is_marquee_full_display ? '' : 'height:' + new_style.container_height * 2 + 'rpx;';
                const marquee_box_style = temp_container_background_style + (is_marquee_full_display ? 'height:auto;' : 'height:' + new_style.container_height * 2 + 'rpx;');
                // 点击跳转：首条公告链接，无则用「更多」链接
                let marquee_link_page = '';
                if (new_notice_list[0] && new_notice_list[0].notice_link && new_notice_list[0].notice_link.page != null) {
                    marquee_link_page = new_notice_list[0].notice_link.page;
                }
                if (marquee_link_page === '' && new_content.more_link && new_content.more_link.page != null) {
                    marquee_link_page = new_content.more_link.page;
                }
                const marquee_interval_sec = this.get_marquee_interval_sec(new_content);
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
                const marquee_body_text_style = content_title_style + 'color:' + marquee_notice_color;
                const marquee_measure_id = 'notice-marquee-measure-' + String(this.propKey);
                // speed = 文案宽度 / interval_time（秒）；init 后按实测宽度再校正
                let est_w = 0;
                for (let i = 0; i < marquee_display_text.length; i++) {
                    est_w += marquee_display_text.charCodeAt(i) > 127 ? marquee_notice_font_px : marquee_notice_font_px * 0.55;
                }
                est_w = Math.max(est_w, marquee_notice_font_px * 3);
                const marquee_notice_speed =
                    marquee_interval_sec > 0 ? Math.max(30, Math.ceil(est_w / marquee_interval_sec)) : 100;
                const marquee_notice_bar_key =
                    String(this.propKey) +
                    '-ub-' +
                    String(marquee_interval_sec) +
                    '-' +
                    String(marquee_notice_speed) +
                    '-' +
                    String(is_full_display) +
                    '-' +
                    String(marquee_display_text || '');

                const form_content_out = { ...new_content };
                if (form_content_out.is_full_display == null || form_content_out.is_full_display === undefined || form_content_out.is_full_display === '') {
                    form_content_out.is_full_display = is_full_display;
                }

                this.setData({
                    // —— 通用 ——
                    form_content: form_content_out,
                    form_style: new_style,
                    container_height: is_marquee_full_display ? '' : 'height:' + new_style.container_height * 2 + 'rpx',
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
                    marquee_measure_id,
                    marquee_notice_bar_ready: false,
                    marquee_notice_speed,
                    marquee_notice_bar_key,
                    marquee_notice_font_px,
                    marquee_notice_color,
                    marquee_link_page,
                    marquee_body_text_style,
                }, () => {
                    this.sync_marquee_notice_speed();
                });
            },
            /** 测量文案宽度：textWidth/speed = content.interval_time（秒） */
            sync_marquee_notice_speed() {
                const sec = Number(this.marquee_interval_sec);
                if (!this.marquee_scroll_on || this.is_marquee_full_display || !this.marquee_display_text || !Number.isFinite(sec) || sec <= 0) {
                    return;
                }
                const next = () => {
                    const query = uni.createSelectorQuery().in(this);
                    query
                        .select('#' + this.marquee_measure_id)
                        .boundingClientRect((rect) => {
                            if (!rect || !rect.width) {
                                this.setData({ marquee_notice_bar_ready: true });
                                return;
                            }
                            const speed = Math.max(30, Math.ceil(rect.width / sec));
                            const key =
                                String(this.propKey) +
                                '-ub-' +
                                String(sec) +
                                '-' +
                                String(speed) +
                                '-' +
                                String(this.form_content.is_full_display) +
                                '-' +
                                String(this.marquee_display_text || '');
                            this.setData({
                                marquee_notice_speed: speed,
                                marquee_notice_bar_key: key,
                                marquee_notice_bar_ready: true,
                            });
                        })
                        .exec();
                };
                if (typeof this.$nextTick === 'function') {
                    this.$nextTick(next);
                } else {
                    setTimeout(next, 50);
                }
            },
            // 跳转链接
            url_event(e) {
                app.globalData.url_event(e);
            },
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
    .news-box-marquee {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .news-box-marquee--full {
        height: auto;
        min-height: 0;
    }
    .news-marquee-row {
        width: 100%;
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
    .news-marquee-full-text {
        width: 100%;
        min-width: 0;
        overflow: visible;
        white-space: normal;
        word-break: break-all;
        word-wrap: break-word;
    }
    .notice-marquee-measure {
        position: fixed;
        left: -9999px;
        top: 0;
        white-space: nowrap;
        pointer-events: none;
        visibility: hidden;
        z-index: -1;
    }
    .notice-marquee-uni-wrap {
        min-width: 0;
        flex: 1;
        display: flex;
        flex-direction: row;
        align-items: center;
        align-self: center;
    }
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
    .news-marquee-static {
        min-width: 0;
        overflow: hidden;
        display: flex;
        align-items: center;
        align-self: center;
    }
    .news-marquee-static-text {
        width: 100%;
        min-width: 0;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
</style>
