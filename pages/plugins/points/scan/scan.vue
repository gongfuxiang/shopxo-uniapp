<template>
    <view :class="theme_view">
        <view v-if="(data || null) != null" :class="'page-content min-ht '+((user == null || data.status == -10000) ? 'page-bottom-fixed' : '')">
            <block v-if="data.status == -10000">
                <!-- 顶部banner -->
                <image v-if="(data_base.scan_top_banner || null) != null" :src="data_base.scan_top_banner" mode="widthFix" class="dis-block wh-auto auto"></image>
                <!-- 底部图片 -->
                <image v-if="(data_base.scan_bottom_images || null) != null" :src="data_base.scan_bottom_images" mode="widthFix" class="dis-block wh-auto auto"></image>
                <!-- 扫码 -->
                <!-- #ifndef H5 -->
                <view v-if="user != null" class="pf left-0 bottom-xxxxl wh-auto tc padding-horizontal-main bs-bb">
                    <view class="bottom-line-exclude">
                        <button type="default" class="scan-button text-size-sm round" @tap="scan_event">
                            <view class="va-m dis-inline-block margin-right-xs">
                                <iconfont name="icon-scan" size="28rpx" propClass="lh-il va-m" color="#CC2121"></iconfont>
                            </view>
                            <text class="va-m">{{$t('common.scan_name')}}</text>
                        </button>
                    </view>
                </view>
                <!-- #endif -->
                <!-- 结尾 -->
                <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
            </block>
            <block v-else>
                <!-- 领取成功 -->
                <block v-if="data.status == 0">
                    <image v-if="(data_base.scan_success_images || null) != null" :src="data_base.scan_success_images" mode="widthFix" class="dis-block wh-auto auto"></image>
                    <view class="margin-vertical-xxxl tc">{{data.msg}}</view>
                </block>
                <!-- 领取失败 -->
                <block v-else-if="data.status == -100">
                    <image v-if="(data_base.scan_fail_images || null) != null" :src="data_base.scan_fail_images" mode="widthFix" class="dis-block wh-auto auto"></image>
                    <view class="margin-vertical-xxxl tc">{{data.msg}}</view>
                </block>
                <!-- 其他错误 -->
                <block v-else>
                    <component-no-data propStatus="0" :propMsg="data.msg"></component-no-data>
                </block>
            </block>
            <!-- 未登录 -->
            <view v-if="user == null" class="pf left-0 bottom-xxxxl wh-auto tc padding-horizontal-main bs-bb">
                <view class="bottom-line-exclude">
                    <button type="default" class="bg-main br-main cr-white text-size-sm round" @tap="login_event">{{$t('pages.login')}}</button>
                </view>
            </view>
        </view>
        <block v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </block>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';

    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                data_bottom_line_status: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                params: null,
                user: null,
                data_base: null,
                data: null,
                // 自定义分享信息
                share_info: {},
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
                params: app.globalData.launch_params_handle(params),
            });
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 用户信息
            this.setData({
                user: app.globalData.get_user_cache_info(),
            });

            // 获取数据
            this.get_data();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }
        },

        methods: {
            // 获取数据
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url('index', 'scan', 'points'),
                    method: 'POST',
                    data: this.params,
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
                                data_base: data.base || null,
                                data: data.data || null,
                                data_list_loding_msg: '',
                                data_list_loding_status: 0,
                                data_bottom_line_status: (data.data || null) != null,
                            });

                            if ((this.data_base || null) != null) {
                                // 基础自定义分享
                                this.setData({
                                    share_info: {
                                        title: this.$t('pages.plugins-points-scan'),
                                        path: '/pages/plugins/points/scan/scan'
                                    }
                                });
                            }
                        } else {
                            this.setData({
                                data_bottom_line_status: false,
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg,
                            });
                        }
                        // 分享菜单处理
                        app.globalData.page_share_handle(this.share_info);
                    },
                    fail: () => {
                        this.setData({
                            data_bottom_line_status: false,
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 登录事件
            login_event() {
                var user = app.globalData.get_user_info(this, 'login_event');
                this.setData({
                    user: user || null,
                });
            },

            // 扫码事件
            scan_event() {
                var self = this;
                uni.scanCode({
                    success: function (res) {
                        if (res.result !== '') {
                            var arr = ['/points-scan-index-id-', 'plugins/index/pluginsname/points/pluginscontrol/scan/pluginsaction/index/id/'];
                            var ret = app.globalData.web_url_value_mate(res.result, arr);
                            if (ret.status == 1 && ret.value != null) {
                                var temp = self.params;
                                temp['id'] = ret.value;
                                self.setData({
                                    params: temp
                                });
                                self.get_data();
                            }
                        }
                    }
                });
            }
        }
    };
</script>
<style>
    @import './scan.css';
</style>