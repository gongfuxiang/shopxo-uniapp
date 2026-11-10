<template>
    <view class="bg-white border-radius-main padding-main spacing-mb">
        <view v-if="propShowUser" class="flex-row align-c" :data-value="item.user_home_url || ('/pages/plugins/userhome/home/home?uid=' + item.user_id)" @tap="url_event">
            <image class="avatar circle" :src="(item.user && item.user.avatar) || ''" mode="aspectFill"></image>
            <view class="flex-1 flex-width padding-left-main">
                <view class="fw-b">{{ (item.user && item.user.user_name_view) || '' }}</view>
            </view>
        </view>
        <view class="margin-top-sm" :data-value="detail_url" @tap="detail_event">
            <view class="content-text">{{ item.content }}</view>
            <view v-if="(item.topic_list || []).length > 0" class="margin-top-xs">
                <text v-for="(topic, ti) in item.topic_list" :key="ti" class="cr-main margin-right-sm text-size-sm">#{{ topic.name }}</text>
            </view>
            <view v-if="(item.images || []).length > 0" class="flex-row flex-wrap margin-top-sm">
                <image v-for="(img, ii) in item.images" :key="ii" class="moment-img radius margin-right-xs margin-bottom-xs" :src="img" mode="aspectFill" :data-index="ii" @tap.stop="preview_event"></image>
            </view>
            <view v-if="item.video_url" class="margin-top-sm">
                <video class="moment-video radius" :src="item.video_url" controls object-fit="cover"></video>
            </view>
        </view>
        <view class="flex-row align-c margin-top-sm text-size-sm cr-grey-9 flex-wrap action-row">
            <!-- 与 PC 一致：未审核通过不展示点赞/评论/浏览 -->
            <view v-if="propShowLike && item.show_like == 1" class="action-item margin-right-xl" :class="item.is_like == 1 ? 'cr-main' : ''" @tap.stop="like_event">
                <iconfont :name="item.is_like == 1 ? 'icon-givealike' : 'icon-givealike-o'" size="28rpx" :color="item.is_like == 1 ? theme_color : '#999'" propClass="va-m"></iconfont>
                <text v-if="item.like_count > 0" class="margin-left-xs va-m">{{ item.like_count }}</text>
            </view>
            <view v-if="propShowComment && item.show_comment == 1" class="action-item margin-right-xl" :class="compose_open ? 'cr-main' : ''" @tap.stop="comment_toggle_event">
                <iconfont name="icon-message-o" size="28rpx" :color="compose_open ? theme_color : '#999'" propClass="va-m"></iconfont>
                <text v-if="comment_count > 0" class="margin-left-xs va-m">{{ comment_count }}</text>
            </view>
            <view v-if="propShowAccess && item.show_access == 1" class="action-item margin-right-xl">
                <iconfont name="icon-eye" size="28rpx" color="#999" propClass="va-m"></iconfont>
                <text v-if="item.access_count > 0" class="margin-left-xs va-m">{{ item.access_count }}</text>
            </view>
            <view v-if="propShowOwner && item.operate_data && item.operate_data.is_delete == 1" class="action-item margin-right-xl" @tap.stop="delete_event">
                <iconfont name="icon-delete" size="28rpx" color="#E22C08" propClass="va-m"></iconfont>
            </view>
            <text class="margin-left-auto">{{ item.add_time_text || item.add_time }}</text>
        </view>
        <view v-if="item.audit_status != 2 && item.audit_status_name" class="text-size-xs cr-red margin-top-xs">{{ item.audit_status_name }}</view>

        <view v-if="show_comment_panel" :class="has_comment_list ? 'comment-box margin-top-sm' : ''" @tap.stop="">
            <component-moment-comment
                ref="comment"
                :propMomentId="item.id"
                :propList="item.comment_preview || []"
                :propHasMore="item.comment_more || 0"
                :propCommentCount="comment_count"
                :propEnableLike="propShowLike"
                :propPopupMode="true"
                :propComposeOpen="compose_open"
                @compose-change="compose_change_event"
                @count-change="count_change_event"
            ></component-moment-comment>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import componentMomentComment from '../moment-comment/moment-comment';
    export default {
        components: { componentMomentComment },
        props: {
            propItem: { type: Object, default: () => ({}) },
            propShowUser: { type: Boolean, default: true },
            propShowLike: { type: Boolean, default: true },
            propShowComment: { type: Boolean, default: true },
            propShowAccess: { type: Boolean, default: true },
            propShowOwner: { type: Boolean, default: false },
            propEnableDetail: { type: Boolean, default: true },
            propShowCommentPreview: { type: Boolean, default: true },
        },
        data() {
            return {
                theme_color: app.globalData.get_theme_color(),
                compose_open: false,
                comment_count: 0,
            };
        },
        watch: {
            'propItem.id': {
                immediate: true,
                handler() {
                    this.compose_open = false;
                    this.comment_count = parseInt((this.propItem && this.propItem.comment_count) || 0) || 0;
                },
            },
            'propItem.comment_count'(val) {
                this.comment_count = parseInt(val || 0) || 0;
            },
        },
        computed: {
            item() {
                return this.propItem || {};
            },
            detail_url() {
                if (!this.propEnableDetail || !this.item.id) {
                    return '';
                }
                return this.item.detail_url || ('/pages/plugins/userhome/detail/detail?id=' + this.item.id);
            },
            show_comment_panel() {
                return this.propShowCommentPreview && this.propShowComment && this.item.show_comment == 1;
            },
            has_comment_list() {
                var preview = this.item.comment_preview || [];
                return preview.length > 0 || !!this.item.comment_more || this.comment_count > 0;
            },
        },
        methods: {
            url_event(e) {
                app.globalData.url_event(e);
            },
            detail_event() {
                if (!this.detail_url) {
                    return;
                }
                app.globalData.url_event({ currentTarget: { dataset: { value: this.detail_url } } });
            },
            preview_event(e) {
                var index = parseInt(e.currentTarget.dataset.index || 0);
                var urls = this.item.images || [];
                if (!urls.length) {
                    return;
                }
                uni.previewImage({ current: urls[index] || urls[0], urls: urls });
            },
            like_event() {
                this.$emit('like', this.item);
            },
            delete_event() {
                this.$emit('delete', this.item);
            },
            comment_toggle_event() {
                if (this.compose_open) {
                    this.compose_open = false;
                    return;
                }
                var user = app.globalData.get_user_info(this, 'comment_toggle_event');
                if (user == false) {
                    return;
                }
                this.compose_open = true;
            },
            compose_change_event(open) {
                this.compose_open = !!open;
            },
            count_change_event(count) {
                this.comment_count = parseInt(count || 0) || 0;
                this.$emit('comment-count', { item: this.item, count: this.comment_count });
            },
        },
    };
</script>
<style scoped>
    .avatar {
        width: 72rpx;
        height: 72rpx;
        flex-shrink: 0;
    }
    .content-text {
        white-space: pre-wrap;
        word-break: break-word;
        line-height: 1.6;
    }
    .moment-img {
        width: 200rpx;
        height: 200rpx;
    }
    .moment-video {
        width: 100%;
        height: 360rpx;
    }
    .action-item {
        display: inline-flex;
        align-items: center;
    }
    .comment-box {
        padding-top: 12rpx;
        border-top: 1px solid #f5f5f5;
    }
</style>
