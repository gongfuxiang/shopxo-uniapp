<template>
    <!-- 文章列表 -->
    <view class="oh" :style="style_container">
        <view class="oh" :style="style_img_container">
            <view class="pr oh" :style="style">
                <view v-if="!['4'].includes(article_theme)" class="flex-wrap" :class="article_theme_class" :style="article_theme !== '3' ? article_spacing : ''">
                    <view v-for="(item, index) in data_list" :key="index" class="item bg-white oh" :class="article_theme == '0' ? 'flex-row' : 'flex-col'" :style="article_style" :data-value="item.data.url" @tap="url_event">
                        <template v-if="article_theme !== '3'">
                            <template v-if="item.new_cover.length > 0">
                                <image :src="item.new_cover[0].url" class="img" :style="img_radius" mode="aspectFill" />
                            </template>
                            <template v-else>
                                <image :src="item.data.cover" class="img" :style="img_radius" mode="aspectFill" />
                            </template>
                        </template>
                        <view class="jc-sb flex-1" :class="article_theme == '3' ? 'flex-row align-c' : 'flex-col'" :style="article_theme !== '0' ? content_padding : ''">
                            <div class="flex-col" :class="article_theme == '3' ? 'flex-1 flex-width' : ''" :style="'gap:' + name_desc_space + 'px;'">
                                <div class="title" :class="article_theme == '3' ? 'text-line-1' : 'text-line-2'" :style="article_name">{{ item.new_title ? item.new_title : item.data.title }}</div>
                                <div v-if="field_show.includes('2')" class="desc text-line-1" :style="article_desc">{{ item.data.describe || '' }}</div>
                            </div>
                            <view class="flex-row jc-sb gap-8" :class="article_theme == '3' ? 'margin-left' : 'align-e margin-top'">
                                <view :style="article_date">{{ field_show.includes('0') ? item.data.add_time : '' }}</view>
                                <view v-show="field_show.includes('1')" class="flex-row align-c gap-3" :style="article_page_view">
                                    <iconfont name="icon-eye" propContainerDisplay="flex"></iconfont>
                                    <view>
                                        {{ item.data.access_count ? item.data.access_count : '' }}
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
                <view v-else class="oh" :class="article_theme_class">
                    <swiper class="swiper" circular :autoplay="is_roll ? true : false" :interval="interval_time" :style="'height:' + carousel_height_computer">
                        <swiper-item v-for="(item1, index1) in article_carousel_list" :key="index1" class="flex-row" :style="article_spacing">
                            <view v-for="(item, index) in item1.carousel_list" :key="index" class="item bg-white oh flex-col" :style="article_style" :data-value="item.data.url" @tap="url_event">
                                <template v-if="item.new_cover.length > 0">
                                    <image :src="item.new_cover[0].url" class="img" :style="img_radius + article_item_height" mode="aspectFill" />
                                </template>
                                <template v-else>
                                    <image :src="item.data.cover" class="img" :style="img_radius + article_item_height" mode="aspectFill" />
                                </template>
                                <view class="jc-sb flex-1 flex-col" :style="article_theme !== '0' ? content_padding : ''">
                                    <div class="flex-col" :style="'gap:' + name_desc_space + 'px;'">
                                        <div class="title text-line-2" :style="article_name + article_name_height_computer">{{ item.new_title ? item.new_title : item.data.title }}</div>
                                        <div v-if="field_show.includes('2')" class="desc text-line-1" :style="article_desc">{{ item.data.describe || '' }}</div>
                                    </div>
                                    <view class="flex-row jc-sb gap-8 align-e margin-top">
                                        <view :style="article_date">{{ field_show.includes('0') ? item.data.add_time : '' }}</view>
                                        <view v-show="field_show.includes('1')" class="flex-row align-c gap-3" :style="article_page_view">
                                            <iconfont name="icon-eye" propContainerDisplay="flex"></iconfont>
                                            <view>
                                                {{ item.data.access_count ? item.data.access_count : '' }}
                                            </view>
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </swiper-item>
                    </swiper>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    const app = getApp();
    import { common_styles_computer, common_img_computer, padding_computer, radius_computer, get_math } from '@/common/js/common/common.js';
    export default {
        props: {
            propValue: {
                type: Object,
                default: () => {},
            },
            // 是否使用公共样式
            propIsCommonStyle: {
                type: Boolean,
                default: true,
            },
            // 关键key
            propKey: {
                type: [String, Number],
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
                style_container: '',
                style_img_container: '',
                style: '',
                // 数据
                data_list: [],
                // 风格
                article_theme: '0',

                // 是否显示
                field_show: ['0', '1'],
                // 文章
                article_name: '',
                // 描述
                article_desc: '',
                // 日期
                article_date: '',
                // 浏览量
                article_page_view: '',
                // 内容圆角
                content_radius: '',
                // 图片圆角
                img_radius: '',
                // 内间距
                content_padding: '',
                // 内容间距
                content_spacing: '',
                // 文章间距
                article_spacing: '',
                article_item_height: '',

                article_style: '',
                // 轮播图定时轮播
                interval_time: 2000,
                // 轮播图是否滚动
                is_roll: 1,

                article_theme_class: '',
                // 轮播高度
                carousel_height_computer: '',
                // 文章内容高度
                article_name_height_computer: '',
                // 文章轮播数据
                article_carousel_list: [],
                // 文章描述间距
                name_desc_space: 0,
            };
        },
        watch: {
            propKey(val) {
                // 初始化
                this.init();
            },
            propValue(new_value, old_value) {
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
                this.setData({
                    // 判断是自动还是手动
                    data_list:
                        new_content.data_type == '0'
                            ? new_content.data_list
                            : new_content.data_auto_list && new_content.data_auto_list.length > 0
                            ? new_content.data_auto_list.map((item) => ({
                                  id: get_math(),
                                  new_title: '',
                                  new_cover: [],
                                  data: item,
                              }))
                            : [],
                    article_theme_class: this.article_theme_class_computer(new_content.theme),
                    article_theme: new_content.theme,
                    field_show: new_content.field_show,
                    // 样式
                    article_name: 'font-size:' + new_style.name_size + 'px;' + 'font-weight:' + new_style.name_weight + ';' + 'color:' + new_style.name_color + ';',
                    article_desc: 'font-size:' + new_style.desc_size + 'px;line-height:' + new_style.desc_size + 'px;height:' + new_style.desc_size + 'px;color:' + new_style.desc_color + ';',
                    article_date: 'font-size:' + new_style.time_size + 'px;' + 'font-weight:' + new_style.time_weight + ';' + 'color:' + new_style.time_color + ';',
                    article_page_view: 'font-size:' + new_style.page_view_size + 'px;' + 'font-weight:' + new_style.page_view_weight + ';' + 'color:' + new_style.page_view_color + ';',
                    content_radius: radius_computer(new_style.content_radius),
                    img_radius: radius_computer(new_style.img_radius),
                    // 内间距
                    content_padding: padding_computer(new_style.padding),
                    // 内容间距
                    content_spacing: `gap: ${new_style.content_spacing}px;`,
                    // 文章间距
                    article_spacing: `gap: ${new_style.article_spacing}px;`,
                    // 描述间距
                    name_desc_space: parseInt(new_style.name_desc_space),
                });
                // 文章样式
                if (this.article_theme == '0') {
                    this.setData({
                        article_style: this.content_spacing + this.content_padding + this.content_radius,
                    });
                } else if (this.article_theme == '1') {
                    this.setData({
                        article_style: `width: calc(50% - ${new_style.article_spacing / 2}px);` + this.content_radius,
                    });
                } else if (this.article_theme == '2') {
                    this.setData({
                        article_style: this.content_radius,
                    });
                } else if (this.article_theme == '3') {
                    this.setData({
                        style: `padding: 0 ${new_style.content_spacing}px;background:#fff;` + this.content_radius,
                    });
                } else if (this.article_theme == '4') {
                    // 更新轮播图的key，确保更换时能重新更新轮播图
                    const temp_carousel_col = new_content.carousel_col || '1';
                    // 计算间隔的空间。(gap * gap数量) / 模块数量
                    let gap = temp_carousel_col !== '0' ? (new_style.article_spacing * temp_carousel_col) / (Number(temp_carousel_col) + 1) : '0';
                    const multicolumn_columns_width = `width:calc(${100 / (Number(temp_carousel_col) + 1)}% - ${gap * 2}rpx);min-width:calc(${100 / (Number(temp_carousel_col) + 1)}% - ${gap * 2}rpx)`;
                    // 轮播宽度
                    this.setData({
                        // 滚动时间
                        interval_time: (new_style.interval_time || 2) * 1000,
                        // 是否滚动修改
                        is_roll: new_style.is_roll,
                        article_item_height: `height: ${new_style.article_height * 2}rpx`,
                        article_style: this.article_style + this.content_radius + multicolumn_columns_width,
                        // 轮播高度
                        carousel_height_computer: (new_style.name_size * 2 + new_style.article_height) * 2 + 'rpx',
                        // 文章内容高度
                        article_name_height_computer: `height:${new_style.name_size * 2.4 * 2}rpx;line-height:${new_style.name_size * 1.2 * 2}rpx;`,
                    });
                    // 文章轮播数据
                    const cloneList = JSON.parse(JSON.stringify(this.data_list));
                    // 如果是分页滑动情况下，根据选择的行数和每行显示的个数来区分具体是显示多少个
                    if (cloneList.length > 0) {
                        // 每页显示的数量
                        const num = Number(temp_carousel_col) + 1;
                        // 存储数据显示
                        let nav_list = [];
                        // 拆分的数量
                        const split_num = Math.ceil(cloneList.length / num);
                        for (let i = 0; i < split_num; i++) {
                            nav_list.push({ carousel_list: cloneList.slice(i * num, (i + 1) * num) });
                        }
                        this.setData({
                            article_carousel_list: nav_list,
                        });
                    } else {
                        // 否则的话，就返回全部的信息
                        this.setData({
                            article_carousel_list: [{ carousel_list: cloneList }],
                        });
                    }
                }
                if (this.propIsCommonStyle) {
                    this.setData({
                        style_container: common_styles_computer(new_style.common_style),
                        style_img_container: common_img_computer(new_style.common_style, this.propIndex),
                    });
                }
            },
            // 文章主题样式
            article_theme_class_computer(theme) {
                switch (theme) {
                    case '0':
                        return 'style1 flex-col';
                    case '1':
                        return 'style2 flex-row flex-wrap';
                    case '2':
                        return 'style3 flex-col';
                    case '3':
                        return 'style4 flex-col';
                    default:
                        return 'style5';
                }
            },
            // 跳转链接
            url_event(e) {
                app.globalData.url_event(e);
            },
        },
    };
</script>
<style lang="scss" scoped>
    .style1 {
        .item {
            max-width: 100%;
            .img {
                height: 166rpx !important;
                width: 220rpx;
            }
        }
    }
    .style2 {
        .item {
            width: calc(50% - 10rpx);
            .img {
                width: 100%;
                height: 360rpx !important;
            }
        }
    }
    .style3 {
        .item {
            width: 100%;
            .img {
                width: 100%;
                height: 360rpx;
            }
        }
    }
    .style4 {
        .item {
            width: 100%;
            &:not(:last-child) {
                border-bottom: 2rpx solid #eee;
            }
        }
    }
    .style5 {
        .item {
            width: 100%;
            .img {
                width: 100%;
            }
        }
    }
</style>
