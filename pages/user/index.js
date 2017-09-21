var app = getApp();
Page({
  data: {
  	userInfo: {}
  },

  onLoad: function () {
   	console.log(app.globalData.userInfo)
   	this.setData({
   		userInfo : app.globalData.userInfo
   	})
    
  },
  // 点击跳转到提现页面
  handleCash() {
  	wx.navigateTo({
	  url: '/pages/user/cash/cash'
	})
  }

})