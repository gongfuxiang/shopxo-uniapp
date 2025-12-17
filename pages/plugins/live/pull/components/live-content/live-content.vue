<template>
    <!-- #ifdef APP-NVUE -->
    <view class="flex-col jc-sb pr pa-10 box-border-box bottom-line-exclude-bottom" :style="'width:' + propWindowWidth + 'px;height:' + propWindowHeight + 'px;'">
    <!-- #endif -->
    <!-- #ifndef APP-NVUE -->
    <view class="flex-col jc-sb pr pa-10 box-border-box bottom-line-exclude-bottom" style="width: 100vw;height: 100vh;">
    <!-- #endif -->
        <!-- 顶部主播信息 -->
        <view class="flex-row align-c jc-sb" :style="header_style">
            <view class="top-header flex-row align-c pointer-events-auto">
                <image :src="live_avatar" class="avatar" mode="aspectFill"></image>
                <view class="ml-10 flex-col">
                    <text class="nickname text-line-1">{{ live_data && live_data.title ? live_data.title : '直播' }}</text>
                    <text class="level">{{ like_count }}本场点赞</text>
                </view>
            </view>
            <view class="flex-row align-c pointer-events-auto">
                <view class="flex-row align-c pr" style="direction: rtl;">
                    <view v-for="(item, index) in online_user" :key="index" class="viewer-wrapper" :style="'z-index:' + (index + 1) + ';' + (index == 0 ? 'margin-right: 0;' : '')">
                        <image :src="item.avatar" class="viewer-avatar"  mode="aspectFill"></image>
                    </view>
                </view>
                <view class="ml-5 people-number flex-row align-c jc-c">
                    <text class="cr-f size-10">{{ live_data.online_count || 0 }}</text>
                </view>
                <view class="viewer-back ml-5 flex-row align-c jc-c " @tap="live_back">
                    <component-icon propName="close-fillup" class="viewer-back-icon" propSize="50rpx" propColor="#fff"></component-icon>
                </view>
            </view>
        </view>
        <view class="flex-1 bottom-line-exclude-bottom flex-row">
            <view class="flex-1 flex-col jc-e">
                <view class="pr">
                    <view class="bulletin-area pr pointer-events-auto" :style="'width:' + (propWindowWidth - 150) + 'px;'">
                        <!-- #ifdef APP-NVUE -->
                        <!-- nvue 使用 list进行列表渲染 -->
                        <list class="bulletin-area" :style="'width:' + (propWindowWidth - 150) + 'px;'" :show-scrollbar="false" loadmoreoffset="30" @scroll="scroll_event" @loadmore="scroll_to_lower_event">
                            <cell v-for="(item, index) in bulletins" :key="item.id" ref="bulletin_index">
                        <!-- #endif -->
                        <!-- #ifndef APP-NVUE -->
                        <!-- scroll-view 只有非nvue的页面使用 -->
                        <scroll-view scroll-y class="bulletin-area" :style="'width:' + (propWindowWidth - 150) + 'px;'" :show-scrollbar="false" lower-threshold="30" :scroll-with-animation="true" :scroll-top="scroll_top" @scroll="scroll_event" @scroll_to_lower_event="scroll_to_lower_event">
                            <view v-for="(item, index) in bulletins" :key="item.id">
                        <!-- #endif -->
                        <!-- 中间弹幕区域 -->
                        <view class="mb-5 flex-row align-c">
                            <!-- #ifndef APP-NVUE -->
                            <view class="bulletin-item">
                                <template v-if="item.type == 'user'">
                                    <!-- 用户名和文本内容容器 -->
                                    <view class="inline-block">
                                        <view class="fl flex-row align-c jc-c padding-top-xs">
                                            <!-- 头像 -->
                                            <image :src="item.user_avatar != null ? item.user_avatar : userAvatar" class="bulletin-item-avatar" mode="aspectFill"></image>
                                        </view>
                                        <text class="user-name cr-blue">{{ item.user_name }}:</text>
                                        <text class="bulletin-text text-line-100">{{ item.text }}</text>
                                    </view>
                                </template>
                                <template v-else-if="item.type == 'go'">
                                    <text class="user-name cr-blue">{{ item.user_name }}</text>
                                    <text class="user-name cr-d">来了</text>
                                </template>
                                <template v-else>
                                    <text class="flex-1 cr-blue text-line-100 size-14">{{ item.text }}</text>
                                </template>
                            </view>
                            <!-- #endif -->
                            <!-- #ifdef APP-NVUE -->
                            <view class="flex-1 bulletin-item padding-top-sm">
                                <template v-if="item.type == 'user'">
                                    <!-- 头像 -->
                                    <view class="flex-1 flex-row align-c flex-wrap">
                                        <image :src="item.user_avatar != null ? item.user_avatar : userAvatar" class="bulletin-item-avatar mb-3" mode="aspectFill"></image>
                                        <text class="user-name cr-blue mb-3">{{ item.user_name }}:</text>
                                        <view v-for="item in split_text(item.text)" :key="index" class="mb-3">
                                            <text class="bulletin-text">{{ item }}</text>
                                        </view>
                                    </view>
                                </template>
                                <template v-else-if="item.type == 'go'">
                                    <text class="user-name cr-blue mb-3">{{ item.user_name }}</text>
                                    <text class="user-name mb-3 cr-d">来了</text>
                                </template>
                                <template v-else>
                                    <text class="flex-1 cr-blue text-line-100 mb-3 size-14">{{ item.text }}</text>
                                </template>
                            </view>
                            <!-- #endif -->
                        </view>
                        <!-- #ifdef APP-NVUE -->
                        <!-- nvue 使用 list进行列表渲染 -->
                            </cell>
                        </list>
                        <!-- #endif -->
                        <!-- #ifndef APP-NVUE -->
                        <!-- scroll-view 只有非nvue的页面使用 -->
                            </view>
                        </scroll-view>
                        <!-- #endif -->
                        <view v-if="!is_scroll_to_lower && message_num > 0" class="bulletin-tips flex-row align-c" @tap="message_num_event">
                            <text class="cr-10 cr-red">{{ message_num }}条新消息</text>
                        </view>
                    </view>
                    <view v-if="!isEmpty(explain_goods) && is_show_explain_goods" class="explain-goods pointer-events-auto" :data-url="explain_goods.goods_url" @tap="explain_goods_tap">
                        <view class="pr" style="width: 198rpx;height: 198rpx;">
                            <image :src="explain_goods.images" class="explain-goods-image" style="width: 198rpx;height: 198rpx;"  mode="aspectFill"></image>
                            <view class="explain-subscript flex-row align-c jc-sb">
                                <view class="explain-progress">
                                    <text class="size-12 cr-f">讲解中</text>
                                </view>
                                <view class="explain-close flex-row align-c" @tap.stop="explain_goods_close">
                                    <component-icon propName="close-line" propSize="18rpx" propColor="#fff"></component-icon>
                                </view>
                            </view>
                        </view>
                        <view class="explain-goods-content mt-10" style="padding: 8rpx;box-sizing: border-box;">
                            <text class="explain-goods-name text-line-2 size-12">{{ explain_goods.title }}</text>
                            <text class="explain-goods-price cr-red mt-10 size-12">{{ currency_symbol }}{{ explain_goods.price }}</text>
                        </view>
                    </view>
                </view>
                <!-- 底部交互区域 -->
                <view class="flex-row align-c mt-5 pointer-events-auto">
                    <template v-if="is_socket_success">
                        <view class="flex-1 bottom-actions-input">
                            <input :value="comment_value" type="text" confirm-type="done" :adjust-position="false" style="color: #fff;" placeholder="说点什么" @focus="add_comment" @input="(e) => comment_value = e.detail.value" @confirm="comment_input_confirm"  />
                        </view>
                    </template>
                    <template v-else>
                        <view class="flex-1">
                            <button class="bottom-actions-button cr-f size-14" type="primary"  style="border-radius: 50rpx;background: rgba(40,40,40,0.45);border: 1rpx solid rgba(40,40,40,0.45);" :hover-class="is_socket_error ? 'none' : 'button-hover'" @tap="socket_connect_manual">{{ socket_error_content }}</button>
                        </view>
                    </template>
                    <view class="bottom-actions-icon" @tap="add_goods">
                        <component-icon propName="shopping-cart-tall" propColor="#fff" propSize="32rpx"></component-icon>
                    </view>
                    <component-like-button ref="likeButton" :propShowImgs="propLiveShowImgs" @handleClick="like_button_click">
                        <view class="bottom-actions-icon">
                            <component-icon propName="givealike-o" propColor="#fff" propSize="32rpx"></component-icon>
                        </view>
                    </component-like-button>
                    <view class="bottom-actions-icon" @tap="share_event">
                        <component-icon propName="share-solid" propColor="#fff" propSize="32rpx"></component-icon>
                    </view>
                </view>
            </view>
        </view>
        <!-- 添加评论 -->
        <view v-if="is_add_comment" class="keyboard-input pointer-events-auto" :style="'width:' + propWindowWidth + 'px;bottom:' + listener_height + 'px;'">
            <view class="keyboard-input-border" style="padding: 16rpx 22rpx;border: 2rpx solid #ddd;border-radius: 50rpx;">
                <input :value="comment_value" :focus="is_add_comment" type="text" confirm-type="done" :adjust-position="false" :auto-blur="true" placeholder="说点什么" @input="(e) => comment_value = e.detail.value" @blur="() => is_add_comment = false" @confirm="comment_input_confirm" />
            </view>
        </view>
        <!-- 商品弹出框 -->
        <component-popup ref="popupGoodsRef" propMode="bottom" class="pointer-events-auto" propTitle="添加商品" :propCloseable="true">
           <component-goods propIsGoodsPopup></component-goods>
        </component-popup>
        <!-- 分享弹窗 -->
        <component-share-popup ref="share" class="pointer-events-auto"></component-share-popup>
    </view>
