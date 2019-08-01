var tgwapi = require("tgwapi.js")
var loginStatus = true;
var wxLogin = function (pro_from,success_callback) {
  wx.login({
    success: function (res) {
      if (res.code) {
        //console.log(res)
        //发起网络请求
        wx.request({
          url: 'https://api.51gsl.com/program/wechatId',
          method: 'POST',
          header: {
            'content-type': 'application/json',
            "Accept": "application/vnd.51gsl.v6+json"
          },
          data: {
            code: res.code,
            pro_from: pro_from
          },
          success: function (res) {
            //console.log(res)
            var data = JSON.parse(res.data.data)
            var session_key = data.session_key;
            wx.setStorageSync('session_key', session_key)
            getUserInfo(pro_from, session_key, success_callback)
          }
        })
      } else {
        //console.log('登录失败！' + res.errMsg)
      }
    },
    fail: function () {
      console.log('登录失败！')
    }
  })
}
var getUserInfo = function (pro_from,session_key, success_callback) {
  // 获取用户信息
  wx.getSetting({
    success: res => {
      console.log(res)
      if (res.authSetting['scope.userInfo']) {
        // 必须是在用户已经授权的情况下调用
        wx.getUserInfo({
          success: res => {
            getWechatUserInfo(pro_from,session_key, res.encryptedData, res.iv, success_callback)
            console.log(res)
          }
        })
      }else{
        wx.showToast({
          title: "您点击的拒绝，将无法继续进行下去，请重新授权",
          icon: 'none',
          duration: 2000
        })
      }
    }
  })
}
var getWechatUserInfo = function (pro_from,session_key, encryptedData, iv, success_callback) {
  wx.request({
    url: 'https://api.51gsl.com/program/wechatUserInfo',
    method: 'POST',
    header: {
      'content-type': 'application/json',
      "Accept": "application/vnd.51gsl.v6+json"
    },
    data: {
      pro_from: pro_from,
      sessionKey: session_key,
      encryptedData: encryptedData,
      iv: iv
    },
    success: function (res) {
      console.log(res)
      var data = JSON.parse(res.data.data)
      wx.setStorageSync('wechatUserInfo', res.data.data)
      if (success_callback) {
        success_callback(res)
      }
    }
  })
}

var getWechatUserInfo2 = function () {
  var info = wx.getStorageSync('wechatUserInfo') || ''
  if (info) {
    return JSON.parse(info)
  }
  return info;
}
var getTgwUserId = function () {
  var info = wx.getStorageSync('tgw_userid') || ''
  return info;
}
var setTgwUserId = function (data) {
  wx.setStorageSync('tgw_userid', '' + data)
}

/* 同步各小程序获取到的手机号 */
var getPhoneFn = function (appid, open_id, nickname, mobile, success_callback, error_callback) {
  var data = {
    appid: appid,
    open_id: open_id,
    mobile: mobile,
    nickname: nickname
  }
  var url = getDomain("?r=wechat/user/sync")
  postFormRequest(url, data, success_callback, error_callback)
}

var getSessionKey = function () {
  var info = wx.getStorageSync('session_key') || ''
  return info
}

module.exports = {
  wxLogin: wxLogin,
  getSessionKey: getSessionKey,
  getWechatUserInfo: getWechatUserInfo2,
  setTgwUserId: setTgwUserId,
  getTgwUserId: getTgwUserId
}  