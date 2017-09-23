// pages/user/willincome/will.js
Page({

    /**
    * 页面的初始数据
    */
    data: {
        isShow:true,
        incomeList: [
            {
                time:"2017-09-23 14:45:30",
                send:"已发货",
                pay:"1233123",
                sendNum:123.5
            },{
                time:"2017-09-23 14:45:30",
                send:"已发货",
    
                pay:"1233123",
                sendNum:123.5 
            }
        ],
        content:[
            {
                url:"/image/gf.png",
                tit:"今天是个好日子呀，心想的事儿都能成。啦啦啦",
                brand:"辣妹子",
                make:"123",
                spec:1
            },{
                url:"/image/gf.png",
                tit:"今天是个好日子呀，心想的事儿都能成。啦啦啦",
                brand:"辣妹子",
                make:"123",
                spec:2
            },
        ]
    },

    /**
    * 生命周期函数--监听页面加载
    */
    onLoad: function (options) {

    },

    /**
    * 生命周期函数--监听页面初次渲染完成
    */
    onReady: function () {

    },

    /**
    * 生命周期函数--监听页面显示
    */
    onShow: function () {

    },

    /**
    * 生命周期函数--监听页面隐藏
    */
    onHide: function () {

    },

    /**
    * 生命周期函数--监听页面卸载
    */
    onUnload: function () {

    },

    /**
    * 用户点击右上角分享
    */
    onShareAppMessage: function () {

    }
})