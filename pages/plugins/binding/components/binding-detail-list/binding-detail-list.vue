<template>
    <view :class="theme_view">
        <view v-if="((propData || null) != null)" class="plugins-binding-container">
            <!-- 组合搭配 -->
            <block v-if="((propData.binding_list || null) != null)">
                <block v-for="(bv, bi) in propData.binding_list" :key="bi">
                    <view v-if="((bv.goods || null) != null) && bv.goods.length > 0" class="plugins-binding-list padding-horizontal-main padding-top-main border-radius-main oh spacing-mb">
                        <view class="spacing-nav-title oh">
                            <text class="text-wrapper">{{bv.title}}</text>
                            <view v-if="(bv.estimate_discount_price || 0) != 0" class="estimate-discount-price fr">
                                <text class="discount-icon cr-white text-size-xs">{{$t('detail.detail.6026t4')}}</text>
                                <text class="cr-green text-size-lg va-m">{{propCurrencySymbol}}{{bv.estimate_discount_price}}</text>
                            </view>
                        </view>
                        <view class="left-content fl">
                            <component-goods-list :propData="{style_type: 2, goods_list: bv.goods, multiple_items: 2}" :propOpenCart="false" :propLabel="propLabel" :propCurrencySymbol="propCurrencySymbol" :propIsAutoPlay="(propData.config.is_auto_play || 0) == 1"></component-goods-list>
                        </view>
                        <view class="right-content fr bs-bb padding-left-main tc">
                            <button type="default" size="mini" class="bg-main br-main cr-white text-size-xs round" :data-value="'/pages/plugins/binding/detail/detail?id='+bv.id" @tap="url_event">{{bv.buy_button_text}}</button>
                            <view class="sales-price margin-top-sm">{{propCurrencySymbol}}{{bv.estimate_price}}</view>
                            <view v-if="(bv.estimate_original_price || 0) != 0" class="original-price margin-top-sm">{{propCurrencySymbol}}{{bv.estimate_original_price}}</view>
                        </view>
                    </view>
                </block>
            </block>

            <!-- 商品关联 -->
            <view v-if="((propData.relevant_data || null) != null)">
                <component-goods-list :propData="{title: propData.relevant_data.name, style_type: 2, goods_list: propData.relevant_data.data}" :propLabel="propLabel" :propCurrencySymbol="propCurrencySymbol" :propIsAutoPlay="(propData.config.is_auto_play_relevant || 0) == 1"></component-goods-list>
            </view>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import componentGoodsList from '@/components/goods-list/goods-list';
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
            };
        },
        components: {
            componentGoodsList
        },
        props: {
            propCurrencySymbol: {
                type: String,
                default: app.globalData.currency_symbol()
            },
            propData: {
            	type: [Array,Object],
            	default: []
            },
            propLabel: {
                type: [Array,Object,String],
                default: null
            }
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
    .plugins-binding-list {
        background: linear-gradient(to right, rgb(255 235 220), rgb(241 235 255));
    }
    .plugins-binding-list .left-content {
        width: 65%;
    }
    .plugins-binding-list .right-content {
        width: 35%;
        padding-top: 100rpx;
    }
    .plugins-binding-list .estimate-discount-price .discount-icon {
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