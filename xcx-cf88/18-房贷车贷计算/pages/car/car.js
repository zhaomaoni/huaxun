// pages/car/car.js
var denge = require('../../utils/util.js')
Page({
  /* 页面的初始数据 */
  data: {
    casArray: [1, 2, 3, 4, 5],
    casIndex: 0,
    zong: "10",
    showAd: false,
    li: "4.35"
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    var that = this;
    denge.loadAd(function (showAD) {
      that.setData({
        showAd: showAD
      });
    })
  },
  /* 贷款年限 选择 */
  bindCasPickerChange: function (e) {
    this.setData({
      casIndex: e.detail.value
    })
  },
  /* 贷款总额 赋值 */
  zong: function (e) {
    this.setData({
      zong: e.detail.value
    })
  },
  /* 贷款利率 赋值 */
  li: function (e) {
    this.setData({
      li: e.detail.value
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
  onShareAppMessage: function () {},
  /* 点击banner图片跳转 */
  images: function () {
    denge.ad(this.data.showAd)
  },
  /* 点击 开始计算 跳转计算结果页 */
  jump: function () {
    if (this.data.zong != "" && this.data.li != "" && this.data.zong != 0 && this.data.li != 0) {
      wx.navigateTo({
        url: "../content/content?zong=" + this.data.zong + "&li=" + this.data.li + "&year=" + this.data.casArray[this.data.casIndex]
      })
    } else {
      wx.showModal({
        title: '输入提示',
        content: '所有选项不能为空或0'
      })
    }
  },
  /* 跳转赢家小工具 */
  moreBtn: function () {
    wx.navigateToMiniProgram({
      appId: 'wx81dacf7d77359d1d',
      path: '',
      envVersion: 'release'
    })
  }
})