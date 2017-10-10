const formatTime = date => {
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
    wx.request({
        url: path, 
        data: data,
        header: {
            'content-type': 'application/json'
        },
        method: "POST",
        success: callback
    })
}

module.exports = {
  formatTime: formatTime,
  sendRequest: sendRequest
}
