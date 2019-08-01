// pages/index/index.js
var util = require("../../utils/util.js")
var app = getApp();
Page({
  /* 页面的初始数据 */
  data: {
    showAd: false,
    from:""
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    var that = this;
    app.aldstat.sendEvent();
  },
  /* 点击广告跳转 */
  images: function () {
    util.ad(this.data.showAd)
  },
  /* 文本框跳转 */
  inputChange:function(e){
    var value = e.detail.value;
    wx.navigateTo({
      url: "../search/search"
    })
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
  onReachBottom: function () {},
  /* 用户点击右上角分享 */
  onShareAppMessage: function () {}
})