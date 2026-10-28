<template>
    <view :style="style_container">
        <view :style="style_img_container">
            <!-- 样式一 -->
            <view v-if="theme == '0'" class="pr" :style="content_style">
                <view class="flex-row jc-sb align-c head-row">
                    <view class="flex-1 flex-row align-c gap-12" data-value="/pages/personal/personal" @tap="url_event">
                        <image class="circle" :src="avatar_src" mode="aspectFill" :style="avatar_style"></image>
                        <view class="flex-col gap-8">
                            <view class="fw-b" :style="user_name_style">{{ user_name }}</view>
                            <view v-if="show_id && id_text" class="id-chip" :style="number_code_style">{{ member_code_text }}</view>
                        </view>
                    </view>
                    <view class="flex-row align-c" :style="icon_gap_style">
                        <view v-for="(item, index) in icon_setting" :key="index" :style="icon_box_style" :data-value="icon_page(item)" @tap="url_event">
                            <image v-if="item.img && item.img.length > 0 && item.img[0].url" :src="item.img[0].url" mode="scaleToFill" :style="icon_box_style"></image>
                            <iconfont v-else :name="'icon-' + (item.icon || 'setup')" :size="icon_font_size" :color="icon_color" propContainerDisplay="flex"></iconfont>
                        </view>
                    </view>
                </view>
                <view class="flex-row jc-sa align-c stats-box" :style="stats_box_style">
                    <block v-for="(item, index) in stats_list" :key="index">
                        <view v-if="config.indexOf(item.id) !== -1" class="tc" :data-value="item.page" @tap="url_event">
                            <view class="fw-b stat-num" :style="stats_number_style">{{ item.value }}</view>
                            <view :style="stats_name_style">{{ item.name }}</view>
                        </view>
                    </block>
                </view>
            </view>

            <!-- 样式二 -->
            <view v-else-if="theme == '1'" class="pr" :style="content_style">
                <view class="flex-row jc-sb align-c head-row-sm">
                    <view class="flex-1 flex-row align-c gap-12 oh" data-value="/pages/personal/personal" @tap="url_event">
                        <image class="circle flex-shrink" :src="avatar_src" mode="aspectFill" :style="avatar_style"></image>
                        <view class="flex-col gap-6 oh">
                            <view class="fw-b text-line-1" :style="user_name_style">{{ user_name }}</view>
                            <view v-if="show_id && id_text" class="id-chip text-line-1" :style="number_code_style">{{ member_code_text }}</view>
                        </view>
                    </view>
                    <view class="flex-row align-c flex-shrink" :style="icon_gap_style">
                        <view v-for="(item, index) in icon_setting" :key="index" :style="icon_box_style" :data-value="icon_page(item)" @tap="url_event">
                            <image v-if="item.img && item.img.length > 0 && item.img[0].url" :src="item.img[0].url" mode="scaleToFill" :style="icon_box_style"></image>
                            <iconfont v-else :name="'icon-' + (item.icon || 'setup')" :size="icon_font_size" :color="icon_color" propContainerDisplay="flex"></iconfont>
                        </view>
                    </view>
                </view>
                <view v-if="show_stats" class="flex-row jc-sa align-c stats-gap stats-box" :style="stats_box_style">
                    <block v-for="(item, index) in stats_list" :key="index">
                        <view v-if="config.indexOf(item.id) !== -1" class="tc" :data-value="item.page" @tap="url_event">
                            <view class="fw-b stat-num-sm" :style="stats_number_style">{{ item.value }}</view>
                            <view :style="stats_name_style">{{ item.name }}</view>
                        </view>
                    </block>
                </view>
                <user-info-entrance :list="entrance_list" :columns="entrance_columns" :iconPosition="entrance_icon_position" :padding="entrance_padding" :bgStyle="entrance_bg_style" :titleStyle="entrance_title_style" :descStyle="entrance_desc_style" :dividerVColor="entrance_divider_v_color" :dividerVWidth="entrance_divider_v_width" :dividerVMargin="entrance_divider_v_margin" :dividerHColor="entrance_divider_h_color" :dividerHHeight="entrance_divider_h_height" :dividerHMargin="entrance_divider_h_margin"></user-info-entrance>
            </view>

            <!-- 样式三 -->
            <view v-else-if="theme == '2'" class="pr" :style="content_style">
                <view class="flex-row jc-sb align-c head-row-sm">
                    <view class="flex-1 flex-col gap-6 oh" data-value="/pages/personal/personal" @tap="url_event">
                        <view class="fw-b text-line-1" :style="user_name_style">{{ user_name }}</view>
                        <view v-if="show_id && id_text" class="id-chip text-line-1" :style="number_code_style">{{ member_code_text }}</view>
                    </view>
                    <image class="circle flex-shrink" :src="avatar_src" mode="aspectFill" :style="avatar_style" data-value="/pages/personal/personal" @tap="url_event"></image>
                </view>
                <view v-if="show_stats" class="flex-row jc-sa align-c stats-gap stats-box" :style="stats_box_style">
                    <block v-for="(item, index) in stats_list" :key="index">
                        <view v-if="config.indexOf(item.id) !== -1" class="tc" :data-value="item.page" @tap="url_event">
                            <view class="fw-b stat-num-sm" :style="stats_number_style">{{ item.value }}</view>
                            <view :style="stats_name_style">{{ item.name }}</view>
                        </view>
                    </block>
                </view>
                <user-info-entrance :list="entrance_list" :columns="entrance_columns" :iconPosition="entrance_icon_position" :padding="entrance_padding" :bgStyle="entrance_bg_style" :titleStyle="entrance_title_style" :descStyle="entrance_desc_style" :dividerVColor="entrance_divider_v_color" :dividerVWidth="entrance_divider_v_width" :dividerVMargin="entrance_divider_v_margin" :dividerHColor="entrance_divider_h_color" :dividerHHeight="entrance_divider_h_height" :dividerHMargin="entrance_divider_h_margin"></user-info-entrance>
            </view>

            <!-- 样式四 -->
            <view v-else-if="theme == '3'" class="pr" :style="content_style">
                <view class="flex-row jc-e icon-top" :style="icon_gap_style">
                    <view v-for="(item, index) in icon_setting" :key="index" :style="icon_box_style" :data-value="icon_page(item)" @tap="url_event">
                        <image v-if="item.img && item.img.length > 0 && item.img[0].url" :src="item.img[0].url" mode="scaleToFill" :style="icon_box_style"></image>
                        <iconfont v-else :name="'icon-' + (item.icon || 'setup')" :size="icon_font_size" :color="icon_color" propContainerDisplay="flex"></iconfont>
                    </view>
                </view>
                <view class="flex-col align-c gap-8 profile-gap profile-box" :style="profile_box_style" data-value="/pages/personal/personal" @tap="url_event">
                    <image class="circle" :src="avatar_src" mode="aspectFill" :style="avatar_style"></image>
                    <view class="fw-b" :style="user_name_style">{{ user_name }}</view>
                    <view v-if="show_id && id_text" class="id-chip" :style="number_code_style">{{ member_code_text }}</view>
                </view>
                <view v-if="show_stats" class="flex-row jc-sa align-c stats-gap stats-box" :style="stats_box_style">
                    <block v-for="(item, index) in stats_list" :key="index">
                        <view v-if="config.indexOf(item.id) !== -1" class="tc" :data-value="item.page" @tap="url_event">
                            <view class="fw-b stat-num-sm" :style="stats_number_style">{{ item.value }}</view>
                            <view :style="stats_name_style">{{ item.name }}</view>
                        </view>
                    </block>
                </view>
                <user-info-entrance :list="entrance_list" :columns="entrance_columns" :iconPosition="entrance_icon_position" :padding="entrance_padding" :bgStyle="entrance_bg_style" :titleStyle="entrance_title_style" :descStyle="entrance_desc_style" :dividerVColor="entrance_divider_v_color" :dividerVWidth="entrance_divider_v_width" :dividerVMargin="entrance_divider_v_margin" :dividerHColor="entrance_divider_h_color" :dividerHHeight="entrance_divider_h_height" :dividerHMargin="entrance_divider_h_margin"></user-info-entrance>
            </view>

            <!-- 样式五 -->
            <view v-else-if="theme == '4'" class="pr" :style="content_style">
                <view class="flex-row top-row">
                    <view class="flex-1 flex-row align-c top-card profile-box" :style="profile_box_style" data-value="/pages/personal/personal" @tap="url_event">
                        <image class="circle flex-shrink" :src="avatar_src" mode="aspectFill" :style="avatar_style_sm"></image>
                        <view class="flex-col gap-4 oh flex-1 name-gap">
                            <view class="fw-b text-line-1" :style="user_name_style">{{ user_name }}</view>
                            <view v-if="show_id && id_text" class="id-chip text-line-1" :style="number_code_style">{{ member_code_text }}</view>
                        </view>
                        <view v-if="!side_card" class="flex-row align-c flex-shrink" :style="icon_gap_style" @tap.stop>
                            <view v-for="(item, index) in icon_setting" :key="index" :style="icon_box_style" :data-value="icon_page(item)" @tap.stop="url_event">
                                <image v-if="item.img && item.img.length > 0 && item.img[0].url" :src="item.img[0].url" mode="scaleToFill" :style="icon_box_style"></image>
                                <iconfont v-else :name="'icon-' + (item.icon || 'setup')" :size="icon_font_size" :color="icon_color" propContainerDisplay="flex"></iconfont>
                            </view>
                        </view>
                    </view>
                    <view v-if="side_card" class="flex-1 flex-col jc-sb top-card" :style="side_box_style" :data-value="side_page" @tap="url_event">
                        <view>
                            <view class="fw-b side-title" :style="side_title_style">{{ side_card.title || '积分商城' }}</view>
                            <view :style="side_desc_style">{{ side_card.desc || '积分可换好物' }} ></view>
                        </view>
                        <view class="flex-row jc-e side-icon-row">
                            <image v-if="side_card.img && side_card.img.length > 0 && side_card.img[0].url" class="side-img" :src="side_card.img[0].url" mode="aspectFit"></image>
                            <view v-else class="side-fallback flex-row align-c jc-c">
                                <iconfont :name="'icon-' + (side_card.icon || 'shop')" size="56rpx" color="#EA7E3F" propContainerDisplay="flex"></iconfont>
                            </view>
                        </view>
                    </view>
                </view>
                <user-info-entrance :list="entrance_list" :columns="entrance_columns" :iconPosition="entrance_icon_position" :padding="entrance_padding" :bgStyle="entrance_bg_style" :titleStyle="entrance_title_style" :descStyle="entrance_desc_style" :dividerVColor="entrance_divider_v_color" :dividerVWidth="entrance_divider_v_width" :dividerVMargin="entrance_divider_v_margin" :dividerHColor="entrance_divider_h_color" :dividerHHeight="entrance_divider_h_height" :dividerHMargin="entrance_divider_h_margin"></user-info-entrance>
            </view>

            <!-- 样式六 -->
            <view v-else-if="theme == '5'" class="pr" :style="theme5_wrap_style">
                <view class="profile-card pr profile-box" :style="profile_box_style">
                    <image class="circle avatar-float" :src="avatar_src" mode="aspectFill" :style="theme5_avatar_style" data-value="/pages/personal/personal" @tap="url_event"></image>
                    <view class="flex-row jc-sb align-c profile-body" :style="theme5_body_style">
                        <view class="flex-1 flex-col gap-4 oh" data-value="/pages/personal/personal" @tap="url_event">
                            <view class="fw-b text-line-1" :style="user_name_style">{{ user_name }}</view>
                            <view v-if="show_id && id_text" class="id-chip text-line-1" :style="number_code_style">{{ member_code_text }}</view>
                        </view>
                        <view class="flex-row align-c flex-shrink" :style="icon_gap_style">
                            <view v-for="(item, index) in icon_setting" :key="index" :style="icon_box_style" :data-value="icon_page(item)" @tap="url_event">
                                <image v-if="item.img && item.img.length > 0 && item.img[0].url" :src="item.img[0].url" mode="scaleToFill" :style="icon_box_style"></image>
                                <iconfont v-else :name="'icon-' + (item.icon || 'setup')" :size="icon_font_size" :color="icon_color" propContainerDisplay="flex"></iconfont>
                            </view>
                        </view>
                    </view>
                </view>
                <user-info-entrance :list="entrance_list" :columns="entrance_columns" :iconPosition="entrance_icon_position" :padding="entrance_padding" :bgStyle="entrance_bg_style" :titleStyle="entrance_title_style" :descStyle="entrance_desc_style" :dividerVColor="entrance_divider_v_color" :dividerVWidth="entrance_divider_v_width" :dividerVMargin="entrance_divider_v_margin" :dividerHColor="entrance_divider_h_color" :dividerHHeight="entrance_divider_h_height" :dividerHMargin="entrance_divider_h_margin"></user-info-entrance>
            </view>
        </view>
    </view>
