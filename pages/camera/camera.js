var Utils = require('../../utils/utils');
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');

var qqmapsdk = new QQMapWX({
	key: '' //在这里输入你在腾讯位置服务平台申请的KEY
});
var timer;

Page({
	data: {
		device: 'back',
		flash: '',
		date: "",
		time: "",
		week: "",
		address: "",
		addressName: "",
		cameraWidth: 0,
		cameraHeight: 0
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady() {
		const systemInfo = wx.getSystemInfoSync();
		const screenWidth = systemInfo.screenWidth;
		const screenHeight = systemInfo.screenHeight;
		const statusBarHeight = systemInfo.statusBarHeight;
		const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
		const cameraWidth = screenWidth;
		const cameraHeight = screenHeight - statusBarHeight - menuButtonInfo.height - (menuButtonInfo.top - systemInfo.statusBarHeight) * 2 - 90;
		this.setData({
			cameraWidth: cameraWidth,
			cameraHeight: cameraHeight
		});
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		this.getTime()
		this.getLocation()
	},

		/**
	 * 获取当前时间
	 */
	getTime: function () {
		timer = setInterval(() => {
			let timeData = Utils.formatTime()
			this.setData({
				date: timeData.date,
				time: timeData.time,
				week: timeData.week
			})
		}, 1000)
	},

	/**
	 * 获取地址信息
	 */
	getLocation: function () {
		wx.getLocation({
			success: res => {
				qqmapsdk.reverseGeocoder({
					location: {
						latitude: res.latitude,
						longitude: res.longitude
					},
					success: res => {
						let address = res.result.address;
						this.setData({
							address
						})
					}
				})
			}
		})
	},

	/**
	 * 图片安全检测
	 */
	checkImage: function () {
		//自己去接入一下
		return new Promise((resolve, reject) => {

		})
	},

	/**
	 * 拍摄事件
	 */
	takePhoto: function () {
		const ctx = wx.createCameraContext()
		ctx.takePhoto({
			quality: 'high',
			success: async (res) => {
				console.log(res)
				// 先图片内容安全检测
				// let checkResult = await this.checkImage(imageUrl)

				let addWatermark = await this.addWatermark(res.tempImagePath)
				wx.previewImage({
					urls: [addWatermark],
				})
			}
		})
	},

	/**
	 * 给图片添加水印
	 */
	addWatermark: function (imageUrl) {
		console.log(imageUrl)
		return new Promise((resolve, reject) => {
			wx.showLoading({
				title: '图片生成中...',
			})
			const query = wx.createSelectorQuery();
			query.select('#canvas').fields({
				node: true,
				size: true
			}).exec((res) => {
				console.log(res)
				const canvas = res[0].node;
				const ctx = canvas.getContext('2d');

				const dpr = wx.getSystemInfoSync().pixelRatio;
				const {
					cameraWidth,
					cameraHeight
				} = this.data;
				canvas.width = cameraWidth * dpr
				canvas.height = cameraHeight * dpr
				ctx.scale(dpr, dpr)

				// 绘制背景图片
				const image = canvas.createImage();
				image.onload = () => {
					ctx.drawImage(image, 0, 0, cameraWidth, cameraHeight);

					ctx.font = 'normal 12px null';
					ctx.fillStyle = '#ffffff';
					ctx.textBaseline = 'bottom';

					// 绘制地址
					ctx.fillText(this.data.address, 10, cameraHeight - 10);

					// 绘制时间
					ctx.fillText(this.data.date + ' ' + this.data.time, 10, cameraHeight - 35);

					// 绘制星期
					ctx.fillText(this.data.week, 10, cameraHeight - 60);

					wx.canvasToTempFilePath({
						canvas,
						success: (res) => {
							wx.hideLoading()
							resolve(res.tempFilePath);
						},
						fail: () => {
							wx.hideLoading()
							reject(new Error('转换为图片失败'));
						},
					});
				}
				image.src = imageUrl;
			});
		});
	},

	/**
	 * 切换摄像头
	 */
	setDevice: function () {
		this.setData({
			device: this.data.device == 'back' ? 'front' : 'back'
		})
		let text = this.data.device == 'back' ? '后置' : "前置";
		wx.showToast({
			title: "摄像头" + text
		})
	},

	/**
	 * 闪光灯开关
	 */
	setFlash: function () {
		this.setData({
			flash: this.data.flash == 'torch' ? 'off' : 'torch'
		})
	},

		/**
	 * 选择位置信息
	 */
	chooseLocation: function () {
		wx.chooseLocation({
			success: res => {
				console.log(res)
				this.setData({
					address: res.address
				})
			},
			fail: err => {
				console.log(err)
			}
		})

	},


	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow() {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide() {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload() {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh() {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom() {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage() {

	},
	onShareTimeline() {

	}
})