</template>

<script>
    import componentGoods from "@/pages/plugins/live/pull/components/goods/goods.vue";
    import componentIcon from "@/pages/plugins/live/pull/components/icon/icon.vue";
    import componentPopup from "@/pages/plugins/live/pull/components/popup/popup";
    import componentLikeButton from "@/pages/plugins/live/pull/components/like-button/like-button";
    import componentSharePopup from "@/pages/plugins/live/pull/components/share-popup/share-popup.vue";
    import { isEmpty } from '@/common/js/common/common.js';
    const app = getApp();
    export default {
        name: 'LiveContent',
        components: {
            componentGoods,
            componentIcon,
            componentPopup,
            componentLikeButton,
            componentSharePopup
        },
        /**
         * 直播内容组件属性
         */
        props: {
            /**
             * 直播配置信息
             */
            propLiveConfig: {
                type: Object,
                default: () => {}
            },
            /**
             * 直播间全部信息
             */
            propLiveData: {
                type: Object,
                default: () => {}
            },
            /**
             * 直播展示图片
             */
            propLiveShowImgs: {
                type: Array,
                default: () => []
            },
            propWindowWidth: {
                type: Number,
                default: 0
            },
            propWindowHeight: {
                type: Number,
                default: 0
            },
        },
        data() {
            return {
                application_client_type: app.globalData.application_client_type(),
                application_client_brand: app.globalData.application_client_brand(),
                goods_popup_status: false,
                // 点赞计数
                like_count: 0,
                // 临时点赞计数
                casual_like_count: 0,
                like_timer: null,
                // 直播间配置信息
                live_data: {},
                userAvatar: '/static/images/common/user.png',
                // 模拟观看者数据
                online_user: [],
                // 讲解中商品信息
                explain_goods: {},
                // 价格符号
                currency_symbol: app.globalData.currency_symbol(),
                //#region 头部样式和页面宽度处理
                header_style: '',
                //#endregion
                
                //#region 评论区
                bulletins: [
                    {
                        id: '1',
                        type: 'message',
                        text: 'xxx提倡绿色直播，严禁未成年人直播或打赏，严禁涉政、涉恐、涉黄、聚集闹事、返现等内容，平台将会24小时巡查。请勿参与直播间非官方奖励活动/游戏，切勿私下交易，以防受骗。'
                    }, 
                    {
                        id: '2',
                        type: 'user',
                        user_avatar: '/static/images/common/user.png',
                        user_name: '陌生网友',
                        text: '你好'
                    },
                    {
                        id: '3',
                        type: 'user',
                        user_avatar: '/static/images/common/user.png',
                        user_name: '陌生网友',
                        text: '21245445454545454545545445452124544545454545454554544545'
                    },
                    {
                        id: '9',
                        type: 'go',
                        user_avatar: '/static/images/common/user.png',
                        user_name: '陌生网友',
                        text: '228'
                    }
                ],
                scroll_top: 0,
                // 滚动条的高度
                scoll_height: 600,
                //#ifdef APP-NVUE
                domModule: null,
                //#endif
                bulletin_index: null,
                // 列表滚动事件
                // 判断列表是否滚动了，如果滚动了，就认为他不是在底部，就要显示有多少条信息
                is_scroll_to_lower: false,
                message_num: 0,
                //#endregion
                
                //#region 获取用户头像信息和socket连接信息
                live_avatar: '/static/images/common/user.png',
                // 连接socket
                task: null,
                // socket消息id
                socket_id: 0,
                // 心跳定时任务
                ping_timer: null,
                // 获取直播间数据定时任务
                pull_live_room_info_timer: null,
                // 心跳间隔时间
                ping_interval: 30,
                // 当前观看直播用户id
                live_user_id: [],
                // 观看用户名称
                // commons_name: '陌生网友', // 用户名称
                // is_user_comes: false,
                // is_user_comes_timer: null,
                //#endregion
                
                //#region 监听键盘弹出事件
                comment_value: '',
                is_add_comment: false,
                // 监听键盘高度变化事件
                listener_height: 0,
                //#endregion
                reconnect_count: 0,
                // socket连接错误
                is_socket_error: false,
                socket_error_content: '连接失败点击重试',
                // socket连接成功
                is_socket_success: false,
                // 是否展示讲解商品信息
                is_show_explain_goods: true,
                goods_hide_timer: null, // 讲解商品信息隐藏定时器
                live_room_info_timing_interval_time: 30, // 获取直播间数据定时任务时间间隔
                live_room_goods_explain_auto_close_time: 10, // 讲解商品信息自动关闭时间
            }
        },
        watch: {
            /**
             * 监听直播信息
             */
            propLiveData: {
                handler(new_value) {
                    if (new_value != null) {
                        this.live_init(new_value);
                    }
                },
                immediate: true,
                deep: true
            },
            /**
             * 监听直播展示图片变更
             */
            propLiveConfig: {
                handler(new_value) {
                    if (new_value != null) {
                        // 直播间信息定时任务时间间隔
                        this.live_room_info_timing_interval_time = new_value.live_room_info_timing_interval_time;
                        // 讲解商品信息自动关闭时间
                        this.live_room_goods_explain_auto_close_time = new_value.live_room_goods_explain_auto_close_time;
                    }
                },
                immediate: true,
                deep: true
            },
        },
        /**
         * 组件挂载后执行初始化操作
         */
        mounted() {
            // 初始化窗口信息和滚动条高度
            this.init_window_info();
            // 滚动到评论区底部
            this.scroll_to_lower();
            // 获取用户信息
            this.init_user_info();
            // 创建监听事件
            this.bind_keyboard_listener();
        },
        /**
         * 组件销毁前清理资源
         */
        beforeDestroy() {
            // 清理socket连接
            this.clear_interval_task();
            this.unbind_keyboard_listener();
            // 关闭socket连接
            this.socket_close();
        },
        methods: {
            isEmpty,
            //#region 头部样式和页面宽度处理
            /**
             * 初始化窗口信息
             * 获取屏幕宽高，并根据不同平台设置头部样式
             */
            init_window_info() {
                // 菜单按钮位置信息, uniappx中没有这个方法，但是能使用
                this.header_style = 'padding-top: 20rpx;';
                // 设置有胶囊的时候头部显示的位置
                // #ifdef MP
                // 判断是否有胶囊
                const is_page = app.globalData.is_current_single_page();
                // 如果有胶囊的时候，做处理
                if (is_page == 0) {
                    const custom = uni.getMenuButtonBoundingClientRect();
                    this.header_style = `padding-top: ${custom.top + custom.height}px;`;
                }
                //#endif
                //#ifdef APP
                this.header_style = 'padding-top: 88rpx;'
                //#endif
                
                //#ifdef APP-NVUE
                this.scoll_height = app.globalData.rpx_to_px(600);
                this.domModule = uni.requireNativePlugin('dom');
                //#endif
                //#ifndef APP-NVUE
                this.scoll_height = app.globalData.rpx_to_px(600);
                //#endif
                
                //#ifdef APP-NVUE
                this.nvueAnimation = uni.requireNativePlugin('animation');
                //#endif
            },
            //#endregion
            
            /**
             * 退出直播
             * 触发父组件的liveBack事件
             */
            live_back() {
                this.$emit('liveBack');
            },
            
            //#region 评论区
            /**
             * 滚动到评论区最底部
             */
            scroll_to_lower() {
                this.$nextTick(() => {
                    //#ifndef APP-NVUE
                    const num = Math.random();
                    this.scroll_top = this.scoll_height + num;
                    //#endif
                    //#ifdef APP-NVUE
                    if (this.bulletin_index && this.bulletin_index.length > 0) {
                        this.domModule.scrollToElement((this.bulletin_index[this.bulletins.length - 1]), {
                            offset: this.scoll_height,  // 偏移量，可根据需要调整
                            animated: true  // 是否带动画
                        });
                    }
                    //#endif
                })
            },
            /**
             * 将文本拆分为字符数组（用于NVUE环境）
             * @param {String} val - 需要拆分的文本
             * @returns {Array} 拆分后的字符数组
             */
            split_text(val) {
                return val.split('');
            },
            /**
             * 滚动事件处理
             * @param {Event} e - 滚动事件对象
             */
            scroll_event(e) {
                this.is_scroll_to_lower = false;
            },
            /**
             * 滚动到底部事件处理
             * @param {Event} e - 滚动事件对象
             */
            scroll_to_lower_event(e) {
                // 滚动到底部触发的事件，将显示的多少条信息给隐藏起来
                setTimeout(() => {
                    // 滑动到底部的时候，清除历史存储的消息数据
                    this.message_num = 0;
                    this.is_scroll_to_lower = true;
                }, 0);
            },
            /**
             * 新消息提示点击事件处理
             * 点击后滚动到评论区底部
             */
            message_num_event() {
                this.scroll_to_lower();
            },
            //#endregion
            
            //#region 获取用户头像信息和socket连接信息
            /**
             * 初始化用户信息
             * 从缓存获取用户头像并建立WebSocket连接
             */
            init_user_info() {
                const new_user = uni.getStorageSync(uni.$store?.state?.cache_user_info_key ?? '') || null;
                if (new_user != null) {
                    this.avatar = new_user.avatar;
                }
                // 连接socket
                this.socket_connect();
            },
            /**
             * 手动连接WebSocket
             */
            socket_connect_manual() {
                if (!this.is_socket_error) {
                    this.socket_connect(true);
                }
            },
            /**
             * 建立WebSocket连接
             * @param {Boolean} is_manual - 是否手动连接
             */
            socket_connect(is_manual = false) {
                // 一开始就设置为false，避免连接失败时，页面显示错误
                this.is_socket_error = false;
                this.is_socket_success = false;
                // 第一次连接时显示连接中...
                if (this.reconnect_count == 0) {
                    this.socket_error_content = '连接中...';
                } else {
                    this.socket_error_content = `第${this.reconnect_count + 1}次重连中...`;
                }

                this.task = uni.connectSocket({
                    url: "wss://new.shopxo.vip:9502",
                    header: {
                        "content-type": "application/json",
                    },
                    complete: () => {}
                });
            
                // 连接打开事件
                this.task.onOpen((res) => {
                    // 连接成功后重置重连计数
                    this.reconnect_count = 0;
                    this.is_socket_success = true;
                });
                
                this.task.onMessage((res) => {
                    this.socket_message_back_handle(res);
                });
                this.task.onClose((res) => {
                    this.is_socket_error = true;
                    // 尝试重连，最多30次
                    if ((this.reconnect_count + 1) < 30) {
                        setTimeout(() => {
                            this.is_socket_error = true;
                            this.socket_error_content = `第${this.reconnect_count + 1}次连接失败`;
                            setTimeout(() => {
                                // 增加重连计数
                                this.reconnect_count++;
                                this.socket_connect();
                            }, 1000); // 逐步增加重连间隔，最大10秒
                        }, 1000); // 逐步增加重连间隔，最大10秒
                    } else {
                        this.is_socket_error = false;
                        this.reconnect_count = 0;
                        this.socket_error_content = '连接失败点击重试';
                    }
                });
                this.task.onError((res) => {
                    this.socket_close();
                    this.is_socket_error = false;
                    this.reconnect_count = 0;
                    this.socket_error_content = `连接失败点击重试`;
                    if (is_manual) {
                        uni.showModal({
                            title: '提示',
                            content: res.result,
                            showCancel: false,
                        });
                    }
                });
            },
            socket_close() { 
                if (this.task != null) {
                    this.task.close();
                    this.task = null;
                }
            },
            
            /**
             * WebSocket消息回调处理
             * @param {Object} e - WebSocket消息事件对象
             */
            socket_message_back_handle(e) {
                let res = JSON.parse(e.data);
                if(res.code !== 0) {
                    app.globalData.showToast(res.msg);
                    return false;
                }
                let data = res.data;
                switch(data.type) {
                    // 初始化
                    case 'init' :
                        this.socket_id = data.data.fd;
                        this.ping_interval = parseInt(data.data.ping_interval || 30);
                        // 初始化消息
                        this.socket_send('init');
                        break;
            
                    // 初始化成功
                    case 'init-success' :
                        this.live_user_id = data.data.live_user_id;
                        // 启动心跳
                        this.socket_ping_handle();
                        // 启动直播间数据定时任务
                        this.socket_room_info_handle();
                        break;
            
                    // 初始化失败
                    case 'init-fail' :
                        console.log('connect fail');
                        break;
            
                    // 加入直播间提示
                    case 'join' :
                        // 如果最后前一条是进入直播间的提示，则更新用户昵称
                        if (this.bulletins.length > 0 && this.bulletins[this.bulletins.length - 1].type == 'go') {
                            this.bulletins[this.bulletins.length - 1].user_name = data.content;
                        } else {
                            this.bulletins.push({
                                id: Math.random(),
                                type: 'go',
                                user_avatar: '',
                                user_name: data.content,
                                text: '',
                            });
                        }                    
                        // 添加内容之后，需要滚动到最后
                        this.scroll_to_lower();
                        break;
                    // 消息
                    case 'message':
                        // 如果最后前一条是进入直播间的提示，则删除
                        if (this.bulletins.length > 0 && this.bulletins[this.bulletins.length - 1].type == 'go') {
                            this.bulletins.splice(this.bulletins.length - 1, 1);
                        }
                        this.$nextTick(() => {
                            this.bulletins.push({
                                id: Math.random(),
                                type: 'user',
                                user_avatar: data.data.user.avatar,
                                user_name: data.data.user.nickname,
                                text: data.content,
                            });
                            // 添加内容之后，需要滚动到最后
                            this.scroll_to_lower();
                        });
                        break;
                    case 'live-room-info': // 获取直播间数据
                        // this.$emit('liveStatus', data.content);
                        this.live_init(data.data);
                        break;
                }
            },
            // 初始化直播间数据
            live_init(data) { 
                // 更新讲解商品信息
                const goods = data.explain_goods;
                // 讲解商品信息更新,讲解商品不为空，并且讲解商品id不一致，需要更新讲解商品信息
                if ((!isEmpty(goods) && !isEmpty(this.explain_goods) && this.explain_goods.id !== goods.id) || isEmpty(this.explain_goods)) {
                    this.explain_goods = data.explain_goods;
                    this.is_show_explain_goods = true;
                    this.explain_goods_close('auto');
                }
                // 更新在线用户头像
                this.online_user = data.online_user;
                // 更新直播间头像
                this.live_avatar = data.room_info.cover;
                // 更新直播间数据
                const new_value = data.room_info;
                this.live_data = new_value;
                // 直播间点赞数
                this.like_count = new_value.like_count;
                // 直播间状态更新
                this.$emit('liveStatus', new_value.status);
            },

            /**
             * 手动关闭讲解商品讲解商品关闭处理函数
             * @param {string} type - 关闭类型，'auto' 表示自动关闭，'manual' 表示立即关闭
             */
            explain_goods_close(type) {
                if (this.explain_goods_timer != null) {
                    clearTimeout(this.explain_goods_timer);
                    this.explain_goods_timer = null;
                }
                // 如何类型是自动的话，就是自动关闭，否则就立即关闭
                if (type == 'auto') {
                    // 定时关闭讲解商品
                    this.explain_goods_timer = setTimeout(() => {
                        this.is_show_explain_goods = false;
                    }, this.live_room_goods_explain_auto_close_time * 1000);
                } else {
                    this.is_show_explain_goods = false;
                }
            },
            /**
             * 讲解商品点击跳转到具体的商品详情页面
             */
            explain_goods_tap() {
                if (!isEmpty(this.explain_goods.goods_url)) {
                    const url = this.explain_goods.goods_url + '&live_room_id=1';
                    app.globalData.url_open(url);
                }
            },
            
            /**
             * WebSocket心跳处理
             */
            socket_ping_handle() {
                // 清除定时任务
                this.clear_interval_task();
            
                // 启动定时任务
                this.ping_timer = setInterval(() => {
                    this.socket_send('ping', app.globalData.get_timestamp());
                }, this.ping_interval * 1000);
            },
            /**
             * 清除定时任务
             */
            clear_interval_task() {
                if (this.ping_timer != null) {
                    clearInterval(this.ping_timer);
                    this.ping_timer = null;
                }
            },

            /**
             * WebSocket获取直播间数据
             */
            socket_room_info_handle() { 
                // 清除已有的定时任务
                if (this.pull_live_room_info_timer != null) {
                    clearInterval(this.pull_live_room_info_timer);
                    this.pull_live_room_info_timer = null;
                }
                
                // 立即发送获取直播间数据消息
                this.socket_send('live-room-info');
                
                // 每30秒发送一次获取直播间数据消息
                this.pull_live_room_info_timer = setInterval(() => {
                    this.socket_send('live-room-info');
                }, this.live_room_info_timing_interval_time * 1000);
            },
            
            /**
             * 发送WebSocket消息
             * @param {String} type - 消息类型(init初始化, ping心跳, message消息)
             * @param {String} content - 消息内容
             */
            socket_send(type = 'message', content = '') {
                if(this.task === null) {
                    app.globalData.showToast('socket连接失败！');
                    return false;
                }
                // 发送消息
                const user = app.globalData.get_user_cache_info();
                let uuid = app.globalData.request_uuid();
                let token = user == null ? '' : user.token || '';
                this.task.send({data: JSON.stringify({
                    application_client_type: this.application_client_type,
                    application_client_brand: this.application_client_brand,
                    system_type: app.globalData.data.system_type,
                    uuid: uuid,
                    token: token,
                    live_room_id: this.live_data.id, // 直播间id
                    live_user_id: this.live_user_id, // 直播用户id
                    fd: this.socket_id,
                    type: type,
                    content: content
                })});
            },
            //#endregion
            
            //#region 监听键盘弹出事件
            /**
             * 添加评论
             */
            add_comment() {
                //#ifndef H5
                this.is_add_comment = true;
                //#endif
            },
            /**
             * 键盘高度变化监听处理
             * @param {Object} res - 键盘高度变化事件对象
             */
            listener(res) {
                // 减1是为了兼容，避免跟键盘之间会不连贯
                if (res.height > 0) {
                    this.listener_height = res.height - 1;
                } else {
                    this.listener_height = 0;
                }
            },
            /**
             * 绑定键盘高度变化监听事件
             */
            bind_keyboard_listener() {
                uni.onKeyboardHeightChange(this.listener);
            },
            /**
             * 解绑键盘高度变化监听事件
             */
            unbind_keyboard_listener() {
                uni.offKeyboardHeightChange(this.listener);
            },
            
            /**
             * 评论输入确认事件处理
             * @param {Event} e - 输入确认事件对象
             */
            comment_input_confirm(e) {
                const value = e.detail.value;
                if (value != '') {
                    this.socket_send('message', e.detail.value);
                }
                this.comment_value = '';
            },
            //#endregion
            
            //#region 商品弹出框
            /**
             * 添加商品
             * 打开商品弹出框
             */
            add_goods() {
                this.$refs.popupGoodsRef.open();
            },
            //#endregion
            
            /**
             * 分享事件处理
             */
            share_event() {
                // 分享菜单处理
                app.globalData.page_share_handle();
                const share_info = {
                    title: this.live_data.title,
                    desc: this.live_data.describe,
                    path: "/pages/plugins/live/pull/pull",
                    query: "id=" + this.live_data.id,
                    img: this.live_data.icon || "",
                };
                // 调取分享弹窗
                if ((this.$refs.share || null) != null) {
                    this.$refs.share.init({
                        share_info: share_info
                    });
                }
            },
            
            /**
             * 点赞点击事件处理
             * @param {Event} e - 点击事件对象
             */
            like_click(e) {
               this.$refs.likeButton.handleClick(e);
            },
            
            /**
             * 点赞按钮点击事件处理
             * @param {Event} e - 点击事件对象
             */
            like_button_click(e) {
                // 临时存储点赞数量
                this.casual_like_count++;
                // 如果有点击，清除历史定时任务
                if (this.like_timer != null) {
                    clearTimeout(this.like_timer);
                }
                // 两秒没有人点赞，则显示临时点赞数量加上原有数量
                setTimeout(() => {
                    // 显示临时点赞数量加上原有数量
                    this.like_count = this.like_count + this.casual_like_count;
                    this.socket_send('live-room-like', this.casual_like_count);
                    // 完成之后重置临时点赞数量
                    this.casual_like_count = 0;
                }, 2000);
            }
        }
    }
