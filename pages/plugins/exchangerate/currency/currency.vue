<template>
    <view :class="theme_view">
        <!-- 货币列表 -->
        <view v-if="data_list.length > 0" class="data-list padding-horizontal-main padding-top-main">
            <block v-for="(item, index) in data_list" :key="index">
                <view :class="'item padding-main border-radius-main bg-white oh pr spacing-mb '+(item.id == data_default.id ? 'br-main' : 'br')" @tap="selected_event" :data-index="index">
                    <image v-if="(item.icon || null) != null" class="icon va-m margin-right" :src="item.icon" mode="aspectFit"></image>
                    <text class="va-m">{{item.name}}</text>
                    <text class="cr-grey fr">{{item.symbol}}</text>
                    <view v-if="item.id == data_default.id" class="checked pa bg-main lh-sm tc padding-top-xs padding-left-xs">
                        <iconfont name="icon-checked" size="32rpx" color="#fff"></iconfont>
                    </view>
                </view>
            </block>
        </view>
        <block v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </block>

        <!-- 结尾 -->
        <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from "@/components/no-data/no-data";
    import componentBottomLine from "@/components/bottom-line/bottom-line";
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                theme_color: app.globalData.get_theme_color(),
                data_bottom_line_status: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_list: [],
                data_default: null,
                data_base: null
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentBottomLine
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 数据加载
            this.init();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }

            // 分享菜单处理
            app.globalData.page_share_handle();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.get_data_list();
        },

        methods: {
            // 获取数据
            init() {
                this.get_data_list();
            },

            // 获取数据
            get_data_list() {
                var self = this;
                if (self.data_list.length <= 0) {
                    self.setData({
                        data_list_loding_status: 1
                    });
                }
                uni.request({
                    url: app.globalData.get_request_url("index", "index", "exchangerate"),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: res => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            var status = (data.data.data || []).length > 0;
                            this.setData({
                                data_base: data.base || null,
                                data_default: data.data.default || null,
                                data_list: data.data.data || [],
                                data_list_loding_msg: '',
                                data_list_loding_status: status ? 3 : 0,
                                data_bottom_line_status: status
                            });
                        } else {
                            self.setData({
                                data_bottom_line_status: false,
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg
                            });
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        self.setData({
                            data_bottom_line_status: false,
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips')
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    }
                });
            },

            // 选择事件
            selected_event(e) {
                // 参数处理
                var index = e.currentTarget.dataset.index;
                var temp_list = this.data_list;
                var data = temp_list[index] || null;
                if (data == null) {
                    app.globalData.showToast(this.$t('extraction-switch.extraction-switch.613b58'));
                    return false;
                }
                
                // id与当前默认一致则不处理
                if (data.id != this.data_default.id) {
                    var self = this;
                    uni.showLoading({
                        title: this.$t('common.processing_in_text')
                    });
                    uni.request({
                        url: app.globalData.get_request_url("setcurrency", "index", "exchangerate"),
                        method: 'POST',
                        data: {
                            "currency": data.id
                        },
                        dataType: 'json',
                        success: res => {
                            uni.hideLoading();
                            if (res.data.code == 0) {
                                app.globalData.showToast(res.data.msg, 'success');
                                self.setData({
                                    data_default: data
                                });
                                
                                // 重新初始化配置
                                app.globalData.init_config();
                                
                                // 返回上一页
                                setTimeout(function() {
                                    uni.navigateBack();
                                }, 1500);
                            } else {
                                app.globalData.showToast(res.data.msg);
                            }
                        },
                        fail: () => {
                            uni.hideLoading();
                            app.globalData.showToast(this.$t('common.internet_error_tips'));
                        }
                    });
                }
            }
        }
    };
</script>
<style>
    @import './currency.css';
</style>