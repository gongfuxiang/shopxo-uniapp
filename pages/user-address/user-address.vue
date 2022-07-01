<template>
    <view>
        <view class="page padding-main">
            <view v-if="data_list.length > 0">
                <view v-for="(item, index) in data_list" :key="index" class="item padding-horizontal-main border-radius-main bg-white spacing-mb">
                    <view @tap="address_conent_event" :data-index="index">
                        <view class="oh padding-vertical-main">
                            <text v-if="(item.alias || null) != null" class="address-alias br-main cr-main round margin-right-sm">{{item.alias}}</text>
                            <text>{{item.name}}</text>
                            <text class="fr">{{item.tel}}</text>
                        </view>
                        <view class="address oh padding-bottom-lg">
                            <image class="item-icon fl margin-top-xs" :src="common_static_url+'map-icon.png'" mode="widthFix"></image>
                            <view class="text fr">
                                <text>{{item.province_name || ''}}{{item.city_name || ''}}{{item.county_name || ''}}{{item.address || ''}}</text>
                                <text v-if="((item.distance_value || null) != null && (item.distance_unit || null) != null)" class="cr-grey margin-left-lg fr">距离<text class="cr-base">{{item.distance_value}}</text>{{item.distance_unit}}</text>
                            </view>
                        </view>
                    </view>
                    <view class="br-t oh padding-vertical-main">
                        <view class="default-checkbox fl margin-top-sm" @tap="address_default_event" :data-value="item.id">
                            <image class="va-m" :src="common_static_url+'select' + (is_default == item.id ? '-active' : '') + '-icon.png'" mode="widthFix"></image>
                            <text class="va-m margin-left-sm">设为默认地址</text>
                        </view>
                        <view class="item-operation fr oh">
                            <button v-if="(item.lng || 0) != 0 && (item.lat || 0) != 0" class="round bg-white cr-base br" type="default" size="mini" @tap="address_map_event" :data-index="index" hover-class="none">位置</button>
                            <button class="round bg-white cr-green br-green" type="default" size="mini" @tap="address_edit_event" :data-index="index" hover-class="none">编辑</button>
                            <button class="round bg-white cr-red br-red" type="default" size="mini" @tap="address_delete_event" :data-index="index" :data-value="item.id" hover-class="none">删除</button>
                        </view>
                    </view>
                </view>
            </view>
            <view v-else>
                <!-- 提示信息 -->
                <component-no-data :propStatus="data_list_loding_status"></component-no-data>
            </view>

            <!-- 结尾 -->
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
        </view>

        <!-- 底部操作 -->
        <view class="bottom-fixed padding-main">
            <block v-if="common_user_address_platform_import_list.length > 0 && common_user_address_platform_import_list.indexOf(client_value) != -1">
                <view class="submit-list">
                    <button class="bg-main br-main cr-white round text-size dis-inline-block fl" type="default" hover-class="none" @tap="address_add_event">添加新地址</button>
                    <button class="bg-main-pair br-main-pair cr-white round text-size dis-inline-block fr" type="default" hover-class="none" @tap="choose_system_address_event">导入系统地址</button>
                </view>
            </block>
            <block v-else>
                <button class="bg-main br-main cr-white round text-size wh-auto" type="default" hover-class="none" @tap="address_add_event">添加新地址</button>
            </block>
        </view>
    </view>
</template>

