<template>
    <view :class="theme_view">
        <view v-if="data_base != null">
            <view class="padding-horizontal-main padding-top-main">
                <!-- 等级信息 -->
                <view v-if="level_list.length > 0" class="panel-item spacing-mb">
                    <view v-for="(item, index) in level_list" :key="index" class="padding-main border-radius-main bg-white spacing-mb">
                        <view class="br-b padding-bottom-main fw-b text-size">{{ item.name }}</view>
                        <view class="panel-content oh padding-top-main">
                            <view class="item br-b oh padding-vertical-main">
                                <view class="title fl padding-right-main cr-grey">{{$t('introduce.introduce.017d67')}}</view>
                                <view class="content fl br-l padding-left-main">
                                    <image :src="item.images_url" class="dis-block fl level-icon" mode="widthFix"></image>
                                </view>
                            </view>
                            <view class="item br-b oh padding-vertical-main">
                                <view class="title fl padding-right-main cr-grey">{{$t('introduce.introduce.el4ib2')}}</view>
                                <view class="content fl br-l padding-left-main">
                                    <view>{{$t('introduce.introduce.syf66q')}}{{ item.level_rate_one }}%</view>
                                    <view v-if="data_base.level == undefined || data_base.level > 0">{{$t('introduce.introduce.q4t9kl')}}{{ item.level_rate_two }}%</view>
                                    <view v-if="data_base.level == undefined || data_base.level > 1">{{$t('introduce.introduce.e5os6e')}}{{ item.level_rate_three }}%</view>
                                </view>
                            </view>
                            <view class="item br-b oh padding-vertical-main">
                                <view class="title fl padding-right-main cr-grey">{{$t('introduce.introduce.d7kle4')}}</view>
                                <view class="content fl br-l padding-left-main">
                                    <block v-if="(item.rules_msg_list || null) != null">
                                        <view>{{ item.rules_msg_list.name }}</view>
                                        <view class="padding-left-xxl">
                                            <block v-if="(item.rules_msg_list.data || null) != null && item.rules_msg_list.data.length > 0">
                                                <block v-for="(rv, ri) in item.rules_msg_list.data" :key="ri">
                                                    <view>
                                                        <text>{{ rv.name }}</text>
                                                        <text class="fr fw-b">{{ rv.value }}</text>
                                                    </view>
                                                </block>
                                            </block>
                                            <block v-else>
                                                <view class="cr-grey">{{$t('introduce.introduce.5t5vzi')}}</view>
                                            </block>
                                        </view>
                                    </block>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>

                <!-- 等级介绍 -->
                <view v-if="(data_base.user_center_level_desc || null) != null && data_base.user_center_level_desc.length > 0" class="spacing-mb">
                    <view class="notice-content-blue">
                        <view v-for="(item, index) in data_base.user_center_level_desc" :key="index" class="item">
                            {{ item }}
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

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from "@/components/no-data/no-data";
    import componentBottomLine from "@/components/bottom-line/bottom-line";

    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                params: null,
                data_list_loding_status: 1,
                data_list_loding_msg: "",
                data_bottom_line_status: false,
                data_base: null,
                level_list: [],
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            this.setData({
                params: params,
            });
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
                this.setData({
                    data_list_loding_status: 1,
                });
                uni.request({
                    url: app.globalData.get_request_url("index", "introduce", "distribution"),
                    method: "POST",
                    data: {
                        id: this.params.id,
                    },
                    dataType: "json",
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            var data_base = data.base || null;
                            var level_list = (data.level_list || null) != null && data.level_list.length > 0 ? data.level_list : [];
                            this.setData({
                                data_base: data_base,
                                level_list: level_list,
                                data_list_loding_status: data_base == null || level_list.length <= 0 ? 0 : 3,
                                data_bottom_line_status: true,
                                data_list_loding_msg: "",
                            });
                        } else {
                            this.setData({
                                data_list_loding_status: 2,
                                data_bottom_line_status: false,
                                data_list_loding_msg: res.data.msg,
                            });
                            if (app.globalData.is_login_check(res.data, this, "init")) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_bottom_line_status: false,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },
        },
    };
</script>
<style>
    @import "./introduce.css";
</style>
