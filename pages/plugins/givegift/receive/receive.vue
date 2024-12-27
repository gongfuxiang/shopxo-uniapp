<template>
    <view :class="theme_view">
        <view v-if="(data || null) != null" class="page-bottom-fixed">
            <form @submit="form_submit">
                <image :src="data.goods.images" mode="widthFix" class="wh-auto dis-block"></image>
                <view class="padding-main">
                    <view class="bg-white padding-main border-radius-main">
                        <view class="fw-b text-size multi-text lh-xl margin-bottom">{{data.goods.title}}</view>
                        <view class="pr">
                            <view v-if="(data.goods.show_field_price_status || 0) == 1" class="margin-bottom-xs">
                                <text class="price cr-price">{{data.goods.show_price_symbol}}</text>
                                <text class="sales-price text-size-lg">{{data.goods.price}}</text>
                                <text v-if="(data.goods.show_price_unit || null) != null" class="cr-grey text-size-xs">{{data.goods.show_price_unit}}</text>
                            </view>
                            <view v-if="(data.goods.show_field_original_price_status || 0) == 1" class="original-price">
                                <text class="text-size-xs">{{data.goods.show_original_price_symbol}}</text>
                                <text class="text-size">{{data.goods.original_price}}</text>
                                <text v-if="(data.goods.show_original_price_unit || null) != null" class="text-size-xs">{{data.goods.show_original_price_unit}}</text>
                            </view>
                            <view class="pa top-0 right-0" @tap="share_event">
                                <iconfont name="icon-share-square" size="34rpx" color="#999"></iconfont>
                            </view>
                        </view>
                        <view class="margin-top-xl margin-bottom-lg">
                            <image :src="data.user.avatar" mode="aspectFit" class="va-m user-avatar"></image>
                            <text class="text-size-sm cr-grey va-m margin-left-sm">{{ data.title }}</text>
                        </view>
                        <view v-if="(data.desc || null) != null" class="margin-top-lg cr-red">{{data.desc}}</view>
                        <view class="margin-top-xxl padding-bottom-sm">
                            <input type="text" class="br round padding-horizontal lh-xxl ht-xxl" placeholder-class="cr-grey-c" :placeholder="$t('givegift-gift.givegift-gift.34rrr3')" name="user_message" />
                        </view>
                    </view>
                </view>
                <view class="bottom-fixed" :style="bottom_fixed_style">
                    <view class="bottom-line-exclude">
                        <button type="default" form-type="submit" class="item bg-main br-main cr-white text-size round wh-auto">{{$t('common.my_want_receive')}}</button>
                    </view>
                </view>
            </form>
        </view>
        <view v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </view>

        <!-- 分享弹窗 -->
        <component-share-popup ref="share"></component-share-popup>

        <!-- 规格选择 -->
        <component-goods-spec-choice ref="goods_spec_choice" v-on:specConfirmEvent="spec_confirm_event"></component-goods-spec-choice>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import base64 from '@/common/js/lib/base64.js';
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentGoodsSpecChoice from '@/components/goods-spec-choice/goods-spec-choice';
    import componentSharePopup from '@/components/share-popup/share-popup';
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                data_bottom_line_status: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                bottom_fixed_style: '',
                params: {},
                data: null,
                form_data: {},
                // 自定义分享信息
                share_info: {}
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentGoodsSpecChoice,
            componentSharePopup
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

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }

            // 加载数据
            this.get_data();

            // 分享菜单处理
            app.globalData.page_share_handle();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.get_data();
        },

        methods: {
            // 获取数据
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url('receive', 'gift', 'givegift'),
                    method: 'POST',
                    data: this.params,
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            this.setData({
                                data: res.data.data || null,
                                data_list_loding_msg: '',
                                data_list_loding_status: 0,
                                data_bottom_line_status: false,
                            });
                            if (this.data != null) {
                                // 基础自定义分享
                                this.setData({
                                    share_info: {
                                        title: this.data.title || this.data.desc,
                                        desc: this.data.desc,
                                        path: '/pages/plugins/givegift/receive/receive',
                                        query: app.globalData.json_to_url_params(this.params),
                                        img: (this.data.goods || null) != null ? this.data.goods.images : ''
                                    },
                                });
                                // 标题
                                uni.setNavigationBarTitle({ title: this.data.title });
                            }
                        } else {
                            this.setData({
                                data_bottom_line_status: false,
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg,
                            });
                            if (app.globalData.is_login_check(res.data, this, 'get_data')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_bottom_line_status: false,
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                    },
                });
            },

            // 数据提交
            form_submit(e) {
                // 是否登录
                var user = app.globalData.get_user_info(this, 'form_submit', e);
                if(user !== false) {
                    // 设置表单数据
                    this.setData({
                        form_data: e.detail.value || {}
                    });

                    // 是否多规格
                    var goods = this.data.goods;
                    if(goods.is_exist_many_spec == 1) {
                        if ((this.$refs.goods_spec_choice || null) != null) {
                            this.$refs.goods_spec_choice.init(goods.id, goods['specifications']['choose'], goods.buy_min_number);
                        }
                    } else {
                        this.buy_handle();
                    }
                }
            },

            // 规格确认回调事件
            spec_confirm_event(value) {
                this.buy_handle(value.spec);
            },

            // 购买处理
            buy_handle(spec = '') {
                var data = {
                    buy_type: 'goods',
                    goods_data: encodeURIComponent(
                        base64.encode(
                            JSON.stringify([
                                {
                                    goods_id: this.data.goods.id,
                                    stock: 1,
                                    spec: spec,
                                    plugins_givegift_value: this.data.code || this.data.key,
                                    plugins_givegift_type: (this.data.code || null) == null ? 'key' : 'code',
                                    plugins_givegift_user_message: this.form_data.user_message
                                },
                            ])
                        )
                    )
                };
                app.globalData.url_open('/pages/buy/buy?data=' + encodeURIComponent(base64.encode(JSON.stringify(data))));
            },

            // 分享开启弹层
            share_event(e) {
                if ((this.$refs.share || null) != null) {
                    this.$refs.share.init({
                        status: true,
                        share_info: this.share_info
                    });
                }
            }
        }
    };
</script>
<style scoped>
    @import './receive.css';
</style>
