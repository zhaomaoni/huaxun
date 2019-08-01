//获取当前时间，格式YYYY-MM-DD
function getDates() {
  var date = new Date();
  var seperator1 = "-";
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate;
  return currentdate;
}
/* 获取月份 */
function oneMonth(num) {
  var now = new Date();  //获取今日日期
  var year = now.getFullYear();//getYear()+1900=getFullYear()
  var month = now.getMonth() + 1;//0-11表示1-12月
  var day = now.getDate();
  if (parseInt(month) < 10) {
    month = "0" + month;
  }
  if (parseInt(day) < 10) {
    day = "0" + day;
  }
  now = year + '-' + month + '-' + day;
  if (parseInt(month) == 1) {//如果是1月份，则取上一年的12月份
    return (parseInt(year) - 1) + '-12-' + day;
  }
  var preSize = new Date(year, parseInt(month) - 1, 0).getDate();//上月总天数
  if (preSize < parseInt(day)) {//上月总天数<本月日期，比如3月的30日，在2月中没有30  
    return year + '-' + month + '-01';
  }
  if (parseInt(month) < 10) {
   /* if (num == 36) {
      if (num == 36 && parseInt(month) == month) {
        return (parseInt(year) - 3) + '-12' + '-' + day;
      } else {
        return (parseInt(year)-3) + '-0' + (parseInt(month)) + '-' + day;
      }
    } else {*/
      return (parseInt(year) - 3) + '-0' + parseInt(month) + '-' + day;
    //}
  } else {
    return (parseInt(year) - 3) + '-' + parseInt(month) + '-' + day;
  }
}
/* 获取需要 日期的几天前 eg:2018-08-08的3天前是2018-08-05 */
function getLastSevenDays(date, num) {
  var date = date || new Date(),
    timestamp,
    newDate;
  if (!(date instanceof Date)) {
    date = new Date(date.replace(/-/g, '/'));
  }
  timestamp = date.getTime();
  newDate = new Date(timestamp - num * 24 * 3600 * 1000);
  var month = newDate.getMonth() + 1;
  month = month.toString().length == 1 ? '0' + month : month;
  var day = newDate.getDate().toString().length == 1 ? '0' + newDate.getDate() : newDate.getDate();
  return [newDate.getFullYear(), month, day].join('-');
}
module.exports = {
  getDates: getDates,
  oneMonth: oneMonth,
  getLastSevenDays: getLastSevenDays
}