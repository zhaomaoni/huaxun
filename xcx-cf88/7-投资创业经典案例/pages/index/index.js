// pages/index/index.js
var app = getApp()
var index_json = require('../../utils/index_json.js')
var util = require("../../utils/util.js")
Page({
  /* 页面的初始数据 */
  data: {
    lists: [[], [], []],
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    text: "",
    pageList: [0, 0, 0],
    pageNum: 10,
    hadLastPage: false,
    arr: ['投资案例', '创业案例', '理论相关'],
    loading: false,
    project:[],
    planning:[],
    knowledge: [],
    showAd: false,
    from:""
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (ops) {
    var that = this; 
    if (this.data.currentTab == 0) {
      this.data.text = "投资案例"
      app.aldstat.sendEvent(this.loadList(0, this.data.text))
    } else if (this.data.currentTab == 1) {
      this.data.text = "创业案例"
      this.loadList(0, this.data.text)
    } else if (this.data.currentTab == 2) {
      this.data.text = "理论相关"
      this.loadList(0, this.data.text)
    }
    wx.getSystemInfo({ // 获取系统信息
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    this.setData({
      from: util.getFrom() || util.getRefferAppId()
    })
    console.log("data:");
    console.log(this.data);
    util.loadAd(function (showAD) {
      that.setData({
        showAd: showAD
      });
    })
  },
  /* 跳转赢家小工具 */
  moreBtn: function () {
    var _this = this;
    wx.navigateToMiniProgram({
      appId: 'wx81dacf7d77359d1d',
      path: '/pages/index/index?from='+_this.data.from,
      envVersion: 'release'
    })
  },
  /* 滑动切换tab */
  bindChange: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
    if (that.data.pageList[that.data.currentTab] > 0) {
      return true;
    }
    this.loadList(that.data.currentTab, this.data.text)    
  },
  /* 点击tab切换 */
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
        text: this.data.arr[e.detail.current]
      })
    }
  },
  /* 点击banner图片跳转 */
  images: function () {
    util.ad(this.data.showAd)
  },
  /* 生命周期函数--监听页面初次渲染完成 */
  onReady: function () { },
  /* 生命周期函数--监听页面显示 */
  onShow: function () {},
  /** 生命周期函数--监听页面隐藏 */
  onHide: function () { },
  /** 生命周期函数--监听页面卸载 */
  onUnload: function () { },
  /* 页面相关事件处理函数--监听用户下拉动作 */
  onPullDownRefresh: function () {},
  /* 页面上拉触底事件的处理函数 */
  onReachBottom: function () {
    //this.loadList(this.data.currentTab, this.data.text)    
  },
  loadList: function (currentTab, text) {
    var _this = this;
    var _lists = this.data.lists;
    _lists = index_json.getSData()
    console.log(_lists)
    this.setData({
      lists : _lists    
    });
  },
  /* 用户点击右上角分享 */
  onShareAppMessage: function (ops) {
    return {
      title: this.data.text,
      path: 'pages/index/index',
      success: function (res) {  // 转发成功
        wx.showShareMenu({          // 要求小程序返回分享目标信息
          withShareTicket: true
        });
      },
      fail: function (res) {        // 转发失败
        console.log(res)
      }
    }
  },
  /* 点击跳转 */
  jump: function (e) {
    //var con = encodeURIComponent(e.currentTarget.dataset.content)
    //var title = e.currentTarget.dataset.title;
    //var frommedia = e.currentTarget.dataset.frommedia;
    var i = e.currentTarget.dataset.i;
    var j = e.currentTarget.dataset.j;
    wx.navigateTo({
      url: '../content/content?i=' + i + '&j=' + j
    })
  }
})