// pages/orderdetail/index.js
const api = require('../../utils/api.js');//封装好的借口路径
const utils = require('../../utils/util.js');//调用封装的request
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      {name: 'ticket', value: '优惠卷',checked: 'true'}
    ],
    orderList:[],
    freightNum:'',
    orderPrice:'',
    cartId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
    onLoad(options) {
        let id = options.cartid,
            addrid = options.addrid;
        console.log(options)
        this.setData({
            cartId:id,
            addrId:addrid
        });
        this.getOrderInfo(id);
        this.getAddrInfo(addrid);
    },
    // 获取支付页面列表
    getOrderInfo(id) {
        const data ={
            user:3,
            cart:id,
            address_id:'',
            val:'',
            product_id:''
        };
        utils.sendRequest(api.OrderList, data, this.handleOrderList.bind(this));
    },
    handleOrderList(res) {
        let result = res.data;

        console.log(result)
        this.setData({
            orderList: result.cartgoods,
            freightNum: Number(result.new_freight),
            orderPrice: result.goodsmoney.data
        })
    },
    // 如果有 地址id 请求地址列表
    getAddrInfo(id) {
        const data ={
            user_id:3,
            status:'1',
            address_id:id
        };
        utils.sendRequest(api.GetAddrInfo, data, this.handleAddrList.bind(this));
    },
    handleAddrList(res) {
        let list = res.data.addressInfo;
        console.log(res)
        this.setData({
            addr: list[0].address,
            name: list[0].consignee,
            province: list[0].provinceName,
            city: list[0].cityName,
            district: list[0].districtName,
            addrId:list[0].address_id,
            phone:list[0].mobile
        })
    },
    /**
    * 生命周期函数--监听页面初次渲染完成
    */
    onReady () {
  
    },
    // 地址页面
    handleAddr() {
        wx.redirectTo({
            url: '/pages/user/addr/addr?cartid='+this.data.cartId
        })
    },
    checkboxChange(e) {
        console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    },
    handleTicket() {
        wx.navigateTo({
            url: '/pages/user/ticket/ticket'
        })
    },
    //提交订单
    handleOrderPay() {
        let addrid = this.data.addrId,
            carid = this.data.cartId,
            reightrmb = this.data.freightNum,
            allprice = this.data.orderPrice;
        const data ={
            user_id:3,
            rec_id:carid,
            totalPrice:allprice,
            post:{
                address_id:addrid,
                freight:reightrmb
            }
        };
        //请求生成订单接口
        utils.sendRequest(api.NewOrderInfo, data, this.handleNewOrderInfo.bind(this));
    },
    //请求提交订单成功
    handleNewOrderInfo(res) {
        try {
            let frt = this.data.freightNum;
            if (res.data.error == 0) {
                //处理传值
                let msg = JSON.stringify(res.data.data),
                id = this.data.cartId;
                wx.redirectTo({
                    url: '/pages/orderpay/order?msg='+msg+'&&count='+frt
                });
                const data ={
                    user_id:3,
                    rec_id:id
                };
                //点击提交订单清空购物车接口
                utils.sendRequest(api.DelOrderCar, data, this.handleCartDelInfo.bind(this));
            }
        } catch(e) {
            // statements
            console.log(e);
        }
    },
    handleCartDelInfo(res) {
    }
})