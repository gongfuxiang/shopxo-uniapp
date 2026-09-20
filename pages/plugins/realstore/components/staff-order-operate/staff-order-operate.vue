<template>
    <view>
        <!-- 自提取货核销 -->
        <component-popup :propShow="popup_take_status" propPosition="bottom" @onclose="popup_take_close">
            <view class="padding-horizontal-main padding-top-main bg-white">
                <view class="close oh">
                    <view class="fr" @tap.stop="popup_take_close">
                        <iconfont name="icon-close-line" size="28rpx" color="#999"></iconfont>
                    </view>
                </view>
                <view class="text-size fw-b padding-bottom-main">{{ $t('staff-order.take') }}</view>
                <form @submit="form_take_submit" class="form-container">
                    <view class="form-gorup">
                        <view class="form-gorup-title">{{ $t('common.verification_text') }}<text class="form-group-tips-must">*</text></view>
                        <input type="text" maxlength="4" class="cr-base br radius padding-horizontal-main padding-vertical-sm margin-top-sm" :placeholder="$t('common.verification_message')" :value="form_extraction_code" @input="form_extraction_code_event" />
                    </view>
                    <view class="form-gorup">
                        <view class="form-gorup-title">{{ $t('staff-order.verify_number') }}<text class="form-group-tips-must">*</text></view>
                        <view class="verify-number-content tc oh round br margin-top-sm">
                            <view class="number-submit tc cr-grey" data-type="0" @tap="form_verify_number_btn_event">-</view>
                            <input class="number-input tc cr-base bg-white radius-0" type="number" step="1" min="1" :value="form_verify_number" @input="form_verify_number_event" @blur="form_verify_number_blur" />
                            <view class="number-submit tc cr-grey" data-type="1" @tap="form_verify_number_btn_event">+</view>
                        </view>
                    </view>
                    <view class="form-gorup form-gorup-submit bottom-line-exclude">
                        <button class="bg-main br-main cr-white round text-size" type="default" form-type="submit" hover-class="none">{{ $t('common.submit') }}</button>
                    </view>
                </form>
            </view>
        </component-popup>

        <!-- 快递发货（多条可编辑，对齐 PC） -->
        <component-popup :propShow="popup_delivery_status" propPosition="bottom" @onclose="popup_delivery_close">
            <view class="padding-horizontal-main padding-top-main bg-white">
                <view class="close oh">
                    <view class="fr" @tap.stop="popup_delivery_close_event">
                        <iconfont name="icon-close-line" size="28rpx" color="#999"></iconfont>
                    </view>
                </view>

                <!-- 快递列表 -->
                <block v-if="delivery_view == 'list'">
                    <view class="text-size fw-b padding-bottom-main">{{ $t('staff-order.delivery') }}</view>
                    <view class="express-list br radius margin-bottom-main">
                        <view v-if="(form_express_data || null) == null || form_express_data.length == 0" class="padding-main cr-grey tc">{{ $t('staff-order.express_empty_tips') }}</view>
                        <view v-for="(item, index) in form_express_data" :key="index" class="express-item flex-row align-c jc-sb padding-horizontal-main padding-vertical-main" :class="index > 0 ? 'br-t' : ''">
                            <view class="flex-1 flex-width padding-right-main cr-base text-size-sm">
                                <text>{{ item.express_name }}</text>
                                <text> / </text>
                                <text>{{ item.express_number }}</text>
                            </view>
                            <view class="flex-row align-c">
                                <text class="cr-blue text-size-xs" :data-index="index" @tap="express_edit_event">{{ $t('common.edit') }}</text>
                                <text class="cr-blue text-size-xs margin-left-main" :data-index="index" @tap="express_remove_event">{{ $t('common.remove') }}</text>
                            </view>
                        </view>
                    </view>
                    <view class="margin-bottom-xl">
                        <button class="br-main cr-main bg-white round text-size-sm" type="default" size="mini" @tap="express_add_event" hover-class="none">
                            <text>+</text>
                            <text>{{ $t('staff-order.express_add') }}</text>
                        </button>
                    </view>
                    <form @submit="form_delivery_submit" class="form-container">
                        <view class="form-gorup form-gorup-submit bottom-line-exclude">
                            <button class="bg-main br-main cr-white round text-size" type="default" form-type="submit" hover-class="none">{{ $t('common.submit') }}</button>
                        </view>
                    </form>
                </block>

                <!-- 添加/编辑单条快递（同弹层内切换，避免嵌套弹窗被遮罩盖住） -->
                <block v-else>
                    <view class="text-size fw-b padding-bottom-main">
                        <text v-if="express_form_type == 'edit'">{{ $t('common.edit') }}</text>
                        <text v-else>{{ $t('staff-order.express_add') }}</text>
                    </view>
                    <form @submit="form_express_item_submit" class="form-container">
                        <view class="form-gorup">
                            <view class="form-gorup-title">{{ $t('common.express_delivery_company') }}<text class="form-group-tips-must">*</text></view>
                            <picker class="margin-top-sm" mode="selector" :range="express_list" range-key="name" :value="form_express_index || 0" @change="form_express_change">
                                <view class="express-picker br radius padding-left-main padding-right-xxxl padding-vertical-sm arrow-bottom" :class="form_express_index === null ? 'cr-grey' : 'cr-base'">
                                    <text v-if="form_express_index === null">{{ $t('staff-order.please_select_express') }}</text>
                                    <text v-else>{{ form_express_selected_name }}</text>
                                </view>
                            </picker>
                        </view>
                        <view class="form-gorup">
                            <view class="form-gorup-title">{{ $t('common.express_tracking_number') }}<text class="form-group-tips-must">*</text></view>
                            <input type="text" class="cr-base br radius padding-horizontal-main padding-vertical-sm margin-top-sm" :placeholder="$t('staff-order.express_number_placeholder')" :value="form_express_number" @input="form_express_number_event" />
                        </view>
                        <view class="form-gorup form-gorup-submit bottom-line-exclude">
                            <view class="flex-row gap-10">
                                <button class="flex-1 br-grey cr-base bg-white round text-size" type="default" @tap="express_form_back" hover-class="none">{{ $t('common.cancel') }}</button>
                                <button class="flex-1 bg-main br-main cr-white round text-size" type="default" form-type="submit" hover-class="none">{{ $t('common.confirm') }}</button>
                            </view>
                        </view>
                    </form>
                </block>
            </view>
        </component-popup>

        <!-- 外送服务完成 -->
        <component-popup :propShow="popup_service_status" propPosition="bottom" @onclose="popup_service_close">
            <view class="padding-horizontal-main padding-top-main bg-white">
                <view class="close oh">
                    <view class="fr" @tap.stop="popup_service_close">
                        <iconfont name="icon-close-line" size="28rpx" color="#999"></iconfont>
                    </view>
                </view>
                <view class="text-size fw-b padding-bottom-main">{{ $t('staff-order.service_done') }}</view>
                <form @submit="form_service_submit" class="form-container">
                    <view class="form-gorup">
                        <view class="form-gorup-title">{{ $t('staff-order.service_msg') }}</view>
                        <view class="br padding-main radius margin-top-sm">
                            <textarea class="cr-base margin-0" maxlength="180" :placeholder="$t('staff-order.service_msg_placeholder')" :value="form_service_msg" @input="form_service_msg_event"></textarea>
                        </view>
                    </view>
                    <view class="form-gorup form-container-upload oh">
                        <view class="form-gorup-title">{{ $t('staff-order.service_proof') }}<text class="form-group-tips">{{ $t('staff-order.service_proof_tips') }}</text></view>
                        <view class="margin-top-sm">
                            <component-upload :propData="form_service_images" :propMaxNum="30" :propPathType="editor_path_type" @call-back="form_service_upload_event"></component-upload>
                        </view>
                    </view>
                    <view class="form-gorup form-gorup-submit bottom-line-exclude">
                        <button class="bg-main br-main cr-white round text-size" type="default" form-type="submit" hover-class="none">{{ $t('common.submit') }}</button>
                    </view>
                </form>
            </view>
        </component-popup>
    </view>
