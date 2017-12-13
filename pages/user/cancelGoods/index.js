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
            userId:card.user_id,
            dbId:card.distribution_id,
            dbLv:card.distribution_level,
            token:card.token
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
            max:info.max_refund.toFixed(2),
            recid:info.rec_id,
            odd:info.refund_sn
        })
    },
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
            userId = this.data.userId,
            src = this.data.src,
            token = this.data.token;
        const data ={
            user_id:userId,
            post:{
                rec_id:id,
                goods_status:1,
                goods_number:num,
                refund_remark:val,
                refund_amount:count,
                type:1
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
    },
    handleCancelPic() {
        let id = this.data.userId,
            rec = this.data.recid,
            token = this.data.token;
        wx.showModal({
            content: '最多上传三张图片哟~',
            showCancel: false,
            success:res => {
                wx.chooseImage({
                  count: 3, // 默认9
                  sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
                  sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                  success: res => {
                    // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                    var tempFilePaths = res.tempFilePaths;
                    upload(this,tempFilePaths,rec,'',token);
                    this.setData({
                        src: tempFilePaths
                    })
                  }
                })
            }
          })
    },
    handleDelPic(e) {
        const index = e.currentTarget.dataset.index;
        let list = this.data.src;
        list.splice(index,1);
        this.setData({
            src: list
        });
    }
})
function upload(page, path,way,id,token) {
  wx.showToast({
    icon: "loading",
    title: "正在上传"
  });
  for (var i = 0; i<path.length; i++) {
        wx.uploadFile({
          url: api.CancelImg,
          filePath: path[i],          
          name: 'file',
          formData:{
            'rec_id': way,
            'token':token
          },
          header: { "Content-Type": "multipart/form-data" },
          success: res => {
            if (res.statusCode != 200) { 
              wx.showModal({
                title: '提示',
                content: '上传失败',
                showCancel: false
              })
              return;
            }else {
            
            }
          },
          fail: function (e) {
            console.log(e);
            wx.showModal({
              title: '提示',
              content: '上传失败',
              showCancel: false
            })
          },
          complete: function () {
            wx.hideToast();  //隐藏Toast
          }
        })
    }
}