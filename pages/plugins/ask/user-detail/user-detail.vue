<template>
    <view :class="theme_view">
        <block v-if="data_list_loding_status != 1 && data.length != 0">
            <component-panel-content :propData="data" :propDataField="field_list" propExcludeField="content" propTitle="详情"></component-panel-content>

            <component-panel-content propTitle="提问内容">
                <view class="item br-b-f5 oh padding-vertical-main">
                    <mp-html :content="data.content"></mp-html>
                </view>
            </component-panel-content>

            <component-panel-content propTitle="回复内容">
                <view class="item br-b-f5 oh padding-vertical-main">
                    <mp-html :content="data.reply"></mp-html>
                </view>
            </component-panel-content>
        </block>
        <view v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status"></component-no-data>
        </view>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNavBack from '@/components/nav-back/nav-back';
    import componentNoData from '@/components/no-data/no-data';
    import componentPanelContent from '@/components/panel-content/panel-content';

    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                ask_static_url: app.globalData.get_static_url('ask', true),
                data: {},
                field_list: [],
                data_list_loding_status: 1,
                params: '',
            };
        },

        components: {
            componentCommon,
            componentNavBack,
            componentNoData,
            componentPanelContent,
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            if (params) {
                this.setData({
                    params: params,
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
            this.init();
        },

        methods: {
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    this.get_data();
                } else {
                    this.setData({
                        data_list_loding_status: 0,
                        data_bottom_line_status: false,
                    });
                }
            },

            get_data() {
                // 获取数据
                uni.request({
                    url: app.globalData.get_request_url('detail', 'ask', 'ask'),
                    method: 'POST',
                    data: this.params,
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            this.setData({
                                data: res.data.data.data || [],
                                field_list: res.data.data.field_list || [],
                                data_list_loding_status: 3,
                            });
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                            });
                            if (app.globalData.is_login_check(res.data, this, 'get_data')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 顶部返回操作
            top_nav_left_back_event(e) {
                app.globalData.page_back_prev_event();
            },

            // 页面滚动监听
            onPageScroll(res) {
                uni.$emit('onPageScroll', res);
            },
        },
    };
</script>
<style>
</style>
