const api = require('../../utils/api.js');//封装好的借口路径
const utils = require('../../utils/util.js');//调用封装的request
Page({
    data: {
        inputShowed: false,
        inputVal: "",
        classifyTab: [
            {name:'分类',id:0},
            {name:'品牌',id:1}
        ],
        tabIdx: 0,
        classifyFlag: true,
        listTab: [],
        leftTab: 0,
        limitIndex: 1,
        isLoading1:true, 
        btnTxt1:'加载中', 
        searchList: [],
        tabSonList: [],
        isErr:0,
        brandList:[]

    },
    onLoad(options) {
        this.getClassifyInfo();//调用分类接口
    },
    getClassifyInfo() {
        const data ={};
        utils.sendRequest(api.AllType, data, this.handleClassifyInfo.bind(this));
    },
    //首屏加载渲染出分类里面的所有东西
    handleClassifyInfo(res) {
        console.log('android')
        let classtab = res.data.data.type,
            tabSon = res.data.data.typeSon;
        this.setData({
            listTab:classtab,
            tabSonList:tabSon
        })
    },
    onReachBottom() {
        let val = this.data.inputVal,
            err = this.data.isErr;
        this.setData({
            isBtnShow: true 
        });
        if (val != ''&& err == 0) {
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
    // 点击选项卡切换品牌和分类
    handleClickGoods(e) {
        this.setData({
            tabIdx : e.target.dataset.index
        });
        //当选项卡为品牌的时候请求接口
        if (this.data.tabIdx == 1) {
            const data = {};
            utils.sendRequest(api.BrandInfoUrl, data, this.handleBrandInfo.bind(this));
        }
    },
    //全部品牌接口成功
    handleBrandInfo(res) {
        let brand = res.data;
        this.setData({
            brandList: brand
        })

    },
    // 点击分类里面的细分选项卡
    handleClickTabs(e) {
        let id = e.target.dataset.index,
            code = e.target.dataset.id;
        this.setData({
            leftTab : id
        });

        const data = {
            goodsTypeCode: code
        };
        utils.sendRequest(api.ClassifySon, data, this.handleGoodsSon.bind(this));
    },
    // //分类里面的内容
    handleGoodsSon(res) {
        let list = res.data;
         this.setData({
            tabSonList:list
        })
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
    }
});