</script>

<style lang="scss" scoped>
.top-header {
    padding: 10rpx 30rpx 10rpx 20rpx;
    border-radius: 100rpx;
    z-index: 3;
    background-color: rgba(40,40,40,0.45);
}
.people-number {
    padding: 6rpx 20rpx;
    background-color: rgba(40,40,40,0.45);
    border-radius: 200rpx;
}

.avatar {
    width: 60rpx;
    height: 60rpx;
    border-radius: 30rpx;
}

.nickname {
    max-width: 200rpx;
    font-size: 28rpx;
    color: #fff;
    font-weight: bold;
}

.level {
    font-size: 24rpx;
    color: #fff;
}

.viewer-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: -20rpx; /* 重叠部分的宽度 */
}

.viewer-avatar {
    width: 60rpx;
    height: 60rpx;
    border-radius: 30rpx;
    border: 3rpx solid #ffffff; /* 添加白色边框使其更清晰 */
}
.viewer-back {
    // width: 70rpx;
    // height: 70rpx;
    border-radius: 30rpx;
}

.follow-btn {
    margin-left: 20rpx;
    padding: 8rpx 20rpx;
    background-color: #ff4d7e;
    color: #fff;
    font-size: 28rpx;
    border-radius: 20rpx;
}

.rank-tags {
    margin-left: 20rpx;
}

