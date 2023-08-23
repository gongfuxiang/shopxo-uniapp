<template>
    <view>
        <block v-if="detail != null">
            <view class="padding-horizontal-main padding-top-main">
                <!-- 地址 -->
                <view v-if="(detail.order_model == 0 || detail.order_model == 2) && (detail.address_data || null) != null" class="address bg-white padding-horizontal-main padding-top-main border-radius-main spacing-mb">
                    <view class="address-base oh">
                        <text v-if="(detail.address_data.alias || null) != null" class="address-alias round br-main cr-main bg-white margin-right-sm">{{detail.address_data.alias}}</text>
                        <text>{{detail.address_data.name}}</text>
                        <text class="fr">{{detail.address_data.tel}}</text>
                    </view>
                    <view class="address-detail oh margin-bottom-main">
                        <image class="icon fl" :src="common_static_url+'map-icon.png'" mode="widthFix"></image>
                        <view class="text fr">
                            <text>{{detail.address_data.province_name}}{{detail.address_data.city_name}}{{detail.address_data.county_name}}{{detail.address_data.address}}</text>
                            <text v-if="detail.order_model == 2 && (detail.address_data.lng || 0) != 0 && (detail.address_data.lat || 0) != 0" class="address-map-submit cr-base br round bg-white margin-left-sm text-size-xs" @tap="address_map_event">查看位置</text>
                        </view>
                    </view>
                    <view class="address-divider spacing-mb"></view>
                </view>

                <!-- 商品列表 -->
                <view class="goods bg-white padding-main border-radius-main spacing-mb">
                    <view class="br-b padding-bottom-main fw-b text-size">商品信息</view>
                    <view v-for="(item, index) in detail.items" :key="index" class="goods-item br-b-dashed oh padding-main">
                        <navigator :url="item.goods_url" hover-class="none">
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
                        </navigator>
                    </view>
                    <view class="padding-top-main tr cr-base text-size">
                        <text>共<text class="fw-b">{{detail.buy_number_count}}</text>件 合计 <text class="sales-price margin-right-xs">{{detail.currency_data.currency_symbol}}{{detail.total_price}}</text>元</text>
                    </view>
                </view>

                <!-- 虚拟销售数据 -->
                <view v-if="(site_fictitious || null) != null" class="site-fictitious panel-item padding-horizontal-main padding-top-main border-radius-main bg-white spacing-mb">
                    <view class="br-b padding-bottom-main fw-b text-size">{{site_fictitious.title || '密钥信息'}}</view>
                    <view class="panel-content oh padding-top-main">
                        <view v-if="(site_fictitious.tips || null) != null" class="tips-value radius padding-main margin-bottom-main">
                            <mp-html :content="site_fictitious.tips" />
                        </view>
                        <view v-for="(item, index) in detail.items" :key="index" class="item br-b-dashed oh padding-bottom-main margin-bottom-main">
                            <image class="left-image br fl radius" :src="item.images" mode="aspectFill"></image>
                            <view class="right-value fr">
                                <mp-html v-if="(item.fictitious_goods_value || null) != null" :content="item.fictitious_goods_value" />
                                <text v-else class="cr-gray">未配置数据</text>
                            </view>
                        </view>
                    </view>
                </view>

                <!-- 自提信息 -->
                <view v-if="(detail.extraction_data || null) != null" class="site-extraction panel-item padding-main border-radius-main bg-white spacing-mb">
                    <view class="br-b padding-bottom-main fw-b text-size">取货信息</view>
                    <view class="panel-content oh padding-top-main">
                        <view>
                            <text>取货码：</text>
                            <text class="radius bg-green cr-white padding-left-sm padding-right-sm">{{detail.extraction_data.code || '取货码不存在、请联系管理员'}}</text>
                        </view>
                        <image v-if="(detail.extraction_data.images || null) != null" class="qrcode br radius margin-top-lg" :src="detail.extraction_data.images" mode="aspectFill"></image>
                    </view>
                </view>

                <!-- 订单基础数据 -->
                <view v-if="detail_list.length > 0" class="panel-item padding-main border-radius-main bg-white spacing-mb">
                    <view class="br-b padding-bottom-main fw-b text-size">订单信息</view>
                    <view class="panel-content oh">
                        <view v-for="(item, index) in detail_list" :key="index" class="item br-b-dashed oh padding-vertical-main">
                            <view class="title fl padding-right-main cr-gray">{{item.name}}</view>
                            <view class="content fl br-l padding-left-main">{{item.value}}</view>
                        </view>
                    </view>
                </view>

                <!-- 扩展数据 -->
                <view v-if="extension_data.length > 0" class="panel-item padding-main border-radius-main bg-white spacing-mb">
                    <view class="br-b padding-bottom-main fw-b text-size">扩展数据</view>
                    <view class="panel-content oh">
                        <view v-for="(item, index) in extension_data" :key="index" class="item br-b oh padding-vertical-main">
                            <view class="title fl padding-right-main cr-gray">{{item.name}}</view>
                            <view class="content fl br-l padding-left-main">{{item.tips}}</view>
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
    </view>
