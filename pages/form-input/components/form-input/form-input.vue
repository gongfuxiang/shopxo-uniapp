<template>
    <view class="re oh wh-auto ht-auto">
        <scroll-view :scroll-y="true" class="scroll-box" scroll-with-animation="true">
            <view class="abs w h" :style="content_style">
                <template v-if="!isEmpty(img_url)">
                    <image :src="img_url" mode="aspectFit" />
                </template>
            </view>
            <view v-if="is_show_heading_title == '1'" class="head-title flex-row" :style="heading_title_style">{{ form_name }}</view>
            <view class="data-list">
                <view v-for="(item, index) in data_list" :key="index" :class="(flex_direction == 'row' ? 'row-item' : 'column-item mb-10') + (item.com_data.common_config.is_error == '1' ? ' item_error' : '')">
                    <!-- 左右模式 -->
                    <!-- <template v-if="flex_direction == 'row'"> -->
                    <view :class="'wh-auto ht-auto ' + (flex_direction == 'row' ? 'flex-row align-b gap-10' : 'flex-col gap-10')">
                        <view v-if="item.key !== 'auxiliary-line'" class="field-label flex-row align-c gap-10" :style="field_label_style">
                            <view class="flex-row align-c" :style="title_style">{{ item.com_data.title }}<view v-if="item.com_data.is_required == '1'" class="required">*</view></view>
                            <view v-if="item.com_data.common_config.help_is_show == '1' && !isEmpty(item.com_data.common_config.help_explain)" :data-value="item.com_data.common_config.help_explain" @tap="help_icon_event">
                                <iconfont name="icon-miaosha-hdgz" :size="help_icon_style" color="#999"></iconfont>
                            </view>
                        </view>
                        <view class="flex-1 wh-auto flex-col gap-5">
                            <view v-if="['single-text', 'radio-btns', 'select'].includes(item.key) && item.com_data.type == 'single-text'" :style="item.com_data.common_style">
                                <component-input :propValue="item.com_data" :propKey="propKey" :propDataIndex="index" :propStyle="component_style" @dataCheck="data_check" @dataChange="data_change"></component-input>
                            </view>
                            <view v-else-if="item.key == 'multi-text'" :style="item.com_data.common_style + 'padding: 18rpx 22rpx;'">
                                <component-textarea :propValue="item.com_data" :propKey="propKey" :propDataIndex="index" :propStyle="component_style" @dataCheck="data_check" @dataChange="data_change"></component-textarea>
                            </view>
                            <view v-else-if="['select-multi', 'checkbox'].includes(item.key) && item.com_data.type == 'checkbox'">
                                <component-checkbox :propValue="item.com_data" :propKey="propKey" :propDataIndex="index" :propMobile="mobile" :propStyle="component_style" @dataCheck="data_check" @dataChange="data_change" @data_option_change="data_option_change"></component-checkbox>
                            </view>
                            <view v-else-if="['single-text', 'radio-btns', 'select'].includes(item.key) && item.com_data.type == 'radio-btns'">
                                <component-radio :propValue="item.com_data" :propKey="propKey" :propDataIndex="index" :propMobile="mobile" :propStyle="component_style" @dataCheck="data_check" @dataChange="data_change"></component-radio>
                            </view>
                            <view v-else-if="['single-text', 'radio-btns', 'select'].includes(item.key) && item.com_data.type == 'select'" :style="item.com_data.common_style">
                                <component-select :propValue="item.com_data" :propKey="propKey" :propDataIndex="index" :propMobile="mobile" :propDirection="flex_direction" :propStyle="component_style" @dataCheck="data_check" @dataChange="data_change"></component-select>
                            </view>
                            <view v-else-if="['select-multi', 'checkbox'].includes(item.key) && item.com_data.type == 'select-multi'" :style="item.com_data.common_style">
                                <component-select-multi :propValue="item.com_data" :propKey="propKey" :propDataIndex="index" :propMobile="mobile" :propDirection="flex_direction" :propStyle="component_style" @dataCheck="data_check" @dataChange="data_change" @data_option_change="data_option_change"></component-select-multi>
                            </view>
                            <view v-else-if="item.key == 'number'" :style="item.com_data.common_style">
                               <component-number :propValue="item.com_data" :propKey="propKey" :propDataIndex="index" :propMobile="mobile" :propStyle="component_style" @dataCheck="data_check" @dataChange="data_change"></component-number>
                            </view>
                            <view v-else-if="item.key == 'date'" :style="item.com_data.common_style">
                               <component-date :propValue="item.com_data" :propKey="propKey" :propDataIndex="index" :propMobile="mobile" :propStyle="component_style" @dataCheck="data_check" @dataChange="data_change"></component-date>
                            </view>
                            <view v-else-if="item.key == 'date-group'" :style="item.com_data.common_style">
                               <component-date-group :propValue="item.com_data" :propKey="propKey" :propDataIndex="index" :propMobile="mobile" :propStyle="component_style" @dataCheck="data_check" @dataChange="data_change"></component-date-group>
                            </view>
                            <view v-else-if="item.key == 'address'">
                               <component-address :propValue="item.com_data" :propKey="propKey" :propDataIndex="index" :propMobile="mobile" :propStyle="component_style" :propDirection="flex_direction" @dataCheck="data_check" @dataChange="data_change" @openRagion="open_ragion" @dataAddressChange="dataAddressChange"></component-address>
                            </view>
                            <view v-else-if="item.key == 'phone'">
                               <component-phone :propValue="item.com_data" :propKey="propKey" :propDataIndex="index" :propMobile="mobile" :propStyle="component_style" :propDirection="flex_direction" @dataCheck="data_check" @dataChange="data_change" @dataCodeCheck="data_code_check" @dataCodeChage="data_code_chage"></component-phone>
                            </view>
                            <view v-else-if="item.key == 'pwd'" :style="item.com_data.common_style">
                               <component-pwd :propValue="item.com_data" :propKey="propKey" :propDataIndex="index" :propMobile="mobile" :propStyle="component_style" :propDirection="flex_direction" @dataCheck="data_check" @dataChange="data_change"></component-pwd>
                            </view>
                            <view v-else-if="item.key == 'score'">
                               <component-score :propValue="item.com_data" :propKey="propKey" :propDataIndex="index" :propMobile="mobile" :propStyle="component_style" :propDirection="flex_direction" @dataCheck="data_check" @dataChange="data_change"></component-score>
                            </view>
                            <view v-else-if="item.key == 'img'">
                               <component-image :propValue="item.com_data" :propKey="propKey" :propDataIndex="index" :propMobile="mobile" :propStyle="component_style" :propDirection="flex_direction"></component-image>
                            </view>
                            <view v-else-if="item.key == 'video'">
                               <component-video :propValue="item.com_data" :propKey="propKey" :propDataIndex="index" :propMobile="mobile" :propStyle="component_style" :propDirection="flex_direction"></component-video>
                            </view>
                            <view v-else-if="item.key == 'text'">
                                <component-text :propValue="item.com_data" :propKey="propKey" :propDataIndex="index" :propMobile="mobile" :propStyle="component_style" :propDirection="flex_direction"></component-text>
                            </view>
                            <view v-else-if="item.key == 'attachments'">
                                <component-attachments :propValue="item.com_data" :propKey="propKey" :propDataIndex="index" :propMobile="mobile" :propStyle="component_style" :propDirection="flex_direction"></component-attachments>
                            </view>
                            <view v-else-if="item.key == 'auxiliary-line'">
                                <component-auxiliary-line :propValue="item.com_data" :propKey="propKey" :propDataIndex="index" :propMobile="mobile" :propStyle="component_style" :propDirection="flex_direction"></component-auxiliary-line>
                            </view>
                            <view v-if="!isEmpty(item.com_data.common_config.error_text)" class="field-invalid-info">{{ item.com_data.common_config.error_text }}</view>
                        </view>
                    </view>
                </view>
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
            <component-region-picker :propProvinceId="province_id" :propCityId="city_id" :propCountyId="county_id" :propShow="region_picker_show" @onclose="close_event" @callBackEvent="region_event"></component-region-picker>
        </view>
    </view>
