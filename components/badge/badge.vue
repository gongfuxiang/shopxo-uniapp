<template>
    <view v-if="propNumber > 0" class="am-badge">
        <view :class="'am-badge-text ' + ((propNumber > 99) ? 'am-badge-text-max' : '')">
            <text>{{(propNumber > 99) ? '99+' : propNumber}}</text>
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
            propNumber: Number
        },
        methods: {}
    };
</script>
<style>
    .am-badge {
        display: inline-block;
        position: relative;
        vertical-align: middle;
    }
    .am-badge-text {
        display: inline-block;
        position: absolute;
        right: 0;
        transform: translate(50%, -50%);
        top: 0px;
        min-width: 16px;
        padding: 0;
        height: 16px;
        line-height: 16px;
        text-align: center;
        background-color: #FF3B30;
        border-radius: 16px;
        color: #fff;
        font-size: 10px;
        padding: 1px 1px;
    }
    .am-badge-text-max {
        padding: 1px 2px;
    }
</style>