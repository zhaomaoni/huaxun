//mychart-dom-multi-bar// pages/result1/result1.js
var util = require("../../utils/util.js")
Page({
  /* 页面的初始数据 */
  data: {
    name: "",
    code: "",
    price: "",
    showAd: false,
    down: ""
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    console.log(options)
    var name = options.name;
    var code = options.code;
    var price = options.price;
    var down = options.down;
    var _this = this;
    util.loadAd(function (showAD) {
      _this.setData({
        showAd: showAD
      });
    })
    this.setData({
      name: name,
      code: code,
      price: price,
      down: down
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