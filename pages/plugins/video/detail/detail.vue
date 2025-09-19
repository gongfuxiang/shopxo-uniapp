<template>
    <view class="content">
        <swiper class="swiper-container" :key="'top-or-buttom-' + swiper_key" :style="swiperStyle" :vertical="true" :circular="close_circular ? false : true" :current="current_index" easing-function="easeInOutCubic" @change="handleSwiperChange">
            <swiper-item v-for="(video_item, index) in display_video_list" :key="video_item.id">
                <view class="video-container" @tap="toggle_play_pause">
                    
                    <video class="video" :src="video_item.videoUrl" :poster="video_item.posterUrl" :id="`video_${index}`" :loop="true" :controls="false" :show-center-play-btn="false" :show-play-btn="false" object-fit="contain" @timeupdate="handle_time_update"></video>
                    
                    <text v-if="paused && current_index === index" class="play-icon">▶</text>
                    <template v-if="!show_comment_modal">
                        <!-- Right Action Bar -->
                        <view class="right-actions">
                            <view class="action-item" :data-value="video_item" @tap.stop="handle_like">
                                <iconfont name="icon-givealike" :color="video_item.isLike ? '#fff' : ''" size="60rpx" />
                                <text class="action-text">{{ video_item.fabulous_count }}</text>
                            </view>
                            <view class="action-item" :data-value="video_item" @tap.stop="handle_comment">
                                <iconfont name="icon-comment" color="#fff" size="60rpx" />
                                <text class="action-text">{{ video_item.comment_obj.count }}</text>
                            </view>
                            <view class="action-item" :data-value="video_item" @tap.stop="handle_share">
                                <iconfont name="icon-share-solid" color="#fff" size="60rpx"></iconfont>
                                <text class="action-text">分享</text>
                            </view>
                        </view>

                        <!-- Bottom Info -->
                        <view class="bottom-info">
                            <text class="author">@{{ video_item.userNick }}</text>
                            <text class="video-content">{{ video_item.videoContent }}</text>
                        </view>

                        <!-- Progress Bar -->
                        <view class="progress-bar-container" v-if="current_index === index">
                            <slider class="progress-slider" :value="current_video_progress" :max="current_video_duration" @change="handle_slider_change" @changing="handle_slider_changing" block-size="14" activeColor="#FFFFFF" backgroundColor="rgba(255, 255, 255, 0.4)" />
                            <text class="time-display">{{ formatTime(current_video_progress) }} / {{ formatTime(current_video_duration) }}</text>
                        </view>
                    </template>
                </view>
            </swiper-item>
        </swiper>
        
        <!-- 评论弹窗 -->
        <view v-if="show_comment_modal" class="comment-modal" @tap="close_comment_modal">
            <view class="comment-content" :style="commentContentStyle" @tap.stop @touchstart="handle_comment_touch_start" @touchmove="handle_comment_touch_move" @touchend="handle_comment_touch_end">
                <view class="comment-header">
                    <text class="comment-count">评论</text>
                    <view class="close-btn" @tap="close_comment_modal">✕</view>
                </view>
                <!-- 评论内容区域 -->
                <scroll-view class="comment-list" scroll-y show-scrollbar="false" @scroll="handle_comment_scroll">
                    <view class="comment-scroll">
                        <view class="comment-item flex-row align-s gap-10" v-for="(comment_item, index) in active_comments" :key="index">
                            <commentInfoComponent :propsComment="comment_item" :propsId="comment_item.id" @comment_reply="comment_reply" @comment_like="comment_like">
                                <!-- 子评论 -->
                                <view class="sub-comment flex-col jc-c" slot="sub-comment">
                                    <view v-if="!comment_item.show_sub_comment">
                                        <commentMoreComponent :propsId="comment_item.id" :propsText="'—— 展开' + (comment_item.subComments ? comment_item.subComments.length || 0 : 0) + '条回复'" @comment_more_event="open_sub_comment"></commentMoreComponent>
                                    </view>
                                    <template v-else>
                                        <view v-if="comment_item.subComments && comment_item.subComments.length > 0" class="sub-comment-list flex-col jc-c">
                                            <view class="sub-comment-item flex-row align-s gap-10" v-for="(sub_comment_item, sub_comment_index) in comment_item.subComments" :key="sub_comment_index">
                                                <commentInfoComponent :propsComment="sub_comment_item" :propsId="sub_comment_item.id" @comment_reply="sub_comment_reply" @comment_like="sub_comment_like"></commentInfoComponent>
                                            </view>
                                        </view>
                                        <template v-if="comment_item.show_sub_comment_loading">
                                            <loading-component></loading-component>
                                        </template>
                                        <view v-else class="sub-comment-more mt-10 flex-row align-c gap-10">
                                            <view v-if="!comment_item.is_exactly">
                                                <commentMoreComponent :propsId="comment_item.id" propsText="展开" @comment_more_event="open_sub_comment"></commentMoreComponent>
                                            </view>
                                            <commentMoreComponent :propsId="comment_item.id" propsText="收起" propsIconName="icon-arrow-top" @comment_more_event="close_sub_comment"></commentMoreComponent>
                                        </view>
                                    </template>
                                </view>
                            </commentInfoComponent>
                        </view>
                    </view>
                </scroll-view>
                <view class="comment-input-container">
                    <view class="flex-col jc-c">
                        <view class="flex-row align-c gap-10 wh-auto ht-auto">
                            <input class="comment-input" type="text" placeholder="说点什么..." @confirm="send_comment" />
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import videoList from '@/pages/plugins/video/detail/video_list.json';
    import { get_math } from '@/common/js/common/common.js';
    import loadingComponent from '@/pages/plugins/video/components/loading.vue';
    import commentInfoComponent from '@/pages/plugins/video/components/comment-info.vue';
    import commentMoreComponent from '@/pages/plugins/video/components/comment-more.vue';
    export default {
        components: {
            loadingComponent,
            commentInfoComponent,
            commentMoreComponent
        },
        data() {
            return {
                videoData: videoList,
                display_video_list: [],
                current_index: 0,
                video_contexts: [],
                paused: false,
                current_video_progress: 0,
                current_video_duration: 0,
                is_seeking: false,
                show_comment_modal: false,
                active_comments: {},
                comment_start_y: 0, // 评论开始拖拽位置
                comment_current_y: 0, // 评论当前拖拽位置
                move_distance: 0,
                current_video_id: '1', // 当前播放视频的ID
                is_slide_start: false,
                swiper_key: get_math(),
                comment_scroll_top: 0,
            };
        },
        computed: {
            swiperStyle() {
                return this.show_comment_modal ? (this.move_distance > 0 ? `height: calc(30% + ${this.move_distance}px);` : 'height: 30%;') : 'height: 100%;';
            },
            commentContentStyle() {
                return this.show_comment_modal && this.move_distance > 0 ? `transform: translateY(3px); height: calc(70% - ${this.move_distance}px);` : `transform: translateY(0); height: 70%;`;
            },
            current_video_index() { 
                return this.videoData.findIndex(item => item.id === this.current_video_id);
            },
            // 如果是第一个或者最后一个的情况下，取消无限轮播
            close_circular() {
                return this.videoData[0].id == this.current_video_id  || this.videoData[this.videoData.length - 1].id == this.current_video_id;
            }
        },
        onLoad() {
            // 初始化显示数据
            this.init_display_data();
        },
        onReady() {
            this.videoData.forEach((item, index) => {
                this.video_contexts[index] = uni.createVideoContext(`video_${index}`, this);
            });
            setTimeout(() => {
                if (this.video_contexts[0]) { // 当前播放的视频索引为0
                    this.video_contexts[0].play();
                }
            }, 200);
        },
        methods: {
            // 初始化显示数据
            init_display_data() {
                this.current_video_id = this.videoData[0].id;
                this.display_video_list = [
                    this.getVideoByIndex(0),       // 当前元素
                    this.getVideoByIndex(1),       // 下一个元素
                    this.getVideoByIndex(2)        // 下两个元素
                ];
            },
            
            // 安全获取视频数据的方法，处理索引超限情况
            getVideoByIndex(index) {
                // 处理负数索引
                if (index < 0) {
                    // 循环到数组末尾
                    const actualIndex = this.videoData.length + (index % this.videoData.length);
                    return this.videoData[actualIndex];
                }
                
                // 处理超出数组长度的索引
                if (index >= this.videoData.length) {
                    // 循环到数组开头
                    const actualIndex = index % this.videoData.length;
                    return this.videoData[actualIndex];
                }
                
                // 正常情况直接返回
                return this.videoData[index];
            },
            
            // 更新显示数据
            update_display_data() {
                let list = [];
                // 如果当前索引为0，只显示当前元素和下一个元素
                if (this.current_index == 0) {
                    list = [
                        this.getVideoByIndex(this.current_video_index),
                        this.getVideoByIndex(this.current_video_index + 1), // 下一个元素
                        this.getVideoByIndex(this.current_video_index - 1) // 上一个元素，
                    ];
                } else if (this.current_index == 1) { // 索引为1时，为确保无限轮播正常，需要改变数据插入顺序
                    list = [
                        this.getVideoByIndex(this.current_video_index - 1),
                        this.getVideoByIndex(this.current_video_index),
                        this.getVideoByIndex(this.current_video_index + 1)
                    ];
                } else {
                    list = [
                        this.getVideoByIndex(this.current_video_index + 1),
                        this.getVideoByIndex(this.current_video_index - 1),
                        this.getVideoByIndex(this.current_video_index),
                    ];
                }

                this.setData({
                    display_video_list: list
                })
            },
            
            // 预加载相邻数据
            preload_adjacent_data() {
                // 这里可以添加预加载逻辑，比如提前加载视频封面等
                console.log('预加载数据，当前视频ID:', this.current_video_id);
            },

            handleSwiperChange(event) {
                const { current } = event.detail;

                const previousIndex = this.current_index;
                if (this.video_contexts[previousIndex]) {
                    this.video_contexts[previousIndex].pause();
                }

                this.current_index = current;
                this.paused = false;
                this.current_video_progress = 0;
                this.current_video_duration = 0;
                this.is_seeking = false;
                // 更新当前播放视频的ID
                this.current_video_id = this.display_video_list[current].id;
                // 当滑动到边界时更新显示数据
                if (this.current_video_index == 0 && this.is_slide_start) {
                    // this.$nextTick(() => {
                        const list = [
                            this.getVideoByIndex(0),
                            this.getVideoByIndex(1),
                            this.getVideoByIndex(2)
                        ];
                        console.log('更新显示数据', list);
                        
                        this.setData({
                            is_slide_start: false,
                            current_index: 0,
                            display_video_list: list,
                            swiper_key: get_math()
                        })
                    // })
                } else if (this.current_video_index == this.videoData.length - 1) {
                    // this.$nextTick(() => {
                        const list = [
                            this.getVideoByIndex(this.current_video_index - 2),
                            this.getVideoByIndex(this.current_video_index - 1),
                            this.getVideoByIndex(this.current_video_index),
                        ];
                        this.setData({
                            current_index: 2,
                            display_video_list: list,
                            swiper_key: get_math()
                        })
                } else {
                    this.is_slide_start = true;
                    // 预加载当前index之后的视频
                    this.update_display_data();
                }

                setTimeout(() => {
                    // 播放当前视频
                    if (this.video_contexts[current]) {
                        this.video_contexts[current].play();
                    }
                }, 100);
            },

            toggle_play_pause() {
                if (!this.video_contexts[this.current_index]) return; // 当前播放的视频索引为1

                this.paused = !this.paused;
                if (this.paused) {
                    this.video_contexts[this.current_index].pause(); // 暂停中间的视频
                } else {
                    this.video_contexts[this.current_index].play();  // 播放中间的视频
                }
            },

            handle_like(e) {
                const video = e.currentTarget.dataset.value;
                video.is_fabulous = !video.is_fabulous;
                if (video.is_fabulous) {
                    video.fabulous_count++;
                } else {
                    video.fabulous_count--;
                }
            },
            // 打开评论区
            handle_comment(e) {
                const old_data = e.currentTarget.dataset.value;
                // 初始化评论数据
                const new_data = old_data.comment_obj.list.map(item1 => ({
                    ...item1,
                    show_sub_comment: false,
                    show_sub_comment_loading: false,
                    is_exactly: false,
                    subComments: [],
                }));
                this.setData({
                    active_comments: new_data,
                    show_comment_modal: true,
                    move_distance: 0,
                })
            },
            // 关闭评论区
            close_comment_modal() {
                this.setData({
                    show_comment_modal: false,
                    move_distance: 0,
                })
            },
            // 评论滚动事件, 记录滚动位置
            handle_comment_scroll(e) {
                this.comment_scroll_top = e.detail.scrollTop;
            }, 
            // 评论拖拽开始
            handle_comment_touch_start(e) {
                // 只有滚动到顶部时才允许拖拽
                if (this.comment_scroll_top === 0) {
                    this.comment_start_y = e.touches[0].pageY;
                    this.comment_current_y = this.comment_start_y;
                    this.move_distance = 0;   
                }
            },

            // 评论拖拽中
            handle_comment_touch_move(e) {
                // 只有滚动到顶部时才允许拖拽
                if (this.comment_scroll_top === 0) {
                    this.comment_current_y = e.touches[0].pageY;
                    this.move_distance = this.comment_current_y - this.comment_start_y;
                }
            },

            // 评论拖拽结束
            handle_comment_touch_end(e) {
                // 只有滚动到顶部时才允许拖拽
                if (this.comment_scroll_top === 0) {
                    const move_distance = this.comment_current_y - this.comment_start_y;
                    // 如果拖拽距离足够大，关闭评论弹窗
                    if (move_distance > 150) {
                        this.close_comment_modal();
                    } else {
                        this.move_distance = 0;
                    }
                }
            },

            send_comment(e) {
                let comment_text = '';
                if (e.type === 'confirm') {
                    comment_text = e.detail.value;
                } else {
                    // 获取输入框的值
                    const input_element = this.$el.querySelector('.comment-input');
                    comment_text = input_element.value;
                }
                
                if (!comment_text.trim()) return;
                
                const newComment = {
                    id: `c${Date.now()}`,
                    userHead: 'http://8.146.211.120:8080/upload/avatar/d5537aa243ef6a74a50bf4ffd4ca6876.jpg',
                    userNick: '我',
                    content: comment_text,
                    time: new Date().toLocaleString()
                };
                this.active_comments.list.unshift(newComment);
                this.active_comments.count++;
                
                // 清空输入框
                const input_element = this.$el.querySelector('.comment-input');
                if (input_element) {
                    input_element.value = '';
                }
            },
            // 展开子评论
            open_sub_comment(id) {
                const comment = this.active_comments.find(item => item.id === id);
                if (comment) {
                    comment.show_sub_comment = true;
                    comment.show_sub_comment_loading = true;
                    setTimeout(() => {
                        comment.subComments.push({
                            id: `c${Date.now()}`,
                            userHead: 'http://8.146.211.120:8080/upload/avatar/d5537aa243ef6a74a50bf4ffd4ca6876.jpg', // Placeholder avatar
                            userNick: '我',
                            content: '子评论内容',
                            time: new Date().toLocaleString()
                        });
                        comment.show_sub_comment_loading = false;
                    }, 500);
                }
            },
            // 收起子评论
            close_sub_comment(id) {
                const comment = this.active_comments.find(item => item.id === id);
                if (comment) {
                    comment.show_sub_comment = false;
                }
            },
            handle_share(video) {
                uni.showToast({
                    title: '分享',
                    icon: 'none'
                });
            },

            handle_time_update(e) {
                if (this.is_seeking) return;
                if (e.detail.duration > 0 && this.current_video_duration === 0) {
                    this.current_video_duration = e.detail.duration;
                }
                this.current_video_progress = e.detail.currentTime;
            },

            handle_slider_changing() {
                this.is_seeking = true;
            },

            handle_slider_change(e) {
                const seek_time = e.detail.value;
                if (this.video_contexts[this.current_index]) {
                    this.video_contexts[this.current_index].seek(seek_time);
                    this.current_video_progress = seek_time;
                }
                setTimeout(() => {
                    this.is_seeking = false;
                }, 100);
            },

            formatTime(seconds) {
                if (isNaN(seconds) || seconds < 0) {
                    return '00:00';
                }
                const min = Math.floor(seconds / 60);
                const sec = Math.floor(seconds % 60);
                return `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;
            }
        }
    };
</script>

<style lang="scss" scoped>
    .mt-10 {
        margin-top: 20rpx;
    }
    .ml-10 {
        margin-left: 20rpx;
    }

    .content,
    .swiper-container {
        width: 100%;
        height: 100vh;
        background-color: #000;
    }

    .video {
        width: 100%;
        height: 100%;
    }

    .video-container {
        position: relative;
        width: 100%;
        height: 100%;
    }

    .play-icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
        font-size: 160rpx;
        color: rgba(255, 255, 255, 0.6);
    }

    .right-actions {
        position: absolute;
        right: 20rpx;
        bottom: 200rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        color: #fff;
        z-index: 10;
    }

    .action-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 40rpx;
    }

    .user-avatar {
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
        border: 4rpx solid #fff;
    }

    .icon {
        width: 70rpx;
        height: 70rpx;
    }

    .action-text {
        font-size: 28rpx;
        margin-top: 10rpx;
    }

    .bottom-info {
        position: absolute;
        bottom: 180rpx;
        left: 30rpx;
        color: #fff;
        text-shadow: 2rpx 2rpx 4rpx rgba(0, 0, 0, 0.5);
        z-index: 10;
    }

    .author {
        font-size: 36rpx;
        font-weight: bold;
    }

    .video-content {
        display: block;
        font-size: 30rpx;
        margin-top: 16rpx;
        max-width: 70%;
    }

    .progress-bar-container {
        position: absolute;
        bottom: 120rpx;
        left: 30rpx;
        right: 30rpx;
        display: flex;
        align-items: center;
        z-index: 11;
    }

    .progress-slider {
        flex: 1;
        margin: 0 20rpx;
    }

    .time-display {
        color: #fff;
        font-size: 24rpx;
        text-shadow: 2rpx 2rpx 2rpx rgba(0, 0, 0, 0.6);
        width: 180rpx;
        text-align: right;
    }
    
    /* 评论弹窗样式 */
    .comment-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 999;
        display: flex;
        justify-content: center;
        align-items: flex-end;
    }
    
    .comment-content {
        width: 100%;
        height: 70%;
        background-color: #fff;
        border-top-left-radius: 30rpx;
        border-top-right-radius: 30rpx;
        display: flex;
        flex-direction: column;
        transition: transform 0.3s ease;
    }
    
    .comment-header {
        padding: 30rpx;
        border-bottom: 2rpx solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .comment-count {
        font-weight: bold;
        font-size: 32rpx;
    }
    
    .close-btn {
        font-size: 40rpx;
        color: #999;
    }
    
    .comment-list {
        flex: 1;
        overflow: hidden;
        .comment-scroll {
            width: 100%;
            height: 100%;
            padding: 30rpx;
            box-sizing: border-box;
        }
    }
    
    .comment-item {
        margin-bottom: 30rpx;
    }
    
    .sub-comment {
        margin-top: 22rpx;
    }
    
    .sub-comment-list {
        gap: 40rpx;
    }
    .comment-input-container {
        display: flex;
        padding: 20rpx;
        border-top: 2rpx solid #eee;
    }
    
    .comment-input {
        flex: 1;
        border: 2rpx solid #eee;
        border-radius: 8rpx;
        padding: 16rpx;
        font-size: 28rpx;
    }
    
    .send-btn {
        margin-left: 20rpx;
        padding: 16rpx 30rpx;
        background-color: #ff4757;
        color: white;
        border: none;
        border-radius: 8rpx;
        font-size: 28rpx;
    }
</style>

