<template>
    <view>
        <!-- 导航 -->
        <view class="nav-base bg-white">
            <block v-for="(item, index) in nav_status_list" :key="index">
                <view v-if="nav_status_index == index" class="item fl tc cr-main" :data-index="index" @tap="nav_event">{{item.name}}</view>
                <view v-else class="item fl tc" :data-index="index" @tap="nav_event">{{item.name}}</view>
            </block>
        </view>

        <!-- 数据列表 -->
        <scroll-view :scroll-y="true" class="scroll-box scroll-box-ece-nav" @scrolltolower="scroll_lower" lower-threshold="30">
            <view v-if="data_list.length > 0" class="padding-horizontal-main padding-top-main">
                <view v-for="(item, index) in data_list" :key="index" class="list-item padding-horizontal-main padding-top-main border-radius-main bg-white oh spacing-mb">
                    <view class="item-base oh br-b padding-bottom-main">
                        <text class="fl cr-base">{{item.order_allot_no}}</text>
                        <text class="fr cr-red">{{item.status_name}}<text v-if="(item.is_under_line_text || null) != null">（{{item.is_under_line_text}}）</text></text>
                    </view>
                    <view v-for="(detail, di) in item.items" :key="di" class="br-b-dashed oh padding-vertical-main">
                        <navigator :url="'/pages/plugins/realstore/orderallot-detail/orderallot-detail?id=' + item.id" hover-class="none">
                            <image class="goods-image fl radius" :src="detail.images" mode="aspectFill"></image>
                            <view class="goods-base pr">
                                <view class="multi-text">{{detail.title}}</view>
                                <view v-if="detail.spec != null" class="margin-top-sm">
                                    <block v-for="(sv, si) in detail.spec" :key="si">
                                        <text v-if="si > 0" class="cr-grey padding-left-xs padding-right-xs">;</text>
                                        <text class="cr-gray">{{sv.value}}</text>
                                    </block>
                                </view>                            
                                <view class="margin-top-sm">
                                    <text class="fw-b">{{item.currency_data.currency_symbol}}{{detail.price}}</text>
                                    <text class="margin-left-sm">x{{detail.buy_number}}</text>
                                </view>
                            </view>
                        </navigator>
                    </view>
                    <view class="padding-vertical-main tr cr-base text-size">
                        <text>共<text class="fw-b">{{item.buy_number_count}}</text>件 合计 <text class="sales-price margin-right-xs">{{item.currency_data.currency_symbol}}{{item.total_price}}</text>元</text>
                    </view>
                    <view v-if="item.operate_data.is_collect == 1 || ((item.express_data || null) != null && item.express_data.length > 0)" class="item-operation tr br-t padding-vertical-main">
                        <button v-if="item.operate_data.is_collect == 1" class="round bg-white cr-green br-green" type="default" size="mini" @tap="collect_event" :data-value="item.id" :data-index="index" hover-class="none">收货</button>
                        <block v-if="(item.express_data || null) != null && item.express_data.length > 0">
                            <block v-for="(ev, ei) in item.express_data" :key="ei">
                                <button class="round bg-white cr-main br-main" type="default" size="mini" @tap="url_event" :data-value="'/pages/plugins/express/detail/detail?oid='+item.id+'&eid='+ev.id+'&action_type=realstore'" hover-class="none">物流{{ei+1}}</button>
                            </block>
                        </block>
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
                data_list: [],
                data_total: 0,
                data_page_total: 0,
                data_page: 1,
                data_list_loding_status: 1,
                data_bottom_line_status: false,
                params: null,
                nav_status_list: [
                    { name: "全部", value: "-1" },
                    { name: "待处理", value: "0,1" },
                    { name: "服务中", value: "2,5" },
                    { name: "待收货", value: "3" },
                    { name: "已完成", value: "4" },
                    { name: "已失效", value: "6,7" },
                ],
                nav_status_index: 0
            };
        },

        components: {
            componentNoData,
            componentBottomLine
        },
        props: {},

        onLoad(params) {
            // 是否指定状态
            var nav_status_index = 0;
            if ((params.status || null) != null) {
                for (var i in this.nav_status_list) {
                    if (this.nav_status_list[i]['value'] == params.status) {
                        nav_status_index = i;
                        break;
                    }
                }
            }
            this.setData({
                params: params,
                nav_status_index: nav_status_index
            });
            
            // 数据加载
            this.init();
        },

        onShow() {            
            // 分享菜单处理
            app.globalData.page_share_handle();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.setData({
                data_page: 1
            });
            this.get_data_list(1);
        },

        methods: {
            // 获取数据
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    // 用户未绑定用户则转到登录页面
                    if (app.globalData.user_is_need_login(user)) {
                        uni.redirectTo({
                            url: "/pages/login/login?event_callback=init"
                        });
                        return false;
                    } else {
                        // 获取数据
                        this.get_data_list();
                    }
                } else {
                    this.setData({
                        data_list_loding_status: 0,
                        data_bottom_line_status: false
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
                
                // 加载loding
                uni.showLoading({
                    title: '加载中...'
                });
                this.setData({
                    data_list_loding_status: 1
                });

                // 参数
                var status = (this.nav_status_list[this.nav_status_index] || null) == null ? -1 : this.nav_status_list[this.nav_status_index]['value'];
                
                // 获取数据
                uni.request({
                    url: app.globalData.get_request_url("index", "orderallot", "realstore"),
                    method: 'POST',
                    data: {
                        page: this.data_page,
                        status: status,
                        oid: this.params.oid || 0
                    },
                    dataType: 'json',
                    success: res => {
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
                                    data_page: this.data_page + 1
                                });

                                // 是否还有数据
                                this.setData({
                                    data_bottom_line_status: (this.data_page > 1 && this.data_page > this.data_page_total)
                                });
                            } else {
                                this.setData({
                                    data_list_loding_status: 0,
                                    data_list: [],
                                    data_bottom_line_status: false
                                });
                            }
                        } else {
                            this.setData({
                                data_list_loding_status: 0
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
                            data_list_loding_status: 2,
                            load_status: 1
                        });
                        app.globalData.showToast('服务器请求出错');
                    }
                });
            },

            // 滚动加载
            scroll_lower(e) {
                this.get_data_list();
            },

            // 收货
            collect_event(e) {
                uni.showModal({
                    title: '温馨提示',
                    content: '请确认已收到货物或已完成，操作后不可恢复，确定继续吗?',
                    confirmText: '确认',
                    cancelText: '不了',
                    success: result => {
                        if (result.confirm) {
                            // 参数
                            var id = e.currentTarget.dataset.value;
                            var index = e.currentTarget.dataset.index;
                            
                            // 加载loding
                            uni.showLoading({
                                title: '处理中...'
                            });
                            uni.request({
                                url: app.globalData.get_request_url("collect", "orderallot", "realstore"),
                                method: 'POST',
                                data: {
                                    id: id
                                },
                                dataType: 'json',
                                success: res => {
                                    uni.hideLoading();
                                    if (res.data.code == 0) {
                                        var temp_data_list = this.data_list;
                                        temp_data_list[index]['status'] = 4;
                                        temp_data_list[index]['status_name'] = '已完成';
                                        temp_data_list[index]['operate_data']['is_collect'] = 0;
                                        this.setData({
                                            data_list: temp_data_list
                                        });
                                        app.globalData.showToast(res.data.msg, 'success');
                                    } else {
                                        app.globalData.showToast(res.data.msg);
                                    }
                                },
                                fail: () => {
                                    uni.hideLoading();
                                    app.globalData.showToast('服务器请求出错');
                                }
                            });
                        }
                    }
                });
            },

            // 导航事件
            nav_event(e) {
                this.setData({
                    nav_status_index: e.currentTarget.dataset.index || 0,
                    data_page: 1
                });
                
                // 重新拉取数据
                this.get_data_list(1);
            },
            
            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            }
        }
    };
</script>
<style>
    @import './orderallot-list.css';
</style>