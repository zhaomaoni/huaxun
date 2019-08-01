var tgwapi = require("../../utils/tgwapi.js")
var userUtil = require("../../utils/userUtil.js")
var conf = require('../../utils/config.js')
Page({
  /* 页面的初始数据 */
  data: {

  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    var _this= this;
    var uid = userUtil.getUserId()
    var token = userUtil.getUserToken()
    //获取我的邀请记录
    tgwapi.getInfo(conf.tgwUrl.inviteUrl + '&uid=' + uid + '&token=' + token, function (res) {
      console.log(res)
      _this.setData({
        list:res.data.list
      })
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
  onShareAppMessage: function () {}
})