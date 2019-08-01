var tgwapi = require("tgwapi.js")
var search = require("search.js")
module.exports.tgwapi = function(isStop){
  if (isStop){
    return ;
  }
  //test api
  var userId = '99000183'
  var data = {
    userid: userId
  }

    /**
     * 股票代码
     */
    // tgwapi.getRequestPlay('ReqSecucodeList', function (res) {
    //   console.log(res)
    // })

    /**
     * 用户参赛记录列表
     */
    // tgwapi.getRequestPlay({ apiName: 'SecucodeplayUserjoinList', userId: userId}, function (res) {
    //   console.log(res)
    // })

    /**
     * 用户信息详细
     */
    // tgwapi.getRequestPlay({ apiName: 'UserDetails', userId: userId }, function (res) {
    //   console.log(res)
    // })

    /**
     * 活动详情
     */
    // tgwapi.getRequestPlay( 'activeDetails', function (res) {
    //   console.log(res)
    // })

    /**
     * 返回 errCode 500
     */
    // tgwapi.addUser(data,function (res) {
    //   console.log(res)
    // });

    /**
     * 现金收益排名列表
     */
    // tgwapi.getRequestPlay('bounslist',function(res){
    //   console.log(res)
    // })


    /**
     * 获取redis中前50名名额
     */
    // tgwapi.getRequestPlay('getBefore50Rankings',function(res){
    //   console.log(res)
    // })

    /**
     * 奖品列表
     */
    // tgwapi.getRequestPlay('getGiftList', function (res) {
    //   console.log(res)
    // })

    /**
     * 获取礼物列表
     */
    // tgwapi.getRequestPlay('getSecucodeplayGiftget', function (res) {
    //   console.log(res)
    // })

    /**
     * uodate
     */
    // tgwapi.getRequestPlay('updatemoney', function (res) {
    //   console.log(res)
    // })


    /**
     * 继续挑战
     */
    // tgwapi.postRequestPlay('continueChallenge?userid='+userId,null, function (res) {
    //   console.log(res)
    // })


    /**
     * 兑奖
     */
    // tgwapi.postRequestPlay('exchangegift?userid=' + userId, null, function (res) {
    //   console.log(res)
    // })

    /**
     * 复活
     */
    // tgwapi.postRequestPlay('resurrection?userid=' + userId,null , function (res) {
    //   console.log(res)
    // })


    /**
     * 提交股票接口
     * 非法状态
     */
    data = {
      userid : userId,
      periods : 1,
      secucodelist : [
        {
          secucode : '002460',
          secucodename : '赣锋锂业',
          market : 'SZ' // SH
        }
      ]
    }
    // tgwapi.postRequestPlay('submitsecucode?userid=' + userId, data, function (res) {
    //   console.log(res)
    // })

    /**
     * 当前用户参赛详情 
     */
    // tgwapi.postRequestPlay('usergamedetail?userid=' + userId, null, function (res) {
    //   console.log(res)
    // })
  var phone = '13141469448';
  var type = 2;
  // tgwapi.identifyCodeAcquire(phone,type,function(res){
      // console.log(res)
      // if (res.data.errcode == 0) {
      //   console.log('发送成功')
      // } else {
      //   console.log('发送失败')
      // }
  // });
  // tgwapi.identifyCodeVerify(phone,type,'188738',function(res){
  //   console.log(res.data)
  //   if(res.data.errcode==0){
  //     console.log('验证成功')
  //   }else{
  //     console.log('验证失败')
  //   }
  // });

  // var headimgurl = 'https://upload.jianshu.io/users/upload_avatars/2549236/ba6fa2a6-7fae-4a30-9e0f-a21be13215c2.jpg?imageMogr2/auto-orient/strip|imageView2/1/w/120/h/120'
  // tgwapi.userLogin(phone, 'unionid', 'openid', '无名', headimgurl, function (res) {
  //   console.log(res.data)
  //   if (res.data.errcode == 0) {
  //     console.log('成功')
  //   } else {
  //     console.log('失败')
  //   }
  // });
}

module.exports.search = function (isStop) {
  if (isStop) {
    return;
  }
  //search.initData();
  search.search("00");
  search.search("60");
}