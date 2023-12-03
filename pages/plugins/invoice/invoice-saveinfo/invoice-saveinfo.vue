<template>
    <view :class="theme_view">
        <view class="page-bottom-fixed">
            <view v-if="save_base_data != null && save_base_data.total_price > 0">
                <form @submit="formSubmit" class="form-container">
                    <view class="padding-main oh">
                        <view class="padding-main border-radius-main bg-white spacing-mb">
                            <view>
                                <text class="cr-base margin-right-sm">发票金额</text>
                                <text class="cr-main text-size fw-b">{{ save_base_data.total_price }}</text>
                            </view>
                            <view class="cr-base margin-top-sm">{{ save_base_data.business_desc }}</view>
                        </view>

                        <view class="border-radius-main bg-white oh spacing-mb">
                            <view class="form-gorup">
                                <view class="form-gorup-title">发票类型<text class="form-group-tips-must">*</text></view>
                                <picker name="invoice_type" @change="form_invoice_type_event" :value="form_invoice_type_index" :range="can_invoice_type_list" range-key="name">
                                    <view :class="'picker ' + (can_invoice_type_list[form_invoice_type_index] == undefined ? 'cr-grey' : 'cr-base') + ' arrow-right'">
                                        {{ can_invoice_type_list[form_invoice_type_index] == undefined ? '请选择发票类型' : can_invoice_type_list[form_invoice_type_index]['name'] }}
                                    </view>
                                </picker>
                            </view>

                            <view class="form-gorup">
                                <view class="form-gorup-title">申请类型<text class="form-group-tips-must">*</text></view>
                                <picker name="apply_type" @change="form_apply_type_event" :disabled="form_apply_type_disabled" :value="form_apply_type_index" :range="apply_type_list" range-key="name">
                                    <view :class="'picker ' + (apply_type_list[form_apply_type_index] == undefined ? 'cr-grey' : 'cr-base') + ' arrow-right'">
                                        {{ apply_type_list[form_apply_type_index] == undefined ? '请选择申请类型' : apply_type_list[form_apply_type_index]['name'] }}
                                    </view>
                                </picker>
                            </view>

                            <view v-if="invoice_content_list.length > 0" class="form-gorup">
                                <view class="form-gorup-title">发票内容<text class="form-group-tips-must">*</text></view>
                                <picker name="invoice_content" @change="form_invoice_content_event" :value="form_invoice_content_index" :range="invoice_content_list">
                                    <view :class="'picker ' + (invoice_content_list[form_invoice_content_index] == undefined ? 'cr-grey' : 'cr-base') + ' arrow-right'">
                                        {{ invoice_content_list[form_invoice_content_index] == undefined ? '请选择发票内容' : invoice_content_list[form_invoice_content_index] }}
                                    </view>
                                </picker>
                            </view>

                            <view class="form-gorup">
                                <view class="form-gorup-title">发票抬头<text class="form-group-tips-must">*</text></view>
                                <input type="text" name="invoice_title" placeholder-class="cr-grey" class="cr-base" placeholder="发票抬头、最多200个字符" maxlength="200" :value="data.invoice_title || ''" />
                            </view>

                            <!-- 企业信息 -->
                            <view v-if="company_container">
                                <view class="form-gorup">
                                    <view class="form-gorup-title">企业统一社会信用代码或纳税识别号<text class="form-group-tips-must">*</text> </view>
                                    <input type="text" name="invoice_code" placeholder-class="cr-grey" class="cr-base" placeholder="企业统一社会信用代码或纳税识别号、最多160个字符" maxlength="160" :value="data.invoice_code || ''" />
                                </view>
                            </view>

                            <!-- 企业专票信息 -->
                            <view v-if="company_special_container">
                                <view class="form-gorup">
                                    <view class="form-gorup-title">企业开户行名称<text class="form-group-tips-must">*</text></view>
                                    <input type="text" name="invoice_bank" placeholder-class="cr-grey" class="cr-base" placeholder="企业开户行名称、最多200个字符" maxlength="200" :value="data.invoice_bank || ''" />
                                </view>
                                <view class="form-gorup">
                                    <view class="form-gorup-title">企业开户帐号<text class="form-group-tips-must">*</text></view>
                                    <input type="text" name="invoice_account" placeholder-class="cr-grey" class="cr-base" placeholder="企业开户帐号、最多160个字符" maxlength="160" :value="data.invoice_account || ''" />
                                </view>
                                <view class="form-gorup">
                                    <view class="form-gorup-title">企业联系电话<text class="form-group-tips-must">*</text></view>
                                    <input type="text" name="invoice_tel" placeholder-class="cr-grey" class="cr-base" placeholder="企业联系电话 6~15 个字符" maxlength="15" :value="data.invoice_tel || ''" />
                                </view>
                                <view class="form-gorup">
                                    <view class="form-gorup-title">企业注册地址<text class="form-group-tips-must">*</text></view>
                                    <input type="text" name="invoice_address" placeholder-class="cr-grey" class="cr-base" placeholder="企业注册地址、最多230个字符" maxlength="230" :value="data.invoice_address || ''" />
                                </view>
                            </view>

                            <!-- 收件人信息 -->
                            <view v-if="addressee_container">
                                <view class="form-gorup">
                                    <view class="form-gorup-title">收件人姓名<text class="form-group-tips-must">*</text></view>
                                    <input type="text" name="name" placeholder-class="cr-grey" class="cr-base" placeholder="收件人姓名格式 2~30 个字符之间" maxlength="30" :value="data.name || ''" />
                                </view>
                                <view class="form-gorup">
                                    <view class="form-gorup-title">收件人电话<text class="form-group-tips-must">*</text></view>
                                    <input type="text" name="tel" placeholder-class="cr-grey" class="cr-base" placeholder="收件人电话 6~15 个字符" maxlength="15" :value="data.tel || ''" />
                                </view>
                                <view class="form-gorup">
                                    <view class="form-gorup-title">收件人地址<text class="form-group-tips-must">*</text></view>
                                    <input type="text" name="address" placeholder-class="cr-grey" class="cr-base" placeholder="收件人地址、最多230个字符" maxlength="230" :value="data.address || ''" />
                                </view>
                            </view>

                            <!-- 电子邮箱信息 -->
                            <view v-if="email_container">
                                <view class="form-gorup">
                                    <view class="form-gorup-title">电子邮箱</view>
                                    <input type="text" name="email" placeholder-class="cr-grey" class="cr-base" placeholder="电子邮箱、最多60个字符" maxlength="60" :value="data.email || ''" />
                                </view>
                            </view>

                            <view class="form-gorup">
                                <view class="form-gorup-title">备注</view>
                                <input type="text" name="user_note" placeholder-class="cr-grey" class="cr-base" placeholder="备注最多230个字符" maxlength="60" :value="data.user_note || ''" />
                            </view>
                        </view>
                        <view class="bottom-fixed invoice-bottom">
                            <view class="bottom-line-exclude">
                                <button class="bg-main br-main cr-white round text-size" type="default" form-type="submit" hover-class="none" :loading="form_submit_loading" :disabled="form_submit_loading">提交</button>
                            </view>
                        </view>
                    </view>
                </form>
            </view>
            <view v-else>
                <!-- 提示信息 -->
                <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
            </view>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import componentNoData from '../../../../components/no-data/no-data';

    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                params: null,
                form_submit_loading: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_bottom_line_status: false,
                data_base: null,
                apply_type_list: [],
                can_invoice_type_list: [],
                invoice_content_list: [],
                save_base_data: null,
                data: null,
                form_invoice_type_index: 0,
                form_apply_type_index: 0,
                form_invoice_content_index: 0,
                form_apply_type_disabled: false,
                company_container: false,
                company_special_container: false,
                addressee_container: false,
                email_container: true,
            };
        },

        components: {
            componentNoData,
        },
        props: {},

        onLoad(params) {
            this.setData({
                params: params,
            });
            this.init();
        },

        onReady: function () {
            uni.setNavigationBarTitle({
                title: '开票' + ((this.params.id || null) == null ? '添加' : '编辑'),
            });
        },

        onShow() {
            // 分享菜单处理
            app.globalData.page_share_handle();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.init();
        },

        methods: {
            init() {
                uni.showLoading({
                    title: '加载中...',
                });
                this.setData({
                    data_list_loding_status: 1,
                });
                uni.request({
                    url: app.globalData.get_request_url('saveinfo', 'user', 'invoice'),
                    method: 'POST',
                    data: this.params,
                    dataType: 'json',
                    success: (res) => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            var upd_data = {
                                data_base: data.base || null,
                                apply_type_list: data.apply_type_list || [],
                                can_invoice_type_list: data.can_invoice_type_list || [],
                                invoice_content_list: data.invoice_content_list || [],
                                save_base_data: data.save_base_data,
                                data: (data.data || null) == null || data.data.length == 0 ? null : data.data,
                                data_list_loding_status: 0,
                                data_bottom_line_status: true,
                                data_list_loding_msg: data.save_base_data.total_price <= 0 ? '发票金额必须大于0' : '',
                            };
                            // 类型数据处理
                            if (upd_data.data != null) {
                                var invoice_content_index = upd_data.invoice_content_list.indexOf(upd_data.data.invoice_content);
                                upd_data['form_invoice_type_index'] = upd_data.data.invoice_type;
                                upd_data['form_apply_type_index'] = upd_data.data.apply_type;
                                upd_data['form_invoice_content_index'] = invoice_content_index == -1 ? 0 : invoice_content_index;
                                upd_data['form_apply_type_disabled'] = upd_data.data.apply_type == 1;
                            }
                            this.setData(upd_data);

                            // 数据容器处理
                            this.invoice_container_handle();
                        } else {
                            this.setData({
                                data_list_loding_status: 2,
                                data_bottom_line_status: false,
                                data_list_loding_msg: res.data.msg,
                            });
                            if (app.globalData.is_login_check(res.data, this, 'init')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_bottom_line_status: false,
                            data_list_loding_msg: '网络开小差了哦~',
                        });
                        app.globalData.showToast('网络开小差了哦~');
                    },
                });
            },

            // 发票类型事件
            form_invoice_type_event(e) {
                this.setData({
                    form_invoice_type_index: e.detail.value,
                });
                this.invoice_container_handle();
            },

            // 发票类型事件
            form_apply_type_event(e) {
                this.setData({
                    form_apply_type_index: e.detail.value,
                });
                this.invoice_container_handle();
            },

            // 发票内容事件
            form_invoice_content_event(e) {
                this.setData({
                    form_invoice_content_index: e.detail.value,
                });
            },

            // 容器显隐处理
            invoice_container_handle() {
                // 发票类型
                var invoice_type = this.can_invoice_type_list[this.form_invoice_type_index]['id'];
                if (invoice_type == 2 || invoice_type == 3) {
                    // 选择专票的时候申请类型必须是企业
                    this.setData({
                        form_apply_type_index: 1,
                        form_apply_type_disabled: true,
                    });
                } else {
                    this.setData({
                        form_apply_type_disabled: false,
                    });
                }

                // 申请类型
                switch (invoice_type) {
                    // 增值税普通电子发票
                    case 0:
                        this.setData({
                            company_special_container: false,
                            addressee_container: false,
                            email_container: true,
                        });
                        break;
                    // 增值税普通纸质发票
                    case 1:
                        this.setData({
                            company_special_container: false,
                            addressee_container: true,
                            email_container: false,
                        });
                        break;
                    // 增值税专用纸质发票
                    case 2:
                        this.setData({
                            company_container: true,
                            company_special_container: true,
                            addressee_container: true,
                            email_container: false,
                        });
                        break;
                        
                    // 增值税专用纸质发票
                    case 3:
                        this.setData({
                            company_container: true,
                            company_special_container: true,
                            addressee_container: false,
                            email_container: true,
                        });
                        break;
                }

                // 增值税专用纸质发票情况下个人类型处理
                if (invoice_type == 0 || invoice_type == 1) {
                    var apply_type = this.apply_type_list[this.form_apply_type_index]['id'];
                    this.setData({
                        company_container: apply_type != 0,
                    });
                }
            },

            // 表单提交
            formSubmit(e) {
                var data = e.detail.value;
                if ((this.data || null) == null || (this.data.id || null) == null) {
                    data['ids'] = this.params.ids || '';
                    data['type'] = this.params.type || '';
                } else {
                    data['id'] = this.data.id;
                }

                // 数据验证
                var validation = [
                    { fields: 'invoice_type', msg: '请选择发票类型', is_can_zero: 1 },
                    { fields: 'apply_type', msg: '请选择申请类型', is_can_zero: 1 },
                    { fields: 'invoice_title', msg: '请填写发票抬头、最多200个字符' },
                ];
                if (app.globalData.fields_check(data, validation)) {
                    var invoice_type = this.can_invoice_type_list[this.form_invoice_type_index]['id'];
                    var apply_type = this.apply_type_list[this.form_apply_type_index]['id'];
                    if (apply_type == 1) {
                        validation.push({ fields: 'invoice_code', msg: '请填写企业统一社会信用代码或纳税识别号、最多160个字符' });
                    }
                    if (invoice_type == 2) {
                        validation.push({ fields: 'invoice_bank', msg: '请填写企业开户行名称、最多200个字符' });
                        validation.push({ fields: 'invoice_account', msg: '请填写企业开户帐号、最多160个字符' });
                        validation.push({ fields: 'invoice_tel', msg: '请填写企业联系电话 6~15 个字符' });
                        validation.push({ fields: 'invoice_address', msg: '请填写企业注册地址、最多230个字符' });
                    }

                    if (invoice_type == 1 || invoice_type == 2) {
                        validation.push({ fields: 'name', msg: '请填写收件人姓名格式 2~30 个字符之间' });
                        validation.push({ fields: 'tel', msg: '请填写收件人电话 6~15 个字符' });
                        validation.push({ fields: 'address', msg: '请填写收件人地址、最多230个字符' });
                    }

                    if (app.globalData.fields_check(data, validation)) {
                        // 发票类型
                        data['invoice_type'] = this.can_invoice_type_list[this.form_invoice_type_index]['id'];

                        // 发票内容
                        if (this.invoice_content_list.length > 0 && this.invoice_content_list[this.form_invoice_content_index] != undefined) {
                            data['invoice_content'] = this.invoice_content_list[this.form_invoice_content_index];
                        }
                        uni.showLoading({
                            title: '提交中...',
                        });
                        this.setData({
                            form_submit_loading: true,
                        });

                        // 网络请求
                        uni.request({
                            url: app.globalData.get_request_url('save', 'user', 'invoice'),
                            method: 'POST',
                            data: data,
                            dataType: 'json',
                            success: (res) => {
                                uni.hideLoading();
                                if (res.data.code == 0) {
                                    app.globalData.showToast(res.data.msg, 'success');
                                    var is_to = (this.params || null) != null && (this.params.is_redirect || 0) == 1;
                                    setTimeout(function () {
                                        // 是否关闭页面进入我的发票、适合从订单开票中过来提交成功直接进入我的发票列表
                                        if (is_to) {
                                            uni.redirectTo({
                                                url: '/pages/plugins/invoice/invoice/invoice',
                                            });
                                        } else {
                                            uni.navigateBack();
                                        }
                                    }, 2000);
                                } else {
                                    this.setData({
                                        form_submit_loading: false,
                                    });
                                    if (app.globalData.is_login_check(res.data)) {
                                        app.globalData.showToast(res.data.msg);
                                    } else {
                                        app.globalData.showToast('提交失败，请重试！');
                                    }
                                }
                            },
                            fail: () => {
                                uni.hideLoading();
                                this.setData({
                                    form_submit_loading: false,
                                });
                                app.globalData.showToast('网络开小差了哦~');
                            },
                        });
                    }
                }
            },
        },
    };
</script>
<style></style>
