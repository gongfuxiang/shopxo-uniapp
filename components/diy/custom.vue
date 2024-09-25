<template>
    <view ref="container" :style="style_container + 'height:'+ form.height * 2 + 'rpx;'">
        <view class="wh-auto ht-auto pr">
            <view v-for="item in form.custom_list" :key="item.id" class="main-content" :style="{'left': get_percentage_count(item.location.x, div_width) , 'top': get_percentage_count(item.location.y, div_height), 'width': get_percentage_count(item.com_data.com_width, div_width), 'height': get_percentage_count(item.com_data.com_height, div_height)}">
                <template v-if="item.key == 'text'">
                    <model-text :key="item.com_data" :value="item.com_data" :source-list="form.data_source_content" @url_open="url_open"></model-text>
                </template>
                <template v-else-if="item.key == 'img'">
                    <model-image :key="item.com_data" :value="item.com_data" :source-list="form.data_source_content" @url_open="url_open"></model-image>
                </template>
                <template v-else-if="item.key == 'auxiliary-line'">
                    <model-lines :key="item.com_data" :value="item.com_data" :source-list="form.data_source_content"></model-lines>
                </template>
                <template v-else-if="item.key == 'icon'">
                    <model-icon :key="item.com_data" :value="item.com_data" :source-list="form.data_source_content" @url_open="url_open"></model-icon>
                </template>
            </view>
        </view>
    </view>
</template>

<script>
    import { common_styles_computer, percentage_count } from '@/common/js/common/common.js';
    const app = getApp();
    var system = app.globalData.get_system_info(null, null, true);
    var sys_width = app.globalData.window_width_handle(system.windowWidth);
    import modelText from '@/components/diy/modules/custom/model-text.vue';
    import modelLines from '@/components/diy/modules/custom/model-lines.vue';
    import modelImage from '@/components/diy/modules/custom/model-image.vue';
    import modelIcon from '@/components/diy/modules/custom/model-icon.vue';
    
    export default {
        components: {
            modelText,
            modelLines,
            modelImage,
            modelIcon
        },
        props: {
            value: {
                type: Object,
                default: () => {
                    return {};
                },
            },
        },
        data() {
            return {
                form: {},
                new_style: {},
                scale: sys_width / 390,
                style_container: '',
                div_width: 0,
                div_height: 0
            };
        },
        computed: {
          get_percentage_count() {
            return (num, container_size) => {
                return this.percentage_count(num * this.scale, container_size);
            }
          }  
        },
        created() {
            this.setData({
                form: this.value.content,
                new_style: this.value.style,
            });
            this.init();
        },
        methods: {
            percentage_count,
            init() {
                this.setData({
                    style_container: common_styles_computer(this.new_style.common_style) + 'box-sizing: border-box;', // 用于样式显示
                    div_width: sys_width,
                    div_height: this.form.height * this.scale,
                });
            },
            url_open(link) {
                app.globalData.url_event(link);
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
