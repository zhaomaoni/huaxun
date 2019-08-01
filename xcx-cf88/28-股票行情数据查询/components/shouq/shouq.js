var user = require("../../utils/user.js")
const pro_from = 'hqsjcx'
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
        isPhone: false
      })
      user.wxLogin(pro_from,function(res){
        var data = JSON.parse(res.data.data)
        _this.setData({
          appid: data.watermark.appid,
          openid: data.openId,
          nickname: data.nickName
        })
        console.log(_this.data.openid + "~~~~" + _this.data.nickname)
      })
      
    },
    // 获取手机号
    getPhoneNumber: function (e) {
      var msg = user.getWechatUserInfo()
      console.log(msg)
      var _this = this;
      var sessionkey = user.getSessionKey()
      _this.setData({
        isShou: true,
        isPhone: true
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
            isPhone: true
          })
        }
      })
    }
  }
});