<template>
    <!-- 根节点直接承担 fold 布局类，避免再包一层导致小程序横滑失效 -->
    <view :class="root_class">
        <block v-if="(propDataList || null) != null && propDataList.length > 0">
            <view
                v-for="(item, index) in propDataList"
                :id="'staff-item-' + index"
                :key="index"
                class="staff-scroll-target"
                :class="[propIsFold ? 'is-fold' : 'is-col', propIsMap ? 'is-map' : '']"
            >
                <view class="staff-item padding-main border-radius-main bg-white spacing-mb cp" :class="item.active || ''" :data-value="'/pages/plugins/realstore/staff-detail/staff-detail?id=' + item.id" @tap="url_event">
                    <view class="flex-row">
                        <image v-if="(item.avatar || null) != null && item.avatar != ''" class="staff-avatar-large circle br margin-right-main" :src="item.avatar" mode="aspectFill"></image>
                        <view v-else class="staff-avatar-large staff-avatar-placeholder circle br margin-right-main">
                            <iconfont name="icon-user" size="48rpx" color="#ccc"></iconfont>
                        </view>
                        <view class="flex-1 flex-width staff-item-content">
                            <view class="staff-title-row flex-row align-c flex-wrap">
                                <view class="fw-b text-size staff-info-name flex-shrink-0">{{ item.alias }}</view>
                                <view v-if="(item.position_name || null) != null && item.position_name != ''" class="staff-position-tag round bg-white br-grey cr-grey text-size-xs flex-shrink-0">{{ item.position_name }}</view>
                                <view class="flex-1 flex-width"></view>
                                <text v-if="(item.distance || '') != ''" class="staff-distance cr-grey text-size-xs flex-shrink-0">{{ item.distance }}</text>
                            </view>
                            <view v-if="staff_earliest_show(item) != '' || (item.rating || 0) > 0 || (item.service_count || item.booking_count || 0) > 0" class="staff-stat-row margin-top-xs flex-row align-c flex-wrap">
                                <view v-if="staff_earliest_show(item) != ''" class="staff-specialty-tag round text-size-xss cr-main bg-main-light flex-shrink-0 margin-right-sm">{{ $t('realstore-staff.earliest') }}{{ staff_earliest_show(item) }}</view>
                                <view v-if="(item.rating || 0) > 0 || (item.service_count || item.booking_count || 0) > 0" class="staff-rating-tag round text-size-xss margin-right-sm flex-shrink-0">{{ $t('realstore-staff.rating') }} {{ (item.rating || 0) > 0 ? item.rating : '5.0' }}</view>
                                <text v-if="(item.service_count || item.booking_count || 0) > 0" class="cr-grey text-size-xs flex-shrink-0">{{ $t('realstore-staff.served') }}{{ item.service_count || item.booking_count }}{{ $t('realstore-staff.served_unit') }}</text>
                            </view>
                            <view class="staff-store-row margin-top-xs flex-row align-c">
                                <text v-if="(item.realstore || null) != null && (item.realstore.name || '') != ''" class="single-text flex-1 flex-width cr-grey text-size-xs">{{ item.realstore.name }}</text>
                                <view v-else class="flex-1 flex-width"></view>
                                <view class="staff-store-meta flex-row align-c flex-shrink-0">
                                    <view class="staff-meta-icon flex-row align-c">
                                        <iconfont name="icon-message-o" size="24rpx" color="#ccc"></iconfont>
                                        <text class="cr-grey text-size-xs margin-left-xs">{{ item.comments_count || 0 }}</text>
                                    </view>
                                    <view class="staff-meta-icon flex-row align-c">
                                        <iconfont name="icon-heart-o" size="24rpx" color="#ccc"></iconfont>
                                        <text class="cr-grey text-size-xs margin-left-xs">{{ item.favor_count || 0 }}</text>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                    <view class="staff-bottom-row margin-top-sm flex-row align-c">
                        <view class="staff-meta flex-1 flex-width flex-row align-c flex-wrap">
                            <view v-if="(item.work_years || 0) > 0" class="text-size-xs cr-base margin-right">{{ $t('realstore-staff.work_years_prefix') }}{{ item.work_years }}{{ $t('realstore-staff.work_years_unit') }}</view>
                            <block v-if="(item.specialty_list || null) != null && item.specialty_list.length > 0">
                                <text class="text-size-xs cr-grey margin-right-xs">{{ $t('realstore-staff.specialty') }}</text>
                                <view v-for="(tag, tindex) in item.specialty_list.slice(0, 3)" :key="tindex" class="staff-specialty-tag round text-size-xss cr-grey bg-grey-f5 margin-right-xs">{{ tag }}</view>
                            </block>
                        </view>
                        <button class="staff-book-btn round text-size-xs bg-main cr-white br-main flex-shrink-0" type="default" size="mini" hover-class="none" :data-value="'/pages/plugins/realstore/staff-detail/staff-detail?id=' + item.id" @tap.stop="url_event">{{ $t('realstore-staff.book') }}</button>
                    </view>
                </view>
            </view>
            <view v-if="propIsFold" class="list-fold-tail"></view>
        </block>
        <component-no-data v-else :propStatus="propLodingStatus" :propMsg="propLodingMsg" :propLoadingLogoTop="propIsMap ? '20%' : ''"></component-no-data>
    </view>
