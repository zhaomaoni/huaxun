// pages/index/index.js
var app = getApp();
var util = require("../../utils/util.js")
var user = require("../../utils/user.js")
Page({
  /* 页面的初始数据 */
  data: {
    from:"",
    list:[],
    isShow: true,
    showAd: false,
    appname: app.globalData.appname
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    var _this = this;
    var isLogin = user.getWechatUserInfo()
    if (isLogin) {
      _this.setData({
        isShow: false
      })
    }
    app.aldstat.sendEvent("新股申购");
    this.loadData()
  },
  /* 加载数据 */
  loadData:function(){
    var _this = this;
    wx:wx.request({
      url: 'https://oauth.cf8.cn/MiniPro/ns/json.php',
      data: '',
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        console.log(res.data)
        _this.setData({
          list: res.data
        })
      },
      fail: function(res) {}
    })
    var that = this;
    util.loadAd(function (showAD) {
      that.setData({
        showAd: showAD
      });
    })
  },
  /* 点击广告 跳转广告详情 */
  images: function () {
    util.ad(this.data.showAd)
  },  
  mainFn:function(e){
    var code = e.currentTarget.dataset.code
    console.log(code)
    wx.navigateTo({
      url: '../content/content?code='+code,
    })
  },
  /* 跳转赢家小工具 */
  moreBtn: function () {
    var _this = this;
    wx.navigateToMiniProgram({
      appId: 'wx81dacf7d77359d1d',
      path: '/pages/index/index?from=' + _this.data.from,
      envVersion: 'release'
    })
  },
  // setFrom : function (options) {
  //   if (options.from) {
  //     wx.setStorageSync('from', options.from)
  //   }
  // },
  // getFrom : function () {
  //   return wx.getStorageSync('from') || ''
  // },
  // getRefferAppId : function () {
  //   return wx.getStorageSync('refferAppId') || ''
  // },
  /* 生命周期函数--监听页面初次渲染完成 */
  onReady: function () {},
  /* 生命周期函数--监听页面显示 */
  onShow: function () {
    // this.setData({
    //   from: this.getFrom() || this.getRefferAppId()
    // })
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