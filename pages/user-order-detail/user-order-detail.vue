<template>
    <view>
        <view v-if="detail != null">
            <!-- 地址 -->
            <view v-if="detail.order_model == 0 || detail.order_model == 2" class="address bg-white spacing-mb">
                <view class="address-base oh">
                    <text v-if="(detail.address_data.alias || null) != null" class="address-alias">{{detail.address_data.alias}}</text>
                    <text>{{detail.address_data.name}}</text>
                    <text class="fr">{{detail.address_data.tel}}</text>
                </view>
                <view class="address-detail oh">
                    <image class="icon fl" src="/static/images/user-address.png" mode="widthFix"></image>
                    <view class="text fr">
                        <text>{{detail.address_data.province_name}}{{detail.address_data.city_name}}{{detail.address_data.county_name}}{{detail.address_data.address}}</text>
                        <text v-if="detail.order_model == 2 && (detail.address_data.lng || null) != null && (detail.address_data.lat || null && detail.address_data.lng != 0 && detail.address_data.lat != 0) != null" class="cr-base br address-map-submit" @tap="address_map_event">查看位置</text>
                    </view>
                </view>
            </view>

            <!-- 商品列表 -->
            <view class="goods bg-white spacing-mb">
                <view v-for="(item, index) in detail.items" :key="index" class="goods-item br-b-dashed oh">
                    <navigator :url="'/pages/goods-detail/goods-detail?goods_id=' + item.goods_id" hover-class="none">
                        <image class="goods-image fl" :src="item.images" mode="aspectFill"></image>
                        <view class="goods-base">
                            <view class="goods-title multi-text">{{item.title}}</view>
                            <block v-if="item.spec != null">
                                <view v-for="(spec, index2) in item.spec" :key="index2" class="goods-spec cr-gray">
                                    {{spec.type}}:{{spec.value}}
                                </view>
                            </block>
                        </view>
                        <view class="oh goods-price">
                            <text class="sales-price">{{detail.currency_data.currency_symbol}}{{item.price}}</text>
                            <text v-if="item.original_price > 0" class="original-price">{{detail.currency_data.currency_symbol}}{{item.original_price}}</text>
                            <text class="buy-number">x{{item.buy_number}}</text>
                        </view>
                    </navigator>
                </view>
                <view class="order-describe">{{detail.describe}}</view>
            </view>

            <!-- 虚拟销售数据 -->
            <view v-if="detail.order_model == 3 && detail.pay_status == 1 && (detail.status == 3 || detail.status == 4)"
                class="panel-item spacing-mt site-fictitious">
                <view class="panel-title">{{site_fictitious.title || '密钥信息'}}</view>
                <view class="panel-content bg-white oh">
                    <view v-if="(site_fictitious.tips || null) != null" class="tips-value">
                        <rich-text :nodes="site_fictitious.tips"></rich-text>
                    </view>
                    <view v-for="(item, index) in detail.items" :key="index" class="item br-b-dashed oh">
                        <image class="left-image br fl" :src="item.images" mode="aspectFill"></image>
                        <view class="right-value fr">
                            <rich-text v-if="(item.fictitious_goods_value || null) != null"
                                :nodes="item.fictitious_goods_value"></rich-text>
                            <text v-else class="cr-gray">未配置数据</text>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 自提信息 -->
            <view
                v-if="detail.order_model == 2 && (detail.status == 2 || detail.status == 3) && (detail.extraction_data || null) != null"
                class="panel-item spacing-mt site-extraction">
                <view class="panel-title">取货信息</view>
                <view class="panel-content bg-white oh">
                    <view>
                        <text>取货码：</text>
                        <text class="code">{{detail.extraction_data.code || '取货码不存在、请联系管理员'}}</text>
                    </view>
                    <image v-if="(detail.extraction_data.images || null) != null" class="br qrcode" :src="detail.extraction_data.images" mode="aspectFill"></image>
                </view>
            </view>

            <!-- 订单基础数据 -->
            <view v-if="detail_list.length > 0" class="panel-item spacing-mt">
                <view class="panel-title">基础数据</view>
                <view class="panel-content bg-white">
                    <view v-for="(item, index) in detail_list" :key="index" class="item br-b oh">
                        <view class="title fl">{{item.name}}</view>
                        <view class="content fl br-l">{{item.value}}</view>
                    </view>
                </view>
            </view>

            <!-- 扩展数据 -->
            <view v-if="extension_data.length > 0" class="panel-item spacing-mt extension-list">
                <view class="panel-title">扩展数据</view>
                <view class="panel-content bg-white">
                    <view v-for="(item, index) in extension_data" :key="index" class="item br-b oh">
                        <text class="title">{{item.name}}</text>
                        <text class="content br-l">{{item.tips}}</text>
                    </view>
                </view>
            </view>

            <!-- 结尾 -->
            <component-bottom-line :prop-status="data_bottom_line_status"></component-bottom-line>
        </view>

        <view v-if="detail == null">
            <!-- 提示信息 -->
            <component-no-data :prop-status="data_list_loding_status" :prop-msg="data_list_loding_msg"></component-no-data>

            <view v-if="data_list_loding_status != 1" class="nav-back tc wh-auto">
                <navigator open-type="navigateBack" hover-class="none">
                    <button type="default" size="mini" class="cr-gray br" hover-class="none">返回</button>
                </navigator>
            </view>
        </view>
    </view>
</template>

<script>
    const app = getApp();

    export default {
        data() {
            return {
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

        components: {},
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
                    title: "加载中..."
                });
                this.setData({
                    data_list_loding_status: 1
                });
                uni.request({
                    url: app.globalData.get_request_url("detail", "order"),
                    method: "POST",
                    data: {
                        id: this.params.id
                    },
                    dataType: "json",
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
                                    {name: "支付方式", value: (data.data.payment_name || '') + ((data.data.is_under_line_text || null) == null ? '' : '（' + data.data.is_under_line_text +'）')},
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
                        app.globalData.showToast("服务器请求出错");
                    }
                });
            },

            // 地图查看
            address_map_event(e) {
                if ((this.detail.address_data || null) == null) {
                    app.globalData.showToast("地址有误");
                    return false;
                }

                var data = this.detail.address_data; // 打开地图

                var name = data.alias || data.name || '';
                var address = (data.province_name || '') + (data.city_name || '') + (data.county_name || '') + (data
                    .address || '');
                app.globalData.open_location(data.lng, data.lat, name, address);
            }

        }
    };
</script>
<style>
    @import './user-order-detail.css';
</style>