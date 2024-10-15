<template>
    <view :class="theme_view">
        <view v-if="data_list_loding_status == 3" class="padding-main">
            <!-- 搜索 -->
            <view class="margin-bottom-xxxl">
                <component-search ref="search" :propIsBtn="true" :propIsOnEvent="true" propSize="sm" @onsearch="search_history_handle" :propPlaceholder="search_keywords_value" :propDefaultValue="search_keywords_value" propBrColor="#eee" propPlaceholderClass="cr-grey-c" propIconColor="#999" propBgColor="#fff"></component-search>
            </view>
            <!-- 历史搜索关键字 -->
            <view v-if="history_keywords.length > 0" class="history-keywords margin-bottom-xxxl">
                <view class="margin-bottom flex-row jc-sb align-c">
                    <text class="text-size-sm fw-b">历史搜索</text>
                    <view class="dis-inline-block" @tap="history_delete_event">
                        <iconfont name="icon-delete" size="30rpx" color="#999"></iconfont>
                    </view>
                </view>
                <view class="oh">
                    <block v-for="(item, index) in history_keywords" :key="index">
                        <view class="dis-inline-block bg-grey-e cr-base round padding-vertical-xs padding-horizontal-lg margin-right margin-bottom" :data-value="item" @tap="keywords_event">{{item}}</view>
                    </block>
                </view>
            </view>
            <!-- 推荐搜索关键字 -->
            <view v-if="recommend_keywords.length > 0" class="recommend-keywords margin-bottom-xxxl">
                <view class="text-size-sm fw-b margin-bottom">热门搜索</view>
                <view class="oh">
                    <block v-for="(item, index) in recommend_keywords" :key="index">
                        <view class="dis-inline-block bg-grey-e cr-base round padding-vertical-xs padding-horizontal-lg margin-right margin-bottom" :data-value="item" @tap="keywords_event">{{item}}</view>
                    </block>
                </view>
            </view>
            <!-- 排行榜 -->
            <view v-if="ranking_list.length > 0" class="ranking-list scroll-view-horizontal border-radius-main oh">
                <scroll-view scroll-x="true">
                    <block v-for="(item, index) in ranking_list" :key="index">
                        <view class="ranking-item dis-inline-grid bg-main-light padding-sm border-radius-main" :class="index > 0 ? 'margin-left-main' : ''">
                            <view class="padding-vertical-sm padding-left-sm">
                                <view v-if="(item.icon || null) != null" class="dis-inline-block margin-right-sm">
                                    <iconfont :name="item.icon" size="26rpx" propClass="cr-main"></iconfont>
                                </view>
                                <text class="text-size-sm fw-b cr-main">{{item.name}}</text>
                            </view>
                            <view class="goods-list bg-white border-radius-main padding-main margin-top-xs">
                                <block v-for="(item2, index2) in item.data" :key="index2">
                                    <view class="goods-item oh margin-bottom-main" :data-value="item2.goods_url" @tap="url_event">
                                        <image class="goods-image radius fl" :src="item2.images" mode="aspectFill"></image>
                                        <view class="goods-title text-size-sm multi-text fr">{{item2.title}}</view>
                                    </view>
                                </block>
                            </view>
                        </view>
                    </block>
                </scroll-view>
            </view>
        </view>
        <block v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </block>

        <!-- 公共 -->
        <component-common ref="common" @footer-height="footer_height_value_event" :propIsFooterSeat="false"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentSearch from '@/components/search/search';
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                history_keywords: [],
                recommend_keywords: [],
                ranking_list: [],
                search_keywords_value: '',
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentSearch,
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            params = app.globalData.launch_params_handle(params);
            this.setData({
                params: params,
                search_keywords_value: params.keywords || '',
            });
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 初始化配置
            this.init_config();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }

            // 历史搜索
            this.setData({
                history_keywords: uni.getStorageSync(app.globalData.data.cache_search_history_key) || [],
            });

            // 获取数据
            this.get_data();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.get_data();
        },

        methods: {
            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {
                    this.setData({
                        currency_symbol: app.globalData.get_config('currency_symbol'),
                    });
                } else {
                    app.globalData.is_config(this, 'init_config');
                }
            },

            // 获取数据
            get_data(params = {}) {
                // 网络检查
                if((params || null) == null || (params.loading || 0) == 0) {
                    app.globalData.network_type_handle(this, 'get_data');
                    return false;
                }

                // 请求数据
                uni.request({
                    url: app.globalData.get_request_url("start", "search"),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
                                recommend_keywords: data.search_keywords || [],
                                ranking_list: data.ranking_list || [],
                                data_list_loding_status: 3,
                                data_list_loding_msg: '',
                            });
                        } else {
                            this.setData({
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg,
                            });
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                    },
                });
            },

            // 搜索历史记录删除事件
            history_delete_event(e) {
                uni.removeStorageSync(app.globalData.data.cache_search_history_key);
                this.setData({
                    history_keywords: []
                });
                app.globalData.showToast(this.$t('common.del_success'), 'success');
            },

            // 搜索历史处理
            search_history_handle(value  = '') {
                // 记录缓存
                var key = app.globalData.data.cache_search_history_key;
                var data = uni.getStorageSync(key) || [];
                var index = data.indexOf(value);
                if(index != -1) {
                    data.splice(index, 1);
                }
                data.unshift(value);
                uni.setStorageSync(key, data);

                // 数据存储
                this.setData({
                    search_keywords_value: value
                });

                // 执行搜索
                this.search_submit_confirm_event();
            },

            // 搜索关键字事件
            keywords_event(e) {
                this.search_history_handle(e.currentTarget.dataset.value);
            },

            // 搜索事件
            search_submit_confirm_event() {
                if ((this.$refs.search || null) != null) {
                    this.$refs.search.search_submit_confirm(this.search_keywords_value);
                }
            },

            // 打开url
            url_event(e) {
                app.globalData.url_event(e);
            }
        },
    };
</script>
<style>
    @import './goods-search-start.css';
</style>
