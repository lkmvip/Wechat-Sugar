const api = require('../../utils/api.js');//封装好的接口路径
const utils = require('../../utils/util.js');//调用封装的request
Page({
    data: {
    	userInfo: {},
        posShow:false
    },

    onLoad() {
        let user = wx.getStorageSync("UserInFo"),
            card = wx.getStorageSync('UserCard'),
            show = wx.getStorageSync('seller'),
            db = wx.getStorageSync('dbid');
    	this.setData({
    		userInfo : user,
            userLv : card.distribution_level,
            userDbId: card.distribution_id,
            dbShow:show,
            userId:card.user_id,
            dbCanshu:db
    	})
        this.getYuEInfo();
        this.getShouEInfo();
        this.getDaiShouInfo();
    },
    onShow() {
        let user = wx.getStorageSync("UserInFo"),
            card = wx.getStorageSync('UserCard'),
            show = wx.getStorageSync('seller'),
            db = wx.getStorageSync('dbid');
        this.setData({
            userInfo : user,
            userLv : card.distribution_level,
            userDbId: card.distribution_id,
            dbShow:show,
            userId:card.user_id,
            dbCanshu:db
        })
        this.getYuEInfo();
        this.getShouEInfo();
        this.getDaiShouInfo();
    },
    //余额接口
    getYuEInfo() {
        let id = this.data.userId;
        const data ={
            userId:id,
            status:2
        };
        //调用主要信息，获取余额。
        utils.sendRequest(api.UserMainMsg, data, this.handleUserMainSucc.bind(this));

    },
    //收益接口
    getShouEInfo() {
        const data1 ={
        };
        //调用收益。
        utils.sendRequest(api.UserShowInCome, data1, this.handleInComeSucc.bind(this));
    },
    //待收收益
    getDaiShouInfo() {
        const data2 = {
        };
        //调用收益。
        utils.sendRequest(api.ZhunBeiTiXian, data2, this.handleInTixianSucc.bind(this));
    },
    handleInTixianSucc(res) {
        this.setData({
            tel:res.data.tel
        })
    },
    handleUserMainSucc(res) {
        console.log(res)
        let info = this.data.userInfo;
            info.nickName = res.data.name;
        this.setData({
            rmb:res.data.accountbalance,
            specialStatus:res.data.specialStatus,
            userInfo:info
        });
        const data2 ={
            userName:res.data.name
        };
        //调用收益。
        utils.sendRequest(api.UserMainShare, data2, this.handleShareName.bind(this));
    },
    handleShareName(res) {
        this.setData({
            shopTit:res.data.title
        });
    },
    //累计收益和待收收益
    handleInComeSucc(res) {
        this.setData({
            WillInCome:res.data.notMoney,
            InComeAdd:res.data.readyMoney
        })
    },
  // 点击跳转到提现页面
    handleCash() {
        let tel = this.data.tel;
        if (tel!=''&&tel!="13111111111") {
            wx.navigateTo({
              url: '/pages/user/cash/cash'
            })
        }else {
            wx.navigateTo({
              url: '/pages/user/tel/tel?catch=true'// 判断是否绑定手机
            })
        }
    },
    //绑定手机页面
    handleBindPhone() {
        wx.navigateTo({
          url: '/pages/user/tel/tel'
        })
    },
    // 点击跳转到订单页面
    handleAllOrder() {
        wx.navigateTo({
          url: '/pages/user/order/order'
        })
    },
    //待付款
    handleWillPay(e) {
        let indexNum = e.currentTarget.dataset.id; 
        wx.navigateTo({
            url: '/pages/user/order/order?id='+indexNum
        })
    },
    // 跳转到待收收益
    handleWillIncome(e) {
        wx.navigateTo({
          url: "/pages/user/willincome/will"
        })
    },
    //跳转到累计收益
    handleIncomed(e) {
        wx.navigateTo({
          url: "/pages/user/incomed/incomed"
        })
    },
    //跳转到地址页面
    handleAddr() {
        wx.navigateTo({
          url: "/pages/user/addr/addr"
        })
    },
    //跳转到地址页面
    handleTicket() {
        wx.navigateTo({
          url: "/pages/user/ticket/ticket"
        })
    },
    //跳转到收藏页面
    handleLike() {
        wx.navigateTo({
          url: "/pages/user/like/like"
        })
    },
    //跳转到店铺设置页面
    handleShopSet() {
        wx.navigateTo({
          url: "/pages/user/shopset/set"
        })
    },
    //跳转到店铺管理页面
    handleShopHandle() {
        wx.navigateTo({
          url: "/pages/user/shophandle/handle?status=0"
        })
    },
    handleSpecial() {
        wx.navigateTo({
          url: "/pages/user/special/special"
        })
    },
    onShareAppMessage() {
        if (this.data.dbShow) {
            let id = this.data.userDbId,
            lv = this.data.userLv,
            name = this.data.shopTit,
            dbCanshu = this.data.dbCanshu,
            shareid = '';
            dbCanshu ==''? shareid = id:shareid = dbCanshu;
            return {
              title: name+'的美妆商城~',
              path: "pages/user/shophandle/handle?db="+shareid+"&sharelv="+lv+"&status=1"
            }
        }else {
           return {
                title: "最超值的正品美妆平台",
                path: "/pages/index/index"
           } 
        }
        
    },
    handlePosImg() {
        this.setData({
            posShow:true
        })
        const data1 ={};
        //调用收益。
        utils.sendRequest(api.CodeImgUrlInfo, data1, this.handlePosImgSucc.bind(this));
    },
    handlePosImgSucc(res) {
        this.setData({
            posCode:res.data
        })
    },
    handleClosePos() {
        this.setData({
            posShow:false
        })
    }

})