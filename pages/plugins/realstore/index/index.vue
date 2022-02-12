<template>
    <view>
        <view v-if="(data_base || null) != null">
            <!-- 顶部 -->
            <view class="bg-white padding-top-main padding-horizontal-main">
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
                    <component-search @onsearch="search_button_event" :propIsOnEvent="true" :propIsRequired="false" propPlaceholderClass="cr-grey"></component-search>
                </view>
            </view>

            <!-- 分类 -->
            <scroll-view v-if="(category || null) != null && category.length > 0" class="nav-base scroll-view-horizontal bg-white oh" scroll-x="true">
                <view :class="'item cr-gray dis-inline-block padding-horizontal-main ' + (nav_active_value == 0 ? 'cr-main' : '')" @tap="nav_event" data-value="0">全部</view>
                <block v-for="(item, index) in category" :key="index">
                    <view :class="'item cr-gray dis-inline-block padding-horizontal-main ' + (nav_active_value == item.id ? 'cr-main' : '')" @tap="nav_event" :data-value="item.id">{{item.name}}</view>
                </block>
            </scroll-view>
            
            <!-- 列表 -->
            <scroll-view :scroll-y="true" class="scroll-box scroll-box-ece-nav" @scrolltolower="scroll_lower" lower-threshold="30">
                <view v-if="(data_list || null) != null && data_list.length > 0" class="data-list padding-horizontal-main padding-top-main oh">
                    <block v-for="(item, index) in data_list" :key="index">
                        <view class="item bg-white padding-main border-radius-main pr spacing-mb" :data-value="'/pages/plugins/realstore/detail/detail?id='+item.id" @tap="url_event">
                            <view class="base oh">
                                <!-- 基础内容 -->
                                <image :src="item.logo" mode="widthFix" class="logo circle fl br"></image>
                                <view class="base-right fr">
                                    <view class="status-icon pa text-size-xs cr-white bg-main">{{item.status_info.msg}}</view>
                                    <view class="title fw-b text-size single-text">
                                        <text v-if="(item.alias || null) != null" class="va-m title-icon round br-main cr-main text-size-xs padding-left-sm padding-right-sm margin-right-xs">{{item.alias}}</text>
                                        <text class="va-m">{{item.name}}</text>
                                    </view>
                                    <view class="margin-top-xs text-size-xs cr-grey">
                                        <view>营业时间：{{item.open_time || '00:00'}} ~ {{item.close_time || '00:00'}}（{{item.open_week_name}}至{{item.close_week_name}}）</view>
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
                <view v-else>
                    <!-- 提示信息 -->
                    <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
                </view>

                <!-- 结尾 -->
                <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
            </scroll-view>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import componentNoData from "../../../../components/no-data/no-data";
    import componentBottomLine from "../../../../components/bottom-line/bottom-line";
    import componentSearch from "../../../../components/search/search";

    export default {
        data() {
            return {
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_bottom_line_status: false,
                data_list: [],
                data_total: 0,
                data_page_total: 0,
                data_page: 1,
                params: null,
                data_base: null,
                category: [],
                search_keywords_value: '',
                nav_active_value: 0,
                favor_info: [],
                // 用户位置信息
                user_location: null,
                // 自定义分享信息
                share_info: {}
            };
        },

        components: {
            componentNoData,
            componentBottomLine,
            componentSearch
        },
        props: {},

        onLoad(params) {
            this.setData({
                params: params
            });
            
            // 数据加载
            this.get_data();
        },
        
        onShow() {
            // 用户位置初始化
            this.user_location_init();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.setData({
                data_page: 1
            });
            this.get_data_list(1);
        },

        methods: {
            // 初始化
            get_data() {
                uni.showLoading({
                    title: "加载中..."
                });
                uni.request({
                    url: app.globalData.get_request_url("index", "index", "realstore"),
                    method: "POST",
                    data: {},
                    dataType: "json",
                    success: res => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
                                data_base: data.base || null,
                                category: data.category || [],
                                favor_user: data.favor_user || [],
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
                            
                            // 获取列表数据
                            this.get_data_list(1);
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
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2
                        });
                        app.globalData.showToast("服务器请求出错");
                    }
                });
            },

            // 获取数据列表
            get_data_list(is_mandatory) {
                // 分页是否还有数据
                if ((is_mandatory || 0) == 0) {
                    if (this.data_bottom_line_status == true) {
                        uni.stopPullDownRefresh();
                        return false;
                    }
                }
                
                // 加载loding
                uni.showLoading({
                    title: "加载中..."
                });
                
                // 用户位置
                var lng = 0;
                var lat = 0;
                if((this.user_location || null) != null) {
                    lng = this.user_location.lng || 0;
                    lat = this.user_location.lat || 0;
                }

                // 获取数据
                uni.request({
                    url: app.globalData.get_request_url("datalist", "index", "realstore"),
                    method: "POST",
                    data: {
                        page: this.data_page,
                        keywords: this.search_keywords_value,
                        category_id: this.nav_active_value || 0,
                        lng: lng,
                        lat: lat
                    },
                    dataType: "json",
                    success: res => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            if (data.data.length > 0) {
                                if (this.data_page <= 1) {
                                    var temp_data_list = data.data;
                                    for(var i in temp_data_list) {
                                        temp_data_list[i]['is_favor'] = (this.favor_user.length > 0 && this.favor_user.indexOf(temp_data_list[i]['id']) != -1) ? 1 : 0;
                                    }
                                } else {
                                    var temp_data_list = this.data_list || [];
                                    var temp_data = data.data;
                                    for (var i in temp_data) {
                                        temp_data[i]['is_favor'] = (this.favor_user.length > 0 && this.favor_user.indexOf(temp_data[i]['id']) != -1) ? 1 : 0;
                                        temp_data_list.push(temp_data[i]);
                                    }
                                }
                                this.setData({
                                    data_list: temp_data_list,
                                    data_total: data.total,
                                    data_page_total: data.page_total,
                                    data_list_loding_status: 3,
                                    data_page: this.data_page + 1
                                });
                                
                                // 是否还有数据
                                this.setData({
                                    data_bottom_line_status: (this.data_page > 1 && this.data_page > this.data_page_total)
                                });
                            } else {
                                this.setData({
                                    data_list_loding_status: 0
                                });
                                if (this.data_page <= 1) {
                                    this.setData({
                                        data_list: [],
                                        data_bottom_line_status: false
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
                    },
                    fail: () => {
                        uni.hideLoading();
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
                                    for(var i in temp_data) {
                                        temp_data[i]['is_favor'] = res.data.data.status;
                                    }
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

            // 滚动加载
            scroll_lower(e) {
                this.get_data_list(1);
            },

            // 导航事件
            nav_event(e) {
                this.setData({
                    nav_active_value: e.currentTarget.dataset.value || 0,
                    data_page: 1
                });
                this.get_data_list(1);
            },
            
            // 搜索事件
            search_button_event(e) {
                this.setData({
                    search_keywords_value: e || '',
                    data_page: 1
                });
                this.get_data_list(1);
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
            
            // 图片预览
            image_show_event(e) {
                app.globalData.image_show_event(e);
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