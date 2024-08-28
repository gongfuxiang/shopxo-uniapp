<template>
    <view :class="theme_view">
        <block v-if="detail != null">
            <!-- 商品数据 -->
            <component-panel-content :propTitle="$t('recommend-list.recommend-list.x74z3o')">
                <view class="oh padding-top-main padding-bottom-sm" :data-value="detail.goods.goods_url" @tap="url_event">
                    <image :src="detail.goods.images" mode="aspectFill" class="radius goods-images fl"></image>
                    <view class="goods-title multi-text fr">{{detail.goods.title}}</view>
                </view>
            </component-panel-content>
            <!-- 详情数据 -->
            <component-panel-content :propData="detail" :propDataField="form_field_data" :propTitle="$t('common.detail_text')"></component-panel-content>

            <!-- 结尾 -->
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
        </block>
        <block v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </block>
    </view>
</template>
<script>
const app = getApp();
import componentPanelContent from "@/components/panel-content/panel-content";
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
            detail: null,
            form_field_data: []
        };
    },

    components: {
        componentPanelContent,
        componentNoData,
        componentBottomLine,
    },
    props: {},

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
                url: app.globalData.get_request_url("detail", "gift", "givegift"),
                method: "POST",
                data: this.params,
                dataType: "json",
                success: (res) => {
                    uni.stopPullDownRefresh();
                    if (res.data.code == 0) {
                        var data = res.data.data;
                        this.setData({
                            detail: data.data || null,
                            form_field_data: data.form_field_data || [],
                            data_list_loding_status: 3,
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

        // url事件
        url_event(e) {
            app.globalData.url_event(e);
        }
    }
};
</script>
<style>
    @import './gift-detail.css';
</style>