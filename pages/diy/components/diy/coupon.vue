<template>
    <!-- 优惠券 -->
    <view class="coupon-theme-container" :style="style_container">
        <view class="pr" :style="style_img_container">
            <view class="hide-scrollbar">
                <template v-if="theme == '1'">
                    <view class="coupon-theme-1" :style="'gap:' + theme_style.spacing">
                        <view v-for="(item, index) in data_list" :key="index" class="item" :style="'background: ' + theme_style.background">
                            <view class="coupon-theme-1-content tc" :style="'background-image: url(' + theme_bg_img.url_1 + ');background-size: 100% 100%;'">
                                <view class="name text-line-1" :style="'color:' + theme_style.name_color">{{ item.name }}</view>
                                <view class="price" :style="'color:' + theme_style.price_color">
                                    <text v-if="item.type == '0'" class="symbol">{{ currency_symbol }}</text>
                                    <text class="number">{{ item.discount_value }}</text>
                                    <text v-if="item.type == '1'" class="symbol">折</text>
                                </view>
                            </view>
                            <view class="coupon-btn" :class="[0, 3].includes(item.status_type) ? '' : 'btn-already'" :style="'color:' + theme_style.btn_color + ';background:' + theme_style.btn_background" :data-value="home_page_url" :data-type="item.status_type" :data-index="index" :data-id="item.id" @tap="receive_event">{{ item.status_operable_name }}</view>
                        </view>
                    </view>
                </template>
                <template v-else-if="theme == '2'">
                    <view class="coupon-theme-2" :style="'gap:' + theme_style.spacing">
                        <view v-for="(item, index) in data_list" :key="index" class="item" :style="'background-image: url(' + theme_bg_img.url_2 + ');background-size: 100% 100%;'">
                            <view class="tc">
                                <view class="price" :style="'color:' + theme_style.price_color">
                                    <text v-if="item.type == '0'" class="symbol">{{ currency_symbol }}</text>
                                    <text class="number">{{ item.discount_value }}</text>
                                    <text v-if="item.type == '1'" class="symbol">折</text>
                                </view>
                                <view class="name text-line-1" :style="'color:' + theme_style.name_color">{{ item.name }}</view>
                                <view class="desc text-line-1" :style="'color:' + theme_style.desc_color">{{ item.desc }}</view>
                            </view>
                            <view class="coupon-btn" :class="[0, 3].includes(item.status_type) ? '' : 'btn-already'" :style="'color:' + theme_style.btn_color + ';background:' + theme_style.btn_background" :data-value="home_page_url" :data-type="item.status_type" :data-index="index" :data-id="item.id" @tap="receive_event">{{ item.status_operable_name }}</view>
                        </view>
                    </view>
                </template>
                <template v-else-if="theme == '3'">
                    <view class="coupon-theme-3" :style="'gap:' + theme_style.spacing">
                        <view v-for="(item, index) in data_list" :key="index" class="item" :style="'background: ' + theme_style.background">
                            <view class="left" :style="'background: ' + theme_style.background_inside">
                                <view class="price-before" :style="'border-right: 2rpx dashed ' + theme_style.border_style">
                                    <view class="price" :style="'color:' + theme_style.price_color">
                                        <text v-if="item.type == '0'" class="symbol">{{ currency_symbol }}</text>
                                        <text class="number">{{ item.discount_value }}</text>
                                        <text v-if="item.type == '1'" class="symbol self-e">折</text>
                                    </view>
                                </view>
                                <view class="text padding-left-xs padding-right-sm">
                                    <view class="name text-line-1" :style="'color:' + theme_style.name_color">{{ item.name }}</view>
                                    <view class="desc text-line-1" :style="'color:' + theme_style.desc_color">{{ item.use_limit_type_name }}</view>
                                    <view v-if="item.limit_send_count && item.limit_send_count > 0" class="limit text-line-1" :style="'color:' + theme_style.limit_send_count">(限领{{ item.limit_send_count }}张)</view>
                                </view>
                            </view>
                            <view class="right" :class="item.status_operable_name.length > 3 ? ' long-name' : ' short-name'">
                                <view class="right-before" :style="'background: ' + theme_style.background"></view>
                                <view class="coupon-btn" :class="[0, 3].includes(item.status_type) ? '' : 'btn-already'" :style="'color:' + theme_style.btn_color" :data-value="home_page_url" :data-type="item.status_type" :data-index="index" :data-id="item.id" @tap="receive_event">
                                    <text class="text">{{ item.status_operable_name }}</text>
                                    <iconfont name="icon-arrow-right-round" class="icon" propContainerDisplay="flex"></iconfont>
                                </view>
                            </view>
                        </view>
                    </view>
                </template>
                <template v-else-if="theme == '4'">
                    <view class="coupon-theme-4" :style="'background: ' + theme_style.background">
                        <view class="hide-scrollbar">
                            <view class="left" :style="'gap: ' + theme_style.spacing">
                                <view v-for="(item, index) in data_list" :key="index" class="item" :style="'background: ' + theme_style.background_inside">
                                    <view class="type" :style="'background: ' + theme_style.type_background + ';color:' + theme_style.type_color">
                                        <view class="type-before" :style="'background: ' + theme_style.type_background"></view>
                                        <text>{{ item.type_name }}</text>
                                        <view class="type-after" :style="'background: ' + theme_style.type_background"></view>
                                    </view>
                                    <view class="price" :style="'color:' + theme_style.price_color">
                                        <text v-if="item.type == '0'" class="symbol">{{ currency_symbol }}</text>
                                        <text class="number">{{ item.discount_value }}</text>
                                        <text v-if="item.type == '1'" class="symbol">折</text>
                                    </view>
                                    <view class="name text-line-1" :style="'color:' + theme_style.name_color">{{ item.name }}</view>
                                </view>
                            </view>
                        </view>
                        <view class="right">
                            <view class="right-before" :style="'background: ' + theme_style.background"></view>
                            <view class="pr z-i flex-col jc-c align-c">
                                <view class="title text-line-1" :style="'color:' + theme_style.content_title_color">{{ content_title }}</view>
                                <view class="desc text-line-1" :style="'color:' + theme_style.content_desc_color">{{ content_desc }}</view>
                                <view class="coupon-btn" :class="data_list.filter((item) => item.status_type == 0).length > 0 ? '' : 'btn-already'" :style="'color:' + theme_style.btn_color + ';background:' + theme_style.btn_background" @tap="receive_all_event">
                                    {{ data_list.filter((item) => item.status_type == 0).length > 0 ? '立即领取' : '不可领取' }}
                                </view>
                            </view>
                        </view>
                    </view>
                </template>
                <template v-else-if="theme == '5'">
                    <view class="coupon-theme-5" :style="'gap:' + theme_style.spacing">
                        <view v-for="(item, index) in data_list" :key="index" class="item">
                            <view class="left" :style="'background-image: url(' + theme_bg_img.url_3 + ');background-size: 100% 100%;'">
                                <view class="price" :style="'color:' + theme_style.price_color">
                                    <text v-if="item.type == '0'" class="symbol">{{ currency_symbol }}</text>
                                    <text class="number">{{ item.discount_value }}</text>
                                    <text v-if="item.type == '1'" class="symbol">折</text>
                                </view>
                                <view class="name text-line-1" :style="'color:' + theme_style.name_color">{{ item.name }}</view>
                            </view>
                            <view class="right" :style="'background: ' + theme_style.background">
                                <view class="coupon-btn" :class="[0, 3].includes(item.status_type) ? '' : 'btn-already'" :style="'color:' + theme_style.btn_color" :data-value="home_page_url" :data-type="item.status_type" :data-index="index" :data-id="item.id" @tap="receive_event">{{ item.status_operable_name }}</view>
                            </view>
                        </view>
                    </view>
                </template>
                <template v-else-if="theme == '6'">
                    <view class="coupon-theme-6" :style="'gap:' + theme_style.spacing">
                        <view v-for="(item, index) in data_list" :key="index" class="item" :style="'background: ' + theme_style.background">
                            <view class="pr oh">
                                <view class="top-before" :style="'background: ' + theme_style.background"></view>
                                <view class="top" :style="'background: ' + theme_style.background_inside">
                                    <view class="price" :style="'color:' + theme_style.price_color">
                                        <text v-if="item.type == '0'" class="symbol">{{ currency_symbol }}</text>
                                        <text class="number">{{ item.discount_value }}</text>
                                        <text v-if="item.type == '1'" class="symbol">折</text>
                                    </view>
                                    <view class="name text-line-1" :style="'color:' + theme_style.name_color">{{ item.name }}</view>
                                </view>
                                <view class="top-after" :style="'background: ' + theme_style.background"></view>
                            </view>
                            <view class="bottom">
                                <view class="coupon-btn" :class="[0, 3].includes(item.status_type) ? '' : 'btn-already'" :style="'color:' + theme_style.btn_color" :data-value="home_page_url" :data-type="item.status_type" :data-index="index" :data-id="item.id" @tap="receive_event">{{ item.status_operable_name }}</view>
                            </view>
                        </view>
                    </view>
                </template>
                <template v-else-if="theme == '7'">
                    <view class="coupon-theme-7" :style="'gap:' + theme_style.spacing">
                        <view v-for="(item, index) in data_list" :key="index" class="item" :style="'background: ' + theme_style.background">
                            <view class="item-before" :style="'background: ' + theme_style.theme_7_background"></view>
                            <view class="flex-row flex-1">
                                <view class="left">
                                    <view class="price" :style="'color:' + theme_style.price_color">
                                        <text v-if="item.type == '0'" class="symbol">{{ currency_symbol }}</text>
                                        <text class="number">{{ item.discount_value }}</text>
                                        <text v-if="item.type == '1'" class="symbol">折</text>
                                    </view>
                                    <view class="name text-line-1" :style="'color:' + theme_style.name_color">{{ item.name }}</view>
                                </view>
                                <view class="right">
                                    <view class="right-before" :style="'border: 2rpx dashed ' + theme_style.theme_7_background"></view>
                                    <view class="coupon-btn" :class="[0, 3].includes(item.status_type) ? '' : 'btn-already'" :style="'color:' + theme_style.btn_color" :data-value="home_page_url" :data-type="item.status_type" :data-index="index" :data-id="item.id" @tap="receive_event">{{ item.status_operable_name }}</view>
                                </view>
                            </view>
                            <view class="item-after" :style="'background: ' + theme_style.theme_7_background"></view>
                        </view>
                    </view>
                </template>
            </view>
        </view>
    </view>
