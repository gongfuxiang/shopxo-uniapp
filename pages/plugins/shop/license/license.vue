<template>
    <view :class="theme_view">
        <block v-if="(data || null) != null">
            <!-- 主体信息 -->
            <view class="padding-main">
                <view class="fw-b text-size margin-top-xxl">{{ data.title }}</view>
                <view class="text-size-xs cr-grey margin-top-sm">{{ data.sub_title }}</view>
                <view class="br padding-main margin-top-lg bg-white border-radius-main">
                    <image :src="data.images" class="wh-auto border-radius-main dis-block" mode="aspectFill" :data-value="data.images" @tap="image_show_event"></image>
                </view>
                <view v-if="(data.tips || null) != null && data.tips.length > 0" class="cr-grey margin-top-lg text-size-xs">
                    <block v-for="(item, index) in data.tips" :key="index">
                        <view class="margin-top-sm">{{ item }}</view>
                    </block>
                </view>
            </view>

            <!-- 结尾 -->
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
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
    import componentNoData from "@/components/no-data/no-data";
    import componentBottomLine from "@/components/bottom-line/bottom-line";
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                data_bottom_line_status: false,
                data_list_loding_status: 1,
                data_list_loding_msg: "",
                params: null,
                data: null,
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
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 加载数据
            this.get_data();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.get_data();
        },

        methods: {
            // 获取数据
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url("index", "license", "shop"),
                    method: "POST",
                    data: {
                        id: this.params.id || 0,
                    },
                    dataType: "json",
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
                                data: res.data.data || null,
                                layout_data: data.layout_data || [],
                                data_list_loding_msg: "",
                                data_list_loding_status: 0,
                                data_bottom_line_status: true,
                            });
                        } else {
                            this.setData({
                                data_bottom_line_status: false,
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg,
                            });
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_bottom_line_status: false,
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 图片预览
            image_show_event(e) {
                app.globalData.image_show_event(e);
            },
        },
    };
</script>
<style></style>
