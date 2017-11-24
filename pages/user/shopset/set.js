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
      
    },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
    handleUploadPic() {
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
            upload(this,tempFilePaths,1);

          }
        })
    },
    handleUploadSign() {
        wx.chooseImage({
          count: 1, // 默认9
          sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: res => {
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            var tempFilePaths = res.tempFilePaths;
            console.log(tempFilePaths)
            this.setData({
                sign: tempFilePaths
            })
            upload(this,tempFilePaths,2);

          }
        })
    },
    handleName(e) {
        this.setData({
            name:e.detail.value
        })
        console.log(e)
    },
    handleText(e) {
        this.setData({
            text:e.detail.value
        }) 
    },
    handleSaveMsg() {
        let name = this.data.name,
            text = this.data.text,
            src = this.data.src,
            sign = this.data.src;
        if (name&&text&&src&&sign) {
            // upload(this,[src,sign],name,text);
        }else {
            wx.showModal({
                title: '提示',
                content: '请填写完整信息哟',
                showCancel: false
            }) 
        }
    }
})
function upload(page, path,way) {
    console.log(arguments)
  wx.showToast({
    icon: "loading",
    title: "正在上传"
  }),
    wx.uploadFile({
      url: api.ShopLogoUrl,
      filePath: path[0],          
      name: 'file',
      area:way,
      header: { "Content-Type": "multipart/form-data" },
      success: function (res) {
        console.log(res);
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