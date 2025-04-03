<template>
    <view :class="theme_view">
        <!-- 列表 -->
        <scroll-view :scroll-y="true" class="scroll-box" @scrolltolower="scroll_lower" lower-threshold="60">
            <view v-if="data_list.length > 0" class="data-list padding-horizontal-main padding-top-main">
                <view v-for="(item, index) in data_list" :key="index" class="item padding-main border-radius-main oh bg-white spacing-mb">
                    <view class="base oh br-b padding-bottom-main">
                        <text class="cr-base">{{ item.add_time_time }}</text>
                        <text class="fr">{{ item.rating_text }}</text>
                    </view>
                    <view class="content margin-top">
                        <view v-if="(item.goods || null) !== null" :data-value="item.goods.goods_url" @tap="url_event">
                            <view class="margin-top-xs flex-row align-c">
                                <view class="cr-grey margin-right-xl">{{$t('user-order-detail.user-order-detail.7f8p26')}}</view>
                                <view class="cr-base flex-1 flex-width flex-row align-c">
                                    <image class="br radius margin-right-sm goods-img" :src="item.goods.images" mode="aspectFit"></image>
                                    <text class="single-text flex-1 flex-width">{{ item.goods.title }}</text>
                                </view>
                            </view>
                        </view>
                        <block v-for="(fv, fi) in content_list" :key="fi">
                            <view class="margin-top-xs flex-row align-c">
                                <view class="cr-grey margin-right-xl">{{ fv.name }}</view>
                                <view class="cr-base flex-1 flex-width ">{{ item[fv.field] || '' }}</view>
                            </view>
                        </block>
                    </view>
                    <view class="item-operation tr br-t padding-top-main margin-top-main">
                        <button :data-value="'/pages/user-goods-comments-form/user-goods-comments-form?id=' + item.id" @tap="url_event" class="round bg-white br-main cr-main margin-left-lg" type="default" size="mini" hover-class="none">{{ $t('common.edit') }}</button>
                        <button class="round bg-white br-red cr-red margin-left-lg" type="default" size="mini" hover-class="none" @tap="delete_event" :data-index="index">{{ $t('common.del') }}</button>
                    </view>
                </view>
            </view>
            <view v-else>
                <!-- 提示信息 -->
                <component-no-data :propStatus="data_list_loding_status"></component-no-data>
            </view>

            <!-- 结尾 -->
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
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
                data_list: [],
                data_total: 0,
                data_page_total: 0,
                data_page: 1,
                data_list_loding_status: 1,
                data_bottom_line_status: false,
                data_is_loading: 0,
                params: null,
                content_list: [
                    { name: this.$t('user-goods-comments.user-goods-comments.58804r'), field: 'is_show_text' },
                    { name: this.$t('user-goods-comments.user-goods-comments.jnk6da'), field: 'is_reply_text' },
                    { name: this.$t('user-goods-comments.user-goods-comments.yyjemb'), field: 'is_anonymous_text' },
                    { name: this.$t('user-goods-comments.user-goods-comments.0nhrj0'), field: 'content' },
                    { name: this.$t('user-detail.user-detail.u411r2'), field: 'reply' },
                    { name: this.$t('user-detail.user-detail.teo6qd'), field: 'reply_time_time' },
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
                params: params,
            });
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 先解绑自定义事件
            uni.$off('refresh');

            // 初始数据
            this.init();
            // 监听自定义事件并进行页面刷新操作
            uni.$on('refresh', (data) => {
                // 重新请求数据
                this.init();
            });

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.setData({
                data_page: 1,
            });
            this.get_data_list(1);
        },

        methods: {
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    // 获取数据
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

                // 参数
                uni.request({
                    url: app.globalData.get_request_url('index', 'usergoodscomments'),
                    method: 'POST',
                    data: {
                        page: this.data_page,
                        is_more: 1,
                    },
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            if (data.data.length > 0) {
                                if (this.data_page <= 1) {
                                    var temp_data_list = data.data;
                                } else {
                                    var temp_data_list = this.data_list || [];
                                    var temp_data = data.data;
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
                                    data_is_loading: 0,
                                });
                                if (this.data_page <= 1) {
                                    this.setData({
                                        data_list: [],
                                        data_bottom_line_status: false,
                                    });
                                }
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

            // 删除数据
            delete_event(e) {
                var index = e.currentTarget.dataset.index || 0;
                var temp_data = this.data_list;
                var data = temp_data[index] || null;
                if (data == null) {
                    app.globalData.showToast(this.$t('extraction-switch.extraction-switch.613b58'));
                    return false;
                }
                uni.showModal({
                    title: this.$t('common.warm_tips'),
                    content: this.$t('recommend-list.recommend-list.54d418'),
                    confirmText: this.$t('common.confirm'),
                    cancelText: this.$t('recommend-list.recommend-list.w9460o'),
                    success: (result) => {
                        if (result.confirm) {
                            uni.showLoading({
                                title: this.$t('common.processing_in_text'),
                            });
                            uni.request({
                                url: app.globalData.get_request_url('delete', 'usergoodscomments'),
                                method: 'POST',
                                data: { ids: data.id },
                                dataType: 'json',
                                success: (res) => {
                                    uni.hideLoading();
                                    if (res.data.code == 0) {
                                        temp_data.splice(index, 1);
                                        this.setData({
                                            data_list: temp_data,
                                        });
                                        app.globalData.showToast(res.data.msg, 'success');
                                    } else {
                                        app.globalData.showToast(res.data.msg);
                                    }
                                },
                                fail: () => {
                                    uni.hideLoading();
                                    app.globalData.showToast(this.$t('common.internet_error_tips'));
                                },
                            });
                        }
                    },
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
    @import './user-goods-comments.css';
</style>
