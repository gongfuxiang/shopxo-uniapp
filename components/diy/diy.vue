<template>
    <view class="ht flex-col">
        <componentDiyHeader></componentDiyHeader>
        <view class="flex-1" v-if="value.diy_data.length > 0">
            <view v-for="(item, index) in value.diy_data" :key="index">
                <componentDiySearch></componentDiySearch>
                <componentDiyAuxiliaryLine v-if="item.key == 'row-line'" :value="item.com_data"></componentDiyAuxiliaryLine>
            </view>
        </view>
        <componentDiyFooter :value="value.footer.com_data"></componentDiyFooter>
    </view>
</template>

<script>
    import componentDiyHeader from '@/components/diy/header';
    import componentDiyFooter from '@/components/diy/footer';
    import componentDiySearch from '@/components/diy/search';
    import componentDiyAuxiliaryLine from '@/components/diy/auxiliary-line';
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
        },
        data() {
            return {};
        },
    };
</script>

<style></style>
