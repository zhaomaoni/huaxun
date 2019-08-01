var config = require('./config.js')
var test = false;
var authorization = 'MjIxZTZhODMxNmIxMjFlZTJkZmE5OjIyMWU2YTgzMTZiMTIxZWUyZGZhOTUzNWI5MzNmYzQ4'
var getUrl = function (url) {
  return config.dataList.apiUrl + url;
}

/* 处理通用post,json请求 */
var postRequest = function (url, data, success_callback, error_callback) {
  wx.request({
    url: url,
    method: 'POST',
    data: data,
    header: {
      'content-type': 'application/json',
      "Accept": "application/vnd.51gsl.v6+json"
    }, // 设置请求的 header  
    success: function (res) {
      //注意：可以对参数解密等处理 
      // console.log("调用接口(post)结果：" + url)
      // console.log(res)
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
    }
  })
}

/* 处理通用post，form请求 */
var postFormRequest = function (url, data, success_callback, error_callback) {
  wx.request({
    url: url,
    method: 'POST',
    data: data,
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + authorization,
      "Accept" : "application/vnd.51gsl.v6+json"
    },
    success: function (res) {
      //console.log(res)
      //注意：可以对参数解密等处理 
      if (success_callback) {
        success_callback(res)
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
//post请求
var postFormRequestAll = function (url, data, success_callback, error_callback) {
  var url = getUrl(url)
  postRequest(url, data, success_callback, error_callback)
}
module.exports={
  postFormRequestAll: postFormRequestAll,
  postFormRequest: postFormRequest,
  postRequest: postRequest
}

// 登录 or 注册，如果存在就登录，如果不存在就注册
module.exports.userLogin = function (phone, unionId, openId, nickname, headimgurl, success_callback, error_callback) {
  var data = {
    phone: phone,
    password: unionId,
    username: openId,
    nickname: nickname,
    headimgurl: headimgurl,
    type: 5,
  }
  var url = config.logins.apiUrl + config.logins.pwd
  postFormRequest(url, data, success_callback, error_callback)
}