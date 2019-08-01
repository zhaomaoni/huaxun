var tgwapi = require("../../utils/tgwapi.js")
var userUtil = require("../../utils/userUtil.js")
var conf = require('../../utils/config.js')
Page({
  /* 页面的初始数据 */
  data: {
    tabber: ["全部", "虚拟物品","实物奖品"],
    currentTab: 0,
    reducePage:1,
    reduce1Page: 1,
    reduce2Page: 1,
    reduceIsPage: 0,
    reduce1IsPage: 0,
    reduce2IsPage: 0,
    lottery_id:0,
    isShow:true,
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    var lottery_id = options.lottery_id
    var uid = userUtil.getUserId()
    var token = userUtil.getUserToken()
    var _this = this
    _this.setData({
      lottery_id: lottery_id
    })
    //获取我的抽奖记录
    tgwapi.getInfo(conf.tgwUrl.reduceUrl + '&lottery_id=' + lottery_id + '&uid=' + uid + '&token=' + token, function (res) {
      var arr = [];
      for(var i in res.data.list){
        arr = arr.concat(res.data.list[i])
      }
      _this.setData({
        reduce: arr,
        reduceIsPage:res.data.is_page
      })
      console.log(_this.data.reduce)
    })
    //虚拟
    tgwapi.getInfo(conf.tgwUrl.reduceUrl + '&lottery_id=' + lottery_id + '&uid=' + uid + '&token=' + token+'&type='+1, function (res) {
      var arr = [];
      for (var i in res.data.list) {
        arr = arr.concat(res.data.list[i])
      }
      _this.setData({
        reduce1: arr,
        reduce1IsPage: res.data.is_page,
        wechat:res.data.wechat
      })
    })
    //实物
    tgwapi.getInfo(conf.tgwUrl.reduceUrl + '&lottery_id=' + lottery_id + '&uid=' + uid + '&token=' + token + '&type=' + 2, function (res) {
      var arr = [];
      for (var i in res.data.list) {
        arr = arr.concat(res.data.list[i])
      }
      _this.setData({
        reduce2: arr,
        reduce2IsPage: res.data.is_page
      })
    })
  },
  loadMore: function (event){
    var _this = this
    var types = event.currentTarget.dataset.datatype
    var page = event.currentTarget.dataset.page + 1
    var lottery_id = _this.data.lottery_id
    var uid = userUtil.getUserId()
    var token = userUtil.getUserToken()
   
    tgwapi.getInfo(conf.tgwUrl.reduceUrl + '&lottery_id=' + lottery_id + '&uid=' + uid + '&token=' + token + '&type=' + types + '&page='+page, function (res) {
      var arr = []
      for (var i in res.data.list) {
        arr = arr.concat(res.data.list[i])
      }
      if(types == 0){
        var reData = _this.data.reduce
        _this.setData({
          reduceIsPage:res.data.is_page,
          reducePage:page,
          reduce: reData.concat(arr)
        })
      }
      if (types == 1) {
        var reData = _this.data.reduce1
        _this.setData({
          reduce1IsPage: res.data.is_page,
          reduce1Page: page,
          reduce1: reData.concat(arr)
        })
      }
      if (types == 2) {
        var reData = _this.data.reduce2
        _this.setData({
          reduce2IsPage: res.data.is_page,
          reduce2Page: page,
          reduce2: reData.concat(arr)
        })
      }
    })
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
  /* 打开弹层 */
  openLayer:function(e){
    var ids = e.currentTarget.dataset.id;
    this.setData({
      isShow:false,
      ids:ids
    })
  },
  /* 一键复制 */
  copyBtn: function (e) {
    var _this = this;
    wx.setClipboardData({
      data: e.currentTarget.dataset.wechat,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    });
  },
  /* 关闭弹层 */
  closeLayer:function(){
    this.setData({
      isShow:true
    })
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
  onShareAppMessage: function () {},
})