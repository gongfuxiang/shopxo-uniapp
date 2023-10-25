<template>
    <view class="padding-main">
        <block v-if="data_list.length > 0">
            <view v-for="(item, index) in data_list" :key="index" class="bg-white border-radius-main padding-main oh" :class="data_list.length > index + 1 ? 'spacing-b':''">
                <view class="title flex-row jc-sb align-c wh-auto">
                    <view class="name flex-1 flex-width cr-base">{{ item.name }}的提问</view>
                    <view class="date cr-grey-9">{{ item.add_time_date }}</view>
                </view>
                <view class="question flex-row spacing-mt">
                    <view class="title cr-white tc margin-right-sm">问</view>
                    <view class="flex-1 flex-width">
                        <view class="fw-b">{{ item.content }}</view>
                        <view v-if="(item.images || null) != null && item.images.length > 0" class="avatar spacing-mt-10 radius margin-right-sm oh">
                            <image class="wh-auto" @tap="comment_images_show_event" :data-index="index" :data-ix="ix" :src="iv" mode="aspectFit"></image>
                        </view>
                    </view>
                </view>
                <block v-if="item.is_reply == 1 || item.comments_count > 0 ">
                    <view class="ask flex-row spacing-mt">
                        <view class="title cr-white tc margin-right-sm">答</view>
                        <view class="flex-1 flex-width">
                            <view class="cr-base">
                                <block v-if="item.reply">
                                    {{ item.reply }}
                                </block>
                                <block v-if="(item.comments_list || null ) !== null && item.comments_list.length > 0 ">
                                    {{ item.comments_list[0].content }}
                                </block>
                            </view>
                            <view v-if="(item.images || null) != null && item.images.length > 0" class="avatar spacing-mt-10 radius margin-right-sm oh">
                                <image class="wh-auto" @tap="comment_images_show_event" :data-index="index" :data-ix="ix" :src="iv" mode="aspectFit"></image>
                            </view>
                        </view>
                    </view>
                    <view class="more flex-row jc-e align-c spacing-mt">
                        <navigator :url="item.url" hover-class="none">
                            <view class="cr-red text-size-xs">
                                查看全部{{ item.comments_count }}个回答
                                <iconfont name="icon-qiandao-jiantou2" size="24rpx" class="pr top-xs"></iconfont>
                            </view>
                        </navigator>
                    </view>
                </block>
            </view>
            <!-- 结尾 -->
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
        </block>
        <block v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status"></component-no-data>
        </block>
    </view>
</template>

<script>
    const app = getApp();
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';

    export default {
        data() {
            return {
                data_list: [],
                data_total: 0,
                data_page_total: 0,
                data_page: 1,
                data_list_loding_status: 1,
                data_bottom_line_status: false,
                data_is_loading: 0,
                goods_id: null,
            };
        },

        components: {
            componentNoData,
            componentBottomLine,
        },
        props: {},

        onLoad(params) {
            if (params || params.goods_id) {
                this.setData({
                    goods_id: params.goods_id,
                });
            }
        },

        onShow() {
            this.init();
        },

        methods: {
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    // 用户未绑定用户则转到登录页面
                    if (app.globalData.user_is_need_login(user)) {
                        uni.redirectTo({
                            url: '/pages/login/login?event_callback=init',
                        });
                        return false;
                    } else {
                        // 获取数据
                        this.get_data_list();
                    }
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
                uni.showLoading({
                    title: '加载中...',
                });

                // 获取数据
                uni.request({
                    url: app.globalData.get_request_url('datalist', 'index', 'ask'),
                    method: 'POST',
                    data: {
                        page: this.data_page,
                        goods_id: this.goods_id,
                        is_comments: 1,
                    },
                    dataType: 'json',
                    success: (res) => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            if (res.data.data.data.length > 0) {
                                if (this.data_page <= 1) {
                                    var temp_data_list = res.data.data.data;
                                } else {
                                    var temp_data_list = this.data_list || [];
                                    var temp_data = res.data.data.data;
                                    for (var i in temp_data) {
                                        temp_data_list.push(temp_data[i]);
                                    }
                                }
                                this.setData({
                                    data_list: temp_data_list,
                                    data_total: res.data.data.total,
                                    data_page_total: res.data.data.page_total,
                                    data_list_loding_status: 3,
                                    data_page: this.data_page + 1,
                                    data_is_loading: 0,
                                });
                                console.log(this.data_list);

                                // 是否还有数据
                                this.setData({
                                    data_bottom_line_status: this.data_page > 1 && this.data_page > this.data_page_total,
                                });
                            } else {
                                this.setData({
                                    data_list_loding_status: 0,
                                    data_is_loading: 0,
                                });
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
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_is_loading: 0,
                        });
                        app.globalData.showToast('服务器请求出错');
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
        },
    };
</script>
<style scoped>
    @import './goods-list.css';
</style>
