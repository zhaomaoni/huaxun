// pages/historyUser/historyUser.js
var util = require("../../utils/util.js")
var tgwapi = require("../../utils/tgwapi.js")
Page({
  /* 页面的初始数据 */
  data: {
    name:"",
    head:"",
    list: [],
    ids: 0,
    isShow: false
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    var _this = this;
    var datas = {
      name: options.name,
      headPortrait: options.headportrait,
      giftTotal: options.gifttotal,
      userId: options.userid,
      myid: options.myid
    };
    console.log(datas)
    var currentTab = options.currentTab;

    if (currentTab == 0) { //currentTab：0 挑战榜   1 奖金榜
      _this.setData({
        name: datas.name,
        head: datas.headPortrait,
        giftTotal: datas.giftTotal,
        userId: datas.userId,
        myid: datas.myid
      })
    }else{
      _this.setData({
        name: datas.name,
        head: datas.headPortrait,
        giftTotal: datas.giftTotal,
        userId: datas.userId
      })
    }
    /* 用户参赛记录列表 */
    tgwapi.getRequestPlay({ apiName: 'SecucodeplayUserjoinList', userId: this.data.userId }, function (res) {
      var list = res.data.data
      for (var i in list) {
        list[i]['flag'] = true
      }
      console.log(list)
      _this.setData({
        list: list
      })
    })
  },
  /* 收起内容 */
  hideBtn: function (e) {
    var index = e.currentTarget.dataset.index;
    var list = this.data.list;
    console.log(list)
    var data = list[index]
    console.log(data)
    data.flag = !data.flag

    this.setData({
      list: list,
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