</template>

<script>
    const app = getApp();
    var tabbar_pages = app.globalData.app_tabbar_pages();
    import { common_styles_computer, common_img_computer, gradient_computer, isEmpty } from '@/common/js/common/common.js';
    export default {
        props: {
            propValue: {
                type: Object,
                default: () => ({}),
            },
            propKey: {
                type: [String,Number],
                default: '',
            },
            // 组件渲染的下标
            propIndex: {
                type: Number,
                default: 1000000,
            },
        },
        data() {
            return {
                currency_symbol: app.globalData.currency_symbol(),
                style_container: '',
                style_img_container: '',
                data_list: [],
                // 主题
                theme: '0',
                // 主题样式
                theme_style: {},
                // 主题4 标题
                content_title: '',
                // 主题4 描述
                content_desc: '',
                theme_bg_img: {
                    url_1: '',
                    url_2: '',
                    url_3: '',
                },
                // 首页地址
                home_page_url: tabbar_pages[0],
            };
        },
        watch: {
            propKey(val) {
                // 初始化
                this.init();
            },
        },
        created() {
            this.init();
        },
        methods: {
            // 初始化数据
            init() {
                const new_content = this.propValue.content || {};
                const new_style = this.propValue.style || {};
                const temp_theme = new_content.theme;
                // 主题
                const new_background = gradient_computer(
                    {
                        color_list: new_style.background,
                        direction: new_style.direction,
                    },
                    false
                );
                const new_background_inside = gradient_computer(
                    {
                        color_list: new_style.background_inside,
                        direction: new_style.direction_inside,
                    },
                    false
                );
                const new_btn_background = gradient_computer(
                    {
                        color_list: new_style.btn_background,
                        direction: new_style.btn_direction,
                    },
                    false
                );
                // 判断是自动还是手动, 取对应的数据
                let new_list = [];
                // 指定商品并且指定商品数组不为空
                if (!isEmpty(new_content.data_list) && new_content.data_type == '0') {
                    new_list = new_content.data_list.map((item) => ({
                        ...item.data,
                        name: !isEmpty(item.new_title) ? item.new_title : item.data.name,
                        new_cover: item.new_cover,
                    }));
                } else if (!isEmpty(new_content.data_auto_list) && new_content.data_type == '1') {
                    // 筛选商品并且筛选商品数组不为空
                    new_list = new_content.data_auto_list;
                }
                this.setData({
                    content_title: new_content.title || '',
                    content_desc: new_content.desc || '',
                    // 判断是自动还是手动
                    data_list: new_list,
                    theme: temp_theme,
                    theme_style: {
                        price_color: new_style.price_color,
                        name_color: new_style.name_color,
                        // 判断是否向对象添加desc_color属性
                        ...(!['1', '5', '6', '7'].includes(temp_theme) && {
                            desc_color: new_style.desc_color,
                        }),
                        ...(!['1', '2', '4', '5', '6', '7'].includes(temp_theme) && {
                            limit_send_count: new_style.limit_send_count,
                        }),
                        ...(!['5', '6', '7'].includes(temp_theme) && {
                            btn_background: new_btn_background,
                        }),
                        btn_color: new_style.btn_color,
                        ...(!['2'].includes(temp_theme) && {
                            background: new_background,
                        }),
                        ...(!['1', '2', '5', '7'].includes(temp_theme) && {
                            background_inside: new_background_inside,
                        }),
                        spacing: new_style.spacing + 'px',
                        ...(!['1', '2', '3', '5', '6', '7'].includes(temp_theme) && {
                            type_background: new_style.type_background,
                        }),
                        ...(!['1', '2', '3', '5', '6', '7'].includes(temp_theme) && {
                            type_color: new_style.type_color,
                        }),
                        ...(!['1', '2', '3', '5', '6', '7'].includes(temp_theme) && {
                            content_title_color: new_style.content_title_color,
                        }),
                        ...(!['1', '2', '3', '5', '6', '7'].includes(temp_theme) && {
                            content_desc_color: new_style.content_desc_color,
                        }),
                        ...(['3'].includes(temp_theme) && {
                            border_style: new_style.background[0].color,
                        }),
                        ...(['7'].includes(temp_theme) && {
                            theme_7_background: new_style.common_style.color_list[0].color,
                        }),
                    },
                    theme_bg_img: {
                        url_1: new_content.theme_1_static_img[0].url,
                        url_2: new_content.theme_2_static_img[0].url,
                        url_3: new_content.theme_5_static_img[0].url,
                    },
                    style_container: common_styles_computer(new_style.common_style),
                    style_img_container: common_img_computer(new_style.common_style, this.propIndex),
                });
            },
            // 领取优惠券
            receive_event(e) {
                const coupon_status_type = e.currentTarget.dataset.type;
                const coupon_index = e.currentTarget.dataset.index;
                const coupon_id = e.currentTarget.dataset.id;
                switch (coupon_status_type) {
                    case 0:
                        // 登录校验
                        var user = app.globalData.get_user_info(this, 'coupon_receive_event');
                        if (user != false) {
                            var temp_list = this.data_list;
                            if (temp_list[coupon_index]['status_type'] == 0) {
                                uni.showLoading({
                                    title: this.$t('common.processing_in_text'),
                                });
                                this.coupon_api(coupon_id, coupon_index);
                            }
                        }
                        break;
                    case 3:
                        app.globalData.url_event(e);
                        break;
                }
            },
            // 全部领取
            receive_all_event() {
                // 判断是否可领取的数量
                const temp_list = this.data_list.filter(item => item.status_type == 0);
                // 可以领取的数量大于0的时候调接口
                if (temp_list.length > 0) {
                    const filter_data_list = temp_list.map((item) => {
                        if (item.status_type == 0) {
                            return item.id;
                        }
                    });
                    this.coupon_api(filter_data_list.join(','));
                }
            },
            // 优惠劵领取事件
            coupon_api(val, index) {
                uni.request({
                    url: app.globalData.get_request_url('receive', 'coupon', 'coupon'),
                    method: 'POST',
                    data: {
                        coupon_id: val,
                    },
                    dataType: 'json',
                    success: (res) => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            let temp_list = this.data_list;
                            app.globalData.showToast(res.data.msg, 'success');
                            if (index) {
                                temp_list = res.data.data.coupon || [];
                            } else {
                                temp_list[index] = res.data.data.coupon || {};
                            }
                            this.setData({
                                data_list: temp_list,
                            });
                        } else {
                            if (app.globalData.is_login_check(res.data, this, 'coupon_receive_event')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },
        },
    };
</script>
<style lang="scss" scoped>
    .coupon-theme-1 {
        display: flex;
        flex-direction: row;

        .item {
            flex-basis: auto;
            flex-shrink: 0;
            width: 168rpx;
            height: 168rpx;
            border-radius: 20rpx;
            margin-top: 20rpx;

            .name {
                padding: 10rpx 10rpx 0 10rpx;
                margin-bottom: 10rpx;
                font-size: 20rpx;
                box-sizing: border-box;
            }

            .price {
                padding: 10rpx 0 16rpx 0;
                box-sizing: border-box;

                .symbol {
                    font-size: 24rpx;
                    position: relative;
                    bottom: 6rpx;
                }

                .number {
                    font-size: 52rpx;
                    line-height: 48rpx;
                    font-weight: bold;
                    padding: 0 8rpx;
                    box-sizing: border-box;
                }
            }

            .coupon-theme-1-content {
                width: calc(100% - 20rpx);
                margin: 0 10rpx;
                background-size: 100% 100%;
                position: relative;
                top: -20rpx;
            }

            .coupon-btn {
                margin: 0 auto;
                width: 142rpx;
                height: 35.112rpx;
                line-height: 35.112rpx;
                text-align: center;
                font-size: 18rpx;
                border-radius: 46rpx;
                position: relative;
                top: -10rpx;
            }
        }
    }

    .coupon-theme-2 {
        display: flex;
        flex-direction: row;

        .item {
            flex-basis: auto;
            flex-shrink: 0;
            background-size: 100% 100%;
            width: 170rpx;
            height: 200rpx;
            padding: 10rpx;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .price {
                padding: 6rpx 0;
                box-sizing: border-box;

                .symbol {
                    font-size: 16rpx;
                }

                .number {
                    font-size: 52rpx;
                    font-weight: bold;
                    padding: 0 8rpx;
                    box-sizing: border-box;
                }
            }

            .name {
                font-size: 16rpx;
                font-weight: bold;
                margin-bottom: 8rpx;
            }

            .desc {
                font-size: 16rpx;
            }

            .coupon-btn {
                margin: 0 auto;
                width: 110rpx;
                height: 32rpx;
                line-height: 32rpx;
                text-align: center;
                font-size: 18rpx;
                border-radius: 46rpx;
                margin-top: 10rpx;
                margin-bottom: 4rpx;
            }
        }
    }

    .coupon-theme-3 {
        display: flex;

        .item {
            overflow: hidden;
            height: 176rpx;
            border-radius: 32rpx;
            flex-basis: auto;
            flex-shrink: 0;
            width: 100%;
            padding: 16rpx;
            box-sizing: border-box;
            display: flex;

            .left {
                flex: 1;
                width: 0;
                border-radius: 16rpx;
                padding: 12rpx 24rpx 6rpx 24rpx;
                box-sizing: border-box;
                display: flex;
                align-items: center;

                .price-before {
                    height: calc(100% + 120rpx);
                    display: flex;
                    align-items: center;
                }

                .price {
                    text-align: center;
                    width: 200rpx;
                    position: relative;
                    display: flex;
                    align-items: flex-start;

                    .symbol {
                        font-size: 36rpx;
                        font-weight: 600;
                    }

                    .number {
                        font-size: 64rpx;
                        font-weight: 600;
                        padding: 0 8rpx;
                        box-sizing: border-box;
                        line-height: 60rpx;
                    }
                }

                .text {
                    flex: 1;
                    width: 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    box-sizing: border-box;

                    .name {
                        font-size: 36rpx;
                        font-weight: bold;
                        line-height: 50rpx;
                    }

                    .desc {
                        font-size: 28rpx;
                        font-weight: bold;
                        line-height: 40rpx;
                    }

                    .limit {
                        font-size: 24rpx;
                    }
                }
            }

            .right {
                width: 172rpx;
                position: relative;
                padding: 0 36rpx;
                box-sizing: border-box;
                text-align: center;
                display: flex;
                align-items: center;

                &.short-name {
                    height: 132rpx;
                    justify-content: center;
                    padding: 0 10rpx;

                    .coupon-btn {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 6rpx;
                        width: 100%;
                    }
                }

                .right-before {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 200%;
                    height: 200%;
                    left: -32rpx;
                    border-radius: 100%;
                }

                .coupon-btn {
                    position: relative;
                    font-size: 36rpx;
                    text-align: center;

                    .text {
                        height: 100rpx;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    .icon {
                        font-size: 40rpx;
                        line-height: 32rpx;
                    }
                }
            }
        }
    }

    .coupon-theme-4 {
        overflow: hidden;
        border-radius: 32rpx;
        padding: 16rpx;
        box-sizing: border-box;
        display: flex;

        .left {
            width: 428rpx;
            display: flex;
            flex-direction: row;

            .item {
                overflow: hidden;
                flex-basis: auto;
                flex-shrink: 0;
                width: 144rpx;
                height: 144rpx;
                border-radius: 20rpx;
                position: relative;
                display: flex;
                flex-direction: column;
                justify-content: flex-end;
                align-items: center;
                padding: 8rpx;
                box-sizing: border-box;

                .type {
                    position: absolute;
                    top: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    font-size: 20rpx;
                    line-height: 28rpx;

                    .type-before {
                        position: absolute;
                        width: 30rpx;
                        height: 60rpx;
                        left: -16rpx;
                        border-radius: 100%;
                        top: -32rpx;
                        z-index: -1;
                    }

                    .type-after {
                        position: absolute;
                        width: 30rpx;
                        height: 60rpx;
                        right: -16rpx;
                        border-radius: 100%;
                        top: -32rpx;
                        z-index: -1;
                    }
                }

                .price {
                    text-align: center;
                    position: relative;
                    display: flex;
                    align-items: flex-end;

                    .symbol {
                        font-size: 24rpx;
                    }

                    .number {
                        font-size: 48rpx;
                        line-height: 48rpx;
                        font-weight: 600;
                        padding-left: 8rpx;
                        box-sizing: border-box;
                    }
                }

                .name {
                    font-size: 22rpx;
                    line-height: 32rpx;
                }
            }
        }

        .right {
            flex: 1;
            width: 0;
            position: relative;

            .right-before {
                width: 360rpx;
                height: 360rpx;
                position: absolute;
                left: -14rpx;
                top: 50%;
                transform: translateY(-50%);
                border-radius: 100%;
            }

            .title {
                font-size: 32rpx;
                font-weight: bold;
                line-height: 44rpx;
            }

            .desc {
                margin-top: 6rpx;
                font-size: 24rpx;
                line-height: 34rpx;
            }

            .coupon-btn {
                width: 144rpx;
                height: 44rpx;
                font-size: 24rpx;
                line-height: 44rpx;
                text-align: center;
                border-radius: 24rpx;
                margin-top: 12rpx;
            }
        }
    }

    .coupon-theme-5 {
        display: flex;
        flex-direction: row;

        .item {
            flex-basis: auto;
            flex-shrink: 0;
            border-radius: 12rpx;
            width: 252rpx;
            height: 128rpx;
            position: relative;

            .left {
                position: absolute;
                left: 0;
                width: 200rpx;
                height: 100%;
                padding: 12rpx;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 1;

                .price {
                    text-align: center;
                    position: relative;
                    display: flex;
                    align-items: flex-end;
                    margin-bottom: 10rpx;

                    .symbol {
                        font-size: 24rpx;
                        font-weight: bold;
                    }

                    .number {
                        font-size: 48rpx;
                        font-weight: bold;
                        line-height: 40rpx;
                        padding-left: 8rpx;
                        box-sizing: border-box;
                    }
                }

                .name {
                    font-size: 24rpx;
                }
            }

            .right {
                width: 92rpx;
                padding-left: 40rpx;
                box-sizing: border-box;
                border-radius: 12rpx;
                position: absolute;
                top: 0;
                bottom: 0;
                right: 0;
                height: 100%;
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;

                .coupon-btn {
                    position: relative;
                    font-size: 24rpx;
                    font-weight: bold;
                    text-align: center;
                    letter-spacing: 4rpx;
                }
            }
        }
    }

    .coupon-theme-6 {
        display: flex;
        .item {
            flex-basis: auto;
            flex-shrink: 0;
            border-radius: 24rpx;
            padding: 12rpx;
            width: 268rpx;
            height: 188rpx;
            position: relative;
            box-sizing: border-box;

            .top-before {
                position: absolute;
                left: -14rpx;
                top: 50%;
                transform: translateY(-50%);
                width: 28rpx;
                height: 28rpx;
                border-radius: 50%;
                z-index: 2;
            }

            .top-after {
                position: absolute;
                right: -14rpx;
                top: 50%;
                transform: translateY(-50%);
                width: 28rpx;
                height: 28rpx;
                border-radius: 50%;
                z-index: 2;
            }

            .top {
                width: 100%;
                padding: 8rpx;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 1;
                border-radius: 12rpx;
                position: relative;
                overflow: hidden;
                box-sizing: border-box;

                .price {
                    text-align: center;
                    position: relative;
                    display: flex;
                    align-items: flex-end;
                    margin-bottom: 2rpx;

                    .symbol {
                        font-size: 40rpx;
                        font-weight: bold;
                    }

                    .number {
                        font-size: 64rpx;
                        font-weight: bold;
                        line-height: 64rpx;
                        padding-left: 8rpx;
                        box-sizing: border-box;
                    }
                }

                .name {
                    font-size: 24rpx;
                }
            }

            .bottom {
                margin-top: 8rpx;
                text-align: center;

                .coupon-btn {
                    position: relative;
                    font-size: 28rpx;
                    line-height: 44rpx;
                    font-weight: bold;
                    text-align: center;
                }
            }
        }
    }

    .coupon-theme-7 {
        display: flex;

        .item {
            flex-basis: auto;
            flex-shrink: 0;
            border-radius: 8rpx;
            width: 236rpx;
            height: 128rpx;
            position: relative;
            overflow: hidden;
            display: flex;

            .item-before {
                position: absolute;
                left: 160rpx;
                top: -12rpx;
                width: 24rpx;
                height: 24rpx;
                border-radius: 50%;
            }

            .item-after {
                position: absolute;
                left: 160rpx;
                bottom: -12rpx;
                width: 24rpx;
                height: 24rpx;
                border-radius: 50%;
            }

            .left {
                width: 172rpx;
                padding: 8rpx;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                position: relative;
                box-sizing: border-box;

                .price {
                    text-align: center;
                    position: relative;
                    display: flex;
                    align-items: flex-end;
                    margin-bottom: 10rpx;

                    .symbol {
                        font-size: 24rpx;
                        font-weight: bold;
                    }

                    .number {
                        font-size: 48rpx;
                        font-weight: bold;
                        line-height: 40rpx;
                        padding-left: 8rpx;
                        box-sizing: border-box;
                    }
                }

                .name {
                    font-size: 24rpx;
                }
            }

            .right {
                flex: 1;
                width: 0;
                padding-left: 14rpx;
                position: relative;
                box-sizing: border-box;

                .right-before {
                    position: absolute;
                    left: -1rpx;
                    top: 0;
                    bottom: 0;
                    width: 0;
                    height: 100%;
                    opacity: 0.61;
                }

                .coupon-btn {
                    box-sizing: border-box;
                    padding: 8rpx;
                    width: 100%;
                    font-size: 20rpx;
                    font-weight: bold;
                    text-align: center;
                    letter-spacing: 4rpx;
                    height: 100%;
                    display: flex;
                    align-items: center;
                }
            }
        }
    }

    // 已领取
    .btn-already {
        color: #e3ca90 !important;
    }

    .hide-scrollbar {
        overflow: auto;

        &::-webkit-scrollbar {
            display: none;
            width: 0;
            height: 0;
            color: transparent;
        }
    }
</style>
