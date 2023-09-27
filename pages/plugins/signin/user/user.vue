<template>
    <view>
        <view v-if="(data_base || null) != null">
            <!-- 公告 -->
            <view v-if="(data_base.signin_desc || null) != null && data_base.signin_desc.length > 0" class="padding-horizontal-main padding-vertical-sm bg-white">
                <uni-notice-bar class="padding-0 margin-0" show-icon scrollable :text="data_base.signin_desc.join('')" background-color="transparent" color="#666" />
            </view>
            <!-- 导航 -->
            <view v-if="nav_list.length > 0" class="nav oh bg-white">
                <view class="flex-row jc-sa align-c">
                    <block v-for="(item, index) in nav_list" :key="index">
                        <view class="item text-size-md" :data-index="index" @tap="nav_change">
                            <view class="pr" :class="current === index ? 'cr-main nav-active-line fw-b' : ''">
                                {{ item.title }}
                            </view>
                        </view>
                    </block>
                </view>
            </view>
            <!-- 明细 -->
            <view class="nav-detail margin-bottom-lg">
                <view v-if="current === 0">
                    <component-user-signin :prop-pull-down-refresh="propPullDownRefresh" :prop-scroll-lower="scroll_lower_bool"></component-user-signin>
                </view>
                <view v-if="current === 1">
                    <component-user-qrcode :prop-pull-down-refresh="propPullDownRefresh" :prop-scroll-lower="scroll_lower_bool"></component-user-qrcode>
                </view>
            </view>
        </view>
        <view v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import componentNoData from '@/components/no-data/no-data';
    import componentUserSignin from '@/components/signin/user-signin/user-signin';
    import componentUserQrcode from '@/components/signin/user-qrcode/user-qrcode';

    export default {
        data() {
            return {
                data_bottom_line_status: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_base: null,
                nav_list: [],
                // 钱包明细
                params: null,
                current: 0,
                propPullDownRefresh: false,
                scroll_lower_bool: false,
            };
        },

        components: {
            componentNoData,
            componentUserSignin,
            componentUserQrcode,
        },
        props: {},

        onLoad(params) {
            // 是否指定状态
            if ((params.type || null) != null) {
                this.setData({
                    params: params,
                    current: Number(params.type),
                });
            }
            this.init();
        },

        onShow() {
            this.init();

            // 分享菜单处理
            app.globalData.page_share_handle();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.get_data();
            this.setData({
                propPullDownRefresh: !this.propPullDownRefresh,
            });
        },

        methods: {
            init(e) {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    // 用户未绑定用户则转到登录页面
                    if (app.globalData.user_is_need_login(user)) {
                        uni.showModal({
                            title: '温馨提示',
                            content: '绑定手机号码',
                            confirmText: '确认',
                            cancelText: '暂不',
                            success: (result) => {
                                uni.stopPullDownRefresh();
                                if (result.confirm) {
                                    uni.navigateTo({
                                        url: '/pages/login/login?event_callback=init',
                                    });
                                }
                            },
                        });
                    } else {
                        this.get_data();
                    }
                }
            },

            // 获取数据
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url('center', 'user', 'signin'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
                                data_base: data.base || null,
                                nav_list: data.nav_list || [],
                                data_list_loding_msg: '',
                                data_list_loding_status: 0,
                                data_bottom_line_status: false,
                            });
                        } else {
                            this.setData({
                                data_bottom_line_status: false,
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
                            data_bottom_line_status: false,
                            data_list_loding_status: 2,
                            data_list_loding_msg: '服务器请求出错',
                        });
                        app.globalData.showToast('服务器请求出错');
                    },
                });
            },
            // 明细导航切换
            nav_change(e) {
                this.setData({
                    current: e.currentTarget.dataset.index || 0,
                });
                app.globalData.updateQueryStringParameter([{ key: 'type', value: e.currentTarget.dataset.index }]);
            },
            // 滚动加载
            scroll_lower(e) {
                this.setData({
                    scroll_lower_bool: !this.scroll_lower_bool,
                });
            },
        },
    };
</script>
<style scoped>
    @import './user.css';
</style>
