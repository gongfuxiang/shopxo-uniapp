<template>
    <view>
        <live-pusher id='livePusher' ref="livePusher" class="livePusher" url="rtmp://live-push.shopxo.vip/68f764013572f9240ca7ce6c/shopxo"
        mode="SD" :muted="true" :enable-camera="true" :auto-focus="true" :beauty="1" whiteness="2"
        aspect="9:16" @statechange="statechange" @netstatus="netstatus" @error = "error"
        ></live-pusher>
        <view class="margin-top-xxxxl padding-top-xxxxl">
            <button class="btn" @click="start">开始推流</button>
            <button class="btn" @click="pause">暂停推流</button>
            <button class="btn" @click="resume">resume</button>
            <button class="btn" @click="stop">停止推流</button>
            <button class="btn" @click="snapshot">快照</button>
            <button class="btn" @click="startPreview">开启摄像头预览</button>
            <button class="btn" @click="stopPreview">关闭摄像头预览</button>
            <button class="btn" @click="switchCamera">切换摄像头</button>
        </view>
    </view>
</template>
<script>
    export default {
        data() {
			return {
                context: null
            }
        },
        onReady() {
            // 注意：需要在onReady中 或 onLoad 延时
            var self = this;
            setTimeout(function() {
                self.context = uni.createLivePusherContext("livePusher", self);
            }, 2000);
        },
        methods: {
            statechange(e) {
                console.log("statechange:" + JSON.stringify(e));
            },
            netstatus(e) {
                console.log("netstatus:" + JSON.stringify(e));
            },
            error(e) {
                console.log("error:" + JSON.stringify(e));
            },
            start: function() {
                console.log(this.context)
                this.context.start({
                    success: (a) => {
                        console.log("livePusher.start:" + JSON.stringify(a));
                    }
                });
            },
            close: function() {
                this.context.close({
                    success: (a) => {
                        console.log("livePusher.close:" + JSON.stringify(a));
                    }
                });
            },
            snapshot: function() {
                this.context.snapshot({
                    success: (e) => {
                        console.log(JSON.stringify(e));
                    }
                });
            },
            resume: function() {
                this.context.resume({
                    success: (a) => {
                        console.log("livePusher.resume:" + JSON.stringify(a));
                    }
                });
            },
            pause: function() {
                this.context.pause({
                    success: (a) => {
                        console.log("livePusher.pause:" + JSON.stringify(a));
                    }
                });
            },
            stop: function() {
                this.context.stop({
                    success: (a) => {
                        console.log(JSON.stringify(a));
                    }
                });
            },
            switchCamera: function() {
                this.context.switchCamera({
                    success: (a) => {
                        console.log("livePusher.switchCamera:" + JSON.stringify(a));
                    }
                });
            },
            startPreview: function() {
                this.context.startPreview({
                    success: (a) => {
                        console.log("livePusher.startPreview:" + JSON.stringify(a));
                    }
                });
            },
            stopPreview: function() {
                this.context.stopPreview({
                    success: (a) => {
                        console.log("livePusher.stopPreview:" + JSON.stringify(a));
                    }
                });
            }
        }
    }
</script>

<style>
</style>