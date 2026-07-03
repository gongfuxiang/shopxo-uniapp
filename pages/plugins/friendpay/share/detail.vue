<template>
    <view :class="theme_view">
        <block v-if="detail != null">
            <view v-if="(detail.status_name || null) != null" class="padding-horizontal-main padding-top-main">
                <view class="padding-main border-radius-main bg-white tc">
                    <view :class="'text-size-lg fw-b ' + (detail.status == 1 ? 'cr-green' : (detail.status == 3 ? 'cr-red' : (detail.status == 2 ? 'cr-grey' : 'cr-main')))">{{ detail.status_name }}</view>
                </view>
            </view>
            <component-panel-content
                :propTitle="$t('common.detail_text')"
                :propData="detail"
                :propDataField="field_list"
                propExcludeField="status_name"
            ></component-panel-content>
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
        </block>
        <block v-else>
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </block>
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    import componentPanelContent from '@/components/panel-content/panel-content';

    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                params: null,
                list_type: 'owner',
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_bottom_line_status: false,
                field_list: [],
                detail: null,
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
            componentPanelContent,
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 参数处理
            params = app.globalData.launch_params_handle(params);
            this.setData({
                params: params,
                list_type: (params.type || null) == 'payer' ? 'payer' : 'owner',
            });

            // 初始化
            this.init();
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 页面标题
            uni.setNavigationBarTitle({ title: this.$t('common.detail_text') });

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
            // 初始化
            init() {
                this.setData({
                    data_list_loding_status: 1,
                });
                uni.request({
                    url: app.globalData.get_request_url('detail', 'share', 'friendpay'),
                    method: 'POST',
                    data: {
                        id: this.params.id,
                        type: this.list_type,
                    },
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data || {};
                            var row = data.data || null;
                            this.setData({
                                detail: row,
                                field_list: data.field_list || [],
                                data_list_loding_status: row != null ? 3 : 0,
                                data_bottom_line_status: row != null,
                                data_list_loding_msg: '',
                            });
                        } else {
                            if (res.data.code == -400) {
                                app.globalData.is_login_check(res.data, this, 'init');
                                return;
                            }
                            this.setData({
                                detail: null,
                                data_list_loding_status: 0,
                                data_bottom_line_status: false,
                                data_list_loding_msg: res.data.msg || '',
                            });
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
        },
    };
</script>
<style></style>
