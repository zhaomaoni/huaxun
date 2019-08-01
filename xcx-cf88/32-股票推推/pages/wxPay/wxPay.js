// pages/wxPay/wxPay.js
var loginStatus = true;
var app = getApp();
Page({
  /* 页面的初始数据 */
  data: {},
  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {  
    console.log(options);
    var payParam = decodeURIComponent(options.payParam)
    console.log(payParam)
    var result = JSON.parse(payParam)
    console.log(result)
    wx.requestPayment({
      'timeStamp': result.timeStamp,
      'nonceStr': result.nonceStr,
      'package': result.package,
      'signType': 'MD5',
      'paySign': result.paySign,
      'success': function (res) {
        console.log('success');
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 3000
        });
        wx.setStorageSync('zhiboUrl', result.redirect)
        wx.navigateTo({
          url: '../zhibo/zhibo',
        })
      },
      'fail': function (res) {
        wx.setStorageSync('zhiboUrl', result.redirect)
        wx.navigateTo({
          url: '../zhibo/zhibo',
        })
      }
    });
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