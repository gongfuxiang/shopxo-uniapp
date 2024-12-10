const app = getApp();
/**
 * 判断一个对象是否为空。
 *
 * 为空的定义是对象的键的数量为0。这适用于任何对象，包括普通对象、数组（视为对象）等。
 * 该函数不直接使用`Object.keys(obj).length === 0`进行判断，而是通过封装这个逻辑来提供一个独立的、可重用的函数。
 * 这样做可以增加代码的可读性和可维护性，并且抽象了对象为空的检查，使得调用者不需要关心具体的实现细节。
 *
 * @param obj 要检查的对象。可以是任何类型的对象，包括数组。
 * @returns 如果对象为空，则返回true；否则返回false。
 */
export function is_obj_empty(obj) {
    return Object.keys(obj).length === 0;
}

/**
 * 获取嵌套对象的属性值
 * 
 * 该函数旨在通过指定的属性路径获取嵌套对象中的属性值它接受一个对象和一个属性路径字符串作为参数，
 * 并返回对应路径的属性值如果输入的路径无效或对象中不存在该路径，则返回空字符串
 * 
 * @param {Object} obj - 要从中获取属性的嵌套对象
 * @param {string} path - 属性路径，使用点号分隔的字符串表示
 * @returns {string} - 返回指定路径的属性值，如果路径无效则返回空字符串
 */
export function get_nested_property(obj, path) {
    // 检查路径参数是否为字符串且非空，若不满足条件则返回空字符串
    if (typeof path !== 'string' || !path) return '';
    
    // 将属性路径字符串拆分为属性键数组
    const keys = path.split('.');
    
    // 使用reduce方法遍历属性键数组，逐层访问对象属性
    // 如果当前对象存在且拥有下一个属性键，则继续访问；否则返回空字符串
    return keys.reduce((o, key) => (o && o[key] ? o[key] : ''), obj) || '';
}

/**
 * 根据数据源链接ID和属性源列表生成自定义链接
 * 
 * @param {string} data_source_link_id - 数据源链接ID，可以是单个ID或多个ID以分号分隔
 * @param {object} propSourceList - 包含数据源的属性列表
 * @param {object} source_link_option - 链接生成的可选配置，包括首尾添加的字符串和连接符
 * @returns {string} 生成的自定义链接URL
 */
export function get_custom_link(data_source_link_id, propSourceList, source_link_option) {
    let url = '';
    if (!data_source_link_id) {
        return '';
    }
    // 判断数据源链接ID是否包含分号，包含则表示有多个ID
    if (data_source_link_id.includes(';')) {
        // 分割数据源链接ID，处理多个ID
        const ids = data_source_link_id.split(';');
        let source_url = '';
        // 遍历每个ID，获取对应的属性值并拼接成URL
        ids.forEach((item, index) => {
            // 判断数据源列表是否为空
            if (!isEmpty(propSourceList.data)) {
                // 从数据源列表的data属性中获取嵌套属性值，并使用指定的连接符连接
                source_url += get_nested_property(propSourceList.data, item) + (index != ids.length -1 ? (source_link_option?.join || '') : '');
            } else {
                // 直接从数据源列表中获取嵌套属性值，并使用指定的连接符连接
                source_url += get_nested_property(propSourceList, item) + (index != ids.length -1 ? (source_link_option?.join || '') : '');
            }
        });
        url = source_url;
    } else {
        // 处理单个ID的情况
        if (!isEmpty(propSourceList.data)) {
            // 从数据源列表的data属性中获取嵌套属性值作为URL
            url = get_nested_property(propSourceList.data, data_source_link_id);
        } else {
            // 直接从数据源列表中获取嵌套属性值作为URL
            url = get_nested_property(propSourceList, data_source_link_id);
        }
    }
    // 返回最终的URL，添加首尾的可选字符串
    return (source_link_option?.first || '') + url + (source_link_option?.last || '');
}

/**
 * 指示器的样式
 *
 * @param style_object 样式对象
 * @returns 返回对应的值
 */
