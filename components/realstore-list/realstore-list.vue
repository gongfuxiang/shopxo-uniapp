<template>
    <view>
        <view v-if="(data_list || null) != null && data_list.length > 0" class="plugins-realstore-data-list oh">
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
                        <view v-if="propIsFavor" :class="'icon-item circle dis-inline-block tc cp pr '+((item.is_favor || 0) == 1 ? 'bg-red' : 'bg-gray')" :data-index="index" @tap.stop="favor_event">
                            <uni-icons type="heart-filled" size="12" color="#fff"></uni-icons>
                        </view>
                    </view>
                </view>
            </block>
        </view>
    </view>
</template>
<script>
    const app = getApp();

    export default {
        data() {
            return {
                data_list: [],
                favor_user: []
            };
        },
        components: {},
        props: {
            propIsFavor: {
            	type: Boolean,
            	default: true
            },
            propDataList: {
            	type: Array,
            	default: () => []
            },
            propFavorUser: {
            	type: Array,
            	default: () => []
            }
        },
        // 页面被展示
        created: function(e) {        
            this.setData({
                data_list: this.propDataList,
                favor_user: this.propFavorUser
            });
        },
        methods: {
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
</style>