</template>
<script>
    import i18n from '@/locale/index.js';
    const app = getApp();
    import { common_styles_computer, common_img_computer, gradient_computer, padding_computer, radius_computer, background_computer } from '@/common/js/common/common.js';
    import userInfoEntrance from '@/pages/diy/components/diy/user-info-entrance.vue';
    const STATS = [
    { id: 'order_count', name: '', page: '/pages/user-order/user-order' },
    { id: 'goods_favor_count', name: '', page: '/pages/user-favor/user-favor' },
    { id: 'goods_browse_count', name: '', page: '/pages/user-goods-browse/user-goods-browse' },
    { id: 'integral_number', name: '', page: '/pages/user-integral/user-integral' },
    { id: 'wallet_number', name: '余额', page: '/pages/plugins/wallet/user/user' },
    { id: 'coupon_count', name: '优惠券', page: '/pages/plugins/coupon/user/user' },
];
const zero_radius = { radius: 0, radius_top_left: 0, radius_top_right: 0, radius_bottom_right: 0, radius_bottom_left: 0 };
    const corner = (n) => ({ radius: n, radius_top_left: n, radius_top_right: n, radius_bottom_right: n, radius_bottom_left: n });
    const pad_of = (top, right, bottom, left) => ({ padding: top, padding_top: top, padding_right: right, padding_bottom: bottom, padding_left: left });
