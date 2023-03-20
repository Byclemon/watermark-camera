// pages/index/index.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		camera: false,
		userLocation: false,
		writePhotosAlbum: false
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		this.getAuth()
	},
	getAuth: function () {
		wx.getSetting({
			success: res => {
				console.log(res.authSetting)
				this.setData({
					camera: res.authSetting['scope.camera'],
					writePhotosAlbum: res.authSetting['scope.writePhotosAlbum'],
					userLocation: res.authSetting['scope.userLocation']
				})
			}
		})
	},

	getWritePhotosAlbum: function () {
		wx.authorize({
			scope: 'scope.writePhotosAlbum',
			success: () => {
				this.getAuth()
			}
		})
	},

	getCamera: function () {
		wx.authorize({
			scope: 'scope.camera',
			success: () => {
				this.getAuth()
			}
		})
	},

	getUserLocation: function () {
		wx.authorize({
			scope: 'scope.userLocation',
			success: () => {
				this.getAuth()
			}
		})
	},

	goCamera: function () {
		wx.navigateTo({
			url: '/pages/camera/camera',
		})
	},

	goPicture: function () {
		wx.chooseMedia({
			count: 1,
			mediaType: ['image'],
			sourceType: ['album'],
			success: res => {
				console.log(res)
				wx.navigateTo({
					url: '/pages/picture/picture?imageUrl='+res.tempFiles[0].tempFilePath,
				})
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

	}
})