// pages/detail/detail.js
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
        showDialog: false
         
    },

    /**
    * 生命周期函数--监听页面加载
    */
    onLoad: function (options) {

    },
    /**
    * 用户点击右上角分享
    */
    onShareAppMessage: function () {
      
      },
    handleAddLike: function(e) {
        let islike = this.data.likeIndex
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
    
    tabClick: function (e) {
        this.setData({
            activeIndex: e.currentTarget.id
        });
    },
    handleAddCart:function() {
         this.setData({
          showDialog: !this.data.showDialog
        });
    },
    handleGoIndex: function() {
        wx.navigateTo({
          url: '/pages/index/index'
        })
    },
    handleGoCart: function() {
        wx.navigateTo({
          url: '/pages/cart/index'
        })
    }
})