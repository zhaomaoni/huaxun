// pages/index/index.js
var app = getApp()
var datas = require("../../utils/data.js")
var util = require("../../utils/util.js")
var user = require("../../utils/user.js")
Page({
  /* 页面的初始数据 */
  data: {
    list:[],
    showAd: false,
    from:"",
    isShow:true
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (opt) {
    var _this = this;
    var isLogin = user.getWechatUserInfo()
    if (isLogin) {
      _this.setData({
        isShow: false
      })
    }
    app.aldstat.sendEvent("加载数据")
    this.setData({
      list: datas.dataFn()
    })
  },
  /* 跳转详情页 */
  jumpBtn:function(e){
   var urls = e.currentTarget.dataset.url;
   wx.navigateTo({
     url: '../content/content?url='+urls,
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