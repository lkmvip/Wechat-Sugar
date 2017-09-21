Page({
	data: {
	  	userInfo: {},
	  	hasCash : false,
	  	ifModel : false,
	  	promptList : [
	  		{q:"1.我什么时候可以提现？",a:"随时都可以"},
	  		{q:"2.提现有什么需求？",a:"需要您个人信息与银行卡保持一致，并且银行可信息完整呜呜"},
	  		{q:"3.提现什么时候可以到账？",a:"通常五色糖审核之后3个工作日（具体视银行结算时间为标准）"},
	  		{q:"4.提现支持哪些银行？",a:"目前仅支持工商银行、农业银行、建设银行、中国银行以及邮政银行"}
	  	]
	},

	onLoad: function () {
	},
	// 操作模态框显示和隐藏
	handleModelShow() {
		this.setData({
			ifModel:true
		})
	},
	handleModelHide() {
		this.setData({
			ifModel:false
		})
	},
	// 用户跳转支付页面
	handleUserPay() {
	  	wx.navigateTo({
		  url: '../pay/pay'
		})
	}

})