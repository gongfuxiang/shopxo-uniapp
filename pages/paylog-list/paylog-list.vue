<template>
    <view :class="theme_view">
        <block v-if="data_list.length > 0">
            <!-- 列表 -->
            <view class="padding-main">
                <view class="bg-white border-radius-main">
                    <block v-for="(item, index) in data_list" :key="index">
                        <view :class="index > 0 ? 'br-t-f5' : ''" class="padding-horizontal-main padding-vertical-xxl pr" :data-value="item.url" @tap="url_event">
                            <text>{{item.name}}</text>
                            <view class="pa margin-top-xxl margin-right-main top-0 right-0">
                                <iconfont name="icon-arrow-right" propClass="iconfont" color="#ccc"></iconfont>
                            </view>
                        </view>
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
                params: null,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_bottom_line_status: false,
                data_list: []
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentBottomLine
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
                    url: app.globalData.get_request_url("index", "paylog"),
                    method: "POST",
                    data: this.params,
                    dataType: "json",
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        var data = res.data.data || [];
                        if (res.data.code == 0) {
                            if(data.length == 1) {
                                setTimeout(function() {
                                    app.globalData.url_open(data[0]['url'], true);
                                }, 500);
                            } else {
                                this.setData({
                                    data_list: data,
                                    data_list_loding_status: data.length == 0 ? 0 : 3,
                                    data_bottom_line_status: data.length == 0 ? false : true,
                                    data_list_loding_msg: "",
                                });
                            }
                        } else {
                            this.setData({
                                data_list_loding_status: 2,
                                data_bottom_line_status: false,
                                data_list_loding_msg: res.data.msg,
                            });
                            app.globalData.is_login_check(res.data, this, "init");
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_bottom_line_status: false,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                    },
                });
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            }
        },
    };
</script>