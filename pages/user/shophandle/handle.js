const api = require('../../../utils/api.js');//封装好的接口路径
const utils = require('../../../utils/util.js');//调用封装的request
// pages/user/shophandle/handle.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      goodsList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
    onLoad(options) {
        console.log(options)
        let card = wx.getStorageSync('UserCard'),
            show = wx.getStorageSync('seller');
            console.log(card,show)
            this.setData({
                userId:card.user_id,
                dbId:card.distribution_id,
                dbLv:card.distribution_level,
                dbShow:show,
                db:options.db,
                slv:options.sharelv
        })
        this.getShopInfo();
        this.getShopList();
    },
    getShopInfo() {
        let id = this.data.dbId,
            lv = this.data.dbLv,
            db = this.data.db,
            slv = this.data.slv;
            console.log(db)
        const data = {
                    distribution_id:id,
                    distribution:db
            };
        utils.sendRequest(api.GetHandleShop, data, this.HandleShopSucc.bind(this)); 
    },
    HandleShopSucc(res){
        console.log(res)
        this.setData({
            name:res.data.data.storename,
            text:res.data.data.store_contents,
            src:res.data.data.storelogo,
            sign:res.data.data.storeimg
        })
    },
    getShopList() {
        let id = this.data.dbId,
            lv = this.data.dbLv,
            db = this.data.db,
            slv = this.data.slv;
        const data = {
                distribution_id:id, 
                distribution_level:lv,
                distribution:db,
                share_level:slv,
                limit:''
            };
        utils.sendRequest(api.DistributionGoods, data, this.HandleShopListSucc.bind(this)); 
    },
    HandleShopListSucc(res) {
        this.setData({
            goodsList:res.data
        })
    },
    handleDbGoods(e) {
        let goodsId = e.target.dataset.id,
            dbId =  e.target.dataset.db,
            id = this.data.dbId,
            index = e.target.dataset.index,
            list = this.data.goodsList;
        if (dbId == 0) {
                list[index].distribution_goods = 1;//改变页面显示效果
                console.log(list[index])
                this.setData({
                    goodsList:list
                });
                const data = {
                    goodsId:goodsId,
                    distribution_id:id
                };
                utils.sendRequest(api.DistributionAdd, data, this.handleAddDbSucc.bind(this))
            }else {
                list[index].distribution_goods = 0;
                this.setData({
                    goodsList:list
                })
                const data = {
                    goodsId:goodsId,
                    distribution_id:id
                };
                utils.sendRequest(api.DistributionDel, data, this.handleDelDbSucc.bind(this))
            }
    },
    handleAddDbSucc(res) {
        res.data.error == 0 ? wx.showModal({content: '上架成功~',showCancel: false}):'';
    },
    handleDelDbSucc(res) {
        res.data.error == 0 ? wx.showModal({content: '下架成功~',showCancel: false}):'';
    },
    handleAddCart(e) {
        // 传商品信息 
        let userId = this.data.userId;
        let goodsId = e.target.dataset.id,
            goodsName = e.target.dataset.name,
            goodsPrice = e.target.dataset.price,
            goodsit = e.target.dataset.it;

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
    handleAddGoodtoCartSucc(res) {
        let code = res.statusCode;
        if(code == 200) {
            wx.showModal({
              content: '在购物车等您哟~',
              showCancel: false
            })
        }
    }
})