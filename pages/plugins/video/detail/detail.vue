<template>
	<view class="content">
		<swiper class="swiper-container" :style="swiperStyle" :vertical="true" @change="handleSwiperChange" :current="current_index">
			<swiper-item v-for="(video, index) in videoData" :key="video.id">
				<view class="video-container" @tap="toggle_play_pause">
					
					<video class="video" :src="video.videoUrl" :poster="video.posterUrl" :id="`video_${index}`" :loop="true" :controls="false" :show-center-play-btn="false" :show-play-btn="false" object-fit="contain" @timeupdate="handleTimeUpdate"></video>
					
					<text v-if="paused && current_index === index" class="play-icon">▶</text>

					<!-- Right Action Bar -->
					<view class="right-actions">
						<view class="action-item" @tap.stop="handle_like(video)">
							<iconfont name="icon-givealike" :color="video.isLike ? '#fff' : ''" size="60rpx"></iconfont>
							<text class="action-text">{{ video.fabulous_count }}</text>
						</view>
						<view class="action-item" @tap.stop="handle_comment(video)">
                            <iconfont name="icon-comment" color="#fff" size="60rpx"></iconfont>
							<text class="action-text">{{ video.comment_obj.count }}</text>
						</view>
						<view class="action-item" @tap.stop="handleShare(video)">
							<iconfont name="icon-share-solid" color="#fff" size="60rpx"></iconfont>
							<text class="action-text">分享</text>
						</view>
					</view>

					<!-- Bottom Info -->
					<view class="bottom-info">
						<text class="author">@{{ video.userNick }}</text>
						<text class="video-content">{{ video.videoContent }}</text>
					</view>

					<!-- Progress Bar -->
					<view class="progress-bar-container" v-if="current_index === index">
						<slider class="progress-slider" :value="current_video_progress" :max="current_video_duration"
							@change="handleSliderChange" @changing="handleSliderChanging" block-size="14"
							activeColor="#FFFFFF" backgroundColor="rgba(255, 255, 255, 0.4)" />
						<text
							class="time-display">{{ formatTime(current_video_progress) }} / {{ formatTime(current_video_duration) }}</text>
					</view>
				</view>
			</swiper-item>
		</swiper>
		
		<!-- 评论弹窗 -->
		<view v-if="show_comment_modal" class="comment-modal" @tap="close_comment_modal">
			<view class="comment-content" :style="commentContentStyle" @tap.stop @touchstart="handle_comment_touch_start" @touchmove="handle_comment_touch_move" @touchend="handle_comment_touch_end">
				<view class="comment-header">
					<text class="comment-count">{{ active_comments.count }}条评论</text>
					<view class="close-btn" @tap="close_comment_modal">✕</view>
				</view>
				<scroll-view class="comment-list" scroll-y>
					<view v-for="(comment, index) in active_comments.list" :key="index" class="comment-item">
						<image class="comment-avatar" :src="comment.userHead"></image>
						<view class="comment-info">
							<view class="comment-user">{{ comment.userNick }}</view>
							<view class="comment-text">{{ comment.content }}</view>
							<view class="comment-time">{{ comment.time }}</view>
						</view>
					</view>
				</scroll-view>
				<view class="comment-input-container">
					<input class="comment-input" type="text" placeholder="说点什么..." @confirm="send_comment" />
					<button class="send-btn" @tap="send_comment">发送</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// import CommentModal from '@/components/CommentModal.vue';

	export default {
		components: {
			// CommentModal
		},
		data() {
			const filledHeartSvg =
				`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fe2c55"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>`;
			const outlineHeartSvg =
				`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>`;
			const commentSvg =
				`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z"></path></svg>`;
			const shareSvg =
				`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>`;

			return {
				videoData: [{
					id: '1',
					is_fabulous: 1,
					userNick: 'WX: MAMBA_4EVER24',
					videoContent: '新视频来啦！',
					fabulous_count: 1,
					videoUrl: 'http://8.146.211.120:8080/upload/douyin/e6fddef474951cc15f5aeb99219b4a91.mp4',
					posterUrl: 'http://8.146.211.120:8080/upload/notes/ce5082f76cc9bd82a2bd97ce8b45ea32.jpg',
					userHead: 'http://8.146.211.120:8080/upload/notes/8f5ebdab07f9fb592895bd3f0f230ea9.jpg',
					comment_obj: {
						count: 2,
						list: [{
							id: 'c1',
							userHead: 'http://8.146.211.120:8080/upload/notes/b11b2d741a5132b0d733a9861c9f6c7c.jpg',
							userNick: '评论员A',
							content: '这视频太酷了！',
							time: '2024-07-07 10:00:00'
						}, {
							id: 'c2',
							userHead: 'http://8.146.211.120:8080/upload/notes/590118acb7cda2039657d464fdc285d6.jpg',
							userNick: '评论员B',
							content: '沙发！',
							time: '2024-07-07 09:30:00'
						}]
					}
				}, {
					id: '2',
					is_fabulous: 0,
					userNick: 'WX: MAMBA_4EVER24',
					videoContent: '第二条视频',
					fabulous_count: 1,
					videoUrl: 'http://8.146.211.120:8080/upload/douyin/0985b0f3879c7dca9f6c1c6fb59d4a79.mp4',
					posterUrl: 'http://8.146.211.120:8080/upload/background/dab42015a50709f68a75306a572aaaca.jpg',
					userHead: 'http://8.146.211.120:8080/upload/background/735feb718119ea7e5f206be7b4410dd6.jpg',
					comment_obj: {
						count: 0,
						list: []
					}
				}, {
					id: '3',
					is_fabulous: 1,
					userNick: 'WX: MAMBA_4EVER24',
					videoContent: '第三条视频内容',
					fabulous_count: 1,
					videoUrl: 'http://8.146.211.120:8080/upload/douyin/a4832a9a37b44196b49c646db148ec65.mp4',
					posterUrl: 'http://8.146.211.120:8080/upload/background/8049cff58c46adf4164907fb3abe63a8.jpg',
					userHead: 'http://8.146.211.120:8080/upload/notes/b11b2d741a5132b0d733a9861c9f6c7c.jpg',
					comment_obj: {
						count: 1,
						list: [{
							id: 'c3',
							userHead: 'http://8.146.211.120:8080/upload/notes/701eb0ea365754a9d61778a787b27a49.jpg',
							userNick: '评论员C',
							content: '有趣！',
							time: '2024-07-07 11:00:00'
						}]
					}
				}],
				current_index: 0,
				video_contexts: [],
				paused: false,
				current_video_progress: 0,
				current_video_duration: 0,
				is_seeking: false,
				show_comment_modal: false,
				active_comments: {},
				filledHeartIcon: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(filledHeartSvg),
				outlineHeartIcon: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(outlineHeartSvg),
				commentIcon: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(commentSvg),
				shareIcon: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(shareSvg),
				comment_start_y: 0, // 评论开始拖拽位置
				comment_current_y: 0, // 评论当前拖拽位置
				move_distance: 0,
			};
		},
		computed: {
			swiperStyle() {
				return this.show_comment_modal ? `height: calc(30% + ${this.move_distance}px);` : 'height: 100%;';
			},
			commentContentStyle() {
				return this.show_comment_modal ? `transform: translateY(10px); height: calc(70% - ${this.move_distance}px);` : `transform: translateY(0); height: 70%;`
			},
		},
		onReady() {
			this.videoData.forEach((item, index) => {
				this.video_contexts[index] = uni.createVideoContext(`video_${index}`, this);
			});
			// Start playing the first video
			setTimeout(() => {
				if (this.video_contexts[0]) {
					this.video_contexts[0].play();
				}
			}, 200);
		},
		methods: {
			handleSwiperChange(event) {
				const {
					current
				} = event.detail;

				const previousIndex = this.current_index;
				if (this.video_contexts[previousIndex]) {
					this.video_contexts[previousIndex].pause();
				}

				this.current_index = current;
				this.paused = false;
				this.current_video_progress = 0;
				this.current_video_duration = 0;
				this.is_seeking = false;

				setTimeout(() => {
					if (this.video_contexts[this.current_index]) {
						this.video_contexts[this.current_index].play();
					}
				}, 250);
			},

			toggle_play_pause() {
				if (!this.video_contexts[this.current_index]) return;

				this.paused = !this.paused;
				if (this.paused) {
					this.video_contexts[this.current_index].pause();
				} else {
					this.video_contexts[this.current_index].play();
				}
			},

			handle_like(video) {
				video.is_fabulous = !video.is_fabulous;
				if (video.is_fabulous) {
					video.fabulous_count++;
				} else {
					video.fabulous_count--;
				}
			},
			// 打开评论区
			handle_comment(video) {
				this.active_comments = video.comment_obj;
				this.show_comment_modal = true;
				this.move_distance = 0;
			},
			// 关闭评论区
			close_comment_modal() {
				this.show_comment_modal = false;
				this.move_distance = 0;
			},

			// 评论拖拽开始
			handle_comment_touch_start(e) {
				this.comment_start_y = e.touches[0].pageY;
				this.comment_current_y = this.comment_start_y;
				this.move_distance = 0;
			},

			// 评论拖拽中
			handle_comment_touch_move(e) {
				this.comment_current_y = e.touches[0].pageY;
				this.move_distance = this.comment_current_y - this.comment_start_y;
			},

			// 评论拖拽结束
			handle_comment_touch_end(e) {
				const move_distance = this.comment_current_y - this.comment_start_y;
				
				// 如果拖拽距离足够大，关闭评论弹窗
				if (move_distance > 150) {
					this.close_comment_modal();
				} else {
					this.move_distance = 0;
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
					userHead: 'http://8.146.211.120:8080/upload/avatar/d5537aa243ef6a74a50bf4ffd4ca6876.jpg', // Placeholder avatar
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

			handleShare(video) {
				uni.showToast({
					title: '分享',
					icon: 'none'
				});
			},

			handleTimeUpdate(e) {
				if (this.is_seeking) return;
				if (e.detail.duration > 0 && this.current_video_duration === 0) {
					this.current_video_duration = e.detail.duration;
				}
				this.current_video_progress = e.detail.currentTime;
			},

			handleSliderChanging() {
				this.is_seeking = true;
			},

			handleSliderChange(e) {
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
	.content,
	.swiper-container,
	swiper-item,
	.video-container {
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
	}

	.play-icon {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		pointer-events: none;
		font-size: 80px;
		color: rgba(255, 255, 255, 0.6);
	}

	.right-actions {
		position: absolute;
		right: 10px;
		bottom: 100px;
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
		margin-top: 20px;
	}

	.user-avatar {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		border: 2px solid #fff;
	}

	.icon {
		width: 35px;
		height: 35px;
	}

	.action-text {
		font-size: 14px;
		margin-top: 5px;
	}

	.bottom-info {
		position: absolute;
		bottom: 90px;
		left: 15px;
		color: #fff;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
		z-index: 10;
	}

	.author {
		font-size: 18px;
		font-weight: bold;
	}

	.video-content {
		display: block;
		font-size: 15px;
		margin-top: 8px;
		max-width: 70%;
	}

	.progress-bar-container {
		position: absolute;
		bottom: 60px;
		left: 15px;
		right: 15px;
		display: flex;
		align-items: center;
		z-index: 11;
	}

	.progress-slider {
		flex: 1;
		margin: 0 10px;
	}

	.time-display {
		color: #fff;
		font-size: 12px;
		text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.6);
		width: 90px;
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
		border-top-left-radius: 15px;
		border-top-right-radius: 15px;
		display: flex;
		flex-direction: column;
		transition: transform 0.3s ease;
	}
	
	.comment-header {
		padding: 15px;
		border-bottom: 1px solid #eee;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.comment-count {
		font-weight: bold;
		font-size: 16px;
	}
	
	.close-btn {
		font-size: 20px;
		color: #999;
	}
	
	.comment-list {
		flex: 1;
		padding: 15px;
	}
	
	.comment-item {
		display: flex;
		margin-bottom: 15px;
	}
	
	.comment-avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		margin-right: 10px;
	}
	
	.comment-info {
		flex: 1;
	}
	
	.comment-user {
		font-weight: bold;
		font-size: 14px;
		margin-bottom: 5px;
	}
	
	.comment-text {
		font-size: 14px;
		margin-bottom: 5px;
	}
	
	.comment-time {
		font-size: 12px;
		color: #999;
	}
	
	.comment-input-container {
		display: flex;
		padding: 10px;
		border-top: 1px solid #eee;
	}
	
	.comment-input {
		flex: 1;
		border: 1px solid #eee;
		border-radius: 4px;
		padding: 8px;
		font-size: 14px;
	}
	
	.send-btn {
		margin-left: 10px;
		padding: 8px 15px;
		background-color: #ff4757;
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 14px;
	}
</style>
