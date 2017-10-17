// pages/user/ticket/ticket.js
Page({
    data: {
        tabs: ["未使用","已使用","已过期"],
        activeIndex: "0",
        hasTicket:false
    },
    onLoad(options) {
        this.setData({
            activeIndex: options.id
        });
    },
    tabClick(e) {
        this.setData({
            activeIndex: e.currentTarget.id
        });
    },
    stopDrag(){
        return false;
    }
});