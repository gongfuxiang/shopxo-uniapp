import { common_styles_computer, common_img_computer, gradient_handle, background_computer, padding_computer, radius_computer, margin_computer } from '@/common/js/common/common.js';

export function text_style(color, size, extra) {
    const n = Number(size);
    const font = Number.isFinite(n) && n > 0 ? 'font-size:' + n * 2 + 'rpx;' : '';
    const c = color ? 'color:' + color + ';' : '';
    return c + font + (extra || '');
}

export function field_on(content, key) {
    const list = content && content.field_show;
    if (!Array.isArray(list)) {
        return true;
    }
    return list.map(String).indexOf(String(key)) !== -1;
}

export function show_brief(content) {
    const list = content && content.field_show;
    if (Array.isArray(list) && list.length === 0) {
        return false;
    }
    if (content && content.brief_ready === '1') {
        return field_on(content, 'brief');
    }
    return true;
}

export function media_url(val) {
    if (!val) {
        return '';
    }
    if (typeof val === 'string') {
        return val;
    }
    if (Array.isArray(val)) {
        return media_url(val[0]);
    }
    if (typeof val === 'object') {
        return val.url || val.src || val.images || '';
    }
    return '';
}

export function icon_name(name, fallback) {
    const n = name == null || name === '' ? fallback : String(name);
    if (!n) {
        return '';
    }
    return n.indexOf('icon-') === 0 ? n : 'icon-' + n;
}

const indicator_positions = ['left-top', 'center-top', 'right-top', 'left-center', 'right-center', 'left-bottom', 'center-bottom', 'right-bottom'];
const indicator_legacy = {
    'bottom-left': 'left-bottom',
    'bottom-center': 'center-bottom',
    'bottom-right': 'right-bottom',
    'top-left': 'left-top',
    'top-center': 'center-top',
    'top-right': 'right-top',
};

export function indicator_layout(content, style, extra) {
    content = content || {};
    style = style || {};
    extra = extra || {};
    let type = String(content.indicator_type || 'dot');
    if (type !== 'line' && type !== 'number') {
        type = 'dot';
    }
    const vertical = type !== 'number' && String(content.indicator_direction) === 'vertical';
    let position = String(content.indicator_position || '');
    const align = String(content.indicator_align || '');
    if (indicator_legacy[position]) {
        position = indicator_legacy[position];
    }
    if (indicator_positions.indexOf(position) === -1) {
        if (position === 'right' || align === 'right') {
            position = 'right-center';
        } else if (position === 'top') {
            position = align === 'left' ? 'left-top' : align === 'right' ? 'right-top' : 'center-top';
        } else {
            position = 'center-bottom';
        }
    }
    if (type === 'line') {
        position = vertical ? (position.indexOf('right') === 0 ? 'right-center' : 'left-center') : (position.slice(-3) === 'top' ? 'center-top' : 'center-bottom');
    }
    const fallback = extra.gap == null ? 16 : extra.gap;
    let gap = style.indicator_bottom;
    if (gap == null || gap === '') {
        gap = fallback;
    }
    gap = Number(gap);
    if (!Number.isFinite(gap)) {
        gap = fallback;
    }
    const g = gap * 2;
    const bottom = (Number(extra.bottom) || 0) * 2;
    let box = 'position:absolute;z-index:2;display:flex;align-items:center;box-sizing:border-box;';
    let item = '';
    if (type === 'line' && !vertical) {
        const edge = position.slice(-3) === 'top' ? 'top:' + g + 'rpx;bottom:auto;' : 'bottom:' + (g + bottom) + 'rpx;top:auto;';
        box += edge + 'left:0;right:0;width:auto;height:auto;transform:none;flex-direction:row;padding:0 24rpx;gap:8rpx;';
        item = 'flex:1;width:auto;height:6rpx;min-width:0;border-radius:0;';
    } else if (type === 'line') {
        const side = position.indexOf('right') === 0 ? 'right:' + g + 'rpx;left:auto;' : 'left:' + g + 'rpx;right:auto;';
        box += 'top:0;bottom:' + bottom + 'rpx;' + side + 'width:auto;height:auto;transform:none;flex-direction:column;padding:24rpx 0;gap:8rpx;';
        item = 'width:6rpx;height:auto;flex:1 1 0;min-height:0;border-radius:0;';
    }
    return { type: type, vertical: vertical, box: box, item: item };
}

export function spec_active(item) {
    const value = item && item.is_active;
    return !(value == null || value === '' || value === false || value === 0 || value === '0');
}

function spec_flag(item, key) {
    const value = item && item[key];
    return !(value == null || value === '' || value === false || value === 0 || value === '0');
}

export function visible_sku(list, limit) {
    const items = Array.isArray(list) ? list : [];
    const shown = items.slice(0, limit);
    items.forEach((item, index) => {
        if (item && item.active && index >= limit) {
            shown.push(item);
        }
    });
    return shown;
}

