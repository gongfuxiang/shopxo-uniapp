<template>
    <!-- 选项卡 -->
    <view class="pr">
        <view v-if="top_up == '1'" class="pf z-i-deep-must left-0 right-0 top-0">
            <view class="seize-seat" :style="'padding-top:' + tabs_top"></view>
            <view :style="style_container">
                <componentDiyModulesTabsView :value="value" isTabs @tabs-click="tabs_click_event"></componentDiyModulesTabsView>
            </view>
        </view>
        <!-- 占位 -->
        <view class="pr" :class="top_up == '1' ? 'vs-hide' : ''">
            <view :style="style_container">
                <componentDiyModulesTabsView :value="value" isTabs></componentDiyModulesTabsView>
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
                this.setData({
                    style_container: common_styles_computer(new_style.common_style),
                    top_up: new_content.tabs_top_up,
                });
            },
            // 回调
            tabs_click_event(index, item) {
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
                    params.id = item.id;
                    new_data = uni.getStorageSync('diy-data-' + item.id) || {};
                }
                this.$emit('tabs-click', new_data);
                uni.request({
                    url: app.globalData.get_request_url('diy', 'index'),
                    method: 'POST',
                    data: params,
                    dataType: 'json',
                    success: (res) => {
                        // 数据处理
                        var data = res.data.data;
                        if (res.data.code == 0) {
                            uni.setStorageSync('diy-data-' + item.id, data.config.diy_data);
                            this.$emit('tabs-click', data.config.diy_data);
                        } else {
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {},
                });
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
