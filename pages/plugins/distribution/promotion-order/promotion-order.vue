<template>
    <view :class="theme_view">
        <!-- 导航 -->
        <view class="nav-base bg-white">
            <block v-for="(item, index) in nav_type_list" :key="index">
                <view :class="'item fl tc ' + (nav_type_index == index ? 'cr-main nav-active-line' : 'cr-grey')" :data-index="index" @tap="nav_event">{{ item.name }}</view>
            </block>
        </view>

        <!-- 列表 -->
        <scroll-view :scroll-y="true" class="scroll-box scroll-box-ece-nav" @scrolltolower="scroll_lower" lower-threshold="60">
            <view v-if="data_list.length > 0" class="data-list padding-horizontal-main padding-top-main">
                <view v-for="(item, index) in data_list" :key="index" class="item padding-main border-radius-main oh bg-white spacing-mb">
                    <view class="base oh br-b padding-bottom-main">
                        <image class="avatar dis-block fl circle" :src="item.avatar" mode="widthFix" @tap="avatar_event" :data-value="item.avatar"></image>
                        <text class="cr-base margin-left-sm">{{ item.user_name_view || "" }}</text>
                        <text class="cr-base fr">{{ item.order_status_name }}</text>
                    </view>
                    <view class="content margin-top">
                        <navigator :url="'/pages/plugins/distribution/order-detail/order-detail?id=' + item.id" hover-class="none">
                            <block v-for="(fv, fi) in content_list" :key="fi">
                                <view class="single-text margin-top-xs">
                                    <text class="cr-grey margin-right-xl">{{ fv.name }}</text>
                                    <text class="cr-base">{{ item[fv.field] }}</text>
                                    <text v-if="(fv.unit || null) != null" class="cr-grey">{{ fv.unit }}</text>
                                </view>
                            </block>
                        </navigator>
                    </view>
                </view>
            </view>
            <view v-else>
                <!-- 提示信息 -->
                <component-no-data :propStatus="data_list_loding_status"></component-no-data>
            </view>

            <!-- 结尾 -->
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
        </scroll-view>
    </view>
</template>
<script>
const app = getApp();
import componentNoData from "../../../../components/no-data/no-data";
import componentBottomLine from "../../../../components/bottom-line/bottom-line";

export default {
    data() {
        return {
            theme_view: app.globalData.get_theme_value_view(),
            data_list: [],
            data_total: 0,
            data_page_total: 0,
            data_page: 1,
            data_list_loding_status: 1,
            data_bottom_line_status: false,
            data_is_loading: 0,
            params: null,
            nav_type_list: [
                { name: "新增客户总GMV", value: 0 },
                { name: "订单总数", value: 1 },
                { name: "订单总GMV", value: 2 },
            ],
            nav_type_index: 0,
            content_list: [
                { name: "订单号", field: "order_no" },
                { name: "订单金额", field: "total_price" },
                { name: "支付状态", field: "order_pay_status_name" },
                { name: "来源终端", field: "order_client_type_name" },
                { name: "订单时间", field: "add_time" },
            ],
        };
    },

    components: {
        componentNoData,
        componentBottomLine,
    },
    props: {},

    onLoad(params) {
        // 是否指定状态
        var nav_type_index = 0;
        if (params.type != undefined) {
            for (var i in this.nav_type_list) {
                if (this.nav_type_list[i]["value"] == params.type) {
                    nav_type_index = i;
                    break;
                }
            }
        }
        this.setData({
            params: params,
            nav_type_index: nav_type_index,
        });
        this.init();
    },

    onShow() {
        // 分享菜单处理
        app.globalData.page_share_handle();
    },

    // 下拉刷新
    onPullDownRefresh() {
        this.setData({
            data_page: 1,
        });
        this.get_data_list(1);
    },

    methods: {
        init() {
            var user = app.globalData.get_user_info(this, "init");
            if (user != false) {
                // 用户未绑定手机则转到登录页面
                if (app.globalData.user_is_need_login(user)) {
                    uni.redirectTo({
                        url: "/pages/login/login?event_callback=init",
                    });
                    return false;
                } else {
                    // 获取数据
                    this.get_data_list();
                }
            } else {
                this.setData({
                    data_list_loding_status: 0,
                    data_bottom_line_status: false,
                });
            }
        },

        // 获取数据
        get_data_list(is_mandatory) {
            // 分页是否还有数据
            if ((is_mandatory || 0) == 0) {
                if (this.data_bottom_line_status == true) {
                    uni.stopPullDownRefresh();
                    return false;
                }
            }

            // 是否加载中
            if (this.data_is_loading == 1) {
                return false;
            }
            this.setData({
                data_is_loading: 1,
                data_list_loding_status: 1,
            });

            // 加载loding
            uni.showLoading({
                title: "加载中...",
            });

            // 请求参数
            var type = (this.nav_type_list[this.nav_type_index] || null) == null ? -1 : this.nav_type_list[this.nav_type_index]["value"];
            var data = this.params;
            data['page'] = this.data_page;
            data['type'] = type;

            // 获取数据
            uni.request({
                url: app.globalData.get_request_url("index", "promotionorder", "distribution"),
                method: "POST",
                data: data,
                dataType: "json",
                success: (res) => {
                    uni.hideLoading();
                    uni.stopPullDownRefresh();
                    if (res.data.code == 0) {
                        if (res.data.data.data.length > 0) {
                            if (this.data_page <= 1) {
                                var temp_data_list = res.data.data.data;
                            } else {
                                var temp_data_list = this.data_list || [];
                                var temp_data = res.data.data.data;
                                for (var i in temp_data) {
                                    temp_data_list.push(temp_data[i]);
                                }
                            }
                            this.setData({
                                data_list: temp_data_list,
                                data_total: res.data.data.total,
                                data_page_total: res.data.data.page_total,
                                data_list_loding_status: 3,
                                data_page: this.data_page + 1,
                                data_is_loading: 0,
                            });

                            // 是否还有数据
                            this.setData({
                                data_bottom_line_status: this.data_page > 1 && this.data_page > this.data_page_total,
                            });
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                                data_list: [],
                                data_bottom_line_status: false,
                                data_is_loading: 0,
                            });
                        }
                    } else {
                        this.setData({
                            data_list_loding_status: 0,
                            data_is_loading: 0,
                        });
                        if (app.globalData.is_login_check(res.data, this, "get_data_list")) {
                            app.globalData.showToast(res.data.msg);
                        }
                    }
                },
                fail: () => {
                    uni.hideLoading();
                    uni.stopPullDownRefresh();
                    this.setData({
                        data_list_loding_status: 2,
                        data_is_loading: 0,
                    });
                    app.globalData.showToast("网络开小差了哦~");
                },
            });
        },

        // 滚动加载
        scroll_lower(e) {
            this.get_data_list();
        },

        // 导航事件
        nav_event(e) {
            this.setData({
                nav_type_index: e.currentTarget.dataset.index || 0,
                data_page: 1,
            });
            this.get_data_list(1);
        },

        // 头像查看
        avatar_event(e) {
            var value = e.currentTarget.dataset.value || null;
            if (value != null) {
                uni.previewImage({
                    current: value,
                    urls: [value],
                });
            } else {
                app.globalData.showToast("头像地址有误");
            }
        },
    },
};
</script>
<style>
@import "./promotion-order.css";
</style>
