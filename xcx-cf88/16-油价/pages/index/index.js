// pages/index/index.js
var app = getApp();
var dates = require('../../utils/date.js')
var bmap = require('../../utils/bmap-wx.js');
var wxCharts = require('../../utils/wxcharts-min.js');
var util = require("../../utils/util.js")
var lineChart = null;
Page({
  /* 页面的初始数据 */
  data: {
    date: "2018年6月25日",
    title: "今日油价",
    date2: dates.getDates(),
    list:[],
    area: [],
    showAd: false,
    eList:[],
    dateList: [],
    priceList: [],
    address:"beijing",
    text:"89号汽油",
    isArea:false,
    isCharts:false,
    isMain:false,
    nextDate:'',
    oilTime: ["20180625", "20180709", "20180723", "20180806", "20180820", "20180903", "20180917", "20180930", "20181019", "20181102", "20181116", "20181130", "20181214", "20181228"],
    data: [],
    area_name : "请选择地区",
    city:"",
    from:""
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    this.oilDate()
    this.areaList()
    var that = this;
    util.loadAd(function (showAD) {
      that.setData({
        showAd: showAD
      });
    })
    // 新建百度地图对象 
    var BMap = new bmap.BMapWX({
      ak: 'aSOYOjcHfmUBzk9b9iQ7Zh0GijpWACnR'
    });
    var success = function (data) {
      var city = data.originalData.result.addressComponent.city;
      city = city.substr(0,2)
      var area = that.data.area;
      for(var i in area){
        for(var j in area[i]){
          if(area[i][j] == city){
            that.setData({
              area_name:city,
              address:j
            })
          }
        }
      }
      app.aldstat.sendEvent(that.listLoad())
    }
    var fail = function (data) {
      console.log(data)
    };
    // 发起regeocoding检索请求 
    BMap.regeocoding({
      fail: fail,
      success: success,
    });
  },
  /* 跳转赢家小工具 */
  moreBtn: function () {
    var _this = this;
    wx.navigateToMiniProgram({
      appId: 'wx81dacf7d77359d1d',
      path: '/pages/index/index?from='+_this.data.from,
      envVersion: 'release'
    })
  },
  /* 首页数据加载 */
  listLoad:function(){
    var _this = this;
    wx.request({
      url: 'https://api.51gsl.com/program/youjia',
      method: 'POST',
      data: {
        address:_this.data.address
      },
      header: {
        'content-type': 'application/json',
        "Accept": "application/vnd.51gsl.v6+json"
      },
      success: function(res) {
        var obj = res.data.data;
        var tempData = [];
        for(var i in obj){
          tempData[i] = obj[i];
          _this.setData({
            list: obj,
            eList: obj[i].oilHis,
            dateList: obj[i].oilHis[0],
            priceList: obj[i].oilHis[1]
          })
        }
        _this.setData({
          data: tempData
        })
      },
      fail: function(res) {}
    })
  },
  /* 地区数据 */
  areaList:function(){
    var _this = this;
    wx.request({
      url: 'https://api.51gsl.com/program/getOilAddr',
      method: 'POST',
      header: {
        'content-type': 'application/json',
        "Accept": "application/vnd.51gsl.v6+json"
      },
      success: function(res) {
        var num = res.data.data
        _this.setData({
          area:num
        })
        var tempAreaName = '';
        for(var i in num){
          for(var j in num[i]){
            if (j == _this.data.address){
              tempAreaName = num[i][j];
              break;
            }
          }
          if (tempAreaName!=''){
            break;
          }
        }
        _this.setData({
          area_name: tempAreaName
        });
      },
      fail: function(res) {}
    })
  },
  /* 图表 */
  echeats:function(data){
    var _this = this;
    var windowWidth = "100%";
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth - 35;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    lineChart = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: data.oilHis[0],
      animation: true,
      series: [{
        name: data.oliType+'价格走势',
        data: data.oilHis[1],
        format: function (val, name) {
          return val;//.toFixed(2)
        }
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        format: function (val) {
          return val.toFixed(0);
        },
        min: 5
      },
      width: windowWidth,
      height: 200,
      dataLabel: true,
      dataPointShape: true,
      extra: {
        lineStyle: 'straight'
      }
    });
  },
  /* 点击列表 */
  listClick:function(e){
    var text = e.currentTarget.dataset.text;
    var index = e.currentTarget.dataset.index;
    this.setData({
      text: text,
      isCharts: true,
      title:"油价走势",
      date2:"今日"+index+"元/升",
      isMain: false
    })
   
    this.echeats(this.data.data[index])
  },
  /* 点击 请选择地区 */
  areaClick:function(){
    this.setData({
      isCharts: false,
      title: "今日油价",
      date2: dates.getDates(),
      isArea: !this.data.isArea
    })
    if(this.data.isMain==false){
      this.setData({
        isMain: true
      })
    }else{
      this.setData({
        isMain: false
      })
    }
  },
  /* 点击各地方 */
  liClick: function (e) {
    var index = e.currentTarget.dataset.index
    var text = e.currentTarget.dataset.text 
    this.setData({
      address:index,
      area_name : text,
      isArea: !this.data.isArea,
      isMain: !this.data.isMain,
      title: "今日油价",
      date2: dates.getDates()
    })
    this.listLoad()
  },
  oilDate: function () {
    var now = new Date();
    var _this = this;
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    if (month < 10) {
      month = '0' + month;
    };
    if (day < 10) {
      day = '0' + day;
    };
    var dateTime = year + '' + month + '' + day;
    //console.log(dateTime)
    var nextDate = '';
    for (var i = 0; i < _this.data.oilTime.length; i++) {
      if (_this.data.oilTime[i] > dateTime) {
        nextDate = _this.data.oilTime[i];
        break;
      }
    }
    if (nextDate) {
      nextDate = nextDate.substr(0, 4) + '年' + nextDate.substr(4, 2) + '月' + nextDate.substr(6, 2) + '日';
      _this.setData({
        nextDate: nextDate
      })
      return nextDate
    }
    console.log(nextDate.substr(0, 4) + '年' + nextDate.substr(4, 2) + '月' + nextDate.substr(6, 2)+'日');
  },
  /* 点击banner图片跳转 */
  images: function () {
    util.ad(this.data.showAd)
  },
  /* 点击消息提示跳转 */
  nextShow:function(){
    wx.navigateTo({
      url: "../message/message"
    })
  },
  /* 生命周期函数--监听页面初次渲染完成 */
  onReady: function () { },
  /* 生命周期函数--监听页面显示 */
  onShow: function () {
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