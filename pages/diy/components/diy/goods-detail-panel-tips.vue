<template>
    <view v-if="show_bar || form_list.length > 0" class="oh" :style="style_container">
        <view :style="style_img_container">
            <view class="panel" :style="card_style">
                <view v-for="(item, index) in list" :key="index" class="item" :style="item_style(index)">
                    <text class="text" :style="text_style">{{ item }}</text>
                </view>
                <!-- 订单商品表单插件：放在面板内容之后、作为面板的一部分展示（纯数据渲染，点击唤起页面级弹窗填写） -->
                <view v-if="form_list.length > 0" class="form-box" :style="show_bar ? 'margin-top:16rpx;' : ''" @tap.stop="form_click_event">
                    <view v-for="(item, index) in form_list" :key="index" class="form-row" :style="index > 0 ? 'border-top:1px solid rgb(247, 247, 247);' : ''">
                        <view class="form-title">
                            <text>{{ item.title }}</text>
                            <text v-if="item.is_required" class="required">*</text>
                        </view>
                        <view class="form-value-wrap">
                            <text :class="item.has_value ? 'form-value' : 'form-placeholder'">{{ item.has_value ? item.value_text : '请填写' }}</text>
                            <text class="form-arrow">›</text>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
    import { common_styles_computer, common_img_computer, gradient_handle, background_computer, padding_computer, radius_computer, border_computer } from '@/common/js/common/common.js';
    import { on_goods_detail_page, call_page } from './goods-detail-common.js';
    export default {
        props: {
            propValue: {
                type: Object,
                default: () => ({}),
            },
            propKey: {
                type: [String, Number],
                default: '',
            },
            propIndex: {
                type: Number,
                default: 0,
            },
            propGoods: {
                type: Object,
                default: null,
            },
            propGoodsForm: {
                type: Object,
                default: null,
            },
        },
        data() {
            return {
                list: [],
                show_bar: false,
                style_container: '',
                style_img_container: '',
                card_style: '',
                text_style: '',
                line_color: 'rgba(240, 240, 240, 1)',
                line_style: 'dashed',
                line_size: 1,
                line_show: '1',
                item_space: 8,
                // 表单已填值缓存（form_name -> value），弹窗填写后通过 onDataEvent 事件同步展示
                value_map: {},
            };
        },
        computed: {
            // 表单字段静态展示列表：标题、必填、当前值（配置默认值/草稿值优先，弹窗修改后实时覆盖）
            form_list() {
                const diy = (((this.propGoodsForm || {}).config || {}).diy_data) || [];
                const list = [];
                diy.forEach((item) => {
                    const com = (item || {}).com_data || {};
                    if (!com.title) {
                        return;
                    }
                    let value = this.value_map[item.form_name];
                    if (value === undefined) {
                        value = com.form_value;
                    }
                    const text = this.form_value_text(value);
                    list.push({
                        form_name: item.form_name || '',
                        title: com.title,
                        is_required: com.is_required == '1',
                        value_text: text,
                        has_value: text !== '',
                    });
                });
                return list;
            },
        },
        watch: {
            propKey() {
                this.init();
            },
            propValue() {
                this.init();
            },
            propGoods() {
                this.init();
            },
            propGoodsForm() {
                this.value_map_init();
            },
        },
        created() {
            this.init();
            this.value_map_init();
            uni.$on('onDataEvent', this.form_data_sync_event);
        },
        beforeDestroy() {
            uni.$off('onDataEvent', this.form_data_sync_event);
        },
        methods: {
            // 表单默认值/草稿值初始化
            value_map_init() {
                const diy = (((this.propGoodsForm || {}).config || {}).diy_data) || [];
                const map = {};
                diy.forEach((item) => {
                    const com = (item || {}).com_data || {};
                    if (item.form_name && com.form_value !== undefined) {
                        map[item.form_name] = com.form_value;
                    }
                });
                this.value_map = map;
            },
            // 值转展示文本：数组取名称拼接，对象取名称，取不到统一显示已填写
            form_value_text(value) {
                if (value == null || value === '') {
                    return '';
                }
                if (Array.isArray(value)) {
                    const list = value.map((item) => {
                        if (item == null) {
                            return '';
                        }
                        if (typeof item === 'string' || typeof item === 'number') {
                            return String(item);
                        }
                        return item.title || item.name || '';
                    }).filter((item) => item !== '');
                    return list.length > 0 ? list.join('、') : (value.length > 0 ? '已填写' : '');
                }
                if (typeof value === 'object') {
                    return value.title || value.name || (value.id != null ? '已填写' : '');
                }
                return String(value);
            },
            // 弹窗内填写后同步展示值
            form_data_sync_event(e) {
                if ((this.propGoodsForm || null) == null || e.forminput_id != this.propGoodsForm.id) {
                    return;
                }
                const data = e.submit_data || {};
                const upd = {};
                Object.keys(data).forEach((key) => {
                    if (key.indexOf('_other_value') === -1 && key.indexOf('_custom_option_list') === -1) {
                        upd[key] = data[key];
                    }
                });
                this.value_map = Object.assign({}, this.value_map, upd);
            },
            // 点击打开页面级表单填写弹窗
            form_click_event(e) {
                if (!on_goods_detail_page()) {
                    return;
                }
                call_page('diy_goods_form_input_event', e);
            },
            init() {
                const style = (this.propValue || {}).style || null;
                if (style == null) {
                    return;
                }
                const view = this.card_view(style);
                const raw = this.propGoods && this.propGoods.plugins_view_panel_data;
                const list = on_goods_detail_page() && Array.isArray(raw) ? raw.map((item) => (item == null ? '' : String(item))).filter((item) => item !== '') : [];
                this.setData({
                    list: list,
                    show_bar: list.length > 0,
                    style_container: view.style_container,
                    style_img_container: view.style_img_container,
                    card_style: view.card_style,
                    text_style: 'color:' + (style.text_color || 'rgba(153, 153, 153, 1)') + ';font-size:' + (style.text_size == null ? 12 : Number(style.text_size)) * 2 + 'rpx;',
                    line_color: style.line_color || 'rgba(240, 240, 240, 1)',
                    line_style: style.line_style || 'dashed',
                    line_size: style.line_size == null || !isFinite(Number(style.line_size)) ? 1 : Number(style.line_size),
                    line_show: style.line_is_show == null ? '1' : String(style.line_is_show),
                    item_space: style.item_space == null || !isFinite(Number(style.item_space)) ? 8 : Number(style.item_space),
                });
            },
            item_style(index) {
                const pad = 'padding:' + this.item_space * 2 + 'rpx 0;';
                if (index <= 0 || this.line_show != '1') {
                    return pad;
                }
                return pad + 'border-top:' + this.line_size + 'px ' + (this.line_style || 'dashed') + ' ' + this.line_color + ';';
            },
            card_view(style) {
                const common = Object.assign({}, style.common_style || {});
                if (!Array.isArray(common.background_img)) {
                    common.background_img = [];
                }
                const color_list = style.content_color_list || [];
                const has_bg = Array.isArray(color_list) && color_list.some((item) => item && item.color);
                const bg = has_bg ? gradient_handle(color_list, style.content_direction || '90deg') : '';
                const bg_img = background_computer({
                    background_img: style.content_background_img || [],
                    background_img_style: style.content_background_img_style || '2',
                });
                return {
                    style_container: common_styles_computer(common),
                    style_img_container: common_img_computer(common),
                    card_style: bg + bg_img + radius_computer(style.content_radius) + 'overflow:hidden;' + this.border_style(style, '0') + padding_computer(style.content_padding),
                };
            },
            border_style(style, fallback) {
                const size = style.card_border_size;
                const border_size = size && typeof size === 'object' ? size : { padding: 1, padding_top: 1, padding_right: 1, padding_bottom: 1, padding_left: 1 };
                const show = style.card_border_is_show == null ? (style.card_border_show == null ? fallback : String(style.card_border_show)) : String(style.card_border_is_show);
                return border_computer({
                    border_is_show: show,
                    border_color: style.card_border_color || '',
                    border_style: style.card_border_style || 'solid',
                    border_size: border_size,
                });
            },
        },
    };
</script>
<style lang="scss" scoped>
.panel {
    width: 100%;
    box-sizing: border-box;
}
.item {
    line-height: 1.5;
}
.text {
    display: block;
}
.form-box {
    width: 100%;
    box-sizing: border-box;
}
.form-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx 0;
}
.form-title {
    font-size: 28rpx;
    color: #333;
}
.required {
    color: #f00;
    margin-left: 4rpx;
}
.form-value-wrap {
    display: flex;
    align-items: center;
    max-width: 60%;
}
.form-value {
    font-size: 28rpx;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.form-placeholder {
    font-size: 28rpx;
    color: #bbb;
}
.form-arrow {
    margin-left: 12rpx;
    color: #ccc;
    font-size: 30rpx;
}
</style>
