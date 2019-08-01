// pages/result/result.js
var WxParse = require('../../wxParse/wxParse.js');
var loadData = require("../../utils/data.js")
var util = require("../../utils/util.js")
Page({
  /* 页面的初始数据 */
  data: {
    list:[],
    index: 0,
    showAd: false,
    key:"",
    nodes:""
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (opt) {
    var index = opt.index;
    var key = opt.key;
    var content = opt.content;
    var _list = loadData.loadData();
    var txt;
    var _this = this;
    util.loadAd(function (showAD) {
      _this.setData({
        showAd: showAD
      });
    })
    for(var i in _list){
      if(index == i){
        txt = _list[i].result[key]
      }
    }
    this.setData({
      list: _list,
      index: index,
      key:key
    })
    if(content){
      this.setData({
        nodes: content
      })
    }else{
      this.setData({
        nodes: txt
      })
    }
    WxParse.wxParse('article', 'html', this.data.nodes, this, 5);
  },
  /* 点击广告跳转 */
  images: function () {
    util.ad(this.data.showAd)
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