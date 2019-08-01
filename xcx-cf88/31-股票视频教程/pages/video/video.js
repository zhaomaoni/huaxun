// pages/video/video.js
var app = getApp();
const txvContext = requirePlugin("tencentvideo");
var util = require("../../utils/util.js")
Page({
  /* 页面的初始数据 */
  data: {
    showAd: false,
    isLayer:false,
    listBox:"",
    list:[],
    text:"",
    pageNum:1,
    barNum:8,
    loadMoreIs: true,
    tiShow:false,
    from:""
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    this.loadData()
    //app.aldstat.sendEvent()
  },
  /* 获取数据 */
  loadData: function (pageNum){
    var _this = this;
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    if (this.data.loadMoreIs == false) {
      wx.hideLoading()
      return;
    }
    wx.request({
      url: 'https://oauth.cf8.cn/MiniPro/xcx/video/index.php',
      method: 'GET',
      data: {
        "pageNum": _this.data.pageNum,
        "barNum": _this.data.barNum
      },
      header: {
        'content-type': 'application/json',
        "Accept": "application/vnd.51gsl.v6+json"
      },
      success: function (res) {
        console.log(res)
        var _listBox = res.data.data;
        var _list = res.data.data.lists;
        // _this.setData({
        //   loadMoreIs: _list.length == 8
        // })
        _this.setData({
          listBox: _listBox,
          text: _listBox.wxNum,
          isLayer: false
        })

        var arr=_this.data.list;
        if (_this.data.pageNum == 1) {
          arr = []
        }
        if (_list.length < _this.data.barNum){
          _this.setData({
            list: arr.concat(_list),
            loadMoreIs:false
          })
        }else{
          _this.setData({
            pageNum: _this.data.pageNum+1,
            loadMoreIs:true,
            list: arr.concat(_list)
          })
        }
        wx.hideLoading()  // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();  // 停止下拉动作
        wx.stopPullDownRefresh();
      },
      fail: function (res) {
        _this.setData({
          loadMoreIs: false
        })
        wx.hideLoading()
      }
    })
  },
  /* 点击播放视频 */
  videoPlay(e) {
    var _this = this;
    this.setData({
      ids: e.currentTarget.dataset.id,
      tiShow:true,
      viShow:true,
    })
    setTimeout(function(){
      _this.setData({
        tiShow: false
      })
    }, 1500);
    //this.videoContext.seek(0);// 加载后再播放 this.videoContext.play()
    this.videoContext.play()
  },
  /* 视频播放完毕 */
  playEnd:function(e){
    var currentTime = e.detail.currentTime.toFixed(0)
    var duration = e.detail.duration.toFixed(0)
    console.log(currentTime + "~~~" + duration)
    if (duration == currentTime){
      this.setData({
        isLayer: true,
        ids:-1
      })
    }
  },
  /* 生命周期函数--监听页面初次渲染完成 */
  onReady: function () {
    this.videoContext = wx.createVideoContext('myVideo')
  },
  /* 点击 索要完整视频 打开遮罩 */
  suoBtn:function(){
    this.setData({
      isLayer:true,
      ids: -1
    })
  },
  /* 点击叉号关闭弹层 */
  closeBtn:function(){
    this.setData({
      isLayer: false
    })
  },
  /* 复制微信号 */
  copyBtn:function(){
    var _this = this;
    wx.setClipboardData({
      data: _this.data.text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            console.log(res.data) // data
            _this.setData({
              isLayer: false
            })
          }
        })
      }
    })
  },
  /* 生命周期函数--监听页面显示 */
  onShow: function () {
    this.setData({
      from: util.getFrom() || util.getRefferAppId()
    })
    console.log("data:");
    console.log(this.data);
    var that = this;
    util.loadAd(function (showAD) {
      that.setData({
        showAd: showAD
      });
    })
  },
  /* 生命周期函数--监听页面隐藏 */
  onHide: function () { },
  /* 生命周期函数--监听页面卸载 */
  onUnload: function () { },
  /* 页面相关事件处理函数--监听用户下拉动作 */
  onPullDownRefresh: function () {
    this.setData({
      pageNum:1
    })
    this.loadData()
  },
  /* 页面上拉触底事件的处理函数 */
  onReachBottom: function () {
    if (this.data.loadMoreIs) {
      this.loadData()
    } else {
      wx.showToast({
        title: '没有更多数据',
      })
    }
  },
  /* 用户点击右上角分享 */
  onShareAppMessage: function () { }
})