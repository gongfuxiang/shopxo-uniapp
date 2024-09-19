<template>
    <view class="img-outer re oh" :style="com_style" @tap="url_open(form.text_link)">
        <view :style="text_style" class="break">
            <template v-if="form.is_rich_text == '1'">
                <view class="rich-text-content" :innerHTML="text_title"></view>
            </template>
            <template v-else>
                {{ text_title }}
            </template>
        </view>
    </view>
</template>
<script>
    import { radius_computer, padding_computer, isEmpty } from '@/common/js/common/common.js';
    
    export default {
        props: {
            value: {
                type: Object,
                default: () => {
                    return {};
                },
                required: true,
            },
            sourceList: {
                type: Object,
                default: () => {
                    return {};
                },
            }
        },
        data() {
            return {
                form: {},
                text_title: '',
                text_style: '',
                com_style: '',
            };
        },
        created() {
            this.setData({
                form: this.value,
            });
            this.init();
        },
        methods: {
            init() {
                this.setData({
                    text_title: this.get_text_title(),
                    text_style: this.get_text_style(),
                    com_style: this.get_com_style(),
                });
            },
            get_text_title() {
                let text = '';
                if (!isEmpty(this.form.text_title)) {
                    text = this.form.text_title;
                } else if (!isEmpty(this.sourceList[this.form.data_source_id])) {
                    text = this.sourceList[this.form.data_source_id];
                }
                return text;
            },
            get_text_style() {
                let style = `font-size: ${this.form.text_size * 2}rpx;color: ${this.form.text_color}; text-align: ${this.form.text_location}; transform: rotate(${this.form.text_rotate}deg);text-decoration: ${this.form.text_option};${padding_computer(this.form.text_padding)};box-sizing: border-box;`;
                if (this.form.text_weight == 'italic') {
                    style += `font-style: italic`;
                } else if (this.form.text_weight == '500') {
                    style += `font-weight: 500`;
                }
                return style;
            },
            get_com_style() {
                let style = `background-color: ${this.form.com_bg}; ${radius_computer(this.form.bg_radius)}`;
                if (this.form.border_show == '1') {
                    style += `border: ${this.form.border_size * 2}rpx ${this.form.border_style} ${this.form.border_color};`;
                }
                // 是富文本并且开启了上下滚动的开关
                if (this.form.is_rich_text == '1' && this.form.is_up_down == '1') {
                    style += `overflow-y: auto;`;
                }
                return style;
            },
            url_open(link) {
                this.$emit('url_open', link)
            },
        },
    };  
</script>
<style lang="scss" scoped>
    .break {
        word-wrap: break-word;
        word-break: break-all;
    }
    .rich-text-content {
        white-space: normal;
        word-break: break-all;
        * {
            max-width: 100%;
        }
    }
</style>
