<template>
    <view class="realstore">
        <view v-if="(data_base || null) != null" class="realstore-nav-bg">
            <block v-if="screenWidth > 960">
                <image :src="realstore_static_url + 'title-bg-pc.png'" mode="widthFix" class="wh-auto pa bg-img" />
            </block>
            <block v-else>
                <image :src="realstore_static_url + 'title-bg.png'" mode="widthFix" class="wh-auto pa bg-img" />
            </block>
            <!-- 顶部 -->
            <view class="spacing-mb pr z-i cr-white">
                <!-- 位置 -->
                <view class="nav-location single-text flex-row align-c" @tap="choose_location_event">
                    <view class="dis-inline-block va-m">
                        <iconfont name="icon-mendian-dingwei" size="28rpx" class="pr top-xs"></iconfont>
                    </view>
                    <text class="va-m margin-left-xs">
                        <block v-if="(user_location || null) != null">{{ user_location.name || user_location.address || '' }}</block>
                        <block v-else>未选择位置</block>
                    </text>
                </view>
            </view>
            <!-- 搜索 -->
            <view class="nav-search padding-main">
                <component-search @onsearch="search_button_event" :propIsOnEvent="true" :propIsRequired="false" propPlaceholder="输入门店名称" propPlaceholderClass="cr-grey-c"></component-search>
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
                <component-title :prop-title="data_base.home_data_list_title || '最新门店'" prop-more-url="/pages/plugins/realstore/search/search"></component-title>
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
                            <uni-icons type="clear" size="46rpx" color="#999"></uni-icons>
                        </view>
                    </view>
                    <view class="padding-lg">
                        <image v-if="(data_base.home_choice_location_images || null) != null" class="icon max-w margin-top-sm" :src="data_base.home_choice_location_images" mode="widthFix"></image>
                        <view v-if="(data_base.home_choice_location_msg || null) != null" class="cr-base margin-top-lg">{{ data_base.home_choice_location_msg }}</view>
                        <button type="default" class="bg-green br-green cr-white text-size margin-top-xxl round" hover-class="none" @tap="choose_location_event">选择位置</button>
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

    let realstore_static_url = app.globalData.get_static_url('realstore', true);

    export default {
        data() {
            return {
                realstore_static_url: realstore_static_url,
                // 屏幕宽度
                screenWidth: window.innerWidth,
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
                user_location: null,
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
            this.setData({
                params: params,
            });
            // 监听屏幕宽度和高度变化
            window.addEventListener('resize', this.handleResize, true);
        },

        onShow() {
            // 用户位置初始化
            this.user_location_init();

            // 数据加载
            this.get_data();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.get_data();
        },

        // 页面销毁时执行
        onUnload: function () {
            window.removeEventListener('resize', this.handleResize);
        },

        methods: {
            // 初始化
            get_data() {
                // 用户位置
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
                                data_list_loding_status: 0,
                                data_list_loding_msg: res.data.msg,
                            });
                            app.globalData.showToast(res.data.msg);
                        }

                        // 分享菜单处理
                        app.globalData.page_share_handle(this.share_info);
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                        });
                        app.globalData.showToast('服务器请求出错');
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
            choose_location_event(e) {
                uni.navigateTo({
                    url: '/pages/common/open-setting-location/open-setting-location',
                });
            },

            // 地址信息初始化
            user_location_init() {
                var result = uni.getStorageSync(app.globalData.data.cache_userlocation_key) || null;
                var upd_data = {};
                if (result != null) {
                    upd_data['user_location'] = {
                        name: result.name || null,
                        address: result.address || null,
                        lat: result.latitude || null,
                        lng: result.longitude || null,
                    };
                    upd_data['location_tips_close_status'] = false;
                } else {
                    upd_data['user_location'] = null;
                    if (this.is_first == 1) {
                        upd_data['location_tips_close_status'] = true;
                    }
                }
                this.setData(upd_data);
            },

            // 地址选择提示关闭事件
            location_tips_close_event(e) {
                this.setData({
                    location_tips_close_status: false,
                });
            },
            handleResize() {
                this.setData({
                    screenWidth: window.innerWidth,
                });
            },
        },
    };
</script>
<style>
    @import './index.css';
</style>
