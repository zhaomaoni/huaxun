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
      url: 'https://api.51gsl.com/program/advet',
      data: { type: 2, from: getFrom(), refferAppId: getRefferAppId(), appname: app.globalData.appname},
      method: "POST",
      header: {
        'content-type': 'application/json',
        "Accept": "application/vnd.51gsl.v6+json"
      },
      success: function (res) {
        showAD = res.data.code + "";
        wx.setStorageSync('showAD', showAD)
        wx.setStorageSync('updateTime', new Date())
        if (exec) {
          exec(showAD == "200")
        }
      }
    })
  } else {
    if (exec) {
      exec(showAD == "200")
    }
  }
}
var ad = function (show) {
  if (show) {
    wx.navigateTo({
      url: "../banner/banner"
    })
  }
}

module.exports = {
  loadAd: loadAd,
  ad: ad,
  setFrom: setFrom,
  getFrom: getFrom,
  getRefferAppId: getRefferAppId,
}