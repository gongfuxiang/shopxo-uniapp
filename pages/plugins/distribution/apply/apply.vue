<template>
    <view :class="theme_view">
        <view v-if="data_list_loding_status == 3" class="page-bottom-fixed">
            <!-- 已有分销权限 -->
            <view v-if="is_has_distribution_level == 1" class="padding-main">
                <view class="padding-vertical-main border-radius-main bg-green-light cr-green">
                    <view>{{$t('apply.apply.p8ssed')}}<template v-if="(apply_data || null) != null && (apply_data.level_name || null) != null">{{$t('apply.apply.l3vnel')}}{{ apply_data.level_name }}</template></view>
                </view>
                <view v-if="(apply_data || null) != null && ((apply_data.audit_time || null) != null || (apply_data.add_time || null) != null)" class="cr-grey text-size-sm spacing-mb">
                    <view v-if="(apply_data.audit_time || null) != null">{{$t('apply.apply.a9time')}}{{ apply_data.audit_time }}</view>
                    <view v-if="(apply_data.add_time || null) != null" class="margin-top-xs">{{$t('apply.apply.a4time')}}{{ apply_data.add_time }}</view>
                </view>
                <view v-if="(apply_data || null) != null && !isEmpty(apply_data.form_data)" class="bg-white border-radius-main">
                    <component-form-input-detail :propTitle="$t('apply.apply.i5nfo')" :propData="apply_data.form_data"></component-form-input-detail>
                </view>
            </view>

            <!-- 待审核：详情 + 去表单编辑 -->
            <view v-else-if="(apply_data || null) != null && apply_data.status == 0" class="padding-main">
                <view class="padding-vertical-main border-radius-main bg-yellow-light cr-yellow">
                    <view>{{$t('apply.apply.w6ait')}}</view>
                </view>
                <view v-if="(apply_data.add_time || null) != null" class="cr-grey text-size-sm margin-top-sm margin-bottom-sm">{{$t('apply.apply.a4time')}}{{ apply_data.add_time }}</view>
                <view v-if="!isEmpty(apply_data.form_data)" class="bg-white border-radius-main spacing-mb">
                    <component-form-input-detail :propTitle="$t('apply.apply.i5nfo')" :propData="apply_data.form_data"></component-form-input-detail>
                </view>
                <view class="bottom-fixed" :style="bottom_fixed_style">
                    <view class="bottom-line-exclude">
                        <button class="item bg-main br-main cr-white round text-size" type="default" hover-class="none" data-value="/pages/plugins/distribution/apply-form/apply-form" @tap="url_event">{{$t('common.edit')}}</button>
                    </view>
                </view>
            </view>

            <!-- 已拒绝：提示 + 去表单重申 -->
            <view v-else-if="(apply_data || null) != null && apply_data.status == 2" class="padding-main">
                <view class="padding-vertical-main border-radius-main bg-red-light cr-red">
                    <view>{{$t('apply.apply.f7ail')}}<template v-if="(apply_data.fail_reason || null) != null && apply_data.fail_reason != ''">：{{ apply_data.fail_reason }}</template></view>
                    <view class="margin-top-xs">{{$t('apply.apply.r8etry')}}</view>
                </view>
                <view v-if="!isEmpty(apply_data.form_data)" class="bg-white border-radius-main spacing-mb">
                    <component-form-input-detail :propTitle="$t('apply.apply.i5nfo')" :propData="apply_data.form_data"></component-form-input-detail>
                </view>
                <view class="bottom-fixed" :style="bottom_fixed_style">
                    <view class="bottom-line-exclude">
                        <button class="item bg-main br-main cr-white round text-size" type="default" hover-class="none" data-value="/pages/plugins/distribution/apply-form/apply-form" @tap="url_event">{{$t('apply.apply.r1eapp')}}</button>
                    </view>
                </view>
            </view>

            <!-- 无申请记录：引导去填写 -->
            <view v-else class="padding-main">
                <component-no-data propStatus="0" :propMsg="$t('apply.apply.g9uide')"></component-no-data>
                <view class="bottom-fixed" :style="bottom_fixed_style">
                    <view class="bottom-line-exclude">
                        <button class="item bg-main br-main cr-white round text-size" type="default" hover-class="none" data-value="/pages/plugins/distribution/apply-form/apply-form" @tap="url_event">{{$t('apply.apply.g0ofill')}}</button>
                    </view>
                </view>
            </view>
        </view>
        <block v-else>
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </block>

        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentFormInputDetail from '@/pages/form-input/components/form-input-detail/form-input-detail';

    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                bottom_fixed_style: '',
                is_has_distribution_level: 0,
                apply_data: null,
                // 无申请记录时确认弹窗只弹一次，避免返回死循环
                is_apply_form_confirm_done: false,
            };
        },
        components: {
            componentCommon,
            componentNoData,
            componentFormInputDetail,
        },
        onLoad(params) {
            params = app.globalData.launch_params_handle(params);
            app.globalData.page_event_onload_handle(params);
            this.init();
        },
        onShow() {
            app.globalData.page_event_onshow_handle();
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }
            // 从填写页返回时刷新状态
            if (this.data_list_loding_status == 3) {
                this.get_data();
            }
        },
        onPullDownRefresh() {
            this.init();
        },
        methods: {
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    this.get_data();
                }
            },
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url('index', 'apply', 'distribution'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data || {};
                            var apply_data = data.apply_data || null;
                            var is_has_distribution_level = data.is_has_distribution_level || 0;
                            this.setData({
                                data_list_loding_status: 3,
                                data_list_loding_msg: '',
                                is_has_distribution_level: is_has_distribution_level,
                                apply_data: apply_data,
                            });
                            uni.setNavigationBarTitle({
                                title: this.$t('pages.plugins-distribution-apply'),
                            });
                            // 无申请记录：确认是否进入填写页（取消则留在本页，避免返回死循环）
                            if (is_has_distribution_level != 1 && (apply_data || null) == null && !this.is_apply_form_confirm_done) {
                                this.setData({
                                    is_apply_form_confirm_done: true,
                                });
                                uni.showModal({
                                    title: this.$t('common.tips'),
                                    content: this.$t('apply.apply.c1nfirm'),
                                    confirmText: this.$t('common.confirm'),
                                    cancelText: this.$t('common.cancel'),
                                    success: (result) => {
                                        if (result.confirm) {
                                            app.globalData.url_open('/pages/plugins/distribution/apply-form/apply-form');
                                        }
                                    },
                                });
                            }
                        } else {
                            this.setData({
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg,
                            });
                            if (app.globalData.is_login_check(res.data, this, 'get_data')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },
            url_event(e) {
                app.globalData.url_event(e);
            },
            isEmpty(value) {
                if ((value || null) == null) {
                    return true;
                }
                if (Array.isArray(value)) {
                    return value.length == 0;
                }
                if (typeof value == 'object') {
                    return Object.keys(value).length == 0;
                }
                return false;
            },
        },
    };
</script>
<style></style>
