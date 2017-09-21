// pages/user/pay/pay.js
Page({

  /**
   * 页面的初始数据
   */
    data: {
        array: ['请选择开户银行', '工商银行', '农业银行', '建设银行','中国银行','邮政银行'],
        index: 0,
        maxNum : 99999999,
        name:'',
        card:0,
        bank:'' 
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
    * 页面相关事件处理函数--监听用户下拉动作
    */
    onPullDownRefresh: function () {

    },

    /**
    * 页面上拉触底事件的处理函数
    */
    onReachBottom: function () {

    },

    /**
    * 用户点击右上角分享
    */
    onShareAppMessage: function () {

    },
    // 选择户主
    handleName(e) {
        var user = e.detail.value,
            reg = /^[\u4E00-\u9FA5]{2,4}$/;
        if (!reg.test(user)) {
               console.log(user)
        }else{
               console.log(1)
        }
        this.setData({
          name: user
        })
    },
    handleBankCard(e) {
        console.log(e.detail.value)
        this.setData({
          card: e.detail.value
        })
    },
    // 选择银行
    bindPickerChange: function(e) {
        this.setData({
          index: e.detail.value
        })
    },
})