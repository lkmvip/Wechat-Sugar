//index.js
const api = require('../../../utils/api.js');//封装好的借口路径
const utils = require('../../../utils/util.js');//调用封装的request

var app = getApp();
Page({
    data: {
        provinces: [],
        province: "",
        citys: [],
        city: "",
        countys: [],
        county: '',
        value: [0, 0, 0],
        values: [0, 0, 0],
        condition: false,
        area:true,
        addAddr:false,
        newAddr:true,
        cityData:[],
        addrList:[],
        id:'',
        Name:'',
        Phone:'',
        AddrDetail:'',
        back:false
    },
    onLoad(options) {
        let id = options.cartid;
        // console.log(options)
        this.setData({
            cartId:id
        })
        const data ={
            user_id:3,
            status:'',
            address_id:''
        };
        utils.sendRequest(api.GetAddrInfo, data, this.handleAddrList.bind(this));
        try {
            let localInfo = wx.getStorageSync("AddrJson");
            if(!localInfo){
                const data ={};
                utils.sendRequest(api.NoOneJson, data, this.handleJsonAddr.bind(this));//获取三级联动的json数据
            }else {
                let cityData = wx.getStorageSync('AddrJson')
                const provinces = [];
                const citys = [];
                const countys = [];
                cityData.map(item => provinces.push({name:item.name,id:item.id}))//省份
                cityData[0].child.map(item => citys.push({name:item.name,id:item.id}))//城市
                cityData[0].child[0].child.map(item => countys.push({name:item.name,id:item.id}))//市县
                this.setData({
                    'provinces': provinces, 
                    'citys': citys,
                    'countys': countys,
                    'province': cityData[0].name,
                    'city': cityData[0].child[0].name,
                    'county': cityData[0].child[0].child[0].name,
                    'cityData':cityData,
                    addrArray:[cityData[0].id,
                            cityData[0].child[0].id,
                            cityData[0].child[0].child[0].id]
                })
            }    
        } catch(e) {
            // statements
            console.log(e);
        }
    },
    onShow() {

    },
    // 获取所有地址信息
    handleAddrList(res) { //这里接口让史伟给我返回数据加了两个字段 area true 和 index
        console.log(res.data.data)
        this.setData({
            addrList:res.data.data
        })
    },
    // 三级联动
    handleJsonAddr(res) {
        let Data = res.data.data;
        const provinces = [];
        const citys = [];
        const countys = [];
        wx.setStorageSync("AddrJson",Data);
        let cityData = wx.getStorageSync('AddrJson')
        cityData.map(item => provinces.push({name:item.name,id:item.id}))//省份
        cityData[0].child.map(item => citys.push({name:item.name,id:item.id}))//城市
        cityData[0].child[0].child.map(item => countys.push({name:item.name,id:item.id}))//市县
        this.setData({
            'provinces': provinces, 
            'citys': citys,
            'countys': countys,
            'province': cityData[0].name,
            'city': cityData[0].child[0].name,
            'county': cityData[0].child[0].child[0].name,
            'cityData':cityData,
            addrArray:[cityData[0].id,
                    cityData[0].child[0].id,
                    cityData[0].child[0].child[0].id]
        })
    },
    //增加一个新的地址
    handleNewAddr() {
        let list = this.data.addrList,
            province = this.data.province,
            city = this.data.city,
            county = this.data.county;
        list.push({
            address:"八角北里",
            address_id:"413",
            address_name:"",
            area:true,
            city:"52",
            cityName:"北京",
            consignee:"高俊杰",
            district:"500",
            districtName:"东城区",
            index:0,
            mobile:"18649307981",
            province:"2",
            provinceName:"北京"
        })
        this.setData({
            addAddr:true,
            addrList:list
        });
    },
    //选择三级联动
    bindChange(e) {
        let val = e.detail.value,
            t = this.data.values,
            cityData = this.data.cityData,
            index = this.data.id,
            list = this.data.addrList;
            console.log(index)
        if (val[0] != t[0]) { //当val是选择省份的时候
          const citys = [];
          const countys = [];
            cityData[val[0]].child.map(item => citys.push({name:item.name,id:item.id}));
            cityData[val[0]].child[0].child.map(item => countys.push({name:item.name,id:item.id}));
            list[index].provinceName = this.data.provinces[val[0]].name;
            list[index].cityName = cityData[val[0]].child[0].name;
            list[index].districtName = cityData[val[0]].child[0].child[0].name;
          this.setData({
            province: this.data.provinces[val[0]].name,
            city: cityData[val[0]].child[0].name,
            citys: citys,
            county: cityData[val[0]].child[0].child[0].name,
            countys: countys,
            values: val,
            value: [val[0], 0, 0],
            addrArray:[this.data.provinces[val[0]].id,
                        cityData[val[0]].child[0].id,
                        cityData[val[0]].child[0].child[0].id],
            addrList: list
          })
          return;
        }
        if (val[1] != t[1]) {//当val是选择城市的时候
            const countys = [];
            cityData[val[0]].child[val[1]].child.map(item => countys.push({name:item.name,id:item.id}));
            list[index].cityName = this.data.citys[val[1]].name;
            this.setData({
                city: this.data.citys[val[1]].name,
                county: cityData[val[0]].child[val[1]].child[0].name,
                countys: countys,
                values: val,
                value: [val[0], val[1], 0],
                addrArray:[this.data.provinces[val[0]].id,
                            this.data.citys[val[1]].id,
                            cityData[val[0]].child[0].child[0].id],
                addrList: list
            })
          return;
        }
        if (val[2] != t[2]) {//当val是选择城区的时候
            list[index].districtName = this.data.countys[val[2]].name;
            this.setData({
                county: this.data.countys[val[2]].name,
                values: val,
                addrArray:[this.data.provinces[val[0]].id,
                            this.data.citys[val[1]].id,
                            this.data.countys[val[2]].id],
                addrList: list
            })
          return;
        }
    },
    open() {
        this.setData({
          condition: !this.data.condition,
          newAddr:!this.data.newAddr,
          area:false
        })
    },
    openThere(e) {
        this.setData({
            condition: !this.data.condition,
            newAddr:!this.data.newAddr,
            area:false,
            id:e.target.dataset.id
        })
    },
    handleName(e) {
        let user = e.detail.value,
            reg = /^[\u4E00-\u9FA5]{2,4}$/;
        if (!reg.test(user)) {
            var _this = this;
               wx.showModal({
                content:'请输入正确的名字',
                showCancel:false,
                confirmColor:'#3cc51f',//默认值为#3cc51f
                success:function(res){
                    if(res.confirm){
                        _this.setData({
                            Name: ''
                        })
                    }
                }
            })
        }else{
            this.setData({
                Name: user
            })
        }
    },
    handlePhone(e) {
        let val = e.detail.value,
            reg = /^1(3|4|5|7|8)\d{9}$/;
        if (!reg.test(val)) {
            var _this = this;
               wx.showModal({
                content:'请输入正确的手机号',
                showCancel:false,
                confirmColor:'#3cc51f',//默认值为#3cc51f
                success:function(res){
                    if(res.confirm){
                        _this.setData({
                            Phone: ''
                        })
                    }
                }
            })
        }else{
            this.setData({
                Phone: val
            })
        }
    },
    handleAddrDetail(e) {
        let val = e.detail.value;
        if(val == " ") {
             var _this = this;
               wx.showModal({
                content:'请输入详细地址信息',
                showCancel:false,
                confirmColor:'#3cc51f'//默认值为#3cc51f
            })

        }else{
            this.setData({
                AddrDetail:val,
                back: true
            })
        }

    },
    handleDelAddr(e) {
        let index = e.target.dataset.id,
            addrid = e.target.dataset.addr,
            list = this.data.addrList;
        wx.showModal({
          content: '您真的不要人家了嘛？',
          success: res => {
            if (res.confirm) {
                    list.splice(index,1);
                    this.setData({
                        id:index,
                        addrList:list
                    })
                }
                const data ={
                    user_id:3,
                    address_id:addrid
                };
                utils.sendRequest(api.DelAddInfo, data, this.handleDelAddrSucc.bind(this));
            }
        });
    },
    handleDelAddrSucc(res) {
        console.log(res)
    },
    handleAddNewAddr() {
        let isBack = this.data.back,
            name = this.data.Name,
            phone = this.data.Phone,
            area = this.data.addrArray.toString(),
            detail = this.data.AddrDetail;
        if (isBack) {
            const data ={
                user_id:3,
                addAddress:{
                    type:'',
                    address_id:'',
                    consignee:"高俊杰",
                    mobile:18649307981,
                    hd_area:"2,52,500",
                    address:"八角北里"
                }
            };
            // utils.sendRequest(api.AddNewAddrInfo, data, this.handleNewAddrSucc.bind(this));
        }else{
            wx.showModal({
                content:'请输入完整地址信息',
                showCancel:false,
                confirmColor:'#3cc51f'//默认值为#3cc51f
            })
        }
    },
    handleNewAddrSucc(res) {
        let isId = res.data.data;
        console.log(isId)
        // if(isId) {
        //     wx.redirectTo({
        //         url: '../../orderdetail/index?addrid='+isId+'&&cartid='+this.data.cartId
        //     });
        // }
    }
})