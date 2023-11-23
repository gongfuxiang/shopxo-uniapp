<template>
	<view>
		<view :style="'background:'+(propBackgroundColor || '#fff')+';'+nav_style" :class="'trn-nav-top '+(propEnt || '')">
            <view v-if="(propTitle || null) != null" class="trn-nav-top-title single-text">{{propTitle}}</view>
			<slot></slot>
		</view>
	</view>
</template>
<script>
    const app = getApp();
	export default {
		data() {
			return {
                theme_view: app.globalData.get_theme_value_view(),
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
                this.nav_style = 'opacity:'+opacity+';';
                // #ifdef MP
                this.nav_style += 'height:'+(this.propHeight+this.statusbar_height)+'px;';
                // #endif
                // #ifdef H5 || APP
                this.nav_style += 'height:44px;';
                // #endif
			}
		},
		methods: {
		},
		mounted() {
            // 获取系统状态栏高度
			this.statusbar_height = parseInt(app.globalData.get_system_info('statusBarHeight', 0, true));
		}
	}
</script>
<style>
	.trn-nav-top {
		padding-top: var(--status-bar-height);
        opacity: 0;
		width: 100%;
		z-index: 10;
		position: fixed;
        top: 0;
        left: 0;
	}
    .trn-nav-top .trn-nav-top-title {
        font-size: 36rpx;
        text-align: left;
        padding: 12px 250rpx 0 20rpx;
        height: 37px;
        color: #000;
    }
</style>
