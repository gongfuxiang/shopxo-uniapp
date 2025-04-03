<template>
    <view :class="theme_view">
        <!-- 导航 -->
        <view class="nav-child flex-row align-c margin-bottom-lg">
            <view v-for="(item, index) in nav_status_list" :key="index">
                <view class="item dis-inline-block round margin-right-main tc" :class="nav_status_index == index ? 'cr-main bg-main-light' : 'cr-grey bg-grey-e'" :data-index="index" @tap="nav_event">{{ item.name }}</view>
            </view>
        </view>

        <!-- 列表 -->
        <view v-if="data_list.length > 0" class="data-list">
            <view v-for="(item, index) in data_list" :key="index" class="item padding-main border-radius-main oh bg-white spacing-mb">
                <view class="base oh br-b-dashed padding-bottom-main flex-row jc-sb align-c">
                    <text class="cr-grey-9">{{ item.add_time }}</text>
                </view>
                <view :data-value="'/pages/plugins/wallet/wallet-log-detail/wallet-log-detail?id=' + item.id" @tap="url_event" class="content margin-top-main cp">
                    <view v-for="(fv, fi) in content_list" :key="fi">
                        <view class="single-text margin-top-sm log-item">
                            <text class="name cr-grey-9 margin-right-main">{{ fv.name }}:</text>
                            <text class="fw-b">{{ item[fv.field] }}</text>
                            <text v-if="(fv.unit || null) != null" class="fw-b">{{ fv.unit }}</text>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <view v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status"></component-no-data>
        </view>

        <!-- 结尾 -->
        <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
    </view>
</template>
<script>
    const app = getApp();
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';

    export default {
        props: {
            propPullDownRefresh: {
                type: Boolean,
                default: false,
            },
            propScrollLower: {
                type: Boolean,
                default: false,
            },
        },
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
                nav_status_index: 0,
                nav_status_list: [
                    { name: this.$t('common.all'), value: '-1' },
                    { name: this.$t('wallet-log.wallet-log.9p865e'), value: '0' },
                    { name: this.$t('wallet-log.wallet-log.1nm6c2'), value: '1' },
                ],
                content_list: [
                    { name: this.$t('invoice.invoice.l3832z'), field: 'business_type_name' },
                    { name: this.$t('wallet-log-detail.wallet-log-detail.744os7'), field: 'money_type_name' },
                    { name: this.$t('wallet-log-detail.wallet-log-detail.ruq60b'), field: 'operation_money' },
                    { name: this.$t('wallet-log-detail.wallet-log-detail.4q7pfq'), field: 'original_money' },
                    { name: this.$t('wallet-log-detail.wallet-log-detail.r814ne'), field: 'latest_money' },
                ],
            };
        },

        components: {
            componentNoData,
            componentBottomLine,
        },
        created() {
            this.init();
        },
        mounted() {
            // 分享菜单处理
            app.globalData.page_share_handle();
        },
        watch: {
            propPullDownRefresh(newVal, oldVal) {
                if (newVal !== oldVal) {
                    this.setData({
                        data_page: 1,
                    });
                    this.get_data_list(1);
                }
            },
            propScrollLower(newVal, oldVal) {
                if (newVal !== oldVal) {
                    this.get_data_list();
                }
            },
        },

        methods: {
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    this.get_data_list();
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
                if(this.data_page > 1) {
                    uni.showLoading({
                        title: this.$t('common.loading_in_text'),
                    });
                }

                // 参数
                var status = (this.nav_status_list[this.nav_status_index] || null) == null ? -1 : this.nav_status_list[this.nav_status_index]['value'];

                // 获取数据
                uni.request({
                    url: app.globalData.get_request_url('index', 'walletlog', 'wallet'),
                    method: 'POST',
                    data: {
                        page: this.data_page,
                        operation_type: status,
                        is_more: 1,
                    },
                    dataType: 'json',
                    success: (res) => {
                        if(this.data_page > 1) {
                            uni.hideLoading();
                        }
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            if (data.data.length > 0) {
                                if (this.data_page <= 1) {
                                    var temp_data_list = data.data;
                                } else {
                                    var temp_data_list = this.data_list || [];
                                    var temp_data = data.data;
                                    for (var i in temp_data) {
                                        temp_data_list.push(temp_data[i]);
                                    }
                                }
                                this.setData({
                                    data_list: temp_data_list,
                                    data_total: data.total,
                                    data_page_total: data.page_total,
                                    data_list_loding_status: 3,
                                    data_page: this.data_page + 1,
                                    data_is_loading: 0,
                                });

                                // 是否还有数据
                                this.setData({
                                    data_bottom_line_status: this.data_list.length > 0 && this.data_page > 1 && this.data_page > this.data_page_total,
                                });
                            } else {
                                this.setData({
                                    data_list_loding_status: 0,
                                    data_is_loading: 0,
                                });
                                if (this.data_page <= 1) {
                                    this.setData({
                                        data_list: [],
                                        data_bottom_line_status: false,
                                    });
                                }
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

            // 导航事件
            nav_event(e) {
                this.setData({
                    nav_status_index: e.currentTarget.dataset.index || 0,
                    data_page: 1,
                    data_list: [],
                    data_list_loding_status: 1,
                    data_bottom_line_status: false
                });
                this.get_data_list(1);
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            }
        },
    };
</script>
<style scoped>
    .nav-child .item {
        height: 60rpx;
        line-height: 60rpx;
        padding: 0 30rpx;
        min-width: 84rpx;
    }
    .log-item .name {
        min-width: 112rpx;
    }
</style>
