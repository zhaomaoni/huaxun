const config = {	
  tgwUrl:{
    apiUrl: 'https://oauth.cf8.cn/MiniPro/m/web/', //端口域名
    infoUrl: "?r=lottery/lottery/info",           //获取当前抽奖活动详情及奖品 转盘上的数据
    codeUrl: "?r=lottery/user/code",              //获取验证码
    loginUrl:"?r=lottery/user/login",             //登录验证
    chanceUrl: "?r=lottery/user/get-chance",      //领取新用户免费赠送的机会
    lotteryUrl: "?r=lottery/lottery/lottery",     //用户抽奖
    inviteUrl: "?r=lottery/invite/invite",        //获取用户邀请列表
    resultUrl: "?r=lottery/lottery/result",       //大奖纪录
    shareUrl:"?r=lottery/invite/share",           //分享
    reduceUrl: "?r=lottery/lottery/reduce",       //读取全部中奖纪录
    allreduceUrl:"?r=lottery/lottery/all-reduce",
  }
  
}
module.exports = config;