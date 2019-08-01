// pages/index/index.js
var app = getApp();
var util = require("../../utils/util.js")
var date = require("../../utils/date.js")
Page({
  /** 页面的初始数据 */
  data: {
    date1: date.oneMonth(36),
    date2: date.getDates(),
    showAd: false,
    list:[],
    pageNum:1,
    loadMoreIs: true,
    from:""
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (opt) {
    app.aldstat.sendEvent(this.loadData(this.data.pageNum))
  },
  loadData: function (pageNum){
    var _this = this;
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    if (this.data.loadMoreIs == false) {
      wx.hideLoading()
      return;
    }
    wx.request({
      url: "https://api.51gsl.com/wx",
      method: 'POST',
      data: {
        "url": 'http://api.dataide.eastmoney.com/data/get_zdht_list?jsonp_callback=var%20dAJicQCy%20=%20(x)&orderby=dim_rdate&order=desc&pagesize=30',
        'types': "GET",
        "pageindex": pageNum++,
        "startdate": _this.data.date1,
        "enddate": _this.data.date2,
      },
      header: {
        'content-type': 'application/json',
        "Accept": "application/vnd.51gsl.v6+json"
      },
      success: function (res) {
        var _list = res.data.substring(res.data.indexOf('{') + 0);
        _list = JSON.parse(_list).data;
        var dataList = _list;
        _this.setData({
          loadMoreIs: dataList.length == 30
        })
        if (_this.data.loadMoreIs==false) {
          _this.setData({
            list: dataList,
            pageNum: pageNum++
          })
        } else {
          _this.setData({
            pageNum: pageNum++,
            list: _this.data.list.concat(dataList)
          })
        }
        wx.hideLoading()
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
      },
      fail: function (res) {
        _this.setData({
          loadMoreIs: false
        })
        wx.hideLoading()
      }
    })
  },
  /* 点击banner图片跳转 */
  images: function () {
    util.ad(this.data.showAd)
  },
  /* 生命周期函数--监听页面初次渲染完成 */
  onReady: function () {},
  /* 生命周期函数--监听页面显示 */
  onShow: function () {
    this.setData({
      from: util.getFrom() || util.getRefferAppId()
    })
    console.log("data:");
    console.log(this.data);
    var that = this;
    util.loadAd(function (showAD) {
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
  onReachBottom: function () {
    this.setData({
      loadMoreIs:true
    })
    this.loadData(this.data.pageNum)
  },
  /* 用户点击右上角分享 */
  onShareAppMessage: function () {},
  /* 日期选择器 */
  bindDateChange1: function (e) {
    this.setData({
      date1: e.detail.value,
      loadMoreIs: true,
      pageNum: 1
    })
    this.loadData(this.data.pageNum)
  },
  bindDateChange2: function (e) {
    this.setData({
      date2: e.detail.value,
      loadMoreIs:true,
      pageNum:1
    })
    this.loadData(this.data.pageNum)
  },
  /* 点击详情按钮跳转 */
  clickBtn:function(e){
    var obj = e.currentTarget.dataset.obj;
    var name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '../content/content?obj='+obj+"&name="+name,
    })
  }
})