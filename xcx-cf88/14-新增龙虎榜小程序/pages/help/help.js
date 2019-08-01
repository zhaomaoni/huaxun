// pages/help/help.js
var app = getApp();
var help_json = require('../../utils/help_json.js')
Page({
  /* 页面的初始数据 */
  data: {
    list: []
  },
  /* 点击跳转 */
  jump : function(e){
    var i = e.currentTarget.dataset.i;
    var j = e.currentTarget.dataset.j;
    wx.navigateTo({
      url: '../helpMsg/helpMsg?i=' + i + '&j=' + j
    })
  },
  /* 获取数据 */
  loadList: function () {
    var _this = this;
    var _list = this.data.list;
    _list = help_json.getSData()
    this.setData({
      list: _list
    });
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    this.loadList()
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
    return {
      title: "新手入门",
      path: 'pages/help/help',
      success: function (res) {  // 转发成功
        wx.showShareMenu({          // 要求小程序返回分享目标信息
          withShareTicket: true
        });
      },
      fail: function (res) {        // 转发失败
        console.log(res)
      }
    }
  }
})