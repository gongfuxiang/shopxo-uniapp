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
                        <view class="field-label flex-row align-c gap-10" :style="field_label_style">
                            <view class="flex-row align-c" :style="title_style">{{ item.com_data.title }}<view v-if="item.com_data.is_required == '1'" class="required">*</view></view>
                            <view v-if="item.com_data.common_config.help_is_show == '1' && !isEmpty(item.com_data.common_config.help_explain)" :data-value="item.com_data.common_config.help_explain" @tap="help_icon_event">
                                <iconfont name="icon-miaosha-hdgz" :size="help_icon_style" color="#999"></iconfont>
                            </view>
                        </view>
                        <view class="flex-1 wh-auto flex-col gap-5">
                            <view v-if="['single-text', 'radio-btns', 'select'].includes(item.key) && item.com_data.type == 'single-text'" class="wh-auto" :style="item.com_data.common_style">
                                <componentInput :propValue="item.com_data" :propKey="propKey" :propDataIndex="index" :propStyle="component_style" @dataCheck="data_check" @dataChange="data_change"></componentInput>
                            </view>
                            <view v-else-if="item.key == 'multi-text'" class="wh-auto" :style="item.com_data.common_style + 'padding: 18rpx 8rpx;'">
                                <componentTextarea :propValue="item.com_data" :propKey="propKey" :propDataIndex="index" :propStyle="component_style" @dataCheck="data_check" @dataChange="data_change"></componentTextarea>
                            </view>
                            <view v-else-if="['select-multi', 'checkbox'].includes(item.key) && item.com_data.type == 'checkbox'" class="wh-auto">
                                <componentCheckbox :propValue="item.com_data" :propKey="propKey" :propDataIndex="index" :propMobile="mobile" :propStyle="component_style" @dataCheck="data_check" @dataChange="data_change" @data_option_change="data_option_change"></componentCheckbox>
                            </view>
                            <view v-else-if="['single-text', 'radio-btns', 'select'].includes(item.key) && item.com_data.type == 'radio-btns'" class="wh-auto">
                                <componentRadio :propValue="item.com_data" :propKey="propKey" :propDataIndex="index" :propMobile="mobile" :propStyle="component_style" @dataCheck="data_check" @dataChange="data_change"></componentRadio>
                            </view>
                            <view v-else-if="['single-text', 'radio-btns', 'select'].includes(item.key) && item.com_data.type == 'select'" class="wh-auto" :style="item.com_data.common_style">
                                <componentSelect :propValue="item.com_data" :propKey="propKey" :propDataIndex="index" :propMobile="mobile" :propDirection="flex_direction" :propStyle="component_style" @dataCheck="data_check" @dataChange="data_change"></componentSelect>
                            </view>
                            <view v-else-if="['select-multi', 'checkbox'].includes(item.key) && item.com_data.type == 'select-multi'" class="wh-auto" :style="item.com_data.common_style">
                                <componentSelectMulti :propValue="item.com_data" :propKey="propKey" :propDataIndex="index" :propMobile="mobile" :propDirection="flex_direction" :propStyle="component_style" @dataCheck="data_check" @dataChange="data_change" @data_option_change="data_option_change"></componentSelectMulti>
                            </view>
                            <view v-else-if="item.key == 'number'" class="wh-auto" :style="item.com_data.common_style">
                               <componentNumber :propValue="item.com_data" :propKey="propKey" :propDataIndex="index" :propMobile="mobile" :propStyle="component_style" @dataCheck="data_check" @dataChange="data_change"></componentNumber>
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
import componentSelectMulti from '@/pages/form-input/components/form-input/select-multi.vue';
export default {
    name: 'diy',
    components: {
        componentInput,
        componentTextarea,
        componentCheckbox,
        componentRadio,
        componentNumber,
        componentSelect,
        componentSelectMulti,
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
            return flex_direction == 'row' ? '' : common_form_styles_computer(item) + 'padding: 0px 8rpx;';
        },
        data_check(e) {
            const { is_error, error_text, value, index } = e;
            const data = this.data_list;
            data[index].com_data.form_value = value;
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
        data_option_change(e) {
            const { list, value, index } = e;
            const data = this.data_list;
            data[index].com_data.form_value = value;
            data[index].com_data.custom_option_list = list;
            this.setData({ data_list: data });
        },
        help_icon_event(e) {
            this.setData({ popup_help_content: e.currentTarget.dataset.value });
            this.$refs.popup.open();
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