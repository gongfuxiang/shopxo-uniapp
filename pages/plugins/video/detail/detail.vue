<template>
    <view class="content pr">
        <!-- 搜索框 -->
		<view v-if="!show_comment_modal" class="header-top" :style="top_content_style + menu_button_info">
			<view id="search-height" class="flex-row align-c">
				<view class="cp" @tap="handle_back">
					<iconfont name="icon-arrow-left " size="36rpx" color="#333" class="mr-10"></iconfont>
				</view>
				<view class="wh-auto ht-auto">
					<search-component :propIsDisabled="true" @disabled_search="handle_search" />
				</view>
			</view>
		</view>
        <swiper class="swiper-container" :key="'top-or-buttom-' + swiper_key" :style="swiperStyle" :vertical="true" :circular="close_circular ? false : true" :current="current_index" easing-function="easeInOutCubic" @change="handle_swiper_change">
            <swiper-item v-for="(video_item, index) in display_video_list" :key="video_item.id">
                <view class="video-container pr" @tap.stop="toggle_play_pause">
                    <view class="video-bg" :style="!isEmpty(video_item.poster_url) ? 'background-image: url(' + video_item.poster_url + ')' : ''"></view>
                    <video class="video" :src="video_item.videoUrl" :poster="video_item.poster_url" :id="`video_${index}`" :loop="true" :controls="false" :show-center-play-btn="false" :show-play-btn="false" object-fit="contain" @timeupdate="handle_time_update"></video>
                    
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
                            <view class="action-item" @tap.stop="handle_share">
                                <iconfont name="icon-share-solid" color="#fff" size="60rpx"></iconfont>
                                <text class="action-text">分享</text>
                            </view>
                        </view>

                        <!-- Bottom Info -->
                        <view class="product-card flex-row align-c gap-10">
                            <view class="product-image">
                                <image src="https://placehold.co/60x60" alt="张博士防辐射近视眼镜" mode="aspectFill" class="product-image"></image>
                            </view>
                            <view class="flex-1 flex-col align-sb jc-c gap-10">
                                <text class="product-name text-line-1">张博士防辐射近视眼镜</text>
                                <text class="product-price">¥210.00</text>
                            </view>
                            <view class="product-close" @tap.stop="product_close_event">
                                <iconfont name="icon-close" color="#999" size="30rpx"></iconfont>
                            </view>
                        </view>

                        <!-- Progress Bar -->
                        <view class="progress-bar-container" v-if="current_index === index">
                            <slider class="progress-slider" :value="current_video_progress" :max="current_video_duration" @change.stop="handle_slider_change" @changing="handle_slider_changing" block-size="14" activeColor="#FFFFFF" backgroundColor="rgba(255, 255, 255, 0.4)" />
                            <text class="time-display">{{ format_time(current_video_progress) }} / {{ format_time(current_video_duration) }}</text>
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
                        <view class="comment-item flex-col" v-for="(comment_item, index) in active_comments" :key="index">
                            <commentInfoComponent class="wh-auto ht-auto" :propComment="comment_item" :propId="comment_item.id" @comment_reply="comment_reply" @comment_like="comment_like"></commentInfoComponent>
                            <!-- 子评论 -->
                            <view class="sub-comment flex-col jc-c gap-10 mt-10">
                                <view v-if="comment_item.sub_comments && comment_item.sub_comments.length > 0" class="sub-comment-list flex-col jc-c">
                                    <view class="sub-comment-item flex-row align-s gap-10" v-for="(sub_comment_item, sub_comment_index) in comment_item.sub_comments" :key="sub_comment_index">
                                        <commentInfoComponent class="wh-auto ht-auto" :propComment="sub_comment_item" :propId="comment_item.id" :propSubId="sub_comment_item.id" @comment_reply="sub_comment_reply" @comment_like="sub_comment_like"></commentInfoComponent>
                                    </view>
                                </view>
                                <template v-if="!comment_item.show_sub_comment">
                                    <commentMoreComponent :propId="comment_item.id" :propText="'—— 展开' + (comment_item.sub_comments ? comment_item.sub_comments.length || 0 : 0) + '条回复'" @comment_more_event="open_sub_comment"></commentMoreComponent>
                                </template>
                                <template v-else>
                                    <template v-if="comment_item.show_sub_comment_loading">
                                        <loading-component></loading-component>
                                    </template>
                                    <view v-else class="sub-comment-more flex-row align-c gap-10">
                                        <view v-if="!comment_item.is_exactly">
                                            <commentMoreComponent :propId="comment_item.id" propText="展开" @comment_more_event="open_sub_comment"></commentMoreComponent>
                                        </view>
                                        <commentMoreComponent :propId="comment_item.id" propText="收起" propIconName="icon-arrow-top" @comment_more_event="close_sub_comment"></commentMoreComponent>
                                    </view>
                                </template>
                            </view>
                        </view>
                    </view>
                </scroll-view>
                <view class="comment-input-container">
                    <view class="comment-input-content flex-col jc-c">
                        <view class="flex-row align-c gap-10 wh-auto ht-auto">
                            <input :value="comment_input_value" class="comment-input" type="text" confirm-type="send" :placeholder="input_placeholder" @input="comment_input_event" @confirm="send_comment" />
                            <view style="font-size:32rpx;color: #999;" data-type="@" @tap="comment_input_change">@</view>
                            <view data-type="image" @tap="comment_input_change">
                                <iconfont name="icon-layout-module-single-images" size="32rpx" color="#999"></iconfont>
                            </view>
                        </view>
                        <view v-if="form_images_list.length > 0" class="pr w h comment-input-img-container">
                            <view v-for="(item, index) in form_images_list" :key="index" class="comment-input-img pr">
                                <iconfont name="icon-close" size="10" color="#000" class="comment-input-img-close" :data-index="index" @tap="comment_input_img_close"></iconfont>
                                <image :src="item.url" :data-index="index" @tap="upload_show_event" mode="aspectFill" class="wh-auto ht-auto"></image>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <!-- 分享弹窗 -->
        <component-share-popup ref="share"></component-share-popup>
    </view>
