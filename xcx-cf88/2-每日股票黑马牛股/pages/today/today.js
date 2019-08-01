// pages/today/today.js
var _app = require('../../utils/util.js')
var value="";
Page({

  /* 页面的初始数据 */
  data: {
    isShow:false,
    isShow2: false,
    numbers:"",
    text:""
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (opt) {
    var num = opt.num;
    this.setData({
      numbers:num
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
  /* 页面相关事件处理函数--监听用户下拉动作 */
  onPullDownRefresh: function () {},
  /* 页面上拉触底事件的处理函数 */
  onReachBottom: function () {},
  /* 用户点击右上角分享 */
  onShareAppMessage: function () {},
  /* 点击复制微信号 */
  wxNumber : function(){
    var _this = this;
    _this.setData({
      isShow: (!_this.data.isShow)
    })
  },
  /* 点击‘我知道了’实现复制 */
  jump: function () {
    var _this = this;
    wx.setClipboardData({
      data: _this.data.number,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            console.log(res.data) // data
          }
        })
      }
    })
    _this.setData({
      isShow: (!_this.data.isShow)
    })
  },
  /* input获取焦点 */
  change : function(e){
    var _this = this;
    value = e.detail.value.replace(/\s+/g, '');
    if(value.length <= 0){
      this.data.isShow2 = false;
    }else{
      this.data.isShow2 = true;
    }
    _this.setData({
      isShow2: _this.data.isShow2
    })
  },
  submit : function(openid){
    var _this = this;
    wx.getStorage({
      key: 'openid1',
      success: function (res) {
          var openid = res.data;
          wx.request({
            url: "https://api.51gsl.com/wx",
            method: "POST",
            data: {
              url: "http://mobile2.cf8.cn/?r=wechat/stock/verify",
              types: "post",
              open_id: openid,
              pwd: value
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              "Accept": "application/vnd.51gsl.v6+json"
            },
            success: function (res) {
              console.log(333)
              console.log(res)
              if (res.data.status == 1) {
                wx.showToast({
                  title: '解锁成功',
                  icon: 'success',
                  duration: 1500,
                  mask: true
                })
                wx.reLaunch({
                  url: '../home/home',
                })
              } else if (res.data.status == -1) {
                wx.showModal({
                  title: '提示',
                  content: '未登录！',
                  showCancel: false,
                  success: function (res) {
                    if (res.confirm) {
                      _this.setData({
                        text: "",
                        isShow: false
                      })
                    }
                  }
                })
              } else if (res.data.status == 0) {
                wx.showModal({
                  title: '提示',
                  content: '验证失败！',
                  showCancel: false,
                  success: function (res) {
                    if (res.confirm) {
                      _this.setData({
                        text: "",
                        isShow: false
                      })
                    }
                  }
                })
              }
            }
          })
        }
      
    });

    
  }
})