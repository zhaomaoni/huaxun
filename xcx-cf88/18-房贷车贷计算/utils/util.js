var benxi = function(data,n,a,ze,p,i,xi){
  a = p * ((i * Math.pow((1 + i), n)) / ((Math.pow((1 + i), n) - 1))) //月供
  xi = Math.round(Number(((n * a - p)).toFixed(0)));//总利息
  ze = Number(p) + xi;//总还款额 
  var yhbj = 0; //已还本金
  var yhze = 0; //已还总额
  for (var k = 0; k < n; k++) {
    var obj = {};
    obj.ygze = Math.round(a);
    obj.ze = Math.round((ze - yhze) - obj.ygze);
    obj.yglx = Math.round((k == 0 ? Math.round(Number(p)) : Math.round(Number(p)) - yhbj) * i);
    obj.ygbj = obj.ygze - obj.yglx;
    yhbj += obj.ygbj;
    yhze += a;
    data[k] = obj
  }
}
var benjin = function (data, n, a, ze, p, i, xi){
  xi = Number(((n + 1) * p * i / 2).toFixed(2));;//总利息
  ze = Number(p) + xi;//总还款额 
  var yhbj = 0; //已还本金
  var yhze = 0; //已还总额
  for (var k = 0; k < n; k++) {
    var obj = {};
    obj.ygze = p / n + (1 - ((k + 1) - 1) / n) * p * i;
    obj.ze = Math.round((ze - yhze) - obj.ygze);
    obj.yglx = Math.round((k == 0 ? Math.round(Number(p)) : Math.round(Number(p)) - yhbj) * i);
    obj.ygbj = Math.round(obj.ygze - obj.yglx);
    yhbj += obj.ygbj;
    yhze += obj.ygze;
    obj.ygze = Math.round(obj.ygze);
    data[k] = obj
  }
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
      url: 'https://api.51gsl.com/program/advet',
      data: { type: 2, from: getFrom(), refferAppId: getRefferAppId(),appname: app.globalData.appname  },
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
  benxi: benxi,
  benjin: benjin,
  loadAd: loadAd,
  ad: ad,
  setFrom: setFrom,
  getFrom: getFrom,
  getRefferAppId: getRefferAppId
}
