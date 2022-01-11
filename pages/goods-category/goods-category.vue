<template>
    <view>
        <view :class="(is_single_page == 1 ? 'margin-top-xxxl single-page-top' : '')">
            <!-- 搜索框 -->
            <block v-if="is_single_page == 0">
                <view class="nav-search padding-horizontal-main bg-white" :style="'padding-top:'+(status_bar_height+8)+'px;'">
                    <component-search propPlaceholder="输入商品名称搜索"></component-search>
                </view>
            </block>
        
            <!-- 分类内容 -->
            <view v-if="data_list.length > 0" class="category-content pr" :style="'height:calc(100vh - '+(status_bar_height+48)+'px);'">
                <block v-if="category_show_level == 1">
                    <!-- 一级模式 -->
                    <view class="model-one padding-sm oh">
                        <block v-for="(v, index) in data_list" :key="index">
                            <view class="content-item padding-sm tc cp" :data-value="v.id" @tap="category_event">
                                <view class="content auto bg-white wh-auto border-radius-main">
                                    <image v-if="(v.icon || null) != null" :src="v.icon" mode="aspectFit" class="icon radius"></image>
                                    <view class="text single-text">{{v.name}}</view>
                                </view>
                            </view>
                        </block>
                    </view>
                </block>
                <block v-else>
                    <!-- 一级内导航 -->
                    <view class="left-nav bg-white">
                        <block v-for="(item, index) in data_list" :key="index">
                            <view :class="'item tc cr-base cp ' + (item.active || '')" :data-index="index" @tap="nav_event">
                                <text>{{item.name}}</text>
                            </view>
                        </block>
                    </view>
                    <view class="right-container pa">
                        <!-- 一级内基础容 -->
                        <view v-if="(data_content || null) != null" class="right-content padding-top-main padding-left-main padding-right-main">
                            <!-- 一级基础信息 --> 
                            <view v-if="(data_content.vice_name || null) != null || (data_content.describe || null) != null" class="one-content bg-white padding-main border-radius-main cp spacing-mb" :data-value="data_content.id" @tap="category_event">
                                <view v-if="(data_content.vice_name || null) != null" class="text-size fw-b" :style="'color:' + data_content.bg_color + ';'">{{data_content.vice_name}}</view>
                                <view v-if="(data_content.describe || null) != null" class="cr-grey margin-top-sm">{{data_content.describe}}</view>
                            </view>
                            <!-- 一二级数据渲染 -->
                            <block v-if="(data_content.items || null) != null && data_content.items.length > 0">
                                <!-- 二级模式 -->
                                <block v-if="category_show_level == 2">
                                    <view class="two-content bg-white oh padding-main border-radius-main spacing-mb">
                                        <block v-for="(v, index) in data_content.items" :key="index">
                                            <view class="content-item padding-sm tc cp" :data-value="v.id" @tap="category_event">
                                                <view class="content wh-auto">
                                                    <image v-if="(v.icon || null) != null" :src="v.icon" mode="aspectFit" class="icon radius"></image>
                                                    <view class="text single-text">{{v.name}}</view>
                                                </view>
                                            </view>
                                        </block>
                                    </view>
                                </block>
                                <!-- 三级模式 -->
                                <block v-if="category_show_level == 3">
                                    <block v-for="(v, index) in data_content.items" :key="index">
                                        <view class="spacing-nav-title">
                                            <text class="text-wrapper">{{v.name}}</text>
                                            <text v-if="(v.describe || null) != null" class="vice-name margin-left-lg cr-gray">{{v.describe}}</text>
                                            <view :data-value="v.id" @tap="category_event" class="arrow-right padding-right-xxxl cr-gray fr cp">更多</view>
                                        </view>
                                        <view v-if="(v.items || null) != null && v.items.length > 0" class="bg-white oh padding-main border-radius-main spacing-mb">
                                            <block v-for="(vs, index2) in v.items" :key="index2">
                                                <view class="content-item padding-sm tc cp" :data-value="vs.id" @tap="category_event">
                                                    <view class="content wh-auto">
                                                        <image v-if="(vs.icon || null) != null" :src="vs.icon" mode="aspectFit" class="icon radius"></image>
                                                        <view class="text single-text">{{vs.name}}</view>
                                                    </view>
                                                </view>
                                            </block>
                                        </view>
                                    </block>
                                </block>
                            </block>
                            <block v-else>
                                <!-- 提示信息 -->
                                <component-no-data propStatus="0" propMsg="没有子分类数据"></component-no-data>
                            </block>
                        </view>
                        <view v-else>
                            <!-- 提示信息 -->
                            <component-no-data propStatus="0" propMsg="没有子分类数据"></component-no-data>
                        </view>
                    </view>
                </block>
            </view>

            <view v-if="data_list.length == 0 && data_list_loding_status != 0">
                <!-- 提示信息 -->
                <component-no-data :propStatus="data_list_loding_status"></component-no-data>
            </view>

            <!-- 快捷导航 -->
            <component-quick-nav :propIsNav="true" :propIsBar="true"></component-quick-nav>
        </view>
    </view>