.rank-tag {
    font-size: 24rpx;
    color: #fff;
    margin-right: 10rpx;
}

.bulletin-area {
    max-height: 600rpx;
    height: auto;
}

.cr-blue {
    color: #9DE3F7
}

.bulletin-item {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 6rpx 16rpx;
    background-color: rgba(40,40,40,0.45);
    border-radius: 25rpx;
}

.bulletin-item-avatar {
    width: 30rpx;
    height: 30rpx;
    border-radius: 15rpx;
    margin-right: 10rpx;
}

.content-container {
    display: inline-block;
    line-height: 30rpx;
    vertical-align: top;
    width: calc(100% - 40rpx); /* 减去头像宽度和间距 */
}

.user-name {
    font-size: 28rpx;
    margin-right: 10rpx;
    display: inline;
}

.bulletin-text {
    font-size: 28rpx;
    color: #fff;
    line-height: 30rpx;
    white-space: pre-line;
    word-break: break-all;
    overflow-wrap: break-word;
    display: inline;
}

.input-field {
    flex: 1;
    padding: 10rpx;
    border: 1rpx solid #ddd;
    border-radius: 20rpx;
    font-size: 28rpx;
}

.action-btn {
    width: 60rpx;
    height: 60rpx;
    margin-left: 20rpx;
    justify-content: center;
    align-items: center;
}
.bottom-actions-input {
    padding: 16rpx 22rpx;
    border-radius: 50rpx;
    box-sizing: border-box;
    color: #fff;
    background: rgba(40,40,40,0.45);
}
.bottom-actions-input input {
    color: #fff;
}
.bottom-actions-input input::placeholder {
    color: #fff;
}
.bottom-actions-button {
    border-radius: 50rpx;
    background: rgba(40,40,40,0.45);
}
.bottom-actions-icon {
    background: rgba(40,40,40,0.45);
    width: 80rpx;
    height: 80rpx;
    border-radius: 40rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 20rpx;
}
.keyboard-input {
    position: fixed;
    left: 0;
    z-index: 99;
    background: #fff;
    padding: 20rpx 16rpx;
    box-sizing: border-box;
}

