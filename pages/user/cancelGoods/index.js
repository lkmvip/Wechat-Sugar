// pages/user/cancelGoods/index.js
const api = require('../../../utils/api.js');//封装好的接口路径
const utils = require('../../../utils/util.js');//调用封装的request

Page({

  /**
   * 页面的初始数据
   */
    data: {
            tabs: ["申请退货","退货审核","用户发货","收货退款"],
            activeIndex: "1",
            num:1
    },

      /**
       * 生命周期函数--监听页面加载
       */
    onLoad(options) {
        // 接受商品id和商品状态
        let id = options.id,
            status = options.status,
            card = wx.getStorageSync('UserCard');
        this.handleGetInfo(id);
        this.setData({
            recId:id,
            userId:card.user_id
        })
        //判断状态改变tab内容
        if ( status == 0 ) { this.setData({activeIndex:0})}
        if ( status == 1 ) { this.setData({activeIndex:1})}
        if ( status == 2 || status==3) { this.setData({activeIndex:2})}
        if ( status == 4 ) { this.setData({activeIndex:3})}
    },
    handleGetInfo(id) {
        const data ={
            rec_id:id
        };
        //调用取消商品接口
        utils.sendRequest(api.CancelTakeGoods, data, this.handleCancelDetailSucc.bind(this));
    },
    //取消成功接口
    handleCancelDetailSucc(res) {
        let info = res.data;
        //修改请求数据显示价格和最多退多少
        this.setData({
            cancelList:info,
            cancelPrice:info.shopprice,
            max:info.max_refund.toFixed(2)
        })
    },
    // 退货照片
    // handleCancelPic() {
    //      var that = this;
    //         wx.chooseImage({
    //           count: 1, // 最多可以选择的图片张数，默认9
    //           sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
    //           sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
    //           success: function(res){
    //               wx.uploadFile({
    //                 url:that.data.API_URL +'uploadavatarurl',
    //                 filePath:res.tempFilePaths[0],
    //                 name:'avatar',
    //                 // header: {}, // 设置请求的 header
    //                 formData: {user_id:that.data.myInfo.user_id}, // HTTP 请求中其他额外的 form data
    //                 success: function(info){
    //                     that.setData({
    //                         'myInfo.wx_avatarurl' : res.tempFilePaths[0]
    //                     });
    //                     wx.setStorageSync('wx_avatarurl', res.tempFilePaths[0]);
    //                 }
    //               })
    //           },
    //           fail: function() {
    //             // fail
    //           },
    //           complete: function() {
    //             // complete
    //           }
    //         })
    // },
    //减少
    minusCount() {
        let count = this.data.num,
            goodsNum = this.data.cancelList.goods_number,//获取商品数量
            price = this.data.cancelList.shopprice,//商品价格
            changeNum = this.data.cancelPrice;//退款价格
        if(count <= 1){
          return false;
        }
        count = count - 1;
        price = changeNum - price;
        this.setData({
            num:count,
            cancelPrice:price.toFixed(2)
        })

    },
    //增加
    addCount() {
        let count = this.data.num,
            goodsNum = this.data.cancelList.goods_number,
            price = this.data.cancelList.shopprice;
        if(count >= goodsNum){
          return false;
        }
        count = count + 1;
        price = count*price;
        this.setData({
            num:count,
            cancelPrice:price.toFixed(2)
        })
    },
    // 退货说明操作
    handleAddrDetail(e) {
        let val = e.detail.value;
        this.setData({
            remark:val
        })
    },
    // 操作申请退货按钮
    handleRequest() {
        let id = this.data.recId,
            num = this.data.cancelList.goods_number,
            count = this.data.num,
            val = this.data.remark,
            userId = this.data.userId;

        const data ={
            user_id:userId,
            post:{
                rec_id:id,
                goods_status:1,
                goods_number:num,
                refund_remark:val,
                refund_amount:count,
                refund_img:''
            }
        };
        // 给后端传值取消订单的信息。
        utils.sendRequest(api.CancelGoods, data, this.handleRequestSucc.bind(this));
    },
    handleRequestSucc(res) {
        try {
             if(res.data.error == 0){
                wx.showModal({
                content:'申请成功，正在飞速处理~',
                showCancel:false,
                confirmColor:'#3cc51f',//默认值为#3cc51f
                success:function(res){
                        if(res.confirm){
                            wx.switchTab({
                              url: '/pages/user/index'
                            })
                        }
                    }
                })
            }   
        } catch(e) {
            // statements
            console.log(e);
        }
    },
    //取消申请退货
    handleCancelRequest() {
        let id = this.data.recId;      
        const data ={
            rec_id:id,
        };

        utils.sendRequest(api.CancelRequest, data, this.handleCancelRequestSucc.bind(this));
    },
    handleCancelRequestSucc(res) {
        try {
             if(res.data.error == 0){
                wx.showModal({
                content:'取消成功哟~',
                showCancel:false,
                confirmColor:'#3cc51f',//默认值为#3cc51f
                success:function(res){
                        if(res.confirm){
                            wx.switchTab({
                              url: '/pages/user/index'
                            })
                        }
                    }
                })
            }   
        } catch(e) {
            // statements
            console.log(e);
        }
    },
    // 用户发货单号
    handleGoodsNum(e) {
        let val = e.detail.value;
        this.setData({
            odd:val
        })
    },
    // 用户发货
    handleSendGoods() {
        let id = this.data.recId,
            val = this.data.odd,
            userId = this.data.userId;
        if (val == undefined) {
            wx.showModal({content: '请填写单号哟~',showCancel: false});

        }else {
            const data ={
                user_id:userId,
                post:{
                    rec_id:id,
                    refund_sn:val
                }
            };
            utils.sendRequest(api.CustomerDelivery, data, this.handleSendGoodsSucc.bind(this)); 
        }
      
    },
    handleSendGoodsSucc(res) {
        try {
             if(res.data){
                wx.showModal({
                content:'收到货后，我们会尽快退款~',
                showCancel:false,
                confirmColor:'#3cc51f',//默认值为#3cc51f
                success:function(res){
                        if(res.confirm){
                            wx.switchTab({
                              url: '/pages/user/index'
                            })
                        }
                    }
                })
            }   
        } catch(e) {
            // statements
            console.log(e);
        }
    },
    // 退货完成
    handleCancelDone() {
            wx.switchTab({
              url: '/pages/user/index'
            })
    }
})