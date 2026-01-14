<template>
    <view :class="theme_view">
        <view v-if="order_data != null && (order_data.items || null) != null" class="padding-horizontal-main padding-top">
            <!-- 商品 -->
            <view class="goods padding-main border-radius-main bg-white spacing-mb">
                <view class="goods-item oh">
                    <view :data-value="order_data.items.goods_url" @tap="url_event" class="cp">
                        <image class="goods-image fl radius" :src="order_data.items.images" mode="aspectFill"></image>
                        <view class="goods-base">
                            <view class="multi-text">{{ order_data.items.title }}</view>
                            <view v-if="order_data.items.spec != null" class="margin-top-xs">
                                <block v-for="(sv, si) in order_data.items.spec" :key="si">
                                    <text v-if="si > 0" class="cr-grey padding-left-xs padding-right-xs">;</text>
                                    <text class="cr-grey">{{ sv.value }}</text>
                                </block>
                            </view>
                            <view class="margin-top-xs">
                                <text class="fw-b">{{ order_data.currency_data.currency_symbol }}{{ order_data.items.price }}</text>
                                <text class="margin-left-sm">x{{ order_data.items.buy_number }}</text>
                            </view>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 基础信息 -->
            <view v-if="aftersale_data != null && is_create_aftersale == 0">
                <!-- 退货地址 -->
                <view v-if="aftersale_data.status == 1 && aftersale_data.type == 1 && return_goods_address != null" class="bg-white padding-main border-radius-main spacing-mb" @tap="text_event" data-event="copy" :data-value="return_goods_address.name + ' ' + return_goods_address.tel + ' ' + return_goods_address.address">
                    <text class="cr-base fw-b">{{$t('user-orderaftersale-detail.user-orderaftersale-detail.00je4f')}}</text>
                    <text class="bg-white br-green cr-green round padding-horizontal-sm text-size-xs margin-left-sm">{{$t('common.copy')}}</text>
                    <view class="cr-blue margin-top-sm">
                        <view>
                            <text class="margin-right-xxxl">{{ return_goods_address.name }}</text>
                            <text>{{ return_goods_address.tel }}</text>
                        </view>
                        <view>{{ return_goods_address.address }}</view>
                    </view>
                </view>

                <!-- 提示 -->
                <view class="bg-white padding-main border-radius-main spacing-mb">
                    <!-- 售后状态，退货，取消，智能工具箱插件（客服信息），多商户售后争议数据 -->
                    <view class="fw-b text-size" :class="aftersale_data.status == 3 ? 'cr-green' : (aftersale_data.status == 4 ? 'cr-red' : '')">{{ aftersale_data.tips_msg.title }}</view>
                    <view v-if="(aftersale_data.tips_msg.desc || null) != null" class="cr-grey margin-top-sm">{{ aftersale_data.tips_msg.desc }}</view>
                    <view v-if="(plugins_intellectstools_data || null) != null && (plugins_intellectstools_data.service_msg || null) != null" class="cr-grey margin-top-sm">{{ plugins_intellectstools_data.service_msg }}</view>
                    <view v-if="(aftersale_data.status != 3 && aftersale_data.status != 5) || (aftersale_data.status == 1 && aftersale_data.type == 1 && return_goods_address != null) || ((plugins_intellectstools_data || null) != null) || ((plugins_shop_data || null) != null && (plugins_shop_data.status || 0) == 1 && (plugins_shop_data.dispute_data || null) == null)" class="margin-top-sm oh">
                        <button v-if="aftersale_data.status == 1 && aftersale_data.type == 1 && return_goods_address != null" class="bg-green br-green cr-white round margin-right" type="default" size="mini" @tap="delivery_submit_event">{{$t('user-orderaftersale-detail.user-orderaftersale-detail.uuhf62')}}</button>
                        <button v-if="aftersale_data.status != 3 && aftersale_data.status != 5" class="bg-yellow br-yellow cr-white round margin-right" type="default" size="mini" @tap="cancel_event" hover-class="none">{{$t('common.cancel')}}</button>
                        <block v-if="(plugins_intellectstools_data || null) != null">
                            <button v-if="(plugins_intellectstools_data.base_chat || null) != null" type="default" size="mini" class="bg-green br-green cr-white round margin-right" data-value="base_chat" @tap="plugins_intellectstools_service_open_event" hover-class="none">
                                <iconfont name="icon-chat" size="28rpx" class="cr-white"></iconfont>
                                <text class="margin-left-xs">{{plugins_intellectstools_data.base_chat.title}}</text>
                            </button>
                            <button v-if="(plugins_intellectstools_data.platform_chat || null) != null" type="default" size="mini" class="bg-white br-main cr-main round margin-right" data-value="platform_chat" @tap="plugins_intellectstools_service_open_event" hover-class="none">
                                <iconfont name="icon-chat" size="28rpx" class="cr-main"></iconfont>
                                <text class="margin-left-xs">{{plugins_intellectstools_data.platform_chat.title}}</text>
                            </button>
                        </block>
                        <button v-if="(plugins_shop_data || null) != null && (plugins_shop_data.status || 0) == 1 && (plugins_shop_data.dispute_data || null) == null" type="default" size="mini" class="bg-main br-main cr-white round" @tap="plugins_shop_dispute_interfere_open_event" hover-class="none">{{$t('user-orderaftersale-detail.user-orderaftersale-detail.sdsfgg')}}</button>
                    </view>
                    <view v-if="(plugins_shop_data || null) != null && (plugins_shop_data.status || 0) == 1 && (plugins_shop_data.dispute_data || null) != null" class="margin-top-lg">
                        <view>
                            <text class="cr-red">{{$t('user-orderaftersale-detail.user-orderaftersale-detail.t67iug')}}</text>
                            <text v-if="plugins_shop_data.dispute_data.status <= 1" class="cr-blue cp margin-left-xxl" @tap="dispute_cancel_event">{{$t('common.cancel')}}</text>
                        </view>
                        <view class="margin-top-xs">
                            <text class="cr-grey">{{$t('common.status')}}：</text>
                            <text>{{plugins_shop_data.dispute_data.status_name}}</text>
                        </view>
                        <view class="margin-top-xs">
                            <text class="cr-grey">{{$t('common.reason')}}：</text>
                            <text>{{plugins_shop_data.dispute_data.describe}}</text>
                        </view>
                        <view class="margin-top-xs">
                            <text class="cr-grey">{{$t('common.refuse')}}/{{$t('common.close_reason')}}：</text>
                            <text>{{plugins_shop_data.dispute_data.reason}}</text>
                        </view>
                        <view class="margin-top-xs">
                            <text class="cr-grey">{{$t('common.apply_time')}}：</text>
                            <text>{{plugins_shop_data.dispute_data.add_time}}</text>
                        </view>
                    </view>
                </view>

                <!-- 售后争议 -->
                <view v-if="(plugins_shop_data || null) != null && (plugins_shop_data.status || 0) == 1 && (plugins_shop_data.dispute_data || null) != null" class="panel-item padding-main border-radius-main bg-white spacing-mb">
                    <view class="br-b padding-bottom-main fw-b text-size">{{$t('common.dispute_chat')}}</view>
                    <view class="panel-content">
                        <view v-if="chat_user_list.length > 0" class="chat-head oh flex-row gap-10 tc margin-top">
                            <view v-for="(item, index) in chat_user_list" :key="index">
                                <view class="chat-user-avatar">
                                    <image :src="item.chat_avatar" class="image br-grey-f5 circle" mode="aspectFit"></image>
                                    <view class="chat-user-status auto pr bg-white circle">
                                        <iconfont name="icon-select" size="28rpx" :class="item.status == 1 ? 'cr-green' : 'cr-grey'"></iconfont>
                                    </view>
                                </view>
                                <view class="text-size-sm">{{item.chat_user}}（{{item.chat_user_type_name}}）</view>
                            </view>
                        </view>
                        <scroll-view scroll-y="true" :scroll-top="chat_content_scroll_top_value" :scroll-with-animation="true" class="chat-content bs-bb bg-grey-f5 oh margin-top padding radius">
                            <view v-if="chat_more_submit_status" class="padding-top-sm padding-bottom-xl tc">
                                <view class="dis-inline-block cr-blue" @tap="chat_more_submit_event">
                                    <text class="dis-inline-block">{{$t('common.view_history')}}</text>
                                    <view class="dis-inline-block margin-left-xs">
                                        <iconfont name="icon-angle-double-up" size="24rpx" class="cr-blue"></iconfont>
                                    </view>
                                </view>
                            </view>
                            <view v-if="chat_loading_status" class="padding-top-sm padding-bottom-xl tc">
                                <text class="cr-grey">{{$t('common.loading_in_text')}}</text>
                            </view>
                            <view v-if="chat_no_data_status" class="padding-top-xxxxl tc">
                                <text class="cr-grey">{{$t('common.no_chat_record')}}</text>
                            </view>
                            <view v-if="(chat_error_msg || null) != null" class="padding-top-xxxxl tc">
                                <text class="cr-grey">{{chat_error_msg}}！</text>
                            </view>
                            <block v-if="chat_data_list.length > 0">
                                <view v-for="(item, index) in chat_data_list" :key="index" class="chat-item oh padding-bottom-lg">
                                    <view v-if="item.chat_user_type == chat_user_type" class="flex-row align-s gap-10 fr">
                                        <view class="content oh">
                                            <view class="tr">
                                                <view class="cr-grey text-size-xss">{{item.add_time}}</view>
                                                <view class="cr-base">{{item.chat_user}}（{{item.chat_user_type_name}}）</view>
                                            </view>
                                            <view class="bg-white radius padding-sm margin-top-sm fr">
                                                <image v-if="item.type == 1" :src="item.content" @tap="image_show_event" :data-value="item.content" class="content-image radius dis-block" mode="aspectFit"></image>
                                                <video v-else-if="item.type == 2" :src="item.content" class="content-video radius dis-block" controls></video>
                                                <block v-else>
                                                    <view v-for="(items, indexs) in item.content" :key="indexs">
                                                        {{items}}
                                                    </view>
                                                </block>
                                            </view>
                                        </view>
                                        <image :src="item.chat_avatar" class="image br-grey-f5 circle" mode="aspectFit"></image>
                                    </view>
                                    <view v-else class="flex-row align-s gap-10 fl">
                                        <image :src="item.chat_avatar" class="image br-grey-f5 circle" mode="aspectFit"></image>
                                        <view class="content oh">
                                            <view class="tl">
                                                <view class="cr-grey text-size-xss">{{item.add_time}}</view>
                                                <view class="cr-base">{{item.chat_user}}（{{item.chat_user_type_name}}）</view>
                                            </view>
                                            <view class="bg-white radius padding-sm margin-top-sm fl">
                                                <image v-if="item.type == 1" :src="item.content" @tap="image_show_event" :data-value="item.content" class="content-image radius dis-block" mode="aspectFit"></image>
                                                <video v-else-if="item.type == 2" :src="item.content" class="content-video radius dis-block" controls></video>
                                                <block v-else>
                                                    <view v-for="(items, indexs) in item.content" :key="indexs">
                                                        {{items}}
                                                    </view>
                                                </block>
                                            </view>
                                        </view>
                                    </view>
                                </view>
                            </block>
                        </scroll-view>
                        <view v-if="chat_send_submit_status" class="chat-input flex-row align-s margin-top-sm">
                            <view class="flex-row align-c br radius wh-auto chat-send-input">
                                <textarea :placeholder="$t('common.input_enter_chat_tips')" class="wh-auto ht-auto padding-sm" :value="chat_input_value" @input="chat_input_event" placeholder-class="cr-grey"></textarea>
                                <view class="padding-horizontal-sm cp">
                                    <component-upload :propMaxNum="9" :propPathType="editor_path_type" :propSlot="true" :propSingleCall="true" @call-back="chat_upload_images_event">
                                        <iconfont name="icon-images" size="48rpx" color="#999"></iconfont>
                                    </component-upload>
                                </view>
                            </view>
                            <button type="default" size="mini" class="chat-send-submit bg-main br-main cr-white radius" @tap="chat_send_submit_event" :disabled="chat_send_submit_disabled_status" hover-class="none">{{$t('common.send')}}</button>
                        </view>
                    </view>
                </view>

                <!-- 详情 -->
                <view v-if="is_create_aftersale == 0">
                    <!-- 申请信息 -->
                    <view class="panel-item padding-main border-radius-main bg-white spacing-mb">
                        <view class="br-b padding-bottom-main fw-b text-size">{{$t('invoice-detail.invoice-detail.s70kj4')}}</view>
                        <view class="panel-content oh">
                            <view v-for="(item, index) in panel_base_data_list" :key="index" class="item br-b oh padding-vertical-main">
                                <view class="title fl padding-right-main cr-grey">{{ item.name }}</view>
                                <view v-if="(item.is_copy || 0) == 1" class="content fl br-l padding-left-main" :data-value="aftersale_data[item.field] || ''" data-event="copy" @tap="text_event">
                                    <text>{{ aftersale_data[item.field] || '' }}</text>
                                    <text class="bg-white br-green cr-green round padding-horizontal-sm text-size-xs margin-left-sm">{{$t('common.copy')}}</text>
                                </view>
                                <view v-else class="content fl br-l padding-left-main">{{ aftersale_data[item.field] || '' }}</view>
                            </view>
                        </view>
                    </view>

                    <!-- 快递信息 -->
                    <view v-if="aftersale_data.status > 1 && aftersale_data.type == 1" class="panel-item padding-main border-radius-main bg-white spacing-mb">
                        <view class="br-b padding-bottom-main fw-b text-size">{{$t('user-order-detail.user-order-detail.0876xf')}}</view>
                        <view class="panel-content oh">
                            <view v-for="(item, index) in panel_express_data_list" :key="index" class="item br-b oh padding-vertical-main">
                                <view class="title fl padding-right-main cr-grey">{{ item.name }}</view>
                                <view class="content fl br-l padding-left-main">{{ aftersale_data[item.field] || "" }}</view>
                            </view>
                        </view>
                    </view>

                    <!-- 凭证 -->
                    <view v-if="(aftersale_data.images || null) != null && aftersale_data.images.length > 0" class="panel-item padding-main border-radius-main bg-white spacing-mb">
                        <view class="br-b padding-bottom-main fw-b text-size">{{$t('user-orderaftersale-detail.user-orderaftersale-detail.4y2c1l')}}</view>
                        <view class="panel-content-images oh">
                            <view v-for="(item, index) in aftersale_data.images" :key="index" class="fl item padding-sm">
                                <image :src="item" mode="aspectFill" @tap="images_view_event" :data-index="index" class="dis-block radius"></image>
                            </view>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 没有售后数据/售后数据为已取消则可以重新申请售后 -->
            <view v-if="is_create_aftersale == 1">
                <!-- 智能工具箱插件（客服信息） -->
                <view v-if="((plugins_intellectstools_data || null) != null)" class="bg-white padding-main border-radius-main spacing-mb">
                    <view v-if="(plugins_intellectstools_data.service_msg || null) != null" class="cr-grey margin-top-sm">{{ plugins_intellectstools_data.service_msg }}</view>
                    <view v-if="(plugins_intellectstools_data.base_chat || null) != null || (plugins_intellectstools_data.platform_chat || null) != null" class="margin-top-sm oh">
                        <button v-if="(plugins_intellectstools_data.base_chat || null) != null" type="default" size="mini" class="bg-green br-green cr-white round margin-right" data-value="base_chat" @tap="plugins_intellectstools_service_open_event" hover-class="none">
                            <iconfont name="icon-chat" size="28rpx" class="cr-white"></iconfont>
                            <text class="margin-left-xs">{{plugins_intellectstools_data.base_chat.title}}</text>
                        </button>
                        <button v-if="(plugins_intellectstools_data.platform_chat || null) != null" type="default" size="mini" class="bg-white br-main cr-main round margin-right" data-value="platform_chat" @tap="plugins_intellectstools_service_open_event" hover-class="none">
                            <iconfont name="icon-chat" size="28rpx" class="cr-main"></iconfont>
                            <text class="margin-left-xs">{{plugins_intellectstools_data.platform_chat.title}}</text>
                        </button>
                    </view>
                </view>

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
                <view v-if="form_type != null" class="form-container spacing-mb">
                    <view class="bg-white border-radius-main oh">
                        <view class="form-gorup">
                            <view class="form-gorup-title">{{$t('user-orderaftersale-detail.user-orderaftersale-detail.bprwq9')}}<text class="form-group-tips-must">*</text></view>
                            <picker @change="form_reason_event" :value="form_reason_index" :range="reason_data_list">
                                <view :class="'picker ' + (form_reason_index == null ? 'cr-grey' : 'cr-base') + ' arrow-right'">
                                    {{ form_reason_index == null ? $t("user-orderaftersale-detail.user-orderaftersale-detail.21icul") : reason_data_list[form_reason_index] }}
                                </view>
                            </picker>
                        </view>

                        <view v-if="form_type == 1" class="form-gorup">
                            <view class="form-gorup-title">{{$t('user-orderaftersale-detail.user-orderaftersale-detail.85pnkf')}}<text class="form-group-tips">{{$t('user-orderaftersale-detail.user-orderaftersale-detail.84upo4')}}{{ returned_data.returned_quantity }}</text></view>
                            <slider @change="form_number_event" min="0" :max="returned_data.returned_quantity" step="1" :value="returned_data.returned_quantity" show-value></slider>
                        </view>

                        <view class="form-gorup">
                            <view class="form-gorup-title">{{$t('order-detail.order-detail.v52n5r')}}<text class="form-group-tips">{{$t('user-orderaftersale-detail.user-orderaftersale-detail.1252if')}}{{ returned_data.refund_price }}</text></view>
                            <input type="digit" @input="form_price_event" placeholder-class="cr-grey" class="cr-base" :placeholder="$t('user-orderaftersale-detail.user-orderaftersale-detail.9kvu52')" :value="form_price" />
                        </view>

                        <view class="form-gorup">
                            <view class="form-gorup-title">{{$t('user-orderaftersale-detail.user-orderaftersale-detail.9p6b1y')}}</view>
                            <textarea @input="form_msg_event" placeholder-class="cr-grey" class="cr-base" :placeholder="$t('user-orderaftersale-detail.user-orderaftersale-detail.4f8u0c')" maxlength="200" :auto-height="true" :value="form_msg"></textarea>
                        </view>

                        <view class="form-gorup form-container-upload oh">
                            <view class="form-gorup-title">{{$t('user-orderaftersale-detail.user-orderaftersale-detail.4y9355')}}<text class="form-group-tips">{{$t('user-orderaftersale-detail.user-orderaftersale-detail.1l42ms')}}</text></view>
                            <component-upload :propData="form_images_list" :propMaxNum="3" :propPathType="editor_path_type" @call-back="orderaftersale_image_event"></component-upload>
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

        <block v-if="aftersale_data != null && is_create_aftersale == 0">
            <!-- 结尾 -->
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
        </block>

        <!-- 退货弹层 -->
        <component-popup :propShow="popup_delivery_status" propPosition="bottom" @onclose="popup_delivery_close_event">
            <view class="bg-white padding-horizontal-main padding-top-main">
                <view class="fr oh">
                    <view class="fr" @tap.stop="popup_delivery_close_event">
                        <iconfont name="icon-close-line" size="28rpx" color="#999"></iconfont>
                    </view>
                </view>
                <view class="margin-top-xxxl">
                    <view class="form-container">
                        <view class="form-gorup">
                            <view class="form-gorup-title">{{$t('invoice-detail.invoice-detail.2000a0')}}<text class="form-group-tips-must">*</text></view>
                            <input type="text" @input="form_express_name_event" placeholder-class="cr-grey" class="cr-base br-b" :placeholder="$t('user-orderaftersale-detail.user-orderaftersale-detail.6d14hq')" :value="form_express_name" />
                        </view>
                        <view class="form-gorup">
                            <view class="form-gorup-title">{{$t('user-order-detail.user-order-detail.2byl8l')}}<text class="form-group-tips-must">*</text></view>
                            <input type="text" @input="form_express_number_event" placeholder-class="cr-grey" class="cr-base br-b" :placeholder="$t('user-orderaftersale-detail.user-orderaftersale-detail.8tt862')" :value="form_express_number" />
                        </view>
                        <view class="form-gorup form-gorup-submit">
                            <button class="bg-main br-main cr-white round text-size" type="default" @tap="form_delivery_submit_event" hover-class="none" :disabled="form_button_disabled">{{$t('common.submit')}}</button>
                        </view>
                    </view>
                </view>
            </view>
        </component-popup>

        <!-- 智能工具箱 - 客服弹窗 -->
        <component-popup :propShow="plugins_intellectstools_service_status" propPosition="bottom" @onclose="plugins_intellectstools_service_close_event">
            <view class="padding-top-main bg-white">
                <view class="padding-horizontal-main">
                    <view class="close oh tc">
                        <text v-if="(plugins_intellectstools_data_chat || null) != null" class="text-size">{{plugins_intellectstools_data_chat.title}}</text>
                        <view class="fr" @tap.stop="plugins_intellectstools_service_close_event">
                            <iconfont name="icon-close-line" size="28rpx" color="#999"></iconfont>
                        </view>
                    </view>
                </view>
                <view class="popup-service-container">
                    <view v-if="(plugins_intellectstools_data_chat || null) != null" class="header-service">
                        <view v-if="(plugins_intellectstools_data_chat.data.chat || null) != null" class="item padding-main br-t-f9 single-text">
                            <text class="va-m">{{$t('detail.detail.r4124d')}}</text>
                            <view class="dis-inline-block chat-info cp" @tap="chat_event">
                                <image class="dis-inline-block va-m" :src="plugins_intellectstools_data_chat.data.chat.icon" mode="scaleToFill"></image>
                                <text class="margin-left-sm va-m cr-blue" :data-value="plugins_intellectstools_data_chat.data.chat.chat_url">{{ plugins_intellectstools_data_chat.data.chat.name }}</text>
                            </view>
                        </view>
                        <view v-if="(plugins_intellectstools_data_chat.data.service_qq || null) != null" class="item padding-main br-t-f9 single-text">
                            <text>Q Q：</text>
                            <text class="cp" @tap="text_event" data-event="copy" :data-value="plugins_intellectstools_data_chat.data.service_qq">{{ plugins_intellectstools_data_chat.data.service_qq }}</text>
                        </view>
                        <view v-if="(plugins_intellectstools_data_chat.data.service_tel || null) != null" class="item padding-main br-t-f9 single-text">
                            <text>{{$t('order.order.7dxbm5')}}：</text>
                            <text class="cp" @tap="text_event" data-event="tel" :data-value="plugins_intellectstools_data_chat.data.service_tel">{{ plugins_intellectstools_data_chat.data.service_tel }}</text>
                        </view>
                        <view v-if="(plugins_intellectstools_data_chat.data.service_weixin || null) != null || (plugins_intellectstools_data_chat.data.service_line || null) != null" class="oh qrcode tc br-t-f9 padding-top-main">
                            <view v-if="(plugins_intellectstools_data_chat.data.service_weixin || null) != null" class="item padding-bottom-lg dis-inline-block">
                                <image class="radius cp" :src="plugins_intellectstools_data_chat.data.service_weixin" mode="scaleToFill" @tap="image_show_event" :data-value="plugins_intellectstools_data_chat.data.service_weixin"></image>
                                <view>{{$t('detail.detail.54k10s')}}</view>
                            </view>
                            <view v-if="(plugins_intellectstools_data_chat.data.service_line || null) != null" class="item padding-bottom-lg dis-inline-block">
                                <image class="radius cp" :src="plugins_intellectstools_data_chat.data.service_line" mode="scaleToFill" @tap="image_show_event" :data-value="plugins_intellectstools_data_chat.data.service_line"></image>
                                <view>{{$t('detail.detail.vj4nom')}}</view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </component-popup>

        <!-- 多商户订单售后 - 平台介入弹窗 -->
        <component-popup :propShow="plugins_shop_dispute_interfere_status" propPosition="bottom" @onclose="plugins_shop_dispute_interfere_close_event">
            <view class="bg-white padding-horizontal-main padding-top-main">
                <view class="fr oh">
                    <view class="fr" @tap.stop="plugins_shop_dispute_interfere_close_event">
                        <iconfont name="icon-close-line" size="28rpx" color="#999"></iconfont>
                    </view>
                </view>
                <view class="margin-top-xxxl">
                    <view v-if="(plugins_shop_data || null) != null" class="form-container">
                        <view class="cr-red padding-vertical padding-horizontal-lg">{{plugins_shop_data.apply_dispute_tips}}</view>
                        <view class="form-gorup">
                            <view class="form-gorup-title">{{$t('user-orderaftersale-detail.user-orderaftersale-detail.87tuff')}}<text class="form-group-tips-must">*</text></view>
                            <input type="text" @input="form_dispute_describe_value_event" placeholder-class="cr-grey" class="cr-base br-b" :placeholder="$t('user-orderaftersale-detail.user-orderaftersale-detail.6uygft')" :value="form_dispute_describe_value" />
                        </view>
                        <view class="form-gorup form-gorup-submit">
                            <button class="bg-main br-main cr-white round text-size" type="default" @tap="form_dispute_describe_submit_event" hover-class="none" :disabled="form_dispute_describe_button_disabled">{{$t('common.submit')}}</button>
                        </view>
                    </view>
                    <block v-else>
                        <component-no-data propStatus="0"></component-no-data>
                    </block>
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
    import componentUpload from '@/components/upload/upload';

    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                params: null,
                data_list_loding_status: 1,
                data_list_loding_msg: "",
                data_bottom_line_status: false,
                popup_delivery_status: false,
                // 接口数据
                editor_path_type: "",
                is_create_aftersale: 0,
                order_data: null,
                aftersale_data: null,
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
                plugins_intellectstools_data_chat: null,
                plugins_intellectstools_service_status: false,
                // 多商户订单售后争议
                plugins_shop_data: null,
                plugins_shop_dispute_interfere_status: false,
                form_dispute_describe_value: '',
                form_dispute_describe_button_disabled: false,
                chat_input_value: '',
                chat_user_type: 0,
                chat_send_submit_disabled_status: false,
                chat_send_submit_status: false,
                chat_more_submit_status: false,
                chat_loading_status: false,
                chat_no_data_status: false,
                chat_error_msg: '',
                chat_user_list: [],
                chat_data_list: [],
                chat_data_timer: null,
                chat_content_scroll_top_value: 0,
            };
        },

        components: {
            componentCommon,
            componentPopup,
            componentNoData,
            componentBottomLine,
            componentUpload
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            this.setData({
                params: params,
                popup_delivery_status: (params.is_delivery_popup || 0) == 1,
            });

            // 数据加载
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

        // 页面销毁时执行
        onUnload: function () {
            clearInterval(this.chat_data_timer);
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
                    url: app.globalData.get_request_url("detail", "orderaftersale"),
                    method: "POST",
                    data: this.params,
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
                                is_create_aftersale: parseInt(data.is_create_aftersale || 0),
                                order_data: data.order_data || null,
                                aftersale_data: (data.aftersale_data || null) == null || data.aftersale_data.length <= 0 ? null : data.aftersale_data,
                                step_data: data.step_data || null,
                                returned_data: data.returned_data || null,
                                return_only_money_reason: data.return_only_money_reason || [],
                                return_money_goods_reason: data.return_money_goods_reason || [],
                                aftersale_type_list: data.aftersale_type_list || [],
                                return_goods_address: data.return_goods_address || null,
                                form_price: data.returned_data || null != null ? data.returned_data.refund_price : '',
                                plugins_intellectstools_data: data.plugins_intellectstools_data || null,
                                plugins_shop_data: data.plugins_shop_data || null,
                            });

                            // 获取消息数据
                            this.chat_data('init');
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

            // 上传回调
            orderaftersale_image_event(res) {
                this.setData({
                    form_images_list: res,
                });
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
                    id: this.aftersale_data.id,
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

            // 取消
            cancel_event(e) {
                uni.showModal({
                    title: this.$t('common.warm_tips'),
                    content: this.$t('common.cancel_confirm_tips'),
                    confirmText: this.$t('common.confirm'),
                    cancelText: this.$t('common.no'),
                    success: (result) => {
                        if (result.confirm) {
                            uni.showLoading({
                                title: this.$t('common.processing_in_text'),
                            });
                            uni.request({
                                url: app.globalData.get_request_url("cancel", "orderaftersale"),
                                method: "POST",
                                data: {
                                    id: this.aftersale_data.id,
                                },
                                dataType: "json",
                                success: (res) => {
                                    uni.hideLoading();
                                    if (res.data.code == 0) {
                                        app.globalData.showToast(res.data.msg, "success");
                                        var self = this;
                                        setTimeout(function () {
                                            self.init();
                                        }, 1000);
                                    } else {
                                        if (app.globalData.is_login_check(res.data)) {
                                            app.globalData.showToast(res.data.msg);
                                        } else {
                                            app.globalData.showToast(this.$t('common.sub_error_retry_tips'));
                                        }
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

            // 凭证图片预览
            images_view_event(e) {
                uni.previewImage({
                    current: this.aftersale_data.images[e.currentTarget.dataset.index],
                    urls: this.aftersale_data.images,
                });
            },

            // 开启客服弹层
            plugins_intellectstools_service_open_event(e) {
                this.setData({
                    plugins_intellectstools_data_chat: this.plugins_intellectstools_data[e.currentTarget.dataset.value] || null,
                    plugins_intellectstools_service_status: true,
                });
            },
            
            // 关闭客服弹层
            plugins_intellectstools_service_close_event(e) {
                this.setData({
                    plugins_intellectstools_service_status: false,
                });
            },
            
            
            // 开启订单售后平台介入弹层
            plugins_shop_dispute_interfere_open_event(e) {
                this.setData({
                    plugins_shop_dispute_interfere_status: true,
                });
            },
            
            // 关闭订单售后平台介入弹层
            plugins_shop_dispute_interfere_close_event(e) {
                this.setData({
                    plugins_shop_dispute_interfere_status: false,
                });
            },

            // 申请平台介入描述原因事件
            form_dispute_describe_value_event(e) {
                this.setData({
                    form_dispute_describe_value: e.detail.value,
                });
            },

            // 申请平台介入提交
            form_dispute_describe_submit_event(e) {
                var value = this.form_dispute_describe_value;
                if(value === '') {
                    app.globalData.showToast(this.$t('user-orderaftersale-detail.user-orderaftersale-detail.6uygft'));
                    return;
                }
                uni.showLoading({
                    title: this.$t('common.processing_in_text'),
                });
                this.setData({
                    form_dispute_describe_button_disabled: true,
                });
                uni.request({
                    url: app.globalData.get_request_url("usercreate", "orderaftersaledispute", "shop"),
                    method: "POST",
                    data: {
                        order_aftersale_id: this.aftersale_data.id,
                        describe: value
                    },
                    dataType: "json",
                    success: (res) => {
                        uni.hideLoading();
                        this.setData({
                            form_dispute_describe_button_disabled: false,
                        });
                        if (res.data.code == 0) {
                            app.globalData.showToast(res.data.msg, "success");
                            this.setData({
                                plugins_shop_dispute_interfere_status: false,
                            });
                            var self = this;
                            setTimeout(function () {
                                self.init();
                            }, 1000);
                        } else {
                            if (app.globalData.is_login_check(res.data)) {
                                app.globalData.showToast(res.data.msg);
                            } else {
                                app.globalData.showToast(this.$t('common.sub_error_retry_tips'));
                            }
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        this.setData({
                            form_dispute_describe_button_disabled: false,
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 争议取消
            dispute_cancel_event(e) {
                uni.showModal({
                    title: this.$t('common.warm_tips'),
                    content: this.$t('common.cancel_confirm_tips'),
                    confirmText: this.$t('common.confirm'),
                    cancelText: this.$t('common.no'),
                    success: (result) => {
                        if (result.confirm) {
                            uni.showLoading({
                                title: this.$t('common.processing_in_text'),
                            });
                            uni.request({
                                url: app.globalData.get_request_url("cancel", "orderaftersaledispute", "shop"),
                                method: "POST",
                                data: {
                                    id: this.plugins_shop_data.dispute_data.id,
                                },
                                dataType: "json",
                                success: (res) => {
                                    uni.hideLoading();
                                    if (res.data.code == 0) {
                                        app.globalData.showToast(res.data.msg, "success");
                                        var self = this;
                                        setTimeout(function () {
                                            self.init();
                                        }, 1000);
                                    } else {
                                        if (app.globalData.is_login_check(res.data)) {
                                            app.globalData.showToast(res.data.msg);
                                        } else {
                                            app.globalData.showToast(this.$t('common.sub_error_retry_tips'));
                                        }
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

            // 获取消息数据
            // type 类型 add | init | history
            chat_data(type = 'init') {
                // 获取消息数据
                if((this.plugins_shop_data || null) != null && parseInt(this.plugins_shop_data.status || 0) == 1 && (this.plugins_shop_data.dispute_data || null) != null) {
                    // 是否需要显示发送按钮
                    this.setData({
                        chat_send_submit_status: this.plugins_shop_data.dispute_data.status <= 1,
                    });

                    // 获取数据
                    var order_aftersale_dispute_id = 0;
                    var temp_chat_data_list = this.chat_data_list;
                    if(temp_chat_data_list.length > 0) {
                        var index = (type == 'history') ? 0 : temp_chat_data_list.length-1;
                        order_aftersale_dispute_id = temp_chat_data_list[index]['id']
                    }
                    if(type == 'init' || type == 'history')
                    {
                        this.setData({
                            chat_more_submit_status: false,
                            chat_loading_status: true,
                        });
                    }
                    uni.request({
                        url: app.globalData.get_request_url("userchatdata", "orderaftersaledispute", "shop"),
                        method: "POST",
                        data: {
                            type: type,
                            order_aftersale_id: this.aftersale_data.id,
                            order_aftersale_dispute_id: order_aftersale_dispute_id,
                        },
                        dataType: "json",
                        success: (res) => {
                            if (res.data.code == 0) {
                                // 数据渲染、初始化则反转数据、记录最后的节点id
                                var data = res.data.data.data;
                                if(data.length > 0)
                                {
                                    if(type == 'init')
                                    {
                                        data = data.reverse();
                                    }
                                    for(var i in data)
                                    {
                                        this.chat_data_merge(data[i], type);
                                    }
                                }

                                // 加载和查看更多处理
                                if(type == 'init' || type == 'history')
                                {
                                    this.setData({
                                        chat_more_submit_status: (res.data.data.count > 0),
                                        chat_loading_status: false,
                                    });
                                }

                                // 是否存在消息用户列表
                                if(res.data.data.user_list.length > 0)
                                {
                                    this.setData({
                                        chat_user_list: res.data.data.user_list,
                                    });
                                }

                                // 初始化完成
                                if(type == 'init')
                                {
                                    // 是否存在数据，仅初始化时候处理
                                    this.setData({
                                        chat_no_data_status: res.data.data.data.length == 0
                                    });

                                    // 启动定时任务、定时获取消息、必须存在发送按钮
                                    var self = this;
                                    if(self.chat_send_submit_status)
                                    {
                                        var timer = setInterval(function()
                                        {
                                            self.chat_data('add');
                                        }, 6000);
                                        self.setData({
                                            chat_data_timer: timer
                                        });
                                    }
                                }
                            } else {                            
                                if(type == 'init')
                                {
                                    this.setData({
                                        chat_error_msg: res.data.msg,
                                        chat_loading_status: false,
                                    });
                                } else {
                                    app.globalData.showToast(res.data.msg);
                                }
                            }
                        },
                        fail: () => {
                            var msg = this.$t('common.internet_error_tips');
                            if(type == 'init')
                            {
                                this.setData({
                                    chat_error_msg: msg,
                                    chat_loading_status: false,
                                });
                            } else {
                                app.globalData.showToast(msg);
                            }
                        },
                    });
                }
            },

            // 消息内容合并
            // item 数据
            // type 类型 add | init | history
            chat_data_merge(item, type) {
                var temp_chat_data_list = this.chat_data_list;
                if(type == 'history') {
                    temp_chat_data_list.unshift(item);
                } else {
                    temp_chat_data_list.push(item);
                }
                this.setData({
                    chat_data_list: temp_chat_data_list,
                    chat_no_data_status: temp_chat_data_list.length == 0,
                });

                // 添加类型滚动到最底部
                if(type == 'init' || type == 'add') {
                    var self = this;
                    setTimeout(function() {
                        const query = uni.createSelectorQuery().in(self);
                        query.selectAll('.chat-content .chat-item').boundingClientRect();
                        query.exec(res => {
                            const scrollContentHeight = res[0].reduce((total, item) => total + item.height, 0);
                            self.setData({
                                chat_content_scroll_top_value: scrollContentHeight,
                            });
                        });
                    });
                }
            },

            // 客服输入内容事件
            chat_input_event(e) {
                this.setData({
                    chat_input_value: e.detail.value,
                });
            },

            // 客服发送按钮事件
            chat_send_submit_event(e) {
                if(this.chat_input_value !== '') {
                    this.chat_send_handle(this.chat_input_value, 0);
                }
            },

            // 消息上传图片
            chat_upload_images_event(res) {
                if((res || null) != null && typeof res == 'string') {
                    this.chat_send_handle(res, 1);
                }
            },

            // 消息发送处理
            // content  消息内容
            // type     0文本，1图片，2视频
            chat_send_handle(content, type = 0) {
                this.setData({
                    chat_send_submit_disabled_status: true,
                });
                uni.request({
                    url: app.globalData.get_request_url("userchatsend", "orderaftersaledispute", "shop"),
                    method: "POST",
                    data: {
                        order_aftersale_id: this.aftersale_data.id,
                        content: content,
                        type: type
                    },
                    dataType: "json",
                    success: (res) => {
                        this.setData({
                            chat_send_submit_disabled_status: false,
                        });
                        if(res.data.code == 0)
                        {
                            if(type == 0) {
                                this.setData({
                                    chat_input_value: '',
                                });
                            }
                            this.chat_data_merge(res.data.data, 'add');
                        } else {
                            if (app.globalData.is_login_check(res.data, this, "chat_send_submit_event")) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        this.setData({
                            chat_send_submit_disabled_status: false,
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 订单售后争议沟通 - 查看更多消息
            chat_more_submit_event(e) {
                this.chat_data('history');
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
            },
        },
    };
</script>
<style>
    @import "./user-orderaftersale-detail.css";
</style>
