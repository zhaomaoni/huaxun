// pages/index/index.js
var app = getApp();
var util = require("../../utils/util.js")
Page({
  /* 页面的初始数据 */
  data: {
    showAd: false,
    list:[],
    from:""
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    app.aldstat.sendEvent(this.listLoad());
  },
  /* 加载数据 */
  listLoad:function(){
    var _this = this;
    wx.request({
      url: 'https://api.51gsl.com/program/carList',
      method: 'POST',
      header: {
        'content-type': 'application/json',
        "Accept": "application/vnd.51gsl.v6+json"
      },
      success: function (res) {
        _this.setData({
          list: res.data.data
        })
      },
      fail: function (res) { }
    })
  },
  /* 点击广告跳转 */
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
  onReachBottom: function () {},
  /* 用户点击右上角分享 */
  onShareAppMessage: function () {},
  /* 点击跳转 */
  jumpBtn:function(e){
    var name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: '../content/content?name='+ name
    })
  }
})