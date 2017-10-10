//index.js
//获取应用实例
const app = getApp();
const api = require('../../utils/api.js');//封装好的借口路径
const utils = require('../../utils/util.js');//调用封装的request


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
        //传值给后端，获取到全部商品的首次信息
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
        const goods = res.data.data;
        const arr = [];
        goods.map((item,index)=> arr.push(item));
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
    // tab分类
    switchTab(e) {
        this.setData({
            tabIndex : e.target.dataset.index,
            index: '',
        })
    },
    //首页tab分类
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
    //tab内容的显示隐藏
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
            // 给后端传下拉刷新的次数+1
            const data = {
                limitIndex: this.data.limitIndex
            };
            utils.sendRequest(api.AllGoodsUrl, data, this.handleReachBottom.bind(this));
        }
    },
    // 获取每次上拉数据的函数
    handleReachBottom(res) {
        const goods = res.data.data;
        const arr = [];
        let _this = this;
        goods.map((item,index)=> arr.push(item));
        console.log(arr)
        // 拼接原数组+每次上拉加载获取的八条数据
        let moreList = this.data.allGoodsList.concat(arr);
        // 关于上拉加载的性能优化
        this.batterDode(moreList);
        
        // 如果数据长度小于8 改变底部提示的内容
        if (goods.length < 8) {
            this.setData({
                btnTxt: '人家也是有底线的~',
                isLoading: false
            })
        }
    },
    // 关于上拉加载的性能优化的两个函数
    batterDode(list) {
        setTimeout(this.isTimeOut(list),1500)
    },
    isTimeOut(list) {
        let _this = this;
        _this.setData({
            allGoodsList: list
        })
    }

})
