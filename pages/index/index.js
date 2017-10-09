//index.js
//获取应用实例
const app = getApp();
const api = require('../../utils/api.js');

Page({
    data: {
        code: "二维码",
        msg: "kefu",
        tab: [],
        tabIndex: 0,
        imgUrls: [
            '/image/b1.jpg',
            '/image/b2.jpg',
            '/image/b3.jpg'
        ],
        indicatorDots: false,
        autoplay: false,
        interval: 3000,
        duration: 800,
        plan: [
            {text:'每日签到',url:'/image/index/sign.png'},
            {text:'限时购',url:'/image/index/time.png'},
            {text:'会员专享',url:'/image/index/vip.png'},
            {text:'拼团',url:'/image/index/shopteam.png'},
            {text:'分享领券',url:'/image/index/share.png'}
        ],
        planIndex: '',
        extendList: [],
        supplyList: [
            {id:0,url:'/image/gf1.png'},
            {id:1,url:'/image/gf1.png'},
        ],
        scrollList: [
            {id:0,url:'/image/gf.png'},
            {id:1,url:'/image/gf.png'},
            {id:2,url:'/image/gf.png'},
            {id:3,url:'/image/gf.png'},
            {id:4,url:'/image/gf.png'},
            {id:5,url:'/image/gf.png'},
            {id:6,url:'/image/gf.png'},
            {id:7,url:'/image/gf.png'}
        ],
        goodsList: [
        ],
        recommendList: [
            {   id:0,
                url:'/image/gf.png',
                title:"白熊化妆品，美肤多效面霜50g",
                price:"998",
                makeMoney: "500",
            },
            {   id:1,
                url:'/image/gf.png',
                title:"白熊化妆品，美肤多效面霜50g",
                price:"998",
                makeMoney: "500",
            },
            {   id:2,
                url:'/image/gf.png',
                title:"白熊化妆品，美肤多效面霜50g",
                price:"998",
                makeMoney: "500",
            }
        ],
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
        addIndex: "",
        index: "",
        tabName : [],
        hasPlan : false
    },

    onLoad: function (options) {
        wx.request({
              url: api.TabUrl,
              method:"POST",
              data: {
                    // limit: '',
                    // distribution: '',
                    // distributionLimit: '',
                    // orderBy: '',
                    // productLimit: '',
                    // id: '',
                    // code: 123

                },
              header: {
                  'content-type': 'application/json'
              },
              success: this.handleGetTabSucc.bind(this)
        });
        wx.request({
              url: api.IndexUrl,
              method:"POST",
              data: {
                },
              header: {
                  'content-type': 'application/json'
              },
              success: this.handleGetIndexSucc.bind(this)
        });

    },
    //请求TabUrl成功处理函数
    handleGetTabSucc: function(res) {
        let tabList = res.data.data;
        console.log(tabList)
        this.setData({
            tab : tabList
        })
    },
    //请求IndexUrl成功处理函数 
    handleGetIndexSucc: function(res) {
        console.log(res.data.data)
        let brandList = res.data.brandInfo,
            goodsInfo = res.data.data;
        this.setData({
            extendList : brandList,
            goodsList : goodsInfo
        })
    },  

    onShareAppMessage: function () {
        return {
            title: "最超值的正品美妆平台",
            path: "pages/index/index?name="+this.data.code
        }
    },
    // 头部分类
    switchTab: function(e) {
        this.setData({
            tabIndex : e.target.dataset.index,
            index: '',
        })
    },

    switchPlan: function(e) {
        this.setData({
            planIndex : e.currentTarget.dataset.index
        })
    },
    // 点击加入购物车
    handleAddGoods: function(e) {
        var addId = e.currentTarget.dataset.id,
            that = this;
        that.setData({
            addIndex : addId
        })
    },
    switchIndex: function() {
        this.setData({
            index: 1,
            tabIndex : ''
        })
    }

})
