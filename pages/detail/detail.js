// pages/detail/detail.js
const api = require('../../utils/api.js');//封装好的借口路径
const utils = require('../../utils/util.js');//调用封装的request
Page({

    /**
    * 页面的初始数据
    */
    data: {
        likeIndex: false,
        tabs: ["详情","热门"],
        activeIndex: "0",
        saveList:[
            "正品保证",
            "名品授权",
            "七天退货"
        ],
        hotList:[],
        showDialog: false,
        on:0,
        num:1,
        goodsId:'',
        goodsInfo:[],
        likeNum:'',
        notNeed:false
         
    },

    /**
    * 生命周期函数--监听页面加载
    */
    onLoad(options) {
        let id = options.id;
        this.setData({
            goodsId: id
        })
        this.getDetailInfo();
    },
    onReady() {
        this.getCartGoodsNum();
    },
    /**
    * 用户点击右上角分享
    */
    onShareAppMessage: function () {
      
    },
    //获取详情页数据
    getDetailInfo() {
        let id = this.data.goodsId;
        const data ={
            goods_id:id
        };
        utils.sendRequest(api.DetailInfoUrl, data, this.handleDetailInfo.bind(this));
    },
    //处理成功详情页函数
    handleDetailInfo(res) {
        let goodsList = res.data.data;
        console.log(goodsList)
        this.setData({
            goodsInfo:goodsList
        })
    },
    getCartGoodsNum() {
        const data ={
            userid:3
        };
        utils.sendRequest(api.CartGoodsNum, data, this.handleCartNum.bind(this));
    },
    handleCartNum(res) {
        let num = res.data.result;
        this.setData({
            cartNums:num
        })
    },
    // 添加收藏
    handleAddLike: function(e) {
        let recid = e.target.dataset.recid,
            id = e.target.dataset.id,
            goods = this.data.goodsId;
        if(recid != 0) {
            wx.showToast({
              title: '取消收藏',
              icon: 'success',
              duration: 2000,
              mask:true
            })
            const data ={
                userid:3,
                id:id
            };
            utils.sendRequest(api.LikeInfoDel, data, this.handleCancelLikeSucc.bind(this));
        }
        if(recid == 0) {
            wx.showToast({
              title: '收藏成功',
              icon: 'success',
              duration: 2000,
              mask:true
            });
            const data ={
                userid:3,
                id:id
            };
            utils.sendRequest(api.LikeInfoAdd, data, this.handleAddLikeSucc.bind(this)); 
        }
    },
    handleAddLikeSucc(res) {
        let list = this.data.goodsInfo;
        list[0].rec_id = res.data.rec_id;
        this.setData({
            goodsInfo:list
        })
    },
    handleCancelLikeSucc(res) {
        let list = this.data.goodsInfo;
        list[0].rec_id = res.data.error;
        this.setData({
            goodsInfo:list
        })
    },                                   
    // ---------------------- 暂时不添加收藏这个功能 -----------------
    // 点击tab选项卡
    tabClick: function (e) {
        let ifget = e.currentTarget.id;
        if (ifget == 1) {
            const data ={
                limit:2,  
                limitIndex:0
            };
            utils.sendRequest(api.AllGoodsUrl, data, this.handleHotInfo.bind(this));
        }
        this.setData({
            activeIndex: e.currentTarget.id
        });
    },
    //请求热门商品的接口
    handleHotInfo(res) {
        let list = res.data.data;
         this.setData({
            hotList: list
        });
    },
    // 显示商品规格弹窗
    handleAddCart(e) {
        this.setData({
          showDialog: !this.data.showDialog
        });
        let goodsId = e.target.dataset.id,
            goodsName = e.target.dataset.name,
            goodsPrice = e.target.dataset.price,
            num = this.data.num,
            _this = this,
            goodsit = e.target.dataset.it;
        if (!this.data.showDialog) {
            if (goodsit == null|| goodsit<=0 ) {//库存判断
                wx.showModal({content: '库存不足抱歉哟~',showCancel: false})
            }else{
                const data = {
                    userid:3,
                    goodsId:goodsId,
                    goods_name:goodsName,
                    goods_price:goodsPrice,
                    goods_number:num
                };
                utils.sendRequest(api.AddGoodtoCart, data, _this.handleAddGoodtoCartSucc.bind(_this));
            }
            
        }
    },
    handleAddGoodtoCartSucc(res) {
        let code = res.statusCode;
        if(code == 200) {
            wx.showModal({
              content: '加入购物车成功',
              showCancel: false
            })
        }
        this.getCartGoodsNum()
    },
    // 弹窗上的关闭
    handleClosedModel() {
        this.setData({
          showDialog: false
        });
    },
    // 前往订单页面
    handleGoPay(e) {
        this.setData({
          showDialog: !this.data.showDialog
        });
        let goodsId = e.target.dataset.id,
            goodsName = e.target.dataset.name,
            goodsPrice = e.target.dataset.price,
            num = this.data.num,
            _this = this,
            goodsit = e.target.dataset.it;
        if (!this.data.showDialog) {
             if (goodsit == null|| goodsit<=0 ) {//库存判断
                wx.showModal({content: '库存不足抱歉哟~',showCancel: false})
            }else{
                const data = {
                    userid:3,
                    goodsId:goodsId,
                    goods_name:goodsName,
                    goods_price:goodsPrice,
                    goods_number:num
                };
                utils.sendRequest(api.AddGoodtoCart, data, _this.handleGoPaySucc.bind(_this));
            }
        }
    },
    //请求成功后跳转
    handleGoPaySucc(res) {
        let code = res.statusCode,
            goodsid = res.data.rec_id;
        if (code == 200) {
            wx.redirectTo({
              url: '/pages/orderdetail/index?cartid='+goodsid
            })
        }
    },
    // 前往首页
    handleGoIndex() {
        wx.switchTab({
          url: '/pages/index/index'
        })
    },
    // 前往购物车
    handleGoCart() {
        wx.switchTab({
          url: '/pages/cart/index'
        })
    },
    // 操作数量
    handleSpec(e) {
        this.setData({
            on:e.currentTarget.dataset.index
        })
    },
  /**
   * 绑定加数量事件
   */
    addCount(e) {
        let num = this.data.num;
        num = num + 1;
        this.setData({
          num: num
        });
    },

  /**
   * 绑定减数量事件
   */
    minusCount(e) {
        let num = this.data.num;                 
        if(num <= 1){
          return false;
        }
        num = num - 1
        this.setData({
          num: num

        });
    },
    handleGoDetail(e) {
        let isId = e. currentTarget.dataset.id;
        wx.redirectTo({
            url: '/pages/detail/detail?id='+isId
        });
    }
})