// pages/changexz/changexz.js
var data_json = require("../../utils/xzData.js")
var util = require("../../utils/util.js")
Page({
  /* 页面的初始数据 */
  data: {
    list:[],
    date:"",
    showAd: false
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (opt) {
    this.setData({
      list: data_json.getData(),
      date: opt.date
    })
    var that = this;
    util.loadAd(function (showAD) {
      that.setData({
        showAd: showAD
      });
    })
  },
  /* 点击广告跳转 */
  images: function () {
    util.ad(this.data.showAd)
  },
  /* 点击列表回退 */
  change:function(e){
    if(this.data.date == "day"){
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];  //上一个页面
      prevPage.setData({  //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
        constellation: e.currentTarget.dataset.index
      })
      wx.navigateBack({
        delta:1
      })
    } else if (this.data.date == "week"){
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];  //上一个页面
      prevPage.setData({  //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
        constellation: e.currentTarget.dataset.index
      })
      wx.navigateBack({
        delta: 1
      })
    }else{
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];  //上一个页面
      prevPage.setData({  //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
        constellation: e.currentTarget.dataset.index
      })
      wx.navigateBack({
        delta: 1
      })
    }
    
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