var Utils = require('../../utils/utils');
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk = new QQMapWX({
	key: 'UDUBZ-OZQ3F-IGWJH-JVQLK-SI5J2-UPFAU' // 必填
});
var timer;
Page({
	data: {
		imageUrl: "https://img.btstu.cn/api/images/5bd2af56cbbed.jpg",
		canvasHeight: 0,
		canvasWidth: 0,
		date: "",
		time: '',
		week: '',
		address: '',
		showPicker: false
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	async onLoad(options) {
		this.getTime();
		this.getLocation();

		if (options.imageUrl) {
			let imageUrl = options.imageUrl;

			// 最好是在导入照片时就直接做一个安全检测
			// let checkResult = await this.checkImage(imageUrl)

			this.init(imageUrl)
			// this.setData({
			// 	imageUrl
			// })
		}
		// this.init(this.data.imageUrl)
	},

	/**
	 * 初始化canvas
	 */
	init: function (imageUrl) {
		const systemInfo = wx.getSystemInfoSync();
		const canvasWidth = systemInfo.screenWidth;
		const dpr = systemInfo.pixelRatio;
		wx.getImageInfo({
			src: imageUrl,
			success: async res => {
				console.log(res)
				let watermarkScale = res.width / canvasWidth;
				this.setData({
					canvasHeight: Math.round(res.height / watermarkScale),
					canvasWidth: canvasWidth,
					imageUrl: res.path
				})

				console.log(this.data.canvasHeight, this.data.canvasWidth)
			}
		})
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady() {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow() {

	},
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
	 * 手动选择地点
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
	 * 手动选择时间
	 */
	setTime: function () {
		clearInterval(timer)
		this.setData({
			showPicker: true
		})
	},

	/**
	 * 关闭设置时间框
	 */
	closePicker: function () {
		this.setData({
			showPicker: false
		})
	},

	/**
	 * 生成图片
	 */
	createPicture: async function () {
		let imageUrl = this.data.imageUrl;
		console.log(imageUrl)
		// let checkResult = await this.checkImage(imageUrl)
		let picture = await this.addWatermark(imageUrl)
		console.log(picture)
		wx.previewImage({
			urls: [picture],
		})
	},

	/**
	 * 图片安全检测
	 */
	checkImage: function () {
		//自己去接入一下
		return new Promise((resolve, reject) => {
			wx.request({
				url: checkApi,
				method: "POST",
				data: {
					image: imageUrl
				},
				success: res => {
					wx.hideLoading()
					resolve(res.data.errcode)
					if (res.data.errcode == 0) {} else if (res.data.errcode == 87014) {
						wx.showModal({
							title: '温馨提示',
							content: '您的照片存在违规内容，请规范本小程序使用。',
							showCancel: false,
							complete: (res) => {
								wx.reLaunch({
									url: '/pages/index/index',
								})
							}
						})
					} else {
						wx.showToast({
							title: '图片检测失败，请重试',
							success: () => {
								wx.reLaunch({
									url: '/pages/index/index',
								})
							}
						})
					}
				}
			})
		})
	},

	/**
	 * 文本安全检测
	 */
	checkText: function () {
		//这个目前不需要，暂时不支持自定义文字
		return new Promise((resolve, reject) => {

		})
	},

	/**
	 * 给图片添加水印
	 */
	addWatermark: function (imageUrl) {
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
					canvasWidth,
					canvasHeight
				} = this.data;
				canvas.width = canvasWidth*dpr;
				canvas.height = canvasHeight*dpr;
				ctx.scale(dpr, dpr)

				console.log(	canvasWidth,
					canvasHeight)

			
				// 绘制背景图片
				const image = canvas.createImage();
				image.onload = () => {
					ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);

					ctx.font = 'normal 14px null';
					ctx.fillStyle = '#ffffff';
					ctx.textBaseline = 'bottom';

					// 绘制地址
					ctx.fillText(this.data.address, 10, canvasHeight - 20);

					//绘制时间
					ctx.fillText(this.data.date + ' ' + this.data.time, 10, canvasHeight - 45);

					//绘制星期
					ctx.fillText(this.data.week, 10, canvasHeight -70);

					setTimeout(() => {
						wx.canvasToTempFilePath({
							canvas,
							success: (res) => {
								wx.hideLoading()
								resolve(res.tempFilePath);
							},
							fail: (err) => {
								console.log(err)
								wx.hideLoading()
								wx.showToast({
									title: '图片生成失败',
								})
								reject(new Error('转换为图片失败'));
							},
						});
					}, 1000)

				}
				image.src = imageUrl
			});
		});
	},

	/**
	 * 设置日期
	 */
	bindDateChange: function (e) {
		let date = e.detail.value;
		const dateStr = new Date(date);
		const week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][dateStr.getDay()];
		console.log(date, week)
		this.setData({
			date,
			week
		})
	},

	/**
	 * 设置时间
	 */
	bindTimeChange: function (e) {
		this.setData({
			time: e.detail.value
		})
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