</template>
<script>
    const app = getApp();
    import componentNoData from "@/components/no-data/no-data";
    import pluginLocale from '../locale/index.js';
    export default {
        mixins: [pluginLocale],
        options: {
            // 让 staff-item-* 可被外层 scroll-into-view 找到（小程序）
            virtualHost: true,
            styleIsolation: 'shared',
        },
        components: {
            componentNoData
        },
        props: {
            propDataList: {
                type: Array,
                default: () => [],
            },
            propIsFold: {
                type: Boolean,
                default: false,
            },
            propIsMap: {
                type: Boolean,
                default: false,
            },
            propLodingStatus: {
                type: [Number, String],
                default: 0,
            },
            propLodingMsg: {
                type: String,
                default: '',
            },
        },
        computed: {
            root_class() {
                if (this.propIsFold) {
                    return 'list-fold-row';
                }
                if (this.propIsMap) {
                    return 'list-map-col';
                }
                return 'padding-top-main padding-horizontal-main';
            },
        },
        methods: {
            staff_earliest_show(item) {
                var booking = (item || {}).earliest_booking || null;
                if (booking == null) {
                    return '';
                }
                var time = booking.start_time || '';
                if (time == '' && (booking.time_text || '') != '') {
                    time = String(booking.time_text).split(/[\s\-–—]/)[0] || '';
                }
                if (time == '') {
                    return booking.text || item.earliest_booking_text || '';
                }
                if (parseInt(booking.is_today || 0) == 1 || (booking.day_label || '') == '') {
                    return time;
                }
                return booking.day_label + time;
            },
            url_event(e) {
                app.globalData.url_event(e);
            },
        }
    };
</script>
<style>
/* 列表样式写在组件内，避免小程序样式隔离导致 H5 正常、小程序错乱 */
.list-map-col {
    padding-left: 24rpx;
    padding-right: 24rpx;
    box-sizing: border-box;
}
/* 小程序横滑用 nowrap + inline-block，比 enable-flex 更稳 */
.list-fold-row {
    display: block;
    white-space: nowrap;
    padding-top: 16rpx;
    padding-bottom: 16rpx;
    box-sizing: border-box;
    font-size: 0;
}
.staff-scroll-target.is-map.is-col {
    padding-top: 24rpx;
    box-sizing: border-box;
}
.staff-scroll-target.is-map.is-col .staff-item {
    margin-bottom: 0;
}
.staff-scroll-target.is-map.is-col:last-child .staff-item {
    margin-bottom: 24rpx;
}
.staff-scroll-target.is-fold {
    display: inline-block;
    padding-left: 24rpx;
    padding-top: 0;
    box-sizing: border-box;
    vertical-align: top;
    font-size: 28rpx;
}
.staff-scroll-target.is-fold .staff-item {
    width: 620rpx;
    margin-bottom: 0;
    box-sizing: border-box;
    white-space: normal;
}
.list-fold-tail {
    display: inline-block;
    width: 24rpx;
    height: 1rpx;
    vertical-align: top;
}
.staff-avatar-large {
    width: 120rpx;
    height: 120rpx;
    flex-shrink: 0;
}
.staff-avatar-large.staff-avatar-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f5f5;
}
.staff-item-content {
    min-width: 0;
}
.staff-title-row {
    min-width: 0;
    width: 100%;
}
.staff-info-name {
    margin-right: 12rpx;
}
.staff-stat-row {
    min-width: 0;
    width: 100%;
}
.staff-distance {
    margin-left: 12rpx;
}
.staff-rating-tag {
    line-height: 36rpx;
    padding: 0 12rpx;
    color: #8b5a2b;
    background: #f5e6d3;
}
.staff-position-tag {
    line-height: 36rpx;
    padding: 0 12rpx;
    max-width: 180rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.staff-specialty-tag {
    line-height: 32rpx;
    padding: 0 10rpx;
}
.staff-store-row {
    min-width: 0;
}
.staff-store-meta .staff-meta-icon + .staff-meta-icon {
    margin-left: 28rpx;
}
.staff-meta-icon {
    line-height: 1;
}
.staff-bottom-row {
    min-width: 0;
}
.staff-meta {
    min-width: 0;
    padding-right: 16rpx;
}
.staff-book-btn {
    margin: 0;
    line-height: 50rpx;
}
.staff-item.active {
    border: 2rpx solid var(--color-main, #e22c08);
    box-sizing: border-box;
}
</style>
