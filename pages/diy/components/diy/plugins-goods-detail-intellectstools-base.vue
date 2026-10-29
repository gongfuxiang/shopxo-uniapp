<template>
    <view v-if="show_bar" class="oh" :style="style_container">
        <view :style="style_img_container">
            <view class="notice" :class="show_title ? '' : 'is-inline'" :style="card_style">
                <image v-if="is_show('icon') && icon_img" class="mark" :src="icon_img" mode="aspectFit" :style="img_style"></image>
                <iconfont v-else-if="is_show('icon') && icon_name" class="mark" :name="'icon-' + icon_name" :size="icon_size * 2 + 'rpx'" :color="icon_color" propContainerDisplay="flex"></iconfont>
                <view class="body">
                    <text v-if="show_title" class="title" :style="title_style">{{ title }}</text>
                    <text v-if="is_show('text')" class="msg" :style="text_style">{{ msg }}</text>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
    import { common_styles_computer, common_img_computer, gradient_handle, background_computer, padding_computer, radius_computer, border_computer } from '@/common/js/common/common.js';
    import { on_goods_detail_page } from './goods-detail-common.js';
    const field_allow = ['icon', 'title', 'text'];
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
            propIntellectstools: {
                type: Object,
                default: null,
            },
        },
        data() {
            return {
                field_show: field_allow.slice(),
                title: '',
                msg: '',
                show_bar: false,
                show_title: false,
                style_container: '',
                style_img_container: '',
                card_style: '',
                text_style: '',
                title_style: '',
                icon_color: 'rgba(221, 81, 76, 1)',
                icon_size: 16,
                icon_name: 'notice',
                icon_img: '',
                img_style: '',
                line_show: '0',
                line_size: 1,
            };
        },
        watch: {
            propKey() {
                this.init();
            },
            propValue() {
                this.init();
            },
            propIntellectstools() {
                this.init();
            },
        },
        created() {
            this.init();
        },
        methods: {
            is_show(key) {
                return this.field_show.indexOf(key) !== -1;
            },
            init() {
                const content = (this.propValue || {}).content || {};
                const style = (this.propValue || {}).style || null;
                if (style == null) {
                    return;
                }
                const field_show = this.normalize_field_show(content.field_show);
                const data = this.propIntellectstools && this.propIntellectstools.base_bottom ? this.propIntellectstools.base_bottom : null;
                const msg = data && data.msg != null ? String(data.msg) : '';
                const title = data && data.title != null ? String(data.title) : '';
                const show_title = field_show.indexOf('title') !== -1 && title !== '';
                const show_text = field_show.indexOf('text') !== -1 && msg !== '';
                const icon_name = content.icon == null ? 'notice' : String(content.icon || '');
                const icon_img = Array.isArray(content.icon_img) && content.icon_img.length > 0 && content.icon_img[0].url ? content.icon_img[0].url : '';
                const icon_size = style.icon_size == null ? 16 : Number(style.icon_size);
                const line_show = style.line_is_show == null ? '0' : String(style.line_is_show);
                const line_size = style.line_size == null || !isFinite(Number(style.line_size)) ? 1 : Number(style.line_size);
                const on_page = on_goods_detail_page();
                const view = this.card_view(style);
                let title_style = 'color:' + (style.title_color || 'rgba(221, 81, 76, 1)') + ';font-size:' + (style.title_size == null ? 13 : Number(style.title_size)) * 2 + 'rpx;font-weight:' + (style.title_bold === '0' ? '400' : '700') + ';';
                if (line_show == '1' && show_title && show_text) {
                    title_style += 'border-bottom:' + line_size + 'px ' + (style.line_style || 'solid') + ' ' + (style.line_color || 'rgba(255, 226, 224, 1)') + ';padding-bottom:' + line_size + 'px;margin-bottom:' + line_size + 'px;';
                }
                this.setData({
                    field_show: field_show,
                    title: title,
                    msg: msg,
                    show_title: show_title,
                    show_bar: on_page && msg !== '' && (show_text || show_title || (field_show.indexOf('icon') !== -1 && (icon_img !== '' || icon_name !== ''))),
                    style_container: view.style_container,
                    style_img_container: view.style_img_container,
                    card_style: view.card_style,
                    text_style: 'color:' + (style.text_color || 'rgba(221, 81, 76, 1)') + ';font-size:' + (style.text_size == null ? 12 : Number(style.text_size)) * 2 + 'rpx;',
                    title_style: title_style,
                    icon_color: style.icon_color || 'rgba(221, 81, 76, 1)',
                    icon_size: icon_size,
                    icon_name: icon_name,
                    icon_img: icon_img,
                    img_style: 'width:' + icon_size * 2 + 'rpx;height:' + icon_size * 2 + 'rpx;',
                    line_show: line_show,
                    line_size: line_size,
                });
            },
            normalize_field_show(field_show) {
                if (!Array.isArray(field_show)) {
                    return field_allow.slice();
                }
                const filtered = field_show.map(String).filter((key) => field_allow.indexOf(key) !== -1);
                return field_show.length > 0 && filtered.length === 0 ? field_allow.slice() : filtered;
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
                const size = style.card_border_size;
                const border_size = size && typeof size === 'object' ? size : { padding: 1, padding_top: 1, padding_right: 1, padding_bottom: 1, padding_left: 1 };
                const show = style.card_border_is_show == null ? (style.card_border_show == null ? '0' : String(style.card_border_show)) : String(style.card_border_is_show);
                const border = border_computer({
                    border_is_show: show,
                    border_color: style.card_border_color || '',
                    border_style: style.card_border_style || 'solid',
                    border_size: border_size,
                });
                return {
                    style_container: common_styles_computer(common),
                    style_img_container: common_img_computer(common),
                    card_style: bg + bg_img + radius_computer(style.content_radius) + 'overflow:hidden;' + border + padding_computer(style.content_padding),
                };
            },
        },
    };
</script>
<style lang="scss" scoped>
.notice {
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    min-height: 72rpx;
}
.notice.is-inline {
    align-items: center;
}
.mark {
    margin-right: 12rpx;
    margin-top: 2rpx;
    flex-shrink: 0;
    display: block;
}
.body {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
}
.title {
    line-height: 1.4;
    margin-bottom: 4rpx;
}
.msg {
    line-height: 1.5;
    white-space: pre-wrap;
}
</style>
