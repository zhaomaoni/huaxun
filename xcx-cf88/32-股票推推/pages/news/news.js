// pages/news/news.js
var util = require("../../utils/util.js")
var tgwapi = require("../../utils/tgwapi.js")
Page({
  /* 页面的初始数据 */
  data: {
    list:[]
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    var _this = this;
    tgwapi.getViewKits(function (res) {
        console.log(res.data.list)
        _this.setData({
          list:res.data.list
      })
      for (var i in res.data.list) {
        //console.log(res.data.list[i].pictureInfo[0].pictureAddress)
        var pic = res.data.list[i].pictureInfo[0].pictureAddress;
        if(pic.search("https://")==-1){
          util.getAvatar(pic)
          console.log(util.getAvatar(pic))
        }
      }
      return
    })
    
    // var urls = this.data.list[5].pictureInfo[0].pictureAddress;
    //console.log("urls" + urls)
    // util.getAvatar(urls)
  },
  /* 点击调转详情 */
  jumpBtn:function(e){
    console.log(e)
    //var jUrl = e.currentTarget.dataset.jumpurl;
    var pId = e.currentTarget.dataset.productid;
    var cId = e.currentTarget.dataset.consultingid;
    wx.navigateTo({
      url: '../main/main?pId=' + pId +"&cId=" + cId,
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