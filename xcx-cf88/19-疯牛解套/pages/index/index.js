// pages/index/index.js
var app = getApp();
var WxSearch = require('../../wxSearch/wxSearch.js')
var Slist = require('../../utils/mtData.js')
var stockInfo = require('../../utils/stockInfo.js')
var util = require("../../utils/util.js")
Page({
  /* 页面的初始数据 */
  data: {
    list:[],
    wxSearchData: [],
    showAd: false,
    code:0,
    title:"",
    value:"",
    from:""
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    var _this = this;
    app.aldstat.sendEvent(Slist.mtData(this.onLoading))
  },
  /* 点击banner图片跳转 */
  images: function () {
    util.ad(this.data.showAd)
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
  /* 模糊查询列表 */
  onLoading: function (data) {
    //this.data.wxSearchData = data;
    var that = this
    WxSearch.init(that, 170, data, false, true);
    //WxSearch.initMindKeys(data);
    var searchData = wx.getStorageSync('searchData') || []  
    that.setData({
      list: searchData
    })
  },
  //清除缓存历史并关闭历史搜索框
  clearSearchStorage: function () {
    wx.removeStorageSync('searchData')
    this.setData({
      list: []
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
  /* 解套跳转 */
  jietao: function (e) {
    var _this = this;
    if (_this.data.value == "") {
      wx.showToast({
        title: '请正确输入内容',
        icon: 'none',
        duration: 2000
      })
      return 
    }
    var searchData = wx.getStorageSync('searchData') || []
    var title = _this.data.title;
    var code = _this.data.code;

    //先将 根据 code 读取接口，存到缓存

    stockInfo.getInfo(code,function(res){
      console.log(res)
      if(res.data.message =="error" || !res.data.data.info){
        wx.showToast({
          title: "没有指定的股票信息",
          icon: 'none',
          duration: 2000
        })
      }else{
        //如果搜索记录里面有重复的，要做删除操作
        var isHas = false;
        for (let i = 0; i < searchData.length; i++) {
          if (searchData[i].code == code) {
            isHas = true
            break;
          }
        }
        if (!isHas) {
          if(title==""){
            var stock = Slist.getmtdata(code)
            title = stock._N
          } 
          searchData.unshift({ code: code, title: title });
          // 如果超过10条搜索记录的话，删掉最旧的一条
          if (searchData.length > 10) {
            searchData.pop();
          }
          _this.setData({
            list: searchData
          })
        }
        wx.setStorageSync('searchData', searchData)

        wx.navigateTo({
          url: '../content/content?code=' + _this.data.code,
        })
      }
    })
  },
  /* 搜索记录跳转 */
  history:function(e){
    wx.navigateTo({
      url: '../content/content?code=' + e.currentTarget.dataset.code,
    })
  },
  /* 获取文本内容 */
  wxSearchInput: function (e) {
    var that = this
    WxSearch.wxSearchInput(e, that);
    var val = e.detail.value
    this.setData({
      value:val,
      code:val
    })
    var mind = that.data.wxSearchData.mindKeys
  },
  /* 文本框获得光标 */
  wxSerchFocus: function (e) {
    var that = this
    WxSearch.wxSearchFocus(e, that);
  },
  /* 文本框失去光标 */
  wxSearchBlur: function (e,title) {
    var that = this
    WxSearch.wxSearchBlur(e, that);
    //WxSearch.wxSearchHiddenPancel(that);
  },
  wxSearchTap: function (e) {
    var that = this
    WxSearch.wxSearchHiddenPancel(that);
  },
  clicks:function(){
    WxSearch.wxSearchHiddenPancel(this);
  },
  /* 生命周期函数--监听页面初次渲染完成 */
  onReady: function () {},
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