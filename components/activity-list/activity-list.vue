<template>
    <view>
        <view v-if="(propConfig || null) != null && (propData || null) != null && propData.length > 0">
            <block v-for="(floor, index) in propData" :key="index">
                <block v-if="floor.goods_list.length > 0 && floor.home_data_location == propLocation">
                    <component-goods-list :propData="floor" propMoreUrlKey="url" :propLabel="propLabel" :propIsAutoPlay="(propConfig.is_home_auto_play || 0) == 1" :propCurrencySymbol="propCurrencySymbol"></component-goods-list>
                </block>
            </block>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import componentGoodsList from "../goods-list/goods-list";

    export default {
        data() {
            return {};
        },
        components: {
            componentGoodsList
        },
        props: {
            propCurrencySymbol: {
                type: String,
                default: app.globalData.data.currency_symbol
            },
            propLocation: {
            	type: [String,Number],
            	default: 0
            },
            propConfig: {
            	type: [String,Object],
            	default: null
            },
            propData: {
            	type: Array,
            	default: []
            },
            propLabel: {
                type: [Array,Object,String],
                default: null
            }
        },
        methods: {}
    };
</script>
<style>
</style>