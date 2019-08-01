// pages/month/month.js
var data_json = require("../../utils/xzData.js")
var date_fn = require("../../utils/date.js")
var util = require("../../utils/util.js")
Page({
  /* 页面的初始数据 */
  data: {
    list: [],
    xz_data: [],
    date: "month",
    showAd: false,
    nodes: [],
    constellation: "Aries"
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    var that = this;
    util.loadAd(function (showAD) {
      that.setData({
        showAd: showAD
      });
    })
  },
  /* 获取数据 */
  loadList: function () {
    var _this = this;
    var datas = data_json.getData();
    wx.request({
      url: 'https://api.51gsl.com/program/constell',
      method: 'POST',
      data: {
        constellation: _this.data.constellation,
        date: _this.data.date
      },
      header: {
        'content-type': 'application/json',
        "Accept": "application/vnd.51gsl.v6+json"
      },
      success: function (res) {
        var _list = res.data.data.data;
        for (var i in datas) {
          if (datas[i].constellation == _this.data.constellation) {
            _this.setData({
              xz_data: datas[i]
            })
          }
        }
        var dates = _list.date.split("-")
        var str = dates[0] + "年" + dates[1] + "月"
        _this.setData({
          list: _list,
          str: str
        })
      },
      fail: function (res) { }
    })
  },
  /* 点击广告跳转 */
  images: function () {
    util.ad(this.data.showAd)
  },
  /* 点击 切换星座 */
  changBtn: function () {
    wx.navigateTo({
      url: '../changexz/changexz?date=' + this.data.date
    })
  },
  /* 生命周期函数--监听页面初次渲染完成 */
  onReady: function () { },
  /* 生命周期函数--监听页面显示 */
  onShow: function () {
    var _this = this;
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    if (currPage.data.constellation) {
      _this.setData({
        constellation: currPage.data.constellation
      })
    }
    this.loadList()
    
  },
  /* 生命周期函数--监听页面隐藏 */
  onHide: function () { },
  /* 生命周期函数--监听页面卸载 */
  onUnload: function () { },
  /* 页面相关事件处理函数--监听用户下拉动作 */
  onPullDownRefresh: function () { },
  /* 页面上拉触底事件的处理函数 */
  onReachBottom: function () { },
  /* 用户点击右上角分享 */
  onShareAppMessage: function () { }
})