<template>
    <view>
        <view class="bg-white padding-main" :style="'padding-top:' + (status_bar_height > 0 ? status_bar_height + 5 : 10) + 'px;'">
            <view class="flex-row align-c">
                <!-- 返回 -->
                <!-- #ifdef MP-WEIXIN || MP-QQ || MP-KUAISHOU || H5 || APP -->
                <view v-if="is_realstore_top_nav_back == 1" class="nav-back margin-right-main round va-m" @tap="top_nav_left_back_event">
                    <iconfont name="icon-tongyong-fanhui" size="40rpx"></iconfont>
                </view>
                <!-- #endif -->
            </view>
        </view>
        <!-- true为空对象 false为非空对象 Object.keys(detail_data).length == 0 -->
        <view v-if="Object.keys(detail_data).length !== 0" class="answers-container bg-white spacing-mb">
            <view class="padding-main br-b-dashed">
                <view class="fw-b text-size-xl spacing-mb">{{ detail_data.title }}</view>
                <view class="cr-grey-9 text-size-xs margin-bottom-sm flex-row">
                    留言时间: {{ detail_data.add_time_date }}
                    <view class="fw-b padding-horizontal-xs">·</view>
                    {{ detail_data.access_count || '0' }}浏览
                </view>
                <view class="text-size-md">{{ detail_data.content }}</view>
            </view>
            <view v-if="detail_data.is_reply && detail_data.is_reply === '1'" class="padding-main">
                <view class="flex-row jc-sb align-c">
                    <view class="flex-row align-c">
                        <image :src="answers_static_url + 'admin.png'" mode="widthFix" class="admin-img margin-right-sm"></image>
                        <text>管理员</text>
                    </view>
                    <view class="cr-grey-9 text-size-xs">回复时间: {{ detail_data.reply_time_date }}</view>
                </view>
                <view class="text-size-md padding-top-main">{{ detail_data.reply }}</view>
            </view>
        </view>
        <!-- 猜你喜欢 -->
        <view v-if="goods_list.length > 0" class="padding-horizontal-main">
            <view class="tc">
                <view class="guess-like fw-b text-size-md">猜你喜欢</view>
            </view>
            <component-goods-list
                class="padding-top-main"
                :propData="{ style_type: 1, goods_list: goods_list, random: random_value }"
                :propLabel="plugins_label_data"
                :propCurrencySymbol="currency_symbol"
                :propIsCartParaCurve="true"
                propSource="detail"
                @CartSuccessEvent="cart_success_event"
            ></component-goods-list>
            <!-- 结尾 -->
            <component-bottom-line :propStatus="data_bottom_line_status" class="bottom-line"></component-bottom-line>
        </view>
        <view class="bottom-fixed flex-row jc-sa align-c bg-white text-size fw-b">
            <navigator url="/pages/user-answers-form/user-answers-form" hover-class="none" class="flex-1 tc answers-btn flex-col jc-c align-c">
                <view class="divider-r-d">
                    <iconfont name="icon-wenda-wytw" size="30rpx" color="#333" class="margin-right-sm"></iconfont>
                    我要提问
                </view>
            </navigator>
            <navigator url="/pages/user-answers-question/user-answers-question" hover-class="none" class="flex-1 tc answers-btn flex-col jc-c align-c">
                <view>
                    <iconfont name="icon-wenda-wdtw" size="32rpx" color="#333" class="margin-right-sm pr top-xs"></iconfont>
                    我的提问
                </view>
            </navigator>
        </view>
        <component-no-data :propStatus="data_list_loding_status"></component-no-data>
    </view>
</template>
<script>
    const app = getApp();
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    import componentGoodsList from '@/components/goods-list/goods-list';

    export default {
        data() {
            return {
                answers_static_url: app.globalData.get_static_url('answers', true),
                status_bar_height: parseInt(app.globalData.get_system_info('statusBarHeight', 0)),
                // 顶部导航返回按钮
                is_realstore_top_nav_back: app.globalData.data.is_realstore_top_nav_back || 0,
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
            };
        },

        components: {
            componentNoData,
            componentBottomLine,
            componentGoodsList,
        },
        props: {},

        onLoad() {
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
                    url: app.globalData.get_request_url('detail', 'index', 'answers'),
                    method: 'POST',
                    data: {
                        id: this.$route.query.id,
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
            top_nav_left_back_event() {
                var pages = getCurrentPages();
                if (pages.length <= 1) {
                    uni.switchTab({
                        url: app.globalData.data.tabbar_pages[0],
                    });
                } else {
                    uni.navigateBack();
                }
            },
        },
    };
</script>
<style scoped>
    @import './detail.css';
</style>
