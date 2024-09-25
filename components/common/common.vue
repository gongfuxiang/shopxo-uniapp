<template>
    <view>
        <block v-if="is_tabbar">
            <componentDiyFooter :key="key" :propValue="app_tabber" @footer-height="footer_height_value_event"></componentDiyFooter>
            <view v-if="propIsFooterSeat && footer_height_value > 0" :style="'height:'+footer_height_value+'rpx;'"></view>
        </block>
    </view>
</template>
<script>
    const app = getApp();
    import componentDiyFooter from '@/components/diy/footer';
    export default {
        data() {
            return {
                key: '',
                is_tabbar: false,
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
            // 初始化配置
            this.init_config();
        },
        methods: {
            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {
                    // 初始化数据
                    this.init();
                } else {
                    app.globalData.is_config(this, 'init_config');
                }
            },

            // 初始化
            init() {
                // 初始数据
                var is_tabbar = app.globalData.is_tabbar_pages();
                if(is_tabbar) {
                    this.setData({
                        is_tabbar: is_tabbar,
                        key: Math.random(),
                        app_tabber: app.globalData.get_config('app_tabber'),
                        
                    });
                } else {
                    this.setData({
                        is_tabbar: is_tabbar
                    });
                }
            },

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