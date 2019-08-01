// pages/month/month.js
var denge = require('../../utils/util.js')
Page({
  /* 页面的初始数据 */
  data: {
    showAd: false,
    showData : []
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    var that = this;
    denge.loadAd(function (showAD) {
      that.setData({
        showAd: showAD
      });
    })
    var p = Number(options.p) * 10000;  //贷款总额 30万
    var i = Number(options.i) / 100 / 12; //月利率
    var n = Number(options.n); //贷款月数
    var currentTab = Number(options.currentTab);//等额本息：0,等额本金：1 
    var xi,ze;
    var a;
    if (currentTab==0){
      var data = [];
      denge.benxi(data,n,a,ze,p,i,xi)
      this.setData({
        showData: data
      })
    }else{
      var data = [];
      denge.benjin(data, n, a, ze, p, i, xi)
      this.setData({
        showData: data
      })
    }
  },
  /* 生命周期函数--监听页面初次渲染完成 */
  onReady: function () {},
  /* 生命周期函数--监听页面显示 */
  onShow: function () {},
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
  /* 点击banner图片跳转 */
  images: function () {
    denge.ad(this.data.showAd)
  }
})