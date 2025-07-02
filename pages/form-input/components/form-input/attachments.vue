<template>
    <!-- 视频 -->
    <view>
       <template v-if="file.length > 0">
            <view class="flex-row gap-20 align-c">
                <span class="file-title text-line-1" :style="propStyle + 'width:auto;height:100%'">{{ file[0].original || '' }}</span>
                <view class="oprate cr-blue">
                    <view class="icon" :data-url="file[0].url" @tap="copy">
                        <iconfont name="icon-copy" size="20rpx" />
                    </view>
                    <span class="divider"></span>
                    <view class="icon" :data-name="file[0].original" :data-url="file[0].url" @tap="download">
                        <iconfont name="icon-download-btn" size="20rpx" />
                    </view>
                </view>
            </view>
        </template>
        <template v-else>
            <span class="file-title" :style="propStyle + 'width:100%;height:100%'">暂无文件</span>
        </template>
    </view>
</template>

<script>
    const app = getApp();
    import { isEmpty } from '@/common/js/common/common.js';
    export default {
        props: {
            propValue: {
                type: Object,
                default: () => ({}),
            },
            propKey: {
                type: [String, Number],
                default: 0,
            },
            propDataIndex: {
                type: Number,
                default: 0,
            },
            propStyle: {
                type: String,
                default: '',
            },
            propIsCustom: {
                type: Boolean,
                default: false,
            }
        },
        data() {
            return {
                com_data: {},
                file: [],
            };
        },
        watch: {
            propKey(val) {
                // 初始化
                this.init();
            },
        },
        mounted() {
            this.init();
        },
        methods: {
            isEmpty,
            // 初始化数据
            init() {
                const com_data = this.propValue;
                this.setData({
                    com_data: com_data,
                    file: com_data.file || [],
                });
            },
            // 复制到剪切板
            copy(e) {
                const { url, name } = e.currentTarget.dataset;
                /* 创建一个临时的textarea元素 */
                const textarea = document.createElement('textarea');
                textarea.value = url;
                document.body.appendChild(textarea);
                textarea.select();
                try {
                    const successful = document.execCommand('copy');
                    const msg = successful ? '成功复制！' : '复制失败';
                    app.globalData.showToast(msg);
                } catch (err) {
                    console.error('复制失败', err);
                }
                document.body.removeChild(textarea);
            },
            // 文件下载
            download(e) {
                const { url, name } = e.currentTarget.dataset;
                const link = document.createElement('a');
                link.href = url;
                link.download = name;
                link.target = "_blank"; // 可选，如果希望在新窗口中下载文件，请取消注释此行
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        },
    };
</script>

<style lanbg="scss" scoped>
.divider {
    width: 2rpx;
    height: 24rpx;
    background-color: #e4e7ec;
}
.file-title {
    font-weight: 400;
    font-size: 24rpx;
    color: #666666;
    line-height: 34rpx;
    font-style: normal;
}
.oprate {
    display: flex;
    align-items: center;
    border-radius: 30rpx;
    background: #FFFFFF;
    box-shadow: 0px 2rpx 8rpx 0px rgba(0,0,0,0.1);
    .icon {
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        padding: 12rpx 24rpx;
    }
}
</style>
