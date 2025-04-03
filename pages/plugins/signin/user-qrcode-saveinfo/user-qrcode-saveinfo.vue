<template>
    <view :class="theme_view">
        <view class="page-bottom-fixed">
            <view v-if="data_base != null">
                <form @submit="form_submit" class="form-container">
                    <view class="padding-main oh">
                        <view class="padding-main border-radius-main bg-white spacing-mb">
                            <view>
                                <text class="cr-base margin-right-sm">{{$t('user-qrcode-detail.user-qrcode-detail.mjfygy')}}</text>
                                <text class="cr-main fw-b">{{ data.reward_master || data_base.reward_master }}</text>
                                <text class="cr-grey margin-left-sm">{{$t('index.index.t26j9z')}}</text>
                            </view>
                            <view class="margin-top-sm">
                                <text class="cr-base margin-right-sm">{{$t('user-qrcode-detail.user-qrcode-detail.pb2e32')}}</text>
                                <text class="cr-main fw-b">{{ data.reward_invitee || data_base.reward_invitee }}</text>
                                <text class="cr-grey margin-left-sm">{{$t('index.index.t26j9z')}}</text>
                            </view>
                        </view>

                        <view v-if="(data_base.is_qrcode_must_userinfo || 0) == 1">
                            <view class="form-gorup">
                                <view class="form-gorup-title">{{$t('user-qrcode-detail.user-qrcode-detail.do23j6')}}<text class="form-group-tips-must">*</text></view>
                                <input type="text" name="name" placeholder-class="cr-grey" class="cr-base" :placeholder="$t('user-qrcode-saveinfo.user-qrcode-saveinfo.xa2k42')" maxlength="30" :value="data.name || ''" />
                            </view>
                            <view class="form-gorup">
                                <view class="form-gorup-title">{{$t('user-qrcode-detail.user-qrcode-detail.5k2ibd')}}<text class="form-group-tips-must">*</text></view>
                                <input type="text" name="tel" placeholder-class="cr-grey" class="cr-base" :placeholder="$t('user-qrcode-saveinfo.user-qrcode-saveinfo.e9ko33')" maxlength="15" :value="data.tel || ''" />
                            </view>
                            <view class="form-gorup">
                                <view class="form-gorup-title">{{$t('user-qrcode-detail.user-qrcode-detail.911a61')}}<text class="form-group-tips-must">*</text></view>
                                <input type="text" name="address" placeholder-class="cr-grey" class="cr-base" :placeholder="$t('user-qrcode-saveinfo.user-qrcode-saveinfo.bbxaw6')" maxlength="230" :value="data.address || ''" />
                            </view>
                        </view>
                        <view class="form-gorup">
                            <view class="form-gorup-title">{{$t('common.note')}}</view>
                            <input type="text" name="note" placeholder-class="cr-grey" class="cr-base" :placeholder="$t('invoice-saveinfo.invoice-saveinfo.vaw647')" maxlength="60" :value="data.note || ''" />
                        </view>
                        <view class="bottom-fixed" :style="bottom_fixed_style">
                            <view class="bottom-line-exclude">
                                <button class="item bg-main br-main cr-white round text-size" type="default" form-type="submit" hover-class="none" :loading="form_submit_loading" :disabled="form_submit_loading">{{$t('common.submit')}}</button>
                            </view>
                        </view>
                    </view>
                </form>
            </view>
            <view v-else>
                <!-- 提示信息 -->
                <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
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

    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                params: {},
                form_submit_loading: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                bottom_fixed_style: '',
                data_base: null,
                data: null,
            };
        },

        components: {
            componentCommon,
            componentNoData,
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            this.setData({
                params: params || {},
            });

            // 设置标题
            uni.setNavigationBarTitle({
                title: this.$t('user-qrcode-saveinfo.user-qrcode-saveinfo.jw2h8l') + ((this.params.id || null) == null ? this.$t('invoice-saveinfo.invoice-saveinfo.004t56') : this.$t('common.edit')),
            });

            // 加载数据
            this.init();
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }

            // 分享菜单处理
            app.globalData.page_share_handle();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.init();
        },

        methods: {
            init() {
                var self = this;
                this.setData({
                    data_list_loding_status: 1,
                });
                uni.request({
                    url: app.globalData.get_request_url('saveinfo', 'userqrcode', 'signin'),
                    method: 'POST',
                    data: {...this.params, ...{is_lang: 0}},
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            self.setData({
                                data_base: data.base || null,
                                data: data.data || null,
                                data_list_loding_status: 0,
                            });
                        } else {
                            self.setData({
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg,
                            });
                            if (app.globalData.is_login_check(res.data, self, 'init')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        self.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 表单提交
            form_submit(e) {
                var data = e.detail.value;
                if ((this.data || null) != null) {
                    data['id'] = this.data.id || 0;
                }

                // 数据验证
                var validation = [];
                if ((this.data_base || null) != null && (this.data_base.is_qrcode_must_userinfo || 0) == 1) {
                    validation.push({ fields: 'name', msg: this.$t('user-qrcode-saveinfo.user-qrcode-saveinfo.84g5t6') });
                    validation.push({ fields: 'tel', msg: this.$t('user-qrcode-saveinfo.user-qrcode-saveinfo.1tilke') });
                    validation.push({ fields: 'address', msg: this.$t('user-qrcode-saveinfo.user-qrcode-saveinfo.5m2752') });
                }
                if (app.globalData.fields_check(data, validation)) {
                    uni.showLoading({
                        title: this.$t('buy.buy.r79t77'),
                    });
                    this.setData({
                        form_submit_loading: true,
                    });

                    // 网络请求
                    uni.request({
                        url: app.globalData.get_request_url('save', 'userqrcode', 'signin'),
                        method: 'POST',
                        data: data,
                        dataType: 'json',
                        success: (res) => {
                            uni.hideLoading();
                            if (res.data.code == 0) {
                                var self = this;
                                var data = res.data;
                                // 现金支付
                                uni.showModal({
                                    content: res.data.msg,
                                    showCancel: false,
                                    success(res) {
                                        if (res.confirm) {
                                            var is_temp = (self.params || null) != null && (self.params.is_team || 0) == 1;
                                            setTimeout(function () {
                                                // 是否签到也组队
                                                if (is_temp) {
                                                    app.globalData.url_open('/pages/plugins/signin/detail/detail?id=' + data.data, true);
                                                } else {
                                                    uni.navigateBack();
                                                }
                                            }, 2000);
                                        }
                                    },
                                });
                            } else {
                                this.setData({
                                    form_submit_loading: false,
                                });
                                if (app.globalData.is_login_check(res.data)) {
                                    app.globalData.showToast(res.data.msg);
                                } else {
                                    app.globalData.showToast(this.$t('common.sub_error_retry_tips'));
                                }
                            }
                        },
                        fail: () => {
                            uni.hideLoading();
                            this.setData({
                                form_submit_loading: false,
                            });
                            app.globalData.showToast(this.$t('common.internet_error_tips'));
                        },
                    });
                }
            },
        },
    };
</script>
<style></style>
