<template>
    <view>
        <view v-if="data_base != null">
            <view class="padding-horizontal-main padding-top-main">
                <!-- 等级信息 -->
                <view v-if="level_list.length > 0" class="panel-item spacing-mb">
                    <view v-for="(item, index) in level_list" :key="index" class="padding-main border-radius-main bg-white spacing-mb">
                        <view class="br-b padding-bottom-main fw-b text-size">{{item.name}}</view>
                        <view class="panel-content oh padding-top-main">
                            <view class="item br-b oh padding-vertical-main">
                                <view class="title fl padding-right-main cr-gray">等级证书</view>
                                <view class="content fl br-l padding-left-main">
                                    <image :src="item.images_url" class="dis-block fl level-icon" mode="widthFix"></image>
                                </view>
                            </view>
                            <view class="item br-b oh padding-vertical-main">
                                <view class="title fl padding-right-main cr-gray">返佣比例</view>
                                <view class="content fl br-l padding-left-main">
                                    <view>一级 {{item.level_rate_one}}%</view>
                                    <view v-if="data_base.level == undefined || data_base.level > 0">二级{{item.level_rate_two}}%</view>
                                    <view v-if="data_base.level == undefined || data_base.level > 1">三级{{item.level_rate_three}}%</view>
                                </view>
                            </view>
                            <view class="item br-b oh padding-vertical-main">
                                <view class="title fl padding-right-main cr-gray">消费金额</view>
                                <view class="content fl br-l padding-left-main">{{item.rules_msg}}</view>
                            </view>
                        </view>
                    </view>
                </view>

                <!-- 等级介绍 -->
                <view v-if="(data_base.user_center_level_desc || null) != null && data_base.user_center_level_desc.length > 0" class="spacing-mb">
                    <view class="notice-content-blue">
                        <view v-for="(item, index) in data_base.user_center_level_desc" :key="index" class="item">
                            {{item}}
                        </view>
                    </view>
                </view>
            </view>

            <!-- 结尾 -->
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
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
    import componentBottomLine from "../../../../components/bottom-line/bottom-line";

    export default {
        data() {
            return {
                params: null,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_bottom_line_status: false,
                data_base: null,
                level_list: []
            };
        },

        components: {
            componentNoData,
            componentBottomLine
        },
        props: {},

        onLoad(params) {
            this.setData({
                params: params
            });
            this.init();
        },

        onShow() {
            // 显示分享菜单
            app.globalData.show_share_menu();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.init();
        },

        methods: {
            init() {
                var self = this;
                uni.showLoading({
                    title: "加载中..."
                });
                this.setData({
                    data_list_loding_status: 1
                });
                uni.request({
                    url: app.globalData.get_request_url("index", "introduce", "distribution"),
                    method: "POST",
                    data: {
                        id: this.params.id
                    },
                    dataType: "json",
                    success: res => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            var data_base = data.base || null;
                            var level_list = (data.level_list || null) != null && data.level_list.length > 0 ? data.level_list : [];
                            self.setData({
                                data_base: data_base,
                                level_list: level_list,
                                data_list_loding_status: data_base == null || level_list.length <= 0 ? 0 : 3,
                                data_bottom_line_status: true,
                                data_list_loding_msg: ''
                            });
                        } else {
                            self.setData({
                                data_list_loding_status: 2,
                                data_bottom_line_status: false,
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
                            data_bottom_line_status: false,
                            data_list_loding_msg: '服务器请求出错'
                        });
                        app.globalData.showToast("服务器请求出错");
                    }
                });
            }
        }
    };
</script>
<style>
    @import './introduce.css';
</style>