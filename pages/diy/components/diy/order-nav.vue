<template>
    <view :style="style_container">
        <view :style="style_img_container">
            <view class="order-nav" :style="card_style">
                <view class="order-nav-inner flex-row align-c">
                    <view class="status-list flex-1 flex-row jc-sa align-c">
                        <block v-for="(item, index) in status_list" :key="index">
                            <view class="status-item flex-col align-c" :data-value="item_url(item)" @tap="url_event">
                                <view class="icon-box flex-row align-c jc-c" :style="icon_box_style">
                                    <image-empty v-if="item.img && item.img.length > 0" :propImageSrc="item.img[0]" :propStyle="icon_img_style" :propErrorStyle="icon_img_style"></image-empty>
                                    <iconfont v-else-if="item.icon" :name="'icon-' + item.icon" :size="icon_size * 2 + 'rpx'" :color="icon_color" propContainerDisplay="flex"></iconfont>
                                    <image-empty v-else :propStyle="icon_img_style" :propErrorStyle="icon_img_style"></image-empty>
                                    <view v-if="badge_text(item)" class="badge" :style="badge_style">{{ badge_text(item) }}</view>
                                </view>
                                <view v-if="item.title" class="text-line-1 tc" :style="item_style">{{ item.title }}</view>
                            </view>
                        </block>
                    </view>
                    <view v-if="view_all_show == '1' && divider_width > 0" class="divider-v-wrap">
                        <view class="divider-v" :style="divider_style"></view>
                    </view>
                    <view v-if="view_all_show == '1'" class="view-all flex-col align-c" :data-value="item_url(view_all)" @tap="url_event">
                        <view class="icon-box flex-row align-c jc-c" :style="icon_box_style">
                            <image-empty v-if="view_all.img && view_all.img.length > 0" :propImageSrc="view_all.img[0]" :propStyle="icon_img_style" :propErrorStyle="icon_img_style"></image-empty>
                            <iconfont v-else-if="view_all.icon" :name="'icon-' + view_all.icon" :size="icon_size * 2 + 'rpx'" :color="icon_color" propContainerDisplay="flex"></iconfont>
                            <image-empty v-else :propStyle="icon_img_style" :propErrorStyle="icon_img_style"></image-empty>
                        </view>
                        <view v-if="view_all.title" class="text-line-1 tc" :style="item_style">{{ view_all.title }}</view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import { common_styles_computer, common_img_computer, gradient_handle, padding_computer, margin_computer } from '@/common/js/common/common.js';
    import imageEmpty from '@/pages/diy/components/diy/modules/image-empty.vue';
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
        },
        data() {
            return {
                status_list: [],
                view_all: { title: '', img: [], icon: '' },
                view_all_show: '1',
                icon_size: 28,
                icon_color: 'rgba(51, 51, 51, 1)',
                style_container: '',
                style_img_container: '',
                card_style: '',
                item_style: '',
                icon_box_style: '',
                icon_img_style: '',
                badge_style: '',
                divider_style: '',
                divider_width: 1,
            };
        },
        watch: {
            propKey() {
                this.init();
            },
            propValue() {
                this.init();
            },
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                const content = this.propValue.content || {};
                const style = this.propValue.style || {};
                const icon_size = Number(style.icon_size) || 28;
                const color_list = style.content_color_list || [{ color: 'rgba(255, 255, 255, 1)' }];
                const has_bg = Array.isArray(color_list) && color_list.some((item) => item && item.color);
                const bg = has_bg ? gradient_handle(color_list, style.content_direction || '90deg') : 'background:rgba(255, 255, 255, 1);';
                const radius = Number(style.content_radius);
                const pad = style.content_padding && typeof style.content_padding == 'object' ? style.content_padding : { padding_top: 0, padding_right: 0, padding_bottom: 0, padding_left: 0 };
                const badge_size = Number(style.badge_size) || 10;
                const d_width = style.divider_width == null || style.divider_width === '' ? 1 : Number(style.divider_width);
                const divider_width = Number.isFinite(d_width) ? d_width : 1;
                let d_margin = style.divider_margin;
                if (!d_margin || typeof d_margin != 'object') {
                    d_margin = { margin_top: 12, margin_bottom: 12, margin_left: 0, margin_right: 0 };
                }
                this.setData({
                    status_list: Array.isArray(content.status_list) ? content.status_list : [],
                    view_all: content.view_all || { title: '', img: [], icon: '' },
                    view_all_show: String(content.view_all_show == null ? '1' : content.view_all_show),
                    icon_size: icon_size,
                    icon_color: style.icon_color || 'rgba(51, 51, 51, 1)',
                    style_container: common_styles_computer(style.common_style || {}),
                    style_img_container: common_img_computer(style.common_style || {}, this.propIndex),
                    card_style: bg + 'border-radius:' + (Number.isFinite(radius) ? radius : 8) * 2 + 'rpx;overflow:hidden;' + padding_computer(pad),
                    item_style: 'color:' + (style.item_color || '#333') + ';font-size:' + (Number(style.item_size) || 12) * 2 + 'rpx;',
                    icon_box_style: 'width:' + icon_size * 2 + 'rpx;height:' + icon_size * 2 + 'rpx;',
                    icon_img_style: 'width:' + icon_size * 2 + 'rpx;height:' + icon_size * 2 + 'rpx;',
                    badge_style: 'color:' + (style.badge_color || '#fff') + ';font-size:' + badge_size * 2 + 'rpx;line-height:' + (badge_size + 6) * 2 + 'rpx;background:' + (style.badge_bg_color || '#ff3f3f') + ';',
                    divider_width: divider_width,
                    divider_style: 'width:' + divider_width * 2 + 'rpx;flex:1;background:' + (style.divider_color || 'rgba(238, 238, 238, 1)') + ';' + margin_computer({
                        margin_top: d_margin.margin_top || 0,
                        margin_bottom: d_margin.margin_bottom || 0,
                        margin_left: 0,
                        margin_right: 0,
                    }),
                });
            },
            item_url(item) {
                return (item && item.link && item.link.page) || '';
            },
            badge_text(item) {
                const count = Number(item && item.count);
                if (!count || count <= 0) {
                    return '';
                }
                return count > 99 ? '99+' : String(count);
            },
            url_event(e) {
                app.globalData.url_event(e);
            },
        },
    };
</script>
<style lang="scss" scoped>
.order-nav {
    width: 100%;
}
.order-nav-inner {
    width: 100%;
    min-height: 144rpx;
}
.status-list {
    padding: 16rpx 16rpx 16rpx 0;
}
.status-item {
    flex: 1;
    min-width: 0;
    gap: 12rpx;
}
.view-all {
    width: 140rpx;
    padding: 16rpx 16rpx 16rpx 12rpx;
    flex-shrink: 0;
    gap: 12rpx;
}
.divider-v-wrap {
    align-self: stretch;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
}
.divider-v {
    box-sizing: border-box;
}
.icon-box {
    position: relative;
}
.badge {
    position: absolute;
    top: -12rpx;
    right: -20rpx;
    min-width: 32rpx;
    padding: 0 8rpx;
    border-radius: 16rpx;
    text-align: center;
}
</style>
