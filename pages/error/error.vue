<template>
    <view :class="theme_view">
        <view class="content padding-horizontal-main tc">
            <view class="margin-top-xxxl">
                <icon type="warn" size="16" color="#f00" class="va-m" />
                <view class="cr-red va-m dis-inline-block margin-left-sm">
                    <block v-if="(params || null) != null && (params.msg || null) != null">{{params.msg}}</block>
                    <block v-else>{{$t('error.error.u697ih')}}</block>
                </view>
            </view>
            <view class="margin-top-xxl">
                <button type="default" size="mini" class="bg-main br-main cr-white round text-size-sm padding-left-xxxl padding-right-xxxl padding-top-xs padding-bottom-xs margin-top-xl" @tap="back_event">{{$t('common.return')}}</button>
            </view>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import base64 from '@/common/js/lib/base64.js';

    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                params: null
            };
        },
        components: {},

        // 页面加载初始化
        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            if((params.msg || null) != null) {
                params['msg'] = base64.decode(decodeURIComponent(params.msg));
            }
            this.setData({
                params: params
            });
        },

        // 页面显示
        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 分享菜单处理
            app.globalData.page_share_handle();
        },

        // 方法
        methods: {
            // 返回
            back_event(e) {
                app.globalData.page_back_prev_event();
            }
        }
    };
</script>
<style>
    .content {
        padding-top: 30%;
    }
</style>