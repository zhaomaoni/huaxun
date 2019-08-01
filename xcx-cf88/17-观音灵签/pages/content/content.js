var WxParse = require('../../wxParse/wxParse.js');
var util = require("../../utils/util.js")
Page({
  /* 页面的初始数据 */
  data: {
    num: 1,
    showAd: false,
    nodes: []
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    var number = options.number;
    this.setData({
      num: number
    })
    var _this = this;
    util.loadAd(function (showAD) {
      _this.setData({
        showAd: showAD
      });
    })
    wx.request({
      url: 'https://api.51gsl.com/program/chou',
      data: {
        number: _this.data.num
      },
      header: {
        'content-type': 'application/json',
        "Accept": "application/vnd.51gsl.v6+json"
      },
      method: 'POST',
      success: function (res) {
        _this.setData({
          nodes: res.data.data
        })
        WxParse.wxParse('article', 'html', _this.data.nodes, _this, 5);
      },
      fail: function (res) { }
    })
  },
  /* 点击banner图片跳转 */
  images: function () {
    util.ad(this.data.showAd)
  },
  /* 生命周期函数--监听页面初次渲染完成 */
  onReady: function () { },
  /* 生命周期函数--监听页面显示 */
  onShow: function () { },
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