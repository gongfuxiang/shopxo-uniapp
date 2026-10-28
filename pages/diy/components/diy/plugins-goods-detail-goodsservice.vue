<template>
    <view v-if="show_bar" class="oh" :style="style_container">
        <view :style="style_img_container">
            <view class="goods-tips" :class="'theme' + theme" :style="card_style" @tap="popup_open">
                <view class="list" :style="list_style">
                    <view v-for="(item, index) in list" :key="index" class="tip-item">
                        <image-empty v-if="is_show('icon')" :propImageSrc="item.images || ''" propImgFit="aspectFit" :propStyle="img_style" propErrorStyle="width: 20rpx;height: 20rpx;"></image-empty>
                        <text v-if="is_show('text')" class="name text-line-1" :style="text_style">{{ item.name }}</text>
                    </view>
                </view>
                <iconfont v-if="theme == '0' && is_show('arrow')" class="arrow" name="icon-arrow-right" :size="arrow_size * 2 + 'rpx'" :color="arrow_color" propContainerDisplay="flex"></iconfont>
            </view>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import { isEmpty, common_styles_computer, common_img_computer, gradient_handle, background_computer, padding_computer, radius_computer } from '@/common/js/common/common.js';
    import { on_goods_detail_page } from './goods-detail-common.js';
    import { call_page } from './goods-detail-common.js';
    import imageEmpty from '@/pages/diy/components/diy/modules/image-empty.vue';
    const field_allow = ['icon', 'text', 'arrow'];
    export default {
        components: {
            imageEmpty,
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
            propIndex: {
                type: Number,
                default: 0,
            },
            propGoodsService: {
                type: Array,
                default: null,
            },
        },
        data() {
            return {
                theme: '0',
                field_show: ['icon', 'text', 'arrow'],
                list: [],
                show_bar: false,
                style_container: '',
                style_img_container: '',
                card_style: '',
                list_style: '',
                text_style: '',
                img_style: '',
                arrow_color: 'rgba(204, 204, 204, 1)',
                arrow_size: 12,
                popup_show: '0',
            };
        },
        watch: {
            propKey() {
                this.init();
            },
            propValue() {
                this.init();
            },
            propGoodsService() {
                this.init();
            },
        },
        created() {
            this.init();
        },
        methods: {
            isEmpty,
            is_show(key) {
                return this.field_show.indexOf(key) !== -1;
            },
            init() {
                const content = this.propValue.content || null;
                const style = this.propValue.style || null;
                if (content == null || style == null) {
                    return;
                }
                const theme = this.normalize_theme(content.theme);
                const field_show = this.normalize_field_show(content.field_show);
                const column = this.normalize_column(content.column, theme);
                const gap = Number(style.item_gap) || 14;
                const icon_size = Number(style.icon_size) || 14;
                const color_list = style.content_color_list || [];
                const has_bg = Array.isArray(color_list) && color_list.some((item) => item && item.color);
                const bg = has_bg ? gradient_handle(color_list, style.content_direction || '90deg') : '';
                const bg_img = background_computer({
                    background_img: style.content_background_img || [],
                    background_img_style: style.content_background_img_style || '2',
                });
                const saved = Array.isArray(content.data_auto_list) ? content.data_auto_list : [];
                const popup_show = content.popup_show == '1' ? '1' : '0';
                const show = saved.length > 0 && (field_show.indexOf('icon') !== -1 || field_show.indexOf('text') !== -1 || (theme == '0' && field_show.indexOf('arrow') !== -1));
                this.setData({
                    theme: theme,
                    field_show: field_show,
                    popup_show: popup_show,
                    list: saved,
                    show_bar: show,
                    style_container: common_styles_computer(style.common_style || {}),
                    style_img_container: common_img_computer(style.common_style || {}, this.propIndex),
                    card_style: bg + bg_img + radius_computer(style.content_radius) + 'overflow:hidden;' + padding_computer(style.content_padding),
                    list_style: theme == '1' || theme == '2' ? 'gap:' + gap * 2 + 'rpx;grid-template-columns:repeat(' + column + ', minmax(0, 1fr));' : 'gap:' + gap * 2 + 'rpx;',
                    text_style: 'color:' + (style.text_color || '#333') + ';font-size:' + (Number(style.text_size) || 12) * 2 + 'rpx;',
                    img_style: 'width:' + icon_size * 2 + 'rpx;height:' + icon_size * 2 + 'rpx;',
                    arrow_color: style.arrow_color || 'rgba(204, 204, 204, 1)',
                    arrow_size: Number(style.arrow_size) || 12,
                });
                if (on_goods_detail_page()) {
                    const page_list = Array.isArray(this.propGoodsService) ? this.propGoodsService : [];
                    const list = saved.length > 0 ? saved : page_list;
                    const show = list.length > 0 && (field_show.indexOf('icon') !== -1 || field_show.indexOf('text') !== -1 || (theme == '0' && field_show.indexOf('arrow') !== -1));
                    this.setData({
                        list: list,
                        show_bar: show,
                    });
                    return;
                }
                if (saved.length === 0) {
                    this.get_list(content, theme, field_show);
                }
            },
            normalize_theme(theme) {
                const raw = String(theme == null ? '0' : theme);
                if (raw == '3') {
                    return '2';
                }
                return ['0', '1', '2'].indexOf(raw) !== -1 ? raw : '0';
            },
            normalize_field_show(field_show) {
                if (!Array.isArray(field_show)) {
                    return field_allow.slice();
                }
                const filtered = field_show.map(String).filter((key) => field_allow.indexOf(key) !== -1);
                return field_show.length > 0 && filtered.length === 0 ? field_allow.slice() : filtered;
            },
            normalize_column(column, theme) {
                const value = Number(column);
                if ([2, 3, 4].indexOf(value) !== -1) {
                    return value;
                }
                return theme == '2' ? 2 : 3;
            },
            page_goods_id() {
                const pages = getCurrentPages();
                const cur = pages && pages.length ? pages[pages.length - 1] : null;
                if (!cur) {
                    return '';
                }
                const route = cur.route || '';
                const opt = cur.options || {};
                if (route.indexOf('goods-detail') !== -1) {
                    return opt.goods_id || opt.id || '';
                }
                return opt.goods_id || '';
            },
            get_list(content, theme, field_show) {
                const data = {};
                const goods_id = this.page_goods_id();
                if (goods_id) {
                    data.goods_id = goods_id;
                }
                uni.request({
                    url: app.globalData.get_request_url('goodsservicedata', 'diyapi', 'goodsservice'),
                    method: 'POST',
                    data: data,
                    dataType: 'json',
                    success: (res) => {
                        const body = res.data || {};
                        const new_list = body.code == 0 && Array.isArray(body.data) ? body.data : [];
                        const show = new_list.length > 0 && (field_show.indexOf('icon') !== -1 || field_show.indexOf('text') !== -1 || (theme == '0' && field_show.indexOf('arrow') !== -1));
                        this.setData({
                            list: new_list,
                            show_bar: show,
                        });
                    },
                });
            },
            popup_open() {
                if (this.popup_show == '1' && this.list.length > 0) {
                    call_page('popup_goodsservice_event');
                }
            },
        },
    };
</script>
<style lang="scss" scoped>
.goods-tips {
    width: 100%;
    box-sizing: border-box;
    min-height: 72rpx;
}
.theme0 {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 12rpx;
}
.theme0 .list {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    overflow: hidden;
}
.theme0 .tip-item {
    flex-direction: row;
    align-items: center;
    gap: 8rpx;
    flex-shrink: 0;
    white-space: nowrap;
}
.theme1 .list,
.theme2 .list {
    display: grid;
    width: 100%;
}
.theme1 .tip-item {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12rpx;
    text-align: center;
}
.theme2 .tip-item {
    flex-direction: row;
    align-items: center;
    gap: 12rpx;
}
.tip-item {
    display: flex;
    min-width: 0;
    line-height: 1.3;
}
.name {
    min-width: 0;
}
.arrow {
    margin-left: 4rpx;
    flex-shrink: 0;
}
</style>
