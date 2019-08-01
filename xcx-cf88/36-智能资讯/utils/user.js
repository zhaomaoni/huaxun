var CryptoJS = require('aes.js');  //引用AES源码js
var key = CryptoJS.enc.Utf8.parse("e10adc3949ba59abbe56e057f20f883e");//十六位十六进制数作为秘钥
var iv = CryptoJS.enc.Utf8.parse('1234567890abcdef1234567890abcdef');//十六位十六进制数作为秘钥偏移量
var authorization = 'MjIxZTZhODMxNmIxMjFlZTJkZmE5OjIyMWU2YTgzMTZiMTIxZWUyZGZhOTUzNWI5MzNmYzQ4'
var test = false;
var getRealDomain = function () {
  return "http://mobile2.cf8.cn/"
}
var getDomain = function () {
  if (test)
    return 'http://116.255.141.28/mobile/'
  return getRealDomain()
}

var wxLogin = function (pro_from,success_callback) {
  wx.login({
    success: function (res) {
      if (res.code) {
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
            pro_from:pro_from
          },
          success: function (res) {
            var data = JSON.parse(res.data.data)
            var session_key = data.session_key;
            wx.setStorageSync('session_key', session_key)
            getUserInfo(pro_from,session_key, success_callback)
          }
        })
      } else {
        //console.log('登录失败！' + res.errMsg)
      }
    },
    fail: function () {
      //console.log('登录失败！')
    }
  })
}
var getUserInfo = function (pro_from,session_key, success_callback) {
  // 获取用户信息
  wx.getSetting({
    success: res => {
      if (res.authSetting['scope.userInfo']) {
        // 必须是在用户已经授权的情况下调用
        wx.getUserInfo({
          success: res => {
            getWechatUserInfo(pro_from,session_key, res.encryptedData, res.iv, success_callback)
          }
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
      var data = JSON.parse(res.data.data)
      wx.setStorageSync('wechatUserInfo', res.data.data)
      console.log(data)
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

var postFormRequest = function (url, data, success_callback, error_callback) {
  wx.request({
    url: url,
    method: 'POST',
    data: data,
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + authorization,
    }, // 设置请求的 header  
    success: function (res) {
      //注意：可以对参数解密等处理 
      if (res.statusCode == 200) {
        if (success_callback) {
          success_callback(res)
        }
      } else {
        if (error_callback) {
          error_callback(res)
        }
      }
    },
    fail: function (res) {
      if (error_callback) {
        error_callback(res)
      }
    },
    complete: function () {
      // complete  
    }
  })
}

//解密方法
var Decrypt = function(word) {
  var encryptedHexStr = CryptoJS.enc.Hex.parse(word);
  var srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  var decrypt = CryptoJS.AES.decrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}
//加密方法
var Encrypt = function(word) {
  var srcs = CryptoJS.enc.Utf8.parse(word);
  var encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  return encrypted.ciphertext.toString().toUpperCase();
}
/* 同步各小程序获取到的手机号 */
var getPhoneFn = function (appid, open_id, nickname ,mobile, success_callback, error_callback) {
  var data = {
    appid: appid,
    open_id: open_id,
    mobile: mobile,
    nickname: nickname
  }
  var url = getDomain("?r=wechat/user/sync")
  postFormRequest(url, data, success_callback, error_callback)
}

var getSessionKey = function(){
  var info = wx.getStorageSync('session_key') || ''
  return info
}
var getTgwUserId = function () {
  var info = wx.getStorageSync('tgw_userid') || ''
  return info;
}
var setTgwUserId = function (data) {
  wx.setStorageSync('tgw_userid', '' + data)
}

module.exports = {
  wxLogin: wxLogin,
  getWechatUserInfo: getWechatUserInfo2,
  getSessionKey, getSessionKey,
  postFormRequest: postFormRequest,
  Decrypt: Decrypt,
  Encrypt: Encrypt,
  getPhoneFn: getPhoneFn,
  setTgwUserId: setTgwUserId,
  getTgwUserId: getTgwUserId
}  