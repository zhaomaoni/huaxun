// pages/index/index.js
var app = getApp();
var imgSrc = require("../../utils/imgData.js")
var util = require("../../utils/util.js")
Page({
  /* 页面的初始数据 */
  data: {
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    types:"福利彩票",
    abbrs:"fl",
    list:[],
    imgList:[],
    from:"",
    showAd: false
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (ops) {
    var that = this;
    wx.getSystemInfo({ // 获取系统信息
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });

    util.loadAd(function (showAD) {
      that.setData({
        showAd: showAD
      });
    })
    this.setData({
      imgList: imgSrc.imgSrcFn()
    })
    app.aldstat.sendEvent(this.loadList(this.data.types, this.data.abbrs))
  },
  /* 滑动切换tab */
  bindChange: function (e) {
    var that = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      success:function(){
        that.setData({
          currentTab: e.detail.current
        })
        if (that.data.currentTab == 0) {
          that.setData({
            types: "福利彩票",
            abbrs: "fl"
          })
          that.loadList(that.data.types, that.data.abbrs)
        } else if (that.data.currentTab == 1) {
          that.setData({
            types: "体育彩票",
            abbrs: "ty"
          })
          that.loadList(that.data.types, that.data.abbrs)
        } else {
          that.setData({
            types: "高频彩票",
            abbrs: "gp"
          })
          that.loadList(that.data.types, that.data.abbrs)
        }
      },
      duration: 1000
    });
    
  },
  /* 点击tab切换 */
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
      if (this.data.currentTab == 0) {
        this.setData({
          types: "福利彩票",
          abbrs: "fl"
        })
        this.loadList(this.data.types, this.data.abbrs)
      } else if (this.data.currentTab == 1) {
        this.setData({
          types: "体育彩票",
          abbrs: "ty"
        })
        this.loadList(this.data.types, this.data.abbrs)
      } else {
        this.setData({
          types: "高频彩票",
          abbrs: "gp"
        })
        this.loadList(this.data.types, this.data.abbrs)
      }
    }
  },
  /* 生命周期函数--监听页面初次渲染完成 */
  onReady: function () { },
  /* 生命周期函数--监听页面显示 */
  onShow: function () {
    this.setData({
      from: util.getFrom() || util.getRefferAppId()
    })
    console.log("data:");
    console.log(this.data);
    var that = this;
    util.loadAd(function (showAD) {
      that.setData({
        showAd: showAD
      });
    })
   },
  /** 生命周期函数--监听页面隐藏 */
  onHide: function () { },
  /** 生命周期函数--监听页面卸载 */
  onUnload: function () { },
  /* 页面相关事件处理函数--监听用户下拉动作 */
  onPullDownRefresh: function () { },
  /* 页面上拉触底事件的处理函数 */
  onReachBottom: function () {},
  /* 加载数据 */
  loadList: function (types,abbrs) {
    var _this = this;
    wx.request({
      url: 'https://api.51gsl.com/program/lottery',
      method: 'POST',
      data: {
        type:types,
        abbr:abbrs
      },
      header: {
        'content-type': 'application/json',
        "Accept": "application/vnd.51gsl.v6+json"
      },
      success: function(res) {
        var _list = res.data.data.data;
        _this.setData({
          list: res.data.data.data
        })
      },
      fail: function(res) {}
    })
  },
  /* 用户点击右上角分享 */
  onShareAppMessage: function (ops) {
    /*return {
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
    }*/
  },
  /* 点击banner图片跳转 */
  images: function () {
    util.ad(this.data.showAd)
  },
  /* 点击跳转 */
  jump: function (e) {
    var index = e.currentTarget.dataset.index;
    var name = e.currentTarget.dataset.name;
    var jname = e.currentTarget.dataset.jname;
    var gameIndex = e.currentTarget.dataset.gameindex;
    wx.navigateTo({
      url: '../content/content?index=' + index + "&name=" + name + "&jname=" + jname + "&gameIndex=" + gameIndex
    })
  }
})