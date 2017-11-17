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
        let order = JSON.parse(options.msg),
            freight = options.count,
            card = wx.getStorageSync('UserCard');
        console.log(options.count)
        //操作页面传值的参数
        this.setData({
            orderPrice:order.money+Number(freight),
            orderNum:order.order_sn,
            orderWay:order.shipping_mode,
            orderId:order.new_order_id,
            orderAmount:order.order_amount,
            handlePrice:(order.money+Number(freight)).toFixed(2),
            userId:card.user_id,
            openId:card.openId
        });
        const data ={
            userId:card.user_id,
            status:2

        };
        //调用主要信息，获取余额。
        utils.sendRequest(api.UserMainMsg, data, this.handleUserMainSucc.bind(this));
    },
    handleUserMainSucc(res) {
        console.log(res)
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
        let rmb = this.data.rmb;
            rmb == null ? wx.showModal({content: '余额不足哦',showCancel: false}): 
        this.setData({rmbNum:0});
        let orderSn = this.data.orderNum,//订单编号
            orderId = this.data.orderId,//订单id
            wxCheck = this.data.check,//微信按钮
            rmbCheck = this.data.checkRmb,//余额按钮
            payWay = '',//支付方式
            zuHe = 0,
            allPrice = this.data.orderPrice,//商品价格
            wxPrice = this.data.handlePrice,//修改后微信支付的数额
            rmbNum = this.data.rmbNum,//余额支付的数额
            userId = this.data.userId,
            openId = this.data.openId;
            //判断支付状态
            wxCheck ? payWay=9: payWay=8;
            rmbCheck&&wxCheck? zuHe=1 : zuHe =0;
            // 确认支付
            if(allPrice==rmbNum){
                const data ={
                    payment:payWay,
                    order_sn:orderSn,
                    userId:userId,
                    zuheflag:zuHe, 
                    order_id:orderId,
                    yue_amount:0,
                    other_amount:0,
                    other_payment:9,
                    wxOrderSn:''
                };
                //调用余额支付接口。
                utils.sendRequest(api.UserRmbPay, data, this.handleOrderPaySucc.bind(this));
            }
            if (rmbNum==0||rmbNum=='') {
                const data ={
                    order_sn:orderSn,
                    openId:openId,
                    order_amount:wxPrice, 
                };
                 // wx.showModal({content: '微信支付正在开发哦~',showCancel: false});
                utils.sendRequest(api.WxPayment, data, this.handleWxPaySucc.bind(this));
            }
            if (rmbNum>0&&rmbNum<allPrice) {
                const data ={
                    order_sn:orderSn,
                    openId:openId,
                    order_amount:wxPrice, 
                };
                utils.sendRequest(api.WxPayment, data, this.handleZuHePaySucc.bind(this));
            }
            if (wxCheck==false&&rmbCheck==false) {
                wx.showModal({content: '请选择支付方式',showCancel: false})
            }
            if (wxCheck==false) {
                wx.showModal({content: '请选择支付方式',showCancel: false})
            }
    },
    handleZuHePaySucc(res) {
            let orderSn = this.data.orderNum,
            orderId = this.data.orderId,
            wxCheck = this.data.check,
            rmbCheck = this.data.checkRmb,
            payWay = '',
            zuHe = 0,
            allPrice = this.data.orderPrice,
            wxPrice = this.data.handlePrice,
            rmbNum = this.data.rmbNum,
            userId = this.data.userId,
            openId = this.data.openId;
            result = res.data;
            console.log(result)
            wx.requestPayment({
                'appId': result.appId,
               'timeStamp': result.timeStamp,
               'nonceStr': result.nonceStr,
               'package': result.package,
               'signType': 'MD5',
               'paySign': result.paySign,
               'success':res => {
                    wxCheck ? payWay=9: payWay=8;
                    rmbCheck&&wxCheck? zuHe=1 : zuHe =0;
                    const data ={
                            payment:payWay,
                            order_sn:orderSn,
                            userId:userId,
                            zuheflag:zuHe, 
                            order_id:orderId,
                            yue_amount:0,
                            other_amount:0,
                            other_payment:9,
                            wxOrderSn:''
                    };
                        //调用余额支付接口。
                    utils.sendRequest(api.UserRmbPay, data, this.handleZuHeRmbPaySucc.bind(this));
                },
               'fail':res => {
                    wx.showModal({content: '支付失败',showCancel: false})
                }
            })
            
    },
    handleZuHeRmbPaySucc(res) {
        if (res.data.error == 0 ) {
            wx.redirectTo({
              url: '/pages/succpay/succpay'
            })
        }else {
            wx.showModal({content: '服务器出现问题，我们会尽快处理~',showCancel: false})

        }
    },
    handleOrderPaySucc(res) {
        console.log(res)
        if (res.data.error == 0 ) {
            wx.redirectTo({
              url: '/pages/succpay/succpay'
            })
        }else {
            wx.showModal({content: '服务器出现问题，我们会尽快处理~',showCancel: false})
        }
    },
    handleWxPaySucc(res) {
        let result = res.data;
        console.log(result)
        wx.requestPayment({
            'appId': result.appId,
           'timeStamp': result.timeStamp,
           'nonceStr': result.nonceStr,
           'package': result.package,
           'signType': 'MD5',
           'paySign': result.paySign,
           'success':res => {
                wx.redirectTo({
                  url: '/pages/succpay/succpay'
                })
            },
           'fail':res => {
                wx.showModal({content: '支付失败',showCancel: false})
            }
        })
    },
    // 选择余额支付的逻辑
    handleRmb(e) {
        let allPrice = this.data.orderPrice;
        let rmb = this.data.rmb;
        rmb == null ? wx.showModal({content: '余额不足哦',showCancel: false}): 
        this.setData({rmbNum:0});
        e.detail.value > allPrice ?
        wx.showModal({content: '您给的太多了哟',showCancel: false}) :
        this.setData({rmbNum:e.detail.value||0,handlePrice:(allPrice-e.detail.value).toFixed(2)})
    }
})