<template>
    <view>
        <componentDiyFooter :key="key" :footerActiveIndex="footer_active_index" :value="app_tabber" @footer-height="footer_height_value_event" @footer-tap="footer_tap_event"></componentDiyFooter>
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
                footer_active_index: 0,
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
            },
            
            // 底部导航菜单
            footer_tap_event(index, data) {
                this.setData({
                    footer_active_index: index
                });
                console.log(index, data);
            },
        }
    };
</script>
<style scoped>
</style>