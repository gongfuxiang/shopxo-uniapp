<template>
    <view>
        <live-player
          src="rtmp://live-pull.shopxo.vip/68f764013572f9240ca7ce6c/shopxo"
          mode="live"
          autoplay
          @statechange="statechange"
          @error="error"
          style="width: 400px; height: 525px;"
        />
    </view>
</template>

<script>
export default {
    data() {
        return {
            
        }
    },
    methods: {
        statechange(e){
            console.log('live-player code:', e.detail.code)
        },
        error(e){
            console.error('live-player error:', e.detail.errMsg)
        }
    }
}
</script>

<style>
</style>