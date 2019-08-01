var phone = function (success_callback) {
  wx.login({
    success: function (res) {
      if (res.code) {
        console.log(res)
        getUserInfo()
      } else {
        console.log('登录失败！' + res.errMsg)
      }
    },
    fail: function () {
      console.log('登录失败！')
    }
  })
}
var getUserInfo = function (session_key, success_callback) {
  // 获取用户信息
  wx.getSetting({
    success: res => {
      //console.log(res)
      if (res.authSetting['scope.userInfo']) {
        // 必须是在用户已经授权的情况下调用
        wx.getUserInfo({
          success:function(res) {
            console.log(res)
          }
        })
      }
    }
  })
}
module.exports = {
  phone: phone,
  getUserInfo: getUserInfo
}