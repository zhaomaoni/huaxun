// pages/content/content.js
var util = require("../../utils/util.js")
Page({
  /* 页面的初始数据 */
  data: {
    content:[],
    title:"",
    url:""
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (opt) {
    var index = opt.index;
    var title = opt.title;
    var _this = this;
    util.loadAd(function (showAD) {
      _this.setData({
        showAd: showAD
      });
    })
    wx.request({
      url: 'https://api.51gsl.com/program/dreamInfo',
      method: 'POST',
      data: {
        url: index
      },
      header: {
        'content-type': 'application/json',
        "Accept": "application/vnd.51gsl.v6+json"
      },
      success: function (res) {
        if(res.data.code!=2001){
          _this.setData({
            content: res.data.data.data,
            title:title,
            url:index
          })
        }else{
          _this.setData({
            content: ["无内容"]
          })
        }
      },
      fail: function (res) { }
    })
  },
  /* 点击广告跳转 */
  images: function () {
    util.ad(this.data.showAd)
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
  onShareAppMessage: function () {
    var title = this.data.title;
    var path = 'pages/content/content?title=' + title + "&content=" + this.data.content;
    console.log(path)
    return {
      title: title,
      path: path,
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