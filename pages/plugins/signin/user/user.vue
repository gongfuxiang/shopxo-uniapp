<template>
    <view :class="theme_view">
        <block v-if="(data_base || null) != null">
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
                    <component-user-signin :propPullDownRefresh="propPullDownRefresh" :propScrollLower="scroll_lower_bool"></component-user-signin>
                </view>
                <view v-if="current === 1">
                    <component-user-qrcode :propPullDownRefresh="propPullDownRefresh" :propScrollLower="scroll_lower_bool"></component-user-qrcode>
                </view>
            </view>
        </block>
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
    import componentUserSignin from '../components/user-signin/user-signin';
    import componentUserQrcode from '../components/user-qrcode/user-qrcode';

    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
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
            componentCommon,
            componentNoData,
            componentUserSignin,
            componentUserQrcode,
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 是否指定状态
            if ((params.type || null) != null) {
                this.setData({
                    params: params,
                    current: Number(params.type),
                });
            }
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
            this.setData({
                propPullDownRefresh: !this.propPullDownRefresh,
            });
        },

        methods: {
            init(e) {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    this.get_data();
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
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                    },
                });
            },
            // 明细导航切换
            nav_change(e) {
                this.setData({
                    current: e.currentTarget.dataset.index || 0,
                });
                app.globalData.update_query_string_parameter([{ key: 'type', value: e.currentTarget.dataset.index }]);
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