<script>
    const app = getApp();
    import componentNoData from "../../components/no-data/no-data";
    import componentBottomLine from "../../components/bottom-line/bottom-line";

    var common_static_url = app.globalData.get_static_url('common');
    export default {
        data() {
            return {
                common_static_url: common_static_url,
                data_list_loding_status: 1,
                data_bottom_line_status: false,
                common_user_address_platform_import_list: [],
                client_value: app.globalData.application_client_type(),
                data_list: [],
                params: null,
                is_default: 0
            };
        },

        components: {
            componentNoData,
            componentBottomLine
        },
        props: {},

        onLoad(params) {
            this.setData({
                params: params
            });
        },

        onShow() {
            // 异步初始化配置
            this.init_config();

            // 数据初始化
            this.init();
            
            // 分享菜单处理
            app.globalData.page_share_handle();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.get_data_list();
        },

        methods: {
            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {
                    this.setData({
                        common_user_address_platform_import_list: app.globalData.get_config('config.common_user_address_platform_import_list', [])
                    });
                } else {
                    app.globalData.is_config(this, 'init_config');
                }
            },

            // 初始化
            init() {
                var user = app.globalData.get_user_info(this, "init");
                if (user != false) {
                    // 用户未绑定用户则转到登录页面
                    if (app.globalData.user_is_need_login(user)) {
                        uni.redirectTo({
                            url: "/pages/login/login?event_callback=init"
                        });
                        return false;
                    } else {
                        // 获取数据
                        this.get_data_list();
                    }
                } else {
                    this.setData({
                        data_list_loding_status: 0,
                        data_bottom_line_status: false
                    });
                }
            },

            // 获取数据列表
            get_data_list() {
                // 加载loding
                uni.showLoading({
                    title: "加载中..."
                });
                this.setData({
                    data_list_loding_status: 1
                });
                
                // 获取数据
                uni.request({
                    url: app.globalData.get_request_url("index", "useraddress"),
                    method: "POST",
                    data: this.params,
                    dataType: "json",
                    success: res => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            if (data.data.length > 0) {
                                // 获取当前默认地址
                                var is_default = 0;
                                for (var i in data.data) {
                                    if (data.data[i]['is_default'] == 1) {
                                        is_default = data.data[i]['id'];
                                    }
                                }
                                
                                // 设置数据
                                this.setData({
                                    data_list: data.data,
                                    is_default: is_default,
                                    data_list_loding_status: 3,
                                    data_bottom_line_status: true
                                });
                            } else {
                                this.setData({
                                    data_list_loding_status: 0
                                });
                            }
                        } else {
                            this.setData({
                                data_list_loding_status: 0
                            });
                            if (app.globalData.is_login_check(res.data, this, 'get_data_list')) {
                                app.globalData.showToast(res.data.msg);
                            }
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

            // 删除地址
            address_delete_event(e) {
                var index = e.currentTarget.dataset.index;
                var value = e.currentTarget.dataset.value || null;
                if (value == null) {
                    app.globalData.showToast("地址ID有误");
                    return false;
                }

                var self = this;
                uni.showModal({
                    title: "温馨提示",
                    content: "删除后不可恢复，确定继续吗?",
                    confirmText: "确认",
                    cancelText: "不了",
                    success: result => {
                        if (result.confirm) {
                            // 加载loding
                            uni.showLoading({
                                title: "处理中..."
                            });
                            
                            // 获取数据
                            uni.request({
                                url: app.globalData.get_request_url("delete", "useraddress"),
                                method: "POST",
                                data: {
                                    id: value
                                },
                                dataType: "json",
                                success: res => {
                                    uni.hideLoading();
                                    if (res.data.code == 0) {
                                        var temp_data = self.data_list;
                                        temp_data.splice(index, 1);
                                        self.setData({
                                            data_list: temp_data,
                                            data_list_loding_status: temp_data.length == 0 ? 0 : 3,
                                            data_bottom_line_status: temp_data.length == 0 ? false : true
                                        });
                                        app.globalData.showToast(res.data.msg, "success");
                                        
                                        // 当前删除是否存在缓存中，存在则删除
                                        var cache_address = uni.getStorageSync(app.globalData.data.cache_buy_user_address_select_key);
                                        if ((cache_address.data || null) != null) {
                                            if (cache_address.data.id == value) {
                                                // 删除地址缓存
                                                uni.removeStorageSync(app.globalData.data.cache_buy_user_address_select_key);
                                            }
                                        }
                                    } else {
                                        if (app.globalData.is_login_check(res.data)) {
                                            app.globalData.showToast(res.data.msg);
                                        } else {
                                            app.globalData.showToast('提交失败，请重试！');
                                        }
                                    }
                                },
                                fail: () => {
                                    uni.hideLoading();
                                    app.globalData.showToast("服务器请求出错");
                                }
                            });
                        }
                    }
                });
            },

            // 默认地址设置
            address_default_event(e) {
                var value = e.currentTarget.dataset.value || null;
                if (value == null) {
                    app.globalData.showToast("地址ID有误");
                    return false;
                }
                var self = this;
                if (value == self.is_default) {
                    app.globalData.showToast("设置成功", "success");
                    return false;
                }
                
                // 加载loding
                uni.showLoading({
                    title: "处理中..."
                });
                
                // 获取数据
                uni.request({
                    url: app.globalData.get_request_url("setdefault", "useraddress"),
                    method: "POST",
                    data: {
                        id: value
                    },
                    dataType: "json",
                    success: res => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            self.setData({
                                is_default: value
                            });
                            app.globalData.showToast(res.data.msg, "success");
                        } else {
                            if (app.globalData.is_login_check(res.data)) {
                                app.globalData.showToast(res.data.msg);
                            } else {
                                app.globalData.showToast('提交失败，请重试！');
                            }
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        app.globalData.showToast("服务器请求出错");
                    }
                });
            },

            // 地址内容事件
            address_conent_event(e) {
                var index = e.currentTarget.dataset.index || 0;
                var is_back = this.params.is_back || 0;
                if (is_back == 1) {
                    uni.setStorage({
                        key: app.globalData.data.cache_buy_user_address_select_key,
                        data: this.data_list[index]
                    });
                    uni.navigateBack();
                }
            },

            // 获取系统地址事件
            choose_system_address_event(e) {
                // 百度、头条则需要验证授权
                // #ifdef MP-BAIDU || MP-TOUTIAO
                // 去验证授权
                if(e != 1) {
                    app.globalData.auth_check(this, 'choose_system_address_event', 'scope.address');
                    return false;
                }
                // #endif
                
                // 获取地址授权信息
                uni.chooseAddress({
                    success(res) {
                        var data = {
                            "name": res.userName || '',
                            "tel": res.telNumber || '',
                            "province": res.provinceName || '',
                            "city": res.cityName || '',
                            "county": res.countyName || '',
                            "address": res.detailInfo || ''
                        };
                        
                        // 加载获取数据
                        uni.showLoading({
                            title: "处理中..."
                        });
                        uni.request({
                            url: app.globalData.get_request_url("outsystemadd", "useraddress"),
                            method: "POST",
                            data: data,
                            dataType: "json",
                            success: res => {
                                uni.hideLoading();
                                if (res.data.code == 0) {
                                    this.get_data_list();
                                } else {
                                    if (app.globalData.is_login_check(res.data)) {
                                        app.globalData.showToast(res.data.msg);
                                    } else {
                                        app.globalData.showToast('提交失败，请重试！');
                                    }
                                }
                            },
                            fail: () => {
                                uni.hideLoading();
                                app.globalData.showToast("服务器请求出错");
                            }
                        });
                    }
                });
            },
            
            // 添加地址事件
            address_add_event(e) {
                var temp_params = this.params;
                    temp_params['id'] = 0;
                var query = app.globalData.json_to_url_params(temp_params);
                uni.navigateTo({
                    url: '/pages/user-address-save/user-address-save?' + query
                });
            },

            // 地址编辑
            address_edit_event(e) {
                var index = e.currentTarget.dataset.index || 0;
                var data = this.data_list[index] || null;
                if (data == null) {
                    app.globalData.showToast("地址有误");
                    return false;
                }

                // 进入编辑页面
                var temp_params = this.params;
                    temp_params['id'] = data.id;
                var query = app.globalData.json_to_url_params(temp_params);
                uni.navigateTo({
                    url: '/pages/user-address-save/user-address-save?' + query
                });
            },

            // 地图查看
            address_map_event(e) {
                var index = e.currentTarget.dataset.index || 0;
                var data = this.data_list[index] || null;
                if (data == null) {
                    app.globalData.showToast("地址有误");
                    return false;
                }

                // 打开地图
                var name = data.alias || data.name || '';
                var address = (data.province_name || '') + (data.city_name || '') + (data.county_name || '') + (data.address || '');
                app.globalData.open_location(data.lng, data.lat, name, address);
            }
        }
    };
</script>
<style>
    @import './user-address.css';
</style>