<template>
    <view :class="theme_view">
        <view class="page-bottom-fixed padding-main">
            <view v-if="data_list.length > 0">
                <view v-for="(item, index) in data_list" :key="index" class="item padding-vertical-xl padding-left-xl bg-white spacing-mb flex-row jc-sb align-c border-radius-main">
                    <view class="flex-1 flex-width" @tap="address_conent_event" :data-index="index">
                        <view class="flex-row align-c">
                            <text v-if="is_default == item.id" class="default-address margin-right-sm text-size-xss border-radius-sm">{{$t('user-address.user-address.e8qg73')}}</text>
                            <text v-if="(item.alias || null) != null" class="address-alias br-main cr-main margin-right-sm text-size-xss border-radius-sm">{{ item.alias }}</text>
                            <view class="single-text flex-1 flex-width fw-b">
                                <text>{{ item.province_name || '' }}{{ item.city_name || '' }}{{ item.county_name || '' }}{{ item.address || '' }}</text>
                            </view>
                        </view>
                        <view class="flex-row align-c flex-wrap padding-top-main">
                            <view class="padding-right-main">{{ item.name }}</view>
                            <view class="cr-grey">{{ item.tel }}</view>
                            <view v-if="(item.distance_value || null) != null && (item.distance_unit || null) != null" class="cr-grey text-size-xs flex-1 tr">{{$t('extraction-switch.extraction-switch.w94x36')}}{{ item.distance_value }}{{ item.distance_unit }}</view>
                        </view>
                    </view>
                    <view class="padding-vertical-main padding-left-main padding-right-xl" @tap="address_edit_event" :data-index="index">
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
        <view class="bottom-fixed" :style="bottom_fixed_style">
            <view class="bottom-line-exclude">
                <block v-if="common_user_address_platform_import_list.length > 0 && common_user_address_platform_import_list.indexOf(client_value) != -1">
                    <view class="flex-row jc-sb align-c gap-10">
                        <button class="item cr-white round text-size wh-auto" type="default" hover-class="none" @tap="address_add_event" :style="btn_bg_color">{{$t('user-address.user-address.3i4x2r')}}</button>
                        <button class="item br-main cr-main bg-white round text-size wh-auto" type="default" hover-class="none" @tap="choose_system_address_event">{{$t('user-address.user-address.1rwt3l')}}</button>
                    </view>
                </block>
                <block v-else>
                    <button class="item cr-white round text-size wh-auto" type="default" hover-class="none" @tap="address_add_event" :style="btn_bg_color">{{$t('user-address.user-address.3i4x2r')}}</button>
                </block>
            </view>
        </view>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>

