<template>
    <view>
        <scroll-view :scroll-y="true" class="scroll-box" @scrolltolower="scroll_lower" lower-threshold="30">
            <view v-if="data_list.length > 0" class="padding-main">
                <view v-for="(item, index) in data_list" :key="index" class="padding-main border-radius-main bg-white oh spacing-mb">
                    <view class="br-b-dashed oh padding-bottom-main">
                        <image class="avatar fl br bg-white round" :src="item.user.avatar" mode="widthFix" :data-index="index" @error="user_avatar_error"></image>
                        <text class="fl margin-left-sm cr-base">{{item.user.user_name_view}}</text>
                        <text class="fr cr-base">{{item.add_time_time}}</text>
                    </view>
                    <view class="cr-gray margin-top-lg">{{item.content}}</view>
                    <view v-if="(item.reply || null) != null" class="br-t margin-top-main padding-top-main">
                        <text class="bg-main cr-white padding-top-xs padding-bottom-xs padding-left padding-right round margin-right-sm">答</text>
                        <text class="cr-gray">{{item.reply}}</text>
                    </view>
                </view>
            </view>
            <view v-else>
                <!-- 提示信息 -->
                <component-no-data :prop-status="data_list_loding_status"></component-no-data>
            </view>

            <!-- 结尾 -->
            <component-bottom-line :prop-status="data_bottom_line_status"></component-bottom-line>
        </scroll-view>
    </view>
</template>
<script>
    const app = getApp();
    import componentNoData from "../../components/no-data/no-data";
    import componentBottomLine from "../../components/bottom-line/bottom-line";

    export default {
        data() {
            return {
                data_list: [],
                data_total: 0,
                data_page_total: 0,
                data_page: 1,
                data_list_loding_status: 1,
                data_bottom_line_status: false
            };
        },

        components: {
            componentNoData,
            componentBottomLine
        },
        props: {},

        onLoad() {},

        onShow() {
            this.get_data_list();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.setData({
                data_page: 1
            });
            this.get_data_list(1);
        },

        methods: {
            get_data_list(is_mandatory) {
                // 分页是否还有数据
                if ((is_mandatory || 0) == 0) {
                    if (this.data_bottom_line_status == true) {
                        return false;
                    }
                }
                
                // 加载loding
                this.setData({
                    data_list_loding_status: 1
                });
                
                // 获取数据
                uni.request({
                    url: app.globalData.get_request_url("square", "answer"),
                    method: "POST",
                    data: {
                        page: this.data_page
                    },
                    dataType: "json",
                    success: res => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            if (res.data.data.data.length > 0) {
                                if (this.data_page <= 1) {
                                    var temp_data_list = res.data.data.data;
                                } else {
                                    var temp_data_list = this.data_list;
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
                                    data_page: this.data_page + 1
                                });
                                
                                // 是否还有数据
                                this.setData({
                                    data_bottom_line_status: (this.data_page > 1 && this.data_page > this.data_page_total)
                                });
                            } else {
                                this.setData({
                                    data_list_loding_status: 0
                                });
                            }
                        } else {
                            this.setData({
                                data_list_loding_status: 0
                            });
                            if (app.globalData.is_login_check(res.data, this, 'get_data_list')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2
                        });
                        app.globalData.showToast("服务器请求出错");
                    }
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
                    data_list: temp_data_list
                });
            }
        }
    };
</script>
<style>
    @import './answer-list.css';
</style>