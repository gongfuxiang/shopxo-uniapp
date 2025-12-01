const app = getApp();
import { isEmpty } from '@/common/js/common/common.js';
export default {
    data() {
        return {
            windowWidth: 0,
            windowHeight: 0,
            is_live_ended: false,
            live_config: {},
            is_loading: true,
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
        this.init();
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            uni.showLoading({
                title: '加载中...',
                mask: true
            });
            uni.request({
                url: app.globalData.get_request_url('index,room,live'),
                method: 'POST',
                data: {},
                dataType: 'json',
                success: (res) => {
                    const new_data = res.data;
                    // 显示直播内容
                    this.is_loading = false;
                    // 隐藏加载提示
                    uni.hideLoading();
                    // 判断是否有数据
                    if(res.data.code == 0) {
                        // 获取直播间信息
                        this.live_config = new_data.data || {};
                        // 如果不存在拉流地址则认为直播已结束，避免因为报错导致的页面异常
                        if (isEmpty(new_data.data.pull_flv_url)) {
                            this.is_live_ended = true;
                        }
                    } else {
                        uni.showToast({
                            title: new_data.msg || '获取直播间信息失败',
                            icon: 'none'
                        });
                    }
                },
                fail: (err) => {
                    // 显示直播内容
                    this.is_loading = false;
                    // 隐藏加载提示
                    uni.hideLoading();
                }
            });
        },
        ended() {
            this.is_live_ended = true;
        },
        live_back() {
            app.globalData.page_back_prev_event();
        }
    }
}