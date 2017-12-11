// pages/user/willincome/will.js
const api = require('../../../utils/api.js');//封装好的接口路径
const utils = require('../../../utils/util.js');//调用封装的request
Page({

    /**
    * 页面的初始数据
    */
    data: {
        isShow:true,
        incomeList: []
    },

    /**
    * 生命周期函数--监听页面加载
    */
    onLoad(options) {
        let card = wx.getStorageSync('UserCard');
        this.setData({
            userId:card.user_id,
            userLv : card.distribution_level,
            userDbId: card.distribution_id
        });
        const data ={
        };
        //调用主要信息，获取余额。
        utils.sendRequest(api.UserInComeNotProfit, data, this.handleWillComeSucc.bind(this));
    },
    handleWillComeSucc(res) {
        console.log(res)
        let inComeList = res.data[1].data;
        inComeList.map(item => item.pay_time = utils.formatTimeSec(new Date(Number(item.pay_time)*1000)));
        this.setData({
            incomeList:inComeList
        })
    },
    /**
    * 生命周期函数--监听页面初次渲染完成
    */
})