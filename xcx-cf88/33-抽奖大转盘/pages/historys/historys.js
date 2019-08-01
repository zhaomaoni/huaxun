var tgwapi = require("../../utils/tgwapi.js")
var userUtil = require("../../utils/userUtil.js")
var conf = require('../../utils/config.js')
Page({
  /* 页面的初始数据 */
  data: {
    tabber: ["记录", "大奖"],
    currentTab: 0,
    addPage:1
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    var lottery_id = options.lottery_id
    this.setData({
      lottery_id: lottery_id
    })
    this.allreduce(lottery_id)
    this.resultFn(lottery_id)
  },
  //获取 记录 数据
  allreduce: function (lottery_id){
    var _this = this
    wx.showLoading({
      title: '加载中',
    })
    tgwapi.getInfo(conf.tgwUrl.allreduceUrl + '&lottery_id=' + lottery_id, function (res) {
      var _list = res.data.list;
      var pageNum = res.data.is_page;
      console.log("111::::" + pageNum)
      var arr = [];
      for (var i in _list) {
        arr = arr.concat(_list[i])
      }
      _this.setData({
        record: arr,
        pageNum: pageNum
      })
      // 隐藏加载框
      wx.hideLoading();
    })
  },
  //获取 大奖 数据
  resultFn: function (lottery_id){
    var _this = this
    wx.showLoading({
      title: '加载中',
    })
    tgwapi.getInfo(conf.tgwUrl.resultUrl + '&lottery_id=' + lottery_id, function (res) {
      var _list = res.data.list;
      var pageNum = res.data.is_page;
      console.log("222::::" + pageNum)
      var arr = [];
      for (var i in _list) {
        arr = arr.concat(_list[i])
      }
      _this.setData({
        prix: arr,
        pageNum: pageNum
      })
      // 隐藏加载框
      wx.hideLoading();
    })
  },
  /* 点击加载更多 */
  loadMore: function (e) {
    var _this = this;
    var page = e.currentTarget.dataset.page + 1;
    var lottery_id = this.data.lottery_id;
    wx.showLoading({
      title: '加载中',
    })
    if (this.data.currentTab==0){
      tgwapi.getInfo(conf.tgwUrl.allreduceUrl + '&lottery_id=' + lottery_id+'&page='+page, function (res) {
        var _list = res.data.list;
        var pageNum = res.data.is_page;
        var arr = [];
        for (var i in _list) {
          arr = arr.concat(res.data.list[i])
        }
        var Nreduce = _this.data.record;
        _this.setData({
          record: Nreduce.concat(arr),
          pageNum: pageNum,
          addPage:page
        })
      })
    }else{
      tgwapi.getInfo(conf.tgwUrl.resultUrl + '&lottery_id=' + lottery_id + '&page=' + page, function (res) {
        var _list = res.data.list;
        var pageNum = res.data.is_page;
        var arr = [];
        for (var i in _list) {
          arr = arr.concat(res.data.list[i])
        }
        var Nprix = _this.data.prix;
        _this.setData({
          prix: Nprix.concat(arr),
          pageNum: pageNum,
          addPage: page
        })
        // 隐藏加载框
        wx.hideLoading();
      })
    }
  },
  /* tab切换 */
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
      })
      if (this.data.userid) {
        this.loadData()
      }
    }
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