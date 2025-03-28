<template>
    <view :class="theme_view">
        <block v-if="detail != null">
            <view class="padding-horizontal-main padding-top-main">
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
                <view class="goods bg-white padding-main border-radius-main spacing-mb">
                    <view class="br-b padding-bottom-main fw-b text-size">{{$t('user-order-detail.user-order-detail.7f8p26')}}</view>
                    <view v-for="(item, index) in detail.items" :key="index" class="goods-item br-b-dashed oh padding-main">
                        <view :data-value="item.goods_url" @tap="url_event" class="cp">
                            <image class="goods-image fl radius" :src="item.images" mode="aspectFill"></image>
                            <view class="goods-base pr">
                                <view class="multi-text">{{ item.title }}</view>
                                <view v-if="item.spec != null" class="margin-top-sm">
                                    <block v-for="(sv, si) in item.spec" :key="si">
                                        <text v-if="si > 0" class="cr-grey padding-left-xs padding-right-xs">;</text>
                                        <text class="cr-grey">{{ sv.value }}</text>
                                    </block>
                                </view>
                                <view class="margin-top-sm">
                                    <text class="fw-b">{{ detail.currency_data.currency_symbol }}{{ item.price }}</text>
                                    <text class="margin-left-sm">x{{ item.buy_number }}</text>
                                </view>
                                <view v-if="detail.is_can_launch_aftersale == 1 && (item.orderaftersale_btn_text || null) != null" class="orderaftersale-btn-text cr-blue pa bg-white" @tap.stop="orderaftersale_event" :data-oid="detail.id" :data-did="item.id">{{ item.orderaftersale_btn_text }}</view>
                            </view>
                        </view>
                    </view>
                    <view class="padding-top-main tr cr-base text-size">
                        <text>{{$t('user-order-detail.user-order-detail.423rmr')}}<text class="fw-b">{{ detail.buy_number_count }}</text>{{$t('user-order-detail.user-order-detail.41ty94')}}<text class="sales-price margin-right-xs">{{ detail.currency_data.currency_symbol }}{{ detail.total_price }}</text></text>
                    </view>
                </view>

                <!-- 服务信息 -->
                <view v-if="(detail.service_data || null) != null" class="service-data panel-item padding-main border-radius-main bg-white spacing-mb">
                    <view class="br-b padding-bottom-main fw-b text-size">{{$t('user-order-detail.user-order-detail.567ygf')}}</view>
                    <view class="panel-content oh padding-top-main">
                        <view class="item br-b-dashed oh padding-vertical-main">
                            <view class="title fl padding-right-main cr-grey">{{$t('user-order-detail.user-order-detail.gsfw4d')}}</view>
                            <view class="content fl br-l padding-left-main">{{ detail.service_data.service_name }}</view>
                        </view>
                        <view class="item br-b-dashed oh padding-vertical-main">
                            <view class="title fl padding-right-main cr-grey">{{$t('user-order-detail.user-order-detail.6ygfew')}}</view>
                            <view class="content fl br-l padding-left-main" :data-value="detail.service_data.service_mobile" @tap="text_copy_event">
                                <text>{{ detail.service_data.service_mobile }}</text>
                                <text class="bg-white br-green cr-green round padding-horizontal-sm text-size-xs margin-left-sm">{{$t('common.copy')}}</text>
                            </view>
                        </view>
                        <view v-if="(detail.service_data.service_duration_minute_text || null) != null" class="item br-b-dashed oh padding-vertical-main">
                            <view class="title fl padding-right-main cr-grey">{{$t('user-order-detail.user-order-detail.67ujfr')}}</view>
                            <view class="content fl br-l padding-left-main">{{ detail.service_data.service_duration_minute_text }}</view>
                        </view>
                        <view class="item br-b-dashed oh padding-vertical-main">
                            <view class="title fl padding-right-main cr-grey">{{$t('common.service_time')}}</view>
                            <view class="content fl br-l padding-left-main">
                                <view v-if="(detail.service_data.service_start_time || null) != null">{{ detail.service_data.service_start_time }}</view>
                                <view v-if="(detail.service_data.service_end_time || null) != null">{{ detail.service_data.service_end_time }}</view>
                            </view>
                        </view>
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

                <!-- 自提信息 -->
                <view v-if="(detail.extraction_data || null) != null" class="site-extraction panel-item padding-main border-radius-main bg-white spacing-mb">
                    <view class="br-b padding-bottom-main fw-b text-size">{{$t('user-order-detail.user-order-detail.7dikfm')}}</view>
                    <view class="panel-content oh padding-top-main">
                        <image v-if="(detail.extraction_data.images || null) != null" class="qrcode br radius margin-bottom-sm" :src="detail.extraction_data.images" mode="aspectFill"></image>
                        <view>
                            <text>{{$t('user-order-detail.user-order-detail.o38952')}}</text>
                            <text class="radius bg-green cr-white padding-left-sm padding-right-sm">{{ detail.extraction_data.code || $t('user-order-detail.user-order-detail.hpq62x') }}</text>
                        </view>
                    </view>
                </view>

                <!-- 订单基础数据 -->
                <view v-if="detail_list.length > 0" class="panel-item padding-main border-radius-main bg-white spacing-mb">
                    <view class="br-b padding-bottom-main fw-b text-size">{{$t('user-order-detail.user-order-detail.0f26j2')}}</view>
                    <view class="panel-content oh">
                        <view v-for="(item, index) in detail_list" :key="index" class="item br-b-dashed oh padding-vertical-main">
                            <view class="title fl padding-right-main cr-grey">{{ item.name }}</view>
                            <view v-if="(item.is_copy || 0) == 1" class="content fl br-l padding-left-main" :data-value="item.value" @tap="text_copy_event">
                                <text>{{ item.value }}</text>
                                <text class="bg-white br-green cr-green round padding-horizontal-sm text-size-xs margin-left-sm">{{$t('common.copy')}}</text>
                            </view>
                            <view v-else class="content fl br-l padding-left-main">{{ item.value }}</view>
                        </view>
                    </view>
                </view>

                <!-- 快递信息 -->
                <view v-if="(detail.express_data || null) != null && detail.express_data.length > 0" class="express-data panel-item padding-main border-radius-main bg-white spacing-mb">
                    <view class="br-b padding-bottom-main fw-b text-size">{{$t('user-order-detail.user-order-detail.0876xf')}}</view>
                    <view class="panel-content">
                        <view v-for="(item, index) in detail.express_data" :key="index" class="item br-b-dashed oh padding-vertical-main">
                            <view class="item oh padding-vertical-main">
                                <view class="title fl padding-right-main cr-grey">{{$t('user-order-detail.user-order-detail.12d445')}}</view>
                                <view class="content fl br-l padding-left-main" :data-value="item.express_name" @tap="text_copy_event">{{item.express_name}}</view>
                            </view>
                            <view class="item oh padding-vertical-main">
                                <view class="title fl padding-right-main cr-grey">{{$t('user-order-detail.user-order-detail.2byl8l')}}</view>
                                <view class="content fl br-l padding-left-main" :data-value="item.express_number" @tap="text_copy_event">
                                    <text>{{item.express_number}}</text>
                                    <text class="bg-white br-green cr-green round padding-horizontal-sm text-size-xs margin-left-sm">{{$t('common.copy')}}</text>
                                </view>
                            </view>
                            <view v-if="(item.note || null) != null" class="item oh padding-vertical-main">
                                <view class="title fl padding-right-main cr-grey">{{$t('common.note')}}:</view>
                                <view class="content fl br-l padding-left-main" :data-value="item.note" @tap="text_copy_event">{{item.note}}</view>
                            </view>
                        </view>
                    </view>
                </view>

                <!-- 扩展数据 -->
                <view v-if="extension_data.length > 0" class="panel-item padding-main border-radius-main bg-white spacing-mb">
                    <view class="br-b padding-bottom-main fw-b text-size">{{$t('user-order-detail.user-order-detail.ct34n5')}}</view>
                    <view class="panel-content oh">
                        <view v-for="(item, index) in extension_data" :key="index" class="item br-b-dashed oh padding-vertical-main cr-base">
                            <text>{{ item.name }}</text>
                            <text v-if="(item.tips || null) != null">：{{ item.tips }}</text>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 结尾 -->
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
        </block>
        <block v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
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
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            this.setData({
                params: params,
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
                    url: app.globalData.get_request_url('detail', 'order'),
                    method: 'POST',
                    data: this.params,
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
                                detail: data.data,
                                detail_list: [
                                    { name: this.$t('user-order-detail.user-order-detail.346376'), value: data.data.warehouse_name || '' },
                                    { name: this.$t('user-order-detail.user-order-detail.io6p5k'), value: data.data.order_model_name || '' },
                                    { name: this.$t('user-order-detail.user-order-detail.n18sd2'), value: data.data.order_no || '', is_copy: 1 },
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
                                data_list_loding_status: 3,
                                data_bottom_line_status: true,
                                data_list_loding_msg: '',
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
