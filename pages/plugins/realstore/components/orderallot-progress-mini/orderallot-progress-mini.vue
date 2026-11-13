<template>
    <view v-if="visible" class="orderallot-progress-mini flex-row align-c padding-bottom-sm br-b-dashed">
        <view v-if="steps.length > 0" class="make-progress-steps is-mini flex-1 flex-width">
            <view
                v-for="(step, index) in steps"
                :key="index"
                class="make-progress-step"
                :class="step.step_class"
            >
                <view class="make-progress-node">
                    <view class="make-progress-dot" :class="step.dot_class">
                        <text v-if="step.is_done" class="make-progress-dot-check cr-white">✓</text>
                        <text v-else class="make-progress-dot-num" :class="step.num_class">{{ index + 1 }}</text>
                    </view>
                    <view v-if="index < steps.length - 1" class="make-progress-line" :class="step.line_class"></view>
                </view>
                <text class="make-progress-name" :class="step.name_class">{{ step.name }}</text>
            </view>
        </view>
        <view v-else class="flex-1"></view>
        <view v-if="call_no" class="tv-call-mini flex-col align-c margin-left-sm">
            <text class="fw-b cr-green">{{ call_no }}</text>
            <text class="cr-grey text-size-xss">{{ $t('staff-order.call_no') }}</text>
        </view>
    </view>
</template>
<script>
    import pluginLocale from '../../locale/index.js';
    export default {
        mixins: [pluginLocale],
        props: {
            propProgress: {
                type: Object,
                default: null,
            },
            propCallNo: {
                type: [String, Number],
                default: '',
            },
        },
        computed: {
            call_no() {
                return String(this.propCallNo || '').trim();
            },
            steps() {
                const list = ((this.propProgress || {}).steps) || null;
                if (list == null || list.length <= 0) {
                    return [];
                }
                const cur = Number(((this.propProgress || {}).current) || 0);
                return list.map((step, index) => {
                    const is_done = index < cur;
                    const is_active = index === cur;
                    return Object.assign({}, step, {
                        is_done: is_done,
                        is_active: is_active,
                        step_class: is_done ? 'is-done' : (is_active ? 'is-active' : 'is-wait'),
                        dot_class: (is_done || is_active) ? 'bg-main' : '',
                        num_class: is_active ? 'cr-white' : 'cr-grey',
                        line_class: is_done ? 'bg-main' : '',
                        name_class: is_active ? 'cr-main' : (is_done ? 'cr-base' : 'cr-grey'),
                    });
                });
            },
            visible() {
                return this.steps.length > 0 || this.call_no !== '';
            },
        },
    };
</script>
<style>
.orderallot-progress-mini .make-progress-steps {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
}
.orderallot-progress-mini .make-progress-step {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 0;
}
.orderallot-progress-mini .make-progress-node {
    width: 100%;
    height: 24rpx;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}
.orderallot-progress-mini .make-progress-dot {
    width: 24rpx;
    height: 24rpx;
    border-radius: 50%;
    background: #e8e8e8;
    z-index: 1;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
}
.orderallot-progress-mini .make-progress-dot-num,
.orderallot-progress-mini .make-progress-dot-check {
    font-size: 16rpx;
    line-height: 1;
}
.orderallot-progress-mini .make-progress-line {
    position: absolute;
    left: 50%;
    right: -50%;
    top: 50%;
    height: 3rpx;
    margin-top: -1.5rpx;
    background: #e8e8e8;
    z-index: 0;
}
.orderallot-progress-mini .make-progress-name {
    margin-top: 8rpx;
    font-size: 20rpx;
    text-align: center;
    line-height: 1.2;
}
.orderallot-progress-mini .make-progress-step.is-done .make-progress-name,
.orderallot-progress-mini .make-progress-step.is-active .make-progress-name {
    font-weight: 500;
}
.orderallot-progress-mini .tv-call-mini {
    flex-shrink: 0;
    white-space: nowrap;
    line-height: 1.2;
}
.orderallot-progress-mini .tv-call-mini .fw-b {
    font-size: 28rpx;
}
.orderallot-progress-mini .tv-call-mini .text-size-xss {
    margin-top: 8rpx;
}
</style>
