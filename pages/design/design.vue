<template>
    <view :class="theme_view">
        <block v-if="(data || null) != null">
            <!-- 搜索 -->
            <block v-if="(data.is_header || 0) == 1">
                <!-- 搜索框 -->
                <view class="padding-main bg-white">
                    <component-search propClass="br" :propPlaceholder="$t('customview.customview.726k7y')"></component-search>
                </view>
            </block>

            <!-- 拖拽模式、引入拖拽数据模块 -->
            <component-layout :propData="layout_data"></component-layout>

            <!-- 结尾 -->
            <block v-if="(data.is_footer || 0) == 1">
                <!-- 结尾 -->
                <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
            </block>
        </block>
        <block v-else>
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </block>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentLayout from "@/pages/design/components/layout/layout";
    import componentSearch from "@/components/search/search";
    import componentNoData from "@/components/no-data/no-data";
    import componentBottomLine from "@/components/bottom-line/bottom-line";
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                data_bottom_line_status: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                load_status: 0,
                params: null,
                data: null,
                layout_data: [],
                // 自定义分享信息
                share_info: {}
            };
        },

        components: {
            componentCommon,
            componentLayout,
            componentSearch,
            componentNoData,
            componentBottomLine
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            this.setData({
                params: app.globalData.launch_params_handle(params),
            });
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 加载数据
            this.get_data();

            // 公共onshow事件
            this.init_common();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.get_data();
        },

        methods: {
            // 初始化公共
            init_common() {
                // 公共onshow事件
                if ((this.$refs.common || null) != null) {
                    this.$refs.common.on_show();
                }
            },

            // 获取数据
            get_data(params = {}) {
                // 还没有数据则读取缓存
                var cache_key = app.globalData.data.cache_design_page_data_key+(this.params.id || 0);
                if (this.load_status == 0) {
                    // 本地缓存数据
                    var upd_data = uni.getStorageSync(cache_key) || null;
                    if (upd_data != null) {
                        // 先使用缓存数据展示
                        this.setData(upd_data);

                        // 已有本地缓存则直接取远程有效数据（默认首次取的是远程缓存数据）
                        params['is_cache'] = 0;

                        // 公共onshow事件
                        this.init_common();
                    }
                } else {
                    // 已有本地缓存则直接取远程有效数据（默认首次取的是远程缓存数据）
                    params['is_cache'] = 0;
                }
                uni.request({
                    url: app.globalData.get_request_url("index", "design"),
                    method: 'POST',
                    data: {...this.params, ...params},
                    dataType: 'json',
                    success: res => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            var upd_data = {
                                data: (data.data || null) != null && data.data.length != 0 ? data.data : null,
                                layout_data: data.layout_data || [],
                                data_list_loding_msg: '',
                                data_list_loding_status: 0,
                                data_bottom_line_status: true
                            };
                            this.setData(upd_data);

                            // 存储缓存
                            uni.setStorageSync(cache_key, upd_data);

                            // 是否需要重新加载数据
                            if (parseInt(data.is_result_data_cache || 0) == 1) {
                                this.get_data({ is_cache: 0 });
                            }

                            if ((this.data || null) != null) {
                                // 基础自定义分享
                                this.setData({
                                    share_info: {
                                        title: this.data.seo_title || this.data.name,
                                        desc: this.data.seo_desc,
                                        path: '/pages/design/design',
                                        query: 'id='+this.data.id,
                                        img: this.data.logo
                                    }
                                });

                                // 标题名称
                                uni.setNavigationBarTitle({
                                    title: this.data.name
                                });

                                // 公共onshow事件
                                this.init_common();
                            }

                            // 分享菜单处理
                            app.globalData.page_share_handle(this.share_info);
                        } else {
                            this.setData({
                                data_bottom_line_status: false,
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg
                            });
                        }

                        // 非首次状态
                        this.setData({
                            load_status: 1
                        });
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_bottom_line_status: false,
                            data_list_loding_status: 2,
                            load_status: 1,
                            data_list_loding_msg: this.$t('common.internet_error_tips')
                        });
                    }
                });
            }
        }
    };
</script>
<style>
</style>