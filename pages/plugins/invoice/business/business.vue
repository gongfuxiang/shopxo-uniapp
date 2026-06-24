<template>
    <view :class="theme_view">
        <view v-if="data_list.length > 0" class="data-list">
            <scroll-view :scroll-y="true" class="scroll-box" @scrolltolower="scroll_lower" lower-threshold="60">
                <view class="padding-horizontal-main padding-top-main" :class="select_ids.length > 0 ? 'page-bottom-fixed' : ''">
                    <view v-for="(item, index) in data_list" :key="index" class="item padding-main border-radius-main oh bg-white spacing-mb">
                        <view class="base oh br-b-dashed padding-bottom-main">
                            <view class="dis-inline-block va-m" data-type="node" :data-value="item.id" @tap="selected_event">
                                <iconfont
                                    propClass="margin-right-sm pr top-xs"
                                    :name="select_ids.indexOf(item.id) != -1 ? 'icon-selected-solid' : 'icon-not-selected'"
                                    size="40rpx"
                                    :color="select_ids.indexOf(item.id) != -1 ? '#E22C08' : '#999'"
                                ></iconfont>
                            </view>
                            <text class="va-m">{{ item[business_no_field] }}</text>
                            <text class="fr">{{ item[business_price_field] }}</text>
                        </view>
                        <view :class="'content margin-top ' + ((business_detail_page || null) != null && business_detail_page != '' ? 'cp' : '')" :data-value="((business_detail_page || null) != null && business_detail_page != '') ? (business_detail_page + item.id) : ''" @tap="content_event">
                            <component-panel-content :propData="item" :propDataField="field_list" :propExcludeField="business_exclude_field" :propIsTerse="true"></component-panel-content>
                        </view>
                        <view class="item-operation tr margin-top-main">
                            <button class="round bg-white br-grey-9 text-size-md" type="default" size="mini" hover-class="none" :data-ids="item.id" data-type="item" @tap="invoice_event">{{$t('invoice-saveinfo.invoice-saveinfo.89815t')}}</button>
                        </view>
                    </view>
                    <!-- 结尾 -->
                    <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
                </view>
            </scroll-view>
            <!-- 合并开票 -->
            <view v-if="select_ids.length > 0" class="bottom-fixed" :style="bottom_fixed_style">
                <view class="bottom-line-exclude">
                    <button class="item bg-white cr-main br-main round wh-auto" type="default" hover-class="none" data-type="all" @tap="invoice_event">{{$t('order.order.o411h6')}}</button>
                </view>
            </view>
        </view>
        <block v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status"></component-no-data>
        </block>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    import componentPanelContent from "@/components/panel-content/panel-content";

    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                data_base: null,
                field_list: [],
                data_list: [],
                data_total: 0,
                data_page_total: 0,
                data_page: 1,
                data_list_loding_status: 1,
                data_bottom_line_status: false,
                data_is_loading: 0,
                bottom_fixed_style: '',
                params: null,
                select_ids: [],
                business_type: 0,
                business_control: '',
                business_no_field: 'order_no',
                business_price_field: 'pay_price',
                business_detail_page: '',
                business_exclude_field: 'order_no,pay_price',
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
            componentPanelContent
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 业务类型
            var business_type = parseInt(params.type || 0);
            if(isNaN(business_type) || business_type <= 0) {
                app.globalData.showToast(this.$t('common.data_error'));
                setTimeout(function() {
                    app.globalData.page_back_prev_event();
                }, 1500);
                return false;
            }

            // 设置参数
            this.setData({
                params: params,
                business_type: business_type,
            });
            this.init_business_config(business_type);
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 加载数据
            this.init();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }

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
            // 初始化业务配置
            init_business_config(business_type) {
                var temp = null;
                var list = app.globalData.invoice_business_list || [];
                if(list.length > 0) {
                    for(var i in list) {
                        if(parseInt(list[i]['type']) == business_type) {
                            temp = list[i];
                            break;
                        }
                    }
                }
                if(temp == null) {
                    var type_map = {
                        1: { control: 'recharge', no_field: 'recharge_no', price_field: 'pay_money', detail_page: '/pages/plugins/wallet/user-recharge-detail/user-recharge-detail?id=', name: this.$t('invoice.invoice.bh8yt3') },
                        2: { control: 'givegift', no_field: 'order_no', price_field: 'pay_price', detail_page: '', name: '送礼开票' },
                        3: { control: 'presale', no_field: 'order_no', price_field: 'pay_price', detail_page: '', name: '预售开票' },
                        4: { control: 'vip', no_field: 'payment_user_order_no', price_field: 'pay_price', detail_page: '', name: '超级会员开票' },
                        5: { control: 'scanpay', no_field: 'order_no', price_field: 'pay_price', detail_page: '', name: '扫码收款开票' },
                    };
                    temp = type_map[business_type] || null;
                }
                if(temp == null) {
                    app.globalData.showToast(this.$t('common.no_data'));
                    return false;
                }
                this.setData({
                    business_control: temp.control || '',
                    business_no_field: temp.no_field || 'order_no',
                    business_price_field: temp.price_field || 'pay_price',
                    business_detail_page: temp.detail_page || '',
                    business_exclude_field: (temp.no_field || 'order_no') + ',' + (temp.price_field || 'pay_price'),
                });
                uni.setNavigationBarTitle({
                    title: temp.name || this.$t('invoice-saveinfo.invoice-saveinfo.89815t'),
                });
            },

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
                if((this.business_control || null) == null || this.business_control == '') {
                    return false;
                }

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
                    url: app.globalData.get_request_url('index', this.business_control, 'invoice'),
                    method: 'POST',
                    data: {
                        page: this.data_page,
                    },
                    dataType: 'json',
                    success: (res) => {
                        if(this.data_page > 1) {
                            uni.hideLoading();
                        }
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            if (data.data_list.length > 0) {
                                if (this.data_page <= 1) {
                                    var temp_data_list = data.data_list;
                                } else {
                                    var temp_data_list = this.data_list || [];
                                    var temp_data = data.data_list;
                                    for (var i in temp_data) {
                                        temp_data_list.push(temp_data[i]);
                                    }
                                }
                                this.setData({
                                    data_base: data.base || null,
                                    field_list: data.field_list || [],
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

            // 选择
            selected_event(e) {
                var value = e.currentTarget.dataset.value;
                var temp_select_ids = this.select_ids;
                var index = temp_select_ids.indexOf(value);
                if (index == -1) {
                    temp_select_ids.push(value);
                } else {
                    temp_select_ids.splice(index, 1);
                }
                this.setData({
                    select_ids: temp_select_ids,
                });
            },

            // 合并开票
            invoice_event(e) {
                var type = e.currentTarget.dataset.type || 'all';
                var ids = e.currentTarget.dataset.ids || null;
                if (type == 'all') {
                    if (this.select_ids.length <= 0) {
                        app.globalData.showToast(this.$t('order.order.15k32o'));
                        return false;
                    } else {
                        ids = this.select_ids.join(',');
                    }
                } else {
                    if (ids === null) {
                        app.globalData.showToast(this.$t('order.order.3fr155'));
                        return false;
                    }
                }
                app.globalData.url_open('/pages/plugins/invoice/invoice-saveinfo/invoice-saveinfo?ids=' + ids + '&type=' + this.business_type + '&is_redirect=1');
            },

            // 内容点击
            content_event(e) {
                if((this.business_detail_page || null) == null || this.business_detail_page == '') {
                    return false;
                }
                app.globalData.url_event(e);
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            }
        },
    };
</script>
<style scoped>
    @import './business.css';
</style>
