<template>
    <view v-if="show_bar" class="oh" :style="outer_style">
        <view :style="outer_img">
            <view class="bar" :style="card_style">
                <view class="row">
                    <text v-if="title_show == '1'" class="title" :style="title_style">{{ title_text }}</text>
                    <view v-if="countdown_show == '1'" class="timer" :style="timer_wrap_style">
                        <text class="label" :style="timer_label_style">{{ timer_msg }}</text>
                        <text class="num" :style="timer_num_style">{{ hours }}</text>
                        <text v-if="timer_sep !== ''" class="sep" :style="timer_sep_style">{{ timer_sep }}</text>
                        <text class="num" :style="timer_num_style">{{ minutes }}</text>
                        <text v-if="timer_sep !== ''" class="sep" :style="timer_sep_style">{{ timer_sep }}</text>
                        <text class="num" :style="timer_num_style">{{ seconds }}</text>
                    </view>
                </view>
                <view v-if="deposit_show == '1' && deposit_text" class="deposit" :style="deposit_style">{{ deposit_text }}</view>
                <view v-if="tips_show == '1' && (lastpay_tips || delivery_tips)" class="tips" :style="tips_style">
                    <text v-if="lastpay_tips" class="tip-line">{{ lastpay_tips }}</text>
                    <text v-if="delivery_tips" class="tip-line">{{ delivery_tips }}</text>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
    import { common_styles_computer, common_img_computer, gradient_handle, background_computer, padding_computer, radius_computer, border_computer } from '@/common/js/common/common.js';
    import { page_vm } from './goods-detail-common.js';
    export default {
        props: {
            propValue: { type: Object, default: () => ({}) },
            propGoods: { type: Object, default: null },
            propPresale: { type: Object, default: null },
            propKey: { type: [String, Number], default: '' },
            propIndex: { type: Number, default: 0 },
        },
        data() {
            return {
                show_bar: false,
                hours: '00',
                minutes: '00',
                seconds: '00',
                timer_msg: '',
                deposit_text: '',
                lastpay_tips: '',
                delivery_tips: '',
                _tick: null,
                _left: 0,
            };
        },
        computed: {
            content() { return (this.propValue && this.propValue.content) || {}; },
            style() { return (this.propValue && this.propValue.style) || {}; },
            currency() {
                const page = page_vm();
                const app = getApp();
                return (page && page.currency_symbol) || (app.globalData && app.globalData.currency_symbol ? app.globalData.currency_symbol() : '¥');
            },
            presale_data() {
                if (this.propPresale && typeof this.propPresale === 'object') return this.propPresale;
                const page = page_vm();
                return (page && page.plugins_presale_data) || null;
            },
            title_show() { return String(this.content.title_show == null ? '1' : this.content.title_show) === '0' ? '0' : '1'; },
            countdown_show() { return String(this.content.countdown_show == null ? '1' : this.content.countdown_show) === '0' ? '0' : '1'; },
            deposit_show() { return String(this.content.deposit_show == null ? '1' : this.content.deposit_show) === '0' ? '0' : '1'; },
            tips_show() { return String(this.content.tips_show == null ? '1' : this.content.tips_show) === '0' ? '0' : '1'; },
            use_plugin_bg() {
                const style = this.style || {};
                if (style.use_plugin_bg != null && style.use_plugin_bg !== '') {
                    return String(style.use_plugin_bg) !== '0';
                }
                return String(this.content.follow_plugin_style == null ? '1' : this.content.follow_plugin_style) !== '0';
            },
            timer_sep() {
                return this.content.timer_sep == null ? ':' : String(this.content.timer_sep);
            },
            title_text() {
                const cfg = this.presale_data && this.presale_data.config;
                return (cfg && cfg.goods_detail_title) || '商品预售';
            },
            outer_style() { return common_styles_computer(this.style.common_style || {}); },
            outer_img() { return common_img_computer(this.style.common_style || {}, this.propIndex); },
            card_style() {
                const style = this.style || {};
                const colors = style.content_color_list || [];
                const has_bg = Array.isArray(colors) && colors.some((item) => item && item.color);
                const fallback = 'rgba(106,60,251,1)';
                let bg = '';
                if (this.use_plugin_bg) {
                    const cfg = this.presale_data && this.presale_data.config;
                    const header = cfg && cfg.goods_detail_header ? cfg.goods_detail_header : '';
                    if (header) {
                        if (has_bg) {
                            const grad = gradient_handle(colors, style.content_direction || '90deg', false);
                            bg = 'background-image:url(' + header + '),' + grad + ';background-size:cover,100% 100%;background-repeat:no-repeat,no-repeat;background-position:center,center;';
                        } else {
                            bg = 'background-color:' + fallback + ';background-image:url(' + header + ');background-size:cover;background-repeat:no-repeat;background-position:center;';
                        }
                    } else {
                        bg = has_bg ? gradient_handle(colors, style.content_direction || '90deg') : 'background:' + fallback + ';';
                    }
                } else {
                    bg = has_bg ? gradient_handle(colors, style.content_direction || '90deg') : 'background:' + fallback + ';';
                    const imgs = style.content_background_img || [];
                    if (Array.isArray(imgs) && imgs.length) {
                        bg += background_computer({ background_img: imgs, background_img_style: style.content_background_img_style || '2' });
                    }
                }
                const pad = style.content_padding && typeof style.content_padding === 'object' ? padding_computer(style.content_padding) : 'padding:24rpx;';
                const radius = style.content_radius ? radius_computer(style.content_radius) : 'border-radius:16rpx;';
                const border = border_computer({
                    border_is_show: style.card_border_is_show || '0',
                    border_color: style.card_border_color || 'rgba(106,60,251,1)',
                    border_style: style.card_border_style || 'solid',
                    border_size: style.card_border_size,
                });
                return bg + radius + 'overflow:hidden;' + pad + 'box-sizing:border-box;' + border;
            },
            title_style() {
                return 'color:' + (this.style.title_color || '#fff') + ';font-size:' + (px(this.style.title_size, 15) * 2) + 'rpx;font-weight:' + (this.style.title_weight || 'bold') + ';';
            },
            timer_wrap_style() {
                const style = this.style || {};
                const bg = style.timer_wrap_bg ? 'background:' + style.timer_wrap_bg + ';' : '';
                const pad = style.timer_wrap_padding && typeof style.timer_wrap_padding === 'object' ? padding_computer(style.timer_wrap_padding) : '';
                const radius = style.timer_wrap_radius ? radius_computer(style.timer_wrap_radius) : '';
                const border = border_computer({
                    border_is_show: style.timer_wrap_border_is_show || '0',
                    border_color: style.timer_wrap_border_color || 'rgba(255,255,255,0.35)',
                    border_style: style.timer_wrap_border_style || 'solid',
                    border_size: style.timer_wrap_border_size,
                });
                return bg + pad + radius + 'box-sizing:border-box;' + border;
            },
            timer_label_style() {
                return 'color:' + (this.style.timer_label_color || 'rgba(255,255,255,0.9)') + ';font-size:' + (px(this.style.timer_label_size, 12) * 2) + 'rpx;';
            },
            timer_sep_style() {
                return 'color:' + (this.style.timer_sep_color || 'rgba(255,255,255,0.9)') + ';font-size:' + (px(this.style.timer_sep_size, 12) * 2) + 'rpx;';
            },
            timer_num_style() {
                const style = this.style || {};
                const pad = style.timer_padding && typeof style.timer_padding === 'object' ? padding_computer(style.timer_padding) : 'padding:4rpx 10rpx;';
                const radius = style.timer_radius && typeof style.timer_radius === 'object'
                    ? radius_computer(style.timer_radius)
                    : 'border-radius:' + (px(style.timer_radius, 4) * 2) + 'rpx;';
                const border = border_computer({
                    border_is_show: style.timer_border_is_show || '0',
                    border_color: style.timer_border_color || 'rgba(106,60,251,1)',
                    border_style: style.timer_border_style || 'solid',
                    border_size: style.timer_border_size,
                });
                return 'color:' + (style.timer_color || 'rgba(106,60,251,1)') + ';font-size:' + (px(style.timer_size, 13) * 2) + 'rpx;background:' + (style.timer_bg || '#fff') + ';font-weight:600;box-sizing:border-box;' + pad + radius + border;
            },
            deposit_style() {
                return 'color:' + (this.style.deposit_color || '#fff') + ';font-size:' + (px(this.style.deposit_size, 13) * 2) + 'rpx;';
            },
            tips_style() {
                return 'color:' + (this.style.tips_color || 'rgba(255,255,255,0.92)') + ';font-size:' + (px(this.style.tips_size, 11) * 2) + 'rpx;';
            },
        },
        watch: {
            presale_data: { handler() { this.restart(); }, deep: true },
            propValue() { this.restart(); },
        },
        mounted() { this.restart(); },
        beforeDestroy() { this.stop(); },
        // #ifdef VUE3
        beforeUnmount() { this.stop(); },
        // #endif
        methods: {
            stop() {
                if (this._tick) {
                    clearInterval(this._tick);
                    this._tick = null;
                }
            },
            restart() {
                this.stop();
                const data = this.presale_data;
                const time = data && data.time ? data.time : null;
                const ok = !!(time && parseInt(time.status) === 1);
                this.show_bar = ok;
                if (!ok) return;
                this.timer_msg = time.msg || '距结束';
                const pg = data.presale_goods || {};
                const cfg = data.config || {};
                const icon = cfg.goods_detail_icon || '定金';
                const deduct = cfg.goods_detail_deduct_text || '可抵扣';
                let deposit = '';
                if (pg.deposit_price != null && pg.deposit_price !== '') {
                    deposit = icon + ' ' + this.currency + pg.deposit_price;
                    if (Number(pg.deduct_price) > 0) deposit += '　' + deduct + this.currency + pg.deduct_price;
                }
                this.deposit_text = deposit;
                this.lastpay_tips = pg.lastpay_tips ? String(pg.lastpay_tips) : '';
                this.delivery_tips = pg.delivery_tips ? String(pg.delivery_tips) : '';
                const h = parseInt(time.hours) || 0;
                const m = parseInt(time.minutes) || 0;
                const s = parseInt(time.seconds) || 0;
                this._left = h * 3600 + m * 60 + s;
                this.render_left();
                this._tick = setInterval(() => {
                    if (this._left <= 0) {
                        this.stop();
                        this.show_bar = false;
                        return;
                    }
                    this._left -= 1;
                    this.render_left();
                }, 1000);
            },
            render_left() {
                const t = Math.max(0, this._left);
                this.hours = pad2(Math.floor(t / 3600));
                this.minutes = pad2(Math.floor((t % 3600) / 60));
                this.seconds = pad2(t % 60);
            },
        },
    };
    function px(value, fallback) {
        if (value == null || value === '') return fallback;
        const n = Number(value);
        return Number.isFinite(n) ? n : fallback;
    }
    function pad2(n) {
        return n < 10 ? '0' + n : String(n);
    }
</script>
<style lang="scss" scoped>
.bar { width: 100%; display: flex; flex-direction: column; gap: 12rpx; }
.row { width: 100%; display: flex; flex-direction: row; align-items: center; justify-content: space-between; gap: 16rpx; }
.title { flex: 1; min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.timer { flex-shrink: 0; display: flex; flex-direction: row; align-items: center; gap: 6rpx; }
.sep { flex-shrink: 0; line-height: 1; }
.tips { display: flex; flex-direction: column; gap: 4rpx; line-height: 1.45; }
.tip-line { display: block; }
</style>
