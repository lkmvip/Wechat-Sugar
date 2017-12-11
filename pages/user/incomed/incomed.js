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
        let card = wx.getStorageSync('UserCard');
        const data ={//收益接口
                    user_id:card.user_id,
                    distribution_id:card.distribution_id,
                    distribution_level:card.distribution_level
                };
        utils.sendRequest(api.UserInComeProfit  , data, this.handleGetSucc.bind(this));
    },
    handleGetSucc(res) {
        let arr = res.data[0],
            ready = res.data[1].readyMoney;
        this.setData({
            day_money:arr.day_money,
            day_money_special:arr.day_money_special,
            last_month_money:arr.last_month_money,
            last_month_money_special:arr.last_month_money_special,
            last_week_money:arr.last_week_money,
            last_week_money_special:arr.last_week_money_special,
            month_money:arr.month_money,
            month_money_special:arr.month_money_special,
            week_money:arr.week_money,
            week_money_special:arr.week_money_special,
            all:ready
        })
    }
})