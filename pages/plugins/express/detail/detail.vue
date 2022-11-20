<template>
    <view>        
        <view v-if="(data || null) != null" class="padding-horizontal-main padding-top-main">
            <view class="padding-main border-radius-main bg-white oh spacing-mb">
                <image class="express-icon fl radius" :src="data.icon" mode="aspectFill"></image>
                <view class="fl margin-left-lg">
                    <view class="cr-base fw-b">{{data.name}}</view>
                    <view class="cr-base margin-top-sm">{{data.number}}</view>
                </view>
            </view>
            <view v-if="(data.msg || null) != null" class="notice-content-blue spacing-mt">{{data.msg}}</view>
            <view v-if="(data.data || null) != null && data.data.length > 0" class="express-data margin-top-xl">
                <block v-for="(item, index) in data.data" :key="index">
                    <view :class="'item padding-main border-radius-main bg-white margin-left-sm br-b br-l br-r pr '+(index == 0 ? 'br-t' : '')">
                        <view :class="'i pa round '+(index == 0 ? 'bg-green' : 'bg-gray')"></view>
                        <view :class="'cr-base '+(index == 0 ? 'fw-b' : '')">{{item.desc}}</view>
                        <view class="cr-grey margin-top-sm">{{item.time}}</view>
                    </view>
                </block>
            </view>
        </view>
        
        <!-- 提示信息 -->
        <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>

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
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_bottom_line_status: false,
                params: null,
                data: null,
                data_status: false
            };
        },

        components: {
            componentNoData,
            componentBottomLine
        },
        props: {},

        onLoad(params) {
            this.setData({
                params: params
            });
        },
        
        onShow() {
            // 数据加载
            this.get_data();

            // 分享菜单处理
            app.globalData.page_share_handle();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.get_data();
        },

        methods: {
            // 初始化
            get_data() {
                if(!this.data_status) {
                    this.setData({
                        data_list_loding_status: 1,
                        data_list_loding_msg: ''
                    });
                }
                uni.showLoading({
                    title: '加载中...'
                });
                // 是否指定方法
                uni.request({
                    url: app.globalData.get_request_url("index", "index", "express"),
                    method: 'POST',
                    data: this.params,
                    dataType: 'json',
                    success: res => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data || null;
                            var status = (data != null && ((data.msg || null) != null || ((data.data || null) != null && data.data.length > 0)));
                            this.setData({
                                data_bottom_line_status: status,
                                data_list_loding_status: status ? 3 : 0,
                                data_list_loding_msg: status ? '' : '暂无物流信息',
                                data_status: status,
                                data: data
                            });
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                                data_list_loding_msg: res.data.msg
                            });
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: '服务器请求出错'
                        });
                        app.globalData.showToast('服务器请求出错');
                    }
                });
            }
        }
    };
</script>
<style>
    @import './detail.css';
</style>