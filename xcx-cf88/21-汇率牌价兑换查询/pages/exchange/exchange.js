// pages/exchange/exchange.js
var util = require("../../utils/util.js")
Page({
  /* 页面的初始数据 */
  data: {
    yuan:"100",
    currentExchange: { name: "人民币", key:"BOCCNY",rate:1},
    exchange:[
      { name: "美元", key: "BOCUSD"},
      { name: "港币", key: "BOCHKD" },
      { name: "澳门元", key: "BOCMOP" },
      { name: "新台币", key: "BOCTWD" },
      { name: "欧元", key: "BOCEUR" },

      { name: "英镑", key: "BOCGBP" },
      { name: "澳大利亚元", key: "BOCAUD" },
      { name: "韩国元", key: "BOCHGY" },
      { name: "日元", key: "BOCJPY" },
      { name: "新加坡元", key: "BOCSGD" },
      { name: "加拿大元", key: "BOCCAD" },
    ],
    showAd: false,
    money:[],    
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    this.loadList()
    var _this = this;
    util.loadAd(function (showAD) {
      _this.setData({
        showAd: showAD
      });
    })
  },
  /* 跳转赢家小工具 */
  moreBtn: function () {
    wx.navigateToMiniProgram({
      appId: 'wx81dacf7d77359d1d',
      path: '',
      envVersion: 'release'
    })
  },
  /* 点击换算货币 */
  change:function(e){
    var exchange = this.data.exchange;   
    var temp_exchange = exchange[e.currentTarget.dataset.index];    
    exchange[e.currentTarget.dataset.index] = this.data.currentExchange;
    this.setData({
      currentExchange: temp_exchange,
      exchange: exchange
    })
    console.log(this.data.currentExchange)
    console.log(this.data.exchange)
  },
  /* 基准货币输入 */
  inputChange:function(e){
    this.setData({
      yuan:e.detail.value
    })
  },
  /* 获取数据 */
  loadList: function () {
    var _this = this;
    wx.request({
      url: 'https://api.51gsl.com/program/exchanges',
      method: 'POST',
      data: {
        type: 1
      },
      header: {
        'content-type': 'application/json',
        "Accept": "application/vnd.51gsl.v6+json"
      },
      success: function (res) {
        var exchange = _this.data.exchange;   
        for (var i = 0; i < exchange.length;i++){
          exchange[i].rate = res.data.data.date.zg[exchange[i].key][12]
        }      
        _this.setData({
          exchange: exchange
        })
        console.log(_this.data.exchange)
      },
      fail: function (res) { }
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
  /* 点击广告跳转 */
  images: function () {
    util.ad(this.data.showAd)
  }
})