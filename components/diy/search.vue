<template>
    <view :style="style_container">
        <view :style="style_img_container">
            <view class="search wh-auto pr">
                <view class="box oh flex-row align-c" :style="box_style">
                    <view v-if="form.positioning_name_float == '1' && propSearchType == 'header'" :style="propLocationMargin">
                        <component-choice-location propType="search" :propLocationContainerStyle="propLocationContainerStyle" :propLocationImgContainerStyle="propLocationImgContainerStyle" :propBaseColor="propBaseColor" :propTextDefaultName="form.positioning_name" :propIsLeftIconArrow="form.is_location_left_icon_show == '1'" :propLeftImgValue="form.location_left_img" :propLeftIconValue="'icon-' + form.location_left_icon" :propIconLocationSize="propIconLocationSize" :propIconArrowSize="propIconArrowSize" :propIsRightIconArrow="form.is_location_right_icon_show == '1'" :propRightImgValue="form.location_right_img" :propRightIconValue="'icon-' + form.location_right_icon" :propTextMaxWidth="['4'].includes(form.theme) ? '300rpx' : '200rpx'" propContainerDisplay="flex" @onBack.stop="choice_location_back"></component-choice-location>
                    </view>
                    <view :class="'oh flex-1 ht-auto flex-row align-c gap-10' + (form.is_center == '1' ? ' tips-float' : '')" @tap.stop="search_tap">
                        <view v-if="form.is_icon_show == '1'" class="pr">
                            <view class="search-icon-before" :style="(form.positioning_name_float == '1' && propSearchType == 'header') || form.is_center == '1' ? '' : 'left: -' + (new_style.search_padding_left ? new_style.search_padding_left * 2 : 30) + 'rpx;'" @tap.stop="search_icon_tap"></view>
                            <view class="wh-auto ht-auto">
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
                        </view>
                        <view v-if="!isEmpty(form.hot_word_list) && form.is_hot_word_show == '1'" :style="form.is_center == '1' ? `min-width:100px;` : 'width:100%;'">
                            <swiper circular="true" :autoplay="new_style.is_roll == '1'" :interval="new_style.interval_time * 1000" :vertical="true" :duration="500" class="swiper_style" @change="slideChange">
                                <swiper-item v-for="(item, index) in form.hot_word_list" :key="index">
                                    <view class="flex-row align-c wh-auto ht-auto" :style="{ color: !isEmpty(item.color) ? item.color : !isEmpty(new_style.hot_words_color) ? new_style.hot_words_color : '#999' }" :data-value="item.value" @tap.stop="serch_event">
                                        {{ item.value }}
                                    </view>
                                </swiper-item>
                            </swiper>
                        </view>
                        <template v-else>
                            <text v-if="form.is_tips_show == '1'" :class="[propIsPageSettings ? 'text-size-xs text-line-1' : 'text-size-md text-line-1']" :style="'color:' + new_style.tips_color">{{ form.tips }}</text>
                        </template>
                    </view>
                </view>
                <view class="flex-row align-c pa search-outer-botton oh" :style="right_icon_style">
                    <view v-if="form.is_right_icon_show == '1' && (form.right_icon_img.length > 0 || !isEmpty(form.right_icon_class))" class="pr margin-right-main">
                        <view class="search-icon-before" @tap.stop="search_right_icon_tap"></view>
                        <view class="wh-auto ht-auto">
                            <template v-if="form.right_icon_img.length > 0">
                                <view class="img-box right_icon_height flex-row align-c">
                                    <image :src="form.right_icon_img[0].url" class="img" mode="heightFix"></image>
                                </view>
                            </template>
                            <template v-else>
                                <view class="right_icon_height flex-row align-c">
                                    <iconfont :name="!isEmpty(form.right_icon_class) ? 'icon-' + form.right_icon_class : 'icon-search-max'" size="28rpx" :color="new_style.right_icon_color" propContainerDisplay="flex"></iconfont>
                                </view>
                            </template>
                        </view>
                    </view>
                    <view v-if="form.is_search_show == '1'" class="flex-row align-c jc-c">
                        <view class="search-botton flex-row align-c jc-c z-i" :style="search_button_style" @tap.stop="serch_button_event">
                            <view class="oh" :style="search_button_img_style">
                                <template v-if="form.search_type === 'text'">
                                    <view class="text-size-xs">{{ form.search_tips }}</view>
                                </template>
                                <template v-else-if="!isEmpty(form.search_botton_img) && form.search_botton_img.length > 0">
                                    <image :src="form.search_botton_img[0].url" class="img" :style="search_button_height" mode="heightFix"></image>
                                </template>
                                <template v-else>
                                    <view class="text-size-xs">
                                        <iconfont :name="!isEmpty(form.search_botton_icon) ? 'icon-' + form.search_botton_icon : ''" size="28rpx" propContainerDisplay="flex"></iconfont>
                                    </view>
                                </template>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import componentChoiceLocation from '@/components/choice-location/choice-location';
