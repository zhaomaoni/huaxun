import * as echarts from '../../ec-canvas/echarts';
var util = require("../../utils/util.js")

Page({
  data: {
    ecBar: {
      lazyLoad: true // 延迟加载
    },
    ecBarLine: {
      lazyLoad: true // 延迟加载
    },
    ecLine: {
      lazyLoad: true // 延迟加载
    },
    ecK: {
      lazyLoad: true // 延迟加载
    },
    code:0,
    name:"",
    price: "",
    showAd: false,
    down:"",
    list1: [],
    list2: [],
    list3: [],
    list4: [],
    kList:[],
    info:"",
    content:"",
    contents:"",
    heigth:"300%"
  },
  onLoad(opt) {
    var costPrice = opt.costPrice
    var nowPrice = opt.price
    var num = opt.code;
    var isClick1 = opt.isClick1;
    var isClick2 = opt.isClick2;
    var _this = this
    util.loadAd(function (showAD) {
      _this.setData({
        showAd: showAD
      });
    })
    if(costPrice > nowPrice*1.5){
      this.setData({
        contents: "既然已经被套牢,如果不是急用钱，没加杠杆，此时割肉意义已经不大。干脆趴下装死,耐心等待吧！"
      })
    } else if (costPrice < nowPrice * 1.5 && isClick2 == 1){
      this.setData({
         contents: "鉴于仓位不重,逢反弹都是减仓时机，待下跌趋势走完再回来不迟。"
      })
    } else if (costPrice < nowPrice * 1.5 && isClick2 == 2){
      this.setData({
         contents: "鉴于仓位不轻,彻底割肉出局还是挺疼的。可考虑逢反弹适当减仓,待下跌趋势走完再回来。"
      })
    }

    // if(isClick2==0){
    //   this.setData({
    //     contents:"既然已经被套牢,如果不是急用钱，没加杠杆，此时割肉意义已经不大。干脆趴下装死,耐心等待吧！"
    //   })
    // } else if (isClick2==1){ 
    //   this.setData({
    //     contents: "鉴于仓位不重,逢反弹都是减仓时机，待下跌趋势走完再回来不迟。"
    //   })
    // }else{
    //   this.setData({
    //     contents: "鉴于仓位不轻,彻底割肉出具还是挺疼的。可考虑逢反弹适当减仓,待下跌趋势走完再回来。"
    //   })
    // }

    this.chart(num)
    this.kData(num)
    this.barComponent = this.selectComponent('#mychart-dom-multi-bar');
    this.lineComponnet = this.selectComponent('#mychart-dom-multi-line');
    //this.barLineComponent = this.selectComponent('#mychart-dom-multi-barLine');
    this.kComponnet = this.selectComponent('#mychart-dom-multi-k');
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        _this.setData({
          heigth: res.windowHeight
        })
      }
      })

  },
  /* 点击banner图片跳转 */
  images: function () {
    util.ad(this.data.showAd)
  },
  chart:function(code){
    var _this = this;
    wx.request({
      url: 'https://api.51gsl.com/program/ths',
      data: {
        code: code
      },
      header: {
        Accept: "application/vnd.51gsl.v6+json"
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        var quotation = res.data.data.quotation
        var down = Number(quotation.changepercent).toFixed(2)
        var price = Number(quotation.trade).toFixed(2)
        if (down == "") {
          _this.setData({
            down: "--"
          })
        } else {
          _this.setData({
            down: down
          })
        }
        if (price == "") {
          _this.setData({
            price: "--"
          })
        } else {
          _this.setData({
            price: price
          })
        }
        var data = res.data.data
        //data.txsj.yl.info=''
        _this.setData({
          name: quotation.name,
          code: quotation.code,
          list1: data.txsj.hy,
          list2: data.txsj.jg,
          list3: data.txsj.zj,
          list4: data.txsj.yl,
          info: data.info,
          content: data.content
        })
        _this.init_bar();
        _this.init_line();
        _this.init_barLine();
        _this.init_K();
      },
      fail: function (res) { }
    })
  },
  kData:function(code){
    var _this = this;
    wx.request({
      url: 'https://api.51gsl.com/program/thsKline',
      data: {
        code:code
      },
      header: {
        Accept: "application/vnd.51gsl.v6+json"
      },
      method: 'POST',
      success: function(res) {
        _this.setData({
          kList:res.data.data
        })
      },
      fail: function(res) {}
    })
  },
  init_bar: function () {
    this.barComponent.init((canvas, width, height) => {
      // 初始化图表
      const barChart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      barChart.setOption(this.getBarOption());
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return barChart;
    });
  },
  init_line: function () {
    this.lineComponnet.init((canvas, width, height) => {
      // 初始化图表
      const lineChart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      lineChart.setOption(this.getLineOption());
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return lineChart;
    });
  },
  init_barLine: function () {
    // this.barLineComponent.init((canvas, width, height) => {
    //   // 初始化图表
    //   const barLineChart = echarts.init(canvas, null, {
    //     width: width,
    //     height: height
    //   });
    //   barLineChart.setOption(this.getBarLineOption());
    //   // 注意这里一定要返回 chart 实例，否则会影响事件处理等
    //   return barLineChart;
    // });
  },
  init_K: function () {
    this.kComponnet.init((canvas, width, height) => {
      // 初始化图表
      const KChart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      KChart.setOption(this.getKOption());
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return KChart;
    });
  },
  /* 机构预测 */
  getBarOption: function() {
    var _this = this
    //return 请求数据
    return {
      title: {
        text: _this.data.list2.title
      },
      legend: {
        data: ['净利润', '预测净利润']
      },
      grid: {
        left: '5%',
        right: '5%',
        bottom: '3%',
        top: '25%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          data: _this.data.list2.data.date
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '辅助',
          type: 'bar',
          stack: '总量',
          itemStyle: {
            itemStyle: {
              normal: {
                barBorderColor: '#7f8da9',
                color: '#db4c3c'
              },
              emphasis: {
                barBorderColor: '#db4c3c',
                color: '#7f8da9'
              }
            },
          },
          data: [0, 0, 0, 0, 0]
        },
        {
          name: 'A',
          type: 'line',
          smooth: false,
          data: _this.data.list2.data.blueLineValue,
          itemStyle: {
            normal: {
              color: '#fde18a',
            }
          }
        },
        {
          name: '利润',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: false,
              position: 'inside'
            }
          },
          data: _this.data.list2.data.yellowRectValue,
          itemStyle: {
            normal: {
              color: '#db4c3c'
            }
          }
        }
      ],
      width: "90%",
      height: 150
    };
  },
  /* 行业走势 */
  getLineOption: function () {
    var _this = this
    //return 请求数据
    return {
      title: {
        text: _this.data.list1.title
      },
      grid: {
        left: '5%',
        right: '5%',
        bottom: '3%',
        top: '25%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        axisTick: { show: false },
        data: _this.data.list1.data.date
      },
      yAxis: {},
      series: [
        {
          type: 'line',
          data: _this.data.list1.data.price,
          itemStyle: {
            normal: {
              color: '#000'
            }
          }
        },
        {
          type: 'line',
          data: _this.data.list1.data.value,
          itemStyle: {
            normal: {
              color: '#f88f47'
            }
          }
        }
      ],
      width: "90%",
      height: 150

    };
  },
  /* 资金流向 */
  getBarLineOption: function () {
    var _this = this
    //return 请求数据
    return {
      title: {
        text: _this.data.list3.title
      },
      grid: {
        left: '5%',
        right: '5%',
        bottom: '3%',
        top: '25%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        axisTick: { show: false },
        data: _this.data.list3.data.date
      },
      yAxis: {},
      series: [{
        type: 'bar',
        data: _this.data.list3.data.value,
        itemStyle: {
          normal: {
            color: '#ff6262',
            color0: '#a1e06c',
            borderWidth: 1,
            opacity: 1,
          }
        }
      },
      {
        name: 'A',
        type: 'line',
        smooth: false,
        data: _this.data.list3.data.field,
        itemStyle: {
          normal: {
            color: '#3a7cb9',
            borderWidth: 1,
            opacity: 1,
          }
        }
      }
      ],
      width: "90%",
      height: 150

    };
  },
  /* 压力位与支撑位 */
  getKOption: function () {
    var _this = this
    var min = 100000;
    for(var i= 0; i < _this.data.kList.hq.length;i++){     
      for (var j=0; j < 4;j++){
        if (min > parseFloat(_this.data.kList.hq[i][j])){
          min = parseFloat(_this.data.kList.hq[i][j]);
        }
      }
    }
    return {
      title: {
        text: _this.data.list4.title
      },
      grid: {
        left: '5%',
        right: '5%',
        bottom: '3%',
        top: '25%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        axisTick: { show: false },
        data: _this.data.kList.date
      },
      yAxis: {
        min: min - 1 > 0 ? min - 1  : min
      },
      series: [
        {
          type: 'k',
          data: _this.data.kList.hq,
          itemStyle: {
            normal: {
              color: '#ff6262',
              color0: '#a1e06c',
              // color: '#9f0ba1',
              // color0: '#0b52a1',
              borderWidth: 1,
              opacity: 1,
            }
          }
        }
      ],
      width: "90%",
      height: 150


    };
  },
  add0:function(m){return m< 10 ? '0' + m : m },
  timeFormat:function(timestamp){
    //timestamp是整数，否则要parseInt转换,不会出现少个0的情况
    var time = new Date(timestamp);
    var year = time.getFullYear();
    var month = time.getMonth() + 1;
    var date = time.getDate();
    var hours = time.getHours();
    var minutes = time.getMinutes();
    var seconds = time.getSeconds();
    return year+ '-' + this.add0(month) + '-' + this.add0(date) + ' ' + this.add0(hours) + ':' + this.add0(minutes) + ':' + this.add0(seconds);
  }
});