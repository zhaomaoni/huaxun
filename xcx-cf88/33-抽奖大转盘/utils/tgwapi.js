var conf = require('./config.js')
var getUrl = function (url) {
  return conf.tgwUrl.apiUrl + url;
}

//get请求
module.exports.getInfo = function (params, success_callback, error_callback){
  var url = getUrl(params)
  getRequest(url, success_callback, error_callback)
}

//post请求
module.exports.postFormRequestAll = function (url,data, success_callback, error_callback) {
  var url = getUrl(url)
  postFormRequest(url, data,success_callback, error_callback)
}

/* 处理通用get请求 */
var getRequest = function (url, success_callback, error_callback) {
  showLoading()
  console.log("正在调用接口(get)：" + url)
  wx.request({
    url: url,
    method: 'GET',
    header: {
      'content-type': 'application/json',
      'Accept': 'application/json',
    }, // 设置请求的 header  
    success: function (res) {
      //注意：可以对参数解密等处理
      //console.log(res)
      console.log("调用接口(get)结果：" + url)
      console.log(res)
      hideLoading()
      if (success_callback) {
        success_callback(res)
      }
    },
    fail: function (res) {
      //console.log(res)
      hideLoading()
      if (error_callback) {
        error_callback(res)
      }
    },
    complete: function () {
      // complete  
    }
  })
}

/* 处理通用post,json请求 */
var postRequest = function (url, data, success_callback, error_callback) {
  showLoading()
  console.log("正在调用接口(post)：" + url)
  console.log(data)
  wx.request({
    url: url,
    method: 'POST',
    data: data,
    header: {
      'content-type': 'application/json',
    }, // 设置请求的 header  
    success: function (res) {
      //注意：可以对参数解密等处理 
      console.log("调用接口(post)结果：" + url)
      console.log(res)
      hideLoading()
      if (success_callback) {
        success_callback(res)
      }
    },
    fail: function (res) {
      //console.log(res)
      hideLoading()
      if (error_callback) {
        error_callback(res)
      }
    },
    complete: function () {
      // complete  
    }
  })
}

/* 处理通用post，form请求 */
var postFormRequest = function (url, data, success_callback, error_callback) {
  showLoading()
  console.log("正在调用接口(postForm)：" + url)
  console.log(data)
  wx.request({
    url: url,
    method: 'POST',
    data: data,
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic MjIxZTZhODMxNmIxMjFlZTJkZmE5OjIyMWU2YTgzMTZiMTIxZWUyZGZhOTUzNWI5MzNmYzQ4',
    }, // 设置请求的 header  
    success: function (res) {
      console.log("调用接口(postForm)结果：" + url)
      console.log(res)
      hideLoading()
      //注意：可以对参数解密等处理 
      if (success_callback) {
        success_callback(res)
      }
    },
    fail: function (res) {
      //console.log(res)
      hideLoading()
      if (error_callback) {
        error_callback(res)
      }
    },
    complete: function () {
      // complete  
    }
  })
}

/* 加载loading */
function showLoading() {
  wx.showLoading({
    title: "加载中",
    mask: true
  })
}
/* 关闭loading */
function hideLoading() {
  wx.hideLoading()
}