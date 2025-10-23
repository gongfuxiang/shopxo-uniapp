<template>
    <view :class="theme_view">
        <block v-if="(propData || null) != null" >
            <component-panel-content :propTitle="$t('common.form_input_data_text')">
                <block v-for="(item, index) in propData" :key="index">
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
                                                                    <image :src="itemsss.url" :data-value="itemsss.url" :data-index="index" :data-indexs="indexs" :data-indexss="indexss" @tap="images_show_event" mode="aspectFit" class="fl margin-right-sm margin-bottom-sm br-f5 radius upload-img"></image>
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
        <block v-else>
            <!-- 提示信息 -->
            <component-no-data></component-no-data>
        </block>
    </view>
</template>
<script>
    const app = getApp();
    import componentNoData from "@/components/no-data/no-data";
    import componentPanelContent from "@/components/panel-content/panel-content";
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
            };
        },
        components: {
            componentNoData,
            componentPanelContent
        },
        props: {
            propData: {
            	type: [String,Object],
            	default: ''
            }
        },
        methods: {
            // 图片预览
            images_show_event(e) {
                var index = e.currentTarget.dataset.index;
                var indexs = e.currentTarget.dataset.indexs;
                var indexss = e.currentTarget.dataset.indexss;
                if(indexs === undefined || indexss === undefined) {
                    var images = this.propData[index]['value'].map(function(v) {
                        return v.url;
                    });
                } else {
                    var images = this.propData[index]['value'][indexs][indexss]['value'].map(function(v) {
                        return v.url;
                    });
                }
                app.globalData.image_show_event(e, images);
            },

            // 文件复制
            file_copy_event(e) {
                app.globalData.text_copy_event(e);
            }
        }
    };
</script>
<style scoped>
    .content .upload-img {
        width: 100rpx;
        height: 100rpx;
    }
</style>