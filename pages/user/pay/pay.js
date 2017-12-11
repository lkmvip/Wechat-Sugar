// pages/user/pay/pay.js
const api = require('../../../utils/api.js');//封装好的接口路径
const utils = require('../../../utils/util.js');//调用封装的request
Page({

  /**
   * 页面的初始数据
   */
    data: {
        array: ['请选择开户银行', '工商银行', '农业银行', '建设银行','中国银行','邮政银行'],
        index: 0,
        maxNum : 0,
        name:'',
        card:'',
        bank:'',
        submit: false,
        cash:'',
        disabled: true,
        tel:'',
        bankname:''
    },
  /**
   * 生命周期函数--监听页面加载
   */
    onLoad(options) {
        let card = wx.getStorageSync('UserCard');
        this.setData({
            userid:card.user_id
        })
        const data ={
            userId:card.user_id,
            status:2
        };
        //调用主要信息，获取余额。
        utils.sendRequest(api.UserMainMsg, data, this.handleUserMainSucc.bind(this));
        const data1 = {
            user_id:card.user_id
        };
        //准备提现
        utils.sendRequest(api.ZhunBeiTiXian, data1, this.handleGetInfolSucc.bind(this));
    },
    handleUserMainSucc(res) {
        this.setData({
            maxNum:res.data.accountbalance
        });
    },
    handleGetInfolSucc(res) {
        this.setData({
            tel:res.data.tel
        });
    },
    // 选择户主
    handleName(e) {
        let user = e.detail.value,
            reg = /^[\u4E00-\u9FA5]{2,4}$/;
        if (!reg.test(user)) {
            var _this = this;
               wx.showModal({
                title:'提示',
                content:'请输入正确的名字',
                showCancel:false,
                confirmColor:'#3cc51f',//默认值为#3cc51f
                success:function(res){
                    if(res.confirm){
                        _this.setData({
                            name: ''
                        })
                    }
                }
            })
        }else{
            this.setData({
                name: user
            })
        }

    },
    // 输入银行卡号
    handleBankCard(e) {
        let bankNum = e.detail.value,
            reg = /^\d{16}|\d{19}$/;
        if (!reg.test(bankNum)) {
            var _this = this;
               wx.showModal({
                title:'提示',
                content:'请输入正确的卡号',
                showCancel:false,
                confirmColor:'#3cc51f',//默认值为#3cc51f
                success:function(res){
                    if(res.confirm){
                        _this.setData({
                            card: ''
                        })
                    }
                }
            })
        }else{
            this.setData({
                card: bankNum
            })
        }
    },
    // 选择银行
    bindPickerChange(e) {
        let arr = this.data.array;
        this.setData({
          index: e.detail.value,
          bank:arr[e.detail.value]
        })
        console.log(this.data.bank)
    },
    //选择提现金额验证
    handleCash(e) {
        let max = this.data.maxNum,
            val = Number(e.detail.value),
            reg =/^[1-9][0-9]*0{2}$/;
        if (reg.test(val) && val<max) {
           this.setData({
                cash: val,
                submit: true,
                disabled: false
            })
        }else{
            let  _this = this;
               wx.showModal({
                title:'提示',
                content:'提现金额必须为100的倍数，而且小于您的余额。',
                showCancel:false,
                confirmColor:'#3cc51f',//默认值为#3cc51f
                success:function(res){
                    if(res.confirm){
                        _this.setData({
                            cash: '',
                            submit: false,
                            disabled: true
                        })
                    }
                }
            })
        }
    },
    //操作手机号
    handleTel(e) {
        let reg = /^1(3|4|5|7|8)\d{9}$/,
            val = e.detail.value;
        if (!reg.test(val)) {
               wx.showModal({
                content:'请输入正确的手机号',
                showCancel:false,
                confirmColor:'#3cc51f',//默认值为#3cc51f
                success:res =>{
                    if(res.confirm){
                        this.setData({
                            tel:''
                        })         
                    }
                }
            })
        }else{
            this.setData({
                tel:e.detail.value
            })
        }
    },
    //操作银行名字
    handleBankName(e) {
        this.setData({
            bankname:e.detail.value
        })
    },
    handleCashSucc() {
        let name = this.data.name,
            card = this.data.card,
            bank = this.data.bank,
            bankName = this.data.bankname,
            tel = this.data.tel,
            cash = this.data.cash,
            id = this.data.userid;
        if (name!=''&&card!=''&&bank!=''&&bankName!=''&&tel!=''&&cash!='') {
            const data1 = {
                user_id:id,
                post:{
                    user_name:name,
                    account_code:card,
                    account_bank:bank,
                    amount:cash
                }
            };
            utils.sendRequest(api.TiJiaoTiXian, data1, this.handleTiXianlSucc.bind(this));
        }else  {
            wx.showModal({
                content:'请输入完整的信息',
                showCancel:false,
                confirmColor:'#3cc51f',//默认值为#3cc51f
            })
        }
    },
    handleTiXianlSucc(res) {
        if (res.data.error == 0) {
            wx.showModal({
                content:'提交申请成功，请您耐心等待。',
                showCancel:false,
                confirmColor:'#3cc51f',//默认值为#3cc51f
                success:res =>{
                    if(res.confirm){
                        wx.redirectTo({
                          url: '/pages/user/index'
                        })
                    }
                }
            })
        }
    }
})