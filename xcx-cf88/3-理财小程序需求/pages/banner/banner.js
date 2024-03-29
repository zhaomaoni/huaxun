// pages/banner/banner.js
Page({
  /* 页面的初始数据 */
  data: {
    urls:""
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: 'https://api.51gsl.com/tgw/getBanner',
      data: {},
      header: {
        'content-type': 'application/json',
        "Accept":"application/vnd.51gsl.v1.1+json"
      },
      success: function (res) {
        console.log(res)
        that.setData({
          urls : res.data.clickUrl
        })
      },
      fail : function(res){
        console.log(res)
      }
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