<template>
    <view :style="style_container">
        <view :style="style_img_container">
            <view class="search wh-auto pr" :style="style">
                <view class="box oh flex-row align-c gap-10" :style="box_style" @tap="search_tap">
                    <view v-if="form.is_icon_show == '1'" class="search-icon" @tap.stop="search_icon_tap">
                        <template v-if="form.icon_img.length > 0">
                            <view class="img-box">
                                <image :src="form.icon_img[0].url" class="img" mode="heightFix"></image>
                            </view>
                        </template>
                        <template v-else>
                            <view>
                                <iconfont :name="!isEmpty(form.icon_class) ? 'icon-' + form.icon_class : 'icon-search-max'" size="28rpx" :color="new_style.icon_color" propContainerDisplay="flex"></iconfont>
                            </view>
                        </template>
                    </view>
                    <template v-if="!isEmpty(form.hot_word_list) && form.is_hot_word_show == '1'">
                        <swiper circular="true" :autoplay="new_style.is_roll == '1'" :interval="new_style.interval_time * 1000" :vertical="true" :duration="500" class="swiper_style" @change="slideChange">
                            <swiper-item v-for="(item, index) in form.hot_word_list" :key="index">
                                <view class="flex-row align-c wh-auto ht-auto" :style="{ color: !isEmpty(item.color) ? item.color : !isEmpty(new_style.hot_words_color) ? new_style.hot_words_color : '#999' }" :data-value="item.value" @tap.stop="serch_event">
                                    {{ item.value }}
                                </view>
                            </swiper-item>
                        </swiper>
                    </template>
                    <template v-else>
                        <text v-if="form.is_tips_show == '1'" :class="[propIsPageSettings ? 'text-size-xs text-line-1' : 'text-size-md text-line-1']" :style="'color:' + new_style.tips_color">{{ form.tips }}</text>
                    </template>
                </view>
                <view v-if="form.is_search_show == '1'" class="pa search-outer-botton flex-row align-c jc-c">
                    <view class="search-botton flex-row align-c jc-c z-i" :style="search_button" @tap.stop="serch_button_event">
                        <template v-if="form.search_type === 'text'">
                            <view :class="['padding-vertical-xs text-size-xs', propIsPageSettings ? 'padding-horizontal' : 'padding-horizontal-lg']">{{ form.search_tips }}</view>
                        </template>
                        <template v-else-if="!isEmpty(form.search_botton_img) && form.search_botton_img.length > 0">
                            <image :src="form.search_botton_img[0].url" class="img" :style="search_button_radius" mode="heightFix"></image>
                        </template>
                        <template v-else>
                            <view :class="['padding-vertical-xs text-size-xs', propIsPageSettings ? 'padding-horizontal' : 'padding-horizontal-lg']">
                                <iconfont :name="!isEmpty(form.search_botton_icon) ? 'icon-' + form.search_botton_icon : ''" size="28rpx" propContainerDisplay="flex"></iconfont>
                            </view>
                        </template>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
const app = getApp();
import { background_computer, common_styles_computer, common_img_computer, gradient_computer, radius_computer, isEmpty } from '@/common/js/common/common.js';
export default {
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
        propKey: {
            type: [String,Number],
            default: '',
        },
        // 组件渲染的下标
        propIndex: {
            type: Number,
            default: 1000000,
        },
    },
    data() {
        return {
            search_content: '',
            form: {},
            new_style: {},
            style: '',
            style_container: '',
            style_img_container: '',
            search_button_radius: '',
            box_style: '',
            search_button: '',
            keywords: '',
        };
    },
    watch: {
        propKey(val) {
            // 初始化
            this.init();
        },
    },
    created() {
        this.init();
    },
    methods: {
        isEmpty,
        init() {
            const new_form = this.propValue.content;
            const new_style = this.propValue.style;
            const { search_button_radius, common_style } = new_style;
            this.setData({
                form: new_form,
                new_style: new_style,
                style: this.get_style(new_style), // 内部样式
                style_container: this.propIsPageSettings ? '' : common_styles_computer(common_style), // 全局样式
                style_img_container: this.propIsPageSettings ? '' : common_img_computer(common_style, this.propIndex),
                search_button_radius: radius_computer(search_button_radius), // 按钮圆角
                box_style: this.get_box_style(new_style, new_form), // 搜索框设置
                search_box_style: `border: 1px solid ${new_style.search_border == '#fff' ? '#eee' : new_style.search_border};`,
                search_button: this.get_search_button(new_style), // 搜索按钮显示
            });
        },
        get_style(new_style) {
            let common_styles = '';
            if (new_style.text_style == 'italic') {
                common_styles += `font-style: italic`;
            } else if (new_style.text_style == '500') {
                common_styles += `font-weight: 500`;
            }
            return common_styles;
        },
        get_box_style(new_style, form) {
            let style = `background: ${ new_style?.search_bg_color || '' };border: 1px solid ${new_style.search_border}; ${radius_computer(new_style.search_border_radius)};box-sizing: border-box;`;
            if (form.is_center == '1') {
                style += `justify-content: center;`;
            }
            return style;
        },
        search_tap() {
            app.globalData.url_open('/pages/goods-search-start/goods-search-start?keywords=' + this.keywords);
        },
        serch_event() {
            app.globalData.url_open('/pages/goods-search-start/goods-search-start?keywords=' + this.keywords);
        },
        serch_button_event() {
            if (!isEmpty(this.keywords)) {
                app.globalData.url_open('pages/goods-search/goods-search?keywords=' + this.keywords);
            }
            app.globalData.url_open('/pages/goods-search-start/goods-search-start?keywords=' + this.keywords);
        },
        get_search_button(new_style) {
            const { search_botton_color_list, search_botton_direction, search_botton_background_img_style, search_botton_background_img, search_button_radius } = new_style;
            let style = radius_computer(search_button_radius);
            if (this.form.search_type != 'img') {
                const data = {
                    color_list: search_botton_color_list,
                    direction: search_botton_direction,
                    background_img: search_botton_background_img,
                    background_img_style: search_botton_background_img_style,
                };
                style += gradient_computer(data) + background_computer(data) + `color: ${new_style.button_inner_color};`;
            }
            return style;
        },
        search_icon_tap() {
            if (isEmpty(this.form.icon_link)) {
                this.search_tap();
                return;
            }
            app.globalData.url_open(this.form.icon_link.page);
        },
        slideChange(e) {
            let actived_index = e.target.current;
            this.setData({
                keywords: this.form.hot_word_list[actived_index].value,
            })
        },
    },
};
</script>

<style lang="scss" scoped>
.search {
    .box {
        height: 64rpx;
        padding: 12rpx 30rpx;
    }
    .swiper_style {
        height: 64rpx;
        width: 100%;
    }

    .img-box {
        height: 100%;

        .img {
            height: 36rpx;
            display: block;
        }
    }
    .search-outer-botton {
        height: 64rpx;
        top: 0;
        right: 4rpx;
        .search-botton {
            height: 56rpx;
            .img {
                height: 56rpx;
                min-width: 6rpx;
                max-width: 20rpx;
            }
        }
    }
    .search-icon {
        position: relative;
    }

    .search-icon::before {
        content: '';
        position: absolute;
        top: -10px;
        right: -10px;
        bottom: -10px;
        left: -16px
    }
}
</style>
