// 获取d当前时间多少天后的日期和对应星期
function getDates(days) {
  var todate = getCurrentMonthFirst()
  var dateArry = [];
  for (var i = 0; i < days; i++) {
    var dateObj = dateLater(todate, i);
    dateArry.push(dateObj)
  }
  return dateArry;
}
/* 传入时间后几天 param：传入时间：dates: "2018-04-02", later:往后多少天 */
function dateLater(dates, later) {
  let dateObj = {};
  let show_day = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
  let date = new Date(dates);
  date.setDate(date.getDate() + later);
  let day = date.getDay();
  dateObj.year = date.getFullYear();
  dateObj.month = ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : (date.getMonth()+1));
  dateObj.day = (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
  dateObj.week = show_day[day];
  return dateObj;
}
// 获取当前时间
function getCurrentMonthFirst() {
  var date = new Date();
  var todate = date.getFullYear() + "-" + ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1)) + "-" + (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
  return todate;
}
//获得某月的最后一天  
function getLastDay(year, month) {
  var new_year = year;    //取当前的年份          
  var new_month = month++;//取下一个月的第一天，方便计算（最后一天不固定）          
  if (month > 12) {
    new_month -= 12;        //月份减          
    new_year++;            //年份增          
  }
  var new_date = new Date(new_year, new_month, 1);                //取当年当月中的第一天          
  return (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate();//获取当月最后一天日期          
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
  var timestamp = Date.parse(updateTime) / 1000;
  var timestamp_now = Date.parse(new Date()) / 1000;
  if (typeof (showAD) === "undefined" || timestamp < timestamp_now - 0 * 60) {
    wx.request({
      url: 'https://api.51gsl.com/program/advet',
      data: { type: 2, from: getFrom(), refferAppId: getRefferAppId(), appname: app.globalData.appname },
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
  getDates: getDates,
  dateLater: dateLater,
  getLastDay: getLastDay,
  loadAd: loadAd,
  ad: ad,
  setFrom: setFrom,
  getFrom: getFrom,
  getRefferAppId: getRefferAppId,
}