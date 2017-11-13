// pages/ordermsg/msg.js
const api = require('../../utils/api.js');//封装好的接口路径
const utils = require('../../utils/util.js');//调用封装的request
Page({

    /**
    * 页面的初始数据
    */
    data: {
        orderInfo:[]
    },

    /**
    * 生命周期函数--监听页面加载
    */
    onLoad(options) {
        let id = options.orderid;
        this.handleGetInfo(id);
    },
    handleGetInfo(id) {
        const data ={
            user_id:3,
            order_id:id
        };
        //调用主要信息，获取余额。
        utils.sendRequest(api.OrderInfoDetail, data, this.handleOrderInfoDetailSucc.bind(this));
    },
    handleOrderInfoDetailSucc(res) {
        // console.log(res.data.data)
        this.setData({
            orderInfo:res.data.data,
            status:res.data.data[0].status
        })
    },
    // handleCancelGoods() {
    //     let id = this.data.orderInfo[0].order_id;
    //     wx.redirectTo({
    //         url:'/pages/user/cancelGoods/index?id='+id
    //     })
    // },
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

    }
})