<template>
    <view>
        <view class="" :style="'padding-top:' + (status_bar_height > 0 ? status_bar_height + 5 : 10) + 'px;'">
            <!-- 返回 -->
            <!-- #ifdef MP-WEIXIN || MP-QQ || MP-KUAISHOU || H5 || APP -->
            <view v-if="is_realstore_top_nav_back == 1" class="nav-back padding-horizontal-main padding-top-sm round va-m pr top-sm" @tap="top_nav_left_back_event">
                <iconfont name="icon-tongyong-fanhui" size="32rpx"></iconfont>
            </view>
            <view>
                <!-- #ifdef H5 -->
                <component-search @onsearch="search_button_event" :propIsRequired="false" propIconColor="#333" propPlaceholderClass="cr-grey-c" propPlaceholder="搜索..." propBgColor="#f6f6f6"></component-search>
                <!-- #endif -->
            </view>
        </view>
        <scroll-view :scroll-y="true" class="scroll-box" @scrolltolower="scroll_lower" lower-threshold="60">
            <view v-if="data_list.length > 0" class="padding-horizontal-main padding-top-main">
                <view v-for="(item, index) in data_list" :key="index" class="padding-main border-radius-main bg-white oh spacing-mb">
                    <view class="br-b-dashed oh padding-bottom-main">
                        <image class="avatar fl br bg-white round" :src="item.user.avatar" mode="widthFix" :data-index="index" @error="user_avatar_error"></image>
                        <text class="fl margin-left-sm cr-base">{{ item.user.user_name_view }}</text>
                        <text class="fr cr-base">{{ item.add_time_time }}</text>
                    </view>
                    <view class="cr-grey margin-top-lg">{{ item.content }}</view>
                    <view v-if="(item.reply || null) != null" class="br-t margin-top-main padding-top-main">
                        <text class="bg-main cr-white padding-top-xs padding-bottom-xs padding-left padding-right round margin-right-sm">答</text>
                        <text class="cr-grey">{{ item.reply }}</text>
                    </view>
                </view>
            </view>
            <view v-else>
                <!-- 提示信息 -->
                <component-no-data :propStatus="data_list_loding_status"></component-no-data>
            </view>

            <!-- 结尾 -->
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
        </scroll-view>
    </view>
</template>
<script>
    const app = getApp();
    import componentNoData from '../../components/no-data/no-data';
    import componentBottomLine from '../../components/bottom-line/bottom-line';
    import componentSearch from '@/components/search/search';

    export default {
        data() {
            return {
                status_bar_height: parseInt(app.globalData.get_system_info('statusBarHeight', 0)),
                // 顶部导航返回按钮
                is_realstore_top_nav_back: app.globalData.data.is_realstore_top_nav_back || 0,
                data_list: [],
                data_total: 0,
                data_page_total: 0,
                data_page: 1,
                data_list_loding_status: 1,
                data_bottom_line_status: false,
                data_is_loading: 0,
            };
        },

        components: {
            componentNoData,
            componentBottomLine,
            componentSearch,
        },
        props: {},

        onLoad() {},

        onShow() {
            this.get_data_list();

            // 分享菜单处理
            app.globalData.page_share_handle();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.setData({
                data_page: 1,
            });
            this.get_data_list(1);
        },

        methods: {
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

                // 获取数据
                uni.request({
                    url: app.globalData.get_request_url('index', 'index', 'answer'),
                    method: 'POST',
                    data: {
                        page: this.data_page,
                    },
                    dataType: 'json',
                    success: (res) => {
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
                                    data_list_loding_status: 0,
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
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_is_loading: 0,
                        });
                        app.globalData.showToast('服务器请求出错');
                    },
                });
            },

            // 滚动加载
            scroll_lower(e) {
                this.get_data_list();
            },

            // 头像加载错误
            user_avatar_error(e) {
                var index = e.currentTarget.dataset.index || 0;
                var temp_data_list = this.data_list;
                for (var i in temp_data_list) {
                    if (i == index) {
                        temp_data_list[i]['user']['avatar'] = app.globalData.data.default_user_head_src;
                        break;
                    }
                }
                this.setData({
                    data_list: temp_data_list,
                });
            },
            search_button_event() {},
        },
    };
</script>
<style>
    @import './answer-list.css';
</style>
