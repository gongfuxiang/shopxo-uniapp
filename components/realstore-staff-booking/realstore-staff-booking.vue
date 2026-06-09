<template>
    <view :class="theme_view">
        <component-popup :propShow="popup_status" propPosition="bottom" @onclose="close_event">
            <view class="padding-top-main bg-white staff-booking-popup">
                <view class="padding-horizontal-main margin-bottom pr">
                    <view class="staff-booking-title fw-b text-size tc">{{ popup_title }}</view>
                    <view class="staff-booking-close pa" @tap.stop="close_event">
                        <iconfont name="icon-close-line" size="28rpx" color="#999"></iconfont>
                    </view>
                </view>

                <!-- 商品选择 -->
                <scroll-view scroll-y="true" class="booking-scroll-content">
                    <view class="booking-scroll-inner padding-horizontal-main">
                    <view v-if="init_loading_status != 3" class="booking-init-loading">
                        <component-no-data :propStatus="init_loading_status" :propMsg="init_loading_msg" :propBackBtn="false" propLoadingLogoTop="20%"></component-no-data>
                    </view>
                    <block v-if="init_loading_status == 3 && (cart_list || null) != null && cart_list.length > 0">
                        <view v-for="(goods, gindex) in cart_list" :key="gindex" :class="'goods-booking-item ' + (gindex + 1 >= cart_list.length ? '' : 'br-b padding-bottom-xxxxl margin-bottom-xxxxl')">
                            <!-- 商品信息 -->
                            <view class="flex-row jc-sb">
                                <image :src="goods.images" mode="widthFix" class="goods-img radius br"></image>
                                <view class="goods-base flex-1 flex-width padding-left-main flex-col jc-sb">
                                    <view class="goods-base-content">
                                        <view class="goods-title text-size-sm single-text">{{ goods.title }}</view>
                                        <view v-if="(goods.spec || null) != null && goods.spec.length > 0" class="text-size-xs cr-grey margin-top-sm single-text">
                                            <block v-for="(sv, si) in goods.spec" :key="si">
                                                <text v-if="si > 0" class="padding-left-xs padding-right-xs">;</text>
                                                <text>{{ sv.value }}</text>
                                            </block>
                                        </view>
                                    </view>
                                    <view>
                                        <view class="sales-price text-size-sm single-text">{{ currency_symbol }}{{ goods.price }}</view>
                                    </view>
                                </view>
                            </view>

                            <!-- 按数量拆分选择 -->
                            <view v-for="(unit, uindex) in get_goods_units(goods)" :key="uindex"
                                :class="'unit-booking-block ' + (get_goods_units(goods).length > 1 && uindex > 0 ? 'unit-booking-block-multi margin-top padding-top br-t-dashed' : 'margin-top-sm')">
                                <view v-if="get_goods_units(goods).length > 1" class="unit-label text-size-xs cr-base margin-bottom-sm">数量{{ uindex + 1 }}</view>

                                <!-- 服务人员横向滑动 -->
                                <scroll-view scroll-x="true" class="staff-scroll" :show-scrollbar="false" enable-flex="true">
                                    <view class="staff-scroll-inner">
                                        <view v-for="(staff, sindex) in get_unit_staff_list(gindex, uindex)" :key="sindex"
                                            :class="'staff-card dis-inline-block tc margin-right-sm br ' + (is_staff_selected(gindex, uindex, staff.id) ? 'br-main bg-main-light cr-main' : 'bg-white br-grey cp')"
                                            :data-gindex="gindex"
                                            :data-uindex="uindex"
                                            :data-sindex="sindex"
                                            @tap="goods_staff_event">
                                            <image :src="staff.avatar" mode="aspectFill" class="staff-avatar-sm radius margin-bottom-xs"></image>
                                            <view class="staff-name text-size-xss single-text">{{ staff.alias }}</view>
                                        </view>
                                    </view>
                                </scroll-view>

                                <!-- 日期选择 -->
                                <view v-if="get_booking_unit(gindex, uindex).staff_id > 0" class="margin-top-sm">
                                    <view class="cr-grey text-size-xss margin-bottom-xs">选择日期</view>
                                    <scroll-view scroll-x="true" class="scroll-view-horizontal unit-date-scroll" :show-scrollbar="false">
                                        <view v-for="(date_item, date_index) in ymd_list" :key="date_index"
                                            :class="'date-item margin-right-sm radius text-size-sm br ' + ((date_item.day_label || '') != '' ? 'date-item-with-label ' : 'date-item-no-label ') + (get_booking_unit(gindex, uindex).ymd == date_item.ymd ? 'br-main bg-main-light cr-main' : (date_item.disabled == 1 ? 'bg-grey-disabled cr-grey' : 'bg-white br-grey cr-base cp'))"
                                            :data-gindex="gindex"
                                            :data-uindex="uindex"
                                            :data-ymd="date_item.ymd"
                                            :data-disabled="date_item.disabled"
                                            @tap="goods_ymd_event">
                                            <view v-if="(date_item.day_label || '') != ''" class="date-main-wrap">
                                                <view class="date-main">{{ date_item.date_text }}</view>
                                            </view>
                                            <view v-else class="date-main">{{ date_item.date_text }}</view>
                                            <view v-if="(date_item.day_label || '') != ''" class="date-day-label text-size-xss">{{ date_item.day_label }}</view>
                                        </view>
                                    </scroll-view>
                                </view>

                                <!-- 时段选择 -->
                                <view v-if="get_booking_unit(gindex, uindex).staff_id > 0 && get_booking_unit(gindex, uindex).ymd > 0" class="period-list margin-top-sm">
                                    <view class="cr-grey text-size-xss margin-bottom-xs">选择时段</view>
                                    <view v-if="is_unit_periods_empty_loading(gindex, uindex)" class="cr-grey text-size-xs">加载中...</view>
                                    <view v-else-if="get_unit_periods(gindex, uindex).length <= 0" class="cr-grey text-size-xs">该日期暂无可用时段</view>
                                    <view v-else class="period-wrap">
                                        <view v-for="(period, pindex) in get_unit_periods(gindex, uindex)" :key="pindex"
                                            :class="'period-tag dis-inline-block margin-right-sm margin-bottom-sm padding-horizontal-sm padding-vertical-xs radius text-size-xs br ' + get_period_class(gindex, uindex, get_booking_unit(gindex, uindex).staff_id, period)"
                                            :data-gindex="gindex"
                                            :data-uindex="uindex"
                                            :data-pindex="pindex"
                                            @tap="goods_period_event">
                                            {{ period.name || '' }}<text v-if="parseInt(period.is_available || 0) == 0" class="cr-grey">({{ parseInt(period.occupied_flag || 0) == 1 ? '已约' : '被约' }})</text>
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </block>
                    </view>
                </scroll-view>

                <view class="padding-main">
                    <button type="default" hover-class="none" :loading="submit_loading" :disabled="submit_loading || init_loading_status != 3" class="radius bg-main cr-white text-size-md wh-auto" @tap="submit_event">
                        确认并去结算
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

    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                currency_symbol: app.globalData.currency_symbol(),
                popup_status: false,
                popup_title: '选择服务人员时段',
                realstore_id: 0,
                ymd_list: [],
                staff_list: [],
                cart_list: null,
                booking_form: {},
                unit_periods: {},
                unit_periods_loading: {},
                init_loading_status: 3,
                init_loading_msg: '',
                submit_loading: false,
            };
        },
        components: {
            componentPopup,
            componentNoData,
        },
        methods: {
            /**
             * 打开弹窗并初始化预约数据
             * @param {Object} params cart_list-购物车商品 popup_title-标题 realstore_id-门店ID
             */
            init(params) {
                params = params || {};
                var cart_list = params.cart_list || null;
                var popup_title = params.popup_title || '选择服务人员时段';
                var realstore_id = params.realstore_id || 0;
                var booking_form = {};
                if(cart_list != null) {
                    for(var gi in cart_list) {
                        var stock = parseInt(cart_list[gi].stock) || 1;
                        booking_form[gi] = [];
                        for(var ui = 0; ui < stock; ui++) {
                            booking_form[gi].push({
                                cart_id: cart_list[gi].id,
                                goods_id: cart_list[gi].goods_id,
                                unit_index: ui,
                                staff_id: 0,
                                staff_alias: '',
                                staff_avatar: '',
                                booking_periods_id: 0,
                                period_text: '',
                                ymd: 0,
                            });
                        }
                    }
                }
                this.setData({
                    popup_status: true,
                    popup_title: popup_title,
                    realstore_id: realstore_id,
                    cart_list: cart_list,
                    booking_form: booking_form,
                    unit_periods: {},
                    unit_periods_loading: {},
                    init_loading_status: 1,
                    init_loading_msg: '',
                });
                this.load_init_data();
            },

            /**
             * 按商品购买数量返回序号数组，用于 v-for 拆分每个数量的预约块
             */
            get_goods_units(goods) {
                var stock = parseInt(goods.stock) || 1;
                var units = [];
                for(var i = 0; i < stock; i++) {
                    units.push(i);
                }
                return units;
            },

            /**
             * 获取某个商品某个数量单元的预约表单数据
             */
            get_booking_unit(gindex, uindex) {
                var units = this.booking_form[gindex] || [];
                return units[uindex] || {};
            },

            /**
             * 判断服务人员是否已被当前单元选中
             */
            is_staff_selected(gindex, uindex, staff_id) {
                var item = this.get_booking_unit(gindex, uindex);
                return (item.staff_id || 0) == staff_id;
            },

            /**
             * 获取某个单元已加载的时段列表
             */
            get_unit_periods(gindex, uindex) {
                var unit_key = String(gindex) + '_' + String(uindex);
                return this.unit_periods[unit_key] || [];
            },

            /**
             * 时段是否正在加载且尚无数据（模板展示“加载中...”）
             */
            is_unit_periods_empty_loading(gindex, uindex) {
                var unit_key = String(gindex) + '_' + String(uindex);
                return (this.unit_periods_loading[unit_key] || 0) == 1 && this.get_unit_periods(gindex, uindex).length <= 0;
            },

            /**
             * 加载可选日期、服务人员等初始化数据
             */
            load_init_data() {
                this.setData({
                    init_loading_status: 1,
                    init_loading_msg: '',
                });
                uni.request({
                    url: app.globalData.get_request_url('available', 'staffbooking', 'realstore'),
                    method: 'POST',
                    data: { realstore_id: this.realstore_id },
                    dataType: 'json',
                    success: (res) => {
                        var set_data = {
                            init_loading_status: 0,
                            init_loading_msg: '',
                        };
                        if(res.data.code == 0) {
                            var result = res.data.data;
                            var form = this.booking_form;
                            // 兜底：若表单未初始化则按购物车重建
                            if((this.cart_list || null) != null && Object.keys(form).length <= 0) {
                                form = {};
                                for(var gi in this.cart_list) {
                                    var stock = parseInt(this.cart_list[gi].stock) || 1;
                                    form[gi] = [];
                                    for(var ui = 0; ui < stock; ui++) {
                                        form[gi].push({
                                            cart_id: this.cart_list[gi].id,
                                            goods_id: this.cart_list[gi].goods_id,
                                            unit_index: ui,
                                            staff_id: 0,
                                            staff_alias: '',
                                            staff_avatar: '',
                                            booking_periods_id: 0,
                                            period_text: '',
                                            ymd: 0,
                                        });
                                    }
                                }
                            }
                            set_data.ymd_list = result.ymd_list || [];
                            set_data.staff_list = result.staff_list || [];
                            set_data.booking_form = form;
                            set_data.popup_title = result.popup_title || this.popup_title || '选择服务人员时段';
                            set_data.init_loading_status = 3;
                        } else {
                            set_data.init_loading_msg = res.data.msg;
                        }
                        this.setData(set_data);
                    },
                    fail: () => {
                        this.setData({
                            init_loading_status: 0,
                            init_loading_msg: this.$t('common.internet_error_tips'),
                        });
                    },
                });
            },

            /**
             * 加载指定单元（员工+日期）的可用时段，并校验已选时段是否仍有效
             */
            load_unit_periods(gindex, uindex, staff_id, ymd) {
                var unit_key = String(gindex) + '_' + String(uindex);
                var loading_map = JSON.parse(JSON.stringify(this.unit_periods_loading || {}));
                loading_map[unit_key] = 1;
                this.setData({ unit_periods_loading: loading_map });

                uni.request({
                    url: app.globalData.get_request_url('available', 'staffbooking', 'realstore'),
                    method: 'POST',
                    data: {
                        realstore_id: this.realstore_id,
                        staff_id: staff_id,
                        ymd: ymd,
                        goods_id: (this.cart_list || [])[gindex] ? (this.cart_list[gindex].goods_id || 0) : 0,
                    },
                    dataType: 'json',
                    success: (res) => {
                        var periods_map = JSON.parse(JSON.stringify(this.unit_periods || {}));
                        var loading_map_done = JSON.parse(JSON.stringify(this.unit_periods_loading || {}));
                        var form = JSON.parse(JSON.stringify(this.booking_form || {}));
                        loading_map_done[unit_key] = 0;
                        if(res.data.code == 0) {
                            var staff_list = res.data.data.staff_list || [];
                            var periods = [];
                            for(var i in staff_list) {
                                if(parseInt(staff_list[i]['id']) == parseInt(staff_id)) {
                                    periods = staff_list[i]['periods'] || [];
                                    break;
                                }
                            }
                            periods_map[unit_key] = periods;
                            // 若之前已选时段，刷新后不可用则清空并提示
                            var item = form[gindex][uindex];
                            if((item.booking_periods_id || 0) > 0) {
                                var matched = null;
                                for(var pi in periods) {
                                    if(parseInt(periods[pi]['id']) == parseInt(item.booking_periods_id)) {
                                        matched = periods[pi];
                                        break;
                                    }
                                }
                                if(matched == null || parseInt(matched.is_available || 0) == 0) {
                                    item.booking_periods_id = 0;
                                    item.period_text = '';
                                    if(matched != null) {
                                        app.globalData.showToast('该时段已被占用，请重新选择');
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

            /**
             * 清空某个单元的时段缓存（切换员工/日期时调用）
             */
            clear_unit_periods(gindex, uindex) {
                var unit_key = String(gindex) + '_' + String(uindex);
                var periods_map = JSON.parse(JSON.stringify(this.unit_periods || {}));
                var loading_map = JSON.parse(JSON.stringify(this.unit_periods_loading || {}));
                delete periods_map[unit_key];
                delete loading_map[unit_key];
                this.setData({
                    unit_periods: periods_map,
                    unit_periods_loading: loading_map,
                });
            },

            /**
             * 判断时段是否可选（接口可用 + 本单内未被其他商品占用）
             */
            is_period_available(gindex, uindex, staff_id, period) {
                if(parseInt(period.is_available || 0) == 0) {
                    return false;
                }
                var current_ymd = this.get_booking_unit(gindex, uindex).ymd || 0;
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

            /**
             * 时段标签样式：选中 / 不可用 / 可选
             */
            get_period_class(gindex, uindex, staff_id, period) {
                var item = this.get_booking_unit(gindex, uindex);
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

            /**
             * 选择/取消选择日期
             */
            goods_ymd_event(e) {
                if(parseInt(e.currentTarget.dataset.disabled || 0) == 1) {
                    app.globalData.showToast('该日期不可选');
                    return false;
                }
                var gindex = e.currentTarget.dataset.gindex;
                var uindex = e.currentTarget.dataset.uindex;
                var ymd = parseInt(e.currentTarget.dataset.ymd);
                var form = JSON.parse(JSON.stringify(this.booking_form || {}));
                var item = form[gindex][uindex];
                if((item.staff_id || 0) == 0) {
                    app.globalData.showToast('请先选择服务人员');
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
                this.load_unit_periods(gindex, uindex, item.staff_id, ymd);
            },

            /**
             * 获取当前商品可服务的员工列表（按商品绑定关系过滤）
             */
            get_unit_staff_list(gindex, uindex) {
                var list = this.staff_list || [];
                var goods = (this.cart_list || [])[gindex];
                if((goods || null) == null) {
                    return list;
                }
                var goods_id = parseInt(goods.goods_id) || 0;
                if(goods_id <= 0) {
                    return list;
                }
                var result = [];
                for(var i in list) {
                    var staff = list[i];
                    var ids = staff.goods_ids || [];
                    if(!ids || ids.length <= 0) {
                        result.push(staff);
                        continue;
                    }
                    var matched = false;
                    for(var j in ids) {
                        if(parseInt(ids[j]) == goods_id) {
                            matched = true;
                            break;
                        }
                    }
                    if(matched) {
                        result.push(staff);
                    }
                }
                return result;
            },

            /**
             * 选择/取消选择服务人员
             */
            goods_staff_event(e) {
                var gindex = e.currentTarget.dataset.gindex;
                var uindex = e.currentTarget.dataset.uindex;
                var staff = this.get_unit_staff_list(gindex, uindex)[e.currentTarget.dataset.sindex];
                if((staff || null) == null) {
                    return false;
                }
                var form = JSON.parse(JSON.stringify(this.booking_form || {}));
                if((form[gindex] || null) == null) {
                    return false;
                }
                var item = form[gindex][uindex];
                if((item.staff_id || 0) == staff.id) {
                    item.staff_id = 0;
                    item.staff_alias = '';
                    item.staff_avatar = '';
                } else {
                    item.staff_id = staff.id;
                    item.staff_alias = staff.alias;
                    item.staff_avatar = staff.avatar || '';
                }
                item.ymd = 0;
                item.booking_periods_id = 0;
                item.period_text = '';
                this.clear_unit_periods(gindex, uindex);
                this.setData({ booking_form: form });
            },

            /**
             * 选择/取消选择时段
             */
            goods_period_event(e) {
                var gindex = e.currentTarget.dataset.gindex;
                var uindex = e.currentTarget.dataset.uindex;
                var unit_key = String(gindex) + '_' + String(uindex);
                if((this.unit_periods_loading[unit_key] || 0) == 1) {
                    return false;
                }
                var pindex = e.currentTarget.dataset.pindex;
                var form = JSON.parse(JSON.stringify(this.booking_form || {}));
                var item = form[gindex][uindex];
                if((item.staff_id || 0) == 0) {
                    app.globalData.showToast('请先选择服务人员');
                    return false;
                }
                if((item.ymd || 0) == 0) {
                    app.globalData.showToast('请先选择日期');
                    return false;
                }
                var periods = this.get_unit_periods(gindex, uindex);
                var period = periods[pindex];
                if((period || null) == null) {
                    return false;
                }
                if((item.booking_periods_id || 0) == period.id) {
                    item.booking_periods_id = 0;
                    item.period_text = '';
                    this.setData({ booking_form: form });
                    return true;
                }
                if(!this.is_period_available(gindex, uindex, item.staff_id, period)) {
                    app.globalData.showToast('该时段已被占用');
                    return false;
                }
                item.booking_periods_id = period.id;
                item.period_text = period.name || '';
                this.setData({ booking_form: form });
            },

            /**
             * 校验并提交预约数据，成功后关闭弹窗并回调
             */
            submit_event() {
                if((this.cart_list || null) == null || this.cart_list.length <= 0) {
                    app.globalData.showToast('购物车商品为空');
                    return false;
                }
                var booking_data = [];
                for(var gi in this.cart_list) {
                    var units = this.booking_form[gi] || [];
                    for(var ui in units) {
                        var item = units[ui];
                        if((item.staff_id || 0) == 0 || (item.ymd || 0) == 0 || (item.booking_periods_id || 0) == 0) {
                            app.globalData.showToast('请为每个数量选择服务人员、日期和时段');
                            return false;
                        }
                        var periods = this.get_unit_periods(gi, ui);
                        var matched = null;
                        for(var pi in periods) {
                            if(parseInt(periods[pi]['id']) == parseInt(item.booking_periods_id)) {
                                matched = periods[pi];
                                break;
                            }
                        }
                        if(matched == null || !this.is_period_available(gi, ui, item.staff_id, matched)) {
                            app.globalData.showToast('所选时段已被占用，请重新选择');
                            return false;
                        }
                        booking_data.push({
                            cart_id: item.cart_id,
                            goods_id: item.goods_id,
                            unit_index: item.unit_index,
                            staff_id: item.staff_id,
                            staff_alias: item.staff_alias || '',
                            booking_periods_id: item.booking_periods_id,
                            period_text: item.period_text || '',
                            ymd: item.ymd,
                        });
                    }
                }

                this.setData({ popup_status: false, submit_loading: false });
                if((app.globalData.data.staff_booking_pending || null) != null) {
                    app.globalData.staff_booking_success(booking_data);
                } else {
                    this.$emit('BookingSuccessEvent', booking_data);
                }
            },

            /**
             * 关闭弹窗
             */
            close_event() {
                this.setData({ popup_status: false });
            },
        },
    };
</script>
<style scoped>
    .staff-booking-popup {
        max-height: 85vh;
        display: flex;
        flex-direction: column;
        width: 100%;
        box-sizing: border-box;
        overflow: hidden;
    }
    .staff-booking-title {
        line-height: 44rpx;
        padding: 0 48rpx;
    }
    .staff-booking-close {
        top: 0;
        right: 24rpx;
        height: 44rpx;
        display: flex;
        align-items: center;
        padding: 0 8rpx;
        z-index: 1;
    }
    .booking-scroll-content {
        max-height: 58vh;
        width: 100%;
        box-sizing: border-box;
    }
    .booking-scroll-inner {
        width: 100%;
        box-sizing: border-box;
        overflow: hidden;
        padding-bottom: 10rpx;
    }
    .booking-init-loading {
        min-height: 40vh;
    }
    .date-item {
        min-width: 120rpx;
        height: 88rpx;
        padding: 8rpx 32rpx;
        box-sizing: border-box;
        vertical-align: top;
        display: inline-flex !important;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }
    .date-item-no-label {
        justify-content: center;
    }
    .date-item-with-label {
        justify-content: space-between;
    }
    .date-main-wrap {
        flex: 1;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 0;
    }
    .date-main {
        line-height: 1.4;
    }
    .date-day-label {
        flex-shrink: 0;
        height: 24rpx;
        line-height: 24rpx;
        opacity: 0.75;
    }
    .date-item.bg-main-light .date-day-label {
        opacity: 0.9;
    }
    .date-item.br-grey .date-day-label {
        color: #999;
    }
    .goods-booking-item {
        width: 100%;
        box-sizing: border-box;
        overflow: hidden;
    }
    .goods-booking-item .goods-img {
        width: 120rpx;
        height: 120rpx !important;
        flex-shrink: 0;
    }
    .goods-booking-item .goods-base {
        min-width: 0;
    }
    .goods-booking-item .goods-base-content {
        min-height: 60rpx;
    }
    .unit-booking-block {
        width: 100%;
        box-sizing: border-box;
        overflow: hidden;
    }
    .staff-scroll {
        width: 100%;
        box-sizing: border-box;
        overflow: hidden;
    }
    .staff-scroll-inner {
        display: inline-flex;
        flex-direction: row;
        flex-wrap: nowrap;
        padding-right: 4rpx;
    }
    .staff-card {
        width: 120rpx;
        flex-shrink: 0;
        vertical-align: top;
        padding: 12rpx 8rpx;
        border-radius: 10rpx;
        box-sizing: border-box;
    }
    .staff-avatar {
        width: 80rpx;
        height: 80rpx;
    }
    .staff-avatar-sm {
        width: 72rpx;
        height: 72rpx;
        display: block;
        margin-left: auto;
        margin-right: auto;
    }
    .staff-name {
        max-width: 104rpx;
        margin: 0 auto;
        line-height: 1.4;
    }
    .period-wrap {
        width: 100%;
        box-sizing: border-box;
        overflow: hidden;
    }
    .unit-label {
        line-height: 1.4;
    }
    .unit-date-scroll {
        width: 100%;
        box-sizing: border-box;
        white-space: nowrap;
    }
    .period-tag {
        line-height: 1.6;
        max-width: 100%;
        box-sizing: border-box;
    }
</style>