const app = getApp();
import { background_computer, common_styles_computer, common_img_computer, gradient_computer, radius_computer, isEmpty, padding_computer, old_padding, old_radius, margin_computer } from '@/common/js/common/common.js';
export default {
    components: {
        componentChoiceLocation,
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
        propKey: {
            type: [String,Number],
            default: '',
        },
        // 组件渲染的下标
        propIndex: {
            type: Number,
            default: 1000000,
        },
        propSearchType: {
            type: String,
            default: 'search',
        },
        propBaseColor: {
            type: String,
            default: '',
        },
        propLocationMargin: {
            type: String,
            default: '',
        },
        propLocationContainerStyle: {
            type: String,
            default: '',
        },
        propLocationImgContainerStyle: {
            type: String,
            default: '',
        },
        propIconLocationSize: {
            type: String,
            default: '',
        },
        propIconArrowSize: {
            type: String,
            default: '',
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
            keywords: '',
            right_icon_style: '',
            search_button_style: '',
            search_button_img_style: '',
            search_button_height: '',
            button_padding: { padding: 0, padding_bottom: 3, padding_left: 12, padding_right: 12, padding_top: 3 },
            button_margin: { margin: 0, margin_bottom: 2, margin_left: 0, margin_right: 2, margin_top: 2 },
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
                search_button_img_style: this.get_search_button_img_style(new_style),
                search_button_height: this.get_search_button_height(new_style),
                // style: this.get_style(new_style), // 内部样式
                style_container: this.propIsPageSettings ? '' : common_styles_computer(common_style), // 全局样式
                style_img_container: this.propIsPageSettings ? '' : common_img_computer(common_style, this.propIndex),
                search_button_radius: radius_computer(search_button_radius), // 按钮圆角
                box_style: this.get_box_style(new_style, new_form), // 搜索框设置
                search_box_style: `border: 2rpx solid ${new_style.search_border == '#fff' ? '#eee' : new_style.search_border};`,
                search_button_style: this.get_search_button_style(new_form, new_style), // 搜索按钮显示
                keywords: new_form.hot_word_list.length > 0 ? (new_form.hot_word_list[0].value || '') : '',
                right_icon_style: `border-radius: 0px ${ new_style.search_border_radius?.radius_top_right * 2 || 0 }rpx ${ new_style.search_border_radius?.radius_bottom_right * 2 || 0 }rpx 0px;`,
            });
        },
        get_search_button_style(form, new_style) {
            const { search_botton_color_list = [], search_botton_direction, search_botton_background_img_style, search_button_radius = old_radius, search_botton_background_img, search_botton_margin = this.button_margin, search_botton_border_show = '0', search_botton_border_size = old_padding, search_botton_border_style = 'solid', search_botton_border_color = '' } = new_style;
            let style = radius_computer(search_button_radius);
            if (form.search_type != 'img') {
                const data = {
                    color_list: search_botton_color_list,
                    direction: search_botton_direction,
                    background_img: search_botton_background_img,
                    background_img_style: search_botton_background_img_style,
                }
                style += gradient_computer(data) + margin_computer(search_botton_margin) + `color: ${ new_style.button_inner_color };`;
            }
            let border = ``;
            if (search_botton_border_show == '1') {
                border += `border-width: ${search_botton_border_size.padding_top * 2}rpx ${search_botton_border_size.padding_right * 2}rpx ${search_botton_border_size.padding_bottom * 2}rpx ${search_botton_border_size.padding_left * 2}rpx;border-style: ${ search_botton_border_style };border-color: ${search_botton_border_color};`
            }
            const height = 32 - search_botton_margin.margin_top - search_botton_margin.margin_bottom - search_botton_border_size.padding_top - search_botton_border_size.padding_bottom;
            return style + border + `height: ${height > 0 ? height * 2 : 0}rpx;line-height: ${height > 0 ? height * 2 : 0}rpx;`;
        },
        get_search_button_height(new_style) {
            const { search_botton_border_size = old_padding, search_botton_padding = this.button_padding } = new_style;
            const height = 32 - search_botton_border_size.padding_top - search_botton_border_size.padding_bottom - search_botton_padding.padding_top - search_botton_padding.padding_bottom;
            return `height: ${height > 0 ? height * 2 : 0}rpx !important;line-height: ${height > 0 ? height * 2 : 0}rpx;`;
        },
        // 搜索按钮圆角
        get_search_button_img_style(new_style) {
            const { search_botton_background_img_style, search_botton_background_img } = new_style;
            const data = {
                background_img: search_botton_background_img,
                background_img_style: search_botton_background_img_style,
            }
            return background_computer(data) + padding_computer(new_style?.search_botton_padding || this.button_padding) + 'box-sizing: border-box;';
        },
        get_box_style(new_style, form) {
            let style = `background: ${ new_style?.search_bg_color || '' };border: 2rpx solid ${new_style.search_border}; ${radius_computer(new_style.search_border_radius)};box-sizing: border-box;`;
            if (form.positioning_name_float == '1' && this.propSearchType == 'header') {
                style += `padding-left: ${ (new_style.search_padding_left? new_style.search_padding_left : 15) * 2 }rpx;`;
            } else if (form.is_center != '1') {
                style += `padding-left: ${ (new_style.search_padding_left ? new_style.search_padding_left : 15) * 2 }rpx;`;
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
                app.globalData.url_open('/pages/goods-search/goods-search?keywords=' + this.keywords);
                return;
            }
            app.globalData.url_open('/pages/goods-search-start/goods-search-start?keywords=' + this.keywords);
        },
        search_icon_tap() {
            if (isEmpty(this.form.icon_link)) {
                this.search_tap();
                return;
            }
            app.globalData.url_open(this.form.icon_link.page);
        },
        search_right_icon_tap() {
            if (isEmpty(this.form.right_icon_link)) {
                this.search_tap();
                return;
            }
            app.globalData.url_open(this.form.right_icon_link.page);
        },
        slideChange(e) {
            let actived_index = e.detail.current;
            this.setData({
                keywords: this.form.hot_word_list[actived_index].value,
            })
        },
        // 位置回调
        onBack(e) {
            this.$emit('onBack', e);
        },
    },
};
</script>

<style lang="scss" scoped>
.search {
    .box {
        height: 64rpx;
        // padding: 12rpx 30rpx;
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
        right: 0;
        .search-botton {
            height: 64rpx;
            .img {
                height: 64rpx;
                min-width: 6rpx;
                max-width: 20rpx;
            }
        }
    }
    .right_icon_height {
        position: relative;
        height: 56rpx !important;
    }
    .search-icon {
        position: relative;
    }
    .search-icon-before {
        position: absolute;
        z-index: 10; // 确保悬浮在内容上层
        top: -20rpx;
        right: -20rpx;
        bottom: -20rpx;
        left: -20rpx
    }
    .tips-float {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }
}
</style>
