<template>
    <view :class="theme_view">
        <scroll-view :scroll-y="true" class="scroll-box" @scrolltolower="scroll_lower" lower-threshold="60">
            <view v-if="data_list.length > 0" class="data-list padding-horizontal-main padding-top-main">
                <view v-for="(item, index) in data_list" :key="index" class="item padding-main border-radius-main oh bg-white spacing-mb">
                    <view class="base oh br-b padding-bottom-main">
                        <text class="text-size-sm fw-b single-text">{{ item.reward_name || '-' }}</text>
                        <text class="fr text-size-xs" :class="Number(item.status || 0) === 1 ? 'cr-green' : 'cr-red'">{{ item.status_name || '-' }}</text>
                    </view>
                    <view
                        v-if="item.reward_type === 'goods' && (item.lottery_goods_thumb || item.lottery_goods_title) && (item.lottery_goods_url || '').trim()"
                        class="goods-row oh br-b padding-vertical-main margin-top-main cp"
                        hover-class="none"
                        :data-value="(item.lottery_goods_url || '').trim()"
                        @tap="url_event"
                    >
                        <image v-if="item.lottery_goods_thumb" class="goods-thumb" :src="item.lottery_goods_thumb" mode="aspectFill" />
                        <view class="goods-meta oh">
                            <text class="text-size-sm multi-text cr-blue">{{ item.lottery_goods_title || item.reward_name || '-' }}</text>
                        </view>
                    </view>
                    <view
                        v-else-if="item.reward_type === 'goods' && (item.lottery_goods_thumb || item.lottery_goods_title)"
                        class="goods-row oh br-b padding-vertical-main margin-top-main"
                        hover-class="none"
                    >
                        <image v-if="item.lottery_goods_thumb" class="goods-thumb" :src="item.lottery_goods_thumb" mode="aspectFill" />
                        <view class="goods-meta oh">
                            <text class="text-size-sm multi-text">{{ item.lottery_goods_title || item.reward_name || '-' }}</text>
                        </view>
                    </view>
                    <view
                        v-if="item.reward_type === 'coupon' && (item.lottery_coupon_name || item.reward_name)"
                        class="coupon-row oh br-b padding-vertical-main"
                    >
                        <text class="text-size-xs cr-grey">优惠券</text>
                        <text class="text-size-sm cr-blue margin-left-sm">{{ item.lottery_coupon_name || item.reward_name || '-' }}</text>
                    </view>
                    <view class="margin-top">
                        <component-panel-content
                            :propData="item"
                            :propDataField="field_list"
                            propExcludeField="status_name"
                            :propIsTerse="true"
                        ></component-panel-content>
                    </view>
                    <view v-if="item.reward_type === 'goods' && parseInt(item.order_id || 0) > 0" class="use-data br-t margin-top-sm padding-top-sm">
                        <view class="text-size-xs cr-grey">使用数据</view>
                        <view class="text-size-xs margin-top-xs use-order-row">
                            <text class="cr-grey">订单号：</text>
                            <text
                                v-if="(item.lottery_order_detail_url || '').trim()"
                                class="cr-blue cp"
                                :data-value="(item.lottery_order_detail_url || '').trim()"
                                @tap="url_event"
                            >{{ item.lottery_order_no || item.order_id }}</text>
                            <text v-else class="cr-base">{{ item.lottery_order_no || item.order_id }}</text>
                            <text class="fr">
                                <text class="cr-grey">订单ID：</text>
                                <text
                                    v-if="(item.lottery_order_detail_url || '').trim()"
                                    class="cr-blue cp"
                                    :data-value="(item.lottery_order_detail_url || '').trim()"
                                    @tap="url_event"
                                >{{ item.order_id }}</text>
                                <text v-else class="cr-base">{{ item.order_id }}</text>
                            </text>
                        </view>
                    </view>
                    <view v-if="item.reward_type === 'goods' && parseInt(item.status || 0) === 0" class="item-operation tr br-t padding-top-main margin-top-main">
                        <button class="round bg-white cr-main br-main" type="default" size="mini" hover-class="none" @tap="free_buy_event(item)">下单</button>
                    </view>
                </view>
            </view>
            <view v-else>
                <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
            </view>
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
        </scroll-view>

        <component-common ref="common"></component-common>
    </view>
</template>

