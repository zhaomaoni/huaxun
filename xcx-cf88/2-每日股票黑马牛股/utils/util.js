var getOpenId  = function(){
  var openId = '';
  wx.login({
    success: res => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      if (res.code) {
        //发起网络请求
        wx.request({
          url: "https://api.51gsl.com/wx",
          data: {
            url: "http://mobile2.cf8.cn/?r=wechat/login/index",
            'types': "post",
            appid: "wx9510ce894ba9fea0",
            code: res.code
          },
          method: "POST",
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            "Accept": "application/vnd.51gsl.v6+json"
          },
          success: function (opn) {
            openId = opn.data.data.open_id;
            console.log(openId)
            wx.setStorage({
              key: "openid1",
              data: openId
            })
          }
        })
      }
    }
  })
  return openId;
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
var setFrom = function (options) {
  if (options.from) {
    wx.setStorageSync('from', options.from)
  }
}
var getFrom = function () {
  return wx.getStorageSync('from') || ''
}
var getRefferAppId = function () {
  return wx.getStorageSync('refferAppId') || ''
}
var loadAd = function (exec) {
  var app = getApp();
  var showAD = wx.getStorageSync('showAD') || undefined
  var updateTime = wx.getStorageSync('updateTime') || 0
  // console.log("showAD:" + showAD);
  // console.log("updateTime:" + updateTime);
  var timestamp = Date.parse(updateTime) / 1000;
  var timestamp_now = Date.parse(new Date()) / 1000;
  if (typeof (showAD) === "undefined" || timestamp < timestamp_now - 0 * 60) {
    wx.request({
      url: "https://api.51gsl.com/program/img",
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        "Accept": "application/vnd.51gsl.v6+json"
      },
      data: { from: getFrom(), appname: app.globalData.appname, refferAppId: getRefferAppId()},
      success: function (res) {
        showAD = res.data.code + "";
        wx.setStorageSync('showAD', showAD)
        wx.setStorageSync('updateTime', new Date())
        if (exec) {
          exec(showAD == "200")
        }
      },
      fail: function () {}
    })
  } else {
    if (exec) {
      exec(showAD == "200")
    }
  }
}
var ad = function (show,num) {
  if (show) {
    wx.navigateTo({
      url: '../today/today?num='+num,
    })
  }
}
module.exports = {
  getOpenId: getOpenId, 
  loadAd: loadAd,
  ad: ad,
  setFrom: setFrom,
  getFrom: getFrom,
  getRefferAppId: getRefferAppId,
}