</template>

<script>
import { isEmpty, common_form_styles_computer } from '@/common/js/common/common.js';
const app = getApp();
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
import componentRegionPicker from '@/pages/common/components/region-picker/region-picker';
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
        componentRegionPicker,
        componentPhone,
        componentPwd,
        componentScore,
        componentImage,
        componentVideo,
        componentText,
        componentAttachments,
        componentAuxiliaryLine
    },
    props: {
        propValue: {
            type: Object,
            default: () => ({}),
        },
        propDataId: {
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
            // 地址弹出框的处理
            address_index: 0,
            province_id: '',
            city_id: '',
            county_id: '',
            region_picker_show: false,
        };
    },
    watch: {
        propKey(val) {
            // 初始化
            this.init();
        },
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
                item.com_data.common_style = this.get_form_border_style(item.com_data.common_config, mobile.flex_direction || 'row');
            });
            this.setData({
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
        },
        get_form_border_style(item, flex_direction) {
            return flex_direction == 'row' ? '' : common_form_styles_computer(item) + 'padding: 0px 22rpx;box-sizing:content-box;';
        },
        data_check(e) {
            const { is_error, error_text, value, index } = e;
            const data = this.data_list;
            data[index].com_data.form_value = value;
            data[index].com_data.common_config.is_error = is_error;
            data[index].com_data.common_config.error_text = error_text;
            this.setData({ data_list: data });
        },
        data_code_check(e) {
            const { is_error, error_text, value, index } = e;
            const data = this.data_list;
            data[index].com_data.form_value_code = value;
            data[index].com_data.common_config.is_error = is_error;
            data[index].com_data.common_config.error_text = error_text;
            this.setData({ data_list: data });
        },
        data_change(e) {
            const { value, index } = e;
            const data = this.data_list;
            data[index].com_data.form_value = value;
            this.setData({ data_list: data });
        },
        data_code_chage(e) {
            const { value, index } = e;
            const data = this.data_list;
            data[index].com_data.form_value_code = value;
            this.setData({ data_list: data });
        },
        data_option_change(e) {
            const { list, value, index } = e;
            const data = this.data_list;
            data[index].com_data.form_value = value;
            data[index].com_data.custom_option_list = list;
            this.setData({ data_list: data });
        },
        dataAddressChange(e) {
            const { value, index } = e;
            const data = this.data_list;
            data[index].com_data.detailed_value = value;
            this.setData({ data_list: data });
        },
        
        help_icon_event(e) {
            this.setData({ popup_help_content: e.currentTarget.dataset.value });
            this.$refs.popup.open();
        },
        open_ragion(index, province_id, city_id, county_id) {
            this.setData({ 
                region_picker_show: true, 
                province_id, 
                city_id, 
                county_id,
                address_index: index,
            });
        },
        close_event(e) {
           this.setData({ 
                region_picker_show: false 
            });
        },
        region_event(e) {
            let data = uni.getStorageSync(app.globalData.data.cache_region_picker_choice_key) || {};
            if((data.province || null) == null) {
                data.province = {};
            }
            if((data.city || null) == null) {
                data.city = {};
            }
            if((data.areal || null) == null) {
                data.areal = {};
            }
            const list = this.data_list;
            list[this.address_index].com_data = {
                ...list[this.address_index].com_data,
                form_value: [ data.province.id, data.city.id, data.areal.id ],
                province_name: data.province.name || '',
                city_name: data.city.name || '',
                county_name: data.areal.name || '',
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.head-title { 
    word-wrap: break-word;
    font-size: 40rpx;
    padding: 16rpx 11rpx 0;
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
    .row-item {
        padding: 10rpx 15rpx;
        border-bottom: 2rpx solid #eee;
    }
    .row-item:last-child {
        border-bottom: none;
    }
    .column-item {
        padding: 20rpx 15rpx;
        padding-bottom: 20rpx;
    }
    .item_error {
        background: #fef6e6;
    }
    .field-invalid-info {
        color: #FF5353;
        font-size: 24rpx;
        line-height: 40rpx;
    }
}
.required {
    color: #FF5353;
    font-weight: 700;
    padding-left: 6rpx;
}
.popup-content {
    background: #fff;
    padding: 32rpx;
    border-radius: 10rpx;
}
</style>