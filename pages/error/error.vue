<template>
    <view>
        <view class="content padding-horizontal-main tc">
            <view class="margin-top-xxxl">
                <icon type="warn" size="16" color="#f00" class="va-m" />
                <view class="cr-red va-m dis-inline-block margin-left-sm">
                    <block v-if="(params || null) != null && (params.msg || null) != null">{{params.msg}}</block>
                    <block v-else>异常错误</block>
                </view>
            </view>
            <view class="margin-top-xxl">
                <button type="default" size="mini" class="bg-main br-main cr-white round text-size-sm padding-left-xxxl padding-right-xxxl padding-top-xs padding-bottom-xs margin-top-xl" @tap="back_event">返回</button>
            </view>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import base64 from '../../common/js/lib/base64.js';

    export default {
        data() {
            return {
                params: null
            };
        },
        components: {},
        props: {},

        // 页面加载初始化
        onLoad(params) {
            console.log(params);
            if((params.msg || null) != null) {
                params['msg'] = base64.decode(decodeURIComponent(params.msg));
            }console.log(params);
            this.setData({
                params: params
            });
        },

        // 页面显示
        onShow() {
            // 分享菜单处理
            app.globalData.page_share_handle();
        },

        // 方法
        methods: {
            // 返回
            back_event(e) {
                var pages = getCurrentPages();
                if(pages > 1) {
                    uni.navigateBack();
                } else {
                    uni.switchTab({
                        url: app.globalData.data.tabbar_pages[0]
                    });
                }
            }
        }
    };
</script>
<style>
    .content {
        padding-top: 30%;
    }
</style>