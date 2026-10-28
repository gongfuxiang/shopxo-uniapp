<template>
    <view v-if="view.title || view.price" class="oh" :style="outer.container">
        <view :style="outer.img">
            <view class="card" :style="card">
                <block v-if="theme == '0'">
                    <view v-if="show('price') || show('price_label') || (show('market_price') && view.origin)" class="price-row">
                        <text v-if="show('price_label')" :style="pack.label">{{ view.label }}</text>
                        <text v-if="show('price')" class="price">
                            <text :style="pack.symbol">{{ view.symbol }}</text>
                            <text :style="pack.price">{{ view.price }}</text>
                        </text>
                        <text v-if="show('market_price') && view.origin" :style="pack.market">{{ view.origin_symbol }}{{ view.origin }}</text>
                    </view>
                    <view v-if="show('title') || (show('tags') && tag_before && view.tags.length)" class="title" :style="show('title') ? pack.title : ''">
                        <text v-for="(tag, index) in tag_before_list" :key="index" class="tag" :style="pack.tag">{{ tag }}</text>
                        <text v-if="show('title')">{{ view.title }}</text>
                    </view>
                    <view v-if="show_brief_text" class="brief" :style="pack.brief">{{ view.brief }}</view>
                    <view v-if="show_meta_line" class="divider" :style="pack.divider"></view>
                    <view v-if="show_meta" class="meta" :style="meta_box">
                        <text v-if="show('views')" :style="pack.meta">浏览量: {{ view.views }}</text>
                        <text v-if="show('stock') && view.show_stock" :style="pack.meta">库存: {{ view.stock }}</text>
                        <text v-if="show('sales') && view.show_sales" :style="pack.meta">销量: {{ view.sales }}</text>
                    </view>
                    <view v-if="show('tags') && !tag_before && view.tags.length" class="tags">
                        <text v-for="(tag, index) in view.tags" :key="index" class="tag" :style="pack.tag">{{ tag }}</text>
                    </view>
                </block>
                <block v-else>
                    <view v-if="show('title') || (show('tags') && tag_before && view.tags.length)" class="title" :style="show('title') ? pack.title : ''">
                        <text v-for="(tag, index) in tag_before_list" :key="index" class="tag" :style="pack.tag">{{ tag }}</text>
                        <text v-if="show('title')">{{ view.title }}</text>
                    </view>
                    <view v-if="show_brief_text" class="brief" :style="pack.brief">{{ view.brief }}</view>
                    <view v-if="show('tags') && !tag_before && view.tags.length" class="tags">
                        <text v-for="(tag, index) in view.tags" :key="index" class="tag" :style="pack.tag">{{ tag }}</text>
                    </view>
                    <view v-if="show('price') || show('price_label') || show('market_price') || show('share') || show('collect')" class="price-action">
                        <view class="flex-1">
                            <view v-if="show('price') || show('price_label')" class="price-row">
                                <text v-if="show('price_label')" class="member" :style="pack.member">{{ view.label }}</text>
                                <text v-if="show('price')" class="price">
                                    <text :style="pack.symbol">{{ view.symbol }}</text>
                                    <text :style="pack.price">{{ view.price }}</text>
                                </text>
                            </view>
                            <text v-if="show('market_price') && view.origin" :style="pack.market">{{ view.origin_symbol }}{{ view.origin }}</text>
                        </view>
                        <view v-if="show('share') || show('collect')" class="actions">
                            <view v-if="show('share')" class="action" :style="pack.action" @tap="share_event">
                                <image v-if="share_img" class="action-img" :src="share_img" mode="aspectFit"></image>
                                <iconfont v-else :name="share_icon" :size="pack.action_icon" :color="pack.action_color"></iconfont>
                                <text>{{ share_text }}</text>
                            </view>
                            <view v-if="show('collect')" class="action" :style="pack.action" @tap="favor_event">
                                <image v-if="collect_img" class="action-img" :src="collect_img" mode="aspectFit"></image>
                                <iconfont v-else :name="collect_icon" :size="pack.action_icon" :color="view.favored ? pack.accent : pack.action_color"></iconfont>
                                <text>{{ view.favored ? '已收藏' : collect_text }}</text>
                            </view>
                        </view>
                    </view>
                    <view v-if="show_meta_line" class="divider" :style="pack.divider"></view>
                    <view v-if="show_meta" class="meta" :style="meta_box">
                        <text v-if="show('views')" :style="pack.meta">浏览量: {{ view.views }}</text>
                        <text v-if="show('stock') && view.show_stock" :style="pack.meta">库存: {{ view.stock }}</text>
                        <text v-if="show('sales') && view.show_sales" :style="pack.meta">销量: {{ view.sales }}</text>
                    </view>
                </block>
            </view>
        </view>
    </view>
