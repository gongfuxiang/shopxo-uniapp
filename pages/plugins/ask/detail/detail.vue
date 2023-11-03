<template>
    <view>
        <view v-if="(data || null) !== null" class="page-bottom-fixed">
            <!-- true为空对象 false为非空对象 Object.keys(data).length == 0 -->
            <view class="ask-container bg-white spacing-mb">
                <view class="padding-main">
                    <view class="fw-b text-size-xl spacing-mb">{{ data.title }}</view>
                    <view class="cr-grey-9 text-size-xs margin-bottom-sm flex-row">
                        留言时间: {{ data.add_time_date }}
                        <view class="fw-b padding-horizontal-xs">·</view>
                        {{ data.access_count || '0' }}浏览
                    </view>
                    <view v-if="data.title != data.content" class="text-size-md">{{ data.content }}</view>
                    <block v-if="(data.goods_data || null) !== null">
                        <navigator :url="data.goods_data.goods_url" hover-class="none">
                            <view class="goods-link spacing-mt bg-grey-f9 padding-main border-radius-sm">
                                <view class="flex-row jc-sb">
                                    <view class="img border-radius-sm oh margin-right-main">
                                        <image :src="data.goods_data.images" mode="widthFix" class="wh-auto"></image>
                                    </view>
                                    <view class="flex-1 flex-width flex-row jc-sb align-c">
                                        <view class="flex-1 flex-width padding-right-sm">
                                            <view class="title multi-text">{{ data.goods_data.title }}</view>
                                            <view class="flex-row align-c margin-top-xs">
                                                <text class="cr-red fw-b margin-right-main">{{ currency_symbol }}{{ data.goods_data.price }}</text>
                                                <text class="text-size-xs cr-grey-9 original-price">{{ currency_symbol }}{{ data.goods_data.original_price }}</text>
                                            </view>
                                        </view>
                                        <iconfont name="icon-qiandao-jiantou2" color="#999"></iconfont>
                                    </view>
                                </view>
                            </view>
                        </navigator>
                    </block>
                </view>
                <view v-if="data.is_reply && data.is_reply === '1'" class="padding-main br-t-dashed">
                    <view class="flex-row jc-sb align-c">
                        <view class="flex-row align-c">
                            <image v-if="(logo_square || null) != null" :src="logo_square" mode="widthFix" class="admin-img circle br-f5 margin-right-sm"></image>
                            <text>管理员回复</text>
                        </view>
                        <view v-if="(data.reply_time_date || null) != null" class="cr-grey-9 text-size-xs">回复时间: {{ data.reply_time_date }}</view>
                    </view>
                    <view class="text-size-md padding-top-main">{{ data.reply }}</view>
                </view>
                <view class="padding-main br-t-dashed">
                    <!-- 评论内容 -->
                    <component-ask-comments :propData="data" :propDataBase="data_base" :propEmojiList="emoji_list"></component-ask-comments>
                </view>
            </view>
            <!-- 猜你喜欢 -->
            <view v-if="goods_list.length > 0" class="padding-horizontal-main padding-top-sm">
                <view class="tc spacing-mb">
                    <view class="guess-like fw-b text-size-md">猜你喜欢</view>
                </view>
                <component-goods-list :propData="{ style_type: 1, goods_list: goods_list, random: random_value }" :propLabel="plugins_label_data" :propCurrencySymbol="currency_symbol" :propIsCartParaCurve="true" propSource="detail" @CartSuccessEvent="cart_success_event"></component-goods-list>
                <!-- 结尾 -->
                <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
            </view>
            <view class="bottom-fixed ask-btn-content">
                <view class="flex-row jc-sa align-c text-size fw-b bottom-line-exclude">
                    <navigator url="/pages/plugins/ask/form/form" hover-class="none" class="flex-1 tc flex-col jc-c align-c">
                        <view class="divider-r-d wh-auto">
                            <iconfont name="icon-wenda-wytw" size="30rpx" color="#333" class="margin-right-sm"></iconfont>
                            我要提问
                        </view>
                    </navigator>
                    <navigator url="/pages/plugins/ask/user-list/user-list" hover-class="none" class="flex-1 tc flex-col jc-c align-c">
                        <view class="wh-auto">
                            <iconfont name="icon-wenda-wdtw" size="32rpx" color="#333" class="margin-right-sm pr top-xs"></iconfont>
                            我的提问
                        </view>
                    </navigator>
                </view>
            </view>
        </view>
        <view v-else>
            <component-no-data :propStatus="data_list_loding_status"></component-no-data>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    import componentGoodsList from '@/components/goods-list/goods-list';
    import componentAskComments from '@/components/ask-comments/ask-comments';

    export default {
        data() {
            return {
                logo_square: app.globalData.get_application_logo_square(),
                data_list_loding_status: 1,
                data_bottom_line_status: true,
                data: null,
                data_base: null,
                emoji_list: [],
                // 基础配置
                currency_symbol: app.globalData.data.currency_symbol,
                // 猜你喜欢 参数
                goods_list: [],
                goods_is_loading: 0,
                goods_total: 0,
                goods_page_total: 0,
                goods_page: 1,
                // 标签插件
                plugins_label_data: null,
                // 增加随机数，避免无法监听数据列表内部数据更新
                random_value: 0,
                params: '',
            };
        },

        components: {
            componentNoData,
            componentBottomLine,
            componentGoodsList,
            componentAskComments,
        },
        props: {},

        onLoad(params) {
            if (params) {
                this.setData({
                    params: params.id,
                });
            }
            this.get_data();
        },

        onShow() {},

        // 下拉刷新
        onPullDownRefresh() {
            this.get_data();
        },

        methods: {
            get_data(is_mandatory) {
                // 分页是否还有数据
                if ((is_mandatory || 0) == 0) {
                    if (this.goods_bottom_line_status == true) {
                        uni.stopPullDownRefresh();
                        return false;
                    }
                }
                // 是否加载中
                if (this.goods_is_loading == 1) {
                    return false;
                }
                this.setData({
                    goods_is_loading: 1,
                });
                // 获取数据
                uni.showLoading({
                    title: '加载中...',
                    mask: true,
                });
                uni.request({
                    url: app.globalData.get_request_url('detail', 'index', 'ask'),
                    method: 'POST',
                    data: {
                        id: this.params,
                    },
                    dataType: 'json',
                    success: (res) => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            let data = res.data.data;
                            this.setData({
                                data: data.data || null,
                                data_base: data.base || null,
                                emoji_list: data.emoji_list || [],
                                goods_list: data.goods,
                                data_list_loding_status: 3,
                                goods_is_loading: 0,
                            });
                        } else {
                            this.setData({
                                data_list_loding_status: 2,
                                goods_is_loading: 0,
                            });
                            if (app.globalData.is_login_check(res.data, this, 'get_data')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        uni.hideLoading();
                        this.setData({
                            data_list_loding_status: 2,
                            goods_is_loading: 0,
                        });
                        app.globalData.showToast('服务器请求出错');
                    },
                });
            },

            // 猜你喜欢加入购物车回调
            cart_success_event() {
                // 传1表示为购物车回调方法调用的此方法
                this.get_data(1);
            },
        },
    };
</script>
<style scoped>
    @import './detail.css';
</style>
