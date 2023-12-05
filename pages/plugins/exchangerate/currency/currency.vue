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
        <view v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </view>

        <!-- 结尾 -->
        <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
    </view>
</template>
<script>
    const app = getApp();
    import componentNoData from "../../../../components/no-data/no-data";
    import componentBottomLine from "../../../../components/bottom-line/bottom-line";
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
            componentNoData,
            componentBottomLine
        },
        props: {},

        onShow() {
            // 数据加载
            this.init();

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
                uni.showLoading({
                    title: '加载中...'
                });
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
                        uni.hideLoading();
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
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        self.setData({
                            data_bottom_line_status: false,
                            data_list_loding_status: 2,
                            data_list_loding_msg: '网络开小差了哦~'
                        });
                        app.globalData.showToast('网络开小差了哦~');
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
                    app.globalData.showToast('数据有误');
                    return false;
                }
                
                // id与当前默认一致则不处理
                if (data.id != this.data_default.id) {
                    var self = this;
                    uni.showLoading({
                        title: '处理中...'
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
                            app.globalData.showToast('网络开小差了哦~');
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