<template>
    <view :style="style_container">
        <view :style="style_img_container">
            <view class="flex-col gap-10">
                <view class="pr flex-row" :class="title_center">
                    <view class="z-i flex-row align-c gap-10">
                        <template v-if="!isEmpty(form.img_src) && !isEmpty(form.img_src[0].url)">
                            <view class="wh-auto" :style="{'height': new_style.img_height * 2 + 'rpx' }">
                                <image :src="form.img_src[0].url" class="ht-auto" mode="heightFix"></image>
                            </view>
                        </template>
                        <template v-else-if="!isEmpty(form.icon_class)">
                            <iconfont :name="'icon-' + form.icon_class" :size="new_style.icon_size * 2 + 'rpx'" :color="new_style.icon_color" propContainerDisplay="flex"></iconfont>
                        </template>
                        <view v-if="!isEmpty(form.title)" class="nowrap" :style="title_style" :data-value="!isEmpty(form.title_link) ? form.title_link.page : ''" @tap="url_event">{{ form.title }}</view>
                        <view v-if="!isEmpty(form.subtitle) && form.title_line == '1'" class="text-word-break nowrap" :style="subtitle_style">{{ form.subtitle }}</view>
                    </view>
                    <view class="flex-row gap-10 align-c right-0 pa">
                        <template v-if="form.keyword_show == '1'">
                            <view class="flex-row align-c" :style="keyword_gap">
                                <view v-for="item in keyword_list" :key="item.id" :style="keyword_style" :data-value="!isEmpty(item.link) ? item.link.page : ''" @tap="url_event">
                                    {{ item.title }}
                                </view>
                            </view>
                        </template>
                        <view v-if="form.right_show == '1'" class="nowrap flex-row align-c" :style="right_style" :data-value="!isEmpty(form.right_link) ? form.right_link.page : ''" @tap="url_event"
                            >{{ form.right_title }}
                            <iconfont name="icon-arrow-right" :color="new_style.right_color" :size="new_style.right_size * 2 + 'rpx'" propContainerDisplay="flex"></iconfont>
                        </view>
                    </view>
                </view>
                <view v-if="!isEmpty(form.subtitle) && form.title_line != '1'" class="text-word-break" :style="subtitle_style">{{ form.subtitle }}</view>
            </view>
        </view>
    </view>
</template>

<script>
    const app = getApp();
    import { common_styles_computer, common_img_computer, isEmpty } from '@/common/js/common/common.js';
    export default {
        props: {
            propValue: {
                type: Object,
                default: () => {
                    return {};
                },
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
                form: {},
                new_style: {},
                style_container: '',
                style_img_container: '',
                title_center: '',
                subtitle_style: '',
                keyword_list: [],
                keyword_style: '',
                keyword_gap: '',
                right_style: '',
                right_size: '',
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
            // 判断是否为空
            isEmpty,
            // 初始化数据
            init() {
                const new_form = this.propValue.content;
                const new_style = this.propValue.style;
                
                const { keyword_color, keyword_size, right_color, right_size, common_style, title_weight, title_color, title_size, keyword_spacing = 10 } = new_style;
                // 标题样式设置
                let common_styles = '';
                if (title_weight == 'italic') {
                    common_styles += `font-style: italic`;
                } else if (['bold', '500'].includes(title_weight)) {
                    common_styles += `font-weight: bold`;
                }
                // 是否居中
                this.setData({
                    form: new_form,
                    new_style: new_style,
                    title_center: new_form.is_title_center == '1' ? 'jc-c' : '',
                    keyword_list: new_form.keyword_list.filter((item) => item.is_show == '1'), // 关键字
                    keyword_style: `color:${keyword_color}; font-size: ${keyword_size * 2}rpx;`, // 关键字设置
                    keyword_gap: !isEmpty(keyword_spacing) ? `gap: ${ keyword_spacing * 2}rpx` : 'gap: 20rpx;', // 关键字间距设置
                    right_size: right_size * 2 + 'rpx', // 右边按钮设置
                    right_style: `color:${right_color}; font-size: ${right_size * 2}rpx;`, //右侧按钮样式
                    title_style: `color:${title_color}; font-size: ${title_size * 2}rpx; ${common_styles}`, // 标题样式设置
                    subtitle_style: this.get_subtitle_style(new_form, new_style), // 副标题样式设置
                    style_container: common_styles_computer(common_style), // 通用样式区
                    style_img_container: common_img_computer(common_style, this.propIndex), // 通用图片样式区
                });
            },
            // 副标题样式设置
            get_subtitle_style(new_form, new_style) {
                let common_styles = '';
                if (new_style.subtitle_weight == 'italic') {
                    common_styles += `font-style: italic`;
                } else if (['bold', '500'].includes(new_style.subtitle_weight)) {
                    common_styles += `font-weight: bold;`;
                }
                let flex = '';
                if (new_form.is_subtitle_center == '1') {
                    flex = 'display: flex; justify-content: center;';
                }
                return `color:${new_style.subtitle_color}; font-size: ${new_style.subtitle_size * 2}rpx; ${common_styles} ${ flex }`;
            },
            url_event(e) {
                app.globalData.url_event(e);
            },
        },
    };
</script>

<style scoped lang="scss">
    .right-0 {
        top: 50%;
        transform: translateY(-50%);
    }

    .break {
        word-break: break-word;
        overflow-wrap: break-word;
        word-wrap: break-word;
    }
</style>
