<template>
    <view class="ht">
        <componentDiyHeader></componentDiyHeader>
        <view v-if="value.diy_data.length > 0" :style="diy_content_style">
            <view v-for="(item, index) in value.diy_data" :key="index">
                <!-- 基础组件 -->
                <componentDiySearch></componentDiySearch>
                <!-- 工具组件 -->
                <componentFloatWindow v-if="item.key == 'float-window'" :value="item.com_data"></componentFloatWindow>
                <componentTextTitle v-if="item.key == 'text-title'" :value="item.com_data"></componentTextTitle>
                <componentDiyAuxiliaryLine v-if="item.key == 'row-line'" :value="item.com_data"></componentDiyAuxiliaryLine>
                <componentDiyRichText v-if="item.key == 'rich-text'" :value="item.com_data"></componentDiyRichText>
            </view>
        </view>
        <componentDiyFooter :value="value.footer.com_data" @footer-height="footer_height_computer"></componentDiyFooter>
    </view>
</template>

<script>
    import componentDiyHeader from '@/components/diy/header';
    import componentDiyFooter from '@/components/diy/footer';
    import componentDiySearch from '@/components/diy/search';
    import componentFloatWindow from '@/components/diy/float-window';
    import componentTextTitle from '@/components/diy/text-title';
    import componentDiyAuxiliaryLine from '@/components/diy/auxiliary-line';
    import componentDiyRichText from '@/components/diy/rich-text.vue';
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
            componentDiyAuxiliaryLine,
            componentDiyRichText,
            componentFloatWindow,
            componentTextTitle,
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
