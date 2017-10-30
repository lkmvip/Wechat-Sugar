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
    getOrderInfo(id) {
        const data ={
            user:45,
            cart:id,
            address_id:'',
            val:'',
            product_id:''
        };
        utils.sendRequest(api.OrderList, data, this.handleOrderList.bind(this));
    },
    handleOrderList(res) {
        let result = res.data;
        this.setData({
            orderList: result.cartgoods,
            freightNum: result.freight.data,
            orderPrice: result.goodsmoney.data
        })
    },
    getAddrInfo(id) {
        console.log(id)
        const data ={
            user_id:3,
            status:'1',
            address_id:id
        };
        utils.sendRequest(api.GetAddrInfo, data, this.handleAddrList.bind(this));
    },
    handleAddrList(res) {
        let list = res.data.addressInfo;
        console.log(list)
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
    handleAddr() {
        wx.navigateTo({
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
    handleOrderPay() {
        let addrid = this.data.addrId,
            carid = this.data.cartId,
            reightrmb = this.data.freightNum,
            allprice = this.data.orderPrice;
        // wx.navigateTo({
        //     url: '/pages/orderpay/order'
        // })
        const data ={
            user_id:3,
            address_id:addrid,
            rec_id:carid,
            reight:reightrmb,
            totalPrice:allprice
        };
        // console.log(data)
        utils.sendRequest(api.NewOrderInfo, data, this.handleNewOrderInfo.bind(this));
    },
    //请求提交订单成功
    handleNewOrderInfo(res) {
        console.log(res)
    }
})