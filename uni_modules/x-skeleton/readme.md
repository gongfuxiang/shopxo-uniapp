# x-skeleton

# 功能介绍
- 支持 H5、微信小程序，其他端未测试过
- 使用简单、灵活，高度自定义
- 加载时支持动画
- 消失时加了动画，不再生硬切换页面
- 支持绝大部分常用场景：
1、轮播图 
2、个人信息 
3、段落 
4、菜单 
5、列表 
6、瀑布流
7、自定义...

# 属性说明

| 参数    | 说明                                                | 类型    | 默认值 | 可选值 |
| ------- | --------------------------------------------------- | ------- | ------ | --- |
| type | 骨架类型，为空时是完全自定义 | String | - |banner轮播图、info个人信息、text段落、menu菜单、list列表、waterfall瀑布流|
| loading | 是否显示骨架占位图，设置为false将会展示子组件内容 | Boolean | true |true、false|
| animate | 是否开启动画效果 | Boolean | true |true、false|
| animateTime | 动画效果持续时间，单位秒 | Number \| String | 1.8 |-|
| fadeOut | 是否开启淡出动画 | Boolean | true |true、false|
| fadeOutTime | 淡出效果持续时间，单位秒 | Number \| String | 0.5 |-|
| bgColor | 骨架的背景色 | String | #EAEDF5 |-|
| highlightBgColor | 骨架的动画高亮背景色 | String | #F9FAFF |-|
| configs | 自定义配置，具体看下方 | Object | {} |-|

## configs参数说明

| 参数    | 说明                                                | 类型  |
| ------- | --------------------------------------------------- | ------- |
| padding | 骨架内边距，同 css 的 padding | String |
| gridRows | 行数 | Number |
| gridColumns | 列数 | Number |
| gridRowsGap | 行间隔 | String |
| gridColumnsGap | 竖间距 | String |
| itemDirection | head与text之间的排列方向（row、column） | String |
| itemGap | head与text之间的间隔 | String |
| itemAlign | head与text之间的纵轴对齐方式，同 flex 的align-items（center、flex-start、flex-end等） | String |
| headShow | head是否展示 | Boolean |
| headWidth | head宽度，支持百分比 | String |
| headHeight | head高度 | String |
| headBorderRadius | head圆角，支持百分比 | String |
| textShow | text是否展示 | Boolean |
| textRows | text的行数 | Number |
| textRowsGap | text间距 | String |
| textWidth | text的宽度，可以为百分比，数值，带单位字符串等，可通过数组传入指定每个段落行的宽度 | String \| Array \| Number |
| textHeight | text的高度，可以为数值，带单位字符串等，可通过数组传入指定每个段落行的高度 | String \| Array \| Number |
| textBorderRadius | text的圆角，支持百分比 | String |

大部分情况下，直接指定相应的 type 已经够用了，如果大家想进行样式的微调、完全自定义可通过设置 configs 来实现。

简单解释一下这些参数（右边有结构布局图示）：

布局总共分成 4 块，分别是 grid、item、head、text。

1、grid：包含 item，指定每一行有多少个 item，每一列有多少个 item

2、item：包含 head、text，可设置他们之间的排列方式、间距

3、head：一个 item 只有一个 head，可设置宽高、圆角

4、text：一个 item 可以有多行 text，可分别设置宽高、圆角、间距



# 使用示例

```html
<x-skeleton type="banner" :loading="loading">
	<view>我是轮播图</view>
</x-skeleton>
```

```js
export default {
	data() {
		return {
			loading: true,
		}
	},
	onLoad() {
		setTimeout(() => {
			this.loading = false;
		}, 2000);
	},
}
```

更多用法请下载查看示例代码，有问题可以留言