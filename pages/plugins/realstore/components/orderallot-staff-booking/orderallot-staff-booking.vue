<template>
    <view :class="theme_view">
        <component-popup :propShow="popup_status" propPosition="bottom" @onclose="close_event">
            <view class="plugins-realstore-staff-booking-popup padding-main bg-white">
                <view class="plugins-realstore-staff-booking-header pr margin-bottom-sm">
                    <view class="plugins-realstore-staff-booking-title fw-b text-size tc">{{ popup_title }}</view>
                    <view class="plugins-realstore-staff-booking-close pa" @tap.stop="close_event">
                        <iconfont name="icon-close-line" size="28rpx" color="#999"></iconfont>
                    </view>
                </view>
                <scroll-view scroll-y="true" class="plugins-realstore-staff-booking-scroll-content">
                    <view class="plugins-realstore-staff-booking-scroll-inner">
                        <view v-if="init_loading_status != 3" class="plugins-realstore-staff-booking-init-loading">
                            <component-no-data :propStatus="init_loading_status" :propMsg="init_loading_msg" :propBackBtn="false" propLoadingLogoTop="20%"></component-no-data>
                        </view>
                        <block v-if="init_loading_status == 3 && (goods_list || null) != null && goods_list.length > 0">
                            <view v-for="(goods, gindex) in goods_list" :key="gindex" :class="'plugins-realstore-staff-booking-goods-item ' + (gindex + 1 >= goods_list.length ? '' : 'br-b padding-bottom-xxxxl margin-bottom-xxxxl')">
                                <view class="flex-row jc-sb">
                                    <image :src="goods.images" mode="aspectFill" class="plugins-realstore-staff-booking-goods-img radius br"></image>
                                    <view class="plugins-realstore-staff-booking-goods-base flex-1 flex-width padding-left-main">
                                        <view class="plugins-realstore-staff-booking-goods-title text-size-sm single-text">{{ goods.title }}</view>
                                        <view v-if="(goods.spec_text || '') != ''" class="text-size-xs cr-grey margin-top-sm single-text">{{ goods.spec_text }}</view>
                                        <view class="margin-top-sm">
                                            <text class="sales-price text-size-sm">{{ currency_symbol }}{{ goods.price }}</text>
                                            <text class="margin-left-sm cr-base text-size-sm">x{{ goods.buy_number }}</text>
                                        </view>
                                    </view>
                                </view>

                                <view v-for="(unit, uindex) in (goods.units || [])" :key="uindex"
                                    :class="'plugins-realstore-staff-booking-unit-block ' + ((goods.units || []).length > 1 && uindex > 0 ? 'plugins-realstore-staff-booking-unit-block-multi margin-top padding-top br-t-dashed' : 'margin-top-sm')">
                                    <view v-if="(goods.units || []).length > 1" class="plugins-realstore-staff-booking-unit-label text-size-xs cr-base margin-bottom-sm">{{$t('common.num')}}{{ uindex + 1 }}</view>

                                    <view class="margin-top-sm">
                                        <scroll-view scroll-x="true" class="plugins-realstore-staff-booking-staff-scroll" :show-scrollbar="false" enable-flex="true">
                                            <view class="plugins-realstore-staff-booking-staff-scroll-inner">
                                                <view v-for="(staff, sindex) in staff_list" :key="sindex"
                                                    :class="'plugins-realstore-staff-booking-staff-card dis-inline-block tc margin-right-sm br ' + (is_staff_selected(gindex, uindex, staff.id) ? 'br-main bg-main-light cr-main' : 'bg-white br-grey cp')"
                                                    :data-gindex="gindex"
                                                    :data-uindex="uindex"
                                                    :data-sindex="sindex"
                                                    @tap="staff_event">
                                                    <image :src="staff.avatar" mode="aspectFill" class="plugins-realstore-staff-booking-staff-avatar-sm radius margin-bottom-xs"></image>
                                                    <view class="plugins-realstore-staff-booking-staff-name text-size-xss single-text">{{ staff.alias }}</view>
                                                </view>
                                            </view>
                                        </scroll-view>
                                    </view>

                                    <view v-if="get_unit(gindex, uindex).staff_id > 0" class="margin-top-sm">
                                        <view class="cr-grey text-size-xss margin-bottom-xs">{{$t('realstore-cart.select_date')}}</view>
                                        <scroll-view scroll-x="true" class="scroll-view-horizontal plugins-realstore-staff-booking-unit-date-scroll" :show-scrollbar="false">
                                            <view class="plugins-realstore-staff-booking-date-scroll-inner">
                                                <view v-for="(date_item, date_index) in ymd_list" :key="date_index"
                                                    :class="'plugins-realstore-staff-booking-date-item margin-right-sm radius text-size-sm br ' + ((date_item.day_label || '') != '' ? 'plugins-realstore-staff-booking-date-item-with-label ' : 'plugins-realstore-staff-booking-date-item-no-label ') + (get_unit(gindex, uindex).ymd == date_item.ymd ? 'br-main bg-main-light cr-main' : (date_item.disabled == 1 ? 'bg-grey-disabled cr-grey' : 'bg-white br-grey cr-base cp'))"
                                                    :data-gindex="gindex"
                                                    :data-uindex="uindex"
                                                    :data-ymd="date_item.ymd"
                                                    :data-disabled="date_item.disabled || 0"
                                                    @tap="ymd_event">
                                                    <view v-if="(date_item.day_label || '') != ''" class="plugins-realstore-staff-booking-date-main-wrap">
                                                        <view class="plugins-realstore-staff-booking-date-main">{{ date_item.date_text }}</view>
                                                    </view>
                                                    <view v-else class="plugins-realstore-staff-booking-date-main">{{ date_item.date_text }}</view>
                                                    <view v-if="(date_item.day_label || '') != ''" class="plugins-realstore-staff-booking-date-day-label text-size-xss">{{ date_item.day_label }}</view>
                                                </view>
                                            </view>
                                        </scroll-view>
                                    </view>

                                    <view v-if="get_unit(gindex, uindex).staff_id > 0 && get_unit(gindex, uindex).ymd > 0" class="plugins-realstore-staff-booking-period-list margin-top-sm">
                                        <view class="cr-grey text-size-xss margin-bottom-xs">{{$t('realstore-cart.select_time_slot_2')}}</view>
                                        <view v-if="is_unit_periods_empty_loading(gindex, uindex)" class="cr-grey text-size-xs">{{$t('common.loading_in_text')}}</view>
                                        <view v-else-if="get_unit_periods(gindex, uindex).length <= 0" class="cr-grey text-size-xs">{{$t('realstore-cart.available_time_slots_date')}}</view>
                                        <view v-else class="plugins-realstore-staff-booking-period-wrap">
                                            <view v-for="(period, pindex) in get_unit_periods(gindex, uindex)" :key="pindex"
                                                :class="'plugins-realstore-staff-booking-period-tag dis-inline-block margin-right-sm margin-bottom-sm padding-horizontal-sm padding-vertical-xs radius text-size-xs br ' + get_period_class(gindex, uindex, get_unit(gindex, uindex).staff_id, period)"
                                                :data-gindex="gindex"
                                                :data-uindex="uindex"
                                                :data-pindex="pindex"
                                                @tap="period_event">
                                                {{ period.name || '' }}
                                            </view>
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </block>
                    </view>
                </scroll-view>
                <view class="margin-top-main">
                    <button type="default" hover-class="none" :loading="submit_loading" :disabled="submit_loading || init_loading_status != 3" class="round bg-main cr-white text-size-md wh-auto" @tap="submit_event">
                        {{ $t('common.save') }}
                    </button>
                </view>
            </view>
        </component-popup>
    </view>
