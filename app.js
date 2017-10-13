//app.js
App({
  onReady() {
    // 页面渲染完成
  },
  onUnload() {
    // 页面关闭
  },
  onShow() {
  },
  onHide() {
    console.log('App Hide')
  },
  onLaunch() {
    // 展示本地存储能力
    console.log('App Launch')
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res.code)
        if(res.code) {
            wx.request({
                  url: 'https://wstcsd.1haomei.com/html/shop/index.php/WstInterFace//WxServiceCallBack/getSmallProgramUnionid',
                  method:"POST",
                  data: {
                        appid : 'wx14f22768572e9ce4',
                        secret : 'a2916c49cadd7d5f89e1ce113fe00b6e',
                        js_code : res.code,
                        grant_type :'authorization_code'
                    },
                  header: {
                      'content-type': 'application/json'
                  },
                  success: this.handleGetOpenIdSuccess.bind(this)
            })
        }else {
            console.log("登录失败")
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  },
  handleGetOpenIdSuccess(res) {
        // console.log(res)
  }
})