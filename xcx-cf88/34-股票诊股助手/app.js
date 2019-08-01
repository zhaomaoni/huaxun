//app.js
var aldstat = require("./utils/ald-stat.js");
App({

  // onHide() {
  //   this.data.webShowed = false;
  // },
  // data: {
  //   webShowed: false //标记web-view页面是否已经显示过了
  // },

  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  onShow: function (obj) {
    // console.log("onShow.obj:")
    // console.log(obj)
    var f = wx.getStorageSync('from') || ''
    var refferAppId = wx.getStorageSync('refferAppId') || ''
    if (!f && obj.query.from) {
      f = obj.query.from
      wx.setStorageSync('from', f)
    }
    if (obj.referrerInfo.appId) {
      refferAppId = obj.referrerInfo.appId
      wx.setStorageSync('refferAppId', refferAppId)
    }
  },
  globalData: {
    userInfo: null,
    req_url: 'https://oauth.cf8.cn/wxxcx/stock/',
    appname:"x-gupiaozhenguzhushou"
  }
})