export function goods_photos(goods) {
    const photo = goods && Array.isArray(goods.photo) ? goods.photo : [];
    const list = [];
    photo.forEach((item) => {
        const url = item && (item.images || item.url);
        if (url) {
            list.push(url);
        }
    });
    if (!list.length && goods && goods.images) {
        list.push(goods.images);
    }
    return list;
}

export function goods_view(goods) {
    goods = goods || {};
    const symbol = goods.show_price_symbol || '¥';
    const origin_symbol = goods.show_original_price_symbol || symbol;
    const price_on = goods.show_field_price_status == null || String(goods.show_field_price_status) === '1';
    const origin_on = goods.show_field_original_price_status == null || String(goods.show_field_original_price_status) === '1';
    const origin = goods.original_price;
    const show_origin = origin_on && origin != null && origin !== '' && Number(origin) !== 0;
    let label = goods.show_field_price_text || '售价';
    label = String(label).replace(/<[^>]+>/g, '');
    const tags = [];
    if (Array.isArray(goods.plugins_view_icon_data)) {
        goods.plugins_view_icon_data.forEach((item) => {
            if (item && item.name) {
                tags.push(item.name);
            }
        });
    }
    const choose = goods.specifications && Array.isArray(goods.specifications.choose) ? goods.specifications.choose : [];
    const sku = [];
    if (choose.length && Array.isArray(choose[0].value)) {
        choose[0].value.forEach((item) => {
            sku.push({ name: item.name || '', img: item.images || '', active: spec_active(item) });
        });
    }
    const earlier_active = [];
    choose.forEach((level, level_index) => {
        const values = level && Array.isArray(level.value) ? level.value : [];
        earlier_active[level_index] = values.some((item) => spec_active(item));
    });
    const levels = choose.map((level, level_index) => ({
        name: level.name || '',
        options: (Array.isArray(level.value) ? level.value : []).map((item) => {
            const active = spec_active(item);
            let disabled = spec_flag(item, 'is_disabled');
            let dont = spec_flag(item, 'is_dont');
            if (!active && !disabled && !dont && choose.length === 1 && item && item.is_only_level_one != null && parseInt(item.inventory || 0) <= 0) {
                disabled = true;
            }
            if (!active && !disabled && !dont && level_index > 0 && !earlier_active.slice(0, level_index).some(Boolean)) {
                dont = true;
            }
            return {
                name: item.name || '',
                img: item.images || '',
                active: active,
                disabled: disabled,
                dont: dont,
            };
        }),
    }));
    const score = goods.comments_score || {};
    const comments = Array.isArray(goods.comments_data) ? goods.comments_data : [];
    return {
        photos: goods_photos(goods),
        title: goods.title || '',
        brief: goods.simple_desc ? String(goods.simple_desc).replace(/<[^>]+>/g, '') : '',
        symbol: symbol,
        price: price_on ? String(goods.diy_spec_price != null ? goods.diy_spec_price : (goods.price != null ? goods.price : '')) : '',
        origin: goods.diy_spec_original_price != null ? (Number(goods.diy_spec_original_price) === 0 ? '' : String(goods.diy_spec_original_price)) : (show_origin ? String(origin) : ''),
        origin_symbol: origin_symbol,
        label: label,
        views: goods.access_count == null ? '' : String(goods.access_count),
        show_stock: goods.show_inventory_status == null || String(goods.show_inventory_status) === '1',
        show_sales: goods.show_sales_number_status == null || String(goods.show_sales_number_status) === '1',
        stock: goods.diy_spec_inventory != null ? String(goods.diy_spec_inventory) : (goods.inventory == null ? '' : String(goods.inventory)),
        sales: goods.sales_count == null ? '' : String(goods.sales_count),
        tags: tags,
        sku: sku,
        levels: levels,
        favored: String(goods.user_is_favor) === '1',
        params_base: goods.parameters && Array.isArray(goods.parameters.base) ? goods.parameters.base : [],
        params_detail: goods.parameters && Array.isArray(goods.parameters.detail) ? goods.parameters.detail : [],
        content_app: Array.isArray(goods.content_app) ? goods.content_app : [],
        content_web: goods.content_web || '',
        comments: comments,
        comment_count: goods.comments_count || comments.length || 0,
        comment_rate: score.rate == null ? 0 : score.rate,
        comment_avg: score.avg || score.score || '0',
    };
}

export function outer_style(style) {
    const common = style && style.common_style;
    if (!common) {
        return { container: '', img: '' };
    }
    return {
        container: common_styles_computer(common),
        img: common_img_computer(common),
    };
}

export function card_style(style) {
    style = style || {};
    const color_list = style.content_color_list || [];
    const has = Array.isArray(color_list) && color_list.some((item) => item && item.color);
    const bg = has ? gradient_handle(color_list, style.content_direction || '90deg') : 'background:#fff;';
    let bg_img = '';
    const imgs = style.content_background_img || [];
    if (Array.isArray(imgs) && imgs.length) {
        bg_img = background_computer({
            background_img: imgs,
            background_img_style: style.content_background_img_style || '2',
        });
    }
    const pad = style.content_padding ? padding_computer(style.content_padding) : '';
    const margin = style.content_margin ? margin_computer(style.content_margin) : '';
    const radius = style.content_radius ? radius_computer(style.content_radius) : '';
    return bg + bg_img + pad + margin + radius + 'box-sizing:border-box;overflow:hidden;';
}

