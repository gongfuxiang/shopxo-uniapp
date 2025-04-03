<template>
    <view :class="theme_view">
        <scroll-view :scroll-y="true" class="scroll-box" @scrolltolower="scroll_lower" lower-threshold="60">
            <view class="page-bottom-fixed">
                <view v-if="data_list.length > 0" class="data-list padding-horizontal-main padding-top-main">
                    <view v-for="(item, index) in data_list" :key="index" class="item padding-main border-radius-main oh bg-white spacing-mb">
                        <view class="content">
                            <view class="single-text margin-top-xs">
                                <text class="cr-grey-9 margin-right-main">{{ $t('giftcard-index.giftcard-index.87ytyh') }}:</text>
                                <text class="cr-black">{{ item.data_type_name }}</text>
                            </view>
                            <view class="single-text margin-top-xs">
                                <text class="cr-grey-9 margin-right-main">{{ $t('giftcard-index.giftcard-index.hfg2fg') }}:</text>
                                <text class="cr-black" data-event="copy" :data-value="item.secret_key" @tap="text_event">{{ item.secret_key }}</text>
                            </view>
                            <view v-if="(item.secret_value_text || null) != null" class="single-text margin-top-xs">
                                <text class="cr-grey-9 margin-right-main">{{ $t('giftcard-index.giftcard-index.fyjnsd') }}:</text>
                                <text class="cr-black am-margin-right-lg">{{ item.secret_value_text }}</text>
                                <text v-if="item.data_type == 0" data-value="/pages/plugins/wallet/user/user" @tap="url_event" class="cr-grey fr">{{ $t('common.view_text') }}</text>
                                <text v-else-if="item.data_type == 1" data-value="/pages/plugins/coupon/user/user" @tap="url_event" class="cr-grey fr">{{ $t('common.view_text') }}</text>
                                <text v-else-if="item.data_type == 2" data-value="/pages/user-integral/user-integral" @tap="url_event" class="cr-grey fr">{{ $t('common.view_text') }}</text>
                            </view>
                            <block v-else>
                                <view class="margin-top-sm fw-b">{{$t('giftcard-index.giftcard-index.fyjnsd')}}</view>
                                <view v-if="(item.secret_value_data || null) != null" class="secret-value-data margin-bottom-sm">
                                    <view v-for="(items, indexs) in item.secret_value_data" :key="indexs" class="oh">
                                        <view class="single-text fl value-title">{{items.title}}</view>
                                        <text :data-value="items.url" @tap="url_event" :class="'fr cr-'+((item.use_data || null) == null ? 'blue' : 'grey')">{{(item.use_data || null) == null ? $t('common.place_order_text') : $t('common.view_text') }}</text>
                                    </view>
                                </view>
                                <view v-else class="cr-grey margin-bottom-sm">{{ $t('common.no_relevant_data_tips') }}</view>
                            </block>
                            <view v-for="(fv, fi) in content_list" :key="fi">
                                <view class="single-text margin-top-xs">
                                    <text class="cr-grey-9 margin-right-main">{{ fv.name }}:</text>
                                    <text class="cr-black">{{ item[fv.field] }}</text>
                                    <text v-if="(fv.unit || null) != null" class="cr-grey">{{ fv.unit }}</text>
                                </view>
                            </view>
                            <view v-if="(item.use_data || null) != null && item.use_data.length > 0">
                                <view class="margin-top-sm fw-b">{{$t('giftcard-index.giftcard-index.6redfg')}}</view>
                                <view v-for="(uv, uk) in item.use_data" :key="uk">
                                    <view>
                                        <text class="cr-grey-9 margin-right-main">{{$t('user-order-detail.user-order-detail.n18sd2')}}:</text>
                                        <text data-event="copy" :data-value="uv.order_no" @tap="text_event">{{uv.order_no}}</text>
                                    </view>
                                    <view>
                                        <text class="cr-grey-9 margin-right-main">{{$t('user-order-detail.user-order-detail.yghjkf')}}:</text>
                                        <text :data-value="uv.goods_url" @tap="url_event">{{uv.goods_title}}</text>
                                    </view>
                                    <view>
                                        <text class="cr-grey-9 margin-right-main">{{$t('common.use_time')}}:</text>
                                        <text>{{uv.use_time}}</text>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>

                    <!-- 结尾 -->
                    <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
                </view>
                <view v-else>
                    <!-- 提示信息 -->
                    <component-no-data :propStatus="data_list_loding_status"></component-no-data>
                </view>

                <!-- 兑换卡密 -->
                <view class="bottom-fixed" :style="bottom_fixed_style">
                    <view class="bottom-line-exclude">
                        <button class="item round cr-main bg-white br-main text-size wh-auto sub-btn" type="default" hover-class="none" data-value="/pages/plugins/giftcard/form/form" @tap="url_event">{{$t('giftcard-index.giftcard-index.8tfgh2')}}</button>
                    </view>
                </view>
            </view>
        </scroll-view>

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
                bottom_fixed_style: '',
                data_base: null,
                data_list: [],
                data_total: 0,
                data_page_total: 0,
                data_page: 1,
                data_list_loding_status: 1,
                data_bottom_line_status: false,
                data_is_loading: 0,
                params: null,
                content_list: [
                    { name: this.$t('giftcard-index.giftcard-index.87yyj3'), field: 'exchange_time' },
                    { name: this.$t('common.add_time'), field: 'add_time' },
                    { name: this.$t('common.upd_time'), field: 'upd_time' },
                ],
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
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

            // 初始化配置
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
            this.setData({
                data_page: 1,
            });
            this.get_data_list(1);
        },

        methods: {
            // 初始化
            init(e) {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    this.setData({
                        data_page: 1,
                    });
                    this.get_data_list(1);
                }
            },

            // 获取数据
            get_data_list(is_mandatory) {
                // 分页是否还有数据
                if ((is_mandatory || 0) == 0) {
                    if (this.data_bottom_line_status == true) {
                        uni.stopPullDownRefresh();
                        return false;
                    }
                }

                // 是否加载中
                if (this.data_is_loading == 1) {
                    return false;
                }
                this.setData({
                    data_is_loading: 1,
                    data_list_loding_status: 1,
                });

                // 加载loding
                if(this.data_page > 1) {
                    uni.showLoading({
                        title: this.$t('common.loading_in_text'),
                    });
                }

                // 获取数据
                uni.request({
                    url: app.globalData.get_request_url('index', 'index', 'giftcard'),
                    method: 'POST',
                    data: {page: this.data_page},
                    dataType: 'json',
                    success: (res) => {
                        if(this.data_page > 1) {
                            uni.hideLoading();
                        }
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            if (res.data.data.data_list.length > 0) {
                                var data = res.data.data;
                                if (this.data_page <= 1) {
                                    var temp_data_list = data.data_list;
                                } else {
                                    var temp_data_list = this.data_list || [];
                                    var temp_data = data.data_list;
                                    for (var i in temp_data) {
                                        temp_data_list.push(temp_data[i]);
                                    }
                                }
                                this.setData({
                                    data_list: temp_data_list,
                                    data_total: data.total,
                                    data_page_total: data.page_total,
                                    data_list_loding_status: 3,
                                    data_page: this.data_page + 1,
                                    data_is_loading: 0,
                                });

                                // 是否还有数据
                                this.setData({
                                    data_bottom_line_status: this.data_list.length > 0 && this.data_page > 1 && this.data_page > this.data_page_total,
                                });
                            } else {
                                this.setData({
                                    data_list_loding_status: 0,
                                    data_bottom_line_status: false,
                                    data_is_loading: 0,
                                });
                            }
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                                data_is_loading: 0,
                            });
                            if (app.globalData.is_login_check(res.data, this, 'get_data_list')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        if(this.data_page > 1) {
                            uni.hideLoading();
                        }
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_is_loading: 0,
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 滚动加载
            scroll_lower(e) {
                this.get_data_list();
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            },

            // 文本事件
            text_event(e) {
                app.globalData.text_event_handle(e);
            }
        },
    };
</script>
<style>
    @import "./index.css";
</style>