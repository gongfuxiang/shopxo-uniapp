<template>
    <view :class="theme_view">
        <scroll-view :scroll-y="true" class="scroll-box" @scrolltolower="scroll_lower" lower-threshold="60">
            <view v-if="data_list.length > 0" class="padding-horizontal-main padding-top-main">
                <view v-for="(item, index) in data_list" :key="index" class="padding-main border-radius-main oh bg-white pr spacing-mb">
                    <view :data-value="item.goods_url" @tap="url_event" class="cp">
                        <image class="goods-image fl radius" :src="item.images" mode="aspectFill"></image>
                        <view class="goods-base">
                            <view class="goods-title multi-text">{{item.title}}</view>
                            <view class="oh margin-top-sm">
                                <block v-if="(item.show_field_price_status || 0) == 1">
                                    <text class="sales-price">{{item.show_price_symbol}}{{item.price}}</text>
                                    <text class="cr-grey text-size-xs">{{item.show_price_unit}}</text>
                                </block>
                                <text v-if="(item.show_field_original_price_status || 0) == 1 && item.original_price > 0" class="original-price margin-left">{{item.show_price_symbol}}{{item.original_price}}{{item.show_original_price_unit}}</text>
                            </view>
                        </view>
                    </view>
                    <button class="br-yellow cr-yellow bg-white fr round pa operate-submit" type="default" size="mini" @tap="cancel_event" :data-value="item.goods_id" :data-index="index" hover-class="none">{{$t('common.cancel')}}</button>
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
    import componentNoData from "../../components/no-data/no-data";
    import componentBottomLine from "../../components/bottom-line/bottom-line";

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
                // 基础配置
                currency_symbol: app.globalData.currency_symbol()
            };
        },

        components: {
            componentNoData,
            componentBottomLine
        },
        
        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 数据加载
            this.init();

            // 初始化配置
            this.init_config();
            
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
            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {
                    this.setData({
                        currency_symbol: app.globalData.get_config('currency_symbol')
                    });
                } else {
                    app.globalData.is_config(this, 'init_config');
                }
            },

            // 获取数据
            init() {
                var user = app.globalData.get_user_info(this, "init");
                if (user != false) {
                    this.get_data_list();
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
                
                // 是否加载中
                if(this.data_is_loading == 1) {
                    return false;
                }
                this.setData({
                    data_is_loading: 1,
                    data_list_loding_status: 1
                });
                
                // 加载loding
                if(this.data_page > 1) {
                    uni.showLoading({
                        title: this.$t('common.loading_in_text'),
                    });
                }
                
                // 获取数据
                uni.request({
                    url: app.globalData.get_request_url("index", "usergoodsfavor"),
                    method: 'POST',
                    data: {
                        page: this.data_page
                    },
                    dataType: 'json',
                    success: res => {
                        if(this.data_page > 1) {
                            uni.hideLoading();
                        }
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
                                    data_is_loading: 0
                                });
                                
                                // 是否还有数据
                                this.setData({
                                    data_bottom_line_status: (this.data_page > 1 && this.data_page > this.data_page_total)
                                });
                            } else {
                                this.setData({
                                    data_list_loding_status: 0,
                                    data_is_loading: 0
                                });
                            }
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                                data_is_loading: 0
                            });
                            if (app.globalData.is_login_check(res.data, this, 'get_data_list')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        if(this.data_page > 1) {
                            uni.hideLoading();
                        }
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_is_loading: 0
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    }
                });
            },

            // 滚动加载
            scroll_lower(e) {
                this.get_data_list();
            },

            // 取消
            cancel_event(e) {
                uni.showModal({
                    title: this.$t('common.warm_tips'),
                    content: this.$t('order.order.pn78ns'),
                    confirmText: this.$t('common.confirm'),
                    cancelText: this.$t('recommend-list.recommend-list.w9460o'),
                    success: result => {
                        if (result.confirm) {
                            // 参数
                            var id = e.currentTarget.dataset.value;
                            var index = e.currentTarget.dataset.index;
                            
                            // 加载loding
                            uni.showLoading({
                                title: this.$t('common.processing_in_text')
                            });
                            uni.request({
                                url: app.globalData.get_request_url("cancel", "usergoodsfavor"),
                                method: 'POST',
                                data: {
                                    id: id
                                },
                                dataType: 'json',
                                success: res => {
                                    uni.hideLoading();
                                    if (res.data.code == 0) {
                                        var temp_data_list = this.data_list;
                                        temp_data_list.splice(index, 1);
                                        this.setData({
                                            data_list: temp_data_list
                                        });
                                        if (temp_data_list.length == 0) {
                                            this.setData({
                                                data_list_loding_status: 0,
                                                data_bottom_line_status: false
                                            });
                                        }
                                        app.globalData.showToast(res.data.msg, 'success');
                                    } else {
                                        if (app.globalData.is_login_check(res.data)) {
                                            app.globalData.showToast(res.data.msg);
                                        } else {
                                            app.globalData.showToast(this.$t('common.sub_error_retry_tips'));
                                        }
                                    }
                                },
                                fail: () => {
                                    uni.hideLoading();
                                    app.globalData.showToast(this.$t('common.internet_error_tips'));
                                }
                            });
                        }
                    }
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
    @import './user-favor.css';
</style>