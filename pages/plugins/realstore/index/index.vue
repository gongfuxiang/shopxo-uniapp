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
                <view class="data-list oh">
                    <block v-for="(item, index) in data_list" :key="index">
                        <view class="item bg-white padding-main border-radius-main pr spacing-mb" :data-value="'/pages/plugins/realstore/detail/detail?id='+item.id" @tap="url_event">
                            <view class="base oh">
                                <!-- 基础内容 -->
                                <image :src="item.logo" mode="widthFix" class="logo circle fl br"></image>
                                <view class="base-right fr">
                                    <view :class="'status-icon pa text-size-xs '+((item.status_info.status == 1) ? 'bg-main cr-white' : 'bg-gray cr-gray')">{{item.status_info.msg}}</view>
                                    <view class="title fw-b text-size single-text">
                                        <text v-if="(item.alias || null) != null" class="va-m title-icon round br-main cr-main text-size-xs padding-left-sm padding-right-sm margin-right-xs">{{item.alias}}</text>
                                        <text class="va-m">{{item.name}}</text>
                                    </view>
                                    <view class="margin-top-xs text-size-xs cr-grey">
                                        <view v-if="(item.status_info.time || null) != null">营业时间：{{item.status_info.time}}</view>
                                        <view v-if="(item.distance || null) != null">距离您{{item.distance}}</view>
                                    </view>
                                </view>
                            </view>
                            <!-- 地址 -->
                            <view class="margin-top-sm oh cp">
                                <view class="dis-inline-block va-m">
                                    <uni-icons type="location-filled" size="12" color="#8d8d8d"></uni-icons>
                                </view>
                                <view class="address-content single-text cr-base margin-left-xs dis-inline-block text-size-xs va-m" :data-value="item.province_name+item.city_name+item.county_name+item.address" @tap.stop="text_copy_event">{{item.province_name}}{{item.city_name}}{{item.county_name}}{{item.address}}</view>
                            </view>
                            <!-- 右侧操作 -->
                            <view class="icon-list pa">
                                <view v-if="(item.lat != 0 && item.lng != 0)" class="icon-item bg-green circle dis-inline-block tc cp" :data-index="index" @tap.stop="address_map_event">
                                    <uni-icons type="paperplane-filled" size="12" color="#fff"></uni-icons>
                                </view>
                                <view v-if="(item.service_tel || null) != null" class="icon-item bg-yellow circle dis-inline-block tc cp" :data-value="item.service_tel" @tap.stop="tel_event">
                                    <uni-icons type="phone-filled" size="12" color="#fff"></uni-icons>
                                </view>
                                <view :class="'icon-item circle dis-inline-block tc cp pr '+((item.is_favor || 0) == 1 ? 'bg-red' : 'bg-gray')" :data-index="index" @tap.stop="favor_event">
                                    <uni-icons type="heart-filled" size="12" color="#fff"></uni-icons>
                                </view>
                            </view>
                        </view>
                    </block>
                </view>
            </view>
            <!-- 结尾 -->
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
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

    export default {
        data() {
            return {
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_bottom_line_status: false,
                params: null,
                data_base: null,
                search_keywords_value: '',
                favor_user: [],
                category: [],
                slider_list: [],
                icon_list: [],
                data_list: [],
                // 用户位置信息
                user_location: null,
                // 自定义分享信息
                share_info: {}
                
            };
        },

        components: {
            componentNoData,
            componentBottomLine,
            componentSearch,
            componentBanner,
            componentIconNav
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
                    method: "POST",
                    data: {
                        lng: lng,
                        lat: lat
                    },
                    dataType: "json",
                    success: res => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            var data_list = data.data_list || [];
                            var favor_user = data.favor_user || [];
                            if(favor_user.length > 0) {
                                for(var i in data_list) {
                                    data_list[i]['is_favor'] = (favor_user.indexOf(data_list[i]['id']) == -1) ? 0 : 1;
                                }
                            }
                            this.setData({
                                data_base: data.base || null,
                                favor_user: favor_user,
                                category: data.category || [],
                                slider_list: data.slider_list || [],
                                icon_list: data.icon_list || [],
                                data_list: data_list,
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
                        
                        // 显示分享菜单
                        app.globalData.show_share_menu();
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2
                        });
                        app.globalData.showToast("服务器请求出错");
                    }
                });
            },
            
            // 收藏事件
            favor_event(e) {
                if(!app.globalData.is_single_page_check()) {
                    return false;
                }
                var user = app.globalData.get_user_info(this, 'favor_event');
                if (user != false) {
                    // 用户未绑定用户则转到登录页面
                    if (app.globalData.user_is_need_login(user)) {
                        uni.navigateTo({
                            url: "/pages/login/login?event_callback=favor_event"
                        });
                        return false;
                    } else {
                        var index = e.currentTarget.dataset.index;
                        var info = this.data_list[index];
                        uni.showLoading({
                            title: '处理中...'
                        });
                        uni.request({
                            url: app.globalData.get_request_url("reversal", "favor", "realstore"),
                            method: 'POST',
                            data: {
                                "id": info.id
                            },
                            dataType: 'json',
                            success: res => {
                                uni.hideLoading();
                                if (res.data.code == 0) {
                                    var temp_data = this.data_list;
                                    var temp_favor = this.favor_user;
                                    temp_data[index]['is_favor'] = res.data.data.status;
                                    if(res.data.data.status == 1) {
                                        if(temp_favor.indexOf(info.id) == -1) {
                                            temp_favor.push(info.id);
                                        }
                                    } else {
                                        if(temp_favor.indexOf(info.id) != -1) {
                                            temp_favor.splice(index, 1);
                                        }
                                    }
                                    this.setData({
                                        data_list: temp_data,
                                        favor_user: temp_favor
                                    })
                                    app.globalData.showToast(res.data.msg, "success");
                                } else {
                                    if (app.globalData.is_login_check(res.data, this, 'favor_event')) {
                                        app.globalData.showToast(res.data.msg);
                                    }
                                }
                            },
                            fail: () => {
                                uni.hideLoading();
                                app.globalData.showToast('服务器请求出错');
                            }
                        });
                    }
                }
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
                var data = null;
                if (result != null) {
                    data = {
                        name: result.name || null,
                        address: result.address || null,
                        lat: result.latitude || null,
                        lng: result.longitude || null
                    };
                }
                this.setData({
                    user_location: data
                });
            },
            
            // 剪切板
            text_copy_event(e) {
                app.globalData.text_copy_event(e);
            },
            
            // 地图查看
            address_map_event(e) {
                var info = this.data_list[e.currentTarget.dataset.index];
                if (info.lat == 0 || info.lng == 0) {
                    app.globalData.showToast("地址有误");
                    return false;
                }
            
                // 打开地图
                var address = (info.province_name || '') + (info.city_name || '') + (info.county_name || '') + (info.address || '');
                app.globalData.open_location(info.lng, info.lat, info.name, address);
            },
            
            // 电话
            tel_event(e) {
                app.globalData.call_tel(e.currentTarget.dataset.value || null);
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            }
        }
    };
</script>
<style>
    @import './index.css';
</style>