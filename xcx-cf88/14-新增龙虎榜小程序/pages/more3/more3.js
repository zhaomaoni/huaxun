var app = getApp();
var dates = require('../../utils/date.js')
var util = require("../../utils/util.js")
var currentss = 0;
Page({
  /* 页面的初始数据 */
  data: {
    isShow:false,
    isShow2: false,
    showAd: false,
    mon:{3:"近3日",5:"近5日",10:"近10日",30:"近30日"},
    text:"",
    list:[],
    page:1,
    num:3,
    findDate: dates.getDates(),
    findDate2: dates.getDates(),
    loadText: "加载更多",
    currentTab:0,
    pagesize:20,
    url:"",
    ha:0
  },
  /* 跳转至广告页 */
  banner: function () {
    util.ad(this.data.showAd)
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    var that = this;
    util.loadAd(function (showAD) {
      that.setData({
        showAd: showAD
      });
    })
    var urls = options.url;
    this.setData({
      url:urls
    })
    this.loadList()
  },
  /* 用户点击右上角分享 */
  onShareAppMessage: function () { },
  /* 点击tab切换 */
  swichNav: function (e) {
    this.currentss = e.target.dataset.current
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: that.currentss,
        page : 1
      })
    }
    this.loadList()
  },
  /* 获取数据 */
  loadList : function(){
    var _this = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: "https://api.51gsl.com/wx",
      method: "POST",
      data: {
        url: _this.data.url,
        types: "GET",
        startDate: dates.getLastSevenDays(_this.data.findDate, _this.data.num),
        endDate: _this.data.findDate2,
        page: _this.data.page,
        pagesize: _this.data.pagesize,
        gpfw: _this.data.currentTab
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        "Accept": "application/vnd.51gsl.v6+json"
      },
      success: function (res) {
        _this.setData({
          list: res.data.result
        })
      },
      fail: function () {
        wx.hideLoading()
        return false;
      }
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 500)
  },
  /* 点击加载更多 */
  setLoading: function () {
    var _list = this.data.list;
    var _this = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    })
    wx.request({
      url: "https://api.51gsl.com/wx",
      method: "POST",
      data: {
        url: _this.data.url,
        types: "GET",
        startDate: dates.getLastSevenDays(_this.data.findDate, _this.data.num),
        endDate: _this.data.findDate2,
        page: _this.data.page + 1,
        pagesize: _this.data.pagesize,
        gpfw: _this.data.currentTab
      },
      header: {
        'content-type': 'application/json',
        "Accept": "application/vnd.51gsl.v6+json"
      },
      success: function (res) {
        console.log(_list.concat(res.data.result))
        _this.setData({
          loadText: "数据请求中",
          loading: true,
          list: _list.concat(res.data.result),
          loadText: "加载更多",
          loading: false,
          page: _this.data.page + 1
        })
        if (_this.data.list.length == _list.length) {
          _this.setData({
            loadText: "数据请求中",
            loading: true,
            list: _list.concat(res.data.result),
            loadText: "已全部加载完",
            loading: false,
            page: _this.data.page + 1
          })
        }
        _this.data.loading = false
        wx.hideLoading()
      },
      fail: function () {
        _this.data.loading = false
        wx.hideLoading()
        return false;
      }
    })
  },
  /* 日历 */
  calendars:function(){
    var _this = this;
    _this.setData({
      isShow: (!_this.data.isShow)
    })
  },
  /* 月份取消 */
  close:function(){
    this.setData({
      isShow: (!this.data.isShow)
    })
  },
  /* 获取月份 */
  month : function(e){
    var text = e.currentTarget.dataset.text;
    var index = e.currentTarget.dataset.index;
    this.setData({
      text : text,
      num : index,
      isShow: (!this.data.isShow),
      ha: index
    })
    this.loadList()
    console.log(dates.getLastSevenDays(this.data.findDate, this.data.num))
  },
  /* 点击帮助 */
  helpClick : function(){
    this.setData({
      isShow2: (!this.data.isShow2)
    })
  },
  /* 点击帮助遮罩里的确定按钮 */
  yesClick :function(){
    this.setData({
      isShow2: (!this.data.isShow2)
    })
  },
  //  点击日期组件确定事件  
  bindDateChange: function (e) {
    this.setData({
      findDate: e.detail.value
    })
  },
  bindDateChange2: function (e) {
    this.setData({
      findDate2: e.detail.value
    })
    console.log(e.detail.value)
  },
  /* 点击查询 */
  findBtn : function(){
    var _this = this;
    wx.request({
      url: "https://api.51gsl.com/wx",
      method: "POST",
      data: {
        url: "http://m.data.eastmoney.com/api/Lhb/StockStatisticList",
        types: "GET",
        startDate: _this.data.findDate,
        endDate: _this.data.findDate2,
        page: _this.data.page,
        pagesize: _this.data.pagesize,
        gpfw: _this.data.currentTab
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        "Accept": "application/vnd.51gsl.v6+json"
      },
      success: function (res) {
        _this.setData({
          list: res.data.result
        })
      }
    })
    this.setData({
      isShow: (!this.data.isShow)
    })
  }
})
