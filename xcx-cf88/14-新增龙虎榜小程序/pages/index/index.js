// pages/index/index.js
var util = require("../../utils/util.js")
var app = getApp();
app.aldstat.sendEvent('事件名称');
Page({
  /* 页面的初始数据 */
  data: {
    currentTab: 0,
    list:[],
    lista: [],
    listb: [],
    from:"",
    jsonData: {},
    showAd: false,
    isShow: false,
    isShow1: false,
    isShow2: false,
    isShow3: false,
    isShow4: false,
    isShow5: false,
    isShow6: false,
    isShow7: false
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    this.listFun()
    app.aldstat.sendEvent(this.listFun())
  },
  /* 跳转至广告页 */
  banner: function () {
    util.ad(this.data.showAd)
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
  /* 显示 隐藏 */
  isHide:function(){
    this.setData({
      isShow: (!this.data.isShow)
    })
  },
  isHide2: function () {
    this.setData({
      isShow1: (!this.data.isShow1)
    })
  },
  isHide3: function () {
    this.setData({
      isShow2: (!this.data.isShow2)
    })
  },
  isHide4: function () {
    this.setData({
      isShow3: (!this.data.isShow3)
    })
  },
  isHide5: function () {
    this.setData({
      isShow4: (!this.data.isShow4)
    })
  },
  isHide6: function () {
    this.setData({
      isShow5: (!this.data.isShow5)
    })
  },
  isHide7: function () {
    this.setData({
      isShow6: (!this.data.isShow6)
    })
  },
  isHide8: function () {
    this.setData({
      isShow7: (!this.data.isShow7)
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
  onShareAppMessage: function () {},
  /* 获取数据 */
  listFun: function (datas, i) {
    var _this = this;
    wx.request({
      url: "https://api.51gsl.com/program/dfindex",
      method: "GET",
      header: {
        'content-type': 'application/json',
        "Accept": "application/vnd.51gsl.v6+json"
      },
      success: function (res) {
        _this.setData({
          list : res.data.result
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  /* 点击tab切换 */
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  /* 点击证券营业部查询进行跳转 */
  mainJump:function(e){
    var url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: '../more/more?url='+url
    })
  },
  mainJump2:function(){
    wx.navigateTo({
      url: '../list/list'
    })
  },
  mainJump3: function (e) {
    var url = e.currentTarget.dataset.url;
    console.log(url)
    wx.navigateTo({
      url: '../more2/more2?url='+url
    })
  },
  mainJump4: function (e) {
    var url = e.currentTarget.dataset.url;
    console.log(url)
    wx.navigateTo({
      url: '../more3/more3?url=' + url
    })
  },
  mainJump5: function (e) {
    var url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: '../more4/more4?url=' + url
    })
  },
  mainJump6: function (e) {
    var url = e.currentTarget.dataset.url;
    console.log(url)
    wx.navigateTo({
      url: '../more5/more5?url=' + url
    })
  },
  mainJump7: function (e) {
    var url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: '../more6/more6?url=' + url
    })
  },
  jump : function(e){
    var code = e.currentTarget.dataset.code;
    var text = e.currentTarget.dataset.text;
    wx.navigateTo({
      url: '../listMain/listMain?code='+code+"&text="+text
    })
  },
  helpJump:function(){
    wx.navigateTo({
      url: '../help/help'
    })
  }
})