<template>
    <view class="pr" :style="style_container">
        <swiper circular="true" :autoplay="form.is_roll == '1'" :interval="form.interval_time * 1000" :duration="500" :style="{ height: new_style.height * 2 + 'rpx' }" :previous-margin="previousMargin" :next-margin="nextMargin" @change="slideChange">
            <block v-if="form.carousel_type == 'card'">
                <swiper-item v-for="(item, index) in new_list" :key="index" class="flex-row align-c">
                    <view class="swiper-item" :style="img_style" :class="['scale-defalt', { 'scale-1': animationData === index }]">
                        <image :src="item.carousel_img[0].url" class="img ht-auto" :style="img_style" :mode="img_fit"></image>
                    </view>
                </swiper-item>
            </block>
            <block v-else>
                <swiper-item v-for="(item, index) in new_list" :key="index">
                    <view class="item-image flex-row jc-c align-c w h" :style="img_style">
                        <image :src="item.carousel_img[0].url" class="img" :style="img_style" :mode="img_fit"></image>
                    </view>
                </swiper-item>
            </block>
        </swiper>
        <view v-if="new_style.is_show == '1'" :class="{'dot-center': new_style.indicator_location == 'center', 'dot-right': new_style.indicator_location == 'flex-end' }" class="dot flex-row pa" :style="dot_style">
            <template v-if="new_style.indicator_style == 'num'">
                <view :style="indicator_style" class="dot-item">
                    <span :style="{ color: new_style.actived_color }" >{{ actived_index + 1 }}</span><span>/{{ form.carousel_list.length }}</span>
                </view>
            </template>
            <template v-else>
                <view v-for="(item, index2) in form.carousel_list" :key="index2" :style="indicator_style + (actived_index == index2 ? 'background:' + new_style.actived_color : '')" class="dot-item" />
            </template>
        </view>
    </view>
</template>

<script>
    const app = getApp();
    import { common_styles_computer, radius_computer, is_obj_empty } from '@/common/js/common/common.js';
    export default {
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
                // 通用样式显示
                style_container: '',
                // 图片的设置
                img_style: '',
                // 指示器的样式
                indicator_style: '',
                seat_list: [],
                new_list: [],
                // 指示器选中的位置
                actived_index: 0,
                interval_types: '',
                img_fit: '',
                dot_style: '',
                // 样式二的处理
                animation: '',
                animationData: 0,
                previousMargin: '0rpx',
                nextMargin: '0rpx',
            };
        },
        created() {
            this.form = this.value.content;
            this.new_style = this.value.style;
            // 数组合并
            this.seat_list = this.get_seat_list();
            this.new_list = this.seat_list.concat(this.form.carousel_list);
            
            this.init();
            if (this.form.carousel_type == 'card') {
                this.$nextTick(() => {
                    this.previousMargin = '82rpx';
                    this.nextMargin = '82rpx';
                    
                    this.animationData = 0;
                })
            }
        },
        methods: {
            init() {
                const { common_style, actived_color } = this.new_style;
                // 用于样式显示
                this.style_container = common_styles_computer(common_style);
                // 图片的设置
                this.img_style = radius_computer(this.new_style);
                // 指示器的样式
                this.indicator_style = this.get_indicator_style();
                // 指示器位置
                this.dot_style = `bottom: ${ common_style.padding_bottom * 2 + 12 }rpx;`;
                // aspectFill 对应 cover aspectFit 对应 contain  scaleToFill 对应 none
                const { img_fit } = this.form;
                let fit = 'scaleToFill'
                if (img_fit == 'cover') {
                    fit = 'aspectFill';
                } else if (img_fit == 'contain') {
                    fit = 'aspectFit';
                }
                this.img_fit = fit;
            },
            get_indicator_style() {
                const { indicator_radius, indicator_style, indicator_size, color } = this.new_style;
                let styles = '';
                if (!is_obj_empty(indicator_radius)) {
                    styles += radius_computer(indicator_radius)
                }
                if (indicator_style == 'num') {
                    styles += `color: ${color || '#DDDDDD'};`;
                    styles += `font-size: ${ indicator_size * 2 }rpx;`;
                } else if (indicator_style == 'elliptic') {
                    styles += `background: ${color || '#DDDDDD'};`;
                    styles += `width: ${ indicator_size * 6 }rpx; height: ${ indicator_size * 2 }rpx;`;
                } else {
                    styles += `background: ${color || '#DDDDDD'};`;
                    styles += `width: ${ indicator_size * 2 }rpx; height: ${ indicator_size * 2 }rpx;`;
                }
                return styles;
            },
            get_seat_list() {
                if (this.form.carousel_list.length > 3) {
                    return [];
                } else {
                    let seat_list = [];
                    const list = JSON.parse(JSON.stringify(this.form.carousel_list));
                    switch (list.length) {
                        case 1:
                            seat_list = [ ...list, ...list, ...list];
                            break;
                        case 2:
                            seat_list.push(...list)
                            break;
                        case 3:
                            seat_list.push(...list.slice(0, 1))
                            break;
                        default:
                            break;
                    }
                    return seat_list;
                }
            },
            slideChange(e) {
                this.animationData = e.target.current;
                if (e.target.current > this.form.carousel_list.length - 1) {
                    const seat_length = this.seat_list.length;
                    if (seat_length == 2 && e.target.current == 3) {
                        this.actived_index = 1;
                    } else if (seat_length == 3) {
                        this.actived_index = 0;
                    } else {
                        this.actived_index = e.target.current - this.seat_list.length;
                    }
                } else {
                    this.actived_index = e.target.current;
                }
            }
        },
    };
</script>

<style scoped lang="scss">
    .dot-center {
        left: 50%;
        transform: translateX(-50%);
    }
    .dot-right {
        right: 0;
    }
    .dot {
        z-index: 1;
        .dot-item {
            margin: 0 6rpx;
        }
    }
    .swiper-container {
    	display: flex;
    	align-items: center;
    }
    
    .swiper-item {
    	display: flex;
    	flex-wrap: wrap;
    	justify-content: center;
    	margin-left: auto;
    	margin-right: auto;
    	height: 90%;
    	width: 90%;
    	text-align: center;
    }
    
    .scale-defalt {
        position: relative;
        border-radius: 10px;
        transform: scale(1);
        transition: -webkit-transform 400ms linear, transform 400ms linear;
        transform-origin: 50% 50% 0px;
        &.scale-1 {
            transform: scale(1.1);
        }
    }
    
    .img {
        width: 100%;
    }
</style>