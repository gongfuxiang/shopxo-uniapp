const app = getApp();
export default {
    data() {
        return {
            windowWidth: 0,
            windowHeight: 0,
            is_live_ended: false
        }
    },
    onLoad(params) {
        // 调用公共事件方法
        app.globalData.page_event_onload_handle(params);
        // 设置参数
        this.params = app.globalData.launch_params_handle(params);
    },
    
    onShow() {
        // 调用公共事件方法
        app.globalData.page_event_onshow_handle();

        // 分享菜单处理
        app.globalData.page_share_handle();

        // #ifdef APP-NVUE
        const data = uni.getWindowInfo();
        this.windowWidth = data.windowWidth;
        this.windowHeight = data.windowHeight;
        // #endif
    },
    methods: {
        ended() {
            this.is_live_ended = true;
        }
    }
}