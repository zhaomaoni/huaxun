// pages/content/content.js
var loadData = require("../../utils/data.js")
var WxParse = require('../../wxParse/wxParse.js');
Page({
  /* 页面的初始数据 */
  data: {
    list:[],
    index:0,
    num:1,
    showIndex:0,
    score:[],
    nodes:''
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (opt) {
    var index = opt.index;
    var _list = loadData.loadData();
    this.setData({
      list: _list, 
      index : index
    })
    for(var i in _list){
      if(index==i){
        this.setData({
          nodes: _list[i].content
        })
      }
    }
    WxParse.wxParse('article', 'html', this.data.nodes, this, 5);
  },
  /* 一道题单选后跳转 */
  radioChange:function(e){
    var key;
    var _this = this;
    for(var i in this.data.list){
      for (var j in this.data.list[i].choice) {
        if (this.data.list[i].choice[j] == e.detail.value) {
          key = j;
          wx: wx.navigateTo({
            url: '../result/result?index=' + _this.data.index + "&key=" + key
          })
        }
      }
    }
  },
  /* 分值选择 */
  fenChange: function (e) {
    if (this.data.list[this.data.index].type == "scoring"){
      var index = e.currentTarget.dataset.index; 
      var length = e.currentTarget.dataset.length;
      var score = this.data.score;
      score[index] = e.detail.value;
      this.setData({
        showIndex: index+1, 
        score: score
      })   
      if (index >= length - 1) {
        //出结果
        var result = 0;
        for (var i in score) {
          result += parseInt(score[i]);
        }
        var resultData = this.data.list[this.data.index].result
        for (var r in resultData){
          if (result >= resultData[r].min && result <= resultData[r].max){
            wx: wx.navigateTo({
              url: '../result/result?content=' + resultData[r].content
            })
            // console.log(resultData[r].content);
            break;
          }
        }
        return;
      }
   }
    if (this.data.list[this.data.index].type == "jump") {
      var index = e.detail.value;
      if(!isNaN(index)){ //如果是数字
        this.setData({
          showIndex: index
        })   
      }else{ //显示结果
        wx: wx.navigateTo({
          url: '../result/result?index=' + this.data.index + "&key=" + index
        })
      }
    }
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