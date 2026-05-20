<template>
    <view :class="theme_view">
        <block v-if="detail != null">
            <!-- 基础信息（与后台动态表单 field_list 对齐） -->
            <component-panel-content
                :propTitle="$t('common.base_info_text')"
                :propData="detail"
                :propDataField="field_list"
            ></component-panel-content>

            <view class="padding-horizontal-main padding-top-main">
                <!-- 连续签到翻倍奖励 -->
                <view
                    v-if="(detail.continuous_rules || null) != null && detail.continuous_rules.length > 0"
                    class="panel-item padding-main border-radius-main bg-white spacing-mb"
                >
                    <view class="br-b padding-bottom-main fw-b text-size">{{ $t("user-qrcode-detail.user-qrcode-detail.18680z") }}</view>
                    <view class="panel-content oh">
                        <view v-for="(item, index) in detail.continuous_rules" :key="index" class="item br-b oh padding-vertical-main">
                            <view class="content fl">
                                {{ $t("user-qrcode-detail.user-qrcode-detail.dupsnc") }}{{ item.number }}{{ $t("user-qrcode-detail.user-qrcode-detail.b5ilz3") }}{{ item.value
                                }}{{ $t("user-qrcode-detail.user-qrcode-detail.c8e5of") }}
                            </view>
                        </view>
                    </view>
                </view>

                <!-- 指定时段额外奖励（文案由后台生成） -->
                <view v-if="(detail.specified_time_reward_text || '').length > 0" class="panel-item padding-main border-radius-main bg-white spacing-mb">
                    <view class="br-b padding-bottom-main fw-b text-size">{{ $t("user-qrcode-detail.user-qrcode-detail.37bh73") }}</view>
                    <view class="panel-content oh">
                        <view class="item oh padding-vertical-main">
                            <view class="content fl">{{ detail.specified_time_reward_text }}</view>
                        </view>
                        <view v-if="(detail.specified_time_reward_award_ready || 0) != 1" class="cr-red padding-top-sm text-size-sm">
                            {{ $t("user-qrcode-detail.user-qrcode-detail.specified_time_incomplete_tip") }}
                        </view>
                    </view>
                </view>

                <!-- 推广：链接 + 各端二维码 -->
                <view v-if="share_block_visible" class="panel-item padding-main border-radius-main bg-white spacing-mb">
                    <view class="br-b padding-bottom-main fw-b text-size">{{ $t("user-qrcode-detail.user-qrcode-detail.share_block") }}</view>
                    <view class="panel-content oh">
                        <view v-if="(detail.share_data.url || '').length > 0" class="item br-b-f5 oh padding-vertical-main">
                            <view class="title fl padding-right-main cr-grey">{{ $t("user-qrcode-detail.user-qrcode-detail.share_link_label") }}</view>
                            <view class="content fl br-l padding-left-main oh">
                                <text class="text-word-break">{{ detail.share_data.url }}</text>
                                <view class="dis-inline-block margin-left" :data-value="detail.share_data.url" @tap="text_copy_event">
                                    <iconfont name="icon-copy" size="28rpx" class="cr-grey lh-il"></iconfont>
                                </view>
                            </view>
                        </view>
                        <view v-if="share_qrcode_display_list.length > 0" class="padding-top-main">
                            <view class="flex-row flex-wrap gap-10">
                                <view
                                    v-for="(qitem, qindex) in share_qrcode_display_list"
                                    :key="qindex"
                                    class="tc"
                                    :data-index="qindex"
                                    @tap="share_qrcode_preview_event"
                                >
                                    <image :src="qitem.url" mode="aspectFit" class="br-f5 radius panel-item-images"></image>
                                    <view v-if="(qitem.name || '').length > 0" class="cr-grey text-size-xs margin-top-xs">{{ qitem.name }}</view>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>

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
    import componentCommon from "@/components/common/common";
    import componentNoData from "@/components/no-data/no-data";
    import componentBottomLine from "@/components/bottom-line/bottom-line";
    import componentPanelContent from "@/components/panel-content/panel-content";

    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                params: null,
                data_list_loding_status: 1,
                data_list_loding_msg: "",
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

        computed: {
            share_block_visible() {
                const d = this.detail;
                if (!d || !d.share_data) {
                    return false;
                }
                const url = d.share_data.url || "";
                const list = d.share_data.qrcode_all;
                return url.length > 0 || (Array.isArray(list) && list.length > 0);
            },
            share_qrcode_display_list() {
                const d = this.detail;
                if (!d || !d.share_data || !Array.isArray(d.share_data.qrcode_all)) {
                    return [];
                }
                const out = [];
                d.share_data.qrcode_all.forEach((item) => {
                    if (item && item.res && item.res.code == 0 && (item.res.data || "").length > 0) {
                        out.push({ name: item.name || "", url: item.res.data });
                    }
                });
                return out;
            },
        },

        onLoad(params) {
            app.globalData.page_event_onload_handle(params);
            this.setData({
                params: params,
            });
            this.init();
        },

        onShow() {
            app.globalData.page_event_onshow_handle();
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }
            app.globalData.page_share_handle();
        },

        onPullDownRefresh() {
            this.init();
        },

        methods: {
            init() {
                this.setData({
                    data_list_loding_status: 1,
                });
                uni.request({
                    url: app.globalData.get_request_url("detail", "userqrcode", "signin"),
                    method: "POST",
                    data: {
                        id: this.params.id,
                    },
                    dataType: "json",
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            var row = data.data || null;
                            this.setData({
                                detail: row,
                                field_list: data.field_list || [],
                                data_list_loding_status: row != null ? 3 : 0,
                                data_bottom_line_status: row != null,
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
                            data_list_loding_msg: this.$t("common.internet_error_tips"),
                        });
                        app.globalData.showToast(this.$t("common.internet_error_tips"));
                    },
                });
            },

            text_copy_event(e) {
                app.globalData.text_copy_event(e);
            },

            share_qrcode_preview_event(e) {
                const list = this.share_qrcode_display_list;
                if (!list.length) {
                    return;
                }
                const urls = list.map((x) => x.url);
                const idx = parseInt(e.currentTarget.dataset.index, 10);
                const cur = urls[idx] || urls[0];
                uni.previewImage({
                    urls: urls,
                    current: cur,
                });
            },
        },
    };
</script>
<style></style>
