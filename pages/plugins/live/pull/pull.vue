<template>
    <view :class="theme_view">
        <!-- #ifdef H5 -->
        <h5-hls-video ref="h5_hls_video" src="http://live-pull-all.shopxo.vip/68f764013572f9240ca7ce6c/shopxo122.m3u8"></h5-hls-video>
        <!-- <flv-video
            ref="flv_player"
            src="http://live-pull-all.shopxo.vip/68f764013572f9240ca7ce6c/shopxo122.m3u8"
            mode="live"
            autoplay
            style="width: 300px; height: 225px;"
        ></flv-video> -->
        <!-- #endif -->
        <!-- <live-player
            src="http://live-pull-all.shopxo.vip/68f764013572f9240ca7ce6c/shopxo122.m3u8"
            mode="live"
            autoplay
            style="width: 300px; height: 225px;"
        ></live-player> -->
        <button type="primary" @click="play_pause_event">播放/暂停</button>
        <view class="page-width-max pf z-i-deep bottom-0-lg wh-auto bg-white">
            <view v-if="message_list.length > 0" class="radius padding-main">
                <block v-for="(item, index) in message_list">
                    <view class="padding-vertical-xs">{{item.content}}</view>
                </block>
            </view>
            <view v-if="join_user_list.length > 0" class="radius padding-main">
                <block v-for="(item, index) in join_user_list">
                    <view class="padding-vertical-xs">
                        <text>{{item.content}}</text>
                        <text class="cr-grey">{{item.tips}}</text>
                    </view>
                </block>
            </view>
            <view class="radius padding-main br-t">
                <input type="text" placeholder="请输入消息内容" confirm-type="send" @confirm="input_confirm_event" />
            </view>
        </view>
    </view>
</template>
<script>
    import flvVideo from './flv-video.vue'
    const app = getApp();
    export default {
        components: {
            flvVideo
        },
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                application_client_type: app.globalData.application_client_type(),
                application_client_brand: app.globalData.application_client_brand(),
                // 自动播放
                autoplay: true,
                // 控制
                controls: false,
                // 全屏按钮
                show_fullscreen_btn: false,
                // 消息对象
                task: null,
                // 直播间
                live_room_id: 1,
                // socket消息id
                fd: 0,
                // 心跳定时任务
                ping_timer: null,
                // 心跳间隔时间
                ping_interval: 30,
                // 当前观看直播用户id
                live_user_id: 0,
                // 加入直播间用户
                join_user_list: [],
                // 消息列表
                message_list: [
                    {
                        content: '您好呀'
                    },
                    {
                        content: 's啥地方都是'
                    },
                    {
                        content: '三个顺丰公司的'
                    }
                ],
            }
        },
        
        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);
        
            // 设置参数
            this.setData({
                params: app.globalData.launch_params_handle(params),
            });

            // 加载数据
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
        
        onUnload() {
            this.clear_interval_task();
        },

        methods: {
            // 初始化
            init() {
                this.socket();
            },

            // socket连接
            socket() {
                let self = this;
                let task = uni.connectSocket({
                    url: "ws://localhost:9501",
                    header: {
                        "content-type": "application/json",
                    },
                    complete: () => {}
                });

                task.onOpen(function(res) {
                    self.setData({
                        task: task,
                    });

                    console.log('open', res);
                });
                task.onMessage(function(res) {
                    //console.log('message', res);
                    self.socket_message_back_handle(res);
                });
                task.onClose(function(res) {
                    self.setData({
                        task: null,
                    });
                    console.log('close', res);
                });
                task.onError(function(res) {
                    self.setData({
                        task: null,
                    });
                    console.log('error', res);
                });
            },

            // 播放错误回调
            video_error_callback: function(e) {
                console.log(e.target.errMsg)
            },

            // 消息回调处理
            socket_message_back_handle(e) {
                let res = JSON.parse(e.data);
                if(res.code != 0) {
                    app.globalData.showToast(res.msg);
                    return false;
                }
                let data = res.data;
                console.log(data);
                switch(data.type) {
                    // 初始化
                    case 'init' :
                        this.setData({
                            fd: data.data.fd,
                            ping_interval: parseInt(data.data.ping_interval || 30),
                        });
                        // 初始化消息
                        this.socket_send('init');
                        break;

                    // 初始化成功
                    case 'init-success' :
                        this.setData({
                            live_user_id: data.data.live_user_id
                        });
                        // 启动心跳
                        this.socket_ping_handle();
                        console.log('connect success');
                        break;

                    // 初始化失败
                    case 'init-fail' :
                        console.log('connect fail');
                        break;

                    // 加入直播间提示
                    case 'join' :
                        let temp_join_user_list = this.join_user_list;
                            temp_join_user_list.push({content: data.content, tips: data.tips});
                        this.setData({
                            join_user_list: temp_join_user_list
                        });
                        console.log(data.content, 'join');
                        break;

                    // 消息
                    case 'message' :
                        let temp_message_list = this.message_list;
                            temp_message_list.push({content: data.content});
                        this.setData({
                            message_list: temp_message_list
                        });
                        console.log('message');
                        break;
                }
            },
            
            // 消息发送
            // type init初始化, ping心跳, message消息
            socket_send(type = 'message', content = '') {
                if(this.task === null) {
                    app.globalData.showToast('socket连接失败！');
                    return false;
                }

                // 发送消息
                let uuid = app.globalData.request_uuid();
                let user = app.globalData.get_user_cache_info();
                let token = user == null ? '' : user.token || '';
                this.task.send({data: JSON.stringify({
                    application_client_type: this.application_client_type,
                    application_client_brand: this.application_client_brand,
                    system_type: app.globalData.data.system_type,
                    uuid: uuid,
                    token: token,
                    live_room_id: this.live_room_id,
                    live_user_id: this.live_user_id,
                    fd: this.fd,
                    type: type,
                    content: content
                })});
            },

            // 心跳
            socket_ping_handle() {
                // 清除定时任务
                let self = this;
                self.clear_interval_task();

                // 启动定时任务
                let ping_timer = setInterval(function() {
                    self.socket_send('ping', app.globalData.get_timestamp());
                }, self.ping_interval*1000);

                // 设置定时任务对象
                self.setData({
                    ping_timer: ping_timer
                });
            },

            // 清除定时任务
            clear_interval_task() {
                clearInterval(this.ping_timer);
            },

            // 输入消息确认事件
            input_confirm_event(e) {
                var value = e.detail.value || null;
                if(value === null) {
                    app.globalData.showToast('请输入消息内容！');
                    return false;
                }
                this.socket_send('message', value);
            },
            // 播放/暂停事件
            play_pause_event() {
                if (this.$refs.h5_hls_video) {
                    this.$refs.h5_hls_video.play();
                }
            }
        }
    }
</script>
<style>
    
</style>