export function get_indicator_style(style_object) {
    const { indicator_radius, indicator_style, indicator_size, color, indicator_new_location } = style_object;
    let styles = '';
    if (!isEmpty(indicator_radius)) {
        styles += radius_computer(indicator_radius);
    }
    // 数字类型的指示器
    if (indicator_style == 'num') {
        styles += `color: ${color || '#DDDDDD'};`;
        styles += `font-size: ${indicator_size * 2}rpx;`;
    } else if (indicator_style == 'elliptic') {
        // 宽的指示器，按照宽高1:3 来计算
        styles += `background: ${color || '#DDDDDD'};`;
        if (['left', 'right'].includes(indicator_new_location)) {
            styles += `width: ${indicator_size * 2 }rpx; height: ${indicator_size * 6}rpx;`;
        } else {
            styles += `width: ${indicator_size * 6}rpx; height: ${indicator_size * 2}rpx;`;
        }
    } else {
        // 圆点指示器
        styles += `background: ${color || '#DDDDDD'};`;
        styles += `width: ${indicator_size * 2}rpx; height: ${indicator_size * 2}rpx;`;
    }
    return styles;
}
/**
 * 指示器的位置处理
 *
 * @param style_object 样式对象
 * @returns 返回对应的值
 */
export function get_indicator_location_style(style_object) {
    const { indicator_new_location,  indicator_location, indicator_bottom } = style_object;
    let styles = '';
    if (['left', 'right'].includes(indicator_new_location)) {
        if (indicator_location == 'flex-start') {
            styles += `top: 0px;`;
        } else if (indicator_location == 'center') {
            styles += `top: 50%; transform: translateY(-50%);`;
        } else {
            styles += `bottom: 0px;`;
        }
    } else {
        if (indicator_location == 'flex-start') {
            styles += `left: 0px;`;
        } else if (indicator_location == 'center') {
            styles += `left: 50%; transform: translateX(-50%);`;
        } else {
            styles += `right: 0px;`;
        }
    }
    // 如果有位置的处理，就使用指示器的位置处理，否则的话就用下边距处理
    styles += `${ !isEmpty(indicator_new_location) ? `${indicator_new_location}: ${ indicator_bottom }px;` : `bottom: ${ indicator_bottom }px;` }`;
    return styles;
};

/**
 * 判断对象数组等是否为空。
 */
export function isEmpty(value) {
    return (
        value === null ||
        value === undefined ||
        value === '' ||
        value === NaN ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === 'object' && Object.keys(value).length === 0)
    )
}
/**
 * 检查给定的参数是否为对象
 *
 * 此函数用于精确地验证一个变量是否为对象类型它通过以下步骤实现：
 * 1. 特殊处理 `null` 值，因为 `null` 在 JavaScript 中被当作对象处理，但实质上它不是
 * 2. 使用 `typeof` 操作符初步判断变量是否为对象
 * 3. 使用 `Object.prototype.toString.call(obj)` 方法精确判断变量是否为普通的对象
 *
 * @param obj 未知类型的参数，待检查是否为对象
 * @returns 如果参数是对象，则返回 true；否则返回 false
 */
export function is_obj(obj) {
    // 特殊处理 null值，因为 typeof null 返回 "object"，但 null 并不是我们要检查的对象
    if (obj === null) return false;
    // 使用 typeof 排除非对象类型
    if (typeof obj !== 'object') return false;
    // 确认是普通对象
    return Object.prototype.toString.call(obj) === '[object Object]';
}
/**
 * 渐变色的方法
 * color_list: [] 渐变色的存储
 * direction 渐变色的角度
 * @param {string[], string} path
 * @returns {string}
 */
