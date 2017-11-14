// pages/orderpay/order.js
const api = require('../../utils/api.js');//封装好的接口路径
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
        let orderSn = this.data.orderNum,
            orderId = this.data.orderId,
            wxCheck = this.data.check,
            rmbCheck = this.data.checkRmb,
            payWay = '',
            zuHe = 0,
            allPrice = this.data.orderPrice;
            //判断支付状态
            wxCheck ? payWay=9: payWay=8;
            rmbCheck&&wxCheck? zuHe=1 : zuHe =0;
            // 确认支付
            if(rmbCheck&&wxCheck){
                const data ={
                    payment:payWay,
                    order_sn:orderSn,
                    userId:3,
                    zuheflag:zuHe, 
                    order_id:orderId,
                    yue_amount:0,
                    other_amount:0,
                    other_payment:9,
                    wxOrderSn:''
                };
                //调用余额支付接口。
                // utils.sendRequest(api.UserRmbPay, data, this.handleOrderPaySucc.bind(this));
            }
            if (wxCheck) {
                const data ={
                    order_sn:orderSn,
                    openId:"oBs4B0cZEL8NBB4Nqe6qLgUOXaLE",
                    order_amount:allPrice, 
                };
                 // wx.showModal({content: '微信支付正在开发哦~',showCancel: false});
                utils.sendRequest(api.WxPayment, data, this.handleWxPaySucc.bind(this));

            }
 
        // wx.navigateTo({
        //   url: '/pages/succpay/succpay'
        // })
    },
    handleOrderPaySucc(res) {
        console.log(res)
        if (res.data.error == 0 ) {
            wx.navigateTo({
              url: '/pages/succpay/succpay'
            })
        }
    },
    handleWxPaySucc(res) {
        console.log(res)
    },
    // 选择余额支付的逻辑
    handleRmb(e) {
        let allPrice = this.data.orderPrice;
        e.detail.value > allPrice ?
        wx.showModal({content: '您给的太多了哟',showCancel: false}) :
        this.setData({rmbNum:e.detail.value||0,handlePrice:allPrice-e.detail.value})
    }
})