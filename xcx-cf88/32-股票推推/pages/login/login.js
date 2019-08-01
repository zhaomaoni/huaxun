// pages/login/login.js
var util = require("../../utils/util.js")
var userUtil = require("../../utils/userUtil.js")
var tgwapi = require("../../utils/tgwapi.js")
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
    inputValue:"",
    yanTxt:"",
    is_show:true,
    time:""
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    
  },
  /* 获取输入框内容 */
  getValue:function(e){
    var mobile = e.detail.value;
    this.setData({
      inputValue : mobile
    })
  },
  /* 获取到 验证码文本 */
  yanFn:function(e){
    var numbers = e.detail.value;
    this.setData({
      yanTxt : numbers
    })
  },
  /* 注册 */
  registerFn:function(){
    var _this = this;
    userUtil.wxLogin(function (res) {
      var data = JSON.parse(res.data.data)
      var phone = _this.data.inputValue;
      var unionId = data.unionId
      var openId = data.openId
      var nickName = data.nickName
      var headimgurl = data.avatarUrl
      console.log(headimgurl)
      tgwapi.userLogin(phone, unionId, openId, nickName, headimgurl, function (res) {
        console.log(res.data)
        //isRegister 0 已注册  1 未注册
        if (res.statusCode == 200) {
          var isRegister = res.data.isRegister;
          var userids = res.data.user_id;
          var headimg = res.data.headimgurl;
          var nicknames = res.data.nickname;
          var old_userid = userUtil.getTgwUserId();
          //console.log('成功')
          userUtil.setTgwUserId(res.data.user_id)
          var datas = {
            "headportrait": headimg,
            "nickname": nicknames,
            "userid": userids
          }
          console.log(datas.headportrait)
          /* 保存登录成功后的信息接口 */
          tgwapi.addplaylogin(datas, function (res) {})
          console.log("isRegister:" + isRegister)
          console.log("old_userid:" + old_userid)
          console.log("userids:" + userids)
          if (old_userid == userids) {
            console.log("检查是否发送复活卡")
            /* 发送复活卡 */
            var tguserid = wx.getStorageSync('tguserid') || 0
            if (tguserid) {
              console.log("符合发送复活卡条件：tguserid=" + tguserid)
              var data = {
                userid: tguserid,
                sourceid: userids
              }
              tgwapi.sendResurrectionCard(data.userid, data.sourceid, function (res) {
                console.log("发送复活卡接口调用成功")
                wx.redirectTo({
                  url: '../index/index',
                })
              }, function (err) {
                console.log("发送复活卡接口调用失败")
                console.log(err)
                wx.redirectTo({
                  url: '../index/index',
                })
              })
            } else {
              wx.redirectTo({
                url: '../index/index',
              })
            }
          } else {
            console.log("不需要发送复活卡")
            wx.redirectTo({
              url: '../index/index',
            })
            // wx.showToast({
            //   title: "获取用户信息失败，请重新获取",
            //   icon: 'none',
            //   duration: 2000
            // })

          }
        } else {
          //console.log('失败')
          //手机号验证
          console.log('获取用户信息失败，请重新获取BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB1')
          wx.showToast({
            title: "获取用户信息失败，请重新获取",
            icon: 'none',
            duration: 2000
          })
        }
      }, function (res) {
        // userUtil.setTgwUserId('99000183')
        // wx.navigateTo({
        //   url: '../index/index',
        // })
        console.log('获取用户信息失败，请重新获取BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB2')
        wx.showToast({
          title: "获取用户信息失败，请重新获取",
          icon: 'none',
          duration: 2000
        })
      });
    })
  },
  /* 点击 获取验证码 */
  zhengBtn:function(e){
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
    tgwapi.identifyCodeAcquire(mobile, type, function (res) {
      console.log(res)
      if (res.data.errcode == 0) {
        console.log('发送成功')
        settime(_this)
      } else {
        console.log('发送失败')
      }
    });
  },  
  /* 点击 登录按钮 */
  loginBtn:function(){
    var yanTxt = this.data.yanTxt;
    var mobile = this.data.inputValue;
    var _this = this;
    var type = 2;
    if (yanTxt.length == 0) {
      wx.showToast({
        title: '请输入验证码！',
        icon: 'none',
        duration: 1500
      })
      return false;
    }else{
      tgwapi.identifyCodeVerify(mobile, type, yanTxt, function (res) {
        console.log(res.data)
        if (res.data.errcode == 0) {
          console.log('验证成功')
          wx.showToast({
            title: '验证成功',
            icon: 'success',
            duration: 1000
          })
          _this.registerFn()
        } else {
          console.log('验证失败')
          wx.showToast({
            title: '验证码错误',
            icon: 'none',
            duration: 1500
          })
        }
      })
    }
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