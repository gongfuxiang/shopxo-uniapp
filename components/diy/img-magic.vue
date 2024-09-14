<template>
    <!-- 图片魔方 -->
    <view ref="container" class="img-magic" :style="style_container + 'height:' + container_size">
        <view class="pr" :style="outer_style">
            <!-- 风格3 -->
            <template v-if="form.style_actived == 2">
                <view class="flex-row align-c jc-c style-size">
                    <view v-for="(item, index) in form.img_magic_list" :key="index" class="three" :style="img_spacing" :data-value="item.img_link.page" @tap="url_event">
                        <image :src="item.img[0].url" class="dis-block wh-auto ht-auto" mode="aspectFill" :style="content_img_radius"></image>
                    </view>
                </view>
            </template>
            <!-- 风格9 -->
            <template v-else-if="form.style_actived == 8">
                <view class="flex-row align-c jc-c style-size flex-wrap">
                    <view v-for="(item, index) in form.img_magic_list" :key="index" :class="[{ 'style9-top': [0, 1].includes(index), 'style9-bottom': ![0, 1].includes(index) }]" :style="img_spacing" :data-value="item.img_link.page" @tap="url_event">
                        <image :src="item.img[0].url" class="dis-block wh-auto ht-auto" mode="aspectFill" :style="content_img_radius"></image>
                    </view>
                </view>
            </template>
            <template v-else>
                <view v-for="(item, index) in form.img_magic_list" :key="index" class="cube-selected cr-main" :style="img_spacing + 'width:' + (((((item.end.x - item.start.x + 1) * cube_cell) / sys_width) * 100).toFixed(4) + '%') + 'height:' + (((((item.end.y - item.start.y + 1) * cube_cell) / sys_width) * 100).toFixed(4) + '%') + 'top:' + (((((item.start.y - 1) * cube_cell) / sys_width) * 100).toFixed(4) + '%') + 'left:' + (((((item.start.x - 1) * cube_cell) / sys_width) * 100).toFixed(4) + '%')" :data-value="item.img_link.page" @tap="url_event">
                    <image :src="item.img[0].url" class="dis-block wh-auto ht-auto" mode="aspectFill" :style="content_img_radius"></image>
                </view>
            </template>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import { common_styles_computer, radius_computer } from '@/common/js/common/common.js';
    var system = app.globalData.get_system_info(null, null, true);
    var sys_width = app.globalData.window_width_handle(system.windowWidth);
    // var height = app.globalData.window_height_handle(system);
    export default {
        props: {
            value: {
                type: Object,
                default: () => ({}),
            },
        },
        data() {
            return {
                form: {},
                style_container: '',
                // 外部样式
                outer_style: '',
                // 图片间距设置
                img_spacing: '',
                // 图片圆角
                content_img_radius: '',
                cube_cell: '',
                container_size: '',
            };
        },
        mounted() {
            this.$nextTick(() => {
                this.init();
            });
        },
        methods: {
            init() {
                const new_content = this.value.content || {};
                const new_style = this.value.style || {};
                // 外部样式
                const outer_spacing = `calc(100% + ${new_style.image_spacing * 2}rpx)`;
                const outer_sx = `-${new_style.image_spacing}rpx`;
                // 图片间距设置
                const spacing = `${new_style.image_spacing}rpx`;
                const density = 4;
                this.setData({
                    form: this.value.content,
                    outer_style: `width:${outer_spacing};height:${outer_spacing};margin:${outer_sx}`,
                    img_spacing: `padding:${spacing}`,
                    content_img_radius: radius_computer(new_style),
                    container_size: sys_width * 2 + 'rpx',
                    cube_cell: sys_width / density,
                    style_container: common_styles_computer(new_style.common_style),
                });
            },
            // 跳转链接
            url_event(e) {
                app.globalData.url_event(e);
            },
        },
    };
</script>

<style lang="scss" scoped>
    // 图片魔方是一个正方形，根据宽度计算高度
    .img-magic {
        width: 100%;
        overflow: hidden;
        box-sizing: border-box;
    }
    .cube-selected {
        position: absolute;
        text-align: center;
        box-sizing: border-box;
    }
    .style-size {
        height: 100%;
        width: 100%;
        box-sizing: border-box;
        .three {
            width: 33%;
            height: 100%;
            position: relative;
            box-sizing: border-box;
        }
        .style9-top {
            width: 50%;
            height: 50%;
            position: relative;
            box-sizing: border-box;
        }
        .style9-bottom {
            width: calc(100% / 3);
            height: 50%;
            position: relative;
            box-sizing: border-box;
        }
    }
</style>
