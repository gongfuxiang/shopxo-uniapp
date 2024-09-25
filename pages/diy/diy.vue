<template>
    <view :class="theme_view">
        <view v-if="(data || null) != null">
            <!-- diy模块 -->
            <componentDiy :value="data.config" :propDataId="data.id"></componentDiy>

            <!-- 结尾 -->
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
        </view>
        <view v-else>
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import componentDiy from '@/components/diy/diy';
    import componentNoData from "@/components/no-data/no-data";
    import componentBottomLine from "@/components/bottom-line/bottom-line";
    export default {
        components: {
            componentDiy,
            componentNoData,
            componentBottomLine
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
                share_info: {}
            };
        },
        
        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);
        
            // 设置参数
            this.setData({
                params: params
            });
        },
        
        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();
        
            // 加载数据
            this.get_data();
        },
        
        // 下拉刷新
        onPullDownRefresh() {
            this.get_data();
        },

        methods: {
            // 获取数据
            get_data(params = {}) {
                // 还没有数据则读取缓存
                var cache_key = app.globalData.data.cache_diy_page_data_key+(this.params.id || 0);
                if (this.load_status == 0) {
                    // 本地缓存数据
                    var upd_data = uni.getStorageSync(cache_key) || null;
                    if (upd_data != null) {
                        // 先使用缓存数据展示
                        this.setData(upd_data);

                        // 已有本地缓存则直接取远程有效数据（默认首次取的是远程缓存数据）
                        params['is_cache'] = 0;
                    }
                }
                uni.request({
                    url: app.globalData.get_request_url("index", "diy"),
                    method: 'POST',
                    data: {...this.params, ...params},
                    dataType: 'json',
                    success: res => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var upd_data = {
                                data: res.data.data.data || null,
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
                                        title: this.data.name,
                                        desc: this.data.describe,
                                        path: '/pages/diy/diy',
                                        query: 'id='+this.data.id,
                                        img: this.data.logo
                                    }
                                });
            
                                // 标题名称
                                uni.setNavigationBarTitle({
                                    title: this.data.name
                                });
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
        },
    };
</script>
<style></style>