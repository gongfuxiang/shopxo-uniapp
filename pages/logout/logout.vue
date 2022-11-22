<template>
    <view class="scroll-box bg-white">
        <view class="page-bottom-fixed">
            <block v-if="data_list_loding_status == 3">
                <view class="padding-main">
                    <view class="">
                        <mp-html :content="agreement_data.value" />
                    </view>
                    <view class="bottom-fixed padding-main oh bg-white">
                        <button class="bg-gray br-gray cr-base round text-size fl" type="default" size="mini" hover-class="none" @tap="logout_submit_event">确认注销</button>
                        <button class="bg-main br-main cr-white round text-size fr" type="default" size="mini" hover-class="none" @tap="logout_cancel_event">取消</button>
                    </view>
                </view>
            </block>

            <!-- 错误提示 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import componentNoData from "../../components/no-data/no-data";

    export default {
        data() {
            return {
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                agreement_data: {}
            }
        },

        components: {
            componentNoData
        },

        onShow() {
            // 数据加载
            this.init();
        },

        methods: {
            // 获取数据
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    // 用户未绑定用户则转到登录页面
                    if (app.globalData.user_is_need_login(user)) {
                        uni.redirectTo({
                            url: "/pages/login/login?event_callback=init"
                        });
                        this.setData({
                            data_list_loding_status: 0,
                            data_list_loding_msg: '请先绑定手机'
                        });
                        return false;
                    } else {
                        this.get_data();
                    }
                } else {
                    this.setData({
                        data_list_loding_status: 0,
                        data_list_loding_msg: '请先登录'
                    });
                }
            },

            // 获取数据
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url("index", "agreement"),
                    method: 'POST',
                    data: {document: 'userlogout'},
                    dataType: 'json',
                    success: res => {
                        if(res.data.code == 0) {
                            this.setData({
                                data_list_loding_status: 3,
                                agreement_data: res.data.data || {}
                            });
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                                data_list_loding_msg: res.msg
                            });
                        }
                    },
                    fail: () => {
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: '服务器请求出错'
                        });
                        app.globalData.showToast('服务器请求出错');
                    }
                });
            },

            // 注销提交
            logout_submit_event(e) {
                // 是否再次确认
                if(e != 0 && e != 1) {
                    app.globalData.alert({
                        msg: '账号注销后不可恢复、确定继续吗？',
                        is_show_cancel: 1,
                        object: this,
                        method: 'logout_submit_event'
                    });
                    return false;
                }

                // 注销提交
                if(e == 1) {
                    uni.showLoading({
                        title: '处理中...'
                    });
                    uni.request({
                        url: app.globalData.get_request_url('logout', 'safety'),
                        method: 'POST',
                        data: {},
                        dataType: 'json',
                        success: res => {
                            uni.hideLoading();
                            if(res.data.code == 0) {
                                app.globalData.remove_user_cache_event();
                                app.globalData.showToast(res.data.msg, 'success');
                                setTimeout(function() {
                                    uni.switchTab({url: app.globalData.data.tabbar_pages[0]});
                                }, 1500);
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
                        }
                    });
                }
            },

            // 取消返回
            logout_cancel_event() {
                app.globalData.page_back_prev_event();
            }
        }
    }
</script>
<style>
    @import './logout.css';
</style>