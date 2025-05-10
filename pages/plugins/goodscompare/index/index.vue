<template>
    <view :class="theme_view">
        <view v-if="data_list_loding_status == 3" class="table-container wh-auto oh">
            <scroll-view :scroll-x="true" class="scroll-view-horizontal">
                <view class="table-header">
                    <view class="dis-inline-block">
                        <view class="padding-sm padding-bottom dis-inline-block sticky">
                            <view class="head single-text">
                                <view class="margin-top-xxxxl padding-top-xxxxl">
                                    <checkbox-group @change="highlight_event">
                                        <label>
                                            <checkbox value="1" style="transform:scale(0.7)" />
                                            <text class="va-m">高亮不同项</text>
                                        </label>
                                    </checkbox-group>
                                </view>
                                <view class="margin-top">
                                    <checkbox-group @change="identical_event">
                                        <label>
                                            <checkbox value="1" style="transform:scale(0.7)" />
                                            <text class="va-m">隐藏相同项</text>
                                        </label>
                                    </checkbox-group>
                                </view>
                            </view>
                        </view>
                        <block v-for="(item, index) in data.goods" :key="index">
                            <view class="goods-info padding-sm br-l dis-inline-block padding-bottom">
                                <image class="goods-image radius" :src="item.images" mode="aspectFit" :data-value="item.goods_url" @tap="url_event"></image>
                                <view class="goods-title multi-text cp" :data-value="item.goods_url" @tap="url_event">{{item.title}}</view>
                                <view class="sales-price margin-top-sm">{{item.show_price_symbol}}{{item.price}}{{item.show_price_unit}}</view>
                            </view>
                        </block>
                    </view>
                </view>
                <block v-for="(item, index) in data.head" :key="index">
                    <view class="table-body">
                        <view class="dis-inline-block">
                            <view class="group padding-sm br-t dis-inline-block sticky">
                                <view class="head single-text fw-b">{{item.name}}</view>
                            </view>
                            <block v-for="(gv, gk) in data.goods" :key="gk">
                                <view class="group padding-sm br-t br-l dis-inline-block">
                                    <view class="content single-text"></view>
                                </view>
                            </block>
                        </view>
                    </view>
                    <block v-for="(items, indexs) in item.data" :key="indexs">
                        <view v-if="identical_data[item.key+indexs] != true" class="table-body">
                            <view class="dis-inline-block">
                                <view class="padding-sm br-t dis-inline-block sticky">
                                    <view class="head single-text" :class="indexs">{{items}}</view>
                                </view>
                                <block v-for="(gv, gk) in data.goods" :key="gk">
                                    <view class="padding-sm br-t br-l dis-inline-block" :class="(highlight_data[item.key+indexs] == true ? ' highlight' : '')">
                                        <view v-if="item.key == 'specifications' || item.key == 'parameters'" class="content single-text" :class="indexs">
                                            <text v-if="(gv[item.key] || null) != null && (gv[item.key][indexs] || null)">{{gv[item.key][indexs]}}</text>
                                            <text v-else class="cr-grey-d">-</text>
                                        </view>
                                        <block v-else>
                                            <view v-if="indexs == 'goods_score'" class="content single-text" :class="indexs">
                                                <block v-if="(gv[indexs] || null) != null && gv[indexs]['score'] != undefined">
                                                    <view>
                                                        <text class="cr-grey text-size-xs">好评度</text>
                                                        <text class="cr-red">
                                                            <text class="text-size-lg fw-b">{{gv[indexs]['score']}}</text>
                                                            <text>%</text>
                                                            <text v-if="gv[indexs]['avg'] != undefined" class="text-size-xs margin-left-lg">
                                                                <text class="cr-grey">评分</text>
                                                                <text>{{gv[indexs]['avg']}}</text>
                                                            </text>
                                                        </text>
                                                    </view>
                                                    <view v-if="gv[indexs]['count'] != undefined" class="text-size-xs">
                                                        <text class="cr-grey">累计评价</text>
                                                        <text class="fw-b">{{gv[indexs]['count']}}</text>
                                                        <text class="cr-grey">条</text>
                                                    </view>
                                                </block>
                                            </view>
                                            <view v-else-if="indexs == 'give_integral'" class="content single-text" :class="indexs">
                                                <text class="cr-grey text-size-xs">售价</text>
                                                <text>{{gv[indexs]}}%比例</text>
                                            </view>
                                            <view v-else-if="indexs == 'inventory'" class="content single-text" :class="indexs">{{gv[indexs]}}{{gv['inventory_unit']}}</view>
                                            <view v-else class="content single-text" :class="indexs">{{gv[indexs]}}</view>
                                        </block>
                                    </view>
                                </block>
                            </view>
                        </view>
                    </block>
                </block>
            </scroll-view>
        </view>
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
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_bottom_line_status: false,
                params: null,
                data: {},
                highlight_data: {},
                identical_data: {},
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

            // 设置参数
            this.setData({
                params: app.globalData.launch_params_handle(params),
            });

            // 获取数据
            this.get_data()
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.get_data();
        },

        methods: {
            // 获取数据
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url('index', 'index', 'goodscompare'),
                    method: 'POST',
                    data: this.params,
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            this.setData({
                                data_bottom_line_status: true,
                                data_list_loding_msg: '',
                                data_list_loding_status: 3,
                                data: res.data.data || {},
                            });
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                                data_list_loding_msg: res.data.msg,
                            });
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                            data_list_loding_status: 2,
                        });
                    },
                });
            },

            // 高亮不同项
            highlight_event(e) {
                var highlight_data = {};
                if(e.detail.value.length > 0) {
                    var temp_data = this.data;
                    for(var i in temp_data.head) {
                        if(temp_data.head[i]['key'] == 'specifications' || temp_data.head[i]['key'] == 'parameters') {
                            for(var x in temp_data.head[i]['data']) {
                                var status = false;
                                var temp = [];
                                for(var g in temp_data.goods) {
                                    var value = temp_data.goods[g][temp_data.head[i]['key']][x];
                                    if(temp.length > 0) {
                                        if(temp.indexOf(value) == -1)
                                        {
                                            status = true;
                                        }
                                    }
                                    temp.push(value);
                                }
                                highlight_data[temp_data.head[i]['key']+x] = status;
                            }
                        }
                    }
                }
                this.setData({
                    highlight_data: highlight_data
                });
            },

            // 隐藏相同项
            identical_event(e) {
                var identical_data = {};
                if(e.detail.value.length > 0) {
                    var temp_data = this.data;
                    for(var i in temp_data.head) {
                        if(temp_data.head[i]['key'] == 'specifications' || temp_data.head[i]['key'] == 'parameters') {
                            for(var x in temp_data.head[i]['data']) {
                                var status = true;
                                var temp = [];
                                for(var g in temp_data.goods) {
                                    var value = temp_data.goods[g][temp_data.head[i]['key']][x];
                                    if(temp.length > 0) {
                                        if(temp.indexOf(value) == -1)
                                        {
                                            status = false;
                                        }
                                    }
                                    temp.push(value);
                                }
                                identical_data[temp_data.head[i]['key']+x] = status;
                            }
                        }
                    }
                }
                this.setData({
                    identical_data: identical_data
                });
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            }
        },
    };
</script>
<style>
    @import './index.css';
</style>