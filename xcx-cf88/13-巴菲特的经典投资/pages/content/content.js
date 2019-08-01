var WxParse = require('../../wxParse/wxParse.js');
var index_json = require('../../utils/index_json.js')
var util = require("../../utils/util.js")
Page({
  /* 页面的初始数据 */
  data: {
    i:'',
    j:0,
    nodes: [],
    showAd: false
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    var i = options.i ;
    var j = parseInt(options.j,10) || 0;
    var json_data = index_json.getSData();
    var data = json_data[i][j];
   
    this.setData({
      titles: data['title'],
      frommedia: data['frommedia'],
      nodes: data['content']
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
    var _this = this;
    var i = this.data.i;
    var j = this.data.j;
    var json_data = index_json.getSData();
    var data = json_data[i][j];
    var title = data['title'];
    var path = 'pages/content/content?i=' + i + "&j=" + j;
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