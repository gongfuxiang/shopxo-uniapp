<template>
    <view :class="theme_view">
        <view v-if="data_list.length > 0" class="padding-horizontal-main padding-top-main">
            <view v-for="(item, index) in data_list" :key="index" class="comment-item bg-white border-radius-main padding-main spacing-mb">
                <view class="flex-row align-c">
                    <image v-if="(item.user || null) != null && (item.user.avatar || '') != ''" class="user-avatar circle margin-right-sm" :src="item.user.avatar" mode="aspectFill"></image>
                    <view class="flex-1 flex-width">
                        <view class="text-size-sm">{{ ((item.user || null) == null) ? '' : (item.user.user_name_view || '') }}</view>
                        <view class="cr-grey text-size-xs margin-top-xs">{{ item.add_time }}</view>
                    </view>
                    <view class="cr-main text-size-sm">{{ item.rating }}{{ $t('orderallot-comments.score_unit') }}</view>
                </view>
                <view v-if="(item.target || null) != null" class="target-row margin-top-sm flex-row align-c cp" :data-value="target_url(item)" @tap="url_event">
                    <image v-if="target_cover(item) != ''" class="target-cover radius br margin-right-sm flex-shrink-0" :src="target_cover(item)" mode="aspectFill"></image>
                    <view v-else class="target-cover target-cover-placeholder radius br margin-right-sm flex-shrink-0 flex-row align-c jc-c">
                        <iconfont :name="item.comment_type == 'staff' ? 'icon-user' : 'icon-shopping-bag'" size="32rpx" color="#ccc"></iconfont>
                    </view>
                    <view class="flex-1 flex-width text-size-sm multi-text">{{ target_title(item) }}</view>
                    <iconfont name="icon-arrow-right" size="24rpx" color="#999" propClass="margin-left-xs flex-shrink-0"></iconfont>
                </view>
                <view class="margin-top-sm text-size-sm">{{ item.content }}</view>
                <view v-if="(item.images || null) != null && item.images.length > 0" class="margin-top-sm flex-row flex-wrap">
                    <image
                        v-for="(img, ii) in item.images"
                        :key="ii"
                        class="comment-image radius br margin-right-sm margin-bottom-sm"
                        :src="img"
                        mode="aspectFill"
                        :data-index="index"
                        :data-ix="ii"
                        @tap="comment_images_show_event"
                    ></image>
                </view>
                <view v-if="(item.reply || '') != ''" class="margin-top-sm padding-sm bg-grey-f8 border-radius-sm text-size-xs">
                    <text class="cr-main">{{ $t('orderallot-comments.reply') }}</text>{{ item.reply }}
                </view>
            </view>
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
        </view>
        <view v-else>
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </view>
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
                params: null,
                data_list: [],
                data_page: 1,
                data_page_total: 0,
                data_is_loading: 0,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_bottom_line_status: false,
            };
        },
        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
        },
        onLoad(params) {
            params = app.globalData.launch_params_handle(params);
            app.globalData.page_event_onload_handle(params);
            this.setData({ params: params });
            this.get_data_list(1);
        },
        onShow() {
            app.globalData.page_event_onshow_handle();
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }
        },
        onPullDownRefresh() {
            this.setData({
                data_page: 1,
                data_list: [],
                data_bottom_line_status: false,
            });
            this.get_data_list(1);
        },
        onReachBottom() {
            this.get_data_list();
        },
        methods: {
            // 评价对象封面（商品 images / 人员 avatar）
            target_cover(item) {
                if ((item || null) == null || (item.target || null) == null) {
                    return '';
                }
                var t = item.target;
                return (t.images || '') != '' ? t.images : ((t.avatar || '') != '' ? t.avatar : '');
            },
            // 评价对象标题
            target_title(item) {
                if ((item || null) == null || (item.target || null) == null) {
                    return '';
                }
                var t = item.target;
                if (item.comment_type == 'staff') {
                    return (t.alias || '') != '' ? t.alias : (t.title || '');
                }
                return t.title || '';
            },
            // 评价对象详情地址
            target_url(item) {
                if ((item || null) == null || (item.target || null) == null) {
                    return '';
                }
                var t = item.target;
                if ((t.goods_url || '') != '') {
                    return t.goods_url;
                }
                if ((t.url || '') != '') {
                    return t.url;
                }
                if (item.comment_type == 'goods' && (t.id || 0) > 0) {
                    return '/pages/goods-detail/goods-detail?id=' + t.id;
                }
                if (item.comment_type == 'staff' && (t.id || 0) > 0) {
                    return '/pages/plugins/realstore/staff-detail/staff-detail?id=' + t.id;
                }
                return '';
            },
            // url 跳转
            url_event(e) {
                app.globalData.url_event(e);
            },
            // 评价图片预览（多图可左右切换）
            comment_images_show_event(e) {
                var index = parseInt(e.currentTarget.dataset.index);
                var ix = parseInt(e.currentTarget.dataset.ix);
                var item = (this.data_list || [])[index] || null;
                if (item == null || (item.images || null) == null || item.images.length <= 0) {
                    return;
                }
                uni.previewImage({
                    current: item.images[ix] || item.images[0],
                    urls: item.images,
                });
            },
            // 获取服务评价列表
            get_data_list(is_mandatory) {
                if ((is_mandatory || 0) == 0 && this.data_bottom_line_status) {
                    return false;
                }
                if (this.data_is_loading == 1) {
                    return false;
                }
                this.setData({ data_is_loading: 1, data_list_loding_status: 1 });
                var post = {
                    page: this.data_page,
                    realstore_id: this.params.realstore_id || 0,
                    staff_id: this.params.staff_id || 0,
                    goods_id: this.params.goods_id || 0,
                };
                uni.request({
                    url: app.globalData.get_request_url('datalist', 'servicecomments', 'realstore'),
                    method: 'POST',
                    data: post,
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data || {};
                            var list = data.data || [];
                            var temp = this.data_page <= 1 ? list : (this.data_list || []).concat(list);
                            this.setData({
                                data_list: temp,
                                data_total: data.total || 0,
                                data_page_total: data.page_total || 0,
                                data_page: this.data_page + 1,
                                data_is_loading: 0,
                                data_list_loding_status: temp.length > 0 ? 3 : 0,
                                data_list_loding_msg: '',
                                data_bottom_line_status: temp.length > 0 && this.data_page + 1 > (data.page_total || 0),
                            });
                        } else {
                            this.setData({
                                data_is_loading: 0,
                                data_list_loding_status: 0,
                                data_list_loding_msg: res.data.msg,
                            });
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_is_loading: 0,
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                    },
                });
            },
        },
    };
</script>
<style>
.user-avatar {
    width: 64rpx;
    height: 64rpx;
    flex-shrink: 0;
}
.target-cover {
    width: 72rpx;
    height: 72rpx;
}
.target-cover-placeholder {
    background: #f5f5f5;
}
.comment-image {
    width: 160rpx;
    height: 160rpx;
}
</style>
