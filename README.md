# watermark-camera
一款智能水印相机，拍照自动添加时间、地点、经纬度等水印文字，可用于工作考勤、学习打卡、工作取证等，支持自定义内容以及给现有照片添加水印。无需安装，无需注册，即开即用。

### 小程序DEMO

微信搜索：智能水印相机

![watermark-camera](https://i.imgtg.com/2023/03/20/91YEp.jpg)



### 使用说明

小程序中由于需要获取地址信息，所以采用的腾讯地图的API，在`/pages/camera/camera.js`文件中有一个地图key需要自己去申请。如何申请Key，注册完成后应该就知道了。

腾讯位置服务开发平台地址：[腾讯位置服务](https://lbs.qq.com/)

同时还需要在小程序服务器域名中添加request合法域名：https://apis.map.qq.com


### 注意事项

由于小程序官方现在，目前图片相关的小程序可能需要接入图片安全检测才可以上线。本小程序代码中只预留了检测的方法，并未接入内容安全检测，需要使用者自行接入。


### 2023.03.22

添加图片审核代码，但是接口需要用户自己去对接。


### 赞助 

如果你觉得这个项目对你有帮助，并且情况允许的话，可以给我一点点支持，总之非常感谢支持～

- 微信

 ![wechat](./gitimage/wechat.jpg)


- 支付宝

 ![alipay](./gitimage/alipay.jpg)

### 更多内容

关注公众号：阳光艺创站



### License

Apache 2.0 © [byclemon](https://github.com/Byclemon/watermark-camera/blob/main/LICENSE)
