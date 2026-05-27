<template>
    <view v-if="is_show" class="groupbuy-play-flow border-radius-main bg-white padding-main spacing-mb">
        <view class="play-flow-title text-wrapper title-left-border cr-black text-size-md fw-b">拼团玩法</view>
        <view class="groupbuy-play-steps-row flex-row align-stretch">
            <view v-if="play_flow_steps.length > 0" class="play-flow-steps flex-1">
                <block v-for="(item, index) in play_flow_steps" :key="index">
                    <view class="play-flow-step tc" :class="item.step_class">
                        <image v-if="item.has_icon" :src="item.icon" mode="aspectFill" class="play-step-icon radius"></image>
                        <view v-else class="play-step-icon play-step-icon-default bg-grey-f5 radius">
                            <iconfont :name="item.icon_font" size="40rpx" :color="item.icon_color"></iconfont>
                        </view>
                        <view class="margin-top-xs" :class="item.name_class">{{ item.name }}</view>
                    </view>
                    <view v-if="item.show_line" class="play-flow-line flex-row align-c" :class="item.line_class">
                        <view class="play-flow-line-bar"></view>
                        <iconfont name="icon-angle-right" size="28rpx" :color="item.line_icon_color" :propStyle="item.line_icon_style"></iconfont>
                    </view>
                </block>
            </view>
            <view v-if="play_side_nav.length > 0" class="groupbuy-play-side-nav">
                <button
                    v-for="(nav, nav_index) in play_side_nav"
                    :key="nav_index"
                    class="groupbuy-play-side-nav-btn round bg-white br-grey cr-grey text-size-xs"
                    type="default"
                    :data-value="nav.url"
                    @tap="side_nav_event"
                    hover-class="none">{{ nav.name }}</button>
            </view>
        </view>
        <view v-if="content_notice.length > 0" class="groupbuy-play-rules">
            <view class="play-rules-title text-wrapper title-left-border cr-black text-size-sm fw-b">拼团规则</view>
            <view class="play-rules-list">
                <view v-for="(rule, rindex) in content_notice" :key="rindex" v-if="rule" class="play-rules-item cr-grey text-size-xs">{{ rule }}</view>
            </view>
        </view>
    </view>
</template>
<script>
    export default {
        props: {
            propConfig: {
                type: Object,
                default: () => ({}),
            },
            // 大于 0 时启用拼团进度高亮（参团页）
            propPlayCurrentStep: {
                type: Number,
                default: 0,
            },
            propPlaySideNav: {
                type: Array,
                default: () => [],
            },
        },
        computed: {
            play_side_nav() {
                return (this.propPlaySideNav || null) != null && this.propPlaySideNav.length > 0 ? this.propPlaySideNav : [];
            },
            // 玩法步骤列表
            play_list() {
                var config = this.propConfig || {};
                return (config.play_list || null) != null && config.play_list.length > 0 ? config.play_list : [];
            },
            // 拼团规则列表
            content_notice() {
                var config = this.propConfig || {};
                return (config.content_notice || null) != null && config.content_notice.length > 0 ? config.content_notice : [];
            },
            // 是否显示组件
            is_show() {
                return this.play_list.length > 0 || this.content_notice.length > 0;
            },
            // 玩法流程展示数据（含进度高亮）
            play_flow_steps() {
                var list = this.play_list || [];
                var current = parseInt(this.propPlayCurrentStep || 0);
                var progress = current > 0;
                var default_icon_font = ['icon-enable', 'icon-share', 'icon-inventroy-manage'];
                var steps = [];
                for (var i = 0; i < list.length; i++) {
                    var step = i + 1;
                    var step_class = '';
                    var name_class = 'text-size-xs cr-grey step-name';
                    var line_class = '';
                    var line_icon_color = '#ccc';
                    var line_icon_style = '';
                    var icon_active = false;
                    if (progress) {
                        if (step < current) {
                            step_class = 'is-done';
                            name_class = 'text-size-xs step-name cr-main fw-b';
                            line_class = 'is-active';
                            line_icon_color = '#e54d42';
                            line_icon_style = 'font-weight:bold;';
                            icon_active = true;
                        } else if (step == current) {
                            step_class = 'is-current';
                            name_class = 'text-size-xs step-name cr-main fw-b';
                            icon_active = true;
                        }
                    }
                    var icon = (list[i].icon || '').trim();
                    var icon_font = (list[i].icon_font || '').trim();
                    if (!icon_font) {
                        icon_font = default_icon_font[i] || 'icon-enable';
                    }
                    if (icon_font.indexOf('icon-') !== 0) {
                        icon_font = 'icon-' + icon_font;
                    }
                    steps.push({
                        icon: icon,
                        has_icon: icon !== '',
                        icon_font: icon_font,
                        name: list[i].name,
                        step_class: step_class,
                        name_class: name_class,
                        icon_color: icon_active ? '#e54d42' : '#999',
                        line_class: line_class,
                        line_icon_color: line_icon_color,
                        line_icon_style: line_icon_style,
                        show_line: i + 1 < list.length,
                    });
                }
                return steps;
            },
        },
        methods: {
            side_nav_event(e) {
                var url = e.currentTarget.dataset.value || '';
                if (url != '') {
                    getApp().globalData.url_open(url);
                }
            },
        },
    };
</script>
<style scoped>
.groupbuy-play-steps-row {
    gap: 20rpx;
}
.groupbuy-play-side-nav {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 16rpx;
    width: 160rpx;
}
.groupbuy-play-side-nav-btn {
    width: 100%;
    margin: 0;
    padding: 0 8rpx;
    line-height: 56rpx;
    height: 56rpx;
}
.play-flow-title {
    display: inline-block;
    margin-bottom: 16rpx;
}
.play-rules-title {
    display: inline-block;
    margin-bottom: 16rpx;
}
.play-flow-steps {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
    flex-wrap: nowrap;
    margin-bottom: 16rpx;
}
.play-flow-step {
    flex-shrink: 0;
    box-sizing: border-box;
    padding: 0 8rpx;
    max-width: 200rpx;
}
.play-flow-steps .play-flow-line {
    flex: 1;
    min-width: 40rpx;
    max-width: 120rpx;
    align-self: flex-start;
    margin-top: 40rpx;
    padding: 0 4rpx;
    box-sizing: border-box;
}
.play-flow-line-bar {
    flex: 1;
    height: 2rpx;
    background: #ddd;
}
.play-flow-line.is-active .play-flow-line-bar {
    height: 4rpx;
    background: var(--color-main, #e54d42);
    border-radius: 2rpx;
}
.play-step-icon {
    width: 80rpx;
    height: 80rpx;
    margin: 0 auto;
    display: block;
}
.play-step-icon-default {
    display: flex;
    align-items: center;
    justify-content: center;
}
.groupbuy-play-steps-row + .groupbuy-play-rules {
    margin-top: 32rpx;
    padding-top: 24rpx;
    border-top: 1rpx solid #f0f0f0;
}
.play-rules-item {
    line-height: 1.6;
    margin-bottom: 8rpx;
}
.play-rules-item:last-child {
    margin-bottom: 0;
}
</style>
