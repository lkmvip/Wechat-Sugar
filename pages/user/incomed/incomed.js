// pages/user/incomed/incomed.js
const api = require('../../../utils/api.js');//封装好的接口路径
const utils = require('../../../utils/util.js');//调用封装的request
Page({

  /**
   * 页面的初始数据
   */
    data: {

    },

    /**
    * 生命周期函数--监听页面加载
    */
    onLoad(options) {
        this.getIncomed();
        let card = wx.getStorageSync('UserCard');
        this.setData({
            dbId:card.distribution_id
        });
    },
    getIncomed() {
        let id = this.data.dbId;
        const data ={
                    distribution_id:id
                };
        utils.sendRequest(api.IncomeUrlEd, data, this.handleGetSucc.bind(this));
    },
    handleGetSucc(res) {
        console.log(res)
    }
})