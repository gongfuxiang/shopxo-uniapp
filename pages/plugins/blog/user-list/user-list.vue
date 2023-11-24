<template>
    <view :class="theme_view">
        <view v-if="data.length > 0">
            <scroll-view :scroll-y="true" class="scroll-box" @scrolltolower="scroll_lower" lower-threshold="60">
                <view class="page-bottom-fixed padding-top-main">
                    <view v-for="(item, index) in data" class="bg-white spacing-mb" :key="index">
                        <view class="padding-main flex-row">
                            <view>
                                <image class="blog-img radius" :src="item.cover" mode="aspectFit"></image>
                            </view>
                            <view class="flex-1 flex-width padding-left-main">
                                <view class="multi-text text-size fw-b margin-bottom-xs">{{ item.title }}</view>
                                <view class="text-size-sm cr-grey-9 margin-bottom-sm">{{ item.date }}</view>
                                <view class="badge" :class="item.status == '0' ? 'info' : item.status === '1' ? 'success' : 'error'">{{ item.status_name }}</view>
                            </view>
                        </view>
                        <view class="br-t-f5 flex-row jc-sa align-c text-size tc">
                            <view class="cr-base flex-1 divider-r-f5 padding-vertical-main" :data-value="'/pages/plugins/blog/form/form?id=' + item.id" @tap="url_event">
                                <view class="pr top-xs margin-right-xs dis-inline-block">
                                    <iconfont name="icon-wenda-wytw" size="32rpx"></iconfont>
                                </view>
                                编辑
                            </view>
                            <view class="cr-main flex-1 padding-vertical-main" :data-id="item.id" @tap="del_event">
                                <view class="pr top-xs margin-right-xs dis-inline-block">
                                    <iconfont name="icon-blog-del" size="32rpx"></iconfont>
                                </view>
                                删除
                            </view>
                        </view>
                    </view>
                    <!-- 结尾 -->
                    <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
                </view>
            </scroll-view>
            <!-- 底部操作 -->
            <view class="bottom-fixed btn-bottom bg-white">
                <view class="oh bottom-line-exclude">
                    <button class="cr-main bg-white br-main round text-size wh-auto flex-row align-c jc-c" type="default" hover-class="none" data-value="/pages/plugins/blog/form/form" @tap="url_event">
                        <view class="add-icon">
                            <iconfont name="icon-xzdz-tianjiabiaoq" size="32rpx"></iconfont>
                        </view>
                        新增
                    </button>
                </view>
            </view>
        </view>
        <view v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status"></component-no-data>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                theme_color: app.globalData.get_theme_color(),
                data_bottom_line_status: false,
                data_list_loding_status: 1,
                data: [
                    // {
                    //     id: '1',
                    //     images: 'http://shopxo.com/static/upload/images/plugins_homemiddleadv/2023/08/18/1692328288709779.png',
                    //     title: '歌手2024惊艳登场，陈出生、两进入领衔，人气爆棚啦！！！！！',
                    //     date: '2023-09-04 10:12:50',
                    //     reviewed: 1,
                    // },
                ],
                data_is_loading: 0,
                data_total: 0,
                data_page_total: 0,
                data_page: 1,
            };
        },
        components: {
            componentNoData,
            componentBottomLine,
        },

        onLoad(params) {},

        onShow() {
            // 数据加载
            this.init();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.setData({
                data_page: 1,
            });
            this.get_data_list(1);
        },

        // 页面销毁时执行
        onUnload: function () {},

        methods: {
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    // 用户未绑定手机则转到登录页面
                    if (app.globalData.user_is_need_login(user)) {
                        uni.redirectTo({
                            url: '/pages/login/login?event_callback=init',
                        });
                        return false;
                    }
                    this.get_data_list(1);
                } else {
                    // 提示错误
                    this.setData({
                        data_list_loding_status: 2,
                        data_list_loding_msg: '用户未登录',
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
                uni.showLoading({
                    title: '加载中...',
                });
                uni.request({
                    url: app.globalData.get_request_url('index', 'blog', 'blog'),
                    method: 'POST',
                    success: (res) => {
                        uni.hideLoading();
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
                                    data: temp_data_list,
                                    data_total: data.total,
                                    data_page_total: data.page_total,
                                    data_list_loding_status: 3,
                                    data_page: this.data_page + 1,
                                    data_is_loading: 0,
                                });

                                // 是否还有数据
                                this.setData({
                                    data_bottom_line_status: this.data_page > 1 && this.data_page > this.data_page_total,
                                });
                            } else {
                                this.setData({
                                    data_list_loding_status: 0,
                                    data_total: 0,
                                    data_is_loading: 0,
                                });
                                if (this.data_page <= 1) {
                                    this.setData({
                                        data: [],
                                        data_bottom_line_status: false,
                                    });
                                }
                            }
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                                data_is_loading: 0,
                            });
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_is_loading: 0,
                        });
                        app.globalData.showToast('网络开小差了哦~');
                    },
                });
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            },

            // 删除blog
            del_event(e) {
                // 是否再次确认
                if (e.alert_status != 0 && e.alert_status != 1) {
                    app.globalData.alert({
                        msg: '确定要删除这条帖子吗？',
                        is_show_cancel: 1,
                        object: this,
                        params: { id: e.currentTarget.dataset.id },
                        method: 'del_event',
                    });
                    return false;
                }
                if (e.alert_status == 1) {
                    // 加载loding
                    uni.showLoading({
                        title: '加载中...',
                    });
                    uni.request({
                        url: app.globalData.get_request_url('delete', 'blog', 'blog'),
                        method: 'POST',
                        data: { ids: e.id },
                        success: (res) => {
                            uni.hideLoading();
                            if (res.data.code == 0) {
                                var temp_list = [];
                                var temp_data_list = this.data;
                                for (var i in temp_data_list) {
                                    if (e.id.indexOf(temp_data_list[i]['id']) == -1) {
                                        temp_list.push(temp_data_list[i]);
                                    }
                                }
                                this.setData({
                                    data: temp_list,
                                });
                                app.globalData.showToast('删除成功', 'success');
                            } else {
                                if (app.globalData.is_login_check(res.data)) {
                                    app.globalData.showToast('删除失败');
                                } else {
                                    app.globalData.showToast('提交失败，请重试！');
                                }
                            }
                        },
                        fail: () => {
                            uni.hideLoading();
                            app.globalData.showToast('网络开小差了哦~');
                        },
                    });
                }
            },
            // 滚动加载
            scroll_lower(e) {
                this.get_data_list();
            },
        },
    };
</script>
<style>
    @import './user-list.css';
</style>
