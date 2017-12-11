//index.js
//获取应用实例
const api = require('../../utils/api.js');//封装好的接口路径
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
        planIndex: '',
        extendList: [],
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
        //用户授权操作
         utils.login(this.handleLogin.bind(this),this.handleReset.bind(this));
    },
    handleLogin(res) {
        wx.showToast({
            icon: "loading",
            title: "正在加载"
        })
        try {
            wx.setStorageSync('UserCard', res.data)//验证用户身份
            res.data.distribution_id == 0?wx.setStorageSync('seller', false):wx.setStorageSync('seller', true);
            
        } catch (e) {    
            console.log(e)
        }
        let card = wx.getStorageSync('UserCard'),
            show = wx.getStorageSync('seller'),
            db = wx.getStorageSync('dbid'),
            ifHave = false;
        if(show&&db== '') {
            console.log(1)
            ifHave = true;
        }else if (card.distribution_id==db) {
            console.log(2)

            ifHave = true;
        }else if (card.distribution_id!=db) {
            console.log(3)

            ifHave = false;
        }else {
            console.log(4)

            ifHave = false;
        };
        this.setData({
            userId:card.user_id,
            dbId:card.distribution_id,
            dbLv:card.distribution_level,
            dbShow:ifHave
        })
        this.getIndexInfo();
        this.getBannerInfo();
        this.getAllGoodsInfo();
        this.getTabInfo();
        this.getIndexSet();
    },
    //当用户点击拒绝授权的操作
    handleReset(res) {
        if (res.confirm) {
                wx.openSetting({
                  success: res => {
                        utils.login(this.handleLogin.bind(this),this.handleReset.bind(this));
                    }
                });
        }
    },
    onShow() {
        let card = wx.getStorageSync('UserCard'),
            show = wx.getStorageSync('seller');
        this.setData({
            userId:card.user_id,
            dbId:card.distribution_id,
            dbLv:card.distribution_level,
            dbShow:show
        });
            // this.getIndexInfo();
            // this.getBannerInfo();
            // this.getAllGoodsInfo();
            // this.getTabInfo();
            // this.getIndexSet();
    },
    //分类选项卡操作
    getTabInfo() {
        const data = {};
        utils.sendRequest(api.IndexNewTab, data, this.handleGetTabSucc.bind(this));
    },
    //请求IndexUrl函数 
    getIndexInfo() {
        let id = this.data.dbId,
            lv = this.data.dbLv;
        const data = {
            distribution_id:id,
            distribution_level:lv
        };
        utils.sendRequest(api.IndexUrl, data, this.handleGetIndexSucc.bind(this));
    },
    //请求BannerUrl函数   
    getBannerInfo() {
        const data = {};
        utils.sendRequest(api.BannerUrl, data, this.handleGetBannerSucc.bind(this));
    },
    //请求AllGoodsUrl函数   
    getAllGoodsInfo() {
        let id = this.data.dbId,
            lv = this.data.dbLv;
        const data = {
            distribution_id:id,
            distribution_level:lv,
            limitIndex:this.data.limitIndex//查询条件
        };
        //传值给后端，获取到全部商品的首次信息
        utils.sendRequest(api.AllGoodsUrl, data, this.handleGetAllSucc.bind(this));
    },
    //首页专题
    getIndexSet() {
        const data = {};
        utils.sendRequest(api.GetIndexSet, data, this.handleGetIndexSetSucc.bind(this));
    },
        //请求TabUrl成功处理函数
    handleGetTabSucc(res) {
        let brandList = res.data;
        this.setData({
            extendList : brandList
        })
    },
    //请求IndexUrl成功处理函数 
    handleGetIndexSucc(res) {
         wx.hideToast();
        // 返回商品列表和品牌列表的信息
        let goodsInfo = res.data.data;
        this.setData({
            goodsList : goodsInfo,
            dbGoods:res.data.distributionGoodsInfo//特殊商品
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
    //首页专题成功操作
    handleGetIndexSetSucc(res) {
        let list = res.data;
        this.setData({
            IndexSetList : list
        })
    },
    onShareAppMessage() {
        return {
            title: "最超值的正品美妆平台",
            path: "pages/index/index"
        }
    },
    //上拉刷新商品信息
    onReachBottom() {
        let val = this.data.inputVal,
            err = this.data.isErr,
            load = this.data.isLoading,//loading 状态
            load1 = this.data.isLoading1;
        this.setData({
            isBtnShow: true 
        });

        if (load) {
        //关于上拉加载的性能优化
            setTimeout(()=>{
                    let num = this.data.limitIndex;
                    let id = this.data.dbId,
                        lv = this.data.dbLv;
                    this.setData({
                        limitIndex: num+1
                    })
                    // 给后端传下拉刷新的次数+1
                    const data = {
                        distribution_id:id,
                        distribution_level:lv,
                        limitIndex: this.data.limitIndex
                    };
                    utils.sendRequest(api.AllGoodsUrl, data, this.handleReachBottom.bind(this));
            },1500)
        };
        if (val != ''&& err == 0 && load1) {//这里是 搜索里面的下拉加载
            setTimeout(()=>{
                    let num = this.data.limitIndex;
                    let id = this.data.dbId,
                        lv = this.data.dbLv;
                    this.setData({
                        limitIndex: num+1
                    })
                    // 给后端传下拉刷新的次数+1
                    const data = {
                        distribution_id:id,
                        distribution_level:lv,
                        limitIndex: this.data.limitIndex
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
        let id = this.data.dbId,
            lv = this.data.dbLv;
        this.setData({
            inputVal: e.detail.value
        });                    

        const data = {
            distribution_id:id,
            distribution_level:lv,
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
        let searchs=res.data.data;
        this.setData({
            searchList: res.data.data,
            isErr: res.data.error
        })
        if (searchs.length < 7) {
            this.setData({
                btnTxt1: '人家也是有底线的~',
                isLoading1: false
            })
        };
    },
    //当value为空的时候 搜索内容隐藏
    handleSearchValue(e) {
        if (e.detail.value == '') {
            this.setData({
                inputVal: e.detail.value,
                searchList: []
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
        if (searchs.length < 7) {
            this.setData({
                btnTxt1: '人家也是有底线的~',
                isLoading1: false
            })
        };
    },
    //点击添加到购物车
    handleAddCart(e) {
        // 传商品信息 
        let userId = this.data.userId;
        let goodsId = e.target.dataset.id,
            goodsName = e.target.dataset.name,
            goodsPrice = e.target.dataset.price,
            goodsit = e.target.dataset.it;

            if (goodsit == null|| goodsit<=0 ) {//库存判断
                wx.showModal({content: '库存不足抱歉哟~',showCancel: false})
            }else {
                const data = {
                    userid:userId,
                    goodsId:goodsId,
                    goods_name:goodsName,
                    goods_price:goodsPrice,
                    goods_number:1
                };
                utils.sendRequest(api.AddGoodtoCart, data, this.handleAddGoodtoCartSucc.bind(this))
            } 
           
    },
    handleAddDbGoods(e) {
        // 传商品信息 
        let userId = this.data.userId;
        let goodsId = e.target.dataset.id,
            goodsName = e.target.dataset.name,
            goodsPrice = e.target.dataset.price,
            lv = e.target.dataset.lv,
            dbLv= this.data.dbLv;
            if( lv && dbLv == 2){
                wx.showModal({content: '您已经是代理商~',showCancel: false})
                return false;
            }else if(lv && dbLv == 1){
                wx.showModal({content: '您已经是服务商~',showCancel: false})
                return false;
            }else {
                if(lv == 3){
                    wx.showModal({content: '您已经是超级会员~',showCancel: false})
                    return false;
                }
            }

            const data = {
                    userid:userId,
                    goodsId:goodsId,
                    goods_name:goodsName,
                    goods_price:goodsPrice,
                    goods_number:1
                };
            utils.sendRequest(api.AddGoodtoCart, data, this.handleAddDbGoodsSucc.bind(this))
    },
    handleAddDbGoodsSucc(res) {
        let code = res.statusCode;
        if(code == 200) {
            wx.showModal({
              content: '在购物车等您哟~',
              showCancel: false
            })
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
    },
    //点击轮播图跳转逻辑
    handleBanner(e) {
        let goodsId = e.target.dataset.id,
            goodsName = e.target.dataset.name;
        //这里数据不固定，多个数据列表页，一个数据详情页
        JSON.stringify(goodsId).indexOf(",")!=-1&&goodsId!=''?
        wx.navigateTo({
            url: '/pages/seemore/seemore?id='+goodsId+'&&name='+goodsName
        }):wx.navigateTo({
            url: '/pages/detail/detail?id='+goodsId 
        });
    },
    //专题操作函数
    handleGoToPic(e) {
        let goodsId = e.target.dataset.id,
            goodsName = e.target.dataset.name;
        //这里数据不固定，多个数据列表页，一个数据详情页
        wx.navigateTo({
            url: '/pages/seemore/seemore?id='+goodsId+'&&name='+goodsName
        });
    },
    //分销商商品上下架
    handleDistribution(e) {
        let goodsId = e.target.dataset.id,
            dbId =  e.target.dataset.db,
            id = this.data.dbId,
            num = e.target.dataset.num,
            index = e.target.dataset.index,
            list = this.data.goodsList;
            if (dbId == 0) {
                list[num].goods[index].distribution_goods = 1;//改变页面显示效果

                this.setData({
                    goodsList:list
                });
                const data = {
                    goodsId:goodsId,
                    distribution_id:id
                };
                utils.sendRequest(api.DistributionAdd, data, this.handleAddDbSucc.bind(this))
            }else {
                list[num].goods[index].distribution_goods = 0;
                this.setData({
                    goodsList:list
                })
                const data = {
                    goodsId:goodsId,
                    distribution_id:id
                };
                utils.sendRequest(api.DistributionDel, data, this.handleDelDbSucc.bind(this))
            }
    },
    handleAddDbSucc(res) {
        res.data.error == 0 ? wx.showModal({content: '上架成功~',showCancel: false}):'';
    },
    handleDelDbSucc(res) {
        res.data.error == 0 ? wx.showModal({content: '下架成功~',showCancel: false}):'';
    },
    //全部商品上下架
    handleAllGoodsDb(e) {
        let goodsId = e.target.dataset.id,
            dbId =  e.target.dataset.db,
            id = this.data.dbId,
            index = e.target.dataset.index,
            list = this.data.allGoodsList;
        if (dbId == 0) {
                list[index].distribution_goods = 1;//改变页面显示效果
                this.setData({
                    allGoodsList:list
                });
                const data = {
                    goodsId:goodsId,
                    distribution_id:id
                };
                utils.sendRequest(api.DistributionAdd, data, this.handleAddDbSucc.bind(this))
            }else {
                list[index].distribution_goods = 0;
                this.setData({
                    allGoodsList:list
                })
                const data = {
                    goodsId:goodsId,
                    distribution_id:id
                };
                utils.sendRequest(api.DistributionDel, data, this.handleDelDbSucc.bind(this))
            }
    },
    //搜索商品上下架
    handleSearchDb(e) {
        let goodsId = e.target.dataset.id,
            dbId =  e.target.dataset.db,
            id = this.data.dbId,
            index = e.target.dataset.index,
            list = this.data.searchList;
        if (dbId == 0) {
                list[index].distribution_goods = 1;//改变页面显示效果
                this.setData({
                    searchList:list
                });
                const data = {
                    goodsId:goodsId,
                    distribution_id:id
                };
                utils.sendRequest(api.DistributionAdd, data, this.handleAddDbSucc.bind(this))
            }else {
                list[index].distribution_goods = 0;
                this.setData({
                    searchList:list
                })
                const data = {
                    goodsId:goodsId,
                    distribution_id:id
                };
                utils.sendRequest(api.DistributionDel, data, this.handleDelDbSucc.bind(this))
            }
    }
})
