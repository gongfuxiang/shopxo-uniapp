<template>
    <view :class="theme_view">
        <view class="bg-white flex-row tc text-size-sm br-b-f5">
            <view class="flex-1 padding-vertical-main" :class="list_type == 'follow' ? 'cr-main fw-b' : ''" data-type="follow" @tap="type_event">{{$t('home.follow')}}</view>
            <view class="flex-1 padding-vertical-main" :class="list_type == 'fans' ? 'cr-main fw-b' : ''" data-type="fans" @tap="type_event">{{$t('home.fans')}}</view>
        </view>
        <view v-if="data_list.length > 0" class="padding-main">
            <view v-for="(item, index) in data_list" :key="index" class="bg-white border-radius-main padding-main spacing-mb flex-row align-c">
                <view class="flex-row align-c flex-1 flex-width cp" :data-value="item.user_home_url" @tap="url_event">
                    <image class="avatar circle" :src="item.avatar" mode="aspectFill"></image>
                    <text class="margin-left-main">{{ item.user_name_view }}</text>
                </view>
            </view>
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
        </view>
        <component-no-data v-else :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    import pluginLocale from '../locale/index.js';
    export default {
        mixins: [pluginLocale],
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                params: {},
                list_type: 'follow',
                data_list: [],
                data_page: 1,
                data_bottom_line_status: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_is_loading: 0,
            };
        },
        components: { componentCommon, componentNoData, componentBottomLine },
        onLoad(params) {
            params = app.globalData.launch_params_handle(params);
            this.setData({
                params: params || {},
                list_type: params.type == 'fans' ? 'fans' : 'follow',
            });
            app.globalData.page_event_onload_handle(params);
        },
        onShow() {
            app.globalData.page_event_onshow_handle();
            this.reload();
            app.globalData.page_common_on_show(this);
        },
        onReachBottom() {
            this.get_list();
        },
        methods: {
            reload() {
                this.setData({ data_page: 1, data_list: [], data_bottom_line_status: false });
                this.get_list(1);
            },
            type_event(e) {
                var type = e.currentTarget.dataset.type || 'follow';
                if (type == this.list_type) {
                    return;
                }
                this.setData({ list_type: type });
                this.reload();
            },
            get_list(is_mandatory) {
                if ((is_mandatory || 0) == 0 && this.data_bottom_line_status) {
                    return;
                }
                if (this.data_is_loading == 1) {
                    return;
                }
                this.setData({ data_is_loading: 1, data_list_loding_status: 1 });
                var action = this.list_type == 'fans' ? 'fanslist' : 'followlist';
                uni.request({
                    url: app.globalData.get_request_url(action, 'index', 'userhome'),
                    method: 'POST',
                    data: { uid: this.params.uid || 0, page: this.data_page },
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code == 0) {
                            var data = res.data.data || {};
                            var list = data.data || [];
                            var temp = this.data_page <= 1 ? list : (this.data_list || []).concat(list);
                            this.setData({
                                data_list: temp,
                                data_page: this.data_page + 1,
                                data_list_loding_status: temp.length > 0 ? 3 : 0,
                                data_bottom_line_status: this.data_page > (data.page_total || 0),
                                data_is_loading: 0,
                            });
                        } else {
                            this.setData({ data_is_loading: 0, data_list_loding_status: 0, data_list_loding_msg: res.data.msg });
                        }
                    },
                    fail: () => {
                        this.setData({ data_is_loading: 0, data_list_loding_status: 2 });
                    },
                });
            },
            url_event(e) {
                app.globalData.url_event(e);
            },
        },
    };
</script>
<style>
    .avatar {
        width: 80rpx;
        height: 80rpx;
    }
</style>
