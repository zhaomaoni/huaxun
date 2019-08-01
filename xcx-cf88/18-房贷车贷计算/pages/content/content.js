// pages/content/content.js
var denge = require('../../utils/util.js')
Page({
  /* 页面的初始数据 */
  data: {
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    showAd: false,
    p : 0, //贷款总额
    i : 0, //月利率
    y : 0, //总利率
    n : 1, //贷款月数
    a : 0, //月供,
    xi : 0, //支付利息
    m : 1, //还款第n期
    ze : 0, //总还款额
    An: 0  //第n期还款额
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (ops) {
    var zong = ops.zong;
    var li = ops.li;
    var year = ops.year;
    this.setData({
      p: ops.zong,
      i: li,
      n: year * 12,
      y: li
    })
    this.money()
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
  /* 滑动切换tab */
  bindChange: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
    this.money()
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
    this.money()
  },
  money : function(){
    var _this = this;
    var p = this.data.p * 10000;  //贷款总额
    var An = this.data.An; //第n期还款额
    var m = this.data.m; //还款第n期
    var i = this.data.i / 100 / 12; //月利息
    var y = this.data.y / 100;  //总利率
    var n = this.data.n;  //贷款月数
    var a = this.data.a;  //本息 月供
    var xi = this.data.xi;  //支付利息
    var ze = this.data.ze;     //还款总额
    if (this.data.currentTab ==0) {
      /***** 等额本息 *****/
      //等额本息总利息=还款月数×每月月供-贷款总额
      a = p * ((i * Math.pow((1 + i), n)) / ((Math.pow((1 + i), n) - 1))) //月供
      a = a.toFixed(2)
      xi = Number(((n * Math.round(a) - p) / 10000).toFixed(2));
      ze = (Number(p / 10000) + xi).toFixed(2);
      this.setData({
        a: a,
        xi: xi,
        ze: ze
      })
    } else {
      /***** 等额本金 *****/
      //等额本金总利息=（还款月数+1）×贷款总额×月利率÷2
      An = p / n + (1 - (m - 1) / n) * p * i; //第n期的月供
      An = An.toFixed(2)
      xi = Number(((n + 1) * p * i / 2 / 10000).toFixed(2));
      ze = (Number(p / 10000) + xi).toFixed(2);
      this.setData({
        An: An,
        xi: xi,
        ze: ze
      })
    }
  },
  /* 点击banner图片跳转 */
  images: function () {
    denge.ad(this.data.showAd)
  },
  /* 点击 开始计算 跳转计算结果页 */
  jump: function () {
    if(this.data.currentTab==0){
      wx.navigateTo({
        url: "../month/month?n=" + this.data.n + "&i=" + this.data.i + "&p=" + this.data.p + "&currentTab=0"
      })
    } else if(this.data.currentTab == 1){
      wx.navigateTo({
        url: "../month/month?n=" + this.data.n + "&i=" + this.data.i + "&p=" + this.data.p + "&currentTab=1"
      })
    }
  },
  /* 生命周期函数--监听页面初次渲染完成 */
  onReady: function () { },
  /* 生命周期函数--监听页面显示 */
  onShow: function () { },
  /** 生命周期函数--监听页面隐藏 */
  onHide: function () { },
  /** 生命周期函数--监听页面卸载 */
  onUnload: function () { },
  /* 页面相关事件处理函数--监听用户下拉动作 */
  onPullDownRefresh: function () { },
  /* 页面上拉触底事件的处理函数 */
  onReachBottom: function () { },
  /* 用户点击右上角分享 */
  onShareAppMessage: function (ops) { }
})