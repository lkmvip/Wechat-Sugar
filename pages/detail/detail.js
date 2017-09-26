// pages/detail/detail.js
Page({

    /**
    * 页面的初始数据
    */
    data: {
         likeIndex: false
    },

    /**
    * 生命周期函数--监听页面加载
    */
    onLoad: function (options) {

    },

    /**
    * 生命周期函数--监听页面初次渲染完成
    */
    onReady: function () {

    },

    /**
    * 生命周期函数--监听页面显示
    */
    onShow: function () {

    },

    /**
    * 生命周期函数--监听页面隐藏
    */
    onHide: function () {

    },

    /**
    * 生命周期函数--监听页面卸载
    */
    onUnload: function () {

    },

    /**
    * 用户点击右上角分享
    */
    onShareAppMessage: function () {
      
      },
    handleAddLike: function(e) {
        let islike = this.data.likeIndex
        this.setData({
            likeIndex : !islike
        });
        if (!islike) {
            wx.showToast({
              title: '收藏成功',
              icon: 'success',
              duration: 2000,
              mask:true
            })
        }else {
            wx.showToast({
              title: '取消收藏',
              icon: 'success',
              duration: 2000,
              mask:true
            })
        }

    }
})