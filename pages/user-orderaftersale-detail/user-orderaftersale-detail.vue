<template>
    <view :class="theme_view">
        <view v-if="order_data != null" class="padding-horizontal-main padding-top">
            <!-- 商品 -->
            <view class="goods padding-main border-radius-main bg-white spacing-mb">
                <view class="goods-item oh">
                    <view :data-value="order_data.items.goods_url" @tap="url_event" class="cp">
                        <image class="goods-image fl radius" :src="order_data.items.images" mode="aspectFill"></image>
                        <view class="goods-base">
                            <view class="multi-text">{{ order_data.items.title }}</view>
                            <view v-if="order_data.items.spec != null" class="margin-top-sm">
                                <block v-for="(sv, si) in order_data.items.spec" :key="si">
                                    <text v-if="si > 0" class="cr-grey padding-left-xs padding-right-xs">;</text>
                                    <text class="cr-grey">{{ sv.value }}</text>
                                </block>
                            </view>
                            <view class="margin-top-sm">
                                <text class="fw-b">{{ order_data.currency_data.currency_symbol }}{{ order_data.items.price }}</text>
                                <text class="margin-left-sm">x{{ order_data.items.buy_number }}</text>
                            </view>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 客服信息 -->
            <view v-if="(plugins_intellectstools_data || null) != null" class="bg-white padding-main border-radius-main spacing-mb">
                <view v-if="(plugins_intellectstools_data.service_msg || null) != null" class="cr-red margin-bottom">{{ plugins_intellectstools_data.service_msg }}</view>
                <button type="default" size="mini" class="bg-main br-main cr-white text-size-sm padding-left-xxxl padding-right-xxxl round" @tap="plugins_intellectstools_service_open_event">
                    <view class="dis-inline-block va-m margin-right-sm lh-0">
                        <uni-icons type="chatbubble" size="34rpx" color="#fff"></uni-icons>
                    </view>
                    <text>{{$t('user.user.ki1nor')}}</text>
                </button>
            </view>

            <!-- 基础信息 -->
            <view v-if="new_aftersale_data != null">
                <!-- 提示/退货 -->
                <view v-if="new_aftersale_data.status <= 2" class="msg-tips padding-main border-radius-main spacing-mb">
                    <text class="msg-text">{{ new_aftersale_data.tips_msg.title }}</text>
                    <text class="msg-a margin-left-sm" @tap="show_aftersale_event"> {{$t('common.view_text')}} >></text>
                    <view v-if="new_aftersale_data.status == 1 && new_aftersale_data.type == 1 && return_goods_address != null" class="margin-top-sm oh">
                        <button class="bg-green cr-white round dis-block fl" type="default" size="mini" @tap="delivery_submit_event">{{$t('user-orderaftersale-detail.user-orderaftersale-detail.uuhf62')}}</button>
                    </view>
                </view>

                <!-- 退货地址 -->
                <view v-if="new_aftersale_data.status == 1 && new_aftersale_data.type == 1 && return_goods_address != null" class="return-address msg-tips msg-tips-warning padding-main border-radius-main spacing-mb">
                    <text class="cr-base fw-b">{{$t('user-orderaftersale-detail.user-orderaftersale-detail.00je4f')}}</text>
                    <view class="cr-blue" @tap="text_event" data-event="copy" :data-value="return_goods_address.name + ' ' + return_goods_address.tel + ' ' + return_goods_address.address">
                        <view>
                            <text class="margin-right-xxxl">{{ return_goods_address.name }}</text>
                            <text>{{ return_goods_address.tel }}</text>
                        </view>
                        <view>{{ return_goods_address.address }}</view>
                    </view>
                </view>

                <!-- 提示 -->
                <view v-if="new_aftersale_data.status >= 3" :class="'msg-tips padding-main border-radius-main spacing-mb ' + (new_aftersale_data.status == 3 ? 'msg-tips-success' : new_aftersale_data.status == 4 ? 'msg-tips-danger' : 'msg-tips-warning')">
                    <text class="msg-text">{{ new_aftersale_data.tips_msg.title }}</text>
                    <text class="msg-a margin-left-sm" @tap="show_aftersale_event"> {{$t('common.view_text')}} >></text>
                </view>

                <!-- 详情 -->
                <view v-if="new_aftersale_data.status != 5">
                    <!-- 申请信息 -->
                    <view class="panel-item padding-main border-radius-main bg-white spacing-mb">
                        <view class="br-b padding-bottom-main fw-b text-size">{{$t('invoice-detail.invoice-detail.s70kj4')}}</view>
                        <view class="panel-content oh">
                            <view v-for="(item, index) in panel_base_data_list" :key="index" class="item br-b oh padding-vertical-main">
                                <view class="title fl padding-right-main cr-grey">{{ item.name }}</view>
                                <view v-if="(item.is_copy || 0) == 1" class="content fl br-l padding-left-main" :data-value="new_aftersale_data[item.field] || ''" data-event="copy" @tap="text_event">
                                    <text>{{ new_aftersale_data[item.field] || '' }}</text>
                                    <text class="bg-white br-green cr-green round padding-horizontal-sm text-size-xs margin-left-sm">{{$t('common.copy')}}</text>
                                </view>
                                <view v-else class="content fl br-l padding-left-main">{{ new_aftersale_data[item.field] || '' }}</view>
                            </view>
                        </view>
                    </view>

                    <!-- 快递信息 -->
                    <view v-if="new_aftersale_data.status > 1 && new_aftersale_data.type == 1" class="panel-item padding-main border-radius-main bg-white spacing-mb">
                        <view class="br-b padding-bottom-main fw-b text-size">{{$t('user-order-detail.user-order-detail.0876xf')}}</view>
                        <view class="panel-content oh">
                            <view v-for="(item, index) in panel_express_data_list" :key="index" class="item br-b oh padding-vertical-main">
                                <view class="title fl padding-right-main cr-grey">{{ item.name }}</view>
                                <view class="content fl br-l padding-left-main">{{ new_aftersale_data[item.field] || "" }}</view>
                            </view>
                        </view>
                    </view>

                    <!-- 凭证 -->
                    <view v-if="(new_aftersale_data.images || null) != null && new_aftersale_data.images.length > 0" class="panel-item padding-main border-radius-main bg-white spacing-mb">
                        <view class="br-b padding-bottom-main fw-b text-size">{{$t('user-orderaftersale-detail.user-orderaftersale-detail.4y2c1l')}}</view>
                        <view class="panel-content-images oh">
                            <view v-for="(item, index) in new_aftersale_data.images" :key="index" class="fl item padding-sm">
                                <image :src="item" mode="aspectFill" @tap="images_view_event" :data-index="index" class="dis-block radius"></image>
                            </view>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 没有售后数据/售后数据为已取消则可以重新申请售后 -->
            <view v-if="new_aftersale_data == null || new_aftersale_data.status == 5">
                <!-- 类型选择 -->
                <view v-if="aftersale_type_list.length > 0" class="choose-type padding-main border-radius-main bg-white oh spacing-mb">
                    <block v-for="(item, index) in aftersale_type_list" :key="index">
                        <view :class="'choose-item radius padding-main br ' + (index == 0 ? 'fl' : 'fr') + ' ' + (form_type == item.value ? 'br-main' : '')" :data-value="item.value" @tap="form_type_event">
                            <view class="fw-b margin-bottom-xs">{{ item.name }}</view>
                            <view class="cr-grey">{{ item.desc }}</view>
                        </view>
                    </block>
                </view>

                <!-- 表单 -->
                <view v-if="form_type != null" class="form-container oh spacing-mb">
                    <view class="form-gorup">
                        <view class="form-gorup-title">{{$t('user-orderaftersale-detail.user-orderaftersale-detail.bprwq9')}}<text class="form-group-tips-must">*</text></view>
                        <picker @change="form_reason_event" :value="form_reason_index" :range="reason_data_list">
                            <view :class="'picker ' + (form_reason_index == null ? 'cr-grey' : 'cr-base') + ' arrow-right'">
                                {{ form_reason_index == null ? $t("user-orderaftersale-detail.user-orderaftersale-detail.21icul") : reason_data_list[form_reason_index] }}
                            </view>
                        </picker>
                    </view>

                    <view v-if="form_type == 1" class="form-gorup">
                        <view class="form-gorup-title"
                            >{{$t('user-orderaftersale-detail.user-orderaftersale-detail.85pnkf')}}<text class="form-group-tips">{{$t('user-orderaftersale-detail.user-orderaftersale-detail.84upo4')}}{{ returned_data.returned_quantity }}</text></view
                        >
                        <slider @change="form_number_event" min="0" :max="returned_data.returned_quantity" step="1" :value="returned_data.returned_quantity" show-value></slider>
                    </view>

                    <view class="form-gorup">
                        <view class="form-gorup-title"
                            >{{$t('order-detail.order-detail.v52n5r')}}<text class="form-group-tips">{{$t('user-orderaftersale-detail.user-orderaftersale-detail.1252if')}}{{ returned_data.refund_price }}</text></view
                        >
                        <input type="digit" @input="form_price_event" placeholder-class="cr-grey" class="cr-base" :placeholder="$t('user-orderaftersale-detail.user-orderaftersale-detail.9kvu52')" :value="form_price" />
                    </view>

                    <view class="form-gorup">
                        <view class="form-gorup-title">{{$t('user-orderaftersale-detail.user-orderaftersale-detail.9p6b1y')}}</view>
                        <textarea @input="form_msg_event" placeholder-class="cr-grey" class="cr-base" :placeholder="$t('user-orderaftersale-detail.user-orderaftersale-detail.4f8u0c')" maxlength="200" :auto-height="true" :value="form_msg"></textarea>
                    </view>

                    <view class="form-gorup form-container-upload oh">
                        <view class="form-gorup-title">{{$t('user-orderaftersale-detail.user-orderaftersale-detail.4y9355')}}<text class="form-group-tips">{{$t('user-orderaftersale-detail.user-orderaftersale-detail.1l42ms')}}</text></view>
                        <view class="form-upload-data oh">
                            <block v-if="form_images_list.length > 0">
                                <view v-for="(item, index) in form_images_list" :key="index" class="item fl">
                                    <text class="delete-icon" @tap="upload_delete_event" :data-index="index">x</text>
                                    <image :src="item" @tap="upload_show_event" :data-index="index" mode="aspectFill"></image>
                                </view>
                            </block>
                            <image v-if="(form_images_list || null) == null || form_images_list.length < 3" class="item fl upload-icon" :src="common_static_url + 'upload-icon.png'" mode="aspectFill" @tap="file_upload_event"></image>
                        </view>
                    </view>
                    <view class="form-gorup form-gorup-submit">
                        <button class="bg-main br-main cr-white round text-size" type="default" @tap="form_submit_event" hover-class="none" :disabled="form_button_disabled">{{$t('common.submit')}}</button>
                    </view>
                </view>
            </view>
        </view>
        <view v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </view>

        <block v-if="new_aftersale_data != null && new_aftersale_data.status != 5">
            <!-- 结尾 -->
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
        </block>

        <!-- 退货弹层 -->
        <component-popup :propShow="popup_delivery_status" propPosition="bottom" @onclose="popup_delivery_close_event">
            <view class="delivery-popup bg-base padding-horizontal-main padding-top-main">
                <view class="fr oh">
                    <view class="fr" @tap.stop="popup_delivery_close_event">
                        <iconfont name="icon-close-o" size="28rpx" color="#999"></iconfont>
                    </view>
                </view>
                <view class="margin-top-xxxl padding-top-xxl">
                    <view class="form-container">
                        <view class="form-gorup">
                            <view class="form-gorup-title">{{$t('invoice-detail.invoice-detail.2000a0')}}<text class="form-group-tips-must">*</text></view>
                            <input type="text" @input="form_express_name_event" placeholder-class="cr-grey" class="cr-base" :placeholder="$t('user-orderaftersale-detail.user-orderaftersale-detail.6d14hq')" :value="form_express_name" />
                        </view>
                        <view class="form-gorup">
                            <view class="form-gorup-title">{{$t('user-order-detail.user-order-detail.2byl8l')}}<text class="form-group-tips-must">*</text></view>
                            <input type="text" @input="form_express_number_event" placeholder-class="cr-grey" class="cr-base" :placeholder="$t('user-orderaftersale-detail.user-orderaftersale-detail.8tt862')" :value="form_express_number" />
                        </view>
                        <view class="form-gorup form-gorup-submit">
                            <button class="bg-main br-main cr-white round text-size" type="default" @tap="form_delivery_submit_event" hover-class="none" :disabled="form_button_disabled">{{$t('common.submit')}}</button>
                        </view>
                    </view>
                </view>
            </view>
        </component-popup>

        <!-- 客服弹窗 -->
        <component-popup :propShow="plugins_intellectstools_service_status" propPosition="bottom" @onclose="plugins_intellectstools_service_close_event">
            <view class="padding-top-main bg-white">
                <view class="padding-horizontal-main">
                    <view class="close oh">
                        <view class="fr" @tap.stop="plugins_intellectstools_service_close_event">
                            <iconfont name="icon-close-o" size="28rpx" color="#999"></iconfont>
                        </view>
                    </view>
                </view>
                <view class="popup-service-container">
                    <view v-if="(plugins_intellectstools_data || null) != null" class="header-service">
                        <view v-if="(plugins_intellectstools_data.chat || null) != null" class="item padding-main br-t-f9 single-text">
                            <text class="va-m">{{$t('detail.detail.r4124d')}}</text>
                            <view class="dis-inline-block chat-info cp" @tap="chat_event">
                                <image class="dis-inline-block va-m" :src="plugins_intellectstools_data.chat.icon" mode="scaleToFill"></image>
                                <text class="margin-left-sm va-m cr-blue" :data-value="plugins_intellectstools_data.chat.chat_url">{{ plugins_intellectstools_data.chat.name }}</text>
                            </view>
                        </view>
                        <view v-if="(plugins_intellectstools_data.service_qq || null) != null" class="item padding-main br-t-f9 single-text">
                            <text>Q Q：</text>
                            <text class="cp" @tap="text_event" data-event="copy" :data-value="plugins_intellectstools_data.service_qq">{{ plugins_intellectstools_data.service_qq }}</text>
                        </view>
                        <view v-if="(plugins_intellectstools_data.service_tel || null) != null" class="item padding-main br-t-f9 single-text">
                            <text>{{$t('order.order.7dxbm5')}}</text>
                            <text class="cp" @tap="text_event" data-event="tel" :data-value="plugins_intellectstools_data.service_tel">{{ plugins_intellectstools_data.service_tel }}</text>
                        </view>
                        <view v-if="(plugins_intellectstools_data.service_weixin || null) != null || (plugins_intellectstools_data.service_line || null) != null" class="oh qrcode tc br-t-f9 padding-top-main">
                            <view v-if="(plugins_intellectstools_data.service_weixin || null) != null" class="item padding-bottom-lg dis-inline-block">
                                <image class="radius cp" :src="plugins_intellectstools_data.service_weixin" mode="scaleToFill" @tap="image_show_event" :data-value="plugins_intellectstools_data.service_weixin"></image>
                                <view>{{$t('detail.detail.54k10s')}}</view>
                            </view>
                            <view v-if="(plugins_intellectstools_data.service_line || null) != null" class="item padding-bottom-lg dis-inline-block">
                                <image class="radius cp" :src="plugins_intellectstools_data.service_line" mode="scaleToFill" @tap="image_show_event" :data-value="plugins_intellectstools_data.service_line"></image>
                                <view>{{$t('detail.detail.vj4nom')}}</view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </component-popup>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentPopup from "@/components/popup/popup";
    import componentNoData from "@/components/no-data/no-data";
    import componentBottomLine from "@/components/bottom-line/bottom-line";

    var common_static_url = app.globalData.get_static_url("common");
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                common_static_url: common_static_url,
                params: null,
                data_list_loding_status: 1,
                data_list_loding_msg: "",
                data_bottom_line_status: false,
                popup_delivery_status: false,
                // 接口数据
                editor_path_type: "",
                order_data: null,
                new_aftersale_data: null,
                step_data: null,
                returned_data: null,
                return_only_money_reason: [],
                return_money_goods_reason: [],
                aftersale_type_list: [],
                reason_data_list: [],
                return_goods_address: null,
                // 售后基础信息
                panel_base_data_list: [
                    {
                        name: this.$t('user-orderaftersale-detail.user-orderaftersale-detail.50cm8m'),
                        field: "type_text",
                    },
                    {
                        name: this.$t('user-order-detail.user-order-detail.n18sd2'),
                        field: "order_no",
                        is_copy: 1
                    },
                    {
                        name: this.$t('user-orderaftersale-detail.user-orderaftersale-detail.17j4cy'),
                        field: "status_text",
                    },
                    {
                        name: this.$t('user-orderaftersale-detail.user-orderaftersale-detail.r2oy43'),
                        field: "reason",
                    },
                    {
                        name: this.$t('user-orderaftersale-detail.user-orderaftersale-detail.c53k23'),
                        field: "number",
                    },
                    {
                        name: this.$t('order-detail.order-detail.v52n5r'),
                        field: "price",
                    },
                    {
                        name: this.$t('user-orderaftersale-detail.user-orderaftersale-detail.9p6b1y'),
                        field: "msg",
                    },
                    {
                        name: this.$t('user-orderaftersale-detail.user-orderaftersale-detail.5t586p'),
                        field: "refundment_text",
                    },
                    {
                        name: this.$t('invoice-detail.invoice-detail.rpdwd3'),
                        field: "refuse_reason",
                    },
                    {
                        name: this.$t('common.apply_time'),
                        field: "apply_time",
                    },
                    {
                        name: this.$t('user-order-detail.user-order-detail.9vivhl'),
                        field: "confirm_time",
                    },
                    {
                        name: this.$t('user-orderaftersale-detail.user-orderaftersale-detail.bifwmx'),
                        field: "delivery_time",
                    },
                    {
                        name: this.$t('user-orderaftersale-detail.user-orderaftersale-detail.8n414b'),
                        field: "audit_time",
                    },
                    {
                        name: this.$t('user-order-detail.user-order-detail.1jpv4n'),
                        field: "cancel_time",
                    },
                    {
                        name: this.$t('common.add_time'),
                        field: "add_time",
                    },
                    {
                        name: this.$t('common.upd_time'),
                        field: "upd_time",
                    },
                ],
                // 快递信息
                panel_express_data_list: [
                    {
                        name: this.$t('invoice-detail.invoice-detail.2000a0'),
                        field: "express_name",
                    },
                    {
                        name: this.$t('user-order-detail.user-order-detail.2byl8l'),
                        field: "express_number",
                    },
                    {
                        name: this.$t('user-orderaftersale-detail.user-orderaftersale-detail.bifwmx'),
                        field: "delivery_time",
                    },
                ],
                // 表单数据
                form_button_disabled: false,
                form_type: null,
                form_reason_index: null,
                form_price: "",
                form_msg: "",
                form_number: 0,
                form_images_list: [],
                form_express_name: "",
                form_express_number: "",
                // 智能工具插件、客服信息展示
                plugins_intellectstools_data: null,
                plugins_intellectstools_service_status: false,
            };
        },

        components: {
            componentCommon,
            componentPopup,
            componentNoData,
            componentBottomLine,
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            this.setData({
                params: params,
                popup_delivery_status: (params.is_delivery_popup || 0) == 1,
            });
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 数据加载
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
            this.init();
        },

        methods: {
            // 获取数据
            init() {
                this.setData({
                    data_list_loding_status: 1,
                });
                uni.request({
                    url: app.globalData.get_request_url("aftersale", "orderaftersale"),
                    method: "POST",
                    data: {
                        oid: this.params.oid,
                        did: this.params.did,
                    },
                    dataType: "json",
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
                                data_list_loding_status: 3,
                                data_bottom_line_status: true,
                                data_list_loding_msg: "",
                                editor_path_type: data.editor_path_type || "",
                                order_data: data.order_data || null,
                                new_aftersale_data: (data.new_aftersale_data || null) == null || data.new_aftersale_data.length <= 0 ? null : data.new_aftersale_data,
                                step_data: data.step_data || null,
                                returned_data: data.returned_data || null,
                                return_only_money_reason: data.return_only_money_reason || [],
                                return_money_goods_reason: data.return_money_goods_reason || [],
                                aftersale_type_list: data.aftersale_type_list || [],
                                return_goods_address: data.return_goods_address || null,
                                form_price: data.returned_data || null != null ? data.returned_data.refund_price : '',
                                plugins_intellectstools_data: data.plugins_intellectstools_data || null,
                            });
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                                data_bottom_line_status: false,
                                data_list_loding_msg: res.data.msg,
                            });
                            if (app.globalData.is_login_check(res.data, this, "init")) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_bottom_line_status: false,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 类型选择
            form_type_event(e) {
                var value = e.currentTarget.dataset.value;
                this.setData({
                    form_type: value,
                    form_reason_index: this.form_type == value ? this.form_reason_index : null,
                    reason_data_list: value == 0 ? this.return_only_money_reason : this.return_money_goods_reason,
                    form_number: value == 0 ? 0 : this.returned_data.returned_quantity,
                });
            },

            // 原因选择
            form_reason_event(e) {
                this.setData({
                    form_reason_index: e.detail.value,
                });
            },

            // 商品件数
            form_number_event(e) {
                this.setData({
                    form_number: e.detail.value,
                });
            },

            // 退款金额
            form_price_event(e) {
                this.setData({
                    form_price: e.detail.value,
                });
            },

            // 退款说明
            form_msg_event(e) {
                this.setData({
                    form_msg: e.detail.value,
                });
            },

            // 快递名称
            form_express_name_event(e) {
                this.setData({
                    form_express_name: e.detail.value,
                });
            },

            // 快递单号
            form_express_number_event(e) {
                this.setData({
                    form_express_number: e.detail.value,
                });
            },

            // 上传图片预览
            upload_show_event(e) {
                uni.previewImage({
                    current: this.form_images_list[e.currentTarget.dataset.index],
                    urls: this.form_images_list,
                });
            },

            // 图片删除
            upload_delete_event(e) {
                var self = this;
                uni.showModal({
                    title: this.$t('common.warm_tips'),
                    content: this.$t('order.order.psi67g'),
                    success(res) {
                        if (res.confirm) {
                            var list = self.form_images_list;
                            list.splice(e.currentTarget.dataset.index, 1);
                            self.setData({
                                form_images_list: list,
                            });
                        }
                    },
                });
            },

            // 文件上传
            file_upload_event(e) {
                var self = this;
                uni.chooseImage({
                    count: 3,
                    success(res) {
                        var success = 0;
                        var fail = 0;
                        var length = res.tempFilePaths.length;
                        var count = 0;
                        self.upload_one_by_one(res.tempFilePaths, success, fail, count, length);
                    },
                });
            },

            // 采用递归的方式上传多张
            upload_one_by_one(img_paths, success, fail, count, length) {
                var self = this;
                if (self.form_images_list.length < 3) {
                    uni.uploadFile({
                        url: app.globalData.get_request_url("index", "ueditor"),
                        filePath: img_paths[count],
                        name: "upfile",
                        formData: {
                            action: "uploadimage",
                            path_type: self.editor_path_type,
                        },
                        success: function (res) {
                            success++;
                            if (res.statusCode == 200) {
                                var data = typeof res.data == "object" ? res.data : JSON.parse(res.data);
                                if (data.code == 0 && (data.data.url || null) != null) {
                                    var list = self.form_images_list;
                                    list.push(data.data.url);
                                    self.setData({
                                        form_images_list: list,
                                    });
                                } else {
                                    app.globalData.showToast(data.msg);
                                }
                            }
                        },
                        fail: function (e) {
                            fail++;
                        },
                        complete: function (e) {
                            count++;

                            // 下一张
                            if (count >= length) {
                                // 上传完毕，作一下提示
                                //app.showToast('上传成功' + success +'张', 'success');
                            } else {
                                // 递归调用，上传下一张
                                self.upload_one_by_one(img_paths, success, fail, count, length);
                            }
                        },
                    });
                }
            },

            // 售后表单提交
            form_submit_event(e) {
                // 表单数据
                var form_data = {
                    order_id: this.params.oid,
                    order_detail_id: this.params.did,
                    type: this.form_type,
                    reason: this.reason_data_list[this.form_reason_index],
                    number: this.form_type == 0 ? 0 : this.form_number,
                    price: this.form_price,
                    msg: this.form_msg,
                    images: this.form_images_list.length > 0 ? JSON.stringify(this.form_images_list) : "",
                };

                // 防止金额大于计算的金额
                var refund_price = parseFloat(this.returned_data["refund_price"]);
                if (form_data["price"] > refund_price) {
                    form_data["price"] =refund_price;
                }

                // 防止数量大于计算的数量
                var returned_quantity = parseInt(this.returned_data["returned_quantity"]);
                if (form_data["number"] > returned_quantity) {
                    form_data["number"] = returned_quantity;
                }

                // 数据校验
                var validation = [
                    {
                        fields: "type",
                        msg: this.$t('user-orderaftersale-detail.user-orderaftersale-detail.23v6rp'),
                        is_can_zero: 1,
                    },
                    {
                        fields: "reason",
                        msg: this.$t('user-orderaftersale-detail.user-orderaftersale-detail.21icul'),
                    },
                ];
                if (form_data["type"] == 1) {
                    validation.push({
                        fields: "number",
                        msg: this.$t('user-orderaftersale-detail.user-orderaftersale-detail.dn3423'),
                    });
                }

                // 校验参数并提交
                if (app.globalData.fields_check(form_data, validation)) {
                    var self = this;
                    uni.showLoading({
                        title: this.$t('common.processing_in_text'),
                    });
                    self.setData({
                        form_button_disabled: true,
                    });
                    uni.request({
                        url: app.globalData.get_request_url("create", "orderaftersale"),
                        method: "POST",
                        data: form_data,
                        dataType: "json",
                        success: (res) => {
                            uni.hideLoading();
                            if (res.data.code == 0) {
                                app.globalData.showToast(res.data.msg, "success");
                                setTimeout(function () {
                                    self.setData({
                                        form_button_disabled: false,
                                    });
                                    self.init();
                                }, 1000);
                            } else {
                                self.setData({
                                    form_button_disabled: false,
                                });
                                app.globalData.showToast(res.data.msg);
                            }
                        },
                        fail: () => {
                            uni.hideLoading();
                            self.setData({
                                form_button_disabled: false,
                            });
                            app.globalData.showToast(this.$t('common.internet_error_tips'));
                        },
                    });
                }
            },

            // 退货开启弹层
            delivery_submit_event(e) {
                this.setData({
                    popup_delivery_status: true,
                });
            },

            // 退货弹层关闭
            popup_delivery_close_event(e) {
                this.setData({
                    popup_delivery_status: false,
                });
            },

            // 退货表单
            form_delivery_submit_event(e) {
                // 表单数据
                var form_data = {
                    id: this.new_aftersale_data.id,
                    express_name: this.form_express_name,
                    express_number: this.form_express_number,
                };

                // 数据校验
                var validation = [
                    {
                        fields: "express_name",
                        msg: this.$t('user-orderaftersale-detail.user-orderaftersale-detail.c9e2ms'),
                    },
                    {
                        fields: "express_number",
                        msg: this.$t('user-orderaftersale-detail.user-orderaftersale-detail.ld10pm'),
                    },
                ];

                // 校验参数并提交
                if (app.globalData.fields_check(form_data, validation)) {
                    var self = this;
                    uni.showLoading({
                        title: this.$t('common.processing_in_text'),
                    });
                    self.setData({
                        form_button_disabled: true,
                    });
                    uni.request({
                        url: app.globalData.get_request_url("delivery", "orderaftersale"),
                        method: "POST",
                        data: form_data,
                        dataType: "json",
                        success: (res) => {
                            uni.hideLoading();
                            self.setData({
                                popup_delivery_status: false,
                            });
                            if (res.data.code == 0) {
                                app.globalData.showToast(res.data.msg, "success");
                                setTimeout(function () {
                                    self.setData({
                                        form_button_disabled: false,
                                    });
                                    self.init();
                                }, 1000);
                            } else {
                                self.setData({
                                    form_button_disabled: false,
                                });
                                app.globalData.showToast(res.data.msg);
                            }
                        },
                        fail: () => {
                            uni.hideLoading();
                            self.setData({
                                form_button_disabled: false,
                            });
                            app.globalData.showToast(this.$t('common.internet_error_tips'));
                        },
                    });
                }
            },

            // 凭证图片预览
            images_view_event(e) {
                uni.previewImage({
                    current: this.new_aftersale_data.images[e.currentTarget.dataset.index],
                    urls: this.new_aftersale_data.images,
                });
            },

            // 查看售后数据
            show_aftersale_event(e) {
                app.globalData.url_open('/pages/user-orderaftersale/user-orderaftersale?keywords=' + this.new_aftersale_data.order_no);
            },

            // 开启客服弹层
            plugins_intellectstools_service_open_event(e) {
                this.setData({
                    plugins_intellectstools_service_status: true,
                });
            },
            
            // 关闭客服弹层
            plugins_intellectstools_service_close_event(e) {
                this.setData({
                    plugins_intellectstools_service_status: false,
                });
            },

            // 图片预览
            image_show_event(e) {
                app.globalData.image_show_event(e);
            },

            // 进入客服系统
            chat_event() {
                app.globalData.chat_entry_handle(this.plugins_intellectstools_data.chat.chat_url);
            },

            // 文本事件
            text_event(e) {
                app.globalData.text_event_handle(e);
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            }
        },
    };
</script>
<style>
    @import "./user-orderaftersale-detail.css";
</style>
