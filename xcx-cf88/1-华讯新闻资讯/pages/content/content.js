var WxParse = require('../../wxParse/wxParse.js');
var util = require("../../utils/util.js")
Page({
  /* 页面的初始数据 */
  data: {
    list: [],
    showAd: false,
    nodes: []
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    var _this = this;
    var cur = options.cur
    this.setData({
      cur : cur
    })
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    if(cur!=0){
      var _obj = JSON.parse(options.url);
      var _txt = options.Column;
      wx.request({
        url: 'https://api.51gsl.com/tgw/getInfoByUrl?url=' + _obj,
        data: {},
        header: {
          'content-type': 'application/json',
          "Accept": "application/vnd.51gsl.v1.1+json"
        },
        success: function (res) {
          console.log(res)
          _this.setData({
            list: [res.data.data],
            nodes: res.data.data.content
          })
          WxParse.wxParse('article', 'html', _this.data.nodes, _this, 5);
          wx.setNavigationBarTitle({ //设置NavigationTitle
            title: _txt
          })
          wx.hideLoading()
        }, fail: function () {
          wx.hideLoading()
        }
      })
    }else{
      this.setData({
        newsid: options.newsid //5226819
      })
      this.contentFn()
      wx.hideLoading()
    }
    util.loadAd(function (showAD) {
      _this.setData({
        showAd: showAD
      });
    })
    this.banner()
  },
  /* 广告位接口 */
  banner: function () {
    var _this = this;
    wx.request({
      url: 'https://oauth.cf8.cn/MiniPro/m/web/?r=wechat/spread/config',
      method: 'POST',
      data: {
        appid: "wx379225f6e8e77376"
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        _this.setData({
          ban: res.data
        })
      },
      fail: function (res) { }
    })
  },
  /* 获取内容数据 */
  contentFn: function () {
    var _this = this;
    var datas = {
      url: "www.tgw360.com/tgwapi/myapp/News/getNewsDetail",
      types: "POST",
      userid: 0,
      newsid: this.data.newsid
    }
    wx.request({
      url: 'https://api.51gsl.com/tgwapi',
      data: datas,
      header: {
        'content-type': 'application/json',
        "Accept": "application/vnd.51gsl.v6+json"
      },
      method: 'POST',
      success: function(res) {
        if (res.data.data.info.length == 0) {
          _this.setData({
            delet: "该文章已删除"
          })
        }
        var txt = res.data.data.info[0].News_Content;
        txt = txt.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, src) {
          if (src.substring(0, 4) == "http") {
            return "";
          }
          var result = match.replace(src, 'https://www.tgw360.com' + src)
          return result
        });
        _this.setData({
          mainList: res.data.data.info,
          nodes: txt,
          ifpraise: res.data.data.info[0].ifpraise
        })
        WxParse.wxParse('article', 'html', _this.data.nodes, _this, 5);
      },
      fail: function(res) {}
    })
  },
  /* 点击banner图片跳转 */
  images: function (e) {
    // util.ad(this.data.showAd)
    var url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: '../banner/banner?url=' + url
    })
  },
  /* 生命周期函数--监听页面初次渲染完成 */
  onReady: function () {},
  /* 生命周期函数--监听页面显 */
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
    return {
      title: this.data.title,
      path: 'pages/index/index',
      success: function (res) {  // 转发成功
        wx.showShareMenu({          // 要求小程序返回分享目标信息
          withShareTicket: true
        });
      },
      fail: function (res) {        // 转发失败
        console.log(res);
      }
    }
  }
})