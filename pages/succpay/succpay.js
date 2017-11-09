// pages/succpay/succpay.js
Page({

    /**
    * 页面的初始数据
    */
    data: {
        isSucc:true
    },

    /**
    * 生命周期函数--监听页面加载
    */
    onLoad(options) {

    },
    /**
    * 用户点击右上角分享
    */
    onShareAppMessage() {

    },
    handleGoIndex() {
        wx.switchTab({
          url: '/pages/index/index'
        })
    },
    handleGoOrder() {
        wx.redirectTo({
          url: '/pages/order/order'
        })
    },
    handleGoLast() {
        wx.navigateBack({
            data:1  
        })
    }
})