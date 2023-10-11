<template>
    <view>
        <scroll-view :scroll-y="true" class="scroll-box" lower-threshold="60">
            <view class="data-list">
                <view v-if="data_list.length > 0" class="data-list padding-horizontal-main padding-top-main">
                    <view v-for="(item, index) in data_list" :key="index" class="item padding-main border-radius-main oh bg-white spacing-mb">
                        <view class="base oh br-b-dashed padding-bottom-main flex-row jc-sb align-c">
                            <text class="cr-grey-9">{{ item.add_time }}</text>
                            <text>{{ item.is_enable_name }}</text>
                        </view>
                        <view class="content margin-top">
                            <navigator :url="'/pages/plugins/signin/user-qrcode-detail/user-qrcode-detail?id=' + item.id" hover-class="none">
                                <block v-for="(fv, fi) in content_list" :key="fi">
                                    <view class="single-text margin-top-xs">
                                        <text class="cr-grey-9 margin-right-xl">{{ fv.name }}:</text>
                                        <text class="fw-b">{{ item[fv.field] }}</text>
                                        <text v-if="(fv.unit || null) != null" class="fw-b">{{ fv.unit }}</text>
                                    </view>
                                </block>
                            </navigator>
                        </view>
                        <view class="item-operation tr margin-top-main">
                            <button class="round bg-white br-grey-9 text-size-md" type="default" size="mini" hover-class="none" :data-value="item.id" @tap="show_event">签到</button>
                            <button v-if="(data_base.is_team_show_coming_user || 0) == 1" class="round bg-white cr-main br-main text-size-md" type="default" size="mini" hover-class="none" :data-value="item.id" @tap="coming_event">用户</button>
                            <button class="round bg-white cr-main br-main text-size-md" type="default" size="mini" hover-class="none" :data-value="item.id" @tap="edit_event">编辑</button>
                        </view>
                    </view>
                </view>
                <view v-else>
                    <!-- 提示信息 -->
                    <component-no-data :propStatus="data_list_loding_status"></component-no-data>
                    <!-- 组队 -->
                    <view v-if="(data_base || null) != null && (data_base.is_team || 0) == 1" class="bottom-fixed user-team-container">
                        <button class="cr-white bg-green br-green text-size auto round" type="default" hover-class="none" @tap="team_event">组队签到</button>
                    </view>
                </view>
                <!-- 结尾 -->
                <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
            </view>
        </scroll-view>
    </view>
</template>
<script>
    const app = getApp();
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';

    export default {
        props: {
            propPullDownRefresh: {
                type: Boolean,
                default: false,
            },
            propScrollLower: {
                type: Boolean,
                default: false,
            },
        },
        data() {
            return {
                data_list_loding_status: 1,
                data_bottom_line_status: false,
                data_is_loading: 0,
                data_base: null,
                data_list: [],
                data_total: 0,
                data_page_total: 0,
                data_page: 1,
                content_list: [
                    { name: '邀请人奖励', field: 'reward_master', unit: '积分' },
                    { name: '受邀人奖励', field: 'reward_invitee', unit: '积分' },
                ],
            };
        },

        components: {
            componentNoData,
            componentBottomLine,
        },
        created() {
            this.init();
        },
        mounted() {
            // 分享菜单处理
            app.globalData.page_share_handle();
        },
        watch: {
            propPullDownRefresh(newVal, oldVal) {
                if (newVal !== oldVal) {
                    this.setData({
                        data_page: 1,
                    });
                    this.get_data_list(1);
                }
            },
            propScrollLower(newVal, oldVal) {
                if (newVal !== oldVal) {
                    this.get_data_list();
                }
            },
        },

        methods: {
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    // 用户未绑定用户则转到登录页面
                    if (app.globalData.user_is_need_login(user)) {
                        uni.redirectTo({
                            url: '/pages/login/login?event_callback=init',
                        });
                        return false;
                    } else {
                        // 获取数据
                        this.get_data_list();
                    }
                } else {
                    this.setData({
                        data_list_loding_status: 0,
                        data_bottom_line_status: false,
                    });
                }
            },

            // 获取数据
            get_data_list(is_mandatory) {
                // 分页是否还有数据
                if ((is_mandatory || 0) == 0) {
                    if (this.data_bottom_line_status == true) {
                        uni.stopPullDownRefresh();
                        return false;
                    }
                }

                // 是否加载中
                if (this.data_is_loading == 1) {
                    return false;
                }
                this.setData({
                    data_is_loading: 1,
                    data_list_loding_status: 1,
                });

                // 加载loding
                uni.showLoading({
                    title: '加载中...',
                });

                // 获取数据
                uni.request({
                    url: app.globalData.get_request_url('index', 'userqrcode', 'signin'),
                    method: 'POST',
                    data: {
                        page: this.data_page,
                    },
                    dataType: 'json',
                    success: (res) => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            if (res.data.data.data.length > 0) {
                                if (this.data_page <= 1) {
                                    var temp_data_list = res.data.data.data;
                                } else {
                                    var temp_data_list = this.data_list || [];
                                    var temp_data = res.data.data.data;
                                    for (var i in temp_data) {
                                        temp_data_list.push(temp_data[i]);
                                    }
                                }
                                this.setData({
                                    data_base: res.data.data.base || null,
                                    data_list: temp_data_list,
                                    data_total: res.data.data.total,
                                    data_page_total: res.data.data.page_total,
                                    data_list_loding_status: 3,
                                    data_page: this.data_page + 1,
                                    data_is_loading: 0,
                                });

                                // 是否还有数据
                                this.setData({
                                    data_bottom_line_status: this.data_page > 1 && this.data_page > this.data_page_total,
                                });
                            } else {
                                this.setData({
                                    data_base: res.data.data.base || null,
                                    data_list_loding_status: 0,
                                    data_list: [],
                                    data_bottom_line_status: false,
                                    data_is_loading: 0,
                                });
                            }
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                                data_is_loading: 0,
                            });
                            if (app.globalData.is_login_check(res.data, this, 'get_data_list')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_is_loading: 0,
                        });
                        app.globalData.showToast('服务器请求出错');
                    },
                });
            },
            // 查看详情
            show_event(e) {
                var value = e.currentTarget.dataset.value;
                uni.navigateTo({
                    url: '/pages/plugins/signin/index-detail/index-detail?id=' + value,
                });
            },

            // 签到用户
            coming_event(e) {
                var value = e.currentTarget.dataset.value;
                uni.navigateTo({
                    url: '/pages/plugins/signin/user-coming-list/user-coming-list?id=' + value,
                });
            },

            // 编辑
            edit_event(e) {
                var value = e.currentTarget.dataset.value;
                uni.navigateTo({
                    url: '/pages/plugins/signin/user-qrcode-saveinfo/user-qrcode-saveinfo?id=' + value,
                });
            },

            // 组队签到
            team_event(e) {
                uni.navigateTo({
                    url: '/pages/plugins/signin/user-qrcode-saveinfo/user-qrcode-saveinfo',
                });
            },
        },
    };
</script>
<style scoped>
    .scroll-box {
        height: calc(calc(100vh - 144rpx - env(safe-area-inset-bottom) + 40rpx));
        /* #ifdef H5 */
        height: calc(100vh - 144rpx);
        /* #endif */
    }
    .user-team-container button {
        height: 88rpx;
        line-height: 88rpx;
    }
</style>
