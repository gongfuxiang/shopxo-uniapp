<template>
    <view :class="theme_view">
        <!-- 简洁的数据，一般列表展示使用 -->
        <view v-if="propIsTerse" class="content margin-top cp">
            <block v-if="data != null && data_field.length > 0">
                <block v-for="(item, index) in data_field" :key="index">
                    <view v-if="(item.is_hide || 0) == 0" class="single-text margin-top-xs">
                        <text class="cr-grey margin-right-xl">{{ item.name }}</text>
                        <block v-if="item.type == 'images'">
                            <image v-if="(data[item.field] || null) != null" :src="data[item.field]" :data-value="data[item.field]" @tap.stop="images_show_event" mode="aspectFit" class="radius panel-item-images"></image>
                        </block>
                        <text v-else class="cr-base">{{ data[item.field] }}</text>
                        <view v-if="(item.is_copy || 0) == 1" class="dis-inline-block margin-left" data-event="copy" :data-value="data[item.field]" @tap.stop="text_event_handle">
                            <iconfont name="icon-copy" size="28rpx" class="cr-grey"></iconfont>
                        </view>
                    </view>
                </block>
                <view v-if="propIsItemShowMax > 0 && propIsItemShowMax < data_field.length" @tap.stop="item_more_event" class="margin-top-sm tc">
                    <text class="cr-grey-c margin-right-sm">{{ $t('common.view_more') }}</text>
                    <iconfont :name="'icon-arrow-' + (more_status ? 'top' : 'bottom')" size="28rpx" color="#ccc"></iconfont>
                </view>
            </block>
            <slot></slot>
        </view>
        <!-- 详情面板数据 -->
        <view v-else class="padding-horizontal-main padding-top-main">
            <view class="panel-item padding-main border-radius-main bg-white spacing-mb">
                <view v-if="(propTitle || null) != null" class="br-b padding-bottom-main fw-b text-size">{{ propTitle }}</view>
                <view class="panel-content oh">
                    <block v-if="data != null && data_field.length > 0">
                        <block v-for="(item, index) in data_field" :key="index">
                            <view v-if="(item.is_hide || 0) == 0" class="item br-b-f5 oh padding-vertical-main">
                                <view class="title fl padding-right-main cr-grey">{{ item.name }}</view>
                                <view class="content fl br-l padding-left-main">
                                    <block v-if="item.type == 'images'">
                                        <image v-if="(data[item.field] || null) != null" :src="data[item.field]" :data-value="data[item.field]" @tap.stop="images_show_event" mode="aspectFit" class="panel-item-images"></image>
                                    </block>
                                    <text v-else>{{ data[item.field] }}</text>
                                    <view v-if="(item.is_copy || 0) == 1" class="dis-inline-block margin-left" data-event="copy" :data-value="data[item.field]" @tap.stop="text_event_handle">
                                        <iconfont name="icon-copy" size="28rpx" class="cr-grey lh-il"></iconfont>
                                    </view>
                                </view>
                            </view>
                        </block>
                        <view v-if="propIsItemShowMax > 0 && propIsItemShowMax < data_field.length" @tap.stop="item_more_event" class="margin-top-sm tc">
                            <text class="cr-grey-c margin-right-sm">{{ $t('common.view_more') }}</text>
                            <iconfont :name="'icon-arrow-' + (more_status ? 'top' : 'bottom')" size="28rpx" color="#ccc"></iconfont>
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
    import componentNoData from '@/components/no-data/no-data';
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                data: null,
                data_field: [],
                more_status: false,
            };
        },
        components: {
            componentNoData,
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
            // 数据项最大展示数量（0则显示全部）
            propIsItemShowMax: {
                type: [Number,String],
                default: 0,
            },
            // 指定字段
            propAppointField: {
                type: String,
                default: '',
            },
            // 排除字段
            propExcludeField: {
                type: String,
                default: '',
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
            },
        },
        // 属性值改变监听
        watch: {
            // 数据改变
            propData(value, old_value) {
                this.data = value;
            },
        },
        // 页面被展示
        created: function (e) {
            this.setData({
                data: this.propData,
            });
            this.data_field_handle(this.propDataField);
        },
        methods: {
            // 数据字段处理
            data_field_handle(data) {
                var appoint = (this.propAppointField || null) == null ? [] : this.propAppointField.split(',');
                var exclude = (this.propExcludeField || null) == null ? [] : this.propExcludeField.split(',');
                var temp_data = [];
                var index = 0;
                for (var i in data) {
                    if ((exclude.length == 0 && appoint.length > 0 && appoint.indexOf(data[i]['field']) != -1) || (appoint.length == 0 && (exclude.length == 0 || exclude.indexOf(data[i]['field']) == -1))) {
                        data[i]['is_hide'] = (data[i]['is_hide'] || 0) == 0 ? (index >= this.propIsItemShowMax && this.propIsItemShowMax > 0 ? 1 : 0) : 0;
                        temp_data.push(data[i]);
                        index++;
                    }
                }
                this.setData({
                    data_field: temp_data,
                });
            },

            // 文本事件
            text_event_handle(e) {
                app.globalData.text_event_handle(e);
            },

            // 图片预览
            images_show_event(e) {
                app.globalData.image_show_event(e);
            },

            // 数据项更多事件
            item_more_event(e) {
                this.data_field_handle(this.data_field);
                this.setData({
                    more_status: !this.more_status,
                });
            }
        }
    };
</script>
<style scoped>
    .panel-item-images {
        width: 40rpx;
        height: 40rpx;
    }
</style>
