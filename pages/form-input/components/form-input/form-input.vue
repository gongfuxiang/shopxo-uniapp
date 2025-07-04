<template>
    <view class="re oh wh-auto ht-auto">
        <scroll-view :scroll-top="scrollTop" :scroll-y="true" :scroll-x="overall_config.type_value == 'default' ? false : true" class="scroll-box" scroll-with-animation> 
            <view class="abs w h" :style="content_style">
                <template v-if="!isEmpty(img_url)">
                    <image :src="img_url" mode="aspectFit" />
                </template>
            </view>
            <view v-if="is_show_heading_title == '1'" class="head-title flex-row bg-white" :style="heading_title_style">{{ form_name }}</view>
            <view class="data-list bg-white">
                <!-- 组件显示逻辑 -->
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
                    @dataChange="data_change"
                    @dataCheck="data_check"
                    @dataOptionChange="data_option_change"
                    @dataCodeChange="data_code_change"
                    @dataCodeCheck="data_code_check"
                    @dataAddressChange="data_address_change"
                    @openRegion="open_region"
                    @helpIconEvent="help_icon_event"
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
            <component-region-picker :propProvinceId="province_id" :propCityId="city_id" :propCountyId="county_id" :propShow="region_picker_show" @onclose="close_event" @callBackEvent="region_event"></component-region-picker>
        </view>
    </view>
</template>

<script>
import { isEmpty, common_form_styles_computer } from '@/common/js/common/common.js';
const app = getApp();
import componentRegionPicker from '@/pages/common/components/region-picker/region-picker';
import componentShow from '@/pages/form-input/components/form-input/modules/component-show/index.vue';
export default {
    name: 'formInput',
    components: {
        componentRegionPicker,
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
            // 地址弹出框的处理
            address_id: '',
            province_id: '',
            city_id: '',
            county_id: '',
            region_picker_show: false,
            scrollTop: 0,
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
            setTimeout(() => {
                this.setData({
                    scrollTop: 0.01
                })
            }, 500);
        },
        get_form_border_style(item, flex_direction) {
            return flex_direction == 'row' ? '' : common_form_styles_computer(item) + 'padding: 0px 22rpx;box-sizing:content-box;';
        },
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
        help_icon_event(val) {
            this.setData({ popup_help_content: val });
            this.$refs.popup.open();
        },
        open_region(id, province_id, city_id, county_id) {
            this.setData({ 
                region_picker_show: true, 
                province_id, 
                city_id, 
                county_id,
                address_id: id,
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
            // 改变对应id的数据
            const data_list = [...this.data_list];
            data_list.forEach(item => {
                if (item.id == this.address_id && item.com_data) {
                    item.com_data.form_value = [ data.province.id, data.city.id, data.areal.id ];
                    item.com_data.province_name = data.province.name || '';
                    item.com_data.city_name = data.city.name || '';
                    item.com_data.county_name = data.areal.name || '';
                }
            });
            this.setData({ data_list: data_list });
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
}
.popup-content {
    background: #fff;
    padding: 32rpx;
    border-radius: 10rpx;
}
</style>