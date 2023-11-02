<template>
    <view>
        <view v-if="(data || null) !== null" class="page-pay-fixed">
            <view class="padding-main">
                <block v-if="(data.scanpay_info || null) !== null">
                    <view class="flex-row align-c margin-top-main margin-bottom-xl">
                        <image v-if="data.scanpay_info.logo" :src="data.scanpay_info.logo" mode="widthFix" class="circle img-user br margin-right-main" />
                        <div class="flex-1 flex-width flex-row align-c">
                            <text class="text-size fw-b single-text">{{ data.scanpay_info.name }}</text>
                            <text v-if="(data.scanpay_info.alias || null) !== null" class="cr-white badge tc margin-left-sm">{{ data.scanpay_info.alias }}</text>
                        </div>
                    </view>
                </block>
                <view class="bg-white border-radius-main padding-main spacing-mb">
                    <view class="flex-row jc-sb align-c">
                        <view class="text-size cr-grey-9 title-padding">消费金额</view>
                        <view class="flex-1 flex-width tr">
                            <view class="pay-price" :class="form.price ? '' : 'cr-grey-9'">
                                <text class="unit">{{ currency_symbol }}</text>
                                <text class="price fw-b text-size-xl"> {{ form.price || '0.00' }} </text>
                            </view>
                        </view>
                    </view>
                </view>
                <view class="bg-white border-radius-main padding-main spacing-mb">
                    <view class="text-size fw-b spacing-mb">支付方式</view>
                    <view class="flex-col" :class="is_more ? 'pay-scroll' : ''">
                        <view v-for="(item, index) in is_more ? data.payment_list : data.payment_list.slice(0, 2)" :key="index" class="flex-row jc-sb align-c padding-vertical-sm" @tap="change_event(index, item.id)">
                            <div class="flex-1 flex-width flex-row align-c">
                                <image v-if="item.logo" :src="item.logo" mode="widthFix" class="circle img-pay margin-right-main" />
                                <view>{{ item.name }}</view>
                                <view v-if="(item.tips || null) !== null" class="va-m cr-red text-size-xs">（{{ item.tips }}元）</view>
                            </div>
                            <iconfont :name="checked === index ? 'icon-zhifu-yixuan' : 'icon-zhifu-weixuan'" size="40rpx" :color="checked === index ? '#E83B11' : '#ddd'"></iconfont>
                        </view>
                    </view>
                    <view v-if="data.payment_list.length > 2" class="br-t margin-top-sm padding-top-main tc cr-grey-9" @tap="more_event">
                        <text>更多</text>
                        <iconfont :name="is_more ? 'icon-mendian-jiantou2' : 'icon-fenlei-top'" size="24rpx"></iconfont>
                    </view>
                </view>
            </view>
            <view class="bottom-fixed sub-key">
                <view class="tc text-size-xs spacing-mb">
                    <block v-if="!form.note">
                        <view class="cr-blue" @tap="add_desc_event">添加备注</view>
                    </block>
                    <block v-else>
                        <view class="flex-row align-c jc-c padding-horizontal-main">
                            <text class="cr-grey-9 single-text tc">{{ form.note }}</text>
                            <view class="cr-blue margin-left-sm edit-width" @tap="add_desc_event">修改</view>
                        </view>
                    </block>
                    <!-- 输入框示例 -->
                    <uni-popup ref="inputDialog" type="dialog" :animation="false">
                        <view class="dialog-container">
                            <view class="dialog-title">
                                <text>备注</text>
                            </view>
                            <view class="dialog-content">
                                <input type="text" class="dialog-input" maxlength="200" @input="input_change" />
                            </view>
                            <view class="dialog-btn-group">
                                <view class="dialog-btn cr-grey-9" @tap="input_dialog_colse">取消</view>
                                <view class="dialog-btn divider-l" @tap="input_dialog_open">确定</view>
                            </view>
                        </view>
                    </uni-popup>
                </view>
                <view class="bg-white tc text-size-xl fw-b sub-key-content">
                    <view class="flex-row">
                        <view class="flex-1 key-1 br-r-f5 br-b-f5 key-num" @tap="key_up_event('1')">1</view>
                        <view class="flex-1 key-1 br-r-f5 br-b-f5 key-num" @tap="key_up_event('2')">2</view>
                        <view class="flex-1 key-1 br-r-f5 br-b-f5 key-num" @tap="key_up_event('3')">3</view>
                        <view class="flex-1 key-1 br-b-f5 key-num" @tap="key_up_event('del')">
                            <iconfont name="icon-keyboard-backspace" color="#333" size="68rpx" class="fw-n"></iconfont>
                        </view>
                    </view>
                    <view class="flex-row">
                        <view class="flex-3">
                            <view class="flex-row">
                                <view class="flex-1 key-1 br-r-f5 br-b-f5 key-num" @tap="key_up_event('4')">4</view>
                                <view class="flex-1 key-1 br-r-f5 br-b-f5 key-num" @tap="key_up_event('5')">5</view>
                                <view class="flex-1 key-1 br-r-f5 br-b-f5 key-num" @tap="key_up_event('6')">6</view>
                            </view>
                            <view class="flex-row">
                                <view class="flex-1 key-1 br-r-f5 br-b-f5 key-num" @tap="key_up_event('7')">7</view>
                                <view class="flex-1 key-1 br-r-f5 br-b-f5 key-num" @tap="key_up_event('8')">8</view>
                                <view class="flex-1 key-1 br-r-f5 br-b-f5 key-num" @tap="key_up_event('9')">9</view>
                            </view>
                            <view class="flex-row">
                                <view class="flex-2 key-1 br-r-f5 key-num" @tap="key_up_event('0')">0</view>
                                <view class="flex-1 key-1 repair br-r-f5 key-num" @tap="key_up_event('.')">.</view>
                            </view>
                        </view>
                        <view class="flex-1 bg-red cr-white key-num sub" @tap="key_up_event('sub')">
                            <view class="flex-col jc-c ht-auto">
                                <view class="fw-n">支付</view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <!-- 支付弹窗 -->
            <component-payment
                ref="payment"
                :prop-pay-url="pay_url"
                :prop-qrcode-url="qrcode_url"
                :prop-payment-list="data.payment_list"
                :prop-temp-pay-value="temp_pay_value"
                :prop-pay-price="pay_price"
                :prop-payment-id="payment_id"
                :propIsRedirectTo="true"
                :propIsFailAlert="false"
                :propToPage="to_page"
                :propToFailPage="to_fail_page"
                :prop-to-appoint-page="to_appoint_page"
                :prop-is-show-payment="is_show_payment_popup"
                @close-payment-poupon="payment_popup_event_close"
            ></component-payment>
        </view>
        <view v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </view>
    </view>
