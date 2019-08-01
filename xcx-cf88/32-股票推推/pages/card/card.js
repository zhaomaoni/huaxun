// pages/card/card.js
var util = require("../../utils/util.js")
var tgwapi = require("../../utils/tgwapi.js")
var userUtil = require("../../utils/userUtil.js")
const app = getApp()
Page({
  /* 页面的初始数据 */
  ////sumTotal 0：未报名 1：未推股 2：待结算  3：成功4：失败 5：中奖
  data: {
    userId: "",
    isDui: true,
    isNew: true,
    isOpen: true,
    isPay: true,
    payNum: 1,
    paying: false,
    usergamedetail: {},
    userDetails: {},
    surplusAmount: 0,//剩余金额
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    var _this = this;
    this.setData({
      userId: userUtil.getTgwUserId(),
      test: tgwapi.isTest()
    })
    wx.request({
      url: 'https://api.tgw360.com/secucodeplay-service/secucode/play/BuyresurrectionCardPrice',
      success: function (res) {
        _this.setData({
          pirce: res.data
        })
      },
      fail: function (res) { },
    })
    /* 当前用户参赛详情  */
    tgwapi.postRequestPlay('usergamedetail?userid=' + _this.data.userId, null, function (res) {
      var _list = res.data.data;
      console.log("当前用户参赛详情")
      console.log(_list)
      _this.setData({
        usergamedetail: _list
      })
      if (_list.sumTotal == 0) {
        wx.redirectTo({
          url: '../home/home',
        })
      }
    })
    /* 活动详情 */
    tgwapi.getRequestPlay('activeDetails', function (res) {
      _this.setData({
        peopleNum: res.data.data[0].numberParticipants,
        surplusAmount: res.data.data[0].surplusAmount,
        groupid: res.data.data[0].groupid
      })
    })
    /* 开户 */
    var f = app.globalData.f
    console.log(app.globalData)
    console.log("f:" + f)
    _this.setData({
      f: f
    })
    if (f) {
      if (app.globalData.configration) {
        console.log("onload app.globalData.configration exists")
        var broker = util.getConfigrationBroker(app.globalData.configration, app.globalData.f)
        _this.setData({
          broker: broker
        })
      } else {
        console.log("onload app.globalData.configration not exists")
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        app.configCallback = configration => {
          var broker = util.getConfigrationBroker(configration, f)
          _this.setData({
            broker: broker
          })
        }
      }
    } else {
      if (app.globalData.configration) {
        console.log("onload app.globalData.configration exists")
        _this.setData({
          kaihus: app.globalData.configration.kaihus
        })
      } else {
        console.log("onload app.globalData.configration not exists")
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        app.configCallback = configration => {
          _this.setData({
            kaihus: app.globalData.configration.kaihus
          })
        }
      }
    }
  },
  /* 跳转到直播 */
  zhiboBtn: function () {
    wx.navigateTo({
      url: '../zhibo/zhibo?groupid=' + this.data.groupid,
    })
  },
  /* 点击 立即开户 */
  kaihuBtn: function (e) {
    var urls = e.currentTarget.dataset.urls;
    if (urls) {
      wx.navigateTo({
        url: '../kaihu/kaihu?urls=' + urls,
      })
    }
  },
  // 结算
  openJob: function (e) {
    var _this = this;
    tgwapi.openJob(function (res) {
      _this.showTapOrToIndex(res);
    })
  },
  /* 点击 叉号图片 关闭弹层 */
  clearBtn: function () {
    this.setData({
      isDui: true,
      isNew: true,
      isPay: true
    })
  },
  /* 跳转到 赛事报道 页 */
  guanBtn: function () {
    wx.navigateTo({
      url: '../news/news',
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
  /* 历史推股 */
  hisBtn: function () {
    wx.navigateTo({
      url: '../hisfile/hisflie',
    })
  },
  showTapOrToIndex: function (res) {
    if (res.data.errCode > 0) {
      wx.showToast({
        title: res.data.errMsg,
        icon: 'none',
        duration: 2000
      })
    } else {
      if (res.data.errMsg.toLowerCase() != "ok") {
        wx.showToast({
          title: res.data.errMsg,
          icon: 'none',
          duration: 2000
        })
      } else {
        wx.reLaunch({
          url: '../index/index?r=' + Math.floor(Math.random() * 10000 + 1),
        })
      }
    }
  },
  /* 点击购买复活卡 */
  buyBtn: function () {
    this.setData({
      isPay: false
    })
  },
  /* 获取 购买复活卡的数量 */
  wxPayInput: function (e) {
    var money = Number(e.detail.value)
    if (money.toString().length >= 5) {
      wx.showToast({
        title: '最多可购买1万张复活卡！',
        icon: 'none',
        duration: 1500
      })
      this.setData({
        payNum: 10000
      })
    } else {
      this.setData({
        payNum: money
      })
    }
  },
  /* 增加复活卡 */
  addFn: function () {
    console.log(typeof this.data.payNum)
    if (this.data.payNum.toString().length >= 5) {
      wx.showToast({
        title: '最多可购买1万张复活卡！',
        icon: 'none',
        duration: 1500
      })
      this.setData({
        payNum: 10000
      })
    } else {
      this.setData({
        payNum: this.data.payNum + 1
      })
    }

  },
  /* 较少复活卡 */
  jianFn: function () {
    if (this.data.payNum <= 1) {
      this.setData({
        payNum: 1
      })
      wx.showToast({
        title: '最少需购买1张复活卡！',
        icon: 'none',
        duration: 1500
      })
    } else {
      this.setData({
        payNum: this.data.payNum - 1
      })
    }
  },
  // 微信支付
  wxpay: function () {
    var _this = this
    var openid = userUtil.getWechatUserInfo()
    var tgwUserId = userUtil.getTgwUserId();
    //购买数量
    var paynum = _this.data.payNum
    if (this.data.paying) {
      return
    } else {
      _this.setData({
        paying: true
      })
    }
    wx.request({
      url: 'https://api.51gsl.com/program/wxPay',//改成你自己的链接
      header: {
        'Accept': 'application/vnd.51gsl.v6+json'
      },
      method: 'POST',
      data: {
        openid: openid.openId,
        quantity: paynum, //数量
        userid: tgwUserId //用户id 
      },
      success: function (res) {
        console.log(res);
        /***
         * res.data.code == 500 未获取订单号
         * res.data.code == 501 获取复活卡价格失败
         * 200 成功
         * 
         */
        if (res.data.code != 200) {
          console.log("系统错误")
        }
        var result = JSON.parse(res.data.data);
        console.log('调起支付');
        wx.requestPayment({
          'timeStamp': result.timeStamp,
          'nonceStr': result.nonceStr,
          'package': result.package,
          'signType': 'MD5',
          'paySign': result.paySign,
          'success': function (res) {
            console.log('success');
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 3000
            });
            /* 用户信息详细 */
            tgwapi.getRequestPlay({ apiName: 'UserDetails', userId: tgwUserId }, function (res) {
              if (res.data.data[0]) {
                _this.setData({
                  userDetails: res.data.data[0]
                })
              }
            })
            _this.setData({
              paying: false
            })
          },
          'fail': function (res) {
            console.log('失败');
            _this.setData({
              paying: false
            })
          },
          'complete': function (res) {
            console.log('complete');
            _this.setData({
              isPay: true,
              paying: false
            })
          }
        });
      },
      fail: function (res) {
        console.log(res.data)
        _this.setData({
          paying: false
        })
      }
    });
  },

  /* 生命周期函数--监听页面初次渲染完成 */
  onReady: function () { },
  /* 生命周期函数--监听页面显示 */
  onShow: function () {
    var _this = this;
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          systemInfo: res
        });
        console.log(res)
      }
    })
    /* 用户信息详细 */
    tgwapi.getRequestPlay({ apiName: 'UserDetails', userId: _this.data.userId }, function (res) {
      console.log(res.data.data[0])
      if (res.data.data[0]) {
        _this.setData({
          userDetails: res.data.data[0]
        })
      }
    })
  },
  /* 生命周期函数--监听页面隐藏 */
  onHide: function () { },
  /* 生命周期函数--监听页面卸载 */
  onUnload: function () { },
  /* 页面相关事件处理函数--监听用户下拉动作 */
  onPullDownRefresh: function () { },
  /* 页面上拉触底事件的处理函数 */
  onReachBottom: function () { },
  /* 用户点击右上角分享 */
  onShareAppMessage: function () {
    return util.getShareAppMessage()
    this.setData({
      isOpen: true,
    })
  }
})