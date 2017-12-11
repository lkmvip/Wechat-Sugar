// pages/user/tel/tel.js
const api = require('../../../utils/api.js');//封装好的接口路径
const utils = require('../../../utils/util.js');//调用封装的request
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    tel:'',
    Yzm:'',
    isNoClick:false,
    time:60,
    isReset:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
    onLoad(options) {
        this.setData({
            go:options.catch
        })
        let card = wx.getStorageSync('UserCard');
        const data ={
            user_id:card.user_id
        };
        utils.sendRequest(api.ZhunBeiTiXian, data, this.handleInTixianSucc.bind(this));

    },
    handleInTixianSucc(res) {
        if (res.data.tel!='') {
            this.setData({
                tel:res.data.tel,
                name:res.data.name
            })
        }
    },
    handleName(e) {
        this.setData({
            name:e.detail.value
        })
    },
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
    handleYzm(e) {
        this.setData({
            Yzm:e.detail.value
        })
    },
    handleGetYzm() {
        let tel = this.data.tel;
        if(!tel) {
            wx.showModal({
                content:'手机号不能为空哟',
                showCancel:false,
                confirmColor:'#3cc51f',//默认值为#3cc51f
            })
            return false
        }
            this.setData({
                isReset : true,
                isNoClick: true
            })
            const data ={
                tel:tel
            };
            utils.sendRequest(api.YanZhengMa, data, this.handleGetYzmSucc.bind(this));
            let time = setInterval(()=>{
            let phoneCode = this.data.time;
                phoneCode --
                this.setData({
                    time : phoneCode
                })
                if(phoneCode == 0){
                     clearInterval(time)
                     this.setData({
                        isReset : false,
                        isNoClick: false,
                        time:60
                     })
                }
            },1000)
    },
    handleGetYzmSucc(res) {
        wx.showModal({
            content:'正在努力发送，耐心等待哟',
            showCancel:false,
            confirmColor:'#3cc51f',//默认值为#3cc51f
        })
    },
    handleSave() {
        let name = this.data.name,
            tel = this.data.tel,
            yzm = this.data.Yzm,
            card = wx.getStorageSync('UserCard');
        let timestamp= new Date().getTime();
 
        if (name!=''&&tel!=''&&yzm!='') {
            const data ={
                distribution_id:card.distribution_id,
                post:{
                    user_name:name,
                    user_tel:tel,
                    user_code:yzm
                },
                user_id:card.user_id,
                password:yzm+timestamp

            };
            utils.sendRequest(api.BindTel, data, this.handleSaveTel.bind(this));
        }else {
             wx.showModal({
                content:'请填写完整信息哟',
                showCancel:false,
                confirmColor:'#3cc51f'
            }) 
        }

    },
    handleSaveTel(res) {
        let go = this.data.go;
        if (res.data.error == 0) {
            wx.showModal({
                content:'绑定成功~',
                showCancel:false,
                confirmColor:'#3cc51f',//默认值为#3cc51f
                success:res =>{
                    if(res.confirm){
                        if (go) {
                            wx.redirectTo({
                              url: '/pages/user/cash/cash'
                            })
                        }else {
                            wx.switchTab({
                              url: '/pages/user/index'
                            })
                        }         
                    }
                }
            }) 
            return false
        }else if (res.data.error == 100 ) {
            wx.showModal({
                content:'验证码已失效',
                showCancel:false,
                confirmColor:'#3cc51f'
            })
            return false

        }else if (res.data.error == 1001 ) {
            wx.showModal({
                content:'验证码输入错误',
                showCancel:false,
                confirmColor:'#3cc51f'
            })
        }
    }
})