// pages/content/content.js
var WxParse = require('../../wxParse/wxParse.js');
var util = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nodes:"",
    filename:"",
    title: "",
    showAd: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    util.loadAd(function (showAD) {
      _this.setData({
        showAd: showAD
      });
    }) 
    var fileName = options.fileName;
    var title = options.content;
    wx.setNavigationBarTitle({//动态设置标题
      title: title
    })
    wx.request({
      url: "https://api.51gsl.com/program/getInfo",
      method: "POST",
      header: {
        'content-type': 'application/json',
        "Accept": "application/vnd.51gsl.v6+json"
      },
      data: {
        "folderName": "KLine/kLineHtml",
        "fileName": fileName
      },
      success: function (res) {
        var data = res.data.data;
        _this.setData({
          nodes:data,
          filename: options.fileName,
          title : options.content
        })
        WxParse.wxParse('article', 'html', _this.data.nodes, _this, 5);
      }
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    var _this = this;
    return {
      title: _this.data.title,
      path: 'pages/content/content?fileName=' + _this.data.filename + "&content=" + _this.data.title,
      success: function (res) {  // 转发成功
        wx.showShareMenu({          // 要求小程序返回分享目标信息
          withShareTicket: true
        });
      },
      fail: function (res) {        // 转发失败
        console.log(res);
      }
    }
  },
  /* 点击banner图片跳转 */
  images: function () {
    wx.navigateTo({
      url: "../banner/banner"
    })
  }
})