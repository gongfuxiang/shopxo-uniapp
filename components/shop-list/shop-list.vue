<template>
    <view>
        <view v-if="(data_list || null) != null && data_list.length > 0" class="plugins-shop-data-list oh">
            <block v-for="(item, index) in data_list" :key="index">
                <view class="item oh border-radius-main padding-main bg-white arrow-right spacing-mb">
                    <view :data-value="item.url" @tap="url_event">
                        <image :src="item.logo" mode="aspectFit" class="logo circle fl br"></image>
                        <view class="right-content fr">
                            <view class="title fw-b text-size single-text">
                                <text v-if="(propConfig.is_enable_auth || 0) == 1 && item.auth_type == 1 && (item.auth_type_name || null) != null" class="auth-icon round margin-right-xs fw-b text-size-xs tc">{{item.auth_type_name}}</text>
                                <text>{{item.name}}</text>
                            </view>
                            <view class="desc multi-text cr-gray margin-top-sm">{{item.describe}}</view>
                        </view>
                    </view>
                </view>
            </block>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    export default {
        data() {
            return {
                data_list: []
            };
        },
        components: {},
        props: {
            propConfig: {
            	type: [String,Object],
            	default: null
            },
            propDataList: {
            	type: Array,
            	default: () => []
            }
        },
        // 属性值改变监听
        watch: {
            
        },
        // 页面被展示
        created: function(e) {        
            this.setData({
                data_list: this.propDataList
            });
        },
        methods: {
            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            }
        }
    };
</script>
<style>
</style>