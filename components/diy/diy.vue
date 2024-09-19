<template>
    <view class="ht-auto min-ht">
        <componentDiyHeader></componentDiyHeader>
        <view v-if="value.diy_data.length > 0" :style="diy_content_style">
            {{ is_tabs }}
            <componentDiyTabs v-if="is_tabs" :value="tabs_data"></componentDiyTabs>
            <view v-if="is_tabs_type">
                <view v-for="(item, index) in value.diy_data" :key="index">
                    {{ item.key }}
                    <!-- 基础组件 -->
                    <componentDiySearch v-if="item.key == 'search'" :value="item.com_data"></componentDiySearch>
                    <componentCarousel v-else-if="item.key == 'carousel'" :value="item.com_data"></componentCarousel>
                    <componentNavGroup v-else-if="item.key == 'nav-group'" :value="item.com_data"></componentNavGroup>
                    <componentDiyUserInfo v-else-if="item.key == 'user-info'" :value="item.com_data"></componentDiyUserInfo>
                    <componentDiyNotice v-else-if="item.key == 'notice'" :value="item.com_data"></componentDiyNotice>
                    <componentDiyVideo v-else-if="item.key == 'video'" :value="item.com_data"></componentDiyVideo>
                    <componentDiyArticleList v-else-if="item.key == 'article-list'" :value="item.com_data"></componentDiyArticleList>
                    <componentDiyArticleTabs v-else-if="item.key == 'article-tabs'" :value="item.com_data"></componentDiyArticleTabs>
                    <componentGoodsTabs v-else-if="item.key == 'goods-tabs'" :value="item.com_data"></componentGoodsTabs>
                    <componentGoodsList v-else-if="item.key == 'goods-list'" :value="item.com_data"></componentGoodsList>
                    <componentDataMagic v-if="item.key == 'data-magic'" :value="item.com_data"></componentDataMagic>
                    <componentCustom v-if="item.key == 'custom'" :value="item.com_data"></componentCustom>
                    <componentDiyImgMagic v-else-if="item.key == 'img-magic'" :value="item.com_data"></componentDiyImgMagic>
                    <componentDiyHotZone v-else-if="item.key == 'hot-zone'" :value="item.com_data"></componentDiyHotZone>
                    <!-- 插件 -->
                    <componentDiyCoupon v-else-if="item.key == 'coupon'" :value="item.com_data"></componentDiyCoupon>
                    <!-- 工具组件 -->
                    <componentFloatWindow v-else-if="item.key == 'float-window'" :value="item.com_data"></componentFloatWindow>
                    <componentTextTitle v-else-if="item.key == 'text-title'" :value="item.com_data"></componentTextTitle>
                    <componentDiyAuxiliaryLine v-else-if="item.key == 'row-line'" :value="item.com_data"></componentDiyAuxiliaryLine>
                    <componentDiyRichText v-else-if="item.key == 'rich-text'" :value="item.com_data"></componentDiyRichText>
                    <componentAuxiliaryBlank v-else-if="item.key == 'auxiliary-blank'" :value="item.com_data"></componentAuxiliaryBlank>
                </view>
            </view>
            <view v-else>
                <!-- goods九宫格数据 -->
            </view>
        </view>
        <componentDiyFooter :value="value.footer.com_data" @footer-height="footer_height_computer"></componentDiyFooter>
    </view>
</template>

<script>
    import componentDiyHeader from '@/components/diy/header';
    import componentDiyFooter from '@/components/diy/footer';
    import componentDiySearch from '@/components/diy/search';
    import componentCarousel from '@/components/diy/carousel.vue';
    import componentDiyUserInfo from '@/components/diy/user-info';
    import componentDiyVideo from '@/components/diy/video';
    import componentDiyArticleList from '@/components/diy/article-list';
    import componentDiyArticleTabs from '@/components/diy/article-tabs';
    import componentDiyHotZone from '@/components/diy/hot-zone';
    import componentDiyCoupon from '@/components/diy/coupon';
    import componentFloatWindow from '@/components/diy/float-window';
    import componentTextTitle from '@/components/diy/text-title';
    import componentDiyAuxiliaryLine from '@/components/diy/auxiliary-line';
    import componentDiyRichText from '@/components/diy/rich-text.vue';
    import componentAuxiliaryBlank from '@/components/diy/auxiliary-blank.vue';
    import componentNavGroup from '@/components/diy/nav-group.vue';
    import componentGoodsList from '@/components/diy/goods-list.vue';
    import componentGoodsTabs from '@/components/diy/goods-tabs.vue';
    import componentDataMagic from '@/components/diy/data-magic.vue';
    import componentCustom from '@/components/diy/custom.vue'
    export default {
        name: 'diy',
        props: {
            value: {
                type: Object,
                default: () => ({}),
            },
        },
        components: {
            componentDiyHeader,
            componentDiyFooter,
            componentDiySearch,
            componentCarousel,
            componentDiyUserInfo,
            componentDiyVideo,
            componentDiyArticleList,
            componentDiyArticleTabs,
            componentDiyHotZone,
            componentDiyCoupon,
            componentDiyAuxiliaryLine,
            componentDiyRichText,
            componentFloatWindow,
            componentTextTitle,
            componentAuxiliaryBlank,
            componentNavGroup,
            componentGoodsList,
            componentGoodsTabs,
            componentDataMagic,
            componentCustom
        },
        data() {
            return {
                // 底部菜单导航高度计算
                padding_footer_computer: 140,
                // 是否有选项卡
                is_tabs: false,
                // 选项卡数据
                tabs_data: {},
                // 是否是模块数据或者是九宫格商品分类样式数据， 默认模块数据
                is_tabs_type: true,
            };
        },

        computed: {
            diy_content_style() {
                return `padding-bottom:${this.padding_footer_computer}rpx`;
            },
        },
        methods: {
            init() {
                // tabs选项卡数据过滤
                const filter_tabs_list = this.value.tabs_data;
                if (filter_tabs_list.length > 0) {
                    this.setData({
                        tabs_data: filter_tabs_list[0].com_data,
                        is_tabs: true,
                    });
                }
            },
            footer_height_computer(number) {
                this.padding_footer_computer = number * 2;
            },
        },
    };
</script>

<style></style>
