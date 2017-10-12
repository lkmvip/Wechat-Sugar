// pages/seemore/seemore.js
const api = require('../../utils/api.js');//封装好的借口路径
const utils = require('../../utils/util.js');//调用封装的request

Page({

    /**
    * 页面的初始数据
    */
    data: {
        moreId: '',
        moreGoods: '',
        title:''
    },

    /**
    * 生命周期函数--监听页面加载
    */
    onLoad(options) {
        wx.setNavigationBarTitle({
          title: options.name
        })
        this.setData({
            moreId:options.id,
            title:options.name
        })
        this.getMoreGoodsInfo();

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

    },
    getMoreGoodsInfo() {
        let isId = this.data.moreId;
        const data = {
            id:isId,
            type:1
        };
        utils.sendRequest(api.IndexUrl, data, this.handleMoreGoodsSucc.bind(this));
    },
    //请求IndexUrl成功处理函数 
    handleMoreGoodsSucc(res) {
        let goodsInfo = res.data.data,
            arr = [];
        goodsInfo.map((item) => arr.push(item.goods))
        this.setData({
            moreGoods : arr
        })
        // console.log(goodsInfo)
        console.log(this.data.moreGoods)
    }, 
})