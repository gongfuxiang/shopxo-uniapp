<template>
    <view v-if="show_bar" :style="style_container">
        <view :style="style_img_container">
            <view v-if="theme == '0'" class="plugins-signin theme0 flex-row align-c" :style="card_style">
                <view class="day-list flex-1 flex-row jc-sa align-c">
                    <view v-for="(item, index) in day_list" :key="index" class="day-item flex-col align-c">
                        <view class="reward-box flex-row align-c jc-c" :style="item.reward_type == 'done' ? done_box_style : pending_box_style">
                            <block v-if="item.reward_type == 'done'">
                                <image-empty v-if="has_done_img" :propImageSrc="done_icon_img" propImgFit="aspectFit" :propStyle="done_img_style" :propErrorStyle="done_img_style"></image-empty>
                                <iconfont v-else-if="done_icon" :name="'icon-' + done_icon" :size="done_icon_size * 2 + 'rpx'" :color="done_icon_color" propContainerDisplay="flex"></iconfont>
                            </block>
                            <block v-else>
                                <image-empty v-if="has_pending_img" :propImageSrc="pending_icon_img" propImgFit="aspectFit" :propStyle="pending_img_style" :propErrorStyle="pending_img_style"></image-empty>
                                <iconfont v-else-if="pending_icon" :name="'icon-' + pending_icon" :size="pending_icon_size * 2 + 'rpx'" :color="pending_icon_color" propContainerDisplay="flex"></iconfont>
                            </block>
                        </view>
                        <view class="day-label text-line-1" :style="day_label_style">{{ item.label }}</view>
                    </view>
                </view>
                <view class="btn-pill flex-shrink nowrap" :style="button_style" @tap.stop="coming_event">{{ button_text }}</view>
            </view>
            <view v-else class="plugins-signin theme1 flex-row align-c" :style="card_style">
                <view class="gift-wrap flex-shrink flex-row align-c jc-c" :style="gift_wrap_style">
                    <image-empty v-if="has_gift_img" :propImageSrc="gift_icon_img" propImgFit="aspectFit" :propStyle="gift_img_style" :propErrorStyle="gift_img_style"></image-empty>
                    <iconfont v-else-if="gift_icon" :name="'icon-' + gift_icon" :size="gift_icon_size * 2 + 'rpx'" :color="gift_icon_color" propContainerDisplay="flex"></iconfont>
                </view>
                <view class="flex-col oh flex-1 flex-width theme1-copy">
                    <view class="reward-line flex-row align-c">
                        <text v-if="title" class="title-text reward-title text-line-1" :style="title_style">{{ title }}</text>
                        <view v-if="has_reward_img || reward_icon || reward_text" class="reward-pair flex-row align-c flex-shrink" :style="reward_gap_style">
                            <view v-if="has_reward_img || reward_icon" class="coin-mini flex-shrink flex-row align-c jc-c" :style="reward_icon_box_style">
                                <image-empty v-if="has_reward_img" :propImageSrc="reward_icon_img" propImgFit="aspectFit" :propStyle="reward_img_style" :propErrorStyle="reward_img_style"></image-empty>
                                <iconfont v-else-if="reward_icon" :name="'icon-' + reward_icon" :size="reward_icon_size * 2 + 'rpx'" :color="reward_icon_color" propContainerDisplay="flex"></iconfont>
                            </view>
                            <text v-if="reward_text" class="title-text flex-shrink" :style="reward_style">{{ reward_text }}</text>
                        </view>
                    </view>
                    <view v-if="desc" class="text-line-1" :style="desc_style">{{ desc }}</view>
                </view>
                <view class="btn-pill flex-shrink nowrap" :style="button_style" @tap.stop="coming_event">{{ button_text_banner }}</view>
            </view>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import { common_styles_computer, common_img_computer, gradient_handle, background_computer, padding_computer, radius_computer, border_computer } from '@/common/js/common/common.js';
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
                theme: '0',
                show_bar: false,
                day_list: [],
                button_text: '',
                button_text_banner: '',
                qrcode_id: 0,
                signed_today: 0,
                coming_loading: 0,
                title: '',
                reward_text: '',
                desc: '',
                style_container: '',
                style_img_container: '',
                card_style: '',
                day_label_style: '',
                day_count: 7,
                done_box_style: '',
                done_icon_img: '',
                has_done_img: false,
                done_icon: 'check',
                done_icon_color: 'rgba(255, 255, 255, 1)',
                done_icon_size: 14,
                done_img_style: '',
                pending_box_style: '',
                pending_icon_img: '',
                has_pending_img: false,
                pending_icon: 'star',
                pending_icon_color: 'rgba(255, 248, 224, 1)',
                pending_icon_size: 14,
                pending_img_style: '',
                button_style: '',
                title_style: '',
                reward_style: '',
                desc_style: '',
                gift_wrap_style: '',
                gift_icon_img: '',
                has_gift_img: false,
                gift_icon: 'gift',
                gift_icon_color: 'rgba(234, 126, 63, 1)',
                gift_icon_size: 28,
                gift_img_style: '',
                reward_icon_img: '',
                has_reward_img: false,
                reward_icon: 'points-terse',
                reward_icon_color: 'rgba(232, 163, 23, 1)',
                reward_icon_size: 14,
                reward_icon_box_style: '',
                reward_gap_style: '',
                reward_img_style: '',
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
            kept(value, fallback, empty) {
                if (value == null) {
                    return fallback;
                }
                return value === '' ? (empty || 'rgba(0,0,0,0)') : value;
            },
            ink(value, fallback) {
                return this.kept(value, fallback, '#000');
            },
            gap_px(value, fallback) {
                if (value == null) {
                    return fallback;
                }
                if (value === '') {
                    return 0;
                }
                const n = Number(value);
                return Number.isFinite(n) ? n : fallback;
            },
            num(value, fallback) {
                const n = Number(value);
                return Number.isFinite(n) ? n : fallback;
            },
            corner(value, fallback) {
                if (value && typeof value == 'object' && value.radius_top_left != null) {
                    return value;
                }
                const n = Number(value);
                const v = Number.isFinite(n) ? n : fallback;
                return { radius_top_left: v, radius_top_right: v, radius_bottom_right: v, radius_bottom_left: v };
            },
            pad_of(value, fallback) {
                return value && typeof value == 'object' ? value : fallback;
            },
            chip_size(size, pad) {
                const top = Number(pad && pad.padding_top) || 0;
                const right = Number(pad && pad.padding_right) || 0;
                const bottom = Number(pad && pad.padding_bottom) || 0;
                const left = Number(pad && pad.padding_left) || 0;
                return { width: size + left + right, height: size + top + bottom };
            },
            pick_img(primary, legacy) {
                if (Array.isArray(primary)) {
                    return primary;
                }
                return Array.isArray(legacy) ? legacy : [];
            },
            pick_icon(primary, legacy, fallback) {
                if (primary != null) {
                    return primary;
                }
                return legacy != null ? legacy : fallback;
            },
            chip_pad(style, value, fallback) {
                if (style && style.day_chip_ready === '1') {
                    return this.pad_of(value, fallback);
                }
                if (!value || typeof value != 'object') {
                    return fallback;
                }
                const keys = ['padding_top', 'padding_right', 'padding_bottom', 'padding_left'];
                const untouched = keys.every((key) => value[key] == null || value[key] === '' || Number(value[key]) === 0);
                return untouched ? fallback : value;
            },
            local_days() {
                const week = ['一', '二', '三', '四', '五', '六', '日'];
                const now = new Date();
                const n = now.getDay();
                const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                monday.setDate(monday.getDate() - (n === 0 ? 6 : n - 1));
                const list = [];
                for (let i = 0; i < 7; i++) {
                    const d = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
                    const is_today = d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
                    list.push({
                        label: is_today ? '今天' : week[i],
                        reward_type: 'coin',
                        is_today: is_today ? 1 : 0,
                    });
                }
                return list;
            },
            slice_days(list) {
                const count = this.day_count;
                if (!Array.isArray(list) || list.length <= count) {
                    return Array.isArray(list) ? list : [];
                }
                let today = 0;
                for (let i = 0; i < list.length; i++) {
                    const item = list[i] || {};
                    if (String(item.is_today) == '1' || item.label == '今天') {
                        today = i;
                        break;
                    }
                }
                let start = today - Math.floor((count - 1) / 2);
                if (start < 0) {
                    start = 0;
                }
                if (start + count > list.length) {
                    start = list.length - count;
                }
                return list.slice(start, start + count);
            },
            chip_radius(style, value) {
                if (style && style.day_chip_ready === '1') {
                    return this.corner(value, 100);
                }
                if (!value || typeof value != 'object') {
                    const n = Number(value);
                    return this.corner(value == null || value === '' || !Number.isFinite(n) || n === 14 ? 100 : n, 100);
                }
                const keys = ['radius_top_left', 'radius_top_right', 'radius_bottom_right', 'radius_bottom_left'];
                const old = keys.every((key) => value[key] == null || value[key] === '' || Number(value[key]) === 14);
                return old ? this.corner(100, 100) : value;
            },
            init() {
                const content = this.propValue.content || {};
                const style = this.propValue.style || {};
                const common_style = style.common_style && typeof style.common_style == 'object' ? Object.assign({}, style.common_style) : {};
                if (!Array.isArray(common_style.background_img)) {
                    common_style.background_img = [];
                }
                const color_list = style.content_color_list || [];
                const has_bg = Array.isArray(color_list) && color_list.some((item) => item && item.color);
                const bg = has_bg ? gradient_handle(color_list, style.content_direction || '90deg') : '';
                const pad = style.content_padding && typeof style.content_padding == 'object' ? style.content_padding : { padding_top: 12, padding_right: 12, padding_bottom: 12, padding_left: 12 };
                const bg_img = background_computer({
                    background_img: Array.isArray(style.content_background_img) ? style.content_background_img : [],
                    background_img_style: style.content_background_img_style || '2',
                });
                const gift_list = this.pick_img(content.gift_icon_img, style.gift_icon_img);
                const reward_list = this.pick_img(content.reward_icon_img, style.reward_icon_img);
                const pending_list = this.pick_img(content.pending_icon_img, null);
                const done_list = this.pick_img(content.done_icon_img, null);
                const gift_img = gift_list.length > 0 ? gift_list[0] : '';
                const reward_img = reward_list.length > 0 ? reward_list[0] : '';
                const pending_img = pending_list.length > 0 ? pending_list[0] : '';
                const done_img = done_list.length > 0 ? done_list[0] : '';
                const gift_size = this.num(style.gift_icon_size, 28);
                const reward_size = this.num(style.reward_icon_size, 14);
                const done_size = this.num(style.done_icon_size, 14);
                const pending_size = this.num(style.pending_icon_size, 14);
                const gift_pad = this.pad_of(style.gift_padding, { padding: 10, padding_top: 10, padding_right: 10, padding_bottom: 10, padding_left: 10 });
                const gift_box = this.chip_size(gift_size, gift_pad);
                const gift_icon = this.pick_icon(content.gift_icon, style.gift_icon, gift_img ? '' : 'gift');
                const reward_icon = this.pick_icon(content.reward_icon, style.reward_icon, reward_img ? '' : 'points-terse');
                const pending_icon = this.pick_icon(content.pending_icon, null, pending_img ? '' : 'star');
                const done_icon = this.pick_icon(content.done_icon, null, done_img ? '' : 'check');
                const day_count = this.num(content.day_count, 7);
                this.day_count = day_count >= 1 ? Math.min(7, Math.round(day_count)) : 7;
                const chip_pad = { padding: 6, padding_top: 6, padding_right: 6, padding_bottom: 6, padding_left: 6 };
                const done_pad = this.chip_pad(style, style.done_padding, chip_pad);
                const pending_pad = this.chip_pad(style, style.pending_padding, chip_pad);
                const done_box = this.chip_size(done_size, done_pad);
                const pending_box = this.chip_size(pending_size, pending_pad);
                const button_pad = this.pad_of(style.button_padding, { padding_top: 6, padding_right: 14, padding_bottom: 6, padding_left: 14 });
                const button_border = border_computer({
                    border_is_show: style.button_border_is_show || '0',
                    border_color: this.kept(style.button_border_color, 'rgba(51, 51, 51, 1)'),
                    border_style: style.button_border_style || 'solid',
                    border_size: style.button_border_size || { padding: 1, padding_top: 1, padding_right: 1, padding_bottom: 1, padding_left: 1 },
                });
                this.setData({
                    theme: content.theme == '1' ? '1' : '0',
                    style_container: common_styles_computer(common_style),
                    style_img_container: common_img_computer(common_style, this.propIndex),
                    card_style: bg + bg_img + 'overflow:hidden;' + padding_computer(pad) + radius_computer(this.corner(style.content_radius, 12)),
                    day_label_style: 'color:' + this.ink(style.day_label_color, '#999') + ';font-size:' + this.num(style.day_label_size, 10) * 2 + 'rpx;',
                    done_box_style: 'width:' + done_box.width * 2 + 'rpx;height:' + done_box.height * 2 + 'rpx;background:' + this.kept(style.done_bg_color, '#ff4d4f') + ';box-sizing:border-box;overflow:hidden;' + padding_computer(done_pad) + radius_computer(this.chip_radius(style, style.done_radius)),
                    day_count: this.day_count,
                    done_icon_img: done_img,
                    has_done_img: !!done_img,
                    done_icon: done_icon,
                    done_icon_color: this.ink(style.done_icon_color, 'rgba(255, 255, 255, 1)'),
                    done_icon_size: done_size,
                    done_img_style: 'width:' + done_size * 2 + 'rpx;height:' + done_size * 2 + 'rpx;',
                    pending_box_style: 'width:' + pending_box.width * 2 + 'rpx;height:' + pending_box.height * 2 + 'rpx;background:' + this.kept(style.pending_bg_color, 'rgba(245, 185, 66, 1)') + ';box-sizing:border-box;overflow:hidden;' + padding_computer(pending_pad) + radius_computer(this.chip_radius(style, style.pending_radius)),
                    pending_icon_img: pending_img,
                    has_pending_img: !!pending_img,
                    pending_icon: pending_icon,
                    pending_icon_color: this.ink(style.pending_icon_color, 'rgba(255, 248, 224, 1)'),
                    pending_icon_size: pending_size,
                    pending_img_style: 'width:' + pending_size * 2 + 'rpx;height:' + pending_size * 2 + 'rpx;',
                    button_style: 'background:' + this.kept(style.button_bg_color, '#ff4d4f') + ';color:' + this.ink(style.button_text_color, '#fff') + ';font-size:' + this.num(style.button_size, 13) * 2 + 'rpx;box-sizing:border-box;' + padding_computer(button_pad) + radius_computer(this.corner(style.button_radius, 20)) + button_border,
                    title_style: 'color:' + this.ink(style.title_color, '#333') + ';font-size:' + this.num(style.title_size, 14) * 2 + 'rpx;font-weight:' + (style.title_weight || 'bold') + ';',
                    reward_style: 'color:' + this.ink(style.reward_color, '#ff5a46') + ';font-size:' + this.num(style.reward_size, 14) * 2 + 'rpx;font-weight:bold;',
                    desc_style: 'color:' + this.ink(style.desc_color, '#999') + ';font-size:' + this.num(style.desc_size, 11) * 2 + 'rpx;',
                    gift_wrap_style: 'background:' + this.kept(style.gift_bg_color, 'rgba(255,236,220,1)') + ';width:' + gift_box.width * 2 + 'rpx;height:' + gift_box.height * 2 + 'rpx;box-sizing:border-box;overflow:hidden;' + padding_computer(gift_pad) + radius_computer(this.corner(style.gift_radius, 100)),
                    gift_icon_img: gift_img,
                    has_gift_img: !!gift_img,
                    gift_icon: gift_icon,
                    gift_icon_color: this.ink(style.gift_icon_color, 'rgba(234, 126, 63, 1)'),
                    gift_icon_size: gift_size,
                    gift_img_style: 'width:' + gift_size * 2 + 'rpx;height:' + gift_size * 2 + 'rpx;',
                    reward_icon_img: reward_img,
                    has_reward_img: !!reward_img,
                    reward_icon: reward_icon,
                    reward_icon_color: this.ink(style.reward_icon_color, 'rgba(232, 163, 23, 1)'),
                    reward_icon_size: reward_size,
                    reward_icon_box_style: 'width:' + Math.max(16, reward_size) * 2 + 'rpx;height:' + Math.max(16, reward_size) * 2 + 'rpx;',
                    reward_gap_style: 'margin-left:' + this.gap_px(style.reward_gap, 4) * 2 + 'rpx;',
                    reward_img_style: 'width:' + reward_size * 2 + 'rpx;height:' + reward_size * 2 + 'rpx;',
                });
                const saved_id = Number(content.qrcode_id);
                this.qrcode_id = Number.isFinite(saved_id) && saved_id > 0 ? saved_id : 0;
                const saved = content.view_data;
                if (saved && typeof saved == 'object' && saved.is_show != null) {
                    this.apply_view(saved);
                    return;
                }
                this.get_view();
            },
            apply_view(view) {
                let days = this.slice_days(Array.isArray(view.day_list) ? view.day_list : []);
                if (!days.length) {
                    days = this.slice_days(this.local_days());
                }
                const from_view = Number(view.qrcode_id);
                const qrcode_id = Number.isFinite(from_view) && from_view > 0 ? from_view : this.qrcode_id;
                this.setData({
                    show_bar: String(view.is_show) == '0' ? false : true,
                    day_list: days,
                    button_text: view.button_text || '签到',
                    button_text_banner: view.button_text_banner || '立即签到',
                    qrcode_id: qrcode_id,
                    signed_today: String(view.signed_today) == '1' ? 1 : 0,
                    title: view.title || '签到',
                    reward_text: view.reward_text || '',
                    desc: view.desc || '',
                });
            },
            get_view() {
                if (!this.qrcode_id) {
                    this.apply_view({
                        is_show: 1,
                        qrcode_id: 0,
                        signed_today: 0,
                        day_list: this.local_days(),
                        button_text: '签到',
                        button_text_banner: '立即签到',
                        title: '签到',
                        reward_text: '',
                        desc: '',
                    });
                    return;
                }
                uni.request({
                    url: app.globalData.get_request_url('userdata', 'diyapi', 'signin'),
                    method: 'POST',
                    data: {
                        id: this.qrcode_id,
                        day_count: this.day_count,
                    },
                    dataType: 'json',
                    success: (res) => {
                        const body = res.data || {};
                        if (body.code == 0 && body.data) {
                            this.apply_view(body.data);
                        }
                    },
                });
            },
            coming_event() {
                if (!app.globalData.is_single_page_check()) {
                    return;
                }
                if (!this.qrcode_id) {
                    app.globalData.showToast('签到码未选择');
                    return;
                }
                if (this.signed_today == 1) {
                    app.globalData.showToast(this.button_text || '已签到');
                    return;
                }
                if (this.coming_loading == 1) {
                    return;
                }
                if (!app.globalData.get_user_info(this, 'coming_event')) {
                    return;
                }
                this.setData({ coming_loading: 1 });
                uni.showLoading({
                    title: this.$t('common.processing_in_text'),
                });
                uni.request({
                    url: app.globalData.get_request_url('coming', 'index', 'signin'),
                    method: 'POST',
                    data: {
                        id: this.qrcode_id,
                    },
                    dataType: 'json',
                    success: (res) => {
                        uni.hideLoading();
                        this.setData({ coming_loading: 0 });
                        const body = res.data || {};
                        if (body.code == 0) {
                            const payload = body.data != null && typeof body.data == 'object' && !Array.isArray(body.data) ? body.data : body;
                            app.globalData.showToast(payload.msg || body.msg || '签到成功');
                            this.get_view();
                        } else if (app.globalData.is_login_check(body, this, 'coming_event')) {
                            app.globalData.showToast(body.msg);
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        this.setData({ coming_loading: 0 });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },
        },
    };
</script>
<style lang="scss" scoped>
.plugins-signin {
    width: 100%;
    box-sizing: border-box;
}
.theme0 {
    gap: 16rpx;
    min-height: 128rpx;
}
.theme1 {
    gap: 20rpx;
    min-height: 128rpx;
}
.theme1-copy {
    gap: 8rpx;
    min-width: 0;
}
.day-list {
    min-width: 0;
    gap: 4rpx;
}
.day-item {
    min-width: 0;
    flex: 1;
    gap: 8rpx;
}
.reward-box {
    flex-shrink: 0;
    overflow: hidden;
}
.reward-line {
    min-width: 0;
    width: 100%;
}
.reward-pair {
    gap: 8rpx;
}
.reward-title {
    min-width: 0;
    flex: 0 1 auto;
}
.btn-pill {
    line-height: 1.2;
    text-align: center;
    box-sizing: border-box;
}
.gift-wrap {
    flex-shrink: 0;
    overflow: hidden;
}
.coin-mini {
    flex-shrink: 0;
    line-height: 1;
}
.title-text {
    line-height: 1.2;
}
.nowrap {
    white-space: nowrap;
}
</style>