</template>
<script>
    import { field_on, show_brief, goods_view, outer_style, card_style, price_pack, media_url, icon_name, call_page } from './goods-detail-common.js';
    export default {
        props: {
            propValue: { type: Object, default: () => ({}) },
            propGoods: { type: Object, default: null },
            propKey: { type: [String, Number], default: '' },
            propIndex: { type: Number, default: 0 },
        },
        computed: {
            content() { return (this.propValue && this.propValue.content) || {}; },
            style() { return (this.propValue && this.propValue.style) || {}; },
            theme() { return String(this.content.theme) === '1' ? '1' : '0'; },
            view() { return goods_view(this.propGoods); },
            outer() { return outer_style(this.style); },
            card() { return card_style(this.style); },
            pack() { return price_pack(this.style); },
            tag_before() { return this.content.tag_position !== 'row'; },
            tag_before_list() { return this.show('tags') && this.tag_before ? this.view.tags : []; },
            show_meta() {
                return (this.show('views') && this.view.views !== '') || (this.show('stock') && this.view.show_stock) || (this.show('sales') && this.view.show_sales);
            },
            show_meta_line() { return this.content.divider_show !== false && this.show_meta; },
            show_brief_text() { return show_brief(this.content) && !!this.view.brief; },
            meta_box() {
                const top = this.show_meta_line ? 0 : this.pack.meta_gap;
                return this.pack.meta + 'margin-top:' + top + 'rpx;';
            },
            share_text() { return this.content.share_text || '分享'; },
            collect_text() { return this.content.collect_text || '收藏'; },
            share_icon() { return icon_name(this.content.share_icon, 'icon-share-circle'); },
            collect_icon() { return icon_name(this.view.favored ? 'heart' : (this.content.collect_icon || 'collect'), 'icon-heart'); },
            share_img() { return media_url(this.content.share_img); },
            collect_img() { return media_url(this.content.collect_img); },
        },
        methods: {
            show(key) { return field_on(this.content, key); },
            share_event(e) { call_page('popup_share_event', e); },
            favor_event(e) { call_page('goods_favor_event', e); },
        },
    };
</script>
<style lang="scss" scoped>
.card { width: 100%; }
.price-row, .price-action, .meta, .tags { display: flex; flex-direction: row; align-items: center; flex-wrap: wrap; }
.price-action { justify-content: space-between; margin-top: 16rpx; }
.meta { justify-content: space-between; }
.tags { gap: 12rpx; margin-top: 16rpx; }
.title { margin-top: 16rpx; line-height: 1.45; }
.brief { line-height: 1.5; }
.tag { display: inline-block; margin-right: 12rpx; line-height: 1.4; }
.price { margin-right: 12rpx; }
.member { margin-right: 12rpx; }
.divider { height: 1px; }
.actions { display: flex; flex-direction: row; gap: 28rpx; }
.action { display: flex; flex-direction: column; align-items: center; }
.action-img { width: 36rpx; height: 36rpx; }
.flex-1 { flex: 1; min-width: 0; }
</style>
