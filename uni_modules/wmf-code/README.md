<a href="https://meet-ui.com" target="_blank">
    <h1 align="center">文档地址</h1>
</a>
<h1 align="center">https://meet-ui.com/#/</h1>
<p align="center">为了能够第一时间解决问题，为了不影响各位在项目中使用特此提供微信群交流</p>
<center>
<img src="https://img.lovewmf.com/2022-10-19.png"/>
<img src="https://img.lovewmf.com/2022-05-10.png"/>
</center>

# 温馨提示

如果使用cli创建的应用请在`vue.config.js`里面添加如下配置
```
module.exports = {
    transpileDependencies: [
		/[/\\]node_modules[/\\](.+?)?@uni-ui(.*)[/\\]code-plugs/,
		/[/\\]node_modules[/\\](.+?)?@uni-ui(.*)[/\\]code-ui/
    ]
}
```
# 微信小程序特别说明

如果在弹窗里面使用，并且弹窗有动画 当弹窗显示的时候二维码会发生偏移或抖动
因为微信小程序的canvas在真机预览渲染的是原生组件并不是 h5的canavas 所以在开发工具里面没问题但是真机会有问题

解决方案：

	1. 如果是使用uView组件的弹窗 请关闭动画
	2. 如果是使用uni-popup组件 关闭动画无效 因为uni的弹窗动画关闭 其实是动画时长为0并且是包含在uni-transition详情请查看uni-popup代码

## 如果是使用uni_modules而非Npm

在`pages.json`里面配置如下

```js
"easycom": {
	"^w-(.*)": "@/uni_modules/wmf-code/components/w-$1/w-$1.vue"//二维码条形码的配置 如果是uni_modules
},
"pages": [
  //...
]
```

## 如果是使用npm而非uni_modules

在`pages.json`里面配置如下

```js
"easycom": {
	"^w-(.*)": "@uni-ui/code-ui/components/w-$1/index.vue"//二维码条形码的配置 如果是npm方式使用
},
"pages": [
  //...
]
```

## 条形码支持添加文字

<img src="https://img.lovewmf.com/WeChat315bd9b33217fabb1beaaa0d65421bee.png" style="margin-bottom: 10px;" />
<img src="https://img.lovewmf.com/WeChat9e319e9cd08e96369c09099f2863bff5.png" style="margin-bottom: 10px;" />

<center>
<figure>
<img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/07d4381cff624fc79ab28cdd1bf3cc6a~tplv-k3u1fbpfcp-watermark.image" style="margin-bottom: 10px;" />
<img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/71d7c20e8c91495c81d245ccfc83d7e7~tplv-k3u1fbpfcp-watermark.image" style="margin-bottom: 10px;" />
</figure>
</center>

# 
<center>
<figure>
<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bfe9eb88cea44007b2627bb640343dcc~tplv-k3u1fbpfcp-watermark.image" style="margin-bottom: 10px;" />
<img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b625254802404a9b84bd699e67b03db4~tplv-k3u1fbpfcp-watermark.image" style="margin-bottom: 10px;" />
</figure>
</center>

# 
<center>
<figure>
<img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f84328d92b104edbad4c34a8665b4c72~tplv-k3u1fbpfcp-watermark.image" style="margin-bottom: 10px;" />
<img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c1548ccd6c944bbe90ef288817077b8c~tplv-k3u1fbpfcp-watermark.image" style="margin-bottom: 10px;" />
</figure>
</center>
