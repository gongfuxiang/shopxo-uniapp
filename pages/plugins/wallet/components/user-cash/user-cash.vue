<template>
    <view :class="theme_view">
        <!-- 导航 -->
        <view class="nav-child flex-row align-c margin-bottom-lg scroll-view-horizontal">
            <scroll-view :scroll-x="true" :show-scrollbar="false">
                <block v-for="(item, index) in nav_status_list" :key="index">
                    <view class="item dis-inline-block round margin-right-main tc" :class="nav_status_index == index ? 'cr-main bg-main-light' : 'cr-grey bg-grey-e'" :data-index="index" @tap="nav_event">{{ item.name }}</view>
                </block>
            </scroll-view>
        </view>

        <!-- 列表 -->
        <view v-if="data_list.length > 0" class="data-list">
            <view v-for="(item, index) in data_list" :key="index" class="item padding-main border-radius-main oh bg-white spacing-mb">
                <view class="base oh br-b-dashed padding-bottom-main flex-row jc-sb align-c">
                    <text class="cr-grey-9">{{ item.add_time }}</text>
                    <text :class="item.status === 0 ? 'cr-black' : (item.status === 2 ? 'cr-grey-c' : 'cr-red')">{{ item.status_name }}</text>
                </view>
                <view :data-value="'/pages/plugins/wallet/user-cash-detail/user-cash-detail?id=' + item.id" @tap="url_event" class="content margin-top cp">
                    <view v-for="(fv, fi) in content_list" :key="fi">
                        <view class="single-text margin-top-sm cash">
                            <text class="name cr-grey-9 margin-right-main">{{ fv.name }}:</text>
                            <text class="fw-b">{{ item[fv.field] }}</text>
                            <text v-if="(fv.unit || null) != null" class="fw-b">{{ fv.unit }}</text>
                        </view>
                    </view>
                </view>
                <view v-if="item.status == 1" class="item-operation tr margin-top-main">
                    <button class="round bg-white cr-main br-main text-size-md" type="default" size="mini" @tap="receive_event" :data-value="item.id" :data-index="index" hover-class="none">{{$t('pages.plugins-coin-collection')}}</button>
                </view>
            </view>
        </view>
        <view v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" propLoadingLogoTop="85%"></component-no-data>
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
                nav_status_list: [
                    { name: this.$t('common.all'), value: '-1' },
                    { name: this.$t('user-cash.user-cash.3v1gzc'), value: '0' },
                    { name: this.$t('user-cash.user-cash.678iuy'), value: '1' },
                    { name: this.$t('user-cash.user-cash.t7gtu0'), value: '2' },
                    { name: this.$t('user-cash.user-cash.x47iu3'), value: '3' },
                ],
                nav_status_index: 0,
                content_list: [
                    { name: this.$t('user-cash-detail.user-cash-detail.e8a3e8'), field: 'cash_no' },
                    { name: this.$t('cash-create.cash-create.qg404q'), field: 'money' },
                    { name: this.$t('cash-create.cash-create.9ugssd'), field: 'commission' },
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
                    url: app.globalData.get_request_url('index', 'cash', 'wallet'),
                    method: 'POST',
                    data: {
                        page: this.data_page,
                        status: status,
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

            // 收款
            receive_event(e) {
                if (uni.canIUse('requestMerchantTransfer')) {
                    // 参数
                    var id = e.currentTarget.dataset.value;
                    var index = e.currentTarget.dataset.index;
                    
                    // 加载loding
                    uni.showLoading({
                        title: this.$t('common.processing_in_text'),
                    });
                    uni.request({
                        url: app.globalData.get_request_url('receivedata', 'cash', 'wallet'),
                        method: 'POST',
                        data: {
                            id: id,
                        },
                        dataType: 'json',
                        success: (res) => {
                            uni.hideLoading();
                            if (res.data.code == 0) {
                                var temp_data_list = this.data_list;
                                uni.requestMerchantTransfer({
                                    mchId: res.data.data.mchid,
                                    appId: res.data.data.appid,
                                    package: res.data.data.package,
                                    success: (res) => {
                                        temp_data_list[index]['status'] = 2;
                                        temp_data_list[index]['status_name'] = this.$t('user-cash.user-cash.t7gtu0');
                                        this.setData({
                                            data_list: temp_data_list,
                                        });
                                        uni.request({
                                            url: app.globalData.get_request_url('payrefresh', 'cash', 'wallet'),
                                            method: 'POST',
                                            data: {
                                                id: id,
                                            },
                                            dataType: 'json'
                                        });
                                    },
                                    fail: (res) => {
                                        if(res.errMsg.indexOf('cancel') == -1) {
                                            uni.showModal({
                                                content: res.errMsg,
                                                showCancel: false,
                                            });
                                        }
                                    },
                                });
                            } else {
                                app.globalData.showToast(res.data.msg);
                            }
                        },
                        fail: () => {
                            uni.hideLoading();
                            app.globalData.showToast(this.$t('common.internet_error_tips'));
                        },
                    });
                } else {
                    uni.showModal({
                        content: this.$t('common.ver_update_tips'),
                        showCancel: false,
                    });
                }
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
    .cash-item .name {
        min-width: 112rpx;
    }
</style>
