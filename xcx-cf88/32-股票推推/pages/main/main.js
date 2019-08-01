// pages/main/main.js
var WxParse = require('../../wxParse/wxParse.js');
var util = require("../../utils/util.js")
var tgwapi = require("../../utils/tgwapi.js")
var userUtil = require("../../utils/userUtil.js")
Page({
  /* 页面的初始数据 */
  data: {
    //jUrl:""
    list:[]
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    var _this = this;
    // var jUrls = options.jUrl;
    // this.setData({
    //   jUrl: jUrls
    // })
    var pId = options.pId;
    // var pId = 40000;
    var cId = options.cId;
    console.log(cId + "****" +pId)
    var datas = {
      "consultingId": cId,
      "userId": userUtil.getTgwUserId(),
      "queryType": 3,
      "productId": pId
    }
    tgwapi.getIvestmentsAndViews(datas,function (res) {
      console.log(res.data.data)
      var _list = res.data.data;
      for (var i in _list) {
        _list[i].publishHeadAddress = util.getAvatar(_list[i].publishHeadAddress)
        console.log(_list[i].publishHeadAddress)
      }
      _this.setData({
        list:_list,
        nodes: res.data.data[0].noPayContent
      })
      WxParse.wxParse('article', 'html', _this.data.nodes, _this, 5);
    })
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
    return util.getShareAppMessage() 
  }
})