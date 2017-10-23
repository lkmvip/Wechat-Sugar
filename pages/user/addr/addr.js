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
        area:false,
        addAddr:false,
        newAddr:true,
        cityData:[],
        addrList:[],
        id:0,
        Name:'',
        Phone:'',
        AddrDetail:'',
        back:false
    },
    onLoad() {
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
    handleNewAddr() {
        let list = this.data.addrList,
            province = this.data.province,
            city = this.data.city,
            county = this.data.county,
            id = this.data.id;
            this.setData({
                id: id+1
            })
        list.push({name:"收货人",phone:"联系电话",p:province,c:city,sc:county,index:id})
        console.log(list)
        this.setData({
            addAddr:true,
            addrList:list
        });
    },
    bindChange(e) {
        let val = e.detail.value,
            t = this.data.values,
            cityData = this.data.cityData,
            index = this.data.id,
            list = this.data.addrList;
        if (val[0] != t[0]) { //当val是选择省份的时候
          const citys = [];
          const countys = [];
            cityData[val[0]].child.map(item => citys.push({name:item.name,id:item.id}));
            cityData[val[0]].child[0].child.map(item => countys.push({name:item.name,id:item.id}));
            list[index-1].p = this.data.provinces[val[0]].name;
            list[index-1].c = cityData[val[0]].child[0].name;
            list[index-1].sc = cityData[val[0]].child[0].child[0].name;
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
            list[index-1].c = this.data.citys[val[1]].name;
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
            list[index-1].sc = this.data.countys[val[2]].name;
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
          area:true
        })
        console.log(this.data.addrArray)

    },
    handleName(e) {
        // let val = e.detail.value;
        // this.setData({
        //     Name:val
        // })
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
        // this.setData({
        //     Phone:val
        // })
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
                Phone: user
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
    handleDelAddr() {
        let index = this.data.id,
            list = this.data.addrList;
            index = index -1
        list.splice(index,1);
        this.setData({
            id:index,
            addrList:list
        })
    },
    handleAddNewAddr() {
        let isBack = this.data.back;
        if (isBack) {
            // var _this = this;
            //    wx.showModal({
            //     content:'请输入正确的手机号',
            //     showCancel:false,
            //     confirmColor:'#3cc51f',//默认值为#3cc51f
            //     success:function(res){
            //         if(res.confirm){
            //             _this.setData({
            //                 Phone: ''
            //             })
            //         }
            //     }
            // })
        }else{
            wx.showModal({
                content:'请输入完整地址信息',
                showCancel:false,
                confirmColor:'#3cc51f'//默认值为#3cc51f
            })
        }
        // const data ={
        //     user_id:45,
        //     addAddress:[
        //         {type:'',
        //         address_id:'',
        //         consignee:'高俊杰',
        //         mobile:17316240119,
        //         hd_area:["2", "52", "500"],
        //         address:'八角北里'}
        //     ]
        // };
        // utils.sendRequest(api.AddNewAddrInfo, data, this.handleNewAddrSucc.bind(this));
    },
    handleNewAddrSucc(res) {

    }
})