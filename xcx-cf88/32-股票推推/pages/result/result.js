// pages/result/result.js
var util = require("../../utils/util.js")
var tgwapi = require("../../utils/tgwapi.js")
//var search = require("../../utils/search.js")
var userUtil = require("../../utils/userUtil.js")
const app = getApp()
Page({
  /* 页面的初始数据 */
  ////sumTotal 0：未报名 1：未推股 2：待结算  3：成功4：失败 5：中奖
  data: {
    userId:"",
    isDui:true,
    isNew:true,
    isOpen: true,
    payNum: 1,
    usergamedetail: {},
    userDetails: {},
    surplusAmount:0,//剩余金额
    duiTxt:"选择兑奖后，本轮推股活动将自动结束，是否确认兑奖？",
    jPic:{
      3:{
        "img":"https://api.51gsl.com/program/StockPush/images/icon_30.png",
        "num":"30",
        "content":["可前往淘股王APP【我】-【优惠券】查看"]
      },
      5:{
        "img": "https://api.51gsl.com/program/StockPush/images/icon_50.png",
        "num": "50",
        "content": ["5个工作日内 ，工作人员将会联系你注册的", "手机号码，敬请留意","官方客服电话：400-158-7118"]
      },
      7: {
        "img": "https://api.51gsl.com/program/StockPush/images/icon_100.png",
        "num": "100",
        "content": ["5个工作日内 ，工作人员将会联系你注册的", "手机号码，敬请留意", "官方客服电话：400-158-7118"]
      },
      9: {
        "img": "https://api.51gsl.com/program/StockPush/images/icon_1000.png",
        "num": "1000",
        "content": ["5个工作日内 ，工作人员将会联系你注册的", "手机号码，敬请留意", "官方客服电话：400-158-7118"]
      }
    }
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
      success: function(res) {
        _this.setData({
          pirce:res.data
        })
      },
      fail: function(res) {},
    })
    /* 当前用户参赛详情  */
    tgwapi.postRequestPlay('usergamedetail?userid=' + _this.data.userId, null, function (res) {
      var _list = res.data.data;
      console.log("当前用户参赛详情")
      console.log(_list)
      _this.setData({
        usergamedetail: _list
      })
      console.log(_this.data.usergamedetail)
      if (_list.sumTotal==0){
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
    // var f = util.getFrom()
    // console.log("f:"+f)
    // _this.setData({
    //   f: f
    // }) 
    // if(f){
    //   var broker = util.getConfigrationBroker(f)
    //   console.log("get getConfigrationBroker")
    //   console.log(broker)
    //   _this.setData({
    //     broker: broker
    //   }) 
    // }else{ 
    //   var kaihus = util.getConfigrationKaihus()
    //   console.log("kaihus")
    //   console.log(kaihus)
    //   _this.setData({
    //     kaihus: kaihus
    //   })  
    // }
    /* 开户 */
    var f = app.globalData.f
    console.log(app.globalData)
    console.log("f:"+f)
    _this.setData({
      f: f
    }) 
    if(f){
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
    } else{
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

    var _this = this;
    console.log(userUtil.getWechatUserInfo())
    var data = userUtil.getWechatUserInfo()
    var phone = ''
    var unionId = data.unionId
    var openId = data.openId
    var nickName = data.nickName
    var headimgurl = data.avatarUrl
    tgwapi.userLogin(phone, unionId, openId, nickName, headimgurl, function (res) {
      // console.log("用户登录/注册返回数据：");
      // console.log(res.data)
      //wx.setStorageSync('userMsg', res.data)
     

      var usermsg = res.data
      var data = userUtil.getWechatUserInfo() //15158
      var url = "https://m.tgw360.com/share/live?s=100956206&token=" + encodeURI(usermsg.access_token) + "&nickname=" + encodeURI(usermsg.nickname) + "&headimgurl=" + usermsg.headimgurl + "&env=miniProgram&appid=wx24eca8d743e49800&openid=" + data.openId
      console.log(url);
      wx.setStorageSync('zhiboUrl', url)
      wx.navigateTo({
        url: '../zhibo/zhibo',
      })
    })
    
  },
  /* 点击 立即开户 */
  kaihuBtn:function(e){
    var urls = e.currentTarget.dataset.urls;
    if(urls){
      wx.navigateTo({
        url: '../kaihu/kaihu?urls='+urls,
      })
    }
  },
  // 结算
  openJob: function(e){
    var _this = this;
    tgwapi.openJob(function(res){
      _this.showTapOrToIndex(res);
    })
  },
  /* 跳转 购买复活卡 页 */
  lifeBtn:function(){
    wx.navigateTo({
      url: '../card/card',
    })
  },
  //重新挑战 && 弹层里的 继续挑战
  retry:function(){
    var _this = this;
    tgwapi.postRequestPlay('continueChallenge?userid=' + _this.data.userId, null, function (res) {
      _this.showTapOrToIndex(res)
    })
    this.setData({
      isDui: true
    })
  },
  // 继续挑战
  continueBtn:function(e){
    var _this = this;
    console.log(e.currentTarget.dataset.days)
    var days = e.currentTarget.dataset.days
    if (days == 3 || days == 5 || days == 7 || days == 9){
      this.setData({
        isDui: false,
        duiTxt: "选择继续挑战，本次的奖品将无法兑换，是否确认继续挑战？"
      })
    }else{
      tgwapi.postRequestPlay('continueChallenge?userid=' + _this.data.userId, null, function (res) {
        _this.showTapOrToIndex(res)
      })
    }
  },
  //第十关时的取消
  cancelBtn:function(){
    this.setData({
      isDui: true
    })
    wx.navigateTo({
      url: '../index/index',
    })
  },
  //重新挑战
  newBtn:function(e){
    //fu 1重新挑战 2复活
    var fu = e.currentTarget.dataset.fu;
    this.setData({
      fu:fu,
      duiTxt:"选择重新挑战后，将从第一关重新开始挑战！",
      isNew:false
    })
  },
  // 点击复活按钮 显示提示框
  fuBtn:function(e){
    var fu = e.currentTarget.dataset.fu;
    this.setData({
      fu: fu,
      duiTxt:"选择复活后，将继续本轮关卡继续挑战！",
      isNew: false
    })
  },
  // 闯关失败的取消
  noBtn:function(){
    this.setData({
      isNew:true
    })
  },
  // 确定复活
  fuhuo: function () {
    var _this = this;
    tgwapi.postRequestPlay('resurrection?userid=' + _this.data.userId, null, function (res) {
      _this.setData({
        isNew: true
      })
      _this.showTapOrToIndex(res)
      
    })
  },
  /* 点击 兑奖 */
  duiBtn:function(){
    this.setData({
      isDui:false,
      duiTxt: "选择兑奖后，本轮推股活动将自动结束，是否确认兑奖？"
    })
  },
  /* 点击 确认兑奖 */
  jiangBtn:function(){
    var _this = this;
    tgwapi.postRequestPlay('exchangegift?userid=' + this.data.userId, null, function (res) {
      console.log("确认兑奖")
      if (res.data.errCode== 0) {
        if (res.data.errMsg.toLowerCase() == "ok"){
          _this.setData({
            isDui: true,
            isOpen: false
          })
        }else if (res.data.errMsg == "已兑奖品"){
          console.log(res.data.errMsg)
          _this.setData({
            isDui: true
          })
        } else if (res.data.errMsg == "当期未中奖" || res.data.errMsg == "礼品或者现金已经领完"){
          console.log(res.data.errMsg)
          _this.setData({
            isDui: true,
            isOpen: true
          })
        }else{
          console.log(res.data.errMsg)
          wx.showToast({
            title: res.data.errMsg,
            icon: 'none',
            duration: 2000
          })
          _this.setData({
            isDui: true,
            isOpen: true
          })
        }
      }else {
        wx.showToast({
          title: res.data.errMsg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  /* 点击 确定按钮 */
  sureBtn:function(){
    var _this = this;
    this.setData({
      isOpen: true
    })
    tgwapi.postRequestPlay('continueChallenge?userid=' + _this.data.userId, null, function (res) {
      _this.showTapOrToIndex(res)
      wx.redirectTo({
        url: '../index/index',
      })
    })
  },
  /* 点击 打开宝箱 */
  openBox:function(){
    var _this = this;
    tgwapi.postRequestPlay('exchangegift?userid=' + this.data.userId, null, function (res) {
      if (res.data.errMsg == "ok") {
        _this.setData({
          isDui: true,
          isOpen: false
        })
      } else if (res.data.errMsg == "已兑奖品") {
        _this.setData({
          isDui: true
        })
      } else if (res.data.errMsg == "当期未中奖" || res.data.errMsg == "礼品或者现金已经领完") {
        _this.setData({
          isDui: true,
          isOpen: true
        })
      } else {
        _this.setData({
          isDui: true,
          isOpen: false
        })
      }
      if (res.data.errCode > 0) {
        wx.showToast({
          title: res.data.errMsg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  /* 点击 叉号图片 关闭弹层 */
  clearBtn:function(){
    this.setData({
      isDui:true,
      isNew:true
    })
  },
  /* 点击 再来一轮 */
  againBtn:function(){
    var _this = this;
    this.setData({
      isOpen: true
    })
    wx.redirectTo({
      url: '../index/index',
    })
    tgwapi.postRequestPlay('usergamedetail?userid=' + this.data.userId, null, function (res) {
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
    tgwapi.postRequestPlay('continueChallenge?userid=' + this.data.userId, null, function (res) {
      _this.showTapOrToIndex(res)
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
  showTapOrToIndex:function(res){
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
      }else{
        wx.reLaunch({
          url: '../index/index?r=' + Math.floor(Math.random() * 10000 + 1),
        })
      }
    }
  },
  /* 生命周期函数--监听页面初次渲染完成 */
  onReady: function () {},
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
  onHide: function () {},
  /* 生命周期函数--监听页面卸载 */
  onUnload: function () {},
  /* 页面相关事件处理函数--监听用户下拉动作 */
  onPullDownRefresh: function () {},
  /* 页面上拉触底事件的处理函数 */
  onReachBottom: function () {},
  /* 用户点击右上角分享 */
  onShareAppMessage: function () { 
    return util.getShareAppMessage() 
    this.setData({
      isOpen:true,
    })
  }
})