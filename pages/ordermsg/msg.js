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
        console.log(options)
        let card = wx.getStorageSync('UserCard'),
            id = options.orderid;
        this.setData({
            userId:card.user_id,
            way:options.way
        })
        this.handleGetInfo(id);
        console.log(this.data.way)
    },
    //获取订单数据
    handleGetInfo(id) {
        let userWay = this.data.way;
        const data ={
            buyStatus:userWay,
            order_id:id
        };
        console.log(data)
        //调用主要信息，获取余额。
        utils.sendRequest(api.OrderInfoDetail, data, this.handleOrderInfoDetailSucc.bind(this));
        
    },
    handleOrderInfoDetailSucc(res) {
        this.setData({
            orderInfo:res.data.data,
            status:res.data.data[0].status
        });
    },
    //如果为待付款状态，去支付页面操作
    handleOrderPay() {
        let obj = JSON.stringify(this.data.orderInfo);
        wx.redirectTo({
            url: '/pages/orderpay/order?obj='+obj
        });
    }

})