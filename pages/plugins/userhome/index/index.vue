<template>
    <view :class="theme_view">
        <view v-if="(slider_list || []).length > 0" class="spacing-mb">
            <swiper class="banner-swiper" indicator-dots circular autoplay>
                <swiper-item v-for="(item, index) in slider_list" :key="index">
                    <image class="banner-img" :src="item.images_url" mode="aspectFill" :data-value="item.event_value || ''" @tap="url_event"></image>
                </swiper-item>
            </swiper>
        </view>

        <view class="nav-tabs bg-white" :class="{ 'no-topic': (topic_list || []).length == 0 }" :style="'--tab-line-color:' + theme_color">
            <view class="tabs-scroll-content">
                <view class="tab-item" :class="{ active: sort == 'new' }" data-sort="new" @tap="sort_event">{{$t('feed.sort_new')}}</view>
                <view class="tab-item" :class="{ active: sort == 'hot' }" data-sort="hot" @tap="sort_event">{{$t('feed.sort_hot')}}</view>
                <view v-if="config.is_enable_like == 1" class="tab-item" :class="{ active: sort == 'like' }" data-sort="like" @tap="sort_event">{{$t('feed.sort_like')}}</view>
            </view>
        </view>

        <scroll-view v-if="(topic_list || []).length > 0" scroll-x :show-scrollbar="false" class="topic-scroll bg-white">
            <view class="topic-scroll-content">
                <view v-for="(topic, ti) in topic_list" :key="ti" class="topic-item" :class="topic_id == topic.id ? 'cr-main br-main' : 'cr-grey br-grey'" :data-id="topic.id" @tap="topic_event">#{{ topic.name }}</view>
            </view>
        </scroll-view>

        <view class="page-bottom-fixed padding-main">
            <block v-if="data_list.length > 0">
                <component-moment-item v-for="(item, index) in data_list" :key="item.id || index" :propItem="item" :propEnableDetail="config.is_enable_moment_detail == 1" :propShowLike="config.is_enable_like == 1" :propShowComment="config.is_enable_comment == 1" @like="like_event" @comment-count="comment_count_event"></component-moment-item>
                <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
            </block>
            <component-no-data v-else :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </view>

        <view v-if="config.is_enable_moment == 1" class="bottom-fixed">
            <view class="bottom-line-exclude padding-main flex-row gap-10">
                <button class="item flex-1 cr-white bg-main round text-size" type="default" hover-class="none" @tap="publish_event">{{$t('home.publish_moment')}}</button>
                <button class="item flex-1 cr-main bg-white br-main round text-size" type="default" hover-class="none" data-value="/pages/plugins/userhome/list/list" @tap="url_event">{{$t('feed.my_moment')}}</button>
            </view>
        </view>
        <component-moment-publish ref="publish" @success="reload"></component-moment-publish>
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    import componentMomentItem from '../components/moment-item/moment-item';
    import componentMomentPublish from '../components/moment-publish/moment-publish';
    import pluginLocale from '../locale/index.js';
    export default {
        mixins: [pluginLocale],
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                theme_color: app.globalData.get_theme_color(),
                params: {},
                slider_list: [],
                topic_list: [],
                config: {},
                sort: 'new',
                topic_id: 0,
                data_list: [],
                data_page: 1,
                data_page_total: 0,
                data_bottom_line_status: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_is_loading: 0,
            };
        },
        components: { componentCommon, componentNoData, componentBottomLine, componentMomentItem, componentMomentPublish },
        onLoad(params) {
            params = app.globalData.launch_params_handle(params);
            this.setData({
                params: params || {},
                sort: params.sort == 'hot' || params.sort == 'like' ? params.sort : 'new',
                topic_id: parseInt(params.topic || 0) || 0,
            });
            app.globalData.page_event_onload_handle(params);
        },
        onShow() {
            app.globalData.page_event_onshow_handle();
            this.init();
            app.globalData.page_common_on_show(this);
        },
        onReachBottom() {
            this.get_list();
        },
        onPullDownRefresh() {
            this.reload();
        },
        methods: {
            init() {
                this.get_init();
            },
            reload() {
                this.setData({ data_page: 1, data_list: [], data_bottom_line_status: false });
                this.get_init();
            },
            get_init() {
                uni.request({
                    url: app.globalData.get_request_url('feedinit', 'index', 'userhome'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code == 0) {
                            var data = res.data.data || {};
                            this.setData({
                                slider_list: data.slider_list || [],
                                topic_list: data.topic_list || [],
                                config: data.config || {},
                            });
                            if (data.application_name) {
                                uni.setNavigationBarTitle({ title: data.application_name });
                            }
                        }
                        this.get_list(1);
                    },
                    fail: () => {
                        this.get_list(1);
                    },
                });
            },
            get_list(is_mandatory) {
                if ((is_mandatory || 0) == 0 && this.data_bottom_line_status) {
                    return;
                }
                if (this.data_is_loading == 1) {
                    return;
                }
                this.setData({ data_is_loading: 1, data_list_loding_status: 1 });
                uni.request({
                    url: app.globalData.get_request_url('feed', 'index', 'userhome'),
                    method: 'POST',
                    data: {
                        page: this.data_page,
                        sort: this.sort,
                        topic: this.topic_id > 0 ? this.topic_id : '',
                    },
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data || {};
                            var list = data.data || [];
                            var temp = this.data_page <= 1 ? list : (this.data_list || []).concat(list);
                            var page_total = data.page_total || 0;
                            var next_page = this.data_page + 1;
                            this.setData({
                                data_list: temp,
                                data_page_total: page_total,
                                data_page: next_page,
                                data_list_loding_status: temp.length > 0 ? 3 : 0,
                                data_bottom_line_status: next_page > page_total || data.has_more == 0,
                                data_is_loading: 0,
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
                        this.setData({ data_is_loading: 0, data_list_loding_status: 2 });
                    },
                });
            },
            sort_event(e) {
                var sort = e.currentTarget.dataset.sort || 'new';
                if (sort == this.sort) {
                    return;
                }
                this.setData({ sort: sort, data_page: 1, data_list: [], data_bottom_line_status: false });
                this.get_list(1);
            },
            topic_event(e) {
                var id = parseInt(e.currentTarget.dataset.id || 0) || 0;
                // 再点一次取消选中，topic 传空
                if (id == this.topic_id) {
                    id = 0;
                }
                this.setData({ topic_id: id, data_page: 1, data_list: [], data_bottom_line_status: false });
                this.get_list(1);
            },
            like_event(item) {
                var user = app.globalData.get_user_info(this, 'like_event');
                if (user == false || !item || !item.id) {
                    return;
                }
                uni.request({
                    url: app.globalData.get_request_url('like', 'index', 'userhome'),
                    method: 'POST',
                    data: { moment_id: item.id },
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code == 0) {
                            var list = (this.data_list || []).map((row) => {
                                if (row.id == item.id) {
                                    return {
                                        ...row,
                                        is_like: res.data.data.is_like,
                                        like_count: res.data.data.like_count,
                                    };
                                }
                                return row;
                            });
                            this.setData({ data_list: list });
                        } else {
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                });
            },
            comment_count_event(e) {
                if (!e || !e.item || !e.item.id) {
                    return;
                }
                var list = (this.data_list || []).map((row) => {
                    if (row.id == e.item.id) {
                        return {
                            ...row,
                            comment_count: e.count,
                        };
                    }
                    return row;
                });
                this.setData({ data_list: list });
            },
            publish_event() {
                if (this.$refs.publish && this.$refs.publish.open) {
                    this.$refs.publish.open();
                }
            },
            url_event(e) {
                app.globalData.url_event(e);
            },
        },
    };
