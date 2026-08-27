<template>
	<view v-if="visible" :class="theme_view">
		<view v-if="propIsGoods" class="goods-chat-container fl cp" @tap="entry_event">
			<image class="icon" :src="chat_icon" mode="scaleToFill"></image>
			<text class="text dis-block text-size-xs cr-grey">{{ propTitle || $t('common.service_short') }}</text>
		</view>
		<view v-else-if="is_online_service_fixed == 1" :class="propIsDiy ? '' : 'online-service-movable-container'" :style="'height: calc(100% - '+height_dec+'rpx);top:'+top+'rpx;'">
			<view :class="'online-service-event-submit '+(propIsSpread ? ' spread' : '')" @tap="entry_event">
				<block v-if="propIsSpread">
					<view class="ring"></view>
					<view class="ring"></view>
				</block>
				<button class="chat-btn" type="default" :class="common_ent">
					<image class="icon dis-block" :src="chat_image"></image>
				</button>
			</view>
		</view>
	</view>
</template>

<script>
	const app = getApp();

	export default {
		props: {
			propIsGoods: {
				type: Boolean,
				default: false,
			},
			propIsBar: {
				type: Boolean,
				default: false,
			},
			propIsNav: {
				type: Boolean,
				default: false,
			},
			propTitle: {
				type: String,
				default: '',
			},
			propChatUrl: {
				type: String,
				default: '',
			},
			propChatIcon: {
				type: String,
				default: '',
			},
			propChatImage: {
				type: String,
				default: '',
			},
			propIsSpread: {
				type: Boolean,
				default: true,
			},
			propIsDiy: {
				type: Boolean,
				default: false,
			},
			propToList: {
				type: Boolean,
				default: false,
			},
		},
		data() {
			return {
				theme_view: app.globalData.get_theme_value_view(),
				visible: false,
				chat_url: null,
				chat_icon: '',
				chat_image: '',
				is_online_service_fixed: app.globalData.data.is_online_service_fixed,
				top: 0,
				height_dec: 0,
				common_ent: '',
			};
		},
		created() {
			this.init_config();
		},
		methods: {
			init_config() {
				const is_chat = parseInt(app.globalData.get_config('plugins_base.chat.data.is_mobile_chat', 0) || 0, 10);
				const chat_url = this.propChatUrl || app.globalData.get_config('plugins_base.chat.data.chat_url');
				if (is_chat != 1 || isEmpty(chat_url)) {
					this.visible = false;
					return;
				}
				this.visible = true;
				this.chat_url = chat_url;
				this.chat_icon = this.propChatIcon || app.globalData.get_static_url('common') + 'customer-service-icon.png';
				this.chat_image = this.propChatImage || app.globalData.get_static_url('common') + 'online-service-icon.png';
				const system = app.globalData.get_system_info(null, null, true);
				const height = app.globalData.window_height_handle(system);
				let top = 0;
				let height_dec = 0;
				if (this.propIsBar) {
					height_dec += app.globalData.app_system_tabbar_height_value();
				}
				if (this.propIsNav) {
					top += app.globalData.app_system_nav_height_value();
				}
				this.top = top;
				this.height_dec = height_dec;
			},
			entry_event() {
				const handler = app.globalData.chat_native_entry_handle;
				if (!handler) {
					uni.navigateTo({ url: '/pages/plugins/chat/list/list' });
					return;
				}
				if (this.propToList) {
					handler({
						chat_url: this.chat_url || '',
						to_list: 1,
					});
					return;
				}
				handler(this.chat_url || {});
			},
		},
	};

	function isEmpty(value) {
		return value === null || value === undefined || String(value).trim() === '';
	}
</script>

<style scoped>
.online-service-movable-container {
	position: fixed;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	background: transparent;
	pointer-events: none;
	z-index: 2;
}
.online-service-event-submit {
	pointer-events: auto;
}
.online-service-event-submit,
.online-service-event-submit .chat-btn {
	width: 50px;
	height: 50px;
	border-radius: 50%;
}
.online-service-event-submit .chat-btn {
	border: 0;
	padding: 0;
}
.online-service-event-submit .icon {
	width: 50px !important;
	height: 50px !important;
	position: relative;
}
.goods-chat-container .icon {
	width: 40rpx;
	height: 40rpx;
	margin: 10rpx 0 5rpx 0;
}
.goods-chat-container .text {
	margin-top: -10rpx;
}
.spread {
	background-color: rgba(238, 73, 70, 0.4);
	border-radius: 100%;
	width: 50px;
	height: 50px;
	position: relative;
	z-index: 1;
}
.spread .ring {
	animation: pulsing 1.5s ease-out infinite;
	z-index: -1;
}
.spread .ring:nth-of-type(1) {
	animation-delay: -1.5s;
}
.spread .ring:nth-of-type(2) {
	animation-delay: -2s;
}
@keyframes pulsing {
	100% {
		transform: scale(1.35);
		opacity: 0;
	}
}
</style>
