<template>
    <scroll-view :scroll-y="true" class="ht" @scroll="on_scroll_event">
        <!-- 头部小程序兼容 -->
        <view class="pr header">
            <componentDiyHeader v-if="hack_reset" :propValue="header_data.com_data" :propScrollTop="scroll_top" @immersion-model-call-back="immersion_model_call_back"></componentDiyHeader>
        </view>
        <view class="content flex-col" :style="'padding-top:' + (temp_is_header_top ? temp_header_top : '0')">
            <view v-for="(item, index) in tabs_data" :key="item.key">
                <componentDiyTabs v-if="item.key == 'tabs'" :propValue="item.com_data" :propTop="temp_sticky_top" :propNavIsTop="is_header_top" :propTabsIsTop="is_header_top ? is_header_top && temp_is_header_top : temp_is_header_top" @computer-height="tabs_height_event" @tabs-click="tabs_click_event"></componentDiyTabs>
                <componentDiyTabsCarousel v-else-if="item.key == 'tabs-carousel'" :propValue="item.com_data" :propTop="temp_sticky_top" :propNavIsTop="is_header_top" :propTabsIsTop="is_header_top ? is_header_top && temp_is_header_top : temp_is_header_top" @computer-height="tabs_height_event" @tabs-click="tabs_click_event"></componentDiyTabsCarousel>
            </view>
            <template v-if="is_tabs_type">
                <template v-if="diy_data.length > 0">
                    <view v-for="(item, index) in diy_data" :key="index" :style="'margin-top:' + (['float-window'].includes(item.key) ? '0rpx' : -(item.com_data.style.common_style.floating_up * 2 || 0) + 'rpx;z-index:1;')">
                        <!-- 基础组件 -->
                        <template v-if="item.is_enable == '1'">
                            <componentDiySearch v-if="item.key == 'search'" :propkey="diy_key" :propValue="item.com_data"></componentDiySearch>
                            <componentDiyCarousel v-else-if="item.key == 'carousel'" :propkey="diy_key" :propValue="item.com_data"></componentDiyCarousel>
                            <componentDiyNavGroup v-else-if="item.key == 'nav-group'" :propkey="diy_key" :propValue="item.com_data"></componentDiyNavGroup>
                            <componentDiyUserInfo v-else-if="item.key == 'user-info'" :propkey="diy_key" :propValue="item.com_data"></componentDiyUserInfo>
                            <componentDiyNotice v-else-if="item.key == 'notice'" :propkey="diy_key" :propValue="item.com_data"></componentDiyNotice>
                            <componentDiyVideo v-else-if="item.key == 'video'" :propkey="diy_key" :propValue="item.com_data"></componentDiyVideo>
                            <componentDiyArticleList v-else-if="item.key == 'article-list'" :propkey="diy_key" :propValue="item.com_data"></componentDiyArticleList>
                            <componentDiyArticleTabs v-else-if="item.key == 'article-tabs'" :propkey="diy_key" :propValue="item.com_data" :propTop="(!is_immersion_model ? temp_sticky_top : 0) + tabs_height" :propScrollTop="scroll_top" :propCustomNavHeight="!is_immersion_model && is_header_top ? 33 : 0"></componentDiyArticleTabs>
                            <componentDiyGoodsTabs v-else-if="item.key == 'goods-tabs'" :propkey="diy_key" :propValue="item.com_data" :propTop="(!is_immersion_model ? temp_sticky_top : 0) + tabs_height" :propScrollTop="scroll_top" :propCustomNavHeight="!is_immersion_model && is_header_top ? 33 : 0"></componentDiyGoodsTabs>

                            <componentDiyGoodsList v-else-if="item.key == 'goods-list'" :propkey="diy_key" :propValue="item.com_data"></componentDiyGoodsList>
                            <componentDiyDataMagic v-else-if="item.key == 'data-magic'" :propkey="diy_key" :propValue="item.com_data"></componentDiyDataMagic>
                            <componentDiyCustom v-else-if="item.key == 'custom'" :propkey="diy_key" :propValue="item.com_data"></componentDiyCustom>
                            <componentDiyImgMagic v-else-if="item.key == 'img-magic'" :propkey="diy_key" :propValue="item.com_data"></componentDiyImgMagic>
                            <componentDiyHotZone v-else-if="item.key == 'hot-zone'" :propkey="diy_key" :propValue="item.com_data"></componentDiyHotZone>
                            <componentDiySeckill v-else-if="item.key == 'seckill'" :propkey="diy_key" :propValue="item.com_data"></componentDiySeckill>
                            <!-- 插件 -->
                            <componentDiyCoupon v-else-if="item.key == 'coupon'" :propkey="diy_key" :propValue="item.com_data"></componentDiyCoupon>
                            <!-- 工具组件 -->
                            <componentDiyFloatWindow v-else-if="item.key == 'float-window'" :propkey="diy_key" :propValue="item.com_data"></componentDiyFloatWindow>
                            <componentDiyTitle v-else-if="item.key == 'title'" :propkey="diy_key" :propValue="item.com_data"></componentDiyTitle>
                            <componentDiyAuxiliaryLine v-else-if="item.key == 'row-line'" :propkey="diy_key" :propValue="item.com_data"></componentDiyAuxiliaryLine>
                            <componentDiyRichText v-else-if="item.key == 'rich-text'" :propkey="diy_key" :propValue="item.com_data"></componentDiyRichText>
                            <componentDiyAuxiliaryBlank v-else-if="item.key == 'auxiliary-blank'" :propkey="diy_key" :propValue="item.com_data"></componentDiyAuxiliaryBlank>
                        </template>
                    </view>
                </template>

                <!-- diy底部卡槽 -->
                <slot name="diy-bottom"></slot>
            </template>
            <template v-else>
                <!-- 商品九宫格列表 -->
                <scroll-view :scroll-y="true" class="scroll-box" @scrolltolower="scroll_lower" lower-threshold="60">
                    <view v-if="goods_list.length > 0" class="padding-horizontal-main padding-top-main oh">
                        <component-goods-list :propData="{ style_type: goods_show_type_value, goods_list: goods_list, random: random_value }" :propLabel="plugins_label_data" :propCurrencySymbol="currency_symbol" :propIsCartParaCurve="true"></component-goods-list>
                    </view>
                    <template v-else>
                        <!-- 提示信息 -->
                        <component-no-data :propStatus="goods_list_loding_status" :propMsg="goods_list_loding_msg"></component-no-data>
                    </template>
                    <!-- 结尾 -->
                    <component-bottom-line :propStatus="goods_bottom_line_status"></component-bottom-line>
                </scroll-view>
            </template>
        </view>

        <!-- 当前diy页面底部菜单（非公共底部菜单） -->
        <block v-if="is_show_footer == 1">
            <componentDiyFooter v-if="hack_reset" :propValue="footer_data.com_data" @footer-height="footer_height_value_event"></componentDiyFooter>
            <view v-if="footer_height_value > 0" :style="'height:' + footer_height_value + 'rpx;'"></view>
        </block>

        <!-- 底部卡槽 -->
        <slot name="bottom"></slot>
    </scroll-view>
