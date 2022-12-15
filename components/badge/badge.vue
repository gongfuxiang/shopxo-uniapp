<template>
    <view>
        <view v-if="propNumber != 0" class="am-badge">
            <view :class="'am-badge-text ' + ((propNumber > 99) ? 'am-badge-text-max' : '')">
                <text>{{(propNumber > 99) ? '99+' : propNumber}}</text>
            </view>
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
            propNumber: {
            	type: [Number,String],
            	default: 0
            }
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
        box-shadow: 0 0 5px rgb(0 0 0 / 60%);
    }
    .am-badge-text-max {
        padding: 1px 2px;
    }
</style>