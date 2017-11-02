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
        isLoading1:true, 
        btnTxt:'加载中',
        btnTxt1:'加载中', 
        inputShowed: false,
        inputVal: "",
        searchList: [],
        isErr:0

    },

    onLoad(options) {
        this.getIndexInfo();
        this.getTabInfo();
        this.getBannerInfo();
        this.getAllGoodsInfo();
        // wx.getSystemInfo({
        //   success: this.handleGetHeight.bind(this)
        // });
    },
    // // 获取屏幕高度
    // handleGetHeight(res) {
    //     this.setData({
    //         windowHeight:res.windowHeight+'px'
    //     })
    // },
    //请求TabUrl函数
    getTabInfo() {
        const data = {
            limit:6
        };
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
        // 返回商品列表和品牌列表的信息
        let brandList = res.data.brandInfo,
            goodsInfo = res.data.data;
            console.log(goodsInfo)
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
        console.log(goods)
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
    //tab内容的显示隐藏
    switchIndex() {
        this.setData({
            index: 1,
            tabIndex : ''
        })
    },
    //上拉刷新商品信息
    onReachBottom() {
        let isPush = this.data.index,
            val = this.data.inputVal,
            err = this.data.isErr,
            load = this.data.isLoading,
            load1 = this.data.isLoading1;
        this.setData({
            isBtnShow: true 
        });

        if (isPush ==1&& load) {
        //关于上拉加载的性能优化
            setTimeout(()=>{
                    let num = this.data.limitIndex;
                    this.setData({
                        limitIndex: num+1
                    })
                    // 给后端传下拉刷新的次数+1
                    const data = {
                        limitIndex: this.data.limitIndex
                    };
                    utils.sendRequest(api.AllGoodsUrl, data, this.handleReachBottom.bind(this));
            },1500)
        };
        if (val != ''&& err == 0 && load1) {
            setTimeout(()=>{
                let num = this.data.limitIndex;
                    this.setData({
                        limitIndex: num+1
                    })
                    // 给后端传下拉刷新的次数+1
                    const data = {
                        limitIndex: this.data.limitIndex,
                         data:{
                            name: this.data.inputVal,
                        }
                    };
                    utils.sendRequest(api.AllGoodsUrl, data, this.handleLoadMore.bind(this));
            },1500)
        };
    },
    // 获取每次上拉数据的函数
    handleReachBottom(res) {
        const goods = res.data.data;
        const arr = [];
        goods.map((item,index)=> arr.push(item));
        // 拼接原数组+每次上拉加载获取的八条数据
        let moreList = this.data.allGoodsList.concat(arr);
            this.setData({
                allGoodsList: moreList
            })
        // 如果数据长度小于8 改变底部提示的内容
        if (goods.length < 8) {
            this.setData({
                btnTxt: '人家也是有底线的~',
                isLoading: false
            })
        }
    },
    //当用户点击键盘搜索按钮之后执行 商品搜索
    handleSearch(e) {
        this.setData({
            inputVal: e.detail.value
        });
        const data = {
            limitIndex:this.data.limitIndex,
            data:{
                name: this.data.inputVal,
            }
        };
        //传值给后端，获取到搜索的商品信息
        utils.sendRequest(api.AllGoodsUrl, data, this.handleSearchSucc.bind(this));
    },
    //搜索事件
    handleSearchSucc(res) {
        this.setData({
            searchList: res.data.data,
            isErr: res.data.error
        })
    },
    //当value为空的时候 搜索内容隐藏
    handleSearchValue(e) {
        if (e.detail.value == '') {
            this.setData({
                inputVal: e.detail.value
            });
        }
    },
    //搜索内容的数组拼接
    handleLoadMore(res) {
        const searchs=res.data.data,
            arr = [];
        searchs.map((item)=> arr.push(item));
        let moreList = this.data.searchList.concat(arr);
        this.setData({
            searchList: moreList
        });
        if (searchs.length < 8) {
            this.setData({
                btnTxt1: '人家也是有底线的~',
                isLoading1: false
            })
        };
    },
    //点击添加到购物车
    handleAddCart(e) {
        // 传商品信息 
        let goodsId = e.target.dataset.id,
            goodsName = e.target.dataset.name,
            goodsPrice = e.target.dataset.price,
            goodsit = e.target.dataset.it;
            if (goodsit == null|| goodsit<=0 ) {//库存判断
                wx.showModal({content: '库存不足抱歉哟~',showCancel: false})
            }else {
                const data = {
                    userid:3,
                    goodsId:goodsId,
                    goods_name:goodsName,
                    goods_price:goodsPrice,
                    goods_number:1
                };
                utils.sendRequest(api.AddGoodtoCart, data, this.handleAddGoodtoCartSucc.bind(this))
            } 
           
    },
    //调用成功添加购物车函数
    handleAddGoodtoCartSucc(res) {
        let code = res.statusCode;
        if(code == 200) {
            wx.showModal({
              content: '在购物车等您哟~',
              showCancel: false
            })
        }
    }
})
