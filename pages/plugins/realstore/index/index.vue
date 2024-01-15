<template>
    <view :class="theme_view">
        <view v-if="(data_base || null) != null" class="realstore-nav-bg">
            <!-- 背景图片 -->
            <image :src="realstore_static_url + 'title-bg'+(screen_width > 960 ? '-pc' : '')+'.png'" mode="widthFix" class="wh-auto pa bg-img" />
            <!-- 顶部 -->
            <view class="spacing-mb pr z-i cr-white">
                <!-- 位置 -->
                <view class="nav-location single-text dis-inline-block bs-bb pr padding-left-main padding-right-xxxxl" @tap="choose_user_location_event">
                    <view class="dis-inline-block va-m">
                        <iconfont name="icon-mendian-dingwei" size="28rpx" propClass="lh-il"></iconfont>
                    </view>
                    <text class="va-m margin-left-xs text-size-md">{{user_location.text || ''}}</text>
                    <view class="icon-arrow-down lh pa right-xxxxxl">
                        <iconfont name="icon-arrow-bottom" size="24rpx" propClass="lh-il" color="#fff"></iconfont>
                    </view>
                </view>
            </view>
            <!-- 搜索 -->
            <view class="nav-search padding-main">
                <component-search @onsearch="search_button_event" :propIsOnEvent="true" :propIsRequired="false" :propPlaceholder="$t('index.index.c5273j')" propPlaceholderClass="cr-grey-c"></component-search>
            </view>
        </view>

        <!-- 轮播 -->
        <view v-if="slider_list.length > 0" class="padding-horizontal-main">
            <component-banner :propData="slider_list"></component-banner>
        </view>

        <!-- 图标 -->
        <view v-if="icon_list.length > 0" class="padding-horizontal-main spacing-mb">
            <view class="bg-white border-radius-main">
                <component-icon-nav :propData="icon_list"></component-icon-nav>
            </view>
        </view>

        <!-- 列表 -->
        <view v-if="data_list.length > 0">
            <view class="padding-horizontal-main">
                <!-- 导航 -->
                <component-title :propTitle="data_base.home_data_list_title || $t('index.index.1vf378')" propMoreUrl="/pages/plugins/realstore/search/search"></component-title>
                <!-- 数据列表 -->
                <component-realstore-list :propDataList="data_list" :propFavorUser="favor_user"></component-realstore-list>
            </view>
            <!-- 结尾 -->
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>

            <!-- 位置选择提示 -->
            <view v-if="location_tips_close_status && (data_base.is_home_choice_location || 0) == 1 && ((data_base.home_choice_location_images || null) != null || (data_base.home_choice_location_msg || null) != null)" class="choice-location-tips pf wh-auto ht-auto tc bs-bb">
                <view class="content bg-white auto padding-xxxl pr radius">
                    <view v-if="(data_base.is_home_choice_location_force || 0) == 0" class="close oh pa">
                        <view @tap="location_tips_close_event">
                            <iconfont name="icon-close-o" size="28rpx" color="#999"></iconfont>
                        </view>
                    </view>
                    <view class="padding-lg">
                        <image v-if="(data_base.home_choice_location_images || null) != null" class="icon max-w margin-top-sm" :src="data_base.home_choice_location_images" mode="widthFix"></image>
                        <view v-if="(data_base.home_choice_location_msg || null) != null" class="cr-base margin-top-lg">{{ data_base.home_choice_location_msg }}</view>
                        <button type="default" class="bg-green br-green cr-white text-size margin-top-xxl round" hover-class="none" @tap="choose_user_location_event">{{$t('index.index.t3d917')}}</button>
                    </view>
                </view>
            </view>
        </view>
        <view v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import componentNoData from '../../../../components/no-data/no-data';
    import componentBottomLine from '../../../../components/bottom-line/bottom-line';
    import componentSearch from '../../../../components/search/search';
    import componentBanner from '../../../../components/slider/slider';
    import componentIconNav from '../../../../components/icon-nav/icon-nav';
    import componentRealstoreList from '../../../../components/realstore-list/realstore-list';
    import componentTitle from '../../../../components/title/title';

    var realstore_static_url = app.globalData.get_static_url('realstore', true);
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                realstore_static_url: realstore_static_url,
                screen_width: parseInt(app.globalData.get_system_info('windowWidth', 0, true)),
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_bottom_line_status: false,
                params: null,
                is_first: 1,
                data_base: null,
                search_keywords_value: '',
                favor_user: [],
                slider_list: [],
                icon_list: [],
                data_list: [],
                // 用户位置信息
                user_location: {},
                location_tips_close_status: false,
                // 自定义分享信息
                share_info: {},
            };
        },

        components: {
            componentNoData,
            componentBottomLine,
            componentSearch,
            componentBanner,
            componentIconNav,
            componentRealstoreList,
            componentTitle,
        },
        props: {},

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            this.setData({
                params: params,
            });
            
            // #ifdef H5
            // 监听屏幕宽度和高度变化
            window.addEventListener('resize', this.handle_resize, true);
            // #endif
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 用户位置初始化
            this.user_location_init();
            // 先解绑自定义事件
            uni.$off('refresh');
            // 监听自定义事件并进行页面刷新操作
            uni.$on('refresh', (data) => {
                // 初始位置数据
                if((data.location_success || false) == true) {
                    // 用户位置初始化
                    this.user_location_init();
                    // 重新请求数据
                    // #ifdef APP
                    this.get_data();
                    // #endif
                }
            });

            // 数据加载
            this.get_data();
        },

        // 下拉刷新
        onPullDownRefresh() {
            if(this.data_list_loding_status === 1) {
                uni.stopPullDownRefresh();
            } else {
                this.get_data();
            }
        },

        // 页面销毁时执行
        onUnload: function () {
            // #ifdef H5
            window.removeEventListener('resize', this.handle_resize);
            // #endif
        },

        methods: {
            // 初始化
            get_data(params = {}) {
                // 网络检查
                if((params || null) == null || (params.loading || 0) == 0) {
                    app.globalData.network_type_handle(this, 'get_data');
                    return false;
                }

                // 请求数据
                var lng = 0;
                var lat = 0;
                if ((this.user_location || null) != null) {
                    lng = this.user_location.lng || 0;
                    lat = this.user_location.lat || 0;
                }
                uni.request({
                    url: app.globalData.get_request_url('index', 'index', 'realstore'),
                    method: 'POST',
                    data: {
                        lng: lng,
                        lat: lat,
                    },
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            var data_list = data.data_list || [];
                            this.setData({
                                data_base: data.base || null,
                                favor_user: data.favor_user || [],
                                slider_list: data.slider_list || [],
                                icon_list: data.icon_list || [],
                                data_list: data_list,
                                is_first: 0,
                                data_list_loding_status: data_list.length > 0 ? 3 : 0,
                                data_bottom_line_status: true,
                            });

                            if ((this.data_base || null) != null) {
                                // 基础自定义分享
                                this.setData({
                                    share_info: {
                                        title: this.data_base.seo_title || this.data_base.application_name,
                                        desc: this.data_base.seo_desc,
                                        path: '/pages/plugins/realstore/index/index',
                                    },
                                });

                                // 导航名称
                                if ((this.data_base.application_name || null) != null) {
                                    uni.setNavigationBarTitle({
                                        title: this.data_base.application_name,
                                    });
                                }
                            }
                        } else {
                            this.setData({
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg,
                            });
                        }

                        // 分享菜单处理
                        app.globalData.page_share_handle(this.share_info);
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                    },
                });
            },

            // 搜索事件
            search_button_event(e) {
                var params = (e || null) == null ? '' : '?keywords=' + e;
                uni.navigateTo({
                    url: '/pages/plugins/realstore/search/search' + params,
                });
            },

            // 选择地理位置
            choose_user_location_event(e) {
                app.globalData.choose_user_location_event();
            },

            // 地址信息初始化
            user_location_init() {
                var res = app.globalData.choice_user_location_init();
                this.setData({
                    user_location: res,
                    location_tips_close_status: res.status != 1
                });
            },

            // 地址选择提示关闭事件
            location_tips_close_event(e) {
                this.setData({
                    location_tips_close_status: false,
                });
            },
            
            // 页面宽度变化监听
            handle_resize() {
                // #ifdef H5
                this.setData({
                    screen_width: window.innerWidth,
                });
                // #endif
            },
        },
    };
</script>
<style>
    @import './index.css';
</style>
