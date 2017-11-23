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
        let card = wx.getStorageSync('UserCard'),
            id = options.orderid;
        this.handleGetInfo(id);
        this.setData({
            userId:card.user_id
        })
    },
    handleGetInfo(id) {
        let userId = this.data.userId;
        const data ={
            user_id:userId,
            order_id:id
        };
        //调用主要信息，获取余额。
        utils.sendRequest(api.OrderInfoDetail, data, this.handleOrderInfoDetailSucc.bind(this));
        
    },
    handleOrderInfoDetailSucc(res) {
        this.setData({
            orderInfo:res.data.data,
            status:res.data.data[0].status
        });
    },
    handleOrderPay() {
        let obj = JSON.stringify(this.data.orderInfo);
        wx.redirectTo({
            url: '/pages/orderpay/order?obj='+obj
        });
    }

})