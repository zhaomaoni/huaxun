// pages/index/index.js
var app = getApp();
var getDates = require("../../utils/util.js");
Page({
  /* 页面的初始数据 */
  data: {
    list: [],
    storeList: {
      "2880": "周大福", "2881": "老凤祥", "2882": "周六福",
      "2883": "六福", "2884": "菜百", "2885": "老庙",
      "2886": "金至尊", "2887": "周生生", "2888": "潮宏基",
      "2889": "周大生", "2890": "亚一金店", "2891": "宝庆银楼",
      "2892": "太阳金店", "2893": "齐鲁金店", "2894": "中国黄金",
      "2895": "高赛尔", "2896": "千禧之星", "2897": "吉盟首饰",
      "2898": "金鹭首饰", "2899": "东祥金店", "2900": "翠华金店",
      "2901": "百泰黄金", "2902": "金象珠宝", "2903": "常州金店",
      "2904": "扬州金店", "2905": "嘉华珠宝", "2906": "福泰珠宝",
      "2907": "城隍珠宝", "2908": "星光达珠宝", "2909": "宝泉钱币",
      "2910": "金兰首饰", "2919": "谢瑞麟", "3225": "逸钻珠宝",
      "3324": "金银街", "5651": "多边金都珠宝", "7607": "富艺珠宝"
    },
    priceList: [],
    end: getDates.getDates(),
    isShow2: true,
    currentTab1: false,
    currentTab2: false,
    isHide: false,
    isHide3: false,
    zhou: "周大福",
    Jin: "黄金价格",
    bg: "2880",
    bg2: "11",
    currentPage: 1,
    showAd: false,
    loadMoreIs:false,
    from:""
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    this.priceList()
    var that = this;
    getDates.loadAd(function (showAD) {
      that.setData({
        showAd: showAD
      });
    })
  },
  /* 跳转赢家小工具 */
  moreBtn: function () {
    var _this = this
    wx.navigateToMiniProgram({
      appId: 'wx81dacf7d77359d1d',
      path: '/pages/index/index?from='+_this.data.from,
      envVersion: 'release'
    })
  },
  /* 黄金价格数据 */
  priceList: function () {
    var _this = this;
    wx.request({
      url: 'https://api.51gsl.com/wx',
      method: 'POST',
      data: {
        url: "https://www.cngold.org/sgapp/price/gold/varieties.do",
        types: "GET",
        variable: "json",
        brandId: _this.data.bg,
        is_ssl:1
      },
      header: {
        'content-type': 'application/json',
        "Accept": "application/vnd.51gsl.v6+json"
      },
      success: function (res) {
        var str = res.data;
        str = str.replace("var json = ", "")
        str = str.substr(0, str.length - 1)
        var obj = JSON.parse(str)
        var _list = obj.data
        _this.setData({
          priceList: _list,
          bg2: _list[0].id
        })
        app.aldstat.sendEvent(_this.listLoad());
      },
      fail: function (res) { }
    })
  },
  /* 首页列表数据加载 */
  listLoad: function () {
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    var _this = this;
    wx.request({
      url: 'https://api.51gsl.com/wx',
      method: "POST",
      data: {
        url: "https://www.cngold.org/sgapp/price/gold/pageData.do",
        types: "GET",
        currentPage: _this.data.currentPage++,
        pageSize: "20",
        endTime:_this.data.end,
        brandId: _this.data.bg,
        productId: _this.data.bg2,
        variable: "json",
        _: Date.parse(new Date()),
        is_ssl: 1
      },
      header: {
        'content-type': 'application/json',
        "Accept": "application/vnd.51gsl.v6+json"
      },
      success: function (res) {
        var str = res.data;
        str = str.replace("var json = ", "")
        str = str.substr(0, str.length - 1)
        var obj = JSON.parse(str)
        var _list = obj[0].data[0].infos;
        if (_this.data.loadMoreIs==false){
          _this.setData({
            list: _list
          })
        }else{
          _this.setData({
            list: _this.data.list.concat(obj[0].data[0].infos)
          })
        }
        _this.data.loadMoreIs = false
        wx.hideLoading()
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
      },
      fail: function () {
        _this.data.loadMoreIs = false
        wx.hideLoading()
      }
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 2000)
  },
  /* 生命周期函数--监听页面初次渲染完成 */
  onReady: function () { },
  /* 生命周期函数--监听页面显示 */
  onShow: function () {
    this.setData({
      from: getDates.getFrom() || getDates.getRefferAppId()
    })
    console.log("data:");
    console.log(this.data);
    var that = this;
    getDates.loadAd(function (showAD) {
      that.setData({
        showAd: showAD
      });
    })
  },
  /* 生命周期函数--监听页面隐藏 */
  onHide: function () { },
  /* 生命周期函数--监听页面卸载 */
  onUnload: function () { },
  /* 页面相关事件处理函数--监听用户下拉动作 */
  onPullDownRefresh: function () {},
  /* 页面上拉触底事件的处理函数 */
  onReachBottom: function (currentPage) {
    this.setData({
      loadMoreIs : true
    })
    this.listLoad()
  },
  /* 用户点击右上角分享 */
  onShareAppMessage: function () { },
  /* 点击banner图片跳转 */
  images: function () {
    getDates.ad(this.data.showAd)
  },
  /* 周大福选择 */
  clickLi: function (e) {
    var text = e.currentTarget.dataset.text;
    var index = e.currentTarget.dataset.index;
    this.setData({
      zhou: text,
      bg: index,
      isHide: false,
      isShow2: true,
      currentTab1: false,
      Jin: "黄金价格",
      loadMoreIs:false,
      currentPage:"1"
    })
    this.priceList()
  },
  /* 黄金价格选择 */
  clickJin: function (e) {
    var text = e.currentTarget.dataset.text;
    var index = e.currentTarget.dataset.index;
    this.setData({
      Jin: text,
      bg2: index,
      isHide3: false,
      isShow2: true,
      currentTab2: false,
      loadMoreIs: false,
      currentPage: "1"
    })
    this.listLoad()
  },
  /* 周大福显示 */
  swichNav1: function () {
    this.setData({
      currentTab1: !this.data.currentTab1,
      currentTab2: false
    })
    if (this.data.currentTab1 == true) {
      this.setData({
        isHide: !this.data.isHide,
        isShow2: false,
        isHide3: false
      })
    } else {
      this.setData({
        isHide: !this.data.isHide,
        isShow2: !this.data.isShow2
      })
    }
  },
  /* 黄金价格显示 */
  swichNav2: function () {
    this.setData({
      currentTab2: !this.data.currentTab2,
      currentTab1: false
    })
    if (this.data.currentTab2 == true) {
      this.setData({
        isHide3: !this.data.isHide3,
        isShow2: false,
        isHide: false
      })
    } else {
      this.setData({
        isHide3: !this.data.isHide3,
        isShow2: !this.data.isShow2
      })
    }
  }
})
