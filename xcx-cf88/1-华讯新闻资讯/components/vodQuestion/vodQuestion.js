// components/question/question.js
const app = getApp();
Component({
    /**
    * 组件的属性列表
    */
    properties: {
        lheight:{
            type: String,
            value: ''
        }
    },

    /**
    * 组件的初始数据
    */
    data: {
        scrollTop: 0,//滚动的高度
        condition: false,//是否有问答
        allList: [],//所有问答
        showR1: false,
        showR2: false
    },
    ready: function(){
        var that = this;
        var qaid_old = [];
        this.channel = app.globalData.channel;
        // var query = wx.createSelectorQuery().in(that).select('#qa-box').boundingClientRect();

        //收到问答
        this.channel.bind("onQAList", function(e){
            console.log("收到问答消息");
            let qaDatas = e.data, qaList = qaDatas.list, all = that.data.allList, showR2 = that.data.showR2;
            
            for(let i = 0; i < qaList.length; i++){
                let qid = qaList[i].id.split('_')[0];
                let inold = that.qaid_in(qaid_old, qid);
                var date;
                if(qaList[i].answerBy.length > 8){
                    qaList[i].answerBy = qaList[i].answerBy.substring(0, 8) + '...';
                }
                if(qaList[i].submitor.length > 8){
                    qaList[i].submitor = qaList[i].submitor.substring(0, 8) + '...';
                }
                if(inold && !qaList[i].answer) break; 
                if(!inold && qaList[i].answer){
                    qaList[i].reply = false;
                    qaid_old.push(qid);

                    date = new Date(parseInt(qaList[i].submitTime) * 1000);
                    var hours = date.getHours(), minutes = date.getMinutes(), seconds = date.getSeconds();
                    qaList[i].time = that.numTen(hours) + ":" + that.numTen(minutes) + ":" + that.numTen(seconds);
                    all.push(qaList[i]);

                    var newObj = {};
                    for(var k in qaList[i]){
                        newObj[k] = qaList[i][k];
                    }
                    newObj.reply = true;
                    all.push(newObj);
                    continue;
                } else if(!inold){
                    qaid_old.push(qid);
                    qaList[i].reply = false;
                    date = new Date(parseInt(qaList[i].submitTime) * 1000);
                } else {
                    qaList[i].reply = true;
                    date = new Date(parseInt(qaList[i].answerTime) * 1000);
                }

                var hours = date.getHours(), minutes = date.getMinutes(), seconds = date.getSeconds();
                qaList[i].time = that.numTen(hours) + ":" + that.numTen(minutes) + ":" + that.numTen(seconds);

                all.push(qaList[i]);
            }
            
            if(all.length > 0){
                that.setData({
                    allList: all,
                    condition: true
                })
                // query.exec(function(res){
                //     if(res[0]){
                //         that.setData({
                //             scrollTop: res[0].height
                //         })
                //     }
                // });
            }

            if(qaDatas.more == 'false' && !showR2){
                that.setData({
                    showR1: false,
                    showR2: true
                });
            } else {
                that.setData({
                    showR1: true,
                    showR2: false
                });
            }
            
        });

        //某条问题语音回复状态
        // this.channel.bind("onTagAudio", function(e){
        //     console.log("已加入语音回复列表");
        //     var id = e.data.id;
        //     that.qaStatus(id, 1);
        // });

        // this.channel.bind("onQAHighlight", function(e){
        //     console.log("语音回复中");
        //     var id = e.data.id;
        //     that.qaStatus(id, 2);
        // });

        // this.channel.bind("onCancelHighlight", function(e){
        //     console.log("语音已回复");
        //     var id = e.data.id;
        //     that.qaStatus(id, 3);
        // });

        // this.qaStatus = function(id, typeNum){
        //     var all = that.data.allList;
        //     for(var i = 0; i < all.length; i++){
        //         if(all[i].id == id && !all[i].reply){
        //             all[i].ansVoice = typeNum;
        //         }
        //     }
        //     for(var k = 0; k < mine.length; k++){
        //         if(mine[k].id == id && !mine[k].reply){
        //             mine[k].ansVoice = typeNum;
        //         }
        //     }

        //     if(isSelf){
        //         that.setData({
        //             allList: all,
        //             showList: mine,
        //             meList: mine
        //         });
        //     } else {
        //         that.setData({
        //             allList: all,
        //             showList: all,
        //             meList: mine
        //         });
        //     }
        // }


        // this.checkClear = function(){
        //     let all = that.data.allList, flag = false;
        //     for(var k in all){
        //         if(all[k].unMove){
        //             flag = true;
        //             break;
        //         }
        //     }

        //     that.setData({
        //         condition: flag
        //     })
        // }

        this.numTen = m=>{
            return m>9?m:'0'+m;
        }
        this.qaid_in = function(arr, id){
            if(arr == 0){
                return false;
            }else{
                for(var i in arr){
                    if(arr[i]==id){
                        return true;
                    }
                }
                return false;
            }
        }
        
    },
    /**
    * 组件的方法列表
    */
    methods: {
        lower: function(e){
            let that = this, showR1 = that.data.showR1, showR2 = that.data.showR2;
            if(showR2){
                return false;
            }
            if(!showR1 && !showR2){
                that.setData({
                    showR1: true
                });
            }
            that.channel.send("submitQAList", {});
        }
    }
})
