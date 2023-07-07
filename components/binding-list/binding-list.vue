<template>
    <view>
        <view v-if="(data_list || null) != null && data_list.length > 0" class="plugins-binding-data-list oh">
            <block v-for="(item, index) in data_list" :key="index">
                <view class="item border-radius-main bg-white padding-main oh spacing-mb" :data-value="item.url" @tap="url_event">
                    <image :src="item.images" mode="aspectFit" class="images fl dis-block border-radius-main"></image>
                    <view class="base-right fr bs-bb">
                        <view class="fw-b text-size cr-base single-text">{{item.title}}</view>
                        <view class="cr-grey margin-top-xs text-size-xs multi-text">{{item.describe}}</view>
                        <view class="sales-price margin-top-sm single-text">{{propCurrencySymbol}}{{item.estimate_price}}</view>
                        <view v-if="item.estimate_original_price != 0" class="original-price margin-top-xs single-text">{{propCurrencySymbol}}{{item.estimate_original_price}}</view>
                        <view v-if="(item.estimate_discount_price || 0) != 0" class="margin-top-sm single-text">
                            <text class="discount-icon cr-white text-size-xs">节省</text>
                            <text class="cr-green">{{propCurrencySymbol}}{{item.estimate_discount_price}}</text>
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
            }
        }
    };
</script>
<style>
    .plugins-binding-data-list .item .images {
        width: 265rpx;
        height: 265rpx !important;
    }
    .plugins-binding-data-list .item .base-right {
        width: calc(100% - 285rpx);
    }
    .plugins-binding-data-list .item .base-right .discount-icon {
        border-top-right-radius: 30rpx;
        border-bottom-left-radius: 30rpx;
        background-image: linear-gradient(45deg,#a3f9a3,#248828,#8bc34a,#d2374c,#9c27b0);
        background-size: 400%;
        animation: gradient 5s ease infinite;
        padding: 0 16rpx;
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