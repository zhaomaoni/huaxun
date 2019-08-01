// pages/index/index.js
var apiData = require("../../utils/apiData.js")
var config = require("../../utils/config.js")
var user = require("../../utils/user.js")
var pro_from = "cgcwxx"
Page({
  /* 页面的初始数据 */
  data: {
    topList:[],
    hotList:[],
    list:[],
    Blist:[],
    pageNum:10,
    isHb:false,
    userid:0,
    lastid:0,
    isShow:true,
    ten:false
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    var _this = this;
    var isLogin = user.getWechatUserInfo()
    var userid = user.getTgwUserId()
    if (isLogin) {
      _this.setData({
        isShow: false,
        userid: userid
      })
    }
    if(this.data.userid!=0){
      this.loadMore();
    }
  },
  gitUserid: function (e) {
    this.setData({
      userid: e.detail.userid
    })
    this.loadMore();
  },
  //加载数据
  loadMore:function(){
    var _this = this;
    apiData.postFormRequestAll(config.dataList.news, { "user": _this.data.userid, "hotNum": 6, "backVersion": 0, "platform": 0, "appVersion": "5.3.0", "openVP": false, "appType": 3, "num": _this.data.pageNum }, function (res) {
      var len = res.data.data.recommend.length-1;
      _this.setData({
        topList: res.data.data.top,
        hotList: res.data.data.hot,
        list: res.data.data.recommend,
        //lastid: res.data.data.recommend[len].newsId
      })
    })
  },
  /* 加载下部分数据 */
  bottomFn: function () {/*_this.data.lastid*/
    var _this = this
    var newsid = this.data.lastid
    apiData.postFormRequestAll(config.dataList.historys, { "user": _this.data.userid, "backVersion": 0, "platform": 0, "appVersion": "5.3.0", "openVP": false, "appType": 3, "num": _this.data.pageNum, "newsId": newsid }, function (msg) {
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
    })
  },
  /* 跳转 详情页 */
  jumpBtn:function(e){
    var newsid = e.currentTarget.dataset.newsid
    var userid = this.data.userid;
    wx.navigateTo({
      url: '../content/content?newsid=' + newsid + '&userid='+userid,
    })
  },
  /* 生命周期函数--监听页面初次渲染完成 */
  onReady: function () {
    this.phones = this.selectComponent('#phone');
  },
  /* 点击红包关闭按钮 */
  closeBtn:function(){
    this.setData({
      isHb:true
    })
  },
  /* 点击红包跳转 */
  redBtn:function(){
    wx.navigateTo({
      url: '../hongbao/hongbao',
    })
  },
  /* 生命周期函数--监听页面显示 */
  onShow: function () {
    if (getApp().globalData.scene){
      this.setData({
        isHb: false
      })
      getApp().globalData.scene = 0
    }
  },
  /* 生命周期函数--监听页面隐藏 */
  onHide: function () {},
  /* 生命周期函数--监听页面卸载 */
  onUnload: function () {},
  /* 点击刷新 */
  clickFn:function(){
    var _this = this 
    _this.onPullDownRefresh()
  },
  /* 页面相关事件处理函数--监听用户下拉动作 */
  onPullDownRefresh: function () {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 500
    })
    var _this = this;
    // 显示顶部刷新图标  
    wx.showNavigationBarLoading();  
    this.setData({
      pageNum: 10,
      ten: true
    })
    this.loadMore()
    this.bottomFn()
    setInterval(function(){
      _this.setData({
        ten:false
      })
    },3000)
    // 隐藏导航栏加载框  
    wx.hideNavigationBarLoading();
    // 停止下拉动作  
    wx.stopPullDownRefresh();
  },
  /* 页面上拉触底事件的处理函数 */
  onReachBottom: function () {
    var _this = this;
    // 显示加载图标  
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    this.bottomFn()
    // _this.loadMore()
  },
  /* 用户点击右上角分享 */
  onShareAppMessage: function () {}
})