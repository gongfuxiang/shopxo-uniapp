<template>
    <view :style="style_container">
        <view class="custom-container wh-auto ht-auto" :style="style_img_container">
            <view class="wh-auto pr" :style="'height:' + form.height * scale + 'px;'">
                <view v-for="(item, index) in form.custom_list" :key="item.id" class="main-content" :style="{ left: get_percentage_count(item.location.x, div_width), top: get_percentage_count(item.location.y, div_height), width: get_percentage_count(item.com_data.com_width, div_width), height: get_percentage_count(item.com_data.com_height, div_height), 'z-index': custom_list_length > 0 ? custom_list_length - index : 0 }">
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
    </view>
</template>

<script>
    import { common_styles_computer, common_img_computer, percentage_count } from '@/common/js/common/common.js';
    const app = getApp();
    import modelText from '@/components/diy/modules/custom/model-text.vue';
    import modelLines from '@/components/diy/modules/custom/model-lines.vue';
    import modelImage from '@/components/diy/modules/custom/model-image.vue';
    import modelIcon from '@/components/diy/modules/custom/model-icon.vue';
    import modelPanel from '@/components/diy/modules/custom/model-panel.vue';
    var system = app.globalData.get_system_info(null, null, true);
    var sys_width = app.globalData.window_width_handle(system.windowWidth);

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
            propKey: {
                type: [String, Number],
                default: '',
            },
            // 组件渲染的下标
            propIndex: {
                type: Number,
                default: 1000000,
            },
        },
        data() {
            return {
                form: {},
                new_style: {},
                scale: 1,
                style_container: '',
                style_img_container: '',
                div_width: 0,
                div_height: 0,
                custom_list_length: 0,
            };
        },
        computed: {
            get_percentage_count() {
                return (num, container_size) => {
                    return num * this.scale + 'px';
                };
            },
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
            percentage_count,
            init() {
                const new_form = this.propValue.content;
                const new_style = this.propValue.style;
                const { margin_left, margin_right } = new_style.common_style;
                const width = sys_width - margin_left - margin_right;
                this.setData({
                    form: new_form,
                    new_style: new_style,
                    div_width: width,
                    scale: width / 390,
                    custom_list_length: new_form.custom_list.length - 1,
                    style_container: common_styles_computer(new_style.common_style) + 'box-sizing: border-box;', // 用于样式显示
                    style_img_container: common_img_computer(new_style.common_style, this.propIndex),
                    div_height: new_form.height,
                });
                console.log(this.propIndex);
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
