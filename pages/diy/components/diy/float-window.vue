<template>
    <movable-area class="float-window-movable-container">
        <movable-view :x="x" :y="y" direction="all" class="float-window-spread flex-row align-c jc-c" @tap="btn_event">
            <block v-if="style.float_style == 'diffuse'">
                <view class="ring" :style="content_style"></view>
                <view class="ring" :style="content_style"></view>
            </block>
            <view class="img oh" :style="content_style">
                <block v-if="(form || null) != null && form.button_jump == 'customer_service'">
                    <component-online-service :propChatImage="img_url" :propIsSpread="false" :propIsMovable="false"></component-online-service>
                </block>
                <block v-else>
                    <image-empty :propImageSrc="img_url" propImgFit="aspectFill" propErrorStyle="width: 60rpx;height: 60rpx;"></image-empty>
                </block>
            </view>
        </movable-view>
        <component-quick-nav ref="quick_nav" :propIsBtn="false"></component-quick-nav>
    </movable-area>
</template>

<script>
    const app = getApp();
    import { isEmpty } from '@/common/js/common/common.js';
    import imageEmpty from '@/pages/diy/components/diy/modules/image-empty.vue';
    import componentOnlineService from '@/components/online-service/online-service';
    import componentQuickNav from '@/components/quick-nav/quick-nav';
    export default {
        components: {
            imageEmpty,
            componentOnlineService,
            componentQuickNav
        },
        props: {
            propValue: {
                type: Object,
                default: () => {
                    return {};
                },
            },
            propKey: {
                type: [String,Number],
                default: '',
            }
        },
        data() {
            return {
                form: {},
                style: {},
                img_url: '',
                x: 0,
                y: 0,
                content_style: '',
            };
        },
        watch: {
            propKey(val) {
                // 初始化
                this.init();
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                // 获取内容
                let form = this.propValue.content || {};
                // 获取图片
                let img_url = (form.button_img || null) != null ? (form.button_img[0] || null) : null;
                if (img_url != null) {
                    img_url = img_url.url || null;
                }
                const { float_style, float_style_color, display_location, offset_number_percentage } = this.propValue.style;
                // 获取当前手机的宽度和高度
                const { windowWidth, windowHeight } = uni.getSystemInfoSync();
                // 计算出距离左边的距离
                let x = display_location == 'left' ? 10 : windowWidth - 60;
                // 计算出距离顶部的距离
                const y = Math.ceil(windowHeight * (1 - Number(offset_number_percentage)) - 20);
                this.setData({
                    form: form,
                    style: this.propValue.style,
                    img_url: img_url,
                    content_style: float_style == 'shadow' ? `box-shadow: 0 0 40rpx ${float_style_color};border-radius: 50%;` : `background-color: ${float_style_color};border-radius: 50%;`,
                    x: x,
                    y: y
                });
            },
            // 按钮事件
            btn_event() {
                const { button_jump, button_link } = this.form;
                switch(button_jump) {
                    // 链接
                    case 'link' :
                        if (!isEmpty(button_link)) {
                            app.globalData.url_open(button_link.page);
                        }
                        break;
                    // 快捷导航
                    case 'quick_nav' :
                        this.$emit('btn_event', 'quick_nav');
                        break;
                    case 'lang' :
                        this.$emit('btn_event', 'lang');
                        break;
                }
            },
        },
    };
</script>

<style scoped lang="scss">
    .img {
        width: 90rpx;
        height: 90rpx;
        border-radius: 50%;
        z-index: 2;
    }
    .float-window-movable-container {
        position: fixed;
        width: 100%;
        max-width: 1600rpx;
        height: 100%;
        top: 0;
        // left: 0;
        background: transparent;
        pointer-events: none;
        z-index: 103;
    }
    /**
    * 呼吸灯
    */
    .float-window-spread {
        position: relative;
        pointer-events: auto;
        z-index: 1;
        width: 100rpx;
        height: 100rpx;
        padding: 10rpx;
        border-radius: 50%;
    }
    .float-window-spread .ring {
        /* 速度为1.5 * 层数 = 实际运行速度，速度修改则 animation-delay 属性也修改相同速度 */
        animation: pulsing 1.5s ease-out infinite;
        border-radius: 100%;
        width: 100rpx;
        height: 100rpx;
        position: absolute;
    }
    /* 速度为1*层数 */
    .float-window-spread .ring:nth-of-type(1) {
        -webkit-animation-delay: -1.5s;
        animation-delay: -1.5s;
    }

    /* 速度为1*层数 */
    .float-window-spread .ring:nth-of-type(2) {
        -webkit-animation-delay: -2s;
        animation-delay: -2s;
    }
    @keyframes pulsing {
        100% {
            transform: scale(1.35);
            opacity: 0;
        }
    }
</style>
