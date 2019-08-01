// pages/content/content.js
var WxParse = require('../../wxParse/wxParse.js');
var imgSrc = require("../../utils/imgData.js")
var util = require("../../utils/util.js")
Page({
  /* 页面的初始数据 */
  data: {
    index:"",
    name:"",
    jname:"",
    list:[],
    nodes:"",
    kuai:"",
    title:"",
    imgList:"",
    gameIndex:"",
    issueNo:"",
    value:0,
    text:"",
    showAd: false
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (opt) {
    var index = opt.index;
    var name = opt.name;
    var jname = opt.jname;
    var gameIndex = opt.gameIndex;
    this.setData({
      index:index,
      name:name,
      jname:jname,
      gameIndex: gameIndex,
      imgList: imgSrc.imgSrcFn()
    })
    var _this = this;
    util.loadAd(function (showAD) {
      _this.setData({
        showAd: showAD
      });
    }) 
    this.loadList()
  },
  /* 加载数据 */
  loadList: function () {
    var _this = this;
    wx: wx.request({
      url: 'https://api.51gsl.com/program/lottery',
      method: 'POST',
      data: {
        type: _this.data.name,
        abbr: _this.data.jname
      },
      header: {
        'content-type': 'application/json',
        "Accept": "application/vnd.51gsl.v6+json"
      },
      success: function (res) {
        var _list = res.data.data.data;
        console.log(_list)
        for(var i in _list){
          if(i==_this.data.index){
            if (_this.data.name != "高频彩票"){
              var txt = _list[i].data.levelInfo.replace(/<td>&nbsp;<\/td>/g, "")
              _this.setData({
                list: _list[i],
                issueNo:_list[i].issueNo,
                kTime: _list[i].kTime,
                text: _list[i].stage,
                gameIndex: _list[i].gameIndex,
                title: _list[i].title,
                nodes: txt
              })
            }else{
              var txt = _list[i].data.resultHtml;
              if(_list[i].title.indexOf("快3")!==-1){
                _this.setData({
                  gameIndex: _list[i].gameIndex,
                  kuai: _list[i].title
                })
              }
              if(txt!=''){
                _this.setData({
                  nodes: txt
                })
              }else{
                _this.setData({
                  nodes: "<tr><td>无</td><td>数</td><td>据</td></tr>"
                })
              }
              _this.setData({
                list: _list[i],
                title: _list[i].title,
                kTime: _list[i].kTime,
                text: _list[i].stage,
                openResult: _list[i].openResult,
                openTime: _list[i].openTime
              })
            }
          }
        }
        WxParse.wxParse('article', 'html', _this.data.nodes, _this, 5);
      },
      fail: function (res) { }
    })
  },
  /* 点击 产看历史记录 */
  valueChange:function(e){
    if (this.data.name != "高频彩票") {
      this.setData({
        value:e.detail.value,
        text: this.data.issueNo[e.detail.value]
      })
    }else{
      this.setData({
        date: e.detail.value
      })
    }
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    });
    this.hisList()
  },
  /* 请求 历史数据 */
  hisList:function(){
    var _this = this;
    var isNo;
    if (this.data.name != "高频彩票") {
      isNo = this.data.text;
    }else{
      isNo = this.data.date;
      console.log(isNo)
    }
    wx: wx.request({
      url: 'https://api.51gsl.com/program/lotteryHis',
      method: 'POST',
      data: {
        type: _this.data.name,
        issueNo: isNo,
        gameIndex:_this.data.gameIndex
      },
      header: {
        'content-type': 'application/json',
        "Accept": "application/vnd.51gsl.v6+json"
      },
      success: function (res) {
        wx.hideToast();
        if (_this.data.name != "高频彩票") {
          var _list = res.data.data.data;
          var txt = _list.data.levelInfo.replace(/<td>&nbsp;<\/td>/g, "")
          _this.setData({
            list: _list,
            nodes: txt
          })
        } else {
          var _list = res.data.data.data.data;
          var txt = _list.resultHtml
          if (_this.data.title.indexOf("快3") !== -1) {
            _this.setData({
              kuai: _this.data.title
            })
          }
          if (txt != '') {
            _this.setData({
              nodes: txt
            })
          } else {
            _this.setData({
              nodes: "<tr><td>无</td><td>数</td><td>据</td></tr>"
            })
          }
          _this.setData({
            list: _list
          })
        }
        WxParse.wxParse('article', 'html', _this.data.nodes, _this, 5);
      },
      fail: function (res) { }
    })
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
  onShareAppMessage: function () { },
  /* 点击banner图片跳转 */
  images: function () {
    util.ad(this.data.showAd)
  }
})