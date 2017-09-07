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

    switchTab(e){
        this.setData({
            toView : e.target.dataset.id,
            tabIndex : e.target.dataset.index
        })
    }

})
