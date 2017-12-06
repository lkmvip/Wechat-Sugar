// pages/orderdetail/index.js
const api = require('../../utils/api.js');//封装好的接口路径
const utils = require('../../utils/util.js');//调用封装的request
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      {name: 'ticket', value: '优惠券',checked: true}
    ],
    orderList:[],
    freightNum:'',
    orderPrice:'',
    cartId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
    onLoad(options) {
        wx.showToast({
            icon: "loading",
            title: "正在加载"
        })
        let id = options.cartid,
            addrid = options.addrid,
            card = wx.getStorageSync('UserCard'),
            couponId = options.ticketid,
            couponNum =options.ticketnum,
            db = wx.getStorageSync('dbid');
        this.setData({
            cartId:id,
            addrId:addrid,
            userId:card.user_id,
            couponId: couponId,
            dbId:card.distribution_id,
            dbLv:card.distribution_level,
            subId:card.subwebId,
            dbstatus:db
        });
        this.getOrderInfo(id);
        this.getAddrInfo(addrid);
    },
    // 获取支付页面列表
    getOrderInfo(id) {
        let userId = this.data.userId,
            addr = this.data.addrid;
        const data ={
            user:userId,
            cart:id,
            address_id:'',
            val:'',
            product_id:''
        };
        utils.sendRequest(api.OrderList, data, this.handleOrderList.bind(this));
    },
    handleOrderList(res) {
        wx.hideToast()
        let result = res.data;
        this.setData({
            orderList: result.cartgoods,
            freightNum: Number(result.goodsmoney.freight),
            orderPrice: result.goodsmoney.goodsmoney,
            couponId: result.couponId,
            couponMoney: Number(result.coupon_money),
            goodsIds:result.cartgoods[0].goods_id,
            totalamount:result.cartgoods[0].subtotal
        });

        this.data.couponId ==''?
        this.setData({
            items: [
                {name: 'ticket', value: '优惠券',checked: false}
            ],
            showTicket:true
        }):'';
    },
    // 如果有 地址id 请求地址列表
    getAddrInfo(id) {
        let userId = this.data.userId;
        const data ={
            user_id:userId,
            status:'1',
            address_id:id
        };
        utils.sendRequest(api.GetAddrInfo, data, this.handleAddrList.bind(this));
    },
    handleAddrList(res) {
        let list = res.data.addressInfo;
        this.setData({
            addr: list[0].address,
            name: list[0].consignee,
            province: list[0].provinceName,
            city: list[0].cityName,
            district: list[0].districtName,
            addrId:list[0].address_id,
            phone:list[0].mobile
        })
    },
    /**
    * 生命周期函数--监听页面初次渲染完成
    */
    onReady () {
  
    },
    // 地址页面
    handleAddr() {
        wx.redirectTo({
            url: '/pages/user/addr/addr?cartid='+this.data.cartId
        })
    },
    //前往优惠券页面
    handleTicket() {
        let id = this.data.cartId,
            addr = this.data.addrId,
            userId = this.data.userId,
            goodsid = this.data.goodsIds,
            amount = this.data.totalamount;
            console.log(goodsid,amount)
        wx.navigateTo({
            url: '/pages/user/ticket/ticket?way=2&&cartid='+id+'&&addrid='+addr+'&&goodsid='+goodsid+'&&amount='+amount
        })
    },
    //提交订单
    handleOrderPay() {
        let addrid = this.data.addrId,
            carid = this.data.cartId,
            reightrmb = this.data.freightNum,
            allprice = this.data.orderPrice,
            userId = this.data.userId,
            couponId = this.data.couponId,
            couponMoney = this.data.couponMoney,
            dbId = this.data.dbId,
            dbLv = this.data.dbLv,
            subId = this.data.subId,
            list = this.data.orderList,
            arr = [],
            useTicket = this.data.isUse,
            db = this.data.dbstatus;
            console.log(useTicket)
            list.map(item => arr.push(item.goods_id));
        const data ={
            user_id:userId,
            branchId:subId,
            distribution:db,
            share_level:'',
            distribution_id:dbId,
            distribution_level:dbLv,
            post:{
                address_id:addrid,
                freight:reightrmb,
                couponId:useTicket?'':couponId,
                goods_ids:arr,
                totalamount:allprice, //总价
                coupon_money:useTicket?'':couponMoney,
                totalPrice:allprice+reightrmb-(useTicket?0:couponMoney),//这个是去掉优惠券的钱orderPrice+freightNum-
                rec_id:carid,
                NowBuyNum:'',
                salespromotion_type:'',
                activety_id:'',
                turnnum:'',    
            }
        };
        console.log(data)
        //请求生成订单接口
        utils.sendRequest(api.NewOrderInfo, data, this.handleNewOrderInfo.bind(this));
    },
    //请求提交订单成功
    handleNewOrderInfo(res) {
        console.log(res)
        try {
            let frt = this.data.freightNum;
            let userId = this.data.userId;

            if (res.data.error == 0) {
                //处理传值
                let msg = JSON.stringify(res.data.data),
                id = this.data.cartId;
                wx.redirectTo({
                    url: '/pages/orderpay/order?msg='+msg+'&&count='+frt
                });
                const data ={
                    user_id:userId,
                    rec_id:id
                };
                //点击提交订单清空购物车接口
                utils.sendRequest(api.DelOrderCar, data, this.handleCartDelInfo.bind(this));
            }
        } catch(e) {
            // statements
            console.log(e);
        }
    },
    handleCartDelInfo(res) {},
    checkboxChange(e) {
        e.detail.value == ''?
        this.setData({
            isUse:true
        })
        :this.setData({
            isUse:false
        });
    }
})