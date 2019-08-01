var user = require("../../utils/user.js")
var apiData = require("../../utils/apiData.js")
var config = require("../../utils/config.js")
const pro_from = 'cgcwxx'
Component({
  data:{
    isPhone:true,
    isShou:false
  },
  methods: {
    // 微信授权
    bindgetuserinfo:function(e){
      var _this = this
      _this.setData({
        isShou: true,
        // isPhone: false
      })
      wx.showLoading({
        title: '加载中',
        mask:true
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 3000)
      user.wxLogin(pro_from, function (res) {
        var data = JSON.parse(res.data.data)
        var phone = ''
        var appid = data.watermark.appid;
        var password = data.unionId
        var username = data.openId
        var nickName = data.nickName
        var headimgurl = data.avatarUrl
        apiData.userLogin(phone, password, username, nickName, headimgurl, function (res) {
          wx.setStorageSync('userMsg', res.data)
          if (res.statusCode == 200) {
            var userid = res.data.user_id;
            user.setTgwUserId(res.data.user_id)
            _this.triggerEvent('gitUserid', {userid}, {})
          }
        }, function (res) {
          wx.showToast({
            title: "获取用户信息失败，请重新获取",
            icon: 'none',
            duration: 2000
          })
        });
      })
    },
    // 获取手机号
    getPhoneNumber: function (e) {
      var msg = user.getWechatUserInfo()
      var _this = this;
      var sessionkey = user.getSessionKey()
      _this.setData({
        isShou: true,
        // isPhone: true
      })
      wx.request({
        url: 'https://api.51gsl.com/program/SetPhone',
        method: 'POST',
        header: {
          'content-type': 'application/json',
          "Accept": "application/vnd.51gsl.v6+json"
        },
        data: {
          pro_from: pro_from,
          sessionKey: sessionkey,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
          userInfo:msg
        },
        success: function (res) {
          _this.setData({
            isShou: true,
            // isPhone: true
          })
        }
      })
    }
  }
});