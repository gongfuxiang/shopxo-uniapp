<template>
    <!-- 文章列表 -->
    <view class="tabs flex-row oh" :style="'column-gap: ' + tabs_spacing + 'px;'">
        <view v-for="(item, index) in tabs_list" :key="index" class="item nowrap flex-col jc-c gap-4" :class="tabs_theme + (index == active_index ? ' active' : '')" :data-index="index" @click="handle_event">
            <image v-if="item.img" :src="item.img[0].url" class="img" mode="scaleToFill" />
            <view class="title" :style="title_style(index)">{{ item.title }}</view>
            <view class="desc" :style="tabs_theme_index == '1' && index == active_index ? tabs_check : ''">{{ item.desc }}</view>
            <iconfont name="icon-checked-1" class="icon" :style="tabs_theme_index == '3' ? icon_tabs_check : ''"></iconfont>
            <view class="bottom_line" :style="tabs_check"></view>
        </view>
    </view>
</template>

<script>
    import { gradient_computer } from '@/common/js/common/common.js';
    export default {
        props: {
            value: {
                type: Object,
                default: () => {},
            },
        },
        data() {
            return {
                tabs_theme_index: '',
                tabs_theme: '',
                tabs_check: '',
                // title_style: '',
                icon_tabs_check: '',
                tabs_spacing: '',
                tabs_list: [],
                active_index: 0,
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                const new_content = this.value.content || {};
                const new_style = this.value.style || {};
                this.tabs_spacing = new_style.tabs_spacing;
                this.tabs_list = new_content.tabs_list;
                // 选项卡主题
                this.tabs_theme = this.get_tabs_theme(new_content);
                this.tabs_theme_index = new_content.tabs_theme;
                // 选项卡样式
                this.tabs_check = this.tabs_check_computer(new_style);
                this.icon_tabs_check = `${this.tabs_check};line-height: 1;background-clip: text;-webkit-background-clip: text;-webkit-text-fill-color: transparent;`;
            },
            get_tabs_theme(data) {
                switch (data.tabs_theme) {
                    case '1':
                        return 'tabs-style-2';
                    case '2':
                        return 'tabs-style-3';
                    case '3':
                        return 'tabs-style-4';
                    case '4':
                        return 'tabs-style-5';
                    default:
                        return 'tabs-style-1';
                }
            },
            // 选中的背景渐变色样式
            tabs_check_computer(data) {
                const new_gradient_params = {
                    color_list: data.tabs_checked,
                    direction: data.tabs_direction,
                };
                return gradient_computer(new_gradient_params);
            },
            // 标题样式
            title_style(index) {
                const new_style = this.value.style || {};
                const tabs_theme_style = {
                    tabs_title_checked: `font-weight: ${new_style.tabs_weight_checked};font-size: ${new_style.tabs_size_checked}px;color:${new_style.tabs_color_checked};`,
                    tabs_title: `font-weight: ${new_style.tabs_weight};font-size: ${new_style.tabs_size}px;color:${new_style.tabs_color};`,
                };
                // 默认是未选中的状态
                let style = `${tabs_theme_style.tabs_title}`;
                if (index == this.active_index) {
                    let checked_style = tabs_theme_style.tabs_title_checked;
                    if (['2', '4'].includes(this.tabs_theme_index)) {
                        checked_style += this.tabs_check;
                    }
                    style = checked_style;
                }
                return style;
            },

            // 事件
            // tabs切换事件
            handle_event(e) {
                const index = e.currentTarget.dataset.index;
                this.active_index = index;
                this.$emit('tabs-click', index);
            },
        },
    };
</script>
<style lang="scss" scoped>
    .tabs {
        max-width: 780rpx;
        overflow: auto;
        .item {
            padding: 0 0 10rpx 0;
            position: relative;
            &:first-of-type {
                margin-left: 0;
            }
            &:last-of-type {
                margin-right: 0;
            }
            .title {
                font-size: 28rpx;
                text-align: center;
            }
            .desc {
                font-size: 22rpx;
                color: #999;
                text-align: center;
                display: none;
            }
            .bottom_line {
                width: 100%;
                height: 6rpx;
                border-radius: 20rpx;
                background-color: red;
                position: absolute;
                left: 0;
                right: 0;
                bottom: 0;
                display: none;
            }
            .icon {
                position: absolute;
                left: 0;
                right: 0;
                bottom: 0;
                text-align: center;
                font-size: 40rpx;
                display: none;
            }
            .img {
                width: 78rpx;
                height: 78rpx;
                border-radius: 100%;
                border: 2rpx solid transparent;
                display: none;
            }
            &.tabs-style-1 {
                &.active {
                    .bottom_line {
                        display: block;
                    }
                }
            }
            &.tabs-style-2 {
                &.active {
                    .desc {
                        background: #ff5e5e;
                        color: #fff;
                    }
                }
                .desc {
                    border-radius: 40rpx;
                    padding: 4rpx 12rpx;
                    display: inline-block;
                }
            }
            &.tabs-style-3 {
                &.active {
                    .title {
                        background: #ff2222;
                        border-radius: 40rpx;
                        padding: 4rpx 24rpx;
                        color: #fff;
                    }
                }
            }
            &.tabs-style-4 {
                padding-bottom: 36rpx;
                &.active {
                    .title {
                        color: #ff2222;
                    }
                    .icon {
                        color: #ff2222;
                        display: block;
                    }
                }
            }
            &.tabs-style-5 {
                align-items: center;
                &.active {
                    .title {
                        font-size: 22rpx;
                        background: #ff5e5e;
                        border-radius: 40rpx;
                        padding: 4rpx 14rpx;
                        color: #fff;
                    }
                    .img {
                        border-color: #ff5e5e;
                    }
                }
                .img {
                    display: block;
                }
            }
        }
    }
</style>
