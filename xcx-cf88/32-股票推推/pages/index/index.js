// pages/index/index.js
var util = require("../../utils/util.js")
var tgwapi = require("../../utils/tgwapi.js")
var search = require("../../utils/search.js")
var userUtil = require("../../utils/userUtil.js")
Page({
  /* 页面的初始数据 */
  data: {
    arrs:5,
    ranking:[],
    _list:[],
    progressArr:[1,2,3,4,5,6,7,8,9,10],
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo : null,
    isLayer: true,
    tguserid:"",
    peopleNum:0,      //参赛人数
    surplusAmount:0,  //剩余金额
    userId: "",
    isLogin:false,
    picSrc: "../../images/icon_body1.png",
    voteTitle:"",
    tuiList:0,
    usergamedetail:{},
    userDetails:{},
    secucodelist:[],
    life:0,
    liList:[
      {
        "num":3,
        "pic":"https://api.51gsl.com/program/StockPush/images/icon_j30.png"
      },
      {
        "num": 5,
        "pic": "https://api.51gsl.com/program/StockPush/images/icon_j50.png"
      },
      {
        "num": 7,
        "pic": "https://api.51gsl.com/program/StockPush/images/icon_j100.png"
      },
      {
        "num": 9,
        "pic": "https://api.51gsl.com/program/StockPush/images/icon_j1000.png"
      },
      {
        "num": 10,
        "pic": "https://api.51gsl.com/program/StockPush/images/icon_j10000.png"
      }
    ],
    getGift:[]
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    var tguserid = options.tguserid;
    console.log(tguserid)
    if (tguserid){
      wx.setStorageSync('tguserid', tguserid)
      this.setData({
        tguserid: tguserid
      })
      console.log("tguserid:"+tguserid)
    }
    this.setData({
      userId: userUtil.getTgwUserId()
    })
    if(this.data.userid==0){
      wx.showToast({
        title: "获取用户信息失败",
        icon: 'none',
        duration: 2000,
        success:function(){
          wx.redirectTo({
            url: '../../index/index',
          })
        }
      })
    }
    console.log("userId:" +this.data.userId)
    console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
    if (!this.data.userId){
      wx.navigateTo({
        url: '../home/home',
      })
      return;
    }
    var _this = this;
    var unionId = wx.getStorageSync('unionId') || ''
    /* 当前用户参赛详情  */
    tgwapi.postRequestPlay('usergamedetail?userid=' + _this.data.userId, null, function (res) {
      var _list = res.data.data;
      console.log("当前用户参赛详情")
      console.log(_list)
      _this.initSecucodelist(_list.stockCount)
      _this.setData({
        usergamedetail: _list
      })
      var days = _this.data.usergamedetail.days;
      if (days != 0 && days < 11) {
        _this.setData({
          picSrc: "../../images/icon_body" + (days + 1) + ".png"
        })
      } else {
        _this.setData({
          picSrc: "../../images/icon_body1.png"
        })
      }
      //sumTotal 0：未报名 1：未推股 2：待结算  3：成功4：失败 5：中奖
      if (_list.sumTotal == 0) {//未报名
        /* 用户初始化表增加 */
        tgwapi.addUser({ "userid": _this.data.userId }, function (res) {
          console.log("用户初始化表增加")
        });
      }
      if (_list.sumTotal == 1) {//未推股

      }
      if (_list.sumTotal >= 2 && _list.sumTotal <= 5) {//待结算
        // wx.navigateTo({
        //   url: '../result/result?life=' + _this.data.life,
        // })
        // _this.setData({
        //   isLayer:true
        // })
      }
    })
    /* 获取礼物列表 */
    tgwapi.getRequestPlay('getSecucodeplayGiftget', function (res) {
      _this.setData({
        ranking:res.data.data
      })
    })
    /* 活动详情 */
    tgwapi.getRequestPlay( 'activeDetails', function (res) {
      _this.setData({
        peopleNum: res.data.data[0].numberParticipants,
        surplusAmount: res.data.data[0].surplusAmount,
        groupid: res.data.data[0].groupid
      })
    })
    /* 奖品列表 */
    tgwapi.getRequestPlay('getGiftList', function (res) {
      _this.setData({
        getGift: res.data.data
      })
    })
  },
  initSecucodelist:function(length){
    var a = []; 
    for (var n = 0; n < length; n++){ 
      a[n] = {}
    }
    this.setData({ secucodelist : a})
  },
  /* 跳转到 赛事报道 页 */
  guanBtn: function () {
    wx.navigateTo({
      url: '../news/news',
    })
  },
  /* 输入股票代码 */
  wxSearchInput:function(e){
    this.setData({
      tuiIdxs: e.currentTarget.dataset.index,
      isCheck:false,
      value: search.search(e.detail.value)
    })
  },
  /* 点击代码列表 */
  mainBtn: function (e) {
    var secucodelist = this.data.secucodelist
    var index = e.currentTarget.dataset.index
    secucodelist[index] = {
      secucode: e.currentTarget.dataset.secucode,
      secucodename: e.currentTarget.dataset.secucodename,
      market: e.currentTarget.dataset.market
    } 
    this.setData({
      isCheck:true,
      secucodelist: secucodelist
      //voteTitle: e.currentTarget.dataset.main
    })
  },
  /* 关闭推股弹层 */
  closeBtn:function(){
    this.setData({
      isLayer:true,
      voteTitle: "",
      isCheck: true
    })
  },
  /* 清空文本框 */
  clearBtn:function(e){
    var secucodelist = this.data.secucodelist
    var index = e.currentTarget.dataset.index
    secucodelist[index] = {}
    this.setData({
      isCheck:true,
      secucodelist: secucodelist
    })
  },
  /* 点击推股按钮 */
  tuiBtn:function(){
    var _this = this;
    var hash={};
    // for (var n in this.data.secucodelist) {
    //   if (!this.data.secucodelist[n].secucodename){
    //     wx.showModal({
    //       title: '选股提示',
    //       content: '股票不在活动选股范围内，请重新选择',
    //       showCancel: false,
    //       confirmColor: "#333333"
    //     })
    //     return;
    //   }
    // } 
    var data = {
      userid: this.data.userId,
      periods: this.data.tuiNum,
      secucodelist: this.data.secucodelist
    }
    console.log(data)
    for (var j in data.secucodelist) {
      if (!data.secucodelist[j].secucodename) {
        wx.showModal({
          title: '选股提示',
          content: '股票或为空或不在活动选股范围内，请重新选择',
          showCancel: false,
          confirmColor: "#333333"
        })
        return
      }
      if (hash[data.secucodelist[j].secucodename]) {
        wx.showModal({
          title: '选股提示',
          content: '不能重复推股，请重新选择',
          showCancel: false,
          confirmColor: "#333333"
        })
        return 
      }
      hash[data.secucodelist[j].secucodename] = true;
    }
    tgwapi.postRequestPlay('submitsecucode', data,function(res){
      if (res.data.errCode==0){
        _this.setData({
          isLayer: true,
          voteTitle: "",
          isCheck: true
        })
        wx.navigateTo({
          url: '../result/result',
        })
        // wx.showModal({
        //   title: '推股提示',
        //   content: '推股成功',
        //   showCancel: false,
        //   confirmColor: "#333333",
        //   success: function (res) {
        //     if (res.confirm) {
        //       _this.setData({
        //         isLayer: true,
        //         voteTitle: "",
        //         isCheck: true
        //       })
        //       wx.navigateTo({
        //         url: '../result/result',
        //       })
        //     }
        //   }
        // })
      }else{
        wx.showModal({
          title: '推股提示',
          content: res.data.errMsg,
          showCancel: false,
          confirmColor:"#333333",
          success: function (res) {
            _this.setData({
              isLayer: true,
              voteTitle: "",
              isCheck: true
            })
          }
        })
      }
    })
  },
  /* 点击立即闯关按钮 */
  chuangBtn:function(){
    var _this = this;
    util.showLoading();
    tgwapi.postRequestPlay('usergamedetail?userid=' + _this.data.userId, null, function (res) {

      var _list = res.data.data;
      console.log(_list)
      _this.setData({
        usergamedetail: _list
      })
      // 初始化活动 
      if (_list.sumTotal == 0) {
        tgwapi.addUser({ userid: _this.data.userId }, function (res) {
          console.log("初始化活动");
          tgwapi.postRequestPlay('usergamedetail?userid=' + _this.data.userId, null, function (res) {
            var _list = res.data.data;
            console.log(_list)
            _this.setData({
              usergamedetail: _list
            })
            _this.showTuiguDiv()
          })
        })
        return
      }
      if (_list.sumTotal >= 2 && _list.sumTotal <= 5) {//待结算
        wx.navigateTo({
          url: '../result/result',
        })
      } else { 
        console.log("已经参加活动");
        _this.showTuiguDiv()
        util.hideLoading()
      }
    })  
    
  },
  /* 关数背景图片更改 */
  showTuiguDiv:function(){
    var days = Number(this.data.usergamedetail.days);
    this.setData({
      isLayer: false,
      voteTitle: "",
      isCheck: true,
      picSrc: "../../images/icon_body" + (days + 1) + ".png"
    })
  },
  // test :function(){
  //   var unionId = wx.getStorageSync('unionId') || ''
  //   console.log('unionId=' + unionId)
  // },
  /* 跳转到 排行 页 */
  paiBtn:function(){
    wx.navigateTo({
      url: '../rankings/rankings?surplusAmount=' + this.data.surplusAmount,
    })
  },
  /* 跳转到 活动规则 页 */
  ruleBtn:function(){
    wx.navigateTo({
      url: '../rule/rule',
    })
  },
  /* 历史推股 */
  hisBtn:function(){
    wx.navigateTo({
      url: '../hisfile/hisflie',
    })
  },
  /* 点击复活卡加号 */
  lifeBtn:function(){
    wx.navigateTo({
      url: '../card/card',
    })
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
  }
})