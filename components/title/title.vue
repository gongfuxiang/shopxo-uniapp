<template>
    <view :class="theme_view">
        <view class="spacing-nav-title flex-row align-c jc-sb text-size-xs">
            <view class="title-left">
                <text class="text-wrapper" :class="propTitleLeftBorder ? 'title-left-border' : ''" :style="'color:' + propTitleColor + ';'">{{propTitle}}</text>
                <text class="vice-name margin-left-sm" :style="'color:' + propViceTitleColor + ';'">{{propViceTitle}}</text>
            </view>
            <text :data-value="propMoreUrl" @tap="url_event" class="arrow-right padding-right cr-grey cp">{{propMore || this.$t('common.more')}}</text>
        </view>
    </view>
</template>

<script>
    const app = getApp();
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
            };
        },
        props: {
            propTitle: {
                type: String,
                default: ''
            },
            propTitleColor: {
                type: String,
                default: '#333'
            },
            propViceTitle: {
                type: String,
                default: ''
            },
            propViceTitleColor: {
                type: String,
                default: '#999'
            },
            propMore: {
                type: String,
                default: '',
            },
            propMoreUrl: {
                type: String,
                default: ''
            },
            propTitleLeftBorder: {
                type: Boolean,
                default: true
            },
        },
        methods: {
            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            }
        }
    }
</script>

<style>

</style>