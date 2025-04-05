<template>
    <!-- 选项卡 -->
    <view class="tabs-container pr" :style="tabs_z_index">
        <view :class="top_up == '1' ? 'tabs-top' : ''" :style="tabs_top_style + (top_up == '1' ? propContentPadding : '')">
            <view :style="style_margin_container">
                <view class="tabs-contents bs-bb pr" :style="style_container">
                    <view :class="top_up == '1' ? 'bs-bb' : 'wh-auto bs-bb'" :style="style_img_container">
                        <component-diy-modules-tabs-view :propKey="propKey" :propValue="tabs_data" :propIsTabsIcon="true" :propTop="propTop" :propsTabsContainer="propsTabsContainer + (propIsRotatingBackground ? propBgStyle : '')" :propIsRotatingBackground="propIsRotatingBackground" :propBgImgStyle="propBgImgStyle" :propsTabsImgContainer="propsTabsImgContainer" :propStyle="propStyle" :propTabsSlidingFixedBg="tabs_sliding_fixed_bg" @onTabsTap="tabs_click_event" @tabsZindex="tabsZindex"></component-diy-modules-tabs-view>
                    </view>
                </view>
            </view>
        </view>
        <view v-if="top_up == '1'" class="tabs-seat" :style="'height:' + (propIsCommon ? tabs_seat_height : tabs_carousel_seat_height) + 'px;'"></view>
    </view>
</template>

