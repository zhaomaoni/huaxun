var WxParse = require('../../wxParse/wxParse.js');
var util = require("../../utils/util.js")
Page({
  /* 页面的初始数据 */
  data: {
    titles:[],
    frommedia:[],
    nodes: [],
    showAd: false
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    var _con = decodeURIComponent(options.con);
    var tit = options.title;
    var fro = options.frommedia;
    this.setData({
      titles : tit,
      frommedia: fro,
      nodes : _con
    })
    var that = this;
    util.loadAd(function (showAD) {
      that.setData({
        showAd: showAD
      });
    }) 
    WxParse.wxParse('article', 'html', this.data.nodes, this, 5);
  },
  /* 点击banner图片跳转 */
  images: function () {
    util.ad(this.data.showAd)
  },
  /* 生命周期函数--监听页面初次渲染完成 */
  onReady: function () { },
  /* 生命周期函数--监听页面显 */
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
  onShareAppMessage: function () {
    return {
      title: this.data.title,
      path: 'pages/index/index',
      success: function (res) {  // 转发成功
        wx.showShareMenu({          // 要求小程序返回分享目标信息
          withShareTicket: true
        });
      },
      fail: function (res) {        // 转发失败
        console.log(res);
      }
    }
  }
})