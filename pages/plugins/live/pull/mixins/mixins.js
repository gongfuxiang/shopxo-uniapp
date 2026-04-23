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
            live_config: {}, // 直播间配置
            live_data: {}, // 直播间数据
            live_video_src: '',
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
            lastLikeTime: 0, // 记录上次点赞时间，用于防抖
            live_status: 0,
            live_be_right_back_error: false,
            load_timer: null, // 延时显示视频的定时器
            retry_count: 0, // 重试计数器
            live_reconnect_number: 0, // 直播间重连次数
            live_reconnect_interval_time: 1, // 直播间重连间隔时间
            live_like_count: 0, // 点赞次数
            live_like_click_timer: null,
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
        this.setData({
            params: app.globalData.launch_params_handle(params),
        });
    },
    
    /**
     * 页面显示时执行
     */
    onShow() {
        // 调用公共事件方法
        app.globalData.page_event_onshow_handle();

        const data = uni.getWindowInfo();
        this.windowWidth = data.windowWidth > 800 ? 800 : data.windowWidth;
        this.windowHeight = data.windowHeight;

        // 初始化
        this.init();

        // 页面显示时，连接直播间socket, 避免用户切换到其他页面，再切换回来时，socket连接断开
        if (this.$refs.liveContent) {
            this.$refs.liveContent.socket_connect();
        }
        // 页面显示时，重新加载视频
        if (this.$refs.liveVideo) {
            this.$refs.liveVideo.reload_video();
        }

        // 分享菜单处理
        app.globalData.page_share_handle();
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
                title: '数据加载中...',
                mask: true
            });
            uni.request({
                url: app.globalData.get_request_url('detail', 'index', 'live'),
                method: 'POST',
                data: {
                    live_id: 1
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
                        // 更新直播间数据
                        this.live_data = new_data.data;
                        // 直播间点赞图标
                        this.like_show_imgs = new_data.data.like_icon_list || [];
                        // 获取直播间视频信息
                        this.live_video_src = new_data.data.live_info.pull_flv_url || '';
                        // 直播间状态 (0离线, 1在线, 2离开, 3封禁）
                        this.live_status = new_data.data.live_info.status || 0;
                        // 直播间配置
                        const config = new_data.data.config || {};
                        this.live_config = config;
                        // 直播间重连次数
                        this.live_reconnect_number = config.live_reconnect_number || 0;
                        this.live_reconnect_interval_time = config.live_reconnect_interval_time || 1;
                        // 如果不存在拉流地址则认为直播已结束，避免因为报错导致的页面异常
                        // if (isEmpty(new_data.data.pull_flv_url)) {
                        //     this.is_live_ended = true;
                        // }
                    } else if (new_data.code == -400) { // 没有登陆的跳转到登陆页
                        // 隐藏加载提示
                        uni.hideLoading();
                        if (app.globalData.is_login_check(res.data)) {
                            app.globalData.showToast(res.data.msg);
                        } else {
                            app.globalData.showToast(this.$t('common.sub_error_retry_tips'));
                        }
                    } else {
                        uni.showToast({
                            title: new_data.msg || '获取直播间信息失败',
                            icon: 'none'
                        });
                        this.is_live_ended = true;
                        // 隐藏加载提示
                        uni.hideLoading();
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
         * 视频数据加载完成时触发
         */
        loadedmetadata() {
            // 隐藏加载提示
            uni.hideLoading();
            const _this = this;
            // 如果加载完成了，延迟2秒确定一下直播状态, 有的时候直播状态是正常的也加载成功了，但是获取不到视频流，需要确定一下没有执行error才算是真正的成功
            this.load_timer = setTimeout(() => {
                console.log('视频数据加载完成');
                _this.live_be_right_back_error = false;
                _this.retry_count = 0;
                // 如果重连的定时器还在运行中，则清除它
                if (_this.ended_timer) {
                    // 隐藏加载提示
                    clearTimeout(_this.ended_timer);
                }
            }, 2000);
        },
        /**
         * 标记直播结束或者直播暂停
         */
        ended() {
            // 隐藏加载提示
            uni.hideLoading();            
            // 如果加载定时器存在，则清除
            if (this.load_timer) {
                // 隐藏加载提示
                clearTimeout(this.load_timer);
            }
            // 如果直播已结束，则返回
            if (!this.is_live_ended) {

                if (![1, 2].includes(this.live_status)) {
                    this.is_live_ended = true;
                } else {
                    // 初始化重试计数器
                    if (this.retry_count === undefined) {
                        this.retry_count = 0;
                    }
                    // 如果历史定时器存在，则清除
                    if (this.ended_timer) {
                        // 隐藏加载提示
                        clearTimeout(this.ended_timer);
                    }
                    
                    // 如果重试次数超过指定次数，则标记为真正结束
                    if (this.retry_count > this.live_reconnect_number) {
                        this.is_live_ended = true;
                        this.live_be_right_back_error = false;
                        // 重置计数器
                        this.retry_count = 0;
                        return;
                    }

                    // 增加重试计数
                    this.retry_count++;
                    // 暂停直播了或者继续直播了，则提示用户当前主播暂时离开
                    this.live_be_right_back_error = true;
                    const _this = this;
                    // 延迟3秒后尝试重新连接
                    this.ended_timer = setTimeout(() => {
                        console.log('视频第' + _this.retry_count + '次连接');
                        // 在定时结束后尝试重新连接
                        if (_this.$refs.liveVideo) {
                            _this.$refs.liveVideo.reload_video();
                        }
                    }, this.live_reconnect_interval_time * 1000);
                }
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
        handle_click(event) {
            this.live_like_count++;
    
            if (this.live_like_count === 1) {
                // 第一次点击，设置定时器
                this.live_like_click_timer = setTimeout(function() {
                    // 单击，重置计数器
                    this.live_like_count = 0;
                }, 300); // 300ms内的两次点击算作双击
            } else if (this.live_like_count === 2) {
                // 双击
                clearTimeout(this.live_like_click_timer);
                this.live_like_count = 0;
                if (event.target.dataset.ignore) {
                    return;
                }
                // 防抖处理，200ms内只能触发一次
                const currentTime = Date.now();
                if (currentTime - this.lastLikeTime < 300) {
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
        },
        /**
         * 接收直播状态
         * @param {number} status 直播状态
         */
        socket_live_status(status) {
            this.live_status = status;
        }
    }
}