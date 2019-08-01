// pages/content/content.js
var app = getApp();
var util = require("../../utils/util.js");
var date = new Date();
var Y = date.getFullYear()
Page({
  /* 页面的初始数据 */
  data: {
    years: [{ "name": "今年", "year": Y }, { "name": "去年", "year": Y-1 }, { "name": "前年", "year": Y-2 }],
    curtitle:0,
    pageNum:1,
    list:[],
    scode:"",
    isid:0,
    isShow:false,
    year:"2018",
    htze:[],
    snd:[],
    zbw:[],
    yysr:[],
    loadMoreIs:true
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (opt) {
    var obj = opt.obj;
    var names = opt.name;
    wx.setNavigationBarTitle({
      title: names
    })
    var _this = this;
    this.setData({
      scode:obj
    })
    util.loadAd(function (showAD) {
      _this.setData({
        showAd: showAD
      });
    })
    this.loadData(this.data.year,this.data.pageNum)
  },
  /* 获取数据 */
  loadData: function (year,pageNum){
    var _this = this;
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    if (this.data.loadMoreIs == false) {
      wx.hideLoading()
      return;
    }
    wx.request({
      url: "https://api.51gsl.com/wx",
      method: 'POST',
      data: {
        "url": 'ttp://api.dataide.eastmoney.com/data/get_zdht_list?pagesize=30&orderby=updatedate&order=desc&jsonp_callback=var%20VilILqIE=(x)',
        'types': "GET",
        "pageindex": pageNum++,
        "year": year,
        "scode": _this.data.scode
      },
      header: {
        'content-type': 'application/json',
        "Accept": "application/vnd.51gsl.v6+json"
      },
      success: function (res) {
        var _list = res.data.substring(res.data.indexOf('{') + 0);
        _list = JSON.parse(_list).data;
        var dataList = _list;
        
        var ht=0;//合同总额
        var zb=0;//总比例
        var sn;//上年度
        var yy;//营业收入
        if(dataList.length!=0){
          for (var i in dataList) {
            if (dataList[i].amounts == null) { //判断合同总额为null
              dataList[i].amounts = 0;
            }
            if (dataList[i].zsndyysrbl == null) {//判断总比例为null
              dataList[i].zsndyysrbl = 0
            }
            if (dataList[i].sndyysr == null) {//判断上年度营业收入为null
              dataList[i].sndyysr = 0
            }
            if (dataList[i].operatereve == null) {//最新一季营业收入
              dataList[i].operatereve = 0
            }
            ht += parseFloat(dataList[i].amounts);
            zb += parseFloat(dataList[i].zsndyysrbl);
            sn = parseFloat(dataList[i].sndyysr);
            yy = parseFloat(dataList[i].operatereve);
          }
          ht = (ht / 100000000).toFixed(2);
          sn = (sn / 100000000).toFixed(2);
          yy = (yy / 100000000).toFixed(2);
          zb = zb.toFixed(1);
        }else{
          ht="-",sn="-",yy="-",zb="-";
        }
        

        _this.setData({
          htze: ht,
          snd: sn,
          zbw: zb,
          yysr: yy,
          loadMoreIs: dataList.length == 30
        })
        if (_this.data.loadMoreIs == false) {
          _this.setData({
            list: dataList,
            pageNum: pageNum++
          })
        } else {
          _this.setData({
            pageNum: pageNum++,
            list: _this.data.list.concat(dataList)
          })
        }
        wx.hideLoading()
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
      },
      fail: function (res) {
        _this.setData({
          loadMoreIs: false
        })
        wx.hideLoading()
      }
    })
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
  /* tab选择 */
  activeBtn: function (e) {
    var _this = this;
    if (this.data.curtitle === e.target.dataset.curtitle) {
      return false;
    } else {
      _this.setData({
        curtitle: e.target.dataset.curtitle,
        year: e.target.dataset.year,
        pageNum: 1,
        loadMoreIs: true
      })
      this.loadData(this.data.year, this.data.pageNum)
    }
  },
  /* 点击banner图片跳转 */
  images: function () {
    util.ad(this.data.showAd)
  },
  /* 页面相关事件处理函数--监听用户下拉动作 */
  onPullDownRefresh: function () {},
  /* 页面上拉触底事件的处理函数 */
  onReachBottom: function () {},
  /* 用户点击右上角分享 */
  onShareAppMessage: function () {},
  /* 生命周期函数--监听页面初次渲染完成 */
  onReady: function () {},
  /* 生命周期函数--监听页面显示 */
  onShow: function () {},
  /* 生命周期函数--监听页面隐藏 */
  onHide: function () {},
  /* 生命周期函数--监听页面卸载 */
  onUnload: function () {}
})