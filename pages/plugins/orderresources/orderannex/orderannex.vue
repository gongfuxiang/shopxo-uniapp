<template>
    <view :class="theme_view">
        <block v-if="(data || null) != null && ((data.images_data || null) != null || (data.video_data || null) != null || (data.file_data || null) != null || (data.note || null) != null)">
            <!-- 图片 -->
            <view v-if="(data.images_data || null) != null" class="images-data-list padding-vertical-main padding-left-main margin-bottom-lg">
                <view class="fw-b text-size-sm margin-bottom padding-bottom-sm br-b">{{$t('common.image')}}</view>
                <view class="item flex-row flex-wrap align-s gap-10">
                    <view v-for="(item, index) in data.images_data" :key="index" class="item-content">
                        <image :src="item" mode="aspectFill" class="image radius wh-auto" :data-value="item" @tap="image_show_event"></image>
                        <view class="tc br-green cr-green round text-size-xs padding-vertical-xs" :data-value="item" @tap="text_copy_event">{{$t('common.copy_link')}}</view>
                    </view>
                </view>
            </view>

            <!-- 视频 -->
            <view v-if="(data.video_data || null) != null" class="video-data-list padding-main margin-bottom-lg">
                <view class="fw-b text-size-sm margin-bottom padding-bottom-sm br-b">{{$t('common.video')}}</view>
                <view class="item flex-row flex-wrap align-s gap-10">
                    <view v-for="(item, index) in data.video_data" :key="index" class="item-content">
                        <video :src="item" class="video radius wh-auto"></video>
                        <view class="tc br-green cr-green round text-size-xs padding-vertical-xs" :data-value="item" @tap="text_copy_event">{{$t('common.copy_link')}}</view>
                    </view>
                </view>
            </view>

            <!-- 文件 -->
            <view v-if="(data.file_data || null) != null" class="file-data-list padding-main margin-bottom-lg">
                <view class="fw-b text-size-sm margin-bottom padding-bottom-sm br-b">{{$t('common.file')}}</view>
                <view class="item flex-row flex-wrap align-s gap-10">
                    <view v-for="(item, index) in data.file_data" :key="index" class="item-content">
                        <text :src="item.url">{{item.title}}</text>
                        <text class="tc br-green cr-green round text-size-xs padding-vertical-xs padding-horizontal-sm margin-left-sm" :data-value="item.url" @tap="text_copy_event">{{$t('common.copy_link')}}</text>
                    </view>
                </view>
            </view>
            
            <!-- 备注 -->
            <view v-if="(data.note || null) != null" class="file-data-list padding-main margin-bottom-lg">
                <view class="fw-b text-size-sm margin-bottom padding-bottom-sm br-b">{{$t('common.note')}}</view>
                <view>{{data.note}}</view>
            </view>

            <!-- 结尾 -->
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
        </block>
        <block v-else>
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
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
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_bottom_line_status: false,
                params: null,
                data: null
            };
        },
        components: {
            componentCommon,
            componentNoData,
            componentBottomLine
        },
        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 参数
            this.setData({
                params: app.globalData.launch_params_handle(params)
            });
            this.init();
        },
        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }

            // 分享菜单处理
            app.globalData.page_share_handle();
        },
        // 下拉刷新
        onPullDownRefresh() {
            this.init();
        },
        methods: {
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    this.get_data();
                } else {
                    this.setData({
                        data_list_loding_status: 0,
                        data_bottom_line_status: false,
                    });
                }
            },

            // 获取公共数据
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url('index', 'orderannex', 'orderresources'),
                    method: 'POST',
                    data: this.params,
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
                                data: data.data || null,
                                data_list_loding_status: 0,
                                data_list_loding_msg: '',
                                data_bottom_line_status: true,
                                data_page: 1,
                            });
                            this.get_data_list();
                        } else {
                            this.setData({
                                data_bottom_line_status: false,
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg,
                            });
                            if (app.globalData.is_login_check(res.data, this, 'get_data')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_bottom_line_status: false,
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                    },
                });
            },

            // 图片查看
            image_show_event(e) {
                app.globalData.image_show_event(e, this.data.images_data);
            },

            // 文本复制
            text_copy_event(e) {
                app.globalData.text_copy_event(e);
            }
        }
    };
</script>
<style>
    @import './orderannex.css';
</style>