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
        wx.setNavigationBarTitle({
          title: options.name
        });
        let card = wx.getStorageSync('UserCard'),
            show = wx.getStorageSync('seller'),
            db = wx.getStorageSync('dbid'),
            ifHave = false;
            if(card.distribution_id!=''){
                if((card.distribution_id!=''&&db== '')||card.distribution_id==db) {
                    ifHave = true;
                }else{
                    ifHave = false;
                }
            }else{
                ifHave = false;
            }
        this.setData({
            moreId:options.id,//从查看更多的id
            title:options.name,//传过来的标题名字
            brandId:options.brandid,//分类页面品牌ID
            code:options.codeid,//
            userId:card.user_id,
            dbId:card.distribution_id,
            dbLv:card.distribution_level,
            newbrandId:options.newbrandid,//首页品牌ID
            dbShow:ifHave
        })
        this.getMoreGoodsInfo();
    },
    //查看更多的信息
    getMoreGoodsInfo() {
        let isId = this.data.moreId,
            listId = this.data.brandId,
            codeId = this.data.code,
            newbrandId = this.data.newbrandId;
        // 品牌商品进入时调用
        if(listId) {
            const data = {
                data: {
                    brandid:listId,
                },
                type:1
            };
            utils.sendRequest(api.AllGoodsUrl, data, this.handleMoreBrandSucc.bind(this)); 
        };
        //分类商品进入
        if(newbrandId) {
            const data = {
                data: {
                    goodstypecode:newbrandId,
                },
                type:1
            };
            utils.sendRequest(api.AllGoodsUrl, data, this.handleNewBrandSucc.bind(this)); 
        };
        // 分类商品进入时调用
        if(codeId) {
            const data = {
                data: {
                    goodstypecode:codeId,
                },
                type:1
            };
            utils.sendRequest(api.AllGoodsUrl, data, this.handleMoreClassifySucc.bind(this)); 
        }
        // 更多商品进入时调用和banner进入
        if(isId) {
            const data = {
                zhuti_id:isId,
                type:1
            };
            utils.sendRequest(api.IndexUrl, data, this.handleMoreGoodsSucc.bind(this)); 
        };
    },
    //请求更多商品成功处理函数 
    handleMoreGoodsSucc(res) {
        let goodsInfo = res.data.data;
        this.setData({
            moreGoods : goodsInfo
        })
    },
    //请求品牌商品成功处理函数 
    handleMoreBrandSucc(res) {
        let brandInfo = '';
        res.data.error == 100 ? brandInfo = true :brandInfo = false;
        this.setData({
            brandList : res.data.data,
            error:brandInfo
        });
    },
    handleNewBrandSucc(res) {
        console.log(res)
        let brandInfo = '';
        res.data.error == 100 ? brandInfo = true :brandInfo = false;
        this.setData({
            brandList : res.data.data,
            error:brandInfo
        });
    },
    // 请求分类商品成功处理函数
    handleMoreClassifySucc(res) {
        console.log(res)
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
    },
    //添加购物车
    handleAddGoods(e) {
        let goodsId = e.target.dataset.id,
            dbId =  e.target.dataset.db,
            id = this.data.dbId,
            index = e.target.dataset.index,
            list = this.data.brandList;
         if (dbId == 0) {
                list[index].distribution_goods = 1;//改变页面显示效果
                this.setData({
                    brandList:list
                });
                const data = {
                    goodsId:goodsId
                };
                utils.sendRequest(api.DistributionAdd, data, this.handleAddDbSucc.bind(this))
            }else {
                list[index].distribution_goods = 0;
                this.setData({
                    brandList:list
                })
                const data = {
                    goodsId:goodsId
                };
                utils.sendRequest(api.DistributionDel, data, this.handleDelDbSucc.bind(this))
            }
    },
    //上下架特殊商品
    handleDbGoods(e) {
        let goodsId = e.target.dataset.id,
            dbId =  e.target.dataset.db,
            id = this.data.dbId,
            index = e.target.dataset.index,
            list = this.data.moreGoods;
         if (dbId == 0) {
                list[index].distribution_goods = 1;//改变页面显示效果
                this.setData({
                    moreGoods:list
                });
                const data = {
                    goodsId:goodsId
                };
                utils.sendRequest(api.DistributionAdd, data, this.handleAddDbSucc.bind(this))
            }else {
                list[index].distribution_goods = 0;
                this.setData({
                    moreGoods:list
                })
                const data = {
                    goodsId:goodsId
                };
                utils.sendRequest(api.DistributionDel, data, this.handleDelDbSucc.bind(this))
            }

    },
    handleAddDbSucc(res) {
        res.data.error == 0 ? wx.showModal({content: '上架成功~',showCancel: false}):'';
    },
    handleDelDbSucc(res) {
        res.data.error == 0 ? wx.showModal({content: '下架成功~',showCancel: false}):'';
    }
})