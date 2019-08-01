// pages/index/index.js
var app = getApp();
var util = require("../../utils/util.js")
var data = require("../../utils/data.js")
Page({
  /* 页面的初始数据 */
  data: {
    lists: [[],[],[],[],[],[],[]],
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    showAd: false,
    text: "",
    pageList : [0,0,0,0,0,0],
    pageNum : 10,
    hadLastPage: false,
    arr: ['推荐','要闻', '滚动', '机会', '公司', '大盘', '其他'],
    loading : false,
    videoList:[],
    from: '',
    pageNums:10,
    ten:false,
    Blist:[],
    lastid:0,
    animationData: {},
    scrollTop:0
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (ops) {
    this.setData({
      videoList:data
    })
    var that = this;
    util.loadAd(function (showAD) {
      that.setData({
        showAd: showAD
      });
    })
    app.aldstat.sendEvent("123")
    if (this.data.currentTab == 1) {
      this.data.text = "要闻"
      this.loadList(0, this.data.text)
    } else if (this.data.currentTab == 2) {
      this.data.text = "滚动"
      this.loadList(0,this.data.text)
    } else if (this.data.currentTab == 3) {
      this.data.text = "机会"
      this.loadList(0,this.data.text)
    } else if (this.data.currentTab == 4) {
      this.data.text = "公司"
      this.loadList(0,this.data.text)
    } else if (this.data.currentTab == 5) {
      this.data.text = "大盘"
      this.loadList(0,this.data.text)
    } else if (this.data.currentTab == 6) {
      this.data.text = "其他"
      this.loadList(0,this.data.text)
    }
    wx.getSystemInfo({ // 获取系统信息
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    this.tuijianFn()
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
        console.log(res.data)
        _this.setData({
          ban:res.data
        })
      },
      fail: function (res) { }
    })
  },
  videoBtn:function(e){
    var item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '../video/video?item=' + JSON.stringify(item),
    })
  },
  /* 滑动切换tab */
  bindChange: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current,
      text: this.data.arr[e.detail.current],      
    });
    if (that.data.pageList[that.data.currentTab] > 0) {
      return true;
    }
    this.loadList(that.data.currentTab,this.data.text)
  },
  /* 点击tab切换 */
  swichNav: function (e) {
    console.log("exec swichNav");
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
        text: this.data.arr[e.target.dataset.current],        
      })
    }
  },
  /* 点击banner图片跳转 */
  images : function(e){
    var url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: '../banner/banner?url='+url
    })
    // util.ad(this.data.showAd)
  },
  /* 跳转赢家小工具 */
  moreBtn: function () {
    var _this = this;
    console.log(123)
    wx.navigateToMiniProgram({
      appId: 'wx81dacf7d77359d1d',
      path: 'pages/index/index?from='+ _this.data.from,
      envVersion: 'release'
    })
  },
  /* 生命周期函数--监听页面初次渲染完成 */
  onReady: function () {},
  /* 生命周期函数--监听页面显示 */
  onShow: function () {
    this.setData({
      from: util.getFrom() || util.getRefferAppId()
    })
    var that = this;
    util.loadAd(function (showAD) {
      that.setData({
        showAd: showAD
      });
    })
  },
  /* 推荐 */
  tuijianFn:function(){
    var _this = this;
    wx.request({
      url: 'https://api.tgw360.com/recommender/news',
      method: 'POST',
      data: {
        "hotNum": 6,
        "backVersion": 0,
        "platform": 0,
        "appVersion": "5.3.0",
        "openVP": false,
        "appType": 3,
        "num": _this.data.pageNums
      },
      header: {
        'content-type': 'application/json',
        "Accept": "application/vnd.51gsl.v6+json"
      },
      success: function (res) {
        var len = res.data.data.recommend.length - 1;
        _this.setData({
          recommend: res.data.data.recommend,
          hot: res.data.data.hot,
          top: res.data.data.top
        })
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
      },
      fail: function (res) { }
    })
  },
  /** 生命周期函数--监听页面隐藏 */
  onHide: function () { },
  /** 生命周期函数--监听页面卸载 */
  onUnload: function () { },
  /* 页面相关事件处理函数--监听用户下拉动作 */
  onPullDownRefresh: function () {
    var _this = this;
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 500
    })
    if (this.data.currentTab == 0){
      this.setData({
        ten:true,
        scrollTop: 0
      })
      setInterval(function () {
        _this.setData({
          ten: false
        })
      }, 3000)
    }else{
      wx.showLoading({
        title: '加载中',
        mask: true,
      })
      this.newsFn()
    }
    this.tuijianFn()
    // 显示顶部刷新图标  
    wx.showNavigationBarLoading();
  },
  /* 要闻加载数据 */
  newsFn:function(){
    var _this = this;
    wx.request({
      url: 'https://www.tgw360.com/tgwapi/myapp/Htgw/searchNews?recordCount=10&beginIndex=0&Column=' + _this.data.text,
      method: "GET",
      header: {
        'content-type': 'application/text'
      },
      success: function (res) {
        var infoArr = []
        var info = res.data.data.info;
        for (var i in info) {
          info[i]['ym'] = info[i]['publishtime'].substr(5, 5)
          info[i]['hs'] = info[i]['publishtime'].substr(11, 5)
        }
        var _lists = _this.data.lists
        _lists[_this.data.currentTab] = res.data.data.info;
        _this.setData({
          lists: _lists
        });
        _this.data.loading = false
        wx.hideLoading()
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
      },
      fail: function () {
        _this.data.loading = false
        wx.hideLoading()
        return false;
      }
    })
  },
  /* 页面上拉触底事件的处理函数 */
  onReachBottom: function () {
    this.loadList(this.data.currentTab,this.data.text)
    this.tuijFn()
  },
  /* 获取上拉推荐数据 */
  tuijFn:function(){
    var _this = this;
    var newsid = this.data.lastid
    // 显示加载图标  
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: 'https://api.tgw360.com/recommender/history',
      method: 'POST',
      data: {
        "backVersion": 0, 
        "platform": 0, 
        "appVersion": "5.3.0", 
        "openVP": false, 
        "appType": 3, 
        "num": _this.data.pageNums,
        "user": "0",
        "newsId": newsid
      },
      header: {
        'content-type': 'application/json',
        "Accept": "application/vnd.51gsl.v6+json"
      },
      success: function (msg) {
        var len = msg.data.data.recommend.length - 1;
        var _list = _this.data.Blist;
        for (var i = 0; i < msg.data.data.recommend.length; i++) {
          _list = _list.concat(msg.data.data.recommend[i]);
        }
        _this.setData({
          Blist: _list,
          pageNum: _this.data.pageNum + 10,
          lastid: msg.data.data.recommend[len].newsId
        })
        // 隐藏加载框  
        wx.hideLoading();
      },
      fail: function(res) {}
    })
  },
  /* 获取上拉数据 */
  loadList: function (currentTab,text) {
    if (this.data.loading){
      return ;
    }
    this.data.loading = true;
    wx.showLoading({
      title: '加载中',
      mask: true, 
    })
    if (this.data.hadLastPage != false) {
      wx.showToast({
        title: '到底了',
      })
      return;
    }
    var _this = this; 
    wx.request({
      url: 'https://www.tgw360.com/tgwapi/myapp/Htgw/searchNews?recordCount=10',
      method:"GET",
      data: {
        beginIndex: _this.data.pageList[currentTab] * _this.data.pageNum,
        Column: text
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var infoArr = []
        var info = res.data.data.info;
        for(var i in info){
          info[i]['ym'] = info[i]['publishtime'].substr(5, 5)
          info[i]['hs'] = info[i]['publishtime'].substr(11, 5)
        }
        var _lists = _this.data.lists        
        _lists[currentTab] = _lists[currentTab].concat(res.data.data.info);
        var _pageList = _this.data.pageList   
        _pageList[currentTab] = _this.data.pageList[currentTab]+1;
        _this.setData({
          lists: _lists,
          pageList: _pageList
        });
        _this.data.loading = false 
        wx.hideLoading()
      },
      fail:function(){
        _this.data.loading = false 
        wx.hideLoading()
        return false;
      }
    })
    return true;
    setTimeout(function () {
      wx.hideLoading()
    }, 1000)
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
        console.log(res);
      }
    }
  },
  /* 点击跳转 */
  jump : function(e){
    var _url = e.currentTarget.dataset.url;
    var _txt = e.currentTarget.dataset.txt;
    var cur = e.currentTarget.dataset.cur
    _url = JSON.stringify(_url);
    wx.navigateTo({
      url: '../content/content?url=' + _url +"&Column="+_txt + "&cur="+cur
    })
    if (!_url) return false;
  },
  /* 点击推荐数据 跳转详情 */
  jump2: function (e) {
    var newsid = e.currentTarget.dataset.newsid
    var cur = e.currentTarget.dataset.cur
    wx.navigateTo({
      url: '../content/content?newsid=' + newsid + "&cur=" + cur
    })
  }
})