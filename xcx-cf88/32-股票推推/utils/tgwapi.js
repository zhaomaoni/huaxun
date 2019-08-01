var test = false;
var authorization = 'MjIxZTZhODMxNmIxMjFlZTJkZmE5OjIyMWU2YTgzMTZiMTIxZWUyZGZhOTUzNWI5MzNmYzQ4'
var getRealDomain = function(){
  return "https://api.tgw360.com/secucodeplay-service"
}
var getDomain = function () {
  if(test)
    // return 'http://172.18.44.128:8888'
    return "http://113.108.114.194:8091/secucodeplay-service"
  return getRealDomain()
}
var getUrl = function (url) {
  return getDomain() + url;
}

var getDomain2 = function () {
  if (test)
  //  return 'http://172.18.44.128:2011'
    // return "http://172.18.44.120:8050/cloud-service-push"
    return "http://113.108.114.194:8091/cloud-service-push"
  return "https://api.tgw360.com/cloud-service-push"
  // return getRealDomain()
}
var getUrl2 = function (url) {
  return getDomain2() + url;
}


var getDomainOauth = function () {
  if (test)
    // return 'http://172.18.44.128:2011'
    return "http://113.108.114.194:8091/oauth-service"
  return "https://api.tgw360.com/oauth-service"
  // return getRealDomain()
}
var getUrlOauth = function (url) {
  return getDomainOauth() + url;
}

var getDomain3 = function () {
  if (test)
    // return 'http://172.18.44.128:5004'
    return "http://113.108.114.194:8091/cloud-service-user"
  // return "https://api.tgw360.com/oauth-service"
  return "https://api.tgw360.com/cloud-service-user"
}
var getUrl3 = function (url) {
  return getDomain3() + url;
}

var getDomain4 = function () {
  if (test)
  //  return 'http://172.18.44.128:6010'
    return "http://113.108.114.194:8091/secucodeplay-service"
  return getRealDomain()
}
var getUrl4 = function (url) {
  return getDomain4() + url;
}
var getDomain5 = function () {
  if (test)
    // return 'http://172.18.44.128:8012'
    return "http://113.108.114.194:8091/consult-service/"
  return "https://api.tgw360.com/consult-service/"
}
var getUrl5 = function (url) {
  return getDomain5() + url;
}

/* 加载loading */
function showLoading() {
  //console.log("show loading....")
  wx.showLoading({
    title: "加载中",
    mask: true
  })
}
/* 关闭loading */
function hideLoading() {
  //console.log("hidden loading....")
  wx.hideLoading()
}
/**
 * 活动初始化,添加用户
 */
module.exports.addUser = function (data,success_callback, error_callback) {
  var url = getUrl('/secucode/play/adduser?userid='+data.userid)
  postRequest(url,null, success_callback, error_callback)
}
/**
 * 保存登录成功后的信息接口
 */
module.exports.addplaylogin = function (data, success_callback, error_callback) {
  var url = getUrl('/secucode/play/addplaylogin')
  postRequest(url, data, success_callback, error_callback)
}

module.exports.isBindPhone = function (userid, success_callback, error_callback){
  var url = getUrl3("/user/isBindPhone?userId=" + userid);
  getRequest(url, success_callback, error_callback)
} 

/**
 * 处理通用get请求
 */
