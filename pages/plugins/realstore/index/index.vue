<template>
    <view>
        <view v-if="(data_base || null) != null">
            <!-- 顶部 -->
            <view class="bg-white padding-top-main padding-horizontal-main padding-bottom-sm spacing-mb">
                <!-- 位置 -->
                <view class="nav-location dis-inline-block round single-text cr-base" @tap="choose_location_event">
                    <view class="dis-inline-block va-m">
                        <uni-icons type="map-pin-ellipse" size="12" color="#888"></uni-icons>
                    </view>
                    <text class="va-m margin-left-xs">
                        <block v-if="(user_location || null) != null">{{user_location.name || user_location.address || ''}}</block>
                        <block v-else>未选择位置</block>
                    </text>
                </view>
                <!-- 搜索 -->
                <view class="nav-search fr">
                    <component-search @onsearch="search_button_event" :propIsOnEvent="true" :propIsRequired="false" propPlaceholder="输入门店名称" propPlaceholderClass="cr-grey"></component-search>
                </view>
            </view>
        </view>

        <!-- 轮播 -->
        <view v-if="slider_list.length > 0" class="padding-horizontal-main">
            <component-banner :propData="slider_list"></component-banner>
        </view>
        
        <!-- 图标 -->
        <view v-if="icon_list.length > 0">
            <component-icon-nav :propData="icon_list"></component-icon-nav>
        </view>

        <!-- 列表 -->
        <view v-if="data_list.length > 0">
            <view class="padding-horizontal-main">
                <!-- 导航 -->
                <view class="spacing-nav-title">
                    <text class="text-wrapper">{{data_base.home_data_list_title || '最新门店'}}</text>
                    <navigator url="/pages/plugins/realstore/search/search" hover-class="none" class="arrow-right padding-right-xxxl cr-gray fr">更多</navigator>
                </view>

                <!-- 分类 -->
                <view v-if="category.length > 0" class="word-list scroll-view-horizontal margin-bottom-lg">
                    <scroll-view scroll-x>
                        <block v-for="(cv, ci) in category" :key="ci">
                            <navigator v-if="(cv.name || null) != null" :url="'/pages/plugins/realstore/search/search?category_id=' + cv.id" hover-class="none" class="word-icon dis-inline-block bg-main-light text-size-xs cr-main round padding-top-xs padding-bottom-xs padding-left padding-right">{{cv.name}}</navigator>
                        </block>
                    </scroll-view>
                </view>
        
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
                            <icon type="clear" size="20"></icon>
                        </view>
                    </view>
                    <view class="padding-lg">
                        <image v-if="(data_base.home_choice_location_images || null) != null" class="icon max-w margin-top-sm" :src="data_base.home_choice_location_images" mode="widthFix"></image>
                        <view v-if="(data_base.home_choice_location_msg || null) != null" class="cr-base margin-top-lg">{{data_base.home_choice_location_msg}}</view>
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
    import componentNoData from "../../../../components/no-data/no-data";
    import componentBottomLine from "../../../../components/bottom-line/bottom-line";
    import componentSearch from "../../../../components/search/search";
    import componentBanner from "../../../../components/slider/slider";
    import componentIconNav from "../../../../components/icon-nav/icon-nav";
    import componentRealstoreList from "../../../../components/realstore-list/realstore-list";

    export default {
        data() {
            return {
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_bottom_line_status: false,
                params: null,
                is_first: 1,
                data_base: null,
                search_keywords_value: '',
                favor_user: [],
                category: [],
                slider_list: [],
                icon_list: [],
                data_list: [],
                // 用户位置信息
                user_location: null,
                location_tips_close_status: false,
                // 自定义分享信息
                share_info: {}
                
            };
        },

        components: {
            componentNoData,
            componentBottomLine,
            componentSearch,
            componentBanner,
            componentIconNav,
            componentRealstoreList
        },
        props: {},

        onLoad(params) {
            this.setData({
                params: params
            });
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

        methods: {
            // 初始化
            get_data() {
                // 用户位置
                var lng = 0;
                var lat = 0;
                if((this.user_location || null) != null) {
                    lng = this.user_location.lng || 0;
                    lat = this.user_location.lat || 0;
                }
                uni.request({
                    url: app.globalData.get_request_url("index", "index", "realstore"),
                    method: 'POST',
                    data: {
                        lng: lng,
                        lat: lat
                    },
                    dataType: 'json',
                    success: res => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            var data_list = data.data_list || [];
                            this.setData({
                                data_base: data.base || null,
                                favor_user: data.favor_user || [],
                                category: data.category || [],
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
                                        path: '/pages/plugins/realstore/index/index'
                                    }
                                });

                                // 导航名称
                                if((this.data_base.application_name || null) != null) {
                                    uni.setNavigationBarTitle({
                                        title: this.data_base.application_name
                                    });
                                }
                            }
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                                data_list_loding_msg: res.data.msg
                            });
                            app.globalData.showToast(res.data.msg);
                        }
                        
                        // 分享菜单处理
                        app.globalData.page_share_handle(this.share_info);
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2
                        });
                        app.globalData.showToast('服务器请求出错');
                    }
                });
            },
            
            // 搜索事件
            search_button_event(e) {
                var params = (e || null) == null ? '' : '?keywords='+e;
                uni.navigateTo({
                    url: '/pages/plugins/realstore/search/search'+params
                })
            },
            
            // 选择地理位置
            choose_location_event(e) {
                uni.navigateTo({
                    url: '/pages/common/open-setting-location/open-setting-location'
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
                        lng: result.longitude || null
                    };
                    upd_data['location_tips_close_status'] = false;
                } else {
                    upd_data['user_location'] = null;
                    if(this.is_first == 1) {
                        upd_data['location_tips_close_status'] = true;
                    }
                }
                this.setData(upd_data);
            },
            
            // 地址选择提示关闭事件
            location_tips_close_event(e) {
                this.setData({
                    location_tips_close_status: false
                });
            }
        }
    };
</script>
<style>
    @import './index.css';
</style>