<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentPanelContent from '@/components/panel-content/panel-content';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';

    export default {
        components: {
            componentCommon,
            componentPanelContent,
            componentNoData,
            componentBottomLine,
        },
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                data_list: [],
                field_list: [],
                data_total: 0,
                data_page_total: 0,
                data_page: 1,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_bottom_line_status: false,
                data_is_loading: 0,
            };
        },
        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 初始化数据
            this.init();
        },
        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }

            // 分享菜单处理
            app.globalData.page_share_handle();
        },
        /**
         * 下拉刷新：重置页码并重新请求列表
         */
        onPullDownRefresh() {
            this.setData({
                data_page: 1,
            });
            this.get_data_list(1);
        },
        methods: {
            // 链接跳转（节点需配置 data-value）
            url_event(e) {
                app.globalData.url_event(e);
            },

            /**
             * 初始化并校验登录
             */
            init() {
                // 校验是否登录
                const user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    this.setData({
                        data_page: 1,
                    });
                    this.get_data_list(1);
                } else {
                    this.setData({
                        data_list_loding_status: 0,
                        data_bottom_line_status: false,
                    });
                }
            },

            /**
             * 拉取中奖记录分页列表（FormModuleData 返回 field_list + data_list）
             * @param {number} is_mandatory 是否强制刷新（1 表示重置分页）
             */
            get_data_list(is_mandatory) {
                if ((is_mandatory || 0) == 0 && this.data_bottom_line_status == true) {
                    uni.stopPullDownRefresh();
                    return false;
                }
                if (this.data_is_loading == 1) {
                    return false;
                }
                this.setData({
                    data_is_loading: 1,
                    data_list_loding_status: 1,
                });
                if (this.data_page > 1) {
                    uni.showLoading({
                        title: this.$t('common.loading_in_text'),
                    });
                }
                uni.request({
                    // 获取请求地址、参数处理
                    url: app.globalData.get_request_url('index', 'record', 'lottery'),
                    method: 'POST',
                    data: {
                        page: this.data_page,
                    },
                    dataType: 'json',
                    success: (res) => {
                        if (this.data_page > 1) {
                            uni.hideLoading();
                        }
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            const data = res.data.data || {};
                            const list = data.data_list || [];
                            let temp_data_list = [];
                            if (this.data_page <= 1) {
                                temp_data_list = list;
                            } else {
                                temp_data_list = this.data_list || [];
                                for (let i in list) {
                                    temp_data_list.push(list[i]);
                                }
                            }
                            this.setData({
                                data_list: temp_data_list,
                                field_list: data.field_list || [],
                                data_total: data.data_total || 0,
                                data_page_total: data.page_total || 0,
                                data_list_loding_status: temp_data_list.length > 0 ? 3 : 0,
                                data_page: this.data_page + 1,
                                data_is_loading: 0,
                            });
                            this.setData({
                                data_bottom_line_status: this.data_list.length > 0 && this.data_page > 1 && this.data_page > this.data_page_total,
                            });
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                                data_is_loading: 0,
                            });
                            // 登录校验
                            if (app.globalData.is_login_check(res.data, this, 'get_data_list')) {
                                // 错误提示
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        if (this.data_page > 1) {
                            uni.hideLoading();
                        }
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_is_loading: 0,
                        });
                        // 错误提示
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            /**
             * 商品中奖：写入 buy 缓存并跳转下单页
             * @param {object} item 列表行
             */
            free_buy_event(item) {
                if ((item || null) == null || (item.id || 0) <= 0) {
                    return;
                }
                uni.request({
                    // 获取请求地址、参数处理
                    url: app.globalData.get_request_url('freebuy', 'record', 'lottery'),
                    method: 'POST',
                    data: {
                        id: item.id,
                    },
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code == 0) {
                            // 打开订单确认页
                            app.globalData.url_open('/pages/buy/buy');
                        } else {
                            // 登录校验
                            if (app.globalData.is_login_check(res.data, this, 'free_buy_event')) {
                                // 错误提示
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        // 错误提示
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            /**
             * 列表滚动到底部，加载下一页
             */
            scroll_lower() {
                this.get_data_list();
            },
        },
    };
</script>

<style scoped>
    .goods-row {
        display: flex;
        align-items: center;
    }
    .goods-thumb {
        width: 92rpx;
        height: 92rpx;
        margin-right: 20rpx;
        border-radius: 12rpx;
        background-color: #f5f5f5;
        flex-shrink: 0;
    }
    .goods-meta {
        flex: 1;
        min-width: 0;
    }
    .multi-text {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        line-height: 1.45;
    }
    .use-order-row {
        line-height: 1.6;
    }
</style>
