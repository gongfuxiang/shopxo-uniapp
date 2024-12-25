<template>
    <view :class="theme_view">
        <view v-if="data_base != null">
            <view class="padding-main">
                <!-- 未申请 -->
                <view v-if="extraction == null">
                    <view v-if="(data_base.self_extraction_apply_desc || null) != null && data_base.self_extraction_apply_desc.length > 0" class="notice-content-blue spacing-mb">
                        <view v-for="(item, index) in data_base.self_extraction_apply_desc" :key="index" class="item">
                            {{ item }}
                        </view>
                    </view>
                    <view class="margin-top-xxxl">
                        <button data-value="/pages/plugins/distribution/extraction-apply/extraction-apply" @tap="url_event" class="bg-main br-main cr-white round wh-auto" type="default" size="mini" hover-class="none">{{$t('extraction.extraction.suna53')}}</button>
                    </view>
                </view>

                <!-- 已存在申请信息 -->
                <view v-else class="apply-already">
                    <!-- status 状态（0待审核, 1已通过, 2已拒绝 -->
                    <!-- 审核中 -->
                    <view v-if="extraction.status == 0">
                        <view class="padding-main border-radius-main bg-white">
                            <view class="cr-red tc text-size-lg">{{$t('extraction.extraction.j0o47u')}}</view>
                        </view>
                        <view class="margin-top-xxxl">
                            <button data-value="/pages/plugins/distribution/extraction-apply/extraction-apply" @tap="url_event" class="bg-green br-green cr-white round wh-auto" type="default" size="mini" hover-class="none">{{$t('common.edit')}}</button>
                        </view>
                    </view>

                    <!-- 审核通过 -->
                    <view v-else-if="extraction.status == 1 || extraction.status == 3" class="valid">
                        <view class="padding-main border-radius-main bg-white">
                            <!-- 导航 -->
                            <view class="padding-bottom-main br-b">
                                <text class="fw-b">{{$t('extraction.extraction.60601g')}}</text>
                                <view data-value="/pages/plugins/distribution/extraction-apply/extraction-apply" @tap="url_event" class="fr cr-blue cp">{{$t('extraction.extraction.48rp75')}}</view>
                            </view>
                            <!-- 地址信息 -->
                            <view class="margin-top-lg" @tap="address_map_event">
                                <text v-if="(extraction.alias || null) != null" class="alias br-main cr-main bg-white round margin-right-sm">{{ extraction.alias }}</text>
                                <text class="cr-base">{{ extraction.province_name }}{{ extraction.city_name }}{{ extraction.county_name }}{{ extraction.address }}</text>
                            </view>
                        </view>
                        <view v-if="extraction.status == 1" class="spacing-mt">
                            <view class="padding-main border-radius-main bg-white">
                                <!-- 导航 -->
                                <view class="padding-bottom-main br-b">
                                    <text class="fw-b">{{$t('extraction.extraction.641gp7')}}</text>
                                    <view data-value="/pages/plugins/distribution/extraction-order/extraction-order" @tap="url_event" class="fr cr-blue cp">{{$t('extraction.extraction.wcv68q')}}</view>
                                </view>
                                <!-- 自提地点统计 -->
                                <view class="statistics oh padding-top-main">
                                    <view class="item fl tc padding-main" data-value="0" @tap="order_event">
                                        <view class="title cr-base">{{$t('extraction.extraction.53h4fj')}}</view>
                                        <view class="single-text cr-red fw-b margin-top-sm">{{ statistical.order_wait || 0 }}</view>
                                    </view>
                                    <view class="item fl tc padding-main" data-value="1" @tap="order_event">
                                        <view class="title cr-base">{{$t('extraction.extraction.wq25fk')}}</view>
                                        <view class="single-text cr-green fw-b margin-top-sm">{{ statistical.order_already || 0 }}</view>
                                    </view>
                                </view>
                            </view>
                            <!-- 通知 -->
                            <view v-if="(data_base || null) != null && (data_base.self_extraction_common_notice || null) != null && data_base.self_extraction_common_notice.length > 0" class="spacing-mt">
                                <view class="notice-content">
                                    <view v-for="(item, index) in data_base.self_extraction_common_notice" :key="index" class="item">
                                        {{ item }}
                                    </view>
                                </view>
                            </view>
                        </view>
                        <!-- 已解约 -->
                        <view v-else class="spacing-mt">
                            <view class="notice-content-blue">{{$t('extraction.extraction.864dtt')}}</view>
                        </view>
                    </view>
                    <!-- 审核失败 -->
                    <view v-else="extraction.status == 2">
                        <view class="padding-main border-radius-main bg-white spacing-mb">
                            <view class="cr-red tc text-size-lg">{{$t('extraction.extraction.11825x')}}</view>
                            <view v-if="(extraction.fail_reason || null) != null" class="margin-top-lg">
                                <text class="fw-b">{{$t('extraction.extraction.w6hg74')}}</text>
                                <text class="cr-grey">{{ extraction.fail_reason }}</text>
                            </view>
                        </view>
                        <view class="margin-top-xxxl">
                            <button data-value="/pages/plugins/distribution/extraction-apply/extraction-apply" @tap="url_event" class="bg-green br-green cr-white round wh-auto" type="default" size="mini" hover-class="none">{{$t('common.edit')}}</button>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 结尾 -->
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
        </view>
        <view v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </view>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from "@/components/no-data/no-data";
    import componentBottomLine from "@/components/bottom-line/bottom-line";

    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                data_bottom_line_status: false,
                data_list_loding_status: 1,
                data_list_loding_msg: "",
                data_base: null,
                extraction: null,
                statistical: null,
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
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 加载数据
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
            this.get_data();
        },

        methods: {
            init() {
                var user = app.globalData.get_user_info(this, "init");
                if (user != false) {
                    this.get_data();
                } else {
                    this.setData({
                        data_list_loding_status: 0,
                        data_bottom_line_status: false,
                    });
                }
            },

            // 获取数据
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url("index", "extraction", "distribution"),
                    method: "POST",
                    data: {},
                    dataType: "json",
                    success: (res) => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
                                data_base: data.base || null,
                                extraction: data.extraction || null,
                                statistical: data.statistical || null,
                                data_list_loding_msg: "",
                                data_list_loding_status: 0,
                                data_bottom_line_status: true,
                            });
                        } else {
                            this.setData({
                                data_bottom_line_status: false,
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg,
                            });
                            if (app.globalData.is_login_check(res.data, this, "get_data")) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_bottom_line_status: false,
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 地图查看
            address_map_event(e) {
                if ((this.extraction || null) == null) {
                    return false;
                }
                var data = this.extraction;

                // 打开地图
                var name = data.alias || data.name || "";
                var address = (data.province_name || "") + (data.city_name || "") + (data.county_name || "") + (data.address || "");
                app.globalData.open_location(data.lng, data.lat, name, address);
            },

            // 进入取货订单管理
            order_event(e) {
                var value = e.currentTarget.dataset.value || 0;
                app.globalData.url_open('/pages/plugins/distribution/extraction-order/extraction-order?status=' + value);
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            }
        },
    };
</script>
<style>
    @import "./extraction.css";
</style>
