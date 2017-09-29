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
    onLoad: function (options) {

    },
    /**
    * 用户点击右上角分享
    */
    onShareAppMessage: function () {

    },
    handleGoIndex() {
        wx.switchTab({
          url: '/pages/index/index'
        })
    },
    handleGoOrder() {
        wx.redirectTo({
          url: '/pages/ordermsg/msg'
        })
    },
    handleGoLast() {
        wx.navigateBack({
            data:1  
        })
    }
})