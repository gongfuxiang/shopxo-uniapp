<template>
	<view class="content">
		<swiper class="swiper-container" :vertical="true" @change="handleSwiperChange" :current="currentIndex">
			<swiper-item v-for="(video, index) in videoData" :key="video.id">
				<view class="video-container" @click="togglePlayPause">
					<video class="video" :src="video.videoUrl" :poster="video.posterUrl" :id="`video_${index}`" :loop="true"
						:controls="false" :show-center-play-btn="false" :show-play-btn="false"
						object-fit="contain" @timeupdate="handleTimeUpdate"></video>

					<text v-if="paused && currentIndex === index" class="play-icon">▶</text>

					<!-- Right Action Bar -->
					<view class="right-actions">
						<view class="action-item">
							<image class="user-avatar" :src="video.userHead"></image>
						</view>
						<view class="action-item" @click.stop="handleLike(video)">
							<image class="icon" :src="video.isFabulous ? filledHeartIcon : outlineHeartIcon"></image>
							<text class="action-text">{{ video.fabulousCount }}</text>
						</view>
						<view class="action-item" @click.stop="handleComment(video)">
							<image class="icon" :src="commentIcon"></image>
                            
							<text class="action-text">{{ video.commentObj.count }}</text>
						</view>
						<view class="action-item" @click.stop="handleShare(video)">
							<image class="icon" :src="shareIcon"></image>
							<text class="action-text">分享</text>
						</view>
					</view>

					<!-- Bottom Info -->
					<view class="bottom-info">
						<text class="author">@{{ video.userNick }}</text>
						<text class="video-content">{{ video.videoContent }}</text>
					</view>

					<!-- Progress Bar -->
					<view class="progress-bar-container" v-if="currentIndex === index">
						<slider class="progress-slider" :value="currentVideoProgress" :max="currentVideoDuration"
							@change="handleSliderChange" @changing="handleSliderChanging" block-size="14"
							activeColor="#FFFFFF" backgroundColor="rgba(255, 255, 255, 0.4)" />
						<text
							class="time-display">{{ formatTime(currentVideoProgress) }} / {{ formatTime(currentVideoDuration) }}</text>
					</view>
				</view>
			</swiper-item>
		</swiper>
		<!-- <comment-modal :visible="showCommentModal" :comments="activeComments" @close="showCommentModal = false"
			@send="handleSendComment" /> -->
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
					isFabulous: 1,
					userNick: 'WX: MAMBA_4EVER24',
					videoContent: '新视频来啦！',
					fabulousCount: 1,
					videoUrl: 'http://8.146.211.120:8080/upload/douyin/e6fddef474951cc15f5aeb99219b4a91.mp4',
					posterUrl: 'http://8.146.211.120:8080/upload/notes/ce5082f76cc9bd82a2bd97ce8b45ea32.jpg',
					userHead: 'http://8.146.211.120:8080/upload/notes/8f5ebdab07f9fb592895bd3f0f230ea9.jpg',
					commentObj: {
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
					isFabulous: 0,
					userNick: 'WX: MAMBA_4EVER24',
					videoContent: '第二条视频',
					fabulousCount: 1,
					videoUrl: 'http://8.146.211.120:8080/upload/douyin/0985b0f3879c7dca9f6c1c6fb59d4a79.mp4',
					posterUrl: 'http://8.146.211.120:8080/upload/background/dab42015a50709f68a75306a572aaaca.jpg',
					userHead: 'http://8.146.211.120:8080/upload/background/735feb718119ea7e5f206be7b4410dd6.jpg',
					commentObj: {
						count: 0,
						list: []
					}
				}, {
					id: '3',
					isFabulous: 1,
					userNick: 'WX: MAMBA_4EVER24',
					videoContent: '第三条视频内容',
					fabulousCount: 1,
					videoUrl: 'http://8.146.211.120:8080/upload/douyin/a4832a9a37b44196b49c646db148ec65.mp4',
					posterUrl: 'http://8.146.211.120:8080/upload/background/8049cff58c46adf4164907fb3abe63a8.jpg',
					userHead: 'http://8.146.211.120:8080/upload/notes/b11b2d741a5132b0d733a9861c9f6c7c.jpg',
					commentObj: {
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
				currentIndex: 0,
				videoContexts: [],
				paused: false,
				currentVideoProgress: 0,
				currentVideoDuration: 0,
				isSeeking: false,
				showCommentModal: false,
				activeComments: {},
				filledHeartIcon: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(filledHeartSvg),
				outlineHeartIcon: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(outlineHeartSvg),
				commentIcon: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(commentSvg),
				shareIcon: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(shareSvg)
			};
		},
		onReady() {
			this.videoData.forEach((item, index) => {
				this.videoContexts[index] = uni.createVideoContext(`video_${index}`, this);
			});
			// Start playing the first video
			setTimeout(() => {
				if (this.videoContexts[0]) {
					this.videoContexts[0].play();
				}
			}, 200);
		},
		methods: {
			handleSwiperChange(event) {
				const {
					current
				} = event.detail;

				const previousIndex = this.currentIndex;
				if (this.videoContexts[previousIndex]) {
					this.videoContexts[previousIndex].pause();
				}

				this.currentIndex = current;
				this.paused = false;
				this.currentVideoProgress = 0;
				this.currentVideoDuration = 0;
				this.isSeeking = false;

				setTimeout(() => {
					if (this.videoContexts[this.currentIndex]) {
						this.videoContexts[this.currentIndex].play();
					}
					
				}, 250);
			},

			togglePlayPause() {
				if (!this.videoContexts[this.currentIndex]) return;

				this.paused = !this.paused;
				if (this.paused) {
					this.videoContexts[this.currentIndex].pause();
				} else {
					this.videoContexts[this.currentIndex].play();
				}
			},

			handleLike(video) {
				video.isFabulous = !video.isFabulous;
				if (video.isFabulous) {
					video.fabulousCount++;
				} else {
					video.fabulousCount--;
				}
			},

			handleComment(video) {
				this.activeComments = video.commentObj;
				this.showCommentModal = true;
			},

			handleSendComment(commentText) {
				const newComment = {
					id: `c${Date.now()}`,
					userHead: 'http://8.146.211.120:8080/upload/avatar/d5537aa243ef6a74a50bf4ffd4ca6876.jpg', // Placeholder avatar
					userNick: '我',
					content: commentText,
					time: new Date().toLocaleString()
				};
				this.activeComments.list.unshift(newComment);
				this.activeComments.count++;
			},

			handleShare(video) {
				uni.showToast({
					title: '分享',
					icon: 'none'
				});
			},

			handleTimeUpdate(e) {
				if (this.isSeeking) return;
				if (e.detail.duration > 0 && this.currentVideoDuration === 0) {
					this.currentVideoDuration = e.detail.duration;
				}
				this.currentVideoProgress = e.detail.currentTime;
			},

			handleSliderChanging() {
				this.isSeeking = true;
			},

			handleSliderChange(e) {
				const seekTime = e.detail.value;
				if (this.videoContexts[this.currentIndex]) {
					this.videoContexts[this.currentIndex].seek(seekTime);
					this.currentVideoProgress = seekTime;
				}
				// It's important to set isSeeking to false after a short delay
				// to prevent the timeupdate event from immediately overriding the slider value.
				setTimeout(() => {
					this.isSeeking = false;
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
		max-width: 80%;
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
</style>
