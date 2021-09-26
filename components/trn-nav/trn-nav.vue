<template>
	<view>
		<view :style="'background:'+(propBackgroundColor || '#fff')+';'+nav_style" :class="'nav '+propEnt">
			<slot></slot>
		</view>
	</view>
</template>
<script>
    const app = getApp();
	export default {
		data() {
			return {
				statusbar_height: 0,
                nav_style: ''
			}
		},
		props: {
			propTitle: String,
			propBackgroundColor: String,
            propEnt: String,
			propScroll: Number,
			propHeight: Number,
		},
		watch: {
            // 属性值改变监听
			propScroll(value, old_value) {
                // opacity 0 就是完全透明  1是不透明
                var opacity = 0;
				if(value >= 70 && value <= 100) {
					opacity = 0.2;
				}
				// 越往下滑动 透明度越低
				if(value >= 101 && value <= 120) {
					opacity = 0.3;
				}
				if(value >= 120 && value <= 150) {
					opacity = 0.5;
				}
				if(value >= 150 && value <= 170) {
					opacity = 0.7;
				}
				if(value >= 170 && value <= 190) {
					opacity = 1;
				}
				if(value > 190) {
					opacity = 1;
				}
				// 距离小于多少就不显示了
				if(value <= 70) {
					opacity = 0;
				}

                // 设置样式
                this.nav_style = 'opacity:'+opacity+';height:'+(this.propHeight+this.statusbar_height)+'rpx;';
			}
		},
		methods: {
		},
		mounted() {
            // 获取系统状态栏高度
			this.statusbar_height = app.globalData.px_to_rpx(app.globalData.get_system_info('statusBarHeight'));
		}
	}
</script>
<style>
	.nav {
		padding-top: var(--status-bar-height);
        opacity: 0;
		width: 100%;
		z-index: 10;
		position: fixed;
	}
</style>
