<template>
    <!-- 选项卡 -->
    <view class="pr">
        <view v-if="top_up == '1'" class="pf z-i-deep-must left-0 right-0 top-0">
            <view class="seize-seat" :style="'padding-top:' + tabs_top"></view>
            <view :style="style_container">
                <componentDiyModulesTabsView :value="tabs_data" isTabs @tabs-click="tabs_click_event"></componentDiyModulesTabsView>
            </view>
        </view>
        <!-- 占位 -->
        <view class="pr" :class="top_up == '1' ? 'vs-hide' : ''">
            <view :style="style_container">
                <componentDiyModulesTabsView :value="tabs_data" isTabs></componentDiyModulesTabsView>
            </view>
        </view>
    </view>
</template>

<script>
    const app = getApp();
    import { common_styles_computer } from '@/common/js/common/common.js';
    import componentDiyModulesTabsView from '@/components/diy/modules/tabs-view';
    // 状态栏高度
    var bar_height = parseInt(app.globalData.get_system_info('statusBarHeight', 0));
    // #ifdef MP-TOUTIAO
    bar_height = 0;
    // #endif
    export default {
        props: {
            value: {
                type: Object,
                default: () => ({}),
            },
            propId: {
                type: String,
                default: '',
            },
        },
        components: {
            componentDiyModulesTabsView,
        },
        data() {
            return {
                style_container: '',
                content: '',
                tabs_data: {},

                // 是否滑动置顶
                top_up: 0,
                tabs_top: bar_height + 120 + 'rpx',
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                const new_content = this.value.content || {};
                const new_style = this.value.style || {};
                let new_tabs_data = this.value;
                const new_tabs_list = new_content.tabs_list.unshift(new_content.home_data);
                new_tabs_data.tabs_list = new_tabs_list;
                this.setData({
                    tabs_data: new_tabs_data,
                    style_container: common_styles_computer(new_style.common_style),
                    top_up: new_content.tabs_top_up,
                });
            },
            // 回调
            tabs_click_event(index, item) {
                console.log(item);
                // 调接口
                // 回调到上一级
                // 更新上一级的数据，渲染更新页面
                // 请求远程数据
                let new_data = {};
                let params = {
                    id: this.propId,
                };
                if (index == 0) {
                    // 获取缓存数据
                    new_data = uni.getStorageSync('diy-data-' + this.propId) || {};
                } else {
                    if (index !== 0) params.id = item.micro_page_list.id;
                    if (params.id) {
                        new_data = uni.getStorageSync('diy-data-' + item.id) || {};
                    }
                }
                this.$emit('tabs-click', new_data, true);
                if (item.data_type == '0') {
                    if (params.id) {
                        uni.request({
                            url: app.globalData.get_request_url('index', 'diy'),
                            method: 'POST',
                            data: params,
                            dataType: 'json',
                            success: (res) => {
                                // 数据处理
                                const data = res.data.data.data;
                                if (res.data.code == 0) {
                                    uni.setStorageSync('diy-data-' + params.id, data.config.diy_data);
                                    this.$emit('tabs-click', data.config.diy_data, true);
                                } else {
                                    app.globalData.showToast(res.data.msg);
                                }
                            },
                        });
                    }
                } else {
                    if (index !== 0) params.id = item.classify.id;
                    console.log('123123123123123');
                }
            },
        },
    };
</script>

<style lang="scss" scoped>
    .seize-seat {
        z-index: 101;
        position: relative;
    }
    .vs-hide {
        visibility: hidden;
    }
</style>
