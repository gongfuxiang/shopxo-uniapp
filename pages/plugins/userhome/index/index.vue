<template>
    <view :class="theme_view">
        <!-- 首屏：feedinit 完成前整页加载，不提前露空壳 -->
        <block v-if="!page_ready">
            <component-no-data :propStatus="page_loding_status" :propMsg="page_loding_msg"></component-no-data>
        </block>

        <block v-else>
            <view v-if="(slider_list || []).length > 0" class="spacing-mb">
                <swiper class="banner-swiper" indicator-dots circular autoplay>
                    <swiper-item v-for="(item, index) in slider_list" :key="index">
                        <image class="banner-img" :src="item.images_url" mode="aspectFill" :data-value="item.event_value || ''" @tap="url_event"></image>
                    </swiper-item>
                </swiper>
            </view>

            <view v-if="(sort_list || []).length > 0" class="nav-tabs bg-white" :class="{ 'no-topic': (topic_list || []).length == 0 }" :style="'--tab-line-color:' + theme_color">
                <view class="tabs-scroll-content">
                    <view v-for="(tab, ti) in sort_list" :key="ti" class="tab-item" :class="{ active: sort == tab.value }" :data-sort="tab.value" @tap="sort_event">{{ tab.name }}</view>
                </view>
            </view>

            <scroll-view v-if="(topic_list || []).length > 0" scroll-x :show-scrollbar="false" class="topic-scroll bg-white">
                <view class="topic-scroll-content">
                    <view v-for="(topic, ti) in topic_list" :key="ti" class="topic-item" :class="topic_id == topic.id ? 'cr-main br-main' : 'cr-grey br-grey'" :data-id="topic.id" @tap="topic_event">#{{ topic.name }}</view>
                </view>
            </scroll-view>

            <view class="page-bottom-fixed padding-main">
                <block v-if="data_list.length > 0">
                    <component-moment-item v-for="(item, index) in data_list" :key="index" :propItem="item" :propEnableDetail="config.is_enable_moment_detail == 1" :propShowLike="config.is_enable_like == 1" :propShowComment="config.is_enable_comment == 1" @like="like_event" @comment-count="comment_count_event"></component-moment-item>
                    <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
                </block>
                <component-no-data v-else :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg" :propLoadingLogoTop="(slider_list || []).length > 0 ? '40vh' : ''"></component-no-data>
            </view>

            <view v-if="config.is_enable_moment == 1 || config.is_enable_userhome == 1" class="bottom-fixed bottom-actions">
                <view class="bottom-line-exclude flex-row gap-10">
                    <button v-if="config.is_enable_moment == 1" class="item flex-1 cr-white bg-main round text-size" type="default" hover-class="none" @tap="publish_event">{{$t('home.publish_moment')}}</button>
                    <button v-if="config.is_enable_moment == 1" class="item flex-1 cr-main bg-white br-main round text-size" type="default" hover-class="none" data-value="/pages/plugins/userhome/list/list" @tap="url_event">{{$t('feed.my_moment')}}</button>
                    <button v-if="config.is_enable_userhome == 1" class="item flex-1 cr-main bg-white br-main round text-size" type="default" hover-class="none" @tap="my_home_event">{{$t('feed.my_home')}}</button>
                </view>
            </view>
            <component-moment-publish ref="publish" @success="reload"></component-moment-publish>
        </block>

        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    import componentMomentItem from '@/pages/plugins/userhome/components/moment-item/moment-item';
    import componentMomentPublish from '@/pages/plugins/userhome/components/moment-publish/moment-publish';
    import pluginLocale from '@/pages/plugins/userhome/locale/index.js';
    export default {
        mixins: [pluginLocale],
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                theme_color: app.globalData.get_theme_color(),
                params: {},
                page_ready: false,
                page_loding_status: 1,
                page_loding_msg: '',
                slider_list: [],
                topic_list: [],
                sort_list: [],
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
                share_info: {},
            };
        },
        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
            componentMomentItem,
            componentMomentPublish,
        },
        onLoad(params) {
            // 参数处理
            params = app.globalData.launch_params_handle(params);
            // 设置参数
            this.setData({
                params: params || {},
                sort: params.sort == 'hot' || params.sort == 'like' ? params.sort : 'new',
                topic_id: parseInt(params.topic || 0) || 0,
            });
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);
            // 初始化
            this.init();
        },
        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();
            // 公共onshow事件（$refs 未就绪时自动延后重试）
            app.globalData.page_common_on_show(this);
            // 分享信息处理
            app.globalData.page_share_handle(this.share_info);
        },
        // 滚动加载
        onReachBottom() {
            this.get_list();
        },
        // 下拉刷新
        onPullDownRefresh() {
            this.reload();
        },
        // 自定义分享
        onShareAppMessage() {
            return app.globalData.share_content_handle(this.share_info || {});
        },
        methods: {
            // 初始化
            init() {
                this.get_init();
            },
            // 重新加载
            reload() {
                this.setData({
                    data_page: 1,
                    data_list: [],
                    data_bottom_line_status: false,
                    data_list_loding_status: 1,
                });
                // 下拉：刷新头区 + 列表；未就绪时仍走完整初始化
                if (!this.page_ready) {
                    this.get_init();
                    return;
                }
                this.get_init(true);
            },
            // 获取初始化数据
            // keep_page：已展示头区时只刷新数据，避免整页闪白
            get_init(keep_page) {
                if (!keep_page) {
                    this.setData({
                        page_ready: false,
                        page_loding_status: 1,
                        page_loding_msg: '',
                    });
                }
                uni.request({
                    url: app.globalData.get_request_url('feedinit', 'index', 'userhome'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code == 0) {
                            var data = res.data.data || {};
                            var sort_list = data.sort_list || [];
                            var sort = this.normalize_sort(this.sort, sort_list);
                            this.setData({
                                page_ready: true,
                                page_loding_status: 3,
                                slider_list: data.slider_list || [],
                                topic_list: data.topic_list || [],
                                sort_list: sort_list,
                                config: data.config || {},
                                sort: sort,
                                data_page: 1,
                                data_list: [],
                                data_bottom_line_status: false,
                                data_list_loding_status: 1,
                                data_list_loding_msg: '',
                            });
                            // 与 PC 一致：seo_title > application_name（空则接口已回退默认「动态广场」）
                            var title = data.seo_title || data.application_name || '';
                            // 仅当前仍在广场页时改标题，避免异步返回后覆盖个人主页等其它页
                            var cur = app.globalData.current_page(false) || '';
                            if (title && cur.indexOf('pages/plugins/userhome/index/index') >= 0) {
                                uni.setNavigationBarTitle({ title: title });
                            }
                            // 分享标题与导航栏一致，避免落到站点默认名
                            var share_info = {
                                title: title,
                                desc: data.seo_desc || '',
                                path: '/pages/plugins/userhome/index/index',
                                img: (data.slider_list || []).length > 0 ? data.slider_list[0].images_url || '' : '',
                            };
                            this.setData({ share_info: share_info });
                            if (cur.indexOf('pages/plugins/userhome/index/index') >= 0) {
                                app.globalData.page_share_handle(share_info);
                            }
                            this.get_list(1);
                        } else {
                            uni.stopPullDownRefresh();
                            this.setData({
                                page_ready: false,
                                page_loding_status: 0,
                                page_loding_msg: res.data.msg || '',
                            });
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            page_ready: false,
                            page_loding_status: 2,
                        });
                    },
                });
            },
            // 校正排序
            normalize_sort(sort, sort_list) {
                var list = sort_list || [];
                if (!list.length) {
                    return sort == 'hot' || sort == 'like' ? sort : 'new';
                }
                for (var i = 0; i < list.length; i++) {
                    if (list[i] && list[i].value == sort) {
                        return sort;
                    }
                }
                return (list[0] && list[0].value) || 'new';
            },
            // 获取列表
            get_list(is_mandatory) {
                if (!this.page_ready) {
                    return;
                }
                if ((is_mandatory || 0) == 0 && this.data_bottom_line_status) {
                    return;
                }
                if (this.data_is_loading == 1) {
                    return;
                }
                this.setData({ data_is_loading: 1, data_list_loding_status: this.data_list.length > 0 ? 3 : 1 });
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
            // 切换排序
            sort_event(e) {
                var sort = e.currentTarget.dataset.sort || 'new';
                this.setData({
                    sort: sort,
                    data_page: 1,
                    data_list: [],
                    data_bottom_line_status: false,
                    data_list_loding_status: 1,
                });
                this.get_list(1);
            },
            // 切换话题
            topic_event(e) {
                var id = parseInt(e.currentTarget.dataset.id || 0) || 0;
                if (id == this.topic_id) {
                    id = 0;
                }
                this.setData({
                    topic_id: id,
                    data_page: 1,
                    data_list: [],
                    data_bottom_line_status: false,
                    data_list_loding_status: 1,
                });
                this.get_list(1);
            },
            // 点赞
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
            // 评论数变更
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
            // 发布动态（事件总线，避免小程序 $refs 被异步组件拖垮）
            publish_event() {
                try {
                    if (this.$refs.publish && this.$refs.publish.open) {
                        this.$refs.publish.open();
                        return;
                    }
                } catch (e) {}
                uni.$emit('plugins_userhome_publish_open');
            },
            // 我的主页
            my_home_event() {
                var user = app.globalData.get_user_info(this, 'my_home_event');
                if (user == false || !user.id) {
                    return;
                }
                app.globalData.url_event({ currentTarget: { dataset: { value: '/pages/plugins/userhome/home/home?id=' + user.id } } });
            },
            // 链接事件
            url_event(e) {
                app.globalData.url_event(e);
            },
        },
    };
</script>
<style scoped>
    @import './index.css';
</style>
