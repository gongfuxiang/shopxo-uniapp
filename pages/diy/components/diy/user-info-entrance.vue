<template>
    <view v-if="rows.length" class="entrance-grid" :style="bgStyle">
        <block v-for="(row, row_index) in rows" :key="row_index">
            <view v-if="row_index > 0 && h_height > 0" class="divider-h-wrap">
                <view class="divider-h" :style="divider_h_style"></view>
            </view>
            <view class="entrance-row flex-row align-c">
                <block v-for="(item, col_index) in row" :key="col_index">
                    <view v-if="col_index > 0 && v_width > 0" class="divider-v-wrap">
                        <view class="divider-v" :style="divider_v_style"></view>
                    </view>
                    <view class="entrance-item flex-row align-c flex-1" :class="iconPosition === 'left' ? 'is-icon-left' : 'is-icon-right'" :style="item_pad(row_index, col_index, row.length)" :data-value="link_page(item)" @tap="url_event">
                        <view v-if="iconPosition === 'left'" class="entrance-icon flex-shrink">
                            <image v-if="item.img && item.img.length > 0 && item.img[0].url" class="icon-img" :src="item.img[0].url" mode="aspectFit"></image>
                            <view v-else-if="item.icon" class="icon-fallback flex-row align-c jc-c">
                                <iconfont :name="'icon-' + item.icon" size="56rpx" color="#EA7E3F" propContainerDisplay="flex"></iconfont>
                            </view>
                        </view>
                        <view class="flex-col gap-4 oh entrance-text" :class="{ 'flex-1': iconPosition !== 'left' }">
                            <view class="text-line-1" :style="titleStyle">{{ item.title || '入口标题' }}</view>
                            <view class="text-line-1" :style="descStyle">{{ item.desc || '副文案' }} ></view>
                        </view>
                        <view v-if="iconPosition !== 'left'" class="entrance-icon flex-shrink">
                            <image v-if="item.img && item.img.length > 0 && item.img[0].url" class="icon-img" :src="item.img[0].url" mode="aspectFit"></image>
                            <view v-else-if="item.icon" class="icon-fallback flex-row align-c jc-c">
                                <iconfont :name="'icon-' + item.icon" size="56rpx" color="#EA7E3F" propContainerDisplay="flex"></iconfont>
                            </view>
                        </view>
                    </view>
                </block>
            </view>
        </block>
    </view>
</template>
<script>
    const app = getApp();
    import { margin_computer } from '@/common/js/common/common.js';
    export default {
        props: {
            list: { type: Array, default: () => [] },
            columns: { type: Number, default: 2 },
            iconPosition: { type: String, default: 'right' },
            titleStyle: { type: String, default: '' },
            descStyle: { type: String, default: '' },
            bgStyle: { type: String, default: 'background:#fff;' },
            padding: { type: Object, default: () => ({ padding: 12, padding_top: 12, padding_bottom: 12, padding_left: 12, padding_right: 12 }) },
            dividerVColor: { type: String, default: 'rgba(240, 240, 240, 1)' },
            dividerVWidth: { type: Number, default: 1 },
            dividerVMargin: { type: Object, default: () => ({ margin_top: 24, margin_bottom: 24, margin_left: 12, margin_right: 12 }) },
            dividerHColor: { type: String, default: 'rgba(240, 240, 240, 1)' },
            dividerHHeight: { type: Number, default: 1 },
            dividerHMargin: { type: Object, default: () => ({ margin_top: 12, margin_bottom: 12, margin_left: 0, margin_right: 0 }) },
        },
        computed: {
            rows() {
                const list = Array.isArray(this.list) ? this.list : [];
                const cols = this.columns === 1 ? 1 : 2;
                const result = [];
                for (let i = 0; i < list.length; i += cols) {
                    result.push(list.slice(i, i + cols));
                }
                return result;
            },
            v_width() {
                return this.px(this.dividerVWidth, 1);
            },
            h_height() {
                return this.px(this.dividerHHeight, 1);
            },
            divider_v_style() {
                const margin = this.dividerVMargin || {};
                return 'width:' + this.v_width * 2 + 'rpx;flex:1;background:' + (this.dividerVColor || '#f0f0f0') + ';' + margin_computer({ margin: 0, margin_top: margin.margin_top || 0, margin_bottom: margin.margin_bottom || 0, margin_left: 0, margin_right: 0 });
            },
            divider_h_style() {
                const margin = this.dividerHMargin || {};
                return 'height:' + this.h_height * 2 + 'rpx;flex:1;background:' + (this.dividerHColor || '#f0f0f0') + ';' + margin_computer({ margin: 0, margin_left: margin.margin_left || 0, margin_right: margin.margin_right || 0, margin_top: 0, margin_bottom: 0 });
            },
        },
        methods: {
            px(val, fallback) {
                const n = Number(val);
                return Number.isFinite(n) ? Math.max(0, n) : fallback;
            },
            item_pad(row_index, col_index, row_len) {
                const box = this.padding || {};
                const has_v = this.columns !== 1 && row_len > 1 && this.v_width > 0;
                const has_h_top = row_index > 0 && this.h_height > 0;
                const has_h_bottom = row_index < this.rows.length - 1 && this.h_height > 0;
                let pt = this.px(box.padding_top, 12);
                let pr = this.px(box.padding_right, 12);
                let pb = this.px(box.padding_bottom, 12);
                let pl = this.px(box.padding_left, 12);
                const v_margin = this.dividerVMargin || {};
                const h_margin = this.dividerHMargin || {};
                if (has_v) {
                    if (col_index === 0) {
                        pr = this.px(v_margin.margin_left, 0);
                    } else {
                        pl = this.px(v_margin.margin_right, 0);
                    }
                }
                if (has_h_top) {
                    pt = this.px(h_margin.margin_top, 0);
                }
                if (has_h_bottom) {
                    pb = this.px(h_margin.margin_bottom, 0);
                }
                return 'padding:' + pt * 2 + 'rpx ' + pr * 2 + 'rpx ' + pb * 2 + 'rpx ' + pl * 2 + 'rpx;box-sizing:border-box;';
            },
            link_page(item) {
                return item && item.link && item.link.page ? item.link.page : '';
            },
            url_event(e) {
                app.globalData.url_event(e);
            },
        },
    };
</script>
<style>
.entrance-grid {
    overflow: hidden;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
    box-sizing: border-box;
}
.entrance-row {
    width: 100%;
    box-sizing: border-box;
}
.entrance-item {
    box-sizing: border-box;
    gap: 32rpx;
    min-width: 0;
}
.divider-v-wrap {
    align-self: stretch;
    display: flex;
    flex-direction: column;
}
.divider-h-wrap {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    box-sizing: border-box;
}
.divider-v,
.divider-h {
    border-radius: 999px;
    flex-shrink: 0;
    box-sizing: border-box;
}
.icon-img,
.icon-fallback {
    width: 72rpx;
    height: 72rpx;
}
.icon-fallback {
    border-radius: 16rpx;
    background: linear-gradient(145deg, #fff3eb, #ffe4d4);
}
</style>
