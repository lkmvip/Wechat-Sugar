// pages/user/pay/pay.js
Page({

  /**
   * 页面的初始数据
   */
    data: {
        array: ['请选择开户银行', '工商银行', '农业银行', '建设银行','中国银行','邮政银行'],
        index: 0,
        maxNum : 9999,
        name:'',
        card:'',
        bank:'',
        submit: false,
        cash:'',
        disabled: true
    },
  /**
   * 生命周期函数--监听页面加载
   */
    onLoad(options) {

    },

    /**
    * 生命周期函数--监听页面初次渲染完成
    */
    onReady() {

    },

    /**
    * 生命周期函数--监听页面显示
    */
    onShow() {

    },

    /**
    * 生命周期函数--监听页面隐藏
    */
    onHide() {

    },

    /**
    * 生命周期函数--监听页面卸载
    */
    onUnload() {

    },
    /**
    * 用户点击右上角分享
    */
    onShareAppMessage() {

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
        this.setData({
          index: e.detail.value
        })
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
    handleCashSucc() {
        var cash = this.data.cash;
        wx.navigateTo({
          url: '../cash/cash?cash='+cash
        })
    }
})