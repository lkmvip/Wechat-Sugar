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
        this.getListInfo(id);
        this.getListCode(id);
    },
    getListInfo(id){//获取物流信息
            const data ={
                shopId:id
            };
            utils.sendRequest(api.GetLogisticsInfo, data, this.handleListInfoSucc.bind(this));
    },
    getListCode(id){//获取物流公司
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
    },
    handleListCodeSucc(res) {
        this.setData({
            company: res.data
        })
    }
})