<template>
    <view>
        <view v-if="data_base != null">
            <view class="padding-main">
                <!-- 未申请 -->
                <view v-if="extraction == null">
                    <view v-if="(data_base.self_extraction_apply_desc || null) != null && data_base.self_extraction_apply_desc.length > 0" class="notice-content-blue spacing-mb">
                        <view v-for="(item, index) in data_base.self_extraction_apply_desc" :key="index" class="item">
                            {{item}}
                        </view>
                    </view>
                    <view class="margin-top-xxxl">
                        <navigator url="/pages/plugins/distribution/extraction-apply/extraction-apply" hover-class="none">
                            <button class="bg-main cr-white br-main round wh-auto" type="default" size="mini" hover-class="none">立即申请</button>
                        </navigator>
                    </view>
                </view>

                <!-- 已存在申请信息 -->
                <view v-else class="apply-already">
                    <!-- status 状态（0待审核, 1已通过, 2已拒绝 -->
                    <!-- 审核中 -->
                    <view v-if="extraction.status == 0" class="waiting-audit bg-white">
                        <view class="title-msg tc">申请信息正在审核中...</view>
                        <view class="operation oh tc">
                            <view class="cr-base mini-msg">你可以</view>
                            <view class="to-submit tc">
                                <navigator url="/pages/plugins/distribution/extraction-apply/extraction-apply" hover-class="none">
                                    <button type="primary" size="mini" hover-class="none">编辑信息</button>
                                </navigator>
                            </view>
                        </view>

                    </view>

                    <!-- 审核通过 -->
                    <view v-else-if="extraction.status == 1 || extraction.status == 3" class="valid">
                        <view class="base br-b oh bg-white">
                            <view class="base-title fl">取货点信息</view>
                            <view class="fr edit-submit">
                                <navigator url="/pages/plugins/distribution/extraction-apply/extraction-apply" hover-class="none">编辑信息</navigator>
                            </view>
                        </view>
                        <view class="content bg-white" @tap="address_map_event">
                            <text v-if="(extraction.alias || null) != null" class="alias">{{extraction.alias}}</text>
                            <text class="cr-base">{{extraction.province_name}}{{extraction.city_name}}{{extraction.county_name}}{{extraction.address}}</text>
                        </view>

                        <view v-if="extraction.status == 1">
                            <view class="base br-b oh bg-white spacing-mt">
                                <view class="base-title fl">取货订单统计</view>
                                <view class="fr edit-submit">
                                    <navigator url="/pages/plugins/distribution/extraction-order/extraction-order" hover-class="none">查看取货订单</navigator>
                                </view>
                            </view>
                            <view class="content bg-white statistics oh">
                                <view class="item fl tc" data-value="0" @tap="order_event">
                                    <view class="title cr-base">待处理</view>
                                    <view class="value single-text order-wait-value">{{statistical.order_wait || 0}}</view>
                                </view>
                                <view class="item fl tc br-l" data-value="1" @tap="order_event">
                                    <view class="title cr-base">已处理</view>
                                    <view class="value single-text order-already-value">{{statistical.order_already || 0}}</view>
                                </view>
                            </view>
                        </view>
                        <view v-else class="spacing-mt relieve">
                            <view class="tips">当前状态也解约，可重新编辑数据提交审核。</view>
                        </view>
                        <view v-if="extraction.status == 1 && (data_base || null) != null && (data_base.self_extraction_common_notice || null) != null && data_base.self_extraction_common_notice.length > 0" class="extraction-notice spacing-mt">
                            <view class="tips">
                                <view v-for="(item, index) in data_base.self_extraction_common_notice" :key="index" class="item">
                                    {{item}}
                                </view>
                            </view>
                        </view>
                    </view>

                    <!-- 审核失败 -->
                    <view v-else="extraction.status == 2" class="refuse bg-white">
                        <view class="title-msg tc">申请信息审核失败</view>
                        <view v-if="(extraction.fail_reason || null) != null" class="fail-tips tips">原因：{{extraction.fail_reason}}</view>
                        <view class="operation oh tc">
                            <view class="cr-base mini-msg">你可以重新编辑信息提交</view>
                            <view class="to-submit tc">
                                <navigator url="/pages/plugins/distribution/extraction-apply/extraction-apply" hover-class="none">
                                    <button type="primary" size="mini" hover-class="none">编辑信息</button>
                                </navigator>
                            </view>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 结尾 -->
            <component-bottom-line :prop-status="data_bottom_line_status"></component-bottom-line>
        </view>
        <view v-else>
            <!-- 提示信息 -->
            <component-no-data :prop-status="data_list_loding_status" :prop-msg="data_list_loding_msg"></component-no-data>
        </view>
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
                data_base: null,
                extraction: null,
                statistical: null
            };
        },

        components: {
            componentNoData,
            componentBottomLine
        },
        props: {},

        onLoad(params) {},

        onShow() {
            this.init();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.get_data();
        },

        methods: {
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    // 用户未绑定用户则转到登录页面
                    if (app.globalData.user_is_need_login(user)) {
                        uni.redirectTo({
                            url: "/pages/login/login?event_callback=init"
                        });
                        return false;
                    } else {
                        // 获取数据
                        this.get_data();
                    }
                } else {
                    this.setData({
                        data_list_loding_status: 0,
                        data_bottom_line_status: false
                    });
                }
            },

            // 获取数据
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url("index", "extraction", "distribution"),
                    method: "POST",
                    data: {},
                    dataType: "json",
                    success: res => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
                                data_base: data.base || null,
                                extraction: data.extraction || null,
                                statistical: data.statistical || null,
                                data_list_loding_msg: '',
                                data_list_loding_status: 0,
                                data_bottom_line_status: true
                            });
                        } else {
                            this.setData({
                                data_bottom_line_status: false,
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg
                            });
                            if (app.globalData.is_login_check(res.data, this, 'get_data')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_bottom_line_status: false,
                            data_list_loding_status: 2,
                            data_list_loding_msg: '服务器请求出错'
                        });
                        app.globalData.showToast("服务器请求出错");
                    }
                });
            },

            // 地图查看
            address_map_event(e) {
                if ((this.extraction || null) == null) {
                    return false;
                }
                var data = this.extraction;
                
                // 打开地图
                var name = data.alias || data.name || '';
                var address = (data.province_name || '') + (data.city_name || '') + (data.county_name || '') + (data.address || '');
                app.globalData.open_location(data.lng, data.lat, name, address);
            },

            // 进入取货订单管理
            order_event(e) {
                var value = e.currentTarget.dataset.value || 0;
                uni.navigateTo({
                    url: '/pages/plugins/distribution/extraction-order/extraction-order?status=' + value
                });
            }
        }
    };
</script>
<style>
    @import './extraction.css';
</style>