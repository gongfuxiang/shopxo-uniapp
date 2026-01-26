<template>
    <view :class="theme_view">
        <view v-if="(propData || null) != null" class="panel-item padding-main border-radius-main bg-white spacing-mb">
            <view class="br-b padding-bottom-main">
                <text class="fw-b text-size">{{propData.title}}</text>
                <view v-if="(propData.chat || null) != null && ((propData.chat.url || null) != null) && ((propData.chat.name || null) != null)" class="fr" @tap="webview_url_event">
                    <view class="dis-inline-block va-m">
                        <iconfont name="icon-doctor" size="28rpx" propClass="cr-blue"></iconfont>
                    </view>
                    <text class="va-m margin-left-xs cr-blue">{{propData.chat.name}}</text>
                </view>
            </view>
            <view class="panel-content oh">
                <uni-table :emptyText="$t('common.no_data')">
                    <block v-for="(item, index) in propData.data" :key="index">
                        <uni-tr>
                            <uni-th width="90">{{item.name}}</uni-th>
                            <uni-td>
                                <block v-if="(item.type || '') == 'images'">
                                    <image :src="item.value" mode="scaleToFill" class="images" :data-value="item.value" @tap="images_event"></image>
                                </block>
                                <block v-else-if="(item.is_copy || 0) == 1">
                                    <view :data-value="item.value" @tap="text_copy_event">
                                        <text>{{ item.value }}</text>
                                        <text class="bg-white br-green cr-green round padding-horizontal-sm text-size-xs margin-left-sm">{{$t('common.copy')}}</text>
                                    </view>
                                </block>
                                <block v-else>{{ item.value }}</block>
                            </uni-td>
                        </uni-tr>
                    </block>
                </uni-table>
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
        },

        // webviwe打开链接
        webview_url_event() {
            app.globalData.open_web_view(this.propData.chat.url);
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