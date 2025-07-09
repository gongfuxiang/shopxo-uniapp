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
                    @subformHelpIconEvent="subform_help_icon_event"
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
                    <button v-if="overall_config.is_show_submit == '1'" class="flex-1 submit_title flex-row align-c jc-c" :style="'background:' + submit_bg_color" type="default">{{ overall_config.submit_title }}</button>
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
import { isEmpty, common_form_styles_computer } from '@/common/js/common/common.js';
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
        // 子表单帮助图标点击事件
        subform_help_icon_event(e) {
            this.setData({ popup_help_content: e });
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