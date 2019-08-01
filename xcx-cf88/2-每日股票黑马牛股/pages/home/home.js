// pages/home/home.js
var app = getApp();
var util = require('../../utils/util.js')
Page({
  /* 页面的初始数据 */
  data: {
    today:[],
    history:[],
    isShow:false,
    numbers: "",
    paid: "",
    from: '',
    showAd: false
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    
    var _this = this;
    util.loadAd(function (showAD) {
      _this.setData({
        showAd: showAD,
        isShow:false
      });
    }) 
    var openid = wx.getStorage({
      key: 'openid1',
      success: function (res) {
        app.aldstat.sendEvent(_this.onLoadData(res.data));
      },
      fail:function(){
        wx.showLoading({
          title: '加载中',
        });
        wx.login({
          success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            if (res.code) {
              //发起网络请求
              wx.request({
                url: "https://api.51gsl.com/wx",
                data: {
                  url: "http://mobile2.cf8.cn/?r=wechat/login/index",
                  'types': "post",
                  appid: "wx9510ce894ba9fea0",
                  code: res.code
                },
                method: "POST",
                header: {
                  'content-type': 'application/x-www-form-urlencoded',
                  "Accept": "application/vnd.51gsl.v6+json"
                },
                success: function (opn) {
                  var openId = opn.data.data.open_id;
                  wx.setStorage({
                    key: "openid1",
                    data: openId
                  })
                  _this.onLoadData(openId);
                  setTimeout(function () {
                    wx.hideLoading()
                  }, 100)
                },
                fail: function(){
                  setTimeout(function () {
                    wx.hideLoading()
                  }, 100)
                }
              })
            }
          }
        })
      }
    });
  },
  /* 跳转赢家小工具 */
  moreBtn: function () {
    var _this = this;
    wx.navigateToMiniProgram({
      appId: 'wx81dacf7d77359d1d',
      path: 'pages/index/index?from='+_this.data.from,
      envVersion:"release"
    })
  },
  /* 生命周期函数--监听页面初次渲染完成 */
  onReady: function () {},
  /* 生命周期函数--监听页面显示 */
  onShow : function(){
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
  /* 获取数据 */
  onLoadData: function (openid) {
    var _this = this;
    wx.request({
      url: "https://api.51gsl.com/wx",
      method: "POST",
      data:{
        url:"http://mobile2.cf8.cn/?r=wechat/stock/index",
        types:"GET",
        open_id: openid,
        time: Date.parse(new Date())
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        "Accept": "application/vnd.51gsl.v6+json"
      },
      success: function (res) {
        console.log(res.data.data)
        if(res.data.status==1){
          _this.setData({
            paid: res.data.data.paid,
            today: res.data.data.today,
            history: res.data.data.history,
            numbers: res.data.data.wechat
          })
        }
      }
    })
  },
  /** 生命周期函数--监听页面隐藏 */
  onHide: function () {},
  /** 生命周期函数--监听页面卸载 */
  onUnload: function () {},
  /* 页面相关事件处理函数--监听用户下拉动作 */
  onPullDownRefresh: function () {},
  /* 页面上拉触底事件的处理函数 */
  onReachBottom: function () {},
  /* 用户点击右上角分享 */
  onShareAppMessage: function () {},
  /* 显示复制微信号弹框 */
  copePhone : function(e){
    var _this = this;
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          //发起网络请求
          wx.request({
            url: "https://api.51gsl.com/wx",
            data: {
              url: "http://mobile2.cf8.cn/?r=wechat/login/index",
              'types': "post",
              appid: "wx9510ce894ba9fea0",
              code: res.code
            },
            method: "POST",
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              "Accept": "application/vnd.51gsl.v6+json"
            },
            success: function (opn) {
              var openId = opn.data.data.open_id;
              wx.setStorage({
                key: "openid1",
                data: openId
              })
              _this.onLoadData(openId);
              setTimeout(function () {
                wx.hideLoading()
              }, 100)
              var num = e.currentTarget.dataset.num
              util.ad(_this.data.showAd, num)
            },
            fail: function () {
              setTimeout(function () {
                wx.hideLoading()
              }, 100)
            }
          })
        }
      }
    })
    
    // wx.navigateTo({
    //   url: '../today/today',
    // })
  },
  /* 点击免费索要金股 */
  copyShow : function(){
    var _this = this;
    if(this.data.showAD==false){
      _this.setData({
        isShow: true
      })
    }else{
      _this.setData({
        isShow: !_this.data.isShow
      })
    }
  },
  /* 点击‘我知道了’实现复制 */
  jump: function () {
    var _this = this;
    wx.setClipboardData({
      data: _this.data.numbers,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            //console.log(res.data) // data
          }
        })
      }
    })
    _this.setData({
      isShow: (!_this.data.isShow)
    })
  },
})