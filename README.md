# ShopXO开源商城uniapp端

#### 介绍
* 后端支持依托于ShopXO免费开源电商系统开发的uniapp端主题源码
* 内置8中搭配主色(可自行扩展更多配色)、自由快捷切换适应各大行业需求
* 目前仅支持微信小程序端、其他端正在紧急适配中、后续全面支持（微信、QQ、百度、支付宝、头条、H5、APP）


#### 使用教程
`面向人群：该操作需要有一定的编程技术基础、如需要技术支持可以直接到官网联系客服(付费)` https://shopxo.net/
1. 先安装ShopXO免费开源系统 http://install.shopxo.net/
2. 将该源码导入HBuilderX开发工具、顶部工具栏 `运行->运行到小程序模拟器->(根据支持平台自行选择、如 微信开发者工具)`
3. App.vue中修改 request_url 和 static_url 地址为自己的商城地址即可使用
4. 主题默认为黄色(yellow)，如更改主题 App.vue文件中 default_theme + 底部css引入，pages.json文件中 tabBar选中图标+selectedColor选中颜色
5. 发布、HBuilderX开发工具、顶部工具栏 `发行->(根据支持平台自行选择、如 微信开发者工具)`

#### 当前项目源代码平台
* Gitee：https://gitee.com/zongzhige/shopxo-uniapp
* GitHub：https://github.com/gongfuxiang/shopxo-uniapp
* Coding：https://zongzhige.coding.net/public/shopxo/uniapp/git
* CodeChina：https://codechina.csdn.net/zongzhige/shopxo-uniapp

#### ShopXO后端源代码平台
* Gitee：https://gitee.com/zongzhige/shopxo
* GitHub：https://github.com/gongfuxiang/shopxo
* Coding：https://zongzhige.coding.net/public/shopxo/shopxo/git
* CodeChina：https://codechina.csdn.net/zongzhige/shopxo

#### API接口文档
* https://doc.shopxo.net/article/2.html

#### 支持多种配色
![多种配色](https://images.gitee.com/uploads/images/2021/1023/120323_b21ab261_488475.jpeg "配色.jpg")

#### 效果图片
![主要部分](https://images.gitee.com/uploads/images/2021/1023/120416_6b1ee3da_488475.jpeg "主要部分.jpg")
![扩展部分](https://images.gitee.com/uploads/images/2021/1023/120432_e23e02dd_488475.jpeg "扩展部分.jpg")

### 如何参与项目
非常欢迎您对ShopXO的开发作出贡献！你可以选择以下方式向ShopXO贡献：
- [Github - 发布issue进行问题反馈和建议](https://github.com/gongfuxiang/shopxo-uniapp/pulls)
- [Gitee - 发布issue进行问题反馈和建议](https://gitee.com/zongzhige/shopxo-uniapp/pulls)
- [CodeChina - 发布issue进行问题反馈和建议](https://codechina.csdn.net/zongzhige/shopxo-uniapp/merge_requests)
> 通过Pull Request提交修复、完善我们的文档和例子