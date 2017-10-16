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
            "实体店铺",
            "微信支付认证",
            "正品保证",
            "七天无理由退换货。"
        ],
        hotList:[
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
        ],
        showDialog: false,
        on:0,
        num:1,
        goodsId:'',
        goodsInfo:[]
         
    },

    /**
    * 生命周期函数--监听页面加载
    */
    onLoad(options) {
        let id = options.id;
        this.setData({
            goodsId: id
        })
        console.log(this.data.goodsId)
        this.getDetailInfo();
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
        this.setData({
            goodsInfo:goodsList
        })
    },
    // 添加收藏
    handleAddLike: function(e) {
        let islike = this.data.likeIndex;
        this.setData({
            likeIndex : !islike
        });
        if (!islike) {
            wx.showToast({
              title: '收藏成功',
              icon: 'success',
              duration: 2000,
              mask:true
            })
        }else {
            wx.showToast({
              title: '取消收藏',
              icon: 'success',
              duration: 2000,
              mask:true
            })
        }
    },
    // 点击tab选项卡
    tabClick: function (e) {
        this.setData({
            activeIndex: e.currentTarget.id
        });
    },
    // 显示商品规格弹窗
    handleAddCart:function() {
        this.setData({
          showDialog: !this.data.showDialog
        });
        if (!this.data.showDialog) {
            wx.switchTab({
              url: '/pages/cart/index'
            })
        }
    },
    // 弹窗上的关闭
    handleClosedModel:function() {
        this.setData({
          showDialog: false
        });
    },
    // 前往订单页面
    handleGoPay:function() {
        this.setData({
          showDialog: !this.data.showDialog
        });
        if (!this.data.showDialog) {
            wx.navigateTo({
              url: '/pages/orderdetail/index'
            })
        }
    },
    // 前往首页
    handleGoIndex: function() {
        wx.switchTab({
          url: '/pages/index/index'
        })
    },
    // 前往购物车
    handleGoCart: function() {
        wx.switchTab({
          url: '/pages/cart/index'
        })
    },
    // 操作数量
    handleSpec: function(e) {
        console.log(e)
        this.setData({
            on:e.currentTarget.dataset.index
        })
    },
  /**
   * 绑定减数量事件
   */
    addCount(e) {
        let num = this.data.num;
        num = num + 1;
        this.setData({
          num: num
        });
        // this.getTotalPrice();
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
        // this.getTotalPrice();
    }
})