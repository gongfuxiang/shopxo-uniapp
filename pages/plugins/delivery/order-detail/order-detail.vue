<template>
    <view :class="theme_view">
        <view v-if="detail != null">
            <view class="padding-horizontal-main padding-top-main">
                <!-- 状态步骤与操作 -->
                <view class="bg-white padding-main border-radius-main tc spacing-mb">
                    <view class="padding-vertical-xl">
                        <block v-if="status_progress_style == 'danger'">
                            <view class="dis-inline-block va-m">
                                <iconfont name="icon-sigh-o" size="68rpx" propClass="cr-red"></iconfont>
                            </view>
                            <text class="text-size-xl margin-top-sm va-m margin-left-sm cr-red">{{ status_progress_name }}</text>
                        </block>
                        <block v-else-if="status_progress_style == 'success'">
                            <view class="dis-inline-block va-m">
                                <iconfont name="icon-enable" size="68rpx" propClass="cr-green"></iconfont>
                            </view>
                            <text class="text-size-xl margin-top-sm va-m margin-left-sm cr-green">{{ status_progress_name }}</text>
                        </block>
                        <block v-else-if="status_progress_style == 'primary'">
                            <view class="dis-inline-block va-m">
                                <iconfont name="icon-inventroy-manage" size="68rpx" propClass="cr-blue"></iconfont>
                            </view>
                            <text class="text-size-xl margin-top-sm va-m margin-left-sm cr-blue">{{ status_progress_name }}</text>
                        </block>
                        <block v-else-if="status_progress_style == 'warning'">
                            <view class="dis-inline-block va-m">
                                <iconfont name="icon-wait-receive-delivery" size="68rpx" propClass="cr-yellow"></iconfont>
                            </view>
                            <text class="text-size-xl margin-top-sm va-m margin-left-sm cr-yellow">{{ status_progress_name }}</text>
                        </block>
                        <block v-else>
                            <view class="dis-inline-block va-m">
                                <iconfont name="icon-wait-payment" size="68rpx"></iconfont>
                            </view>
                            <text class="text-size-xl margin-top-sm va-m margin-left-sm">{{ status_progress_name }}</text>
                        </block>
                        <view v-if="status_progress_tips" class="cr-grey text-size-xs margin-top-sm">{{ status_progress_tips }}</view>
                        <view v-if="status_progress_steps.length > 0" class="make-progress-steps margin-top-main">
                            <view
                                v-for="(step, index) in status_progress_steps"
                                :key="step.key"
                                class="make-progress-step"
                                :class="make_step_class(index)"
                            >
                                <view class="make-progress-node">
                                    <view class="make-progress-dot" :class="make_step_done(index) || make_step_active(index) ? 'bg-main' : ''">
                                        <text v-if="make_step_done(index)" class="make-progress-dot-check cr-white">✓</text>
                                        <text v-else class="make-progress-dot-num" :class="make_step_active(index) ? 'cr-white' : 'cr-grey'">{{ index + 1 }}</text>
                                    </view>
                                    <view v-if="index < status_progress_steps.length - 1" class="make-progress-line" :class="make_step_done(index) ? 'bg-main' : ''"></view>
                                </view>
                                <text class="make-progress-name" :class="make_step_active(index) ? 'cr-main' : (make_step_done(index) ? 'cr-base' : 'cr-grey')">{{ step.name }}</text>
                            </view>
                        </view>
                    </view>
                    <view v-if="show_detail_operate" class="item-operation margin-top-sm tc">
                        <button v-if="detail.status == 0" class="round bg-white br-green cr-green" type="default" size="mini" hover-class="none" @tap="accept_order_event">{{$t('order.accept_order')}}</button>
                        <button v-if="detail.status == 0" class="round bg-white br-red cr-red" type="default" size="mini" hover-class="none" @tap="reject_order_event">{{$t('order.reject_order')}}</button>
                        <button v-if="detail.status == 1" class="round bg-white br-blue cr-blue" type="default" size="mini" hover-class="none" @tap="start_delivery_event">{{$t('order.start_delivery')}}</button>
                        <button v-if="detail.status == 1" class="round bg-white br-yellow cr-yellow" type="default" size="mini" hover-class="none" @tap="transfer_order_event">{{$t('order.transfer_order')}}</button>
                        <button v-if="detail.status == 4" class="round bg-white br-main cr-main" type="default" size="mini" hover-class="none" @tap="start_delivery_event">{{$t('order.redelivery')}}</button>
                        <block v-if="detail.status == 2">
                            <button class="round bg-white br-green cr-green" type="default" size="mini" hover-class="none" @tap="popup_success_content_event">{{$t('order.complete_delivery')}}</button>
                            <button class="round bg-white br-red cr-red" type="default" size="mini" hover-class="none" @tap="popup_abnormal_content_event">{{$t('order.abnormal')}}</button>
                        </block>
                    </view>
                </view>

                <!-- 发货地址 -->
                <view v-if="(detail.warehouse_address || null) != null" class="bg-white padding-main border-radius-main spacing-mb">
                    <view class="br-b padding-bottom-sm fw-b text-size">{{$t('order.shipping_info')}}</view>
                    <view class="address-base oh margin-top-sm">
                        <text v-if="(detail.warehouse_address.alias || null) != null" class="address-alias round br-main cr-main bg-white margin-right-sm">{{detail.warehouse_address.alias}}</text>
                        <text data-event="copy" :data-value="detail.warehouse_address.name" @tap="text_event">{{detail.warehouse_address.name}}</text>
                        <text class="fr" data-event="tel" :data-value="detail.warehouse_address.tel" @tap="text_event">{{detail.warehouse_address.tel}}</text>
                    </view>
                    <view class="address-detail oh margin-bottom-main">
                        <image class="icon fl" :src="common_static_url+'map-icon.png'" mode="widthFix"></image>
                        <view class="text fr">
                            <text data-event="copy" :data-value="detail.warehouse_address.address_info" @tap="text_event">{{detail.warehouse_address.address_info}}</text>
                            <text v-if="(detail.warehouse_address.lng || 0) != 0 && (detail.warehouse_address.lat || 0) != 0" class="address-map-submit cr-base br round bg-white margin-left-sm text-size-xs" @tap="address_map_event" data-type="warehouse">{{$t('common.view_location')}}</text>
                        </view>
                    </view>
                    <view class="address-divider margin-bottom-sm"></view>
                </view>
                
                <!-- 收货地址 -->
                <view v-if="(detail.user_address || null) != null" class="bg-white padding-main border-radius-main spacing-mb">
                    <view class="br-b padding-bottom-sm fw-b text-size">{{$t('order.receipt_info')}}</view>
                    <view class="address-base oh margin-top-sm">
                        <text v-if="(detail.user_address.alias || null) != null" class="address-alias round br-main cr-main bg-white margin-right-sm">{{detail.user_address.alias}}</text>
                        <text data-event="copy" :data-value="detail.user_address.name" @tap="text_event">{{detail.user_address.name}}</text>
                        <text class="fr" data-event="tel" :data-value="detail.user_address.tel" @tap="text_event">{{detail.user_address.tel}}</text>
                    </view>
                    <view v-if="(detail.user_address.appoint_time || null) != null" class="cr-red margin-top-xs">{{detail.user_address.appoint_time}}</view>
                    <view class="address-detail oh margin-bottom-main">
                        <image class="icon fl" :src="common_static_url+'map-icon.png'" mode="widthFix"></image>
                        <view class="text fr">
                            <text data-event="copy" :data-value="detail.user_address.address_info" @tap="text_event">{{detail.user_address.address_info}}</text>
                            <text v-if="(detail.user_address.lng || 0) != 0 && (detail.user_address.lat || 0) != 0" class="address-map-submit cr-base br round bg-white margin-left-sm text-size-xs" @tap="address_map_event" data-type="user">{{$t('common.view_location')}}</text>
                        </view>
                    </view>
                    <view class="address-divider margin-bottom-sm"></view>
                </view>

                <!-- 基础信息 -->
                <view v-if="detail_list.length > 0" class="panel-item padding-main border-radius-main bg-white spacing-mb">
                    <view class="br-b padding-bottom-main fw-b text-size">{{$t('common.base_info_text')}}</view>
                    <view class="panel-content oh">
                        <uni-table :emptyText="$t('common.no_data')">
                            <block v-for="(item, index) in detail_list" :key="index">
                                <uni-tr>
                                    <uni-th width="90">{{item.name}}</uni-th>
                                    <uni-td>
                                        <block v-if="(item.type || null) == 'images-list'">
                                            <view v-if="(item.value || null) != null && item.value.length > 0" class="images-list">
                                                <block v-for="(iv, ii) in item.value" :key="ii">
                                                    <image class="item-images radius fl dis-block br padding-xs" :src="iv" mode="aspectFit" :data-ii="ii" @tap="images_list_event"></image>
                                                </block>
                                            </view>
                                        </block>
                                        <view v-else-if="(item.is_copy || 0) == 1" data-event="copy" :data-value="item.value" @tap="text_event">
                                            <text>{{ item.value }}</text>
                                            <text class="bg-white br-green cr-green round padding-horizontal-sm text-size-xs margin-left-sm">{{$t('common.copy')}}</text>
                                        </view>
                                        <text v-else>{{item.value}}</text>
                                    </uni-td>
                                </uni-tr>
                            </block>
                        </uni-table>
                    </view>
                </view>

                <!-- 商品列表 -->
                <view v-if="detail.goods_data.length > 0" class="goods bg-white padding-main border-radius-main spacing-mb">
                    <view class="br-b padding-bottom-main fw-b text-size">{{$t('common.product_information')}}</view>
                    <view v-for="(item, index) in detail.goods_data" :key="index" class="goods-item br-b-dashed oh padding-main">
                        <view :data-value="item.goods_url" @tap="url_event" class="cp">
                            <image class="goods-image fl radius" :src="item.images" mode="aspectFill"></image>
                            <view class="goods-base pr">
                                <view class="multi-text">{{item.title}}</view>
                                <view v-if="item.spec != null" class="margin-top-sm">
                                    <block v-for="(sv, si) in item.spec" :key="si">
                                        <text v-if="si > 0" class="cr-grey padding-left-xs padding-right-xs">;</text>
                                        <text class="cr-gray">{{sv.value}}</text>
                                    </block>
                                </view>
                                <view class="margin-top-sm">
                                    <text class="fw-b">{{detail.currency_data.currency_symbol}}{{item.price}}</text>
                                    <text class="margin-left-sm">x{{item.buy_number}}</text>
                                </view>
                                <view v-if="detail.is_can_launch_aftersale == 1 && (item.orderaftersale_btn_text || null) != null" class="orderaftersale-btn-text cr-blue pa bg-white" @tap.stop="orderaftersale_event" :data-oid="detail.id" :data-did="item.id">{{item.orderaftersale_btn_text}}</view>
                            </view>
                        </view>
                    </view>
                    <view class="padding-top-main tr cr-base text-size">
                        <text>{{$t('common.total')}}<text class="fw-b">{{detail.buy_number_count}}</text>{{$t('common.total_pieces')}}<text class="sales-price margin-right-xs">{{detail.currency_data.currency_symbol}}{{detail.total_price}}</text></text>
                    </view>
                </view>
            </view>

            <!-- 结尾 -->
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
        </view>
        <view v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </view>

        <!-- 订单完成弹窗 -->
        <component-popup :propShow="popup_success_content_status" propPosition="bottom" @onclose="popup_success_content_close_event">
            <view class="padding-horizontal-main padding-top-main bg-white">
                <view class="close oh">
                    <view class="fr" @tap.stop="popup_success_content_close_event">
                        <iconfont name="icon-close-line" size="28rpx" color="#999"></iconfont>
                    </view>
                </view>
                <form @submit="form_delivery_success_submit_event" class="form-container">
                    <view class="form-container">
                        <view class="form-gorup">
                            <view class="form-gorup-title">{{$t('common.describe')}}</view>
                            <view class="br padding-main radius margin-top">
                                <textarea placeholder-class="cr-grey" class="cr-base margin-0" :placeholder="$t('order.description_up_200_characters_long')" maxlength="200" :value="form_delivery_success_msg_value" @input="form_delivery_success_msg_event"></textarea>
                            </view>
                        </view>
                        <view class="form-gorup form-container-upload oh">
                            <view class="form-gorup-title">{{$t('order.upload_photos')}}<text class="form-group-tips-must">*</text><text class="form-group-tips">{{$t('common.up_upload')}}{{form_delivery_success_images_max_count}}{{$t('common.text')}}</text></view>
                            <view class="margin-top-sm">
                                <component-upload :propData="form_delivery_success_images_list" :propMaxNum="form_delivery_success_images_max_count" :propPathType="editor_path_type" @call-back="upload_image_event"></component-upload>
                            </view>
                        </view>
                        <view class="form-gorup form-gorup-submit bottom-line-exclude">
                            <button class="bg-main br-main cr-white round text-size" type="default" form-type="submit" hover-class="none">{{$t('order.submission_completed')}}</button>
                        </view>
                    </view>
                </form>
            </view>
        </component-popup>

        <!-- 订单异常弹窗 -->
        <component-popup :propShow="popup_abnormal_content_status" propPosition="bottom" @onclose="popup_abnormal_content_close_event">
            <view class="padding-horizontal-main padding-top-main bg-white">
                <view class="close oh">
                    <view class="fr" @tap.stop="popup_abnormal_content_close_event">
                        <iconfont name="icon-close-line" size="28rpx" color="#999"></iconfont>
                    </view>
                </view>
                <form @submit="form_delivery_abnormal_submit_event" class="form-container">
                    <view class="form-container">
                        <view class="form-gorup">
                            <view class="form-gorup-title">{{$t('order.abnormal_cause')}}<text class="form-group-tips-must">*</text></view>
                            <view class="br padding-main radius margin-top">
                                <textarea placeholder-class="cr-grey" class="cr-base margin-0" :placeholder="$t('order.reason_anomaly_up_200_characters_long')" maxlength="200" :auto-height="true" :value="form_delivery_abnormal_msg_value" @input="form_delivery_abnormal_msg_event"></textarea>
                            </view>
                        </view>
                        <view class="form-gorup form-gorup-submit bottom-line-exclude">
                            <button class="bg-red br-red cr-white round text-size" type="default" form-type="submit" hover-class="none">{{$t('order.submit_exception')}}</button>
                        </view>
                    </view>
                </form>
            </view>
        </component-popup>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from "@/components/no-data/no-data";
    import componentBottomLine from "@/components/bottom-line/bottom-line";
    import componentPopup from "@/components/popup/popup";
    import componentUpload from '@/components/upload/upload';
    import pluginLocale from '../locale/index.js';

    var common_static_url = app.globalData.get_static_url('common');
    export default {
        mixins: [pluginLocale],
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                common_static_url: common_static_url,
                params: null,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_bottom_line_status: false,
                detail: null,
                detail_list: [],
                popup_abnormal_content_status: false,
                form_delivery_abnormal_msg_value: "",
                popup_success_content_status: false,
                form_delivery_success_msg_value: "",
                form_delivery_success_images_list: [],
                form_delivery_success_images_max_count: 30,
                editor_path_type: "",
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
            componentPopup,
            componentUpload,
        },

        computed: {
            status_progress() {
                const d = this.detail || {};
                return d.status_progress || null;
            },
            status_progress_name() {
                const sp = this.status_progress || {};
                return sp.status_name || ((this.detail || {}).status_name) || '';
            },
            status_progress_tips() {
                return String(((this.status_progress || {}).tips) || '');
            },
            status_progress_style() {
                return String(((this.status_progress || {}).style) || 'default');
            },
            status_progress_steps() {
                const steps = ((this.status_progress || {}).steps) || null;
                return (steps != null && steps.length > 0) ? steps : [];
            },
            show_detail_operate() {
                const status = Number(((this.detail || {}).status));
                return status === 0 || status === 1 || status === 2 || status === 4;
            },
        },

        onLoad(params) {
            // 参数处理
            params = app.globalData.launch_params_handle(params);

            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            this.setData({
                params: params
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
            this.init();
        },

        methods: {
            make_step_class(index) {
                if (this.make_step_done(index)) {
                    return 'is-done';
                }
                if (this.make_step_active(index)) {
                    return 'is-active';
                }
                return 'is-wait';
            },

            make_step_done(index) {
                const cur = Number(((this.status_progress || {}).current) || 0);
                return index < cur;
            },

            make_step_active(index) {
                const cur = Number(((this.status_progress || {}).current) || 0);
                return index === cur;
            },

            init() {
                this.setData({
                    data_list_loding_status: 1
                });
                uni.request({
                    url: app.globalData.get_request_url("detail", "order", "delivery"),
                    method: 'POST',
                    data: {
                        id: this.params.id
                    },
                    dataType: 'json',
                    success: res => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            if ((data.data || null) != null) {
                                this.setData({
                                    detail: data.data,
                                    editor_path_type: data.editor_path_type || "",
                                    detail_list: [
                                        { name: this.$t('common.order_detail_order_number'), value: data.data.main_order_no || '', is_copy: 1 },
                                        { name: this.$t('order-detail.merchant_name'), value: data.data.merchant_name || '' },
                                        { name: this.$t('common.order_amount'), value: data.data.total_price || '' },
                                        { name: this.$t('common.product_quantity'), value: data.data.buy_number_count || '' },
                                        { name: this.$t('order-detail.delivery_status'), value: data.data.status_name || '' },
                                        { name: this.$t('order-detail.delivery_time'), value: data.data.start_delivery_time || '' },
                                        { name: this.$t('common.completion_time'), value: data.data.success_delivery_time || '' },
                                        { name: this.$t('order-detail.complete_description'), value: data.data.success_delivery_msg || '' },
                                        { name: this.$t('order-detail.complete_photos'), value: data.data.success_delivery_images || '', type: 'images-list' },
                                        { name: this.$t('order-detail.abnormal_time'), value: data.data.abnormal_delivery_time || '' },
                                        { name: this.$t('order.abnormal_cause'), value: data.data.reason || '' },
                                        { name: this.$t('order-detail.dispatch_time'), value: data.data.add_time || '' },
                                        { name: this.$t('common.upd_time'), value: data.data.upd_time || '' },
                                    ],
                                    data_list_loding_status: 3,
                                    data_bottom_line_status: true,
                                    data_list_loding_msg: ''
                                });
                            } else {
                                this.setData({
                                    detail: null,
                                    detail_list: [],
                                    data_list_loding_status: 0,
                                    data_bottom_line_status: false,
                                    data_list_loding_msg: ''
                                });
                            }
                        } else {
                            this.setData({
                                data_list_loding_status: 2,
                                data_bottom_line_status: false,
                                data_list_loding_msg: res.data.msg
                            });
                            if (app.globalData.is_login_check(res.data, this, 'init')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_bottom_line_status: false,
                            data_list_loding_msg: this.$t('common.internet_error_tips')
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    }
                });
            },

            // 图片列表查看
            images_list_event(e) {
                var ii = e.currentTarget.dataset.ii;
                uni.previewImage({
                    current: this.detail.success_delivery_images[ii],
                    urls: this.detail.success_delivery_images
                });
            },

            // 文本事件
            text_event(e) {
                app.globalData.text_event_handle(e);
            },

            // 地图查看
            address_map_event(e) {
                var type = e.currentTarget.dataset.type || 'user';
                var data = type == 'warehouse' ? (this.detail.warehouse_address || null) : (this.detail.user_address || null);
                if (data == null) {
                    app.globalData.showToast(this.$t('common.incorrect_address'));
                    return false;
                }
                
                // 打开地图
                var name = data.alias || data.name || '';
                app.globalData.open_location(data.lng, data.lat, name, data.address_info);
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            },

            accept_order_event() {
                uni.showModal({
                    title: this.$t('common.warm_tips'),
                    content: this.$t('order.sure_accept_order'),
                    confirmText: this.$t('common.confirm'),
                    cancelText: this.$t('common.not_yet'),
                    success: (result) => {
                        if (result.confirm) {
                            this.order_status_handle({
                                action: "accept",
                            });
                        }
                    },
                });
            },

            reject_order_event() {
                uni.showModal({
                    title: this.$t('common.warm_tips'),
                    content: this.$t('order.sure_reject_order'),
                    confirmText: this.$t('common.confirm'),
                    cancelText: this.$t('common.not_yet'),
                    success: (result) => {
                        if (result.confirm) {
                            this.order_status_handle({
                                action: "reject",
                                back: true,
                            });
                        }
                    },
                });
            },

            transfer_order_event() {
                uni.showModal({
                    title: this.$t('common.warm_tips'),
                    content: this.$t('order.sure_transfer_order'),
                    confirmText: this.$t('common.confirm'),
                    cancelText: this.$t('common.not_yet'),
                    success: (result) => {
                        if (result.confirm) {
                            this.order_status_handle({
                                action: "transfer",
                                back: true,
                            });
                        }
                    },
                });
            },

            start_delivery_event() {
                uni.showModal({
                    title: this.$t('common.warm_tips'),
                    content: this.$t('order.sure_start_shipping_order'),
                    confirmText: this.$t('common.confirm'),
                    cancelText: this.$t('common.not_yet'),
                    success: (result) => {
                        if (result.confirm) {
                            this.order_status_handle({
                                action: "startdelivery",
                            });
                        }
                    },
                });
            },

            popup_success_content_event() {
                this.setData({
                    popup_success_content_status: true,
                    form_delivery_success_msg_value: "",
                    form_delivery_success_images_list: []
                });
            },

            popup_success_content_close_event() {
                this.setData({
                    popup_success_content_status: false,
                });
            },

            form_delivery_success_msg_event(e) {
                this.setData({
                    form_delivery_success_msg_value: e.detail.value
                });
            },

            upload_image_event(res) {
                this.setData({
                    form_delivery_success_images_list: res,
                });
            },

            form_delivery_success_submit_event() {
                if(this.form_delivery_success_images_list.length == 0) {
                    app.globalData.showToast(this.$t('order.upload_photos_2'));
                    return false;
                }
                this.order_status_handle({
                    action: "successdelivery",
                    msg: this.form_delivery_success_msg_value || '',
                    images: this.form_delivery_success_images_list
                });
            },

            popup_abnormal_content_event() {
                this.setData({
                    popup_abnormal_content_status: true,
                    form_delivery_abnormal_msg_value: ""
                });
            },

            popup_abnormal_content_close_event() {
                this.setData({
                    popup_abnormal_content_status: false,
                });
            },

            form_delivery_abnormal_msg_event(e) {
                this.setData({
                    form_delivery_abnormal_msg_value: e.detail.value
                });
            },

            form_delivery_abnormal_submit_event() {
                var msg = this.form_delivery_abnormal_msg_value || null;
                if (msg == null) {
                    app.globalData.showToast(this.$t('order.fill_reason'));
                } else {
                    this.order_status_handle({
                        action: "abnormaldelivery",
                        msg: msg,
                    });
                }
            },

            order_status_handle(params) {
                uni.showLoading({
                    title: this.$t('common.processing_in_text'),
                });
                uni.request({
                    url: app.globalData.get_request_url(params.action, "order", "delivery"),
                    method: "POST",
                    data: {
                        id: this.detail.id,
                        msg: params.msg || "",
                        images: params.images || ""
                    },
                    dataType: "json",
                    success: (res) => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            this.setData({
                                popup_success_content_status: false,
                                popup_abnormal_content_status: false
                            });
                            app.globalData.showToast(res.data.msg, "success");
                            if (params.back) {
                                setTimeout(() => {
                                    uni.navigateBack();
                                }, 500);
                            } else {
                                this.init();
                            }
                        } else {
                            if (app.globalData.is_login_check(res.data, this, "order_status_handle", params)) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },
        }
    };
</script>
<style>
    @import './order-detail.css';
</style>
