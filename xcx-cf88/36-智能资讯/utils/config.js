const config = {
  dataList: {
    apiUrl : 'https://api.tgw360.com/recommender/', //端口域名
    news : "news",          //推荐接口
    historys : "history",   //历史推荐接口
    action: "action"        //用户行为接口
  },
  details:{
    apiBaseUrl: "https://api.51gsl.com/tgwapi",
    // url: "http://www.tgw99.cn/tgwapi/myapp/News/getNewsDetail",
    url: "www.tgw360.com/tgwapi/myapp/News/getNewsDetail",  //详情
    url2:"www.tgw360.com/tgwapi/myapp/News/Comment_list",  //评论列表
    url3:"www.tgw360.com/tgwapi/myapp/News/NewsPraise",   //点赞
    types: "POST",
  },
  logins:{
    apiUrl:"https://api.tgw360.com/oauth-service",
    pwd:"/oauth/token?grant_type=password"
  },
  
}
module.exports = config;
