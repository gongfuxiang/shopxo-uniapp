<template>
    <view :class="theme_view">
        <!-- 多个包括导航 -->
        <scroll-view v-if="(express_data || null) != null && express_data.length > 1" class="scroll-view-horizontal bg-white oh" scroll-x="true">
            <block v-for="(item, index) in express_data" :key="index">
                <view :class="'item cr-grey dis-inline-block padding-horizontal-main padding-top-main padding-bottom-sm ' + (item.is_active == 1 ? 'cr-main nav-active-line bg-main-befor fw-b' : '')" @tap="nav_event" :data-index="index">{{ item.show_name }}</view>
            </block>
        </scroll-view>

        <!-- 物流信息 -->
        <view v-if="(express_info || null) != null" class="padding-horizontal-main padding-top-main">
            <view class="padding-main border-radius-main bg-white oh spacing-mb">
                <image class="express-icon fl radius" :src="express_info.icon" mode="aspectFill"></image>
                <view class="fl margin-left-lg">
                    <view class="cr-base fw-b">{{ express_info.name }}</view>
                    <view class="cr-base margin-top-sm" data-event="copy" :data-value="express_info.number" @tap="text_event">{{ express_info.number }}</view>
                </view>
            </view>
            <view v-if="(express_info.note || null) != null" class="cr-red spacing-mt">{{ express_info.note }}</view>
            <view v-if="(express_info.msg || null) != null" class="cr-blue spacing-mt">{{ express_info.msg }}</view>
            <view v-if="(express_info.data || null) != null && express_info.data.length > 0" class="express-data margin-top-xl">
                <block v-for="(item, index) in express_info.data" :key="index">
                    <view :class="'item padding-main border-radius-main bg-white margin-left-sm br-b br-l br-r pr ' + (index == 0 ? 'br-t' : '')">
                        <view :class="'i pa round ' + (index == 0 ? 'bg-green' : 'bg-grey')"></view>
                        <view :class="'cr-base ' + (index == 0 ? 'fw-b' : '')">{{ item.desc }}</view>
                        <view class="cr-grey margin-top-sm">{{ item.time }}</view>
                    </view>
                </block>
            </view>
        </view>

        <!-- 提示信息 -->
        <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>

        <!-- 结尾 -->
        <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>

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
                data_list_loding_status: 1,
                data_list_loding_msg: "",
                data_bottom_line_status: false,
                params: null,
                express_info: null,
                express_data: [],
                data_status: false,
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
                params: app.globalData.launch_params_handle(params),
            });
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 数据加载
            this.get_data();

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
        },

        methods: {
            // 初始化
            get_data() {
                if (!this.data_status) {
                    this.setData({
                        data_list_loding_status: 1,
                        data_list_loding_msg: "",
                    });
                }
                uni.request({
                    url: app.globalData.get_request_url("index", "index", "express"),
                    method: "POST",
                    data: this.params,
                    dataType: "json",
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            var express_info = data.express_info || null;
                            var status = express_info != null && ((express_info.msg || null) != null || ((express_info.data || null) != null && express_info.data.length > 0));
                            this.setData({
                                data_bottom_line_status: status,
                                data_list_loding_status: status ? 3 : 0,
                                data_list_loding_msg: status ? "" : this.$t('detail.detail.j5owf1'),
                                data_status: status,
                                express_info: express_info,
                                express_data: data.express_data || [],
                            });
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                                data_list_loding_msg: res.data.msg,
                            });
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 导航事件
            nav_event(e) {
                var temp = this.params;
                temp['eid'] = e.currentTarget.dataset.index;
                this.setData({
                    params: temp
                });
                this.get_data();
            },

            // 文本事件
            text_event(e) {
                app.globalData.text_event_handle(e);
            }
        },
    };
</script>
<style>
    @import "./detail.css";
</style>
