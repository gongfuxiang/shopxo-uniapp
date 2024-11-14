<template>
    <view v-if="data_source_content_list.length > 0">
        <view v-for="(item1, index1) in data_source_content_list" :key="index1" class="oh" :style="style_container">
            <view class="custom-container wh-auto ht-auto oh" :style="style_img_container">
                <view class="wh-auto pr oh" :style="'height:' + form.height * scale + 'px;'">
                    <view v-for="(item, index) in form.custom_list" :key="item.id" class="main-content"
                        :style="{ left: get_percentage_count(item.location.x), top: get_percentage_count(item.location.y), width: get_percentage_count(item.com_data.com_width), height: get_percentage_count(item.com_data.com_height), 'z-index': custom_list_length > 0 ? custom_list_length - index : 0 }">
                        <template v-if="item.key == 'text'">
                            <model-text :propKey="propKey" :propValue="item.com_data" :propScale="scale" :propSourceList="item1" :propSourceType="data_source" @url_event="url_event"></model-text>
                        </template>
                        <template v-else-if="item.key == 'img'">
                            <model-image :propKey="propKey" :propValue="item.com_data" :propScale="scale" :propSourceList="item1" :propSourceType="data_source" @url_event="url_event"></model-image>
                        </template>
                        <template v-else-if="item.key == 'auxiliary-line'">
                            <model-lines :propKey="propKey" :propValue="item.com_data" :propScale="scale" :propSourceList="item1" :propSourceType="data_source"></model-lines>
                        </template>
                        <template v-else-if="item.key == 'icon'">
                            <model-icon :propKey="propKey" :propValue="item.com_data" :propScale="scale" :propSourceList="item1" :propSourceType="data_source" @url_event="url_event"></model-icon>
                        </template>
                        <template v-else-if="item.key == 'panel'">
                            <model-panel :propKey="propKey" :propValue="item.com_data" :propScale="scale" :propSourceList="item1" :propSourceType="data_source" @url_event="url_event"></model-panel>
                        </template>
                    </view>
                </view>
            </view>
        </view>
    </view>
    <view v-else>
        <view class="oh" :style="style_container">
            <view class="custom-container wh-auto ht-auto oh" :style="style_img_container">
                <view class="wh-auto pr oh" :style="'height:' + form.height * scale + 'px;'">
                    <view v-for="(item, index) in form.custom_list" :key="item.id" class="main-content"
                        :style="{ left: get_percentage_count(item.location.x), top: get_percentage_count(item.location.y), width: get_percentage_count(item.com_data.com_width), height: get_percentage_count(item.com_data.com_height), 'z-index': custom_list_length > 0 ? custom_list_length - index : 0 }">
                        <template v-if="item.key == 'text'">
                            <model-text :propKey="propKey" :propValue="item.com_data" :propScale="scale" @url_event="url_event"></model-text>
                        </template>
                        <template v-else-if="item.key == 'img'">
                            <model-image :propKey="propKey" :propValue="item.com_data" :propScale="scale" @url_event="url_event"></model-image>
                        </template>
                        <template v-else-if="item.key == 'auxiliary-line'">
                            <model-lines :propKey="propKey" :propValue="item.com_data" :propScale="scale"></model-lines>
                        </template>
                        <template v-else-if="item.key == 'icon'">
                            <model-icon :propKey="propKey" :propValue="item.com_data" :propScale="scale" @url_event="url_event"></model-icon>
                        </template>
                        <template v-else-if="item.key == 'panel'">
                            <model-panel :propKey="propKey" :propValue="item.com_data" :propScale="scale" @url_event="url_event"></model-panel>
                        </template>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import { padding_computer, isEmpty, margin_computer, gradient_computer, radius_computer, background_computer } from '@/common/js/common/common.js';
const app = getApp();
import modelText from '@/components/diy/modules/custom/model-text.vue';
import modelLines from '@/components/diy/modules/custom/model-lines.vue';
import modelImage from '@/components/diy/modules/custom/model-image.vue';
import modelIcon from '@/components/diy/modules/custom/model-icon.vue';
import modelPanel from '@/components/diy/modules/custom/model-panel.vue';

export default {
    components: {
        modelText,
        modelLines,
        modelImage,
        modelIcon,
        modelPanel,
    },
    props: {
        propValue: {
            type: Object,
            default: () => {
                return {};
            },
        },
        propMagicScale: {
            type: Number,
            default: 1,
        },
        propDataSpacing: {
            type: Number,
            default: 0,
        }
    },
    data() {
        return {
            form: {},
            new_style: {},
            scale: 1,
            style_container: '',
            div_width: 0,
            div_height: 0,
            custom_list_length: 0,
            data_source_content_list: [],
            data_source: '',
        };
    },
    computed: {
        get_percentage_count() {
            return (num) => {
                return num * this.scale + 'px';
            };
        },
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            if (!isEmpty(this.propValue)) {
                const new_form = this.propValue.data_content;
                const new_style = this.propValue.data_style;
                const { data_color_list = [], data_direction = '180deg', data_radius = { radius: 0, radius_top_left: 0, radius_top_right: 0, radius_bottom_left: 0, radius_bottom_right: 0 }, data_background_img = [], data_background_img_style = '2', data_chunk_padding = { padding: 0, padding_top: 0, padding_bottom: 0, padding_left: 0, padding_right: 0 }, data_chunk_margin = { margin: 0, margin_top: 0, margin_bottom: 0, margin_left: 0, margin_right: 0 } } = new_style;
                const style_data = {
                    color_list: data_color_list,
                    direction: data_direction,
                }
                const style_img_data = {
                    background_img: data_background_img,
                    background_img_style: data_background_img_style,
                }
                const { padding_left, padding_right } = data_chunk_padding;
                const { margin_left, margin_right } = data_chunk_margin;
                const width = new_form.width - padding_left - padding_right - margin_left - margin_right - (this.propDataSpacing / 2);
                // 数据来源的内容
                let list = [];
                if (['goods', 'article', 'brand'].includes(new_form.data_source)) {
                    if (new_form.data_source_content.data_type == '0') {
                        list = new_form.data_source_content.data_list;
                    } else {
                        list = new_form.data_source_content.data_auto_list.map(item => ({
                            id: Math.random(),
                            new_cover: [],
                            new_title: '',
                            data: item,
                        }));
                    }
                } else {
                    list = new_form.data_source_content.data_list;
                }
                this.setData({
                    propKey: Math.random(),
                    form: new_form,
                    new_style: new_style,
                    div_width: width,
                    scale: (width / new_form.width) * this.propMagicScale,
                    custom_list_length: new_form.custom_list.length - 1,
                    style_container: gradient_computer(style_data) + radius_computer(data_radius) + margin_computer(data_chunk_margin), // 用于样式显示
                    style_img_container: padding_computer(data_chunk_padding) + background_computer(style_img_data) + 'box-sizing: border-box;',
                    data_source_content_list: list,
                    data_source: !isEmpty(new_form.data_source)? new_form.data_source : '',
                });
            }
        },
        url_event(e) {
            app.globalData.url_event(e);
        },
    },
};
</script>

<style scoped lang="scss">
.main-content {
    position: absolute;
    overflow: hidden;
}
</style>
