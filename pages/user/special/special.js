const api = require('../../../utils/api.js');//封装好的接口路径
const utils = require('../../../utils/util.js');//调用封装的request
// pages/user/special/special.js
Page({

  /**
   * 页面的初始数据
   */
    data: {
        tabs: ["普通","特殊"],
        activeIndex: "0",
    },

  /**
   * 生命周期函数--监听页面加载
   */
    onLoad(options) {
        this.getShopInfo();
        this.getSpecialList();
    },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
    onReady() {
      
    },

      /**
       * 生命周期函数--监听页面显示
       */
    onShow() {
  
    },//店铺信息
    getShopInfo() {
        const data = {
                    status:0
            };
        utils.sendRequest(api.GetHandleShop, data, this.HandleShopSucc.bind(this)); 
    },
    HandleShopSucc(res){
        this.setData({
            name:res.data.data.storename,
            text:res.data.data.store_contents,
            src:res.data.data.storelogo,
            sign:res.data.data.storeimg
        })
    },
    tabClick(e) {
        this.setData({
            activeIndex: e.currentTarget.id
        });
    },
    getSpecialList() {
        const data = {
               
            };
        utils.sendRequest(api.UserMsgGoods, data, this.HandleSpecialListSucc.bind(this)); 
    },
    HandleSpecialListSucc(res) {
        let sOne = [],sTwo = [];
        res.data.data.map( item => {item.id >= -2? sOne.push(item):sTwo.push(item)})
        this.setData({
            specialList:sTwo,
            commonList:sOne,
            status:res.data.is_special,
            change:res.data.is_apply
        })
    },
    handleSubmit() {
        const data = {
               
            };
        utils.sendRequest(api.UserMsgSepecial, data, this.HandleSubmitSucc.bind(this));  
    },
    HandleSubmitSucc(res) {
        res.data.error == 0 ?  wx.showModal({
                content:'申请成功，正在飞速处理~',
                showCancel:false,
                confirmColor:'#3cc51f',//默认值为#3cc51f
                success:function(res){
                        if(res.confirm){
                            wx.switchTab({
                              url: '/pages/user/index'
                            })
                        }
                    }
                }): wx.showModal({
                content:res.data.err_msg,
                showCancel:false,
                confirmColor:'#3cc51f',//默认值为#3cc51f
                success:function(res){
                        if(res.confirm){
                            wx.switchTab({
                              url: '/pages/user/index'
                            })
                        }
                    }
                });
    }
})