<template>
	<view>
		<swiper :indicator-dots="propData.length > 0" :indicator-color="indicator_color"
			:indicator-active-color="indicator_active_color" :autoplay="propData.length > 0" :circular="circular"
			:class="'banner border-radius-main oh bg-white spacing-mb banner-'+(propSize || 'default')"
			v-if="propData.length > 0">
			<block v-for="(item, index) in propData" :key="index">
				<swiper-item>
					<image :src="item.images_url" mode="widthFix" :data-value="item.event_value || item.url"
						:data-type="item.event_type == undefined ? 1 : item.event_type" @tap="banner_event"></image>
				</swiper-item>
			</block>
		</swiper>
	</view>
</template>
<script>
	const app = getApp();
	export default {
		data() {
			return {
				indicator_dots: false,
				indicator_color: 'rgba(0, 0, 0, .2)',
				indicator_active_color: '#666',
				autoplay: true,
				circular: true
			};
		},

		components: {},
		props: {
			propData: {
				type: Array,
				default: []
			},
			propSize: {
				type: String,
				default: 'default'
			}
		},
		methods: {
			banner_event(e) {
				app.globalData.operation_event(e);
			}

		}
	};
</script>
<style>
	.banner {
		transform: translateY(0);
	}

	.banner image {
		min-width: 100%;
	}

	.banner-mini,
	.banner-mini image {
		height: 200rpx !important;
	}

	.banner-default,
	.banner-default image {
		height: 280rpx !important;
	}

	.banner-max,
	.banner-max image {
		height: 420rpx !important;
	}
</style>