.keyboard-input-input { 
    padding: 16rpx 22rpx;
    border: 2rpx solid #ddd;
    border-radius: 50rpx;
}

.bulletin-tips {
    position: absolute;
    left: 0;
    bottom: 8rpx;
    z-index: 3;
    background: #fff;
    border-radius: 200rpx;
    padding: 6rpx 10rpx;
}

.user-comes {
    min-width: 100rpx;
    padding: 6rpx 10rpx 6rpx 20rpx;
    background-color: rgba(40,40,40,0.45);
    border-radius: 200rpx;
}

.countdown-display {
    width: 100px;
    height: 100px;
    border-radius: 50px;
    z-index: 999;
    background: rgba(40,40,40,0.45);
    .countdown-text {
        color: #fff;
        font-size: 50px;
        text-align: center;
        font-weight: bold;
    }
}

.countdown-animation {
    animation: zoomOut 1s ease-in-out forwards;
}
@keyframes zoomOut {
    0% {
        transform: scale(1);
        opacity: 1;
    }
    100% {
        transform: scale(2);
        opacity: 0;
    }
}
/* 讲解商品信息 */
.explain-goods {
    width: 200rpx;
    background: #fff;
    padding: 4rpx;
    box-sizing: border-box;
    position: absolute;
    right: 0;
    bottom: 20rpx;
    border-radius: 20rpx;
    overflow: hidden;
    .explain-subscript {
        position: absolute;
        left: 5rpx;
        top: 5rpx;
        right: 5rpx;
        .explain-progress {
            padding: 0rpx 8rpx;
            background: rgba(40,40,40,0.45);
            border-radius: 10rpx;
        }
        .explain-close {
            margin-right: 5rpx;
            padding: 6rpx;
            background: rgba(40,40,40,0.45);
            border-radius: 50rpx;
        }
    }
}
/* #ifdef MP-WEIXIN | APP-PLUS */
    .bulletin-area {
        ::v-deep ::-webkit-scrollbar
        {
            width: 0rpx!important;
            height: 0rpx!important;
            background-color: transparent;
        }
    }
/* #endif */
</style>
