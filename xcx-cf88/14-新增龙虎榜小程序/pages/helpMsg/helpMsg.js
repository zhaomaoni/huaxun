// pages/helpMsg/helpMsg.js
var WxParse = require('../../wxParse/wxParse.js');
var help_json = require('../../utils/help_json.js')
Page({
  /* 页面的初始数据 */
  data: {
    title:"",
    nodes:""
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    var i = options.i;
    var j = parseInt(options.j, 10) || 0;
    var json_data = help_json.getSData();
    var data = json_data[i][j];
    this.setData({
      title: data['title'],
      nodes: data['content']
    })
    wx.setNavigationBarTitle({
      title: data['title']
    })
    WxParse.wxParse('article', 'html', this.data.nodes, this, 5);
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
      title: this.data.title,
      path: 'pages/helpMsg/helpMsg',
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