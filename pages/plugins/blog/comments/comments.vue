<template>
    <view :class="theme_view">
        <view v-if="(data || null) != null" class="padding-main bg-white">
            <!-- 评论内容 -->
            <component-blog-comments :propData="data" :propDataBase="data_base" :propEmojiList="emoji_list" propType="comments"></component-blog-comments>
            <!-- 结尾 -->
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
        </view>
        <view v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
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
    import componentBlogComments from '../components/blog-comments/blog-comments';
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_bottom_line_status: false,
                params: null,
                data_base: null,
                data: null,
                emoji_list: [],
                // 自定义分享信息
                share_info: {},
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
            componentBlogComments,
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            this.setData({
                params: params,
            });

            // 数据加载
            this.get_data();
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }
        },

        methods: {
            // 初始化
            get_data() {
                uni.showLoading({
                    title: this.$t('common.loading_in_text'),
                });
                uni.request({
                    url: app.globalData.get_request_url('commentsinfo', 'index', 'blog'),
                    method: 'POST',
                    data: {
                        id: this.params.id || 0,
                    },
                    dataType: 'json',
                    success: (res) => {
                        uni.hideLoading();
                        var data = res.data.data;
                        if (res.data.code == 0 && (data.data || null) != null) {
                            var blog = data.data;
                            this.setData({
                                data_bottom_line_status: true,
                                data_list_loding_status: 3,
                                data_base: data.base || null,
                                data: blog,
                                emoji_list: data.emoji_list || [],
                            });

                            // 基础自定义分享
                            this.setData({
                                share_info: {
                                    title: this.data.seo_title || this.data.title,
                                    desc: this.data.seo_desc || this.data.describe,
                                    path: '/pages/plugins/blog/detail/detail',
                                    query: 'id=' + this.data.id,
                                    img: this.data.cover,
                                },
                            });
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                                data_list_loding_msg: res.data.msg,
                            });
                            app.globalData.showToast(res.data.msg);
                        }

                        // 分享菜单处理
                        app.globalData.page_share_handle(this.share_info);
                    },
                    fail: () => {
                        uni.hideLoading();
                        this.setData({
                            data_list_loding_status: 2,
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },
        },
    };
</script>
<style></style>
