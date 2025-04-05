<template>
    <view :class="theme_view">
        <block v-if="data_list.length > 0">
            <scroll-view :scroll-y="true" class="scroll-box padding-main bs-bb" @scrolltolower="scroll_lower" lower-threshold="60">
                <view v-for="(item, index) in data_list" :key="index" class="bg-white border-radius-main padding-main oh" :class="data_list.length > index + 1 ? 'spacing-mb' : ''">
                    <view class="title flex-row jc-sb align-c wh-auto">
                        <view class="name flex-1 flex-width cr-base">{{ item.name }}{{$t('goods-list.goods-list.27nkjm')}}</view>
                        <view class="date cr-grey-9">{{ item.add_time_date }}</view>
                    </view>
                    <view class="question spacing-mt">
                        <view :data-value="item.url" @tap="url_event" class="flex-row cp">
                            <view class="title cr-white tc margin-right-sm">{{$t('goods-list.goods-list.00n7i3')}}</view>
                            <view class="flex-1 flex-width">
                                <mp-html :content="item.content" />
                                <view v-if="(item.images || null) != null && item.images.length > 0" class="avatar spacing-mt-10 radius margin-right-sm oh">
                                    <image v-for="(img, i) in item.images" class="wh-auto" @tap="comment_images_show_event" :data-index="i" :data-ix="i + 1" :src="img" mode="aspectFit"></image>
                                </view>
                            </view>
                        </view>
                    </view>
                    <block v-if="item.is_reply == 1 || (item.reply || null) != null">
                        <view class="ask flex-row spacing-mt">
                            <view class="title cr-white tc margin-right-sm">{{$t('goods-list.goods-list.rw12i7')}}</view>
                            <view class="flex-1 flex-width">
                                <view class="padding-bottom-main">
                                    <mp-html :content="item.reply" />
                                </view>
                            </view>
                        </view>
                    </block>
                    <block v-if="item.bool_more && (item.comments_list || null) != null && item.comments_list.length > 0">
                        <block v-for="(it, ix) in item.comments_list" :key="ix">
                            <view class="cr-base br-t-f9 padding-vertical-main">{{ it.content }}</view>
                            <view v-if="(it.images || null) != null && it.images.length > 0" class="avatar spacing-mt-10 radius margin-right-sm oh">
                                <block v-for="(img, i) in it.images" :key="i">
                                    <image class="wh-auto" @tap="comment_images_show_event" :data-index="i" :data-ix="i + 1" :src="img" mode="aspectFit"></image>
                                </block>
                            </view>
                        </block>
                    </block>
                    <view v-if="item.comments_count > 0" class="more flex-row jc-e align-c br-t-f9 padding-top-main">
                        <view v-if="(item.hide_more || false) === false && ((item.hide_comments_list_num === 0 && !item.bool_more) || (item.hide_comments_list_num == undefined || item.hide_comments_list_num > 0))" class="cr-red text-size-xs" @tap="open_more(item.id, index)">
                            <text v-if="item.hide_comments_list_num === 0 && !item.bool_more">{{$t('common.view_more')}}</text>
                            <text v-if="item.hide_comments_list_num == undefined || item.hide_comments_list_num > 0">{{$t('goods-list.goods-list.278qr1')}}{{ item.hide_comments_list_num || item.comments_count }}{{$t('goods-list.goods-list.8y3cc7')}}</text>
                            <iconfont :name="item.bool_more ? 'icon-arrow-bottom' : 'icon-arrow-top'" size="24rpx" propClass="pr top-xs"></iconfont>
                        </view>
                        <view v-if="item.bool_more" class="cr-red text-size-xs margin-left-main" @tap="close_more(index)">
                            <text>{{$t('goods-list.goods-list.aem3e6')}}</text>
                            <iconfont name="icon-arrow-top" size="24rpx" propClass="pr top-xs"></iconfont>
                        </view>
                    </view>
                </view>
                <!-- 结尾 -->
                <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
            </scroll-view>
        </block>
        <block v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status"></component-no-data>
        </block>

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
                params: {},
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

            // 加载数据
            this.init();

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
                if(this.data_page > 1) {
                    uni.showLoading({
                        title: this.$t('common.loading_in_text'),
                    });
                }

                // 获取数据
                uni.request({
                    url: app.globalData.get_request_url('datalist', 'index', 'ask'),
                    method: 'POST',
                    data: {
                        page: this.data_page,
                        goods_id: this.params.goods_id || 0,
                        is_comments: 1,
                    },
                    dataType: 'json',
                    success: (res) => {
                        if(this.data_page > 1) {
                            uni.hideLoading();
                        }
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
                        if(this.data_page > 1) {
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

            // 滚动加载
            scroll_lower(e) {
                this.get_data_list();
            },

            // 评价图片预览
            comment_images_show_event(e) {
                var index = e.currentTarget.dataset.index;
                var ix = e.currentTarget.dataset.ix;
                uni.previewImage({
                    current: this.data_list[index]['images'][ix],
                    urls: this.data_list[index]['images'],
                });
            },

            // 查看更多
            open_more(id, i) {
                var new_data_list = this.data_list;
                new_data_list[i].bool_more = true;
                if (new_data_list[i].bool_api === undefined || new_data_list[i].bool_api === true) {
                    // 加载loding
                    uni.showLoading({
                        title: this.$t('common.loading_in_text'),
                    });
                    // 获取数据
                    uni.request({
                        url: app.globalData.get_request_url('commentsreplylist', 'index', 'ask'),
                        method: 'POST',
                        data: {
                            ask_id: id,
                            ask_comments_id: 0,
                            page: new_data_list[i].page || 1,
                            is_comments: 1,
                        },
                        dataType: 'json',
                        success: (res) => {
                            uni.hideLoading();
                            uni.stopPullDownRefresh();
                            if (res.data.code == 0) {
                                var data = res.data.data;
                                if (data.data.length > 0) {
                                    if ((new_data_list[i].page || 1) <= 1) {
                                        new_data_list[i].comments_list = data.data;
                                    } else {
                                        new_data_list[i].comments_list = new_data_list[i].comments_list.concat(data.data);
                                    }
                                    new_data_list[i].hide_comments_list_num = data.total-new_data_list[i].comments_list.length;
                                    // 判断当前页数是否小于总页数，如果是则继续显示更多按钮，且当前页+1，如果不是则隐藏更多按钮
                                    if (data.page < data.page_total) {
                                        new_data_list[i].hide_more = false;
                                        new_data_list[i].page = (new_data_list[i].page || 1) + 1;
                                    } else {
                                        new_data_list[i].hide_more = true;
                                    }
                                    new_data_list[i].page_total = data.page_total;
                                    new_data_list[i].bool_api = true;
                                    this.setData({
                                        data_list: new_data_list,
                                    });
                                }
                            } else {
                                app.globalData.showToast(res.data.msg);
                            }
                        },
                        fail: () => {
                            uni.hideLoading();
                            app.globalData.showToast(this.$t('common.internet_error_tips'));
                        },
                    });
                } else {
                    // 查看更多是否调用接口
                    new_data_list[i].bool_api = true;
                    // 是否隐藏更多查看按钮
                    new_data_list[i].hide_more = !((new_data_list[i].hide_comments_list_num == undefined && new_data_list[i].comments_count > 0) || new_data_list[i].hide_comments_list_num < new_data_list[i].comments_count);
                    this.setData({
                        data_list: new_data_list,
                    });
                }
            },

            // 收起更多
            close_more(i) {
                var new_data_list = this.data_list;
                // 查看更多是否调用接口
                new_data_list[i].bool_api = false;
                // 是否隐藏更多查看按钮
                new_data_list[i].hide_more = false;
                // 是否展示更多内容
                new_data_list[i].bool_more = false;
                this.setData({
                    data_list: new_data_list,
                });
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            }
        },
    };
</script>
<style scoped>
    @import './goods-list.css';
</style>
