<template>
    <view :style="style_container">
        <view class="flex-col gap-10">
            <view class="pr flex-row" :class="title_center">
                <view class="z-i flex-row align-c gap-10 title-img">
                    <template v-if="!isEmpty(form.img_src)">
                        <imageEmpty v-model="form.img_src[0]"></imageEmpty>
                    </template>
                    <template v-else-if="!isEmpty(form.icon_class)">
                        <iconfont :name="'icon-' + form.icon_class" :size="new_style.icon_size * 2 + 'rpx'" :color="new_style.icon_color"></iconfont>
                    </template>
                    <view class="pr-15 nowrap" :style="title_style">{{ form.title || '标题' }}</view>
                </view>
                <view class="flex-row gap-10 align-c right-0 pa">
                    <template v-if="form.keyword_show == '1'">
                        <view v-for="item in keyword_list" :key="item.id" :style="keyword_style">
                            {{ item.title }}
                        </view>
                    </template>
                    <view v-if="form.right_show == '1'" class="nowrap" :style="right_style">{{ form.right_title }}<iconfont name="icon-arrow-right" :color="new_style.right_color || '#999'"></iconfont></view>
                </view>
            </view>
            <view v-if="!isEmpty(form.subtitle)" class="break" :style="subtitle_style">{{ form.subtitle }}</view>
        </view>
    </view>
</template>

<script>
    const app = getApp();
    import { common_styles_computer, is_obj_empty } from '@/common/js/common/common.js';
    export default {
        props: {
            propValue: {
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
                style_container: '',
                title_center: '',
                subtitle_style: '',
                keyword_list: [],
                keyword_style: '',
                right_style: '',
                right_size: '',
            };
        },
        created() {
            this.setData({
                form: this.propValue.content,
                new_style: this.propValue.style,
            });
            this.init();
        },
        methods: {
            init() {
                // 是否居中
                this.setData({
                    title_center: this.form.is_title_center == '1' ? 'jc-c' : '',
                });
                // 关键字
                this.set_keyword_list();
                // 样式设置
                this.set_common_styles();
            },
            set_keyword_list() {
                this.setData({
                    keyword_list: this.form.keyword_list.filter((item) => item.is_show == '1'),
                });
            },
            set_common_styles() {
                const { keyword_color, keyword_size, right_color, right_size, common_style, title_weight, title_color, title_size } = this.new_style;
                // 标题样式设置
                let common_styles = '';
                if (title_weight == 'italic') {
                    common_styles += `font-style: italic`;
                } else if (title_weight == '500') {
                    common_styles += `font-weight: 500`;
                }
                
                this.setData({
                    keyword_style: `color:${keyword_color}; font-size: ${keyword_size * 2}rpx;`, // 关键字设置
                    right_size: right_size * 2 + 'rpx', // 右边按钮设置
                    right_style: `color:${right_color}; font-size: ${right_size * 2}rpx;`,
                    title_style: `color:${title_color}; font-size: ${title_size * 2}rpx; ${common_styles}`,
                    subtitle_style: this.get_subtitle_style(), // 副标题样式设置
                    style_container: common_styles_computer(common_style), // 通用样式区
                });
            },
            get_subtitle_style() {
                let common_styles = '';
                if (new_style.value.subtitle_weight == 'italic') {
                    common_styles += `font-style: italic`;
                } else if (new_style.value.subtitle_weight == '500') {
                    common_styles += `font-weight: 500`;
                }
                return `color:${new_style.value.subtitle_color}; font-size: ${new_style.value.subtitle_size * 2}rpx; ${common_styles}`;
            },
            url_open_event(link) {
                if (!is_obj_empty(link)) {
                    app.globalData.url_open(link.page);
                }
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
    .title-img {
        max-width: 6rem;
        max-height: 3rem;
    }
</style>
