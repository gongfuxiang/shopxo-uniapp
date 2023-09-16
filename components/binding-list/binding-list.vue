<template>
    <view>
        <view v-if="(data_list || null) != null && data_list.length > 0" class="plugins-binding-data-list oh">
            <block v-for="(item, index) in data_list" :key="index">
                <view class="item border-radius-main bg-white padding-main oh pr spacing-mb">
                    <view class="oh" :data-value="item.url" @tap="url_event">
                        <image :src="item.images" mode="aspectFit" class="images fl dis-block border-radius-main"></image>
                        <view class="base-right fr bs-bb">
                            <view class="fw-b text-size cr-base single-text">{{item.title}}</view>
                            <view class="sales-price margin-top-lg single-text">{{propCurrencySymbol}}{{item.estimate_price}}</view>
                            <view v-if="(item.estimate_discount_price || 0) != 0" class="margin-top-sm single-text">
                                <text class="discount-icon cr-white text-size-xs">节省</text>
                                <text class="cr-green">{{propCurrencySymbol}}{{item.estimate_discount_price}}</text>
                            </view>
                            <view class="tr margin-top-xl">
                                <button type="default" size="mini" class="br-main bg-main cr-white round buy-submit">{{item.type_name}}购买</button>
                            </view>
                        </view>
                    </view>
                    <view :class="'binding-goods-list border-radius-main margin-top-lg '+((item.is_home_show_goods || 0) == 1 ? 'expand' : '')" :style="'--height: '+((Math.ceil(item.goods.length/2)*132)+20)+'rpx'">
                        <view class="padding-horizontal-main padding-top-lg padding-bottom-sm oh">
                            <block v-for="(gv, gi) in item.goods" :key="gi">
                                <view class="goods-item oh margin-top-sm margin-bottom-lg" :data-value="gv.goods_url" @tap="url_event">
                                    <image :src="gv.images" mode="aspectFit" class="goods-images fl dis-block radius"></image>
                                    <view class="goods-right fr bs-bb">
                                        <view class="single-text text-size-sm">{{gv.title}}</view>
                                        <view class="single-text sales-price text-size-xs">{{propCurrencySymbol}}{{gv.price}}</view>
                                        <view v-if="(gv.discount_price || null) != null" class="single-text cr-green text-size-xs">节省{{propCurrencySymbol}}{{gv.discount_price}}</view>
                                    </view>
                                </view>
                            </block>
                        </view>
                    </view>
                    <view class="bg-white padding-horizontal-main padding-bottom-main wh-auto pa bs-bb bottom-elastic" :data-index="index" @tap="item_more_goods_event">
                        <view :class="'padding-top-main arrow-bottom '+((item.is_home_show_goods || 0) != 1 ? 'br-t-dashed' : '')">
                            <view class="cr-grey text-size-xs">{{(item.is_home_show_goods || 0) == 1 ? '收起' : '展开'}}{{item.type_name}}商品</view>
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
                config: {},
                data_list: []
            };
        },
        components: {},
        props: {
            // 价格符号
            propCurrencySymbol: {
                type: String,
                default: app.globalData.data.currency_symbol
            },
            propConfig: {
            	type: [String,Object],
            	default: null
            },
            propDataList: {
            	type: Array,
            	default: () => []
            }
        },
        // 属性值改变监听
        watch: {
            
        },
        // 页面被展示
        created: function(e) {  
            var config = ((this.propConfig || null) == null ? app.globalData.get_config('plugins_base.binding.data') : this.propConfig) || {};
            this.setData({
                config: config,
                data_list: this.propDataList
            });
        },
        methods: {
            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            },

            // 商品展开关闭
            item_more_goods_event(e) {
                var index = e.currentTarget.dataset.index;
                var temp_data = this.data_list;
                temp_data[index]['is_home_show_goods'] = (parseInt(temp_data[index]['is_home_show_goods'] || 0) == 1) ? 0 : 1;
                this.setData({data_list: temp_data});
            }
        }
    };
</script>
<style>
    .plugins-binding-data-list .item {
        padding-bottom: 76rpx;
    }
    .plugins-binding-data-list .item .images {
        width: 232rpx;
        height: 232rpx !important;
    }
    .plugins-binding-data-list .item .base-right {
        width: calc(100% - 252rpx);
    }
    .plugins-binding-data-list .item .base-right .discount-icon {
        border-top-right-radius: 30rpx;
        border-bottom-left-radius: 30rpx;
        background-image: linear-gradient(45deg,#a3f9a3,#248828,#8bc34a,#d2374c,#9c27b0);
        background-size: 400%;
        animation: gradient 5s ease infinite;
        padding: 0 16rpx;
    }
    .plugins-binding-data-list .item .base-right .buy-submit {
        padding: 0 20rpx;
        line-height: 46rpx;
    }
    .plugins-binding-data-list .item .binding-goods-list {
        background: #F8F8F8;
        transition: height 0.25s ease-in-out;
        height: 0;
    }
    .plugins-binding-data-list .item .binding-goods-list.expand {
        height: var(--height);
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