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
                        <text class="fl cr-base">{{item.add_time}}</text>
                        <text class="fr cr-red">{{item.status_name}}<text v-if="(item.is_under_line_text || null) != null">（{{item.is_under_line_text}}）</text></text>
                    </view>
                    <view class="br-b padding-vertical-main">
                        <view class="cr-base">{{item.name}}</view>
                        <view v-if="(item.describe || null) != null"  class="cr-grey margin-top-xs">{{item.describe}}</view>
                    </view>
                    <view class="padding-vertical-main">
                        <block v-for="(fv,fi) in content_list">
                            <view class="single-text margin-top-xs">
                                <text class="cr-gray margin-right-xl">{{fv.name}}</text>
                                <text class="cr-base">{{item[fv.field]}}</text>
                                <text v-if="(fv.unit || null) != null" class="cr-gray">{{fv.unit}}</text>
                            </view>
                        </block>
                    </view>
                    <view class="item-operation tr br-t padding-vertical-main">
                        <button class="round bg-white cr-green br-green" type="default" size="mini" @tap="url_event" :data-value="'/pages/plugins/realstore/frequencycard-used/frequencycard-used?cuid='+item.id" hover-class="none">使用记录</button>
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
                    { name: "有效", value: "0" },
                    { name: "暂停", value: "1" },
                    { name: "结束", value: "2" },
                    { name: "关闭", value: "3" },
                ],
                nav_status_index: 0,
                content_list: [
                    {name: "可用次数", field: "valid_number", unit: "次"},
                    {name: "已用次数", field: "use_number", unit: "次"},
                    {name: "起始时间", field: "start_time"},
                    {name: "结束时间", field: "end_time"}
                ]
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
                    url: app.globalData.get_request_url("index", "frequencycard", "realstore"),
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
    @import './frequencycard-list.css';
</style>