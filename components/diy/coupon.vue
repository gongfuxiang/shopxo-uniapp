<template>
    <!-- 优惠券 -->
    <view class="coupon-theme-container">
        <view class="pr" :style="style_container">
            <view class="hide-scrollbar">
                <template v-if="theme == '1'">
                    <view class="coupon-theme-1" :style="'gap:' + theme_style.spacing">
                        <view v-for="item in data_list" :key="item" class="item" :style="'background: ' + theme_style.background">
                            <view class="coupon-theme-1-content tc" :style="'background-image: url(' + theme_bg_img.url_1 + ');background-size: 100% 100%;'">
                                <view class="name text-line-1" :style="'color:' + theme_style.name_color">{{ item.name }}</view>
                                <view class="price" :style="'color:' + theme_style.price_color">
                                    <span v-if="item.type == '0'" class="symbol">{{ currency_symbol }}</span>
                                    <span class="number">{{ item.discount_value }}</span>
                                    <span v-if="item.type == '1'" class="symbol">折</span>
                                </view>
                            </view>
                            <view class="coupon-btn" :style="'color:' + theme_style.btn_color + ';background:' + theme_style.btn_background">立即领取</view>
                        </view>
                    </view>
                </template>
                <template v-else-if="theme == '2'">
                    <view class="coupon-theme-2" :style="'gap:' + theme_style.spacing">
                        <view v-for="item in data_list" :key="item" class="item" :style="'background-image: url(' + theme_bg_img.url_2 + ');background-size: 100% 100%;'">
                            <view class="tc">
                                <view class="price" :style="'color:' + theme_style.price_color">
                                    <span v-if="item.type == '0'" class="symbol">{{ currency_symbol }}</span>
                                    <span class="number">{{ item.discount_value }}</span>
                                    <span v-if="item.type == '1'" class="symbol">折</span>
                                </view>
                                <view class="name text-line-1" :style="'color:' + theme_style.name_color">{{ item.name }}</view>
                                <view class="desc text-line-1" :style="'color:' + theme_style.desc_color">{{ item.desc }}</view>
                            </view>
                            <view class="coupon-btn" :style="'color:' + theme_style.btn_color + ';background:' + theme_style.btn_background">立即领取</view>
                        </view>
                    </view>
                </template>
                <template v-else-if="theme == '3'">
                    <view class="coupon-theme-3" :style="'gap:' + theme_style.spacing">
                        <view v-for="item in data_list" :key="item" class="item" :style="'background: ' + theme_style.background">
                            <view class="left" :style="'background: ' + theme_style.background_inside">
                                <div class="price-before" :style="'border-left: 0.1rem dashed ' + theme_style.border_style + '">
                                    <view class="price" :style="'color:' + theme_style.price_color">
                                        <span v-if="item.type == '0'" class="symbol">{{ currency_symbol }}</span>
                                        <span class="number">{{ item.discount_value }}</span>
                                        <span v-if="item.type == '1'" class="symbol self-e">折</span>
                                    </view>
                                </div>
                                <view class="text pl-3 pr-8">
                                    <view class="name text-line-1" :style="'color:' + theme_style.name_color">{{ item.name }}</view>
                                    <view class="desc text-line-1" :style="'color:' + theme_style.desc_color">{{ item.use_limit_type_name }}</view>
                                    <view v-if="item.limit_send_count && item.limit_send_count > 0" class="limit text-line-1" :style="'color:' + theme_style.limit_send_count">(限领{{ item.limit_send_count }}张)</view>
                                </view>
                            </view>
                            <view class="right">
                                <div class="right-before"></div>
                                <view class="coupon-btn" :style="'color:' + theme_style.btn_color">
                                    <text>立即领取</text>
                                    <icon name="arrow-right-o" class="icon"></icon>
                                </view>
                            </view>
                        </view>
                    </view>
                </template>
                <template v-else-if="theme == '4'">
                    <view class="coupon-theme-4" :style="'background: ' + theme_style.background">
                        <view class="hide-scrollbar">
                            <view class="left" :style="'gap: ' + theme_style.spacing">
                                <view v-for="item in data_list" :key="item" class="item" :style="'background: ' + theme_style.background_inside">
                                    <view class="type" :style="'background: ' + theme_style.type_background + ';color:' + theme_style.type_color">
                                        <view class="type-before" :style="'background: ' + theme_style.type_background"></view>
                                        <text>通用券</text>
                                        <view class="type-after" :style="'background: ' + theme_style.type_background"></view>
                                    </view>
                                    <view class="price" :style="'color:' + theme_style.price_color">
                                        <span v-if="item.type == '0'" class="symbol">{{ currency_symbol }}</span>
                                        <span class="number">{{ item.discount_value }}</span>
                                        <span v-if="item.type == '1'" class="symbol">折</span>
                                    </view>
                                    <view class="name text-line-1" :style="'color:' + theme_style.name_color">{{ item.name }}</view>
                                </view>
                            </view>
                        </view>
                        <view class="right">
                            <view class="right-before" :style="'background: ' + theme_style.background"></view>
                            <view class="re z-i flex-col jc-c align-c">
                                <view class="title text-line-1" :style="'color:' + theme_style.content_title_color">{{ content_title }}</view>
                                <view class="desc text-line-1" :style="'color:' + theme_style.content_desc_color">{{ content_desc }}</view>
                                <view class="coupon-btn" :style="'color:' + theme_style.btn_color + ';background:' + theme_style.btn_background">领取全部</view>
                            </view>
                        </view>
                    </view>
                </template>
                <template v-else-if="theme == '5'">
                    <view class="coupon-theme-5" :style="'gap:' + theme_style.spacing">
                        <view v-for="item in data_list" :key="item" class="item">
                            <view class="left" :style="'background-image: url(' + theme_bg_img.url_3 + ');background-size: 100% 100%;'">
                                <view class="price" :style="'color:' + theme_style.price_color">
                                    <span v-if="item.type == '0'" class="symbol">{{ currency_symbol }}</span>
                                    <span class="number">{{ item.discount_value }}</span>
                                    <span v-if="item.type == '1'" class="symbol">折</span>
                                </view>
                                <view class="name text-line-1" :style="'color:' + theme_style.name_color">{{ item.name }}</view>
                            </view>
                            <view class="right" :style="'background: ' + theme_style.background">
                                <view class="coupon-btn" :style="'color:' + theme_style.btn_color">领取</view>
                            </view>
                        </view>
                    </view>
                </template>
                <template v-else-if="theme == '6'">
                    <view class="coupon-theme-6" :style="'gap:' + theme_style.spacing">
                        <view v-for="item in data_list" :key="item" class="item" :style="'background: ' + theme_style.background">
                            <view class="pr">
                                <view class="top-before"></view>
                                <view class="top" :style="'background: ' + theme_style.background_inside">
                                    <view class="price" :style="'color:' + theme_style.price_color">
                                        <span v-if="item.type == '0'" class="symbol">{{ currency_symbol }}</span>
                                        <span class="number">{{ item.discount_value }}</span>
                                        <span v-if="item.type == '1'" class="symbol">折</span>
                                    </view>
                                    <view class="name text-line-1" :style="'color:' + theme_style.name_color">{{ item.name }}</view>
                                </view>
                                <view class="top-after"></view>
                            </view>
                            <view class="bottom">
                                <view class="coupon-btn" :style="'color:' + theme_style.btn_color">立即领取</view>
                            </view>
                        </view>
                    </view>
                </template>
                <template v-else-if="theme == '7'">
                    <view class="coupon-theme-7" :style="'gap:' + theme_style.spacing">
                        <view v-for="item in data_list" :key="item" class="item" :style="'background: ' + theme_style.background">
                            <view class="item-before" :style="'background: ' + theme_style.theme_7_background"></view>
                            <view class="flex-row">
                                <view class="left">
                                    <view class="price" :style="'color:' + theme_style.price_color">
                                        <span v-if="item.type == '0'" class="symbol">{{ currency_symbol }}</span>
                                        <span class="number">{{ item.discount_value }}</span>
                                        <span v-if="item.type == '1'" class="symbol">折</span>
                                    </view>
                                    <view class="name text-line-1" :style="'color:' + theme_style.name_color">{{ item.name }}</view>
                                </view>
                                <view class="right">
                                    <view class="right-before" :style="'border: 2rpx dashed ' + theme_style.theme_7_background"></view>
                                    <view class="coupon-btn" :style="'color:' + theme_style.btn_color">立即领取</view>
                                </view>
                            </view>
                            <view class="item-after" :style="'background: ' + theme_style.theme_7_background"></view>
                        </view>
                    </view>
                </template>
            </view>
        </view>
    </view>
