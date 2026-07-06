<template>
    <view class="cash-unavailable tc">
        <iconfont name="icon-cash" size="64rpx" propClass="cr-base"></iconfont>
        <view class="cash-unavailable-title fw-b text-size margin-top-lg">{{ unavailable_title }}</view>
        <view class="cash-unavailable-desc cr-grey text-size-sm margin-top-lg">{{ unavailable_desc }}</view>
    </view>
</template>
<script>
    /**
     * 提现不可用提示（展示后端 cash_apply_available 中的标题与说明）
     */
    export default {
        props: {
            // 接口 cash_apply_available 或本地兜底数据
            propCashApplyAvailable: {
                type: Object,
                default: null,
            },
        },
        computed: {
            // 不可用标题
            unavailable_title() {
                var data = this.propCashApplyAvailable || {};
                return data.unavailable_title || '';
            },
            // 不可用说明
            unavailable_desc() {
                var data = this.propCashApplyAvailable || {};
                return data.unavailable_desc || '';
            },
        },
    };
</script>
<style>
    .cash-unavailable {
        padding: 80rpx 40rpx 40rpx;
    }
    .cash-unavailable-desc {
        line-height: 44rpx;
        max-width: 620rpx;
        margin-left: auto;
        margin-right: auto;
    }
</style>
