const api = require('../../../utils/api.js');//封装好的接口路径
const utils = require('../../../utils/util.js');//调用封装的request
// pages/user/shophandle/handle.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      goodsList: [
          {
              id: 0,
              url: '/image/gf.png',
              title: "白熊化妆品，美肤多效面霜50g",
              newPrice: "998",
              oldPrice: "1999",
              makeMoney: "500",
          },
          {
              id: 1,
              url: '/image/gf.png',
              title: "白熊化妆品，美肤多效面霜50g",
              newPrice: "998",
              oldPrice: "1999",
              makeMoney: "500",
          },
          {
              id: 2,
              url: '/image/gf.png',
              title: "白熊化妆品，美肤多效面霜50g",
              newPrice: "998",
              oldPrice: "1999",
              makeMoney: "500",
          }
      ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let card = wx.getStorageSync('UserCard');
        this.setData({
            userId:card.user_id,
            dbId:card.distribution_id,
            dbLv:card.distribution_level
    })
    this.getShopInfo();
  },
  getShopInfo() {
    let id = this.data.dbId,
            lv = this.data.dbLv;
    const data = {
                distribution_id:id
        };
    utils.sendRequest(api.GetHandleShop, data, this.HandleShopSucc.bind(this)); 
  },
  HandleShopSucc(res){
    console.log(res)
  }
})