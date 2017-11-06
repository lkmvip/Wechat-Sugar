// pages/user/cancelGoods/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
        tabs: ["申请退货","退货审核","用户发货","收货退款"],
        activeIndex: "0",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
  
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
  
  },
  handleCancelPic() {
    console.log(111)
     var that = this;
        wx.chooseImage({
          count: 1, // 最多可以选择的图片张数，默认9
          sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
          sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
          success: function(res){
              wx.uploadFile({
                url:that.data.API_URL +'uploadavatarurl',
                filePath:res.tempFilePaths[0],
                name:'avatar',
                // header: {}, // 设置请求的 header
                formData: {user_id:that.data.myInfo.user_id}, // HTTP 请求中其他额外的 form data
                success: function(info){
                    console.log(info);
                    that.setData({
                        'myInfo.wx_avatarurl' : res.tempFilePaths[0]
                    });
                    wx.setStorageSync('wx_avatarurl', res.tempFilePaths[0]);
                }
              })
          },
          fail: function() {
            // fail
          },
          complete: function() {
            // complete
          }
        })
  }
})