var getRequest = function (url, success_callback, error_callback,no_showloading){
  if (!no_showloading){
    showLoading()
  }
  // console.log("正在调用接口(get)：" + url)
  wx.request({
    url: url, 
    method: 'GET',
    header: {
      'content-type': 'application/json', 
      'Accept': 'application/json', 
      'Authorization': 'Basic ' + authorization,
    }, // 设置请求的 header  
    success: function (res) {
      //注意：可以对参数解密等处理 
      //console.log(res)
      // console.log("调用接口(get)结果：" + url)
      // console.log(res)
      if (!no_showloading) {
        hideLoading()
      }
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
  })
}

/**
 * 处理通用post,json请求
 */
var postRequest = function (url, data,success_callback, error_callback) {
  showLoading()
  // console.log("正在调用接口(post)：" + url)
  // console.log(data)
  wx.request({
    url: url,
    method: 'POST',
    data : data,
    header: {
      'content-type': 'application/json',
    }, // 设置请求的 header  
    success: function (res) {
      //注意：可以对参数解密等处理 
      // console.log("调用接口(post)结果：" + url)
      // console.log(res)
      hideLoading()
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
      // console.log(res) 
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

/**
 * 处理通用post，form请求
 */
var postFormRequest = function (url, data, success_callback, error_callback) {
  showLoading()
  // console.log("正在调用接口(postForm)：" + url)
  // console.log(data)
  wx.request({
    url: url,
    method: 'POST',
    data: data,
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + authorization,
    }, // 设置请求的 header  
    success: function (res) {
      // console.log("调用接口(postForm)结果：" + url)
      // console.log(res)
      hideLoading()
      //注意：可以对参数解密等处理 
      if (res.statusCode == 200) {
        if (success_callback) {
          success_callback(res)
        } 
      }else{
        if (error_callback) {
          error_callback(res)
        }
      }
    },
    fail: function (res) {
      // console.log(res) 
      // console.log("调用接口(postForm)结果：" + url)
      // console.log(res)
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
// 登录 or 注册，如果存在就登录，如果不存在就注册
module.exports.userLogin = function (phone, unionId, openId, nickname, headimgurl, success_callback, error_callback) {
  var appid = getApp().globalData.referrerAppId
  var froms = ""
  if (appid =="wxbf3c45c29bea8a3d"){
    froms = "xcx_gptt"
  }else{
    froms = ""
  }
  var data = {
    username: openId,
    password: unionId,
    type: 5,
    nickname: nickname,
    headimgurl: headimgurl,
    phone: phone,
    channel: "xiaochengxu",
    source: froms
  }
  // console.log("登录或注册data:")
  // console.log(data)
  // var url = getUrl3("/oauth/token?grant_type=password")
  var url = getUrlOauth("/oauth/token?grant_type=password")
  if(test){
    url = "http://113.108.114.194:8091/oauth-service/oauth/token?grant_type=password"
    // url = "http://172.18.44.128:8067/oauth-service/oauth/token?grant_type=password"
  }
  postFormRequest(url, data, success_callback, error_callback)
}

module.exports.getRequestPlay = function (params, success_callback, error_callback){
  var apiName = isString(params) ? params : params.apiName
  var userId = isString(params) ? '' : params.userId
  var url = getUrl('/secucode/play/' + apiName)
  if(userId){
    url = url + "?userId=" + userId
  }
  getRequest(url, success_callback, error_callback,true)
}
function isString(str) { 
  return (typeof str == 'string') && str.constructor == String;
} 

module.exports.postRequestPlay = function(apiName,data, success_callback, error_callback){
  var url = getUrl('/secucodeplay/' + apiName)
  postRequest(url, data, success_callback, error_callback)
}

// 发送验证码
module.exports.identifyCodeAcquire = function (phone,type, success_callback, error_callback) {
  var data = {
    phone:phone,
    type:type
  }
  var url = getUrl2("/message/identifyCode/acquire")
  postFormRequest(url, data, success_callback, error_callback)
}
// 验证验证码
module.exports.identifyCodeVerify = function (phone, type,code, success_callback, error_callback) {
  var data = {
    phone: phone,
    type: type,
    code:code
  }
  var url = getUrl2("/message/identifyCode/verify")
  postFormRequest(url, data, success_callback, error_callback)
}

//发送复活卡接口
module.exports.sendResurrectionCard = function (tguserid, userids, success_callback, error_callback) {
  var data = {
    userid: tguserid,
    sourceid: userids
  }
  var url = getUrl("/secucodeplay/sendResurrectionCard")
  postFormRequest(url, data, success_callback, error_callback)
}



/**
 * 开户
 */
module.exports.configration = function (success_callback, error_callback) {
  var url = getUrl("/secucode/play/kaihu")
  getRequest(url, success_callback, error_callback)
}

module.exports.getRequest = getRequest
// 结算
module.exports.openJob = function (success_callback, error_callback){ 
  var url = getUrl4('/secucode/play/openJob/secucodeplay')
  getRequest(url, success_callback, error_callback)
}
/* 赛事报道数据 */
module.exports.getViewKits = function (success_callback, error_callback){
  showLoading()
  var url = getUrl5("/consult/getViewKits")
  var data = {
    "queryType": 1,
    "sortType": 1,
    "beginIndex": 0,
    "recordCount": 15,
    "checkState": 1,
    "serviceId": 100956206
  }
  // console.log("正在调用接口(get)：" + url)
  // console.log(data)
  wx.request({
    method: 'GET',
    url: url,
    data: data,
    header: {
      'content-type': 'application/json',
    },
    success: function (res) {
      hideLoading()
      // console.log("调用接口(get)结果：" + url)
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
    fail: function (err) {
      hideLoading()
      if(error_callback){
        error_callback(err)
      } 
     }
  })
}
/* 赛事报道数据详情 */  //查询类别(1-操作策略,2-投顾内参,3-观点，4-锦囊,7-量化策略)
module.exports.getIvestmentsAndViews = function (data,success_callback, error_callback) {
  showLoading()
  var url = getUrl5("/consult/getIvestmentsAndViews")
  // console.log("正在调用接口(get)：" + url)
  // console.log(data)
  wx.request({
    method: 'GET',
    url: url,
    data: data,
    header: {
      'content-type': 'application/json',
    },
    success: function (res) {
      hideLoading()
      // console.log("调用接口(get)结果：" + url)
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
    fail: function (err) {
      hideLoading()
      if (error_callback) {
        error_callback(err)
      }
    }
  })
}

module.exports.postFormRequest = postFormRequest;

module.exports.getAvatar = function(url){
  if(test){
    return  "http://www.tgwtest.com/res/image/" + url
  }else{
    return "http://www.tgw360.com/res/image/" + url
  }
}

module.exports.isTest = function(){
  return test
}