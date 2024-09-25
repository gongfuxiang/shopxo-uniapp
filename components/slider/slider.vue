<template>
    <view :class="theme_view">
        <view v-if="propData.length > 0" class="spacing-mb" :class="(propLeft ? 'swiper-left ' : '') + (propRight ? 'swiper-right ' : '')">
            <uni-swiper-dot class="uni-swiper-dot-box" :mode="propMode" :dots-styles="dotsStyles" @clickItem="click_item" :info="propData" :current="current">
                <swiper class="banner oh" :class="' banner-' + (propSize || 'default') + ' ' + propRadius" :autoplay="propData.length > 0" :duration="duration" :circular="circular" @change="swiper_change" :current="swiperDotIndex">
                    <swiper-item v-for="(item, i) in propData" :key="i">
                        <image class="image" :src="item.images_url" mode="widthFix" :data-value="item.event_value || item.url" :data-type="item.event_type == undefined ? 1 : item.event_type" @tap="banner_event"> </image>
                    </swiper-item>
                </swiper>
            </uni-swiper-dot>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                circular: true,
                duration: 500,
                styleIndex: -1,
                current: 0,
                swiperDotIndex: 0,
                dotsStyles: {},
            };
        },

        components: {},
        props: {
            propData: {
                type: Array,
                default: [],
            },
            propSize: {
                type: String,
                default: 'default',
            },
            propRadius: {
                type: String,
                default: 'border-radius-main',
            },
            // 指示点 class 调整靠左
            propLeft: {
                type: Boolean,
                default: false,
            },
            // 指示点 class 调整靠右
            propRight: {
                type: Boolean,
                default: false,
            },
            // 轮播指示点分类 default/dot/round/nav/indexes
            propMode: {
                type: String,
                default: 'dot',
            },
            // 未选择指示点背景色
            propBackgroundColor: {
                type: String,
                default: '#fff',
            },
            // 指示点宽度 在 mode = nav、mode = indexes 时不生效
            propWidth: {
                type: Number,
                default: 6,
            },
            // 指示点距 swiper 底部的高度
            propBottom: {
                type: Number,
                default: 10,
            },
            // 未选择指示点边框样式
            propBorder: {
                type: String,
                default: '0',
            },
            // 指示点前景色，只在 mode = nav ，mode = indexes 时生效
            propColor: {
                type: String,
                default: '#fff',
            },
            // 已选择指示点背景色，在 mode = nav 时不生效
            propSelectedBackgroundColor: {
                type: String,
                default: '' + app.globalData.hex_rgba(app.globalData.get_theme_color(), 0.5),
            },
            // 已选择指示点边框样式，在 mode = nav 时不生效
            propSelectedBorder: {
                type: String,
                default: '0',
            },
        },
        beforeMount() {
            this.dotsStyles = {
                backgroundColor: this.propBackgroundColor,
                width: this.propWidth,
                bottom: this.propBottom,
                border: this.propBorder,
                color: this.propColor,
                selectedBackgroundColor: this.propSelectedBackgroundColor,
                selectedBorder: this.propSelectedBorder,
            };
        },
        methods: {
            swiper_change(e) {
                // 原始index
                this.current = e.detail.current;
                // 当前滑index
                // this.currentIndex = tmpCurrent == this.propData.length - 1 ? 0 : tmpCurrent + 1;
                this.$emit('changeBanner', this.propData[this.current].bg_color);
            },
            click_item(e) {
                this.swiperDotIndex = e;
            },
            banner_event(e) {
                app.globalData.operation_event(e);
            },
        },
    };
</script>
<style>
    .banner {
        transform: translateY(0);
    }

    .banner .image {
        min-width: 100%;
    }

    .banner-mini,
    .banner-mini .image {
        height: 200rpx !important;
    }

    .banner-default,
    .banner-default .image {
        height: 280rpx !important;
    }

    .banner-max,
    .banner-max .image {
        height: 420rpx !important;
    }

    /**
	 * 指示点 左右定位
	 */
    .swiper-left /deep/ .uni-swiper__dots-box {
        justify-content: start;
        padding-left: 24rpx;
    }

    .swiper-right /deep/ .uni-swiper__dots-box {
        justify-content: end;
        padding-right: 24rpx;
    }
</style>
