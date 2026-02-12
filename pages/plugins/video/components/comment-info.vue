<template> 
    <view class="flex-row align-s gap-10 wh-auto ht-auto"> 
        <image class="comment-avatar" :src="propComment.user.avatar" mode="aspectFill"></image>
        <view class="comment-info flex-col jc-c" @tap="comment_reply">
            <view class="flex-row jc-sb gap-10">
                <view class="comment-user">{{ propComment.user.user_name_view }}</view>
                <view class="pr">
                    <!-- 直接实现下拉菜单 -->
                    <view class="comment-option" @tap.stop="toggle_dropdown">
                        <iconfont name="icon-ellipsis" color="#999" size="28rpx" />
                    </view>
                    <!-- 下拉菜单 -->
                    <view v-if="drop_down_visible" class="dropdown-menu" @tap.stop>
                        <view v-for="(item, index) in dropdownOptions.filter(item => (propComment.is_can_delete == 1 && item.type == 'delete') || (propComment.is_can_report == 1 && item.type == 'report'))" :key="index" class="dropdown-item"  :class="{ 'dropdown-item-divided': item.divided }" :data-value="item" @tap="handle_dropdown_item_click">
                            <text>{{ item.label }}</text>
                        </view>
                    </view>
                </view> 
            </view>
            <view class="comment-text">{{ propComment.content }}</view>
            <view class="comment-images flex-row align-c gap-5">
                <view v-for="(item, index) in propComment.images" class="comment-image">
                    <image :src="item.url" :data-index="index" @tap="upload_show_event" mode="aspectFill" class="wh-auto ht-auto"></image>
                </view>
            </view>
            <view class="comment-operation flex-row align-c jc-sb">
                <view class="comment-operation-left flex-row align-c gap-10">
                    <view class="comment-time">{{ propComment.add_time }}</view>
                    <view class="comment-reply">{{ propReplyContent }}</view>
                </view>
                <view class="comment-operation-right flex-row align-c gap-5" @tap.stop="comment_like">
                    <iconfont name="icon-givealike-o-fine" :color="propComment.is_give_thumbs == 0 ? '#000' : '#F4B73F'" size="28rpx" />
                    <view class="comment-like-num">{{ propComment.give_thumbs_count || 0 }}</view>
                </view>
            </view>
            <slot name="sub-comment"></slot>
        </view>
    </view>
</template>

<script>
    export default {
        props: {
            propComment: {
                type: Object,
                default: () => {
                    return {};
                },
            },
            propId: {
                type: [String, Number],
                default: '',
            },
            propReplyContent: {
                type: String,
                default: '回复'
            },
            // 新增props：控制下拉菜单显示状态
            propDropDownVisible: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                // 下拉菜单选项数据
                dropdownOptions: [
                    { label: '删除', type: 'delete' },
                    { label: '举报', type: 'report' }
                ]
            };
        },
        computed: {
            // 使用computed属性映射props状态
            drop_down_visible() {
                return this.propDropDownVisible;
            }
        },
        methods: {
            // 回复
            comment_reply(e) {
                this.$emit('comment_reply', this.propId, e);
            },
            // 点赞
            comment_like(e) {
                this.$emit('comment_like', this.propId, e);
            },
            // 上传图片预览
            upload_show_event(e) {
                uni.previewImage({
                    current: this.propComment.images[e.currentTarget.dataset.index].url,
                    urls: this.propComment.images.map(item => item.url),
                });
            },
            // 切换下拉菜单
            toggle_dropdown() {
                // 通知父组件切换当前组件的下拉菜单状态
                this.$emit('toggle-dropdown', this.propId);
            },
            // 处理下拉菜单项点击
            handle_dropdown_item_click(e) {
                const item = e.currentTarget.dataset.value || {};
                console.log('点击:', item.label);
                uni.showToast({ title: item.label, icon: 'none' });
                // 通知父组件关闭下拉菜单
                this.$emit('close-dropdown', this.propId);
                this.$emit('dropdown-item-click', { command: item.command, label: item.label });
            }
        },
        mounted() {
            console.log('CommentInfo 组件已挂载');
        }
    }   
</script>

<style lang="scss" scoped>
.comment-avatar {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
}
.comment-info {
    flex: 1;
    gap: 6rpx;
}
.comment-user {
    font-size: 24rpx;
    color: #999999;
    line-height: 34rpx;
}

.comment-text {
    font-size: 28rpx;
    color: #333333;
    line-height: 40rpx;
}

.comment-time {
    font-size: 28rpx;
    color: #999999;
    line-height: 34rpx;
}
.comment-reply {
    font-weight: blod;
    font-size: 24rpx;
    color: #666666;
    line-height: 34rpx;
}
.comment-like-num {
    font-size: 24rpx;
    color: #999999;
    line-height: 34rpx;
}
.comment-image {
    width: 50rpx;
    height: 50rpx;
}

/* 下拉菜单样式 */
.dropdown-menu {
    position: absolute;
    background: #ffffff;
    border-radius: 8rpx;
    box-shadow: 0 6rpx 16rpx 0 rgba(0, 0, 0, 0.15);
    border: 1rpx solid #e5e5e5;
    min-width: 160rpx;
    z-index: 9999;
    top: 100%;
    right: 0;
    margin-top: 8rpx;
    padding: 10rpx 0;
}

.dropdown-item {
    padding: 20rpx 30rpx;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    
    &:not(.dropdown-item-divided):active {
        background-color: #f5f5f5;
    }
    
    &.dropdown-item-divided:not(:first-child)::before {
        content: '';
        position: absolute;
        top: 0;
        left: 30rpx;
        right: 30rpx;
        height: 1rpx;
        background-color: #f0f0f0;
    }
    
    &:first-child {
        border-radius: 8rpx 8rpx 0 0;
    }
    
    &:last-child {
        border-radius: 0 0 8rpx 8rpx;
    }
    
    &:first-child:last-child {
        border-radius: 8rpx;
    }
}
</style>