</script>
<style scoped>
    .banner-swiper,
    .banner-img {
        width: 100%;
        height: 280rpx;
    }
    .nav-tabs {
        padding: 10rpx 24rpx 0;
    }
    .nav-tabs.no-topic {
        padding-bottom: 24rpx;
    }
    .tabs-scroll-content {
        display: flex;
        align-items: center;
        gap: 48rpx;
    }
    .tab-item {
        position: relative;
        white-space: nowrap;
        padding-bottom: 16rpx;
        font-weight: 500;
        font-size: 28rpx;
        color: #666;
        line-height: 52rpx;
    }
    .tab-item.active {
        color: var(--tab-line-color, var(--color-main, #2f8f62));
        font-weight: 600;
    }
    .tab-item::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 4px;
        background-color: var(--tab-line-color, var(--color-main, #2f8f62));
        transition: width 0.6s linear;
        border-radius: 8rpx;
    }
    .tab-item.active::after {
        width: 52rpx;
    }
    .topic-scroll {
        width: 100%;
        white-space: nowrap;
        padding: 16rpx 24rpx;
        box-sizing: border-box;
    }
    .topic-scroll-content {
        display: inline-flex;
        align-items: center;
        gap: 16rpx;
    }
    .topic-item {
        flex-shrink: 0;
        padding: 8rpx 20rpx;
        border-radius: 999rpx;
        border-width: 1px;
        border-style: solid;
        font-size: 24rpx;
    }
    /* #ifdef MP-WEIXIN || APP-PLUS */
    .topic-scroll ::v-deep ::-webkit-scrollbar {
        width: 0 !important;
        height: 0 !important;
        background-color: transparent;
    }
    /* #endif */
</style>
