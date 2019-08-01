// pages/home/home.js
var util = require("../../utils/util.js")
var userUtil = require("../../utils/userUtil.js")
var tgwapi = require("../../utils/tgwapi.js")
var search = require("../../utils/search.js")
var app = getApp();
const pro_from = 'gptt'
Page({
  /* 页面的初始数据 */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    peopleNum: 0,      //参赛人数
    surplusAmount: 0,  //剩余金额,
    ranking:[],
    configration:[],
    source:0,
    life:0,
    tguserid:"",
    isPhone:true,
    f:app.globalData.f,
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    console.log(this.data.canIUse)
    var tguserid = options.tguserid
    if (tguserid) {
      wx.setStorageSync('tguserid', tguserid)
      this.setData({
        tguserid: tguserid
      })
      // console.log("tguserid:" + tguserid)
    }else{
      // console.log("tguserid:")
    }
    app.aldstat.sendEvent(this.loadData());
    
  },
  loadData:function(){
    var _this = this;
    /* 活动详情 */
    tgwapi.getRequestPlay('activeDetails', function (res) {
      _this.setData({
        peopleNum: res.data.data[0].numberParticipants,
        surplusAmount: res.data.data[0].surplusAmount
      })
    })
    /* 获取礼物列表 */
    tgwapi.getRequestPlay('getSecucodeplayGiftget', function (res) {
      _this.setData({
        ranking: res.data.data
      })
    })
    /* 开户 */
    // setTimeout(function(){
    //   var f = util.getFrom()
    //   console.log("f:" + f)
    //   _this.setData({
    //     f: f
    //   })
    //   var configration = util.getConfigrationBroker(f)
    //   console.log("get getConfigrationBroker")
    //   console.log(configration)
    //   _this.setData({
    //     broker: configration
    //   }) 
    // },1500)
    var f = app.globalData.f
    console.log(app.globalData.configration)
    if (app.globalData.configration) {
      // console.log("onload app.globalData.configration exists")
      var broker = util.getConfigrationBroker(app.globalData.configration, app.globalData.f)
      _this.setData({
        broker: broker
      })
      
    } else {
      // console.log("onload app.globalData.configration not exists")
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回  // 所以此处加入 callback 以防止这种情况
      app.configCallback = configration => {
        var broker = util.getConfigrationBroker(configration, f)
        _this.setData({
          broker: broker
        })
      }
    }
    /* 赛事报道 */
    var _this = this;
    tgwapi.getViewKits(function (res) {
      var _list = res.data.list;
      var arr = [];
      for (var i in _list) {
        arr = [_list[0], _list[1], _list[2]]
      }
      // console.log(arr)
      _this.setData({
        news: arr
      })
    })
    var tgwUserId = userUtil.getTgwUserId();
    if (tgwUserId > 0) {
      tgwapi.isBindPhone(tgwUserId, function (res) {
        if (res.data.errcode == 0 && res.data.data == 0) {   //  "data": 1  //  1=已绑定，0=未绑定
          wx.navigateTo({
            url: '../login/login',
          })
          return;
        }
        wx.redirectTo({
          url: '../index/index',
        })
      })
      return
    }
  },
  /* 点击 开户 */
  kaihuBtn: function (e) {
    var urls = e.currentTarget.dataset.urls;
    if (urls) {
      wx.navigateTo({
        url: '../kaihu/kaihu?urls=' + urls,
      })
    }
  },
  /* 点击赛事报道列表调转详情 */
  jumpBtn: function (e) {
    //var jUrl = e.currentTarget.dataset.jumpurl;
    var pId = e.currentTarget.dataset.pid;
    var cId = e.currentTarget.dataset.cid;
    wx.navigateTo({
      url: '../main/main?pId=' + pId + "&cId=" + cId,
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
  /* 点击立即闯关按钮 */
  bindGetUserInfo: function (e) {
    wx.showToast({
      title: "加载中",
      icon: 'loading',
      duration: 2000
    })
    var _this = this;
    userUtil.wxLogin(pro_from,function(res){
      var data = JSON.parse(res.data.data)
      var phone = ''
      var unionId = data.unionId
      var openId = data.openId
      var nickName = data.nickName
      var headimgurl = data.avatarUrl
      tgwapi.userLogin(phone, unionId, openId, nickName, headimgurl, function (res) {
        console.log("用户登录/注册返回数据：");
        console.log(res.data)
        wx.setStorageSync('userMsg', res.data)
        if (res.statusCode==200) {
          var isRegister = res.data.isRegister;
          var userid = res.data.user_id;
          userUtil.setTgwUserId(res.data.user_id)
           console.log("isRegister:" + isRegister)
          //isRegister = 1    //isRegister 0:登录，1:注册
          if (isRegister==0){
            var datas = {
              "headportrait": headimgurl,
              "nickname": nickName,
              "userid": userid
            }
            /* 保存登录成功后的信息接口 */
            tgwapi.addplaylogin(datas, function (res) {
              //http://172.18.44.128:5004/user/isBindPhone
              tgwapi.isBindPhone(userid, function (res) {
                if (res.statusCode != 200) {
                  wx.showToast({
                    title: '您的信息获取失败！',
                    icon: 'none',
                    duration: 1500
                  })
                  return;
                }
                if (res.data.errcode == 0 && res.data.data == 0) {   //  "data": 1  //  1=已绑定，0=未绑定
                // if(true){
                  /*wx.navigateTo({
                    url: '../login/login',
                  })*/
                  _this.setData({
                    isPhone: false
                  })
                  return;
                }
                /* 当前用户参赛详情 */
                tgwapi.postRequestPlay('usergamedetail?userid=' + userid, null, function (res) {
                  var _list = res.data.data;
                  // console.log("当前用户参赛详情")
                  // console.log(_list)
                  if (_list.sumTotal >= 2 && _list.sumTotal <= 5) {//待结算
                    wx.redirectTo({
                      url: '../index/index',
                    })
                    return
                  }
                  wx.redirectTo({
                    url: '../index/index',
                  })
                })
              })
            },function(){
              wx.showToast({
                title: '您的信息获取失败！',
                icon: 'none',
                duration:1500
              })
            })            
          }else{
            /*wx.navigateTo({
              url: '../login/login',
            }) */
            _this.setData({
              isPhone:false
            })
          }
        } else {
          wx.showToast({
            title: "获取用户信息失败，请重新获取",
            icon: 'none',
            duration: 2000
          })
        }
      },function(res){
        _this.setData({
          isPhone: false
        })
        wx.showToast({
          title: "获取用户信息失败，请重新获取",
          icon: 'none',
          duration: 2000
        })
      });
    })
    
  },
  /* 跳转到 排行 页 */
  paiBtn: function () {
    wx.navigateTo({
      url: '../rankings/rankings?surplusAmount=' + this.data.surplusAmount,
    })
  },
  /* 跳转到 活动规则 页 */
  ruleBtn: function () {
    wx.navigateTo({
      url: '../rule/rule',
    })
  },
  /* 跳转到 赛事报道 页 */
  guanBtn: function () {
    wx.navigateTo({
      url: '../news/news',
    })
  },
  /* 页面相关事件处理函数--监听用户下拉动作 */
  onPullDownRefresh: function () {},
  /* 页面上拉触底事件的处理函数 */
  onReachBottom: function () {},
  /* 用户点击右上角分享 */
  onShareAppMessage: function () {
    return util.getShareAppMessage() 
  },
  // 获取手机号
  getPhoneNumber: function (e) {
    console.log(e)
    var _this = this;
    var msg = userUtil.getWechatUserInfo()
    var sessionkey = userUtil.getSessionKey()
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
        userInfo: msg
      },
      success: function (res) {
        console.log(res)
        if(res.data.code==200){
          userUtil.wxLogin(pro_from, function (res) {
            var data = JSON.parse(res.data.data)
            var phone = "";
            var unionId = data.unionId
            var openId = data.openId
            var nickName = data.nickName
            var headimgurl = data.avatarUrl
            console.log(res)
            console.log(phone)
            tgwapi.userLogin(phone, unionId, openId, nickName, headimgurl, function (res) {
              console.log(res.data)
              //isRegister 0 已注册  1 未注册
              var code = res.statusCode;
              if (code == 200) {
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
                tgwapi.addplaylogin(datas, function (res) { })
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
                }
              } else {
                //console.log('失败')
                //手机号验证
                wx.showToast({
                  title: "获取用户手机号失败，请重新获取",
                  icon: 'none',
                  duration: 2000
                })
                _this.setData({
                  isPhone: false
                })
              }
            }, function (res) {
              wx.showToast({
                title: "获取用户手机号信息失败，请重新获取",
                icon: 'none',
                duration: 2000
              })
              _this.setData({
                isPhone: false
              })
            });
          })
        }else{
          wx.showToast({
            title: "获取用户手机号信息失败，请重新获取",
            icon: 'none',
            duration: 2000
          })
          _this.setData({
            isPhone:false
          })
        }
        
      }
    })
  }
})