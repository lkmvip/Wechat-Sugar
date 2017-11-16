const api = require('../../../utils/api.js');//封装好的接口路径
const utils = require('../../../utils/util.js');//调用封装的request

Page({
    data: {
        tabs: ["全部订单","待付款","待收货","已收货"],
        activeIndex: "0",
        allOrder:[]
    },
    onLoad(options) {
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 3500
        });
        this.setData({
            activeIndex: options.id
        });
        this.handleGetList();
        let status = this.data.activeIndex;
        if (status == 1) {//未付款
            const data ={
                    user_id:3,
                    status:1,
                    orderBy:'',
                    distribution_id:''
                };
            utils.sendRequest(api.OrderInfoList, data, this.handleWillPaySucc.bind(this));
        }
        if (status == 2) {//待收货
            const data ={
                    user_id:3,
                    status:3,
                    orderBy:'',
                    distribution_id:''
                };
            utils.sendRequest(api.OrderInfoList, data, this.handleWillTakeSucc.bind(this));
        }
        if (status == 3) {//已收货
            const data ={
                    user_id:3,
                    status:4,
                    orderBy:'',
                    distribution_id:''
                };
            utils.sendRequest(api.OrderInfoList, data, this.handleTakeDownSucc.bind(this));
        }
    },
    onShow() {
        this.handleGetList();
    },
    tabClick(e) {
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 3500
        });
        this.setData({
            activeIndex: e.currentTarget.id
        });
        let status = this.data.activeIndex;
        if (status == 1) {//未付款
            const data ={
                    user_id:3,
                    status:1,
                    orderBy:'',
                    distribution_id:''
                };
            utils.sendRequest(api.OrderInfoList, data, this.handleWillPaySucc.bind(this));
        }
        if (status == 2) {//待收货
            const data ={
                    user_id:3,
                    status:3,
                    orderBy:'',
                    distribution_id:''
                };
            utils.sendRequest(api.OrderInfoList, data, this.handleWillTakeSucc.bind(this));
        }
        if (status == 3) {//已收货
            const data ={
                    user_id:3,
                    status:4,
                    orderBy:'',
                    distribution_id:''
                };
            utils.sendRequest(api.OrderInfoList, data, this.handleTakeDownSucc.bind(this));
        }
    },
    handleGetList() {// 获取全部订单列表
        const data ={
                    user_id:3,
                    status:'',
                    orderBy:'',
                    distribution_id:''
                };
        utils.sendRequest(api.OrderInfoList, data, this.handleOrderInfoListSucc.bind(this));
    },
    handleOrderInfoListSucc(res) {
        wx.showToast("请求完成");
        console.log(res)
        this.setData({//反转数组 
            allOrder:res.data.data.reverse()
        })
    },
    handleWillPaySucc(res) {
        wx.showToast({title: '加载成功',icon: 'success'});      
        this.setData({
            WillPayOrder:res.data.data.reverse()
        })
    },
    handleWillTakeSucc(res) {
        wx.showToast({title: '加载成功',icon: 'success'});      
        this.setData({
            WillTakeOrder:res.data.data.reverse()
        })
    },
    handleTakeDownSucc(res) {
        wx.showToast({title: '加载成功',icon: 'success'});   
        console.log(res)
        this.setData({
            TakeDownOrder:res.data.data.reverse()
        })
    },
    // 操作订单状态 取消订单
    handleCancelOredr(e) {
        let id = e.target.dataset.id;
        console.log(e.target.dataset.id)
        const data ={
                    admin_userid:3,
                    order_id:id,
                    type:''
                };
        utils.sendRequest(api.CancelOredr, data, this.handleCancelOredrSucc.bind(this));
    },
    handleCancelOredrSucc(res) {
        try {
            res.data ?
            wx.showModal({content: '取消成功，期待您下次宠幸~',showCancel: false})
            :
            wx.showModal({content: '出错啦，工程师正在抢修~',showCancel: false});
        } catch(e) {
            // statements
            console.log(e);
        }
    },
    // 操作订单状态 申请退款
    handleCancelMoney(e) {
        let id = e.target.dataset.msg;
        const data ={
                    user_id:3,
                    order_id:id,
                    type:1
                };
        utils.sendRequest(api.CancelMoney, data, this.handleCancelMoneySucc.bind(this));
    },
    handleCancelMoneySucc(res){
        try {
            res.data ?
            wx.showModal({content: '申请成功，请您耐心等待~',showCancel: false})
            :
            wx.showModal({content: '出错啦，工程师正在抢修~',showCancel: false});
        } catch(e) {
            // statements
            console.log(e);
        }  
    },
    handleWatchMsg(e) {
        //跳转到物流信息页面
        let msg = e.target.dataset.msg;
        wx.navigateTo({
            url: '../logistics/index?id='+msg
        })
    },
    handleTakeGoods(e) {//确认收货操作
        let id = e.target.dataset.id;
        console.log(id)
        const data ={
                    user_id:3,
                    order_id:id
                };
        utils.sendRequest(api.TakeGoods, data, this.handleTakeGoodsSucc.bind(this));
    },
    handleTakeGoodsSucc(res) {
        try {
            res.data ?
            wx.showModal({content: '收货成功，期待您下次光临~',showCancel: false})
            :
            wx.showModal({content: '出错啦，工程师正在抢修~',showCancel: false});
        } catch(e) {
            // statements
            console.log(e);
        }  
    }
});