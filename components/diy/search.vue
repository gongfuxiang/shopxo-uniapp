<template>
    <view :class="[{'bg-white wh-auto ht-auto oh': is_click }]">
        <view :style="style_container" :class="[{'bg-white': is_click }]">
            <template v-if="!is_click">
                <view class="search wh-auto pr" :style="style">
                    <view class="box oh flex-row align-c gap-10 bg-white" :style="box_style" @tap="search_tap">
                        <template v-if="form.is_icon_show == '1'">
                            <template v-if="form.icon_img.length > 0">
                                <view class="img-box" @tap="search_icon_tap">
                                    <image :src="form.icon_img[0].url" class="img" mode="heightFix"></image>
                                </view>
                            </template>
                            <template v-else>
                                <view @tap="search_icon_tap">
                                    <iconfont :name="!isEmpty(form.icon_class) ? 'icon-' + form.icon_class : 'icon-index-search'" size="28rpx" :color="new_style.icon_color"></iconfont>
                                </view>
                            </template>
                        </template>
                        <text v-if="form.is_tips_show == '1'" :class="[propIsPageSettings ? 'text-size-xs text-line-1' : 'text-size-md text-line-1']" :style="'color:' + new_style.tips_color">{{ form.tips }}</text>
                    </view>
                    <view v-if="form.is_search_show == '1'" class="pa search-botton flex-row align-c jc-c z-i" :style="search_button" @tap.stop="url_event">
                        <template v-if="form.search_type === 'text'">
                            <view :class="['padding-vertical-xs text-size-xs', propIsPageSettings ? 'padding-horizontal' : 'padding-horizontal-lg']">{{ form.search_tips }}</view>
                        </template>
                        <template v-else-if="!isEmpty(form.search_botton_img) && form.search_botton_img.length > 0">
                            <image :src="form.search_botton_img[0].url" class="img" :style="search_button_radius" mode="heightFix"></image>
                        </template>
                        <template v-else>
                            <view :class="['padding-vertical-xs text-size-xs', propIsPageSettings ? 'padding-horizontal' : 'padding-horizontal-lg']">
                                <iconfont :name="!isEmpty(form.search_botton_icon) ? 'icon-' + form.search_botton_icon : ''" size="28rpx"></iconfont>
                            </view>
                        </template>
                    </view>
                </view>
            </template>
            <template v-else>
                <view class="search wh-auto pr">
                    <view class="box oh flex-row align-c gap-10 bg-white" :style="box_style + search_box_style">
                        <input :focus="is_click" type="text" name="title" :class="[propIsPageSettings ? 'text-size-xs text-line-1' : 'text-size-md text-line-1']" :placeholder="form.tips" @input="search_input" />
                    </view>
                    <view v-if="form.is_search_show == '1'" class="pa search-botton flex-row align-c jc-c z-i" :style="search_button" @tap.stop="url_event">
                        <template v-if="form.search_type === 'text'">
                            <view :class="['padding-vertical-xs text-size-xs', propIsPageSettings ? 'padding-horizontal' : 'padding-horizontal-lg']">{{ form.search_tips }}</view>
                        </template>
                        <template v-else-if="!isEmpty(form.search_botton_img) && form.search_botton_img.length > 0">
                            <image :src="form.search_botton_img[0].url" class="img" :style="search_button_radius" mode="heightFix"></image>
                        </template>
                        <template v-else>
                            <view :class="['padding-vertical-xs text-size-xs', propIsPageSettings ? 'padding-horizontal' : 'padding-horizontal-lg']">
                                <iconfont :name="!isEmpty(form.search_botton_icon) ? 'icon-' + form.search_botton_icon : ''" size="28rpx"></iconfont>
                            </view>
                        </template>
                    </view>
                </view>
            </template>
        </view>
        <hotWordList v-if="is_click && !propIsPageSettings" :propValue="form.hot_word_list" :prophotWordsColor="new_style.hot_words_color" @search_hot_close="search_hot_close"></hotWordList>
    </view>
</template>

