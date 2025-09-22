<template>
    <view :class="theme_view">
        <block v-if="(data || null) != null && (data.config || null) != null">
            <!-- diy模块 -->
            <component-form-input :propValue="data" :propDataFormId="data.id" :propKey="random_value" propIsMask @onLocationBack="user_back_choice_location">
                <!-- 底部内容 -->
                <template slot="diy-bottom-content">
                    <!-- 结尾 -->
                    <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
                </template>
                <!-- 底部公共 -->
                <template slot="diy-bottom-common">
                    <component-common ref="common"></component-common>
                </template>
            </component-form-input>
        </block>
        <block v-else>
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </block>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentFormInput from '@/pages/form-input/components/form-input/form-input';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    export default {
        components: {
            componentCommon,
            componentFormInput,
            componentNoData,
            componentBottomLine,
        },
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                data_bottom_line_status: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                load_status: 0,
                params: null,
                data: null,
                // 自定义分享信息
                share_info: {},
                // 增加随机数，避免无法监听数据列表内部数据更新
                random_value: 0,
            };
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

             // 设置参数
            this.setData({
                params: app.globalData.launch_params_handle(params),
            });
            this.init();
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 公共onshow事件
            this.init_common();

            // 设置顶部导航的默认颜色
            this.set_navigation_bar_color();        
        },
        methods: {
            // 初始化
            init() {
                const this_ = this;
                window.addEventListener('message', function(event) {
                    this_.setData({
                        data: event.data || null,
                        data_list_loding_msg: '',
                        data_list_loding_status: 0,
                        data_bottom_line_status: true,
                        random_value: Math.random(),
                    });
                });
            },
            // 初始化公共
            init_common() {
                // 公共onshow事件
                if ((this.$refs.common || null) != null) {
                    this.$refs.common.on_show();
                }
            },

            // 状态栏设置
            set_navigation_bar_color() {
                app.globalData.set_navigation_bar_color(parseInt(app.globalData.get_key_data(this.data, 'config.header.com_data.style.function_buttons_type', 0)) == 1);
            },
        },
    };
</script>
<style scoped lang="scss">
</style>
