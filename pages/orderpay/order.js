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
        //判断是从购物车流程进入，还是从订单列表进入
        if (options.msg) {
            let order = JSON.parse(options.msg),freight = options.count;
            this.setData({
                orderPrice:order.money,//订单金额
                orderNum:order.order_sn,//订单编号
                orderWay:order.shipping_mode,//配送方式
                orderId:order.new_order_id,//订单ID
                handlePrice:order.money// 操作金额的变量
            })
        }else if (options.obj) {
            //这里是从订单列表进入的数据
            let order = JSON.parse(options.obj),
                amount = order[0].order_amount;
            this.setData({
                orderPrice:Number(amount),
                orderNum:order[0].order_sn,
                orderWay:order[0].takegoods_mode,
                orderId:order[0].order_id,
                handlePrice:Number(amount).toFixed(2),
            })
        }
        let card = wx.getStorageSync('UserCard');//获取用户身份信息
        //操作页面传值的参数
        console.log(card)
        this.setData({
            userId:card.user_id,
            openId:card.openid
        });
        const data ={
            userId:card.user_id,
            status:2

        };
        //调用主要信息，获取余额。
        utils.sendRequest(api.UserMainMsg, data, this.handleUserMainSucc.bind(this));
    },
    handleUserMainSucc(res) {
        this.setData({
            rmb:res.data.accountbalance
        })
    },
    // 默认选择微信支付
    handleCheckWeChat() {
        let check1 = this.data.check,
            show = !this.data.showPrice,
            allPrice = this.data.orderPrice;
        this.setData({
            check:!check1,
            showPrice:show,//更改余额的input显示或隐藏
            // handlePrice:allPrice
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
        let rmb = this.data.rmb,
            orderSn = this.data.orderNum,//订单编号
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
            // 调用余额支付
            if(rmbCheck&&rmbNum>=0||zuHe==1){// 余额按钮选中和金额 执行下面逻辑
                if (rmbNum == allPrice || !wxCheck) {//如果金额等于商品价格就不走微信支付
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
                }else {
                    const data ={
                        order_sn:orderSn,
                        openId:openId,
                        order_amount:wxPrice, 
                    };
                    //调用微信支付接口。
                    utils.sendRequest(api.WxPayment, data, this.handleZuHePaySucc.bind(this));
                }

            }
            if (wxCheck&&zuHe==0) {//微信支付的方法
                const data ={
                    order_sn:orderSn,
                    openId:openId,
                    order_amount:wxPrice, 
                };
                utils.sendRequest(api.WxPayment, data, this.handleWxPaySucc.bind(this)); 
            }
            if (wxCheck==false&&rmbCheck==false) {
                wx.showModal({content: '请选择支付方式',showCancel: false})
            }
                        //判断是否有余额
            rmb == null ? wx.showModal({content: '余额不足哦',showCancel: false}): 
            this.setData({handlePrice:(allPrice-rmbNum).toFixed(2)});
    },
    //组合支付
    handleZuHePaySucc(res) {
            let orderSn = this.data.orderNum,//订单编号
            orderId = this.data.orderId,//订单id
            wxCheck = this.data.check,//微信支付按钮
            rmbCheck = this.data.checkRmb,//余额支付按钮
            payWay = '',//支付方式
            zuHe = 0,
            allPrice = this.data.orderPrice,//全部价格
            wxPrice = this.data.handlePrice,//微信支付价格
            rmbNum = this.data.rmbNum,//余额
            userId = this.data.userId,//用户id
            openId = this.data.openId,//
            result = res.data;//返回值结果
            //微信支付
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
    //组合支付的处理逻辑
    handleZuHeRmbPaySucc(res) {
        if (res.data.error == 0 ) {
            wx.redirectTo({
              url: '/pages/succpay/succpay'
            })
        }else {
            wx.showModal({content: '服务器出现问题，我们会尽快处理~',showCancel: false})

        }
    },
    //余额支付的处理逻辑
    handleOrderPaySucc(res) {
        if (res.data.error == 0 ) {
                wx.redirectTo({
                  url: '/pages/succpay/succpay'
                })
        }else {
            wx.showModal({content: '余额不足哦',showCancel: false})
        }
    },
    //微信支付处理逻辑
    handleWxPaySucc(res) {
        let result = res.data;
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
        rmb == null || rmb<e.detail.value? wx.showModal({content: '余额不足哦',showCancel: false}): 
        this.setData({rmbNum:0});
        e.detail.value > allPrice ?
        wx.showModal({content: '您给的太多了哟',showCancel: false}) :
        this.setData({rmbNum:e.detail.value||0,handlePrice:(allPrice-e.detail.value).toFixed(2)})
    }
})