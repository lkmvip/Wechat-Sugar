// pages/seemore/seemore.js
const api = require('../../utils/api.js');//封装好的接口路径
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
        code:'',
        error:0
    },

    /**
    * 生命周期函数--监听页面加载
    */
    onLoad(options) {
        console.log(options)
        wx.setNavigationBarTitle({
          title: options.name
        });
        let card = wx.getStorageSync('UserCard');
        this.setData({
            moreId:options.id,
            title:options.name,
            brandId:options.brandid,//分类页面品牌ID
            code:options.codeid,
            userId:card.user_id,
            dbId:card.distribution_id,
            dbLv:card.distribution_level,
            newbrandId:options.newbrandid//首页品牌ID
        })
        this.getMoreGoodsInfo();
    },
    /**
    * 用户点击右上角分享
    */
    onShareAppMessage() {

    },
    getMoreGoodsInfo() {
        let isId = this.data.moreId,
            listId = this.data.brandId,
            codeId = this.data.code,
            newbrandId = this.data.newbrandId;
        let id = this.data.dbId,
            lv = this.data.dbLv;
        // 品牌商品进入时调用
        if(listId) {
            const data = {
                distribution_id:id,
                distribution_level:lv,
                data: {
                    brandid:listId,
                }
            };
            utils.sendRequest(api.AllGoodsUrl, data, this.handleMoreBrandSucc.bind(this)); 
        };
        if(newbrandId) {
            const data = {
                distribution_id:id,
                distribution_level:lv,
                data: {
                    goodstypecode:newbrandId,
                }
            };
            utils.sendRequest(api.AllGoodsUrl, data, this.handleNewBrandSucc.bind(this)); 
        };
        // 分类商品进入时调用
        if(codeId) {
            const data = {
                distribution_id:id,
                distribution_level:lv,
                data: {
                    goodstypecode:codeId,
                }
            };
            utils.sendRequest(api.AllGoodsUrl, data, this.handleMoreClassifySucc.bind(this)); 
        }
        // 更多商品进入时调用
        if(isId.length<5) {
            const data = {
                distribution_id:id,
                distribution_level:lv,
                id:isId,
                type:1
            };
            utils.sendRequest(api.IndexUrl, data, this.handleMoreGoodsSucc.bind(this)); 
        }else {
            const data = {
                distribution_id:id,
                distribution_level:lv,
                zhuti_id:isId
            };
            utils.sendRequest(api.IndexUrl, data, this.handleMoreGoodsSucc.bind(this)); 
        };
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
        console.log(res)
        let brandInfo = '';
        res.data.error == 100 ? brandInfo = true :brandInfo = false;
        this.setData({
            brandList : res.data.data,
            error:brandInfo
        });
    },
    handleNewBrandSucc(res) {
        let brandInfo = '';
        res.data.error == 100 ? brandInfo = true :brandInfo = false;
        this.setData({
            brandList : res.data.data,
            error:brandInfo
        });
    },
    // 请求分类商品成功处理函数
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
            goodsPrice = e.target.dataset.price,
            goodsit = e.target.dataset.it,
            userId = this.data.userId;
            if (goodsit == null|| goodsit<=0 ) {//库存判断
                wx.showModal({content: '库存不足抱歉哟~',showCancel: false})
            }else {
                const data = {
                    userid:userId,
                    goodsId:goodsId,
                    goods_name:goodsName,
                    goods_price:goodsPrice,
                    goods_number:1
                };
                utils.sendRequest(api.AddGoodtoCart, data, this.handleAddGoodtoCartSucc.bind(this))
            } 
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