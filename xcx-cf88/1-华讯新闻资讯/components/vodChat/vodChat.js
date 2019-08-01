const app = getApp();
Component({
    /**
    * 组件的属性列表
    */
    properties: {
        lheight: {
            type: String,
            value: ''
        }
    },

    /**
    * 组件的初始数据
    */
    data: {
        allMessage: [],//所有聊天
        condition: false,//是否有聊天
        scrollTop: 0,//滚动的高度
        showR1Text: '点击加载更多',//显示文字
        showR1: false,
        showR2: false
    },
    ready: function(){
        var that = this;
        this.flag = false;
        var query = wx.createSelectorQuery().in(that).select('#chat-page').boundingClientRect(), firstIn = true;
        this.channel = app.globalData.channel;
        // 收到聊天消息
        this.channel.bind("onChat", res=>{
            console.log("收到聊天信息");
            var data = res.data.list;
            that.analysisMess(data, 0);
        });

        //收到历史聊天
        // this.channel.bind("onChatHistory", res=>{
        //     console.log("收到历史聊天");
        //     let data = res.data, showR2 = that.data.showR2, list = data.list;
        //     if(showR2){
        //         return false;
        //     }
        //     for(let k = 0; k < list.length; k++ ){
        //         that.analysisMess(list[k]);
        //     }
        //     if(!data.more && !showR2){
        //         that.setData({
        //             showR1: false,
        //             showR2: true
        //         });
        //     }
        // });

        //收到更多聊天
        this.channel.bind("onChatSegmentList", res=>{
            console.log("收到更多聊天");
            let data = res.data, showR2 = that.data.showR2, list = data.list;
            if(showR2){
                return false;
            }
            that.analysisMess(list, 1);
            if(!data.more && !showR2){
                that.setData({
                    showR1Text: '点击加载更多',
                    showR1: false,
                    showR2: true
                });
            } else {
                that.setData({
                    showR1Text: '点击加载更多'
                });
            }
        });

        this.analysisMess = function (data, type){
            var showR1 = that.data.showR1, showR2 = that.data.showR2, allMess = that.data.allMessage, lheight = parseInt(that.data.lheight);
            if(type == 0){
                for(var i = 0; i < data.length; i++){
                    var msg = data[i];
                    var role = msg.senderRole.split(","), roleVal = 0;
                    for(var s = 0; s < role.length; s++){
                        roleVal += parseInt(role[s]);
                    }
                    roleVal = roleVal == 0 ? undefined: roleVal;

                    if(msg.sender.length > 8){
                        msg.sender = msg.sender.substring(0, 8) + '...'
                    }
                    var obj = {
                        type: 'public',
                        talkerId: msg.senderId,
                        talkerName: msg.sender,
                        senderRole: roleVal,
                        msg: msg.content
                    };

                    var date = new Date(msg.submitTime);
                    var hours = date.getHours(), minutes = date.getMinutes(), seconds = date.getSeconds();
                    obj.time = this.numTen(hours) + ":" + this.numTen(minutes) + ":" + this.numTen(seconds);

                    allMess.push(obj);
                }
            } else {
                for(var i = data.length - 1; i > -1; i--){
                    var msg = data[i];
                    var role = msg.senderRole.split(","), roleVal = 0;
                    for(var s = 0; s < role.length; s++){
                        roleVal += parseInt(role[s]);
                    }
                    roleVal = roleVal == 0 ? undefined: roleVal;

                    if(msg.sender.length > 8){
                        msg.sender = msg.sender.substring(0, 8) + '...'
                    }
                    var obj = {
                        type: 'public',
                        talkerId: msg.senderId,
                        talkerName: msg.sender,
                        senderRole: roleVal,
                        msg: msg.content
                    };

                    var date = new Date(msg.submitTime);
                    var hours = date.getHours(), minutes = date.getMinutes(), seconds = date.getSeconds();
                    obj.time = this.numTen(hours) + ":" + this.numTen(minutes) + ":" + this.numTen(seconds);

                    allMess.unshift(obj);
                }
            }
            
            

            that.setData({
                allMessage: allMess,
                condition: true
            });

            //聊天滑动到最下面
            // if(type == 0||){
                query.exec(res=>{
                    // if(lheight < res[0].height && !showR1 && !showR2){
                    //     that.setData({
                    //         showR1: true,
                    //         scrollTop: res[0].height
                    //     })
                    // } else {
                        that.setData({
                            scrollTop: res[0].height
                        });
                    // }
                    
                })
            // }
            that.flag = false;
            
        };

        this.numTen = m=>{
            return m>9?m:'0'+m;
        }


    },
    /**
    * 组件的方法列表
    */
    methods: {
        toUpper: function(e){
            if(this.flag){
                return false;
            }
            this.flag = true;
            this.setData({
                showR1Text: '正在加载中···'
            });
            this.channel.send("submitChatSegment", {});
        },
        refreshChat: function(e){
            this.setData({
                allMessage: [],
                showR1: true,
                showR2: false
            });
        },
        reset: function(){
            this.setData({
                condition: false,
                allMessage: [],
                showR1Text: '点击加载更多',
                showR1: false,
                showR2: false
            });
        }
    },
    onUnload: function(){
        this.setData({
            showR1Text: '点击加载更多',
            showR1: false,
            showR2: false
        });
    }
})
