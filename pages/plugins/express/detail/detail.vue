<template>
    <view :class="theme_view">
        <!-- 多个包括导航 -->
        <scroll-view v-if="(express_data || null) != null && express_data.length > 1" class="scroll-view-horizontal bg-white oh" scroll-x="true">
            <block v-for="(item, index) in express_data" :key="index">
                <view :class="'item cr-grey dis-inline-block padding-horizontal-main padding-top-main padding-bottom-sm ' + (item.is_active == 1 ? 'cr-main nav-active-line bg-main-befor fw-b' : '')" @tap="nav_event" :data-index="index">{{ item.show_name }}</view>
            </block>
        </scroll-view>

        <!-- 快递基础信息（切换时沿用列表已有数据，始终展示） -->
        <view v-if="(express_info || null) != null" class="padding-horizontal-main padding-top-main">
            <view class="padding-main border-radius-main bg-white oh spacing-mb">
                <image class="express-icon fl radius" :src="express_info.icon" mode="aspectFill"></image>
                <view class="fl margin-left-lg">
                    <view class="cr-base fw-b">{{ express_info.name }}</view>
                    <view class="cr-base margin-top-sm flex-row align-c" data-event="copy" :data-value="express_info.number" @tap="text_event">
                        <text>{{ express_info.number }}</text>
                        <view v-if="(express_info.number || null) != null" class="dis-inline-block margin-left-sm">
                            <iconfont name="icon-copy" size="28rpx" class="cr-grey"></iconfont>
                        </view>
                    </view>
                </view>
            </view>
            <!-- 物流轨迹（加载中仅刷新此区域） -->
            <block v-if="!express_track_loading">
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
            </block>
        </view>

        <!-- 提示信息 / 轨迹加载 -->
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
    import pluginLocale from '../locale/index.js';

    export default {
        mixins: [pluginLocale],
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
                express_track_loading: false,
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
        },

        onLoad(params) {
            // 参数处理
            params = app.globalData.launch_params_handle(params);

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
            // 从包裹列表组装头部基础信息
            build_express_base(item) {
                if ((item || null) == null) {
                    return null;
                }
                return {
                    name: item.express_name || item.name || '',
                    icon: item.express_icon || item.icon || '',
                    number: item.express_number || item.number || '',
                    note: null,
                    msg: null,
                    data: null,
                };
            },

            // 初始化
            get_data() {
                // 请求序号，避免快速切换时旧请求回写覆盖
                this._express_request_seq = (this._express_request_seq || 0) + 1;
                var request_seq = this._express_request_seq;
                var keep_header = (this.express_info || null) != null;

                this.setData({
                    data_list_loding_status: 1,
                    data_list_loding_msg: "",
                    data_bottom_line_status: false,
                    express_track_loading: keep_header,
                });
                uni.request({
                    url: app.globalData.get_request_url("index", "index", "express"),
                    method: "POST",
                    data: this.params,
                    dataType: "json",
                    success: (res) => {
                        if (request_seq !== this._express_request_seq) {
                            return;
                        }
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            var express_info = data.express_info || null;
                            var status = express_info != null && ((express_info.msg || null) != null || ((express_info.data || null) != null && express_info.data.length > 0));
                            this.setData({
                                data_bottom_line_status: status,
                                data_list_loding_status: status ? 3 : 0,
                                data_list_loding_msg: status ? "" : this.$t('detail.there_currently_logistics_info_available'),
                                data_status: status,
                                express_info: express_info,
                                express_data: data.express_data || [],
                                express_track_loading: false,
                            });
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                                data_list_loding_msg: res.data.msg,
                                data_status: false,
                                data_bottom_line_status: false,
                                express_track_loading: false,
                                // 保留头部基础信息，仅轨迹区提示错误
                                express_info: keep_header ? Object.assign({}, this.express_info, { note: null, msg: null, data: null }) : null,
                            });
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        if (request_seq !== this._express_request_seq) {
                            return;
                        }
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                            data_status: false,
                            data_bottom_line_status: false,
                            express_track_loading: false,
                            express_info: keep_header ? Object.assign({}, this.express_info, { note: null, msg: null, data: null }) : null,
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 导航事件
            nav_event(e) {
                var index = parseInt(e.currentTarget.dataset.index || 0);
                if (isNaN(index) || index < 0) {
                    return;
                }
                // 已选中则不重复请求
                var current = (this.express_data || [])[index] || null;
                if (current != null && (current.is_active || 0) == 1) {
                    return;
                }

                // 先切换导航，并用列表已有基础信息刷新头部；轨迹区进入加载
                var express_data = (this.express_data || []).map(function (item, i) {
                    return Object.assign({}, item, { is_active: i === index ? 1 : 0 });
                });
                var temp = Object.assign({}, this.params || {});
                temp['eid'] = index;
                this.setData({
                    params: temp,
                    express_data: express_data,
                    express_info: this.build_express_base(current) || this.express_info,
                    data_status: false,
                    data_list_loding_status: 1,
                    data_list_loding_msg: "",
                    data_bottom_line_status: false,
                    express_track_loading: true,
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
