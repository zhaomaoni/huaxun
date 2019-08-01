const app = getApp()

var req_url = app.globalData.req_url

Page({
  data: {
    webURL: ''
  },

  onLoad: function (options) {
    var that = this
    var ids = options.ids;
    var f = wx.getStorageSync('from') || wx.getStorageSync('refferAppId') || ''
    var url = 'https://oauth.cf8.cn/MiniPro/xuangu.php?from='+f+'&type=2&ids='+ids;
    this.setData({
      webURL:url
    })
  },

  // onShow() {
  //   wx.showShareMenu({
  //     withShareTicket: true
  //   })

  //   app.data.webShowed = false;
  // },

  // onShareAppMessage() {
  //   return {
  //     title: '分享标题', path: '/pages/index/index' // 分享出去后打开的页面地址 
  //   }
  // },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  }

})