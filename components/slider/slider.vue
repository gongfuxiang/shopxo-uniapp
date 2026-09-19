<template>
    <view :class="theme_view">
        <view v-if="propData.length > 0" :class="(propIsSpacingMb ? 'spacing-mb ' : '') + (propLeft ? 'swiper-left ' : '') + (propRight ? 'swiper-right ' : '') + (propMode == 'count' ? 'swiper-count pr' : '')">
            <!-- 数量角标模式：右侧 1/5 -->
            <block v-if="propMode == 'count'">
                <swiper class="banner oh" :class="banner_class" :style="banner_height_style" :autoplay="propData.length > 1" :duration="duration" :circular="circular" @change="swiper_change" :current="swiperDotIndex">
                    <swiper-item v-for="(item, i) in propData" :key="i">
                        <image class="image" :src="item.images_url" :mode="propImageMode" :style="banner_height_style" :data-index="i" :data-value="item.event_value || item.url" :data-type="item.event_type == undefined ? 1 : item.event_type" @tap="banner_event"> </image>
                    </swiper-item>
                </swiper>
                <view v-if="propData.length > 1" class="slider-count-badge text-size-xs cr-white" :style="'bottom:' + propBottom + 'px;'">{{ current + 1 }}/{{ propData.length }}</view>
            </block>
            <!-- 指示点模式：default/dot/round/nav/indexes（uni-swiper-dot） -->
            <uni-swiper-dot v-else class="uni-swiper-dot-box" :mode="propMode" :dots-styles="dotsStyles" @clickItem="click_item" :info="propData" :current="current" :field="propField">
                <swiper class="banner oh" :class="banner_class" :style="banner_height_style" :autoplay="propData.length > 0" :duration="duration" :circular="circular" @change="swiper_change" :current="swiperDotIndex">
                    <swiper-item v-for="(item, i) in propData" :key="i">
                        <image class="image" :src="item.images_url" :mode="propImageMode" :style="banner_height_style" :data-index="i" :data-value="item.event_value || item.url" :data-type="item.event_type == undefined ? 1 : item.event_type" @tap="banner_event"> </image>
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
            // 指示点/数量 靠右
            propRight: {
                type: Boolean,
                default: false,
            },
            // 轮播指示：default/dot/round/nav/indexes（uni-swiper-dot）/count（右侧数量 1/5）
            propMode: {
                type: String,
                default: 'dot',
            },
            // mode=nav 时展示的字段名
            propField: {
                type: String,
                default: '',
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
            // 指示点/数量角标距 swiper 底部的高度（px）
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
            propIsSpacingMb: {
                type: Boolean,
                default: true,
            },
            // 自定义高度（如商品详情正方形相册）
            propHeight: {
                type: String,
                default: '',
            },
            // 图片裁剪模式
            propImageMode: {
                type: String,
                default: 'widthFix',
            },
            // 点击预览大图（支持左右切换），为 true 时优先预览，不再走运营跳转
            propPreview: {
                type: Boolean,
                default: false,
            },
        },
        computed: {
            banner_class() {
                var size = this.propSize || 'default';
                var custom = (this.propHeight || '') != '' ? ' banner-custom-height' : '';
                return 'banner-' + size + custom + ' ' + (this.propRadius || '');
            },
            banner_height_style() {
                if ((this.propHeight || '') == '') {
                    return '';
                }
                return 'height: ' + this.propHeight + ' !important;';
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
        watch: {
            propData() {
                this.current = 0;
                this.swiperDotIndex = 0;
            },
        },
        methods: {
            swiper_change(e) {
                // 原始index
                this.current = e.detail.current;
                this.$emit('changeBanner', (this.propData[this.current] || {}).bg_color);
                this.$emit('swiperChange', this.current);
            },
            click_item(e) {
                this.swiperDotIndex = e;
            },
            banner_event(e) {
                if (this.propPreview) {
                    this.preview_images_event(e);
                    return;
                }
                app.globalData.operation_event(e);
            },
            // 预览轮播图片（多图可左右切换）
            preview_images_event(e) {
                var list = this.propData || [];
                var urls = [];
                for (var i in list) {
                    var url = list[i].images_url || list[i].url || '';
                    if (url != '') {
                        urls.push(url);
                    }
                }
                if (urls.length <= 0) {
                    return;
                }
                var index = parseInt((e.currentTarget.dataset || {}).index);
                if (isNaN(index) || index < 0 || index >= urls.length) {
                    index = this.current || 0;
                }
                uni.previewImage({
                    current: urls[index] || urls[0],
                    urls: urls,
                });
            },
        },
    };
</script>
<style scoped>
    .banner {
        transform: translateY(0);
    }

    .banner .image {
        min-width: 100%;
    }

    .banner-mini:not(.banner-custom-height),
    .banner-mini:not(.banner-custom-height) .image {
        height: 200rpx !important;
    }

    .banner-default:not(.banner-custom-height),
    .banner-default:not(.banner-custom-height) .image {
        height: 280rpx !important;
    }

    .banner-max:not(.banner-custom-height),
    .banner-max:not(.banner-custom-height) .image {
        height: 420rpx !important;
    }

    .banner-custom-height .image {
        width: 100%;
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

    /**
     * 数量角标 1/5
     */
    .slider-count-badge {
        position: absolute;
        right: 24rpx;
        z-index: 2;
        line-height: 36rpx;
        padding: 0 16rpx;
        border-radius: 20rpx;
        background: rgba(0, 0, 0, 0.45);
        pointer-events: none;
    }
    .swiper-left .slider-count-badge {
        right: auto;
        left: 24rpx;
    }
</style>
