// pages/rankings/rankings.js
var util = require("../../utils/util.js")
var tgwapi = require("../../utils/tgwapi.js")
var userUtil = require("../../utils/userUtil.js")
Page({
  /* 页面的初始数据 */
  data: {
    list:[],
    jiang:[],
    imgList:[],
    title:["挑战榜","奖金榜"],
    currentTab:0,
    surplusAmount:0,
    userid: 0
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    this.setData({
      userid: userUtil.getTgwUserId()
    })
    if (!this.data.userid){
      this.setData({
        list:[]
      })
    }else{
      this.setData({
        userid: userUtil.getTgwUserId(),
        surplusAmount: options.surplusAmount
      })
      this.loadData()
    }
  },
  /* 获取数据 */
  loadData:function(){
    var _this = this;
    wx.showToast({
      title: "加载中",
      icon: 'loading',
      duration: 1000
    })
    if (this.data.currentTab == 0) {
      /* 获取redis中前50名名额 */
      tgwapi.getRequestPlay('getBefore50Rankings?userid='+ _this.data.userid, function (res) {
        var _list = res.data;
        for (var i in _list.limit50list){ 
          _list.limit50list[i].user.headPortrait = util.getAvatar(_list.limit50list[i].user.headPortrait) 
        }
        for (var i in _list.userlist) {
          _list.userlist[i].user.headPortrait = util.getAvatar(_list.userlist[i].user.headPortrait)
        }
        console.log(_list)
        _this.setData({
          list: _list
        })
      })
    } else {
      /* 现金收益排名列表 */
      tgwapi.getRequestPlay('bounslist', function (res) {
        var _list = res.data.data;
        for (var i in _list) {
          _list[i].headPortrait = util.getAvatar(_list[i].headPortrait)
        }
        _this.setData({
          jiang: _list
        })
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
      console.log(this.data.currentTab)
      if(this.data.userid){
        this.loadData()
      }
    }
  },
  /* 点击列表跳转 */
  clickBtn:function(e){
    var name = e.currentTarget.dataset.name;
    var headPortrait = e.currentTarget.dataset.headportrait;
    var giftTotal = e.currentTarget.dataset.gifttotal;
    var userId = e.currentTarget.dataset.userid;
    var user = {
      name: name,
      headPortrait: headPortrait,
      giftTotal: giftTotal,
      userId: userId
    }
    var currentTab = e.currentTarget.dataset.currenttab;
    wx.navigateTo({
      url: '../historyUser/historyUser?name=' + name + '&headportrait=' + headPortrait + '&gifttotal=' + giftTotal + '&userid=' + userId + "&currentTab=" + currentTab+"&myid="+this.data.userid,
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
  onShareAppMessage: function () {
    return {
      path: util.getCurrentPageUrlWithArgs()
    }
  }
})