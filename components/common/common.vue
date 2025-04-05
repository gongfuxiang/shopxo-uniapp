<template>
    <view :class="theme_view">
        <!-- 底部菜单 -->
        <block v-if="is_tabbar">
            <component-diy-footer :propKey="key" :propValue="app_tabbar" @onFooterHeight="footer_height_value_event"></component-diy-footer>
            <view v-if="propIsFooterSeat && footer_height_value > 0" :style="'height:'+footer_height_value+'rpx;'"></view>
        </block>

        <!-- 弹窗业务 -->
        <component-modal-business ref="modal_business" 
            :propIsGrayscale="propIsGrayscale"
            :propIsFooterSeat="propIsFooterSeat"
            :propIsAppAdmin="propIsAppAdmin"
            :propIsUserBase="propIsUserBase"
            :propIsPopupscreen="propIsPopupscreen"
            :propIsCertificate="propIsCertificate"
        ></component-modal-business>
    </view>
</template>
<script>
    const app = getApp();
    import componentDiyFooter from '@/components/diy-footer/diy-footer';
    import componentModalBusiness from '@/components/modal-business/modal-business';
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                key: '',
                is_tabbar: false,
                app_tabbar: null,
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
            // 是否引入弹屏广告
            propIsPopupscreen: {
                type: Boolean,
                default: true,
            },
            // 是否用户认证提示
            propIsCertificate: {
                type: Boolean,
                default: true,
            },
        },
        components: {
            componentDiyFooter,
            componentModalBusiness
        },
        // 页面被展示
        created: function () {
            // 初始化配置
            this.init_config();
        },
        methods: {
            // 显示响应方法
            on_show(params = {}) {
                //隐藏系统tabbar
                if(app.globalData.data.is_use_native_tabbar != 1) {
                    app.globalData.system_hide_tabbar();
                }

                // 初始化配置
                this.init_config(false, params);

                // 系统底部菜单
                this.footer_init();
            },

            // 初始化配置
            init_config(status = false, params = {}) {
                if ((status || false) == true) {
                    // 初始化数据
                    this.init(params);
                } else {
                    app.globalData.is_config(this, 'init_config', params);
                }
            },

            // 初始化数据
            init(params = {}) {
                // 系统底部菜单
                this.footer_init();

                // 业务弹窗
                if ((this.$refs.modal_business || null) != null) {
                    this.$refs.modal_business.init(params);
                }
            },

            // 底部菜单初始化
            footer_init(status = 0) {
                var is_use_native_tabbar = app.globalData.data.is_use_native_tabbar == 1;
                var upd_data = {
                    is_tabbar: is_use_native_tabbar ? false : app.globalData.is_tabbar_pages()
                };
                if(upd_data['is_tabbar']) {
                    upd_data['key'] = Math.random();
                    upd_data['app_tabbar'] = app.globalData.get_config('app_tabbar') || null;
                }
                this.setData(upd_data);

                // 如果没有菜单数据则读取一次
                if(!is_use_native_tabbar && status == 0 && (upd_data['app_tabbar'] || null) == null) {
                    app.globalData.init_config(0, this, 'footer_init', 1);
                }
            },

            // 底部菜单高度回调事件
            footer_height_value_event(value) {
                this.setData({
                    footer_height_value: (value*2)+20
                });
                this.$emit('onFooterHeight', value);

                // 存储底部菜单高度
                app.globalData.app_system_tabbar_height_save(value);
            }
        }
    };
</script>
<style scoped>
</style>