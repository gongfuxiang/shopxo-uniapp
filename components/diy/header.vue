<template>
    <view class="bg-white pf top-0 left-0 right-0" :style="'padding-top:' + bar_height + 'rpx'">
        <view class="header-content flex-row">
            <view class="model-top flex-1" :style="position">
                <view class="roll pr z-i" :style="roll_style">
                    <view class="model-head tc pr padding-horizontal-sm flex-row align-c">
                        <view class="flex-row align-c jc-sb gap-16 wh-auto padding-horizontal-main pr">
                            <view v-if="['1', '2', '3'].includes(form.theme)" class="flex-1 flex-row align-c jc-c ht-auto gap-16" :style="text_style + 'justify-content:' + form.indicator_location || 'center'">
                                <template v-if="['2', '3'].includes(form.theme)">
                                    <view class="logo-outer-style"><image-empty v-model="form.logo[0]" class="logo-style" error-img-style="width:2rem;height:2rem;"></image-empty></view>
                                </template>
                                <view v-if="['1', '2'].includes(form.theme)">{{ form.title }}</view>
                                <template v-if="['3', '5'].includes(form.theme)">
                                    <view class="flex-1">
                                        <componentDiySearch :value="value.com_data" :is-page-settings="true"></componentDiySearch>
                                    </view>
                                </template>
                            </view>
                            <view v-else-if="['4', '5'].includes(form.theme)" class="flex-1 flex-row align-c h gap-10">
                                <view class="flex-row gap-2">
                                    <iconfont name="icon-position" size="12" color="0"></iconfont>
                                    <span class="size-14 cr-3 text-line-1">{{ form.positioning_name }}</span>
                                    <iconfont v-if="'icon-' + form.is_arrows_show == '1'" name="arrow-right" size="12" color="0"></iconfont>
                                </view>
                                <template v-if="['5'].includes(form.theme)">
                                    <view class="flex-1">
                                        <componentDiySearch :value="value.com_data" :is-page-settings="true"></componentDiySearch>
                                    </view>
                                </template>
                            </view>
                            <view v-if="!isEmpty(form.icon_setting)" class="flex-row align-c pa right-0 padding-right-main" :style="{ gap: new_style.img_space * 2 + 'rpx' }">
                                <view v-for="(item, index) in form.icon_setting" :key="index" :style="{ width: new_style.img_size * 2 + 'rpx', height: new_style.img_size * 2 + 'rpx' }">
                                    <image-empty v-if="item.img.length > 0" v-model="item.img[0]" :error-img-style="'width: ' + Number(new_style.img_size) / 4 + 'rpx;height:' + Number(new_style.img_size) / 4 + 'rpx;'"></image-empty>
                                    <iconfont v-else :name="'icon-' + item.icon" :size="new_style.img_size / 2 + ''" color="6"></iconfont>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    const app = getApp();
    import componentDiySearch from '@/components/diy/search';
    import { isEmpty, background_computer, gradient_computer } from '@/common/js/common/common.js';
    // 状态栏高度
    var bar_height = parseInt(app.globalData.get_system_info('statusBarHeight', 0));
    // #ifdef MP-TOUTIAO
    bar_height = 0;
    // #endif
    export default {
        props: {
            value: {
                type: Object,
                default: () => ({}),
            },
        },
        components: {
            componentDiySearch,
        },
        data() {
            return {
                bar_height: bar_height,
                form: {},
                new_style: {},
                position: '',
                roll_style: '',
                text_style: '',
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            isEmpty,
            init() {
                const new_content = this.value.content || {};
                const new_style = this.value.style || {};
                let new_roll_style = '';
                const { header_background_img, header_background_img_style, header_background_color_list, header_background_direction, header_background_type } = new_style;
                console.log(header_background_img, header_background_img_style, header_background_color_list, header_background_direction, header_background_type);
                if (header_background_type === 'color_image') {
                    // 渐变
                    const gradient = { color_list: header_background_color_list, direction: header_background_direction };
                    // 背景图
                    const back = { background_img: header_background_img, background_img_style: header_background_img_style };
                    new_roll_style += gradient_computer(gradient) + background_computer(back);
                } else {
                    new_roll_style += `background: transparent;`;
                }
                this.setData({
                    form: new_content,
                    new_style: new_style,
                    position: (new_style.up_slide_display == '1' ? 'position:absolute;' : 'position:relative;') + 'top:' + bar_height + 'rpx;',
                    roll_style: new_roll_style,
                    text_style: `font-weight:${new_style.header_background_title_typeface}; font-size: ${new_style.header_background_title_size * 2}rpx; color: ${new_style.header_background_title_color};`,
                });
            },
        },
    };
</script>

<style lang="scss" scoped>
    .header-content {
        height: 120rpx;
    }
    .model-top {
        left: 50%;
        z-index: 2;
        transform: translateX(-50%);
        .roll {
            width: 780rpx;
            height: 100%;
            margin: 0 auto;
            cursor: pointer;
        }
        .img {
            width: 680rpx;
        }
    }
    .model-head {
        overflow: hidden;
        height: 120rpx;
    }
    .model-head-icon {
        position: absolute;
        right: 0;
        bottom: 0;
        height: 64rpx;
        .function-icon {
            height: 64rpx;
        }
    }
    .logo-outer-style {
        height: 64rpx;
        .logo-style {
            max-height: 64rpx;
            max-width: 100%;
            :deep(.image-slot) {
                height: 64rpx;
                width: 64rpx;
            }
        }
    }
</style>
