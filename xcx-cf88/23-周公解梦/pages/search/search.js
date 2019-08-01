// pages/search/search.js
var util = require("../../utils/util.js")
Page({
  /* 页面的初始数据 */
  data: {
    list:[],
    value:"",
    txt: "",
    showAd: false,
    isShow:false
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    var that = this;
    util.loadAd(function (showAD) {
      that.setData({
        showAd: showAD
      });
    })
  },
  /* 获取文本框内容 */
  input1:function(e){
    this.setData({
      value: e.detail.value,
      isShow:false,
      isShow2:false
    })
  },
  /* 加载数据 */
  loadList:function(){
    var _this = this;
    wx.request({
      url: 'https://api.51gsl.com/program/dream',
      method: 'POST',
      data: {
        keys: _this.data.value
      },
      header: {
        'content-type': 'application/json',
        "Accept": "application/vnd.51gsl.v6+json"
      },
      success: function (res) {
        if(res.data.code==2001){
          _this.setData({
            list: [],
            isShow:false,
            isShow2:true
          })
        }else{
          var _list = res.data.data.data;
          wx.setStorage({
            key: 'hosList',
            data: _list
          })
          _this.setData({
            list: _list,
            isShow: true,
            isShow2: false
          })
        }
      },
      fail: function (res) { }
    })
  },
  /* 点击图片搜索 */
  searchList:function(e){
    var value = e.currentTarget.dataset.value
    if(value.length>0){
      this.setData({
        isShow:true,
        isShow2:false
      })
    }else{
      this.setData({
        isShow: false,
        isShow2:true
      })
    }
    this.search(value)
    this.loadList()
  },
  /* 搜索 */
  search:function(key){
    var _this = this;
    var list = wx.getStorage({
      key: 'list',
      success: function(res) {
        console.log(res)
        if(key==''){
          _this.setData({
            list:res.data.data.data
          })
          return;
        }
        var arr=[];
        for(var i in res.data.data){
          res.data.data[i].show=false; //所有数据隐藏
          if(res.data.data[i].search.indexOf(key)>=0){ //查找
            res.data.data[i].show = true;
            arr.push(res.data.data[i])
          }
        }
        if(arr.length==0){
          _this.setData({
            list:[],
            isShow2:true,
            isShow:false
          })
        }else{
          _this.setData({
            list: arr
          })
        }
      },
    })
  },
  /* 点击列表跳转 */
  jump:function(e){
    var _this = this;
    var index = e.currentTarget.dataset.index;
    var title = e.currentTarget.dataset.title;
    this.setData({
      txt: index
    })
    if (index) {
      setTimeout(function(){
        wx.navigateTo({
          url: '../content/content?index=' + index + "&title=" + title
        })
        _this.setData({
          isShow: false
        })
      },200)
    }
  },
  /* 点击广告跳转 */
  images: function () {
    util.ad(this.data.showAd)
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