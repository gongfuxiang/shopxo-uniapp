<template>
    <view>        
        <view v-if="(data || null) != null" class="padding-main">
            <view class="padding-main border-radius-main bg-white spacing-mb">
                <view class="fw-b text-size-xl">{{data.title}}</view>
                <view class="cr-grey margin-top-lg oh br-t padding-top-main">
                    <view class="fl">
                        <text>发布时间：</text>
                        <text>{{data.add_time}}</text>
                    </view>
                    <view class="fr">
                        <text class="margin-left-xxxl">浏览次数：</text>
                        <text>{{data.access_count}}</text>
                    </view>
                </view>
            </view>
            <view v-if="(data.content || null) != null" class="padding-main border-radius-main bg-white oh spacing-mb">
                <rich-text :nodes="data.content"></rich-text>
            </view>
            <view v-if="(last_next || null) != null" class="last-next-data spacing-mb">
                <view v-if="(last_next.last || null) != null">
                    <text class="cr-gray va-m">上一篇：</text>
                    <navigator :url="last_next.last.url" open-type="redirect" hover-class="none" class="dis-inline-block va-m cr-blue">{{last_next.last.title}}</navigator>
                </view>
                <view v-if="(last_next.next || null) != null" class="margin-top-sm">
                    <text class="cr-gray va-m">下一篇：</text>
                    <navigator :url="last_next.next.url" open-type="redirect" hover-class="none" class="dis-inline-block va-m cr-blue">{{last_next.next.title}}</navigator>
                </view>
            </view>
        </view>
        <view v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import componentNoData from "../../components/no-data/no-data";
    import componentBottomLine from "../../components/bottom-line/bottom-line";

    export default {
        data() {
            return {
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_bottom_line_status: false,
                params: null,
                data: null,
                last_next: null
            };
        },

        components: {
            componentNoData,
            componentBottomLine
        },
        props: {},

        onLoad(params) {
            // 启动参数处理
            params = app.globalData.launch_params_handle(params);
            this.setData({
                params: params
            });
            
            // 数据加载
            this.get_data();
            
            // 显示分享菜单
            app.globalData.show_share_menu();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.get_data();
        },

        // 自定义分享
        onShareAppMessage() {
            var user_id = app.globalData.get_user_cache_info('id', 0) || 0;
            var article_id = this.params.id || 0;
            return {
                title: this.data.seo_title || this.data.title || app.globalData.data.application_title,
                desc: this.data.seo_desc || app.globalData.data.application_describe,
                path: '/pages/article-detail/article-detail?id='+article_id+'&referrer=' + user_id
            };
        },

        // 分享朋友圈
        onShareTimeline() {
            var user_id = app.globalData.get_user_cache_info('id', 0) || 0;
            var article_id = this.params.id || 0;
            return {
                title: this.data.seo_title || this.data.title || app.globalData.data.application_title,
                query: 'id='+article_id+'&referrer=' + user_id
            };
        },

        methods: {
            // 初始化
            get_data() {
                uni.showLoading({
                    title: "加载中..."
                });
                uni.request({
                    url: app.globalData.get_request_url("detail", "article"),
                    method: "POST",
                    data: {
                        id: this.params.id || 0,
                    },
                    dataType: "json",
                    success: res => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        var data = res.data.data;
                        if (res.data.code == 0 && (data.data || null) != null) {
                            this.setData({
                                data_bottom_line_status: true,
                                data_list_loding_status: 3,
                                data: data.data,
                                last_next: data.last_next || null
                            });
                            
                            // 标题
                            uni.setNavigationBarTitle({title: data.data.title});
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                                data_list_loding_msg: res.data.msg
                            });
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2
                        });
                        app.globalData.showToast("服务器请求出错");
                    }
                });
            }
        }
    };
</script>
<style>
    @import './article-detail.css';
</style>