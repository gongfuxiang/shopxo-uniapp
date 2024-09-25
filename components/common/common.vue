<template>
    <view>
        <componentDiyFooter :key="key" :propValue="app_tabber" @footer-height="footer_height_value_event"></componentDiyFooter>
        <view v-if="propIsFooterSeat && footer_height_value > 0" :style="'height:'+footer_height_value+'rpx;'"></view>
    </view>
</template>
<script>
    const app = getApp();
    import componentDiyFooter from '@/components/diy/footer';
    export default {
        data() {
            return {
                key: '',
                app_tabber: null,
                footer_height_value: 0,
            };
        },
        props: {
            propIsFooterSeat: {
                type: Boolean,
                default: true,
            }
        },
        components: {
            componentDiyFooter
        },
        // 页面被展示
        created: function () {
            this.setData({
                key: Math.random(),
                app_tabber: app.globalData.get_config('app_tabber')
            });
        },
        
        methods: {
            // 底部菜单高度
            footer_height_value_event(value) {  
                this.setData({
                    footer_height_value: value*2
                });
                this.$emit('footer-height', value);
            }
        }
    };
</script>
<style scoped>
</style>