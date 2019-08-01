// pages/index/index.js
var WxParse = require('../../wxParse/wxParse.js');
var loadData = require("../../utils/data.js")
var bannerFn = require("../../utils/banner.js")
var util = require("../../utils/util.js")
var app = getApp();
Page({
  /* 页面的初始数据 */
  data: {
    list: [],
    showAd: false,
    picUrl:"",
    from:""
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    // console.log(loadData.loadData())
  
    var _this = this;
    util.loadAd(function (showAD) {
      _this.setData({
        showAd: showAD
      });
    })
    var keys = wx.getStorageSync("banPic")
    console.log(keys)
    var _list = loadData.loadData();
    this.setData({
      list:_list
    })
    app.aldstat.sendEvent(_list);
  },
  /* 点击列表跳转至答题页 */
  content:function(e){
    var index = e.currentTarget.dataset.index
    wx:wx.navigateTo({
      url: '../content/content?index='+index
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
  /* 生命周期函数--监听页面初次渲染完成 */
  onReady: function () { },
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
  onHide: function () { },
  /* 生命周期函数--监听页面卸载 */
  onUnload: function () { },
  /* 页面相关事件处理函数--监听用户下拉动作 */
  onPullDownRefresh: function () { },
  /* 页面上拉触底事件的处理函数 */
  onReachBottom: function () { },
  /* 用户点击右上角分享 */
  onShareAppMessage: function () { },
  /* 点击广告跳转 */
  images: function () {
    util.ad(this.data.showAd)
  }
})