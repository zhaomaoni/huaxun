var tgwapi = require("../../utils/tgwapi.js")
var userUtil = require("../../utils/userUtil.js")
var conf = require('../../utils/config.js')
var app = getApp();
Page({
  data: {
    awardsList: {},
    animationData: {},
    btnDisabled: '',
    chance: true,
    awards: [],
    awardsLength: 0,
    lottery_id: 0,
    today_chance: 0,
    total_chance: 0,
    tabber: ["记录", "大奖"],
    pinkTxt: "",
    status: 1,
    prix: [],
    currentTab: 0,
    ranking: [],
    isShow: true,
    open: true,
    jiangBox: [],
    banner: "",
    from:"",
    appname: app.globalData.appname
  },
  onReady: function (e) {
    //分享
    wx.showShareMenu({
      withShareTicket: true
    });
  },
  onLoad: function (opt) {
    this.setFrom(opt)
    this.setData({
      from: this.getFrom() || (wx.getStorageSync('refferAppId') || '')
    })
    var fromId = opt.uid;
    console.log("fromId：" + fromId)
    if (fromId) {
      wx.setStorageSync('fromId', fromId)
    }
    app.aldstat.sendEvent(this.loadData());

  },
  setFrom : function (options) {
    if (options.from) {
      wx.setStorageSync('from', options.from)
    }
  },
  getFrom : function () {
    return wx.getStorageSync('from') || ''
  },
  /* 获取数据 */
  loadData: function () {
    var _this = this
    var uid = userUtil.getUserId()
    console.log("userId:" + uid)
    var token = userUtil.getUserToken()
    var info_url
    if (uid && token) {
      info_url = conf.tgwUrl.infoUrl + '&uid=' + uid + '&token=' + token
    } else {
      info_url = conf.tgwUrl.infoUrl
    }
    //当前抽奖活动详情及奖品
    tgwapi.getInfo(info_url, function (res) {
      var array = Object.keys(res.data.list.product)
      var wechat = res.data.list.wechat;
      var chat = wechat.split(",");
      _this.setData({
        awards: res.data.list.product,
        awardsLength: array.length,
        lottery_id: res.data.list.id,
        kefu: res.data.list.kefu,
        wechat: chat[0],
        banner: res.data.list.pic
      })
      //用户的抽奖次数跟新增次数
      if (res.data.user.length != 0) {
        _this.setData({
          today_chance: res.data.user.today_chance,
          // total_chance:5
          total_chance: res.data.user.total_chance
        })
      }
      //获取 记录 数据
      tgwapi.getInfo(conf.tgwUrl.allreduceUrl + '&lottery_id=' + _this.data.lottery_id, function (res) {
        var _list = res.data.list;
        var arr = [];
        var num = 0;
        for (var i in _list) {
          if (num >= 5) {
            break
          }
          arr[num] = _list[i]
          num++
        }
        _this.setData({
          record: arr
        })
      })
      //获取 大奖 数据
      tgwapi.getInfo(conf.tgwUrl.resultUrl + '&lottery_id=' + _this.data.lottery_id, function (res) {
        var _list = res.data.list;
        var arr = [];
        var num = 0;
        for (var i in _list) {
          if (num >= 5) {
            break
          }
          arr[num] = _list[i]
          num++
        }
        _this.setData({
          prix: arr,
          ranking: res.data.list
        })
      })
      _this.drawAwardRoundel();
    })
  },
  /* 转盘分数及概率 */
  drawAwardRoundel: function () {
    var awards = this.data.awards;
    var awardsList = [];
    var turnNum = 1 / this.data.awardsLength;
    // 文字旋转 turn 值 
    // 奖项列表 
    for (var i in awards) {
      awardsList.push({
        turn: i * turnNum + 'turn',
        lineTurn: i * turnNum + turnNum / 2 + 'turn',
        award: awards[i].title,
        pic: awards[i].pic,
        id: i,
        type: awards[i].type
      });
    }
    this.setData({
      btnDisabled: this.data.chance ? '' : 'disabled',
      awardsList: awardsList
    });
  },
  //发起抽奖 
  playReward: function () {
    var _this = this
    var islo = userUtil.isLogin()
    if (!islo) {
      return
    }
    var open = _this.data.open
    if (open) {
      this.setData({
        open: false
      })
    } else {
      return false
    }
    if (_this.data.total_chance > 0) { //&& _this.data.status==1
      var totalChance //= _this.data.total_chance-1;
      //中奖index 
      var awardIndex = 0;
      //调取tgw抽奖接口
      var uid = userUtil.getUserId()
      var token = userUtil.getUserToken()
      this.setData({
        isShow: true
      })
      
      var runNum = 8;//旋转8周 
      var duration = 4000;
      //时长 // 旋转角度 
      _this.runDeg = _this.runDeg || 0;
      _this.runDeg = _this.runDeg + (360 - _this.runDeg % 360) + (360 * runNum - awardIndex * (360 / _this.data.awardsLength)) - (360 / _this.data.awardsLength / 2)
      //创建动画 
      var animationRun = wx.createAnimation({
        duration: duration,
        timingFunction: 'ease'
      })
      /* 用户抽奖 */
      tgwapi.postFormRequestAll(conf.tgwUrl.lotteryUrl, { "uid": uid, "token": token, "id": _this.data.lottery_id }, function (res) {
        var status = res.data.status;
        _this.setData({
          status: status,
          pinkTxt: res.data.msg,
          content: res.data.content
        })
        totalChance = res.data.total_chance;
        if (status == 1) {
          awardIndex = res.data.id
          _this.setData({
            awardIndex: awardIndex
          });
        }else {
          awardIndex = res.data.id;
          _this.setData({
            awardIndex: awardIndex
          })
        }
        var runNum = 8;//旋转8周 
        var duration = 4000;
        //时长 // 旋转角度 
        _this.runDeg = _this.runDeg || 0;
        _this.runDeg = _this.runDeg + (360 - _this.runDeg % 360) + (360 * runNum - awardIndex * (360 / _this.data.awardsLength)) - (360 / _this.data.awardsLength / 2)
        //创建动画 
        var animationRun = wx.createAnimation({
          duration: duration,
          timingFunction: 'ease'
        })
        animationRun.rotate(_this.runDeg).step();
        _this.setData({
          animationData: animationRun.export(),
          btnDisabled: 'disabled',
        });
        // 中奖提示 
        setTimeout(function () {
          if (status==1){
            if (awardIndex == res.data.id) {
              _this.jiangBoxFn()
            } else {
              _this.jiangBoxFn();
            }
            _this.setData({
              btnDisabled: '',
              isShow: false,
              open: true,
              total_chance: totalChance
            });
          } else if (status==-1){
            wx.showToast({
              title: '暂时无法参与活动，请耐心等待',
              icon: 'none',
              duration: 2000
            })
            _this.setData({
              open: true
            });
          }else if(status==-3){
            wx.showToast({
              title: '暂无法参与活动，请耐心等待',
              icon: 'none',
              duration: 2000
            })
            _this.setData({
              open: true
            });
          } else if (status == -4) {
            wx.showToast({
              title: '活动尚未开始，请耐心等待',
              icon: 'none',
              duration: 2000
            })
            _this.setData({
              open: true
            });
          } else if (status == -5) {
            wx.showToast({
              title: '本期活动已结束，下期尚未开始，请耐心等待',
              icon: 'none',
              duration: 2000
            })
            _this.setData({
              open: true
            });
          } else if (status == -6) {
            wx.showToast({
              title: '暂无法参与活动，请耐心等待',
              icon: 'none',
              duration: 2000
            })
            _this.setData({
              open: true
            });
          }
        }.bind(_this), duration);
      })
    } else {
      _this.setData({
        isShow: false,
        open: true,
        total_chance: 0
      })
    }
  },
  /* 弹层内容 */
  jiangBoxFn: function () {
    var awardsConfig = this.data;
    for (var i in this.data.awardsList) {
      if (this.data.awardsList[i].id == this.data.awardIndex) {
        this.setData({
          jiangBox: [
            {
              "tpic": this.data.awardsList[i].pic,
              "title": awardsConfig.awards[this.data.awardIndex].title,
              "content": this.data.content,
              "type": awardsConfig.awards[this.data.awardIndex].type
            }
          ]
        })
      }
    }
  },
  /* tab切换 */
  swichNav: function (e) {
    var _this = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      _this.setData({
        currentTab: e.target.dataset.current,
      })
      if (this.data.userid) {
        this.loadData()
      }
    }
  },
  /* 一键复制 */
  copyBtn: function (e) {
    var _this = this;
    wx.setClipboardData({
      data: _this.data.wechat,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    });
  },
  /* 点击叉号关闭弹层 */
  closeLayer: function () {
    this.setData({
      isShow: true
    })
  },
  /* 点击 抽奖记录 */
  cjBtn: function () {
    var islo = userUtil.isLogin()
    var _this = this
    if (islo) {
      wx.navigateTo({
        url: '../myHis/myHis?lottery_id=' + _this.data.lottery_id,
      })
    }

  },
  /* 点击 邀请记录 */
  yqBtn: function () {
    var islo = userUtil.isLogin()
    var _this = this
    if (islo) {
      wx.navigateTo({
        url: '../friend/friend',
      })
    }
  },
  /* 点击 活动规则 */
  hdBtn: function () {
    wx.navigateTo({
      url: '../rule/rule',
    })
  },
  /* 点击 全部记录 */
  allBtn: function () {
    var islo = userUtil.isLogin()
    var _this = this
    if (islo) {
      wx.navigateTo({
        url: '../historys/historys?lottery_id=' + _this.data.lottery_id,
      })
    }

  },
  onShareAppMessage: function () {
    this.setData({
      isShow: true
    })
    var islo = userUtil.isLogin()
    var _this = this
    if (!islo) {
      return
    }
    var uid = userUtil.getUserId()
    return {
      title: '抽奖大转盘',
      path: '/pages/index/index?uid=' + uid
    }
  },
})