export function gradient_computer(new_style, is_return_all = true) {
    let color_list = new_style.color_list;
    let direction = new_style.direction;
    return gradient_handle(color_list, direction, is_return_all);
}
/**
 * 根据给定的颜色列表和方向生成一个线性渐变的CSS样式字符串。
 *
 * @param color_list 颜色列表，包含渐变中的各个颜色值。
 * @param direction 渐变的方向，可以是角度或其他CSS支持的渐变方向。
 * @param is_return_all 是否返回所有样式，包括渐变类型、颜色列表和方向。默认为false，只返回渐变样式。
 * @returns 返回一个字符串，包含生成的线性渐变样式。
 */
export function gradient_handle(color_list, direction, is_return_all = true) {
    let container_common_styles = ``;
    if (color_list && color_list.length > 0) {
        if (is_return_all) {
            container_common_styles += `background:`;
        }
        container_common_styles += `linear-gradient(${direction || '180deg'},`;
        const new_color_list = JSON.parse(JSON.stringify(color_list));
        new_color_list.forEach((item, index) => {
            container_common_styles += `${item.color ? item.color : 'rgb(255 255 255 / 0%)'}`;
            if (color_list.length == 1) {
                container_common_styles += ` ${item.color_percentage || 0}%, ${item.color} 100%`;
            } else {
                if (typeof item.color_percentage === 'number') {
                    if (index == color_list.length - 1) {
                        container_common_styles += ` ${item.color_percentage}%`;
                    } else {
                        container_common_styles += ` ${item.color_percentage}%,`;
                    }
                } else {
                    if (index == color_list.length - 1) {
                        container_common_styles += ` 100%`;
                    } else if (index == 0) {
                        container_common_styles += ` 0%,`;
                    } else {
                        container_common_styles += ` ${(100 / color_list.length) * index}%,`;
                    }
                }
            }
        });
        container_common_styles += `)`;
        if (is_return_all) {
            container_common_styles += `;`;
        }
    }
    return container_common_styles;
}
/**
 * 设置内边距的方法
 * new_style: 内边距的集合
 * @param {string[], string} path
 * @returns {string}
 */
export function padding_computer(new_style, scale = 1, is_custom = false, index) {
    if (new_style) {
        if (!is_custom) {
            let padding_top = '';
            if (index == 0) {
                // 状态栏高度
                var bar_height = parseInt(app.globalData.get_system_info('statusBarHeight', 0));
                // #ifdef MP-TOUTIAO
                bar_height = 0;
                // #endif
                let sticky_top = 0;
                // #ifdef MP
                sticky_top = bar_height + 5 + 10;
                // #endif
                // #ifdef H5 || MP-TOUTIAO
                sticky_top = bar_height + 7 + 10;
                // #endif
                // #ifdef APP
                sticky_top = bar_height + 0 + 10;
                // #endif
                padding_top = `padding-top:calc(${new_style.padding_top * 2 || 0}rpx + ${sticky_top}px);`;
            }
            return `padding: ${new_style.padding_top * 2 || 0}rpx ${new_style.padding_right * 2 || 0}rpx ${new_style.padding_bottom * 2 || 0}rpx ${new_style.padding_left * 2 || 0}rpx;` + padding_top;
        } else {
            return `padding: ${new_style.padding_top * scale || 0}px ${new_style.padding_right * scale || 0}px ${new_style.padding_bottom * scale || 0}px ${new_style.padding_left * scale || 0}px;`;
        }
    } else {
        return '';
    }
}
/**
 * 设置外边距的方法
 * new_style: 外边距的集合
 * @param {string[], string} path
 * @returns {string}
 */
export function margin_computer(new_style) {
    return `margin: ${new_style.margin_top * 2 || 0}rpx ${new_style.margin_right * 2 || 0}rpx ${new_style.margin_bottom * 2 || 0}rpx ${new_style.margin_left * 2 || 0}rpx;`;
}
/**
 * 设置圆角的方法
 * new_style: 外边距的集合
 * @param {string[], string} path
 * @returns {string}
 */
