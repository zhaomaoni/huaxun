// pages/index/index.js
var app = getApp();
var util = require("../../utils/util.js")
Page({
  /* 页面的初始数据 */
  data: {
    list: [],
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    curtitle:0,
    curMain:0,
    showAd: false,
    isShow:false,
    isid:0,
    token:"",
    name:"HY",
    pageNum: 1,
    loadMoreIs: true,
    num1:"",
    days:["今日","5日","10日"],
    titles: ["行业资金流", "概念资金流","地域资金流"],
    num2:"",
    viewData:[
      { "title": "主力净流入","k1":4,"k2":5},
      { "title": "今日超大单净流入", "k1": 6, "k2": 7 },
      { "title": "今日大单净流入", "k1": 8, "k2": 9 },
      { "title": "今日中单净流入", "k1": 10, "k2": 11 },
      { "title": "今日小单净流入", "k1": 12, "k2": 13 },
    ],
    from:""
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (ops) {
    var that = this;
    wx.getSystemInfo({ // 获取系统信息
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    app.aldstat.sendEvent(this.getToken())
  },
  /* 获取token */
  getToken:function(){
    var _this = this;
    wx.request({
      url: 'https://api.51gsl.com/program/dflx',
      method: 'POST',
      header: {
        'content-type': 'application/json',
        "Accept": "application/vnd.51gsl.v6+json"
      },
      success: function(res) {
        _this.setData({
          token: res.data.data.token
        })
        _this.listDataFn(_this.data.token, _this.data.name, _this.data.num1, _this.data.num2, _this.data.pageNum)
      },
      fail: function(res) {}
    })
  },
  /* 获取数据 */
  listDataFn: function (token, name, num1, num2, pageNum){
    var _this = this;
    wx.showLoading({
      title: '加载中',
      mask: true,
    })    
    if (_this.data.loadMoreIs == false) {
      wx.hideLoading()
      return ;
    }
    wx.request({
      url: "https://api.51gsl.com/wx",
      method: 'POST',
      data:{
        "url": 'http://nufm.dfcfw.com/EM_Finance2014NumericApplication/JS.aspx?cmd=C._BK' + name + '&type=ct&st=(BalFlowMain' + num1 + ')&sr=-1&js=var%20gqdobjMm={pages:(pc),data:[(x)]}&token=' + token + '&sty=DCFFITABK' + num2,
        'types': "GET",
        "p": pageNum++,
        "ps": 20
      },
      header: {
        'content-type': 'application/json',
        "Accept": "application/vnd.51gsl.v6+json"
      },
      success: function (res) {
        var _list = res.data.substring(res.data.indexOf(',') + 1);        
        var datas = _list.slice(0,4) //获取 ‘data’
        var num = _list.slice(4, )  //获取数组
        _list = '{"'+datas+'"'+num;
        var listData = JSON.parse(_list).data;
        var listNum = [];
        for (var i in listData) {
          listNum.push(listData[i].split(","))
        }
        
        if (_this.data.loadMoreIs == false) {
          _this.setData({
            list: listNum,
            pageNum: pageNum++
          })
        } else {
          _this.setData({
            pageNum: pageNum++,
            list: _this.data.list.concat(listNum)
          })
        }
        _this.setData({
          loadMoreIs: listData.length == 20
        })
        wx.hideLoading()
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
      },
      fail: function (res) {
        _this.setData({
          loadMoreIs:false
        })
        wx.hideLoading()
      }
    })
  },
  /* 生命周期函数--监听页面初次渲染完成 */
  onReady: function () { },
  /* 生命周期函数--监听页面显示 */
  onShow: function () {
    var that = this;
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
  /** 生命周期函数--监听页面隐藏 */
  onHide: function () { },
  /** 生命周期函数--监听页面卸载 */
  onUnload: function () { },
  /* 页面相关事件处理函数--监听用户下拉动作 */
  onPullDownRefresh: function () { },
  /* 页面上拉触底事件的处理函数 */
  onReachBottom: function () {
    this.getToken()
    var that = this
    //that.listDataFn(that.data.token, that.data.name, that.data.num1, that.data.num2, that.data.pageNum)
  },
  /* 点击箭头展示隐藏内容 */
  clickBtn: function (e) {
    var ids = e.currentTarget.dataset.id;
    if (ids != this.data.isid) {
      this.setData({
        isid: ids,
        isShow: true
      })
    } else {
      this.setData({
        isid: 0,
        isShow: !this.data.isShow
      })
    }
  },
  /* 资金流tab切换 */
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else { 
      that.setData({
        currentTab: e.target.dataset.current,
        list:[],
        loadMoreIs: true
      })
    }
    if (this.data.currentTab == 0) {
      that.setData({
        name: "HY",
        pageNum: 1,
        isid: 0,
        isShow: false
      })
      that.getToken()
    } else if (this.data.currentTab == 1) {
      that.setData({
        name: "GN",
        pageNum: 1,
        isid: 0,
        isShow: false
      })
      that.getToken()
    } else {
      that.setData({
        name: "DY",
        pageNum: 1,
        isid: 0,
        isShow: false
      })
      that.getToken()
    }
  },
  /* 几日tab选择 */
  activeBtn: function (e) {
    var _this = this;
    if (this.data.curtitle === e.target.dataset.curtitle) {
      return false;
    } else {
      _this.setData({
        curtitle: e.target.dataset.curtitle,
        curMain: e.target.dataset.curtitle,
         list: [],
        loadMoreIs: true
      })
    }
    if (this.data.curtitle == 0) {
      _this.setData({
        num1: "",
        num2: "",
        isid: 0,
        isShow: false,
        pageNum: 1
      })
      _this.getToken()
    } else if (this.data.curtitle == 1) {
      _this.setData({
        num1: "Net5",
        num2: 5,
        isid: 0,
        isShow: false,
        pageNum: 1
      })
      _this.getToken()
    } else {
      _this.setData({
        num1: "Net10",
        num2: 10,
        isid: 0,
        isShow: false,
        pageNum: 1
      })
      _this.getToken()
    }
  },
  /* 点击banner图片跳转 */
  images: function () {
    util.ad(this.data.showAd)
  },
  /* 用户点击右上角分享 */
  onShareAppMessage: function (ops) {}
})