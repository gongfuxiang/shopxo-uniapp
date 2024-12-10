<template>
    <view class="wh-auto pr" :style="'height:' + propDataHeight * propScale + 'px;'">
        <view v-for="(item, index) in propCustomList" :key="item.id" class="main-content" :style="{ left: get_percentage_count(item.location.x), top: get_percentage_count(item.location.y), width: get_percentage_count(item.com_data.com_width), height: get_percentage_count(item.com_data.com_height), 'z-index': propCustomList.length - 1 > 0 ? (propCustomList.length - 1) - index : 0 }">
            <template v-if="item.key == 'text'">
                <model-text :propKey="propKey" :propValue="item.com_data" :propScale="propScale" :propSourceList="propSourceList" :propIsCustom="propIsCustom" :propTitleParams="propShowData.data_name" :data-index="propDataIndex" @url_event="url_event"></model-text>
            </template>
            <template v-else-if="item.key == 'img'">
                <model-image :propKey="propKey" :propValue="item.com_data" :propScale="propScale" :propSourceList="propSourceList" :propIsCustom="propIsCustom" :propImgParams="propShowData.data_logo" :data-index="propDataIndex" @url_event="url_event"></model-image>
            </template>
            <template v-else-if="item.key == 'auxiliary-line'">
                <model-lines :propKey="propKey" :propValue="item.com_data" :propScale="propScale" :propSourceList="propSourceList" :propIsCustom="propIsCustom"></model-lines>
            </template>
            <template v-else-if="item.key == 'icon'">
                <model-icon :propKey="propKey" :propValue="item.com_data" :propScale="propScale" :propSourceList="propSourceList" :propIsCustom="propIsCustom" :data-index="propDataIndex" @url_event="url_event"></model-icon>
            </template>
            <template v-else-if="item.key == 'panel'">
                <model-panel :propKey="propKey" :propValue="item.com_data" :propScale="propScale" :propSourceList="propSourceList" :propIsCustom="propIsCustom" :data-index="propDataIndex" @url_event="url_event"></model-panel>
            </template>
        </view>
    </view>
</template>

<script>
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
        propCustomList: {
            type: Array,
            default: () => {
                return [];
            },
            required: true,
        },
        propSourceList: {
            type: Object,
            default: () => {
                return {};
            }
        },
        propDataHeight: {
            type: Number,
            default: 0,
        },
        propScale: {
            type: Number,
            default: 1,
        },
        propDataIndex: {
            type: Number,
            default: 1,
        },
        propDataSplitIndex: {
            type: Number,
            default: 1,
        },
        propIsCustom: {
            type: Boolean,
            default: false,
        },
        propShowData: {
            type: Object,
            default: () => ({
                data_key: 'id',
                data_name: 'name'
            }),
        },
        propKey: {
            type: [String, Number],
            default: '',
        },
    },
    data() {
        return {};
    },
    computed: {
        get_percentage_count() {
            return (num) => {
                return num * this.propScale + 'px';
            };
        },
    },
    methods: {
        url_event(e) {
            this.$emit('url_event', e, this.propDataIndex, this.propDataSplitIndex);
        }
    },
};
</script>

<style lang="scss" scoped>
.main-content {
    position: absolute;
    overflow: hidden;
}
</style>