<template>
    <view :class="theme_view">
        <block v-if="detail != null">
            <view class="padding-horizontal-main padding-top-main">
                <!-- 基础状态和操作 -->
                <view class="bg-white padding-main border-radius-main tc spacing-mb">
                    <view class="padding-vertical-xl">
                        <!-- 订单状态（0待确认, 1已确认/待支付, 2已支付/待发货, 3已发货/待收货, 4已完成, 5已取消, 6已关闭） -->
                        <block v-if="detail.status == 5 || detail.status == 6">
                            <view class="dis-inline-block va-m">
                                <iconfont name="icon-sigh-o" size="68rpx" propClass="cr-red"></iconfont>
                            </view>
                            <text class="text-size-xl margin-top-sm va-m margin-left-sm cr-red">{{detail.status_name}}</text>
                        </block>
                        <block v-else-if="detail.status == 4">
                            <view class="dis-inline-block va-m">
                                <iconfont name="icon-enable" size="68rpx" propClass="cr-green"></iconfont>
                            </view>
                            <text class="text-size-xl margin-top-sm va-m margin-left-sm cr-green">{{detail.status_name}}</text>
                        </block>
                        <block v-else-if="detail.status == 3">
                            <view class="dis-inline-block va-m">
                                <iconfont name="icon-inventroy-manage" size="68rpx" propClass="cr-blue"></iconfont>
                            </view>
                            <text class="text-size-xl margin-top-sm va-m margin-left-sm cr-blue">{{detail.status_name}}</text>
                        </block>
                        <block v-else-if="detail.status == 2">
                            <view class="dis-inline-block va-m">
                                <iconfont name="icon-wait-receive-delivery" size="68rpx" propClass="cr-yellow"></iconfont>
                            </view>
                            <text class="text-size-xl margin-top-sm va-m margin-left-sm cr-yellow">{{detail.status_name}}</text>
                        </block>
                        <block v-else>
                            <view class="dis-inline-block va-m">
                                <iconfont name="icon-wait-payment" size="68rpx"></iconfont>
                            </view>
                            <text class="text-size-xl margin-top-sm va-m margin-left-sm">{{detail.status_name}}</text>
                        </block>
                        <view v-if="detail.status == 1" class="cr-price fw-b margin-top-sm">
                            <text class="text-size">{{payment_currency_symbol}}</text>
                            <text class="text-size-xl margin-left-xs">{{pay_price}}</text>
                        </view>
                        <view v-if="(status_tips || null) != null" class="cr-grey text-size-xs margin-top-sm">{{status_tips}}</view>
                    </view>
                    <view class="item-operation margin-top-sm">
                        <button v-if="detail.operate_data.is_cancel == 1" class="round bg-white cr-yellow br-yellow margin-bottom-main" type="default" size="mini" @tap="cancel_event" hover-class="none">{{$t('common.cancel')}}</button>
                        <button v-if="detail.operate_data.is_pay == 1" class="round bg-white cr-green br-green margin-bottom-main" type="default" size="mini" @tap="pay_event" hover-class="none">{{$t('order.order.1i873j')}}</button>
                        <button v-if="detail.operate_data.is_collect == 1" class="round bg-white cr-green br-green margin-bottom-main" type="default" size="mini" @tap="collect_event" hover-class="none">{{$t('orderallot-list.orderallot-list.w2w2w4')}}</button>
                        <button v-if="(detail.plugins_express_data || 0) == 1 && (detail.express_data || null) != null" class="round bg-white cr-main br-main margin-bottom-main" type="default" size="mini" @tap="url_event" :data-value="'/pages/plugins/express/detail/detail?oid=' + detail.id" hover-class="none">{{$t('orderallot-list.orderallot-list.w2t242')}}</button>
                        <button v-if="(detail.plugins_delivery_data || 0) > 0" class="round bg-white cr-main br-main margin-bottom-main" type="default" size="mini" @tap="url_event" :data-value="'/pages/plugins/delivery/logistics/logistics?id=' + detail.plugins_delivery_data" hover-class="none">{{$t('orderallot-list.orderallot-list.w2t242')}}</button>
                        <button v-if="detail.operate_data.is_comments == 1" class="round bg-white cr-green br-green margin-bottom-main" type="default" size="mini"  @tap="url_event" :data-value="'/pages/user-order-comments/user-order-comments?id='+detail.id" hover-class="none">{{$t('common.comment')}}</button>
                        <button v-if="detail.status == 2 && detail.order_model != 2" class="round cr-base br margin-bottom-main" type="default" size="mini" @tap="rush_event" hover-class="none">{{$t('user-order.user-order.lp1v28')}}</button>
                        <button v-if="detail.operate_data.is_delete == 1" class="round bg-white cr-red br-red margin-bottom-main" type="default" size="mini" @tap="delete_event" hover-class="none">{{$t('common.del')}}</button>
                        <button v-if="(detail.plugins_is_order_allot_button || 0) == 1" class="round bg-white cr-main br-main margin-bottom-main" type="default" size="mini" @tap="url_event" :data-value="'/pages/plugins/realstore/orderallot-list/orderallot-list?oid=' + detail.id" hover-class="none">{{$t('user-order.user-order.ht65c9')}}</button>
                        <button v-if="(detail.plugins_is_order_batch_button || 0) == 1" class="round bg-white cr-blue br-blue margin-bottom-main" type="default" size="mini" @tap="url_event" :data-value="'/pages/plugins/realstore/batchorder-list/batchorder-list?oid=' + detail.id" hover-class="none">{{$t('orderallot-list.orderallot-list.6m73j2')}}</button>
                        <button v-if="(detail.plugins_is_order_frequencycard_button || 0) == 1" class="round bg-white cr-green br-green margin-bottom-main" type="default" size="mini" @tap="url_event" :data-value="'/pages/plugins/realstore/frequencycard-list/frequencycard-list?oid=' + detail.id" hover-class="none">{{$t('orderallot-list.orderallot-list.b13k5r')}}</button>
                        <button v-if="(detail.plugins_ordergoodsform_data || 0) == 1" class="round bg-white cr-blue br-blue margin-bottom-main" type="default" size="mini" @tap="url_event" :data-value="'/pages/plugins/ordergoodsform/order/order?id=' + detail.id" hover-class="none">{{$t('user-order.user-order.9l47b6')}}</button>
                        <button v-if="(detail.plugins_orderresources_data || 0) == 1" class="round bg-white cr-blue br-blue margin-bottom-main" type="default" size="mini" @tap="url_event" :data-value="'/pages/plugins/orderresources/orderannex/orderannex?oid=' + detail.id" hover-class="none">{{$t('user-order.user-order.fyuikn')}}</button>
                        <button v-if="(detail.plugins_is_orderfeed_button || 0) == 1" class="round bg-white cr-blue br-blue margin-bottom-main" type="default" size="mini" @tap="url_event" :data-value="'/pages/plugins/orderfeed/form/form?oid=' + detail.id" hover-class="none">{{$t('common.feed_text')}}</button>
                        <button v-if="(detail.plugins_intellectstools_data || null) != null && (detail.plugins_intellectstools_data.continue_buy_data || null) != null && detail.plugins_intellectstools_data.continue_buy_data.length > 0" class="round bg-white cr-base br-base margin-bottom-main" type="default" size="mini" @tap="continue_buy_event" hover-class="none">{{$t('user-order.user-order.3l2jr5')}}</button>
                    </view>
                </view>

                <!-- 自提信息 -->
                <view v-if="(detail.extraction_data || null) != null" class="site-extraction padding-main border-radius-main bg-white spacing-mb">
                    <view class="br-b padding-bottom-main fw-b text-size">{{$t('user-order-detail.user-order-detail.o38952')}}</view>
                    <view class="panel-content oh tc padding-top-main">
                        <view :data-value="detail.extraction_data.code" @tap="text_copy_event">
                            <text class="fw-b cr-black text-size-xl va-m">{{ detail.extraction_data.code || $t("user-order-detail.user-order-detail.hpq62x") }}</text>
                            <text class="bg-white br-green cr-green round padding-horizontal-sm text-size-xs va-m margin-left">{{$t('common.copy')}}</text>
                        </view>
                        <image v-if="(detail.extraction_data.images || null) != null" class="qrcode br radius margin-top-xs" :src="detail.extraction_data.images" mode="aspectFill"></image>
                    </view>
                </view>

                <!-- 地址 -->
                <view v-if="(detail.address_data || null) != null" class="address bg-white padding-horizontal-main padding-top-main border-radius-main spacing-mb">
                    <view class="address-base padding-top-xs padding-bottom oh">
                        <text v-if="(detail.address_data.alias || null) != null" class="address-alias round br-main cr-main bg-white margin-right-sm">{{ detail.address_data.alias }}</text>
                        <text>{{ detail.address_data.name }}</text>
                        <text class="fr">{{ detail.address_data.tel }}</text>
                    </view>
                    <view class="address-detail oh margin-bottom-main">
                        <image class="icon fl" :src="common_static_url + 'map-icon.png'" mode="widthFix"></image>
                        <view class="text fr">
                            <text>{{ detail.address_data.province_name }}{{ detail.address_data.city_name }}{{ detail.address_data.county_name }}{{ detail.address_data.address }}</text>
                            <text v-if="(detail.address_data.lng || 0) != 0 && (detail.address_data.lat || 0) != 0" class="address-map-submit cr-base br round bg-white margin-left-sm text-size-xs" @tap="address_map_event">{{$t('user-order-detail.user-order-detail.7lp6gw')}}</text>
                        </view>
                    </view>
                    <view v-if="(detail.address_data.extraction_contact_name || null) != null || (detail.address_data.extraction_contact_tel || null) != null || (detail.address_data.appoint_time || null) != null" class="padding-vertical-main br-t-dashed">
                        <view>
                            <text v-if="(detail.address_data.extraction_contact_name || null) != null" class="margin-right-xxl">{{detail.address_data.extraction_contact_name}}</text>
                            <text v-if="(detail.address_data.extraction_contact_tel || null) != null">{{detail.address_data.extraction_contact_tel}}</text>
                        </view>
                        <view v-if="(detail.address_data.tel || null) != null" class="cr-red">{{detail.address_data.appoint_time}}</view>
                    </view>
                    <view class="address-divider spacing-mb"></view>
                </view>

                <!-- 商品列表 -->
                <view v-if="(detail.items || null) != null && detail.items.length > 0" class="goods bg-white padding-main border-radius-main spacing-mb">
                    <view class="br-b padding-bottom-main fw-b text-size">{{$t('user-order-detail.user-order-detail.7f8p26')}}</view>
                    <view v-for="(item, index) in detail.items" :key="index" class="goods-item br-b-dashed oh padding-vertical-main">
                        <view :data-value="item.goods_url" @tap="url_event" class="cp">
                            <image class="goods-image fl radius" :src="item.images" mode="aspectFill"></image>
                            <view class="goods-base pr">
                                <view class="multi-text">{{ item.title }}</view>
                                <view v-if="item.spec != null" class="margin-top-xs">
                                    <block v-for="(sv, si) in item.spec" :key="si">
                                        <text v-if="si > 0" class="cr-grey padding-left-xs padding-right-xs">;</text>
                                        <text class="cr-grey">{{ sv.value }}</text>
                                    </block>
                                </view>
                                <view class="margin-top-xs">
                                    <text class="fw-b">{{ detail.currency_data.currency_symbol }}{{ item.price }}</text>
                                    <text class="margin-left-sm">x{{ item.buy_number }}</text>
                                </view>
                                <view class="pa right-0 bottom-0 z-i">
                                    <text v-if="detail.is_can_launch_aftersale == 1 && (item.orderaftersale_btn_text || null) != null" class="cr-blue bg-white" @tap.stop="orderaftersale_event" :data-oid="detail.id" :data-did="item.id">{{ item.orderaftersale_btn_text }}</text>
                                    <view class="dis-inline-block margin-left" @tap.stop="popup_order_item_goods_info_event" :data-index="index">
                                        <text class="margin-right-xs">{{$t('user-order-detail.user-order-detail.7f8p26')}}</text>
                                        <iconfont name="icon-arrow-down" color="#999" propClass="va-m"></iconfont>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                    <view class="padding-top-main tr cr-base text-size">
                        <text>{{$t('user-order-detail.user-order-detail.423rmr')}}<text class="fw-b">{{ detail.buy_number_count }}</text>{{$t('user-order-detail.user-order-detail.41ty94')}}<text class="sales-price margin-right-xs">{{ detail.currency_data.currency_symbol }}{{ detail.total_price }}</text></text>
                    </view>
                </view>

                <!-- 使用指南 -->
                <view v-if="(detail.use_guide_data || null) != null && (detail.use_guide_data.data || null) != null && detail.use_guide_data.data.length > 0" class="panel-item padding-main border-radius-main bg-white spacing-mb">
                    <view class="br-b padding-bottom-main fw-b text-size">{{detail.use_guide_data.title}}</view>
                    <view class="scroll-view-horizontal margin-top">
                        <scroll-view :scroll-x="true" :show-scrollbar="false" :scroll-with-animation="true" :scroll-into-view="'use-guide-switch-item-' + goods_use_guide_data_active_index" class="use-guide-switch-scroll">
                            <block v-for="(item, index) in detail.use_guide_data.data" :key="index">
                                <view :class="'item tc cp dis-inline-block'+(index > 0 ? ' margin-left' : '')" :id="'use-guide-switch-item-' + index" :data-index="index" @tap="goods_use_guide_data_switch_event">
                                    <view :class="'icon-content circle br auto ' + (goods_use_guide_data_active_index == index ? 'border-color-main' : '')">
                                        <image :src="item.images" mode="aspectFit" class="icon dis-block circle"></image>
                                    </view>
                                    <view class="single-text margin-top-xs" :class="goods_use_guide_data_active_index == index ? 'cr-main' : 'cr-base'">{{ item.title }} </view>
                                </view>
                            </block>
                        </scroll-view>
                    </view>
                    <view v-if="(detail.use_guide_data.desc || null) != null" class="margin-top-xs text-size-xs cr-grey">{{detail.use_guide_data.desc}}</view>
                    <view class="br radius padding-main margin-top-sm">
                        <view v-if="(detail.use_guide_data.data[goods_use_guide_data_active_index]['goods_use_guide'] || null) != null" class="web-html-content">
                            <mp-html :content="detail.use_guide_data.data[goods_use_guide_data_active_index]['goods_use_guide']" />
                        </view>
                        <block v-else>
                            <component-no-data propStatus="0"></component-no-data>
                        </block>
                    </view>
                </view>

                <!-- 服务信息 -->
                <view v-if="(detail.service_data || null) != null" class="express-data panel-item padding-main border-radius-main bg-white spacing-mb">
                    <view class="br-b padding-bottom-main fw-b text-size">{{$t('user-order-detail.user-order-detail.567ygf')}}</view>
                    <view class="panel-content oh">
                        <uni-table :emptyText="$t('common.no_data')">
                            <uni-tr>
                                <uni-th width="100">{{$t('user-order-detail.user-order-detail.gsfw4d')}}</uni-th>
                                <uni-th width="180">{{$t('user-order-detail.user-order-detail.6ygfew')}}</uni-th>
                                <uni-th width="120">{{$t('user-order-detail.user-order-detail.67ujfr')}}</uni-th>
                                <uni-th width="350">{{$t('common.service_time')}}</uni-th>
                            </uni-tr>
                            <block v-for="(item, index) in detail.service_data" :key="index">
                                <uni-tr>
                                    <uni-td>{{ item.service_name }}</uni-td>
                                    <uni-td>
                                        <view :data-value="item.service_mobile" @tap="text_copy_event">
                                            <text>{{ item.service_mobile }}</text>
                                            <text class="bg-white br-green cr-green round padding-horizontal-sm text-size-xs margin-left-sm">{{$t('common.copy')}}</text>
                                        </view>
                                    </uni-td>
                                    <uni-td>{{ item.service_duration_minute_text }}</uni-td>
                                    <uni-td>
                                        <text v-if="(item.service_start_time || null) != null">{{ item.service_start_time }}</text>
                                        <block v-if="(item.service_end_time || null) != null">
                                            <text class="cr-grey padding-horizontal-sm">~</text>
                                            <text>{{ item.service_end_time }}</text>
                                        </block>
                                    </uni-td>
                                </uni-tr>
                            </block>
                        </uni-table>
                    </view>
                </view>

                <!-- 虚拟销售数据 -->
                <view v-if="(site_fictitious || null) != null" class="site-fictitious panel-item padding-horizontal-main padding-top-main border-radius-main bg-white spacing-mb">
                    <view class="br-b padding-bottom-main fw-b text-size">{{ site_fictitious.title || $t('user-order-detail.user-order-detail.y9woor') }}</view>
                    <view class="panel-content oh padding-top-main">
                        <view v-if="(site_fictitious.tips || null) != null" class="tips-value radius padding-main margin-bottom-main">
                            <mp-html :content="site_fictitious.tips" />
                        </view>
                        <view v-for="(item, index) in detail.items" :key="index" class="item br-b-dashed oh padding-bottom-main margin-bottom-main">
                            <image class="left-image br fl radius" :src="item.images" mode="aspectFill"></image>
                            <view class="right-value fr">
                                <view v-if="(item.spec_text || null) != null" class="text-base fw-b margin-bottom-sm text-size-xs">{{item.spec_text}}</view>
                                <mp-html v-if="(item.fictitious_goods_value || null) != null" :content="item.fictitious_goods_value" />
                                <text v-else class="cr-grey text-size-xs">{{$t('user-order-detail.user-order-detail.7xtnjt')}}</text>
                            </view>
                        </view>
                    </view>
                </view>

                <!-- 订单基础数据 -->
                <view v-if="detail_list.length > 0" class="panel-item padding-main border-radius-main bg-white spacing-mb">
                    <view class="br-b padding-bottom-main fw-b text-size">{{$t('user-order-detail.user-order-detail.0f26j2')}}</view>
                    <view class="panel-content oh">
                        <uni-table :emptyText="$t('common.no_data')">
                            <block v-for="(item, index) in detail_list" :key="index">
                                <uni-tr>
                                    <uni-th width="90">{{item.name}}</uni-th>
                                    <uni-td>
                                        <view v-if="(item.is_copy || 0) == 1" :data-value="item.value" @tap="text_copy_event">
                                            <text>{{ item.value }}</text>
                                            <text class="bg-white br-green cr-green round padding-horizontal-sm text-size-xs margin-left-sm">{{$t('common.copy')}}</text>
                                        </view>
                                        <block v-else>{{ item.value }}</block>
                                    </uni-td>
                                </uni-tr>
                            </block>
                        </uni-table>
                    </view>
                </view>

                <!-- 快递信息 -->
                <view v-if="(detail.express_data || null) != null && detail.express_data.length > 0" class="express-data panel-item padding-main border-radius-main bg-white spacing-mb">
                    <view class="br-b padding-bottom-main fw-b text-size">{{$t('user-order-detail.user-order-detail.0876xf')}}</view>
                    <view class="panel-content oh">
                        <uni-table :emptyText="$t('common.no_data')">
                            <uni-tr>
                                <uni-th width="110">{{$t('user-order-detail.user-order-detail.12d445')}}</uni-th>
                                <uni-th width="260">{{$t('user-order-detail.user-order-detail.2byl8l')}}</uni-th>
                                <uni-th width="300">{{$t('common.note')}}</uni-th>
                            </uni-tr>
                            <block v-for="(item, index) in detail.express_data" :key="index">
                                <uni-tr>
                                    <uni-td>
                                        <view :data-value="item.express_name" @tap="text_copy_event">{{item.express_name}}</view>
                                    </uni-td>
                                    <uni-td>
                                        <view :data-value="item.express_number" @tap="text_copy_event">
                                            <text>{{item.express_number}}</text>
                                            <text class="bg-white br-green cr-green round padding-horizontal-sm text-size-xs margin-left-sm">{{$t('common.copy')}}</text>
                                        </view>
                                    </uni-td>
                                    <uni-td>
                                        <view :data-value="item.note" @tap="text_copy_event">{{item.note}}</view>
                                    </uni-td>
                                </uni-tr>
                            </block>
                        </uni-table>
                    </view>
                </view>
                
                <!-- 溯源数据 -->
                <view v-if="(detail.trace_source_data || null) != null && (detail.items || null) != null && detail.items.length > 0" class="express-data panel-item padding-main border-radius-main bg-white spacing-mb">
                    <view class="br-b padding-bottom-main fw-b text-size">{{$t('user-order-detail.user-order-detail.yhjffg')}}</view>
                    <view class="panel-content oh">
                        <block v-for="(item, index) in detail.items" :key="index">
                            <view :class="index > 0 ? 'margin-top-xxxxl' : 'margin-top-sm'" :data-value="item.goods_url" @tap="url_event">
                                <image :src="item.images" mode="aspectFill" class="goods-image fl radius"></image>
                                <view class="goods-base">
                                    <view class="multi-text">{{item.title}}</view>
                                    <view class="margin-top-xs">
                                        <text class="fw-b">{{ detail.currency_data.currency_symbol }}{{ item.price }}</text>
                                        <text class="margin-left-sm">x{{ item.buy_number }}</text>
                                    </view>
                                </view>
                            </view>
                            <uni-table :emptyText="$t('common.no_data')">
                                <uni-tr>
                                    <uni-th width="60">{{$t('common.num')}}</uni-th>
                                    <uni-th width="200">{{$t('user-order-detail.user-order-detail.3erwer')}}</uni-th>
                                    <uni-th width="200">{{$t('user-order-detail.user-order-detail.dyt44f')}}</uni-th>
                                    <uni-th width="120">{{$t('user-order-detail.user-order-detail.sdf432')}}</uni-th>
                                </uni-tr>
                                <block v-for="(item2, index2) in item.buy_number" :key="index2">
                                    <uni-tr v-if="(detail.trace_source_data[item['id']] || null) != null && (detail.trace_source_data[item['id']][index2+1] || null) != null">
                                        <uni-td>{{$t('common.num')}}{{index2+1}}</uni-td>
                                        <uni-td>
                                            <view v-if="(detail.trace_source_data[item['id']][index2+1]['code'] || null) != null" :data-value="detail.trace_source_data[item['id']][index2+1]['code']" @tap="text_copy_event">
                                                <text>{{detail.trace_source_data[item['id']][index2+1]['code']}}</text>
                                                <text class="bg-white br-green cr-green round padding-horizontal-sm text-size-xs margin-left-sm">{{$t('common.copy')}}</text>
                                            </view>
                                        </uni-td>
                                        <uni-td>
                                            <block v-if="(detail.trace_source_data[item['id']][index2+1]['batch_number'] || null) != null">
                                                <text>{{detail.trace_source_data[item['id']][index2+1]['batch_number']}}</text>
                                            </block>
                                        </uni-td>
                                        <uni-td>
                                            <block v-if="(detail.trace_source_data[item['id']][index2+1]['batch_number_expire'] || null) != null">
                                                <text>{{detail.trace_source_data[item['id']][index2+1]['batch_number_expire']}}</text>
                                            </block>
                                        </uni-td>
                                    </uni-tr>
                                </block>
                            </uni-table>
                        </block>
                    </view>
                </view>

                <!-- 扩展数据 -->
                <view v-if="extension_data.length > 0" class="panel-item padding-main border-radius-main bg-white spacing-mb">
                    <view class="br-b padding-bottom-main fw-b text-size">{{$t('user-order-detail.user-order-detail.ct34n5')}}</view>
                    <view class="panel-content oh">
                        <uni-table :emptyText="$t('common.no_data')">
                            <block v-for="(item, index) in extension_data" :key="index">
                                <uni-tr>
                                    <uni-td>
                                        <text>{{item.name}}</text>
                                        <text v-if="(item.tips || null) != null">：{{item.tips}}</text>
                                    </uni-td>
                                </uni-tr>
                            </block>
                        </uni-table>
                    </view>
                </view>

                <!-- 处方问诊 - 插件 -->
                <block v-if="(detail.plugins_hospital_prescription_data || null) != null">
                    <component-hospital-order-detail :propData="detail.plugins_hospital_prescription_data"></component-hospital-order-detail>
                </block>
            </view>

            <!-- 结尾 -->
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
        </block>
        <block v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </block>

        <!-- 订单商品信息弹层 -->
        <component-popup :propShow="popup_order_item_goods_info_status" propPosition="bottom" @onclose="popup_order_item_goods_info_close_event">
            <view class="padding-main bg-white">
                <view class="close oh pa top-0 right-0 z-i-deep">
                    <view class="fr padding-top padding-right padding-left-sm padding-bottom-sm" @tap.stop="popup_order_item_goods_info_close_event">
                        <iconfont name="icon-close-line" size="28rpx" color="#999"></iconfont>
                    </view>
                </view>
                <view class="order-item-goods-info-container padding-top-xxl">
                    <block v-if="(order_item_goods_info_data || null) != null">
                        <view class="nav-base bg-white tc">
                            <block v-for="(item, index) in order_item_goods_info_nav_list" :key="index">
                                <view v-if="order_item_goods_info_nav_index == index" class="item fl cr-main nav-active-line" :data-index="index" @tap="order_item_goods_info_nav_event">{{ item }}</view>
                                <view v-else class="item fl" :data-index="index" @tap="order_item_goods_info_nav_event">{{ item }}</view>
                            </block>
                        </view>
                        <scroll-view :scroll-y="true" class="scroll-content margin-top-sm">
                            <!-- 商品基础 -->
                            <block v-if="order_item_goods_info_nav_index == 'base'">
                                <view v-if="(order_item_goods_info_data.base_data || null) != null && order_item_goods_info_data.base_data.length > 0" class="panel-item">
                                    <view class="panel-content oh">
                                        <uni-table :emptyText="$t('common.no_data')">
                                            <block v-for="(item, index) in order_item_goods_info_data.base_data" :key="index">
                                                <uni-tr>
                                                    <uni-th width="90">{{item.name}}</uni-th>
                                                    <uni-td>{{item.value}}</uni-td>
                                                </uni-tr>
                                            </block>
                                        </uni-table>
                                    </view>
                                </view>
                                <block v-else>
                                    <component-no-data propStatus="0"></component-no-data>
                                </block>
                            </block>
                            <!-- 商品参数 -->
                            <block v-else-if="order_item_goods_info_nav_index == 'params'">
                                <view v-if="(order_item_goods_info_data.goods_params || null) != null && order_item_goods_info_data.goods_params.length > 0" class="panel-item">
                                    <view class="panel-content oh">
                                        <uni-table :emptyText="$t('common.no_data')">
                                            <block v-for="(item, index) in order_item_goods_info_data.goods_params" :key="index">
                                                <uni-tr>
                                                    <uni-th width="90">{{item.name}}</uni-th>
                                                    <uni-td>{{item.value}}</uni-td>
                                                </uni-tr>
                                            </block>
                                        </uni-table>
                                    </view>
                                </view>
                                <block v-else>
                                    <component-no-data propStatus="0"></component-no-data>
                                </block>
                            </block>
                            <!-- web端详情 -->
                            <block v-else-if="order_item_goods_info_nav_index == 'detail-web'">
                                <view v-if="(order_item_goods_info_data.goods_content_web || null) != null" class="web-html-content">
                                    <mp-html :content="order_item_goods_info_data.goods_content_web" />
                                </view>
                                <block v-else>
                                    <component-no-data propStatus="0"></component-no-data>
                                </block>
                            </block>
                            <!-- 手机端详情 -->
                            <block v-else-if="order_item_goods_info_nav_index == 'detail-app'">
                                <view v-if="(order_item_goods_info_data.goods_content_app || null) != null && order_item_goods_info_data.goods_content_app.length > 0">
                                    <view v-for="(item, index) in order_item_goods_info_data.goods_content_app" :key="index">
                                        <image v-if="(item.images || null) != null" @tap="images_view_event" :data-value="item.images" class="wh-auto dis-block" :src="item.images" mode="widthFix"></image>
                                        <view v-if="(item.content || null) != null" class="content-items">
                                            <view v-for="(items, index2) in item.content" :key="index2">{{ items }}</view>
                                        </view>
                                    </view>
                                </view>
                                <block v-else>
                                    <component-no-data propStatus="0"></component-no-data>
                                </block>
                            </block>
                        </scroll-view>
                    </block>
                    <block v-else>
                        <component-no-data propStatus="0"></component-no-data>
                    </block>
                </view>
            </view>
        </component-popup>

        <!-- 支付组件 -->
        <component-payment
            ref="payment"
            :propCurrencySymbol="payment_currency_symbol"
            :propPayUrl="pay_url"
            :propQrcodeUrl="qrcode_url"
            :propPaymentList="payment_list"
            propPayDataKey="ids"
            :propTempPayValue="pay_value"
            :propPaymentId="payment_id"
            :propDefaultPaymentId="default_payment_id"
            :propPayPrice="pay_price"
            :propIsShowPayment="is_show_payment_popup"
            @close-payment-popup="payment_popup_event_close"
            @pay-success="order_item_pay_back_handle"
            @pay-fail="order_item_pay_back_handle"
            @pay-html-close="order_item_pay_back_handle"
        ></component-payment>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import base64 from '@/common/js/lib/base64.js';
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    import componentPopup from '@/components/popup/popup';
    import componentPayment from '@/components/payment/payment';
    import componentHospitalOrderDetail from '@/pages/plugins/hospital/components/order-detail/order-detail';
    var common_static_url = app.globalData.get_static_url('common');
    export default {
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
                extension_data: [],
                site_fictitious: null,
                status_tips: null,
                goods_use_guide_data_active_index: 0,
                // 商品服务插件
                order_item_goods_info_data: null,
                popup_order_item_goods_info_status: false,
                order_item_goods_info_nav_index: 'base',
                order_item_goods_info_nav_list: {
                    'base': this.$t('common.base'),
                    'params': this.$t('common.params'),
                    'detail-web': this.$t('common.detail_text')+'('+this.$t('common.web_client')+')',
                    'detail-app': this.$t('common.detail_text')+'('+this.$t('common.app_client')+')',
                },
                // 前往页面携带的参数
                payment_currency_symbol: app.globalData.currency_symbol(),
                pay_url: '',
                qrcode_url: '',
                payment_list: [],
                pay_value: '',
                pay_price: 0,
                payment_id: 0,
                default_payment_id: 0,
                is_show_payment_popup: false,
                // 智能工具箱（限定仅可选择下单支付方式）
                is_order_pay_only_can_buy_payment: 0,
                original_payment_list: [],
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
            componentPopup,
            componentPayment,
            componentHospitalOrderDetail,
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            this.setData({
                params: params,
            });

            // 初始化配置
            this.init_config();

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

        // 下拉刷新
        onPullDownRefresh() {
            this.init();
        },

        methods: {
            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {
                    this.setData({
                        is_order_pay_only_can_buy_payment: parseInt(app.globalData.get_config('plugins_base.intellectstools.data.is_order_pay_only_can_buy_payment', 0)),
                    });
                } else {
                    app.globalData.is_config(this, 'init_config');
                }
            },

            // 初始化
            init() {
                this.setData({
                    data_list_loding_status: 1,
                });
                uni.request({
                    url: app.globalData.get_request_url('detail', 'order'),
                    method: 'POST',
                    data: this.params,
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            var detail = data.data || null;
                            this.setData({
                                detail: data.data,
                                detail_list: [
                                    { name: this.$t('user-order-detail.user-order-detail.n18sd2'), value: data.data.order_no || '', is_copy: 1 },
                                    { name: this.$t('user-order-detail.user-order-detail.346376'), value: data.data.warehouse_name || '' },
                                    { name: this.$t('user-order-detail.user-order-detail.io6p5k'), value: data.data.order_model_name || '' },
                                    { name: this.$t('user-order-detail.user-order-detail.yxwu8n'), value: data.data.status_name || '' },
                                    { name: this.$t('user-order-detail.user-order-detail.23qj7m'), value: data.data.pay_status_name || '' },
                                    { name: this.$t('user-order-detail.user-order-detail.vg4jb1'), value: data.data.price || '' },
                                    { name: this.$t('user-order-detail.user-order-detail.2y7l13'), value: data.data.total_price || '' },
                                    { name: this.$t('user-order-detail.user-order-detail.6ub2j0'), value: data.data.preferential_price || '' },
                                    { name: this.$t('user-order-detail.user-order-detail.8b18q8'), value: data.data.increase_price || '' },
                                    { name: this.$t('user-order-detail.user-order-detail.516tlr'), value: data.data.pay_price || '' },
                                    { name: this.$t('user-order-detail.user-order-detail.0e1sfs'), value: (data.data.payment_name || '') + ((data.data.is_under_line_text || null) == null || (data.data.payment_name || null) == null ? '' : '（' + data.data.is_under_line_text + '）') },
                                    { name: this.$t('user-order-detail.user-order-detail.2b5fc8'), value: data.data.user_note || '' },
                                    { name: this.$t('user-order-detail.user-order-detail.h2c78h'), value: data.data.add_time || '' },
                                    { name: this.$t('user-order-detail.user-order-detail.9vivhl'), value: data.data.confirm_time || '' },
                                    { name: this.$t('user-order-detail.user-order-detail.wn83rn'), value: data.data.pay_time || '' },
                                    { name: this.$t('user-order-detail.user-order-detail.1674dc'), value: data.data.delivery_time || '' },
                                    { name: this.$t('user-order-detail.user-order-detail.0i938r'), value: data.data.collect_time || '' },
                                    { name: this.$t('user-order-detail.user-order-detail.1jpv4n'), value: data.data.cancel_time || '' },
                                    { name: this.$t('user-order-detail.user-order-detail.8o2of3'), value: data.data.close_time || '' },
                                ],
                                extension_data: data.data.extension_data || [],
                                site_fictitious: data.site_fictitious || null,
                                status_tips: data.status_tips || null,
                                data_list_loding_status: 3,
                                data_bottom_line_status: true,
                                data_list_loding_msg: '',
                                // 支付信息
                                original_payment_list: data.payment_list || [],
                                payment_list: data.payment_list || [],
                                default_payment_id: data.default_payment_id || 0,
                                payment_id: (detail == null) ? 0 : detail.payment_id,
                                pay_url: app.globalData.get_request_url('pay', 'order'),
                                qrcode_url: app.globalData.get_request_url('paycheck', 'order'),
                                payment_currency_symbol: (detail == null ? '' : detail.currency_data.currency_symbol) || this.payment_currency_symbol,
                                pay_value: (detail == null) ? '' : detail.id,
                                pay_price: (detail == null) ? '0.00' : detail.total_price,
                            });
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
                        uni.stopPullDownRefresh();
                        self.setData({
                            data_list_loding_status: 2,
                            data_bottom_line_status: false,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 售后订单事件
            orderaftersale_event(e) {
                var oid = e.currentTarget.dataset.oid || 0;
                var did = e.currentTarget.dataset.did || 0;
                if (oid == 0 || did == 0) {
                    app.globalData.showToast(this.$t('user-order-detail.user-order-detail.5k6k56'));
                    return false;
                }

                // 进入售后页面
                app.globalData.url_open('/pages/user-orderaftersale-detail/user-orderaftersale-detail?oid=' + oid + '&did=' + did);
            },

            // 地图查看
            address_map_event(e) {
                if ((this.detail.address_data || null) == null) {
                    app.globalData.showToast(this.$t('user-order-detail.user-order-detail.i876o3'));
                    return false;
                }

                // 打开地图
                var data = this.detail.address_data;
                var name = data.alias || data.name || '';
                var address = (data.province_name || '') + (data.city_name || '') + (data.county_name || '') + (data.address || '');
                app.globalData.open_location(data.lng, data.lat, name, address);
            },

            // 订单商品信息弹层开启弹层
            popup_order_item_goods_info_event(e) {
                this.setData({
                    order_item_goods_info_data: this.detail.items[e.currentTarget.dataset.index] || null,
                    popup_order_item_goods_info_status: true,
                });
            },

            // 订单商品信息弹层弹层关闭
            popup_order_item_goods_info_close_event(e) {
                this.setData({
                    popup_order_item_goods_info_status: false,
                });
            },

            // 订单商品信息弹层弹层导航事件
            order_item_goods_info_nav_event(e) {
                this.setData({
                    order_item_goods_info_nav_index: e.currentTarget.dataset.index || 'base'
                });
            },

            // 订单商品使用指南切换事件
            goods_use_guide_data_switch_event(e) {
                this.setData({
                    goods_use_guide_data_active_index: e.currentTarget.dataset.index
                });
            },

            // 支付
            pay_event(e) {            
                // 智能工具箱（限定仅可选择下单支付方式）
                if(this.is_order_pay_only_can_buy_payment == 1) {
                    var payment_list = [];
                    this.original_payment_list.forEach(function(v, k) {
                        if(v.id == this.payment_id) {
                            payment_list.push(v);
                        }
                    });
                } else {
                    var payment_list = this.original_payment_list;
                }

                // 设置支付参数
                this.setData({
                    is_show_payment_popup: true,
                    payment_list: payment_list,
                });
            },

            // 支付弹窗关闭
            payment_popup_event_close(e) {
                this.setData({
                    is_show_payment_popup: false,
                });
            },

            // 订单成功和失败回调
            order_item_pay_back_handle(data) {
                this.init();
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
                                url: app.globalData.get_request_url('cancel', 'order'),
                                method: 'POST',
                                data: {
                                    id: this.detail.id,
                                },
                                dataType: 'json',
                                success: (res) => {
                                    uni.hideLoading();
                                    if (res.data.code == 0) {
                                        this.init();
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

            // 收货
            collect_event(e) {
                var transactionid = this.detail.weixin_collect_data || null;
                if(transactionid == null || !uni.openBusinessView) {
                    this.collect_hand_handle(e);
                } else {
                    // 存在微信单号收货数据，则拉起微信确认收货组件、失败则调用手动收货模式
                    var self = this;
                    uni.openBusinessView({
                        businessType: 'weappOrderConfirm',
                        extraData: {
                            transaction_id: transactionid
                        },
                        success(res) {
                            self.collect_handle(e);
                        },
                        fail(res) {
                            if((res.status || null) == 'fail') {
                                self.collect_hand_handle(e);
                            }
                        }
                    });
                }
            },

            // 手动收货
            collect_hand_handle(e) {
                uni.showModal({
                    title: this.$t('common.warm_tips'),
                    content: this.$t('orderallot-list.orderallot-list.o3ouqv'),
                    confirmText: this.$t('common.confirm'),
                    cancelText: this.$t('common.no'),
                    success: (result) => {
                        if (result.confirm) {
                            this.collect_handle(e);
                        }
                    },
                });
            },

            // 收货处理
            collect_handle(e) {
                uni.showLoading({
                    title: this.$t('common.processing_in_text'),
                });
                uni.request({
                    url: app.globalData.get_request_url('collect', 'order'),
                    method: 'POST',
                    data: {
                        id: this.detail.id,
                    },
                    dataType: 'json',
                    success: (res) => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            this.init();
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
            },

            // 删除
            delete_event(e) {
                uni.showModal({
                    title: this.$t('common.warm_tips'),
                    content: this.$t('common.delete_confirm_tips'),
                    confirmText: this.$t('common.confirm'),
                    cancelText: this.$t('common.no'),
                    success: (result) => {
                        if (result.confirm) {
                            uni.showLoading({
                                title: this.$t('common.processing_in_text'),
                            });
                            uni.request({
                                url: app.globalData.get_request_url('delete', 'order'),
                                method: 'POST',
                                data: {
                                    id: this.detail.id,
                                },
                                dataType: 'json',
                                success: (res) => {
                                    uni.hideLoading();
                                    if (res.data.code == 0) {
                                        app.globalData.showToast(res.data.msg, 'success');
                                        this.setData({
                                            detail: null,
                                            data_list_loding_status: 0,
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
                        }
                    },
                });
            },
            
            // 催催
            rush_event(e) {
                app.globalData.showToast(this.$t('user-order.user-order.f5qqhu'), 'success');
            },

            // 回购事件
            continue_buy_event(e) {
                var item = this.detail;
                if ((item.plugins_intellectstools_data || null) != null) {
                    var plugins_intellectstools_data = item.plugins_intellectstools_data;
                    var continue_buy_data = plugins_intellectstools_data.continue_buy_data || null;
                    // 是否存在订单可以购买的商品数据
                    if(continue_buy_data != null && continue_buy_data.length > 0) {
                        // 是否直接购买
                        var is_buy_again_buy = parseInt(plugins_intellectstools_data.is_buy_again_buy || 0);
                        // 是否加入购物车
                        var is_buy_again_cart = parseInt(plugins_intellectstools_data.is_buy_again_cart || 0);
                        // 如果同时都支持则让用户选择
                        if(is_buy_again_buy == 1 && is_buy_again_cart == 1) {
                            var self = this;
                            uni.showActionSheet({
                                itemList: [this.$t('user-order.user-order.a3c81d'), this.$t('user-order.user-order.5o756f')],
                                success: function (res) {
                                    if(res.tapIndex == 0) {
                                        // 加入购物车
                                        self.continue_order_goods_cart_handle(continue_buy_data, self);
                                    } else {
                                        // 直接购买
                                        self.continue_order_goods_buy_handle(continue_buy_data);
                                    }
                                }
                            });
                        } else if(is_buy_again_cart == 1) {
                            // 加入购物车
                            this.continue_order_goods_cart_handle(continue_buy_data, this);
                        } else if(is_buy_again_buy == 1) {
                            // 直接购买
                            this.continue_order_goods_buy_handle(continue_buy_data);
                        }
                    }
                }
            },

            // 订单商品直接购买处理
            continue_order_goods_buy_handle(goods_data) {
                // 进入订单确认页面
                var data = {
                    buy_type: 'goods',
                    goods_data: encodeURIComponent(base64.encode(JSON.stringify(goods_data))),
                };
                app.globalData.url_open('/pages/buy/buy?data=' + encodeURIComponent(base64.encode(JSON.stringify(data))));
            },

            // 订单商品加入购物车处理
            continue_order_goods_cart_handle(goods_data, self) {
                uni.showLoading({
                    title: this.$t('common.processing_in_text'),
                });
                uni.request({
                    url: app.globalData.get_request_url("save", "cart"),
                    method: "POST",
                    data: { goods_data: goods_data },
                    dataType: "json",
                    success: (res) => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            app.globalData.showToast(res.data.msg, "success");
                            setTimeout(function() {
                                app.globalData.url_open('/pages/cart-page/cart-page');
                            }, 1000);
                        } else {
                            if (app.globalData.is_login_check(res.data, self, "continue_order_goods_cart_handle", goods_data)) {
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

            // 图片查看
            images_view_event(e) {
                var value = e.currentTarget.dataset.value || null;
                if (value != null) {
                    uni.previewImage({
                        current: value,
                        urls: [value],
                    });
                }
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            },

            // 文本复制
            text_copy_event(e) {
                if((e.currentTarget.dataset.value || null) != null) {
                    app.globalData.text_copy_event(e);
                }
            }
        },
    };
</script>
<style>
    @import './user-order-detail.css';
</style>
