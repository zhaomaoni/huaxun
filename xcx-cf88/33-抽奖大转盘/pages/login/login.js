var tgwapi = require("../../utils/tgwapi.js")
var util = require('../../utils/sha1.js')
var userUtil = require('../../utils/userUtil.js')
var conf = require('../../utils/config.js')
var countdown = 60;
var settime = function (that) {
  if (countdown == 0) {
    that.setData({
      is_show: true
    })
    countdown = 60;
    return;
  } else {
    that.setData({
      is_show: false,
      time: countdown
    })
    countdown--;
  }
  setTimeout(function () {
    settime(that)
  }, 1000)
}
Page({
  /* 页面的初始数据 */
  data: {
    inputValue: "",
    yanTxt: "",
    is_show: true,
    time: ""
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {

  },
  /* 获取输入框内容 */
  getValue: function (e) {
    var mobile = e.detail.value;
    this.setData({
      inputValue: mobile
    })
  },
  /* 获取到 验证码文本 */
  yanFn: function (e) {
    var numbers = e.detail.value;
    this.setData({
      yanTxt: numbers
    })
  },
  /* 注册 */
  registerFn: function () {
    var _this = this;
    
  },
  /* 点击 获取验证码 */
  zhengBtn: function (e) {
    var _this = this;

    var type = 2;
    var mobile = this.data.inputValue;
    if (mobile.length == 0) {
      wx.showToast({
        title: '请输入手机号！',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    if (mobile.length != 11) {
      wx.showToast({
        title: '手机号长度有误！',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(mobile)) {
      wx.showToast({
        title: '手机号格式不正确！',
        icon: 'none',
        duration: 1500
      })
    }
    var verify = util.sha1(mobile)
    tgwapi.postFormRequestAll(conf.tgwUrl.codeUrl, { "mobile": mobile, "verify": verify, "source": 2 }, function (res) {
      if (res.data.status == 1) {
        console.log('发送成功，验证码为：'+res.data.code)
        settime(_this)
      } else {
        console.log('发送失败')
      }
    })
    // tgwapi.identifyCodeAcquire(mobile, type, function (res) {
    //   console.log(res)
    //   if (res.data.errcode == 0) {
    //     console.log('发送成功')
    //     settime(_this)
    //   } else {
    //     console.log('发送失败')
    //   }
    // });
  },
  /* 点击 登录按钮 */
  loginBtn: function () {
    var yanTxt = this.data.yanTxt;
    var mobile = this.data.inputValue;
    var verify = util.sha1(mobile)
    var fromid = wx.getStorageSync("fromId") || 0;
    console.log("fromid："+fromid)
    var _this = this;
    var type = 2;
    if (yanTxt.length == 0) {
      wx.showToast({
        title: '请输入验证码！',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else {
      tgwapi.postFormRequestAll(conf.tgwUrl.loginUrl, { "mobile": mobile, "verify": verify, "source": 2, "code": yanTxt, "from": fromid}, function (res) {
        console.log(res.data)
        if (res.data.status == 1) {
          console.log('登录成功')
          userUtil.setUserId(res.data.uid)
          userUtil.setUserToken(res.data.token)
          if (fromid!=res.data.uid){
            /* 领取新用户免费赠送的机会 */
            tgwapi.postFormRequestAll(conf.tgwUrl.chanceUrl, { "uid": res.data.uid, "token": res.data.token }, function (res1) {
              if (res1.data.status == 1) {
                console.log("新用户获取十次机会")
              }
            })
          }
          
          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 1500
          })
          wx.redirectTo({
            url: '../index/index',
          })
        } else {
          console.log('验证失败')
          wx.showToast({
            title: '验证码错误',
            icon: 'none',
            duration: 1500
          })
        }

      

    })
      // tgwapi.identifyCodeVerify(mobile, type, yanTxt, function (res) {
      //   console.log(res.data)
      //   if (res.data.errcode == 0) {
      //     console.log('验证成功')
      //     wx.showToast({
      //       title: '验证成功',
      //       icon: 'success',
      //       duration: 1500
      //     })
      //     _this.registerFn()
      //   } else {
      //     console.log('验证失败')
      //     wx.showToast({
      //       title: '验证码错误',
      //       icon: 'none',
      //       duration: 1500
      //     })
      //   }
      // })
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