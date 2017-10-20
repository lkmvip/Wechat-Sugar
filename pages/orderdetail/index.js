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
    orderPrice:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
    onLoad(options) {
        let id = options.cartid;
        this.getOrderInfo(id)
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
        console.log(res)
        let result = res.data;
        this.setData({
            orderList: result.cartgoods,
            freightNum: result.freight.data,
            orderPrice: result.goodsmoney.data
        })
    },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
    onReady () {
  
    },
    handleAddr() {
        wx.navigateTo({
            url: '/pages/user/addr/addr'
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
        wx.navigateTo({
            url: '/pages/orderpay/order'
        })
    }
})