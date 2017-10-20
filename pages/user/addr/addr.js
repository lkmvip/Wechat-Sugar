//index.js
//获取应用实例
// var tcity = require("../../../utils/citys.js");
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
        newAddr:true,
        area:false,
        addAddr:true,
        cityData:[]
    },
    onLoad() {
        console.log("onLoad");

        const data ={};
        utils.sendRequest(api.NoOneJson, data, this.handleJsonAddr.bind(this));
    },
    handleJsonAddr(res) {
        let cityData = res.data.data;
        const provinces = [];
        const citys = [];
        const countys = [];
        console.log(cityData)
        for (let i = 0; i < cityData.length; i++) {
          provinces.push({name:cityData[i].name,id:cityData[i].id});
        }
        console.log('省份完成');
        for (let i = 0; i < cityData[0].child.length; i++) {
          citys.push(cityData[0].child[i].name)
        }
        for (let i = 0; i < cityData[0].child[0].child.length; i++) {
          countys.push(cityData[0].child[0].child[i].name)
        }

        this.setData({
          'provinces': provinces,
          'citys': citys,
          'countys': countys,
          'province': cityData[0].name,
          'city': cityData[0].child[0].name,
          'county': cityData[0].child[0].child[0].name,
          'cityData':cityData
        })
        console.log('初始化完成');
    },
    handleNewAddr() {
        this.setData({
           addAddr:true 
        })
    },
    bindChange(e) {
        console.log(e);
        var val = e.detail.value
        var t = this.data.values;
        var cityData = this.data.cityData;
        // console.log(cityData)
        console.log(val)

        if (val[0] != t[0]) {
          console.log('province no ');
          const citys = [];
          const countys = [];

          for (let i = 0; i < cityData[val[0]].child.length; i++) {
            citys.push(cityData[val[0]].child[i].name)
          }
          console.log(cityData[val[0]]);
          for (let i = 0; i < cityData[val[0]].child[0].child.length; i++) {
            countys.push(cityData[val[0]].child[0].child[i].name)
          }

          this.setData({
            province: this.data.provinces[val[0]],
            city: cityData[val[0]].child[0].name,
            citys: citys,
            county: cityData[val[0]].child[0].child[0].name,
            countys: countys,
            values: val,
            value: [val[0], 0, 0]
          })

          return;
        }
        if (val[1] != t[1]) {
          console.log('city no');
          const countys = [];

          for (let i = 0; i < cityData[val[0]].child[val[1]].child.length; i++) {
            countys.push(cityData[val[0]].child[val[1]].child[i].name)
          }

          this.setData({
            city: this.data.citys[val[1]],
            county: cityData[val[0]].child[val[1]].child[0].name,
            countys: countys,
            values: val,
            value: [val[0], val[1], 0]
          })
          return;
        }
        if (val[2] != t[2]) {
          console.log('county no');
          this.setData({
            county: this.data.countys[val[2]],
            values: val
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
    },
    addDot(arr) {
        if (arr instanceof Array) {
          arr.map(val => {
            if (val.fullName.length > 4) {
              val.fullNameDot = val.fullName.slice(0, 4) + '...';
              return val;
            } else {
              val.fullNameDot = val.fullName;
              return val;
            }
          })
        }
    },
})