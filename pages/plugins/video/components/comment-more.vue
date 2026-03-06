<template>
    <view class="more-title flex-row align-c" @tap="comment_more_event">
        <text>{{ propText || expand_html }}</text>
        <view class="ml-5">
            <iconfont :name="propIconName" color="#999" size="20rpx" />
        </view>
    </view>
</template>

<script> 
//#ifdef APP-NVUE
    import { initVueI18n } from '@dcloudio/uni-i18n'
    import i18nMessages from '@/locale/index-nvue.js'
    const { t } = initVueI18n(i18nMessages)
    const $t = t;
//#endif
export default {
    props: {
        propId: {
            type: [String, Number],
            default: '',
        },
        propText: {
            type: String,
            default: ''
        },
        propIsLevel: {
            type: Number,
            default: 1
        },
        propIconName: {
            type: String,
            default: 'icon-arrow-down'
        },
    },
    data() {
        return {
            expand_html: $t('common.expand'),
        };
    },
    methods: {
        comment_more_event() {
            this.$emit('comment_more_event', this.propId, this.propIsLevel);
        }
    }
}   
</script>

<style lang="scss" scoped>
.more-title {
    font-size: 24rpx;
    color: #999999;
    line-height: 34rpx;
    white-space: nowrap;
}
</style>