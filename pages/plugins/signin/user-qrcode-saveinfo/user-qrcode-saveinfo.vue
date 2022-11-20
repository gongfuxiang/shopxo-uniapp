<template>
    <view class="page-bottom-fixed">
        <view v-if="data_base != null">
            <form @submit="formSubmit" class="form-container">
                <view class="padding-main oh">
                    <view class="padding-main border-radius-main bg-white spacing-mb">
                        <view>
                            <text class="cr-base margin-right-sm">邀请人奖励</text>
                            <text class="cr-main fw-b">{{data.reward_master || data_base.reward_master}}</text>
                            <text class="cr-grey margin-left-sm">积分</text>
                        </view>
                        <view class="margin-top-sm">
                            <text class="cr-base margin-right-sm">受邀人奖励</text>
                            <text class="cr-main fw-b">{{data.reward_invitee || data_base.reward_invitee}}</text>
                            <text class="cr-grey margin-left-sm">积分</text>
                        </view>
                    </view>

                    <view v-if="(data_base.is_qrcode_must_userinfo || 0) == 1">
                        <view class="form-gorup">
                            <view class="form-gorup-title">联系人姓名<text class="form-group-tips-must">*</text></view>
                            <input type="text" name="name" placeholder-class="cr-grey" class="cr-base" placeholder="联系人姓名格式 2~30 个字符之间" maxlength="30" :value="data.name || ''">
                        </view>
                        <view class="form-gorup">
                            <view class="form-gorup-title">联系人电话<text class="form-group-tips-must">*</text></view>
                            <input type="text" name="tel" placeholder-class="cr-grey" class="cr-base" placeholder="联系人电话 6~15 个字符" maxlength="15" :value="data.tel || ''">
                        </view>
                        <view class="form-gorup">
                            <view class="form-gorup-title">联系人地址<text class="form-group-tips-must">*</text></view>
                            <input type="text" name="address" placeholder-class="cr-grey" class="cr-base" placeholder="联系人地址、最多230个字符" maxlength="230" :value="data.address || ''">
                        </view>
                    </view>
                    <view class="form-gorup">
                        <view class="form-gorup-title">备注</view>
                        <input type="text" name="note" placeholder-class="cr-grey" class="cr-base" placeholder="备注最多230个字符" maxlength="60" :value="data.note || ''">
                    </view>
                    <view class="bottom-fixed padding-main">
                        <button class="bg-main br-main cr-white round text-size" type="default" form-type="submit" hover-class="none" :loading="form_submit_loading" :disabled="form_submit_loading">提交</button>
                    </view>
                </view>
            </form>
        </view>
        <view v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import componentNoData from "../../../../components/no-data/no-data";

    export default {
        data() {
            return {
                params: null,
                form_submit_loading: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_base: null,
                data: null
            };
        },

        components: {
            componentNoData
        },
        props: {},

        onLoad(params) {
            this.setData({
                params: params
            });
            this.init();
        },
        
        onReady: function() {
            uni.setNavigationBarTitle({
                title: '签到码'+(((this.params.id || null) == null) ? '添加' : '编辑')
            });
        },

        onShow() {
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
                uni.showLoading({
                    title: '加载中...'
                });
                this.setData({
                    data_list_loding_status: 1
                });
                uni.request({
                    url: app.globalData.get_request_url("saveinfo", "userqrcode", "signin"),
                    method: 'POST',
                    data: this.params,
                    dataType: 'json',
                    success: res => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            self.setData({
                                data_base: data.base || null,
                                data: data.data || null,
                                data_list_loding_status: 0
                            });
                        } else {
                            self.setData({
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg
                            });
                            if (app.globalData.is_login_check(res.data, self, 'init')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        self.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: '服务器请求出错'
                        });
                        app.globalData.showToast('服务器请求出错');
                    }
                });
            },

            // 表单提交
            formSubmit(e) {
                var data = e.detail.value;
                if ((this.data || null) != null) {
                    data['id'] = this.data.id || 0;
                }
                
                // 数据验证
                var validation = [];
                if ((this.data_base || null) != null && (this.data_base.is_qrcode_must_userinfo || 0) == 1) {
                    validation.push({fields: 'name', msg: '请填写联系人姓名格式 2~30 个字符之间'});
                    validation.push({fields: 'tel', msg: '请填写联系人电话 6~15 个字符'});
                    validation.push({fields: 'address', msg: '请填写联系人地址、最多230个字符'});
                }
                if (app.globalData.fields_check(data, validation)) {
                    uni.showLoading({
                        title: '提交中...'
                    });
                    this.setData({
                        form_submit_loading: true
                    });
                    
                    // 网络请求
                    uni.request({
                        url: app.globalData.get_request_url("save", "userqrcode", "signin"),
                        method: 'POST',
                        data: data,
                        dataType: 'json',
                        success: res => {
                            uni.hideLoading();
                            if (res.data.code == 0) {
                                app.globalData.showToast(res.data.msg, 'success');
                                var is_temp = ((this.params || null) != null && (this.params.is_team || 0) == 1);
                                setTimeout(function() {
                                    // 是否签到也组队
                                    if (is_temp) {
                                        uni.redirectTo({
                                            url: "/pages/plugins/signin/index-detail/index-detail?id=" +res.data.data
                                        });
                                    } else {
                                        uni.navigateBack();
                                    }
                                }, 2000);
                            } else {
                                this.setData({
                                    form_submit_loading: false
                                });
                                if (app.globalData.is_login_check(res.data)) {
                                    app.globalData.showToast(res.data.msg);
                                } else {
                                    app.globalData.showToast('提交失败，请重试！');
                                }
                            }
                        },
                        fail: () => {
                            uni.hideLoading();
                            this.setData({
                                form_submit_loading: false
                            });
                            app.globalData.showToast('服务器请求出错');
                        }
                    });
                }
            }
        }
    };
</script>
<style>
</style>