<script>
    const app = getApp();
    import { common_styles_computer, common_img_computer, padding_computer, margin_computer, gradient_computer, background_computer } from '@/common/js/common/common.js';
    import componentDiyModulesTabsView from '@/pages/diy/components/diy/modules/tabs-view';
    // 状态栏高度
    var bar_height = parseInt(app.globalData.get_system_info('statusBarHeight', 0));
    // #ifdef MP-TOUTIAO
    bar_height = 0;
    // #endif
    export default {
        props: {
            propValue: {
                type: Object,
                default: () => ({}),
            },
            // 置顶距离顶部高度
            propTop: {
                type: [String, Number],
                default: '0',
            },
            propStickyTop: {
                type: Number,
                default: 0,
            },
            // 是否导航栏置顶
            propNavIsTop: {
                type: Boolean,
                default: true,
            },
            // 是否选项卡置顶
            propTabsIsTop: {
                type: Boolean,
                default: false,
            },
            propIsCommon: {
                type: Boolean,
                default: true,
            },
            propSpacingCommonStyle: {
                type: Object,
                default: () => ({}),
            },
            // 样式
            propStyle: {
                type: String,
                default: '',
            },
            propKey: {
                type: [String, Number],
                default: '',
            },
            propsTabsContainer: {
                type: String,
                default: ''
            },
            propsTabsImgContainer: {
                type: String,
                default: '',
            },
            propContentPadding: {
                type: String,
                default: '',
            },
            // 组件渲染的下标
            propIndex: {
                type: Number,
                default: 1000000,
            },
            propIsImmersionModel: {
                type: Boolean,
                default: false
            },
            propNewIsTabsSafeDistance: {
                type: Boolean,
                default: true
            },
            propTabsSlidingFixedBg: {
                type: String,
                default: ''
            },
            propIsRotatingBackground: {
                type: Boolean,
                default: false
            },
            propBgStyle: {
                type: String,
                default: ''
            },
            propBgImgStyle: {
                type: String,
                default: ''
            }
        },
        components: {
            componentDiyModulesTabsView,
        },
        data() {
            return {
                style_container: '',
                style_img_container: '',
                tabs_sliding_fixed_bg: '',
                content: '',
                tabs_data: {},
                // 是否滑动置顶
                top_up: '0',
                // 置顶时，选项卡高度
                tabs_seat_height: 0,
                // 置顶时，轮播选项卡高度
                tabs_carousel_seat_height: 0,
                // 置顶时，选项卡样式
                tabs_top_style: '',
                style_margin_container: '',
                tabs_z_index: ''
            };
        },
        created() {
            this.init();
        },
        mounted() {
            setTimeout(() => {
                this.get_tabs_height();
            }, 100);
        },
        // 属性值改变监听
        watch: {
            // 数据
            propTabsIsTop(value, old_value) {
                this.init();
                setTimeout(() => {
                    this.get_tabs_height();
                }, 100);
            },
            propTop(val) {
                this.init();
            },
            propStickyTop(val) {
                this.init();
            },
            propKey(val) {
                // 初始化
                this.init();
            },
            propSpacingCommonStyle(val) {
                // 初始化
                this.init();
            },
        },
        methods: {
            // 初始化数据
            init() {
                const new_content = this.propValue.content || {};
                const new_style = this.propValue.style || {};
                let new_tabs_data = JSON.parse(JSON.stringify(this.propValue));
                new_tabs_data.content.tabs_list.unshift(new_tabs_data.content.home_data);
                // 判断选项卡是否置顶
                let other_style = this.propTop;
                let new_tabs_top_style = this.propNavIsTop || this.propTabsIsTop || new_content.tabs_top_up == '1' ? (new_content.tabs_top_up == '1' ? 'top:calc(' + (this.propStickyTop > 0 ? this.propStickyTop + 'px + ' : '') + other_style * 2 + 'rpx);z-index:11;' : '') : '';
                let new_top_up = new_content.tabs_top_up;
                // #ifdef H5 || MP-TOUTIAO
                // if (this.propTabsIsTop) {
                //     other_style = '0';
                // }
                new_tabs_top_style = 'top:calc(' + (this.propStickyTop > 0 ? this.propStickyTop + 'px + ' : '') + other_style * 2 + 'rpx);z-index:11;';
                new_top_up = this.propNavIsTop || this.propTabsIsTop ? new_content.tabs_top_up : '0';
                // #endif
                let tabs_bg = new_style.common_style.color_list;
                let new_tabs_background = '';
                if (!Array.isArray(tabs_bg) || tabs_bg.length === 0 || !tabs_bg[0] || !tabs_bg[0].color) {
                    new_tabs_background = 'background:#fff;';
                }
                const newPropTop = this.propIsCommon ? (app.globalData.rpx_to_px(this.propTop) + this.propStickyTop) : (app.globalData.rpx_to_px(this.propTop + this.propStickyTop));
                // 设置margin之后的显示问题
                const max_width = this.propIsCommon ? (new_style.common_style?.margin_left || 0) + (new_style.common_style?.margin_right || 0) : (this.propSpacingCommonStyle?.margin_left || 0) + (this.propSpacingCommonStyle?.margin_right || 0);
                this.setData({
                    tabs_data: new_tabs_data,
                    tabs_sliding_fixed_bg: this.propIsCommon ? gradient_computer(new_style.common_style) : this.propTabsSlidingFixedBg,
                    style_container: `max-width: calc(1600rpx - ${ max_width * 2 }rpx);` + (this.propIsCommon ? new_tabs_background + common_styles_computer(new_style.common_style) : new_content.tabs_top_up == '1' ? new_tabs_background + gradient_computer(new_style.common_style) + margin_computer(this.propSpacingCommonStyle) : ''), // 如果是选项卡轮播，不需要走默认样式
                    // 如果开了滑动置顶，并且开了沉浸式，不需要走传递过来的index，否则的话就用传递过来的index
                    style_img_container: this.propIsCommon ? common_img_computer(new_style.common_style, this.propIndex) : new_content.tabs_top_up == '1' ? background_computer(new_style.common_style) + padding_computer(this.propSpacingCommonStyle, 1, false) + 'box-sizing: border-box;' : '', // 如果是选项卡轮播，不需要走默认样式
                    tabs_top_style: new_tabs_top_style,
                    // 沉浸模式下并且开通了安全距离 会显示-的margin
                    style_margin_container: this.propIsImmersionModel && this.propNewIsTabsSafeDistance ? `margin-top: -${ newPropTop }px;` : '',
                    // 判断是否置顶
                    top_up: new_top_up,
                    tabs_z_index: 'z-index: 11;'
                });
            },
            // 获取选项卡高度
            get_tabs_height() {
                if (this.top_up == '1') {
                    // 选择我们想要的元素
                    const query = uni.createSelectorQuery();
                    query
                        .in(this)
                        .select('.tabs-top')
                        .boundingClientRect((res) => {
                            if ((res || null) != null) {
                                const newPropTop = app.globalData.rpx_to_px(this.propTop);
                                // data包含元素的宽度、高度等信息
                                this.setData({
                                    tabs_seat_height: res.height + (this.propIsImmersionModel ? newPropTop + this.propStickyTop : 0),
                                    tabs_carousel_seat_height: (res.height + (this.propIsImmersionModel ? newPropTop + this.propStickyTop : 0)) - this.propSpacingCommonStyle.padding_top - this.propSpacingCommonStyle.margin_top, // 轮播选项卡置顶时去掉顶部间距
                                });
                                this.$emit('onComputerHeight', this.tabs_seat_height);
                            }
                        })
                        .exec();
                } else {
                    this.$emit('onComputerHeight', 0);
                }
            },
            tabsZindex(val) {
                this.setData({
                    tabs_z_index: `z-index: ${ val };`
                });
            },
            // 选项卡回调
            tabs_click_event(index, item) {
                let tabs_id = '';
                // 抽象出获取 tabs_id 的逻辑
                tabs_id = this.get_tabs_id(item, index);
                // 是否是商品分类页面
                const is_micro_page = item.data_type == '0';
                this.$emit('onTabsTap', tabs_id, is_micro_page);
            },
            // 获取 tabs_id
            get_tabs_id(item, index) {
                if (item.data_type === '0') {
                    return index !== 0 ? item.micro_page_list?.id : '';
                } else {
                    return index !== 0 ? item.classify?.id : '';
                }
            },
        },
    };
</script>

<style lang="scss" scoped>
    .tabs-container {
        z-index: 11;
        .tabs-top {
            position: fixed;
            left: 0;
            right: 0;
            max-width: 100%;
        }
    }
    // .tabs-contents {
    //     max-width: 1600rpx !important;
    // }
    @media only screen and (min-width: 1600rpx) {
        .tabs-container .tabs-top {
            left: calc(50% - 400px) !important;
        }
    }
</style>
