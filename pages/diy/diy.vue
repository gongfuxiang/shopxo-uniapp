<template>
    <view>
        <!-- <componentDiy :value="diy_data"></componentDiy> -->
    </view>
</template>

<script>
    import componentDiy from '@/components/diy/diy';
    // import initData from './init_data';
    export default {
        components: {
            componentDiy,
        },
        data() {
            return {
                // diy_data: initData,
            };
        },
        mounted() {
            // console.log(initData);
        },
        methods: {},
    };
</script>

<style></style>
