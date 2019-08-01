// pages/index/index.js
var app = getApp();
var week = require('../../utils/util.js');
Page({
  /* 页面的初始数据 */
  data: {
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    date: '',
    isShow:0,
    list1:[],
    list2:[],
    weeks: [],
    showAd: false,
    year: week.getDates(1)[0].year,
    day: week.getDates(1)[0].month + week.getDates(1)[0].day,
    from:""
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    var _this = this;
    wx.getSystemInfo({ // 获取系统信息
      success: function (res) {
        _this.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    app.aldstat.sendEvent(this.shuju())
    this.shijian()
    var arr = [];
    this.setData({
      date: week.getDates(1)[0].year + '-' + week.getDates(1)[0].month + '-' + week.getDates(1)[0].day
    })
    for (var i = 0; i < 4; i++) {
      arr = arr.concat(week.dateLater(this.data.date, i))
    }
    this.setData({
      weeks: arr
    })
  },
  /* 数据数据 */
  shuju:function(){
    var _this = this;
    wx.request({
      url: 'https://api.51gsl.com/wx',
      method: 'POST',
      data: {
        url: "https://rili.jin10.com/datas/"+ _this.data.year + "/" + _this.data.day +"/economics.json",
        types: "GET",
        is_ssl: 1
      },
      header: {
        'content-type': 'application/json',
        "Accept": "application/vnd.51gsl.v6+json"
      },
      success: function (res) {
        _this.setData({
          list1: res.data
        })
      },
      fail: function (res) { }
    })
  },
  /* 跳转赢家小工具 */
  moreBtn: function () {
    var _this = this;
    wx.navigateToMiniProgram({
      appId: 'wx81dacf7d77359d1d',
      path: '/pages/index/index?from='+_this.data.from,
      envVersion: 'release'
    })
  },
  /* 事件数据 */
  shijian:function(){
    var _this = this;
    wx.request({
      url: 'https://api.51gsl.com/wx',
      method: 'POST',
      data: {
        url: "https://rili.jin10.com/datas/" + _this.data.year + "/" + _this.data.day +"/event.json",
        types: "GET",
        is_ssl: 1
      },
      header: {
        'content-type': 'application/json',
        "Accept": "application/vnd.51gsl.v6+json"
      },
      success: function (res) {
        _this.setData({
          list2: res.data
        })
      },
      fail: function (res) { }
    })
  },
  /* 生命周期函数--监听页面初次渲染完成 */
  onReady: function () {},
  /* 生命周期函数--监听页面显示 */
  onShow: function () {
    this.setData({
      from: week.getFrom() || week.getRefferAppId()
    })
    console.log("data:");
    console.log(this.data);
    var that = this;
    week.loadAd(function (showAD) {
      that.setData({
        showAd: showAD
      });
    })  
  },
  /* 生命周期函数--监听页面隐藏 */
  onHide: function () {},
  /* 生命周期函数--监听页面卸载 */
  onUnload: function () {},
  /* 页面相关事件处理函数--监听用户下拉动作 */
  onPullDownRefresh: function () {},
  /* 页面上拉触底事件的处理函数 */
  onReachBottom: function () {},
  /* 用户点击右上角分享 */
  onShareAppMessage: function () {},
  /* 滑动切换tab */
  bindChange: function (e) {
    var _this = this;
    _this.setData({
      currentTab: e.detail.current
    });
  },
  /* 点击tab切换 */
  swichNav: function (e) {
    var _this = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      _this.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  /* 日期点击 */
  dateClick:function(e){
    this.setData({
      year:e.currentTarget.dataset.year,
      day: e.currentTarget.dataset.day,
      isShow: e.currentTarget.dataset.index
    })
    this.shuju()
    this.shijian()
    //this.onLoad()
  },
  /* 时间选择器 */
  bindDateChange: function (e) {
    var _this = this;
    var dateArry = [];
    for (var i = 0; i < 1; i++) {
      var dateObj = week.dateLater(e.detail.value, i);
      dateArry.push(dateObj)
    }
    this.setData({
      date: dateArry[0].year + '-' + dateArry[0].month + '-' + dateArry[0].day,
      year: dateArry[0].year,
      day: dateArry[0].month + dateArry[0].day
    });
    var times = dateArry[0].month + '/' + dateArry[0].day;
    
    for(var j in this.data.weeks){
      var md = _this.data.weeks[j].month + "/" + _this.data.weeks[j].day
      if (md == times){
        _this.setData({
          isShow: j
        })
        break
      }else{
        _this.setData({
          isShow: -1
        })
      }
    }
    this.shuju()
    this.shijian()

    return dateArry;
  },
  /* 点击列表跳转 */
  images: function () {
    week.ad(this.data.showAd)
  }
})