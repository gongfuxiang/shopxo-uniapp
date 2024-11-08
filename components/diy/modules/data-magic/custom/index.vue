<template>
    <view class="wh-auto ht-auto oh" :style="style_container">
        <view class="wh-auto ht-auto pr oh">
            <view v-for="(item, index) in form.custom_list" :key="item.id" class="main-content" :style="{ left: get_percentage_count(item.location.x), top: get_percentage_count(item.location.y), width: get_percentage_count(item.com_data.com_width), height: get_percentage_count(item.com_data.com_height), 'z-index': custom_list_length > 0 ? custom_list_length - index : 0 }">
                <template v-if="item.key == 'text'">
                    <model-text :propKey="propKey" :propValue="item.com_data" :propScale="scale" :propSourceList="form.data_source_content" @url_event="url_event"></model-text>
                </template>
                <template v-else-if="item.key == 'img'">
                    <model-image :propKey="propKey" :propValue="item.com_data" :propScale="scale" :propSourceList="form.data_source_content" @url_event="url_event"></model-image>
                </template>
                <template v-else-if="item.key == 'auxiliary-line'">
                    <model-lines :propKey="propKey" :propValue="item.com_data" :propScale="scale" :propSourceList="form.data_source_content"></model-lines>
                </template>
                <template v-else-if="item.key == 'icon'">
                    <model-icon :propKey="propKey" :propValue="item.com_data" :propScale="scale" :propSourceList="form.data_source_content" @url_event="url_event"></model-icon>
                </template>
                <template v-else-if="item.key == 'panel'">
                    <model-panel :propKey="propKey" :propValue="item.com_data" :propScale="scale" :propSourceList="form.data_source_content" @url_event="url_event"></model-panel>
                </template>
            </view>
        </view>
    </view>
</template>

<script>
    import { padding_computer } from '@/common/js/common/common.js';
    const app = getApp();
    import modelText from '@/components/diy/modules/custom/model-text.vue';
    import modelLines from '@/components/diy/modules/custom/model-lines.vue';
    import modelImage from '@/components/diy/modules/custom/model-image.vue';
    import modelIcon from '@/components/diy/modules/custom/model-icon.vue';
    import modelPanel from '@/components/diy/modules/custom/model-panel.vue';
import { isEmpty } from '../../../../../common/js/common/common';

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
                    const { padding_left, padding_right } = new_style.chunk_padding;
                    const width = new_form.width - padding_left - padding_right - (this.propDataSpacing / 2);
                    this.setData({
                        propKey: Math.random(),
                        form: new_form,
                        new_style: new_style,
                        div_width: width,
                        scale: (width / new_form.width) * this.propMagicScale,
                        custom_list_length: new_form.custom_list.length - 1,
                        style_container: padding_computer(new_style.chunk_padding) + 'box-sizing: border-box;', // 用于样式显示
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