</template>

<script>
    const app = getApp();
    import componentSearch from "../../components/search/search";
    import componentQuickNav from "../../components/quick-nav/quick-nav";
    import componentNoData from "../../components/no-data/no-data";

    export default {
        data() {
            return {
                status_bar_height: parseInt(app.globalData.get_system_info('statusBarHeight', 0)),
                data_list_loding_status: 1,
                nav_active_index: 0,
                data_list: [],
                data_content: null,
                // 基础配置
                category_show_level: 3,
                data_bottom_line_status: false,
                // 自定义分享信息
                share_info: {},
                // 是否单页预览
                is_single_page: app.globalData.is_current_single_page() || 0
            };
        },

        components: {
            componentSearch,
            componentQuickNav,
            componentNoData
        },
        props: {},

        onShow() {
            // 数据加载
            this.init();

            // 初始化配置
            this.init_config();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.init();
        },

        methods: {
            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {
                    this.setData({
                        category_show_level: app.globalData.get_config('config.category_show_level')
                    });
                } else {
                    app.globalData.is_config(this, 'init_config');
                }
            },

            // 获取数据
            init() {
                this.setData({
                    data_list_loding_status: 1
                });
                uni.request({
                    url: app.globalData.get_request_url("category", "goods"),
                    method: "POST",
                    data: {},
                    dataType: "json",
                    success: res => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var category = res.data.data.category || [];
                            var data_content = null;
                            var index = this.nav_active_index || 0;
                            if (category.length > 0) {
                                category[index]['active'] = 'nav-active cr-main border-color-main';
                                data_content = category[index] || null;
                            }
                            this.setData({
                                data_list: category,
                                data_content: data_content,
                                data_list_loding_status: category.length == 0 ? 0 : 3,
                                data_bottom_line_status: true
                            });
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                                data_bottom_line_status: true
                            });
                            app.globalData.showToast(res.data.msg);
                        }

                        // 基础自定义分享
                        this.setData({
                            share_info: {
                                path: '/pages/goods-category/goods-category'
                            }
                        });

                        // 显示分享菜单、延时执行，确保基础数据已加载完成
                        setTimeout(function() {
                            app.globalData.show_share_menu();
                        }, 1000);
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_bottom_line_status: true
                        });
                        app.globalData.showToast("服务器请求出错");
                    }
                });
            },

            // 导航事件
            nav_event(e) {
                var index = e.currentTarget.dataset.index;
                var temp_data = this.data_list;
                for (var i in temp_data) {
                    temp_data[i]['active'] = index == i ? 'nav-active cr-main border-color-main' : '';
                }
                this.setData({
                    data_list: temp_data,
                    data_content: temp_data[index],
                    nav_active_index: index
                });
            },

            // 事件
            category_event(e) {
                uni.navigateTo({
                    url: '/pages/goods-search/goods-search?category_id=' + e.currentTarget.dataset.value
                });
            }
        }
    };
</script>
<style>
    @import './goods-category.css';
</style>