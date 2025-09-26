<template>
    <view :class="theme_view">
        <block v-if="detail != null">
            <!-- 基础信息 -->
            <component-panel-content :propData="detail" :propDataField="field_list" propExcludeField="express_name,express_number" :propTitle="$t('common.base_info_text')"></component-panel-content>

            <!-- 表单数据 -->
            <block v-if="(detail.form_data || null) != null" class="panel-item padding-main border-radius-main bg-white spacing-mb">
                <component-panel-content :propTitle="$t('common.form_input_data_text')">
                    <block v-for="(item, index) in detail.form_data" :key="index">
                        <view class="item br-b-f5 oh padding-vertical-main">
                            <view class="title fl padding-right-main cr-grey">{{ item.name }}</view>
                            <view class="content fl br-l padding-left-main">
                                <block v-if="item.key == 'upload-img'">
                                    <block v-if="item.value.length > 0">
                                        <block v-for="(items, indexs) in item.value" :key="indexs">
                                            <image :src="items.url" :data-value="items.url" :data-index="index" @tap="images_show_event" mode="aspectFit" class="fl margin-right-sm margin-bottom-sm br-f5 radius upload-img"></image>
                                        </block>
                                    </block>
                                </block>
                                <block v-else-if="item.key == 'upload-video'">
                                    <block v-if="item.value.length > 0">
                                        <block v-for="(items, indexs) in item.value" :key="indexs">
                                            <video :src="items.url" :controls="true" :show-play-btn="true" :show-center-play-btn="true" class="fl margin-right-sm margin-bottom-sm br-f5 radius wh-auto upload-video"></video>
                                        </block>
                                    </block>
                                </block>
                                <block v-else-if="item.key == 'upload-attachments'">
                                    <block v-if="item.value.length > 0">
                                        <block v-for="(items, indexs) in item.value" :key="indexs">
                                            <view :src="items.url" :data-value="items.url" @tap="file_copy_event" class="fl margin-right-sm margin-bottom-sm br-dashed-grey radius padding-sm upload-file">{{items.name || items.url}}</view>
                                        </block>
                                    </block>
                                </block>
                                <block v-else-if="item.key == 'rich-text'">
                                    <mp-html :content="item.value" />
                                </block>
                                <block v-else-if="item.key == 'subform'">
                                    <block v-if="(item.value || null) != null">
                                        <uni-table border stripe :emptyText="$t('no_data')" >
                                            <uni-tr>
                                                <block v-for="(items, indexs) in item.value[0]" :key="indexs">
                                                    <uni-th align="left">{{items.name}}</uni-th>
                                                </block>
                                            </uni-tr>
                                            <block v-for="(items, indexs) in item.value" :key="indexs">
                                                <uni-tr v-if="(items || null) != null">
                                                    <block v-for="(itemss, indexss) in items" :key="indexss">
                                                        <uni-th align="left">
                                                            <block v-if="itemss.key == 'upload-img'">
                                                                <block v-if="itemss.value.length > 0">
                                                                    <block v-for="(itemsss, indexsss) in itemss.value" :key="indexsss">
                                                                        <image :src="itemsss.url" :data-value="itemsss.url" :data-index="indexsss" @tap="images_show_event" mode="aspectFit" class="fl margin-right-sm margin-bottom-sm br-f5 radius upload-img"></image>
                                                                    </block>
                                                                </block>
                                                            </block>
                                                            <block v-else-if="itemss.key == 'upload-video'">
                                                                <block v-if="itemss.value.length > 0">
                                                                    <block v-for="(itemsss, indexsss) in itemss.value" :key="indexsss">
                                                                        <video :src="itemsss.url" :controls="true" :show-play-btn="true" :show-center-play-btn="true" class="fl margin-right-sm margin-bottom-sm br-f5 radius wh-auto upload-video"></video>
                                                                    </block>
                                                                </block>
                                                            </block>
                                                            <block v-else-if="itemss.key == 'upload-attachments'">
                                                                <block v-if="itemss.value.length > 0">
                                                                    <block v-for="(itemsss, indexsss) in itemss.value" :key="indexsss">
                                                                        <view :src="itemsss.url" :data-value="itemsss.url" @tap="file_copy_event" class="fl margin-right-sm margin-bottom-sm br-dashed-grey radius padding-sm upload-file">{{itemsss.name || itemsss.url}}</view>
                                                                    </block>
                                                                </block>
                                                            </block>
                                                            <block v-else-if="itemss.key == 'rich-text'">
                                                                <mp-html :content="itemss.value" />
                                                            </block>
                                                            <text v-else>{{ itemss.value_text || itemss.value }}</text>
                                                        </uni-th>
                                                    </block>
                                                </uni-tr>
                                            </block>
                                        </uni-table>
                                    </block>
                                </block>
                                <text v-else>{{ item.value_text || item.value }}</text>
                            </view>
                        </view>
                    </block>
                </component-panel-content>
            </block>

            <!-- 结尾 -->
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
        </block>
        <block v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </block>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from "@/components/no-data/no-data";
    import componentBottomLine from "@/components/bottom-line/bottom-line";
    import componentPanelContent from "@/components/panel-content/panel-content";
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                params: null,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_bottom_line_status: false,
                field_list: [],
                detail: null
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
            componentPanelContent
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            this.setData({
                params: params,
            });
            this.init();
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }

            // 分享菜单处理
            app.globalData.page_share_handle();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.init();
        },

        methods: {
            init() {
                this.setData({
                    data_list_loding_status: 1,
                });
                uni.request({
                    url: app.globalData.get_request_url("detail", "forminputdata"),
                    method: "POST",
                    data: this.params,
                    dataType: "json",
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
                                detail: data.data,
                                field_list: data.field_list || [],
                                data_list_loding_status: 3,
                                data_bottom_line_status: true,
                                data_list_loding_msg: "",
                            });
                        } else {
                            this.setData({
                                data_list_loding_status: 2,
                                data_bottom_line_status: false,
                                data_list_loding_msg: res.data.msg,
                            });
                            if (app.globalData.is_login_check(res.data, this, "init")) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_bottom_line_status: false,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 图片预览
            images_show_event(e) {
                var images = this.detail.form_data[e.currentTarget.dataset.index]['value'].map(function(v) {
                    return v.url;
                });
                app.globalData.image_show_event(e, images);
            },

            // 文件复制
            file_copy_event(e) {
                app.globalData.text_copy_event(e);
            }
        },
    };
</script>
<style scoped>
    @import './form-input-data-detail.css';
</style>