</template>

<script>
    const app = getApp();
    import { common_styles_computer, gradient_computer } from '@/common/js/common/common.js';
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
                data_list: [],
                // 主题
                theme: '0',
                // 主题样式
                theme_style: {},
                // 主题4 标题
                content_title: '',
                // 主题4 描述
                content_desc: '',
                theme_bg_img: {
                    url_1: '',
                    url_2: '',
                    url_3: '',
                },
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                const new_content = this.value.content || {};
                const new_style = this.value.style || {};
                this.content_title = new_content.content_title || '';
                this.content_desc = new_content.content_desc || '';
                // 判断是自动还是手动
                if (new_content.data_type == '0') {
                    this.data_list = new_content.data_list;
                } else {
                    this.data_list = new_content.data_auto_list;
                }
                // 主题
                this.theme = new_content.theme;
                const new_background = gradient_computer({ color_list: new_style.background, direction: new_style.direction }, false);
                const new_background_inside = gradient_computer({ color_list: new_style.background_inside, direction: new_style.direction_inside }, false);
                const new_btn_background = gradient_computer({ color_list: new_style.btn_background, direction: new_style.btn_direction }, false);
                this.theme_style = {
                    price_color: new_style.price_color,
                    name_color: new_style.name_color,
                    // 判断是否向对象添加desc_color属性
                    ...(!['1', '5', '6', '7'].includes(this.theme) && { desc_color: new_style.desc_color }),
                    ...(!['1', '2', '4', '5', '6', '7'].includes(this.theme) && { limit_send_count: new_style.limit_send_count }),
                    ...(!['5', '6', '7'].includes(this.theme) && { btn_background: new_btn_background }),
                    btn_color: new_style.btn_color,
                    ...(!['2'].includes(this.theme) && { background: new_background }),
                    ...(!['1', '2', '5', '7'].includes(this.theme) && { background_inside: new_background_inside }),
                    spacing: new_style.spacing + 'px',
                    ...(!['1', '2', '3', '5', '6', '7'].includes(this.theme) && { type_background: new_style.type_background }),
                    ...(!['1', '2', '3', '5', '6', '7'].includes(this.theme) && { type_color: new_style.type_color }),
                    ...(!['1', '2', '3', '5', '6', '7'].includes(this.theme) && { content_title_color: new_style.content_title_color }),
                    ...(!['1', '2', '3', '5', '6', '7'].includes(this.theme) && { content_desc_color: new_style.content_desc_color }),
                    ...(['3'].includes(this.theme) && { border_style: new_style.background[0].color }),
                    ...(['7'].includes(this.theme) && { theme_7_background: new_style.background[0].width + 'px' }),
                };
                this.theme_bg_img = {
                    url_1: new_content.theme_1_static_img[0].url,
                    url_2: new_content.theme_2_static_img[0].url,
                    url_3: new_content.theme_5_static_img[0].url,
                };
                this.style_container = common_styles_computer(new_style.common_style);
            },
        },
    };
