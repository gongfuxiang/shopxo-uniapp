<template>
    <!-- 底部导航 -->
    <view class="footer-nav flex-row jc-c align-c bottom-line-exclude">
        <view class="footer-nav-content flex-row jc-c align-c wh" :style="style_container">
            <ul class="flex-row jc-sa align-c wh padding-0">
                <li v-for="(item, index) in nav_content" :key="index" class="flex-1 flex-col jc-c align-c gap-5" :data-index="index" :data-value="item.link.page" @tap="url_event">
                    <view v-if="nav_style !== 2" class="img pr">
                        <view class="img-item pa border-radius-xs animate-linear" :class="is_active != index ? 'active' : ''">
                            <img :src="item.img[0].url" class="wh-auto ht-auto" />
                        </view>
                        <view class="img-item pa border-radius-xs animate-linear" :class="is_active == index ? 'active' : ''">
                            <img :src="item.img_checked[0].url" class="wh-auto ht-auto" />
                        </view>
                    </view>
                    <span v-if="nav_style !== 1" class="animate-linear size-12 pr z-i" :style="is_active == index ? text_color_checked : default_text_color">{{ item.name }}</span>
                </li>
            </ul>
        </view>
    </view>
</template>

<script>
    const app = getApp();
    import { common_styles_computer } from '@/common/js/common/common.js';
    export default {
        props: {
            value: {
                type: Object,
                default: () => ({}),
            },
        },
        data() {
            return {
                style_container: '',
                style: '',
                nav_content: [],
                nav_style: 0,
                default_text_color: '',
                text_color_checked: '',
                is_active: 0,
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                const new_content = this.value.content || {};
                const new_style = this.value.style || {};
                this.nav_content = new_content.nav_content || [];
                this.nav_style = new_content.nav_style || 0;
                this.default_text_color = 'color:' + new_style.default_text_color || 'rgba(0, 0, 0, 1)';
                this.text_color_checked = 'color:' + new_style.text_color_checked || 'rgba(204, 204, 204, 1)';

                this.style_container = common_styles_computer(new_style.common_style);
                let footer_height = new_style.common_style.padding_top + new_style.common_style.padding_bottom + new_style.common_style.margin_top + new_style.common_style.margin_bottom + 50;
                // #ifndef APP
                // 底部菜单距离底部的安全距离
                footer_height = footer_height + uni.getSystemInfoSync().statusBarHeight - 40;
                // #endif
                if (footer_height >= 70) {
                    footer_height = footer_height;
                } else {
                    footer_height = 70;
                }
                this.$emit('footer-height', footer_height);
            },
            // 跳转链接
            url_event(e) {
                this.is_active = e.currentTarget.dataset.index;
                app.globalData.url_event(e);
            },
        },
    };
</script>

<style lang="scss" scoped>
    .footer-nav {
        z-index: 9;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        /* #ifdef H5 */
        max-width: 800px;
        /* #endif */
        margin: 0 auto;
        cursor: pointer;
        background-color: transparent;
        .footer-nav-content {
            min-height: 140rpx;
            .img {
                width: 40rpx;
                height: 40rpx;
                .img-item {
                    width: 44rpx;
                    height: 44rpx;
                    opacity: 0;
                    &.active {
                        opacity: 1;
                    }
                }
            }
        }
    }
</style>
