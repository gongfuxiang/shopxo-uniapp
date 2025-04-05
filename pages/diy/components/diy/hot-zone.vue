<template>
    <!-- 热区 -->
    <view ref="containerRef" class="oh container" :style="style_container">
        <view :style="style_img_container">
            <view ref="hotRef" class="hot pr" :style="style">
                <image :src="img" class="wh-auto dis-block" mode="widthFix" @load="on_load_img" />
                <view v-for="(item, index) in hot_data" :key="index" class="hot_box" :style="'left: ' + item.drag_start.x * w_scale1 * w_scale2 + 'px;top:' + item.drag_start.y * h_scale1 * h_scale2 + 'px;width: ' + Math.max(item.drag_end.width * w_scale1 * w_scale2, 1) + 'px;height: ' + Math.max(item.drag_end.height * h_scale1 * h_scale2, 1) + 'px;display: flex;'" :data-value="item.link.page" @tap="url_event"> </view>
            </view>
        </view>
    </view>
</template>

<script>
    const app = getApp();
    import { common_styles_computer, common_img_computer } from '@/common/js/common/common.js';
    export default {
        props: {
            propValue: {
                type: Object,
                default: () => ({}),
            },
            propKey: {
                type: [String,Number],
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
                style_container: '',
                style_img_container: '',
                style: '',
                img: '',
                hot_data: [],
                img_width: 1,
                img_height: 1,
                container_ref_h: 0,
                hot_ref_h: 0,
                hot_ref_w: 0,
                w_scale1: 1,
                h_scale1: 1,
                w_scale2: 1,
                h_scale2: 1,
            };
        },
        watch: {
            propKey(val) {
                // 初始化
                this.init();
            },
        },
        created() {
            this.init();
        },
        methods: {
            // 初始化数据
            init() {
                const new_content = this.propValue.content || {};
                const new_style = this.propValue.style || {};
                this.setData({
                    img: new_content.img[0].url,
                    img_width: new_content.hot.img_width || 1,
                    img_height: new_content.hot.img_height || 1,
                    hot_data: new_content.hot.data || [],
                    style_container: common_styles_computer(new_style.common_style),
                    style_img_container: common_img_computer(new_style.common_style, this.propIndex),
                });
            },
            // 图片加载完成 获取宽高
            on_load_img(e) {
                const query = uni.createSelectorQuery();
                // 选择我们想要的元素
                query
                    .in(this)
                    .select('.container')
                    .boundingClientRect((res) => {
                        if ((res || null) != null) {
                            // data包含元素的宽度、高度等信息
                            this.setData({
                                container_ref_h: res.height,
                                w_scale1: res.height / this.img_width,
                                h_scale1: res.height / this.img_height,
                            });
                        }
                    })
                    .exec(); // 执行查询
                query
                    .in(this)
                    .select('.hot')
                    .boundingClientRect((res) => {
                        if ((res || null) != null) {
                            // data包含元素的宽度、高度等信息
                            this.setData({
                                w_scale2: res.width / this.container_ref_h,
                                h_scale2: res.height / this.container_ref_h,
                            });
                        }
                    })
                    .exec(); // 执行查询
            },
            // 跳转链接
            url_event(e) {
                app.globalData.url_event(e);
            },
        },
    };
</script>
<style lang="scss" scoped>
    .hot {
        min-height: 20rpx;
        .hot_box {
            // background: rgba(42, 148, 255, 0.15);
            // border: 2rpx dashed rgba(142, 198, 255, 0.5);
            position: absolute;
            opacity: 0.4;
        }
    }
</style>
