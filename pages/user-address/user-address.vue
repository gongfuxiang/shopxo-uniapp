<template>
    <view>
        <view class="page-bottom-fixed padding-main">
            <view v-if="data_list.length > 0">
                <view v-for="(item, index) in data_list" :key="index" class="item padding-xl bg-white spacing-mb flex-row jc-sb align-c">
                    <view class="flex-1 flex-width padding-right-main" @tap="address_conent_event" :data-index="index">
                        <view class="flex-row align-c">
                            <text v-if="is_default == item.id" class="default-address margin-right-sm text-size-xss border-radius-sm">默认</text>
                            <text v-if="(item.alias || null) != null" class="address-alias br-main cr-main margin-right-sm text-size-xss border-radius-sm">{{ item.alias }}</text>
                            <view class="single-text flex-1 flex-width fw-b">
                                <text>{{ item.province_name || '' }}{{ item.city_name || '' }}{{ item.county_name || '' }}{{ item.address || '' }}</text>
                                <view v-if="(item.distance_value || null) != null && (item.distance_unit || null) != null" class="cr-grey margin-left-lg">
                                    距离
                                    <text class="cr-base"> {{ item.distance_value }} </text>
                                    {{ item.distance_unit }}
                                </view>
                            </view>
                        </view>
                        <view class="flex-row align-c flex-warp padding-top-main">
                            <text class="padding-right-main">{{ item.name }}</text>
                            <text class="cr-grey-9">{{ item.tel }}</text>
                        </view>
                    </view>
                    <view class="padding-vertical-main" @tap="address_edit_event" :data-index="index">
                        <iconfont name="icon-wddz-bianji" size="24rpx"></iconfont>
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
        <view class="bottom-fixed btn-bottom bg-white">
            <view class="oh bottom-line-exclude">
                <block v-if="common_user_address_platform_import_list.length > 0 && common_user_address_platform_import_list.indexOf(client_value) != -1">
                    <view class="submit-list flex-row jc-sb align-c">
                        <button class="cr-white round text-size" type="default" hover-class="none" @tap="address_add_event" :style="btn_bg_color">添加新地址</button>
                        <button class="br-main cr-main bg-white round text-size" type="default" hover-class="none" @tap="choose_system_address_event">导入系统地址</button>
                    </view>
                </block>
                <block v-else>
                    <button class="cr-white round text-size wh-auto" type="default" hover-class="none" @tap="address_add_event" :style="btn_bg_color">添加新地址</button>
                </block>
            </view>
        </view>
    </view>
</template>

<script>
    const app = getApp();
    import componentNoData from '../../components/no-data/no-data';
    import componentBottomLine from '../../components/bottom-line/bottom-line';
    const theme_color = app.globalData.get_theme_color();
    const theme_color_light = app.globalData.get_theme_color(true);

    var common_static_url = app.globalData.get_static_url('common');
    export default {
        data() {
            return {
                theme_color: theme_color,
                theme_color_light: theme_color_light,
                btn_bg_color: 'background:linear-gradient(107deg, ' + theme_color_light + ' 0%, ' + theme_color + ' 100%)',
                common_static_url: common_static_url,
                data_list_loding_status: 1,
                data_bottom_line_status: false,
                common_user_address_platform_import_list: [],
                client_value: app.globalData.application_client_type(),
                data_list: [],
                params: null,
                is_default: 0,
            };
        },

        components: {
            componentNoData,
            componentBottomLine,
        },
        props: {},

        onLoad(params) {
            this.setData({
                params: params,
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
                        common_user_address_platform_import_list: app.globalData.get_config('config.common_user_address_platform_import_list', []),
                    });
                } else {
                    app.globalData.is_config(this, 'init_config');
                }
            },

            // 初始化
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    // 用户未绑定用户则转到登录页面
                    if (app.globalData.user_is_need_login(user)) {
                        uni.redirectTo({
                            url: '/pages/login/login?event_callback=init',
                        });
                        return false;
                    } else {
                        // 获取数据
                        this.get_data_list();
                    }
                } else {
                    this.setData({
                        data_list_loding_status: 0,
                        data_bottom_line_status: false,
                    });
                }
            },

            // 获取数据列表
            get_data_list() {
                // 加载loding
                uni.showLoading({
                    title: '加载中...',
                });
                this.setData({
                    data_list_loding_status: 1,
                });

                // 获取数据
                uni.request({
                    url: app.globalData.get_request_url('index', 'useraddress'),
                    method: 'POST',
                    data: this.params,
                    dataType: 'json',
                    success: (res) => {
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
                                    data_bottom_line_status: true,
                                });
                            } else {
                                this.setData({
                                    data_list_loding_status: 0,
                                });
                            }
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
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
                            data_list_loding_status: 2,
                        });
                        app.globalData.showToast('服务器请求出错');
                    },
                });
            },

            // 地址内容事件
            address_conent_event(e) {
                var index = e.currentTarget.dataset.index || 0;
                var is_back = this.params.is_back || 0;
                if (is_back == 1) {
                    uni.setStorage({
                        key: app.globalData.data.cache_buy_user_address_select_key,
                        data: this.data_list[index],
                    });
                    uni.navigateBack();
                }
            },

            // 获取系统地址事件
            choose_system_address_event(e) {
                // 百度、头条则需要验证授权
                // #ifdef MP-BAIDU || MP-TOUTIAO
                // 去验证授权
                if (e != 1) {
                    app.globalData.auth_check(this, 'choose_system_address_event', 'scope.address');
                    return false;
                }
                // #endif

                // 获取地址授权信息
                uni.chooseAddress({
                    success(res) {
                        var data = {
                            name: res.userName || '',
                            tel: res.telNumber || '',
                            province: res.provinceName || '',
                            city: res.cityName || '',
                            county: res.countyName || '',
                            address: res.detailInfo || '',
                        };

                        // 加载获取数据
                        uni.showLoading({
                            title: '处理中...',
                        });
                        uni.request({
                            url: app.globalData.get_request_url('outsystemadd', 'useraddress'),
                            method: 'POST',
                            data: data,
                            dataType: 'json',
                            success: (res) => {
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
                                app.globalData.showToast('服务器请求出错');
                            },
                        });
                    },
                });
            },

            // 添加地址事件
            address_add_event(e) {
                var temp_params = this.params;
                temp_params['id'] = 0;
                var query = app.globalData.json_to_url_params(temp_params);
                uni.navigateTo({
                    url: '/pages/user-address-save/user-address-save?' + query,
                });
            },

            // 地址编辑
            address_edit_event(e) {
                var index = e.currentTarget.dataset.index || 0;
                var data = this.data_list[index] || null;
                if (data == null) {
                    app.globalData.showToast('地址有误');
                    return false;
                }

                // 进入编辑页面
                var temp_params = this.params;
                temp_params['id'] = data.id;
                var query = app.globalData.json_to_url_params(temp_params);
                uni.navigateTo({
                    url: '/pages/user-address-save/user-address-save?' + query,
                });
            },

            // 地图查看
            address_map_event(e) {
                var index = e.currentTarget.dataset.index || 0;
                var data = this.data_list[index] || null;
                if (data == null) {
                    app.globalData.showToast('地址有误');
                    return false;
                }

                // 打开地图
                var name = data.alias || data.name || '';
                var address = (data.province_name || '') + (data.city_name || '') + (data.county_name || '') + (data.address || '');
                app.globalData.open_location(data.lng, data.lat, name, address);
            },
        },
    };
</script>
<style>
    @import './user-address.css';
</style>
