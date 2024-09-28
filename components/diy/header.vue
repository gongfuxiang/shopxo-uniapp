<template>
    <view v-if="(propValue || null) !== null" class="header-container" :style="roll_style + position">
        <view class="bg-white" :style="top_content_style">
            <view class="header-content flex-row align-c">
                <view class="model-top flex-1">
                    <view class="roll pr z-i">
                        <view class="model-head pr flex-row align-c" :style="header_style">
                            <view class="flex-row align-c jc-sb gap-16 wh-auto">
                                <view v-if="['1', '2', '3'].includes(form.content.theme)" class="flex-1 flex-row align-c jc-c ht-auto gap-16 padding-left-main" :style="text_style + 'justify-content:' + form.content.indicator_location || 'center'">
                                    <template v-if="['2', '3'].includes(form.content.theme)">
                                        <view class="logo-outer-style">
                                            <imageEmpty :propImageSrc="form.content.logo[0]" propImgFit="heightFix" propErrorStyle="width:40rpx;height:40rpx;"></imageEmpty>
                                        </view>
                                    </template>
                                    <view v-if="['1', '2'].includes(form.content.theme)">{{ form.content.title }}</view>
                                    <template v-if="['3', '5'].includes(form.content.theme)">
                                        <view class="flex-1">
                                            <componentDiySearch :propValue="form" :propIsPageSettings="true" :propIsClick="is_click" @search_tap="search_tap"></componentDiySearch>
                                        </view>
                                    </template>
                                </view>
                                <view v-else-if="['4', '5'].includes(form.content.theme)" class="flex-1 flex-row align-c h gap-10 padding-left-main">
                                    <view class="flex-row align-c gap-2" @tap="go_map_event">
                                        <iconfont name="icon-location" size="12" color="0"></iconfont>
                                        <text class="size-14 cr-3 text-line-1">{{ form.content.positioning_name }}</text>
                                        <iconfont v-if="form.content.is_arrows_show == '1'" name="icon-arrow-right" size="24rpx" color="#000"></iconfont>
                                    </view>
                                    <template v-if="['5'].includes(form.content.theme)">
                                        <view class="flex-1">
                                            <componentDiySearch :propValue="form" :propIsPageSettings="true" :propIsClick="is_click" @search_tap="search_tap"></componentDiySearch>
                                        </view>
                                    </template>
                                </view>
                                <view v-if="!isEmpty(form.content.icon_setting)" class="flex-row align-c" :class="['1'].includes(form.content.theme) ? 'right-0 padding-right-main' : ''" :style="{ gap: form.style.img_space * 2 + 'rpx' }">
                                    <view v-for="(item, index) in form.content.icon_setting" :key="index" :style="{ width: form.style.img_size * 2 + 'rpx', height: form.style.img_size * 2 + 'rpx' }" :data-value="item.link.page" @tap="url_event">
                                        <imageEmpty v-if="item.img.length > 0" :propImageSrc="item.img[0].url" :propErrorStyle="'width: ' + Number(form.style.img_size) * 2 + 'rpx;height:' + Number(form.style.img_size) * 2 + 'rpx;'"></imageEmpty>
                                        <iconfont v-else :name="'icon-' + item.icon" :size="form.style.img_size * 2 + 'rpx'" color="#666"></iconfont>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <hotWordList v-if="is_click" :propValue="form.content.hot_word_list" :prophotWordsColor="form.style.hot_words_color" :propIsPageSettings="true" @search_hot_close="search_hot_close"></hotWordList>
    </view>
</template>

<script>
    const app = getApp();
    import componentDiySearch from '@/components/diy/search';
    import imageEmpty from '@/components/diy/modules/image-empty';
    import hotWordList from '@/components/diy/modules/hot-word-list';
    import { isEmpty, background_computer, gradient_computer } from '@/common/js/common/common.js';
    // 状态栏高度
    var bar_height = parseInt(app.globalData.get_system_info('statusBarHeight', 0));
    // #ifdef MP-TOUTIAO
    bar_height = 0;
    // #endif
    export default {
        props: {
            propValue: {
                type: Object,
                default: () => ({}),
            },
        },
        components: {
            componentDiySearch,
            imageEmpty,
            hotWordList,
        },
        data() {
            return {
                is_click: false,
                form: {},
                new_style: {},
                position: '',
                roll_style: '',
                text_style: '',
                header_style: 'max-width:100%',
                common_app_is_header_nav_fixed: 0,
                // #ifdef MP
                top_content_style: 'padding-top:' + (bar_height + 5) + 'px;padding-bottom:12px;',
                // #endif
                // #ifdef H5 || MP-TOUTIAO
                top_content_style: 'padding-top:' + (bar_height + 7) + 'px;padding-bottom:12px;',
                // #endif
                // #ifdef APP
                top_content_style: 'padding-top:' + bar_height + 'px;padding-bottom:12px;',
                // #endif
            };
        },
        created() {
            if ((this.propValue || null) !== null) {
                this.init();
            }
        },
        methods: {
            isEmpty,
            init() {
                const new_content = this.propValue.content || {};
                const new_style = this.propValue.style || {};
                let new_roll_style = '';
                const { header_background_img, header_background_img_style, header_background_color_list, header_background_direction, header_background_type } = new_style;
                if (header_background_type === 'color_image') {
                    // 渐变
                    const gradient = { color_list: header_background_color_list, direction: header_background_direction };
                    // 背景图
                    const back = { background_img: header_background_img, background_img_style: header_background_img_style };
                    new_roll_style += gradient_computer(gradient) + background_computer(back);
                } else {
                    new_roll_style += `background: transparent;`;
                }
                // 小程序下，获取小程序胶囊的宽度
                let menuButtonInfo = 'max-width:100%';

                // #ifdef MP-WEIXIN || MP-BAIDU || MP-QQ || MP-KUAISHOU
                const custom = uni.getMenuButtonBoundingClientRect();
                menuButtonInfo = `max-width:calc(100% - ${custom.width + 10}px);`;
                // #endif
                this.setData({
                    form: this.propValue,
                    position: new_style.up_slide_display == '1' ? 'position:fixed;' : 'position:relative;',
                    roll_style: new_roll_style,
                    text_style: `font-weight:${new_style.header_background_title_typeface}; font-size: ${new_style.header_background_title_size * 2}rpx; color: ${new_style.header_background_title_color};`,
                    header_style: menuButtonInfo,
                });
            },
            go_map_event() {
                console.log('地图方法');
            },
            search_tap(value) {
                this.setData({
                    is_click: value,
                });
            },
            search_hot_close() {
                this.setData({
                    is_click: false,
                });
            },
            url_event(e) {
                app.globalData.url_event(e);
            },
        },
    };
</script>

<style lang="scss" scoped>
    .header-container {
        z-index: 102;
        width: 100%;
        .header-content {
            height: 66rpx;
        }
        .model-top {
            .roll {
                width: 100%;
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
                height: 64rpx;
                width: 64rpx;
            }
        }
    }
</style>
