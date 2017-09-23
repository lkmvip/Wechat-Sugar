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
    },
  // 点击跳转到订单页面
    handleAllOrder() {
        wx.navigateTo({
          url: '/pages/user/order/order'
        })
    },
  //待付款
    handleWillPay(e) {
        var indexNum = e.currentTarget.dataset.id; 
        wx.navigateTo({
          url: '/pages/user/order/order?id='+indexNum
        })
    },
  //待发货  
    handleWillSend(e) {
        var indexNum = e.currentTarget.dataset.id; 
        wx.navigateTo({
          url: '/pages/user/order/order?id='+indexNum
        })
    },
  //待收货
    handleWillTake(e) {
        var indexNum = e.currentTarget.dataset.id; 
        wx.navigateTo({
          url: '/pages/user/order/order?id='+indexNum
        })
    },
  // 跳转到待收收益
    handleWillIncome(e) {
        wx.navigateTo({
          url: "/pages/user/willincome/will"
        })
    },
  //跳转到累计收益
    handleIncomed(e) {
        wx.navigateTo({
          url: "/pages/user/incomed/incomed"
        })
    },
})