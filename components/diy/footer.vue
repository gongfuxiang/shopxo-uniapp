<template>
    <!-- 底部导航 -->
    <view class="footer-nav flex-row jc-c align-c">
        <view class="footer-nav-content flex-row jc-c align-c wh" :style="style_container">
            <view class="bottom-line-exclude">
                <view class="flex-row jc-sa align-c wh padding-0">
                    <view v-for="(item, index) in nav_content" :key="index" class="flex-1 flex-col jc-c align-c gap-5" :data-index="index" :data-value="item.link.page" @tap="url_event">
                        <view v-if="nav_style !== 2" class="img pr">
                            <view class="img-item pa border-radius-xs animate-linear" :class="is_active != index ? 'active' : ''">
                                <img :src="item.img[0].url" class="wh-auto ht-auto" />
                            </view>
                            <view class="img-item pa border-radius-xs animate-linear" :class="is_active == index ? 'active' : ''">
                                <img :src="item.img_checked[0].url" class="wh-auto ht-auto" />
                            </view>
                        </view>
                        <text v-if="nav_style !== 1" class="animate-linear size-12 pr z-i" :style="is_active == index ? text_color_checked : default_text_color">{{ item.name }}</text>
                    </view>
                </view>
            </view>
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
            footerActiveIndex: {
                type: Number,
                default: 0,
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
                is_active: this.footerActiveIndex,
            };
        },
        created() {
            //隐藏tabbar
            uni.hideTabBar();
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                const new_content = this.value.content || {};
                const new_style = this.value.style || {};
                this.setData({
                    nav_content: new_content.nav_content || [],
                    nav_style: new_content.nav_style || 0,
                    default_text_color: 'color:' + new_style.default_text_color || 'rgba(0, 0, 0, 1)',
                    text_color_checked: 'color:' + new_style.text_color_checked || 'rgba(204, 204, 204, 1)',
                    style_container: common_styles_computer(new_style.common_style),
                });
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
                const index = e.currentTarget.dataset.index;
                const list_item = this.nav_content[index];
                this.setData({
                    is_active: index,
                });
                // app.globalData.url_event(e);
                this.$emit('footer-click', index, list_item);
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
