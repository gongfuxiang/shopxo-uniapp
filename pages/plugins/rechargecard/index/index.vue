<template>
    <view :class="theme_view">
        <scroll-view :scroll-y="true" class="scroll-box" @scrolltolower="scroll_lower" lower-threshold="60">
            <view class="page-bottom-fixed">
                <view v-if="data_list.length > 0" class="data-list padding-horizontal-main padding-top-main">
                    <view v-for="(item, index) in data_list" :key="index" class="item padding-main border-radius-main oh bg-white spacing-mb">
                        <view class="content margin-top-main">
                            <view v-for="(fv, fi) in content_list" :key="fi">
                                <view class="single-text margin-top-xs">
                                    <text class="cr-grey-9 margin-right-main">{{ fv.name }}:</text>
                                    <text class="cr-black">{{ item[fv.field] }}</text>
                                    <text v-if="(fv.unit || null) != null" class="cr-grey">{{ fv.unit }}</text>
                                </view>
                            </view>
                        </view>
                    </view>

                    <!-- 结尾 -->
                    <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
                </view>
                <view v-else>
                    <!-- 提示信息 -->
                    <component-no-data :propStatus="data_list_loding_status"></component-no-data>
                </view>

                <!-- 兑换卡密 -->
                <view class="bottom-fixed">
                    <view class="bottom-line-exclude">
                        <button data-value="/pages/plugins/rechargecard/form/form" @tap="url_event" class="round cr-main bg-white br-main text-size wh-auto sub-btn" type="default" hover-class="none">{{$t('rechargecard-index.rechargecard-index.8tfgh2')}}</button>
                    </view>
                </view>
            </view>
        </scroll-view>
    </view>
</template>
<script>
    const app = getApp();
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';

    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                data_base: null,
                data_list: [],
                data_total: 0,
                data_page_total: 0,
                data_page: 1,
                data_list_loding_status: 1,
                data_bottom_line_status: false,
                data_is_loading: 0,
                params: null,
                content_list: [
                    { name: this.$t('rechargecard-index.rechargecard-index.hfg2fg'), field: 'secret_key' },
                    { name: this.$t('recharge.recharge.qbw1x2'), field: 'money' },
                    { name: this.$t('rechargecard-index.rechargecard-index.8uhyui'), field: 'recharge_time' },
                    { name: this.$t('profit-detail.profit-detail.b7v892'), field: 'add_time' },
                    { name: this.$t('order-detail.order-detail.21ift9'), field: 'upd_time' },
                ],
            };
        },

        components: {
            componentNoData,
            componentBottomLine,
        },
        props: {},

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 参数
            this.setData({
                params: params
            });
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 分享菜单处理
            app.globalData.page_share_handle();

            // 初始化配置
            this.init();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.setData({
                data_page: 1,
            });
            this.get_data_list(1);
        },

        methods: {
            // 初始化
            init(e) {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    this.setData({
                        data_page: 1,
                    });
                    this.get_data_list(1);
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
                if(this.data_page > 1) {
                    uni.showLoading({
                        title: this.$t('common.loading_in_text'),
                    });
                }

                // 获取数据
                uni.request({
                    url: app.globalData.get_request_url('index', 'index', 'rechargecard'),
                    method: 'POST',
                    data: {page: this.data_page},
                    dataType: 'json',
                    success: (res) => {
                        if(this.data_page > 1) {
                            uni.hideLoading();
                        }
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            if (res.data.data.data_list.length > 0) {
                                if (this.data_page <= 1) {
                                    var temp_data_list = res.data.data.data_list;
                                } else {
                                    var temp_data_list = this.data_list || [];
                                    var temp_data = res.data.data.data_list;
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
                                    data_bottom_line_status: false,
                                    data_is_loading: 0,
                                });
                            }
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                                data_is_loading: 0,
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
                            data_is_loading: 0,
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 滚动加载
            scroll_lower(e) {
                this.get_data_list();
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            }
        },
    };
</script>
<style>
</style>