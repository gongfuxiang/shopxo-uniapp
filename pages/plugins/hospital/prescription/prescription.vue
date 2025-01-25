<template>
    <view :class="theme_view">
        hello
        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import base64 from '@/common/js/lib/base64.js';
    import componentCommon from '@/components/common/common';
    import componentPopup from '@/components/popup/popup';
    import componentNoData from '@/components/no-data/no-data';

    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                buy_submit_disabled_status: false,
                params: null,
            };
        },

        components: {
            componentCommon,
            componentPopup,
            componentNoData
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            // params.data 参数 urlencode(base64_encode(json字符串))
            // buy_type 下单类型（goods 立即购买、cart 购物车）
            // goods_data 下单商品urlencode(base64_encode(json字符串[{goods_id,stock,spec}]))
            // params['data'] = '{"buy_type":"goods","goods_data":"W3siZ29vZHNfaWQiOiI5Iiwic3RvY2siOjEsInNwZWMiOlt7InR5cGUiOiLpopzoibIiLCJ2YWx1ZSI6IueyieiJsiJ9LHsidHlwZSI6IuWwuueggSIsInZhbHVlIjoiTCJ9XX1"}';
            // ids 购物车主键ids
            if ((params.data || null) != null) {
                params = JSON.parse(base64.decode(decodeURIComponent(params.data)));
                this.setData({
                    params: params,
                });
            }
            
            console.log(this.params);
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 数据加载
            this.init();

            // 初始化配置
            this.init_config();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }

            // 分享菜单处理
            app.globalData.page_share_handle();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.init();
        },

        methods: {
            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {
                    this.setData({
                        currency_symbol: app.globalData.get_config('currency_symbol'),
                    });
                } else {
                    app.globalData.is_config(this, 'init_config');
                }
            },

            // 获取数据
            init() {
                uni.request({
                    url: app.globalData.get_request_url('index', 'buy'),
                    method: 'POST',
                    data: this.params,
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            console.log(data)
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                                data_list_loding_msg: res.data.msg,
                            });
                            if (app.globalData.is_login_check(res.data, this, 'init')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },
        }
    };
</script>
<style>
    
</style>