</script>
<style lang="scss" scoped>
    .coupon-theme-1 {
        display: flex;
        flex-direction: row;
        .item {
            flex-basis: auto;
            flex-shrink: 0;
            width: 9rem;
            height: 9rem;
            border-radius: 1rem;
            margin-top: 1rem;
            .name {
                padding: 0.5rem 0.5rem 0 0.5rem;
                margin-bottom: 0.5rem;
                font-size: 1rem;
            }
            .price {
                padding: 0.5rem 0 0.8rem 0;
                .symbol {
                    font-size: 1.2rem;
                    position: relative;
                    bottom: 0.3rem;
                }
                .number {
                    font-size: 3rem;
                    line-height: 2.4rem;
                    font-weight: 500;
                    padding: 0 0.4rem;
                }
            }
            .coupon-theme-1-content {
                width: calc(100% - 1rem);
                margin: 0 0.5rem;
                background-size: 100% 100%;
                position: relative;
                top: -1rem;
            }

            .coupon-btn {
                margin: 0 auto;
                width: 7.1rem;
                height: 1.756rem;
                line-height: 1.756rem;
                text-align: center;
                font-size: 0.9rem;
                border-radius: 2.3rem;
                position: relative;
                top: -0.2rem;
            }
        }
    }
    .coupon-theme-2 {
        display: flex;
        flex-direction: row;
        .item {
            flex-basis: auto;
            flex-shrink: 0;
            background-size: 100% 100%;
            width: 8.5rem;
            height: 10rem;
            padding: 0.5rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .price {
                padding: 0.3rem 0;
                .symbol {
                    font-size: 0.8rem;
                }
                .number {
                    font-size: 2.6rem;
                    font-weight: 500;
                    padding: 0 0.4rem;
                }
            }
            .name {
                font-size: 0.8rem;
                font-weight: 500;
                margin-bottom: 0.4rem;
            }
            .desc {
                font-size: 0.8rem;
            }

            .coupon-btn {
                margin: 0 auto;
                width: 5.5rem;
                height: 1.6rem;
                line-height: 1.6rem;
                text-align: center;
                font-size: 0.9rem;
                border-radius: 2.3rem;
                margin-top: 0.5rem;
                margin-bottom: 0.2rem;
            }
        }
    }
    .coupon-theme-3 {
        display: flex;
        .item {
            overflow: hidden;
            border-radius: 1.6rem;
            flex-basis: auto;
            flex-shrink: 0;
            width: 100%;
            padding: 0.8rem;
            display: flex;
            .left {
                flex: 1;
                width: 0;
                border-radius: 0.8rem;
                padding: 0.6rem 1.2rem 0.3rem 1.2rem;
                display: flex;
                align-items: center;
                .price-before {
                    content: '';
                    position: absolute;
                    right: 0;
                    top: -3rem;
                    bottom: -3rem;
                    width: 0.1rem;
                    height: calc(100% + 6rem);
                }
                .price {
                    text-align: center;
                    width: 10rem;
                    position: relative;
                    display: flex;
                    align-items: flex-start;
                    .symbol {
                        font-size: 1.8rem;
                        font-weight: 600;
                    }
                    .number {
                        font-size: 3.2rem;
                        font-weight: 600;
                        padding: 0 0.4rem;
                        line-height: 3rem;
                    }
                }
                .text {
                    flex: 1;
                    width: 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    .name {
                        font-size: 1.8rem;
                        font-weight: 500;
                        line-height: 2.5rem;
                    }
                    .desc {
                        font-size: 1.4rem;
                        font-weight: 500;
                        line-height: 2rem;
                    }
                    .limit {
                        font-size: 1.2rem;
                    }
                }
            }
            .right {
                width: 8.6rem;
                position: relative;
                padding: 0 1.8rem;
                text-align: center;
                display: flex;
                align-items: center;
                .right-before {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 200%;
                    height: 200%;
                    left: -1.6rem;
                    border-radius: 100%;
                }
                .coupon-btn {
                    position: relative;
                    font-size: 1.8rem;
                    font-weight: 500;
                    text-align: center;
                    .icon {
                        font-size: 2rem;
                    }
                }
            }
        }
    }
    .coupon-theme-4 {
        overflow: hidden;
        border-radius: 1.6rem;
        padding: 0.8rem;
        display: flex;
        .left {
            width: 21.4rem;
            display: flex;
            flex-direction: row;
            .item {
                overflow: hidden;
                flex-basis: auto;
                flex-shrink: 0;
                width: 7.2rem;
                height: 7.2rem;
                border-radius: 1rem;
                position: relative;
                display: flex;
                flex-direction: column;
                justify-content: flex-end;
                align-items: center;
                padding: 0.4rem;
                .type {
                    position: absolute;
                    top: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    font-size: 1rem;
                    line-height: 1.4rem;
                    .type-before {
                        position: absolute;
                        width: 1.5rem;
                        height: 3rem;
                        left: -0.8rem;
                        border-radius: 100%;
                        top: -1.6rem;
                        z-index: -1;
                    }
                    .type-after {
                        position: absolute;
                        width: 1.5rem;
                        height: 3rem;
                        right: -0.8rem;
                        border-radius: 100%;
                        top: -1.6rem;
                        z-index: -1;
                    }
                }
                .price {
                    text-align: center;
                    position: relative;
                    display: flex;
                    align-items: flex-end;
                    .symbol {
                        font-size: 1.2rem;
                    }
                    .number {
                        font-size: 2.4rem;
                        line-height: 2.4rem;
                        font-weight: 600;
                        padding-left: 0.4rem;
                    }
                }
                .name {
                    font-size: 1.1rem;
                    line-height: 1.6rem;
                }
            }
        }
        .right {
            flex: 1;
            width: 0;
            position: relative;
            .right-before {
                width: 18rem;
                height: 18rem;
                position: absolute;
                left: -0.7rem;
                top: 50%;
                transform: translateY(-50%);
                border-radius: 100%;
            }
            .title {
                font-size: 1.6rem;
                font-weight: 500;
                line-height: 2.2rem;
            }
            .desc {
                margin-top: 0.3rem;
                font-size: 1.2rem;
                line-height: 1.7rem;
            }
            .coupon-btn {
                width: 7.2rem;
                height: 2.2rem;
                font-size: 1.2rem;
                line-height: 2.2rem;
                text-align: center;
                border-radius: 1.2rem;
                margin-top: 0.6rem;
            }
        }
    }
    .coupon-theme-5 {
        display: flex;
        flex-direction: row;
        .item {
            flex-basis: auto;
            flex-shrink: 0;
            border-radius: 0.6rem;
            width: 12.6rem;
            height: 6.4rem;
            position: relative;
            .left {
                position: absolute;
                left: 0;
                width: 10rem;
                height: 100%;
                padding: 0.6rem;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 1;
                .price {
                    text-align: center;
                    position: relative;
                    display: flex;
                    align-items: end;
                    margin-bottom: 0.5rem;
                    .symbol {
                        font-size: 1.2rem;
                        font-weight: 500;
                    }
                    .number {
                        font-size: 2.4rem;
                        font-weight: 500;
                        line-height: 20px;
                        padding-left: 0.4rem;
                    }
                }
                .name {
                    font-size: 1.2rem;
                }
            }
            .right {
                width: 4.6rem;
                padding-left: 2rem;
                border-radius: 0.6rem;
                position: absolute;
                top: 0;
                bottom: 0;
                right: 0;
                height: 100%;
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;
                .coupon-btn {
                    position: relative;
                    font-size: 1.2rem;
                    font-weight: 500;
                    text-align: center;
                    writing-mode: vertical-lr;
                    letter-spacing: 5px;
                }
            }
        }
    }
    .coupon-theme-6 {
        display: flex;
        .item {
            flex-basis: auto;
            flex-shrink: 0;
            border-radius: 1.2rem;
            padding: 0.6rem;
            width: 14rem;
            height: 10rem;
            position: relative;
            .top-before {
                position: absolute;
                left: -0.7rem;
                top: 50%;
                transform: translateY(-50%);
                width: 1.4rem;
                height: 1.4rem;
                border-radius: 50%;
            }
            .top-after {
                position: absolute;
                right: -0.7rem;
                top: 50%;
                transform: translateY(-50%);
                width: 1.4rem;
                height: 1.4rem;
                border-radius: 50%;
            }
            .top {
                width: 100%;
                padding: 0.4rem;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 1;
                border-radius: 0.6rem;
                position: relative;
                overflow: hidden;
                .price {
                    text-align: center;
                    position: relative;
                    display: flex;
                    align-items: end;
                    margin-bottom: 0.1rem;
                    .symbol {
                        font-size: 2.2rem;
                        font-weight: 500;
                    }
                    .number {
                        font-size: 3.2rem;
                        font-weight: 500;
                        line-height: 32px;
                        padding-left: 0.4rem;
                    }
                }
                .name {
                    font-size: 1.2rem;
                }
            }
            .bottom {
                margin-top: 0.6rem;
                text-align: center;
                .coupon-btn {
                    position: relative;
                    font-size: 1.6rem;
                    line-height: 2.2rem;
                    font-weight: 500;
                    text-align: center;
                }
            }
        }
    }
    .coupon-theme-7 {
        display: flex;
        .item {
            flex-basis: auto;
            flex-shrink: 0;
            border-radius: 0.4rem;
            width: 11.8rem;
            height: 6.4rem;
            position: relative;
            overflow: hidden;
            display: flex;
            .item-before {
                position: absolute;
                left: 8rem;
                top: -0.6rem;
                width: 1.2rem;
                height: 1.2rem;
                border-radius: 50%;
            }
            .item-after {
                position: absolute;
                left: 8rem;
                bottom: -0.6rem;
                width: 1.2rem;
                height: 1.2rem;
                border-radius: 50%;
            }
            .left {
                width: 8.6rem;
                padding: 0.4rem;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                position: relative;
                .price {
                    text-align: center;
                    position: relative;
                    display: flex;
                    align-items: end;
                    margin-bottom: 0.5rem;
                    .symbol {
                        font-size: 1.2rem;
                        font-weight: 500;
                    }
                    .number {
                        font-size: 2.4rem;
                        font-weight: 500;
                        line-height: 2rem;
                        padding-left: 0.4rem;
                    }
                }
                .name {
                    font-size: 1.2rem;
                }
            }
            .right {
                flex: 1;
                width: 0;
                padding-left: 0.7rem;
                position: relative;
                .right-before {
                    position: absolute;
                    left: -0.05rem;
                    top: 0;
                    bottom: 0;
                    width: 0;
                    height: 100%;
                    opacity: 0.61;
                }
                .coupon-btn {
                    padding: 0.4rem;
                    width: 100%;
                    font-size: 1.1rem;
                    font-weight: 500;
                    text-align: center;
                    writing-mode: vertical-lr;
                    letter-spacing: 3px;
                }
            }
        }
    }
    .hide-scrollbar {
        overflow: auto;
        &::-webkit-scrollbar {
            display: none;
            width: 0;
            height: 0;
            color: transparent;
        }
    }
</style>
