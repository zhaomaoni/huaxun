// pages/content/content.js
var lsName = require("../../utils/teacher.js")
var WxParse = require('../../wxParse/wxParse.js');
Page({
  /* 页面的初始数据 */
  data: {
    isShow:false,
    index:"",
    isLayer: false,
    text:""
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (opt) {
    var _this = this;
    var index = opt.index;
    var text = opt.text;
    var laoshi = lsName.lao()
    if(index==0){
      this.setData({
        isShow:true,
        text:text
      })
    }else{
      this.setData({
        isShow: false,
        text:text
      })
      for (var i in laoshi) {
        if (i == index) {
          _this.setData({
            nodes: laoshi[i]
          })
          WxParse.wxParse('article', 'html', _this.data.nodes, _this, 5);
        }
      }
    }
  },
  /* 点击 索要完整视频 打开遮罩 */
  suoBtn: function () {
    this.setData({
      isLayer: true
    })
  },
  /* 点击叉号关闭弹层 */
  closeBtn: function () {
    this.setData({
      isLayer: false
    })
  },
  /* 复制微信号 */
  copyBtn: function () {
    var _this = this;
    wx.setClipboardData({
      data: _this.data.text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            _this.setData({
              isLayer: false
            })
          }
        })
      }
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