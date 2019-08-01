//index.js
//获取应用实例
const app = getApp()
var getDatas = require("../../utils/m_xuan_gu_type.js")
var user = require("../../utils/user.js")
var req_url = app.globalData.req_url
Page({
  // onShow() { //如果已经显示过web-view页了，则执行后退操作，否则就跳到web-view页 
  //   if (!app.data.webShowed) {
  //     wx.navigateTo({ url: '/pages/webView/webView' })

  //   } else {
  //     wx.navigateBack({
  //       delta: 1
  //     });
  //   }
  // }

  data: {
    webURL: '',
    from:"",
    list:[],
    list2:[],
    ids:[],
    val_txt:'',
    ind4:-1,
    num:0,
    array:[],
    isShow:true,
    appname: app.globalData.appname
  },

  onLoad: function () {
    var _this = this;
    var isLogin = user.getWechatUserInfo()
    if (isLogin) {
      _this.setData({
        isShow: false
      })
    }
    // app.aldstat.sendEvent(this.loadFn())
    var _list = getDatas.dataFn();
    _this.setData({
      list: _list
    })
    var li={}
    for(var i in _list){
      li[i] = {}
      for(var j in _list[i]){
        li[i][j] = ''
      }
    }
    _this.setData({
      list2: li
    })
  },
  onReady: function () {
    //获得dialog组件
    this.phones = this.selectComponent("#phones");
  },
  loadFn:function(){
    var that = this
    wx.login({
      success: function (res) {
        // console.log(res.code)
        var token = "";
        try {
          var token = wx.getStorageSync('token')
          if (token) {
            // Do something with return value
            var token = token
            // console.log(token)
            that.setData({
              webURL: token
            })
          }
        } catch (e) {
          // Do something when catch error
        }

        if (res.code) {
          wx.request({
            url: req_url + 'login.php?token=' + token,
            data: {
              code: res.code
            },
            success: function (ms) {
              that.setData({
                webURL: ms.data.user_info.token
              })
              wx.setStorage({
                key: "token",
                data: ms.data.user_info.token
              })
            }
          })
        }
      }
    })
  },
  onShow:function(){
    this.setData({
      from: this.getFrom() || this.getRefferAppId()
    })
  },
  setFrom : function (options) {
    if (options.from) {
      wx.setStorageSync('from', options.from)
    }
  },
  getFrom : function () {
    return wx.getStorageSync('from') || ''
  },
  getRefferAppId : function () {
    return wx.getStorageSync('refferAppId') || ''
  },
  /* 一级点击 */
  clickFn:function(e){
    var index = e.currentTarget.dataset.index;
    this.setData({
      ind3:index
    })
  },
  /* 二级点击 */
  optionBtn:function(e){
    var txt = e.currentTarget.dataset.txt
    var id = e.currentTarget.dataset.id
    var ind2 = e.currentTarget.dataset.index2
    this.setData({
      ind1: e.currentTarget.dataset.index1,
      ind2: e.currentTarget.dataset.index2,
      ind3: 0,
      ind4: e.currentTarget.dataset.index,
      id: id
    })
    if (this.data.ind4 == -1){
      var va = 'list2.' + this.data.ind1 + '.' + this.data.ind2
      var idBox = this.data.ids;
      var ii = "ids."+ind2
      //idBox.pop(e.currentTarget.dataset.id)
      this.setData({
        [va]: "",
        [ii]:"",
        val_txt:"取消选择",
      })
      for (var i in this.data.ids) {
        if (this.data.ids[i] === '') {
          delete this.data.ids[i]
        }
      }
    }else{
      var va = 'list2.' + this.data.ind1 + '.' + this.data.ind2
      var key = "ids." + ind2
      var ii = "ids." + ind2
      this.setData({
        val_txt: txt,
        [va]: txt,
        [key]: e.currentTarget.dataset.id
      })
      if (Object.keys(this.data.ids).length > 3) {
        wx.showToast({
          title: '最多只能选择三个条件',
          icon: "none"
        })
        this.setData({
          [va]: "",
          [ii]: ""
        })
        for (var i in this.data.ids) {
          if (this.data.ids[i] === '') {
            delete this.data.ids[i]
          }
        }
      }
      console.log(this.data.ids)
    }
    this.setData({
      num: Object.keys(this.data.ids).length
    })
  },
  /* 点击 查看结果 */
  resultBtn:function(){
    if (Object.keys(this.data.ids).length == 0) {
      wx.showToast({
        title: '请选择最少一个条件',
        icon:"none"
      })
    }else if(Object.keys(this.data.ids).length>3){
      wx.showToast({
        title: '最多只能选择三个条件',
        icon: "none"
      })
    }else{
      var obj = this.data.ids
      var arr=[]
      for(var o in obj){
        arr.push(obj[o])
      }
      var ids_str = arr.join("_");
      var url = 'https://oauth.cf8.cn/MiniPro/xuangu.php?from=&type=2&ids=' + ids_str
      wx.navigateTo({
        url: '../webView/webView?ids=' + ids_str
      })
    }
  }
})
