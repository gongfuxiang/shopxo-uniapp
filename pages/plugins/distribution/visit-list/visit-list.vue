<template>
    <view :class="theme_view">
        <!-- 列表 -->
        <scroll-view :scroll-y="true" class="scroll-box" @scrolltolower="scroll_lower" lower-threshold="60">
            <view v-if="data_list.length > 0" class="data-list padding-horizontal-main padding-top-main">
                <view v-for="(item, index) in data_list" :key="index" class="item padding-main border-radius-main oh bg-white spacing-mb">
                    <view class="base oh br-b padding-bottom-main">
                        <view class="custom-info dis-inline-block">
                            <image class="custom-avatar circle br va-m" :src="item.custom_user.avatar" mode="aspectFill"></image>
                            <text class="va-m margin-left-sm">{{item.custom_user.user_name_view}}</text>
                        </view>
                        <text class="fr cr-base margin-top-xs">{{item.add_time}}</text>
                    </view>
                    <view class="content margin-top">
                        <block v-for="(fv, fi) in content_list" :key="fi">
                            <view v-if="(item[fv.field] || null) != null" class="margin-top-sm">
                                <text class="cr-grey margin-right-xl va-m">{{ fv.name }}</text>
                                <block v-if="fv.field == 'images'">
                                    <block v-for="(iv, ix) in item[fv.field]" :key="ix">
                                        <image :class="'item-images va-m br radius '+(ix > 0 ? 'margin-left-sm' : '')" :src="iv" mode="aspectFill" :data-index="index" :data-ix="ix" @tap="images_event"></image>
                                    </block>
                                </block>
                                <text v-else class="cr-base">{{ item[fv.field] }}</text>
                            </view>
                        </block>
                    </view>
                    <view class="item-operation tr br-t padding-top-main margin-top-main">
                        <button type="default" size="mini" class="bg-white br-green cr-green text-size-xs round" :data-value="'/pages/plugins/distribution/visit-form/visit-form?id='+item.id" @tap="url_event">{{$t('common.edit')}}</button>
                        <button type="default" size="mini" class="bg-white br-red cr-red text-size-xs round margin-left-main" :data-index="index" @tap="delete_event">{{$t('common.del')}}</button>
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
        <view data-value="/pages/plugins/distribution/visit-form/visit-form" @tap="url_event" class="buttom-right-submit bg-main cr-white round tc">+</view>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from "@/components/no-data/no-data";
    import componentBottomLine from "@/components/bottom-line/bottom-line";

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
                    { name: this.$t('visit-list.visit-list.q76du4'), field: "content" },
                    { name: this.$t('visit-list.visit-list.4z367h'), field: "images"},
                    { name: this.$t('common.upd_time'), field: "upd_time" },
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

                // 获取数据
                uni.request({
                    url: app.globalData.get_request_url("index", "visit", "distribution"),
                    method: "POST",
                    data: {
                        page: this.data_page
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

            // 图片预览
            images_event(e) {
                var index = e.currentTarget.dataset.index;
                var ix = e.currentTarget.dataset.ix;
                uni.previewImage({
                    current: this.data_list[index]['images'][ix],
                    urls: this.data_list[index]['images'],
                });
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            },

            // 删除事件
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
                                url: app.globalData.get_request_url("delete", "visit", "distribution"),
                                method: "POST",
                                data: { ids: data.id },
                                dataType: "json",
                                success: (res) => {
                                    uni.hideLoading();
                                    if (res.data.code == 0) {
                                        temp_data.splice(index, 1);
                                        this.setData({
                                            data_list: temp_data
                                        });

                                        // 是否还存在数据
                                        if(temp_data.length == 0) {
                                            this.setData({
                                                data_list_loding_status: 0,
                                                data_bottom_line_status: false
                                            });
                                        }
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
            }
        },
    };
</script>
<style>
    @import "./visit-list.css";
</style>