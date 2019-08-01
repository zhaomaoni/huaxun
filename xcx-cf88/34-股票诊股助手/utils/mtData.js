module.exports = {
  mtData: mtData,
  getmtdata, getmtdata
}
var mt_data;

var storageKey = 'allStockList';
function searchmtdata(id) {
  var result
  if (mt_data) {
    for (let i = 0; i < mt_data.SLists.length; i++) {
      var mt = mt_data.Slists[i]
      if (mt.id == id) {
        result = mt
      }
    }
  }
  return result || {}
}
function getmtdata(code) {
  var result
  if (mt_data) {
    for (let i = 0; i < mt_data.length; i++) {
      if (mt_data[i]._C == code) {
        result = mt_data[i]
        break;
      }
    }
  }
  return result || {}
}

function mtData(callback, isForce) {
  if (!isForce) {
    try {
      mt_data = wx.getStorageSync(storageKey);
      if (mt_data) {
        callback(mt_data);
        return;
      }
    } catch (e) {
    }
  }
  if (isForce || !mt_data) {
    wx.request({
      url: 'https://api.51gsl.com/api/js-stocklist',
      method: 'GET',
      async: true,
      header: {
        'Accept': 'application/vnd.51gsl.v1.1+json',
      },
      success: function (std) {
        mt_data = std.data;
        wx.setStorageSync(storageKey, mt_data);
        callback(mt_data);
      }
    })
  }

}

