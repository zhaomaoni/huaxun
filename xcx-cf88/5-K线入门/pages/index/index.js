// pages/index/index.js
var Array = require('../../utils/Array.js')
var util = require("../../utils/util.js")
var user = require("../../utils/user.js")
var getPhone = require("../../utils/getPhone.js")
var app = getApp();
Page({
  /* 页面的初始数据 */
  data: {
    list:[],
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    from:"",
    isShow:true
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
    this.loadList()
  },
  lala:function(e){
    var fileName = e.currentTarget.dataset.filename;
    var content = e.currentTarget.dataset.content;
    app.aldstat.sendEvent(e.currentTarget.dataset.fileName);
    wx.navigateTo({
      url: '../content/content?fileName=' + fileName + "&content=" + content,
    })
  },
  /* 请求数据 */
  loadList:function(){
    var _this = this;
    var _list = Array.Array();
    this.setData({
      list : _list
    })
    var apps = app.aldstat.sendEvent(_list);
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
  onReady: function () {},
  /* 生命周期函数--监听页面显示 */
  onShow: function () {
    this.setData({
      from: util.getFrom() || util.getRefferAppId()
    })
    // console.log("data:");
    // console.log(this.data);
    var that = this;
    util.loadAd(function (showAD) {
      that.setData({
        showAd: showAD
      });
    })
  },
  /* 点击 我知道了 获取手机号 */
  // bindGetUserInfo:function(){
  //   getPhone.phone()
  // },
  getPhoneNumber: function (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      // wx.showModal({
      //   title: '提示',
      //   showCancel: false,
      //   content: '未授权',
      //   success: function (res) { }
      // })
    } else {
      // wx.showModal({
      //   title: '提示',
      //   showCancel: false,
      //   content: '同意授权',
      //   success: function (res) { }
      // })
    }
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