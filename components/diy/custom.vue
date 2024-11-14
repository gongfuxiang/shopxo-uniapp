<template>
    <view v-if="data_source_content_list.length > 0">
        <view v-for="(item1, index1) in data_source_content_list" :key="index1" :style="style_container">
            <view class="custom-container wh-auto ht-auto" :style="style_img_container">
                <view class="wh-auto pr" :style="'height:' + form.height * scale + 'px;'">
                    <view v-for="(item, index) in form.custom_list" :key="item.id" class="main-content" :style="{ left: get_percentage_count(item.location.x, div_width), top: get_percentage_count(item.location.y, div_height), width: get_percentage_count(item.com_data.com_width, div_width), height: get_percentage_count(item.com_data.com_height, div_height), 'z-index': custom_list_length > 0 ? custom_list_length - index : 0 }">
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
        <view :style="style_container">
            <view class="custom-container wh-auto ht-auto" :style="style_img_container">
                <view class="wh-auto pr" :style="'height:' + form.height * scale + 'px;'">
                    <view v-for="(item, index) in form.custom_list" :key="item.id" class="main-content" :style="{ left: get_percentage_count(item.location.x, div_width), top: get_percentage_count(item.location.y, div_height), width: get_percentage_count(item.com_data.com_width, div_width), height: get_percentage_count(item.com_data.com_height, div_height), 'z-index': custom_list_length > 0 ? custom_list_length - index : 0 }">
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
    import { common_styles_computer, common_img_computer, percentage_count } from '@/common/js/common/common.js';
    const app = getApp();
    import modelText from '@/components/diy/modules/custom/model-text.vue';
    import modelLines from '@/components/diy/modules/custom/model-lines.vue';
    import modelImage from '@/components/diy/modules/custom/model-image.vue';
    import modelIcon from '@/components/diy/modules/custom/model-icon.vue';
    import modelPanel from '@/components/diy/modules/custom/model-panel.vue';
import { isEmpty } from '../../common/js/common/common';
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
            propOuterContainerPadding: {
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
                style_img_container: '',
                div_width: 0,
                div_height: 0,
                custom_list_length: 0,
                source_list: {
                    goods: {
                        // 存放手动输入的id
                        data_ids: [],
                        // 手动输入
                        data_list: [],
                        // 自动
                        data_auto_list: [],
                        // 商品类型
                        data_type: '0',
                        // 商品分类
                        category_ids: [],
                        // 品牌
                        brand_ids: [],
                        // 显示数量
                        number: 4,
                        // 排序类型
                        order_by_type: '0',
                        // 排序规则
                        order_by_rule: '0',
                    },
                    article: {
                        // 存放手动输入的id
                        data_ids: [],
                        // 手动输入
                        data_list: [],
                        // 自动
                        data_auto_list: [],
                        data_type: '0',
                        number: 4,
                        order_by_type: '0',
                        order_by_rule: '0',
                        // 文章封面
                        is_cover: '0',
                        // 分类id
                        category_ids: [],
                    },
                    brand: {
                        // 存放手动输入的id
                        data_ids: [],
                        // 手动输入
                        data_list: [],
                        // 自动
                        data_auto_list: [],
                        // 商品类型
                        data_type: '0',
                        // 商品分类
                        category_ids: [],
                        // 品牌
                        brand_ids: [],
                        // 显示数量
                        number: 4,
                        // 排序类型
                        order_by_type: '0',
                        // 排序规则
                        order_by_rule: '0',
                    }, 
                    common: {
                        // 存放手动输入的id
                        data_ids: [],
                        // 手动输入
                        data_list: [],
                        // 自动
                        data_auto_list: [],
                    }
                },
                data_source_content_list: [],
                data_source: '',
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
                // 不包含新创建的数组时，将历史数据放到手动添加数组中
                if (!Object.keys(new_form.data_source_content).includes('data_auto_list') && !Object.keys(new_form.data_source_content).includes('data_list')) {
                    //深拷贝一下，保留历史数据
                    const data = JSON.parse(JSON.stringify(new_form.data_source_content));
                    // 判断是否有符合条件的数据源，如何没有的话取公共数据源
                    if (!isEmpty(this.source_list[new_form.data_source])) {
                        new_form.data_source_content = this.source_list[new_form.data_source];
                    } else {
                        new_form.data_source_content = this.source_list['common'];
                    }
                    // 如果老数组中有数据，将数据放到新数组中
                    if (!isEmpty(data)) {
                        new_form.data_source_content.data_list = [ data ];
                    }
                }
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
                const { margin_left, margin_right, padding_left, padding_right } = new_style.common_style;
                const width = sys_width - margin_left - margin_right - padding_left - padding_right - this.propOuterContainerPadding;
                this.setData({
                    form: new_form,
                    new_style: new_style,
                    div_width: width,
                    scale: width / 390,
                    custom_list_length: new_form.custom_list.length - 1,
                    style_container: common_styles_computer(new_style.common_style) + 'box-sizing: border-box;', // 用于样式显示
                    style_img_container: common_img_computer(new_style.common_style, this.propIndex),
                    div_height: new_form.height,
                    data_source_content_list: list,
                    data_source: !isEmpty(new_form.data_source)? new_form.data_source : '',
                });
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
