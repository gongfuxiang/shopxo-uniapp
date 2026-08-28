# 客服咨询端插件（对齐 PC chat.html）

原生 UniApp 咨询端，对应 [https://new.shopxo.vip/chat.html](https://new.shopxo.vip/chat.html)  
`user_type: 'user'`，全部资源在本子包目录，不占用主包体积。

## 目录

```
pages/plugins/chat/
  list/list.vue + list.css       # 会话列表（页内标题栏 + 搜索）
  index/index.vue + index.css    # 会话详情（自定义标题栏）
  common/                        # WS / 上传 / 初始化 / 页面逻辑
  components/
    chat-*.vue + chat-*.css      # 组件样式与页面一致，独立 .css + @import
    chat-native-entry.vue        # 原生客服浮窗入口（可选挂载）
    u-popup/                     # 弹层（关闭按钮用全局 iconfont）
```

样式规范与商城其它页面一致：Vue 文件末尾 `<style>@import './同名.css';</style>`，样式写在同目录 `.css` 中；平台差异用 `/* #ifdef MP */` 条件编译。组件额外加 `scoped`，避免 `styleIsolation: 'shared'` 下样式泄漏。

## 路由

| 页面 | 路径 |
|------|------|
| 会话列表 | `/pages/plugins/chat/list/list` |
| 会话详情 | `/pages/plugins/chat/index/index?id={客服cuid}` |

## 入口说明

**原有客服入口完全不变**：商品详情、在线客服组件、`chat_entry_handle()` 仍走 WebView `chat.html`。

**新增原生入口**（仅客服插件 + App 注册一个方法，不改其他页面逻辑）：

```javascript
// 1. 全局方法（App.vue 已注册）
app.globalData.chat_native_entry_handle();              // 进会话列表
app.globalData.chat_native_entry_handle(chat_url);    // 解析 chat_url 进线（有 chat_user 则直进详情）
app.globalData.chat_native_entry_handle({              // 显式参数
  data_id: '123',
  data_type: 'goods',
  chat_user: '456',   // 有则直进详情；无则进列表
  to_list: 1,         // 强制先进列表
});

// 2. 可选组件（在需要原生入口的页面自行引入，不替换 component-online-service）
import ChatNativeEntry from '@/pages/plugins/chat/components/chat-native-entry.vue';
// <chat-native-entry :propIsNav="true" :propIsBar="true" />
// <chat-native-entry :propIsGoods="true" :propChatUrl="chat_url" />
```

列表页 WS 连接后拉取 `user_list`；点击某项进入详情。进线参数在列表/详情 `onLoad` 写入 WS 配置。

## 依赖

- 商城 `plugins_base.chat` 或接口 `get_request_url('index', 'index', 'chat')`
- App 端视频封面抽帧：`uni_modules/lxw-video-frame`（与 admin-app 同源，用于发送/展示视频第一帧缩略图；H5 走 canvas 降级）
