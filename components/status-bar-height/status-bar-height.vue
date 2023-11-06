<template>
    <view :class="theme_view">
        <view :style="{ height: statusBarHeight }" class="status-bar-height"></view>
    </view>
</template>
<script>
    const app = getApp();
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
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