<script>
    const app = getApp();
    import { background_computer, common_styles_computer, gradient_computer, radius_computer, isEmpty } from '@/common/js/common/common.js';
    import hotWordList from '@/components/diy/modules/hot-word-list';
    export default {
        components: {
            hotWordList
        },
        props: {
            propValue: {
                type: Object,
                default: () => {
                    return {};
                },
            },
            propIsPageSettings: {
                type: Boolean,
                default: false,
            },
            propIsClick: {
                type: Boolean,
                default: false,
            }
        },
        data() {
            return {
                is_click: false,
                search_content: '',
                form: {},
                new_style: {},
                style: '',
                style_container: '',
                search_button_radius: '',
                box_style: '',
                search_button: '',
            };
        },
        watch: {
            propIsClick: {
                handler(new_value) {
                    this.setData({
                        is_click: new_value
                    });
                },
                immediate: true
            }
        },
        created() {
            this.setData({
                form: this.propValue.content,
                new_style: this.propValue.style,
            });
            this.init();
        },
        methods: {
            isEmpty,
            init() {
                const { search_button_radius, common_style } = this.new_style;
                this.setData({
                    style: this.get_style(), // 内部样式
                    style_container: this.propIsPageSettings ? '' : common_styles_computer(common_style), // 全局样式
                    search_button_radius: radius_computer(search_button_radius), // 按钮圆角
                    box_style: this.get_box_style(), // 搜索框设置
                    search_box_style: `border: 1px solid ${this.new_style.search_border == '#fff' ? '#eee' : this.new_style.search_border};`,
                    search_button: this.get_search_button(), // 搜索按钮显示
                });
            },
            get_style() {
                let common_styles = '';
                if (this.new_style.text_style == 'italic') {
                    common_styles += `font-style: italic`;
                } else if (this.new_style.text_style == '500') {
                    common_styles += `font-weight: 500`;
                }
                return common_styles;
            },
            get_box_style() {
                let style = `border: 1px solid ${this.new_style.search_border}; ${radius_computer(this.new_style.search_border_radius)};box-sizing: border-box;`;
                if (this.form.is_center == '1') {
                    style += `justify-content: center;`;
                }
                return style;
            },
            search_tap() {
                if (this.propIsPageSettings) {
                    this.setData({
                        search_content: '',
                    })
                    this.$emit('search_tap', true);
                } else {
                    this.setData({
                        is_click: true,
                        search_content: '',
                    })
                }
            },
            search_hot_close() {
                this.setData({
                    is_click: false,
                    search_content: '',
                })
            },
            get_search_button() {
                const { search_botton_color_list, search_botton_direction, search_botton_background_img_style, search_botton_background_img, search_button_radius } = this.new_style;
                let style = radius_computer(search_button_radius);
                if (this.form.search_type != 'img') {
                    const data = {
                        color_list: search_botton_color_list,
                        direction: search_botton_direction,
                        background_img: search_botton_background_img,
                        background_img_style: search_botton_background_img_style,
                    };
                    style += gradient_computer(data) + background_computer(data) + `color: ${this.new_style.button_inner_color};`;
                }
                return style;
            },
            search_input(e) {
                this.setData({
                    search_content: e.detail.value
                })
            },
            search_icon_tap() {
                if (!isEmpty(this.form.icon_src)) {
                    app.globalData.url_open(this.form.icon_src.page);
                }
            },
            url_event() {
                if (!isEmpty(this.search_content)) {
                    const content = this.search_content;
                    
                    if (this.propIsPageSettings) {
                        this.setData({
                            search_content: '',
                        })
                        this.$emit('search_tap', false);
                    } else {
                        this.setData({
                            is_click: false,
                            search_content: '',
                        })
                    }
                    app.globalData.url_open('/pages/goods-search/goods-search?keywords=' + content);
                } else {
                    app.globalData.showToast('请输入搜索关键字', 'error');
                }
            }
        },
    };
</script>

<style lang="scss" scoped>
    .search {
        .box {
            height: 64rpx;
            padding: 12rpx 30rpx;
        }
        .img-box {
            height: 100%;
            .img {
                height: 36rpx;
                display: block;
            }
        }
        .search-botton {
            height: 56rpx;
            top: 4rpx;
            right: 4rpx;
            .img {
                height: 56rpx;
                min-width: 6rpx;
                max-width: 20rpx;
            }
        }
    }
</style>
