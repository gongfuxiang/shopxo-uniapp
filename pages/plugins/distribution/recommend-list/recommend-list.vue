<template>
    <view :class="theme_view">
        <!-- 列表 -->
        <scroll-view :scroll-y="true" class="scroll-box" @scrolltolower="scroll_lower" lower-threshold="60">
            <view v-if="data_list.length > 0" class="data-list padding-horizontal-main padding-top-main">
                <view v-for="(item, index) in data_list" :key="index" class="item padding-main border-radius-main oh bg-white spacing-mb">
                    <view class="base oh br-b padding-bottom-main">
                        <text class="cr-base">{{ item.add_time }}</text>
                        <text :class="'fr ' + (item.is_enable == 1 ? 'cr-green' : 'cr-grey')">{{ item.is_enable_text }}</text>
                    </view>
                    <view :data-value="'/pages/plugins/distribution/recommend-detail/recommend-detail?id=' + item.id" @tap="url_event" class="content margin-top cp">
                        <view v-for="(fv, fi) in content_list" :key="fi">
                            <view class="single-text margin-top-xs">
                                <text class="cr-grey margin-right-xl">{{ fv.name }}</text>
                                <text class="cr-base">{{ item[fv.field] }}</text>
                            </view>
                        </view>
                    </view>
                    <view class="item-operation tr br-t padding-top-main margin-top-main">
                        <button class="round bg-white br-green cr-green" type="default" size="mini" hover-class="none" @tap="popup_share_event" :data-index="index">{{$t('common.share')}}</button>
                        <button :data-value="'/pages/plugins/distribution/recommend-form/recommend-form?id=' + item.id" @tap="url_event" class="round bg-white br-main cr-main margin-left-lg" type="default" size="mini" hover-class="none">{{$t('common.edit')}}</button>
                        <button class="round bg-white br-red cr-red margin-left-lg" type="default" size="mini" hover-class="none" @tap="delete_event" :data-index="index">{{$t('common.del')}}</button>
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

        <!-- 新增入口 -->
        <view data-value="/pages/plugins/distribution/recommend-form/recommend-form" @tap="url_event" class="buttom-right-submit bg-main cr-white round tc cp">+</view>

        <!-- 分享弹窗 -->
        <component-share-popup ref="share"></component-share-popup>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from "@/components/no-data/no-data";
    import componentBottomLine from "@/components/bottom-line/bottom-line";
    import componentSharePopup from "@/components/share-popup/share-popup";

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
                    { name: this.$t('user-detail.user-detail.uy6lrz'), field: "title" },
                    { name: this.$t('form.form.xy87t8'), field: "describe" },
                    { name: this.$t('recommend-list.recommend-list.x74z3o'), field: "goods_count" },
                    { name: this.$t('recommend-list.recommend-list.78n1ly'), field: "access_count" },
                ],
                // 自定义分享信息
                share_info: {},
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
            componentSharePopup,
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            this.setData({
                params: params,
            });

            // 初始数据
            this.init();
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 先解绑自定义事件
            uni.$off('refresh');
            // 监听自定义事件并进行页面刷新操作
            uni.$on('refresh', (data) => {
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
                var user = app.globalData.get_user_info(this, "init");
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
                    url: app.globalData.get_request_url("index", "recommend", "distribution"),
                    method: "POST",
                    data: {
                        page: this.data_page,
                        is_more: 1,
                    },
                    dataType: "json",
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
                            if (app.globalData.is_login_check(res.data, this, "get_data_list")) {
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

            // 分享开启弹层
            popup_share_event(e) {
                var index = e.currentTarget.dataset.index || 0;
                var data = this.data_list[index] || null;
                if (data == null) {
                    app.globalData.showToast(this.$t('extraction-switch.extraction-switch.613b58'));
                    return false;
                }
                this.setData({
                    share_info: {
                        title: data.seo_title || data.title,
                        kds: data.seo_keywords || data.describe,
                        desc: data.seo_desc || data.describe,
                        path: "/pages/plugins/distribution/recommend-detail/recommend-detail",
                        query: "id=" + data.id,
                        img: data.icon || "",
                    },
                });
                // 分享菜单处理
                app.globalData.page_share_handle(this.share_info);

                // 调取分享弹窗
                if ((this.$refs.share || null) != null) {
                    this.$refs.share.init({
                        share_info: this.share_info
                    });
                }
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
                                url: app.globalData.get_request_url("delete", "recommend", "distribution"),
                                method: "POST",
                                data: { ids: data.id },
                                dataType: "json",
                                success: (res) => {
                                    uni.hideLoading();
                                    if (res.data.code == 0) {
                                        temp_data.splice(index, 1);
                                        this.setData({
                                            data_list: temp_data,
                                        });
                                        app.globalData.showToast(res.data.msg, "success");
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
</style>