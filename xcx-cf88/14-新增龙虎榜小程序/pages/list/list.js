// pages/list/list.js
Page({
  /** 页面的初始数据 */
  data: {
    groups: [{
      groupName: 'A',
      users: { "80084302": "安信证券","80000199":"爱建证券"}
    },
    {
      groupName: 'B',
      users: {"80000180":"渤海证券"}
    },
    {
      groupName: 'C',
      users: {
        "80000033": "长城国瑞证券", "10001081": "长江证券", "80000082": "长城证券", 
        "80048595": "财通证券", "80000140": "财富证券", "80000165": "财达证券", 
        "80000204":"川财证券"
      }
    },
    {
      groupName: 'D',
      users: {
        "80000002": "大同证券", "80114781": "东兴证券", "80000091": "东方证券", 
        "80000031": "东吴证券", "80000081": "东莞证券", "80000069": "东海证券", 
        "10001005": "东北证券", "80000217": "德邦证券", "80000083": "第一创业", 
        "80000145": "大通证券", "80000126":"东方财富证券"
      }
    },
    {
      groupName: 'F',
      users: { "80000068":"方正证券"}
    },
    {
      groupName: 'G',
      users: {
        "80000214": "国盛证券", "10001075": "广发证券", "80000074": "光大证券", 
        "80000007": "国信证券", "80000123": "国泰证券", "10001043": "国元证券", 
        "80000004": "广州证券", "10000082": "国金证券", "80000095": "国都证券", 
        "80000028": "国联证券", "10001055": "国海证券", "80000113": "国开证券", 
        "80050841": "国融证券", "80056613":"高华证券"
      }
    },
    {
      groupName: 'H',
      users: {
        "80000156": "华龙证券", "80000073": "华泰证券", "10000786": "海通证券", 
        "80000048": "华西证券", "80000065": "华福证券", "80000064": "华安证券", 
        "80000045": "恒泰证券", "80000057": "红塔证券", "80000084": "华林证券", 
        "80000202": "华创证券", "80000049": "华鑫证券", "80000208": "华宝证券", 
        "80000150": "宏信证券", "80092743": "华融证券", "80000134": "华金证券", 
        "80000213":" 恒泰长财证券"
      }
    },
    {
      groupName: 'J',
      users: { "80050805": "江海证券", "80000189": "金元证券", "80042949": "九州证券", "80397898":"金通证券"}
    },
    {
      groupName: 'K',
      users: {"80000162":"开源证券"}
    },
    {
      groupName: 'L',
      users: { "80036123": "联储证券", "80000118":"联讯证券"}
    },
    {
      groupName: 'M',
      users: { "80000147": "民族证券", "80000038":"民生证券"}
    },
    {
      groupName: 'N',
      users: {"80000051":"南京证券"}
    },
    {
      groupName: 'P',
      users: {"80000037":"平安证券"}
    },
    {
      groupName: 'R',
      users: { "80086668": "瑞银证券","80121898":"瑞信证券"}
    },
    {
      groupName: 'S',
      users: {
        "80404498": "申万宏源西部证券", "80000080": "山西证券", "80000155":"上海证券", 
        "80404011": "申万宏源证券", "80000181": "世纪证券", "80000122":"首创证券", 
        "80038496": "上海华信证券", "80490040":"申港证券"
      }
    },
    {
      groupName: 'T',
      users: {"80050806": "太平洋","80000124":"天风证券"}
    },
    {
      groupName: 'W',
      users: { "80000133": "五矿证券", "80000205": "万和证券", "80000187": "万联证券", "80049237":"网信证券"}
    },
    {
      groupName: 'X',
      users: { "10000296": "西南证券", "80045894": "新时代证券", "80092742": "信达证券", "80000076": "湘财证券", "80000067": "兴业证券", "80000139":"西部证券"}
    },
    {
      groupName: 'Y',
      users: { "80000085": "英大证券","80083964":"银泰证券"}
    },
    {
      groupName: 'Z',
      users: { 
        "80066058": "中信建投", "80000135": "中国证券", "10000018": "中信证券", 
        "80000012": "招商证券", "80000218": "中原证券", "80066522":"中投证券", 
        "80000206": "浙商证券", "80000200": "中银国际证券官方网", "80000003":"中山证券", 
        "80016241": "中金证券", "80000157": "中泰证券", "80000197":"中航证券", 
        "80000063": "中信证券（山东）", "80036717": "中邮证券", "80038332":"中天证券"
      }
    }]
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    //console.log(this.data.groups)
  },
  /* 跳转 */
  jump: function (e) {
    var code = e.currentTarget.dataset.keys;
    var text = e.currentTarget.dataset.text;
    wx.navigateTo({
      url: '../listMain/listMain?code=' + code+"&text="+text,
    })
  },
  /* 生命周期函数--监听页面初次渲染完成 */
  onReady: function () {},
  /* 生命周期函数--监听页面显示 */
  onShow: function () {},
  /* 生命周期函数--监听页面隐藏 */
  onHide: function () {},
  /** 生命周期函数--监听页面卸载 */
  onUnload: function () {},
  /* 页面相关事件处理函数--监听用户下拉动作 */
  onPullDownRefresh: function () {},
  /** 页面上拉触底事件的处理函数 */
  onReachBottom: function () {},
  /** 用户点击右上角分享 */
  onShareAppMessage: function () {}
})