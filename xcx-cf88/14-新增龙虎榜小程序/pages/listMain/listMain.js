// pages/listMain/listMain.js
var util = require("../../utils/util.js")
Page({
  /* 页面的初始数据 */
  data: {
    list:[],
    text:"",
    loadText:"加载更多",
    page:1,
    code: "",
    showAd: false,
    loading:false
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    this.setData({
      code: options.code
    })
    var text = options.text;
    var _this = this;
    util.loadAd(function (showAD) {
      _this.setData({
        showAd: showAD
      });
    })
    wx.request({
      url: "https://api.51gsl.com/wx",
      method: "POST",
      data: {
        url:"http://m.data.eastmoney.com/api/Lhb/yybSearchList",
        types:"GET",
        code: _this.data.code,
        typeCode: "1",
        sortType: "UpCount",
        sortRule: "-1",
        page: _this.data.page,
        pagesize: "20",
      },
      header: {
        'content-type': 'application/json',
        "Accept": "application/vnd.51gsl.v6+json"
      },
      success: function(res) {
        console.log(res)
        _this.setData({
          list:res.data.result,
          text:text
        })
      },
      fail: function(res) {}
    })
  },
  /* 跳转页面 */
  jump:function(){
    util.ad(this.data.showAd)
  },
  /* 点击加载更多 */
  setLoading:function(){
    var _list = this.data.list;
    var _this = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    })
    wx.request({
      url: "https://api.51gsl.com/wx",
      method: "POST",
      data: {
        url: "http://m.data.eastmoney.com/api/Lhb/yybSearchList",
        types: "GET",
        code: _this.data.code,
        typeCode: "1",
        sortType: "UpCount",
        sortRule: "-1",
        page: _this.data.page+1,
        pagesize: "20",
      },
      header: {
        'content-type': 'application/json',
        "Accept": "application/vnd.51gsl.v6+json"
      },
      success: function(res) {
        console.log(_list.concat(res.data.result))
          _this.setData({
            loadText: "数据请求中",
            loading: true,
            list: _list.concat(res.data.result),
            loadText: "加载更多",
            loading: false,
            page: _this.data.page + 1
          })
          if(_this.data.list.length == _list.length){
            _this.setData({
              loadText: "数据请求中",
              loading: true,
              list: _list.concat(res.data.result),
              loadText: "已全部加载完",
              loading: false,
              page: _this.data.page + 1
            })
          }
          _this.data.loading = false
          wx.hideLoading()
      },
      fail: function () {
        _this.data.loading = false
        wx.hideLoading()
        return false;
      }
    })
  },
  /* 生命周期函数--监听页面初次渲染完成*/
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