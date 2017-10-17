// pages/orderpay/order.js
Page({

    /**
    * 页面的初始数据
    */
    data: {
        check:"0"
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
    handleCheck(e) {
        this.setData({
            check: e.currentTarget.id
        });
    },
    handlePaySucc() {
        wx.navigateTo({
          url: '/pages/succpay/succpay'
        })
    }
})