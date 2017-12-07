//index.js
const api = require('../../../utils/api.js');//封装好的接口路径
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
        back:false,
        disabled: true
    },
    onLoad(options) {
        let id = options.cartid,
            card = wx.getStorageSync('UserCard');
        this.setData({
            cartId:id,
            userId:card.user_id
        })
        //调用地址接口
        const data ={
            user_id:card.user_id,
            status:'',
            address_id:''
        };
        utils.sendRequest(api.GetAddrInfo, data, this.handleAddrList.bind(this));
        try {
            let localInfo = wx.getStorageSync("AddrJson");//获取三级联动地址数据
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
        this.setData({
            addrList:res.data.addressInfo.reverse()
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
            'cityData':cityData
        })
    },
    //增加一个新的地址
    handleNewAddr() {
        let list = this.data.addrList,
            province = this.data.province,
            city = this.data.city,
            county = this.data.county;
        list.unshift({//默认添加第一条数据 北京东城区
            address:"",
            address_id:"",
            address_name:"",
            area:false,
            city:"52",
            cityName:"北京",
            consignee:"",
            district:"500",
            districtName:"东城区",
            mobile:"",
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
            list[index].area = true;
            try {
                if (val[0] != t[0]) { //当val是选择省份的时候
                const citys = [];
                const countys = [];
                    cityData[val[0]].child.map(item => citys.push({name:item.name,id:item.id}));
                    cityData[val[0]].child[0].child.map(item => countys.push({name:item.name,id:item.id}));
                    list[index].provinceName = this.data.provinces[val[0]].name;//省份
                    list[index].cityName = cityData[val[0]].child[0].name;//城市
                    list[index].districtName = cityData[val[0]].child[0].child[0].name;//地区
                    list[index].province = this.data.provinces[val[0]].id;//对应的传值ID
                    list[index].city = cityData[val[0]].child[0].id;//对应的传值ID
                    list[index].district = cityData[val[0]].child[0].child[0].id;//对应的传值ID
                this.setData({
                    citys: citys,
                    countys: countys,
                    values: val,
                    value: [val[0], 0, 0],
                    addrList: list
                })
                    return;
                }
                if (val[1] != t[1]) {//当val是选择城市的时候
                    const countys = [];
                    cityData[val[0]].child[val[1]].child.map(item => countys.push({name:item.name,id:item.id}));
                    list[index].cityName = this.data.citys[val[1]].name;// 选择城市
                    list[index].city = this.data.citys[val[1]].id;//对应的传值ID
                    list[index].districtName = cityData[val[0]].child[val[1]].child[0].name;//选择城市对应的地区
                    list[index].district = cityData[val[0]].child[val[1]].child[0].id;//对应的传值ID
                    this.setData({
                        countys: countys,
                        values: val,
                        value: [val[0], val[1], 0],
                        addrList: list
                    })
                    return;
                }
                if (val[2] != t[2]) {//当val是选择地区的时候
                    list[index].districtName = this.data.countys[val[2]].name;//选择地区
                    list[index].district = this.data.countys[val[2]].id;//对应的传值ID
                    this.setData({
                        county: this.data.countys[val[2]].name,
                        values: val,
                        addrList: list
                    })
                    return;
                }    

            } catch(e) {
                // statements
                console.log(e);
            }
    },
    // 三级联动区域开关
    open() {
        this.setData({
          condition: !this.data.condition,
          newAddr:!this.data.newAddr
        })
    },
    // 信息区域的三级联动开关
    openThere(e) {
        let list = this.data.addrList;
        list[e.target.dataset.id].area = true;
        this.setData({
            condition: !this.data.condition,
            newAddr:!this.data.newAddr,
            id:e.target.dataset.id,// 控制点击不同的三级联动
            addrList:list
        })
    },
    // 名字校验
    handleName(e) {
        let index = e.target.dataset.id,
            list = this.data.addrList,
            user = e.detail.value,
            reg = /^[a-zA-Z0-9\u4e00-\u9fa5]{2,20}$/;
        if (!reg.test(user)) {
               wx.showModal({
                content:'请输入正确的名字',
                showCancel:false,
                confirmColor:'#3cc51f',//默认值为#3cc51f
                success:res => {
                    if(res.confirm){
                        list[index].consignee = '';
                        this.setData({
                            addrList: list
                        });
                    }
                }
            })
        }else{
            //联系人
            list[index].consignee = user;
            list[index].show = false;
            this.setData({
                addrList: list
            });

        }
    },
    //电话校验
    handlePhone(e) {
        let index = e.target.dataset.id,
            list = this.data.addrList,
            val = e.detail.value,
            reg = /^1(3|4|5|7|8)\d{9}$/;
        if (!reg.test(val)) {
               wx.showModal({
                content:'请输入正确的手机号',
                showCancel:false,
                confirmColor:'#3cc51f',//默认值为#3cc51f
                success:res => {
                    if(res.confirm){
                        list[index].mobile = '';
                        this.setData({
                            addrList: list
                        });
                    }
                }
            })
        }else{
            list[index].mobile = val;
            list[index].show = false;
            this.setData({
                addrList: list
            });

        }
    },
    // 详细地址校验
    handleAddrDetail(e) {
        let index = e.target.dataset.id,
            list = this.data.addrList,
            val = e.detail.value;
        if(val == " ") {
               wx.showModal({
                content:'请输入详细地址信息',
                showCancel:false,
                confirmColor:'#3cc51f'//默认值为#3cc51f
            })
        }else{
            list[index].address = val;
            list[index].show = false;
            this.setData({
                addrList: list
            });
        }

    },
    // 删除当前地址
    handleDelAddr(e) {
        let index = e.target.dataset.id,
            addrid = e.target.dataset.addr,
            list = this.data.addrList,
            userId = this.data.userId;
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
                    user_id:userId,
                    address_id:addrid
                };
                utils.sendRequest(api.DelAddInfo, data, this.handleDelAddrSucc.bind(this));
            }
        });
    },
    // 删除成功
    handleDelAddrSucc(res) {
    },
    // 存新地址信息并且跳转
    handleAddNewAddr(e) {// 修改 对应的数组里面的 地址信息数据
        wx.pageScrollTo({
          scrollTop: 0
        });
        let index = e.target.dataset.id,//添加数据下标
            list = this.data.addrList,//地址数据列表
            isBack = list[index].area,//三级联动按钮
            name = list[index].consignee,
            phone = list[index].mobile,
            arrdid = list[index].address_id,
            area = [list[index].province,list[index].city,list[index].district].toString(),//地区
            detail = list[index].address,//详细地址
            userId = this.data.userId,
            show = this.data.cartId;//判断在哪个页面显示弹窗
            list[index].show = true;//改变当前对应按钮的disable属性
            this.setData({
                addrList: list
            })
        if (isBack) {
            setTimeout(()=>{
                if (!show) {
                        wx.showModal({
                        content:'保存成功~',
                        showCancel:false,
                        confirmColor:'#3cc51f'//默认值为#3cc51f
                    });
                }
                const data ={
                    user_id:userId,
                    addAddress:{
                        type:'',
                        address_id:arrdid,
                        consignee:name,
                        mobile:phone,
                        hd_area:area,
                        address:detail
                    }
                };
                utils.sendRequest(api.AddNewAddrInfo, data, this.handleNewAddrSucc.bind(this));
            },1500)
        }else{
            wx.showModal({
                content:'请输入完整地址信息',
                showCancel:false,
                confirmColor:'#3cc51f'//默认值为#3cc51f
            })
        }
    },
    //存地址成功
    handleNewAddrSucc(res) {
        let isId = res.data.data,
            cartId = this.data.cartId;
        isId&&cartId? wx.redirectTo({
                url: '../../orderdetail/index?addrid='+isId+'&&cartid='+this.data.cartId
        }):'';
    }
})