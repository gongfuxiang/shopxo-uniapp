<template>
    <view>
        <view v-if="(data_base || null) != null">
            <view class="banner tc oh pr wh-auto" :style="'background-image: url(' + default_images_data.default_bg_images + ');'">
                <!-- 标题 -->
                <view v-if="(data_base.banner_top_title || null) != null" class="banner-title single-text text-size-lg margin-top-xxxl">
                    {{data_base.banner_top_title}}
                </view>

                <!-- 购买按钮 -->
                <navigator url="/pages/plugins/membershiplevelvip/buy/buy" hover-class="none" class="dis-inline">
                    <button class="banner-buy text-size fw-b round margin-top-xxxl" type="default" size="mini" hover-class="none">
                        {{data_base.banner_middle_name || '开通会员'}}
                    </button>
                </navigator>

                <!-- 介绍列表 -->
                <view v-if="(introduce_data || null) != null && introduce_data.length > 0" class="data-list oh margin-top-xxxl">
                    <block v-for="(item, index) in introduce_data" :key="index" class="item fl">
                        <view class="item fl tc padding-main border-radius-main bg-white">
                            <view class="single-text cr-base text-size fw-b">{{item.name}}</view>
                            <view class="multi-text cr-grey margin-top-sm">{{item.desc}}</view>
                            <image class="dis-block auto margin-top-sm" :src="item.images_url" mode="scaleToFill"></image>
                        </view>
                    </block>
                </view>
            </view>

            <!-- 富文本 -->
            <view v-if="(data_base.banner_bottom_content || null) != null" class="padding-main spacing-mt">
                <view class="border-radius-main bg-white oh">
                    <mp-html :content="data_base.banner_bottom_content" />
                </view>
            </view>
        </view>
        <view v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </view>

        <!-- 结尾 -->
        <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
    </view>
</template>
<script>
    const app = getApp();
    import componentNoData from "../../../../components/no-data/no-data";
    import componentBottomLine from "../../../../components/bottom-line/bottom-line";

    export default {
        data() {
            return {
                data_bottom_line_status: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                introduce_data: [],
                data_base: null,
                default_images_data: null,
                // 自定义分享信息
                share_info: {}
            };
        },

        components: {
            componentNoData,
            componentBottomLine
        },
        props: {},

        onLoad(params) {
            this.init();
        },

        onShow() {},

        // 下拉刷新
        onPullDownRefresh() {
            this.get_data_list();
        },

        methods: {
            init() {
                // 获取数据
                this.get_data_list();
            },

            // 获取数据
            get_data_list() {
                uni.showLoading({
                    title: '加载中...'
                });
                if (this.introduce_data.length <= 0) {
                    this.setData({
                        data_list_loding_status: 1
                    });
                }
                uni.request({
                    url: app.globalData.get_request_url("index", "index", "membershiplevelvip"),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: res => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
                                data_base: data.base || null,
                                default_images_data: data.default_images_data || null,
                                introduce_data: data.introduce_data || [],
                                data_list_loding_msg: '',
                                data_list_loding_status: 0,
                                data_bottom_line_status: true
                            });

                            if ((this.data_base || null) != null) {
                                // 基础自定义分享
                                this.setData({
                                    share_info: {
                                        title: this.data_base.seo_title || this.data_base.application_name,
                                        desc: this.data_base.seo_desc,
                                        path: '/pages/plugins/membershiplevelvip/index/index',
                                        img: this.default_images_data.default_bg_images || this.default_images_data.default_logo || ''
                                    }
                                });

                                // 导航名称
                                if((this.data_base.application_name || null) != null) {
                                    uni.setNavigationBarTitle({
                                        title: this.data_base.application_name
                                    });
                                }
                            }
                        } else {
                            this.setData({
                                data_bottom_line_status: false,
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg
                            });
                            if (app.globalData.is_login_check(res.data, this, 'get_data_list')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                        
                        // 分享菜单处理
                        app.globalData.page_share_handle(this.share_info);
                    },
                    fail: () => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_bottom_line_status: false,
                            data_list_loding_status: 2,
                            data_list_loding_msg: '服务器请求出错'
                        });
                        app.globalData.showToast('服务器请求出错');
                    }
                });
            }
        }
    };
</script>
<style>
    @import './index.css';
</style>