<template>
    <view :style="style_container + 'height:' + form.height * 2 + 'rpx;'">
        <view class="custom-container wh-auto ht-auto" :style="style_img_container">
            <view class="wh-auto ht-auto pr">
                <view v-for="item in form.custom_list" :key="item.id" class="main-content"
                    :style="{ left: get_percentage_count(item.location.x, div_width), top: get_percentage_count(item.location.y, div_height), width: get_percentage_count(item.com_data.com_width, div_width), height: get_percentage_count(item.com_data.com_height, div_height) }">
                    <template v-if="item.key == 'text'">
                        <model-text :propkey="propkey" :propValue="item.com_data"
                            :propSourceList="form.data_source_content" @url_event="url_event"></model-text>
                    </template>
                    <template v-else-if="item.key == 'img'">
                        <model-image :propkey="propkey" :propValue="item.com_data"
                            :propSourceList="form.data_source_content" @url_event="url_event"></model-image>
                    </template>
                    <template v-else-if="item.key == 'auxiliary-line'">
                        <model-lines :propkey="propkey" :propValue="item.com_data"
                            :propSourceList="form.data_source_content"></model-lines>
                    </template>
                    <template v-else-if="item.key == 'icon'">
                        <model-icon :propkey="propkey" :propValue="item.com_data"
                            :propSourceList="form.data_source_content" @url_event="url_event"></model-icon>
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

export default {
    components: {
        modelText,
        modelLines,
        modelImage,
        modelIcon,
    },
    props: {
        propValue: {
            type: Object,
            default: () => {
                return {};
            },
        },
        propkey: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            form: {},
            new_style: {},
            scale: 0,
            style_container: '',
            style_img_container: '',
            div_width: 0,
            div_height: 0,
        };
    },
    computed: {
        get_percentage_count() {
            return (num, container_size) => {
                return this.percentage_count(num * this.scale, container_size);
            };
        },
    },
    watch: {
        propkey(val) {
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
            this.setData({
                form: this.propValue.content,
                new_style: this.propValue.style,
            });
            this.$nextTick(() => {
                const query = uni.createSelectorQuery().in(this);
                query
                    .select('.custom-container')
                    .boundingClientRect((res) => {
                        if ((res || null) != null) {
                            this.setData({
                                div_width: res.width,
                                scale: res.width / 390,
                            });
                        }
                    })
                    .exec();
            });
            this.setData({
                style_container: common_styles_computer(this.new_style.common_style) + 'box-sizing: border-box;', // 用于样式显示
                style_img_container: common_img_computer(this.new_style.common_style),
                div_height: this.form.height,
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
