<template>
    <view :style="style_container">
        <view class="pr flex-row" :class="title_center">
            <view class="z-i pr-15" :style="title_style" @click="url_open_event(form.title_link)">{{ form.title || '标题' }}</view>
            <view class="flex-row gap-10 align-c right-0 pa">
                <template v-if="form.keyword_show == '1'">
                    <view v-for="item in keyword_list" :key="item.id" :style="keyword_style" @click="url_open_event(item.link)">
                        {{ item.title }}
                    </view>
                </template>
                <view v-if="form.right_show == '1'" class="nowrap" :style="right_style" @click="url_open_event(form.right_link)">{{ form.right_title }}<iconfont name="icon-arrow-right" :size="right_size" :color="new_style.right_color || '#999'"></iconfont>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
const app = getApp();
import { is_obj_empty } from '../../common/js/common/common';
import { common_styles_computer } from '@/common/js/common/common.js';
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
            style_container: '',
            title_center: '',
            keyword_list: [],
            keyword_style: '',
            right_style: '',
            right_size: ''
        };
    },
    created() {
       this.setData({
           form: this.value.content,
           new_style: this.value.style
       });
       this.init();
    },
    methods: {
        init() {
            // 是否居中
            this.setData({
                title_center: this.form.is_title_center == '1' ? 'jc-c' : ''
            });
            // 关键字
            this.set_keyword_list();
            // 样式设置
            this.set_common_styles();
        },
        set_keyword_list() {
            this.setData({
                keyword_list: this.form.keyword_list.filter(item => item.is_show == '1')
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
                keyword_style: `color:${ keyword_color }; font-size: ${ keyword_size * 2 }rpx;`, // 关键字设置
                right_size: right_size * 2 + 'rpx' ,// 右边按钮设置
                right_style: `color:${ right_color }; font-size: ${ right_size * 2 }rpx;`,
                title_style: `color:${ title_color }; font-size: ${ title_size * 2 }rpx; ${ common_styles }`,
                style_container: common_styles_computer(common_style) // 通用样式区
            })
        },
        url_open_event(link) {
            if (!is_obj_empty(link)) {
                app.globalData.url_open(link.page)
            }
        }
    },
};
</script>

<style scoped lang="scss">
.right-0 {
    top: 50%;
    transform: translateY(-50%);
}
</style>
