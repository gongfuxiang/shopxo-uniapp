<template>
    <view>
        <view v-if="(propStatus || false)" class="data-bottom-line">
            <view class="left"></view>
            <view class="msg">{{propMsg || '我是有底线的'}}</view>
            <view class="right"></view>
        </view>
    </view>
</template>
<script>
    export default {
        data() {
            return {};
        },
        components: {},
        props: {
            propStatus: Boolean,
            propMsg: String
        },
        methods: {}
    };
</script>
<style>
    .data-bottom-line {
        padding: 40rpx;
        overflow: hidden;
    }
    .data-bottom-line view {
        width: 33.3%;
    }
    .data-bottom-line .left,
    .data-bottom-line .right {
        margin-top: 8px;
        border-bottom: 1px solid #e1e1e1;
    }
    .data-bottom-line .msg {
        color: #999;
        text-align: center;
        font-size: 24rpx;
    }
    .data-bottom-line .left,
    .data-bottom-line .msg {
        float: left;
    }
    .data-bottom-line .right {
        float: right;
    }
</style>