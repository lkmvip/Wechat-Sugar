const api = require('../../../utils/api.js');//封装好的接口路径
const utils = require('../../../utils/util.js');//调用封装的request

Page({
    data: {
        tabs: ["全部","待付款","待收货","已收货"],
        activeIndex: "0",
        allOrder:[],
        show:false,
        text:"导航"
    },
    onLoad(options) {
        console.log(options)
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 3500
        });
        let card = wx.getStorageSync('UserCard');
        this.setData({
            activeIndex: options.id,
            userId:card.user_id,
            dbId:card.distribution_id,
            way:options.way

        });
        this.handleGetList();
        let status = this.data.activeIndex,
            userId = this.data.userId,
            dbId = this.data.dbId;
        if (status == 1) {//未付款
            this.getWeiFuKuan();
        }
        if (status == 2) {//待收货
            this.getDaiShouHuo();
        }
        if (status == 3) {//已收货
            this.getYiShouHuo();
        }
    },
    onShow() {
        this.handleGetList();
    },
    getWeiFuKuan () {
    let status = this.data.activeIndex;
            let buyWay = this.data.way;
        const data ={
                status:1,
                orderBy:'',
                buyStatus:buyWay
            };
        utils.sendRequest(api.OrderInfoList, data, this.handleWillPaySucc.bind(this));

    },
    getDaiShouHuo() {
        let status = this.data.activeIndex;
                let buyWay = this.data.way;
            const data ={
                    status:3,
                    orderBy:'',
                    buyStatus:buyWay
                };
            utils.sendRequest(api.OrderInfoList, data, this.handleWillTakeSucc.bind(this));
    },
    getYiShouHuo() {
        let status = this.data.activeIndex;
                let buyWay = this.data.way;
            const data ={
                    status:4,
                    orderBy:'',
                    buyStatus:buyWay
                };
            utils.sendRequest(api.OrderInfoList, data, this.handleTakeDownSucc.bind(this));
    },
    //tab选项操作
    tabClick(e) {
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 3500
        });
        this.setData({
            activeIndex: e.currentTarget.id
        });
        let status = this.data.activeIndex,
            userId = this.data.userId,
            dbId = this.data.dbId;
        if (status == 1) {//未付款
            this.getWeiFuKuan();
        }
        if (status == 2) {//待收货
            this.getDaiShouHuo();
        }
        if (status == 3) {//已收货
            this.getYiShouHuo();
        }
    },
    handleGetList() {// 获取全部订单列表
        let buyWay = this.data.way;
        const data ={
                    status:'',
                    orderBy:'',
                    buyStatus:buyWay
                };
        utils.sendRequest(api.OrderInfoList, data, this.handleOrderInfoListSucc.bind(this));
    },
    handleOrderInfoListSucc(res) {
        console.log(res)
        wx.showToast({title: '加载成功',icon: 'success'});      
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
        this.setData({
            TakeDownOrder:res.data.data.reverse()
        })
    },
    // 操作订单状态 取消订单
    handleCancelOredr(e) {
        let id = e.target.dataset.id,
            userId = this.data.userId;
            wx.showModal({
                content:'您真的要取消订单么？',
                showCancel:true,
                confirmColor:'#3cc51f',//默认值为#3cc51f
                success:res=>{
                        if(res.confirm){
                            const data ={
                                        admin_userid:userId,
                                        order_id:id,
                                        type:''
                                    };
                            utils.sendRequest(api.CancelOredr, data, this.handleCancelOredrSucc.bind(this));
                        }
                    }
                })
    },
    //取消订单成功处理逻辑
    handleCancelOredrSucc(res) {
        try {
            res.data ?
            wx.showModal({content: '取消成功，期待您下次宠幸~',showCancel: false})
            :
            wx.showModal({content: '出错啦，工程师正在抢修~',showCancel: false});
            this.handleGetList();
            this.getWeiFuKuan();//调取新数据
        } catch(e) {
            // statements
            console.log(e);
        }
    },
    // 操作订单状态 申请退款
    handleCancelMoney(e) {
        let id = e.target.dataset.id,
            userId = this.data.userId;
            wx.showModal({
                content:'您真的要申请退款么？',
                showCancel:true,
                confirmColor:'#3cc51f',//默认值为#3cc51f
                success:res=>{
                        if(res.confirm){
                            const data ={
                                        user_id:userId,
                                        order_id:id
                                    };
                            utils.sendRequest(api.CancelMoney, data, this.handleCancelMoneySucc.bind(this));
                        }
                    }
                })
    },
    //申请退款成功处理逻辑
    handleCancelMoneySucc(res){
        try {
            res.data ?
            wx.showModal({content: '申请成功，请您耐心等待~',showCancel: false})
            :
            wx.showModal({content: '出错啦，工程师正在抢修~',showCancel: false});
            this.handleGetList();
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
        let id = e.target.dataset.id,
            userId = this.data.userId;
        const data ={
                    user_id:userId,
                    order_id:id
                };
        utils.sendRequest(api.TakeGoods, data, this.handleTakeGoodsSucc.bind(this));
    },
    //确认收货成功处理逻辑 
    handleTakeGoodsSucc(res) {
        try {
            res.data ?
            wx.showModal({content: '收货成功，期待您下次光临~',showCancel: false})
            :
            wx.showModal({content: '出错啦，工程师正在抢修~',showCancel: false});
            this.handleGetList();
            this.getDaiShouHuo();
        } catch(e) {
            // statements
            console.log(e);
        }  
    },
    handleNavigation() {
        let flag = !this.data.show,
            txt = this.data.text;
        flag == true ? txt = "X" : txt="导航";
        this.setData({
            show:flag,
            text:txt
        })
    }
});