<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    const theme_color = app.globalData.get_theme_color();
    const theme_color_light = app.globalData.get_theme_color(null, true);
    var common_static_url = app.globalData.get_static_url('common');
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                theme_color: theme_color,
                theme_color_light: theme_color_light,
                btn_bg_color: 'background:linear-gradient(107deg, ' + theme_color_light + ' 0%, ' + theme_color + ' 100%)',
                common_static_url: common_static_url,
                data_list_loding_status: 1,
                data_bottom_line_status: false,
                bottom_fixed_style: '',
                common_user_address_platform_import_list: [],
                client_value: app.globalData.application_client_type(),
                data_list: [],
                params: null,
                // 当前默认地址id
                is_default: 0,
                // 自动导入系统地址并选择
                is_auto_import_system_address_choose: 0,
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            this.setData({
                params: params,
            });
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 异步初始化配置
            this.init_config();

            // 数据初始化
            this.init();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }

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
                    this.get_data_list();
                } else {
                    this.setData({
                        data_list_loding_status: 0,
                        data_bottom_line_status: false,
                    });
                }
            },

            // 获取数据列表
            get_data_list() {
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
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            var data_list = data.data || [];
                            if (data_list.length > 0) {
                                // 获取当前默认地址
                                var is_default = 0;
                                for (var i in data_list) {
                                    if (data_list[i]['is_default'] == 1) {
                                        is_default = data_list[i]['id'];
                                    }
                                }

                                // 设置数据
                                this.setData({
                                    data_list: data_list,
                                    is_default: is_default,
                                    data_list_loding_status: 3,
                                    data_bottom_line_status: true,
                                });
                            } else {
                                this.setData({
                                    data_list: [],
                                    data_list_loding_status: 0,
                                    data_bottom_line_status: false,
                                });

                                // 没有地址：当前不是选择地址自动返回模式下、是否下单选择地址、并且开启了系统地址选择则导入系统地址
                                if(this.is_auto_import_system_address_choose == 0 && (this.params.is_back || 0) == 1 && this.common_user_address_platform_import_list.length > 0 && this.common_user_address_platform_import_list.indexOf(this.client_value) != -1) {
                                    this.setData({
                                        is_auto_import_system_address_choose: 1,
                                    });
                                    this.choose_system_address_event();
                                }
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
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 地址内容事件
            address_conent_event(e) {
                // 基础数据
                var index = e.currentTarget.dataset.index || 0;
                var data = this.data_list[index];
                // 地址选择存储缓存并返回
                if ((this.params.is_back || 0) == 1) {
                    // 地址状态是否禁用
                    if(parseInt(data.address_disable_status || 0) == 1 && (data.address_disable_msg || null) != null) {
                        app.globalData.showToast(data.address_disable_msg);
                    } else {
                        // 存储缓存并返回
                        this.address_choose_cache_save_back(data);
                    }
                } else {
                    // 点击复制地址
                    var copy_val = this.$t('user-address.user-address.7r29v8') + data.name + '\n' + this.$t('user-address.user-address.2nmsi1') + data.tel + '\n' + this.$t('user-address.user-address.s150l6') + data.province_name + data.city_name + data.county_name + data.address;
                    app.globalData.text_copy_event(copy_val);
                }
            },

            // 地址选择存储并返回
            address_choose_cache_save_back(address) {
                uni.setStorage({
                    key: app.globalData.data.cache_buy_user_address_select_key,
                    data: address,
                });
                uni.navigateBack();
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
                var self = this;
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
                        if((Object.values(data).join('') || null) != null) {
                            uni.showLoading({
                                title: self.$t('common.processing_in_text'),
                            });
                            uni.request({
                                url: app.globalData.get_request_url('outsystemadd', 'useraddress'),
                                method: 'POST',
                                data: data,
                                dataType: 'json',
                                success: (res) => {
                                    uni.hideLoading();
                                    if (res.data.code == 0) {
                                        // 是否自动选择地址并返回
                                        if(self.is_auto_import_system_address_choose == 1) {
                                            // 存储缓存并返回
                                            self.address_choose_cache_save_back(res.data.data);
                                        } else {
                                            // 重新拉取列表数据
                                            self.get_data_list();
                                        }
                                    } else {
                                        if (app.globalData.is_login_check(res.data)) {
                                            app.globalData.showToast(res.data.msg);
                                        } else {
                                            app.globalData.showToast(self.$t('common.sub_error_retry_tips'));
                                        }
                                    }
                                },
                                fail: () => {
                                    uni.hideLoading();
                                    app.globalData.showToast(self.$t('common.internet_error_tips'));
                                },
                            });
                        }
                    },
                });
            },

            // 添加地址事件
            address_add_event(e) {
                var temp_params = this.params;
                temp_params['id'] = 0;
                var query = app.globalData.json_to_url_params(temp_params);
                app.globalData.url_open('/pages/user-address-save/user-address-save?' + query);
            },

            // 地址编辑
            address_edit_event(e) {
                var index = e.currentTarget.dataset.index || 0;
                var data = this.data_list[index] || null;
                if (data == null) {
                    app.globalData.showToast(this.$t('user-order-detail.user-order-detail.i876o3'));
                    return false;
                }

                // 进入编辑页面
                var temp_params = this.params;
                temp_params['id'] = data.id;
                var query = app.globalData.json_to_url_params(temp_params);
                app.globalData.url_open('/pages/user-address-save/user-address-save?' + query);
            },

            // 地图查看
            address_map_event(e) {
                var index = e.currentTarget.dataset.index || 0;
                var data = this.data_list[index] || null;
                if (data == null) {
                    app.globalData.showToast(this.$t('user-order-detail.user-order-detail.i876o3'));
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
