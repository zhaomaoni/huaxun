var getUserId = function(){
  var info = wx.getStorageSync('draw_tgw_userid') || ''
  return info;
}

var getUserToken = function () {
  var info = wx.getStorageSync('draw_tgw_token') || ''
  return info;
}

var setUserId = function(uid){
  wx.setStorageSync('draw_tgw_userid', uid)
}

var setUserToken = function (token) {
  wx.setStorageSync('draw_tgw_token', token)
}

var isLogin = function() {
  var uid = getUserId()
  if (!uid) {
    wx.navigateTo({
      url: '../login/login',
    })
    return false
  }
  return true
}

module.exports = {
  getUserId : getUserId,
  getUserToken: getUserToken,
  setUserId: setUserId,
  setUserToken: setUserToken,
  isLogin: isLogin
}