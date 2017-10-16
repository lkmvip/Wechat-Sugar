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
        title:'',
        brandId: '',
        brandList: [],
        code:''
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
            title:options.name,
            brandId:options.brandid,
            code:options.codeid
        })
        this.getMoreGoodsInfo();

    },
    /**
    * 页面上拉触底事件的处理函数
    */
    // onReachBottom() {

    // },

    /**
    * 用户点击右上角分享
    */
    onShareAppMessage() {

    },
    getMoreGoodsInfo() {
        let isId = this.data.moreId,
            listId = this.data.brandId,
            codeId = this.data.code;
        // 更多商品
        if(isId) {
            const data = {
                id:isId,
                type:1
            };
            utils.sendRequest(api.IndexUrl, data, this.handleMoreGoodsSucc.bind(this)); 
        };
        // 品牌商品
        if(listId) {
            const data = {
                module:0,
                data: {
                    brandid:listId,
                }
            };
            utils.sendRequest(api.AllGoodsUrl, data, this.handleMoreBrandSucc.bind(this)); 
        };
        if(codeId) {
            const data = {
                data: {
                    goodstypecode:codeId,
                }
            };
            utils.sendRequest(api.AllGoodsUrl, data, this.handleMoreClassifySucc.bind(this)); 
        }
    },
    //请求更多商品成功处理函数 
    handleMoreGoodsSucc(res) {
        let goodsInfo = res.data.data,
            arr = [];
        goodsInfo.map((item) => arr.push(item.goods))
        this.setData({
            moreGoods : arr
        })
    },
    //请求品牌商品成功处理函数 
    handleMoreBrandSucc(res) {
        let brandInfo = res.data.data;
        this.setData({
            brandList : brandInfo
        });
    },
    handleMoreClassifySucc(res) {
        let calssList = res.data.data;
        this.setData({
            brandList : calssList
        });
    },
        //点击添加到购物车
    handleAddCart(e) {
        // 传商品信息 
        let goodsId = e.target.dataset.id,
            goodsName = e.target.dataset.name,
            goodsPrice = e.target.dataset.price;
        const data = {
            userid:45,
            goodsId:goodsId,
            goods_name:goodsName,
            goods_price:goodsPrice,
            goods_number:1
        };
        utils.sendRequest(api.AddGoodtoCart, data, this.handleAddGoodtoCartSucc.bind(this));
    },
    //调用成功添加购物车函数
    handleAddGoodtoCartSucc(res) {
        let code = res.statusCode;
        if(code == 200) {
            wx.showModal({
              content: '加入购物车成功',
              showCancel: false
            })
        }
    }
})