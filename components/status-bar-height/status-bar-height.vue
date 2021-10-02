<template>
    <view>
        <view :style="{ height: statusBarHeight }" class="status-bar-height"></view>
    </view>
</template>
<script>
    export default {
        data() {
            return {
                statusBarHeight: 20
            };
        },
        components: {},
        props: {},
        mounted() {
        	this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 'px';
        },
        methods: {}
    };
</script>
<style>
    .status-bar-height {
    	height: 20px;
    }
</style>