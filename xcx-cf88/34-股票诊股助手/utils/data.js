var conf = require('./config.js')
var getUrl = function (url) {
  return conf.apiList.apiUrl + url;
}
//get请求
var getInfo = function (params, success_callback, error_callback) {
  var url = getUrl(params)
  getRequest(url, success_callback, error_callback)
}
/* 处理通用get请求 */
var getRequest = function (url, success_callback, error_callback) {
  wx.request({
    url: url,
    method: 'GET',
    header: {
      'content-type': 'application/json',
      'Accept': 'application/json',
    }, 
    success: function (res) {
      console.log("调用接口(get)结果：" + url)
      console.log(res)
      if (success_callback) {
        success_callback(res)
      }
    },
    fail: function (res) {
      console.log(res)
      if (error_callback) {
        error_callback(res)
      }
    }
  })
}
module.exports={
  getRequest: getRequest,
  getInfo: getInfo
}
  //"http://s.cf8.com.cn/MiniPro/zhengu.php?action=recommend"
  // 诊股首页推荐股票接口 "http://s.cf8.com.cn/MiniPro/zhengu.php?action=recommand"
  // 诊股判断该股票是否有检测结果接口 "http://s.cf8.com.cn/MiniPro/zhengu.php?action=verify&stock=股票代码"
  // "https://oauth.cf8.cn/MiniPro/zhengu.php?action=verify&stock=600103"
  // 这个是有诊断结果的, 会返回一个 url字段.访问此URL时记得带上from参数, 用来判断是否显示广告
