<template>
    <!-- 底部导航 -->
    <view v-if="(propValue || null) !== null" class="footer-nav flex-row jc-c align-c" :class="nav_type == 1 ? 'bottom-line-exclude' : ''">
        <view class="flex-1 wh-auto" :style="style_container">
            <view class="footer-nav-content flex-row jc-c align-c wh-auto" :style="style_img_container">
                <view class="flex-row jc-c align-c wh-auto" :class="nav_type == 0 ? 'bottom-line-exclude' : ''">
                    <view class="flex-row jc-sa align-c wh padding-0">
                        <block v-for="(item, index) in nav_content" :key="index">
                            <view class="flex-1 flex-col jc-c align-c gap-5 pr" :data-value="item.link.page || ''" @tap="url_event">
                                <view v-if="nav_style != 2" class="img-content pr">
                                    <view class="img-item pa border-radius-xs animate-linear" :class="active_index != index ? 'active' : ''">
                                        <template v-if="item.img.length > 0">
                                            <image :src="item.img[0].url" class="img dis-block" model="widthFix"></image>
                                        </template>
                                    </view>
                                    <view class="img-item pa border-radius-xs animate-linear" :class="active_index == index ? 'active' : ''">
                                        <template v-if="item.img_checked.length > 0">
                                            <image :src="item.img_checked[0].url" class="img dis-block" model="widthFix"></image>
                                        </template>
                                    </view>
                                </view>
                                <text v-if="nav_style != 1" class="animate-linear text-size-xs pr z-i" :style="active_index == index ? text_color_checked : default_text_color">{{ item.name }}</text>
                                <view v-if="(item.badge || null) != null" class="pa badge-icon">
                                    <component-badge :propNumber="item.badge"></component-badge>
                                </view>
                            </view>
                        </block>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
    let app = getApp();
    import { common_styles_computer, common_img_computer } from '@/common/js/common/common.js';
    import componentBadge from '@/components/badge/badge';
    export default {
        props: {
            propKey: {
                type: [String,Number],
                default: '',
            },
            propValue: {
                type: Object,
                default: null,
            },
            // 底部选中索引
            propFooterActiveIndex: {
                type: Number,
                default: 0,
            }
        },
        data() {
            return {
                style_container: '',
                style_img_container: '',
                style: '',
                nav_content: [],
                nav_type: 0,
                nav_style: 0,
                default_text_color: '',
                text_color_checked: '',
                active_index: 0,
            };
        },
        components: {
            componentBadge,
        },
        // 属性值改变监听
        watch: {
            // 唯一key
            propKey(value, old_value) {
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
                        // 角标链接定义
                        let badge_arr = {
                            '/pages/cart/cart': 'cart',
                            '/pages/cart-page/cart-page': 'cart',
                        };
                        for (var i in nav_content) {
                            if ((nav_content[i]['link'] || null) != null && (nav_content[i]['link']['page'] || null) != null) {
                                // 选中索引
                                if (nav_content[i]['link']['page'] == '/' + page) {
                                    active_index = i;
                                }

                                // 获取角标数据
                                var badge_key = badge_arr[nav_content[i]['link']['page']];
                                if (badge_key !== undefined) {
                                    nav_content[i]['badge'] = app.globalData.get_tab_bar_badge(badge_key);
                                }
                            }
                        }
                    }
                    this.setData({
                        nav_content: nav_content,
                        nav_type: new_content.nav_type || 0,
                        nav_style: new_content.nav_style || 0,
                        active_index: active_index,
                        default_text_color: 'color:' + new_style.default_text_color || 'rgba(0, 0, 0, 1)',
                        text_color_checked: 'color:' + new_style.text_color_checked || 'rgba(204, 204, 204, 1)',
                        style_container: common_styles_computer(new_style.common_style),
                        style_img_container: common_img_computer(new_style.common_style),
                    });

                    // 高度计算
                    let nav_min_height = 70;
                    var nav_height = parseInt(new_style.common_style.padding_top) + parseInt(new_style.common_style.padding_bottom) + 44;
                    if (nav_height < nav_min_height) {
                        nav_height = nav_min_height;
                    }
                    let footer_height = nav_height + parseInt(new_style.common_style.margin_top) + parseInt(new_style.common_style.margin_bottom);

                    // #ifndef H5
                    // 底部菜单距离底部的安全距离，减去20、默认的安全距离太高了
                    var safe_areaInsets = uni.getSystemInfoSync().safeAreaInsets || {};
                    var bottom = parseInt(safe_areaInsets.bottom || 0);
                    if (bottom > 0) {
                        bottom -= 24;
                    }
                    footer_height += bottom;
                    // #endif

                    // 回调高度
                    this.$emit('onFooterHeight', footer_height);
                }
            },

            // 跳转链接
            url_event(e) {
                let index = e.currentTarget.dataset.index;
                let item = this.nav_content[index];
                app.globalData.url_event(e);
                this.$emit('onFooterTap', index, item);
            },
        },
    };
</script>
<style lang="scss" scoped>
    .footer-nav {
        z-index: 102;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        margin: 0 auto;
        background-color: transparent;
        .footer-nav-content {
            min-height: 140rpx;
            box-sizing: border-box;
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
            .badge-icon {
                margin-top: -70rpx;
                margin-right: -70rpx;
            }
        }
    }
    /* #ifdef H5 */
    @media only screen and (min-width: 1600rpx) {
        .footer-nav {
            max-width: 1600rpx;
        }
    }
    /* #endif */
</style>
