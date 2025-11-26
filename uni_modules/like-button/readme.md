# like-button

#### 使用方法:
在 **script** 中引用组件
```javascript
import likeButton from '@/components/like-button/like-button.vue'
export default {
    components: {likeButton}
}
```
在 **template** 中引用组件
```javascript
<like-button></like-button>
```
#### 属性说明

|  属性名 | 类型  | 	默认值  |  	说明 |
| ------------ | ------------ | ------------ | ------------ |
| src  | String  | /static/logo.png | 点击按钮图片  |
| showImgs  | Array  | ['//xxx', '/static/logo.png', ]  | 冒泡图片  |
| duration  | Number  | 5000  | 动画效果时间  |
| range  | Number  | 50 | 冒泡图片x轴摇摆幅度  |
| high  | Number  | 360  | 冒泡图片y轴飘出高度  |
| width  | Number  | 52  |  点赞图标宽度 |
| height  | Number  | 52  |  点赞图标高度 |
| imgWidth  | Number  | 52  |  冒泡图标宽度 |
| imgHeight  | Number  | 52  |  冒泡图标高度 |
| throttle | Number  | 200  |  点击按钮 节流 |
| site  | Array,Object  | [30, 160]  | 冒泡图片相对窗口x y坐标 |
| large  | Number,Boolean  | false | 缩放冒泡，为true默认放大2 |
| alone  | Boolean  | true | 1.0.9-新增, DOM元素逐渐消失 |
#### 事件说明
|  事件名称 | 说明  | 返回值  |
| ------------ | ------------ | ------------ |
| handleClick | 点击按钮触发事件 | 冒泡元素id |
| finished | 动画执行完成回调 | - |

PS:使用定时器触发可用 this.$refs.likeButton.handleClick({timeStamp: Date.now()})。

---
### End