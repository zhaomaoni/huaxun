module.exports = { 
  getInfo: getInfo
}
function getInfo(code, success, fail){
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
      if(success){
        success(res)
      }
    },
    fail: function (res) {
      if (fail) {
        fail(res)
      }else{
        wx.showToast({
          title: "请求服务器错误",
          icon: 'none',
          duration: 2000
        })
      }
     }
  })
}