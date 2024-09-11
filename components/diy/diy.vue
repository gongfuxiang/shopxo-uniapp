<template>
    <view class="ht-auto min-ht">
        <componentDiyHeader></componentDiyHeader>
        <view v-if="value.diy_data.length > 0" :style="diy_content_style">
            <view v-for="(item, index) in value.diy_data" :key="index">
                <!-- 基础组件 -->
                <componentDiySearch v-if="item.key == 'search'" :value="item.com_data"></componentDiySearch>
                <componentCarousel v-if="item.key == 'carousel'" :value="item.com_data"></componentCarousel>
                <componentDiyUserInfo v-if="item.key == 'user-info'" :value="item.com_data"></componentDiyUserInfo>
                <componentDiyVideo v-else-if="item.key == 'video'" :value="item.com_data"></componentDiyVideo>
                <componentDiyArticleList v-else-if="item.key == 'article-list'" :value="item.com_data"></componentDiyArticleList>
                <componentDiyArticleTabs v-else-if="item.key == 'article-tabs'" :value="item.com_data"></componentDiyArticleTabs>
                <componentDiyHotZone v-else-if="item.key == 'hot-zone'" :value="item.com_data"></componentDiyHotZone>
                <!-- 工具组件 -->
                <componentFloatWindow v-else-if="item.key == 'float-window'" :value="item.com_data"></componentFloatWindow>
                <componentTextTitle v-else-if="item.key == 'text-title'" :value="item.com_data"></componentTextTitle>
                <componentDiyAuxiliaryLine v-else-if="item.key == 'row-line'" :value="item.com_data"></componentDiyAuxiliaryLine>
                <componentDiyRichText v-else-if="item.key == 'rich-text'" :value="item.com_data"></componentDiyRichText>
                <componentAuxiliaryBlank v-else-if="item.key == 'auxiliary-blank'" :value="item.com_data"></componentAuxiliaryBlank>
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
    import componentFloatWindow from '@/components/diy/float-window';
    import componentTextTitle from '@/components/diy/text-title';
    import componentDiyAuxiliaryLine from '@/components/diy/auxiliary-line';
    import componentDiyRichText from '@/components/diy/rich-text.vue';
    import componentAuxiliaryBlank from '@/components/diy/auxiliary-blank.vue';
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
            componentDiyAuxiliaryLine,
            componentDiyRichText,
            componentFloatWindow,
            componentTextTitle,
            componentAuxiliaryBlank,
        },
        data() {
            return {
                // 底部菜单导航高度计算
                padding_footer_computer: 140,
            };
        },

        computed: {
            diy_content_style() {
                return `padding-bottom:${this.padding_footer_computer}rpx`;
            },
        },
        methods: {
            footer_height_computer(number) {
                this.padding_footer_computer = number * 2;
            },
        },
    };
</script>

<style></style>
