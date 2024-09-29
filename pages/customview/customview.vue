<template>
    <view :class="theme_view">
        <view v-if="(data || null) != null">
            <!-- 搜索 -->
            <block v-if="(data.is_header || 0) == 1">
                <!-- 搜索框 -->
                <view class="padding-main bg-white">
                    <component-search propClass="br" :propPlaceholder="$t('customview.customview.726k7y')"></component-search>
                </view>
            </block>

            <!-- 内容 -->
            <mp-html :content="data.html_content" />

            <!-- 结尾 -->
            <block v-if="(data.is_footer || 0) == 1">
                <!-- 结尾 -->
                <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
            </block>
        </view>
        <view v-else>
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </view>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentSearch from "@/components/search/search";
    import componentNoData from "@/components/no-data/no-data";
    import componentBottomLine from "@/components/bottom-line/bottom-line";
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                data_bottom_line_status: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                params: {},
                data: null,
                // 自定义分享信息
                share_info: {}
            };
        },

        components: {
            componentCommon,
            componentSearch,
            componentNoData,
            componentBottomLine
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
                    url: app.globalData.get_request_url("index", "customview"),
                    method: 'POST',
                    data: this.params,
                    dataType: 'json',
                    success: res => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
                                data: data.data || null,
                                data_list_loding_msg: '',
                                data_list_loding_status: 0,
                                data_bottom_line_status: true
                            });

                            if ((this.data || null) != null) {
                                // 基础自定义分享
                                this.setData({
                                    share_info: {
                                        title: this.data.seo_title || this.data.name,
                                        desc: this.data.seo_desc,
                                        path: '/pages/customview/customview',
                                        query: 'id='+this.data.id,
                                        img: this.data.logo
                                    }
                                });

                                // 标题名称
                                uni.setNavigationBarTitle({
                                    title: this.data.name
                                });
                            }

                            // 分享菜单处理
                            app.globalData.page_share_handle(this.share_info);
                        } else {
                            this.setData({
                                data_bottom_line_status: false,
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg
                            });
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_bottom_line_status: false,
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips')
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    }
                });
            }
        }
    };
</script>
<style>
</style>