<template>
    <!-- #ifdef APP-NVUE -->
    <view class="flex-col jc-sb pr pa-10 box-border-box bottom-line-exclude-bottom" :style="'width:' + windowWidth + 'px;height:' + windowHeight + 'px;'">
    <!-- #endif -->
    <!-- #ifndef APP-NVUE -->
    <view class="flex-col jc-sb pr pa-10 box-border-box bottom-line-exclude-bottom" style="width: 100vw;height: 100vh;">
    <!-- #endif -->
        <!-- 顶部主播信息 -->
        <view class="flex-row align-c jc-sb" :style="header_style">
            <view class="top-header flex-row align-c">
                <image :src="avatar" class="avatar" mode="aspectFill"></image>
                <view class="ml-10 flex-col">
                    <text class="nickname text-line-1">{{ live_data && live_data.title ? live_data.title : '直播' }}</text>
                    <text class="level">9999本场点赞</text>
                </view>
            </view>
            <view class="flex-row align-c">
                <view class="flex-row align-c pr" style="direction: rtl;">
                    <view v-for="(item, index) in viewers" :key="index" class="viewer-wrapper" :style="'z-index:' + (index + 1) + ';' + (index == 0 ? 'margin-right: 0;' : '')">
                        <image :src="item.avatar" class="viewer-avatar"  mode="aspectFill"></image>
                    </view>
                </view>
                <view class="viewer-back ml-5 flex-row align-c jc-c " @tap="live_back">
                    <component-icon name="close-fillup" class="viewer-back-icon" size="50rpx" color="#fff"></component-icon>
                </view>
            </view>
        </view>
        <view class="flex-1 bottom-line-exclude-bottom flex-row">
            <view class="flex-1 flex-col jc-e">
                <view class="pr">
                    <view class="bulletin-area pr" :style="'width:' + (windowWidth - 150) + 'px;'">
                        <!-- #ifdef APP-NVUE -->
                        <!-- nvue 使用 list进行列表渲染 -->
                        <list class="bulletin-area" :style="'width:' + (windowWidth - 150) + 'px;'" :show-scrollbar="false" loadmoreoffset="30" @scroll="scroll_event" @loadmore="scroll_to_lower_event">
                            <cell v-for="(item, index) in bulletins" :key="item.id" ref="bulletin_index">
                        <!-- #endif -->
                        <!-- #ifndef APP-NVUE -->
                        <!-- scroll-view 只有非nvue的页面使用 -->
                        <scroll-view scroll-y class="bulletin-area" :style="'width:' + (windowWidth - 150) + 'px;'" :show-scrollbar="false" lower-threshold="30" :scroll-with-animation="true" :scroll-top="scroll_top" @scroll="scroll_event" @scroll_to_lower_event="scroll_to_lower_event">
                            <view v-for="(item, index) in bulletins" :key="item.id">
                        <!-- #endif -->
                        <!-- 中间弹幕区域 -->
                        <view class="mb-5 flex-row align-c">
                            <!-- #ifndef APP-NVUE -->
                            <view class="bulletin-item">
                                <template v-if="item.type == 'user'">
                                    <!-- 用户名和文本内容容器 -->
                                    <view class="inline-block">
                                        <view class="fl flex-row align-c jc-c pt-3">
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
                            <view class="flex-1 bulletin-item pt-6">
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
                    <view v-if="!isEmpty(explain_goods)" class="explain-goods">
                        <image :src="explain_goods.goods_avatar" class="explain-goods-image" style="width: 198rpx;height: 198rpx;"  mode="aspectFill"></image>
                        <view class="explain-goods-content mt-10" style="padding: 8rpx;box-sizing: border-box;">
                            <text class="explain-goods-name text-line-2 size-12">{{ explain_goods.goods_name }}</text>
                            <text class="explain-goods-price cr-red mt-10 size-12">¥{{ explain_goods.goods_price }}</text>
                        </view>
                    </view>
                </view>
                <!-- 底部谁来了的提示-->
                <view v-if="is_user_comes" class="flex-row mt-3" :style="'max-width:' + (windowWidth - 100) + 'px;'">
                    <view class="user-comes flex-row">
                        <text class="user-name cr-blue">{{ commons_name }}</text>
                        <text class="user-name cr-d">来了</text>
                    </view>
                </view>
                <!-- 底部交互区域 -->
                <view class="flex-row align-c mt-5">
                    <view class="flex-1 bottom-actions-input">
                        <input :value="comment_value" type="text" confirm-type="done" :adjust-position="false" placeholder="说点什么" @focus="add_comment" @input="(e) => comment_value = e.detail.value" @confirm="comment_input_confirm"  />
                    </view>
                    <view class="bottom-actions-icon" @tap="add_goods">
                        <component-icon name="shopping-cart-tall" color="#fff" size="32rpx"></component-icon>
                    </view>
                    <component-like-button>
                        <view class="bottom-actions-icon">
                            <component-icon name="givealike-o" color="#fff" size="32rpx"></component-icon>
                        </view>
                    </component-like-button>
                    <view class="bottom-actions-icon" @tap="share_event">
                        <component-icon name="share-solid" color="#fff" size="32rpx"></component-icon>
                    </view>
                </view>
            </view>
        </view>
        <!-- 添加评论 -->
        <view v-if="is_add_comment" class="keyboard-input" :style="'width:' + windowWidth + 'px;bottom:' + listener_height + 'px;'">
            <view class="input">
                <input :value="comment_value" :focus="is_add_comment" type="text" confirm-type="done" :adjust-position="false" :auto-blur="true" placeholder="说点什么" @input="(e) => comment_value = e.detail.value" @blur="() => is_add_comment = false" @confirm="comment_input_confirm" />
            </view>
        </view>
        <!-- 商品弹出框 -->
        <component-popup ref="popupGoodsRef" mode="bottom" title="添加商品" :closeable="true">
           <component-goods isGoodsPopup></component-goods>
        </component-popup>
        <!-- 分享弹窗 -->
        <component-share-popup ref="share"></component-share-popup>
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
        props: {
            liveConfig: {
                type: Object,
                default: () => {}
            }
        },
        data() {
            return {
                application_client_type: app.globalData.application_client_type(),
                application_client_brand: app.globalData.application_client_brand(),
                goods_popup_status: false,
                // 直播间配置信息
                live_data: {},
                userAvatar: '/static/images/common/user.png',
                // 模拟观看者数据
                viewers: [
                    { avatar: '/static/images/common/user.png' },
                    { avatar: '/static/images/common/user.png' },
                    { avatar: '/static/images/common/user.png' }
                ],
                explain_goods: {
                    goods_avatar: '/static/images/common/user.png',
                    goods_name: '商品名称',
                    goods_price: '99.00'
                },
                //#region 头部样式和页面宽度处理
                windowWidth: 0,
                windowHeight: 0,
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
                avatar: '/static/images/common/user.png',
                // 连接socket
                task: null,
                // socket消息id
                socket_id: 0,
                // 心跳定时任务
                ping_timer: null,
                // 心跳间隔时间
                ping_interval: 30,
                // 当前观看直播用户id
                live_user_id: [],
                // 观看用户名称
                commons_name: '陌生网友', // 用户名称
                is_user_comes: false,
                is_user_comes_timer: null,
                //#endregion
                
                //#region 监听键盘弹出事件
                comment_value: '',
                is_add_comment: false,
                // 监听键盘高度变化事件
                listener_height: 0,
                //#endregion
                
                //#region 3 2 1倒计时相关
                countdown_num: 3,
                countdownTimer: null,
                is_countdown_visible: true,
                is_countdown_num_visible: true,
                //#ifdef APP-NVUE
                nvueAnimation: null,
                //#endif
                //#endregion
            }
        },
        watch: {
            liveConfig: {
                handler(new_value) {
                    if (new_value.data != null) {
                        // 获取配置信息
                        this.live_data = new_value;
                    }
                },
                immediate: true,
                deep: true
            }
        },
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
        beforeDestroy() {
            // 清理socket连接
            this.clear_interval_task();
            this.unbind_keyboard_listener();
            // 如果定时器存在，清除它
            if (this.countdownTimer) {
                clearInterval(this.countdownTimer);
            }
        },
        methods: {
            isEmpty,
            //#region 头部样式和页面宽度处理
            init_window_info() {
                const data = uni.getWindowInfo();
                this.windowWidth = data.windowWidth;
                this.windowHeight = data.windowHeight;
            
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
            
            // 退出直播, 客户端退出不需要提示
            live_back() {
                this.$emit('liveBack');
            },
            
            //#region 评论区
            // 滚动到最底部
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
            // nvue只能使用flex布局，无法实现文字主动换行的情况，将文字切割成数组，一个一个渲染
            split_text(val) {
                return val.split('');
            },
            scroll_event(e) {
                this.is_scroll_to_lower = false;
            },
            // 滚动到底部
            scroll_to_lower_event(e) {
                // 滚动到底部触发的事件，将显示的多少条信息给隐藏起来
                setTimeout(() => {
                    // 滑动到底部的时候，清除历史存储的消息数据
                    this.message_num = 0;
                    this.is_scroll_to_lower = true;
                }, 0);
            },
            // 点击新消息时，自动跳转到底部
            message_num_event() {
                this.scroll_to_lower();
            },
            //#endregion
            
            //#region 获取用户头像信息和socket连接信息
            init_user_info() {
                const new_user = uni.getStorageSync(uni.$store?.state?.cache_user_info_key ?? '') || null;
                if (new_user != null) {
                    this.avatar = new_user.avatar;
                }
                // 连接socket
                this.socket_connect();
            },
            
            // 连接socket
            socket_connect() {
                this.task = uni.connectSocket({
                    url: "wss://new.shopxo.vip:9502",
                    header: {
                        "content-type": "application/json",
                    },
                    complete: () => {}
                });
            
                // task.value.onOpen(function(res) {
                //     task.value = task.value;
                // });
                this.task.onMessage((res) => {
                    this.socket_message_back_handle(res);
                });
                this.task.onClose((res) => {
                    this.task = null;
                    console.log('close', res);
                });
                this.task.onError((res) => {
                    this.task = null;
                    console.log('error', res);
                });
            },
            
            // 消息回调处理
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
                        break;
            
                    // 初始化失败
                    case 'init-fail' :
                        console.log('connect fail');
                        break;
            
                    // 加入直播间提示
                    case 'join' :
                        this.commons_name = data.content;
                        this.is_user_comes = true;
                        // 设置定时任务，如果在固定时间内有其他人进入,就清除之前的定时任务，并重新设置一个定时任务，确保关闭时间
                        if (this.is_user_comes_timer != null) {
                            clearTimeout(this.is_user_comes_timer)
                        }
                        this.is_user_comes_timer = setTimeout(() => {
                            this.is_user_comes = false
                        }, 1000);
                        break;
                    // 消息
                    case 'message':
                        this.bulletins.push({
                            id: Math.random(),
                            type: 'user',
                            user_avatar: data.data.user.avatar,
                            user_name: data.data.user.nickname,
                            text: data.content,
                        });
                        // 添加内容之后，需要滚动到最后
                        this.scroll_to_lower();
                        break;
                }
            },
            
            // 心跳
            socket_ping_handle() {
                // 清除定时任务
                this.clear_interval_task();
            
                // 启动定时任务
                this.ping_timer = setInterval(() => {
                    this.socket_send('ping', app.globalData.get_timestamp());
                }, this.ping_interval * 1000);
            },
            clear_interval_task() {
                if (this.ping_timer != null) {
                    clearInterval(this.ping_timer);
                    this.ping_timer = null;
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
            add_comment() {
                //#ifndef H5
                this.is_add_comment = true;
                //#endif
            },
            // 监听键盘高度变化事件
            listener(res) {
                // 减1是为了兼容，避免跟键盘之间会不连贯
                if (res.height > 0) {
                    this.listener_height = res.height - 1;
                } else {
                    this.listener_height = 0;
                }
            },
            bind_keyboard_listener() {
                uni.onKeyboardHeightChange(this.listener);
            },
            unbind_keyboard_listener() {
                uni.offKeyboardHeightChange(this.listener);
            },
            
            comment_input_confirm(e) {
                const value = e.detail.value;
                if (value != '') {
                    this.socket_send('message', e.detail.value);
                }
                this.comment_value = '';
            },
            //#endregion
            
            //#region 商品弹出框
            add_goods() {
                this.$refs.popupGoodsRef.open();
            },
            //#endregion
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

.avatar {
    width: 60rpx;
    height: 60rpx;
    border-radius: 30rpx;
}

.nickname {
    max-width: 300rpx;
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
    width: 70rpx;
    height: 70rpx;
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
    padding: 6rpx 10rpx;
    background-color: rgba(40,40,40,0.45);
    border-radius: 10rpx;
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
    line-height: 30rpx;
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
    width: 100%;
    z-index: 99;
    background: #fff;
    padding: 20rpx 16rpx;
    box-sizing: border-box;

    .input {
        padding: 16rpx 22rpx;
        border: 1px solid #ddd;
        border-radius: 50rpx;
    }
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

.explain-goods {
    width: 200rpx;
    background: #fff;
    padding: 4rpx;
    box-sizing: border-box;
    position: absolute;
    right: 0;
    bottom: 20rpx;
    border-radius: 20rpx;
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