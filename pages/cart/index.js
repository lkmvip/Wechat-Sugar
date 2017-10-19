const api = require('../../utils/api.js');//封装好的借口路径
const utils = require('../../utils/util.js');//调用封装的request
Page({
    data: {
    	    likeList: [
            {   id:0,
                url:'/image/gf.png',
                title:"白熊化妆品，美肤多效面霜50g,白熊化妆品。",
                newPrice:"998",
                oldPrice:"1999",
            },
            {   id:1,
                url:'/image/gf.png',
                title:"白熊化妆品，美肤多效面霜50g,白熊化妆品。",
                newPrice:"998",
                oldPrice:"1999",
            },
            {   id:2,
                url:'/image/gf.png',
                title:"白熊化妆品，美肤多效面霜50g,白熊化妆品。",
                newPrice:"998",
                oldPrice:"1999",
            },
            {   id:3,
                url:'/image/gf.png',
                title:"白熊化妆品，美肤多效面霜50g,白熊化妆品。",
                newPrice:"998",
                oldPrice:"1999",
            },
            {   id:4,
                url:'/image/gf.png',
                title:"白熊化妆品，美肤多效面霜50g,白熊化妆品。",
                newPrice:"998",
                oldPrice:"1999",
            },
            {   id:5,
                url:'/image/gf.png',
                title:"白熊化妆品，美肤多效面霜50g,白熊化妆品。",
                newPrice:"998",
                oldPrice:"1999",
            },
        ],
        carts:[],               // 购物车列表
        hasList:false,          // 列表是否有数据
        //totalPrice:0,         // 总价，初始为0
        selectAllStatus:false,    // 全选状态，默认全选,
        goodsNums:0,
        CartIdList:[]
    },
    onLoad(options) {
        this.getCartInfo();
    },
    onShow() {
        this.getCartInfo();

    },
    getCartInfo() {
        const data ={
            userid:45
        };
        utils.sendRequest(api.CartInfo, data, this.handleCartInfo.bind(this));
    },
    handleCartInfo(res) {
        let list = res.data.result,
            arr = [];
            // console.log(list)
        list.map( item => arr.push(item.rec_id))
        this.setData({
            hasList: true,
            carts:list,
            CartIdList:arr
        });
        this.getTotalPrice();

    },
  /**
   * 删除购物车当前商品
   */
    deleteList(e) {
        const index = e.currentTarget.dataset.index,
              id = e.currentTarget.dataset.id;
        let carts = this.data.carts,
            cartIdList = this.data.CartIdList;
        wx.showModal({
          content: '您真的不要人家了嘛？',
          success: res => {
            if (res.confirm) {
                carts.splice(index,1);
                cartIdList.splice(index,1);
                this.setData({
                  carts: carts,
                  CartIdList:cartIdList
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
                    user_id:45,
                    rec_id:id

                };
                utils.sendRequest(api.CartDelInfo, data, this.handleCartDelInfo.bind(this));
              }
            } 
        })
    },
    //删除
    handleCartDelInfo(res) {

    },
  /**
   * 购物车全选事件
   */
    selectAll(e) {
        let selectAllStatus = this.data.selectAllStatus;
        selectAllStatus = !selectAllStatus;
        let carts = this.data.carts,
            arr = [];
            this.setData({// 为true的时候改成false
                selectAllStatus: selectAllStatus,
            })

            if(selectAllStatus == false) {// 当全选没有勾选的时候全部改变商品信息里的按钮为false
                for (let i = 0; i < carts.length; i++) {
                    carts[i].select = selectAllStatus;
                };
                this.setData({
                    carts: carts,
                    CartIdList:[]
                });
                this.getTotalPrice();
            }else {// 当全选勾选的时候全部改变商品信息里的按钮为true
                for (let i = 0; i < carts.length; i++) {
                  carts[i].select = selectAllStatus;
                    arr.push(carts[i].rec_id)
                };
                    this.setData({
                      carts: carts,
                      CartIdList:arr
                    });
                    this.getTotalPrice();
            };
    },
    
/**
   * 当前商品选中事件
   */
    selectList(e) {
        const index = e.currentTarget.dataset.index,//定义下标
            bindId = e.currentTarget.dataset.id;// 获取每一个点击的购物车ID
        let carts = this.data.carts,
            selected = carts[index].select,
            idList = this.data.CartIdList,// 获取页面加载是购物车数量数组
            arr = [];
        carts[index].select = !selected;
        this.getTotalPrice();
        if (selected != false) {// 点击选中的状态 不是 false时
            for (var i = 0, len = idList.length; i<len ; i++ ) {// 在这里处理点击每一个删除对应的结算数据
                if(idList[i] == bindId){//下标对应数据  等于 购物车id 时 才截取数据
                    idList.splice(i,1)
                };
            }
            this.setData({
                selectAllStatus: false
            })
        }else {
            idList.push(bindId)
        };
        // 修改 购物车ID 列表 点击结算时使用
        this.setData({
            CartIdList:idList
        })
    },
  /**
   * 绑定加数量事件
   */
    addCount(e) {
        const index = e.currentTarget.dataset.index;
        let carts = this.data.carts,
            num = parseInt(carts[index].goods_number),
            id = e.currentTarget.dataset.id;
        num = num + 1;
        carts[index].goods_number = num;
        this.setData({
          carts: carts
        });
        this.getTotalPrice();
        const data ={
            user_id:45,
            rec_id:id,
            amount:num

        };
        utils.sendRequest(api.UpdateGoodsAmount, data, this.handleUpdateGoodsAmount.bind(this));
    },
    handleUpdateGoodsAmount(res) {

    },
  /**
   * 绑定减数量事件
   */
    minusCount(e) {
        const index = e.currentTarget.dataset.index;
        let carts = this.data.carts,
            num = parseInt(carts[index].goods_number),
            id = e.currentTarget.dataset.id,
            goods = carts.length;//列表长度                     
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
            user_id:45,
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
        for(let i = 0; i<carts.length; i++) {         // 循环列表得到每个数据
          if(carts[i].select) {                     // 判断选中才会计算价格
            total += carts[i].goods_number * carts[i].goods_price;   // 所有价格加起来
          }
        }
        this.setData({                                // 最后赋值到data中渲染到页面
          carts: carts,
          totalPrice: total.toFixed(2),
        });
    },
    handleGoOrder() {
        let islist = this.data.CartIdList,
            isGo = this.data.selectAllStatus,
            carList = this.data.carts,
            isNext= " ";
            carList.map( item => {
                        if(item.select){
                            isNext = true;
                        }
                    })
                    if(isNext){
                            wx.redirectTo({
                                 //目的页面地址
                                 url: '../orderdetail/index?cartid='+islist,
                             
                            })
                    }else{
                        wx.showModal({
                          content: '在购物车等您哟~',
                          showCancel: false
                        })
                    }

    }
    // // 清空购物车   取消这个功能
    // clearCart() {
    //     let _this = this
    //     wx.showModal({
    //       content: '您要清空购物车嘛？',
    //       success: function(res) {
    //         if (res.confirm) {
    //             _this.setData({ carts: [], totalPrice: 0,hasList:false }); 
    //         } else if (res.cancel) {

    //         }
    //       }
    //     })
              // <navigator url="../orders/orders">
    // }
})