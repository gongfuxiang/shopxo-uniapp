<template>
    <view class="ht-auto min-ht">
        <!-- 头部小程序兼容 -->
        <view class="pr header-content">
            <componentDiyHeader :key="key" :value="header_data.com_data"></componentDiyHeader>
        </view>
        <view class="pr" :style="diy_content_style">
            <view v-for="(item, index) in tabs_data" :key="index">
                <componentDiyTabs v-if="item.key == 'tabs'" :value="item.com_data" :key="key" @tabs-click="tabs_click_event"></componentDiyTabs>
                <componentDiyTabsCarousel v-else-if="item.key == 'tabs-carousel'" :value="item.com_data" :key="key + index" @tabs-click="tabs_click_event"></componentDiyTabsCarousel>
            </view>
            <view v-if="is_tabs_type" class="diy-content">
                <template v-if="diy_data.length > 0">
                    <view v-for="(item, index) in diy_data" :key="index" :style="{ 'margin-top': -(item.com_data.style.common_style.floating_up * 2 || 0) + 'rpx' }">
                        <!-- 基础组件 -->
                        <componentDiySearch v-if="item.key == 'search'" :value="item.com_data"></componentDiySearch>
                        <componentDiyCarousel v-else-if="item.key == 'carousel'" :value="item.com_data"></componentDiyCarousel>
                        <componentDiyNavGroup v-else-if="item.key == 'nav-group'" :value="item.com_data"></componentDiyNavGroup>
                        <componentDiyUserInfo v-else-if="item.key == 'user-info'" :value="item.com_data"></componentDiyUserInfo>
                        <componentDiyNotice v-else-if="item.key == 'notice'" :value="item.com_data"></componentDiyNotice>
                        <componentDiyVideo v-else-if="item.key == 'video'" :value="item.com_data"></componentDiyVideo>
                        <componentDiyArticleList v-else-if="item.key == 'article-list'" :value="item.com_data"></componentDiyArticleList>
                        <componentDiyArticleTabs v-else-if="item.key == 'article-tabs'" :value="item.com_data"></componentDiyArticleTabs>
                        <componentDiyGoodsTabs v-else-if="item.key == 'goods-tabs'" :value="item.com_data"></componentDiyGoodsTabs>
                        <componentDiyGoodsList v-else-if="item.key == 'goods-list'" :value="item.com_data"></componentDiyGoodsList>
                        <componentDiyDataMagic v-else-if="item.key == 'data-magic'" :value="item.com_data"></componentDiyDataMagic>
                        <componentDiyCustom v-else-if="item.key == 'custom'" :value="item.com_data"></componentDiyCustom>
                        <componentDiyImgMagic v-else-if="item.key == 'img-magic'" :value="item.com_data"></componentDiyImgMagic>
                        <componentDiyHotZone v-else-if="item.key == 'hot-zone'" :value="item.com_data"></componentDiyHotZone>
                        <componentDiySeckill v-else-if="item.key == 'seckill'" :value="item.com_data"></componentDiySeckill>
                        <!-- 插件 -->
                        <componentDiyCoupon v-else-if="item.key == 'coupon'" :value="item.com_data"></componentDiyCoupon>
                        <!-- 工具组件 -->
                        <componentDiyFloatWindow v-else-if="item.key == 'float-window'" :value="item.com_data"></componentDiyFloatWindow>
                        <componentDiyTextTitle v-else-if="item.key == 'text-title'" :value="item.com_data"></componentDiyTextTitle>
                        <componentDiyAuxiliaryLine v-else-if="item.key == 'row-line'" :value="item.com_data"></componentDiyAuxiliaryLine>
                        <componentDiyRichText v-else-if="item.key == 'rich-text'" :value="item.com_data"></componentDiyRichText>
                        <componentDiyAuxiliaryBlank v-else-if="item.key == 'auxiliary-blank'" :value="item.com_data"></componentDiyAuxiliaryBlank>
                    </view>
                </template>
            </view>
            <view v-else>
                <!-- goods九宫格数据 -->
                <!-- 列表 -->
                <scroll-view :scroll-y="true" class="scroll-box" @scrolltolower="scroll_lower" lower-threshold="60">
                    <view v-if="goods_list.length > 0" class="padding-horizontal-main padding-top-main oh">
                        <component-goods-list :propData="{ style_type: goods_show_type_value, goods_list: goods_list, random: random_value }" :propLabel="plugins_label_data" :propCurrencySymbol="currency_symbol" :propIsCartParaCurve="true"></component-goods-list>
                    </view>
                    <view v-else>
                        <!-- 提示信息 -->
                        <component-no-data :propStatus="goods_list_loding_status" :propMsg="goods_list_loding_msg"></component-no-data>
                    </view>
                    <!-- 结尾 -->
                    <component-bottom-line :propStatus="goods_bottom_line_status"></component-bottom-line>
                </scroll-view>
            </view>
        </view>
        <block v-if="is_show_footer !== '0'">
            <componentDiyFooter :key="key" :value="footer_data.com_data" @footer-height="footer_height_computer" @footer-click="footer_click_event"></componentDiyFooter>
        </block>
    </view>
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
    import componentDiyTextTitle from '@/components/diy/text-title';
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
    import { get_math } from '../../common/js/common/common';
    // 状态栏高度
    var bar_height = parseInt(app.globalData.get_system_info('statusBarHeight', 0));
    // #ifdef MP-TOUTIAO
    bar_height = 0;
    // #endif
    export default {
        name: 'diy',
        props: {
            value: {
                type: Object,
                default: () => ({}),
            },
            propHomeId: {
                type: [String, Number],
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
            componentDiyTextTitle,
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
                // 底部菜单导航高度计算
                padding_footer_computer: 140,
                // 是否有选项卡
                is_tabs: false,
                // 是否是模块数据或者是九宫格商品分类样式数据， 默认模块数据
                is_tabs_type: true,

                // 5,7,0 是误差，， 12 是下边距，60是高度，bar_height是不同小程序下的导航栏距离顶部的高度
                // #ifdef MP
                header_top: 'padding-top:' + (bar_height + 34 + 5 + 12) + 'px;',
                // #endif
                // #ifdef H5 || MP-TOUTIAO
                header_top: 'padding-top:' + (bar_height + 34 + 7 + 12) + 'px;',
                // #endif
                // #ifdef APP
                header_top: 'padding-top:' + (bar_height + 34 + 0 + 12) + 'px;',
                // #endif

                header_data: {},
                footer_data: {},
                // 选项卡数据
                tabs_data: {},
                diy_data: [],
                is_show_footer: '0',
                tabs_home_id: this.propHomeId,
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
                key: '',
            };
        },
        computed: {
            diy_content_style() {
                return this.header_top + `padding-bottom:${this.padding_footer_computer}rpx;`;
            },
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                // tabs选项卡数据过滤
                // const filter_tabs_list = this.value.tabs_data || [];
                this.setData({
                    is_show_footer: this.value.header.com_data.content.bottom_navigation_show,
                    key: get_math(),
                    header_data: this.value.header,
                    footer_data: this.value.footer,
                    diy_data: this.value.diy_data,
                    tabs_data: this.value.tabs_data,
                });
                uni.setStorageSync('diy-data-' + this.tabs_home_id, this.value.diy_data);
            },
            footer_height_computer(number) {
                this.padding_footer_computer = number * 2;
            },
            // 选项卡回调更新数据
            tabs_click_event(tabs_id, bool, params = {}) {
                let new_data = this.value.diy_data;
                this.setData({
                    is_tabs_type: bool,
                });
                const new_params = {
                    ...params,
                    id: tabs_id,
                };
                if (tabs_id) {
                    new_data = uni.getStorageSync('diy-data-' + tabs_id) || [];
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
                                const data = res.data.data.data;
                                if (res.data.code == 0) {
                                    new_data = data?.config.diy_data || [];
                                    uni.setStorageSync('diy-data-' + tabs_id, new_data);
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
                        this.get_goods_list(1);
                    }
                } else {
                    new_data = uni.getStorageSync('diy-data-' + this.tabs_home_id) || [];
                    // 先使用缓存数据展示
                    this.setData({
                        diy_data: new_data,
                    });
                }
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
                const new_data = {
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
            // 底部导航菜单
            footer_click_event(data) {
                console.log(data);
            },
        },
    };
</script>

<style lang="scss" scoped>
    .header-content {
        z-index: 101;
    }
</style>
