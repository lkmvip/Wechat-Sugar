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
        notNeed:false,
        abc:123
         
    },

    /**
    * 生命周期函数--监听页面加载
    */
    onLoad(options) {
        options.db? wx.setStorageSync('dbid', options.db) :'';
        utils.login(this.handleLogin.bind(this),this.handleReset.bind(this));
        wx.showToast({
            icon: "loading",
            title: "正在加载"
        })
        let id = options.id;
        this.setData({
            goodsId: id,
            abc:options.abc,
        })
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
            userId:card.user_id,
            subId:card.subwebId,
            dbId:card.distribution_id,
            dbLv:card.distribution_level,
            dbShow:ifHave,
            dbCanshu:db
        })
        this.getDetailInfo();
    },
    handleLogin(res) {
        try {
            wx.setStorageSync('UserCard', res.data)//验证用户身份
            res.data.distribution_id == 0?wx.setStorageSync('seller', false):wx.setStorageSync('seller', true);
            
        } catch (e) {    
            console.log(e)
        }
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
            userId:card.user_id,
            subId:card.subwebId,
            dbId:card.distribution_id,
            dbLv:card.distribution_level,
            dbShow:ifHave,
            dbCanshu:db
        })
        this.getDetailInfo();
    },
    handleReset() {
        if (res.confirm) {
                wx.openSetting({
                  success: res => {
                        utils.login(this.handleLogin.bind(this),this.handleReset.bind(this));
                    }
                });
        }
    },
    onShow() {
        this.getCartGoodsNum();
        this.getDetailInfo();
    },
    //获取详情页数据
    getDetailInfo() {
        let id = this.data.goodsId,
            user = this.data.userId,
            sub = this.data.subId,
            dbId = this.data.dbId,
            dbLv = this.data.dbLv,
            dbstatus = this.data.dbCanshu;
        const data ={
            goods_id:id,
            user_id:user,
            subwebId:sub,
            distribution:dbstatus

        };
        utils.sendRequest(api.DetailInfoUrl, data, this.handleDetailInfo.bind(this));
    },
    //处理成功详情页函数
    handleDetailInfo(res) {
        let goodsList = res.data.data,
            shopinfo;
            goodsList[0].storeInfo == undefined ? shopinfo = false : shopinfo = true;
        this.setData({
            goodsInfo:goodsList,
            shopMsg :shopinfo
        })
        this.getDetailLike();
        this.getGoodsList();
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
    tabClick(e) {
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
    // 加入购物车
    handleAddCart(e) {
        let teshu = this.data.special;

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
                showCancel: false,
            })
            this.setData({
                num:1
            })
        }
        this.getCartGoodsNum()
    },
    // 弹窗上的关闭
    handleClosedModel() {
        this.setData({
            showDialog: false,
            num:1
        });
    },
    // 前往订单页面
    handleGoPay(e) { 
        let teshu = this.data.special;      
        if (this.data.goodsId>0) {
            this.setData({
              showDialog: !this.data.showDialog
            });
        }
        let goodsId = e.target.dataset.id,
            goodsName = e.target.dataset.name,
            goodsPrice = e.target.dataset.price,
            num = this.data.num,
            _this = this,
            goodsit = e.target.dataset.it,
            user = this.data.userId;
        if (this.data.goodsId>0) {
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
        }else {
            let lv = this.data.goodsInfo[0].special_rank,
                dbLv= this.data.dbLv;
                if( lv && dbLv == 2){
                    wx.showModal({content: '您已经是代理商~',showCancel: false})
                    return false;
                }else if(lv && dbLv == 1){
                    wx.showModal({content: '您已经是服务商~',showCancel: false})
                    return false;
                }else {
                    if(lv == 3){
                        wx.showModal({content: '您已经是超级会员~',showCancel: false})
                        return false;
                    }
                }
                const data = {
                        userid:user,
                        goodsId:goodsId,
                        goods_name:goodsName,
                        goods_price:goodsPrice,
                        goods_number:1
                    };
                utils.sendRequest(api.AddGoodtoCart, data, this.handleDbGoPaySucc.bind(this))
        }
    },
    //请求成功后跳转
    handleGoPaySucc(res) {
        let code = res.statusCode,
            goodsid = res.data.rec_id,
            num = this.data.num,
            sub = this.data.goodsInfo[0].id,
            dbCanshu = this.data.dbCanshu;

        if (code == 200) {
            wx.redirectTo({
              url: '/pages/orderdetail/index?cartid='+goodsid+'&val='+num+'&pid='+sub
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
        let num = this.data.num,
            list = Number(this.data.goodsInfo[0].inventory);
        if (num>list) {
            wx.showModal({content: '库存不足抱歉哟~',showCancel: false})     
        }else {    
            num = num + 1;
            this.setData({
              num: num
            });  
        } 
    },
    inputCount(e) {
        let num = e.detail.value,
            list = Number(this.data.goodsInfo[0].inventory);
        if (num>list) {
            wx.showModal({content: '库存不足抱歉哟~',showCancel: false})
        }
        num == 0||num>list? num = 1:num;
        this.setData({
            num:num
        })
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
    onShareAppMessage() {
        let id = this.data.goodsId,
            dbId = this.data.dbId,
            dbCanshu = this.data.dbCanshu,
            shareid = '';
            dbCanshu ==''? shareid = dbId:shareid = dbCanshu;
        let text = this.data.goodsInfo;
        return {
            title: text[0].name+'。惊爆价：'+text[0].price+'元',
            path: "pages/detail/detail?id="+id+"&db="+shareid
        }
    },
    handleDbGoPaySucc(res) {
        let code = res.statusCode,
            goodsid = res.data.rec_id;
        if (code == 200) {
            wx.redirectTo({
              url: '/pages/orderdetail/index?cartid='+goodsid
            })
        }
    },
    handleAddCartLike(e) {
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
    getGoodsList() {
        let id = this.data.goodsInfo[0].goodstypecode;
        const data = {
            data:{
                not_goodstypecode:id,
                goodstypecode:id.substring(0,4)
            },
            orderBy:{
                value:"goodsnumber",
                sc:"desc"
            },
            limit:30,
            limitIndex:0
        };
        utils.sendRequest(api.AllGoodsUrl, data, this.handleGoodsListSucc.bind(this))

    },
    handleGoodsListSucc(res) {
        this.setData({
            specialList:res.data.data
        })
    }
})