const ink = (value, fallback) => (value == null ? fallback : value === '' ? '#000' : value);
    export default {
        components: { userInfoEntrance },
        props: {
            propValue: { type: Object, default: () => ({}) },
            propKey: { type: [String, Number], default: '' },
            propIndex: { type: Number, default: 1000000 },
        },
        data() {
            return {
                theme: '0',
                style_container: '',
                style_img_container: '',
                content_style: '',
                theme5_wrap_style: '',
                theme5_avatar_style: '',
                theme5_body_style: '',
                show_id: true,
                show_stats: true,
                id_text: '',
                member_code_text: '',
                user_name: '',
                avatar_src: '',
                avatar_style: '',
                avatar_style_sm: '',
                icon_color: '#666666',
                icon_font_size: '46rpx',
                icon_box_style: '',
                icon_gap_style: '',
                stats_list: [
                    { id: 'order_count', name: this.$t('diy.order_total'), value: '0', page: '/pages/user-order/user-order' },
                    { id: 'goods_favor_count', name: this.$t('diy.goods_favor'), value: '0', page: '/pages/user-favor/user-favor' },
                    { id: 'goods_browse_count', name: this.$t('diy.my_tracks'), value: '0', page: '/pages/user-goods-browse/user-goods-browse' },
                    { id: 'integral_number', name: this.$t('diy.my_integral'), value: '0', page: '/pages/user-integral/user-integral' },
                    { id: 'wallet_number', name: '余额', value: '0', page: '/pages/plugins/wallet/user/user' },
                    { id: 'coupon_count', name: '优惠券', value: '0', page: '/pages/plugins/coupon/user/user' },
                ],
                config: ['order_count', 'goods_favor_count', 'goods_browse_count', 'integral_number'],
                icon_setting: [],
                entrance_list: [],
                entrance_columns: 2,
                entrance_icon_position: 'right',
                entrance_padding: pad_of(12, 12, 12, 12),
                entrance_bg_style: 'background:#fff;',
                entrance_title_style: '',
                entrance_desc_style: '',
                entrance_divider_v_color: 'rgba(240, 240, 240, 1)',
                entrance_divider_v_width: 1,
                entrance_divider_v_margin: { margin_top: 24, margin_bottom: 24, margin_left: 12, margin_right: 12 },
                entrance_divider_h_color: 'rgba(240, 240, 240, 1)',
                entrance_divider_h_height: 1,
                entrance_divider_h_margin: { margin_top: 12, margin_bottom: 12, margin_left: 0, margin_right: 0 },
                side_card: null,
                side_page: '',
                side_box_style: '',
                side_title_style: '',
                side_desc_style: '',
                profile_box_style: '',
                stats_box_style: '',
                user_name_style: '',
                number_code_style: '',
                stats_name_style: '',
                stats_number_style: '',
                user: {
                    avatar: app.globalData.data.default_user_head_src,
                    user_name_view: i18n.t('common.username'),
                },
            };
        },
        watch: {
            propKey() {
                this.init();
            },
        },
        created() {
            this.init();
        },
        methods: {
            box_style(style, prefix, fallback, with_padding) {
                const list = Array.isArray(style[prefix + '_color_list']) ? style[prefix + '_color_list'] : fallback.color_list;
                const img = Array.isArray(style[prefix + '_background_img']) ? style[prefix + '_background_img'] : [];
                const pad = style[prefix + '_padding'] && typeof style[prefix + '_padding'] === 'object' ? style[prefix + '_padding'] : fallback.padding;
                const radius = style[prefix + '_radius'] && typeof style[prefix + '_radius'] === 'object' ? style[prefix + '_radius'] : fallback.radius;
                return gradient_computer({ color_list: list, direction: style[prefix + '_direction'] || fallback.direction }) + background_computer({ background_img: img, background_img_style: style[prefix + '_background_img_style'] || '2' }) + (with_padding ? padding_computer(pad) : '') + radius_computer(radius) + 'box-sizing:border-box;';
            },
            block_fallback(theme, block) {
                const empty = { color_list: [{ color: '' }], direction: '90deg', padding: pad_of(0, 0, 0, 0), radius: corner(0) };
                if (block === 'stats') {
                    return theme === '0' ? { color_list: [{ color: 'rgba(247, 248, 250, 1)' }], direction: '90deg', padding: pad_of(12, 8, 12, 8), radius: corner(8) } : empty;
                }
                if (block === 'profile') {
                    if (theme === '4') {
                        return { color_list: [{ color: 'rgba(255, 255, 255, 1)' }], direction: '90deg', padding: pad_of(12, 12, 12, 12), radius: corner(12) };
                    }
                    if (theme === '5') {
                        return { color_list: [{ color: 'rgba(255, 255, 255, 1)' }], direction: '90deg', padding: pad_of(0, 0, 0, 0), radius: corner(12) };
                    }
                    return empty;
                }
                if (block === 'side') {
                    return { color_list: [{ color: 'rgba(255, 255, 255, 1)' }], direction: '90deg', padding: pad_of(12, 12, 12, 12), radius: corner(12) };
                }
                return { color_list: [{ color: 'rgba(255, 255, 255, 1)' }], direction: '180deg', padding: pad_of(12, 12, 12, 12), radius: corner(12) };
            },
            init() {
                const content = this.propValue.content || {};
                const style = this.propValue.style || {};
                const common_style = Object.assign({ color_list: [{ color: '' }], direction: '90deg', background_img: [], background_img_style: '0' }, style.common_style || {});
                if (!Array.isArray(common_style.background_img)) {
                    common_style.background_img = [];
                }
                const data = content.data || {};
                const theme = String(content.theme == null ? '0' : content.theme);
                const config = Array.isArray(content.config) ? content.config : ['order_count', 'goods_favor_count', 'goods_browse_count', 'integral_number'];
                const user_obj = data.user || null;
                const avatar = (user_obj && user_obj.avatar) || data.user_avatar || this.user.avatar;
                const user_name = (user_obj && user_obj.user_name_view) || data.user_name_view || this.user.user_name_view;
                const id_text = (user_obj && user_obj.number_code) || data.user_number_code || data.number_code || '';
                const name_color = ink(style.user_name_color, 'rgba(51, 51, 51, 1)');
                const light = String(name_color).indexOf('255, 255, 255') !== -1 || String(name_color).toLowerCase() === '#fff' || String(name_color).toLowerCase() === '#ffffff';
                const avatar_size = Number(style.user_avatar_size) || 60;
                const avatar_half = Math.round(avatar_size / 2);
                const img_size = Number(style.img_size) || 23;
                const img_space = Number(style.img_space) || 25;
                const stat_name = {
                    order_count: this.$t('diy.order_total'),
                    goods_favor_count: this.$t('diy.goods_favor'),
                    goods_browse_count: this.$t('diy.my_tracks'),
                    integral_number: this.$t('diy.my_integral'),
                };
                const stats = STATS.map((item) => ({
                    id: item.id,
                    name: stat_name[item.id] || item.name,
                    page: item.page,
                    value: data[item.id] != null && data[item.id] !== '' ? data[item.id] : '0',
                }));
                const show_stats = ['1', '2', '3'].indexOf(theme) !== -1 && stats.some((item) => config.indexOf(item.id) !== -1);
                const gold_list = [{ color: 'rgba(255, 196, 84, 1)' }, { color: 'rgba(255, 228, 160, 1)' }];
                const gold_pad = pad_of(4, 8, 4, 8);
                const gold_radius = corner(4);
                let id_pad = style.number_code_padding && typeof style.number_code_padding === 'object' ? style.number_code_padding : gold_pad;
                let id_radius = style.number_code_radius && typeof style.number_code_radius === 'object' ? style.number_code_radius : gold_radius;
                let id_list = Array.isArray(style.number_code_color_list) ? style.number_code_color_list : gold_list;
                let id_color = ink(style.number_code_color, 'rgba(120, 72, 16, 1)');
                const old_empty = id_list.length === 1 && !id_list[0].color && style.number_code_color === 'rgba(51, 51, 51, 1)';
                if (old_empty) {
                    id_list = gold_list;
                    id_pad = gold_pad;
                    id_radius = gold_radius;
                    id_color = 'rgba(120, 72, 16, 1)';
                }
                const code_prefix = content.number_code_prefix == null ? 'ID' : String(content.number_code_prefix);
                const member_code_text = id_text === '' ? '' : code_prefix === '' ? id_text : code_prefix + ' ' + id_text;
                const content_pad = style.content_padding && typeof style.content_padding === 'object' ? style.content_padding : pad_of(16, 16, 16, 16);
                const content_style = gradient_computer({ color_list: Array.isArray(style.content_color_list) ? style.content_color_list : [{ color: '' }], direction: style.content_direction || '90deg' }) + background_computer({ background_img: Array.isArray(style.content_background_img) ? style.content_background_img : [], background_img_style: style.content_background_img_style || '2' }) + padding_computer(content_pad) + radius_computer(style.content_radius && typeof style.content_radius === 'object' ? style.content_radius : zero_radius);
                const side = Array.isArray(content.side_list) && content.side_list.length > 0 ? content.side_list[0] : null;
                const side_title_color = ink(style.side_title_color == null ? style.entrance_title_color : style.side_title_color, 'rgba(51, 51, 51, 1)');
                const side_desc_color = ink(style.side_desc_color == null ? style.entrance_desc_color : style.side_desc_color, 'rgba(234, 126, 63, 1)');
                const entrance_pad = style.entrance_padding && typeof style.entrance_padding === 'object' ? style.entrance_padding : pad_of(12, 12, 12, 12);
                this.setData({
                    theme: theme,
                    config: config,
                    show_id: theme === '4' || theme === '5' || config.indexOf('number_code') !== -1,
                    show_stats: show_stats,
                    id_text: id_text,
                    member_code_text: member_code_text,
                    user_name: user_name,
                    avatar_src: avatar,
                    avatar_style: 'width:' + avatar_size * 2 + 'rpx;height:' + avatar_size * 2 + 'rpx;',
                    avatar_style_sm: 'width:' + Math.min(avatar_size, 48) * 2 + 'rpx;height:' + Math.min(avatar_size, 48) * 2 + 'rpx;',
                    icon_color: light ? '#ffffff' : '#666666',
                    icon_font_size: img_size * 2 + 'rpx',
                    icon_box_style: 'width:' + img_size * 2 + 'rpx;height:' + img_size * 2 + 'rpx;',
                    icon_gap_style: 'gap:' + img_space * 2 + 'rpx;',
                    icon_setting: Array.isArray(content.icon_setting) ? content.icon_setting : [],
                    stats_list: stats,
                    entrance_list: Array.isArray(content.entrance_list) ? content.entrance_list : [],
                    entrance_columns: content.entrance_layout === '1' ? 1 : 2,
                    entrance_icon_position: content.entrance_icon_position || 'right',
                    entrance_padding: entrance_pad,
                    entrance_bg_style: this.box_style(style, 'entrance', this.block_fallback(theme, 'entrance'), false),
                    entrance_title_style: 'color:' + ink(style.entrance_title_color, 'rgba(51, 51, 51, 1)') + ';font-size:' + (style.entrance_title_size || 14) * 2 + 'rpx;font-weight:bold;',
                    entrance_desc_style: 'color:' + ink(style.entrance_desc_color, 'rgba(234, 126, 63, 1)') + ';font-size:' + (style.entrance_desc_size || 11) * 2 + 'rpx;',
                    entrance_divider_v_color: style.entrance_divider_v_color || style.entrance_divider_color || 'rgba(240, 240, 240, 1)',
                    entrance_divider_v_width: style.entrance_divider_v_width != null ? Number(style.entrance_divider_v_width) : 1,
                    entrance_divider_v_margin: style.entrance_divider_v_margin && typeof style.entrance_divider_v_margin === 'object' ? style.entrance_divider_v_margin : { margin_top: 24, margin_bottom: 24, margin_left: 12, margin_right: 12 },
                    entrance_divider_h_color: style.entrance_divider_h_color || style.entrance_divider_color || 'rgba(240, 240, 240, 1)',
                    entrance_divider_h_height: style.entrance_divider_h_height != null ? Number(style.entrance_divider_h_height) : 1,
                    entrance_divider_h_margin: style.entrance_divider_h_margin && typeof style.entrance_divider_h_margin === 'object' ? style.entrance_divider_h_margin : { margin_top: 12, margin_bottom: 12, margin_left: 0, margin_right: 0 },
                    side_card: side,
                    side_page: side && side.link && side.link.page ? side.link.page : '',
                    side_box_style: this.box_style(style, 'side', this.block_fallback(theme, 'side'), true),
                    side_title_style: 'color:' + side_title_color + ';font-size:' + (style.side_title_size || style.entrance_title_size || 14) * 2 + 'rpx;font-weight:bold;',
                    side_desc_style: 'color:' + side_desc_color + ';font-size:' + (style.side_desc_size || style.entrance_desc_size || 11) * 2 + 'rpx;',
                    profile_box_style: this.box_style(style, 'profile', this.block_fallback(theme, 'profile'), true),
                    stats_box_style: this.box_style(style, 'stats', this.block_fallback(theme, 'stats'), true),
                    content_style: content_style,
                    theme5_wrap_style: content_style + 'padding-top:' + ((content_pad.padding_top || 0) + avatar_half) * 2 + 'rpx;',
                    theme5_avatar_style: 'width:' + avatar_size * 2 + 'rpx;height:' + avatar_size * 2 + 'rpx;top:-' + avatar_half * 2 + 'rpx;left:' + ((content_pad.padding_left || 14) * 2) + 'rpx;',
                    theme5_body_style: 'padding-left:' + (avatar_size + 26) * 2 + 'rpx;padding-right:28rpx;padding-top:32rpx;padding-bottom:32rpx;min-height:' + (avatar_half + 16) * 2 + 'rpx;',
                    user_name_style: 'color:' + name_color + ';font-size:' + (style.user_name_size || 16) * 2 + 'rpx;font-weight:' + (style.user_name_weight || 'bold') + ';',
                    number_code_style: gradient_computer({ color_list: id_list, direction: old_empty ? '90deg' : style.number_code_direction || '90deg' }) + 'color:' + id_color + ';font-size:' + (style.number_code_size || 12) * 2 + 'rpx;font-weight:' + (style.number_code_weight || 'bold') + ';box-sizing:border-box;' + padding_computer(id_pad) + radius_computer(id_radius),
                    stats_name_style: 'color:' + ink(style.stats_name_color, 'rgba(0, 0, 0, 1)') + ';font-size:' + (style.stats_name_size || 12) * 2 + 'rpx;font-weight:' + (style.stats_name_weight || '400') + ';',
                    stats_number_style: 'color:' + ink(style.stats_number_color, 'rgba(51, 51, 51, 1)') + ';font-size:' + (style.stats_number_size || 16) * 2 + 'rpx;font-weight:' + (style.stats_number_weight || 'bold') + ';',
                    style_container: common_styles_computer(common_style),
                    style_img_container: common_img_computer(common_style, this.propIndex),
                });
            },
            icon_page(item) {
                return item && item.link && item.link.page ? item.link.page : '';
            },
            url_event(e) {
                app.globalData.url_event(e);
            },
        },
    };
