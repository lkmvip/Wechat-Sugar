// pages/orderdetail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      {name: 'ticket', value: '优惠卷',checked: 'true'}
      ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
    onReady () {
  
    },
    handleAddr() {
        wx.navigateTo({
            url: '/pages/user/addr/addr'
        })
    },
    checkboxChange(e) {
        console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    },
    handleTicket() {
        wx.navigateTo({
            url: '/pages/user/ticket/ticket'
        })
    },
    handleOrderPay() {
        wx.navigateTo({
            url: '/pages/orderpay/order'
        })
    }
})