</template>

<script>
    const app = getApp();
    import componentDiyHeader from '@/components/diy/header';
    import componentDiyFooter from '@/components/diy/footer';
    import componentDiyTabs from '@/components/diy/tabs';
    import componentDiySearch from '@/components/diy/search';
    import componentDiyCarousel from '@/components/diy/carousel';
    import componentDiyUserInfo from '@/components/diy/user-info';
    import componentDiyNotice from '@/components/diy/notice';
    import componentDiyVideo from '@/components/diy/video';
    import componentDiyArticleList from '@/components/diy/article-list';
    import componentDiyArticleTabs from '@/components/diy/article-tabs';
    import componentDiyHotZone from '@/components/diy/hot-zone';
    import componentDiyCoupon from '@/components/diy/coupon';
    import componentDiyFloatWindow from '@/components/diy/float-window';
    import componentDiyTitle from '@/components/diy/title';
    import componentDiyAuxiliaryLine from '@/components/diy/auxiliary-line';
    import componentDiyRichText from '@/components/diy/rich-text';
    import componentDiyAuxiliaryBlank from '@/components/diy/auxiliary-blank';
    import componentDiyNavGroup from '@/components/diy/nav-group';
    import componentDiyGoodsList from '@/components/diy/goods-list';
    import componentDiyGoodsTabs from '@/components/diy/goods-tabs';
    import componentDiyDataMagic from '@/components/diy/data-magic';
    import componentDiyCustom from '@/components/diy/custom';
    import componentDiyImgMagic from '@/components/diy/img-magic';
    import componentDiySeckill from '@/components/diy/seckill';
    import componentDiyTabsCarousel from '@/components/diy/tabs-carousel';
    import componentGoodsList from '@/components/goods-list/goods-list';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    // 状态栏高度
    var bar_height = parseInt(app.globalData.get_system_info('statusBarHeight', 0));
    // #ifdef MP-TOUTIAO
    bar_height = 0;
    // #endif
    export default {
        name: 'diy',
        props: {
            propValue: {
                type: Object,
                default: () => ({}),
            },
            propDataId: {
                type: [String, Number],
                default: '',
            },
            propkey: {
                type: String,
                default: '',
            },
        },
        components: {
            componentDiyHeader,
            componentDiyFooter,
            componentDiyTabs,
            componentDiySearch,
            componentDiyCarousel,
            componentDiyUserInfo,
            componentDiyNotice,
            componentDiyVideo,
            componentDiyArticleList,
            componentDiyArticleTabs,
            componentDiyHotZone,
            componentDiyCoupon,
            componentDiyAuxiliaryLine,
            componentDiyRichText,
            componentDiyFloatWindow,
            componentDiyTitle,
            componentDiyAuxiliaryBlank,
            componentDiyNavGroup,
            componentDiyGoodsList,
            componentDiyGoodsTabs,
            componentDiyDataMagic,
            componentDiyCustom,
            componentDiyImgMagic,
            componentDiySeckill,
            componentDiyTabsCarousel,
            componentGoodsList,
            componentNoData,
            componentBottomLine,
        },
        data() {
            return {
                // 基础配置
                currency_symbol: app.globalData.currency_symbol(),
                // 是否有选项卡
                is_tabs: false,
                // 是否是模块数据或者是九宫格商品分类样式数据， 默认模块数据
                is_tabs_type: true,
                // 是否开启沉浸模式
                is_immersion_model: false,

                // 5,7,0 是误差，， 12 是下边距，66是高度，bar_height是不同小程序下的导航栏距离顶部的高度
                // #ifdef MP
                sticky_top: bar_height + 5 + 12,
                header_top: 'calc(' + (bar_height + 5 + 12) + 'px + 66px);',
                // #endif
                // #ifdef H5 || MP-TOUTIAO
                sticky_top: bar_height + 7 + 12,
                header_top: 'calc(' + (bar_height + 7 + 12) + 'px + 66rpx);',
                // #endif
                // #ifdef APP
                sticky_top: bar_height + 0 + 12,
                header_top: 'calc(' + (bar_height + 0 + 12) + 'px + 66rpx);',
                // #endif
                temp_sticky_top: 0,
                temp_header_top: '0px',
                is_header_top: false,
                temp_is_header_top: false,
                scroll_top: 0,
                // 选项卡高度
                tabs_height: 0,

                header_data: {},
                footer_data: {},
                // 选项卡数据
                tabs_data: {},
                diy_data: [],
                is_show_footer: 0,
                tabs_home_id: this.propDataId,
                // 商品列表
                goods_list: [],
                goods_total: 0,
                goods_page_total: 0,
                goods_page: 1,
                // 数据展示样式（0图文、1九方格）
                goods_show_type_value: 1,
                // 增加随机数，避免无法监听数据列表内部数据更新
                random_value: 0,
                // 标签插件
                plugins_label_data: null,
                goods_list_loding_status: 1,
                goods_list_loding_msg: '',
                goods_bottom_line_status: false,
                // 判断数据是否在加载中
                data_is_loading: 0,
                // 缓存key
                cache_key: app.globalData.data.cache_diy_data_key,
                // 重置
                hack_reset: false,
                // 底部导航高度
                footer_height_value: 0,
                diy_key: '',
            };
        },
        watch: {
            propkey(val) {
                this.setData({
                    diy_key: val,
                });
                // 初始化
                this.init();
            },
        },
        created() {
            // 初始化配置
            this.init_config();

            // 初始化
            this.init();
        },
        methods: {
            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {
                    // 是否显示底部菜单，如果当前地址已经存在系统底部菜单中则不显示当前diy页面自定义的底部菜单
                    var is_show_footer = parseInt(this.propValue.header.com_data.content.bottom_navigation_show || 0) == 1;
                    var is_tabbar = app.globalData.is_tabbar_pages();
                    this.setData({
                        is_show_footer: is_show_footer && !is_tabbar,
                    });
                } else {
                    app.globalData.is_config(this, 'init_config');
                }
            },

            // 初始化
            init() {
                // tabs选项卡数据过滤
                this.setData({
                    hack_reset: true,
                    header_data: this.propValue.header,
                    footer_data: this.propValue.footer,
                    diy_data: this.propValue.diy_data,
                    tabs_data: this.propValue.tabs_data,
                    // 判断顶部导航是否置顶
                    is_header_top: this.propValue.header.com_data.style.up_slide_display == '1' ? true : false,
                    temp_sticky_top: this.sticky_top,
                    temp_header_top: this.header_top,
                });
                uni.setStorageSync(this.cache_key + this.tabs_home_id, this.propValue.diy_data);
            },
            // 顶部导航沉浸模式回调
            immersion_model_call_back(bool) {
                this.setData({
                    is_immersion_model: bool,
                });
            },

            // 选项卡回调更新数据
            tabs_click_event(tabs_id, bool, params = {}) {
                let new_data = [];
                this.setData({
                    is_tabs_type: bool,
                    tabs_id: tabs_id,
                });
                let new_params = {
                    ...params,
                    id: tabs_id,
                };
                if (tabs_id) {
                    new_data = uni.getStorageSync(this.cache_key + tabs_id) || [];
                    if (new_data.length > 0) {
                        // 先使用缓存数据展示
                        this.setData({
                            diy_data: new_data,
                        });
                        // 已有本地缓存则直接取远程有效数据（默认首次取的是远程缓存数据）
                        new_params['is_cache'] = 0;
                    }
                    // diy数据
                    if (bool) {
                        uni.request({
                            url: app.globalData.get_request_url('index', 'diy'),
                            method: 'POST',
                            data: new_params,
                            dataType: 'json',
                            success: (res) => {
                                // 数据处理
                                let data = res.data.data.data;
                                if (res.data.code == 0) {
                                    new_data = data?.config.diy_data || [];
                                    uni.setStorageSync(this.cache_key + tabs_id, new_data);
                                    this.setData({
                                        diy_data: new_data,
                                    });
                                    // 是否需要重新加载数据
                                    if (parseInt(data.is_result_data_cache || 0) == 1) {
                                        this.tabs_click_event(tabs_id, bool, { is_cache: 0 });
                                    }
                                } else {
                                    app.globalData.showToast(res.data.msg);
                                }
                            },
                        });
                    } else {
                        this.setData({
                            goods_page: 1,
                        });
                        this.get_goods_list(1);
                    }
                } else {
                    if (tabs_id == '') {
                        new_data = uni.getStorageSync(this.cache_key + this.tabs_home_id) || [];
                    }
                    // 先使用缓存数据展示
                    this.setData({
                        diy_data: new_data,
                    });
                }
            },
            // 选项卡高度
            tabs_height_event(height) {
                this.setData({
                    tabs_height: height,
                });
            },

            // 滚动加载
            scroll_lower(e) {
                this.get_goods_list();
            },

            // 查询商品
            get_goods_list(is_mandatory) {
                // 分页是否还有数据
                if ((is_mandatory || 0) == 0) {
                    if (this.goods_bottom_line_status == true) {
                        uni.stopPullDownRefresh();
                        return false;
                    }
                }
                // 是否加载中
                if (this.data_is_loading == 1) {
                    return false;
                }
                this.setData({
                    data_is_loading: 1,
                });

                // 获取数据
                if (this.goods_page > 1) {
                    uni.showLoading({
                        title: this.$t('common.loading_in_text'),
                    });
                }
                let new_data = {
                    category_id: this.tabs_id,
                    page: this.goods_page,
                };
                // 九宫格数据
                uni.request({
                    url: app.globalData.get_request_url('datalist', 'search'),
                    method: 'POST',
                    data: new_data,
                    dataType: 'json',
                    success: (res) => {
                        if (this.goods_page > 1) {
                            uni.hideLoading();
                        }
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            if (data.data.length > 0) {
                                if (this.goods_page <= 1) {
                                    var temp_goods_list = data.data;
                                } else {
                                    var temp_goods_list = this.goods_list || [];
                                    var temp_data = data.data;
                                    for (var i in temp_data) {
                                        temp_goods_list.push(temp_data[i]);
                                    }
                                }
                                this.setData({
                                    goods_list: temp_goods_list,
                                    random_value: Math.random(),
                                    goods_total: data.total,
                                    goods_page_total: data.page_total,
                                    goods_list_loding_status: 3,
                                    goods_list_loding_msg: '',
                                    goods_page: this.goods_page + 1,
                                    data_is_loading: 0,
                                });

                                // 是否还有数据
                                this.setData({
                                    goods_bottom_line_status: this.goods_page > 1 && this.goods_page > this.goods_page_total,
                                });
                            } else {
                                this.setData({
                                    goods_list_loding_status: 0,
                                    goods_list_loding_msg: res.data.msg,
                                    goods_total: 0,
                                    data_is_loading: 0,
                                });
                                if (this.goods_page <= 1) {
                                    this.setData({
                                        goods_list: [],
                                        goods_bottom_line_status: false,
                                    });
                                }
                            }
                        } else {
                            this.setData({
                                goods_list_loding_status: 0,
                                goods_list_loding_msg: res.data.msg,
                                data_is_loading: 0,
                            });
                            app.globalData.is_login_check(res.data, this, 'get_goods_list', is_mandatory);
                        }
                    },
                    fail: () => {
                        if (this.goods_page > 1) {
                            uni.hideLoading();
                        }
                        uni.stopPullDownRefresh();
                        this.setData({
                            goods_list_loding_status: 2,
                            goods_list_loding_msg: this.$t('common.internet_error_tips'),
                            data_is_loading: 0,
                        });
                    },
                });
            },

            // 页面滚动事件
            on_scroll_event(e) {
                this.setData({
                    scroll_top: e.detail.scrollTop,
                });
                // 判断顶部导航是否置顶
                // #ifdef H5 || MP-TOUTIAO
                if (!this.is_header_top) {
                    if (e.detail.scrollTop >= this.sticky_top + 33) {
                        this.setData({
                            temp_sticky_top: 0,
                            temp_header_top: 0,
                            temp_is_header_top: true,
                        });
                    } else {
                        this.setData({
                            temp_header_top: this.header_top,
                            temp_sticky_top: this.sticky_top,
                            temp_is_header_top: false,
                        });
                    }
                }
                // #endif
            },

            // 底部菜单高度
            footer_height_value_event(value) {
                this.setData({
                    footer_height_value: value * 2 + 20,
                });
            },
        },
    };
</script>

<style lang="scss" scoped></style>
