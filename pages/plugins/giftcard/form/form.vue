<template>
    <view :class="theme_view">
        <view class="padding-main">
            <block v-if="data_list_loding_status == 3">
                <form @submit="form_submit" class="form-container">
                    <view class="border-radius-main bg-white padding-main padding-bottom-xxxxl spacing-mb">
                        <view class="title fw-b text-size margin-bottom-xxxl padding-bottom-xl">{{$t('giftcard-index.giftcard-index.hfg2fg')}}</view>
                        <input name="secret_key" type="text" class="text-size-lg tc margin-bottom-sm" :placeholder="$t('giftcard-index.giftcard-index.fu3rf1')" placeholder-class="cr-grey-c" />
                    </view>
                    <view class="padding-main">
                        <button type="default" form-type="submit" hover-class="none" size="mini" class="br-main bg-main cr-white round buy-submit text-size dis-block" :disabled="form_submit_loading">{{$t('common.confirm')}}</button>
                    </view>
                </form>
            </block>
            <block v-else>
                <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
            </block>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import componentNoData from '@/components/no-data/no-data';
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                form_submit_loading: false
            };
        },
        components: {
            componentNoData,
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 加载数据
            this.init();
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();
        },

        methods: {
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user == false) {
                    this.setData({
                        data_list_loding_status: 0,
                        data_list_loding_msg: this.$t('setup.setup.nwt4o1'),
                    });
                } else {
                    this.setData({
                        data_list_loding_status: 3,
                        data_list_loding_msg: '',
                    });
                }
            },

            // 转账表单提交
            form_submit(e) {
                var validation = [
                    { fields: 'secret_key', msg: this.$t('giftcard-index.giftcard-index.fu3rf1') }
                ];
                if (app.globalData.fields_check(e.detail.value, validation)) {
                    uni.showLoading({
                        title: this.$t('common.processing_in_text'),
                    });
                    this.setData({
                        form_submit_loading: true
                    });
                    uni.request({
                        url: app.globalData.get_request_url('exchange', 'index', 'giftcard'),
                        method: 'POST',
                        data: e.detail.value,
                        dataType: 'json',
                        success: (res) => {
                            uni.hideLoading();
                            if (res.data.code == 0) {
                                app.globalData.showToast(res.data.msg, 'success');
                                var self = this;
                                setTimeout(function() {
                                    self.setData({
                                        form_submit_loading: false
                                    });
                                    if(app.globalData.prev_page() == null) {
                                        app.globalData.url_open('/pages/plugins/giftcard/index/index', true);
                                    } else {
                                        uni.navigateBack();
                                    }
                                }, 1500);
                            } else {
                                if (app.globalData.is_login_check(res.data, this, 'form_submit', e)) {
                                    this.setData({
                                        form_submit_loading: false
                                    });
                                    app.globalData.showToast(res.data.msg);
                                }
                            }
                        },
                        fail: () => {
                            this.setData({
                                form_submit_loading: false
                            });
                            uni.hideLoading();
                            app.globalData.showToast(this.$t('common.internet_error_tips'));
                        },
                    });
                }
            }
        }
    };
</script>
<style>
</style>