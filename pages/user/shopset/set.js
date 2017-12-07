// pages/user/shopset/set.js
const api = require('../../../utils/api.js');//封装好的接口路径
const utils = require('../../../utils/util.js');//调用封装的request
Page({

  /**
   * 页面的初始数据
   */
    data: {
        name:'',
        text:'',
        src:'',
        sign:''
    },

  /**
   * 生命周期函数--监听页面加载
   */
    onLoad(options) {
        let card = wx.getStorageSync('UserCard');
            this.setData({
                userId:card.user_id,
                dbId:card.distribution_id,
                dbLv:card.distribution_level
        });
        this.getShopInfo();
    },
    //店铺信息
    getShopInfo() {
        let id = this.data.dbId,
            lv = this.data.dbLv;
        const data = {
                    distribution_id:id
            };
        utils.sendRequest(api.GetHandleShop, data, this.HandleShopInfoSucc.bind(this)); 
    },
    HandleShopInfoSucc(res) {
        this.setData({
            name:res.data.data.storename,
            text:res.data.data.store_contents,
            src:res.data.data.storelogo,
            sign:res.data.data.storeimg
        })
    },
   //上传logo图片
    handleUploadPic() {
        let id = this.data.dbId;
        wx.chooseImage({
          count: 1, // 默认9
          sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: res => {
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            var tempFilePaths = res.tempFilePaths;
            console.log(tempFilePaths)
            this.setData({
                src: tempFilePaths
            })
            upload(this,tempFilePaths,"logo",id);
          }
        })
    },
    //上传背景图片
    handleUploadSign() {
        let id = this.data.dbId;
        wx.chooseImage({
          count: 1, // 默认9
          sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: res => {
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            var tempFilePaths = res.tempFilePaths;
            this.setData({
                sign: tempFilePaths
            })
            upload(this,tempFilePaths,"sign",id);

          }
        })
    },
    handleName(e) {
        this.setData({
            name:e.detail.value
        })
    },
    handleText(e) {
        this.setData({
            text:e.detail.value
        }) 
    },
    //保存店铺操作信息
    handleSaveMsg() {
        let name = this.data.name,
            text = this.data.text,
            src = this.data.src,
            sign = this.data.src,
            id = this.data.dbId;
        if (name&&text&&src&&sign) {
            const data = {
                distribution_id:id,
                distribution:'',
                data:{
                    storename:name,
                    store_contents:text
                }
            };
            utils.sendRequest(api.UpdateStore, data, this.HandleShopSucc.bind(this)); 
        }else {
            wx.showModal({
                title: '提示',
                content: '请填写完整信息哟',
                showCancel: false
            }) 
        }
    },
    HandleShopSucc(res) {
        res.data.data?wx.showModal({
                content: '保存成功~',
                showCancel: false
            }):wx.showModal({
                content: '出错了，工程师正在修复',
                showCancel: false
            });
    }
})
function upload(page, path,way,id) {
  wx.showToast({
    icon: "loading",
    title: "正在上传"
  }),
    wx.uploadFile({
      url: api.ShopLogoUrl,
      filePath: path[0],          
      name: 'file',
      formData:{
        'user': way,
        'distribution_id':id
      },
      header: { "Content-Type": "multipart/form-data" },
      success: function (res) {
        if (res.statusCode != 200) { 
          wx.showModal({
            title: '提示',
            content: '上传失败',
            showCancel: false
          })
          return;
        }else {
            wx.showModal({
                title: '提示',
                content: '上传成功',
                showCancel: false
            }) 
        }
      },
      fail: function (e) {
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