function gap_num(value, fallback) {
    if (value == null || value === '') {
        return fallback;
    }
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
}

export function price_pack(style) {
    style = style || {};
    const accent = style.accent_color || style.price_color || '#ff4d4f';
    const brief_gap = gap_num(style.brief_gap, 6) * 2;
    const meta_gap = gap_num(style.meta_gap, 8) * 2;
    const sku_gap = gap_num(style.sku_gap, 12) * 2;
    return {
        accent: accent,
        price: text_style(accent, style.price_size || 22, 'font-weight:bold;line-height:1.1;'),
        symbol: text_style(style.price_symbol_color || accent, style.price_symbol_size || 14, 'line-height:1.1;'),
        market: text_style(style.market_price_color || '#999', style.market_price_size || 12, 'text-decoration:line-through;'),
        label: text_style(style.price_label_color || accent, style.price_label_size || 11),
        title: text_style(style.title_color || '#333', style.title_size || 14, 'font-weight:' + (style.title_weight || 'bold') + ';line-height:1.45;'),
        brief: text_style(style.brief_color || 'rgba(153, 153, 153, 1)', style.brief_size || 12, 'line-height:1.5;margin-top:' + brief_gap + 'rpx;'),
        meta: text_style(style.meta_color || '#999', style.meta_size || 11),
        meta_gap: meta_gap,
        tag: text_style(style.tag_color || accent, style.tag_size || 10) + 'border:1px solid ' + (style.tag_border_color || style.tag_color || accent) + ';background:' + (style.tag_bg_color || '#fff') + ';' + (style.tag_radius ? radius_computer(style.tag_radius) : 'border-radius:6rpx;') + (style.tag_padding ? padding_computer(style.tag_padding) : 'padding:4rpx 12rpx;'),
        member: 'background:' + (style.member_tag_bg || accent) + ';color:' + (style.member_tag_color || '#fff') + ';' + text_style('', style.member_tag_size || 10) + (style.member_tag_radius ? radius_computer(style.member_tag_radius) : 'border-radius:8rpx;') + (style.member_tag_padding ? padding_computer(style.member_tag_padding) : 'padding:4rpx 12rpx;'),
        action: text_style(style.action_color || '#999', style.action_size || 10),
        action_color: style.action_color || '#999',
        action_icon: ((Number(style.action_icon_size) || 18) * 2) + 'rpx',
        divider: 'background:' + (style.divider_color || 'rgba(247,247,247,1)') + ';height:1px;margin:' + meta_gap + 'rpx 0;',
        sku_gap: sku_gap,
        sku_divider: 'background:' + (style.sku_divider_color || style.divider_color || 'rgba(247,247,247,1)') + ';height:1px;margin:' + sku_gap + 'rpx 0;',
    };
}

export function hero_height(style) {
    const mode = String((style && style.hero_height_mode) || 'square');
    if (mode === 'square') {
        return '750rpx';
    }
    if (mode === 'screen') {
        const ratio = Number(style.hero_height_ratio);
        const percent = Number.isFinite(ratio) && ratio > 0 ? ratio : 50;
        let window_height = 667;
        try {
            window_height = uni.getSystemInfoSync().windowHeight || window_height;
        } catch (e) {}
        return (window_height * percent / 100) + 'px';
    }
    const h = Number(style && style.hero_height);
    const height = Number.isFinite(h) && h > 0 ? h : 375;
    return height * 2 + 'rpx';
}

export function page_vm() {
    const pages = getCurrentPages();
    const cur = pages && pages.length ? pages[pages.length - 1] : null;
    return cur && (cur.$vm || cur);
}

export function on_goods_detail_page() {
    const pages = getCurrentPages();
    const cur = pages && pages.length ? pages[pages.length - 1] : null;
    const route = cur && (cur.route || '');
    return String(route).indexOf('goods-detail') !== -1;
}

export function open_spec() {
    const page = page_vm();
    if (page && typeof page.nav_buy_submit_event === 'function') {
        page.nav_buy_submit_event({ type: 'spec-show' });
    }
}

export function call_page(name, e) {
    const page = page_vm();
    if (page && typeof page[name] === 'function') {
        page[name](e);
    }
}

export function preview_photos(photos, index) {
    if (!photos || !photos.length) {
        return;
    }
    uni.previewImage({
        current: photos[index] || photos[0],
        urls: photos,
    });
}

export function open_comments(goods) {
    if (!goods || !goods.id) {
        return;
    }
    uni.navigateTo({
        url: '/pages/goods-comment/goods-comment?goods_id=' + goods.id,
    });
}