export function radius_computer(new_style, scale = 1, is_custom = false) {
    if (new_style) {
        if (!is_custom) {
            return `border-radius: ${new_style.radius_top_left * 2 || 0}rpx ${new_style.radius_top_right * 2 || 0}rpx ${new_style.radius_bottom_right * 2 || 0}rpx ${new_style.radius_bottom_left * 2 || 0}rpx;`;
        } else {
            return `border-radius: ${new_style.radius_top_left * scale || 0}px ${new_style.radius_top_right * scale || 0}px ${new_style.radius_bottom_right * scale || 0}px ${new_style.radius_bottom_left * scale || 0}px;`;
        }
    } else {
        return '';
    }
}
/**
 * 设置阴影样式
 * new_style: 外边距的集合
 * @param {string[], string} path
 * @returns {string}
 */
export function box_shadow_computer(new_style) {
    return `box-shadow: ${new_style.box_shadow_x * 2 || 0}rpx ${new_style.box_shadow_y * 2 || 0}rpx ${new_style.box_shadow_blur * 2 || 0}rpx ${new_style.box_shadow_spread * 2 || 0}rpx ${new_style.box_shadow_color || 'rgba(0,0,0,0)'};`;
}
/**
 * 设置阴影样式
 * new_style: 外边距的集合
 * @param {string[], string} path
 * @returns {string}
 */
export function background_computer(new_style) {
    if (new_style.background_img.length > 0) {
        let url_styke = '';
        if (new_style.background_img_style == '1') {
            url_styke = 'background-repeat: repeat;';
        } else if (new_style.background_img_style == '2') {} else {
            url_styke = `background-repeat: no-repeat;background-position: center;`;
        }
        switch (new_style.background_img_style) {
            case '1':
                url_styke = `background-repeat: no-repeat;background-position: bottom;background-size: 100% auto;`;
                break;
            case '2':
                url_styke = `background-repeat: no-repeat;background-position: center;background-size: 100% auto;`;
                break;
            case '3':
                url_styke = 'background-repeat: repeat;';
                break;
            case '4':
                url_styke = 'background-size: cover;background-position: center;';
                break;
            default:
                url_styke = `background-repeat: no-repeat;background-position: top;background-size: 100% auto;`;
                break;
        }
        return `background-image:url(${new_style.background_img[0].url});${url_styke}`;
    } else {
        return '';
    }
}
/**
 * 计算并组合组件的常用样式。
 *
 * 该函数通过调用一系列特定样式的计算函数，来组装一个组件的常用样式字符串。
 * 这些样式包括渐变色、内边距、外边距、圆角和阴影等，为组件提供了一套完整的外观定义。
 *
 * @param new_style  组件的新样式对象，包含了需要计算的样式属性。
 * @returns 返回一个字符串，包含了计算后的样式定义，可以被直接应用于组件的样式属性。
 */
export function common_styles_computer(new_style) {
    return gradient_computer(new_style) + margin_computer(new_style) + radius_computer(new_style) + box_shadow_computer(new_style) + `overflow:hidden;`;
}
export function common_img_computer(new_style, index, bool) {
    return padding_computer(new_style, 1, false, index, bool) + background_computer(new_style) + `overflow:hidden;box-sizing: border-box;`;
}
/**
 * 生成一个随机数学字符串。
 * @returns {string} 一个6位的36进制随机字符串。
 */
export function get_math() {
    // 通过Math.random()生成随机数，并转换为36进制的字符串
    let randomString = Math.random().toString(36);
    // 确保随机字符串至少有6位，因为substring(2)可能会使短于6位的字符串产生错误。
    // 如果字符串长度不足6位，通过padStart将其前面填充为0，直到长度达到6位。
    randomString = randomString.length >= 6 ? randomString : randomString.padStart(6, '0');
    // 截取掉随机字符串开头的'0.'部分，获得最终的6位随机字符串。
    return randomString.substring(2);
}
/**
 * 将大小计算成百分比
 *
 * @param num 当前的大小或位置。
 * @param size 容器的大小。
 * @returns 计算后的百分比值，含4位小数
 */
export const percentage_count = (num, container_size) => {
    const marks = (num / container_size) * 100;
    return marks.toFixed(4) + '%';
};