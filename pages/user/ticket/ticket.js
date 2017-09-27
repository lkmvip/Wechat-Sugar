// pages/user/ticket/ticket.js
Page({
    data: {
        tabs: ["已使用","未使用"],
        activeIndex: "0",
        allOrder:[
            {orderNum:"1231231231231231",orderStatus:"已完成",orderName:"流量宝",orderPirce:"9999",orderSpec:"1",orderUrl:"/image/gf.png"},
            {orderNum:"1231231231231231",orderStatus:"已完成",orderName:"流量宝",orderPirce:"9999",orderSpec:"1",orderUrl:"/image/gf.png"},
            {orderNum:"1231231231231231",orderStatus:"已完成",orderName:"流量宝",orderPirce:"9999",orderSpec:"1",orderUrl:"/image/gf.png"},
            {orderNum:"1231231231231231",orderStatus:"已完成",orderName:"流量宝",orderPirce:"9999",orderSpec:"1",orderUrl:"/image/gf.png"},
            {orderNum:"1231231231231231",orderStatus:"已完成",orderName:"流量宝",orderPirce:"9999",orderSpec:"1",orderUrl:"/image/gf.png"}
        ]
    },
    onLoad: function (options) {
        this.setData({
            activeIndex: options.id
        });
    },
    tabClick: function (e) {
        this.setData({
            activeIndex: e.currentTarget.id
        });
    }
});