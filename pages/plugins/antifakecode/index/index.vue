<template>
    <view :class="theme_view">
        <view v-if="(data || null) != null" :class="'page-content min-ht '+((user == null || data.status == -10000) ? 'page-bottom-fixed' : '')">
            <block v-if="data.status == -10000">
                <!-- 顶部banner -->
                <image v-if="(data.data.scan_top_banner || null) != null" :src="data.data.scan_top_banner" mode="widthFix" class="dis-block wh-auto auto"></image>
                <!-- 底部图片 -->
                <image v-if="(data.data.scan_bottom_images || null) != null" :src="data.data.scan_bottom_images" mode="widthFix" class="dis-block wh-auto auto"></image>
                <!-- 扫码 -->
                <view class="pf left-0 bottom-xxxxl wh-auto tc padding-horizontal-main bs-bb">
                    <view class="bottom-line-exclude">
                        <button type="default" class="scan-button text-size-sm round" @tap="scan_event">
                            <!-- #ifndef H5 -->
                            <view class="va-m dis-inline-block margin-right-xs">
                                <iconfont name="icon-scan" size="28rpx" propClass="lh-il va-m" color="#CC2121"></iconfont>
                            </view>
                            <!-- #endif -->
                            <text class="va-m">{{$t('common.scan_name')}}</text>
                        </button>
                    </view>
                </view>
                <!-- 结尾 -->
                <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
            </block>
            <block v-else>
                <!-- 领取成功 -->
                <block v-if="data.status == 0">
                    <image v-if="(data.data.scan_first_images || null) != null" :src="data.data.scan_first_images" mode="widthFix" class="dis-block wh-auto auto"></image>
                    <view class="margin-vertical-xxxl tc">{{data.data.scan_first_tips}}</view>
                </block>
                <!-- 领取失败 -->
                <block v-else-if="data.status == -100">
                    <image v-if="(data.data.scan_last_images || null) != null" :src="data.data.scan_last_images" mode="widthFix" class="dis-block wh-auto auto"></image>
                    <view class="margin-vertical-xxxl tc">{{data.data.scan_last_tips}}</view>
                </block>
                <!-- 其他错误 -->
                <block v-else>
                    <component-no-data propStatus="0" :propMsg="data.msg"></component-no-data>
                </block>
            </block>
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
                data: null,
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
                    url: app.globalData.get_request_url('index', 'index', 'antifakecode'),
                    method: 'POST',
                    data: this.params,
                    dataType: 'json',
                    success: (res) => {
                        var data = res.data.data || null;
                        this.setData({
                            data: data,
                            data_list_loding_msg: '',
                            data_list_loding_status: 0,
                            data_bottom_line_status: true
                        });
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

            // 扫码事件
            scan_event() {
                var self = this;
                uni.scanCode({
                    success: function (res) {
                        if (res.result !== '') {
                            var arr = ['/antifakecode-index-index-id-', 'plugins/index/pluginsname/antifakecode/pluginscontrol/index/pluginsaction/index/id/'];
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
    @import './index.css';
</style>