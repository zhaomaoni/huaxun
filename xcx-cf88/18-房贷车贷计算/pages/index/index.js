// pages/index/index.js
var app = getApp();
var denge = require('../../utils/util.js')
Page({
  /* 页面的初始数据 */
  data: {
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    casArray: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
    casIndex: 29,
    zong:"200",
    li:"4.75",
    zong1: "",
    showAd: false,
    li1: "2.75",
    from:""
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (ops) {
    var that = this;
    
    denge.loadAd(function (showAD) {
      that.setData({
        showAd: showAD
      });
    })
    wx.getSystemInfo({ // 获取系统信息
      success: function (res) {     
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight - 46
        });
      }
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
  /* 贷款年限 选择 */
  bindCasPickerChange: function (e) {
    this.setData({
      casIndex: e.detail.value
    })
  },
  /* 滑动切换tab */
  bindChange: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },
  /* 点击tab切换 */
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  /* 点击banner图片跳转 */
  images: function () {
    denge.ad(this.data.showAd)
  },
  /* 商业 贷款总额 赋值 */
  zong : function(e){
    this.setData({
      zong: e.detail.value
    })
  },
  /* 商业 贷款利率 赋值 */
  li:function(e){
    this.setData({
      li: e.detail.value
    })
  },
  /* 公积金 贷款总额 赋值 */
  zong1: function (e) {
    this.setData({
      zong1: e.detail.value
    })
  },
  /* 公积金 贷款利率 赋值 */
  li1: function (e) {
    this.setData({
      li1: e.detail.value
    })
  },
  /* 点击 开始计算 跳转计算结果页 */
  jump:function(){
    if (this.data.currentTab==0){
      if (this.data.zong != "" && this.data.li != "" && this.data.zong != 0 && this.data.li != 0){
        wx.navigateTo({
          url: "../content/content?zong=" + this.data.zong + "&li=" + this.data.li + "&year=" + this.data.casArray[this.data.casIndex]
        })
      }else{
        wx.showModal({
          title: '输入提示',
          content: '所有选项不能为空或0'
        })
      }
    }else if(this.data.currentTab==1){
      if (this.data.zong1 != "" && this.data.li1 != "" && this.data.zong1 != 0 && this.data.li1 != 0) {
        if (this.data.zong1 > 120) {
          wx.showModal({
            title: '输入提示',
            content: '贷款总额不得大于120万'
          })
        }else{
          wx.navigateTo({
            url: "../content/content?zong=" + this.data.zong1 + "&li=" + this.data.li1 + "&year=" + this.data.casArray[this.data.casIndex]
          })
        }        
      } else {
        wx.showModal({
          title: '输入提示',
          content: '所有选项不能为空或0'
        })
      }
    }else{
      if (this.data.zong != "" && this.data.li != "" && this.data.zong != 0 && this.data.li != 0 && this.data.zong1 != "" && this.data.li1 != "" && this.data.zong1 != 0 && this.data.li1 != 0) {
        wx.navigateTo({
          url: "../content2/content2?zong1=" + this.data.zong1 + "&li1=" + this.data.li1 + "&year=" + this.data.casArray[this.data.casIndex] + "&zong=" + this.data.zong + "&li=" + this.data.li+"&currentTab="+this.data.currentTab
        })
      } else {
        wx.showModal({
          title: '输入提示',
          content: '所有选项不能为空或0'
        })
      }
    }
  },
  /* 生命周期函数--监听页面初次渲染完成 */
  onReady: function () { },
  /* 生命周期函数--监听页面显示 */
  onShow: function () {
    this.setData({
      from: denge.getFrom() || denge.getRefferAppId()
    })
    console.log("data:");
    console.log(this.data);
    var that = this;
    denge.loadAd(function (showAD) {
      that.setData({
        showAd: showAD
      });
    })
    app.aldstat.sendEvent(this.onLoad());
  },
  /** 生命周期函数--监听页面隐藏 */
  onHide: function () { },
  /** 生命周期函数--监听页面卸载 */
  onUnload: function () { },
  /* 页面相关事件处理函数--监听用户下拉动作 */
  onPullDownRefresh: function () { },
  /* 页面上拉触底事件的处理函数 */
  onReachBottom: function () {},
  /* 用户点击右上角分享 */
  onShareAppMessage: function (ops) {}
})