</script>
<style>
.id-chip {
    width: fit-content;
    max-width: 100%;
    box-sizing: border-box;
}
.stats-box,
.profile-box,
.top-card {
    box-sizing: border-box;
}
.head-row {
    margin-bottom: 40rpx;
}
.head-row-sm {
    margin-bottom: 36rpx;
}
.stats-gap {
    margin-bottom: 32rpx;
}
.profile-gap {
    margin-bottom: 32rpx;
}
.icon-top {
    margin-bottom: 16rpx;
}
.top-row {
    gap: 20rpx;
    margin-bottom: 24rpx;
}
.top-card {
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
    min-height: 144rpx;
}
.name-gap {
    margin-left: 20rpx;
}
.stat-num {
    margin-bottom: 12rpx;
}
.stat-num-sm {
    margin-bottom: 8rpx;
}
.side-title {
    margin-bottom: 8rpx;
}
.side-icon-row {
    margin-top: 12rpx;
}
.side-img,
.side-fallback {
    width: 72rpx;
    height: 72rpx;
}
.side-fallback {
    border-radius: 16rpx;
    background: linear-gradient(145deg, #fff3eb, #ffe4d4);
}
.profile-card {
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
    margin-bottom: 24rpx;
}
.avatar-float {
    position: absolute;
    z-index: 2;
    border: 2px solid #fff;
    background: #fff;
    box-sizing: content-box;
}
</style>
