// pages/add/add.js
var denge = require('../../utils/util.js')
Page({
  /* 页面的初始数据 */
  data: {
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    showData: [],
    showAd: false,
    showData2: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var p = Number(options.p) * 10000;  //贷款总额 30万
    var i = Number(options.i) / 100 / 12; //月利率
    var n = Number(options.n); //贷款月数
    var p1 = Number(options.p1) * 10000;  //贷款总额 30万
    var i1 = Number(options.i1) / 100 / 12; //月利率
    var currentTab = Number(options.currentTab);//等额本息：0,等额本金：1 
    var xi, ze, xi1, ze1;
    var a,a1;
    if (currentTab == 0) {
      var data = [];
      var data2 = [];
      denge.benxi(data, n, a, ze, p, i, xi)
      denge.benxi(data2, n, a1, ze1, p1, i1, xi1)
      this.setData({
        showData: data,
        showData2: data2
      })
    } else {
      var data = [];
      var data2 = [];      
      denge.benjin(data, n, a, ze, p, i, xi)
      denge.benjin(data2, n, a1, ze1, p1, i1, xi1)
      this.setData({
        showData: data,
        showData2: data2
      })
    }

    var that = this;
    denge.loadAd(function (showAD) {
      that.setData({
        showAd: showAD
      });
    })
    wx.getSystemInfo({ // 获取系统信息
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
  },
  /* 点击banner图片跳转 */
  images: function () {
    denge.ad(this.data.showAd)
  },
  /* 滑动切换tab */
  bindChange: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})