<template>
    <view :class="theme_view">
        <!-- 简洁的数据，一般列表展示使用 -->
        <view v-if="propIsTerse" class="content margin-top cp">
            <block v-if="propData != null && propDataField.length > 0">
                <view v-for="(item, index) in propDataField" :key="index">
                    <view class="single-text margin-top-xs">
                        <text class="cr-grey margin-right-xl">{{ item.name }}</text>
                        <text class="cr-base">{{ propData[item.field] }}</text>
                        <view v-if="(item.is_copy || 0) == 1" class="dis-inline-block margin-left" data-event="copy" :data-value="propData[item.field]" @tap.stop="text_event_handle">
                            <iconfont name="icon-copy" size="28rpx" class="cr-grey"></iconfont>
                        </view>
                    </view>
                </view>
            </block>
            <slot></slot>
        </view>
        <!-- 详情面板数据 -->
        <view v-else class="padding-horizontal-main padding-top-main">
            <view class="panel-item padding-main border-radius-main bg-white spacing-mb">
                <view v-if="(propTitle || null) != null" class="br-b padding-bottom-main fw-b text-size">{{propTitle}}</view>
                <view class="panel-content oh">
                    <block v-if="propData != null && propDataField.length > 0">
                        <view v-for="(item, index) in propDataField" :key="index" class="item br-b-dashed oh padding-vertical-main">
                            <view class="title fl padding-right-main cr-grey">{{ item.name }}</view>
                            <view class="content fl br-l padding-left-main">
                                <text>{{ propData[item.field] }}</text>
                                <view v-if="(item.is_copy || 0) == 1" class="dis-inline-block margin-left" data-event="copy" :data-value="propData[item.field]" @tap.stop="text_event_handle">
                                    <iconfont name="icon-copy" size="28rpx" class="cr-grey lh-il"></iconfont>
                                </view>
                            </view>
                        </view>
                    </block>
                    <slot></slot>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import componentNoData from "@/components/no-data/no-data";
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
            };
        },
        components: {
            componentNoData
        },
        props: {
            // 标题
            propTitle: {
                type: String,
                default: '',
            },
            // 数据
            propData: {
                type: [Object, String],
                default: '',
            },
            // 数据字段
            propDataField: {
                type: Array,
                default: [],
            },
            // 无数据提示状态
            propNoDataStatus: {
                type: [Number, String],
                default: 3,
            },
            // 无数据提示内容
            propNoDataMsg: {
                type: [String],
                default: '',
            },
            // 是否简洁的模式展示
            propIsTerse: {
                type: Boolean,
                default: false,
            }
        },
        methods: {
            // 文本事件
            text_event_handle(e) {
                app.globalData.text_event_handle(e);
            }
        }
    };
</script>
<style></style>
