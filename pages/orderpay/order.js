// pages/orderpay/order.js
const api = require('../../utils/api.js');//封装好的借口路径
const utils = require('../../utils/util.js');//调用封装的request
Page({

    /**
    * 页面的初始数据
    */
    data: {
        check:true,
        rmbNum: 0,
        checkRmb:false,
        showPrice:false
    },

    /**
    * 生命周期函数--监听页面加载
    */
    onLoad(options) {
        let order = JSON.parse(options.msg);
        //操作页面传值的参数
        this.setData({
            orderPrice:order.money,
            orderNum:order.order_sn,
            orderWay:order.shipping_mode,
            orderId:order.new_order_id,
            orderAmount:order.order_amount,
            handlePrice:order.money
        });
        const data ={
            userId:3
        };
        //调用主要信息，获取余额。
        utils.sendRequest(api.UserMainMsg, data, this.handleUserMainSucc.bind(this));
    },
    handleUserMainSucc(res) {
        this.setData({
            rmb:res.data.accountbalance
        })
    },
    /**
    * 用户点击右上角分享
    */
    onShareAppMessage() {

    },
    // 默认选择微信支付
    handleCheckWeChat() {
        let check1 = this.data.check;
        this.setData({
            check:!check1
        });
    },
    // 选择余额支付
    handleCheckRmb() {
        let check1 = !this.data.checkRmb,
            show = !this.data.showPrice;
        this.setData({
            checkRmb:check1,
            showPrice:show
        })

    },
    //支付成功
    handlePaySucc() {
        wx.navigateTo({
          url: '/pages/succpay/succpay'
        })
    },
    // 选择余额支付的逻辑
    handleRmb(e) {
        let allPrice = this.data.orderPrice;
        e.detail.value > allPrice ?
        wx.showModal({content: '您给的太多了哟',showCancel: false}) :
        this.setData({rmbNum:e.detail.value||0,handlePrice:allPrice-e.detail.value})
    }
})