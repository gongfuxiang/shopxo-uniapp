<template>
    <view :class="theme_view">
        <view v-if="(info || null) !== null" :class="(data_base.is_user_add_ask || 0) == 1 ? 'page-bottom-fixed' : ''">
            <!-- true为空对象 false为非空对象 Object.keys(info).length == 0 -->
            <view class="ask-container bg-white spacing-mb">
                <view class="padding-main">
                    <view v-if="(info.title || null) != null" class="fw-b text-size-xl spacing-mb">{{ info.title }}</view>
                    <view class="cr-grey-9 text-size-xs margin-bottom-sm flex-row">
                        {{ $t('detail.detail.kt41ki') }}{{ info.add_time_date }}
                        <view class="fw-b padding-horizontal-xs">·</view>
                        {{ info.access_count || '0' }}{{ $t('detail.detail.e6ga1y') }}
                    </view>
                    <view v-if="info.title != info.content">
                        <mp-html :content="info.content" />
                    </view>
                    <block v-if="(info.goods || null) !== null">
                        <view :data-value="info.goods.goods_url" @tap="url_event" class="cp">
                            <view class="goods-link spacing-mt bg-grey-f9 padding-main border-radius-sm">
                                <view class="flex-row jc-sb">
                                    <view class="img border-radius-sm oh margin-right-main">
                                        <image :src="info.goods.images" mode="widthFix" class="wh-auto"></image>
                                    </view>
                                    <view class="flex-1 flex-width flex-row jc-sb align-c">
                                        <view class="flex-1 flex-width padding-right-sm">
                                            <view class="title multi-text">{{ info.goods.title }}</view>
                                            <view class="flex-row align-c margin-top-xs">
                                                <text class="cr-red fw-b margin-right-main">{{ currency_symbol }}{{ info.goods.price }}</text>
                                                <text class="text-size-xs cr-grey-9 original-price">{{ currency_symbol }}{{ info.goods.original_price }}</text>
                                            </view>
                                        </view>
                                        <iconfont name="icon-arrow-right" color="#999"></iconfont>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </block>
                </view>
                <view v-if="info.is_reply && info.is_reply === '1'" class="padding-main br-t-dashed">
                    <view class="flex-row jc-sb align-c">
                        <view class="flex-row align-c">
                            <image v-if="(logo_square || null) != null" :src="logo_square" mode="widthFix" class="admin-img circle br-f5 margin-right-sm"></image>
                            <text>{{ $t('detail.detail.ng628i') }}</text>
                        </view>
                        <view v-if="(info.reply_time_date || null) != null" class="cr-grey-9 text-size-xs">{{ $t('detail.detail.7rg4bb') }}{{ info.reply_time_date }}</view>
                    </view>
                    <view class="padding-top-main">
                        <mp-html :content="info.reply" />
                    </view>
                </view>
                <view class="padding-main br-t-dashed">
                    <!-- 评论内容 -->
                    <component-ask-comments :propData="info" :propDataBase="data_base" :propEmojiList="emoji_list" :propShareInfo="share_info"></component-ask-comments>
                </view>
            </view>
            <!-- 猜你喜欢 -->
            <view v-if="goods_list.length > 0" class="padding-horizontal-main padding-top-sm">
                <view class="tc spacing-mb">
                    <view class="guess-like fw-b text-size-md">{{ $t('goods-detail.goods-detail.v2974w') }}</view>
                </view>
                <component-goods-list :propData="{ style_type: 1, goods_list: goods_list, random: random_value }" :propLabel="plugins_label_data" :propCurrencySymbol="currency_symbol" propSource="detail" @CartSuccessEvent="cart_success_event"></component-goods-list>
                <!-- 结尾 -->
                <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
            </view>
            <view v-if="(data_base.is_user_add_ask || 0) == 1" class="bottom-fixed" :style="bottom_fixed_style">
                <view class="bottom-line-exclude">
                    <view class="item flex-row jc-sa align-c text-size fw-b br bg-white round padding-vertical">
                        <view data-value="/pages/plugins/ask/form/form" @tap="url_event" class="flex-1 tc flex-col jc-c align-c cp">
                            <view class="divider-r-d wh-auto"> <iconfont name="icon-edit-below-line" size="30rpx" color="#333" propClass="margin-right-sm"></iconfont>{{ $t('goods-detail.goods-detail.7ulh8b') }}</view>
                        </view>
                        <view data-value="/pages/plugins/ask/user-list/user-list" @tap="url_event" class="flex-1 tc flex-col jc-c align-c cp">
                            <view class="wh-auto"> <iconfont name="icon-list-dot" size="32rpx" color="#333" propClass="margin-right-sm pr top-xs"></iconfont>{{ $t('detail.detail.p7o522') }}</view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <view v-else>
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </view>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    import componentGoodsList from '@/components/goods-list/goods-list';
    import componentAskComments from '../components/ask-comments/ask-comments';

    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                logo_square: app.globalData.get_application_logo_square(),
                data_list_loding_msg: '',
                data_list_loding_status: 1,
                data_bottom_line_status: true,
                bottom_fixed_style: '',
                info: null,
                data_base: null,
                emoji_list: [],
                // 基础配置
                currency_symbol: app.globalData.currency_symbol(),
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
                // 自定义分享信息
                share_info: {},
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
            componentGoodsList,
            componentAskComments,
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            this.setData({
                params: app.globalData.launch_params_handle(params),
            });

            // 获取数据
            this.get_data();
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
                uni.request({
                    url: app.globalData.get_request_url('detail', 'index', 'ask'),
                    method: 'POST',
                    data: this.params,
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            let data = res.data.data;
                            var info = data.data || null;
                            this.setData({
                                info: info,
                                data_base: data.base || null,
                                emoji_list: data.emoji_list || [],
                                goods_list: data.goods,
                                data_list_loding_msg: '',
                                data_list_loding_status: 0,
                                goods_is_loading: 0,
                            });

                            if (info != null) {
                                // 基础自定义分享
                                this.setData({
                                    share_info: {
                                        title: info.title,
                                        desc: info.content,
                                        path: '/pages/plugins/ask/detail/detail',
                                        query: 'id=' + info.id,
                                    },
                                });

                                // 标题
                                uni.setNavigationBarTitle({ title: info.title || info.content });
                            }
                        } else {
                            this.setData({
                                data_list_loding_msg: res.data.msg,
                                data_list_loding_status: 0,
                                goods_is_loading: 0,
                            });
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                            data_list_loding_status: 2,
                            goods_is_loading: 0,
                        });
                    },
                });
            },

            // 猜你喜欢加入购物车回调
            cart_success_event() {
                // 传1表示为购物车回调方法调用的此方法
                this.get_data(1);
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            }
        },
    };
</script>
<style scoped>
    @import './detail.css';
</style>
