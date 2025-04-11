const app = getApp();
// 数据的默认值，避免没有值的时候报错
export const old_radius = { radius: 0, radius_top_left: 0, radius_top_right: 0, radius_bottom_left: 0, radius_bottom_right: 0 };
export const old_padding = { padding: 0, padding_top: 0, padding_bottom: 0, padding_left: 0, padding_right: 0 };
export const old_margin = { margin: 0, margin_top: 0, margin_bottom: 0, margin_left: 0, margin_right: 0 };
export const old_border_and_box_shadow = { border_is_show: '0', border_color: '#FF3F3F', border_style: 'solid',border_size: { padding: 1, padding_top: 1, padding_right: 1, padding_bottom: 1, padding_left: 1, }, box_shadow_color: '', box_shadow_x: 0, box_shadow_y: 0, box_shadow_blur: 0, box_shadow_spread: 0 };

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

export const border_width = (style) => {
    if (!style) { return 0; }
    if (style.border_is_show == '1') {
        const { padding_left = 0, padding_right = 0 } = style.border_size || {};
        return padding_left + padding_right;
    } else {
        return 0;
    }
}

/**
 * 根据指定的条件类型和值，判断字段值是否满足条件
 * @param fieldValue 字段值，可以是任何类型
 * @param type 条件类型，如'contains', 'is-empty', 'greater-than'等
 * @param value 用于比较的值，可以是数字或字符串
 * @returns 返回一个布尔值，表示字段值是否满足指定的条件
 */
export const custom_condition_judg = (fieldValue, type, value) => {
    // 处理 null 或 undefined 的情况
    if (fieldValue == null) {
        return true;
    }

    // 提前计算并缓存转换结果
    const stringValue = String(fieldValue);
    const valueStr = String(value);
    const numberValue = Number(value);
    switch (type) {
        case 'contains':
        case 'does-not-contain':
            // 处理包含和不包含的逻辑, 如果值为空，直接返回为空
            if (!isEmpty(valueStr)) {
                const result = stringValue.includes(valueStr);
                return type === 'contains' ? result : !result;
            } else {
                return true;
            }
        case 'is-empty':
        case 'is-not-empty':
            // 处理为空和不为空的逻辑
            const is_Empty = ['', '{}', '[]'].includes(stringValue.trim()) || (Array.isArray(fieldValue) && fieldValue.length === 0);
            return type === 'is-empty' ? is_Empty : !is_Empty;
        case 'greater-than':
        case 'less-than':
        case 'equal':
            // 根据字段值的类型，进行数字间的比较
            if (typeof fieldValue === 'number' || (typeof fieldValue === 'string' && isPureNumber(fieldValue))) {
                return compare_numbers(Number(fieldValue), numberValue, type);
            } else if (Array.isArray(fieldValue) || (typeof fieldValue === 'string' && !isPureNumber(fieldValue))) {
                // 如果字段值是数组或字符串，比较数组长度和指定值
                const valueLength = fieldValue?.length || 0;
                return compare_numbers(valueLength, numberValue, type);
            } else if (typeof fieldValue === 'object') {
                // 如果字段值是对象，比较对象的属性值
                const numericFieldValue = Object.keys(fieldValue)?.length || 0;
                return compare_numbers(numericFieldValue, numberValue, type);
            }
        default:
            return true;
    }
}

// 判断是否是纯数字
function isPureNumber(input) {
    return /^\d+$/.test(input);
}

/**
 * 比较两个数字的大小
 * @param a 第一个数字
 * @param b 第二个数字
 * @param type 比较类型，如'greater-than', 'less-than', 'equal'等
 * @returns 根据比较类型返回比较结果
 */
const compare_numbers = (a, b, type) => {
    switch (type) {
        case 'greater-than': return a > b;
        case 'less-than': return a < b;
        case 'equal': return a === b;
        default: return false;
    }
}

/**
 * 根据新的样式对象计算指示器的位置样式
 * 
 * 此函数根据指示器的新位置和当前位置以及底部距离来生成相应的CSS样式
 * 它处理的是一个包含指示器位置信息的对象，并返回一个字符串形式的CSS样式
 * 
 * @param new_style 包含指示器新位置和当前位置及底部距离的样式对象
 * @returns 返回计算出的指示器位置CSS样式字符串
 */