</template>
<script>
    const app = getApp();
    import componentPopup from '@/components/popup/popup';
    import componentNoData from '@/components/no-data/no-data';
    import pluginLocale from '../../locale/index.js';

    export default {
        mixins: [pluginLocale],
        components: {
            componentPopup,
            componentNoData,
        },
        props: {
            propCurrencySymbol: {
                type: String,
                default: '',
            },
        },
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                popup_status: false,
                popup_title: '',
                order_allot_id: 0,
                currency_symbol: '',
                goods_list: null,
                staff_list: [],
                ymd_list: [],
                booking_form: {},
                unit_periods: {},
                unit_periods_loading: {},
                init_loading_status: 3,
                init_loading_msg: '',
                submit_loading: false,
                period_load_key: {},
            };
        },
        methods: {
            open(order_allot_id, currency_symbol = '') {
                var id = parseInt(order_allot_id || 0);
                if(id <= 0) {
                    app.globalData.showToast(this.$t('realstore-staff.invalid_parameters'));
                    return false;
                }
                this.setData({
                    popup_status: true,
                    popup_title: this.$t('staff-order.staff_booking_title'),
                    order_allot_id: id,
                    currency_symbol: currency_symbol || this.propCurrencySymbol || '',
                    goods_list: null,
                    staff_list: [],
                    ymd_list: [],
                    booking_form: {},
                    unit_periods: {},
                    unit_periods_loading: {},
                    period_load_key: {},
                    init_loading_status: 1,
                    init_loading_msg: '',
                    submit_loading: false,
                });
                this.load_info();
            },
            close_event() {
                this.setData({ popup_status: false, submit_loading: false });
            },
            get_unit(gindex, uindex) {
                var units = this.booking_form[gindex] || [];
                return units[uindex] || { staff_id: 0, ymd: 0, booking_periods_id: 0 };
            },
            is_staff_selected(gindex, uindex, staff_id) {
                return parseInt(this.get_unit(gindex, uindex).staff_id || 0) == parseInt(staff_id || 0);
            },
            get_unit_periods(gindex, uindex) {
                return this.unit_periods[String(gindex) + '_' + String(uindex)] || [];
            },
            is_unit_periods_empty_loading(gindex, uindex) {
                var key = String(gindex) + '_' + String(uindex);
                return (this.unit_periods_loading[key] || 0) == 1 && this.get_unit_periods(gindex, uindex).length <= 0;
            },
            normalize_periods(list) {
                var result = [];
                var rows = list || [];
                for(var i in rows) {
                    var row = rows[i] || {};
                    var occupied_text = row.occupied_text || '';
                    // 被约不可选；已约（当前记录）可选
                    var is_available = occupied_text == '被约' ? 0 : 1;
                    result.push({
                        id: parseInt(row.id || 0),
                        name: row.label || row.name || '',
                        is_available: is_available,
                        occupied_text: occupied_text,
                    });
                }
                return result;
            },
            load_info() {
                this.setData({ init_loading_status: 1, init_loading_msg: '' });
                uni.request({
                    url: app.globalData.get_request_url('staffbookinginfo', 'stafforder', 'realstore'),
                    method: 'POST',
                    data: { id: this.order_allot_id },
                    dataType: 'json',
                    success: (res) => {
                        if(res.data.code != 0 || (res.data.data || null) == null) {
                            this.setData({
                                init_loading_status: 0,
                                init_loading_msg: res.data.msg || this.$t('common.no_data'),
                            });
                            return;
                        }
                        var data = res.data.data;
                        var goods_list = data.goods_list || [];
                        var form = {};
                        var periods_map = {};
                        for(var gi in goods_list) {
                            var units = goods_list[gi].units || [];
                            form[gi] = [];
                            for(var ui in units) {
                                var uv = units[ui] || {};
                                form[gi].push({
                                    id: parseInt(uv.booking_id || 0),
                                    goods_id: parseInt(uv.goods_id || goods_list[gi].goods_id || 0),
                                    unit_index: parseInt(uv.unit_index || ui),
                                    staff_id: parseInt(uv.staff_id || 0),
                                    staff_alias: uv.staff_alias || '',
                                    staff_avatar: uv.staff_avatar || '',
                                    ymd: parseInt(uv.ymd || 0),
                                    booking_periods_id: parseInt(uv.booking_periods_id || 0),
                                    period_text: uv.period_text || '',
                                });
                                if(parseInt(uv.staff_id || 0) > 0 && parseInt(uv.ymd || 0) > 0) {
                                    periods_map[String(gi) + '_' + String(ui)] = this.normalize_periods(uv.periods_list || []);
                                }
                            }
                        }
                        this.setData({
                            init_loading_status: 3,
                            goods_list: goods_list,
                            staff_list: data.staff_list || [],
                            ymd_list: data.ymd_list || [],
                            booking_form: form,
                            unit_periods: periods_map,
                            popup_title: this.$t('staff-order.staff_booking_title'),
                        });
                    },
                    fail: () => {
                        this.setData({
                            init_loading_status: 0,
                            init_loading_msg: this.$t('common.internet_error_tips'),
                        });
                    },
                });
            },
            load_unit_periods(gindex, uindex, staff_id, ymd, booking_id) {
                var unit_key = String(gindex) + '_' + String(uindex);
                var load_key = String(staff_id) + '_' + String(ymd) + '_' + String(booking_id || 0);
                var period_load_key = JSON.parse(JSON.stringify(this.period_load_key || {}));
                if((period_load_key[unit_key] || '') == load_key && (this.unit_periods_loading[unit_key] || 0) == 1) {
                    return;
                }
                period_load_key[unit_key] = load_key;
                var loading_map = JSON.parse(JSON.stringify(this.unit_periods_loading || {}));
                loading_map[unit_key] = 1;
                this.setData({
                    unit_periods_loading: loading_map,
                    period_load_key: period_load_key,
                });
                uni.request({
                    url: app.globalData.get_request_url('staffbookingperiodoptions', 'stafforder', 'realstore'),
                    method: 'POST',
                    data: {
                        id: booking_id || 0,
                        staff_id: staff_id,
                        ymd: ymd,
                    },
                    dataType: 'json',
                    success: (res) => {
                        var periods_map = JSON.parse(JSON.stringify(this.unit_periods || {}));
                        var loading_map_done = JSON.parse(JSON.stringify(this.unit_periods_loading || {}));
                        var form = JSON.parse(JSON.stringify(this.booking_form || {}));
                        loading_map_done[unit_key] = 0;
                        if(res.data.code == 0) {
                            var periods = this.normalize_periods(res.data.data || []);
                            periods_map[unit_key] = periods;
                            var item = ((form[gindex] || [])[uindex]) || null;
                            if(item != null && (item.booking_periods_id || 0) > 0) {
                                var matched = null;
                                for(var pi in periods) {
                                    if(parseInt(periods[pi].id) == parseInt(item.booking_periods_id)) {
                                        matched = periods[pi];
                                        break;
                                    }
                                }
                                if(matched == null || parseInt(matched.is_available || 0) == 0) {
                                    item.booking_periods_id = 0;
                                    item.period_text = '';
                                    if(matched != null) {
                                        app.globalData.showToast(this.$t('realstore-cart.time_slot_occupied_select_again'));
                                    }
                                }
                            }
                        } else {
                            periods_map[unit_key] = [];
                            app.globalData.showToast(res.data.msg);
                        }
                        this.setData({
                            unit_periods: periods_map,
                            unit_periods_loading: loading_map_done,
                            booking_form: form,
                        });
                    },
                    fail: () => {
                        var periods_map = JSON.parse(JSON.stringify(this.unit_periods || {}));
                        var loading_map_done = JSON.parse(JSON.stringify(this.unit_periods_loading || {}));
                        periods_map[unit_key] = [];
                        loading_map_done[unit_key] = 0;
                        this.setData({
                            unit_periods: periods_map,
                            unit_periods_loading: loading_map_done,
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },
            clear_unit_periods(gindex, uindex) {
                var unit_key = String(gindex) + '_' + String(uindex);
                var periods_map = JSON.parse(JSON.stringify(this.unit_periods || {}));
                var loading_map = JSON.parse(JSON.stringify(this.unit_periods_loading || {}));
                var period_load_key = JSON.parse(JSON.stringify(this.period_load_key || {}));
                delete periods_map[unit_key];
                delete loading_map[unit_key];
                delete period_load_key[unit_key];
                this.setData({
                    unit_periods: periods_map,
                    unit_periods_loading: loading_map,
                    period_load_key: period_load_key,
                });
            },
            is_period_available(gindex, uindex, staff_id, period) {
                if(parseInt(period.is_available || 0) == 0) {
                    return false;
                }
                var current_ymd = this.get_unit(gindex, uindex).ymd || 0;
                for(var gi in this.booking_form) {
                    for(var ui in (this.booking_form[gi] || [])) {
                        if(String(gi) == String(gindex) && String(ui) == String(uindex)) {
                            continue;
                        }
                        var other = this.booking_form[gi][ui];
                        if((other.staff_id || 0) == staff_id && (other.booking_periods_id || 0) == period.id && (other.ymd || 0) == current_ymd && current_ymd > 0) {
                            return false;
                        }
                    }
                }
                return true;
            },
            get_period_class(gindex, uindex, staff_id, period) {
                var item = this.get_unit(gindex, uindex);
                var unit_key = String(gindex) + '_' + String(uindex);
                if((this.unit_periods_loading[unit_key] || 0) == 1) {
                    return 'bg-grey-disabled cr-grey';
                }
                var available = this.is_period_available(gindex, uindex, staff_id, period);
                if((item.booking_periods_id || 0) == period.id && available) {
                    return 'br-main bg-main-light cr-main cp';
                }
                if(!available) {
                    return 'bg-grey-disabled cr-grey';
                }
                return 'bg-white br-grey cr-base cp';
            },
            staff_event(e) {
                var gindex = e.currentTarget.dataset.gindex;
                var uindex = e.currentTarget.dataset.uindex;
                var staff = (this.staff_list || [])[e.currentTarget.dataset.sindex];
                if((staff || null) == null) {
                    return false;
                }
                var form = JSON.parse(JSON.stringify(this.booking_form || {}));
                if((form[gindex] || null) == null || (form[gindex][uindex] || null) == null) {
                    return false;
                }
                var item = form[gindex][uindex];
                if((item.staff_id || 0) == staff.id) {
                    item.staff_id = 0;
                    item.staff_alias = '';
                    item.staff_avatar = '';
                    item.ymd = 0;
                    item.booking_periods_id = 0;
                    item.period_text = '';
                    this.clear_unit_periods(gindex, uindex);
                    this.setData({ booking_form: form });
                    return true;
                }
                item.staff_id = staff.id;
                item.staff_alias = staff.alias || '';
                item.staff_avatar = staff.avatar || '';
                item.ymd = 0;
                item.booking_periods_id = 0;
                item.period_text = '';
                this.clear_unit_periods(gindex, uindex);
                this.setData({ booking_form: form });
            },
            ymd_event(e) {
                if(parseInt(e.currentTarget.dataset.disabled || 0) == 1) {
                    app.globalData.showToast(this.$t('realstore-cart.date_available'));
                    return false;
                }
                var gindex = e.currentTarget.dataset.gindex;
                var uindex = e.currentTarget.dataset.uindex;
                var ymd = parseInt(e.currentTarget.dataset.ymd);
                var form = JSON.parse(JSON.stringify(this.booking_form || {}));
                var item = form[gindex][uindex];
                if((item.staff_id || 0) == 0) {
                    app.globalData.showToast(this.$t('realstore-cart.select_staff_first'));
                    return false;
                }
                if((item.ymd || 0) == ymd) {
                    item.ymd = 0;
                    item.booking_periods_id = 0;
                    item.period_text = '';
                    this.clear_unit_periods(gindex, uindex);
                    this.setData({ booking_form: form });
                    return true;
                }
                item.ymd = ymd;
                item.booking_periods_id = 0;
                item.period_text = '';
                this.setData({ booking_form: form });
                this.load_unit_periods(gindex, uindex, item.staff_id, ymd, item.id || 0);
            },
            period_event(e) {
                var gindex = e.currentTarget.dataset.gindex;
                var uindex = e.currentTarget.dataset.uindex;
                var period = this.get_unit_periods(gindex, uindex)[e.currentTarget.dataset.pindex];
                if((period || null) == null) {
                    return false;
                }
                var form = JSON.parse(JSON.stringify(this.booking_form || {}));
                var item = form[gindex][uindex];
                if((item.staff_id || 0) == 0) {
                    app.globalData.showToast(this.$t('realstore-cart.select_staff_first'));
                    return false;
                }
                if((item.ymd || 0) == 0) {
                    app.globalData.showToast(this.$t('realstore-cart.select_date_first'));
                    return false;
                }
                if((item.booking_periods_id || 0) == period.id) {
                    item.booking_periods_id = 0;
                    item.period_text = '';
                    this.setData({ booking_form: form });
                    return true;
                }
                if(!this.is_period_available(gindex, uindex, item.staff_id, period)) {
                    app.globalData.showToast(this.$t('realstore-cart.time_slot_occupied'));
                    return false;
                }
                item.booking_periods_id = period.id;
                item.period_text = period.name || '';
                this.setData({ booking_form: form });
            },
            submit_event() {
                if((this.goods_list || null) == null || this.goods_list.length <= 0) {
                    app.globalData.showToast(this.$t('common.no_data'));
                    return false;
                }
                var booking_data = [];
                for(var gi in this.goods_list) {
                    var units = this.booking_form[gi] || [];
                    for(var ui in units) {
                        var item = units[ui];
                        if((item.staff_id || 0) == 0 || (item.ymd || 0) == 0 || (item.booking_periods_id || 0) == 0) {
                            app.globalData.showToast(this.$t('realstore-cart.select_staff_date_time_slot_each'));
                            return false;
                        }
                        var periods = this.get_unit_periods(gi, ui);
                        var matched = null;
                        for(var pi in periods) {
                            if(parseInt(periods[pi].id) == parseInt(item.booking_periods_id)) {
                                matched = periods[pi];
                                break;
                            }
                        }
                        if(matched == null || !this.is_period_available(gi, ui, item.staff_id, matched)) {
                            app.globalData.showToast(this.$t('realstore-cart.selected_time_slot_occupied_select_again'));
                            return false;
                        }
                        booking_data.push({
                            id: item.id || 0,
                            goods_id: item.goods_id,
                            staff_id: item.staff_id,
                            ymd: item.ymd,
                            booking_periods_id: item.booking_periods_id,
                        });
                    }
                }
                this.setData({ submit_loading: true });
                uni.request({
                    url: app.globalData.get_request_url('staffbookingsave', 'stafforder', 'realstore'),
                    method: 'POST',
                    data: {
                        id: this.order_allot_id,
                        booking_data: JSON.stringify(booking_data),
                    },
                    dataType: 'json',
                    success: (res) => {
                        this.setData({ submit_loading: false });
                        app.globalData.showToast(res.data.msg);
                        if(res.data.code == 0) {
                            this.setData({ popup_status: false });
                            this.$emit('success');
                        }
                    },
                    fail: () => {
                        this.setData({ submit_loading: false });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },
        },
    };
</script>
<style scoped>
.plugins-realstore-staff-booking-popup {
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
}
.plugins-realstore-staff-booking-title {
    line-height: 44rpx;
    padding: 0 48rpx;
}
.plugins-realstore-staff-booking-close {
    top: 0;
    right: 0;
    height: 44rpx;
    display: flex;
    align-items: center;
    padding: 0 8rpx;
    z-index: 1;
}
.plugins-realstore-staff-booking-scroll-content {
    max-height: 58vh;
    width: 100%;
    box-sizing: border-box;
}
.plugins-realstore-staff-booking-scroll-inner {
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    padding-bottom: 10rpx;
}
.plugins-realstore-staff-booking-init-loading {
    min-height: 40vh;
}
.plugins-realstore-staff-booking-date-item {
    min-width: 120rpx;
    height: 88rpx;
    padding: 8rpx 32rpx;
    box-sizing: border-box;
    vertical-align: top;
    display: inline-flex !important;
    flex-direction: column;
    align-items: center;
    text-align: center;
    flex-shrink: 0;
}
.plugins-realstore-staff-booking-date-item-no-label {
    justify-content: center;
}
.plugins-realstore-staff-booking-date-item-with-label {
    justify-content: space-between;
}
.plugins-realstore-staff-booking-date-main-wrap {
    flex: 1;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 0;
}
.plugins-realstore-staff-booking-date-main {
    line-height: 1.4;
}
.plugins-realstore-staff-booking-date-day-label {
    flex-shrink: 0;
    height: 24rpx;
    line-height: 24rpx;
    opacity: 0.75;
}
.plugins-realstore-staff-booking-date-item.bg-main-light .plugins-realstore-staff-booking-date-day-label {
    opacity: 0.9;
}
.plugins-realstore-staff-booking-date-item.br-grey .plugins-realstore-staff-booking-date-day-label {
    color: #999;
}
.plugins-realstore-staff-booking-goods-item {
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
}
.plugins-realstore-staff-booking-goods-item .plugins-realstore-staff-booking-goods-img {
    width: 120rpx;
    height: 120rpx !important;
    flex-shrink: 0;
}
.plugins-realstore-staff-booking-goods-item .plugins-realstore-staff-booking-goods-base {
    min-width: 0;
}
.plugins-realstore-staff-booking-unit-block {
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
}
.plugins-realstore-staff-booking-staff-scroll {
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
}
.plugins-realstore-staff-booking-staff-scroll-inner {
    display: inline-flex;
    flex-direction: row;
    flex-wrap: nowrap;
    padding-right: 4rpx;
}
.plugins-realstore-staff-booking-staff-card {
    width: 120rpx;
    flex-shrink: 0;
    vertical-align: top;
    padding: 12rpx 8rpx;
    border-radius: 10rpx;
    box-sizing: border-box;
}
.plugins-realstore-staff-booking-staff-avatar-sm {
    width: 72rpx;
    height: 72rpx;
    display: block;
    margin-left: auto;
    margin-right: auto;
}
.plugins-realstore-staff-booking-staff-name {
    max-width: 104rpx;
    margin: 0 auto;
    line-height: 1.4;
}
.plugins-realstore-staff-booking-unit-date-scroll {
    width: 100%;
    box-sizing: border-box;
    white-space: nowrap;
}
.plugins-realstore-staff-booking-date-scroll-inner {
    display: inline-flex;
    flex-direction: row;
    flex-wrap: nowrap;
    padding-right: 4rpx;
}
.plugins-realstore-staff-booking-period-wrap {
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
}
.plugins-realstore-staff-booking-unit-label {
    line-height: 1.4;
}
.plugins-realstore-staff-booking-period-tag {
    line-height: 1.6;
    max-width: 100%;
    box-sizing: border-box;
}
</style>
