<template>
    <view class="wh-auto ht-auto pr">
        <view v-for="(item, index) in filteredDiyData" :key="index" :class="(is_custom ? 'pa ' : (flex_direction == 'row' ? 'row-item ' : 'column-item mb-10 ')) + (item.com_data.common_config.is_error == '1' ? ' item_error' : '')" :data-id="item.id" :data-location-x="item.location.x" :data-location-y="item.location.y" :style="(item.key == 'auxiliary-line' ? 'border-bottom: 0rpx; ' : '') + (is_custom ? ('left:' + item.location.x + 'px;top:' + item.location.y + 'px;width:' + item.com_data.com_width + 'px;height:' + item.com_data.com_height + 'px;z-index:' + (z_index_id == item.id ? '999999' : (item.is_enable == '1' ? (data_list.length - 1 > 0 ? (data_list.length - 1) - index : 0) : -999)) + ';') : '')">
            <view :class="'wh-auto ht-auto ' + (flex_direction == 'row' ? (['video', 'img', 'upload-img', 'upload-video', 'multi-text'].includes(item.key) ? 'flex-row align-s gap-10' : 'flex-row align-b gap-10')  : 'flex-col gap-10')">
                <view v-if="(!is_custom && !['auxiliary-line', 'subform'].includes(item.key)) || (is_custom && !['img', 'video', 'auxiliary-line', 'rect', 'round', 'subform'].includes(item.key))" class="field-label flex-row align-c gap-10" :style="field_label_style + (flex_direction == 'row' && ['upload-img', 'upload-video'].includes(item.key) ? 'padding-top: 12rpx;line-height: 120rpx;' : '') + (flex_direction == 'row' && ['multi-text'].includes(item.key) ? 'padding-top: 18rpx;' : '')">
                    <view class="flex-row align-c" :style="title_style">{{ item.com_data.title }}<view v-if="item.com_data.is_required && item.com_data.is_required == '1'" class="required">*</view></view>
                    <view v-if="item.com_data.common_config.help_is_show == '1' && !isEmpty(item.com_data.common_config.help_explain)" :data-value="item.com_data.common_config.help_explain" @tap="help_icon_event">
                        <iconfont name="icon-help" :size="help_icon_style" color="#999"></iconfont>
                    </view>
                </view>
                <view :class="'flex-1 wh-auto ht-auto flex-col gap-5 '+ (['date', 'date-group', 'upload-img', 'upload-video'].includes(item.key) ? '' : 'oh')">
                    <!-- 输入框 -->
                    <view v-if="['single-text', 'radio-btns', 'select'].includes(item.key) && item.com_data.type == 'single-text'" :style="item.com_data.common_style">
                        <component-input :propValue="item.com_data" :propKey="propKey" :propDataId="item.id" :propStyle="component_style" @dataCheck="data_check" @dataChange="data_change"></component-input>
                    </view>
                    <!-- 多行输入框 -->
                    <view v-else-if="item.key == 'multi-text'" :style="item.com_data.common_style + 'padding: 18rpx 22rpx;'">
                        <component-textarea :propValue="item.com_data" :propKey="propKey" :propDataId="item.id" :propStyle="component_style" @dataCheck="data_check" @dataChange="data_change"></component-textarea>
                    </view>
                    <!-- 复选按钮组 -->
                    <view v-else-if="['select-multi', 'checkbox'].includes(item.key) && item.com_data.type == 'checkbox' && flex_direction !== 'row'">
                        <component-checkbox :propValue="item.com_data" :propKey="propKey" :propDataId="item.id" :propMobile="mobile" :propStyle="component_style" @dataCheck="data_check" @dataChange="data_change" @dataOptionChange="data_option_change"></component-checkbox>
                    </view>
                    <!-- 单选按钮组 -->
                    <view v-else-if="['single-text', 'radio-btns', 'select'].includes(item.key) && item.com_data.type == 'radio-btns' && flex_direction !== 'row'">
                        <component-radio :propValue="item.com_data" :propKey="propKey" :propDataId="item.id" :propMobile="mobile" :propStyle="component_style + item.com_data.common_style" @dataCheck="data_check" @dataChange="data_change" @dataOtherChange="data_other_change" @dataOtherCheck="data_other_check"></component-radio>
                    </view>
                    <!-- 下拉框 -->
                    <view v-else-if="(['single-text', 'radio-btns', 'select'].includes(item.key) && item.com_data.type == 'select') || (['single-text', 'radio-btns', 'select'].includes(item.key) && item.com_data.type == 'radio-btns' && flex_direction == 'row')">
                        <component-select :propValue="item.com_data" :propKey="propKey" :propDataId="item.id" :propMobile="mobile" :propDirection="flex_direction" :propStyle="component_style" :propCommonStyle="item.com_data.common_style" @dataCheck="data_check" @dataChange="data_change" @zIndexChange="z_index_change" @dataOtherChange="data_other_change" @dataOtherCheck="data_other_check"></component-select>
                    </view>
                    <!-- 下拉复选框 -->
                    <view v-else-if="(['select-multi', 'checkbox'].includes(item.key) && item.com_data.type == 'select-multi') || (['select-multi', 'checkbox'].includes(item.key) && item.com_data.type == 'checkbox' && flex_direction == 'row')" :style="item.com_data.common_style">
                        <component-select-multi :propValue="item.com_data" :propKey="propKey" :propDataId="item.id" :propMobile="mobile" :propDirection="flex_direction" :propStyle="component_style" @dataCheck="data_check" @dataChange="data_change" @dataOptionChange="data_option_change" @zIndexChange="z_index_change"></component-select-multi>
                    </view>
                    <!-- 数字 -->
                    <view v-else-if="item.key == 'number'" :style="item.com_data.common_style">
                        <component-number :propValue="item.com_data" :propKey="propKey" :propDataId="item.id" :propMobile="mobile" :propStyle="component_style" @dataCheck="data_check" @dataChange="data_change"></component-number>
                    </view>
                    <!-- 时间选择器 -->
                    <view v-else-if="item.key == 'date'" :style="item.com_data.common_style + 'overflow: none;'">
                        <component-date :propValue="item.com_data" :propKey="propKey" :propDataId="item.id" :propMobile="mobile" :propStyle="component_style" @dataCheck="data_check" @dataChange="data_change" @zIndexChange="z_index_change"></component-date>
                    </view>
                    <!-- 时间选择器组 -->
                    <view v-else-if="item.key == 'date-group'" :style="item.com_data.common_style + 'overflow: none;'">
                        <component-date-group :propValue="item.com_data" :propKey="propKey" :propDataId="item.id" :propMobile="mobile" :propStyle="component_style" @dataCheck="data_check" @dataChange="data_change" @zIndexChange="z_index_change"></component-date-group>
                    </view>
                    <!-- 地址 -->
                    <view v-else-if="item.key == 'address'">
                        <component-address :propValue="item.com_data" :propKey="propKey" :propDataId="item.id" :propMobile="mobile" :propStyle="component_style" :propDirection="flex_direction" @dataCheck="data_check" @dataChange="data_change" @regionEvent="region_event" @dataAddressChange="data_address_change" @zIndexChange="z_index_change"></component-address>
                    </view>
                    <!-- 手机 -->
                    <view v-else-if="item.key == 'phone'">
                        <component-phone :propValue="item.com_data" :propKey="propKey" :propDataFormId="propDataFormId" :propDataId="item.id" :propMobile="mobile" :propStyle="component_style" :propDirection="flex_direction" @dataCheck="data_check" @dataChange="data_change" @dataCodeCheck="data_code_check" @dataCodeChage="data_code_change" @zIndexChange="z_index_change"></component-phone>
                    </view>
                    <!-- 密码 -->
                    <view v-else-if="item.key == 'pwd'" :style="item.com_data.common_style">
                        <component-pwd :propValue="item.com_data" :propKey="propKey" :propDataId="item.id" :propMobile="mobile" :propStyle="component_style" :propDirection="flex_direction" @dataCheck="data_check" @dataChange="data_change"></component-pwd>
                    </view>
                    <!-- 评分 -->
                    <view v-else-if="item.key == 'score'">
                        <component-score :propValue="item.com_data" :propKey="propKey" :propDataId="item.id" :propMobile="mobile" :propStyle="component_style" :propDirection="flex_direction" @dataCheck="data_check" @dataChange="data_change"></component-score>
                    </view>
                    <!-- 图片 -->
                    <view v-else-if="item.key == 'img'" :class="is_custom ? 'wh-auto ht-auto' : ''">
                        <component-image :propValue="item.com_data" :propKey="propKey" :propDataId="item.id" :propMobile="mobile" :propStyle="component_style" :propDirection="flex_direction" :propIsCustom="is_custom"></component-image>
                    </view>
                    <!-- 视频 -->
                    <view v-else-if="item.key == 'video'" :class="is_custom ? 'wh-auto ht-auto' : ''">
                        <component-video :propValue="item.com_data" :propKey="propKey" :propDataId="item.id" :propMobile="mobile" :propStyle="component_style" :propDirection="flex_direction" :propIsCustom="is_custom"></component-video>
                    </view>
                    <!-- 文本 -->
                    <view v-else-if="item.key == 'text'">
                        <component-text :propValue="item.com_data" :propKey="propKey" :propDataId="item.id" :propMobile="mobile" :propStyle="component_style" :propDirection="flex_direction"></component-text>
                    </view>
                    <!-- 文件 -->
                    <view v-else-if="item.key == 'attachments'">
                        <component-attachments :propValue="item.com_data" :propKey="propKey" :propDataId="item.id" :propMobile="mobile" :propStyle="component_style" :propDirection="flex_direction"></component-attachments>
                    </view>
                    <!-- 辅助线 -->
                    <view v-else-if="item.key == 'auxiliary-line'">
                        <component-auxiliary-line :propValue="item.com_data" :propKey="propKey" :propDataId="item.id" :propMobile="mobile" :propStyle="component_style" :propDirection="flex_direction"></component-auxiliary-line>
                    </view>
                    <!-- 上传视频或图片 -->
                    <view v-else-if="['upload-img', 'upload-video'].includes(item.key)" :class="flex_direction == 'row' ? 'padding-vertical-sm' : ''">
                        <component-upload :propValue="item.com_data" :propType="item.key == 'upload-img' ? 'img' : ( item.key == 'upload-video' ? 'video' : 'file')" :propKey="propKey" :propDataFormId="propDataFormId" :propDataId="item.id" :propMobile="mobile" :propStyle="component_style" :propDirection="flex_direction" @dataChange="data_change"></component-upload>
                    </view>
                    <!-- 定位 -->
                    <view v-else-if="item.key == 'position'">
                        <component-position :propValue="item.com_data" :propKey="propKey" :propDataId="item.id" :propMobile="mobile" :propStyle="component_style" :propDirection="flex_direction" @dataChange="data_change"></component-position>
                    </view>
                    <!-- 圆形和矩形 -->
                    <view v-else-if="['rect', 'round'].includes(item.key)" :class="is_custom ? 'wh-auto ht-auto' : ''">
                        <component-rect-or-round :propValue="item.com_data" :propKey="propKey"></component-rect-or-round>
                    </view>
                    <!-- 子表单 -->
                    <view v-else-if="item.key == 'subform'">
                        <component-subform 
                            :propValue="item.com_data" 
                            :propKey="propKey" 
                            :propDataId="item.id" 
                            :propMobile="mobile" 
                            :propIsCustom="is_custom"
                            :propStyle="component_style" 
                            :propDirection="flex_direction" 
                            :propTitleStyle="title_style" 
                            :propHelpIconStyle="help_icon_style"
                            :propFieldLabelStyle="field_label_style"
                            :propDataFormId="propDataFormId"
                            @helpIconEvent="subform_help_icon_event"
                            @subformDataChange="subform_data_change"
                            @zIndexChange="z_index_change"
                        />
                    </view>
                    <!-- #ifdef H5 || MP-WEIXIN || MP-QQ -->
                    <!-- 上传文件 -->
                    <view v-else-if="item.key == 'upload-attachments'">
                        <component-upload :propValue="item.com_data" propType="file" :propKey="propKey" :propDataFormId="propDataFormId" :propDataId="item.id" :propMobile="mobile" :propStyle="component_style" :propDirection="flex_direction" @dataChange="data_change"></component-upload>
                    </view>
                    <!-- #endif -->
                    <!-- #ifdef APP-PLUS || H5 || MP-WEIXIN -->
                    <!-- 富文本 -->
                    <view v-else-if="item.key == 'rich-text'" :style="item.com_data.common_style + 'padding:0;'">
                        <component-rich-text :propValue="item.com_data"  :propKey="propKey" :propDataId="item.id" :propMobile="mobile" :propStyle="component_style" :propDirection="flex_direction" @dataChange="data_change"></component-rich-text>
                    </view>
                    <!-- #endif -->
                    <view v-if="!isEmpty(item.com_data.common_config.error_text)" class="field-invalid-info">{{ item.com_data.common_config.error_text }}</view>
                </view>
            </view>
        </view>
        <view class="z-i-deep-must">
            <uni-popup ref="popup" type="center" border-radius="20rpx" class="forminput-popup">
                <view class="popup-content">{{ popup_help_content }}</view>
            </uni-popup>
        </view>
    </view>
