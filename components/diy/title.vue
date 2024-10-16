<template>
    <view :style="style_container">
        <view :style="style_img_container">
            <view class="flex-col gap-10">
                <view class="pr flex-row" :class="title_center">
                    <view class="z-i flex-row align-c gap-10">
                        <template v-if="!isEmpty(form.img_src) && !isEmpty(form.img_src[0].url)">
                            <view :style="{ 'height': form.img_height * 2 + 'rpx' }">
                                <image :src="form.img_src[0].url" class="title-img" mode="aspectFit"></image>
                            </view>
                        </template>
                        <template v-else-if="!isEmpty(form.icon_class)">
                            <iconfont :name="'icon-' + form.icon_class" :size="new_style.icon_size * 2 + 'rpx'" :color="new_style.icon_color" propContainerDisplay="flex"></iconfont>
                        </template>
                        <view class="pr-15 nowrap" :style="title_style">{{ form.title }}</view>
                    </view>
                    <view class="flex-row gap-10 align-c right-0 pa">
                        <template v-if="form.keyword_show == '1'">
                            <view v-for="item in keyword_list" :key="item.id" :style="keyword_style" :data-value="item.link.page" @tap="url_event">
                                {{ item.title }}
                            </view>
                        </template>
                        <view v-if="form.right_show == '1'" class="nowrap flex-row align-c" :style="right_style" :data-value="form.right_link.page" @tap="url_event"
                            >{{ form.right_title }}
                            <iconfont name="icon-arrow-right" :color="new_style.right_color" :size="new_style.right_size * 2 + 'rpx'" propContainerDisplay="flex"></iconfont>
                        </view>
                    </view>
                </view>
                <view v-if="!isEmpty(form.subtitle)" class="break" :style="subtitle_style">{{ form.subtitle }}</view>
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
            propkey: {
                type: String,
                default: '',
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
                right_style: '',
                right_size: '',
            };
        },
        watch: {
            propkey(val) {
                // 初始化
                this.init();
            },
        },
        created() {
            this.init();
        },
        methods: {
            isEmpty,
            init() {
                this.setData({
                    form: this.propValue.content,
                    new_style: this.propValue.style,
                });
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
                    style_img_container: common_img_computer(common_style),
                });
            },
            get_subtitle_style() {
                let common_styles = '';
                if (this.new_style.subtitle_weight == 'italic') {
                    common_styles += `font-style: italic`;
                } else if (this.new_style.subtitle_weight == '500') {
                    common_styles += `font-weight: 500`;
                }
                return `color:${this.new_style.subtitle_color}; font-size: ${this.new_style.subtitle_size * 2}rpx; ${common_styles}`;
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

    .title-img {
        max-width: 120rpx;
        max-height: 60rpx;
    }
</style>
