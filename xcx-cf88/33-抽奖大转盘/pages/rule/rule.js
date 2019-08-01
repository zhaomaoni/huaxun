// pages/rule/rule.js
var tgwapi = require("../../utils/tgwapi.js")
var userUtil = require("../../utils/userUtil.js")
var conf = require('../../utils/config.js')
var WxParse = require('../../wxParse/wxParse.js');
Page({
  /* 页面的初始数据 */
  data: {
    nodes:[]
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    var _this = this;
    var uid = userUtil.getUserId()
    var token = userUtil.getUserToken()
    var info_url
    if (uid && token) {
      info_url = conf.tgwUrl.infoUrl + '&uid=' + uid + '&token=' + token
    } else {
      info_url = conf.tgwUrl.infoUrl
    }
    //当前抽奖活动详情及奖品
    tgwapi.getInfo(info_url, function (res) {
      _this.setData({
        //nodes: res.data.list.desc,
        desc: res.data.list.desc
      })
      //WxParse.wxParse('article', 'html', _this.data.nodes, _this, 5);
    })

    // wx.request({
    //   url: _this.data.desc,
    //   data: '',
    //   header: {},
    //   method: 'GET',
    //   dataType: 'json',
    //   responseType: 'text',
    //   success: function(res) {},
    //   fail: function(res) {},
    //   complete: function(res) {},
    // })



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
  onShareAppMessage: function (){}
})