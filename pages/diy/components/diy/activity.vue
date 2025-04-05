<template>
    <view class="oh" :style="style_container">
        <view :style="style_img_container">
            <view class="oh flex-col" :style="'gap:' + new_style.activity_outer_spacing * 2+ 'px;'">
                <view v-for="(activity_item, match_index) in list" :key="match_index" :data-value="activity_item.url" @tap.stop="url_event">
                    <view class="oh" :style="style_activity_content_container">
                        <view class="oh flex-col" :style="style_activity_content_img_container + 'gap:' + new_style.shop_content_spacing * 2 + 'rpx;'">
                            <view class="oh" :style="style_activity_container">
                                <view :class="main_theme == '0' ? 'flex-row ' : 'oh flex-col '" :style="style_activity_img_container">
                                    <template v-if="!isEmpty(activity_item) && (is_show('img') || (main_theme == '2' && is_show('title')))">
                                        <view class="oh pr" :style="img_size">
                                            <template v-if="!isEmpty(activity_item.new_cover)">
                                                <image-empty :propImageSrc="activity_item.new_cover[0]" :propStyle="content_img_radius" propErrorStyle="width: 100rpx;height: 100rpx;"></image-empty>
                                            </template>
                                            <template v-else>
                                                <image-empty :propImageSrc="activity_item.cover" :propStyle="content_img_radius" propErrorStyle="width: 100rpx;height: 100rpx;"></image-empty>
                                            </template>
                                            <template v-if="main_theme == '2'">
                                                <view class="wh-auto ht-auto pa top-0 left-0 z-i" :style="(form.is_img_mask == '1' ? 'background: rgb(0 0 0 / 35%);' : '') + content_img_radius"></view>
                                                <view v-if="is_show('title')" class="main_theme-2-title z-i-deep" :style="title_style">{{ activity_item.title }}</view>
                                            </template>
                                        </view>
                                    </template>
                                    <view v-if="is_show('keywords') || is_show('desc') || (['0', '1'].includes(main_theme) && is_show('title'))" class="flex-1 flex-col gap-10" :style="content_style">
                                        <view class="flex-col" :style="'gap:' + new_style.activity_main.desc_spacing + 'rpx;'">
                                            <view v-if="['0', '1'].includes(main_theme) && is_show('title')" :style="title_style">{{ activity_item.title }}</view>
                                            <view v-if="is_show('desc')" :style="desc_style">{{ activity_item.describe }}</view>
                                        </view>
                                        <view v-if="is_show('keywords')" class="flex-row gap-10 align-c flex-wrap">
                                            <view v-for="(item, index) in activity_item.keywords_arr" :key="index" :style="keyword_style" :data-value="item" @tap.stop="serch_button_event">
                                                <view class="nowrap" :style="keyword_img_style">{{ item }}</view>
                                            </view>
                                        </view>
                                    </view>
                                </view>
                            </view>
                            <view v-if="!isEmpty(activity_item.goods_list)" class="oh" :style="shop_container">
                                <view class="oh" :style="shop_img_container">
                                    <componentGoodsList :ref="'diy_goods_list' + match_index" :propDiyIndex="propDiyIndex" :propActivityIndex="match_index" :propValue="propValue" :propNewList="activity_item.goods_list" :propIsUseAuto="false" :propIsCommonStyle="false" @goods_buy_event="goods_buy_event"></componentGoodsList>
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
    import { isEmpty, common_styles_computer, common_img_computer, padding_computer, radius_computer, background_computer, border_computer, gradient_computer, margin_computer } from '@/common/js/common/common.js';
    import imageEmpty from '@/pages/diy/components/diy/modules/image-empty.vue';
    import componentGoodsList from '@/pages/diy/components/diy/goods-list';
    var system = app.globalData.get_system_info(null, null, true);
    var sys_width = app.globalData.window_width_handle(system.windowWidth);
    export default {
        components: {
            imageEmpty,
            componentGoodsList
        },
        props: {
            propValue: {
                type: Object,
                default: () => ({}),
            },
            propKey: {
                type: [String, Number],
                default: '',
            },
            propDiyIndex: {
                type: Number,
                default: 0,
            },
            // 组件渲染的下标
            propIndex: {
                type: Number,
                default: 0,
            },
            // 是否使用公共样式
            propIsCommonStyle: {
                type: Boolean,
                default: true,
            },
        },
        data() {
            return {
                form: {},
                new_style: {},
                list: [],
                activity_index: 0,
                content_img_radius: '', // 图片圆角设置
                main_theme: '', // 选择的风格
                content_outer_spacing: '', // 商品间距
                // 不同风格下的样式
                content_style: '', // 内容区域的样式
                // 商品内容区域样式
                shop_container: '',
                shop_img_container: '',
                // 活动样式
                style_activity_container: '',
                style_activity_img_container: '',
                //活动内容样式
                style_activity_content_container: '',
                style_activity_content_img_container: '',
                style_container: '', // 公共样式
                style_img_container: '',
                keyword_style: '',
                keyword_img_style: '',
                // 内容样式
                title_style: '',
                desc_style: '',
                // 图片大小
                img_size: '',
                new_scale: 1,
            };
        },
        watch: {
            propKey(val) {
                this.init();
            },
            propValue(new_value, old_value) {
                this.init();
            },
        },
        created() {
            this.init();
        },
        methods: {
            isEmpty, margin_computer,
            init() {
                const new_form = this.propValue.content || null;
                const new_style = this.propValue.style || null;
                if (new_form != null && new_style != null) {
                    let new_list = [];
                    // 指定商品并且指定商品数组不为空
                    if (!isEmpty(new_form.data_list) && new_form.data_type == '0') {
                        new_list = new_form.data_list.map((item) => ({
                            ...item.data,
                            title: !isEmpty(item.new_title) ? item.new_title : item.data.title,
                            new_cover: item.new_cover,
                        }));
                    } else if (!isEmpty(new_form.data_auto_list) && new_form.data_type == '1') {
                        // 筛选商品并且筛选商品数组不为空
                        new_list = new_form.data_auto_list;
                    }
                    // 默认数据
                    const style_list = [
                        { name: '左图右文', value: '0', width: 143, height: 143 },
                        { name: '上图下文', value: '1', width: 0, height: 126 },
                        { name: '大图显示', value: '2', width: 0, height: 126 },
                    ];
                    const scale = sys_width / 390;
                    let img_style = ``;
                    if (['0'].includes(new_form.main_theme)) {
                        // 图片宽度
                        if (typeof new_style.activity_main.img_width == 'number') {
                            img_style += `width: ${ new_style.activity_main.img_width * scale }px;`;
                        } else {
                            const list = style_list.filter(item => item.value == new_form.main_theme);
                            if (list.length > 0) {
                                img_style += `width: ${ list[0].width * scale }px;`;
                            } else {
                                img_style += 'width: auto;';
                            }
                        }
                    } else {
                        img_style += 'width: 100%;';
                    }
                    // 图片高度
                    if (typeof new_style.activity_main.img_height == 'number') {
                        img_style += `height: ${ new_style.activity_main.img_height * scale }px;`;
                    } else {
                        const list = style_list.filter(item => item.value == new_form.main_theme);
                        if (list.length > 0) {
                            img_style += `height: ${ list[0].height * scale }px;`;
                        } else {
                            img_style += 'height: auto;';
                        }
                    }
                    this.setData({
                        form: new_form,
                        new_style: new_style,
                        list: new_list,
                        new_scale: scale,
                        activity_index: 0, // 每次更新的时候重置筛选的index
                        content_img_radius: radius_computer(new_style.activity_main.img_radius), // 图片圆角设置
                        main_theme: new_form.main_theme, // 选择的风格
                        title_style: this.trends_config('title', new_style) + 'word-break: break-all;',
                        desc_style: this.trends_config('time', new_style),
                        img_size: img_style,
                        keyword_style: this.get_keyword_style(new_style.activity_main?.keywords_style || {}),
                        keyword_img_style: this.get_keyword_img_style(new_style.activity_main?.keywords_style || {}),
                        content_style: this.get_content_style(new_style),
                        shop_container: common_styles_computer(new_style.shop_content),
                        shop_img_container: common_img_computer(new_style.shop_content),
                        style_activity_container: common_styles_computer(new_style.activity_main),
                        style_activity_img_container: common_img_computer(new_style.activity_main),
                        style_activity_content_container: common_styles_computer(new_style.activity_content),
                        style_activity_content_img_container: common_img_computer(new_style.activity_content),
                        style_container: common_styles_computer(new_style.common_style), // 公共样式
                        style_img_container: common_img_computer(new_style.common_style, this.propIndex), // 图片样式
                    });
                }
            },
            // 根据传递的参数，从对象中取值
            trends_config(key, new_style) {
                return this.style_config(new_style.activity_main[`${key}_typeface`], new_style.activity_main[`${key}_size`], new_style.activity_main[`${key}_color`]);
            },
            // 根据传递的值，显示不同的内容
            style_config(typeface, size, color) {
                return `font-weight:${typeface}; font-size: ${size}px;color: ${color};`;
            },
            // 关键字的显示
            get_keyword_style(style) {
                return `${ gradient_computer(style)}; ${ border_computer(style) } ${ radius_computer(style.font_radius)}`;
            },
            get_keyword_img_style(style){
                return `${ padding_computer(style.font_padding) } ${ background_computer(style) }font-weight:${style.font_typeface}; font-size: ${style.font_size}px;line-height: 1.5;color: ${style.font_color};`;
            },
            is_show(val) {
                return this.form.is_main_show.includes(val);
            },
            get_content_style(new_style) {
                return padding_computer(new_style.activity_main.activity_main_right_content);
            },
            goods_buy_event(index, goods = {}, params = {}, back_data = null) {
                this.setData({
                    activity_index: back_data.activity_index || 0
                })
                this.$emit('goods_buy_event', index, goods, params, back_data);
            },
            goods_cart_back_event(e) {
                if ((this.$refs[`diy_goods_list${this.activity_index}`][0] || null) != null) {
                    this.$refs[`diy_goods_list${this.activity_index}`][0].goods_cart_back_event(e);
                }
            },
            serch_button_event(e) {
                const keywords = e.currentTarget.dataset.value || '';
                if (!isEmpty(keywords)) {
                    app.globalData.url_open('/pages/goods-search/goods-search?keywords=' + keywords);
                }
            },
            url_event(e) {
                app.globalData.url_event(e);
            },
        },
    };
</script>

<style scoped lang="scss">
.gap-10 {
    gap: 20rpx;
}
.main_theme-2-title {
    position: absolute;
    top: 50%;
    left: 50%;
    // margin-left: 1.7rem;
    transform: translate(-50%, -50%);
}
</style>
