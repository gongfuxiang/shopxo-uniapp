<template>
    <!-- 底部导航 -->
    <view v-if="(propValue || null) !== null" class="footer-nav flex-row jc-c align-c">
        <view class="footer-nav-content flex-row jc-c align-c wh" :style="style_container">
            <view class="bottom-line-exclude">
                <view class="flex-row jc-sa align-c wh padding-0">
                    <view v-for="(item, index) in nav_content" :key="index" class="flex-1 flex-col jc-c align-c gap-5" :data-index="index" :data-value="item.link.page || ''" @tap="url_event">
                        <view v-if="nav_style !== 2" class="img-content pr">
                            <view class="img-item pa border-radius-xs animate-linear" :class="active_index != index ? 'active' : ''">
                                <image :src="item.img[0].url" class="img dis-block" model="widthFix"></image>
                            </view>
                            <view class="img-item pa border-radius-xs animate-linear" :class="active_index == index ? 'active' : ''">
                                <image :src="item.img_checked[0].url" class="img dis-block" model="widthFix"></image>
                            </view>
                        </view>
                        <text v-if="nav_style !== 1" class="animate-linear size-12 pr z-i" :style="active_index == index ? text_color_checked : default_text_color">{{ item.name }}</text>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
    let app = getApp();
    import { common_styles_computer } from '@/common/js/common/common.js';
    export default {
        props: {
            propValue: {
                type: Object,
                default: null,
            },
            propFooterActiveIndex: {
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
                active_index: 0,
            };
        },
        // 属性值改变监听
        watch: {
            // 菜单数据
            propValue(value, old_value) {
                this.init();
            },
            // 选中索引
            propFooterActiveIndex(value, old_value) {
                this.init();
            },
        },
        // 页面被展示
        created: function () {
            this.init();
        },
        methods: {
            // 初始化
            init() {
                if ((this.propValue || null) !== null) {
                    let new_content = this.propValue.content || {};
                    let new_style = this.propValue.style || {};
                    let nav_content = new_content.nav_content || [];
                    let page = app.globalData.current_page() || null;
                    let active_index = this.propFooterActiveIndex;
                    if (page != null) {
                        for (var i in nav_content) {
                            if ((nav_content[i]['link'] || null) != null && (nav_content[i]['link']['page'] || null) != null && nav_content[i]['link']['page'] == '/' + page) {
                                active_index = i;
                            }
                        }
                    }
                    this.setData({
                        nav_content: nav_content,
                        nav_style: new_content.nav_style || 0,
                        active_index: active_index,
                        default_text_color: 'color:' + new_style.default_text_color || 'rgba(0, 0, 0, 1)',
                        text_color_checked: 'color:' + new_style.text_color_checked || 'rgba(204, 204, 204, 1)',
                        style_container: common_styles_computer(new_style.common_style),
                    });
                    let footer_height = parseInt(new_style.common_style.padding_top) + parseInt(new_style.common_style.padding_bottom) + parseInt(new_style.common_style.margin_top) + parseInt(new_style.common_style.margin_bottom) + 40;
                    // #ifndef APP
                    // 底部菜单距离底部的安全距离
                    footer_height += parseInt(uni.getSystemInfoSync().statusBarHeight);
                    // #endif
                    this.$emit('footer-height', footer_height);
                }
            },

            // 跳转链接
            url_event(e) {
                let index = e.currentTarget.dataset.index;
                let item = this.nav_content[index];
                app.globalData.url_event(e);
                this.$emit('footer-tap', index, item);
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
        background-color: transparent;
        .footer-nav-content {
            min-height: 140rpx;
            .img-content {
                width: 44rpx;
                height: 44rpx;
                .img-item {
                    width: 44rpx;
                    height: 44rpx;
                    opacity: 0;
                    &.active {
                        opacity: 1;
                    }
                    .img {
                        width: 44rpx;
                        height: 44rpx;
                    }
                }
            }
        }
    }
</style>
