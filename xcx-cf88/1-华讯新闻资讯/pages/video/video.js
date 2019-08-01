// pages/video/video.js
const app = getApp();

const zrhelper = require('../../sdk/zrender-helper');
const zrender = require("../../sdk/zrender");

const VOD = require("../../sdk/vod");
const GSSDK = require("../../sdk/gssdk");
const GS = GSSDK.GS;

let pointer = "", pointer1 = "", cansObject = {}, scale, oldCurrentTime = 0, cHeight, cWidth;
Page({
  /**
  * 页面的初始数据
  */
  data: {
    joinItem: '',//加入设置各种参数
    videoHeight: 205,//视频高度
    swiperHeight: 500,//下面滑动高度
    audioSrc: "",//语音地址
    videoSrc: "",//视频地址
    autoplay: true,//自动播放

    condition: false,//是否有canvas
    docHeight: 0,//文档高度、canvas高度
    documentUrl: '',//文档地址

    current: 1,//tab选中状态
    isShowQnaire: false,//是否显示问卷
    isFullScreen: false,//是否全屏
    pointer_show: 0,

    voteList: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
    voteSingleSel: '../../assets/icons/single.png',
    voteSingleSel2: '../../assets/icons/single2.png',
    voteSingleSel3: '../../assets/icons/single3.png',
    voteMultSel: '../../assets/icons/multiple.png',
    voteMultSel2: '../../assets/icons/multiple2.png',
    voteMultSel3: '../../assets/icons/multiple3.png',
    voteId: [],//接收到的问卷id，用于接收到过一次问卷后则不在显示
    voteAll: []//接收到的问卷
  },

  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    this.channel = GS.createChannel();
    app.globalData.channel = this.channel;
    // 页面初始化 options为页面跳转所带来的参数
    if (options.item) {
      this.setData({
        joinItem: JSON.parse(options.item)
      });
    }
  },
  /**
  * 生命周期函数--监听页面初次渲染完成
  */
  onReady: function () {
    let that = this, statusFlag = false;

    let winHeight = wx.getSystemInfoSync().windowHeight, winWidth = wx.getSystemInfoSync().windowWidth;
    let vidHeight = winWidth * 9 / 16;
    let swpHeight = winHeight - 44 - vidHeight;

    this.setData({
      videoHeight: vidHeight,
      swiperHeight: swpHeight
    });

    scale = winWidth / 1024;

    this.videoContext = wx.createVideoContext('myVideo');
    this.chat = this.selectComponent('#chat');

    if (this.zr) {
      this.zr.dispose();
    }
    this.zr = zrhelper.createZrender("drawCanvas", winWidth, swpHeight);



    //获取视频地址
    this.channel.bind("onVideoUrl", res => {
      console.log('获取到视频地址');
      that.setData({
        videoSrc: res.data.mediaUrl
      });
    });

    //监听文档翻页
    this.channel.bind("onDocChange", res => {
      console.log('文档翻页');
      cHeight = res.data.height;
      cWidth = res.data.width;
      let s = cHeight / cWidth;

      let nHeight = winWidth * s;
      scale = winWidth / cWidth;
      that.clearAnno();
      that.setData({
        documentUrl: res.data.hls,
        docHeight: nHeight,
        condition: true
      });
    });

    //收到标注
    this.channel.bind("onAnno", res => {
      console.log('收到标注');
      let list = res.data.annoArray;
      if (res.data.cmd == 'clear') {
        // that.clearAnno();
      } else if (list.length > 0) {
        setTimeout(function () {
          that.drawCanvas(list);
        }, 200);
      }

    });

    //问卷调查
    this.channel.bind("onVote", res => {
      console.log("收到调查问卷");
      var content = res.data, voteAll = that.data.voteAll, voteId = that.data.voteId;
      if (that.voteId_in(voteId, content.id)) {
        return false;
      } else {
        voteId.push({ 'id': content.id });
      }
      if (!that.voteId_in(voteAll, content.id)) {
        for (var j = 0; j < content.questions.length; j++) {
          content.questions[j].answer = '';
        }
      }
      content.type = 'question';
      voteAll.push(content);
      if (voteAll.length > 0) {
        that.videoContext.pause();
      }
      that.setData({
        voteId: voteId,
        voteAll: voteAll,
        isShowQnaire: true
      });
    });


    //获取标题
    this.channel.bind("onTitle", res => {
      console.log('获取标题');
      wx.setNavigationBarTitle({ title: res.data.content });
    })


    //SDK状态通知
    this.channel.bind("onStatus", res => {
      console.log('SDK状态通知');
      if (statusFlag) {
        return false;
      }
      statusFlag = true;
      let content = '';
      if (res.data.type == '1') {
        content = '人数已满，您无法加入';
      } else if (res.data.type == '7') {
        content = '人数已满，您无法加入';
      }

      if (res.data.type == '1' || res.data.type == '7') {
        wx.showModal({
          title: '提示',
          content: content,
          showCancel: false,
          confirmText: '我知道了',
          confirmColor: '#0078d7',
          success: function () {
            statusFlag = false;
            wx.navigateBack({
              delta: 1
            })
          }
        });
      }
    });


    //监听报错
    this.channel.bind("onAPIError", res => {
      console.log('报错');
      wx.showModal({
        title: 'ERROR',
        content: res.data.explain,
        showCancel: false,
        confirmText: '我知道了',
        confirmColor: '#0078d7'
      });
    });

    //onDataReady初始化
    this.channel.bind("onDataReady", res => {
      let data = res.data;
      that.channel.send("setupChatSync", { "open": true });
      that.channel.send("submitQAList", {});
      that.videoContext.play();
    });




    this.numTen = m => {
      return m > 9 ? m : '0' + m;
    }

    this.voteId_in = function (arr, id) {
      if (arr.length == 0) {
        return false;
      } else {
        for (var i in arr) {
          if (arr[i].id == id) {
            return true;
          }
        }
        return false;
      }
    }

    this.idInCanvas = function (obj, id) {
      if (!Object.prototype.toString.call(obj) == "[object Object]") {
        return false;
      } else {
        for (var k in obj) {
          if (k == id) {
            return true;
          }
        }
        return false;
      }
    }






    VOD._open_.init({
      "widget": this.channel,
      "site": that.data.joinItem.site,
      "ownerid": that.data.joinItem.id,
      "ctx": that.data.joinItem.ctx,
      "authcode": that.data.joinItem.authcode,
      "uid": '',
      "uname": app.globalData.userInfo.nickName,
      "encodetype": '',
      "password": '',
      "k": that.data.joinItem.k,
      "istest": false
    }, function (e) {
      console.log("回调");
      app.globalData.userInfo.userid = e.userid;
    });


    // var t = 0, timerun;
    // setTimeout(res=>{
    //     VOD.initMediaEvent.play();
    //     VOD.initMediaEvent.playing();
    //     timerun = setInterval(function(){
    //         app.globalData.currentTime = t;
    //         VOD.initMediaEvent.timeupdate();
    //         t++;
    //     }, 200);
    // }, 2000)



  },
  refreshCanvas: function (e) {
    let that = this;
    that.clearAnno();
    that.chat.refreshChat();
  },
  createArrowHead: function (pos, color, size) {
    var headLength = 5,
      x1 = parseInt(pos[0]),
      y1 = parseInt(pos[1]),
      x2 = parseInt(pos[2]),
      y2 = parseInt(pos[3]),

      dx = x2 - x1,
      dy = y2 - y1,

      x3, y3, x4, y4, midx, midy,
      angle = Math.atan2(dy, dx);

    angle *= 180 / Math.PI;
    var angle1 = (angle + 30) * Math.PI / 180,
      angle2 = (angle - 30) * Math.PI / 180;


    x3 = x2 - Math.cos(angle1) * headLength;
    y3 = y2 - Math.sin(angle1) * headLength;

    x4 = x2 - Math.cos(angle2) * headLength;
    y4 = y2 - Math.sin(angle2) * headLength;

    var polygon = new zrender.Polygon({
      shape: {
        points: [[x2, y2], [x3, y3], [x4, y4]],
        smooth: false
      },
      style: {
        fill: color,
        stroke: color,
        lineWidth: size
      }
    });

    return polygon;
  },
  drawCanvas: function (data) {
    let that = this;
    if (!(data && data.length > 0)) {
      return false;
    }

    for (var i = 0; i < data.length; i++) {
      var all = new Object();
      if (that.idInCanvas(cansObject, data[i].id)) continue;
      for (var k in data[i]) {
        all[k] = data[i][k];
      }

      if (all.color != null) {
        var color_arr = all.color.split(',');
        var color = color_arr[0];
        var opacity = parseFloat(color_arr[1]);
      }

      if (that.data.pointer_show > 0) {
        if (all.type == 9 || all.type == 1) {
          if ((all.style == '0' && that.data.pointer_show != 2) || (all.style == '1' && that.data.pointer_show != 1)) {
            if (that.data.pointer_show == 1) {
              pointer.setStyle({ x: -100, y: -100 });
            } else {
              pointer1.setStyle({ x: -100, y: -100 });
            }
          }
        } else {
          if (that.data.pointer_show == 1) {
            pointer.setStyle({ x: -100, y: -100 });
          } else {
            pointer1.setStyle({ x: -100, y: -100 });
          }
          that.setData({
            pointer_show: 0
          });
        }
      }

      if (all.type == 6) {
        //矩形
        all.start_p = all.p.split(',');
        all.end_p = all.ep.split(',');
        var width = parseInt(all.end_p[0]) - parseInt(all.start_p[0]);
        var height = parseInt(all.end_p[1]) - parseInt(all.start_p[1]);
        var linesize = parseInt(all.linesize) * scale;

        var rect = new zrender.Rect({
          shape: {
            x: parseInt(all.start_p[0]) * scale,
            y: parseInt(all.start_p[1]) * scale,
            width: parseInt(width * scale),
            height: parseInt(height * scale)
          },
          style: {
            fill: null,
            stroke: color,
            lineWidth: linesize
          }
        });
        cansObject[all.id] = rect;
        cansObject[all.id].timestamp = all.timestamp;
        that.zr.add(rect);

      } else if (all.type == 5) {
        //椭圆
        all.start_p = all.p.split(',');
        all.end_p = all.ep.split(',');
        var width = parseInt(all.end_p[0]) - parseInt(all.start_p[0]);
        var height = parseInt(all.end_p[1]) - parseInt(all.start_p[1]);
        var linesize = parseInt(all.linesize) * scale;

        var ellipse = new zrender.Ellipse({
          shape: {
            cx: (parseInt(all.start_p[0]) + parseInt(all.end_p[0])) / 2 * scale,
            cy: (parseInt(all.start_p[1]) + parseInt(all.end_p[1])) / 2 * scale,
            rx: parseInt(width / 2 * scale),
            ry: parseInt(height / 2 * scale)
          },
          style: {
            fill: null,
            stroke: color,
            lineWidth: linesize
          }
        });
        cansObject[all.id] = ellipse;
        cansObject[all.id].timestamp = all.timestamp;
        that.zr.add(ellipse);
      } else if (all.type == 4 && all.text) {
        // 文字
        console.log("写文字");
        all.start_p = all.p.split(',');
        all.end_p = all.ep.split(',');
        var fontsize = parseInt(all.fontsize * scale);
        var value = all.text;

        var text = new zrender.Text({
          style: {
            x: parseInt(all.start_p[0]) * scale,
            y: parseInt(all.start_p[1]) * scale,
            text: value,
            textFill: color,
            textFont: fontsize + 'px Microsoft Yahei',
            textBaseline: 'top'
          }
        });
        cansObject[all.id] = text;
        cansObject[all.id].timestamp = all.timestamp;
        that.zr.add(text);

      } else if (all.type == 3) {
        if (all.removed == 0) {//清屏
          that.clearAnno();
        } else {
          var id = all.removed;
          if (cansObject[id] && cansObject[id] != null) {
            that.zr.remove(cansObject[id]);
          }
          delete cansObject[id];
        }
      } else if (all.type == '8' || all.type == '7') {//线条
        all.start_p = all.p.split(',');
        all.end_p = all.ep.split(',');
        var linesize = parseInt(all.linesize) * scale;

        if (all.style == '0' || all.type == '7') {//直线
          var line1 = new zrender.Line({
            shape: {
              x1: parseInt(all.start_p[0]) * scale,
              y1: parseInt(all.start_p[1]) * scale,
              x2: parseInt(all.end_p[0]) * scale,
              y2: parseInt(all.end_p[1]) * scale
            },
            style: {
              lineCap: "round",
              lineWidth: linesize,
              stroke: color,
              lineDash: null
            }

          });
          cansObject[all.id] = line1;
          cansObject[all.id].timestamp = all.timestamp;
          that.zr.add(line1);
        } else if (all.style == '1') {// 虚线
          var line2 = new zrender.Line({
            shape: {
              x1: parseInt(all.start_p[0]) * scale,
              y1: parseInt(all.start_p[1]) * scale,
              x2: parseInt(all.end_p[0]) * scale,
              y2: parseInt(all.end_p[1]) * scale
            },
            style: {
              lineCap: "butt",
              lineWidth: linesize,
              stroke: color,
              lineDash: [2, 2]
            }
          });
          cansObject[all.id] = line2;
          cansObject[all.id].timestamp = all.timestamp;
          that.zr.add(line2);

        } else if (all.style == '2') {// 箭头  
          console.log("有箭头线条");
          var arrow = that.createArrowHead([all.start_p[0] * scale, all.start_p[1] * scale, all.end_p[0] * scale, all.end_p[1] * scale], color, linesize * scale);
          var line3 = new zrender.Line({
            shape: {
              x1: parseInt(all.start_p[0]) * scale,
              y1: parseInt(all.start_p[1]) * scale,
              x2: parseInt(all.end_p[0]) * scale,
              y2: parseInt(all.end_p[1]) * scale
            },
            style: {
              lineCap: "round",
              lineWidth: linesize,
              stroke: color,
              fill: color
            }

          });

          cansObject[all.id] = [line3, arrow];
          cansObject[all.id].timestamp = all.timestamp;
          that.zr.add(line3);
          that.zr.add(arrow);
        }
      } else if (all.type == 2) {// 自由笔
        var linesize = parseInt(all.linesize) * scale;
        var p = all.p, s_p = new Array;
        for (var m = 0; m < p.length; m++) {
          if (Object.prototype.toString.call(p[m]) === '[object Array]') {
            p[m] = p[m];
          } else {
            p[m] = p[m].split(",");
          }
        }
        for (var j = 0; j < p.length; j++) {
          s_p.push([parseInt(p[j][0]) * scale, parseInt(p[j][1]) * scale]);
        }
        if (opacity < 1) {
          opacity = 0.75;
        }

        var line4 = new zrender.Polyline({
          style: {
            lineDash: [0, 0],
            opacity: opacity,
            stroke: color,
            lineWidth: linesize
          },
          shape: {
            points: s_p,
            smooth: 0.5
          }
        });

        cansObject[all.id] = line4;
        cansObject[all.id].timestamp = all.timestamp;
        that.zr.add(line4);
      } else if (all.type == 9 || all.type == 1) {//激光笔
        var start_p;
        if (Object.prototype.toString.call(all.p) === '[object Array]') {
          start_p = all.p;
        } else {
          start_p = all.p.split(",");
        }
        if (all.style && all.style == 1 && pointer == "") {
          var image = new zrender.Image({
            style: {
              x: parseInt(start_p[0]) * scale,
              y: parseInt(start_p[1]) * scale,
              image: '../../assets/icons/point.png',
              width: 16,
              height: 16,
              text: ''
            }
          });
          that.zr.add(image);
          pointer = image;
        } else if (all.style && all.style == 0 && pointer1 == "") {
          var image = new zrender.Image({
            style: {
              x: parseInt(start_p[0]) * scale,
              y: parseInt(start_p[1]) * scale,
              image: '../../assets/icons/pointEx.png',
              width: 16,
              height: 16,
              text: ''
            }
          });
          that.zr.add(image);
          pointer1 = image;
        } else {
          if (all.style && all.style == 1) {
            pointer.setStyle({ x: parseInt(start_p[0]) * scale, y: parseInt(start_p[1]) * scale });
          } else {
            pointer1.setStyle({ x: parseInt(start_p[0]) * scale, y: parseInt(start_p[1]) * scale });
          }
        }

        if (all.style && all.style == 1) {
          that.setData({
            pointer_show: 1
          });
        } else {
          that.setData({
            pointer_show: 2
          });
        }
      }
    }
  },
  clearAnno: function () {
    var that = this, arr = [];
    for (var k in cansObject) {
      if (cansObject[k] && cansObject[k] != null) {
        arr.push(cansObject[k]);
        that.zr.remove(cansObject[k]);
      }
    }
    let winHeight = wx.getSystemInfoSync().windowHeight, winWidth = wx.getSystemInfoSync().windowWidth;
    let vidHeight = winWidth * 9 / 16;
    let swpHeight = winHeight - 44 - vidHeight;
    that.zr = zrhelper.createZrender("drawCanvas", winWidth, swpHeight);
    cansObject = {};
  },
  swiperDemo1: function () {
    this.setData({
      current: 1
    });
  },
  swiperDemo2: function () {
    this.setData({
      current: 2
    });
  },
  swiperDemo3: function () {
    this.setData({
      current: 3
    });
  },
  swiperDemo4: function () {
    this.setData({
      current: 4
    });
  },
  singleTap: function (e) {
    var id = e.currentTarget.dataset.id, qaid = e.currentTarget.dataset.qaid, that = this, allArray = that.data.voteAll, item;
    for (var i = 0; i < allArray.length; i++) {
      item = allArray[i].questions;
      for (var j = 0; j < item.length; j++) {
        var questions = item[j];
        if (questions.type == 'single' && questions.id == qaid) {
          for (var k = 0; k < questions.items.length; k++) {
            if (questions.items[k].id == id) {
              questions.items[k].selected = true;
              questions.answer = (k + 1 + '');
            } else {
              questions.items[k].selected = false;
            }
          }
        }
      }
    }
    this.setData({
      voteAll: allArray
    });
  },
  multTap: function (e) {
    var id = e.currentTarget.dataset.id, that = this, allArray = that.data.voteAll, item;
    for (var i = 0; i < allArray.length; i++) {
      item = allArray[i].questions;
      for (var j = 0; j < item.length; j++) {
        var questions = item[j];
        if (questions.type == 'multi') {
          questions.answer = '';
          for (var k = 0; k < questions.items.length; k++) {
            if (questions.items[k].id == id) {
              questions.items[k].selected = !questions.items[k].selected;
            }
            if (questions.items[k].selected) {
              questions.answer += (k + 1 + ',');
            }
          }
          questions.answer = questions.answer.substring(0, questions.answer.length - 1);
        }
      }
    }
    this.setData({
      voteAll: allArray
    });
  },
  textInput: function (e) {
    var id = e.currentTarget.dataset.id, that = this, allArray = that.data.voteAll, item;
    var val = e.detail.value;
    for (var i = 0; i < allArray.length; i++) {
      item = allArray[i].questions;
      for (var j = 0; j < item.length; j++) {
        if (item[j].type == 'text' && item[j].id == id) {
          item[j].answer = val;
          item[j].text = val;
        }
      }
    }

    this.setData({
      voteAll: allArray
    });

  },
  subVote: function (e) {
    var that = this, allArray = that.data.voteAll, id = e.currentTarget.dataset.id, itemArray, flag = false;
    for (var j = 0; j < allArray.length; j++) {
      if (allArray[j].id == id) {
        for (var n = 0; n < allArray[j].questions.length; n++) {
          var items = allArray[j].questions[n].items;
          if (items) {
            for (var m = 0; m < items.length; m++) {
              if (items[m].correct == 'true') {
                flag = true;
                break;
              }
            }
          }
          if (flag) break;
        }
        if (allArray[j].skip == 'false') {//强制投票的判断
          for (var k = 0; k < allArray[j].questions.length; k++) {
            if (allArray[j].questions[k].answer == '') {
              wx.showModal({
                title: '提示',
                content: '强制投票需要回答完所有题目',
                showCancel: false,
                confirmText: '我知道了',
                confirmColor: '#0078d7'
              });
              return false;
            }
          }
        }

        itemArray = allArray[j];
        if (flag) {
          allArray[j].showAns = true;
        } else {
          allArray.splice(j, 1);
        }
        break;
      }
    }
    this.channel.send("submitVote", itemArray);
    if (allArray.length == 0) {
      this.videoContext.play();
      this.setData({
        voteAll: allArray,
        isShowQnaire: false
      });

    } else {
      this.setData({
        voteAll: allArray
      });
    }

  },
  closeNaire: function (e) {
    var id = e.currentTarget.dataset.id, that = this, allArray = that.data.voteAll;
    for (var j = 0; j < allArray.length; j++) {
      if (allArray[j].id == id) {
        allArray.splice(j, 1);
        break;
      }
    }
    if (allArray.length == 0) {
      that.videoContext.play();
      that.setData({
        voteAll: allArray,
        isShowQnaire: false
      });

    } else {
      that.setData({
        voteAll: allArray
      });
    }

  },
  screenChange: function (e) {
    let that = this;
    let flag = e.detail.fullScreen;
    this.setData({
      isFullScreen: flag
    });
  },
  exitFull: function (e) {
    this.videoContext.exitFullScreen();
  },
  timeupdate: function (event) {
    if (event.detail.currentTime != oldCurrentTime) {
      app.globalData.currentTime = event.detail.currentTime;
      VOD.initMediaEvent.timeRecord();
      if (Math.abs(event.detail.currentTime - oldCurrentTime) > 1) {
        this.clearAnno();
        if (event.detail.currentTime == 0) {
          this.chat.reset();
        } else {
          this.chat.refreshChat();
        }
        VOD.initMediaEvent.timeupdate();
        VOD.initMediaEvent.seeking();
        VOD.initMediaEvent.seeked();
      }
      oldCurrentTime = event.detail.currentTime;
      console.log(app.globalData.currentTime);
    }

  },
  playVideo: function (e) {
    VOD.initMediaEvent.play();
    VOD.initMediaEvent.playing();
  },
  pauseVideo: function (e) {
    VOD.initMediaEvent.pause();
  },
  endVideo: function (e) {
    VOD.initMediaEvent.ended();
  },
  onUnload: function (e) {
    VOD._open_.refresh();
  }

})