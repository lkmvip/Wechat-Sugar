const api = require('api.js');//封装好的接口路径
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('/')
}

const formatTimeSec = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function sendRequest(path, data, callback) {
    var card = wx.getStorageSync('UserCard'),
        share = wx.getStorageSync('dbid');
    var obj = data;
        obj["token"] = card.token;
        obj["distribution_id"] = card.distribution_id;
        obj["distribution_level"] = card.distribution_level;
        obj["distribution"] = share,
        obj["user_id"]=card.user_id;;
    wx.request({
        url: path, 
        data: data,
        header: {
            'content-type': 'application/json'
        },
        method: "POST",
        success: callback,
        fail:(res)=>{
        } 
    })  
}
function login(callback,reset) {
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
                                        url: 'https://wstcsd.1haomei.com/html/shop/index.php/WstInterFace/WxServiceCallBack/getSmallProgramUnionid',
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
                                        success: callback
                                    })
                                },
                                fail: res=> {
                                    if (res) {
                                        wx.showModal({
                                          title: '友情提示',
                                          content: '五色糖，申请获得您的公开信息（头像，昵称等）。授权后，您能体验到我们更完善的功能，谢谢您关注五色糖。',
                                          showCancel:false,
                                          success:reset
                                        })
                                    }
                                }
                            })
                    }else{
                    }
                }
            })              
}

const handleGetOpenIdSuccess = res => {
        try {
            wx.setStorageSync('UserCard', res.data)
            res.data.distribution_id == 0?wx.setStorageSync('seller', false):wx.setStorageSync('seller', true);
        } catch (e) {    
            console.log(e)
        }
    }
const handleReset = res => {
        if (res.confirm) {
                wx.openSetting({
                  success: res => {
                        this.login(this.handleLogin.bind(this),this.handleReset.bind(this));
                    }
                });
        }
    }

module.exports = {
  formatTime: formatTime,
  sendRequest: sendRequest,
  login:login,
  formatTimeSec:formatTimeSec
}
