<template>
    <view :class="theme_view">
        <view v-if="data.length > 0">
            <view class="page-bottom-fixed padding-top-main">
                <view v-for="(item, index) in data" class="bg-white spacing-mb" :key="index">
                    <view class="padding-main flex-row">
                        <view>
                            <image class="blog-img radius" :src="item.images" mode="aspectFit"></image>
                        </view>
                        <view class="flex-1 flex-width padding-left-main">
                            <view class="multi-text text-size fw-b margin-bottom-xs">{{ item.title }}</view>
                            <view class="text-size-sm cr-grey-9 margin-bottom-sm">{{ item.date }}</view>
                            <view class="badge">{{ item.reviewed === 1 ? '已审核' : '未审核' }}</view>
                        </view>
                    </view>
                    <view class="br-t-f5 padding-vertical-main flex-row jc-sa align-c text-size tc">
                        <view class="cr-base flex-1 divider-r-f5" :data-value="'/pages/plugins/blog/form/form?id=' + item.id" @tap="url_event">
                            <view class="pr top-xs margin-right-xs dis-inline-block">
                                <iconfont name="icon-wenda-wytw" size="32rpx"></iconfont>
                            </view>
                            编辑
                        </view>
                        <view class="cr-main flex-1" :data-id="item.id" @tap="del_event">
                            <view class="pr top-xs margin-right-xs dis-inline-block">
                                <iconfont name="icon-blog-del" size="32rpx"></iconfont>
                            </view>
                            删除
                        </view>
                    </view>
                </view>
            </view>

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
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                theme_color: app.globalData.get_theme_color(),
                data_list_loding_status: 1,
                data: [
                    {
                        id: '1',
                        images: 'http://shopxo.com/static/upload/images/plugins_homemiddleadv/2023/08/18/1692328288709779.png',
                        title: '歌手2024惊艳登场，陈出生、两进入领衔，人气爆棚啦！！！！！',
                        date: '2023-09-04 10:12:50',
                        reviewed: 1,
                    },
                ],
            };
        },
        components: {
            componentNoData,
        },

        onLoad(params) {},

        onShow() {
            // 数据加载
            this.init();
        },

        // 下拉刷新
        onPullDownRefresh() {},

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
                    this.get_data_list();
                } else {
                    // 提示错误
                    this.setData({
                        data_list_loding_status: 2,
                        data_list_loding_msg: '用户未登录',
                    });
                }
            },
            get_data_list() {
                // 加载loding
                uni.showLoading({
                    title: '加载中...',
                });
                this.setData({
                    data_list_loding_status: 1,
                });
                uni.request({
                    url: app.globalData.get_request_url('index', 'goodscomments', 'intellectstools'),
                    method: 'POST',
                    success: (res) => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            this.setData({
                                // data: res.data.data.data || [],
                                data_list_loding_status: 3,
                            });
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                            });
                            if (app.globalData.is_login_check(res.data, this, 'get_data_list')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        this.setData({
                            data_list_loding_status: 2,
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
                    this.setData({
                        data_list_loding_status: 1,
                    });
                    uni.request({
                        url: app.globalData.get_request_url('index', 'goodscomments', 'intellectstools'),
                        method: 'POST',
                        data: { id: e.id },
                        success: (res) => {
                            uni.hideLoading();
                            if (res.data.code == 0) {
                                this.setData({
                                    // data: res.data.data.data || [],
                                    data_list_loding_status: 3,
                                });
                            } else {
                                this.setData({
                                    data_list_loding_status: 0,
                                });
                                if (app.globalData.is_login_check(res.data, this, 'del_event')) {
                                    app.globalData.showToast(res.data.msg);
                                }
                            }
                        },
                        fail: () => {
                            uni.hideLoading();
                            this.setData({
                                data_list_loding_status: 2,
                            });
                            app.globalData.showToast('网络开小差了哦~');
                        },
                    });
                }
            },
        },
    };
</script>
<style>
    @import './user-list.css';
</style>
