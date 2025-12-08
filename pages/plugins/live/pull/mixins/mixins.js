/**
 * 直播间混入组件
 * 提供直播间相关的基本功能和数据管理
 */
const app = getApp();
import { isEmpty } from '@/common/js/common/common.js';
export default {
    /**
     * 组件内部数据
     */
    data() {
        return {
            windowWidth: 0,
            windowHeight: 0,
            is_live_ended: false,
            live_config: {},
            is_loading: true,
            like_show_imgs: [
                'https://new.shopxo.vip/static/plugins/live/images/like/like1.png',
                'https://new.shopxo.vip/static/plugins/live/images/like/like2.png',
                'https://new.shopxo.vip/static/plugins/live/images/like/like3.png',
                'https://new.shopxo.vip/static/plugins/live/images/like/like4.png',
                'https://new.shopxo.vip/static/plugins/live/images/like/like5.png',
            ],
            lastTapTime: 0, // 用于检测双击
            lastTapPosition: { x: 0, y: 0 }, // 记录上次点击位置
            lastLikeTime: 0 // 记录上次点赞时间，用于防抖
        }
    },

    /**
     * 页面加载时执行
     * @param {Object} params 页面参数
     */
    onLoad(params) {
        // 调用公共事件方法
        app.globalData.page_event_onload_handle(params);
        // 设置参数
        this.params = app.globalData.launch_params_handle(params);
    },
    
    /**
     * 页面显示时执行
     */
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
        // 页面显示时，连接直播间socket, 避免用户切换到其他页面，再切换回来时，socket连接断开
        if (this.$refs.liveContent) {
            this.$refs.liveContent.socket_connect();
        }
    },

    /**
     * 组件挂载完成后执行
     */
    mounted() {
        this.init();
    },

    methods: {
        /**
         * 初始化直播间数据
         * 请求服务器获取直播间详情信息
         */
        init() {
            uni.showLoading({
                title: '直播数据加载中...',
                mask: true
            });
            uni.request({
                url: app.globalData.get_request_url('detail', 'index', 'live'),
                method: 'POST',
                data: {
                    live_room_id: 1
                },
                dataType: 'json',
                success: (res) => {
                    // 隐藏加载提示
                    uni.hideLoading();
                    const new_data = res.data;
                    // 显示直播内容
                    this.is_loading = false;
                    // 判断是否有数据
                    if(new_data.code == 0) {
                        this.like_show_imgs = new_data.data.like_icon_list || [];
                        // 获取直播间信息
                        this.live_config = new_data.data.room || {};
                        // 如果不存在拉流地址则认为直播已结束，避免因为报错导致的页面异常
                        // if (isEmpty(new_data.data.pull_flv_url)) {
                        //     this.is_live_ended = true;
                        // }
                    } else {
                        uni.showToast({
                            title: new_data.msg || '获取直播间信息失败',
                            icon: 'none'
                        });
                        this.is_live_ended = true;
                    }
                },
                fail: (err) => {
                    // 隐藏加载提示
                    uni.hideLoading();
                    // 显示直播内容
                    this.is_loading = false;
                }
            });
        },

        /**
         * 标记直播结束或者直播暂停
         */
        ended() {
            // 如果已经暂停了就不需要处理了
            if (!this.is_live_ended) {
                this.is_live_ended = true;
            }
        },

        /**
         * 返回上一页
         */
        live_back() {
            app.globalData.page_back_prev_event();
        },

        /**
         * 处理鼠标双击事件
         * @param {Event} event 鼠标事件对象
         */
        handle_double_click(event) {
            if (event.target.dataset.ignore) {
                return;
            }
            // 防抖处理，200ms内只能触发一次
            const currentTime = Date.now();
            if (currentTime - this.lastLikeTime < 200) {
                return;
            }
            
            this.lastLikeTime = currentTime;
            
            if (this.$refs.fullScreenLikeEffect) {
                this.$refs.fullScreenLikeEffect.add_like(event);
            }

            if (this.$refs.liveContent) {
                this.$refs.liveContent.like_click(event);
            }
        },
        
        /**
         * 处理触屏双击事件
         * 检测用户在屏幕上的双击操作以触发点赞效果
         * @param {Event} event 触摸事件对象
         */
        handle_touch_end(event) {
            if (event.target.dataset.ignore) {
                return;
            }
            // 获取当前位置
            let x, y;
            if (event.changedTouches && event.changedTouches.length > 0) {
                x = event.changedTouches[0].pageX;
                y = event.changedTouches[0].pageY;
            } else {
                x = event.pageX || 0;
                y = event.pageY || 0;
            }
            
            const currentTime = new Date().getTime();
            const tapLength = currentTime - this.lastTapTime;
            const distance = Math.sqrt(
                Math.pow(x - this.lastTapPosition.x, 2) + 
                Math.pow(y - this.lastTapPosition.y, 2)
            );
            // 判断是否为双击 (300ms内且距离较近)
            if (tapLength < 300 && tapLength > 0 && distance < 50) {
                
                // 防抖处理，200ms内只能触发一次
                if (currentTime - this.lastLikeTime < 200) {
                    this.lastTapTime = currentTime;
                    this.lastTapPosition = { x, y };
                    return;
                }
                
                this.lastLikeTime = currentTime;
                
                if (this.$refs.fullScreenLikeEffect) {
                    this.$refs.fullScreenLikeEffect.add_like(event);
                }

                if (this.$refs.liveContent) {
                    this.$refs.liveContent.like_click(event);
                }
            } 
            this.lastTapTime = currentTime;
            this.lastTapPosition = { x, y };
        }
    }
}