export const get_indicator_location = (new_style) => {
    // 解构指示器的位置信息
    const { indicator_new_location = '',  indicator_location = '', indicator_bottom = 0 } = new_style;
    let styles = '';
    // 根据指示器的新位置是水平方向（left或right）还是垂直方向（默认）来决定如何设置样式
    if (['left', 'right'].includes(indicator_new_location)) {
        // 如果是水平方向，根据指示器的当前位置设置top、center或bottom样式
        if (indicator_location == 'flex-start') {
            styles += `top: 0px;`;
        } else if (indicator_location == 'center') {
            styles += `top: 50%; transform: translateY(-50%);`;
        } else {
            styles += `bottom: 0px;`;
        }
    } else {
        // 如果是垂直方向，根据指示器的当前位置设置left、center或right样式
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
    // 返回计算出的指示器位置样式
    return styles;
}

/**
 * 判断给定条件是否符合资格，主要用于自定义内部各个组件是否符合显示条件
 * @param field_list 字段列表，包含各个字段的数据
 * @param condition 条件数据，包括字段、类型和值
 * @param props 额外属性，包含自定义组和数据源等信息
 * @returns 返回一个布尔值，表示是否符合条件
 */
export const get_is_eligible = (field_list, condition, sourceList, isCustom, isCustomGroup, customGroupFieldId) => {
    try {
        // 条件加特殊标识，避免选择的时候出现重复的
        let new_field = condition.field;
        // 如果包含{|}，则取第一个字段
        if (condition.field.includes('{|}')) {
            new_field = condition.field.split('{|}')[0];
        }
        // 获取对应条件字段的字段数据
        let option = {};
        if (field_list) {
            // 判断是否是自定义组并且 自定义组选则了对应的数据源
            if (isCustomGroup && !isEmpty(customGroupFieldId)) {
                // 取出对应自定义组的内容
                const group_option_list = field_list.find(item => item.field === customGroupFieldId);
                // 取出自定义组内部数据源参数的详细数据
                const new_field_list = group_option_list?.data || [];
                // 通过对应条件，筛选出对应的数据
                option = new_field_list.find(item => item.field === new_field);
            } else {
                option = field_list.find(item => item.field === new_field);
            }
        }
        // 找不到对应的字段，就直接返回为成功，条件不存在
        if (!isEmpty(option)) {
            // 获取到字段的真实数据, option的使用主要是为了获取的他的中间参数和前缀，后缀等拼接在一起
            const field_value = custom_condition_data(new_field || '', option || {}, sourceList, isCustom);
            // 判断条件字段是否为空并且是显示面板才会生效，则直接返回true
            if (!isEmpty(new_field) && !isEmpty(condition.type)) {
                return custom_condition_judg(field_value, condition.type, condition.value);
            } else {
                return true;
            }
        } else {
            return true;
        }
    } catch (error) {
        return true; // 或者根据业务需求返回适当的默认值
    }
}

/**
 * 根据数据源ID和配置选项来处理和返回特定格式的数据
 * 
 * @param data_source_id 数据源ID字符串，可以包含多个用分号分隔的ID
 * @param option 配置选项，包含数据处理的额外参数
 * @param sourceList 数据源列表，用于查找和处理数据
 * @param isCustom 是否为自定义模式，用于确定数据处理的方式
 * @returns 返回处理后的数据字符串
 */
export const custom_condition_data = (data_source_id, option, sourceList, isCustom) => {
    let data_value = '';
    if (data_source_id.includes(';')) {
        // 当数据源ID包含多个用分号分隔的ID时
        // 取出所有的字段，使用;分割
        const ids = data_source_id.split(';');
        let text = '';
        // 遍历每个ID，处理数据并合并
        ids.forEach((item, index) => {
            text += data_handling(item, sourceList, isCustom) + (index != ids.length - 1 ? (option?.join || '') : '');
        });
        data_value = text;
    } else {
        // 不输入商品， 文章和品牌时，从外层处理数据
        // 当数据源ID不包含分号时，直接处理数据
        data_value = data_handling(data_source_id, sourceList, isCustom);
    }
    // 如果数据是undefined或者null，则设置为空字符串
    if (data_value == null) {
        data_value = '';
    }
    // 根据配置选项，添加前缀和后缀到处理后的数据
    return Array.isArray(data_value) || typeof data_value === "object" ? data_value : ((option?.first || '') + data_value + (option?.last || ''));
}

/**
 * 数据处理函数
 * 该函数根据数据源ID和一个数据对象，返回对应的图标路径
 * 主要用于从复杂的数据结构中提取图标信息，根据是否是自定义图标，
 * 从不同的数据层级中获取信息
 * 
 * @param data_source_id 数据源ID，用于定位图标在数据结构中的位置
 * @param sourceList 包含图标数据的对象，可以是多层嵌套结构
 * @param isCustom 布尔值，指示是否为自定义图标，影响数据获取的方式
 * @returns 返回找到的图标路径，如果没有找到或数据为空，则返回空值
 */
const data_handling = (data_source_id, sourceList, isCustom) => {
    // 不输入商品， 文章和品牌时，从外层处理数据
    let new_data = get_nested_property(sourceList, data_source_id);
    // 如果是商品,品牌，文章的图片， 其他的切换为从data中取数据
    if (!isEmpty(sourceList.data) && isCustom) {
        new_data = get_nested_property(sourceList.data, data_source_id);
    }
    return new_data;
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
    return keys.reduce((o, key) => (o != null && o[key] != null ? o[key] : ''), obj) ?? '';
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
                container_common_styles += ` ${item.color_percentage || 0}%, ${item.color ? item.color : 'rgb(255 255 255 / 0%)'} 100%`;
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
            return `padding: ${new_style.padding_top * 2 || 0}rpx ${new_style.padding_right * 2 || 0}rpx ${new_style.padding_bottom * 2 || 0}rpx ${new_style.padding_left * 2 || 0}rpx;box-sizing: border-box;` + padding_top;
        } else {
            return `padding: ${new_style.padding_top * scale || 0}px ${new_style.padding_right * scale || 0}px ${new_style.padding_bottom * scale || 0}px ${new_style.padding_left * scale || 0}px;box-sizing: border-box;`;
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
 * 计算并返回边框的样式字符串
 * 
 * 此函数根据传入的新样式对象，决定是否显示边框以及边框的样式细节
 * 如果边框需要显示，函数会构造相应的边框样式字符串，包括边框的宽度、样式和颜色；
 * 如果边框不需要显示，则返回空字符串
 * 
 * @param {Object} new_style - 新样式对象，包含边框的相关属性
 * @returns {String} 边框样式字符串或空字符串
 */
export const border_computer = (new_style) => {
    // 从新样式对象中解构边框的相关属性，并设置默认值
    const { border_is_show = '0', border_color = '', border_style = 'solid', border_size = { padding: 0, padding_bottom: 0, padding_left: 0, padding_right: 0, padding_top: 0 } } = new_style;
    
    // 根据边框是否需要显示的标志，决定是否构造并返回边框样式字符串
    if (border_is_show == '1') {
       return `border-width: ${border_size.padding_top}px ${border_size.padding_right}px ${border_size.padding_bottom}px ${border_size.padding_left}px;border-style: ${ border_style };border-color: ${border_color};box-sizing: border-box;`
    }
    
    // 如果边框不需要显示，返回空字符串
    return '';
};

/**
 * 计算并组合组件的常用样式。
 *
 * 该函数通过调用一系列特定样式的计算函数，来组装一个组件的常用样式字符串。
 * 这些样式包括渐变色、内边距、外边距、圆角和阴影等，为组件提供了一套完整的外观定义。
 *
 * @param new_style  组件的新样式对象，包含了需要计算的样式属性。
 * @param scale      一个缩放比例，用于控制样式的缩放，默认为1。
 * @param scale      用于控制样式的缩放比例，默认为1，表示不进行缩放。
 * @param is_custom  一个布尔值，用于判断是否为自定义样式，默认为false。
 * @param index      用于标识组件的索引，默认为0。
 * @returns 返回一个字符串，包含了计算后的样式定义，可以被直接应用于组件的样式属性。
 */
export function common_styles_computer(new_style) {
    return gradient_computer(new_style) + margin_computer(new_style) + radius_computer(new_style) + box_shadow_computer(new_style) + border_computer(new_style) + `overflow:hidden;`;
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

/**
 * 计算当前偏移量
 *
 * @param size 当前的组件的大小宽或者高。
 * @param location 容器的位置的偏移量。
 * @param container_size 对应位置的容器的大小
 * @returns 偏移量
 */
export const location_compute = (size, location, container_size) => {
    if (size + location >= container_size) {
        const deviation = container_size - size;
        if (deviation >= 0) {
            return deviation;
        } else {
            return 0;
        }
    } else {
        return location;
    }
};


/**
 * 获取轮播列表
 * 该函数根据输入的列表和数字，以及可选的判断标志，返回一个经过处理的列表
 * 主要用于处理轮播图的数据显示逻辑，可以根据不同的滑动方式（分页滑动或翻译滑动）来处理数据
 * 
 * @param {Array} list - 原始的轮播图列表，包含多个轮播项
 * @param {Number} num - 每页显示的轮播项数量，或者在翻译滑动模式下使用的数字
 * @param {Number} rolling_fashion - 滑动切换的方式，分页滑动或平移滑动
 * @param {Boolean} judgment - 可选参数，默认为true如果为true，则根据分页滑动方式处理数据；如果为false，则根据翻译滑动方式处理数据
 * @returns {Array} - 返回一个处理后的列表，每个元素包含一个split_list属性，该属性是一个数组，包含当前页的轮播项
 */
export const get_swiper_list = (list, num, rolling_fashion, judgment = true) => {
    // 深拷贝一下，确保不会出现问题
    const cloneList = JSON.parse(JSON.stringify(list));
    // 判断滑动方式如果不是翻译滑动并且judgment为true时，按照分页滑动处理
    if (rolling_fashion != 'translation' && judgment) {
        // 如果是分页滑动情况下，根据选择的行数和每行显示的个数来区分具体是显示多少个
        if (cloneList.length > 0) {
            // 存储数据显示
            let nav_list = [];
            // 拆分的数量
            const split_num = Math.ceil(cloneList.length / num);
            // 循环拆分列表，并添加到nav_list中
            for (let i = 0; i < split_num; i++) {
                nav_list.push({
                    split_list: cloneList.slice(i * num, (i + 1) * num),
                });
            }
            // 返回拆分后的列表
            return nav_list;
        } else {
            // 否则的话，就返回全部的信息
            return [
                {
                    split_list: cloneList,
                },
            ];
        }
    } else {
        // 如果是平移滑动，则调用另一个函数处理
        return get_swiper_translation_list(cloneList, num);
    }
}

/**
 * 获取轮播图翻译列表
 * 
 * 此函数用于根据给定的列表和数字生成一个特定结构的列表用于轮播图的翻译效果
 * 它会检查输入列表的长度，如果长度小于给定的数字，它会用空列表填充以达到所需长度
 * 
 * @param {Array} cloneList - 原始列表的克隆版本，包含需要显示的元素
 * @param {number} num - 轮播图需要显示的元素数量
 * @returns {Array} - 返回一个对象数组，每个对象包含一个split_list属性，该属性是一个列表
 */
export const get_swiper_translation_list = (cloneList, num) => {
    // 存储数据显示
    let nav_list = [];
    
    // 遍历cloneList，为每个元素创建一个对象，并将其添加到nav_list中
    cloneList.forEach((item) => {
        nav_list.push({
            split_list: [item],
        });
    });
    
    // 如果数据大于等于显示的数量不做处理, 小于显示的内容时需要做处理，添加空的数据
    if (cloneList.length < num) {
        const newNum = num - cloneList.length;
        // 添加空的split_list对象以达到所需的显示数量
        for (let i = 0; i < newNum; i++) {
            nav_list.push({
                split_list: [],
            });
        }
    }
    
    // 返回处理后的列表
    return nav_list;
};