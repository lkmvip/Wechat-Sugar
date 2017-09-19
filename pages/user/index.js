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
    
  }

})