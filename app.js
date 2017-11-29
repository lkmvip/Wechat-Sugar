//app.js
const utils = require('utils/util.js');//调用封装的request
App({
    onReady() {
    // 页面渲染完成
        console.log(2)
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
      utils.login(this.handleGetOpenIdSuccess.bind(this),this.handleReset.bind(this));
    },
    handleGetOpenIdSuccess(res) {
        try {
            wx.setStorageSync('UserCard', res.data)
            res.data.distribution_id == 0?wx.setStorageSync('seller', false):wx.setStorageSync('seller', true);
            
        } catch (e) {    
            console.log(e)
        }
    },
    handleReset(res) {
        if (res.confirm) {
                wx.openSetting({
                  success: res => {
                        utils.login(this.handleLogin.bind(this),this.handleReset.bind(this));
                    }
                });
        }
    },
})