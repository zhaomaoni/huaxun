// pages/content/content.js
var util = require("../../utils/util.js")
Page({
  /* 页面的初始数据 */
  data: {
    list:[],
    showAd:false
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (opt) {
    var name = opt.name;
    var _this = this;
    util.loadAd(function (showAD) {
      _this.setData({
        showAd: showAD
      });
    })
    wx.request({
      url: 'https://api.51gsl.com/program/carPrice',
      method: 'POST',
      data: {
        spell:name
      },
      header: {
        'content-type': 'application/json',
        "Accept": "application/vnd.51gsl.v6+json"
      },
      success: function(res) {
        _this.setData({
          list: res.data.data.data
        })
      },
      fail: function(res) {}
    })
  },
  /* 点击广告跳转 */
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