</template>
<script>
    const app = getApp();
    import componentPopup from '@/components/popup/popup';
    import componentUpload from '@/components/upload/upload';
    import pluginLocale from '../../locale/index.js';

    export default {
        mixins: [pluginLocale],
        components: {
            componentPopup,
            componentUpload,
        },
        props: {
            propExpressList: {
                type: Array,
                default: () => [],
            },
            propEditorPathType: {
                type: String,
                default: '',
            },
        },
        data() {
            return {
                order_id: 0,
                express_list: [],
                editor_path_type: '',
                popup_take_status: false,
                form_extraction_code: '',
                form_verify_number: '1',
                popup_delivery_status: false,
                delivery_view: 'list',
                form_express_data: [],
                express_form_type: 'add',
                express_form_index: -1,
                form_express_index: null,
                form_express_number: '',
                popup_service_status: false,
                form_service_msg: '',
                form_service_images: [],
            };
        },
        watch: {
            propExpressList: {
                immediate: true,
                handler(val) {
                    this.express_list = val || [];
                },
            },
            propEditorPathType: {
                immediate: true,
                handler(val) {
                    this.editor_path_type = val || '';
                },
            },
        },
        computed: {
            // 当前选中的快递公司名称
            form_express_selected_name() {
                if (this.form_express_index === null || (this.express_list || []).length == 0) {
                    return '';
                }
                var item = this.express_list[this.form_express_index] || null;
                return item == null ? '' : (item.name || '');
            },
        },
        methods: {
            // 打开操作弹层：take / delivery / service
            // extra：delivery 时可传已有 express_data 数组
            open(action, order_id, extra) {
                this.order_id = parseInt(order_id || 0);
                if (this.order_id <= 0) {
                    return;
                }
                if (action == 'take') {
                    this.setData({
                        popup_take_status: true,
                        form_extraction_code: '',
                        form_verify_number: '1',
                    });
                    return;
                }
                if (action == 'delivery') {
                    var list = [];
                    if (Array.isArray(extra)) {
                        list = extra;
                    } else if ((extra || null) != null && Array.isArray(extra.express_data)) {
                        list = extra.express_data;
                    }
                    this.setData({
                        popup_delivery_status: true,
                        delivery_view: 'list',
                        form_express_data: this.normalize_express_list(list),
                        form_express_index: null,
                        form_express_number: '',
                        express_form_type: 'add',
                        express_form_index: -1,
                    });
                    return;
                }
                if (action == 'service') {
                    this.setData({
                        popup_service_status: true,
                        form_service_msg: '',
                        form_service_images: [],
                    });
                }
            },
            normalize_express_list(list) {
                var result = [];
                (list || []).forEach((item) => {
                    if ((item || null) == null) {
                        return;
                    }
                    var express_id = item.express_id || 0;
                    var express_name = item.express_name || '';
                    var express_number = item.express_number || '';
                    if (express_id && express_name && express_number) {
                        result.push({
                            express_id: express_id,
                            express_name: express_name,
                            express_number: express_number,
                        });
                    }
                });
                return result;
            },
            find_express_index(express_id) {
                var id = parseInt(express_id || 0);
                if (id <= 0 || (this.express_list || []).length == 0) {
                    return null;
                }
                for (var i = 0; i < this.express_list.length; i++) {
                    if (parseInt(this.express_list[i].id || 0) == id) {
                        return i;
                    }
                }
                return null;
            },
            popup_take_close() {
                this.setData({ popup_take_status: false });
            },
            popup_delivery_close() {
                this.setData({
                    popup_delivery_status: false,
                    delivery_view: 'list',
                });
            },
            popup_delivery_close_event() {
                if (this.delivery_view == 'form') {
                    this.express_form_back();
                    return;
                }
                this.popup_delivery_close();
            },
            express_form_back() {
                this.setData({
                    delivery_view: 'list',
                    form_express_index: null,
                    form_express_number: '',
                    express_form_type: 'add',
                    express_form_index: -1,
                });
            },
            popup_service_close() {
                this.setData({ popup_service_status: false });
            },
            form_extraction_code_event(e) {
                this.setData({ form_extraction_code: e.detail.value || '' });
            },
            form_verify_number_event(e) {
                this.form_verify_number_normalize(e.detail.value);
            },
            form_verify_number_blur() {
                this.form_verify_number_normalize(this.form_verify_number, true);
            },
            form_verify_number_btn_event(e) {
                var type = parseInt(e.currentTarget.dataset.type || 0);
                var num = parseInt(this.form_verify_number || 0, 10);
                if (isNaN(num) || num < 1) {
                    num = 1;
                }
                num = type == 1 ? num + 1 : num - 1;
                if (num < 1) {
                    num = 1;
                }
                this.setData({ form_verify_number: String(num) });
            },
            form_verify_number_normalize(value, force_min) {
                // 核销数量最低 1；纠正后若与旧值相同需强制刷新，否则 H5 上下键减到负数会卡在界面上
                var num = parseInt(String(value == null ? '' : value).replace(/[^\d]/g, ''), 10);
                if (isNaN(num) || num < 1) {
                    if (force_min || String(value || '') !== '') {
                        num = 1;
                    } else {
                        this.setData({ form_verify_number: '' });
                        return;
                    }
                }
                var next = String(num);
                if (this.form_verify_number === next) {
                    this.setData({ form_verify_number: '' });
                    this.$nextTick(() => {
                        this.setData({ form_verify_number: next });
                    });
                    return;
                }
                this.setData({ form_verify_number: next });
            },
            form_express_change(e) {
                this.setData({ form_express_index: parseInt(e.detail.value) });
            },
            form_express_number_event(e) {
                this.setData({ form_express_number: e.detail.value || '' });
            },
            form_service_msg_event(e) {
                this.setData({ form_service_msg: e.detail.value || '' });
            },
            form_service_upload_event(list) {
                this.setData({ form_service_images: list || [] });
            },
            express_add_event() {
                this.setData({
                    delivery_view: 'form',
                    express_form_type: 'add',
                    express_form_index: -1,
                    form_express_index: null,
                    form_express_number: '',
                });
            },
            express_edit_event(e) {
                var index = parseInt(e.currentTarget.dataset.index);
                var item = (this.form_express_data || [])[index] || null;
                if (item == null) {
                    app.globalData.showToast(this.$t('staff-order.express_empty_tips'));
                    return;
                }
                this.setData({
                    delivery_view: 'form',
                    express_form_type: 'edit',
                    express_form_index: index,
                    form_express_index: this.find_express_index(item.express_id),
                    form_express_number: item.express_number || '',
                });
            },
            express_remove_event(e) {
                var index = parseInt(e.currentTarget.dataset.index);
                uni.showModal({
                    title: this.$t('common.warm_tips'),
                    content: this.$t('staff-order.express_remove_confirm'),
                    success: (res) => {
                        if (!res.confirm) {
                            return;
                        }
                        var list = (this.form_express_data || []).slice();
                        list.splice(index, 1);
                        this.setData({ form_express_data: list });
                    },
                });
            },
            form_express_item_submit() {
                if (this.form_express_index === null || (this.express_list[this.form_express_index] || null) == null) {
                    app.globalData.showToast(this.$t('staff-order.please_select_express'));
                    return;
                }
                var express_number = String(this.form_express_number || '').trim();
                if (express_number == '') {
                    app.globalData.showToast(this.$t('staff-order.express_number_placeholder'));
                    return;
                }
                var express = this.express_list[this.form_express_index];
                var row = {
                    express_id: express.id,
                    express_name: express.name,
                    express_number: express_number,
                };
                var list = (this.form_express_data || []).slice();
                if (this.express_form_type == 'edit' && this.express_form_index >= 0) {
                    list.splice(this.express_form_index, 1, row);
                } else {
                    list.push(row);
                }
                this.setData({
                    form_express_data: list,
                    delivery_view: 'list',
                    form_express_index: null,
                    form_express_number: '',
                    express_form_type: 'add',
                    express_form_index: -1,
                });
            },
            form_take_submit() {
                var code = String(this.form_extraction_code || '').trim();
                var num = parseInt(this.form_verify_number || 0);
                if (code == '') {
                    app.globalData.showToast(this.$t('common.verification_message'));
                    return;
                }
                if (num <= 0) {
                    app.globalData.showToast(this.$t('staff-order.verify_number_placeholder'));
                    return;
                }
                this.request_submit('delivery', {
                    extraction_code: code,
                    verify_number: num,
                }, () => {
                    this.popup_take_close();
                });
            },
            form_delivery_submit() {
                var list = this.normalize_express_list(this.form_express_data || []);
                this.request_submit('delivery', {
                    express_data: encodeURIComponent(JSON.stringify(list)),
                }, () => {
                    this.popup_delivery_close();
                });
            },
            form_service_submit() {
                this.request_submit('service', {
                    service_complete_msg: this.form_service_msg || '',
                    service_proof_images: this.form_service_images || [],
                }, () => {
                    this.popup_service_close();
                });
            },
            request_submit(action, extra, success_cb) {
                uni.showLoading({ title: this.$t('common.processing_in_text') });
                uni.request({
                    url: app.globalData.get_request_url(action, 'stafforder', 'realstore'),
                    method: 'POST',
                    data: Object.assign({ id: this.order_id }, extra || {}),
                    dataType: 'json',
                    success: (res) => {
                        uni.hideLoading();
                        app.globalData.showToast(res.data.msg);
                        if (res.data.code == 0) {
                            if (typeof success_cb == 'function') {
                                success_cb();
                            }
                            this.$emit('success');
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },
        },
    };
</script>
<style scoped>
.express-picker.arrow-bottom {
    background-position: center right 20rpx;
}
.express-list {
    overflow: hidden;
}
.verify-number-content {
    display: flex;
    width: 100%;
    align-items: center;
}
.verify-number-content .number-submit {
    width: 120rpx;
    flex-shrink: 0;
    font-weight: bold;
    font-size: 36rpx;
}
.verify-number-content .number-input {
    flex: 1;
    width: auto;
    min-width: 0;
    border-width: 0 1px;
    border-style: solid;
    border-color: #efefef;
}
.verify-number-content .number-submit,
.verify-number-content .number-input {
    padding: 0;
    height: 72rpx;
    line-height: 72rpx;
}
</style>
