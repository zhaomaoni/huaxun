var banPic = "";
var banner = function(){
  wx.request({
    url: 'https://api.51gsl.com/program/advet',
    data: { type: 2 },
    method: "POST",
    header: {
      'content-type': 'application/json',
      "Accept": "application/vnd.51gsl.v6+json"
    },
    success: function (res) {
      banPic = res.data.imageUrl;
      wx.setStorageSync({
        key: 'key',
        data: {
          banPic: banPic
        }
      })
      console.log(banPic);
    }
  })
  
  
  return banPic
}
module.exports = {
  banner: banner
}