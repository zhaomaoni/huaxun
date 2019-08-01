// pages/index/index.js
var app = getApp();
var util = require("../../utils/util.js")
Page({
  /* 页面的初始数据 */
  data: {
    txt1:"提示：转发后可获得不限次数的永久使用权限",
    txt2:"摇一摇 得灵签",
    txt3:"请抓紧手机 诚信默念心中疑问",
    src:"../../images/pic1.gif",
    shakeInfo:{
      enabled: false
    },
    shakeDate:{
      x:0,
      y:0,
      z:0
    },
    number:1,
    isShow:false,
    isShake:1,
    showAd: false,
    from:""
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    var that = this
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
  /* 生命周期函数--监听页面初次渲染完成 */
  onReady: function () {},
  /* 生命周期函数--监听页面显示 */
  isYao: false,
  onShow: function () {
    app.aldstat.sendEvent(this.shake())
    this.isYao = true;

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
  onHide: function () {
    this.isYao = false;
  },
  /* 生命周期函数--监听页面卸载 */
  onUnload: function () {},
  /* 页面相关事件处理函数--监听用户下拉动作 */
  onPullDownRefresh: function () {},
  /* 页面上拉触底事件的处理函数 */
  onReachBottom: function () {},
  /* 用户点击右上角分享 */
  onShareAppMessage: function (res) {
    var _this = this;
    return {
      title: '免费观音灵签',
      path: '/pages/index/index',
      success:function(res){
        //分享成功后
        _this.setData({
          txt1:"恭喜 您获得永久使用权"
        })
        wx.setStorage({
          key: "key",
          data: {
            isShare: true,
            isShake: 2
          }
        })
      },
      fail:function(res){
        console.log(res)
      }
    }
  },
  /* 点击banner图片跳转 */
  images: function () {
    util.ad(this.data.showAd)
  },
  /* 点击查看签词跳转 */
  btnClick:function(){
    wx.navigateTo({
      url: "../content/content?number="+this.data.number
    })
  },
  //摇一摇
  shake:function(){
    var _this = this;
    //启用摇一摇
    this.gravityModalConfirm(true);
    wx.onAccelerometerChange(function(res){
      if (!_this.isYao) {
        return
      }
      //摇一摇核心代码,判断手机晃动幅度
      var x = res.x.toFixed(4)
      var y = res.y.toFixed(4)
      var z = res.z.toFixed(4)
      var flagX = _this.getDelFlag(x,_this.data.shakeDate.x)
      var flagY = _this.getDelFlag(y, _this.data.shakeDate.y)
      var flagZ = _this.getDelFlag(z, _this.data.shakeDate.z);
      _this.data.shakeData={
        x : res.x.toFixed(4),
        y : res.y.toFixed(4),
        z : res.z.toFixed(4)
      }

      if(flagX && flagY || flagX && flagZ || flagY && flagZ){
        //如果摇一摇幅度足够大,则认为摇一摇成功
        // wx.removeStorage({
        //   key: "key",
        // })
        wx.getStorage({
          key: 'key',
          success: function (res) {
            if(!res.data.isShare){
              if(res.data.isShake==1){
                _this.setData({
                  txt1:"免费机会已用完,请转发"
                })
                wx.showToast({
                  title: '机会已用完 请转发',
                  icon: 'none',
                  duration: 2000
                })
              }
            }else{
              _this.setData({
                shakeInfo: {
                  enabled: true
                }
              })
              _this.playShakeAudio()
              wx.showToast({
                title: '摇一摇成功',
                icon: 'success',
                duration: 2000
              })
              var nums = Math.floor(Math.random() * (1 - 100) + 100);
              _this.setData({
                number: nums,
                txt1: "恭喜 您获得永久使用权",
                txt2: "摇一摇 得灵签",
                txt3: "请抓紧手机 诚信默念心中疑问",
                isShow: false
              })
            }
          },
          fail:function(e){
            if (_this.data.shakeInfo.enabled) {
              _this.playShakeAudio()
              wx.showToast({
                title: '摇一摇成功',
                icon: 'success',
                duration: 2000
              })
              var nums = Math.floor(Math.random() * (1 - 100) + 100);
              _this.setData({
                number: nums,
                txt1: "免费机会已用完，转发或推荐好友后可获永久使用权",
                txt2: "摇一摇 得灵签",
                txt3: "请抓紧手机 诚信默念心中疑问",
                isShow: true,
                shakeInfo: {
                  enabled: false
                }
              })
              wx.setStorage({
                key: "key",
                data: {
                  isShare:false,
                  isShake: 1
                }
              })
            }
          }
        })
      }
    });
  },
  //启用或者停用摇一摇功能
  gravityModalConfirm:function(flag){
    if(flag !== true){
      flag = false;
    }
    var _this = this;
    this.setData({
      shakeInfo:{
        enabled:flag
      }
    })
  },
  //计算摇一摇的偏移量
  getDelFlag:function(val1,val2){
    return (Math.abs(val1 - val2)>=1);
  },
  //摇一摇成功后播放声音
  playShakeAudio:function(){
    var _this = this;
    wx.playBackgroundAudio({
      dataUrl:'http://7xqnxu.com1.z0.glb.clouddn.com/wx_app_shake.mp3',
      title:'',
      coverImgUrl:''
    });
    wx.onBackgroundAudioStop(function(){
      _this.setData({
        shakeInfo:{
          enabled: true
        },
        txt2:"恭喜摇签成功",
        txt3: "快去查看本次的签词吧",
        isShow: true,
        src:"../../images/pic2.gif"
      })
    })
  }
})