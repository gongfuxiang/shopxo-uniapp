<template>
    <view :class="theme_view">
        <!-- 导航 -->
        <view class="nav-base bg-white flex-row jc-sa align-c">
            <block v-for="(item, index) in nav_status_list" :key="index">
                <view :class="'item fl tc ' + (nav_status_index == index ? 'cr-main nav-active-line' : '')" :data-index="index" @tap="nav_event">{{ item.name }}</view>
            </block>
        </view>
        <!-- 列表 -->
        <scroll-view :scroll-y="true" class="scroll-box scroll-box-ece-nav" @scrolltolower="scroll_lower" lower-threshold="60">
            <view v-if="data_list.length > 0" class="data-list padding-horizontal-main padding-top-main">
                <view v-for="(item, index) in data_list" :key="index" class="item padding-main border-radius-main oh bg-white spacing-mb">
                    <view class="base oh br-b padding-bottom-main">
                        <text class="cr-base">{{ item.add_time }}</text>
                        <text class="fr cr-main">{{ item.status_name }}</text>
                    </view>
                    <view  class="margin-top">
                        <view v-if="(item.goods || null) != null" class="oh" :data-value="item.goods.goods_url" @tap="url_event">
                            <image :src="item.goods.images" mode="aspectFill" class="radius goods-images fl"></image>
                            <view class="goods-title multi-text fr">{{item.goods.title}}</view>
                        </view>
                        <view :data-value="'/pages/plugins/givegift/gift-detail/gift-detail?id=' + item.id" @tap="url_event" class="content margin-top-main cp">
                            <component-panel-content :propData="item" :propDataField="field_list" propExcludeField="status_name" propIsItemShowMax="6" :propIsTerse="true"></component-panel-content>
                        </view>
                    </view>
                    <view class="item-operation tr br-t padding-top-main margin-top-main">
                        <button class="round bg-white cr-base br-grey" type="default" size="mini" @tap="popup_edit_open_event" :data-index="index" hover-class="none">{{$t('common.edit')}}</button>
                        <block v-if="item.status == 0">
                            <button class="round bg-white cr-green br-green" type="default" size="mini" @tap="pay_event" :data-value="item.id" :data-price="item.total_price" :data-index="index" :data-payment="item.payment_id" hover-class="none">{{$t('order.order.1i873j')}}</button>
                            <button class="round bg-white cr-yellow br-yellow" type="default" size="mini" @tap="cancel_event" :data-value="item.id" :data-index="index" hover-class="none">{{$t('common.cancel')}}</button>
                        </block>
                        <block v-if="item.status == 1">
                            <button class="round bg-white cr-main br-main" type="default" size="mini" @tap="url_event" :data-value="'/pages/plugins/givegift/code/code?oid='+item.id" hover-class="none">{{$t('common.gift')}}</button>
                            <button class="round bg-white cr-green br-green" type="default" size="mini" @tap="url_event" :data-value="'/pages/plugins/givegift/receive/receive?key='+item.key" hover-class="none">{{$t('common.link')}}</button>
                        </block>
                        <button v-if="item.status == 2" class="round bg-white cr-red br-red" type="default" size="mini" @tap="delete_event" :data-value="item.id" :data-index="index" hover-class="none">{{$t('common.del')}}</button>
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

        <!-- 编辑弹层 -->
        <component-popup :propShow="popup_edit_status" propPosition="bottom" @onclose="popup_edit_close_event">
            <view class="padding-horizontal-main padding-top-main bg-white">
                <view class="close oh">
                    <view class="fr" @tap.stop="popup_edit_close_event">
                        <iconfont name="icon-close-o" size="28rpx" color="#999"></iconfont>
                    </view>
                </view>
                <view class="padding-bottom-main">
                    <view v-if="(edit_data || null) != null">
                        <form @submit="form_submit" class="form-container">
                            <view class="border-radius-main spacing-mb oh">
                                <view class="form-gorup">
                                    <view class="flex-row jc-sb align-c padding-top-sm">
                                        <view class="form-gorup-title">{{$t('givegift-gift.givegift-gift.567uye')}}</view>
                                        <input type="text" name="message_tips" :value="edit_data.message_tips || ''" class="br-b-f5 tr message-tips" placeholder-class="cr-grey-c" :placeholder="$t('givegift-gift.givegift-gift.rtyu33')" />
                                    </view>
                                </view>
                                <view class="form-gorup">
                                    <view class="flex-row jc-sb align-c padding-bottom-sm">
                                        <view class="form-gorup-title">{{$t('givegift-gift.givegift-gift.8yghjd')}}</view>
                                        <switch name="is_no_limit_receive" :checked="edit_data.is_no_limit_receive == 1" />
                                    </view>
                                </view>
                            </view>
                            <view class="padding-main">
                                <button class="bg-main br-main cr-white round text-size" type="default" form-type="submit" hover-class="none" :disabled="form_submit_disabled_status">{{$t('common.save')}}</button>
                            </view>
                        </form>
                    </view>
                    <block v-else>
                        <component-no-data propStatus="0"></component-no-data>
                    </block>
                </view>
            </view>
        </component-popup>

        <!-- 支付组件 -->
        <component-payment
            ref="payment"
            :propPayUrl="pay_url"
            :propQrcodeUrl="qrcode_url"
            propPayDataKey="order_id"
            :propPaymentList="payment_list"
            :propTempPayValue="temp_pay_value"
            :propTempPayIndex="temp_pay_index"
            :propPaymentId="payment_id"
            :propDefaultPaymentId="default_payment_id"
            :propPayPrice="pay_price"
            :propIsShowPayment="is_show_payment_popup"
            @close-payment-popup="payment_popup_event_close"
            @pay-success="order_item_pay_success_handle"
            :propNavDtatusIndex="nav_status_index"
            @reset-event="reset_event"
        ></component-payment>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentPanelContent from "@/components/panel-content/panel-content";
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    import componentPayment from '@/components/payment/payment';
    import componentPopup from '@/components/popup/popup';
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
                edit_data: null,
                popup_edit_status: false,
                edit_item_index: 0,
                form_submit_disabled_status: false,
                nav_status_list: [],
                nav_status_index: 0,
                field_list: [],
                // 支付弹窗参数
                pay_url: '',
                qrcode_url: '',
                payment_list: [],
                temp_pay_value: '',
                temp_pay_index: 0,
                payment_id: 0,
                default_payment_id: 0,
                is_show_payment_popup: false,
                pay_price: 0,
            };
        },
        components: {
            componentCommon,
            componentPanelContent,
            componentPayment,
            componentNoData,
            componentBottomLine,
            componentPopup
        },
        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 参数处理
            params = app.globalData.launch_params_handle(params);

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
                nav_status_index: nav_status_index,
            });
            this.init();
        },
        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

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
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    this.setData({
                        pay_url: app.globalData.get_request_url('pay', 'gift', 'givegift'),
                        qrcode_url: app.globalData.get_request_url('paycheck', 'gift', 'givegift'),
                    });
                    // 获取数据
                    this.get_data();
                } else {
                    this.setData({
                        data_list_loding_status: 0,
                        data_bottom_line_status: false,
                    });
                }
            },
            
            // 获取公共数据
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url('init', 'gift', 'givegift'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
                                payment_list: data.payment_list || [],
                                default_payment_id: data.default_payment_id || 0,
                                nav_status_list: data.nav_status_list || [],
                                data_list_loding_status: 0,
                                data_bottom_line_status: false,
                                data_page: 1,
                            });
                            this.get_data_list();
                        } else {
                            this.setData({
                                data_bottom_line_status: false,
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg,
                            });
                            if (app.globalData.is_login_check(res.data, this, 'get_data_base')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_bottom_line_status: false,
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 列表数据
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

                // 请求数据
                var data = {
                    page: this.data_page,
                };

                // 状态
                var status = (this.nav_status_list[this.nav_status_index] || null) == null ? -1 : this.nav_status_list[this.nav_status_index]['value'];
                if (status != -1) {
                    data['status'] = status;
                }

                // 获取数据
                uni.request({
                    url: app.globalData.get_request_url('index', 'gift', 'givegift'),
                    method: 'POST',
                    data: data,
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
                                    data_list: temp_data_list,
                                    data_total: data.data_total,
                                    data_page_total: data.page_total,
                                    field_list: data.field_list || [],
                                    data_list_loding_status: 3,
                                    data_page: this.data_page + 1,
                                    data_is_loading: 0,
                                });
                                // 是否还有数据
                                this.setData({
                                    data_bottom_line_status: this.data_list.length > 0 && this.data_page > 1 && this.data_page > this.data_page_total,
                                });

                                // 下订单支付处理
                                var key = app.globalData.data.cache_page_pay_key;
                                var pay_data = uni.getStorageSync(key) || null;
                                if (pay_data != null && (pay_data.order_ids || null) != null && (pay_data.payment_id || null) != null) {
                                    uni.removeStorageSync(key);
                                    this.setData({
                                        temp_pay_value: pay_data.order_ids,
                                        payment_id: pay_data.payment_id,
                                    });
                                    if ((this.$refs.payment || null) != null) {
                                        this.$refs.payment.pay_handle(pay_data.order_ids, pay_data.payment_id, this.payment_list);
                                    }
                                }
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

            // 滚动加载
            scroll_lower(e) {
                this.get_data_list();
            },

            // 支付
            pay_event(e) {
                this.setData({
                    is_show_payment_popup: true,
                    temp_pay_value: e.currentTarget.dataset.value,
                    temp_pay_index: e.currentTarget.dataset.index,
                    pay_price: e.currentTarget.dataset.price,
                    payment_id: e.currentTarget.dataset.payment || '',
                });
            },

            // 支付弹窗关闭
            payment_popup_event_close(e) {
                this.setData({
                    is_show_payment_popup: false,
                });
            },

            // 重置列表数据
            reset_event() {
                this.get_data_list();
            },

            // 支付成功数据设置
            order_item_pay_success_handle(data) {
                var order_ids_arr = data.order_id.toString().split(',');
                var temp_data_list = this.data_list;
                for (var i in temp_data_list) {
                    if (order_ids_arr.indexOf(temp_data_list[i]['id'].toString()) != -1) {
                        temp_data_list[i]['pay_price'] = temp_data_list[i]['total_price'];
                        temp_data_list[i]['status'] = 1;
                        temp_data_list[i]['status_name'] = this.$t('order.order.s8g966');
                    }
                }
                this.setData({
                    data_list: temp_data_list,
                });
            },

            // 取消
            cancel_event(e) {
                uni.showModal({
                    title: this.$t('common.warm_tips'),
                    content: this.$t('order.order.pn78ns'),
                    confirmText: this.$t('common.confirm'),
                    cancelText: this.$t('recommend-list.recommend-list.w9460o'),
                    success: (result) => {
                        if (result.confirm) {
                            // 参数
                            var id = e.currentTarget.dataset.value;
                            var index = e.currentTarget.dataset.index;
                            // 加载loding
                            uni.showLoading({
                                title: this.$t('common.processing_in_text'),
                            });
                            uni.request({
                                url: app.globalData.get_request_url('cancel', 'gift', 'givegift'),
                                method: 'POST',
                                data: {
                                    ids: id,
                                },
                                dataType: 'json',
                                success: (res) => {
                                    uni.hideLoading();
                                    if (res.data.code == 0) {
                                        var temp_data_list = this.data_list;
                                        temp_data_list[index]['status'] = 2;
                                        temp_data_list[index]['status_name'] = this.$t('order.order.1k98tk');
                                        this.setData({
                                            data_list: temp_data_list,
                                        });
                                        app.globalData.showToast(res.data.msg, 'success');
                                    } else {
                                        app.globalData.showToast(res.data.msg);
                                    }
                                },
                                fail: () => {
                                    uni.hideLoading();
                                    app.globalData.showToast(this.$t('common.internet_error_tips'));
                                },
                            });
                        }
                    },
                });
            },

            // 删除
            delete_event(e) {
                uni.showModal({
                    title: this.$t('common.warm_tips'),
                    content: this.$t('recommend-list.recommend-list.54d418'),
                    confirmText: this.$t('common.confirm'),
                    cancelText: this.$t('recommend-list.recommend-list.w9460o'),
                    success: (result) => {
                        if (result.confirm) {
                            // 参数
                            var id = e.currentTarget.dataset.value;
                            var index = e.currentTarget.dataset.index;
                            // 加载loding
                            uni.showLoading({
                                title: this.$t('common.processing_in_text'),
                            });
                            uni.request({
                                url: app.globalData.get_request_url('delete', 'gift', 'givegift'),
                                method: 'POST',
                                data: {
                                    ids: id,
                                },
                                dataType: 'json',
                                success: (res) => {
                                    uni.hideLoading();
                                    if (res.data.code == 0) {
                                        var temp_data_list = this.data_list;
                                        temp_data_list.splice(index, 1);
                                        this.setData({
                                            data_list: temp_data_list,
                                        });
                                        if (temp_data_list.length == 0) {
                                            this.setData({
                                                data_list_loding_status: 0,
                                                data_bottom_line_status: false,
                                            });
                                        }
                                        app.globalData.showToast(res.data.msg, 'success');
                                    } else {
                                        app.globalData.showToast(res.data.msg);
                                    }
                                },
                                fail: () => {
                                    uni.hideLoading();
                                    app.globalData.showToast(this.$t('common.internet_error_tips'));
                                },
                            });
                        }
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

            // 编辑开启弹层
            popup_edit_open_event(e) {
                var index = e.currentTarget.dataset.index || 0;
                this.setData({
                    popup_edit_status: true,
                    edit_data: this.data_list[index],
                    edit_item_index: index
                });
            },

            // 编辑弹层关闭
            popup_edit_close_event(e) {
                this.setData({
                    popup_edit_status: false,
                });
            },

            // 数据提交
            form_submit(e) {
                var form_data = e.detail.value;
                form_data['is_no_limit_receive'] = form_data.is_no_limit_receive == true ? 1 : 0;
                form_data['id'] = this.edit_data.id;
                this.setData({
                    form_submit_disabled_status: true,
                });
                uni.showLoading({
                    title: this.$t('common.processing_in_text'),
                });
                uni.request({
                    url: app.globalData.get_request_url('save', 'gift', 'givegift'),
                    method: 'POST',
                    data: form_data,
                    dataType: 'json',
                    success: (res) => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            var temp_data = this.data_list;
                            var index = this.edit_item_index;
                            temp_data[index]['is_no_limit_receive_name'] = form_data.is_no_limit_receive == 1 ? this.$t('common.yes_text') : this.$t('common.no_text');
                            temp_data[index]['is_no_limit_receive'] = form_data.is_no_limit_receive;
                            temp_data[index]['message_tips'] = form_data.message_tips;
                            this.setData({
                                data_list: temp_data,
                                form_submit_disabled_status: false,
                                popup_edit_status: false
                            });
                            app.globalData.showToast(res.data.msg, 'success');
                        } else {
                            this.setData({
                                form_submit_disabled_status: false,
                            });
                            if (app.globalData.is_login_check(res.data, this, 'form_submit', e)) {
                                app.globalData.showToast(res.data.msg);
                            } else {
                                app.globalData.showToast(this.$t('common.sub_error_retry_tips'));
                            }
                        }
                    },
                    fail: () => {
                        this.setData({
                            form_submit_disabled_status: false,
                        });
                        uni.hideLoading();
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
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
    @import './gift.css';
</style>