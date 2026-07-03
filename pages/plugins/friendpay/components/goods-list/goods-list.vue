<template>
    <view v-if="(goodsList || null) != null && goodsList.length > 0" class="friendpay-goods-list margin-top-main">
        <view v-for="(item, index) in goodsList" :key="index" :class="'goods-item flex-row' + (index > 0 ? ' goods-item-gap' : '')">
            <image v-if="(item.images || null) != null" :src="item.images" mode="aspectFill" class="goods-image radius"></image>
            <view class="goods-content flex-1 flex-width margin-left-sm">
                <view class="text-size-sm single-text">{{ item.title }}</view>
                <view v-if="(item.spec_text || null) != null" class="cr-grey text-size-xs margin-top-xs">{{ item.spec_text }}</view>
                <view class="margin-top-xs">
                    <text class="cr-price">{{ currency_symbol }}{{ item.price }}</text>
                    <text class="cr-grey text-size-xs margin-left-sm">x{{ item.buy_number }}</text>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    export default {
        name: 'component-friendpay-goods-list',
        props: {
            propGoodsList: {
                type: Array,
                default: () => [],
            },
        },
        data() {
            return {
                currency_symbol: app.globalData.currency_symbol(),
            };
        },
        computed: {
            // 商品列表
            goodsList() {
                return this.propGoodsList || [];
            },
        },
    };
</script>
<style scoped>
    .goods-item-gap {
        margin-top: 24rpx;
        padding-top: 24rpx;
        border-top: 1rpx dashed #eee;
    }
    .goods-image {
        width: 120rpx;
        height: 120rpx;
        flex-shrink: 0;
    }
</style>
