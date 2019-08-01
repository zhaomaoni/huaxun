var tgwapi = require("tgwapi.js")
var userUtil = require("userUtil.js")
function base64_encode(str) { // 编码，配合encodeURIComponent使用
  var c1, c2, c3;
  var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var i = 0, len = str.length, strin = '';
  while (i < len) {
    c1 = str.charCodeAt(i++) & 0xff;
    if (i == len) {
      strin += base64EncodeChars.charAt(c1 >> 2);
      strin += base64EncodeChars.charAt((c1 & 0x3) << 4);
      strin += "==";
      break;
    }
    c2 = str.charCodeAt(i++);
    if (i == len) {
      strin += base64EncodeChars.charAt(c1 >> 2);
      strin += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
      strin += base64EncodeChars.charAt((c2 & 0xF) << 2);
      strin += "=";
      break;
    }
    c3 = str.charCodeAt(i++);
    strin += base64EncodeChars.charAt(c1 >> 2);
    strin += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
    strin += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
    strin += base64EncodeChars.charAt(c3 & 0x3F)
  }
  return strin
}
var getAvatar = function(url){
  // if(url){
  //   // return 'http://www.tgwtest.com/res/image/' + base64_encode(url)
  //   return "http://www.tgw360.com/res/image/path" + base64_encode(url)
  // }
  // return ''

  if (!url) {
    return "https://api.51gsl.com/program/StockPush/images/icon_header.png"
  } else if (url.indexOf("https") == -1) {
    //return  "http://www.tgw360.com/res/image/" + base64_encode(url)
    return tgwapi.getAvatar(base64_encode(url))
  } else {
    return url;
  }
}
var getFrom = function(){
  console.log("getFrom")
  return wx.getStorageSync("from") || ''
}
// var loadConfigration = function(f){
//   var cacheKey = 'configration'
//   if(f){
//     console.log("f:" + f)
//     wx.setStorageSync("from",f);
//   }else{
//     wx.setStorageSync("from", '');
//   }
//   tgwapi.configration(function (data) {
//     console.log("configration:")
//     console.log(data)
//     wx.setStorageSync(cacheKey, data.data)
//     if (this.configCallback) {
//       this.configCallback();
//     }
//   }) 
// }
// var getConfigration = function(){
//   var cacheKey = 'configration'
//   return wx.getStorageSync(cacheKey) || ''
// }

var getConfigrationBroker = function (configration,f) {
  if(f){
    var data = configration
    for (var i in data.brokers) {
      if (data.brokers[i].key == f) {
        return data.brokers[i]
        break;
      }
    }
    return {}
  }else{
    return configration
  } 
}
// var getConfigrationKaihus = function (configration) {
//   var data = configration
//   console.log("getConfigration:") 
//   console.log(data)
//   if(data){
//     return data.kaihus 
//   }
//   return []
// }


// var getFrom = function () {
//   var configration = getConfigration()
//   if(configration){
//     return configration.key
//   }
//   return ''
// }

/* 获取当前页url */
function getCurrentPageUrl() {
  var pages = getCurrentPages()    //获取加载的页面
  var currentPage = pages[pages.length - 1]    //获取当前页面的对象
  var url = currentPage.route    //当前页面url
  return url
}

/*获取当前页带参数的url*/
function getCurrentPageUrlWithArgs() {
  var pages = getCurrentPages()    //获取加载的页面
  var currentPage = pages[pages.length - 1]    //获取当前页面的对象
  var url = currentPage.route    //当前页面url
  var options = currentPage.options    //如果要获取url中所带的参数可以查看options
  const app = getApp()
  var f = app.globalData.f
  if(f){
    options.from = f;
  }
  options.tguserid = userUtil.getTgwUserId()

  //拼接url的参数
  var urlWithArgs = url + '?'
  for (var key in options) {
    var value = options[key]
    urlWithArgs += key + '=' + value + '&'
  }
  urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)

  return urlWithArgs
}

/* 加载loading */
function showLoading(){
  wx.showLoading({
    title: "加载中",
    mask: true
  })
}
/* 关闭loading */
function hideLoading() {
  wx.hideLoading()
}

function getShareAppMessage(){
  return {
    title: '您的朋友邀请你参加股票推推，赢取万元大奖',
    path: '/pages/home/home?tguserid=' + userUtil.getTgwUserId()
  }
}

module.exports = {
  base64_encode: base64_encode,
  getAvatar: getAvatar,
  getFrom: getFrom,
  //loadConfigration: loadConfigration,
  // getConfigration: getConfigration,
  getConfigrationBroker: getConfigrationBroker,
  // getConfigrationKaihus: getConfigrationKaihus,
  getCurrentPageUrl: getCurrentPageUrl,
  getCurrentPageUrlWithArgs: getCurrentPageUrlWithArgs,
  showLoading: showLoading,
  hideLoading: hideLoading,
  getShareAppMessage: getShareAppMessage
}  