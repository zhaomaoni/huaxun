// 定义数据格式
//var Slist = require('../components/mtData.js')
/***
 * 
 * "wxSearchData":{
 *    configconfig:{
 *      style: "wxSearchNormal"
 *    },
 *    view:{
 *      hidden: true,
 *      searchbarHeght: 20
 *    }
 *    keys:[],//自定义热门搜索
 *    his:[]//历史搜索关键字
 *    value
 * }
 * 
 * 
 */
var __keysColor = [];
var __mindKeys;
var __dataStr;
var __preText;
function initColors(colors){
    __keysColor = colors;
}
function initMindKeys(keys){
    __mindKeys = keys;
}
function getData(){
  return this.__mindKeys;
}
function init(that, barHeight, keys, isShowKey, isShowHis, callBack) {
  initMindKeys(keys);
    var temData = {};
    var view = {
        barHeight: barHeight,
        isShow: false
    } 
    if(typeof(isShowKey) == 'undefined'){
        view.isShowSearchKey = true;
    }else{
        view.isShowSearchKey = isShowKey;
    }
    if(typeof(isShowHis) == 'undefined'){
        view.isShowSearchHistory = true;
    }else{
        view.isShowSearchHistory = isShowHis;
    }
    //temData.keys = keys;
    // console.log(keys)
    var i = 0;
    var length = keys.length;
    for (; i < length; i++) {
      __dataStr += "{" + keys[i]._C + "/" + keys[i]._S + "/" + keys[i]._N + "}";
    }
    wx.getSystemInfo({
        success: function(res) {
            var wHeight = res.windowHeight;
            view.seachHeight = wHeight-barHeight;
            temData.view = view;
            that.setData({
                wxSearchData: temData
            }); 
        }
    })
    if (typeof (callBack) == "function") {
        callBack();
    }
    //getHisKeys(that);
}


function grep(elems, callback, inv) {
  console.log(elems)
  var retVal,
    ret = [],
    i = 0,
    length = elems.length;
  inv = !!inv;
  // Go through the array, only saving the items
  // that pass the validator function
  for (; i < length; i++) {
    retVal = !!callback(elems[i], i);
    if (inv !== retVal) {
      ret.push(elems[i]);
    }
  }
  return ret;
}
function wxSearchInput_exec(e, that, callBack){
  var temData = that.data.wxSearchData;
  var text = e.detail.value;
  var mindKeys = [];
  var result = [];
  if (typeof (text) == "undefined" || text.length == 0) {

  } else {
    var regstr = "({" + text + ".*?})";
    var matcher = new RegExp(regstr, "ig");
    var maxLength = 10;
    var index = 0;
    __dataStr.replace(matcher, function (m) {
      index++;
      if (index > maxLength) {
        return;
      }
      m.replace(/\{(.*?)\/(.*?)\/(.*?)\}/i, function (a, b, c, d) {
        result.push({
          _C: b,
          _S: c.toUpperCase(),
          _N: d
        });
      });
    });
  }
  temData.value = text;
  temData.mindKeys = result;
  that.setData({
    wxSearchData: temData
  });
}
function wxSearchInput(e, that, callBack){
  var text = e.detail.value;
  __preText = text;

  wxSearchInput_exec(e, that, callBack)
  // setTimeout(function(){
  //   wxSearchInput_exec(e, that, callBack)
  // },500);
}


function wxSearchFocus(e, that, callBack) {     //获取焦点时出发事件
  //console.log('Focus') 
    var temData = that.data.wxSearchData;
    temData.view.isShow = true;
    that.setData({
        wxSearchData: temData
    });
    //回调
    if (typeof (callBack) == "function") {
        callBack();
    }
    // if(typeof(temData) != "undefined"){
    //   temData.view.hidden= false;
    //   that.setData({
    //     wxSearchData:temData
    //   });
    // }else{

    // }
}
function wxSearchBlur(e, that, callBack) {    //失去焦点时出发的事件
  //console.log('blue')
    // var temData = that.data.wxSearchData;
    // temData.value = e.detail.value;
    // that.setData({
    //     wxSearchData: temData
    // });
    // if (typeof (callBack) == "function") {
    //     callBack();
    // }
  var temData = that.data.wxSearchData;
  temData.view.isShow = true;
  that.setData({
    wxSearchData: temData
  });
}

function wxSearchHiddenPancel(that){
  //console.log('wxSearchHiddenPancel')
    var temData = that.data.wxSearchData;
    temData.view.isShow = false;
    that.setData({
        wxSearchData: temData
    });
}

function wxSearchKeyTap(e, that, callBack) {
  //console.log('wxSearchKeyTap')
  wxSearchInput
    //回调
    var temData = that.data.wxSearchData;
    temData.value = e.target.dataset.code;
    that.setData({
        wxSearchData: temData
    });
    if (typeof (callBack) == "function") {
        callBack();
    }
    console.log(e.target.dataset.code)
}

module.exports = {
    init: init,
    initColor: initColors,
    initMindKeys: initMindKeys,
    wxSearchInput: wxSearchInput,
    wxSearchFocus: wxSearchFocus,
    wxSearchBlur: wxSearchBlur,
    wxSearchKeyTap: wxSearchKeyTap,
    // wxSearchAddHisKey:wxSearchAddHisKey,
    // wxSearchDeleteKey:wxSearchDeleteKey,
    // wxSearchDeleteAll:wxSearchDeleteAll,
    wxSearchHiddenPancel:wxSearchHiddenPancel
}