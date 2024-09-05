<template>
    <view>
        <view v-if="value.diy_data.length > 0">
            <componentDiySearch></componentDiySearch>
            <view v-for="(item, index) in value.diy_data" :key="index">
                <componentDiyAuxiliaryLine v-if="item.key == 'row-line'" :value="item.com_data"></componentDiyAuxiliaryLine>
            </view>
        </view>
    </view>
</template>

<script>
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
            componentDiySearch,
            componentDiyAuxiliaryLine,
        },
        data() {
            return {};
        },
    };
</script>

<style></style>
