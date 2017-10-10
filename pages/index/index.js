//index.js
//获取应用实例
const app = getApp();
const api = require('../../utils/api.js');
const utils = require('../../utils/util.js');


Page({
    data: {
        code: "二维码",
        msg: "kefu",
        tab: [],
        tabIndex: 0,
        imgUrls: [],
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
        extendList: [],
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
        goodsList: [],
        addIndex: "",
        index: "",
        tabName : [],
        hasPlan : false,
        allGoodsList: [],
        limitIndex: 1,
        isBtnShow:false,
        isLoading:true,
        btnTxt:'加载中'

    },

    onLoad(options) {
        this.getIndexInfo();
        this.getTabInfo();
        this.getBannerInfo();
        this.getAllGoodsInfo();

    },
    //请求TabUrl函数
    getTabInfo() {
        const data = {};
        utils.sendRequest(api.TabUrl, data, this.handleGetTabSucc.bind(this));
    },
    //请求IndexUrl函数 
    getIndexInfo() {
        const data = {};
        utils.sendRequest(api.IndexUrl, data, this.handleGetIndexSucc.bind(this));
    },
    //请求BannerUrl函数   
    getBannerInfo() {
        const data = {};
        utils.sendRequest(api.BannerUrl, data, this.handleGetBannerSucc.bind(this));
    },
    //请求AllGoodsUrl函数   
    getAllGoodsInfo() {
        const data = {
            limitIndex:this.data.limitIndex
        };
        utils.sendRequest(api.AllGoodsUrl, data, this.handleGetAllSucc.bind(this));
    },
    //请求TabUrl成功处理函数
    handleGetTabSucc(res) {
        let tabList = res.data.data;
        this.setData({
            tab : tabList
        })
    },
    //请求IndexUrl成功处理函数 
    handleGetIndexSucc(res) {
        let brandList = res.data.brandInfo,
            goodsInfo = res.data.data;
        this.setData({
            extendList : brandList,
            goodsList : goodsInfo
        })
    }, 
    //请求BannerUrl成功处理函数  
    handleGetBannerSucc(res){
        let bannerImg = res.data.data;
        this.setData({
            imgUrls: bannerImg
        }) 
    },
    //请求AllUrl成功处理函数  
    handleGetAllSucc(res) {
        // console.log(res.data)
        const goods = res.data.data;
        const arr = [];
        console.log(goods)
        for (var i = 0,len=goods.length; i <len ; i++){
            arr.push(goods[i])
        }
        // console.log(arr) 
        this.setData({
            allGoodsList : arr
        })
    },
    onShareAppMessage() {
        return {
            title: "最超值的正品美妆平台",
            path: "pages/index/index?name="+this.data.code
        }
    },
    // 头部分类
    switchTab(e) {
        this.setData({
            tabIndex : e.target.dataset.index,
            index: '',
        })
    },

    switchPlan(e) {
        this.setData({
            planIndex : e.currentTarget.dataset.index
        })
    },
    // 点击加入购物车
    handleAddGoods(e) {
        var addId = e.currentTarget.dataset.id,
            that = this;
        that.setData({
            addIndex : addId
        })
    },
    switchIndex() {
        this.setData({
            index: 1,
            tabIndex : ''
        })
    },
    //上拉刷新商品信息
    onReachBottom() {
        let isPush = this.data.index;
        if (isPush ==1) {
            let num = this.data.limitIndex;
            this.setData({
                limitIndex: num+1,
                isBtnShow: true
            })
            const data = {
                limitIndex: this.data.limitIndex
            };
            utils.sendRequest(api.AllGoodsUrl, data, this.handleReachBottom.bind(this));
        }
    },
    handleReachBottom(res) {
        const goods = res.data.data;
        const arr = [];
        let _this = this;
        for (var i = 0,len=goods.length; i <len ; i++){
            arr.push(goods[i])
        }
        let moreList = this.data.allGoodsList.concat(arr);
        setTimeout(function(){
            _this.setData({
                allGoodsList: moreList
            })
        },1500)
        if (goods.length < 8) {
            this.setData({
                btnTxt: '人家也是有底线的~',
                isLoading: false
            })
        }
    }

})