</template>

<script>
    const app = getApp();
    import videoList from '@/pages/plugins/video/detail/video_list.json';
    import { get_math, isEmpty } from '@/common/js/common/common.js';
    import loadingComponent from '@/pages/plugins/video/components/loading.vue';
    import commentInfoComponent from '@/pages/plugins/video/components/comment-info.vue';
    import commentMoreComponent from '@/pages/plugins/video/components/comment-more.vue';
    import searchComponent from '@/pages/plugins/video/components/search.vue';
    import componentSharePopup from '@/components/share-popup/share-popup';
    // 状态栏高度
    var bar_height = parseInt(app.globalData.get_system_info('statusBarHeight', 0));
    // #ifdef MP-TOUTIAO
    bar_height = 0;
    // #endif
    export default {
        components: {
            loadingComponent,
            commentInfoComponent,
            commentMoreComponent,
            searchComponent,
            componentSharePopup
        },
        data() {
            return {
                // #ifdef H5 || MP-TOUTIAO
                top_content_style: 'padding-top:' + bar_height + 7 + 'px;padding-bottom:10px;',
                // #endif
                // #ifndef H5 || MP-TOUTIAO
                top_content_style: 'padding-top:' + bar_height + 'px;padding-bottom:10px;',
                // #endif
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
                input_placeholder: '请输入您的精彩评论',
                comment_input_value: '',
                propMaxNum: 1,
                form_images_list: [],
                menu_button_info: '',
                share_info: {},
                params: {},
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
        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            this.setData({
                params: app.globalData.launch_params_handle(params),
            });
        },
        mounted() {
            this.init();
        },
        methods: {
            isEmpty,
            init() { 
                // 初始化显示数据
                this.init_display_data();
                // 更新分享信息
                this.update_share_info(this.display_video_list[0]);

                this.display_video_list.forEach((item, index) => {
                    this.video_contexts[index] = uni.createVideoContext(`video_${index}`, this);
                });
                setTimeout(() => {
                    if (this.video_contexts[0]) { // 当前播放的视频索引为0
                        this.video_contexts[0].play();
                    }
                }, 200);
                // 小程序下，获取小程序胶囊的宽度
                let menu_button_info = 'max-width:100%';
                // #ifndef MP-TOUTIAO
                    // #ifdef MP
                    // 判断是否有胶囊
                    const is_current_single_page = app.globalData.is_current_single_page();
                    // 如果有胶囊的时候，做处理
                    if (is_current_single_page == 0) {
                        const custom = uni.getMenuButtonBoundingClientRect();
                        menu_button_info = `max-width:calc(100% - ${custom.width + 10}px);`;
                    }
                    // #endif
                // #endif
                this.setData({
                    menu_button_info: menu_button_info,
                });
            },
            update_share_info(data) {
                const info = {
                    title: data.title || '',
                    desc: data.desc || '',
                    path: '/pages/plugins/video/detail/detail',
                    query: app.globalData.json_to_url_params(this.params),
                    img: data.poster_url || ''
                }
                this.setData({
                    share_info: info,
                });
                // 分享菜单处理
                app.globalData.page_share_handle(info);
            },
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
            // 评论输入框事件
            comment_input_event(e) {
                this.comment_input_value = e.detail.value;
            },
            comment_input_change(e) {
                const { type } = e.currentTarget.dataset;
                if (type == '@') {
                    this.comment_input_value = '@';
                } else if (type == 'image') {
                    var self = this;
                    uni.chooseImage({
                        count: self.propMaxNum,
                        success(res) {
                            var success = 0;
                            var fail = 0;
                            var length = res.tempFilePaths.length;
                            var count = 0;
                            self.upload_one_by_one(res.tempFilePaths, success, fail, count, length, 'uploadimage');
                        },
                    });
                }
            },
            // 采用递归的方式上传多张
            upload_one_by_one(img_paths, success, fail, count, length, action) {
                var self = this;
                if (self.form_images_list.length <= this.propMaxNum) {
                    uni.uploadFile({
                        url: app.globalData.get_request_url('index', 'ueditor'),
                        filePath: img_paths[count],
                        name: 'upfile',
                        formData: {
                            action: action,
                            path_type: self.propPathType,
                        },
                        success: function (res) {
                            success++;
                            if (res.statusCode == 200) {
                                var data = typeof res.data == 'object' ? res.data : JSON.parse(res.data);
                                if (data.code == 0 && (data.data.url || null) != null) {
                                    var list = self.form_images_list;
                                    list.push({
                                        url: data.data.url,
                                        name: data.data.original,
                                        size: data.data.size,
                                    });
                                    self.setData({
                                        form_images_list: list,
                                    });
                                    self.$emit('call-back', self.form_images_list, self.propCallData);
                                } else {
                                    app.globalData.showToast(data.msg);
                                }
                            }
                        },
                        fail: function (e) {
                            console.log(e);
                            fail++;
                        },
                        complete: function (e) {
                            count++;

                            // 下一张
                            if (count >= length) {
                                // 上传完毕，作一下提示
                                //app.showToast('上传成功' + success +'张', 'success');
                            } else {
                                // 递归调用，上传下一张
                                self.upload_one_by_one(img_paths, success, fail, count, length, action);
                            }
                        },
                    });
                }
            },
            // 上传图片预览
            upload_show_event(e) {
                uni.previewImage({
                    current: this.form_images_list[e.currentTarget.dataset.index].url,
                    urls: this.form_images_list.map(item => item.url),
                });
            },
            // 评论输入图片删除
            comment_input_img_close(e) {
                const { index } = e.currentTarget.dataset;
                var list = this.form_images_list;
                list.splice(index, 1);
                this.setData({
                    form_images_list: list,
                });
            },
            // 视频滚动处理逻辑
            handle_swiper_change(event) {
                const { current } = event.detail;

                const previousIndex = this.current_index;
                if (this.video_contexts[previousIndex]) {
                    this.video_contexts[previousIndex].pause();
                }
                this.setData({
                    current_index: current,
                    paused: false,
                    current_video_progress: 0,
                    current_video_duration: 0,
                    is_seeking: false,
                })
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
                // 更新分享信息
                this.update_share_info(this.display_video_list[current]);

                setTimeout(() => {
                    // 播放当前视频
                    if (this.video_contexts[current]) {
                        this.video_contexts[current].play();
                    }
                }, 100);
            },
            // 切换播放暂停
            toggle_play_pause() {
                if (!this.video_contexts[this.current_index]) return; // 当前播放的视频索引为1

                this.paused = !this.paused;
                if (this.paused) {
                    this.video_contexts[this.current_index].pause(); // 暂停中间的视频
                } else {
                    this.video_contexts[this.current_index].play();  // 播放中间的视频
                }
            },
            // 收藏
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
                    sub_comments: [],
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
                if (this.comment_scroll_top <= 5) {
                    this.comment_start_y = e.touches[0].pageY;
                    this.comment_current_y = this.comment_start_y;
                    this.move_distance = 0;   
                }
            },
            // 评论拖拽中
            handle_comment_touch_move(e) {
                // 只有滚动到顶部时才允许拖拽
                if (this.comment_scroll_top <= 5) {
                    this.comment_current_y = e.touches[0].pageY;
                    this.move_distance = this.comment_current_y - this.comment_start_y;
                }
            },

            // 评论拖拽结束
            handle_comment_touch_end(e) {
                // 只有滚动到顶部时才允许拖拽
                if (this.comment_scroll_top <= 5) {
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
                }
                
                if (!comment_text.trim()) return;
                // 创建新的评论对象
                const newComment = {
                    id: `c${Date.now()}`,
                    userHead: 'http://8.146.211.120:8080/upload/avatar/d5537aa243ef6a74a50bf4ffd4ca6876.jpg',
                    userNick: '我',
                    reply: '',
                    images: this.form_images_list,
                    content: comment_text,
                    time: new Date().toLocaleString()
                };
                const new_comments = JSON.parse(JSON.stringify(this.active_comments));
                if (!isEmpty(this.comment_id)) {
                    new_comments.forEach(item => {
                        if (item.id === this.comment_id) {
                            // 如果回复的是子评论
                            if (!isEmpty(this.sub_comment_id)) {
                                const new_data = item.sub_comments.find(item => item.id === this.sub_comment_id);
                                if (new_data) {
                                    newComment.reply = new_data.userNick;
                                }
                            }
                            item.sub_comments.unshift(newComment);
                        }
                    });
                } else {
                    // 如果是新评论的话，需要有子评论的数组
                    newComment.sub_comments = [];
                    // 添加数据
                    new_comments.unshift(newComment);
                    new_comments.count++;
                }
                // 清空输入框, 更新数据内容
                this.setData({
                    form_images_list: [],
                    comment_input_value: '',
                    active_comments: new_comments,
                    comment_id: '',
                    sub_comment_id: '',
                    input_placeholder: '请输入您的精彩评论',
                });
            },
            // 展开子评论
            open_sub_comment(id) {
                const comment = this.active_comments.find(item => item.id === id);
                if (comment) {
                    comment.show_sub_comment = true;
                    comment.show_sub_comment_loading = true;
                    setTimeout(() => {
                        comment.sub_comments.push({
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
            handle_share() {
                if ((this.$refs.share || null) != null) {
                    this.$refs.share.init({
                        status: true,
                        share_info: this.share_info,
                    });
                }
            },

            handle_time_update(e) {
                if (this.is_seeking) return;
                let duration = this.current_video_duration;
                if (e.detail.duration > 0 && this.current_video_duration === 0) {
                    duration = e.detail.duration;
                }
                this.setData({
                    current_video_duration: duration,
                    current_video_progress: e.detail.currentTime,
                });
            },

            handle_slider_changing() {
                this.is_seeking = true;
            },
            // 主评论回复
            comment_reply(id) {
                const data = this.active_comments.find(item => item.id === id);
                if (!isEmpty(data)) {
                    this.setData({ 
                        input_placeholder: `@${data.userNick}`,
                        comment_id: id,
                        sub_comment_id: '',
                    });
                }
            },
            // 主评论点赞
            comment_like(id) {
                const data = this.active_comments.find(item => item.id === id);
                if (!isEmpty(data)) {
                    this.setData({ 
                        comment_id: id,
                        sub_comment_id: '',
                    });
                }
            },
            // 子评论回复
            sub_comment_reply(id, sub_id) {
                const data = this.active_comments.find(item => item.id === id);
                if (!isEmpty(data)) {
                    const sub_data = data.sub_comments.find(item => item.id === sub_id);
                    this.setData({ 
                        input_placeholder: `@${sub_data.userNick}`,
                        comment_id: id,
                        sub_comment_id: sub_id,
                    });
                }
            },
            // 子评论点赞
            sub_comment_like(id) {
                const data = this.active_comments.find(item => item.id === id);
                if (!isEmpty(data)) {
                    this.setData({ 
                        comment_id: id,
                        sub_comment_id: '',
                    });
                }
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

            format_time(seconds) {
                if (isNaN(seconds) || seconds < 0) {
                    return '00:00';
                }
                const min = Math.floor(seconds / 60);
                const sec = Math.floor(seconds % 60);
                return `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;
            },
            handle_back() {
               app.globalData.page_back_prev_event();
            },
            handle_search() {
                // 跳转到搜索记录页面
                app.globalData.url_open(`/pages/plugins/video/search/search-record`, false);
            },
            // 关闭推荐商品
            product_close_event() {
                console.log('121245');
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
        font-size: 80rpx;
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

    .product-card {
        position: absolute;
        width: 440rpx;
        bottom: 180rpx;
        left: 30rpx;
        color: #fff;
        padding: 16rpx;
        background: #DDDDDD;
        border-radius: 8rpx;
        z-index: 10;
        .product-image {
            width: 100rpx;
            height: 100rpx;
        }
        .product-name {
            font-weight: 500;
            font-size: 28rpx;
            color: #333333;
            line-height: 40rpx;
        }
        .product-price {
            font-weight: 500;
            font-size: 32rpx;
            color: #FF1919;
            line-height: 44rpx;
        }
        .product-close {
            position: absolute;
            right: -10rpx;
            top: -14rpx;
        }
    }

    .author {
        font-size: 36rpx;
        font-weight: bold;
    }
    ::v-deep .uni-video-container {
        background: transparent;
    }
    .video-bg {
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
        width: 100%;
        height: 100%;
        background: #000;
        background-size: cover;
        background-position: center;
        transform: scale(3);
        filter: blur(100rpx);
        opacity: 0.7;
    }

    .video-content {
        display: block;
        font-size: 30rpx;
        margin-top: 16rpx;
        max-width: 70%;
    }

    .progress-bar-container {
        position: absolute;
        bottom: 60rpx;
        left: 20rpx;
        right: 20rpx;
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
        margin-left: 100rpx;
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
        font-size: 28rpx;
        height: 50rpx;
        padding: 16rpx;
        box-sizing: content-box;
    }
    
    .comment-input-content {
        flex: 1;
        border: 2rpx solid #eee;
        border-radius: 8rpx;
        padding-right: 16rpx;
        font-size: 28rpx;
    }
    .comment-input-img-container {
        padding: 10rpx 16rpx 16rpx 16rpx;
    }
    .comment-input-img-close {
        position: absolute;
        right: -10rpx;
        top: -10rpx;
        z-index: 2;
    }
    .comment-input-img {
        width: 50rpx;
        height: 50rpx;
    }

    // 搜索
    .header-top {
        padding-left: 12px;
        box-sizing: border-box;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 9;
        width: 100%;
    }
    .header-top {
        ::v-deep .search-bar {
            background:#D8D8D8;
            opacity: 0.27;
            border-color: transparent;
        }
    }
</style>

