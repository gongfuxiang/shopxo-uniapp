<template>
    <view class="pr oh wh-auto ht-auto">
        <scroll-view :scroll-top="scrollTop" :scroll-y="true" :scroll-x="overall_config.type_value == 'default' || z_index_id !== '' ? false : true" class="scroll-box" lower-threshold="60" scroll-with-animation> 
            <view :style="content_style + (overall_config.type_value == 'default' ? '' : ('width:' + overall_config.custom_width * 2 + 'rpx;'))">
                <template v-if="!isEmpty(img_url)">
                    <image :src="img_url" mode="aspectFit" />
                </template>
            </view>
            <view v-if="is_show_heading_title == '1'" class="head-title flex-row bg-white" :style="heading_title_style + (overall_config.type_value == 'default' ? '' : ('width:' + overall_config.custom_width * 2 + 'rpx;'))">{{ form_name }}</view>
            <view class="data-list bg-white" :style="overall_config.type_value == 'default' ? '' : ('width:' + overall_config.custom_width * 2 + 'rpx;height:' + overall_config.custom_height * 2 + 'rpx')">
                <!-- form表单子组件显示 -->
                <component-show 
                    :propValue="filteredDiyData" 
                    :propFieldLabelStyle="field_label_style"
                    :propTitleStyle="title_style"
                    :propHelpIconStyle="help_icon_style"
                    :propDataFormId="propDataFormId" 
                    :propKey="propKey" 
                    :propDirection="flex_direction" 
                    :propMobile="mobile" 
                    :propComponentStyle="component_style"
                    :propIsCustom="overall_config.type_value == 'free'"
                    @dataChange="data_change"
                    @dataCheck="data_check"
                    @dataOptionChange="data_option_change"
                    @dataCodeChange="data_code_change"
                    @dataCodeCheck="data_code_check"
                    @dataAddressChange="data_address_change"
                    @openRegion="open_region"
                    @helpIconEvent="help_icon_event"
                    @zIndexChange="z_index_change"
                    @regionEvent="region_event"
                    @subformDataChange="subform_data_change"
                />
            </view>
        </scroll-view>
        <view v-if="overall_config.is_show_save_draft == '1' || overall_config.is_show_submit == '1'"  class="bottom-fixed" :style="bottom_fixed_style">
            <view class="bottom-line-exclude">
                <view class="form-footer flex-row align-c">
                    <view v-if="overall_config.is_show_save_draft == '1'" class="save_draft_title flex-col jc-c align-c">
                        <iconfont name="icon-detail" size="30rpx" color="#666" propContainerDisplay="flex" ></iconfont>
                        {{ overall_config.save_draft_title }}
                    </view>
                    <button v-if="overall_config.is_show_submit == '1'" class="flex-1 submit_title flex-row align-c jc-c" :style="'background:' + submit_bg_color" type="default" :disable="is_submit_disable" @tap="submit_click">{{ overall_config.submit_title }}</button>
                </view>
            </view>
        </view>
        <view class="z-i-deep-middle">
            <uni-popup ref="popup" type="center" border-radius="20rpx">
                <view class="popup-content">{{ popup_help_content }}</view>
            </uni-popup>
        </view>
    </view>
</template>

