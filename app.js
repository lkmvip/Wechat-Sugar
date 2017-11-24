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
        // 登录
    let _this = this;
            wx.login({
            success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
                    if(res.code){
                            wx.getUserInfo({
                                success: userinfoRes => {
                                    try {
                                        wx.setStorageSync('UserInFo', userinfoRes.userInfo)
                                    } catch (e) {    
                                         console.log(e)
                                    }
                                    let userInfoStr = JSON.stringify(userinfoRes);
                                    wx.request({
                                        url: 'https://wstcsd.1haomei.com/html/shop/index.php/WstInterFace//WxServiceCallBack/getSmallProgramUnionid',
                                        data: {
                                            appid: 'wx14f22768572e9ce4',
                                            secret: 'a2916c49cadd7d5f89e1ce113fe00b6e',
                                            js_code: res.code,
                                            grant_type: 'authorization_code',
                                            userInfo: userInfoStr
                                        },
                                        method: 'POST',
                                        header: {
                                            'content-type': 'application/x-www-form-urlencoded'
                                        },
                                        success: _this.handleGetOpenIdSuccess.bind(_this)
                                    })
                                }
                            })
                    }else{
                        console.log("登录失败")
                    }
                }
            })  
    },

    handleGetOpenIdSuccess(res) {
        try {
            wx.setStorageSync('UserCard', res.data)
        } catch (e) {    
            console.log(e)
        }
    }
})