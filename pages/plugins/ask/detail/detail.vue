<template>
    <view>
        <view v-if="Object.keys(detail_data).length !== 0" class="page-bottom-fixed">
            <!-- true为空对象 false为非空对象 Object.keys(detail_data).length == 0 -->
            <view class="ask-container bg-white spacing-mb">
                <view class="padding-main">
                    <view class="fw-b text-size-xl spacing-mb">{{ detail_data.title }}</view>
                    <view class="cr-grey-9 text-size-xs margin-bottom-sm flex-row">
                        留言时间: {{ detail_data.add_time_date }}
                        <view class="fw-b padding-horizontal-xs">·</view>
                        {{ detail_data.access_count || '0' }}浏览
                    </view>
                    <view class="text-size-md">{{ detail_data.content }}</view>
                </view>
                <view v-if="detail_data.is_reply && detail_data.is_reply === '1'" class="padding-main br-t-dashed">
                    <view class="flex-row jc-sb align-c">
                        <view class="flex-row align-c">
                            <image :src="ask_static_url + 'admin.png'" mode="widthFix" class="admin-img margin-right-sm"></image>
                            <text>管理员</text>
                        </view>
                        <view class="cr-grey-9 text-size-xs">回复时间: {{ detail_data.reply_time_date }}</view>
                    </view>
                    <view class="text-size-md padding-top-main">{{ detail_data.reply }}</view>
                </view>
                <view class="padding-main spacing-mt br-t-dashed">
                    <view class="fw-b">共3个回答</view>
                    <view class="spacing-mt">
                        <!-- 评论内容 -->
                        <component-comments :propData="data" :propDataBase="data_base" :propEmojiList="emoji_list"></component-comments>
                    </view>
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
                    <navigator url="/pages/plugins/ask/user-form/user-form" hover-class="none" class="flex-1 tc flex-col jc-c align-c">
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
    import componentComments from '@/components/blog-comments/blog-comments';

    export default {
        data() {
            return {
                ask_static_url: app.globalData.get_static_url('ask', true),
                data_list_loding_status: 1,
                data_bottom_line_status: true,
                detail_data: {},
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
            componentComments,
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
        onPullDownRefresh() {},

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
                                detail_data: data.data,
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
