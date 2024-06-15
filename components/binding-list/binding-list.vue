<template>
    <view :class="theme_view">
        <view v-if="(data_list || null) != null && data_list.length > 0" class="plugins-binding-data-list oh">
            <block v-for="(item, index) in data_list" :key="index">
                <view class="item border-radius-main bg-white padding-main oh pr spacing-mb">
                    <view class="oh flex-row" :data-value="item.url" @tap="url_event">
                        <image :src="item.images" mode="aspectFit" class="images dis-block border-radius-main"></image>
                        <view class="flex-1 flex-width flex-col jc-sb">
                            <view class="base-right bs-bb padding-left-main">
                                <view class="fw-b text-size-lg cr-base single-text">{{ item.title }}</view>
                                <view class="sales-price margin-top-main single-text">
                                    <text class="text-size-xs">{{ propCurrencySymbol }}</text>
                                    <text class="text-size-lg fw-b">{{ item.estimate_price }}</text>
                                </view>
                                <view v-if="(item.estimate_discount_price || 0) != 0" class="margin-top-sm single-text flex-row align-c">
                                    <text class="discount-icon cr-white text-size-xs">{{$t('detail.detail.6026t4')}}</text>
                                    <view class="cr-green single-text">
                                        <text class="text-size-xs">{{ propCurrencySymbol }}</text>
                                        <text class="text-size">{{ item.estimate_discount_price }}</text>
                                    </view>
                                </view>
                            </view>
                            <button type="default" size="mini" class="br-main bg-main cr-white round buy-submit self-e margin-0 text-size-xs">{{ item.type_name }}{{$t('binding-list.binding-list.kh7951')}}</button>
                        </view>
                    </view>
                    <view class="binding-goods-list border-radius-main margin-top-main oh" :style="'height: ' + ((item.is_home_show_goods || 0) == 1 ? Math.ceil(item.goods.length / 2) * 134 + 12 : '0') + 'rpx'">
                        <view class="padding-horizontal-main padding-top-main padding-bottom-main oh">
                            <block v-for="(gv, gi) in item.goods" :key="gi">
                                <view class="goods-item oh margin-bottom-lg" :data-value="gv.goods_url" @tap="url_event">
                                    <image :src="gv.images" mode="aspectFit" class="goods-images fl dis-block radius"></image>
                                    <view class="goods-right fr bs-bb">
                                        <view class="single-text text-size-sm">{{ gv.title }}</view>
                                        <view v-if="(gv.show_field_price_status || 0) == 1" class="single-text">
                                            <text class="sales-price va-m text-size-xss">{{ gv.show_price_symbol }}{{ gv.price }}</text>
                                            <text class="cr-grey va-m text-size-xsss">{{ gv.show_price_unit }}</text>
                                        </view>
                                        <view v-if="(gv.discount_price || null) != null" class="single-text cr-green text-size-xss">{{$t('detail.detail.6026t4')}}{{ gv.show_price_symbol }}{{ gv.discount_price }}</view>
                                    </view>
                                </view>
                            </block>
                        </view>
                    </view>
                    <view class="bg-white padding-top-main wh-auto bs-bb bottom-elastic" :class="(item.is_home_show_goods || 0) != 1 ? 'br-t-dashed' : ''" :data-index="index" @tap="item_more_goods_event">
                        <view class="flex-row jc-sb align-c">
                            <view class="cr-grey-9 text-size-xs">{{ (item.is_home_show_goods || 0) == 1 ? $t('binding-list.binding-list.2u4v35') : $t('binding-list.binding-list.91d60h') }}{{ item.type_name }}{{$t('recommend-list.recommend-list.x74z3o')}}</view>
                            <iconfont :name="(item.is_home_show_goods || 0) == 1 ? 'icon-arrow-top' : 'icon-arrow-bottom'" size="24rpx" color="#666"></iconfont>
                        </view>
                    </view>
                </view>
            </block>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                config: {},
                data_list: [],
            };
        },
        components: {},
        props: {
            // 价格符号
            propCurrencySymbol: {
                type: String,
                default: app.globalData.currency_symbol()
            },
            propConfig: {
                type: [String, Object],
                default: null,
            },
            propData: {
                type: Object,
                default: () => {
                    return {};
                },
            }
        },
        // 属性值改变监听
        watch: {
            // 数据
            propData(value, old_value) {
                this.init();
            }
        },
        // 页面被展示
        created: function(e) {
        	this.init();
        },
        methods: {
            // 初始化
            init() {
                var config = ((this.propConfig || null) == null ? app.globalData.get_config('plugins_base.binding.data') : this.propConfig) || {};
                var data_list = ((this.propData || null) == null || (this.propData.data || null) == null || this.propData.data.length == 0) ? [] : this.propData.data;
                this.setData({
                    config: config,
                    data_list: data_list,
                });
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            },

            // 商品展开关闭
            item_more_goods_event(e) {
                var index = e.currentTarget.dataset.index;
                var temp_data = this.data_list;
                temp_data[index]['is_home_show_goods'] = parseInt(temp_data[index]['is_home_show_goods'] || 0) == 1 ? 0 : 1;
                this.setData({ data_list: temp_data });
            },
        },
    };
</script>
<style scoped>
    .plugins-binding-data-list .item .images {
        width: 256rpx;
        height: 256rpx !important;
    }
    .plugins-binding-data-list .item .base-right .discount-icon {
        border-top-right-radius: 30rpx;
        border-bottom-left-radius: 30rpx;
        background-image: linear-gradient(45deg, #a3f9a3, #248828, #8bc34a, #d2374c, #9c27b0);
        background-size: 400%;
        animation: gradient 5s ease infinite;
        padding: 0 16rpx;
    }
    .plugins-binding-data-list .item .buy-submit {
        padding: 0 20rpx;
        height: 46rpx;
        line-height: 44rpx;
    }
    .plugins-binding-data-list .item .binding-goods-list {
        background: #f8f8f8;
        transition: height 0.25s ease-in-out;
    }
    .plugins-binding-data-list .item .binding-goods-list .goods-item {
        width: calc(50% - 15rpx);
        height: 102rpx;
    }
    .plugins-binding-data-list .item .binding-goods-list .goods-item:nth-child(odd) {
        float: left;
    }
    .plugins-binding-data-list .item .binding-goods-list .goods-item:nth-child(even) {
        float: right;
    }
    .plugins-binding-data-list .item .binding-goods-list .goods-item .goods-right {
        width: calc(100% - 115rpx);
    }
    .plugins-binding-data-list .item .binding-goods-list .goods-item .goods-images {
        width: 100rpx;
        height: 100rpx !important;
    }
    .plugins-binding-data-list .item .bottom-elastic {
        left: 0;
        bottom: 0;
    }
    @keyframes gradient {
        0% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0% 50%;
        }
    }
</style>
