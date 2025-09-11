<template>
    <view :class="theme_view">
        <view v-if="(propData || null) != null" class="panel-item padding-main border-radius-main bg-white spacing-mb">
            <view class="br-b padding-bottom-main fw-b text-size">{{propData.title}}</view>
            <view class="panel-content oh">
                <view v-for="(item, index) in propData.data" :key="index" class="item br-b-dashed oh padding-vertical-main">
                    <view class="title fl padding-right-main cr-grey">{{ item.name }}</view>
                    <view class="content fl br-l padding-left-main">
                        <block v-if="(item.type || '') == 'images'">
                            <image :src="item.value" mode="scaleToFill" class="images" :data-value="item.value" @tap="images_event"></image>
                        </block>
                        <block v-else-if="(item.is_copy || 0) == 1">
                            <text :data-value="item.value" @tap="text_copy_event">
                                <text>{{ item.value }}</text>
                                <text class="bg-white br-green cr-green round padding-horizontal-sm text-size-xs margin-left-sm">{{$t('common.copy')}}</text>
                            </text>
                        </block>
                        <block v-else>{{ item.value }}</block>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
const app = getApp();
export default {
    data() {
        return {
            theme_view: app.globalData.get_theme_value_view()
        };
    },
    props: {
        propData: {
            type: [Object,String,Array],
            default: '',
        }
    },
    methods: {
        // 图片预览
        images_event(e) {
            app.globalData.image_show_event(e);
        },

        // 文本复制
        text_copy_event(e) {
            app.globalData.text_copy_event(e);
        }
    }
};
</script>
<style scoped>
    .panel-item .images {
        width: 200rpx;
        height: 200rpx;
    }
</style>