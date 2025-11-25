<template>
    <!-- #ifdef APP-NVUE -->
    <view class="flex-col jc-sb re pa-10 box-border-box" :style="'width:' + windowWidth + 'px;height:' + windowHeight + 'px;'">
    <!-- #endif -->
    <!-- #ifndef APP-NVUE -->
    <view class="flex-col jc-sb re pa-10 box-border-box" style="width: 100vw;height: 100vh;">
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
                <view class="flex-row align-c re" style="direction: rtl;">
                    <view v-for="(item, index) in viewers" :key="index" class="viewer-wrapper" :style="'z-index:' + (index + 1) + ';' + (index == 0 ? 'margin-right: 0;' : '')">
                        <image :src="item.avatar" class="viewer-avatar"  mode="aspectFill"></image>
                    </view>
                </view>
                <view class="viewer-back ml-5 flex-row align-c jc-c" @tap="live_back">
                    <u-icon name="logout-round" class="viewer-back-icon" size="40rpx" color="#fff"></u-icon>
                </view>
            </view>
        </view>
        <view class="flex-1 bottom-line-exclude-bottom flex-row">
            <view class="flex-1 flex-col jc-e">
                <view class="bulletin-area re" :style="'width:' + (windowWidth - 100) + 'px;'">
                    <!-- #ifdef APP-NVUE -->
                    <!-- nvue 使用 list进行列表渲染 -->
                    <list class="bulletin-area" :style="'width:' + (windowWidth - 100) + 'px;'" :show-scrollbar="false" loadmoreoffset="30" @scroll="scroll_event" @loadmore="scrolltolower">
                        <cell v-for="(item, index) in bulletins" :key="item.id" ref="bulletin_index">
                    <!-- #endif -->
                    <!-- #ifndef APP-NVUE -->
                    <!-- scroll-view 只有非nvue的页面使用 -->
                    <scroll-view scroll-y class="bulletin-area" :style="'width:' + (windowWidth - 100) + 'px;'" :show-scrollbar="false" lower-threshold="30" :scroll-with-animation="true" :scroll-top="scroll_top" @scroll="scroll_event" @scrolltolower="scrolltolower">
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
                        <input :value="comment_value" type="text" confirm-type="done" :adjust-position="false" placeholder="说点什么" @focus="add_comment" @input="(e) => comment_value = e.detail.value" />
                    </view>
                    <view class="bottom-actions-icon" @tap="add_goods">
                        <u-icon name="shopping-cart-tall" color="#fff" size="32rpx"></u-icon>
                    </view>
                    <u-like-button>
                        <view class="bottom-actions-icon">
                            <u-icon name="givealike-o" color="#fff" size="32rpx"></u-icon>
                        </view>
                    </u-like-button>
                    <view class="bottom-actions-icon">
                        <u-icon name="share-solid" color="#fff" size="32rpx"></u-icon>
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
        <u-popup ref="popupGoodsRef" mode="bottom" title="添加商品" :closeable="true">
           <s-goods isGoodsPopup></s-goods>
        </u-popup>
        <!-- #ifndef APP-NVUE -->
        <view v-if="is_countdown_visible" class="abs top-0 left-0 z-deep" style="width: 100vw;height: 100vh;">
            <view class="countdown-display flex-row align-c jc-c re" :style="'left:'+ (windowWidth / 2 - 50) + 'px;top:' + (windowHeight / 2 - 50) + 'px;'">
                <text v-if="is_countdown_num_visible" class="countdown-text countdown-animation">{{ countdown_num }}</text>
            </view>
        </view>
        <!-- #endif -->
        <!-- #ifdef APP-NVUE -->
        <view v-if="is_countdown_visible" class="abs top-0 left-0 z-deep" :style="'width:' + windowWidth + 'px;height:' + windowHeight + 'px;'">
            <view class="countdown-display flex-row align-c jc-c re" :style="'left:'+ (windowWidth / 2 - 50) + 'px;top:' + (windowHeight / 2 - 50) + 'px;'">
                <text v-if="is_countdown_num_visible"  ref="countdown" class="countdown-text">{{ countdown_num }}</text>
            </view>
        </view>
        <!-- #endif -->
    </view>
</template>

