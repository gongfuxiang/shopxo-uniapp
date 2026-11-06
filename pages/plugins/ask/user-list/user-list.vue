<template>
    <view :class="theme_view">
        <view class="page-bottom-fixed">
            <view v-if="data_list.length > 0" class="padding-main">
                <view v-for="(item, index) in data_list" :key="index" class="item padding-main border-radius-main oh bg-white spacing-mb">
                    <view class="base oh br-b-dashed padding-bottom-main flex-row jc-sb align-c">
                        <text class="cr-grey-9">{{ item.add_time_time }}</text>
                        <view class="flex-row align-c">
                            <text class="ask-status margin-left-xs" :class="item.is_show == 1 ? 'cr-green' : 'cr-yellow'">{{ item.is_show_name || (item.is_show == 1 ? $t('user-list.show_yes') : $t('user-list.show_pending')) }}</text>
                            <text class="ask-status margin-left-xs" :class="item.is_reply == 1 ? 'cr-green' : 'cr-grey-c'">{{ item.is_reply_name || (item.is_reply == 1 ? $t('index.returned') : $t('index.unreturned')) }}</text>
                        </view>
                    </view>
                    <view :data-value="'/pages/plugins/ask/detail/detail?id=' + item.id" @tap="url_event" class="content margin-top-main cp">
                        <view class="title text-size fw-b multi-text">{{ item.title || content_plain(item.content) }}</view>
                        <view v-if="item.category_name" class="text-size-xs cr-grey-9 margin-top-sm">{{ item.category_name }}</view>
                        <view v-if="item.title && item.content && content_plain(item.content) && item.title != content_plain(item.content)" class="cr-grey-9 text-size-sm margin-top-sm multi-text">{{ content_plain(item.content) }}</view>
                    </view>
                    <view v-if="(item.goods || null) != null" class="goods-link margin-top-main bg-grey-f9 padding-sm border-radius-sm" :data-value="item.goods.goods_url || '/pages/goods-detail/goods-detail?id=' + item.goods.id" @tap.stop="url_event">
                        <view class="flex-row align-c">
                            <image v-if="item.goods.images" class="goods-img radius" :src="item.goods.images" mode="aspectFill"></image>
                            <view class="flex-1 flex-width padding-left-sm">
                                <view class="text-size-sm multi-text">{{ item.goods.title }}</view>
                                <view class="cr-red text-size-sm margin-top-xs">{{ currency_symbol }}{{ item.goods.price }}</view>
                            </view>
                        </view>
                    </view>
                    <view class="item-operation tr margin-top-main">
                        <button class="btn round br-grey-9 bg-white text-size-md" type="default" size="mini" :data-value="'/pages/plugins/ask/user-detail/user-detail?id=' + item.id" @tap="url_event" hover-class="none">{{ $t('common.detail_text') }}</button>
                        <button class="btn round cr-red br-red bg-white text-size-md" type="default" size="mini" @tap="delete_event" :data-value="item.id" hover-class="none">{{ $t('common.del') }}</button>
                        <button v-if="item.is_reply == 0" class="btn round cr-main br-main bg-white text-size-md" type="default" size="mini" :data-value="'/pages/plugins/ask/form/form?id=' + item.id" @tap="url_event" hover-class="none">{{ $t('common.edit') }}</button>
                    </view>
                </view>
            </view>
            <view v-else>
                <!-- 提示信息 -->
                <component-no-data :propStatus="data_list_loding_status"></component-no-data>
            </view>
            <!-- 结尾 -->
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>

            <view class="bottom-fixed" :style="bottom_fixed_style">
                <view class="bottom-line-exclude">
                    <button class="item bg-white br-main cr-main round text-size" type="default" data-value="/pages/plugins/ask/form/form" @tap="url_event" hover-class="none">{{ $t('common.ask_question') }}</button>
                </view>
            </view>
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
    import pluginLocale from '../locale/index.js';

    export default {
        mixins: [pluginLocale],
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
                bottom_fixed_style: '',
                currency_symbol: app.globalData.currency_symbol(),
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
        },

        onLoad(params) {
            // 参数处理
            params = app.globalData.launch_params_handle(params);

            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 加载数据
            this.init();

            // 公共onshow事件（$refs 未就绪时自动延后重试）
            app.globalData.page_common_on_show(this);

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
            // 内容去标签，列表摘要展示
            content_plain(content) {
                if ((content || null) == null || content === '') {
                    return '';
                }
                return String(content)
                    .replace(/<[^>]+>/g, '')
                    .replace(/&nbsp;/g, ' ')
                    .replace(/\s+/g, ' ')
                    .trim();
            },
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    this.get_data_list();
                } else {
                    this.setData({
                        data_list_loding_status: 0,
                        data_bottom_line_status: false,
                    });
                }
            },
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
                if (this.data_page > 1) {
                    uni.showLoading({
                        title: this.$t('common.loading_in_text'),
                    });
                }

                // 获取数据
                uni.request({
                    url: app.globalData.get_request_url('index', 'ask', 'ask'),
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
                            // 数据列表（兼容 form 返回 data_list / data）
                            var data = res.data.data || {};
                            var list = data.data_list || data.data || [];
                            if (this.data_page <= 1) {
                                var temp_data_list = list;
                            } else {
                                var temp_data_list = this.data_list || [];
                                for (var i in list) {
                                    temp_data_list.push(list[i]);
                                }
                            }
                            this.setData({
                                data_list: temp_data_list,
                                data_total: data.total,
                                data_page_total: data.page_total,
                                data_list_loding_status: temp_data_list.length > 0 ? 3 : 0,
                                data_list_loding_msg: '',
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
                            if (app.globalData.is_login_check(res.data, this, 'get_data_list')) {
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
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 删除留言
            delete_event(e) {
                if (e.alert_status != 0 && e.alert_status != 1) {
                    app.globalData.alert({
                        msg: this.$t('user-list.sure_want_delete_ask'),
                        is_show_cancel: 1,
                        object: this,
                        params: { id: e.currentTarget.dataset.value },
                        method: 'delete_event',
                    });
                    return false;
                }
                if (e.alert_status == 1) {
                    uni.showLoading({
                        title: this.$t('common.loading_in_text'),
                    });
                    uni.request({
                        url: app.globalData.get_request_url('delete', 'ask', 'ask'),
                        method: 'POST',
                        data: {
                            ids: e.id,
                        },
                        dataType: 'json',
                        success: (res) => {
                            uni.hideLoading();
                            if (res.data.code == 0) {
                                var temp_list = [];
                                var temp_data_list = this.data_list || [];
                                for (var i in temp_data_list) {
                                    if (String(e.id).indexOf(String(temp_data_list[i]['id'])) == -1) {
                                        temp_list.push(temp_data_list[i]);
                                    }
                                }
                                this.setData({
                                    data_list: temp_list,
                                    data_list_loding_status: temp_list.length > 0 ? 3 : 0,
                                });
                                app.globalData.showToast(this.$t('common.del_success'), 'success');
                            } else {
                                if (app.globalData.is_login_check(res.data)) {
                                    app.globalData.showToast(res.data.msg || this.$t('common.del_fail'));
                                } else {
                                    app.globalData.showToast(this.$t('common.sub_error_retry_tips'));
                                }
                            }
                        },
                        fail: () => {
                            uni.hideLoading();
                            app.globalData.showToast(this.$t('common.internet_error_tips'));
                        },
                    });
                }
            },

            // 滚动加载
            scroll_lower(e) {
                this.get_data_list();
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            },
        },
    };
</script>
<style scoped>
    @import './user-list.css';
</style>
