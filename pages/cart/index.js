const api = require('../../utils/api.js');//封装好的接口路径
const utils = require('../../utils/util.js');//调用封装的request
Page({
    data: {
        likeList: [],
        carts:[],               // 购物车列表
        hasList:false,          // 列表是否有数据
        //totalPrice:0,         // 总价，初始为0
        selectAllStatus:false,    // 全选状态，默认全选,
        goodsNums:0
    },
    onLoad(options) {
        this.getCartInfo();
        let card = wx.getStorageSync('UserCard');
        this.setData({
            userId:card.user_id
        })
        this.getlikeInfo();

    },
    onShow() {
        this.getCartInfo();
    },
    //获取猜你喜欢数据
    getlikeInfo() {
        const data ={
                limit:4,  
                limitIndex:0
            };
        utils.sendRequest(api.AllGoodsUrl, data, this.handleHotInfo.bind(this));
    },
    handleHotInfo(res) {
        let list = res.data.data;
        this.setData({
            likeList: list
        });
    },
    //获取购物车信息
    getCartInfo() {
        let userId = this.data.userId;
        const data ={
            userid:userId
        };
        utils.sendRequest(api.CartInfo, data, this.handleCartInfo.bind(this));
    },
    handleCartInfo(res) {// 这里让史伟给我加了一个 select 的字段
        let list = res.data.result;
        if (list.length > 0 ) {
            this.setData({
                hasList: true,
                carts:list,
            });
        }else {
            this.setData({
                hasList: false
            });
        }
        this.getTotalPrice();
    },
  /**
   * 删除购物车当前商品
   */
    deleteList(e) {
        const index = e.currentTarget.dataset.index,
              id = e.currentTarget.dataset.id;
        let carts = this.data.carts;
        let userId = this.data.userId;
        wx.showModal({
          content: '您真的不要人家了嘛？',
          success: res => {
            if (res.confirm) {//当用户点击确定后 操作购物车数据的数组
                carts.splice(index,1);
                this.setData({
                  carts: carts,
                });
                if(!carts.length){
                  this.setData({
                    hasList: false,
                    selectAllStatus:false
                  });
                }else{
                  this.getTotalPrice();
                };
                const data ={
                    user_id:userId,
                    rec_id:id

                };
                utils.sendRequest(api.CartDelInfo, data, this.handleCartDelInfo.bind(this));
              }
            } 
        })
    },
    //删除
    handleCartDelInfo(res) {},
  /**
   * 购物车全选事件
   */
    selectAll(e) {
        let selectAllStatus = this.data.selectAllStatus;
        selectAllStatus = !selectAllStatus;
        let carts = this.data.carts;
            this.setData({// 为true的时候改成false
                selectAllStatus: selectAllStatus,
            })

            if(selectAllStatus == false) {// 当全选没有勾选的时候全部改变商品信息里的按钮为false
                carts.map( item => {
                    item.select = selectAllStatus
                })
                this.getTotalPrice();
            }else {// 当全选勾选的时候全部改变商品信息里的按钮为true
                carts.map( item => {
                    item.select = selectAllStatus
                })
                this.getTotalPrice();
            };
    },
    
/**
   * 当前商品选中事件
   */
    selectList(e) {
        const index = e.currentTarget.dataset.index;// 获取每一个点击的购物车ID
        let carts = this.data.carts,
            selected = carts[index].select;
        carts[index].select = !selected;
        this.getTotalPrice();
        if (selected != false) {// 点击选中的状态 不是 false时
            this.setData({
                selectAllStatus: false
            })
            
        };
    },
  /**
   * 绑定加数量事件
   */
    addCount(e) {
        const index = e.currentTarget.dataset.index;
        let carts = this.data.carts,
            num = parseInt(carts[index].goods_number),
            id = e.currentTarget.dataset.id;
        let userId = this.data.userId;

        num = num + 1;
        carts[index].goods_number = num;
        this.setData({
          carts: carts
        });
        this.getTotalPrice();
        const data ={
            user_id:userId,
            rec_id:id,
            amount:num

        };
        utils.sendRequest(api.UpdateGoodsAmount, data, this.handleUpdateGoodsAmount.bind(this));
    },
    handleUpdateGoodsAmount(res) {},
  /**
   * 绑定减数量事件
   */
    minusCount(e) {
        const index = e.currentTarget.dataset.index;
        let carts = this.data.carts,
            num = parseInt(carts[index].goods_number),
            id = e.currentTarget.dataset.id,
            goods = carts.length;//列表长度 
        let userId = this.data.userId;
                                
        if(num <= 1){
          return false;
        }
        num = num - 1;
        carts[index].goods_number = num;
        this.setData({
          carts: carts,
          goodsNums: goods

        });
        this.getTotalPrice();
        const data ={
            user_id:userId,
            rec_id:id,
            amount:num

        };
        utils.sendRequest(api.UpdateGoodsAmount, data, this.handleUpdateGoodsAmount.bind(this));
    },

  /**
   * 计算总价
   */
    getTotalPrice() {
        let carts = this.data.carts;             // 获取购物车列表
        let total = 0;
        // 循环列表得到每个数据,判断选中才会计算价格, 所有价格加起来
        carts.map(item => item.select?total += item.goods_number * item.goods_price:'')
        // 最后赋值到data中渲染到页面
        this.setData({                                
          carts: carts,
          totalPrice: total.toFixed(2),
        });
    },
    //去支付页面
    handleGoOrder() {
        let carList = this.data.carts,
            isNext = false,
            newArr = [];
            carList.map( item => {
                        if(item.select){
                            isNext = true;
                            newArr.push(item.rec_id)//跳转页面传值的数组
                        }
            });
            isNext ?
            wx.navigateTo({url: '../orderdetail/index?cartid='+newArr})
            :
            wx.showModal({content: '请选一个嘛~',showCancel: false});
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
                    this.getCartInfo();
        }
    }
        
})