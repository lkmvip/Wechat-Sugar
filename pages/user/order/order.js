Page({
    data: {
        tabs: ["全部订单","待付款","待收货","已收货"],
        activeIndex: "0",
        allOrder:[
            {orderNum:"1231231231231231",orderStatus:"已完成",orderName:"流量宝",orderPirce:"9999",orderSpec:"1"},
            {orderNum:"1231231231231231",orderStatus:"已完成",orderName:"流量宝",orderPirce:"9999",orderSpec:"1"}
        ]
    },
    onLoad: function () {

    },
    tabClick: function (e) {
        this.setData({
            activeIndex: e.currentTarget.id
        });
    }
});