// pages/introduce/introduce.js
var util = require("../../utils/util.js")
Page({
  /* 页面的初始数据 */
  data: {
    imgList:{},
    showAd:false,
    text:""
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    var _this = this;
    util.loadAd(function (showAD) {
      _this.setData({
        showAd: showAD
      });
      if(_this.data.showAd==true){
        _this.setData({
          imgList: { "0": "../../images/icon1.png", "quan_1": "../../images/icon2.png", "teacher_2662712": "../../images/icon3.png", "teacher_2662717": "../../images/icon4.png", "teacher_2662719": "../../images/icon5.png", "teacher_2662718": "../../images/icon6.png" }
        })
      }else{
        _this.setData({
          imgList: { "teacher_2662712": "../../images/icon3.png", "teacher_2662717": "../../images/icon4.png", "teacher_2662719": "../../images/icon5.png", "teacher_2662718": "../../images/icon6.png" }
        })
      }
    })
    this.loadData()
  },
  loadData:function(){
    var _this = this;
    wx.request({
      url: 'https://oauth.cf8.cn/MiniPro/xcx/video/index.php',
      method: 'GET',
      data: {
        "pageNum": 1,
        "barNum": 2
      },
      header: {
        'content-type': 'application/json',
        "Accept": "application/vnd.51gsl.v6+json"
      },
      success: function (res) {
        _this.setData({
          text: res.data.data.wxNum
        })
      },
      fail: function (res) { }
    })
  },
  /* 跳转详情页 */
  jumpPage:function(e){
    var index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../content/content?index='+index+"&text="+this.data.text,
    })
  },
  /* 生命周期函数--监听页面初次渲染完成 */
  onReady: function () { },
  /* 生命周期函数--监听页面显示 */
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
  onShareAppMessage: function () { }
})