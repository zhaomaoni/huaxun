const app = getApp()

var req_url = app.globalData.req_url

Page({
  data: {
    webURL: ''
  },

  onLoad: function (options) {
    var that = this
    var url = wx.getStorageSync("url") || ""
    console.log(url)
    that.setData({
      webURL:url
    })
    // this.setFrom(options)
    // this.setData({
    //   from: this.getFrom()
    // })
    // wx.login({
    //   success: function (res) {
    //     // console.log(res.code)
    //     var token = "";
    //     try {
    //       var token = wx.getStorageSync('token')
    //       if (token) {
    //         // Do something with return value
    //         var token = token
    //         // console.log(options)
    //         that.setData({
    //           webURL: decodeURIComponent(options.url) + '?token=' +token+'&from'+that.data.from+'&appname='+that.data.appname
    //         })
    //       }
    //     } catch (e) {
    //       // Do something when catch error
    //     }

    //     if (res.code) {
    //       wx.request({
    //         url: req_url + 'login.php?token=' + token,
    //         data: {
    //           code: res.code
    //         },
    //         success: function (ms) {
    //           that.setData({
    //             webURL: decodeURIComponent(options.url) + '?token=' + token
    //           })
    //           wx.setStorage({
    //             key: "token",
    //             data: ms.data.user_info.token
    //           })
    //         }
    //       })
    //     }
    //   }
    // })
  },
  // setFrom: function (options) {
  //   if (options.from) {
  //     wx.setStorageSync('from', options.from)
  //   }
  // },
  // getFrom: function () {
  //   return wx.getStorageSync('from') || ''
  // },

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
  /* 生命周期函数--监听页面初次渲染完成 */
  onReady: function () {}

})