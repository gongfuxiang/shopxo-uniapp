<template>
    <view>
        <view v-if="(data_base || null) != null">
            <view v-if="(data_list || null) != null && data_list.length > 0" class="page">
                <!-- 导航 -->
                <scroll-view class="nav  scroll-view-horizontal bg-white tc oh" scroll-x="true">
                    <block v-for="(item, index) in data_list" :key="index">
                        <view :class="'item dis-inline-block padding-left-xxl padding-right-xxl cr-gray ' + (selected_tabs_index === index ? 'cr-main' : '')" @tap="tabs_event" :data-index="index">{{item.name}}</view>
                    </block>
                </scroll-view>

                <!-- 内容 -->
                <block v-for="(item, index) in data_list" :key="index">
                    <block v-if="selected_tabs_index == index">
                        <block v-if="(item.pay_period_rules || null) != null">
                            <view class="data-list padding-horizontal-main padding-top-main">
                                <block v-for="(rules, ri) in item.pay_period_rules" :key="ri">
                                    <view :class="'item padding-main border-radius-main bg-white oh tc spacing-mb ' + (selected_content_index === ri ? 'border-color-main' : '')" @tap="content_event" :data-index="ri">
                                        <view class="fl number single-text">
                                            <text class="fw-b cr-base text-size">{{((rules.number || null) == null) ? '终身' : rules.value}}</text>
                                            <text v-if="(rules.unit || null) != null" class="cr-grey margin-left-sm">{{rules.unit}}</text>
                                        </view>
                                        <view class="fr price bg-white single-text">
                                            <text class="cr-main">¥</text>
                                            <text class=" fw-b cr-main text-size-lg">{{rules.price}}</text>
                                            <text class="cr-grey margin-left-sm">元</text>
                                        </view>
                                    </view>
                                </block>
                                <view class="submit-fixed">
                                    <button class="bg-main br-main cr-white round text-size margin-horizontal-main margin-bottom-main" type="default" hover-class="none" @tap="submit_event" :disabled="submit_disabled_status">确认支付</button>
                                </view>
                            </view>

                            <!-- 结尾 -->
                            <component-bottom-line :propStatus="true"></component-bottom-line>
                        </block>
                        <block v-else>
                            <!-- 提示信息 -->
                            <component-no-data propStatus="0" propMsg="购买时长未配置"></component-no-data>
                        </block>
                    </block>
                </block>
            </view>
            <view v-else>
                <!-- 提示信息 -->
                <component-no-data propStatus="0" propMsg="未配置会员等级"></component-no-data>
            </view>
        </view>
        <view v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import componentNoData from "../../../../components/no-data/no-data";
    import componentBottomLine from "../../../../components/bottom-line/bottom-line";

    export default {
        data() {
            return {
                data_bottom_line_status: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_list: [],
                data_base: null,
                selected_tabs_index: 0,
                selected_content_index: null,
                submit_disabled_status: false
            };
        },

        components: {
            componentNoData,
            componentBottomLine
        },
        props: {},

        onLoad(params) {
            this.init();
        },

        onShow() {},

        // 下拉刷新
        onPullDownRefresh() {
            this.get_data_list();
        },

        methods: {
            init() {
                // 获取数据
                this.get_data_list();
            },

            // 获取数据
            get_data_list() {
                uni.showLoading({
                    title: "加载中..."
                });
                if (this.data_list.length <= 0) {
                    this.setData({
                        data_list_loding_status: 1
                    });
                }
                uni.request({
                    url: app.globalData.get_request_url("index", "buy", "membershiplevelvip"),
                    method: "POST",
                    data: {},
                    dataType: "json",
                    success: res => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            var status = (data.data || []).length > 0;
                            this.setData({
                                data_base: data.base || null,
                                data_list: data.data || [],
                                data_list_loding_msg: '',
                                data_list_loding_status: status ? 3 : 0,
                                data_bottom_line_status: status
                            });
                        } else {
                            this.setData({
                                data_bottom_line_status: false,
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg
                            });
                            if (app.globalData.is_login_check(res.data, this, 'get_data_list')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_bottom_line_status: false,
                            data_list_loding_status: 2,
                            data_list_loding_msg: '服务器请求出错'
                        });
                        app.globalData.showToast("服务器请求出错");
                    }
                });
            },

            // tabs事件
            tabs_event(e) {
                this.setData({
                    selected_tabs_index: e.currentTarget.dataset.index || 0,
                    selected_content_index: null
                });
            },

            // 时长事件
            content_event(e) {
                this.setData({
                    selected_content_index: e.currentTarget.dataset.index || 0
                });
            },

            // 确认支付事件
            submit_event(e) {
                if (this.selected_tabs_index < 0 || this.selected_content_index === null) {
                    app.globalData.showToast('请选择开通时长');
                    return false;
                }
                
                // 请求参数
                var item = this.data_list[this.selected_tabs_index] || null;
                if (item == null) {
                    app.globalData.showToast('开通时长有误');
                    return false;
                }
                var rules = (item['pay_period_rules'] || null) == null ? null : item['pay_period_rules'][this.selected_content_index] || null;
                if (rules == null) {
                    app.globalData.showToast('开通时长有误');
                    return false;
                }
                
                // 请求生成支付订单
                this.setData({
                    submit_disabled_status: true
                });
                uni.showLoading({
                    title: "处理中..."
                });
                uni.request({
                    url: app.globalData.get_request_url("create", "buy", "membershiplevelvip"),
                    method: "POST",
                    data: {
                        opening: item['id'] + '-' + rules['number']
                    },
                    dataType: "json",
                    success: res => {
                        uni.hideLoading();
                        this.setData({
                            submit_disabled_status: false
                        });
                        if (res.data.code == 0) {
                            // 进入以后会员中心并发起支付
                            uni.redirectTo({
                                url: '/pages/plugins/membershiplevelvip/order/order?is_pay=1&order_id=' + res.data.data.id
                            });
                        } else {
                            if (app.globalData.is_login_check(res.data, this, 'submit_event')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        this.setData({
                            submit_disabled_status: false
                        });
                        uni.hideLoading();
                        app.globalData.showToast("服务器请求出错");
                    }
                });
            }
        }
    };
</script>
<style>
    @import './buy.css';
</style>