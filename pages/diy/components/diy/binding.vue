<template>
    <view class="oh" :style="style_container">
        <view :style="style_img_container">
            <view class="oh flex-col" :style="'gap:' + new_style.data_content_outer_spacing * 2 + 'rpx;'">
                <view v-for="(match_item, match_index) in list" :key="match_index" :data-value="match_item.url" @tap.stop="url_event">
                    <view class="oh" :style="match_layout_style">
                        <view class="flex-col oh" :style="match_layout_img_style">
                            <view :class="['oh wh-auto ht-auto', host_graph_theme == '0' ? 'flex-row' : 'flex-col' ]" :style="host_graph_theme == '0' ? 'margin-bottom:' + new_style.data_content_bottom_spacing * 2 + 'rpx;' : ''">
                                <!-- 主图大图模式和主图单列时的显示，并且图片是有值的 -->
                                <template v-if="!isEmpty(match_item) && ((host_graph_theme == '1' && form.is_host_graph_show == '1') || host_graph_theme == '0')">
                                    <view class="oh pr" :style="data_img_style">
                                        <view v-if="!isEmpty(match_item.new_cover)" :style="data_img_style">
                                            <image-empty :propImageSrc="match_item.new_cover[0]" :propStyle="data_content_img_radius" propErrorStyle="width: 100rpx;height: 100rpx;"></image-empty>
                                        </view>
                                        <view v-else :style="data_img_style">
                                            <image-empty :propImageSrc="match_item.images" :propStyle="data_content_img_radius" propErrorStyle="width: 100rpx;height: 100rpx;"></image-empty>
                                        </view>
                                    </view>
                                </template>
                                <!-- 主图单列显示时的显示 -->
                                <view v-if="host_graph_theme == '0'" class="flex-1 flex-col jc-sb gap-6" :style="data_content_style">
                                    <view class="flex-col gap-6">
                                        <view class="text-line-1" :style="data_title_style">{{ match_item.title }}</view>
                                        <view class="flex-row align-c jc-sb">
                                            <view class="flex-col gap-6">
                                                <view class="flex-row align-c">
                                                    <view :style="data_price_symbol_style">￥</view>
                                                    <view :style="data_price_style">{{ match_item.estimate_price }}</view>
                                                </view>
                                                <view class="flex-row align-c gap-3">
                                                    <imgOrIconOrText :propValue="propValue" propType="data_discounts" />
                                                    <view class="flex-row">
                                                        <view :style="data_save_price_symbol_style">￥</view>
                                                        <view :style="data_save_price_style">{{ match_item.estimate_discount_price || 0 }}</view>
                                                    </view>
                                                </view>
                                            </view>
                                        </view>
                                    </view>
                                    <view class="flex-row align-c jc-e">
                                        <imgOrIconOrText :value="propValue" type="details" />
                                    </view>
                                </view>
                            </view>
                            <view class="flex-col" :style="host_graph_theme !== '0' ? data_content_style : ''">
                                <!-- 主图大图模式时的显示 -->
                                <view v-if="host_graph_theme !== '0'"  class="flex-col gap-6" :style="'margin-bottom:' + new_style.data_content_bottom_spacing * 2 + 'rpx;'">
                                    <view class="text-line-1" :style="data_title_style">{{ match_item.title }}</view>
                                    <view class="flex-row align-c jc-sb">
                                        <view class="flex-col gap-6">
                                            <view class="flex-row align-c">
                                                <view :style="data_price_symbol_style">￥</view>
                                                <view :style="data_price_style">{{ match_item.estimate_price }}</view>
                                            </view>
                                            <view class="flex-row align-c gap-3">
                                                <imgOrIconOrText :propValue="propValue" propType="data_discounts" />
                                                <view class="flex-row">
                                                    <view :style="data_save_price_symbol_style">￥</view>
                                                    <view :style="data_save_price_style">{{ match_item.estimate_discount_price || 0 }}</view>
                                                </view>
                                            </view>
                                        </view>
                                        <view class="flex-row align-c jc-e">
                                            <imgOrIconOrText :value="propValue" type="details" />
                                        </view>
                                    </view>
                                </view>
                                <!-- 商品信息区域 -->
                                <view :style="goods_content_style" :class="match_item.is_home_show_goods ? 'show-goods' : 'hidden-goods'">
                                    <view :style="goods_content_img_style">
                                        <view :class="outer_class" :style="outer_style">
                                            <template v-if="!['3'].includes(theme)">
                                                <view v-for="(item, index) in match_item.goods" :key="index" class="pr oh" :style="layout_style" :data-value="item.goods_url" @tap.stop="url_event">
                                                    <view :class="['oh wh-auto ht-auto', ['0' , '2'].includes(theme) ? 'flex-row' : 'flex-col' ]" :style="layout_img_style">
                                                        <template v-if="!isEmpty(item) && is_show('goods_img')">
                                                            <view class="oh pr" :style="goods_img_style">
                                                                <image-empty :propImageSrc="item.images" :propStyle="goods_content_img_radius + goods_img_style" propErrorStyle="width: 50rpx;height: 50rpx;"></image-empty>
                                                            </view>
                                                        </template>
                                                        <view v-if="is_show('title') || is_show('price') || is_show('save_price')" class="flex-1 flex-row jc-sb" :style="content_style">
                                                            <view class="flex-1 flex-col jc-sb">
                                                                <view v-if="is_show('title')" :class="theme == '0' ? 'text-line-2' : 'text-line-1'" :style="goods_title_style">
                                                                    {{ item.title }}
                                                                </view>
                                                                <view v-if="is_show('price')" class="text-line-1">
                                                                    <text :style="goods_price_symbol_style">{{ item.show_price_symbol }}</text>
                                                                    <text :style="goods_price_style">{{ item.price }}</text>
                                                                    <text v-if="is_show('price_unit')" :style="goods_price_unit_style">{{ item.show_price_unit }}</text>
                                                                </view>
                                                                <view v-if="is_show('save_price')" class="flex-row align-c gap-3">
                                                                    <imgOrIconOrText :propValue="propValue" propType="goods_discounts" />
                                                                    <view class="flex-1 text-line-1 flex-row">
                                                                        <text :style="goods_save_price_symbol_style">{{ item.show_price_symbol }}</text>
                                                                        <text :style="goods_save_price_style">{{ item.discount_price || 0 }}</text>
                                                                    </view>
                                                                </view>
                                                            </view>
                                                        </view>
                                                    </view>
                                                </view>
                                            </template>
                                            <template v-else>
                                                <swiper circular="true" :autoplay="new_style.is_roll == '1'" :interval="new_style.interval_time * 1000" :duration="500" :next-margin="new_style.rolling_fashion == 'translation' ? '-' + content_outer_spacing_magin : '0rpx'" :display-multiple-items="slides_per_group" :style="{ width: '100%', height: new_style.goods_content_outer_height * new_scale + 'px' }">
                                                    <swiper-item v-for="(item1, index1) in match_item.content_goods" :key="index1">
                                                        <view class="flex-row wh-auto ht-auto" :style="outer_style">
                                                            <view v-for="(item, index) in item1.split_list" :key="index" class="pr oh" :style="layout_style" :data-value="item.goods_url" @tap.stop="url_event">
                                                                <template v-if="!isEmpty(item)">
                                                                    <view :class="['oh wh-auto ht-auto', ['0', '2'].includes(theme) ? 'flex-row' : 'flex-col' ]" :style="layout_img_style">
                                                                        <template v-if="!isEmpty(item) && is_show('goods_img')">
                                                                            <view class="oh pr wh-auto ht-auto">
                                                                                <image-empty :propImageSrc="item.images" :propStyle="goods_content_img_radius" propErrorStyle="width: 50rpx;height: 50rpx;"></image-empty>
                                                                            </view>
                                                                        </template>
                                                                        <view v-if="is_show('title') || is_show('price') || is_show('save_price')" class="flex-1 flex-row jc-sb" :style="content_style">
                                                                            <view class="flex-1 flex-col jc-sb">
                                                                                <view v-if="is_show('title')" :class="theme == '0' ? 'text-line-2' : 'text-line-1'" :style="goods_title_style">
                                                                                    {{ item.title }}
                                                                                </view>
                                                                                <view v-if="is_show('price')" class="text-line-1">
                                                                                    <text :style="goods_price_symbol_style">{{ item.show_price_symbol }}</text>
                                                                                    <text :style="goods_price_style">{{ item.price }}</text>
                                                                                    <text v-if="is_show('price_unit')" :style="goods_price_unit_style">{{ item.show_price_unit }}</text>
                                                                                </view>
                                                                                <view v-if="is_show('save_price')" class="flex-row align-c gap-3">
                                                                                    <imgOrIconOrText :propValue="propValue" propType="goods_discounts" />
                                                                                    <view class="flex-1 text-line-1">
                                                                                        <text :style="goods_save_price_symbol_style">{{ item.show_price_symbol }}</text>
                                                                                        <text :style="goods_save_price_style">{{ item.discount_price || 0 }}</text>
                                                                                    </view>
                                                                                </view>
                                                                            </view>
                                                                        </view>
                                                                    </view>
                                                                </template>
                                                            </view>
                                                        </view>
                                                    </swiper-item>
                                                </swiper>
                                            </template>
                                        </view>
                                    </view>
                                </view>
                                 <!-- 底部展开收起按钮区域 -->
                                <view :style="bottom_button_style" :data-index="match_index" @tap.stop="item_more_goods_event">
                                    <view class="flex-row align-c jc-sb" :style="bottom_button_img_style">
                                        <view :style="button_style">{{ match_item.is_home_show_goods ? '收起' : '展开'}}{{ match_item.type_name }}商品</view>
                                        <iconfont :name="match_item.is_home_show_goods ? 'icon-arrow-top' : 'icon-arrow-bottom'" :color="new_style.bottom_button_icon_color" :size="new_style.bottom_button_icon_size + ''"></iconfont>
                                    </view>
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
    import { isEmpty, common_styles_computer, common_img_computer, gradient_handle, padding_computer, radius_computer, background_computer, border_computer, box_shadow_computer, get_swiper_list, margin_computer } from '@/common/js/common/common.js';
    import imageEmpty from '@/pages/diy/components/diy/modules/image-empty.vue';
    import subscriptIndex from '@/pages/diy/components/diy/modules/subscript/index.vue';
    import imgOrIconOrText from '@/pages/diy/components/diy/modules/img-or-icon-or-text.vue';
    var system = app.globalData.get_system_info(null, null, true);
    var sys_width = app.globalData.window_width_handle(system.windowWidth);
    export default {
        components: {
            imageEmpty,
            imgOrIconOrText,
            subscriptIndex
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
            // 组件渲染的下标
            propIndex: {
                type: Number,
                default: 0,
            },
        },
        data() {
            return {
                form: {},
                new_style: {},
                list: [],
                host_graph_theme: '',//主图风格
                theme: '', // 选择的风格
                content_outer_spacing: '', // 商品间距
                content_outer_spacing_magin: '', // 商品间距
                // 最外层不同风格下的显示
                outer_class: '',
                outer_style: '',
                // 不同主图风格下的内容
                match_layout_style: '',
                match_layout_img_style: '',
                data_content_img_radius: '',
                data_content_style: '',
                // 不同风格下的样式
                layout_style: '',
                layout_img_style: '',
                content_style: '', // 内容区域的样式
                style_container: '', // 公共样式
                style_img_container: '',
                shop_content_list: [],
                slides_per_group: 1,
                // 内容样式
                data_title_style: '',
                data_price_symbol_style: '',
                data_price_style: '',
                data_save_price_symbol_style: '',
                data_save_price_style: '',
                goods_title_style: '',
                goods_price_symbol_style: '',
                goods_price_style: '',
                goods_save_price_symbol_style: '',
                goods_save_price_style: '',
                goods_price_unit_style: '',
                button_style: '',
                // 图片大小
                goods_img_style: '',
                new_scale: 1,
                // 商品样式设置
                goods_content_style: '',
                goods_content_img_style: '',
                // 底部展开收取设置
                bottom_button_style: '',
                bottom_button_img_style: '',
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
                    // 最外层不同风格下的显示
                    const flex = ['0'].includes(new_form.theme) ? 'flex-col ' : 'flex-row ';
                    const wrap = new_form.theme == '3' ? '' : 'flex-wrap ';
                    // 默认数据
                    const data_style_list = [
                        { name: '单列展示', value: '0', width: 128, height: 128 },
                        { name: '大图展示', value: '1', width: 0, height: 221 },
                    ];
                    const scale = sys_width / 390;
                    // 主图大小的控制
                    let data_img_style = ``;
                    const data_list = data_style_list.filter(item => item.value == new_form.host_graph_theme);
                    if (['0'].includes(new_form.host_graph_theme)) {
                        data_img_style += `width: ${ this.size_handle(new_style, 'data', 'width', data_list, scale) };`
                    } else {
                        data_img_style += 'width: 100%;'
                    }
                    if (['0', '1'].includes(new_form.host_graph_theme)) {
                        data_img_style += `height: ${ this.size_handle(new_style, 'data', 'height', data_list, scale) };`
                    }
                    // 商品图片大小的控制
                    const goods_style_list = [
                        { name: '单列展示', value: '0', width: 50, height: 50 },
                        { name: '两列展示（纵向）', value: '1', width: 0, height: 156 },
                        { name: '两列展示（横向）', value: '2', width:50, height: 50 },
                        { name: '左右滑动展示', value: '3', width:0, height: 0 },
                    ]
                    const goods_list = goods_style_list.filter(item => item.value == new_form.theme);
                    let goods_img_style = '';
                    if (['0', '2'].includes(new_form.theme)) {
                        goods_img_style += `width: ${ this.size_handle(new_style, 'goods', 'width', goods_list, scale) };`;
                    }
                    if (!['3'].includes(new_form.theme)) {
                        goods_img_style += `height: ${ this.size_handle(new_style, 'goods', 'height', goods_list, scale) };`;
                    }
                    const data_handle_list = new_list.map((item) => ({
                        ...item,
                        is_home_show_goods: new_form.is_default_show_goods == '1',
                        content_goods: new_form.theme == '3' ? get_swiper_list(item.goods, new_form.carousel_col, new_style.rolling_fashion) : item.goods,
                    }))
                    this.setData({
                        form: new_form,
                        new_style: new_style,
                        outer_class: flex + wrap + 'oh',
                        outer_style: `gap: ${new_style.goods_content_outer_spacing * 2 + 'rpx'};`,
                        content_outer_spacing_magin: new_style.goods_content_outer_spacing * 2 + 'rpx',
                        list: data_handle_list,
                        new_scale: scale,
                        host_graph_theme: new_form.host_graph_theme, // 主题
                        theme: new_form.theme,
                        match_layout_style: this.get_match_layout_style(new_style),
                        match_layout_img_style: this.get_match_layout_img_style(new_form, new_style),
                        data_content_img_radius: radius_computer(new_style.data_img_radius),
                        data_content_style: this.get_data_content_style(new_form, new_style),
                        data_img_style: data_img_style,
                        data_title_style: this.trends_config('title', 'data', new_style),
                        data_price_symbol_style: this.trends_config('price_symbol', 'data', new_style),
                        data_price_style: this.trends_config('price', 'data', new_style),
                        data_save_price_symbol_style: this.trends_config('save_price_symbol', 'data', new_style),
                        data_save_price_style: this.trends_config('save_price', 'data', new_style),
                        goods_title_style: this.trends_config('title', 'goods', new_style),
                        goods_price_symbol_style: this.trends_config('price_symbol', 'goods', new_style),
                        goods_price_style: this.trends_config('price', 'goods', new_style),
                        goods_save_price_symbol_style: this.trends_config('save_price_symbol', 'goods', new_style),
                        goods_save_price_style: this.trends_config('save_price', 'goods', new_style),
                        goods_price_unit_style: this.trends_config('price_unit', 'goods', new_style),
                        goods_content_img_radius: radius_computer(new_style.goods_radius),
                        slides_per_group: new_style.rolling_fashion == 'translation' ? new_form.carousel_col : 1,
                        button_style: this.trends_config('button', 'bottom', new_style),
                        goods_img_style: goods_img_style,
                        layout_style: this.get_layout_style(new_form, new_style),
                        layout_img_style: this.get_layout_img_style(new_form, new_style),
                        content_style: this.get_content_style(new_form, new_style),
                        goods_content_style: common_styles_computer(new_style.goods_content_style),
                        goods_content_img_style: common_img_computer(new_style.goods_content_style),
                        bottom_button_style: common_styles_computer(new_style.bottom_button_style),
                        bottom_button_img_style: common_img_computer(new_style.bottom_button_style),
                        style_container: common_styles_computer(new_style.common_style), // 公共样式
                        style_img_container: common_img_computer(new_style.common_style, this.propIndex), // 图片样式
                    });
                }
            },
            get_data_content_style(new_form, new_style) {
                const spacing_value = new_style.data_content_spacing;
                let spacing = '';
                if (['0'].includes(new_form.host_graph_theme)) {
                    spacing = `margin-left: ${spacing_value}px;`;
                } else {
                    spacing = padding_computer(new_style.data_padding);
                }
                return `${spacing}`;
            },
            get_match_layout_style(new_style) {
                return this.layout_handle(new_style, 'data') + radius_computer(new_style.data_radius)
            },
            get_match_layout_img_style(new_form, new_style) {
                const padding = new_form.host_graph_theme == '0' ? padding_computer(new_style.data_padding) : '';
                return padding + this.layout_img_handle(new_style, 'data');
            },
            get_layout_style(form, new_style) {
                const { goods_radius, goods_margin } = new_style;
                const radius = radius_computer(goods_radius);
                const gradient = this.layout_handle(new_style, 'goods');
                let size_style = '';
                const goods_left_right_width_margin = goods_margin.margin_left + goods_margin.margin_right;
                if (['1', '2'].includes(form.theme)) {
                    size_style = `width: calc((100% - ${new_style.goods_content_outer_spacing * 2 + (goods_left_right_width_margin * 4) + 'rpx'}) / 2);`;;
                } else if (form.theme == '3') {
                    // 如果不是平移的时候执行
                    if (new_style.rolling_fashion != 'translation') {
                        size_style = `width: ${this.get_multicolumn_columns_width(new_style, form)};min-width: ${this.get_multicolumn_columns_width(new_style, form)};height: ${new_style.goods_content_outer_height * (sys_width / 390) + 'px'};`;
                    } else {
                        size_style = `margin-right: ${ (new_style.goods_content_outer_spacing * 2) + (goods_margin.margin_right * 2) }rpx;width: 100%;height: 100%;`;
                    }
                } else if (form.theme == '0') {
                    size_style = `width: calc(100% - ${ goods_left_right_width_margin }px);`;
                }
                return radius + gradient + size_style;
            },
            get_layout_img_style(form, new_style) {
                const padding = [ '0', '2'].includes(form.theme) ? padding_computer(new_style.goods_padding) : '';
                return padding + this.layout_img_handle(new_style, 'goods');
            },
            get_content_style(form, new_style){
                const spacing_value = new_style.goods_content_spacing;
                let spacing = '';
                if (['0', '2'].includes(form.theme)) {
                    spacing = `margin-left: ${spacing_value}px;`;
                } else {
                    spacing = padding_computer(new_style.goods_padding);
                }
                return `${spacing}`;
            },
            get_multicolumn_columns_width(new_style, form) {
                const { carousel_col } = form;
                // 计算间隔的空间。(gap * gap数量) / 模块数量
                let gap = (new_style.goods_content_outer_spacing * (carousel_col - 1)) / carousel_col;
                return `calc(${100 / carousel_col}% - ${gap * 2}rpx)`;
            },
            layout_handle(new_style, type) {
                return gradient_handle(new_style[`${ type }_color_list`], new_style[`${ type }_direction`]) + margin_computer(new_style[`${ type }_margin`]) + border_computer(new_style[`${ type }_border_box`]) + box_shadow_computer(new_style[`${ type }_border_box`]);
            },
            layout_img_handle(new_style, type){
                const data = {
                    background_img_style: new_style[`${ type }_background_img_style`],
                    background_img: new_style[`${ type }_background_img`],
                }
                return background_computer(data);
            },
            // 根据传递的参数，从对象中取值
            trends_config(key, type, new_style) {
                return this.style_config(new_style[`${ type }_${key}_typeface`], new_style[`${ type }_${key}_size`], new_style[`${ type }_${key}_color`]);
            },
            // 根据传递的值，显示不同的内容
            style_config(typeface, size, color) {
                return `font-weight:${typeface}; font-size: ${size}px;color: ${color};`;
            },
            size_handle(new_style, type, location, list, scale){
                if (typeof new_style[`${ type }_content_img_${ location }`] == 'number') {
                    return new_style[`${ type }_content_img_${ location }`] * scale + 'px';
                } else {
                    if (list.length > 0) {
                        return list[0][location] * scale + 'rpx';
                    } else {
                        return 'auto';
                    }
                }
            },
            item_more_goods_event(e) {
                var index = e.currentTarget.dataset.index;
                var temp_data = this.list;
                temp_data[index]['is_home_show_goods'] = !temp_data[index]['is_home_show_goods'];
                this.setData({ list: temp_data });
            },
            // 判断是否显示对应的内容
            is_show(index) {
                return this.form.is_goods_show.includes(index);
            },
            url_event(e) {
                app.globalData.url_event(e);
            },
        },
    };
</script>

<style scoped lang="scss">
.gap-6 {
    gap: 12rpx;
}
.gap-3 {
    gap: 6rpx;
}
.show-goods {
    height: 100%;
    transform: scale(1); /* 初始缩放比例 */
    opacity: 1;
    transition: height 0.4s linear, transform 0.6s linear, opacity 0.6s linear; /* 同时控制缩放, 透明度, 高度 */
}
.hidden-goods {
    height: 0rpx;
    transform: scale(0); /* 初始缩放比例 */
    opacity: 0;
    transition: height 0.3s linear, transform 0.6s linear, opacity 0.6s linear; /* 同时控制缩放, 透明度, 高度 */
}
</style>
