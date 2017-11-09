var app = getApp();
const api = require('../../utils/api.js');//封装好的接口路径
const utils = require('../../utils/util.js');//调用封装的request
Page({
    data: {
    	userInfo: {}
    },

    onLoad() {
      let user = wx.getStorageSync("UserInFo");
    	// console.log(user)
    	this.setData({
    		userInfo : user
    	})
        const data ={
            userId:3
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
  // 点击跳转到提现页面
    handleCash() {
        wx.navigateTo({
          url: '/pages/user/cash/cash'
        })
    },
  // 点击跳转到订单页面
    // handleAllOrder() {
    //     wx.navigateTo({
    //       url: '/pages/user/order/order'
    //     })
    // },
  //待付款
    handleWillPay(e) {
        let indexNum = e.currentTarget.dataset.id; 
        wx.navigateTo({
            url: '/pages/user/order/order',
            success(res) {
                console.log(res)
            }
        })
    },
  // //待发货  
  //   handleWillSend(e) {
  //       let indexNum = e.currentTarget.dataset.id; 
  //       wx.navigateTo({
  //         url: '/pages/user/order/order?id='+indexNum
  //       })
  //   },
  // //待收货
  //   handleWillTake(e) {
  //       let indexNum = e.currentTarget.dataset.id; 
  //       wx.navigateTo({
  //         url: '/pages/user/order/order?id='+indexNum
  //       })
  //   },
  // 跳转到待收收益
    handleWillIncome(e) {
        wx.navigateTo({
          url: "/pages/user/willincome/will"
        })
    },
  //跳转到累计收益
    handleIncomed(e) {
        wx.navigateTo({
          url: "/pages/user/incomed/incomed"
        })
    },
    //跳转到地址页面
    handleAddr() {
        wx.navigateTo({
          url: "/pages/user/addr/addr"
        })
    },
    //跳转到地址页面
    handleTicket() {
        wx.navigateTo({
          url: "/pages/user/ticket/ticket"
        })
    },
    //跳转到收藏页面
    handleLike() {
        wx.navigateTo({
          url: "/pages/user/like/like"
        })
    },
    //跳转到店铺设置页面
    handleShopSet() {
        wx.navigateTo({
          url: "/pages/user/shopset/set"
        })
    },
    //跳转到店铺管理页面
    handleShopHandle() {
        wx.navigateTo({
          url: "/pages/user/shophandle/handle"
        })
    },

})