<script>
import { isEmpty, common_form_styles_computer, get_format_checks } from '@/common/js/common/common.js';
const app = getApp();
import componentShow from '@/pages/form-input/components/form-input/modules/component-show/index.vue';
export default {
    name: 'formInput',
    components: {
        componentShow
    },
    props: {
        propValue: {
            type: Object,
            default: () => ({}),
        },
        propDataFormId: {
            type: [String, Number],
            default: '',
        },
        propKey: {
            type: [String, Number],
            default: 0,
        },
    },
    data() {
        return {
            data_list: [],
            form_name: '',
            flex_direction: 'row',
            field_label_style: '',
            is_show_heading_title: '0',
            heading_title_style: '',
            title_style: '',
            component_style: '',
            help_icon_style: '',
            mobile: {},
            overall_config: {},
            img_url: '',
            content_style: '',
            submit_bg_color: '',
            bottom_fixed_style: '',
            popup_help_content: '',
            scrollTop: 0,
            z_index_id: '',
            is_submit_disable: false
        };
    },
    watch: {
        propKey(val) {
            // 初始化
            this.init();
        },
    },
    computed: { 
        filteredDiyData() {
            const componentMap = new Map(this.data_list.map(item => [item.id, item]));

            // 取出所有设置显隐规则的组件
            const list = this.data_list.filter(item => ['single-text', 'select', 'radio-btns'].includes(item.key) && ['select', 'radio-btns'].includes(item.com_data.type) && item.com_data.show_hidden_list.length > 0);
            const list_map = list.map(item => ({ id: item.id, list: item.com_data.show_hidden_list }));
            return this.data_list.filter(item => {
                // 优先判断是否启用
                if (item.is_enable !== '1') return false;

                if (list_map.length === 0) return true;
                // 将所有的内容的组件进行筛选
                const isShownByRule = list_map.some(list_item => {
                    const targetComponent = componentMap.get(list_item.id);
                    // 判断显隐规则对应的组件是否存在
                    if (!targetComponent) return false;
                    return list_item.list.some(hidden_item => {
                        // 判断当前组件是否在显隐规则中，如果不在，直接显示，否则的话判断值是否存在
                        if (hidden_item.is_show.includes(item.id)) {
                            return targetComponent.com_data.form_value.includes(hidden_item.value);
                        } else {
                            return true;
                        }
                    });
                });
                return isShownByRule;
            });
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        isEmpty,
        init() {
            const data = this.propValue;
            // 公共配置信息
            const overall_config = data.config?.overall_config || {};
            const mobile = overall_config?.style_settings?.mobile || {};
            data.config.diy_data.forEach(item => {
                // 边框样式处理
                item.com_data.common_style = this.get_form_border_style(item.com_data.common_config, mobile.flex_direction || 'row', overall_config.type_value);
                // 子表单需要统一规整一下数据
                if (item.key == 'subform') {
                    const { com_data } = item;
                    item.com_data.data_list = [];
                    let data_list = [];
                    com_data.form_value.forEach(item => {
                        const data = JSON.parse(JSON.stringify(com_data?.children || []));
                        data.forEach(child => {
                            if (!isEmpty(item[child.id])) {
                                child.com_data.form_value = item[child.id];
                            }
                        });
                        data_list.push({
                            is_expand: false,
                            data_list: data
                        });
                    });
                    item.com_data.data_list = data_list;
                }
            });
            this.setData({
                z_index_id: '',
                data_list: data.config.diy_data,
                form_name: data.name,
                mobile: mobile,
                flex_direction: mobile.flex_direction || 'row',
                img_url: mobile?.heading_image && mobile?.heading_image.length > 0 ?  mobile?.heading_image[0]?.url || '' : '',
                content_style: `min-height:64rpx;background: ${ mobile.heading_color };`,
                is_show_heading_title: mobile.is_show_heading_title || '0',
                heading_title_style: `justify-content:${ mobile.heading_title_location };color:${ mobile.heading_title_color };font-size:${ mobile.heading_title_size }px;font-weight:${ mobile.heading_title_font_weight };`,
                overall_config: overall_config,
                submit_bg_color: mobile.submit_color || '#fff',
                title_style: `color:#333;font-size:${ mobile.filed_title_size_type == 'big' ? 44 : mobile.filed_title_size_type == 'middle' ? 32 : 24 }rpx;font-weight:blod;`,
                component_style: `height:${mobile.filed_title_size_type == 'big' ? 108 : mobile.filed_title_size_type == 'middle' ? 80 : 60}rpx;font-size:${mobile.filed_title_size_type == 'big' ? 44 : mobile.filed_title_size_type == 'middle' ? 32 : 24}rpx;`,
                help_icon_style: `font-size:${mobile.help_icon_size_type == 'big' ? 40 : mobile.help_icon_size_type == 'middle' ? 28 : 24}rpx;`,
                field_label_style: `${ mobile.flex_direction == 'column'? 'justify-content:flex-start;' : `width:${ mobile.filed_title_width * 2 }rpx;justify-content: ${ mobile.filed_title_justification };` }`,
            });
            // 
            setTimeout(() => {
                this.setData({
                    scrollTop: 0.01
                })
            }, 500);
        },
        // 获取子表单样式
        get_form_border_style(item, flex_direction, type_value) {
            // 如果是默认模式需要区分是上下还是左右来判断是否显示边框
            if (type_value == 'default') {
                return flex_direction == 'row' ? '' : common_form_styles_computer(item) + 'padding: 0px 22rpx;box-sizing:content-box;';
            } else {
                // 自定义模式不管是上下还是左右都显示边框
                return common_form_styles_computer(item) + 'padding: 0px 22rpx;box-sizing:content-box;';
            }
        },
        // 子表单校验逻辑
        data_check(e) {
            const { is_error, error_text, value, id } = e;
            // 改变对应id的数据
            const data = [...this.data_list];
            data.forEach(item => {
                if (item.id == id && item.com_data && item.com_data.common_config) {
                    item.com_data.form_value = value;
                    item.com_data.common_config.is_error = is_error;
                    item.com_data.common_config.error_text = error_text;
                }
            });
            this.setData({ data_list: data });
        },
        // 手机号验证码的校验
        data_code_check(e) {
            const { is_error, error_text, value, id } = e;
            // 改变对应id的数据
            const data = [...this.data_list];
            data.forEach(item => {
                if (item.id == id && item.com_data && item.com_data.common_config) {
                    item.com_data.form_value_code = value;
                    item.com_data.common_config.is_error = is_error;
                    item.com_data.common_config.error_text = error_text;
                }
            });
            this.setData({ data_list: data });
        },
        // 子表单内容参数修改
        data_change(e) {
            const { value, id } = e;
            // 改变对应id的数据
            const data = [...this.data_list];
            data.forEach(item => {
                if (item.id == id && item.com_data) {
                    item.com_data.form_value = value;
                }
            });
            this.setData({ data_list: data });
        },
        // 子表单验证码参数修改
        data_code_chage(e) {
            const { value, id } = e;
            // 改变对应id的数据
            const data = [...this.data_list];
            data.forEach(item => {
                if (item.id == id && item.com_data) {
                    item.com_data.form_value_code = value;
                }
            });
            this.setData({ data_list: data });
        },
        // 子表单新增选项变化时的处理
        data_option_change(e) {
            const { list, value, id } = e;
            // 改变对应id的数据
            const data = [...this.data_list];
            data.forEach(item => {
                if (item.id == id && item.com_data) {
                    item.com_data.form_value = value;
                    item.com_data.custom_option_list = list;
                }
            });
            this.setData({ data_list: data });
        },
        // 子表单地址详细信息的处理
        data_address_change(e) {
            const { value, id } = e;
            // 改变对应id的数据
            const data = [...this.data_list];
            data.forEach(item => {
                if (item.id == id && item.com_data) {
                    item.com_data.detailed_value = value;
                }
            });
            this.setData({ data_list: data });
        },
        // 帮助图标点击事件
        help_icon_event(val) {
            this.setData({ popup_help_content: val });
            this.$refs.popup.open();
        },
        // 地区选择器提交事件
        region_event(e) {
            const { value, id, province_name, city_name, county_name } = e;
            // 改变对应id的数据
            const data = [...this.data_list];
            data.forEach(item => {
                if (item.id == id && item.com_data) {
                    item.com_data.form_value = value;
                    item.com_data.province_name = province_name;
                    item.com_data.city_name = city_name;
                    item.com_data.county_name = county_name;
                }
            });
            this.setData({ data_list: data });
        },
        subform_data_change(e, id) {
            // 改变对应id的数据
            const data = [...this.data_list];
            data.forEach(item => {
                if (item.id == id && item.com_data) {
                    item.com_data.data_list = e
                }
            });
            this.setData({ data_list: data });
        },
        submit_click() {
            // 校验所有的必填项和逻辑
            const new_data = this.submit_data_check();
            // 处理所有的错误项
            const data = new_data.find((item) => item.com_data.common_config.is_error === '1' || (item.key === 'subform' && item.com_data.data_list.some((item1) => item1.data_list.some(list_item => list_item.com_data.common_config.is_error === '1'))));
            if (!isEmpty(data)) {
                if (data.key === 'subform') {
                    // 如果子表单外层为error直接显示名称出来
                    if (data.com_data.common_config.is_error == '1') {
                        app.globalData.showToast(`${data.com_data.title}「${data.com_data.common_config.error_text}」`, 'error');
                    } else {
                        // 如果是内部问题，让用户自己检查子表单内的填写
                        app.globalData.showToast(`请检查${data.com_data.title}内的填写`, 'error');
                    }
                } else {
                    app.globalData.showToast(`${data.com_data.title}「${data.com_data.common_config.error_text}」`, 'error');
                }
                // 更新数据，将报错信息或者解除报错信息赋值给原数据
                const old_data = [...this.data_list];
                const data_list = old_data.map(item => {
                    const match = new_data.find(el => el.id === item.id);
                    return { ...item, ...match };
                });
                this.setData({ data_list: data_list });
            } else {
                this.submit_data_parameter_handle();
            }
        },
        submit_data_parameter_handle() {
            const submit_data = {};
            const filter_data = ['video', 'img', 'auxiliary-line', 'position', 'rect', 'round', 'text', 'attachments'];
            // 规整字段信息
            this.filteredDiyData.forEach((item) => {
                if (!filter_data.includes(item.key)) {
                    const name = isEmpty(item.form_name) ? item.id : item.form_name;
                    const value = isEmpty(item.com_data.form_value) ? '' : item.com_data.form_value;
                    const com_data = item.com_data;
                    if (item.key ==='subform') {
                        const data_list = com_data.data_list;
                        submit_data[name] = data_list.map((subform_item) => {
                            const data = {};
                            // 子表单中每一行的数据显示
                            subform_item.data_list.forEach((item1) => {
                                const subform_name = isEmpty(item1.form_name) ? item1.id : item1.form_name;
                                const subform_com_data = item1.com_data;
                                const subform_value = isEmpty(subform_com_data.form_value) ? '' : subform_com_data.form_value;
                                if (!filter_data.includes(item1.key)) {
                                    if (item1.key == 'address') {
                                        data[`${ subform_name }_province_id`] = subform_value[0] || '';
                                        data[`${ subform_name }_city_id`] = subform_value[1] || '';
                                        data[`${ subform_name }_county_id`] = subform_value[2] || '';
                                        // 省市区中文名称
                                        submit_data[`${ name }_province_name`] = subform_com_data.province_name || '';
                                        submit_data[`${ name }_city_name`] = subform_com_data.city_name || ''
                                        submit_data[`${ name }_county_name`] = subform_com_data.county_name || ''
                                    } else {
                                        data[subform_name] = subform_value;
                                    }
                                }
                            });
                            return data;
                        });
                    } else if (item.key ==='phone') {
                        submit_data[`${ name }`] = value || '';
                        // 判断是否需要发送短信验证码
                        if (com_data.is_sms_verification == '1') {
                            submit_data[`${ name }_verify`] = com_data?.form_value_code || '';
                        }
                    } else if (item.key == 'address') {
                        submit_data[`${ name }_province_id`] = value[0] || '';
                        submit_data[`${ name }_city_id`] = value[1] || '';
                        submit_data[`${ name }_county_id`] = value[2] || '';
                        // 省市区中文名称
                        submit_data[`${ name }_province_name`] = com_data.province_name || '';
                        submit_data[`${ name }_city_name`] = com_data.city_name || ''
                        submit_data[`${ name }_county_name`] = com_data.county_name || ''
                        // 判断类型是否包含详细地址
                        if (com_data.address_type == 'detailed') {
                            submit_data[`${ name }_address`] = com_data?.detailed_value || '';
                        }
                    } else if (['select', 'radio-btns'].includes(item.key)) {
                        submit_data[name] = value;
                        const value_list = com_data.option_list.filter((item) => item.is_other == '1');
                        if (value_list.length > 0) {
                        submit_data[`${ name }_other_value`] = com_data?.other_value || '';
                        }
                    } else {
                        submit_data[name] = value;
                    }
                }
            });
            const params = {
                forminput_id: this.propDataFormId,
                ...submit_data
            }
            this.is_submit_disable = true;
            uni.request({
                url: app.globalData.get_request_url('save', 'forminputdata'),
                method: 'POST',
                data: params,
                dataType: 'json',
                success: (res) => {
                    this.is_submit_disable = false;
                    app.globalData.showToast('提交成功', 'success');
                },
                fail: (res) => {
                    this.is_submit_disable = false;
                    app.globalData.showToast('提交失败', 'error');
                }
            });
        },
        submit_data_check() {
            // 定义字段类型与检查参数的映射
            const fieldCheckMap = {
                'address': { is_format: false, type: 'address' },
                'number': { is_format: false, type: 'number' },
                'checkbox': { is_format: true, type: 'checkbox' },
                'select-multi': { is_format: true, type: 'checkbox' },
                'date': { is_format: false, type: 'time' },
                'date-group': { is_format: false, type: 'time' },
                'single-text': { is_format: false, type: '' },
                'multi-text': { is_format: false, type: '' },
                'rich-text': { is_format: false, type: '' },
                'radio-btns': { is_format: false, type: 'radio' },
                'select': { is_format: false, type: 'select' },
                'pwd': { is_format: false, type: '' },
                'score': { is_format: false, type: 'score' },
                'upload-attachments': { is_format: false, type: 'upload' },
                'upload-img': { is_format: false, type: 'upload' },
                'upload-video': { is_format: false, type: 'upload' }
            };
            const data = JSON.parse(JSON.stringify(this.filteredDiyData));
            // 遍历所有过滤后的自定义数据项
            data?.forEach((item) => {
                const com_data = item.com_data;
                // 跳过非必填项
                if (com_data.is_required === '1') {
                    // 特殊字段验证：手机号
                    if (item.key === 'phone') {
                        const { is_error = '0', error_text = '' } = this.handlePhoneValidation(com_data);
                        com_data.common_config.is_error = is_error;
                        com_data.common_config.error_text = error_text;
                    } 
                    // 其他字段的格式验证
                    else if (fieldCheckMap[item.key]) {
                        const { is_format, type } = fieldCheckMap[item.key];
                        const { is_error = '0', error_text = '' } = get_format_checks(com_data, com_data.form_value, is_format, type);
                        com_data.common_config.is_error = is_error;
                        com_data.common_config.error_text = error_text;
                    }
                };
                /**
                 * 子表单处理逻辑
                 * 1. 检查子表单中是否有必填项
                 * 2. 验证子表单整体必填性
                 * 3. 处理子表单内各字段的验证
                 */
                if (item.key === 'subform') {
                    // 子表单整体必填验证
                    if (com_data.is_required === '1' && com_data.data_list.length <= 0) {
                        com_data.common_config.is_error = '1';
                        com_data.common_config.error_text = '请填写至少一条记录';
                    } else {
                        com_data.common_config.is_error = '0';
                        com_data.common_config.error_text = '';
                    }
                    // 处理子表单内各字段的验证
                    if (com_data.data_list.length > 0) {
                        // 验证子表单内各字段
                        com_data.data_list.forEach((form_item, index) => {
                            // 取出对应列的数据信息
                            const form_data = this.filtered_Data(form_item.data_list);
                            form_data.forEach((data_item) => {
                                // 跳过非必填项
                                if (data_item.com_data.is_required !== '1') return;
                                // 执行字段验证
                                const checkConfig = fieldCheckMap[data_item.key];
                                if (checkConfig) {
                                    // 特殊字段验证：手机号
                                    if (data_item.key === 'phone') {
                                        const { is_error = '0', error_text = '' } = this.handlePhoneValidation(data_item);
                                        data_item.com_data.common_config.is_error = is_error;
                                        data_item.com_data.common_config.error_text = error_text;
                                    } 
                                    // 其他字段的格式验证
                                    else if (fieldCheckMap[data_item.key]) {
                                        const { is_format, type } = fieldCheckMap[data_item.key];
                                        const { is_error = '0', error_text = '' } = get_format_checks(data_item.com_data, data_item.com_data.form_value, is_format, type);
                                        data_item.com_data.common_config.is_error = is_error;
                                        data_item.com_data.common_config.error_text = error_text;
                                    }
                                }
                            });
                        });
                    }
                }
            });
            return data;
        },
        // 处理手机号验证逻辑
        handlePhoneValidation(com_data) {
            if (com_data.is_sms_verification === '1' && com_data.is_required === '1' && isEmpty(com_data.form_value_code)) {
                com_data.common_config.is_error = '1';
                com_data.common_config.error_text = '短信验证码不能为空';
                return;
            }
            com_data.common_config.format = com_data.is_telephone === '1' ? 'telephone-number' : 'phone-number';
            return get_format_checks(com_data, com_data.form_value_code, true);
        },
        // 子表单显隐规则数据处理
        filtered_Data(children) { 
            const componentMap = new Map(children.map((item) => [item.id, item]));

            // 取出所有设置显隐规则的组件
            const list = children.filter((item) => ['single-text', 'select', 'radio-btns'].includes(item.key) && ['select', 'radio-btns'].includes(item.com_data.type) && item.com_data.show_hidden_list.length > 0);
            const list_map = list.map((item) => ({ id: item.id, list: item.com_data.show_hidden_list }));
            return children.filter((item) => {
                // 优先判断是否启用
                if (item.is_enable !== '1') return false;

                if (list_map.length === 0) return true;
                // 将所有的内容的组件进行筛选
                const isShownByRule = list_map.some((list_item) => {
                    const targetComponent = componentMap.get(list_item.id);
                    // 判断显隐规则对应的组件是否存在
                    if (!targetComponent) return false;
                    return list_item.list.some(hidden_item => {
                        // 判断当前组件是否在显隐规则中，如果不在，直接显示，否则的话判断值是否存在
                        if (hidden_item.is_show.includes(item.id)) {
                            return targetComponent.com_data.form_value.includes(hidden_item.value);
                        } else {
                            return true;
                        }
                    });
                });
                return isShownByRule;
            });
        },
        z_index_change(e) {
            this.setData({
                z_index_id: e
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.head-title { 
    word-wrap: break-word;
    font-size: 40rpx;
    padding: 16rpx 11rpx 0;
    box-sizing: border-box;
    word-break: break-word;
}
.scroll-box {
    height: calc(100vh - 110rpx);
}
.bottom-fixed { 
    background: #fff;
    width: 100%;
    border-top: 2rpx solid #eee;
    .save_draft_title {
        min-width: 180rpx;
        font-size: 24rpx;
    }
    .submit_title {
        text-align: center;
        height: 64rpx;
        color: #fff;
        border-radius: 40rpx;
        font-size: 32rpx;
        margin: 0 0 0 20rpx;
    }
}
.data-list {
    padding: 15rpx 0;
}
.popup-content {
    background: #fff;
    padding: 32rpx;
    border-radius: 10rpx;
}
</style>