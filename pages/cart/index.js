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
        carts:[
            // {id:1,title:'新鲜芹菜 新鲜芹菜  新鲜芹菜  新鲜芹菜 ',image:'/image/gf.png',num:1,price:0.01,selected:true,stock:1000},      
            // {id:2,title:'素米 500g',image:'/image/gf.png',num:1,price:100.80,selected:true,stock:800},      
            // {id:3,title:'素米 500g',image:'/image/gf.png',num:1,price:100.80,selected:true,stock:800},      
            // {id:4,title:'素米 500g',image:'/image/gf.png',num:1,price:100.80,selected:true,stock:800},      
            // {id:5,title:'素米 500g',image:'/image/gf.png',num:1,price:100.80,selected:true,stock:800},      
            // {id:6,title:'素米 500g',image:'/image/gf.png',num:1,price:100.80,selected:true,stock:800},      
            // {id:7,title:'素米 500g',image:'/image/gf.png',num:1,price:100.80,selected:true,stock:800},      
            // {id:8,title:'素米 500g',image:'/image/gf.png',num:1,price:100.80,selected:true,stock:800},      
            // {id:9,title:'素米 500g',image:'/image/gf.png',num:1,price:100.80,selected:true,stock:800},      
            // {id:10,title:'素米 500g',image:'/image/gf.png',num:1,price:100.80,selected:true,stock:800},     
            // {id:11,title:'素米 500g',image:'/image/gf.png',num:1,price:100.80,selected:true,stock:800}
        ],               // 购物车列表
        hasList:false,          // 列表是否有数据
        //totalPrice:0,         // 总价，初始为0
        selectAllStatus:true,    // 全选状态，默认全选,
        goodsNums:0
    },
    onLoad(options) {
        this.getCartInfo();
    },
    onShow() {
        // this.setData({
        //   hasList: true,
        // });
        // this.getTotalPrice();
    },
    getCartInfo() {
        const data ={
            userid:45
        };
        utils.sendRequest(api.CartInfo, data, this.handleCartInfo.bind(this));
    },
    handleCartInfo(res) {
        let list = res.data.result;
        console.log(list)
        this.setData({
            hasList: true,
            carts:list
        });
        this.getTotalPrice();

    },
  /**
   * 当前商品选中事件
   */
    selectList(e) {
        const index = e.currentTarget.dataset.index;
        let carts = this.data.carts;
        const selected = carts[index].select;
        carts[index].select = !selected;
        this.setData({
          carts: carts
        });
        this.getTotalPrice();
    },

  /**
   * 删除购物车当前商品
   */
    deleteList(e) {
        const index = e.currentTarget.dataset.index;
        let carts = this.data.carts;
        carts.splice(index,1);
        this.setData({
          carts: carts
        });
        if(!carts.length){
          this.setData({
            hasList: false
          });
        }else{
          this.getTotalPrice();
        }
    },

  /**
   * 购物车全选事件
   */
    selectAll(e) {
        let selectAllStatus = this.data.selectAllStatus;
        selectAllStatus = !selectAllStatus;
        let carts = this.data.carts;

        for (let i = 0; i < carts.length; i++) {
          carts[i].select = selectAllStatus;
        }

        this.setData({
          selectAllStatus: selectAllStatus,
          carts: carts
        });
        this.getTotalPrice();
    },

  /**
   * 绑定加数量事件
   */
    addCount(e) {
        // console.log(e)
        const index = e.currentTarget.dataset.index;
        let carts = this.data.carts;
        let num = parseInt(carts[index].goods_number);
        num = num + 1;
        carts[index].goods_number = num;
        this.setData({
          carts: carts
        });
        this.getTotalPrice();
    },

  /**
   * 绑定减数量事件
   */
    minusCount(e) {
        const index = e.currentTarget.dataset.index;
        let carts = this.data.carts;
        let num = parseInt(carts[index].goods_number);
        let goods = carts.length;                       
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
    // 清空购物车
    clearCart() {
        let _this = this
        wx.showModal({
          title: '提示',
          content: '您要清空购物车嘛？',
          success: function(res) {
            if (res.confirm) {
                _this.setData({ carts: [], totalPrice: 0,hasList:false }); 
            } else if (res.cancel) {

            }
          }
        })
    }
})