<script setup>
    import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
    import $common from '@/common/js/common.js';
    const props = defineProps({
        liveConfig: {
            type: Object,
            default: () => {}
        }
    })

    //#region 直播间设置
    const live_data = ref({});
    watch(()=> props.liveConfig, (mew_value) => {
        if (mew_value.data != null) {
            // 获取配置信息
            live_data.value = mew_value.data;
        }
    }, { immediate:true, deep: true })
    //#endregion
    const userAvatar = ref('/static/images/common/user.png');
    // 模拟观看者数据
    const viewers = ref([
        { avatar: '/static/images/common/user.png' },
        { avatar: '/static/images/common/user.png' },
        { avatar: '/static/images/common/user.png' }
    ]);
    
    //#region 头部样式和页面宽度处理
    const windowWidth = ref(0);
    const windowHeight = ref(0);
    const header_style = ref('');
    onMounted(() => {
        const data = uni.getWindowInfo();
        windowWidth.value = data.windowWidth;
        windowHeight.value = data.windowHeight;

        // 菜单按钮位置信息, uniappx中没有这个方法，但是能使用
        header_style.value = 'padding-top: 20rpx;';
        // 设置有胶囊的时候头部显示的位置
        // #ifdef MP
        // 判断是否有胶囊
        const is_page = $common.is_current_single_page();
        // 如果有胶囊的时候，做处理
        if (is_page == 0) {
            const custom = uni.getMenuButtonBoundingClientRect();
            header_style.value = `padding-top: ${custom.top + custom.height}px;`;
        }
        //#endif
        //#ifdef APP
        header_style.value = 'padding-top: 88rpx;'
        //#endif
    });
    //#endregion

    // 退出直播
    const emit = defineEmits(['liveBack'])
    const live_back = () => {
        $common.showModal('温馨提示', '观众正在赶来的路上，确认关闭直播吗？').then(() => {
            emit('liveBack');
        });
    }

    //#region 评论区
    const bulletins = ref([
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
    ])
    const scroll_top = ref(0);
    // 滚动条的高度
    const scoll_height = ref(600);
    //#ifdef APP-NVUE
    scoll_height.value = uni.upx2px(600);
    const domModule = uni.requireNativePlugin('dom');
    //#endif
    //#ifndef APP-NVUE
    scoll_height.value = uni.rpx2px(600);
    //#endif
    const bulletin_index = ref(null);
    // 滚动到最底部
    const scroll_to_lower = () => {
        nextTick(() => {
            //#ifndef APP-NVUE
            const num = Math.random();
            scroll_top.value = scoll_height.value + num;
            //#endif
            //#ifdef APP-NVUE
            domModule.scrollToElement((bulletin_index.value[bulletins.value.length - 1]), {
                offset: scoll_height.value,  // 偏移量，可根据需要调整
                animated: true  // 是否带动画
            });
            //#endif
        })
    }
    onMounted(() => {
        scroll_to_lower();
    })
    // nvue只能使用flex布局，无法实现文字主动换行的情况，将文字切割成数组，一个一个渲染
    const split_text = (val) => {
        return val.split('');
    }
    // 列表滚动事件
    // 判断列表是否滚动了，如果滚动了，就认为他不是在底部，就要显示有多少条信息
    const is_scroll_to_lower = ref(false);
    const message_num = ref(0);
    const scroll_event = (e) => {
        is_scroll_to_lower.value = false;
    }
    // 滚动到底部
    const scrolltolower = (e) => {
        // 滚动到底部触发的事件，将显示的多少条信息给隐藏起来
        setTimeout(() => {
            // 滑动到底部的时候，清除历史存储的消息数据
            message_num.value = 0;
            is_scroll_to_lower.value = true;
        }, 0);
    }
    // 点击新消息时，自动跳转到底部
    const message_num_event = () => {
        scroll_to_lower();
    }
    //#endregion

     //#region 获取用户头像信息和socket连接信息
    const avatar = ref('/static/images/common/user.png');
    onMounted(() => {
        const new_user = uni.getStorageSync(uni.$store?.state?.cache_user_info_key ?? '') || null;
        if (new_user != null) {
            avatar.value = new_user.avatar;
        }
        // 连接socket
        socket_connect();
    })

    // 连接socket
    const task = ref(null);
    const socket_connect = () => {
        task.value = uni.connectSocket({
            url: "wss://new.shopxo.vip:9502",
            header: {
                "content-type": "application/json",
            },
            complete: () => {}
        });

        // task.value.onOpen(function(res) {
        //     task.value = task.value;
        // });
        task.value.onMessage(function(res) {
            socket_message_back_handle(res);
        });
        task.value.onClose(function(res) {
            task.value = null;
            console.log('close', res);
        });
        task.value.onError(function(res) {
            task.value = null;
            console.log('error', res);
        });
    }

    // socket消息id
    const socket_id = ref(0);
    // 心跳定时任务
    const ping_timer = ref(null);
    // 心跳间隔时间
    const ping_interval = ref(30);
    // 当前观看直播用户id
    const live_user_id = ref([]);
    // 观看用户名称
    const commons_name = ref('陌生网友'); // 用户名称
    const is_user_comes = ref(false);
    const is_user_comes_timer = ref(null);
    // 消息回调处理
    const socket_message_back_handle = (e) => {
        let res = JSON.parse(e.data);
        if(res.code !== 0) {
            $common.showToast(res.msg);
            return false;
        }
        let data = res.data;
        switch(data.type) {
            // 初始化
            case 'init' :
                socket_id.value = data.data.fd;
                ping_interval.value = parseInt(data.data.ping_interval || 30);
                // 初始化消息
                socket_send('init');
                break;

            // 初始化成功
            case 'init-success' :
                live_user_id.value = data.data.live_user_id;
                // 启动心跳
                socket_ping_handle();
                break;

            // 初始化失败
            case 'init-fail' :
                console.log('connect fail');
                break;

            // 加入直播间提示
            case 'join' :
                commons_name.value = data.content;
                is_user_comes.value = true;
                // 设置定时任务，如果在固定时间内有其他人进入,就清除之前的定时任务，并重新设置一个定时任务，确保关闭时间
                if (is_user_comes_timer.value != null) {
                    clearTimeout(is_user_comes_timer.value)
                }
                is_user_comes_timer.value = setTimeout(() => {
                    is_user_comes.value = false
                }, 1000);
                break;
            // 消息
            case 'message':
                bulletins.value.push({
                    id: Math.random(),
                    type: 'user',
                    user_avatar: data.data.user.avatar,
                    user_name: data.data.user.nickname,
                    text: data.content,
                });
                // 添加内容之后，需要滚动到最后
                scroll_to_lower();
                break;
        }
    }

    // 心跳
    const socket_ping_handle = () => {
        // 清除定时任务
        clear_interval_task();

        // 启动定时任务
        ping_timer.value = setInterval(function() {
            socket_send('ping', $common.get_timestamp());
        }, ping_interval.value * 1000);
    }
    const clear_interval_task = () => {
        if (ping_timer.value != null) {
            clearInterval(ping_timer.value);
            ping_timer.value = null;
        }
    }

    // 消息发送
    // 获取配置信息
    const application_client_type = $common.application_client_type();
    const application_client_brand = $common.application_client_brand();
    const uuid = $common.request_uuid();
    const user = $common.get_user_cache_info();
    // type init初始化, ping心跳, message消息
    const socket_send = (type = 'message', content = '') => {
        if(task.value === null) {
            $common.showToast('socket连接失败！');
            return false;
        }
        // 发送消息
        let token = user == null ? '' : user.token || '';
        task.value.send({data: JSON.stringify({
            application_client_type: application_client_type.value,
            application_client_brand: application_client_brand.value,
            system_type: uni.$store.state.system_type || 'default',
            uuid: uuid,
            token: token,
            live_room_id: live_data.value.id, // 直播间id
            live_user_id: live_user_id.value, // 直播用户id
            fd: socket_id.value,
            type: type,
            content: content
        })});
    }

    onUnmounted(() => {
        clear_interval_task();
    })
    //#endregion

    //#region 监听键盘弹出事件
    const comment_value = ref('');
    const is_add_comment = ref(false);
    const add_comment = () => {
        is_add_comment.value = true
    }
    // 监听键盘高度变化事件
    const listener_height = ref(0);
    const listener = (res) => {
        // 减1是为了兼容，避免跟键盘之间会不连贯
        if (res.height > 0) {
            listener_height.value = res.height - 1;
        } else {
            listener_height.value = 0;
        }
    }
    onMounted(() => {
        uni.onKeyboardHeightChange(listener);
    })
    onUnmounted(() => {
        uni.offKeyboardHeightChange(listener);
    })
    
    const comment_input_confirm = (e) => {
        const value = e.detail.value;
        if (value != '') {
            socket_send('message', e.detail.value);
        }
        comment_value.value = '';
    }
    //#endregion

    //#region 商品弹出框
    const popupGoodsRef = ref(null);
    const add_goods = () => {
        popupGoodsRef.value.open();
    }
    //#endregion

    //#region 点赞相关
    
    //#endregion

    //#region 3 2 1倒计时相关
    const countdown_num = ref(3);
    const countdownTimer = ref(null);
    const is_countdown_visible = ref(true);
    const is_countdown_num_visible = ref(true);
    //#ifdef APP-NVUE
    const countdown = ref(null);
    const nvueAnimation = uni.requireNativePlugin('animation');
    //#endif
    
    // 执行单次倒计时动画
    const executeCountdownAnimation = () => {
        // 使用nvue的transition方法执行流畅动画
        if (countdown.value) {
            nvueAnimation.transition(countdown.value, {
                styles: {
                    transform: 'scale(2)',
                    opacity: 0
                },
                duration: 1000,
                timingFunction: 'ease-in-out', // 使用缓动函数使动画更自然
                delay: 0
            }, () => {
                // 动画完成后更新数字并重置动画状态
                countdown_num.value--;
                
                // 重置动画状态
                if (countdown.value) {
                    nvueAnimation.transition(countdown.value, {
                        styles: {
                            transform: 'scale(1)',
                            opacity: 1
                        },
                        duration: 0 // 瞬间重置
                    }, () => {
                        // 当倒计时到0时结束（显示完1之后减到0再隐藏）
                        if (countdown_num.value <= 1) {
                            clearInterval(countdownTimer.value);
                            countdownTimer.value = null;
                            //  延时900毫秒之后立即隐藏倒计时组件
                            setTimeout(() => {
                                is_countdown_visible.value = false;
                                is_countdown_num_visible.value = false;
                            }, 900)
                        }
                    });
                }
            });
        } else {
            // 如果无法获取到元素，直接更新数字
            countdown_num.value--;
            // 当倒计时到0时结束（显示完1之后减到0再隐藏）
            if (countdown_num.value <= 1) {
                clearInterval(countdownTimer.value);
                countdownTimer.value = null;
                // 延时900毫秒之后立即隐藏倒计时组件
                setTimeout(() => {
                    is_countdown_visible.value = false;
                    is_countdown_num_visible.value = false;
                }, 900)
            }
        }
    };
    
    // 启动倒计时
    const startCountdown = () => {
        //#ifndef APP-NVUE
        countdown_num.value = 3;
        is_countdown_visible.value = true;
        is_countdown_num_visible.value = true;
        
        countdownTimer.value = setInterval(() => {
            // 每次数字变化时触发动画
            is_countdown_num_visible.value = false;
            
            setTimeout(() => {
                countdown_num.value--;
                is_countdown_num_visible.value = true;
                
                // 当倒计时到0时结束（显示完1之后减到0再隐藏）
                if (countdown_num.value <= 0) {
                    clearInterval(countdownTimer.value);
                    countdownTimer.value = null;
                    // 立即隐藏倒计时组件
                    is_countdown_visible.value = false;
                    is_countdown_num_visible.value = false;
                }
            }, 300);
        }, 1000);
        //#endif
        //#ifdef APP-NVUE
        countdown_num.value = 3;
        is_countdown_visible.value = true;
        is_countdown_num_visible.value = true;
        
        // 立即执行第一次动画
        setTimeout(() => {
            executeCountdownAnimation();
        }, 50); // 50毫秒后开始第一次动画
        
        // 设置定时器处理后续动画
        countdownTimer.value = setInterval(() => {
            // 每次数字变化时触发动画
            is_countdown_num_visible.value = false;
            
            setTimeout(() => {
                is_countdown_num_visible.value = true;
                // 延迟一点时间再执行动画，确保元素已显示
                setTimeout(() => {
                    executeCountdownAnimation();
                }, 50);
            }, 50);
        }, 1000);
        //#endif  
    };
    
    // 组件挂载时启动倒计时
    onMounted(() => {
        startCountdown();
    });
    
    // 组件销毁时清理定时器
    onUnmounted(() => {
        if (countdownTimer.value) {
            clearInterval(countdownTimer.value);
        }
    });
    //#endregion
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
    width: 60rpx;
    height: 60rpx;
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