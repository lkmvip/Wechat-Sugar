//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        code: "二维码",
        msg: "kefu",
        tab: [
            {name:'推荐',id:'tuijian'},
            {name:'店主推荐',id:'dianhzu'},
            {name:'护肤',id:'hufu'},
            {name:'彩妆',id:'caizhuang'},
            {name:'个户',id:'gehu'}
        ],
        tabIndex: 0,
        toView: "tuijian",
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
        extendList: [
            {id:0,url:'/image/gf.png'},
            {id:1,url:'/image/gf.png'},
            {id:2,url:'/image/gf.png'},
            {id:3,url:'/image/gf.png'},
            {id:4,url:'/image/gf.png'},
            {id:5,url:'/image/gf.png'},
            {id:6,url:'/image/gf.png'},
            {id:7,url:'/image/gf.png'}
        ],
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
            {   id:0,
                url:'/image/gf.png',
                title:"白熊化妆品，美肤多效面霜50g",
                newPrice:"998",
                oldPrice:"1999",
                makeMoney: "500",
            },
            {   id:1,
                url:'/image/gf.png',
                title:"白熊化妆品，美肤多效面霜50g",
                newPrice:"998",
                oldPrice:"1999",
                makeMoney: "500",
            },
            {   id:2,
                url:'/image/gf.png',
                title:"白熊化妆品，美肤多效面霜50g",
                newPrice:"998",
                oldPrice:"1999",
                makeMoney: "500",
            }
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
            }
        ]
    },

    onLoad: function () {
        console.log("onLoad")
    },

    onShareAppMessage: function () {
        return {
            title: "最超值的正品美妆平台",
            path: "pages/index/index"
        }
    },

    switchTab: function(e) {
        this.setData({
            toView : e.target.dataset.id,
            tabIndex : e.target.dataset.index
        })
    },

    switchPlan: function(e) {
        this.setData({
            planIndex : e.currentTarget.dataset.index
        })
    }

})
