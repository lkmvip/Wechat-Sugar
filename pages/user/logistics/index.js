// pages/user/logistics/index.js
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
        let id = options.id;
        this.setData({
            num:id
        })
        // console.log(options)
        this.getListInfo(id);
        this.getListCode(id);
    },
    getListInfo(id){
            const data ={
                shopId:id
            };
            utils.sendRequest(api.GetLogisticsInfo, data, this.handleListInfoSucc.bind(this));
    },
    getListCode(id){
        const data ={
                shopId:id
        };
        utils.sendRequest(api.GetLogisticsCode, data, this.handleListCodeSucc.bind(this));
    },
    handleListInfoSucc(res) {
        let list = JSON.parse(res.data);
        this.setData({
            msgList:list.data.reverse()
        })
        console.log(this.data.msgList)
    },
    handleListCodeSucc(res) {
        this.setData({
            company: res.data
        })
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

    },

    /**
    * 生命周期函数--监听页面隐藏
    */
    onHide() {

    },

    /**
    * 生命周期函数--监听页面卸载
    */
    onUnload() {

    },

    /**
    * 页面相关事件处理函数--监听用户下拉动作
    */
    onPullDownRefresh() {

    },

    /**
    * 页面上拉触底事件的处理函数
    */
    onReachBottom() {

    },

    /**
    * 用户点击右上角分享
    */
    onShareAppMessage() {

    }
})