</template>

<script>
    const app = getApp();
    import componentNoData from '../../../../components/no-data/no-data';
    import componentPayment from '@/components/payment/payment';
    export default {
        data() {
            return {
                // 基础配置
                currency_symbol: app.globalData.data.currency_symbol,
                data: null,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                checked: 0,
                is_more: false,
                form: {
                    price: '',
                    note: '',
                    payment_id: '',
                },
                params: {},

                // 支付弹窗参数
                pay_url: '',
                qrcode_url: '',
                // payment_list: [],
                temp_pay_value: '',
                is_show_payment_popup: false,
                pay_price: 0,
                payment_id: 0,
                // 指定所有页面跳转到指定页面------除现金支付外
                to_page: '',
                // 现金支付跳转的页面
                to_appoint_page: '',
                // 失败跳转
                to_fail_page: '',

                input_value: '',
            };
        },

        components: {
            componentNoData,
            componentPayment,
        },

        onLoad(params) {
            this.setData({
                params: params || {},
            });
            this.init();
        },

        onShow() {},

        // 下拉刷新
        onPullDownRefresh() {
            this.get_data();
        },

        methods: {
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    // 用户未绑定手机则转到登录页面
                    if (app.globalData.user_is_need_login(user)) {
                        uni.stopPullDownRefresh();
                        uni.navigateTo({
                            url: '/pages/login/login?event_callback=init',
                        });
                    } else {
                        this.setData({
                            pay_url: app.globalData.get_request_url('pay', 'index', 'scanpay'),
                            qrcode_url: app.globalData.get_request_url('paycheck', 'index', 'scanpay'),
                        });
                        this.get_data();
                    }
                }
            },
            // 获取数据
            get_data() {
                // 加载loding
                uni.showLoading({
                    title: '加载中...',
                });
                uni.request({
                    url: app.globalData.get_request_url('index', 'index', 'scanpay'),
                    method: 'POST',
                    data: this.params,
                    dataType: 'json',
                    success: (res) => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var new_form = this.form;
                            var data = res.data.data || null;
                            if (data != null) {
                                new_form.payment_id = data.payment_list[0].id;
                            }
                            this.setData({
                                data: res.data.data,
                                form: new_form,
                                data_list_loding_msg: '',
                                data_list_loding_status: 0,
                            });

                            // 标题
                            if (data != null && (data.scanpay_info || null) != null) {
                                uni.setNavigationBarTitle({
                                    title: data.scanpay_info.name + '收款',
                                });
                            }
                        } else {
                            this.setData({
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg,
                            });
                            if (app.globalData.is_login_check(res.data, this, 'get_data')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: '服务器请求出错',
                        });
                        app.globalData.showToast('服务器请求出错');
                    },
                });
            },

            // 选择支付方式
            change_event(i, id) {
                var new_data = this.form;
                new_data.payment_id = id;
                this.setData({
                    checked: i,
                    form: new_data,
                });
            },
            // 更多

            more_event() {
                this.setData({
                    is_more: !this.is_more,
                });
            },

            // 备注
            add_desc_event() {
                this.$refs.inputDialog.open();
            },

            input_change(e) {
                this.setData({
                    input_value: e.detail.value,
                });
            },

            // 提交备注
            input_dialog_colse(val) {
                this.setData({
                    input_value: this.form.note,
                });
                // 关闭窗口后，恢复默认内容
                this.$refs.inputDialog.close();
            },

            // 打开备注框
            input_dialog_open() {
                var new_data = this.form;
                new_data.note = this.input_value;
                this.setData({
                    form: new_data,
                });
                // 关闭窗口后，恢复默认内容
                this.$refs.inputDialog.close();
            },

            // 键盘点击事件
            key_up_event(v) {
                var price = this.form.price;
                if (v === 'del') {
                    this.concat_string(price.slice(0, -1));
                } else if (v === '.') {
                    // 判断输入框是否有值，如果没值则不允许输入
                    if (price.length > 0) {
                        // 判断是否已经存在‘。’如果存在则不允许输入
                        if (price.indexOf(v) == -1) {
                            this.concat_string(price + v);
                        }
                    } else {
                        this.concat_string('0' + v);
                    }
                } else if (v === '0') {
                    if (price.length > 0) {
                        this.control_price(price, v);
                    } else {
                        this.concat_string(price + v);
                    }
                } else if (v === 'sub') {
                    this.form_submit();
                } else {
                    if (price.length > 0) {
                        this.control_price(price, v);
                    } else {
                        this.concat_string(price + v);
                    }
                }

                // 触感振动
                uni.vibrateShort();
            },

            // 提交订单
            form_submit() {
                var new_data = {
                    ...this.params,
                    ...this.form,
                };
                var validation = [{ fields: 'price', msg: '请输入消费金额' }];
                if (app.globalData.fields_check(new_data, validation)) {
                    // 加载loding
                    uni.showLoading({
                        title: '加载中...',
                    });
                    uni.request({
                        url: app.globalData.get_request_url('created', 'index', 'scanpay'),
                        method: 'POST',
                        data: new_data,
                        dataType: 'json',
                        success: (res) => {
                            uni.hideLoading();
                            uni.stopPullDownRefresh();
                            if (res.data.code == 0) {
                                this.setData({
                                    to_page: '/pages/plugins/scanpay/tips/tips?id=' + res.data.data.id,
                                    to_appoint_page: '/pages/plugins/scanpay/tips/tips?id=' + res.data.data.id,
                                    to_fail_page: '/pages/plugins/scanpay/tips/tips?id=' + res.data.data.id,
                                });
                                this.$refs.payment.pay_handle(res.data.data.id, this.form.payment_id);
                            } else {
                                if (app.globalData.is_login_check(res.data, this, 'form_submit')) {
                                    app.globalData.showToast(res.data.msg);
                                }
                            }
                        },
                        fail: () => {
                            uni.hideLoading();
                            uni.stopPullDownRefresh();
                            app.globalData.showToast('服务器请求出错');
                        },
                    });
                }
            },

            // 消费金额更新
            concat_string(price) {
                var new_data = this.form;
                new_data.price = price;
                this.setData({
                    form: new_data,
                });
            },

            // 数字键盘业务处理
            control_price(price, num) {
                // 判断输入框第一个字符是否是0
                if (price.substring(0, 1) == '0') {
                    if (price.indexOf('.') !== -1) {
                        var index = price.lastIndexOf('.');
                        if (price.substring(index + 1, price.length).length < 2) {
                            this.concat_string(price + num);
                        }
                    }
                } else {
                    if (price.indexOf('.') !== -1) {
                        // 判断是否含有小数点
                        var index = price.lastIndexOf('.');
                        if (price.substring(index + 1, price.length).length < 2) {
                            this.concat_string(price + num);
                        }
                    } else {
                        if (price.length < 8) {
                            this.concat_string(price + num);
                        }
                    }
                }
            },

            // 支付弹窗关闭
            payment_popup_event_close() {
                this.setData({
                    is_show_payment_popup: false,
                });
            },
        },
    };
</script>

<style scoped>
    @import './index.css';
</style>
