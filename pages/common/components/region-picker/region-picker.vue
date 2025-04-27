<template>
    <view :class="theme_view">
        <component-popup :propShow="propShow" propPosition="bottom" @onclose="popup_close_event">
            <view class="flex-row jc-sb align-c padding-main">
                <text class="cr-grey" @tap="popup_close_event">{{$t('common.cancel')}}</text>
                <text class="cr-blue" @tap="sub_ragion_event">{{$t('common.confirm')}}</text>
            </view>
            <view class="g-dp-ctt-wrapper">
                <picker-view class="picker-view" :indicator-style="indicatorStyle" :value="columns_index[0]" data-column="0" @change="changeHandler">
                    <picker-view-column>
                        <view class="g-dp-ctt-wp-item" v-for="(item, a) in columns[0]" :key="item.id">{{ item.name }}</view>
                    </picker-view-column>
                </picker-view>

                <picker-view class="picker-view" :indicator-style="indicatorStyle" :value="columns_index[1]" data-column="1" @change="changeHandler">
                    <picker-view-column>
                        <view class="g-dp-ctt-wp-item" v-for="(item, b) in columns[1]" :key="item.id">{{ item.name }}</view>
                    </picker-view-column>
                </picker-view>

                <picker-view class="picker-view" :indicator-style="indicatorStyle" :value="columns_index[2]" data-column="2" @change="changeHandler">
                    <picker-view-column>
                        <view class="g-dp-ctt-wp-item" v-for="(item, c) in columns[2]" :key="item.id">{{ item.name }}</view>
                    </picker-view-column>
                </picker-view>
            </view>
        </component-popup>
    </view>
</template>
<script>
const app = getApp();
import { isEmpty } from '@/common/js/common/common.js';
import componentPopup from "@/components/popup/popup";
export default {
    data() {
        return {
            show: false,
            theme_view: app.globalData.get_theme_value_view(),
            columns: [[0], [0], [0]],
            // 下标
            columns_index: [[0], [0], [0]],
            indicatorStyle: `height: ${uni.upx2px(88)}px;`,
            // 缓存key
            cache_key: app.globalData.data.cache_region_picker_choice_key,
        };
    },
    components: {
        componentPopup,
    },
    props: {
        propShow: {
            type: Boolean,
            default: false,
        },
        propProvinceId: {
            type: [String,Number],
            default: "",
        },
        propCityId: {
            type: [String,Number],
            default: "",
        },
        propCountyId: {
            type: [String,Number],
            default: "",
        },
    },
    watch: {
        propShow(new_val, old_val) {
            if (new_val) {
                this.getProvince();
            }
        },
    },
    methods: {
        // 地区初始化匹配索引
        get_region_value(index, id) {
            var data = this.columns[index];
            var data_id = id;
            // 添加初始值为0,避免没有对比上为空的情况
            var list_index = [0];
            data.forEach((d, i) => {
                if (d.id == data_id) {
                    list_index = [i];
                    return false;
                }
            });
            this.$nextTick(() => {
                this.$set(this.columns_index, index, list_index);
            });
        },
        // picker 滚动change事件
        changeHandler(e) {
            const { dataset, value } = e.target;
            if (dataset.column == 0) {
                if (this.columns[0][value[0]].id) {
                    this.$set(this.columns_index, dataset.column, value);
                    this.$set(this.columns_index, 1, [0]);
                    this.$set(this.columns_index, 2, [0]);
                    this.getCity(this.columns[0][value[0]].id, true);
                }
            } else if (dataset.column == 1) {
                if (this.columns[1][value[0]].id) {
                    this.$set(this.columns_index, dataset.column, value);
                    this.$set(this.columns_index, 2, [0]);
                    this.getArea(this.columns[1][value[0]].id, true);
                }
            } else if (dataset.column == 2) {
                this.$set(this.columns_index, dataset.column, value);
            }
        },

        // 获取省
        getProvince() {
            uni.request({
                url: app.globalData.get_request_url("index", "region"),
                method: "POST",
                data: {},
                dataType: "json",
                success: (res) => {
                    if (res.data.code == 0) {
                        var data = res.data.data;
                        this.$set(this.columns, 0, data);
                        this.getCity(this.propProvinceId ? this.propProvinceId : data[0].id);
                        if (this.propProvinceId) {
                            this.get_region_value(0, this.propProvinceId);
                        }
                    } else {
                        app.globalData.showToast(res.data.msg);
                    }
                },
                fail: () => {
                    app.globalData.showToast(this.$t('extraction-apply.extraction-apply.fo7y6c'));
                },
            });
        },
        // 获取市
        getCity(province_id, init = false) {
            if (province_id) {
                uni.request({
                    url: app.globalData.get_request_url("index", "region"),
                    method: "POST",
                    data: {
                        pid: province_id,
                    },
                    dataType: "json",
                    success: (res) => {
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.$set(this.columns, 1, data);
                            if (init) {
                                this.getArea(data[0].id);
                            } else {
                                this.getArea(this.propCityId ? this.propCityId : data[0].id);
                                if (this.propCityId) {
                                    this.get_region_value(1, this.propCityId);
                                }
                            }
                        } else {
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        app.globalData.showToast(this.$t('extraction-apply.extraction-apply.b6qg7b'));
                    },
                });
            }
        },
        // 获取区
        getArea(city_id, init = false) {
            if (city_id) {
                // 加载loding
                uni.request({
                    url: app.globalData.get_request_url("index", "region"),
                    method: "POST",
                    data: {
                        pid: city_id,
                    },
                    dataType: "json",
                    success: (res) => {
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.$set(this.columns, 2, data);
                            if (!init) {
                                if (this.propCountyId) {
                                    this.get_region_value(2, this.propCountyId);
                                }
                            }
                        } else {
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        app.globalData.showToast(this.$t('extraction-apply.extraction-apply.5s5734'));
                    },
                });
            }
        },
        // 关闭按钮
        popup_close_event(e) {
            this.$emit("onclose", false);
        },
        //提交按钮
        sub_ragion_event() {
            let province = this.columns[0][this.columns_index[0]];
            let city = this.columns[1][this.columns_index[1]];
            let areal = this.columns[2][this.columns_index[2]];
            uni.setStorageSync(this.cache_key, {
                province: province,
                city: city,
                areal: areal
            });
            this.popup_close_event();
            this.$emit("callBackEvent");
        }
    },
};
</script>
<style scoped>
    ::v-deep .popup-bottom {
        border-radius: 0;
    }
    .picker-view {
        width: 32%; height: 480rpx
    }
    .picker-view-column {
        height: 480rpx !important;
    }
    .g-dp-ctt-wrapper {
        height: 480upx;
        width: 100%;
        background-color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .g-dp-ctt-wp-item {
        width: 100%;
        height: 88upx;
        line-height: 88upx;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 30upx;
    }
</style>
