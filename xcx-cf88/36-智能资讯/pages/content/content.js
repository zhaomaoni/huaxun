// pages/content/content.js
var apiData = require("../../utils/apiData.js")
var config = require("../../utils/config.js")
var WxParse = require('../../wxParse/wxParse.js');
Page({
  /* 页面的初始数据 */
  data: {
    pageNum:10,
    picUrl: "../../images/icon_good2.png",
    mainList:[],
    nodes : [],
    comList:[],
    ifpraise:0,
    isClick:true,
    isLike:true,
    delet:""
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    var _this = this;
    this.setData({
      userid: options.userid,
      newsid:  options.newsid //5226819
    })
    apiData.postFormRequestAll(config.dataList.action, [{ "action": "view", "user": _this.data.userid, "news": _this.data.newsid }], function (res) {
      console.log(res)
    })
    this.contentFn()
    this.commentFn()
    this.hisFn()
  },
  /* 点击推荐 跳转 详情页 */
  jumpBtn: function (e) {
    var newsid = e.currentTarget.dataset.newsid
    var userid = this.data.userid;
    wx.navigateTo({
      url: '../content/content?newsid=' + newsid + '&userid=' + userid,
    })
  },
  /* 获取内容数据 */
  contentFn:function(){
    var _this = this;
    var datas = {
      url: config.details.url,
      types: config.details.types,
      userid: this.data.userid,
      newsid: this.data.newsid
    }
    apiData.postRequest(config.details.apiBaseUrl, datas, function (res) {
      if (res.data.data.info.length==0){
        _this.setData({
          delet:"该文章已删除"
        })
      }
      var txt = res.data.data.info[0].News_Content;
      txt = txt.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match,src){
        console.log(match)
        console.log(src)
        if(src.substring(0,4)=="http"){
          return "";
        }
        var result = match.replace(src, 'https://www.tgw360.com' + src)
        return result
      });
      _this.setData({
        mainList: res.data.data.info,
        nodes: txt,
        ifpraise: res.data.data.info[0].ifpraise
      })
      WxParse.wxParse('article', 'html', _this.data.nodes, _this, 5);
    })
  },
  /* 全部评论 */
  commentFn:function(){
    var _this = this;
    var datas = {
      url: config.details.url2,
      types: config.details.types,
      userid: this.data.userid,
      News_ID: this.data.newsid,
      Action_Type: 1,
      Record:10,
      begin:1
    }
    apiData.postRequest(config.details.apiBaseUrl, datas, function (res) {
      var info = res.data.data.info
      _this.setData({
        comList:info,
        comLen:info.length
      })
    })
  },
  /* 历史推荐 */
  hisFn:function(){
    var _this = this;
    apiData.postFormRequestAll(config.dataList.historys, { "user": _this.data.userid, "backVersion": 0, "platform": 0, "appVersion": "5.3.0", "openVP": false, "appType": 3, "num": _this.data.pageNum, "newsId": _this.data.newsid},function(res){
      _this.setData({
        hisList:res.data.data.recommend
      })
    })
  },
  /* 点赞 */
  zanFn:function(){
    var _this = this;
    var isClick = _this.data.isClick
    if (isClick) {
      this.setData({
        ifpraise: Number(this.data.ifpraise)+1,
        isClick: false
      })
      wx.showToast({
        title: "点赞成功，谢谢您的鼓励！",
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.showToast({
        title: "已经点过赞了哦~",
        icon: 'none',
        duration: 2000
      })
      return false
    }
    var datas = {
      url: config.details.url3,
      types: config.details.types,
      userid: this.data.userid,
      newid: this.data.newsid
    }
    apiData.postRequest(config.details.apiBaseUrl, datas, function (res) {
      var data = res.data.data.info
      if(data[0].RowCount==1){
        apiData.postFormRequestAll(config.dataList.action, [{ "action": "praise", "user": _this.data.userid, "news": _this.data.newsid }],function(res){
          _this.setData({
            isClick:false
          })
        })
      }else{
        _this.setData({
          picUrl:"../../images/icon_good2.png",
          isClick:true
        })
      }
    })
  },
  /* 点击 不喜欢 */
  noLikeFn:function(){
    var _this = this;
    var isLike = _this.data.isLike
    if (isLike) {
      this.setData({
        isLike: false
      })
      wx.showToast({
        title: "感谢您的反馈，我们将努力为您推荐更优质内容~",
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.showToast({
        title: "不能多次操作哦~",
        icon: 'none',
        duration: 2000
      })
      return false
    }
    apiData.postFormRequestAll(config.dataList.action, [{ "action": "uninterest", "user": _this.data.userid, "news": _this.data.newsid }], function (res) {
      console.log(res)
      _this.setData({
        isLike:false
      })
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
  onShareAppMessage: function () {}
})