</template>

<script> 
import { isEmpty, common_form_styles_computer, get_format_checks } from '@/common/js/common/common.js';
import componentInput from '@/pages/form-input/components/form-input/input.vue';
import componentTextarea from '@/pages/form-input/components/form-input/textarea.vue';
import componentCheckbox from '@/pages/form-input/components/form-input/checkbox.vue';
import componentRadio from '@/pages/form-input/components/form-input/radio.vue';
import componentSelect from '@/pages/form-input/components/form-input/select.vue';
import componentNumber from '@/pages/form-input/components/form-input/number.vue';
import componentDate from '@/pages/form-input/components/form-input/date.vue';
import componentDateGroup from '@/pages/form-input/components/form-input/date-group.vue';
import componentAddress from '@/pages/form-input/components/form-input/address.vue';
import componentSelectMulti from '@/pages/form-input/components/form-input/select-multi.vue';
import componentPhone from '@/pages/form-input/components/form-input/phone.vue';
import componentPwd from '@/pages/form-input/components/form-input/pwd.vue';
import componentScore from '@/pages/form-input/components/form-input/score.vue';
import componentImage from '@/pages/form-input/components/form-input/image.vue';
import componentVideo from '@/pages/form-input/components/form-input/video.vue';
import componentText from '@/pages/form-input/components/form-input/text.vue';
import componentAttachments from '@/pages/form-input/components/form-input/attachments.vue';
import componentAuxiliaryLine from '@/pages/form-input/components/form-input/auxiliary-line.vue';
import componentRichText from '@/pages/form-input/components/form-input/rich-text.vue';
import componentUpload from '@/pages/form-input/components/form-input/upload.vue';
import componentPosition from '@/pages/form-input/components/form-input/position.vue';
import componentRectOrRound from '@/pages/form-input/components/form-input/rect-or-round.vue';
import componentSubform from '@/pages/form-input/components/form-input/subform.vue';
export default {
    name: 'formInput',
    components: {
        componentInput,
        componentTextarea,
        componentCheckbox,
        componentRadio,
        componentNumber,
        componentSelect,
        componentSelectMulti,
        componentDate,
        componentDateGroup,
        componentAddress,
        componentPhone,
        componentPwd,
        componentScore,
        componentImage,
        componentVideo,
        componentText,
        componentAttachments,
        componentAuxiliaryLine,
        componentRichText,
        componentUpload,
        componentPosition,
        componentRectOrRound,
        componentSubform
    },
    props: {
        propConfig: {
            type: Object,
            default: () => {},
        },
        propData: {
            type: Object,
            default: () => {},
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
            z_index_id: '',
            flex_direction: 'row',
            field_label_style: '',
            title_style: '',
            component_style: '',
            help_icon_style: '',
            mobile: {},
            popup_help_content: '',
            is_custom: false,
            // 定义字段类型与检查参数的映射
            fieldCheckMap: {
                'address': { is_format: false, type: 'address' },
                'number': { is_format: true, type: 'number' },
                'checkbox': { is_format: true, type: 'checkbox' },
                'select-multi': { is_format: true, type: 'checkbox' },
                'date': { is_format: false, type: 'time' },
                'date-group': { is_format: false, type: 'time' },
                'single-text': { is_format: true, type: '' },
                'multi-text': { is_format: false, type: '' },
                'rich-text': { is_format: false, type: '' },
                'radio-btns': { is_format: false, type: 'radio' },
                'select': { is_format: false, type: 'select' },
                'pwd': { is_format: false, type: '' },
                'score': { is_format: false, type: 'score' },
                'upload-attachments': { is_format: false, type: 'upload' },
                'upload-img': { is_format: false, type: 'upload' },
                'upload-video': { is_format: false, type: 'upload' }
            },
        }
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
    watch: {
        propKey(val) {
           this.init();
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        isEmpty,
        init() {
            const data = this.propConfig;
            // 公共配置信息
            const overall_config = data?.overall_config || {};
            const mobile = overall_config?.style_settings?.mobile || {};
            let diy_data = data.diy_data || [];
            // #ifndef H5 || MP-WEIXIN || MP-QQ
                // 上传文件只支持H5 微信小程序， qq小程序，其余的需要端需要过滤掉数据
                diy_data = diy_data.filter(item => item.key !== 'upload-attachments');
            // #endif
            // #ifndef APP-PLUS || H5 || MP-WEIXIN
                // 富文本只支持APP-PLUS || H5 || MP-WEIXIN
                diy_data = diy_data.filter(item => item.key !== 'rich-text');
            // #endif
            const new_diy_data = this.set_default_values(diy_data, overall_config, mobile);
            this.setData({
                z_index_id: '',
                data_list: new_diy_data,
                mobile: mobile,
                flex_direction: mobile.flex_direction || 'row',
                title_style: `color:#333;font-size:${ mobile.filed_title_size_type == 'big' ? 44 : mobile.filed_title_size_type == 'middle' ? 32 : 24 }rpx;font-weight:blod;`,
                component_style: `height:${mobile.filed_title_size_type == 'big' ? 108 : mobile.filed_title_size_type == 'middle' ? 80 : 60}rpx;font-size:${mobile.filed_title_size_type == 'big' ? 44 : mobile.filed_title_size_type == 'middle' ? 32 : 24}rpx;`,
                help_icon_style: `font-size:${mobile.help_icon_size_type == 'big' ? 40 : mobile.help_icon_size_type == 'middle' ? 28 : 24}rpx;`,
                field_label_style: `${ mobile.flex_direction == 'column'? 'justify-content:flex-start;' : `width:${ mobile.filed_title_width * 2 }rpx;justify-content: ${ mobile.filed_title_justification };` }`,
                is_custom: overall_config.type_value == 'free',
            });
        },
        /*
        * 初始表单数据整合
        */
        set_default_values(diy_data, overall_config, mobile) {
            diy_data.forEach(item => {
                const com_data = item.com_data;
                // 子表单需要统一规整一下数据
                if (item.key == 'subform') {
                    com_data.data_list = [];
                    let data_list = [];
                    com_data.form_value.forEach(item1 => {
                        const data = JSON.parse(JSON.stringify(com_data?.children || []));
                        if (data.length > 0) {
                            data.forEach(child => {
                                child.com_data.common_style = this.get_form_border_style(child.com_data.common_config, mobile.arrang == 'direction' ? (emobile.flex_direction || 'row') : 'column', overall_config.type_value);
                                if (!isEmpty(item1[child.id])) {
                                    child.com_data.form_value = item1[child.id];
                                }
                            });
                            data_list.push({
                                is_expand: false,
                                data_list: data
                            });
                        }
                    });
                    if (!isEmpty(this.propData)) {
                        // 子表单数据重组
                        data_list.forEach((item1, index) => {
                            item1.data_list.forEach(item2 => {
                                const new_prop_data = this.propData[index];
                                const subform_com_data = item2.com_data;
                                const subform_name = subform_com_data.form_name;
                                if (item2.key == 'address') {
                                    subform_com_data.form_value = [ new_prop_data[`${ subform_name }_province_id`] || '', new_prop_data[`${ subform_name }_city_id`] || '', new_prop_data[`${ subform_name }_county_id`] || '' ];
                                    // 省市区中文名称
                                    subform_com_data.province_name = new_prop_data[`${ subform_name }_province_name`] || '';
                                    subform_com_data.city_name = new_prop_data[`${ subform_name }_city_name`] || '';
                                    subform_com_data.county_name = new_prop_data[`${ subform_name }_county_name`] || '';
                                } else if (item2.key ==='date-group') {
                                    subform_com_data.form_value = [ new_prop_data[`${ subform_name }_start`] || '' , new_prop_data[`${ subform_name }_end`] || ''] || [];
                                } else if (['checkbox', 'select-multi'].includes(item2.key)) {
                                    subform_com_data.form_value = new_prop_data[subform_name] || [];
                                    if (subform_com_data.is_add_option == '1') {
                                        subform_com_data.custom_option_list = new_prop_data[`${ subform_name }_custom_option_list`] || [];
                                    }
                                } else {
                                    subform_com_data.form_value = new_prop_data[subform_name] || '';
                                }
                            });
                        });
                    }
                    com_data.data_list = data_list;
                } else {
                    // 边框样式处理
                    com_data.common_style = this.get_form_border_style(com_data.common_config, mobile.flex_direction || 'row', overall_config.type_value);
                    if (!isEmpty(this.propData)) {
                        const name = item.form_name;
                        item.com_data.form_value = this.propData[item.form_name];
                        if (item.key ==='phone') {
                            com_data.form_value = this.propData[name] || '';
                            com_data.form_value_code = this.propData[`${ name }_verify`] || '';
                        } else if (item.key ==='date-group') {
                            com_data.form_value = [ this.propData[`${ name }_start`] || '' , this.propData[`${ name }_end`] || ''] || [];
                        } else if (item.key == 'address') {
                            com_data.province_id = this.propData[`${ name }_province_id`] || '';
                            com_data.city_id = this.propData[`${ name }_city_id`] || '';
                            com_data.county_id = this.propData[`${ name }_county_id`] || '';
                            // 省市区中文名称
                            com_data.province_name = this.propData[`${ name }_province_name`] || '';
                            com_data.city_name = this.propData[`${ name }_city_name`] || ''
                            com_data.county_name = this.propData[`${ name }_county_name`] || ''
                            // 判断类型是否包含详细地址
                            if (com_data.address_type == 'detailed') {
                                com_data.detailed_value = this.propData[`${ name }_address`] || '';
                            }
                        } else if (['select', 'radio-btns', 'single-text'].includes(item.key) && ['select', 'radio-btns'].includes(item.com_data.type)) {
                            com_data.form_value = this.propData[name] || '';
                            // 判断是否显示其他
                            const value_list = com_data.option_list.filter((item) => item.is_other == '1');
                            if (value_list.length > 0) {
                                com_data.other_value = this.propData[`${ name }_other_value`] || '';
                            }
                        } else if (['checkbox', 'select-multi'].includes(item.key)) {
                            com_data.form_value = this.propData[name] || '';
                            if (com_data.is_add_option == '1') {
                                com_data.custom_option_list = this.propData[`${ name }_custom_option_list`] || [];
                            }
                        } else {
                           com_data.form_value = this.propData[name] || '';
                        }
                    }
                } 
            });
            return diy_data;
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
        /*
        * 帮助提示说明
        */
        help_icon_event(e) {
            this.setData({ popup_help_content: e.currentTarget.dataset.value });
            this.$refs.popup.open();
        },
        /*
        * 子表单帮助提示说明
        */
        subform_help_icon_event(e) {
            this.setData({ popup_help_content: e });
            this.$refs.popup.open();
        },
        /*
        * 表单数据更新处理
        */
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
            // 触发数据修改的事件
            this.verify_when_data_changes(id);
        },
        /*
        * 其他的备注信息修改
        */
        data_other_change(e) {
            const { value, id } = e;
            // 改变对应id的数据
            const data = [...this.data_list];
            data.forEach(item => {
                if (item.id == id && item.com_data) {
                    item.com_data.other_value = value;
                }
            });
            this.setData({ data_list: data });
            // 触发数据修改的事件
            this.verify_when_data_changes(id);
        },
        /*
        * 表单内数据的校验完成后的数据更新
        */
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
            // 触发数据修改的事件
            this.on_item_event(e);
        },
        /*
        * 其他的值修改后校验的数据更新
        */
        data_other_check(e) {
            const { is_error, error_text, value, id } = e;
            // 改变对应id的数据
            const data = [...this.data_list];
            data.forEach(item => {
                if (item.id == id && item.com_data && item.com_data.common_config) {
                    item.com_data.other_value = value
                    item.com_data.common_config.is_error = is_error;
                    item.com_data.common_config.error_text = error_text;
                }
            });
            this.setData({ data_list: data });
            // 触发数据修改的事件
            this.on_item_event(e);
        },
        /*
        * 添加新选项时的处理
        */
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
        /*
        * 手机号验证码的值的修改
        */
        data_code_change(e) {
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
        /*
        * 手机号验证码的校验
        */
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
            // 触发数据修改的事件
            this.on_item_event(e);
        },
        /*
        * 子表单数据更新
        */
        subform_data_change(e, id) {
            // 改变对应id的数据
            const data = [...this.data_list];
            data.forEach(item => {
                if (item.id == id && item.com_data) {
                    item.com_data.data_list = e
                }
            });
            this.setData({ data_list: data });
            // 触发数据修改的事件
            this.verify_when_data_changes(id);
        },
        /*
        * 地址信息更新
        */
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
        /*
        * 详细地址信息处理
        */
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
        /*
        * 表单提交
        */
        on_submit_event() {
            try {
                // 校验所有的必填项和逻辑
                const new_data = this.submit_data_check();
                // 处理所有的错误项
                const data = new_data.find((item) => item.com_data.common_config.is_error === '1' || (item.key === 'subform' && item.com_data.data_list.some((item1) => item1.data_list.some(list_item => list_item.com_data.common_config.is_error === '1'))));
                if (!isEmpty(data)) {
                    let message = '';
                    if (data.key === 'subform') {
                        // 如果子表单外层为error直接显示名称出来
                        if (data.com_data.common_config.is_error == '1') {
                            message = `${data.com_data.title}「${data.com_data.common_config.error_text}」`;
                        } else {
                            // 如果是内部问题，让用户自己检查子表单内的填写
                            message = `请检查${data.com_data.title}内的填写`;
                        }
                    } else {
                        message = `${data.com_data.title}「${data.com_data.common_config.error_text}」`;
                    }
                    // 更新数据，将报错信息或者解除报错信息赋值给原数据
                    const old_data = [...this.data_list];
                    const data_list = old_data.map(item => {
                        const match = new_data.find(el => el.id === item.id);
                        return { ...item, ...match };
                    });
                    this.setData({ data_list: data_list });
                    this.$emit('onSubmitEvent', { type: 'error', submit_data: {}, message: message });
                } else {
                    this.submit_data_parameter_handle();
                }
            } catch (error) {
                this.$emit('onSubmitEvent', { type: 'error', submit_data: {}, message: '数据错误'});
            }
        },
        /*
        * 表单提交参数处理
        */
        submit_data_parameter_handle() {
            try { 
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
                            // 子表单中每一行的数据显示
                            submit_data[name] = this.subform_data_extraction(data_list);
                        } else if (item.key ==='phone') {
                            submit_data[`${ name }`] = value || '';
                            // 判断是否需要发送短信验证码
                            if (com_data.is_sms_verification == '1') {
                                submit_data[`${ name }_verify`] = com_data?.form_value_code || '';
                            }
                        } else if (item.key ==='date-group') {
                            submit_data[`${ name }_start`] = value[0] || '';
                            submit_data[`${ name }_end`] = value[1] || '';
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
                        } else if (['select', 'radio-btns', 'single-text'].includes(item.key) && ['select', 'radio-btns'].includes(item.com_data.type)) {
                            submit_data[name] = value;
                            const value_list = com_data.option_list.filter((item) => item.is_other == '1');
                            if (value_list.length > 0) {
                                submit_data[`${ name }_other_value`] = com_data?.other_value || '';
                            }
                        } else if (['checkbox', 'select-multi'].includes(item.key)) {
                            submit_data[name] = value;
                            if (com_data.is_add_option == '1') {
                                submit_data[`${ name }_custom_option_list`] = com_data?.custom_option_list || [];
                            }
                        } else {
                            submit_data[name] = value;
                        }
                    }
                });
                this.$emit('onSubmitEvent', { type: 'success', submit_data: submit_data, message: ''});
            } catch (error) {
                this.$emit('onSubmitEvent', { type: 'error', submit_data: {}, message: '数据错误'});
            }
        },
        /*
        * 表单提交校验逻辑
        */
        submit_data_check() {
            const data = JSON.parse(JSON.stringify(this.filteredDiyData));
            // 遍历所有过滤后的自定义数据项
            data?.forEach((item) => {
                let com_data = item.com_data;
                // 跳过非必填项
                if (com_data.is_required === '1') {
                    // 特殊字段验证：手机号
                    if (item.key === 'phone') {
                        const { is_error = '0', error_text = '' } = this.handle_phone_validation(com_data);
                        com_data.common_config.is_error = is_error;
                        com_data.common_config.error_text = error_text;
                    } 
                    // 其他字段的格式验证
                    else if (this.fieldCheckMap[item.key]) {
                        let field_data = this.fieldCheckMap[item.key];
                        if (['single-text', 'select', 'radio-btns'].includes(item.com_data.type)) {
                            field_data = this.fieldCheckMap[item.com_data.type];
                        }
                        const { is_format, type } = field_data;
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
                    com_data = this.subform_data_check(com_data);
                }
            });
            return data;
        },
        /*
        * 子表单的校验
        */
        subform_data_check(com_data) { 
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
                        const checkConfig = this.fieldCheckMap[data_item.key];
                        if (checkConfig) {
                            // 特殊字段验证：手机号
                            if (data_item.key === 'phone') {
                                const { is_error = '0', error_text = '' } = this.handle_phone_validation(data_item);
                                data_item.com_data.common_config.is_error = is_error;
                                data_item.com_data.common_config.error_text = error_text;
                            }
                            // 其他字段的格式验证
                            else if (this.fieldCheckMap[data_item.key]) {
                                let field_data = this.fieldCheckMap[data_item.key];
                                if (['single-text', 'select', 'radio-btns'].includes(data_item.com_data.type)) {
                                    field_data = this.fieldCheckMap[data_item.com_data.type];
                                }
                                const { is_format, type } = field_data;
                                const { is_error = '0', error_text = '' } = get_format_checks(data_item.com_data, data_item.com_data.form_value, is_format, type);
                                data_item.com_data.common_config.is_error = is_error;
                                data_item.com_data.common_config.error_text = error_text;
                            }
                        }
                    });
                });
            }
            return com_data;
        },
        /*
        * 子表单内的数据提取
        */
        subform_data_extraction(data_list) {
            return data_list.map((subform_item) => {
                const data = {};
                // 子表单中每一行的数据显示
                subform_item.data_list.forEach((item1) => {
                    // 子表单中每个独立的数据name
                    const subform_name = isEmpty(item1.form_name) ? item1.id : item1.form_name;
                    const subform_com_data = item1.com_data;
                    // 对应的value
                    const subform_value = isEmpty(subform_com_data.form_value) ? '' : subform_com_data.form_value;
                    if (!filter_data.includes(item1.key)) {
                        if (item1.key == 'address') {
                            data[`${ subform_name }_province_id`] = subform_value[0] || '';
                            data[`${ subform_name }_city_id`] = subform_value[1] || '';
                            data[`${ subform_name }_county_id`] = subform_value[2] || '';
                            // 省市区中文名称
                            submit_data[`${ subform_name }_province_name`] = subform_com_data.province_name || '';
                            submit_data[`${ subform_name }_city_name`] = subform_com_data.city_name || ''
                            submit_data[`${ subform_name }_county_name`] = subform_com_data.county_name || ''
                        } else if (item.key ==='date-group') {
                            submit_data[`${ subform_name }_start`] = subform_value[0] || '';
                            submit_data[`${ subform_name }_end`] = subform_value[1] || '';
                        } else if (['checkbox', 'select-multi'].includes(item.key)) {
                            submit_data[subform_name] = subform_value;
                            if (subform_com_data.is_add_option == '1') {
                                submit_data[`${ subform_name }_custom_option_list`] = subform_com_data?.custom_option_list || [];
                            }
                        } else {
                            data[subform_name] = subform_value;
                        }
                    }
                });
                return data;
            });
        },
        /*
        * 处理手机号验证逻辑
        */
        handle_phone_validation(com_data) {
            if (com_data.is_sms_verification === '1' && com_data.is_required === '1' && isEmpty(com_data.form_value_code)) {
                com_data.common_config.is_error = '1';
                com_data.common_config.error_text = '短信验证码不能为空';
                return;
            }
            com_data.common_config.format = com_data.is_telephone === '1' ? 'telephone-number' : 'phone-number';
            return get_format_checks(com_data, com_data.form_value, true);
        },
        /*
        * 子表单显隐规则数据处理
        */
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
        /*
        * 没有办法监听用户离开时进行校验逻辑的组件，直接使用数据更新时的执行校验逻辑，并抛给父级
        */
        verify_when_data_changes (id) { 
            const data = JSON.parse(JSON.stringify(this.filteredDiyData));
            const filter_data_list = data.filter((item) => ['subform', 'position', 'rich-text', 'upload-attachments', 'upload-img', 'upload-video'].includes(item.key) && item.id === id);
            if (filter_data_list.length > 0) {
                filter_data_list?.forEach((item) => {
                    let com_data = item.com_data;
                    if (item.key === 'subform') {
                        com_data = this.subform_data_check(com_data);
                        // 子表单中每一行的数据显示
                        const subform_data = this.subform_data_extraction(com_data.data_list);
                        let is_error = '0';
                        // 如果子表单外层为error直接显示名称出来
                        if (com_data.common_config.is_error == '1') {
                            is_error = '1';
                            message = `${com_data.title}「${com_data.common_config.error_text}」`;
                        } else {
                            // 判断子表单每一行是否有报错提示
                            const is_list_error = com_data.data_list.some((item1) => item1.data_list.some(list_item => list_item.com_data.common_config.is_error === '1'));
                            if (is_list_error) {
                                is_error = '1';
                                // 如果是内部问题，让用户自己检查子表单内的填写
                                message = `请检查${com_data.title}内的填写`;
                            }
                        }
                        this.on_item_event({ id: item.id, key: item.key, value: subform_data, is_error: is_error, error_text: message });
                    } else {
                        // 跳过非必填项
                        if (com_data.is_required === '1') {
                            if (this.fieldCheckMap[item.key]) {
                                let field_data = this.fieldCheckMap[item.key];
                                if (['single-text', 'select', 'radio-btns'].includes(com_data.type)) {
                                    field_data = this.fieldCheckMap[com_data.type];
                                }
                                const { is_format, type } = field_data;
                                const { is_error = '0', error_text = '' } = get_format_checks(com_data, com_data.form_value, is_format, type);
                                // 文件进行校验
                                this.on_item_event({ id: item.id, key: item.key, value: com_data.form_value, is_error, error_text });
                            }
                        }
                    }
                });
            }
        },
        /*
        * 单个文件更新触发的事件
        */
        on_item_event(e) {
            // 取出对应id的数据
            const data = this.data_list.find((item) => item.id == e.id);
            // 判断是否为空，为空则不进行处理
            if (data) {
               this.$emit('onItemEvent', { type: e.is_error == '1' ? 'error' : 'success', message: e.error_text, value: e.value, form_name: data.form_name });
            }
        },
        /*
        * 层级修改
        */
        z_index_change(e) {
            this.setData({
                z_index_id: e
            });
            this.$emit('zIndexChange', e);
        }
    }
}
</script>

<style lang="scss" scoped>
.row-item {
    padding: 10rpx 20rpx;
    border-bottom: 2rpx solid #eee;
    overflow: hidden;
}
.row-item:last-child {
    border-bottom: none;
}
.column-item {
    padding: 20rpx;
}
.item_error {
    background: #fef6e6;
}
.field-invalid-info {
    color: #FF5353;
    font-size: 24rpx;
    line-height: 40rpx;
}
.required {
    color: #FF5353;
    font-weight: 700;
    padding-left: 6rpx;
}
</style>