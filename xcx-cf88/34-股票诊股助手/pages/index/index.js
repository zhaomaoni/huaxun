//index.js
//获取应用实例
const app = getApp()
var WxSearch = require('../../wxSearch/wxSearch.js')
var Slist = require('../../utils/mtData.js')
var datas = require("../../utils/data.js")
var config = require('../../utils/config.js')
var user = require("../../utils/user.js")
var req_url = app.globalData.req_url

Page({
  // onShow() { //如果已经显示过web-view页了，则执行后退操作，否则就跳到web-view页 
  //   if (!app.data.webShowed) {
  //     wx.navigateTo({ url: '/pages/webView/webView' })

  //   } else {
  //     wx.navigateBack({
  //       delta: 1
  //     });
  //   }
  // }

  data: {
    webURL: '',
    from:"",
    hide:true,
    wxSearchData: [],
    code: 0,
    title: "",
    isquan:true,
    value: "",
    appname: app.globalData.appname,
    xqlist: []
  },
  onLoad: function (options) {
    var _this = this;
    var isLogin = user.getWechatUserInfo()
    if (isLogin) {
      _this.setData({
        isquan: false
      })
    }
    datas.getInfo(config.apiList.recommend,function(res){
      _this.setData({
        xqlist:res.data.list
      })
    })
    app.aldstat.sendEvent("加载")
    _this.loadFn()
    Slist.mtData(_this.onLoading)
    
  },
  /* 模糊查询列表 */
  onLoading: function (data) {
    //this.data.wxSearchData = data;
    var that = this
    WxSearch.init(that, 10.5, data, false, true);
    //WxSearch.initMindKeys(data);
    var searchData = wx.getStorageSync('searchData') || []
    that.setData({
      list: searchData
    })
  },
  /* 点解搜索列表 */
  wxSearchFn: function (e) {
    var that = this
    this.setData({
      code: e.currentTarget.dataset.code,
      title: e.currentTarget.dataset.title,
      value: e.currentTarget.dataset.code
    })
    //WxSearch.wxSearchAddHisKey(that);
  },
  /* 点击 免费诊股 */
  zhenFn: function (e) {
    var _this = this;
    var code = e.currentTarget.dataset.code;
    if(this.data.value!=""){
      datas.getInfo(config.apiList.verify + code, function (res) {
        console.log(res.data)
        if (res.data.status==0){
          wx.showToast({
            title: res.data.desc,
            icon: 'none',
            duration: 2000
          })
        }else{
          var url = wx.setStorageSync("url", res.data.url)
          wx.navigateTo({
            url: '../webView/webView',
          })
        }
      })
    }else{
      wx.showToast({
        title: '请输入股票代码',
        icon: 'none',
        duration: 2000
      })
    }
  },
  /* 点击 查看详情 */
  lookFn:function(e){
    var url = e.currentTarget.dataset.url
    console.log(url)
    wx.setStorageSync("url", url)
    wx.navigateTo({
      url: '../webView/webView',
    })
  },
  /* 获取文本内容 */
  wxSearchInput: function (e) {
    var that = this
    WxSearch.wxSearchInput(e, that);
    var val = e.detail.value
    this.setData({
      value: val,
      code: val
    })
    var mind = that.data.wxSearchData.mindKeys
  },
  /* 文本框获得光标 */
  wxSerchFocus: function (e) {
    var that = this
    WxSearch.wxSearchFocus(e, that);
  },
  /* 文本框失去光标 */
  wxSearchBlur: function (e, title) {
    var that = this
    WxSearch.wxSearchBlur(e, that);
    console.log(that)
    //WxSearch.wxSearchHiddenPancel(that);
  },
  wxSearchTap: function (e) {
    var that = this
    WxSearch.wxSearchHiddenPancel(that);
  },
  loadFn: function () {
    var that = this
    wx.login({
      success: function (res) {
        // console.log(res.code)
        var token = "";
        try {
          var token = wx.getStorageSync('token')
          if (token) {
            // Do something with return value
            var token = token
            // console.log(token)
            that.setData({
              webURL: token
            })
          }
        } catch (e) {
          // Do something when catch error
        }

        if (res.code) {
          wx.request({
            url: req_url + 'login.php?token=' + token,
            data: {
              code: res.code
            },
            success: function (ms) {
              that.setData({
                webURL: ms.data.user_info.token
              })
              wx.setStorage({
                key: "token",
                data: ms.data.user_info.token
              })
            }
          })
        }
      }
    })
  },
  onShow:function(){
    this.setData({
      from: this.getFrom() || this.getRefferAppId()
    })
  },
  setFrom : function (options) {
    if (options.from) {
      wx.setStorageSync('from', options.from)
    }
  },
  getFrom : function () {
    return wx.getStorageSync('from') || ''
  },
  getRefferAppId : function () {
    return wx.getStorageSync('refferAppId') || ''
  }
})
