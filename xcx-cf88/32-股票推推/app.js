//app.js
const ald = require('./utils/ald-stat.js')
var util = require("/utils/util.js")
var test = require("/utils/test.js")
var tgwapi = require("/utils/tgwapi.js") 
App({
  onLaunch: function (options) {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    test.tgwapi()
    test.search()
    // console.log("options")
    // console.log(options) 
    //util.loadConfigration(options.query.from)
    var f = options.query.from
    // var cacheKey = 'configration'
    // if (f) {
    //   console.log("f:" + f)
    //   wx.setStorageSync("from", f);
    // } else {
    //   wx.setStorageSync("from", '');
    // }
    // tgwapi.configration(function (data) {
    //   console.log("configration:")
    //   console.log(data)
    //   wx.setStorageSync(cacheKey, data.data)
    //   if (this.configCallback) {
    //     this.configCallback();
    //   }
    // }) 
    //this.globalData.f = f;
    var _this = this;
    tgwapi.configration(function (data) {
      _this.globalData.configration = data.data
      // console.log("globalData:")
      // console.log(_this.globalData)
      if (_this.configCallback) {
        _this.configCallback(data.data);
      }
    })
   
  },
  onShow:function(obj){
    console.log(obj)
    if (obj.referrerInfo.appId){
      var appid = obj.referrerInfo.appId;
      this.globalData.referrerAppId = appid;
    }
    console.log(this.globalData)
  },
  globalData: {
    userInfo: null, 
    f: 'gtja',
    appid:"",
    referrerAppId : "",
    configration:null
  }
})