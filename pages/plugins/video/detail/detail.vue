<template>
	<view class="content">
		<swiper class="swiper-container" :style="swiperStyle" :vertical="true" @change="handleSwiperChange" :current="current_index">
			<swiper-item v-for="(video, index) in videoData" :key="video.id">
				<view class="video-container" @tap="toggle_play_pause">
					
					<video class="video" :src="video.videoUrl" :poster="video.posterUrl" :id="`video_${index}`" :loop="true" :controls="false" :show-center-play-btn="false" :show-play-btn="false" object-fit="contain" @timeupdate="handle_time_update"></video>
					
					<text v-if="paused && current_index === index" class="play-icon">▶</text>

					<!-- Right Action Bar -->
					<view class="right-actions">
						<view class="action-item" @tap.stop="handle_like(video)">
							<iconfont name="icon-givealike" :color="video.isLike ? '#fff' : ''" size="60rpx" />
							<text class="action-text">{{ video.fabulous_count }}</text>
						</view>
						<view class="action-item" @tap.stop="handle_comment(video)">
                            <iconfont name="icon-comment" color="#fff" size="60rpx" />
							<text class="action-text">{{ video.comment_obj.count }}</text>
						</view>
						<view class="action-item" @tap.stop="handle_share(video)">
							<iconfont name="icon-share-solid" color="#fff" size="60rpx" />
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
						<slider class="progress-slider" :value="current_video_progress" :max="current_video_duration" @change="handle_slider_change" @changing="handle_slider_changing" block-size="14" activeColor="#FFFFFF" backgroundColor="rgba(255, 255, 255, 0.4)" />
						<text class="time-display">{{ formatTime(current_video_progress) }} / {{ formatTime(current_video_duration) }}</text>
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
							<view class="comment-operation flex-row align-c jc-sb">
								<view class="comment-operation-left flex-row align-c gap-10">
									<view class="comment-time">{{ comment.time }}</view>
									<view class="comment-like" :data-comment-id="comment.id" @click="comment_reply">回复</view>
								</view>
								<view class="comment-operation-right flex-row align-c gap-5">
									<iconfont name="icon-givealike-o-fine" color="#000" size="28rpx" />
									<view class="comment-like-num">{{ comment.likeNum || 0 }}</view>
								</view>
							</view>
							<!-- 子评论 -->
							<view class="sub-comment flex-col jc-c">
								<view class="sub-comment-title" @tap="toggle_sub_comment">—— 展开{{ comment.subComments ? comment.subComments.length || 0 : 0 }}条回复 <iconfont name="icon-arrow-down" color="#000" size="28rpx" /></view>
								<view v-if="comment.subComments && comment.subComments.length > 0" class="sub-comment-list">
									<view class="sub-comment-item" v-for="(sub_comment, sub_comment_index) in comment.subComments" :key="sub_comment_index">
										<view class="comment-user">{{ comment.userNick }}</view>
										<view class="comment-text">{{ comment.content }}</view>
										<view class="comment-operation flex-row align-c jc-sb">
											<view class="comment-operation-left flex-row align-c gap-10">
												<view class="comment-time">{{ comment.time }}</view>
												<view class="comment-like" :data-comment-id="comment.id" @click="comment_reply">回复</view>
											</view>
											<view class="comment-operation-right flex-row align-c gap-5">
												<iconfont name="icon-givealike-o-fine" color="#000" size="28rpx" />
												<view class="comment-like-num">{{ comment.likeNum || 0 }}</view>
											</view>
										</view>
									</view>
								</view>
								<view class="sub-comment-more flex-row align-c">
									<view class="sub-comment-more-btn" @tap="toggle_sub_comment">展开<iconfont name="icon-arrow-down" color="#000" size="28rpx" /></view>
									<view class="sub-comment-more-btn" @tap="toggle_sub_comment">收起<iconfont name="icon-arrow-down" color="#000" size="28rpx" /></view>
								</view>
							</view>
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
			return {
				videoData: [{
					id: '1',
					is_fabulous: 1,
					userNick: '',
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
							time: '2024-07-07 10:00:00',
							likeNum: 1,
						}, {
							id: 'c2',
							userHead: 'http://8.146.211.120:8080/upload/notes/590118acb7cda2039657d464fdc285d6.jpg',
							userNick: '评论员B',
							content: '沙发！',
							time: '2024-07-07 09:30:00',
							likeNum: 0,
						}]
					}
				}, {
					id: '2',
					is_fabulous: 0,
					userNick: '',
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
					userNick: '',
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
				return this.show_comment_modal ? `transform: translateY(3px); height: calc(70% - ${this.move_distance}px);` : `transform: translateY(0); height: 70%;`
			},
		},
		onReady() {
			this.videoData.forEach((item, index) => {
				this.video_contexts[index] = uni.createVideoContext(`video_${index}`, this);
			});
			setTimeout(() => {
				if (this.video_contexts[0]) {
					this.video_contexts[0].play();
				}
			}, 200);
		},
		methods: {
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
	.content,
	.swiper-container,
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
		padding: 30rpx;
		box-sizing: border-box;
	}
	
	.comment-item {
		display: flex;
		margin-bottom: 30rpx;
	}
	
	.comment-avatar {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		margin-right: 20rpx;
	}
	
	.comment-info {
		flex: 1;
	}
	
	.comment-user {
		font-size: 24rpx;
		color: #999999;
		line-height: 34rpx;
	}
	
	.comment-text {
		font-size: 28rpx;
		color: #333333;
		line-height: 40rpx;
	}
	
	.comment-time {
		font-size: 28rpx;
		color: #999999;
		line-height: 34rpx;
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
