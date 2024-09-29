<template>
    <view>
        <!-- 底部菜单 -->
        <block v-if="is_tabbar">
            <component-diy-footer :key="key" :propValue="app_tabber" @footer-height="footer_height_value_event"></component-diy-footer>
            <view v-if="propIsFooterSeat && footer_height_value > 0" :style="'height:'+footer_height_value+'rpx;'"></view>
        </block>

        <!-- app管理 -->
        <component-app-admin ref="app_admin"></component-app-admin>

        <!-- 用户基础 -->
        <component-user-base ref="user_base" :propIsGrayscale="propIsGrayscale"></component-user-base>
    </view>
</template>
<script>
    const app = getApp();
    import componentDiyFooter from '@/components/diy/footer';
    import componentAppAdmin from '@/components/app-admin/app-admin';
    import componentUserBase from '@/components/user-base/user-base';
    export default {
        data() {
            return {
                key: '',
                load_status: 0,
                is_tabbar: false,
                app_tabber: null,
                footer_height_value: 0,
            };
        },
        props: {
            // 是否灰度
            propIsGrayscale: {
                type: Boolean,
                default: false,
            },
            // 是否显示底部菜单占位
            propIsFooterSeat: {
                type: Boolean,
                default: true,
            },
            // 是否引入app管理
            propIsAppAdmin: {
                type: Boolean,
                default: true,
            },
            // 是否引入用户基础信息提示
            propIsUserBase: {
                type: Boolean,
                default: true,
            },
        },
        components: {
            componentDiyFooter,
            componentAppAdmin,
            componentUserBase
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
                // 首次则调用实际的接口再回调
                if(this.load_status == 0) {
                    app.globalData.init_config_back(this, 'init');
                }

                // 初始数据
                var is_tabbar = app.globalData.is_tabbar_pages();
                var upd_data = {
                    is_tabbar: is_tabbar,
                    load_status: 1,
                }
                if(is_tabbar) {
                    upd_data['key'] = Math.random();
                    upd_data['app_tabber'] = app.globalData.get_config('app_tabber');
                }
                this.setData(upd_data);
            },

            // 显示响应方法
            on_show() {
                // app管理
                if (this.propIsAppAdmin && (this.$refs.app_admin || null) != null) {
                    this.$refs.app_admin.init();
                }

                // 用户头像和昵称设置提示
                if (this.propIsUserBase && (this.$refs.user_base || null) != null) {
                    this.$refs.user_base.init();
                }
            },

            // 底部菜单高度
            footer_height_value_event(value) {  
                this.setData({
                    footer_height_value: (value*2)+20
                });
                this.$emit('footer-height', value);

                // 存储底部菜单高度
                app.globalData.app_tabbar_height_save(value);
            }
        }
    };
</script>
<style scoped>
</style>