</template>
<script>
    const app = getApp();
    import componentNoData from "../../components/no-data/no-data";
    import componentBottomLine from "../../components/bottom-line/bottom-line";

    var common_static_url = app.globalData.get_static_url('common');
    export default {
        data() {
            return {
                common_static_url: common_static_url,
                params: null,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_bottom_line_status: false,
                detail: null,
                detail_list: [],
                extension_data: [],
                site_fictitious: null
            };
        },

        components: {
            componentNoData,
            componentBottomLine
        },
        props: {},

        onLoad(params) {
            //params['id'] = 5;
            this.setData({
                params: params
            });
        },

        onShow() {
            // 数据加载
            this.init();
            
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
                var self = this;
                uni.showLoading({
                    title: '加载中...'
                });
                this.setData({
                    data_list_loding_status: 1
                });
                uni.request({
                    url: app.globalData.get_request_url("detail", "order"),
                    method: 'POST',
                    data: {
                        id: this.params.id
                    },
                    dataType: 'json',
                    success: res => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            self.setData({
                                detail: data.data,
                                detail_list:[
                                    {name: "出货服务", value: data.data.warehouse_name || ''},
                                    {name: "订单模式", value: data.data.order_model_name || '' },
                                    {name: "订单编号", value: data.data.order_no || ''},
                                    {name: "订单状态", value: data.data.status_name || ''},
                                    {name: "支付状态", value: data.data.pay_status_name || ''},
                                    {name: "订单单价", value: data.data.price || ''},
                                    {name: "订单总价", value: data.data.total_price || ''},
                                    {name: "优惠金额", value: data.data.preferential_price || ''},
                                    {name: "增加金额", value: data.data.increase_price || '' },
                                    {name: "支付金额", value: data.data.pay_price || ''},
                                    {name: "支付方式", value: (data.data.payment_name || '') + (((data.data.is_under_line_text || null) == null || (data.data.payment_name || null) == null) ? '' : '（' + data.data.is_under_line_text +'）')},
                                    {name: "快递公司", value: data.data.express_name || ''},
                                    {name: "快递单号", value: data.data.express_number || ''},
                                    {name: "用户留言", value: data.data.user_note || ''},
                                    {name: "创建时间", value: data.data.add_time || ''},
                                    {name: "确认时间", value: data.data.confirm_time || ''},
                                    {name: "支付时间", value: data.data.pay_time || ''},
                                    {name: "发货时间", value: data.data.delivery_time || ''},
                                    {name: "收货时间", value: data.data.collect_time || ''},
                                    {name: "取消时间", value: data.data.cancel_time || ''},
                                    {name: "关闭时间", value: data.data.close_time || ''},
                                ],
                                extension_data: data.data.extension_data || [],
                                site_fictitious: data.site_fictitious || null,
                                data_list_loding_status: 3,
                                data_bottom_line_status: true,
                                data_list_loding_msg: ''
                            });
                        } else {
                            self.setData({
                                data_list_loding_status: 2,
                                data_bottom_line_status: false,
                                data_list_loding_msg: res.data.msg
                            });
                            if (app.globalData.is_login_check(res.data, self, 'init')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        self.setData({
                            data_list_loding_status: 2,
                            data_bottom_line_status: false,
                            data_list_loding_msg: '服务器请求出错'
                        });
                        app.globalData.showToast('服务器请求出错');
                    }
                });
            },
            
            // 售后订单事件
            orderaftersale_event(e) {
                var oid = e.currentTarget.dataset.oid || 0;
                var did = e.currentTarget.dataset.did || 0;
                if (oid == 0 || did == 0) {
                    app.globalData.showToast("参数有误");
                    return false;
                }
                
                // 进入售后页面
                uni.navigateTo({
                    url: "/pages/user-orderaftersale-detail/user-orderaftersale-detail?oid=" + oid + "&did=" + did
                });
            },

            // 地图查看
            address_map_event(e) {
                if ((this.detail.address_data || null) == null) {
                    app.globalData.showToast("地址有误");
                    return false;
                }
                
                // 打开地图
                var data = this.detail.address_data;
                var name = data.alias || data.name || '';
                var address = (data.province_name || '') + (data.city_name || '') + (data.county_name || '') + (data.address || '');
                app.globalData.open_location(data.lng, data.lat, name, address);
            }
        }
    };
</script>
<style>
    @import './user-order-detail.css';
</style>