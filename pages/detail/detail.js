// pages/detail/detail.js
const api = require('../../utils/api.js');//封装好的接口路径
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
        let id = options.id,
            card = wx.getStorageSync('UserCard');
        this.setData({
            goodsId: id,
            userId:card.user_id,
            subId:card.subwebId
        })
        this.getDetailInfo();
        
    },
    onReady() {
        this.getCartGoodsNum();
    },
    //获取详情页数据
    getDetailInfo() {
        let id = this.data.goodsId,
            user = this.data.userId,
            sub = this.data.subId;
        const data ={
            goods_id:id,
            user_id:user,
            subwebId:sub
        };
        utils.sendRequest(api.DetailInfoUrl, data, this.handleDetailInfo.bind(this));
    },
    //处理成功详情页函数
    handleDetailInfo(res) {
        let goodsList = res.data.data;
        this.setData({
            goodsInfo:goodsList
        })
        this.getDetailLike();
    },
    //获取猜你喜欢数据
    getDetailLike() {
        let id = this.data.goodsInfo[0].goodstypecode,
            sub = this.data.goodsInfo[0].id;
        const data ={
            data: {
                goodstypecode: id,
                not_eq_id: sub
            }, 
            orderBy: {
                value:"goodsnumber",
                sc:"desc"
            }
        };
        utils.sendRequest(api.AllGoodsUrl, data, this.handleDetailLike.bind(this));
    },
    handleDetailLike(res) {
        let result = res.data.data,
            len = result.length;
        result.splice(5,len-6)  
        this.setData({
            guessInfo:result
        })
    },
    //操作商品数据
    getCartGoodsNum() {
        let user = this.data.userId;
        const data ={
            userid:user
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
    handleAddLike(e) {
        let recid = e.target.dataset.recid,
            id = e.target.dataset.id,
            goods = this.data.goodsId;
        let user = this.data.userId;
        if(recid != 0) {
            wx.showToast({
              title: '取消收藏',
              icon: 'success',
              duration: 2000,
              mask:true
            })
            const data ={
                userid:user,
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
                userid:user,
                id:id
            };
            utils.sendRequest(api.LikeInfoAdd, data, this.handleAddLikeSucc.bind(this)); 
        }
    },
    //收藏成功处理逻辑
    handleAddLikeSucc(res) {
        let list = this.data.goodsInfo;
        list[0].rec_id = res.data.rec_id;
        this.setData({
            goodsInfo:list
        })
    },
    //取消收藏处理逻辑
    handleCancelLikeSucc(res) {
        let list = this.data.goodsInfo;
        list[0].rec_id = res.data.error;
        this.setData({
            goodsInfo:list
        })
    },                                   
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
        let user = this.data.userId;

        if (!this.data.showDialog) {
            if (goodsit == null|| goodsit<=0 ) {//库存判断
                wx.showModal({content: '库存不足抱歉哟~',showCancel: false})
            }else{
                const data = {
                    userid:user,
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
        let user = this.data.userId;
            
        if (!this.data.showDialog) {
             if (goodsit == null|| goodsit<=0 ) {//库存判断
                wx.showModal({content: '库存不足抱歉哟~',showCancel: false})
            }else{
                const data = {
                    userid:user,
                    goodsId:goodsId,
                    goods_name:goodsName,
                    goods_price:goodsPrice,
                    goods_number:num
                };
                //加入购物车接口
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
    //热门商品跳转
    handleGoDetail(e) {
        let isId = e. currentTarget.dataset.id;
        wx.redirectTo({
            url: '/pages/detail/detail?id='+isId
        });
    },
    //点击添加到购物车
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
    //调用成功添加购物车函数
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