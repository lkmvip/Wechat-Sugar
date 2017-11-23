// pages/user/ticket/ticket.js
const api = require('../../../utils/api.js');//封装好的接口路径
const utils = require('../../../utils/util.js');//调用封装的request
Page({
    data: {
        tabs: ["未使用","已使用","已过期"],
        activeIndex: "0",
        hasTicket:false
    },
    onLoad(options) {
        options.way? this.setData({
            tabs: ["可用","不可用"],
            way:2
        }):'';
        this.setData({
            activeIndex: options.id
        });
        let card = wx.getStorageSync('UserCard');
        this.setData({
            dbId:card.distribution_id,
            subId:card.subwebId,
            subName:card.subwebName,
            userId:card.user_id,
            cartId:options.cartid,
            addrId:options.addrid
        });
        this.getTicketInfo();
    },
    //选项卡
    tabClick(e) {
        this.setData({
            activeIndex: e.currentTarget.id
        });
    },
    getTicketInfo() {
        let id = this.data.userId,
            name = this.data.subName,
            subId = this.data.subId;
        const data ={
                    branchId:subId,
                    param:{
                        "userId":id,
                        "status":'-1',
                        "pageSize":'200',
                        "pageIndex":'1',
                        'orderby':'addTime',
                        'sortby':'desc'
                    }
                };
        utils.sendRequest(api.TicketInfoUrl, data, this.handleGetSucc.bind(this));
    },
    handleGetSucc(res) {
        let has = [],
            used = [],
            timeOut = [];
        // 判断优惠券的状态分别存入三个数组
        res.data.data.map(item => {
            item.startTime = utils.formatTime(new Date(item.startTime));
            item.endTime =  utils.formatTime(new Date(item.endTime));
            if(item.couponStatus==0){
                has.push(item)
            }else if(item.couponStatus==1) {
                used.push(item)
            }else if(item.couponStatus==2) {
                timeOut.push(item)
            }
        })
        this.setData({
            ticketList:has,
            usedList:used,
            timeOutList:timeOut
        })
    },
    handleUseTicket(e) {
        let id = e.currentTarget.dataset.id,
            num = e.currentTarget.dataset.num,
            carId = this.data.cartId,
            addrId = this.data.addrId;
            console.log(id,num)
            wx.redirectTo({
                url: '/pages/orderdetail/index?ticketid='+id+'&&ticketnum='+num+'&&cartid='+carId+'&&addrid='+addrId
            });
    }
})