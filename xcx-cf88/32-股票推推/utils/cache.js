function put(k, v, t) {
  wx.setStorageSync(k, v)
  var seconds = parseInt(t);
  if (seconds > 0) {
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000 + seconds;
    wx.setStorageSync(getExpirKey(k), timestamp + "")
  } else {
    wx.removeStorageSync(getExpirKey(k))
  }
}
function get(k, def) {
  var deadtime = parseInt(wx.getStorageSync(getExpirKey(k)))
  if (deadtime) {
    if (parseInt(deadtime) < Date.parse(new Date()) / 1000) {
      if (def) { return def; } else { return; }
    }
  }else{
    if (def) { return def; } else { return; }
  }
  var res = wx.getStorageSync(k);
  if (res) {
    return res;
  } else {
    return def;
  }
}
function getExpirKey(k){
  return k + '_expiration'
}
module.exports = {
  put: put,
  get: get,
}