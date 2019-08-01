// pages/content/content.js
var stockInfo = require('../../utils/stockInfo.js')
var util = require("../../utils/util.js")
Page({
  /* 页面的初始数据 */
  data: {
    name:"",
    code:"",
    price:"",
    down:"",
    cnt:"",
    txt: "",
    showAd: false,
    cang:{1:"轻仓",2:"重仓"},
    qi:{1:"短期",2:"长期"},
    isClick1:0,
    isClick2:0,
    chbPrice:""
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    var _this = this;
    var code = options.code;
    var name = options.name;
    util.loadAd(function (showAD) {
      _this.setData({
        showAd: showAD
      });
    })
    stockInfo.getInfo(code, function (res) {
      var data = res.data.data
      var down = Number(data.quotation.changepercent).toFixed(2)
      var price = Number(data.quotation.trade).toFixed(2)
      _this.setData({
        data: data,
        name: data.quotation.name,
        code: data.quotation.code,
        price: price,
        down: down,
        cnt: data.cnt
      })
    })
  },
  /* 文本框获取焦点 */
  // wxSearchBlur: function (e) {
  //   var value = e.detail.value;
  //   this.setData({
  //     txt:value
  //   })
  // },
  /* 获取文本内容 */
  wxSearchInput: function (e) {
    var that = this   
    var val = e.detail.value
    this.setData({
      chbPrice: val,
    })
  },
  /*点击选择 长短期和轻重仓 */
  clickBtn1: function (e) {
    this.setData({
      isClick1: e.currentTarget.dataset.index
    })
  },
  clickBtn2:function(e){
    this.setData({
      isClick2: e.currentTarget.dataset.index
    })
  },
  /* 点击够跳转 */
  btnClick:function(e){
    var _this = this;
    if (this.data.isClick2 == 0){
      this.setData({
        isClick2: 1
      })
    }
    var chbPrice = Number(this.data.chbPrice);
    var price = Number(this.data.price);
    if (this.data.chbPrice == "") {
      wx.showToast({
        title: '请输入成本价',
        icon: 'none',
        duration: 2000
      })
    } else {
      if (chbPrice<=price){ 
        wx.navigateTo({
          url: "../result1/result1?name="+_this.data.name+"&code="+_this.data.code+"&price="+_this.data.price+"&down="+_this.data.down
        })
      }else{
        wx.navigateTo({
          url: "../result2/result2?code=" + this.data.code + "&isClick1=" + this.data.isClick1 + "&isClick2=" + this.data.isClick2 + "&costPrice=" + _this.data.chbPrice + "&price=" + _this.data.price
        })
      }      
    } 
  },
  /* 点击banner图片跳转 */
  images: function () {
    util.ad(this.data.showAd)
  },
  /* 生命周期函数--监听页面初次渲染完成 */
  onReady: function () { },
  /* 生命周期函数--监听页面显示 */
  onShow: function () { },
  /* 生命周期函数--监听页面隐藏 */
  onHide: function () { },
  /* 生命周期函数--监听页面卸载 */
  onUnload: function () { },
  /* 页面相关事件处理函数--监听用户下拉动作 */
  onPullDownRefresh: function () { },
  /* 页面上拉触底事件的处理函数 */
  onReachBottom: function () { },
  /* 用户点击右上角分享 */
  onShareAppMessage: function () { }
})