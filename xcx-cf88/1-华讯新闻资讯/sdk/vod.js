/**
 *gsvod.js
 *2018-04-08 by alex
 */
var app = getApp();
var GSSDK = require("./gssdk.js");

var GS = GSSDK.GS;
var tool = GSSDK.tool;
var Parser = GSSDK.DOMParser;

var GS_MEDIA = {};
var tasks;
var scType = "";
var channel = null;
var wgid;
var xmlUrl = "";
var protocolPrex = "http://";
var onlyLogin = "0";
var alb = "";
var backAlb = "";
var wxxApi = "";
var vodInfo = {
  containerId: "",
  xmlUrl: "",
  protocolPrex: "http://",
  sslSupport: false,
  siteId: 0,
  userId: 0,
  userName: "",
  confId: "",
  hostId: 0,
  tid: "",
  sc: "sc=0",
  onlyLogin: "0",
  alb: "",
  backAlb: "",
  xmlApi: "",
  albProxy: "",
  video: true
};


var recordInfo = {
    hls: "",
    highHls: "",
    hlsAudioOnly: "",
    duration: "",
    liveTextFile: "",
    jsContent: "",
    playing: false,
    voteSurveyList: new Array(),
    lotteryArray: new Array(),
    layoutArray: new Array(),
    docArray: new Array()
};
var serverParam = {
    sessionId: "",
    currentAlb: "",
    startTime: 0,
    lastTime: 0,
    watchMaxDuration: 0,
    keepTimeId: 0,
    keepInterval: 10000
};
var TASK_TYPE = {
    PPT: "gensee_task_ppt",
    VOTE: "gensee_task_vote",
    LOTTERY: "gensee_task_lottery",
    LAYOUT: "gensee_task_layout",
    CHAT: "gensee_task_chat",
    ANNOTATION: "gensee_task_annotation"
}

//多媒体相关信息
var mediaInfo = {
    media: null,
    visitUrl: "",
    videoUrl: "",
    audioUrl: "",
    lowVideoUrl: ""
};
//数据状态
var eventConfig = {
    firstPlay: true,
    firstCanPlay: true,
    canPlay: false,
    seeking: false
};
//异步聊天
var synChat = {
    startTime: "",
    duration: "",
    chatMainFile: "",
    chatList: [],
    requestedData: {},
    lastTime: 0,
    chathisData: [],
    chatData: [],
    currentTime: 0,
    xmlChat: false,
    sliceStartTime: 0,
    sliceEndTime: 0,
    chatSync: false,
    allHisFirst: true,
    allLastSeekTime: 0,
    playTime: 0
}
//标注
var pptRecord = {
    is_pptRecord: 0,
    record_max_time: 0,
    record_jsanno: [],
    record_jsanno_old: {},
    record_MainAnno: '',
    hasAnno: false,
    pageRecordInfo: []
};


/*
*task start
*/
var task = function (opt) {
    // this.media = opt.media;
    this.taskArray = new Array();
    this.taskFunction = new Array();
    this.defaultOpt = {
        interval: 500,
        deviations: 550,
        status: false
    };
    this.timeOutObj = null;
    this.dealTask = false;
    this.i = 0;
    var that = this;
    this.timeOut = function () {
        that.dealTask = true;
        // var media = that.media;
        var taskArray = that.taskArray;
        var taskFunction = that.taskFunction;
        if (taskArray.length > 0) {
            var updateTime = app.globalData.currentTime * 1000;
            if (updateTime >= 0) {
                for (var i = 0; i < taskArray.length; i++) {
                    var task = taskArray[i];
                    if (task.deal == "usual") {
                        if (tool.isEmpty(task.startTime)) {
                            var taskType = task.type;
                            for (var j = 0; j < taskFunction.length; j++) {
                                var taskFun = taskFunction[j];
                                if (taskFun.type == taskType) {
                                    taskFun.startFun.call(this, task.data);
                                    break;
                                }
                            }
                            taskArray.splice(i, 1);
                            i--;
                        } else {
                            if (dealDeviationsTime(updateTime, task.startTime, that.defaultOpt.deviations)) {
                                if (tool.isEmpty(task.startTimeDeal) || (!task.startTimeDeal)) {
                                    var taskType = task.type;
                                    for (var j = 0; j < taskFunction.length; j++) {
                                        var taskFun = taskFunction[j];
                                        if (taskFun.type == taskType) {
                                            task.startTimeDeal = true;
                                            taskFun.startFun.call(this, task.data);
                                            break;
                                        }
                                    }
                                    if (!task.forever) {
                                        taskArray.splice(i, 1);
                                        i--;
                                    }
                                }
                            } else {
                                task.startTimeDeal = false;
                            }
                            if (!tool.isEmpty(task.endTime)) {
                                if (dealDeviationsTime(updateTime, task.endTime, that.defaultOpt.deviations)) {
                                    var taskType = task.type;
                                    if (tool.isEmpty(task.endTimeDeal) || (!task.endTimeDeal)) {
                                        for (var j = 0; j < taskFunction.length; j++) {
                                            var taskFun = taskFunction[j];
                                            if (taskFun.type == taskType) {
                                                task.endTimeDeal = true;
                                                taskFun.startFun.call(this, task.data);
                                                break;
                                            }
                                        }
                                    }
                                } else {
                                    task.endTimeDeal = false;
                                }
                            }
                        }
                    } else if (task.deal == "between") {
                        if (updateTime >= task.startTime && updateTime <= task.endTime || (updateTime >= task.startTime && tool.isEmpty(task.endTime))) {
                            if (!task.deal_all) {
                                var taskType = task.type;
                                for (var j = 0; j < taskFunction.length; j++) {
                                    var taskFun = taskFunction[j];
                                    if (taskFun.type == taskType) {
                                        task.deal_all = true;
                                        taskFun.startFun.call(this, task.data);
                                        break;
                                    }
                                }
                                if (!task.forever) {
                                    taskArray.splice(i, 1);
                                    i--;
                                }
                            }
                        } else {
                            task.deal_all = false;
                        }
                    } else {
                        var result = task.fun.call(this, task.data);
                        if (result) {
                            taskArray.splice(i, 1);
                            i--;
                        }
                    }
                }
            }
        }
        that.dealTask = false;
    }
};
task.prototype.switchMedia = function (meida) {
    this.media = media;
};
task.prototype.setInterval = function (intervalTime) {
    var that = this;
    if (!this.dealTask) {
        this.defaultOpt.interval = intervalTime;
        if (this.defaultOpt.status) {
            clearInterval(this.timeOutObj);
            this.timeOutObj = setInterval(function () {
                that.timeOut();
            }, this.defaultOpt.interval);
        }
        return true;
    }
    return false;
};
task.prototype.start = function () {
    var that = this;
    if (!this.defaultOpt.status) {
        this.timeOutObj = setInterval(function () {
            that.timeOut();
        }, this.defaultOpt.interval);
        this.defaultOpt.status = true;
    }
};
task.prototype.stop = function () {
    if (!this.dealTask) {
        clearInterval(this.timeOutObj);
        this.defaultOpt.status = false;
        this.timeOutObj = null;
        return true;
    } else {
        return false;
    }
};
task.prototype.addTaskFunction = function (type, startFun, endFun) {
    var taskFunction = this.taskFunction;
    if (tool.isEmpty(type)) {
        return false;
    }
    if (!tool.isFunction(startFun)) {
        return false;
    }
    var taskFun = {type: type, startFun: startFun};
    if (!tool.isFunction(endFun)) {
        taskFun.endFun = function () {

        };
    } else {
        taskFun.endFun = endFun;
    }
    taskFunction.push(taskFun);
    return true;
};
task.prototype.clear = function() {
    this.taskArray = new Array();
    this.taskFunction = new Array();
    this.defaultOpt = {
        interval: 500,
        deviations: 550,
        status: false
    };
    this.dealTask = false;
    this.i = 0;
};
task.prototype.addTask = function (type, data, startTime, endTime, forever, deal) {
    var taskArray = this.taskArray;
    if (tool.isEmpty(type)) {
        return false;
    }
    if (tool.isEmpty(forever)) {
        forever = true;
    }
    if (tool.isEmpty(deal)) {
        deal = "usual"
    }
    var task = {
        type: type,
        data: data,
        startTime: startTime,
        endTime: endTime,
        forever: forever,
        deal: deal,
        deal_all: false
    };
    taskArray.push(task);
    return true;
};
function dealDeviationsTime(targetTime, dealTime, deviationsTime) {
    if (targetTime - dealTime >= 0 && targetTime - dealTime < deviationsTime) {
        return true;
    }
    if (dealTime - targetTime > 0 && dealTime - targetTime < deviationsTime) {
        return true;
    }
    return false;
}
/*
*task end
*/





var chatAndMsg = {
    chatMore: true,
    qaMore: true,
    chatPage: 1,
    qaPage: 1,
    chatDeal: function (fun) {
        var that = this;
        if (this.chatMore) {
            var data = '<?xml version="1.0" encoding="utf-8"?><chatHistory siteid="' + vodInfo.siteId + '" userid="' + vodInfo.userId + '" confid="' + vodInfo.confId
                + '" live="false" page="' + this.chatPage + '"/>';
            tool.ajax({
                url: vodInfo.xmlApi,
                data: data,
                type: "POST",
                success: function (xml) {
                    var xml = tool.formatXml(xml.data);
                    var obj = {};
                    if (!tool.isEmpty(xml)) {
                        var chatArray = new Array();
                        var rootNode = xml.documentElement;
                        var chatlist = rootNode.getElementsByTagName("chatlist");
                        obj.more = false;
                        for (var j = 0; j < chatlist.length; j++) {
                            obj.more = tool.getXmlNodeAttr(chatlist[j], "more");
                            obj.page = tool.getXmlNodeAttr(chatlist[j], "page");
                            var chat = chatlist[j].getElementsByTagName("chat");
                            for (var i = 0; i < chat.length; i++) {
                                var chatObj = {};
                                chatObj.content = tool.getNodeValue(chat[i]);
                                chatObj.submitTime = tool.getXmlNodeAttr(chat[i], "time");
                                chatObj.senderId = tool.getXmlNodeAttr(chat[i], "senderId");
                                chatArray.push(chatObj);
                            }
                        }
                        obj.list = chatArray;
                    } else {
                        // logger.log("[chatDeal] xml isempty", "info", data)
                    }
                    if (obj.more != "true") {
                        that.chatMore = false;
                    }
                    if (!tool.isBlank(obj.page)) {
                        that.chatPage = obj.page - 0 + 1;
                    } else {
                        that.chatPage = that.chatPage + 1;
                    }
                    fun.call(this, obj);
                }
            });
        }
    },
    qaDeal: function (fun) {
        var that = this;
        if (this.qaMore) {
            var data = '<?xml version="1.0" encoding="utf-8"?><qaHistory siteid="' + vodInfo.siteId + '" userid="' + vodInfo.userId + '" confid="' + vodInfo.confId
                + '" live="false" page="' + this.qaPage + '"/>';
            tool.ajax({
                url: vodInfo.xmlApi,
                data: data,
                type: "POST",
                success: function (xml) {
                    var xml = tool.formatXml(xml.data);
                    var obj = {};
                    if (!tool.isEmpty(xml)) {
                        var rootNode = xml.documentElement;
                        obj.more = tool.getXmlNodeAttr(rootNode, "more");
                        // obj.page = tool.getXmlNodeAttr(rootNode, "page");
                        var qa = rootNode.getElementsByTagName("qa");
                        var qaArray = new Array();
                        for (var i = 0; i < qa.length; i++) {
                            var qaObj = {};
                            qaObj.id = tool.getXmlNodeAttr(qa[i], "id");
                            qaObj.question = tool.getXmlNodeAttr(qa[i], "question");
                            qaObj.submitor = tool.getXmlNodeAttr(qa[i], "questionowner");
                            qaObj.answer = tool.getXmlNodeAttr(qa[i], "answer");
                            qaObj.answerBy = tool.getXmlNodeAttr(qa[i], "answerowner");
                            qaObj.submitTime = tool.getXmlNodeAttr(qa[i], "questiontimestamp");
                            qaObj.answerTime = tool.getXmlNodeAttr(qa[i], "qaanswertimestamp");
                            qaObj.submitorId = tool.getXmlNodeAttr(qa[i], "questionownerid");
                            qaObj.answererId = tool.getXmlNodeAttr(qa[i], "answerownerid");
                            qaArray.push(qaObj);
                        }
                        obj.list = qaArray;
                    } else {
                        // logger.log("[qaDeal] xml isempty", "info", data)
                    }
                    if (obj.more != "true") {
                        that.chatMore = false;
                    }
                    if (!tool.isBlank(obj.page)) {
                        that.qaPage = obj.page - 0 + 1;
                    } else {
                        that.qaPage = that.qaPage + 1;
                    }
                    fun.call(this, obj);
                }
            });
        }
    },
    msgDeal: function (fun) {
        var data = '<?xml version="1.0" encoding="utf-8"?><leaveMsgHistory siteid="' + vodInfo.siteId + '" userid="' + vodInfo.userId + '" confid="' + vodInfo.confId
            + '" live="false"/>';
        tool.ajax({
            url: vodInfo.xmlApi,
            data: data,
            type: "POST",
            success: function (xml) {
                var xml = tool.formatXml(xml.data);
                var obj = {};
                if (!tool.isEmpty(xml)) {
                    var rootNode = xml.documentElement;
                    var msgArray = new Array();
                    var msg = rootNode.getElementsByTagName("msg");
                    for (var i = 0; i < msg.length; i++) {
                        var msgObj = {};
                        msgObj.id = tool.getXmlNodeAttr(msg[i], "id");
                        msgObj.question = tool.getXmlNodeAttr(msg[i], "question");
                        msgObj.submitTime = tool.getXmlNodeAttr(msg[i], "questiontimestamp");
                        msgObj.submitor = tool.getXmlNodeAttr(msg[i], "questionowner");
                        msgObj.answerTime = tool.getXmlNodeAttr(msg[i], "qaanswertimestamp");
                        msgObj.answerBy = tool.getXmlNodeAttr(msg[i], "answerowner");
                        msgObj.answer = tool.getXmlNodeAttr(msg[i], "answer");
                        msgArray.push(msgObj);
                    }
                    obj.list = msgArray;
                } else {
                    // logger.log("[msgDeal] xml isempty", "info", data)
                }
                fun.call(this, obj);
            }
        });
    }
};


pptRecord.recordDrawTime = function (starttime) {
    if (starttime >= pptRecord.record_max_time) {
        return;
    } else {
        if (pptRecord.record_jsanno.length > 1) {
            for (var i = 0; i < pptRecord.record_jsanno.length; i++) {
                if (pptRecord.record_jsanno[i].starttimestamp <= starttime && pptRecord.record_jsanno[i].stoptimestamp > starttime) {
                    if (pptRecord.record_jsanno_old[pptRecord.record_jsanno[i].jsanno]) {
                        return;
                    } else {
                        pptRecord.record_jsanno_old[pptRecord.record_jsanno[i].jsanno] = 1;
                        tool.ajax({
                            type: 'GET',
                            url: mediaInfo.visitUrl + pptRecord.record_jsanno[i].jsanno,
                            dataType: 'json',
                            success: function (annodata) {
                                dealAnnoData(annodata);
                            },
                            error: function (status) {
                                pptRecord.record_jsanno = [];
                                pptRecord.recordGetMainAnno(starttime);
                            }
                        });
                    }
                    break;
                }
            }
        }
    }
};

pptRecord.recordGetMainAnno = function (starttime) {
    if (pptRecord.record_MainAnno) {
        pptRecord.record_jsanno[0] = {
            jsanno: pptRecord.record_MainAnno,
            starttimestamp: 0,
            stoptimestamp: pptRecord.record_max_time,
            duration: pptRecord.record_max_time
        };
        if (starttime) {
            if (pptRecord.record_jsanno_old[pptRecord.record_MainAnno]) {
            } else {
                tool.ajax({
                    type: 'GET',
                    url: mediaInfo.visitUrl + +pptRecord.record_MainAnno,
                    dataType: 'json',
                    success: function (annodata) {
                        pptRecord.record_jsanno_old[pptRecord.record_MainAnno] = 1;
                        dealAnnoData(annodata);
                    },
                    error: function (status) {
                    }
                });
            }
        } else {
            tool.ajax({
                type: 'GET',
                url: mediaInfo.visitUrl + pptRecord.record_MainAnno,
                dataType: 'json',
                success: function (annodata) {
                    pptRecord.record_jsanno_old[pptRecord.record_MainAnno] = 1;
                    pptRecord.is_pptRecord = 1;
                    dealAnnoData(annodata);
                },
                error: function (status) {

                }
            });
        }
    } else {

    }
};

pptRecord.recordSeekTime = function (timestamp) {
    if (pptRecord.hasAnno && pptRecord.pageRecordInfo.length > 0) {
        sendEvent("onAnno", {cmd: "clear"});
        var annoData = new Array;
        for (var i = 0; i < pptRecord.pageRecordInfo.length; i++) {
            if (timestamp > pptRecord.pageRecordInfo[i].starttimestamp && timestamp < pptRecord.pageRecordInfo[i].stoptimestamp) {
                var pagerecord = pptRecord.pageRecordInfo[i];
                if (pagerecord.annodata.length > 0) {
                    for (var j = 0; j < pagerecord.annodata.length; j++) {
                        if (pagerecord.annodata[j].timestamp <= timestamp) {
                            for (var k = 0; k < pagerecord.annodata[j].annoArray.length; k++) {
                                annoData.push(pagerecord.annodata[j].annoArray[k]);
                            }
                        } else {
                            break;
                        }
                    }
                }
                break;
            }
        }
        if (annoData.length > 0) {
            sendEvent("onAnno", {cmd: "anno", annoArray: annoData});
        }
    }
}

function dealAnnoData(annodata) {
    annodata = annodata.data;
    if (annodata && annodata.module && tool.isArray(annodata.module.command)) {
        var command = annodata.module.command;
        var annoObj = {};
        for (var j = 0; j < command.length; j++) {
            if (annoObj[command[j].timestamp]) {
                annoObj[command[j].timestamp].push(command[j]);
            } else {
                annoObj[command[j].timestamp] = new Array();
                annoObj[command[j].timestamp].push(command[j]);
            }
        }
        for (var time in annoObj) {
            var starttime = parseFloat(time) * 1000;
            var endtime = parseFloat(time) * 1000 + 1000;
            tasks.addTask(TASK_TYPE.ANNOTATION, {cmd:"anno",annoArray: annoObj[time]}, starttime, endtime, true, "between");
            var pageanno = {};
            pageanno.timestamp = starttime;
            pageanno.annoArray = annoObj[time];
            for (var i = 0; i < pptRecord.pageRecordInfo.length; i++) {
                if (starttime > pptRecord.pageRecordInfo[i].starttimestamp && starttime < pptRecord.pageRecordInfo[i].stoptimestamp) {
                    pptRecord.pageRecordInfo[i].annodata.push(pageanno);
                    break;
                }
            }
        }
    } else if(annodata && annodata.module && (Object.prototype.toString.call(annodata.module.command) == "[object Object]")){
        var command = annodata.module.command;
        var annoObj = {};
        annoObj[command.timestamp] = new Array();
        annoObj[command.timestamp].push(command);
        for (var time in annoObj) {
            var starttime = parseFloat(time) * 1000;
            var endtime = parseFloat(time) * 1000 + 1000;
            tasks.addTask(TASK_TYPE.ANNOTATION, {cmd:"anno",annoArray: annoObj[time]}, starttime, endtime, true, "between");
            var pageanno = {};
            pageanno.timestamp = starttime;
            pageanno.annoArray = annoObj[time];
            for (var i = 0; i < pptRecord.pageRecordInfo.length; i++) {
                if (starttime > pptRecord.pageRecordInfo[i].starttimestamp && starttime < pptRecord.pageRecordInfo[i].stoptimestamp) {
                    pptRecord.pageRecordInfo[i].annodata.push(pageanno);
                    break;
                }
            }
        }
    }
}

function pptGetRecord(data) {
    if (data.conf.jsanno && data.conf.jsanno != null) {
        pptRecord.record_max_time = parseFloat(data.conf.duration) * 1000;
        pptRecord.record_MainAnno = data.conf.jsanno;
        pptRecord.hasAnno = true;
        var multirecord_obj = {};
        for (var m = 0; m < data.conf.module.length; m++) {
            if (data.conf.module[m].name == 'multirecord') {
                multirecord_obj = data.conf.module[m].multirecord;
            }
        }
        //解析jsanno
        if (tool.isArray(multirecord_obj)) {
            var n = 0;
            var jsanno_array = [];

            for (var i = 0; i < multirecord_obj.length; i++) {
                if ((multirecord_obj[i].jsanno && multirecord_obj[i].jsanno != null) || (multirecord_obj[i].anno && multirecord_obj[i].anno != null)) {
                    if (!multirecord_obj[i].jsanno && multirecord_obj[i].anno) {
                        multirecord_obj[i].jsanno = multirecord_obj[i].anno.replace('xml', 'js');
                    }
                    if (!jsanno_array[multirecord_obj[i].jsanno]) {
                        jsanno_array[multirecord_obj[i].jsanno] = multirecord_obj[i].jsanno;
                        pptRecord.record_jsanno[n] = {
                            jsanno: multirecord_obj[i].jsanno,
                            starttimestamp: parseFloat(multirecord_obj[i].starttimestamp) * 1000,
                            stoptimestamp: parseFloat(multirecord_obj[i].stoptimestamp) * 1000,
                            duration: parseFloat(multirecord_obj[i].duration) * 1000
                        };
                        n++;
                    } else if (jsanno_array[multirecord_obj[i].jsanno]) {
                        pptRecord.record_jsanno[n] = {
                            jsanno: multirecord_obj[i].jsanno,
                            starttimestamp: parseFloat(multirecord_obj[i].starttimestamp) * 1000,
                            stoptimestamp: parseFloat(multirecord_obj[i].stoptimestamp) * 1000,
                            duration: parseFloat(multirecord_obj[i].duration) * 1000
                        };
                        n++;
                    }
                }
            }
            if (pptRecord.record_jsanno[0]) {
                tool.ajax({
                    type: 'GET',
                    url: mediaInfo.visitUrl + pptRecord.record_jsanno[0].jsanno,
                    dataType: 'json',
                    success: function (annodata) {
                        pptRecord.record_jsanno_old[pptRecord.record_jsanno[0].jsanno] = 1;//设置jsanno加载成功
                        pptRecord.is_pptRecord = 1;//第一个anno加载成功设置标注可以播放
                        dealAnnoData(annodata);
                    },
                    error: function (status) {
                        pptRecord.record_jsanno = [];
                        pptRecord.recordGetMainAnno();
                    }
                });
            } else {
                pptRecord.recordGetMainAnno();
            }
        } else {
            if (multirecord_obj.jsanno) {
                var jsanno = multirecord_obj.jsanno;
                pptRecord.record_jsanno[0] = {
                    jsanno: jsanno,
                    starttimestamp: parseFloat(multirecord_obj.starttimestamp) * 1000,
                    stoptimestamp: parseFloat(multirecord_obj.stoptimestamp) * 1000,
                    duration: parseFloat(multirecord_obj.duration) * 1000
                };
                tool.ajax({
                    type: 'GET',
                    url: mediaInfo.visitUrl + jsanno,
                    dataType: 'json',
                    success: function (annodata) {
                        pptRecord.record_jsanno_old[jsanno] = 1;
                        pptRecord.is_pptRecord = 1;
                        dealAnnoData(annodata);
                    },
                    error: function (status) {
                        pptRecord.record_jsanno = [];
                        pptRecord.recordGetMainAnno();//加载默认的
                    }
                });
            } else {
                pptRecord.recordGetMainAnno();
            }
        }
    }
}



synChat.addAllSyn = function () {
    if (synChat.chatData.length > 0) {
        for (var i = 0; i < synChat.chatData.length; i++) {
            var data = synChat.chatData[i];
            addchatTask(data.data, data.starttime, data.stoptime);
        }
    }
    synChat.chatData = [];
}

synChat.chatGetSyn = function (data) {
    synChat.xmlChat = true;
    if (data.conf.jschat && data.conf.jschat != null) {
        var offset = new Date().getTimezoneOffset();
        var d = new Date(data.conf.starttime.replace(/\-/g, "/")).getTime();
        synChat.startTime = d - offset * 60 * 1000;
        synChat.duration = parseFloat(data.conf.duration) * 1000;
        synChat.chatMainFile = data.conf.jschat;
        var multirecord_obj = {};
        //如果存在解析出chat所在对象
        for (var m = 0; m < data.conf.module.length; m++) {
            if (data.conf.module[m].name == 'multirecord') {
                multirecord_obj = data.conf.module[m].multirecord;
                break;
            }
        }
        if (multirecord_obj && tool.isArray(multirecord_obj)) {
            var jschat_array = [];
            var n = 0;
            for (var i = 0; i < multirecord_obj.length; i++) {
                if (multirecord_obj[i].chat && multirecord_obj[i].chat != null) {
                    if (!jschat_array[multirecord_obj[i].chat]) {
                        jschat_array[multirecord_obj[i].chat] = multirecord_obj[i].chat;
                        synChat.chatList[n] = {
                            jschat: multirecord_obj[i].jschat,
                            starttimestamp: parseFloat(multirecord_obj[i].starttimestamp) * 1000,
                            stoptimestamp: parseFloat(multirecord_obj[i].stoptimestamp) * 1000,
                            duration: parseFloat(multirecord_obj[i].duration) * 1000
                        };
                        n++;
                    } else {
                        synChat.chatList[n - 1].stoptimestamp = parseFloat(multirecord_obj[i].stoptimestamp) * 1000;
                    }
                }
            }
            if (synChat.chatList.length > 0) {
                synChat.requestedData[synChat.chatList[0].jschat] = 1;
                tool.ajax({
                    type: 'GET',
                    url: mediaInfo.visitUrl + synChat.chatList[0].jschat,
                    dataType: 'json',
                    success: function (data) {
                        data = data.data;
                        if (data && data.module && data.module.chat) {
                            dealChatMsg(data.module.chat);
                        }
                    },
                    error: function (status) {
                        if (synChat.chatList.length == 1) {
                            synChat.chatGetMain();
                        }
                    }
                });
            } else {
                synChat.chatGetMain();
            }
        } else if (multirecord_obj && multirecord_obj.jschat) {
            var jschat = multirecord_obj.jschat;
            tool.ajax({
                type: 'GET',
                url: mediaInfo.visitUrl + jschat,
                dataType: 'json',
                success: function (data) {
                    data = data.data;
                    if (data && data.module && data.module.chat) {
                        dealChatMsg(data.module.chat);
                    }
                },
                error: function (xhr, type) {
                    synChat.chatGetMain();
                }
            });
        } else {
            synChat.chatGetMain();
        }
    }
}

synChat.chatGetMain = function (starttime) {
    synChat.chatList = [];
    if (synChat.chatMainFile) {
        if (starttime) {
            tool.ajax({
                type: 'GET',
                url: mediaInfo.visitUrl + synChat.chatMainFile,
                dataType: 'json',
                success: function (data) {
                    data = data.data;
                    if (data && data.module && data.module.chat) {
                        dealChatMsg(data.module.chat);
                    }
                },
                error: function (status) {
                }
            });
        } else {
            tool.ajax({
                type: 'GET',
                url: mediaInfo.visitUrl + synChat.chatMainFile,
                dataType: 'json',
                success: function (data) {
                    data = data.data;
                    if (data && data.module && data.module.chat) {
                        dealChatMsg(data.module.chat);
                    }
                },
                error: function (status) {
                }
            });
        }
    } else {

    }
}

synChat.chatCurrent = function (starttime) {

    if (starttime >= synChat.duration) {
        return;
    }
    if (starttime - synChat.playTime > 3000) {
        synChat.lastTime = starttime;
        pptRecord.recordSeekTime(starttime);
        eventConfig.seeking = false;
    }
    synChat.playTime = starttime;
    if (synChat.chatList.length > 1) {
        for (var i = 0; i < synChat.chatList.length; i++) {
            if (starttime >= synChat.chatList[i].starttimestamp && starttime <= synChat.chatList[i].stoptimestamp) {
                if (synChat.requestedData[synChat.chatList[i].jschat]) {

                } else {
                    synChat.requestedData[synChat.chatList[i].jschat] = 1;
                    tool.ajax({
                        type: 'GET',
                        url: mediaInfo.visitUrl + synChat.chatList[i].jschat,
                        dataType: 'json',
                        success: function (data) {
                            data = data.data;
                            if (data && data.module && data.module.chat) {
                                dealChatMsg(data.module.chat);
                            }
                        },
                        error: function (status) {
                        }
                    });
                }
            }
        }
    }
}

synChat.chatslice = function (index, fun) {
    synChat.requestedData[synChat.chatList[index].jschat] = 1;
    tool.ajax({
        type: 'GET',
        url: mediaInfo.visitUrl + synChat.chatList[index].jschat,
        dataType: 'json',
        success: function (data) {
            data = data.data;
            if (data && data.module && data.module.chat) {
                dealChatMsg(data.module.chat);
            }
            synChat.getMoreChat(fun);
        },
        error: function (status) {
            synChat.getMoreChat(fun);
        }
    });
}

synChat.getMoreChat = function (fun) {
    var chat = {more: false, list: []};
    var tempList = [];
    var sliceindex = 0;
    if (synChat.lastTime != 0) {
        if (synChat.chatList.length <= 1) {
            synChat.sliceStartTime = 0;
            var chatdata = synChat.chathisData;
            var n = 0;
            var len = chatdata.length - 1;
            var m = 0;
            for (var i = len; i >= 0 && n < 100; i--) {
                if (chatdata[i].timestamp < synChat.lastTime && chatdata[i].timestamp >= synChat.sliceStartTime) {
                    tempList.push(chatdata[i]);
                    m = i;
                    if (n == 99 && i > 0) {
                        for (var j = i - 1; j >= 0; j--) {
                            if (chatdata[i].timestamp == chatdata[j].timestamp) {
                                tempList.push(chatdata[j]);
                            } else {
                                break;
                            }
                        }
                    }
                    n++;
                }
            }
            if (n != 0 && m != 0 && n == 100 && m < len) {
                chat.more = true;
            }
        }
        else {
            for (var i = 0; i < synChat.chatList.length; i++) {
                if (synChat.chatList[i].starttimestamp < synChat.lastTime && synChat.chatList[i].stoptimestamp >= synChat.lastTime) {
                    if (i >= 1) {
                        for (var j = i - 1; j >= 0; j--) {
                            if (synChat.requestedData[synChat.chatList[j].jschat]) {
                                synChat.sliceStartTime = synChat.chatList[j].starttimestamp;
                            } else {
                                sliceindex = j;
                                break;
                            }
                        }
                    }
                    break;
                }
            }
            var chatdata = synChat.chathisData;
            var n = 0;
            var len = chatdata.length - 1;
            var m = 0;
            for (var i = len; i >= 0 && n < 100; i--) {
                if (chatdata[i].timestamp < synChat.lastTime && chatdata[i].timestamp >= synChat.sliceStartTime) {
                    tempList.push(chatdata[i]);
                    m = i;
                    if (n == 99 && i > 0) {
                        for (var j = i - 1; j >= 0; j--) {
                            if (chatdata[i].timestamp == chatdata[j].timestamp) {
                                tempList.push(chatdata[j]);
                            } else {
                                break;
                            }
                        }
                    }
                    n++;
                }
            }
            if (n != 0 && m != 0 && n == 100 && m < len) {
                chat.more = true;
            } else if (n == 0 && m == 0) {
                if (sliceindex != 0) {
                    synChat.chatslice(sliceindex, fun);
                    return;
                }
            }
        }
    }
    tempList.sort(chatTimeSort);
    if (tempList.length >= 1) {
        synChat.lastTime = tempList[0].timestamp;
        for (var i = 0; i < tempList.length; i++) {
            chat.list.push(tempList[i].data);
        }
        fun.call(this, chat);
    } else {
        fun.call(this, chat);
    }
}

synChat.chatAllslice = function (index, fun) {
    synChat.requestedData[synChat.chatList[index].jschat] = 1;
    tool.ajax({
        type: 'GET',
        url: mediaInfo.visitUrl + synChat.chatList[index].jschat,
        dataType: 'json',
        success: function (data) {
            data = data.data;
            if (data && data.module && data.module.chat) {
                dealChatMsg(data.module.chat);
            }
            synChat.getMoreAllChat(fun);
        },
        error: function (status) {
            synChat.getMoreAllChat(fun);
        }
    });
}

synChat.getMoreAllChat = function (fun) {
    var chat = {more: false, list: []};
    var tempList = [];
    var sliceindex = 0;
    if (synChat.lastTime < synChat.duration) {
        if (synChat.chatList.length <= 1) {
            synChat.allSliceStartTime = 0;
            var chatdata = synChat.chathisData;
            var n = 0;
            var len = chatdata.length - 1;
            var m = 0;
            for (var i = 0; i <= len && n < 100; i++) {
                if (chatdata[i].timestamp > synChat.allLastSeekTime) {
                    tempList.push(chatdata[i]);
                    m = i;
                    if (n == 99 && i < len) {
                        for (var j = i + 1; j <= len; j++) {
                            if (chatdata[i].timestamp == chatdata[j].timestamp) {
                                tempList.push(chatdata[j]);
                            } else {
                                break;
                            }
                        }
                    }
                    n++;
                }
            }
            if (n != 0 && m != 0 && n == 100 && m < len) {
                chat.more = true;
            }
        }
        else {
            synChat.sliceEndTime = synChat.chatList[0].stoptimestamp;
            for (var i = 0; i < synChat.chatList.length; i++) {
                if (synChat.chatList[i].starttimestamp < synChat.allLastSeekTime && synChat.chatList[i].stoptimestamp >= synChat.allLastSeekTime) {
                    synChat.sliceEndTime = synChat.chatList[i].stoptimestamp;
                    for (var j = i + 1; j < synChat.chatList.length; j++) {
                        if (synChat.requestedData[synChat.chatList[j].jschat]) {
                            synChat.sliceEndTime = synChat.chatList[j].stoptimestamp;
                        } else {
                            sliceindex = j;
                            break;
                        }
                    }
                    break;
                }
            }
            var chatdata = synChat.chathisData;
            var n = 0;
            var len = chatdata.length - 1;
            var m = 0;
            for (var i = 0; i <= len && n < 100; i++) {
                if (chatdata[i].timestamp > synChat.allLastSeekTime && chatdata[i].timestamp <= synChat.sliceEndTime) {
                    tempList.push(chatdata[i]);
                    m = i;
                    if (n == 99 && i < len) {
                        for (var j = i + 1; j <= len; j++) {
                            if (chatdata[i].timestamp == chatdata[j].timestamp) {
                                tempList.push(chatdata[j]);
                            } else {
                                break;
                            }
                        }
                    }
                    n++;
                }
            }
            if (n != 0 && m != 0 && n == 100 && m < len) {
                chat.more = true;
            } else if (n == 0 && m == 0) {
                if (sliceindex != 0) {
                    synChat.chatAllslice(sliceindex, fun);
                    return;
                }
            }
        }
    }
    tempList.sort(chatTimeSort);
    if (tempList.length >= 1) {
        synChat.allLastSeekTime = tempList[tempList.length - 1].timestamp;
        for (var i = 0; i < tempList.length; i++) {
            chat.list.push(tempList[i].data);
        }
        fun.call(this, chat);
    } else {
        fun.call(this, chat);
    }
}

function chatTimeSort(a, b) {
    return a.timestamp - b.timestamp;
}

function dealChatMsg(data) {
    if (tool.isArray(data)) {
        if (data.length > 0) {
            synChat.currentTime = data[data.length - 1].timestamp;
        }
        for (var i = 0; i < data.length; i++) {
            var starttime;
            var stoptime;
            var chatdts = {};
            chatdts.list = new Array();
            starttime = parseFloat(data[i].timestamp) * 1000;
            stoptime = starttime + 1000;
            var ems = data[i].ems;
            if (ems) {
                if (tool.isArray(ems)) {
                    for (var j = 0; j < ems.length; j++) {
                        var vs = {};
                        vs.sender = ems[j].sender;
                        vs.content = ems[j].text;
                        vs.submitTime = synChat.startTime + starttime;
                        vs.senderId = ems[j].senderId;
                        vs.senderRole = analysisRole(ems[j].senderRole);
                        var his = {timestamp: starttime, data: vs};
                        synChat.chathisData.push(his);
                        chatdts.list.push(vs);
                    }
                } else {
                    var vs = {};
                    vs.sender = ems.sender;
                    vs.content = ems.text;
                    vs.submitTime = synChat.startTime + starttime;
                    vs.senderId = ems.senderId;
                    vs.senderRole = analysisRole(ems.senderRole);
                    var his = {timestamp: starttime, data: vs};
                    synChat.chathisData.push(his);
                    chatdts.list.push(vs);
                }
                addchatTask(chatdts, starttime, stoptime);
            }
        }
    } else {
        if (data.timestamp) {
            synChat.currentTime = data.timestamp;
            var starttime;
            var stoptime;
            var chatdts = {};
            chatdts.list = new Array();
            starttime = parseFloat(data.timestamp) * 1000;
            stoptime = starttime + 1000;
            var ems = data.ems;
            if (ems) {
                if (tool.isArray(ems)) {
                    for (var j = 0; j < ems.length; j++) {
                        var vs = {};
                        vs.sender = ems[j].sender;
                        vs.content = ems[j].text;
                        vs.submitTime = synChat.startTime + starttime;
                        vs.senderId = ems[j].senderId;
                        var his = {timestamp: starttime, data: vs};
                        synChat.chathisData.push(his);
                        chatdts.list.push(vs);
                    }
                } else {
                    var vs = {};
                    vs.sender = ems.sender;
                    vs.content = ems.text;
                    vs.submitTime = synChat.startTime + starttime;
                    vs.senderId = ems.senderId;
                    var his = {timestamp: starttime, data: vs};
                    synChat.chathisData.push(his);
                    chatdts.list.push(vs);
                }
                addchatTask(chatdts, starttime, stoptime);
            }
        }
    }
    synChat.chathisData.sort(chatTimeSort);
}

function addchatTask(data, starttime, stoptime) {
    if (synChat.chatSync) {
        tasks.addTask(TASK_TYPE.CHAT, data, starttime, stoptime, true, "between")
    } else {
        var taskdata = {starttime: starttime, stoptime: stoptime, data: data};
        synChat.chatData.push(taskdata);
    }
}
function analysisRole(roleValue) {
    var roleList = "";
    if (roleValue != "") {
        roleValue = roleValue - 0;
        if (roleValue % 2 == 1) {
            roleList = roleList + "1,";
            roleValue = roleValue - 1;
        }
        if (roleValue % 4 == 2) {
            roleList = roleList + "2,";
            roleValue = roleValue - 2;
        }
        if (roleValue % 8 == 4) {
            roleList = roleList + "4,";
            roleValue = roleValue - 4;
        }
        if (roleValue % 16 == 8) {
            roleList = roleList + "8,";
            roleValue = roleValue - 8;
        }
        if (roleValue - 16 == 0) {
            roleList = roleList + "16,";
        }
        if (roleList.length > 0) {
            roleList = roleList.substring(0, roleList.length - 1);
        }
    }
    return roleList;
}

//命令接收处理函数集合
var submitDealFuns = {
    seek: function (event) {
    },
    pause: function (event) {
    },
    play: function (event) {
    },
    playheadTime: function (event) {
        var time = app.globalData.currentTime;
        sendEvent("onPlayheadTime", {playheadTime: time * 1000});
    },
    submitVote: function (event) {
        var data = event.data;
        var checkResult = checkVote(data);
        if (!checkResult.result) {
            var obj = {};
            obj.api = "submitVote";
            obj.param = data;
            obj.explain = checkResult.explain;
            obj.type = checkResult.type;
            sendEvent("onAPIError", obj);
        } else {
            sendVoteSurvey(data);
        }
    },
    leaveMessage: function (event) {
        var data = event.data;
        if (tool.isEmpty(data) || tool.isBlank(data.content)) {
            var obj = {};
            obj.api = "leaveMessage";
            obj.param = data;
            obj.explain = "The data format is error or is null.";
            obj.type = 1;
            sendEvent("onAPIError", obj);
        } else {
            var sendXml = '<?xml version="1.0" encoding="UTF-8"?>';
            sendXml = sendXml + '<qaSubmit><siteId>' + vodInfo.siteId + '</siteId>';
            sendXml = sendXml + '<confId>' + vodInfo.confId + '</confId>';
            sendXml = sendXml + '<userId>' + vodInfo.userId + '</userId>';
            sendXml = sendXml + '<isLive>false</isLive>';
            sendXml = sendXml + '<userName><![CDATA[' + vodInfo.userName + ']]></userName>';
            sendXml = sendXml + '<question><![CDATA[' + data.content + ']]></question><filter>false</filter>';
            sendXml = sendXml + '<email><![CDATA[' + data.email + ']]></email></qaSubmit>';
            tool.ajax({type: "post", url: vodInfo.xmlApi, data: sendXml});
        }
    },
    submitMute: function (event) {
    },
    submitVolume: function (event) {
    },
    submitStop: function (event) {
    },
    submitQAList: function (event) {
        chatAndMsg.qaDeal(function (obj) {
            sendEvent("onQAList", obj);
        })
    },
    submitChatHistory: function (event) {
        if (synChat.xmlChat) {
            synChat.getMoreAllChat(function (obj) {
                sendEvent("onChatHistory", obj);
            })
        } else {
            chatAndMsg.chatDeal(function (obj) {
                sendEvent("onChatHistory", obj);
            })
        }

    },
    submitChatSegment: function (event) {
        if (synChat.xmlChat && synChat.chatSync) {
            synChat.getMoreChat(function (obj) {
                sendEvent("onChatSegmentList", obj);
            })
        }
    },
    submitLeaveMessageList: function (event) {
        chatAndMsg.msgDeal(function (obj) {
            sendEvent("onLeaveMessageList", obj);
        })
    },
    setupChatSync: function (event) {
        var data = event.data;
        if (synChat.xmlChat && data.open) {
            synChat.chatSync = true;
            synChat.addAllSyn();
        } else {
            synChat.chatSync = false;
        }
    }
};
var submitCommand = function (command) {
    var o = submitDealFuns[command];
    return o;
};

var onBindEventHandler = function (event) {
    var dealFun = submitCommand(event.type);
    if (dealFun != undefined && typeof dealFun == "function") {
        dealFun.call(this, event);
    } else {
        sendEvent("onAPIError", {api: event.type, expalin: "The api name is error"});
    }
};

//命令发送函数
var sendEvent = function (type, content) {
    setTimeout(function () {
        channel.send(type, content);
    }, 0);
};

//全部销毁
var destroy = function () {

};

//重置
var reset = function () {

};

GS_MEDIA._open_ = {
    init: function (options) {
        var obj = {};
        channel = app.globalData.channel;
        wgid = channel.id;
        if (tool.checkObjectIsNull(options.site)) {
            obj.api = "init";
            obj.param = options.site;
            obj.explain = "Parameter site miss";
            obj.type = 2;
        }
        if (tool.checkObjectIsNull(options.ownerid)) {
            obj.api = "init";
            obj.param = options.ownerid;
            obj.explain = "Parameter ownerid miss";
            obj.type = 2;
        }

        if (tool.checkObjectIsNull(options.uid)) {
            options.uid = "";
        }
        if (tool.checkObjectIsNull(options.uname)) {
            options.uname = "";
        }
        if (tool.checkObjectIsNull(options.encodetype)) {
            options.encodetype = "";
        }
        if (tool.checkObjectIsNull(options.password)) {
            options.password = "";
        }
        if (tool.checkObjectIsNull(options.ownerid)) {
            options.ownerid = "";
        }
        if (tool.checkObjectIsNull(options.ctx)) {
            options.ctx = "webcast";
        }
        if (tool.checkObjectIsNull(options.authcode)) {
            options.authcode = "";
        }
        if (tool.checkObjectIsNull(options.k)) {
            options.k = "";
        }
        if (tool.checkObjectIsNull(options.istest)) {
            options.istest = false;
        }
        var url;
        if (!options.istest) {
            url = "https://";
        } else {
            url = "http://";
        }
        if ("training" === options.ctx) {
            url += options.site + "/sdk/site/sdk/tra/vod/wxconfig";
            scType = 1;
        } else {
            url += options.site + "/sdk/site/sdk/vod/wxconfig";
            scType = "";
        }
        url += "?ownerid=" + options.ownerid + "&authcode=" + options.authcode + "&uid=" + options.uid + "&uname=" + options.uname + "&encodetype=" + options.encodetype + "&password=" + options.password + "&k=" + options.k + "&istest=" + options.istest + "&scType=" + scType;
        console.log("init url:" + url);
        wx.request({
            url: url,
            header: {
              'content-type': 'application/json',
              'cache-control': 'no-cache'
            },
            success: function (res) {
                var data = res.data;
                if ("success" == data.type) {
                    if (data.sslSupport && !options.istest) {
                      xmlUrl = data.xmlUrl.replace("http://", "https://");
                      xmlUrl = xmlUrl.replace("https://", "https://" + data.wxxApi);
                      protocolPrex = "https://";
                    } else {
                      xmlUrl = data.xmlUrl;
                      protocolPrex = "http://";
                    }
                    if (data.vodKickOut) {
                      onlyLogin = "1";
                    }
                    if (!tool.checkObjectIsNull(data.connectSvr)) {
                      alb = data.connectSvr;
                    }
                    if (!tool.checkObjectIsNull(data.bakConnectSvr)) {
                      backAlb = data.bakConnectSvr;
                    }
                    vodInfo.xmlApi = data.siteUrl + data.xmlapiContextPath + "/apichannel";
                    if (data.scType != "" && data.scType != undefined) {
                      vodInfo.xmlApi += "?sc=" + data.scType;
                    }
                    vodInfo.containerId = wgid;
                    vodInfo.xmlUrl = xmlUrl;
                    vodInfo.protocolPrex = protocolPrex;
                    vodInfo.sslSupport = data.sslSupport;
                    vodInfo.siteId = data.siteId;;
                    vodInfo.userId = data.uid;
                    vodInfo.userName = data.userName;
                    vodInfo.confId = options.ownerid;
                    vodInfo.hostId = data.hostId;
                    vodInfo.tid = data.tkId;
                    vodInfo.onlyLogin = onlyLogin;
                    vodInfo.alb = alb;
                    vodInfo.backAlb = backAlb;
                    vodInfo.albProxy = scType;
                    vodInfo.sc = scType;
                    if (options.istest) {
                      wxxApi = "";
                    } else {
                      wxxApi = data.wxxApi;
                    }   
                    channel.send("onTitle",{content:data.subject});
                    initEvent();
                    getXmlData();
                } else {
                    obj.api = "init";
                    obj.param = data;
                    obj.explain = "Vod Background check is not passed:" + JSON.stringify(data) + "-----type:" + data.type + "-----" + "desc:" + data.desc;
                    obj.type = 1;
                    if (!tool.checkObjectIsNull(obj)) {
                        channel.send("onAPIError", obj);
                    }
                }
            },
            fail: function (res) {
                obj.api = "init";
                obj.param = "site:" + options.site;
                obj.explain = "vod fail:" + res.errMsg;
                obj.type = 1;
                if (!tool.checkObjectIsNull(obj)) {
                    channel.send("onAPIError", obj);
                }
            }
        })
    },
    refresh:function(){
        if(wgid){
            GS.clearChannel();
        }
        if(tasks.stop){
            tasks.clear();
            tasks.stop();
        }
        recordInfo = {
            hls: "",
            highHls: "",
            hlsAudioOnly: "",
            duration: "",
            liveTextFile: "",
            jsContent: "",
            playing: false,
            voteSurveyList: new Array(),
            lotteryArray: new Array(),
            layoutArray: new Array(),
            docArray: new Array()
        };
        eventConfig = {
            firstPlay: true,
            firstCanPlay: true,
            canPlay: false,
            seeking: false
        };
        vodInfo = {
            containerId: "",
            xmlUrl: "",
            protocolPrex: "http://",
            sslSupport: false,
            siteId: 0,
            userId: 0,
            userName: "",
            confId: "",
            hostId: 0,
            tid: "",
            sc: "sc=0",
            onlyLogin: "0",
            alb: "",
            backAlb: "",
            xmlApi: "",
            albProxy: "",
            video: true
        };

        clearInterval(serverParam.keepTimeId);
        serverParam = {
            sessionId: "",
            currentAlb: "",
            startTime: 0,
            lastTime: 0,
            watchMaxDuration: 0,
            keepTimeId: 0,
            keepInterval: 10000
        };

        synChat.startTime = "";
        synChat.duration = "";
        synChat.chatMainFile = "";
        synChat.chatList = [];
        synChat.requestedData = {};
        synChat.lastTime = 0;
        synChat.chathisData = [];
        synChat.chatData = [];
        synChat.currentTime = 0;
        synChat.xmlChat = false;
        synChat.sliceStartTime = 0;
        synChat.sliceEndTime = 0;
        synChat.chatSync = false;
        synChat.allHisFirst = true;
        synChat.allLastSeekTime = 0;
        synChat.playTime = 0;

        pptRecord.is_pptRecord =  0;
        pptRecord.record_max_time =  0;
        pptRecord.record_jsanno =  [];
        pptRecord.record_jsanno_old =  {};
        pptRecord.record_MainAnno =  '';
        pptRecord.hasAnno = false;
        pptRecord.pageRecordInfo =  [];

        chatAndMsg.chatMore = true;
        chatAndMsg.qaMore = true;
        chatAndMsg.chatPage = 1;
        chatAndMsg.qaPage = 1;
        scType = "";
    }
};

function initEvent() {
    var bindEvents = ["seek", "pause", "play", "leaveMessage", "submitVote", "playheadTime", "submitMute", "submitVolume", "submitStop", "submitQAList", "submitChatHistory", "submitLeaveMessageList", "showControlBar", "submitAnswerSheet", "setupChatSync", "submitChatSegment", "checkExit"];
    var bindEventHandler = function (event) {
        if (!eventConfig.widgetReady) {
          channel.send("onAPIError", {
                "api": event.type,
                "param": event.data,
                "explain": "Core-widget not ready, please wait a moment!",
                "type": "9"
            });
            return;
        }
        onBindEventHandler(event);
        if (event.type == 'submitStop') {
            for (var i = 0; i < bindEvents.length; i++) {
              channel.unbind(bindEvents[i], bindEventHandler);
            }
        }
    };
    for (var i = 0; i < bindEvents.length; i++) {
      channel.bind(bindEvents[i], bindEventHandler);
    }
}

function initScheduler() {
        tasks = new task();
        //部分优化，不需要同步的数据不在通过task通知
        tasks.addTaskFunction(TASK_TYPE.PPT, function (data) {
            sendEvent("onDocChange", {
                doc: data.docName,
                title: data.title,
                width: data.width,
                height: data.height,
                hls: data.hls
            });
            sendEvent("onDocUrl", data);
        }, null);
        tasks.addTaskFunction(TASK_TYPE.ANNOTATION, function (data) {
            sendEvent("onAnno", data);
        }, null);
        tasks.addTaskFunction(TASK_TYPE.CHAT, function (data) {
            if (synChat.chatSync) {
                sendEvent("onChat", data);
            }
        }, null);
        tasks.addTaskFunction(TASK_TYPE.LOTTERY, function (data) {
            sendEvent("onLottery", data);
        }, null);
        tasks.addTaskFunction(TASK_TYPE.VOTE, function (data) {
            sendEvent("onVote", data);
        }, null);
}

function getXmlData() {
  console.log("[getXmlData]:" + vodInfo.xmlUrl);
    // logger.log("[getXmlData]", "info", vodInfo.xmlUrl);
    if (!tool.isBlank(vodInfo.xmlUrl)) {
        tool.ajax({
            url: vodInfo.xmlUrl,
            dateType: 'xml',
            success: function (xml) {
                // logger.log("[getXmlData]", "info", xml)
                prepareData(xml);
            },
            error: function () {
                // logger.log("[getXmlData]", "error", vodInfo.xmlUrl);
                console.log("[getXmlData] error");
            }
        });
    }
}

function prepareData(xml) {
    xml = tool.parseXml(xml.data);
    var rootNode = xml.documentElement;
    if (tool.getXmlNodeAttr(rootNode, "ver") == "5") {
        recordInfo.hls = tool.getXmlNodeAttr(rootNode, "mobilenormal");
        recordInfo.highHls = tool.getXmlNodeAttr(rootNode, "mobilehigh");
    } else {
        recordInfo.hls = tool.getXmlNodeAttr(rootNode, "hls");
    }
    recordInfo.hlsAudioOnly = tool.getXmlNodeAttr(rootNode, "hlsaudioonly");
    recordInfo.duration = tool.getXmlNodeAttr(rootNode, "duration");
    recordInfo.liveTextFile = tool.getXmlNodeAttr(rootNode, "livetextfile");
    recordInfo.jsContent = tool.getXmlNodeAttr(rootNode, "js");
    recordInfo.playing = true;
    if (!tool.isBlank(recordInfo.hls)) {
        var moduleArray = rootNode.getElementsByTagName("module");
        for (var i = 0; i < moduleArray.length; i++) {
            var moduleName = tool.getXmlNodeAttr(moduleArray[i], "name");
            if (moduleName == "document") {
                var documentArray = moduleArray[i].childNodes;
                for (var j = 0; j < documentArray.length; j++) {
                    var documentName = tool.getXmlNodeAttr(documentArray[j], "name");
                    var pageArray = documentArray[j].childNodes;
                    if(pageArray){
                        for (var k = 0; k < pageArray.length; k++) {
                            var pageObj = pageArray[k];
                            if (pageObj.nodeName == "page") {
                                var resultObj = {};
                                resultObj.docName = documentName;
                                resultObj.title = tool.getXmlNodeAttr(pageObj, "title");
                                resultObj.hls = tool.getXmlNodeAttr(pageObj, "hls");
                                resultObj.startTime = tool.getXmlNodeAttr(pageObj, "starttimestamp");
                                resultObj.endTime = tool.getXmlNodeAttr(pageObj, "stoptimestamp");
                                resultObj.content = tool.getXmlNodeAttr(pageObj, 'content');
                                resultObj.height = tool.getXmlNodeAttr(pageObj, "height");
                                resultObj.width = tool.getXmlNodeAttr(pageObj, "width");
                                recordInfo.docArray.push(resultObj);
                            }
                        }
                    }
                }
            } else if (moduleName == "vote" || moduleName == "survey") {
                var voteArray = moduleArray[i].childNodes;
                for (var j = 0; j < voteArray.length; j++) {
                    if (voteArray[j].nodeName == "command") {
                        var vote = voteArray[j];
                        var type = tool.getXmlNodeAttr(vote, "type");
                        if(type == "publish_card") continue;
                        var obj = {};
                        obj.id = tool.getXmlNodeAttr(vote, "id");
                        obj.startTime = tool.getXmlNodeAttr(vote, "timestamp");
                        obj.skip = tool.getXmlNodeAttr(vote, "skip");
                        var childArray = vote.childNodes;
                        obj.questions = new Array();
                        for (var k = 0; k < childArray.length; k++) {
                            var child = childArray[k];
                            if (child.nodeName == "subject") {
                                obj.subject = tool.trim(child.textContent);
                            } else if (child.nodeName == "question") {
                                var question = {};
                                question.id = tool.getXmlNodeAttr(child, "id");
                                question.type = tool.getXmlNodeAttr(child, "type");
                                question.answer = tool.getXmlNodeAttr(child, "answer");
                                question.text = "";
                                var questionChild = child.childNodes;
                                question.items = new Array();
                                for (var l = 0; l < questionChild.length; l++) {
                                    var itemChild = questionChild[l];
                                    if (itemChild.nodeName == "subject") {
                                        question.subject = tool.trim(itemChild.textContent);
                                    } else if (itemChild.nodeName == 'item') {
                                        var itemObj = {};
                                        itemObj.id = tool.getXmlNodeAttr(itemChild, "id");
                                        itemObj.option = tool.trim(itemChild.textContent);
                                        itemObj.correct = tool.getXmlNodeAttr(itemChild, "correct");
                                        itemObj.selected = tool.getXmlNodeAttr(itemChild, "selected");
                                        question.items.push(itemObj);
                                    }
                                }
                                obj.questions.push(question);
                            }
                        }
                        recordInfo.voteSurveyList.push(obj);
                    }
                }
            } else if (moduleName == "lottery") {
                var lotteryArray = moduleArray[i].childNodes;
                for (var j = 0; j < lotteryArray.length; j++) {
                    var lotteryObj = lotteryArray[j];
                    var obj = {};
                    obj.cmd = tool.getXmlNodeAttr(lotteryObj, "cmd");
                    obj.timestamp = tool.getXmlNodeAttr(lotteryObj, "timestamp");
                    obj.info = tool.getXmlNodeAttr(lotteryObj, "info");
                    if (!tool.isBlank(obj.cmd)) {
                        recordInfo.lotteryArray.push(obj);
                    }
                }
            } else if (moduleName == "layout") {
                var layoutArray = moduleArray[i].childNodes;
                for (var j = 0; j < layoutArray.length; j++) {
                    var layoutObj = layoutArray[j];
                    var obj = {};
                    obj.type = tool.getXmlNodeAttr(layoutObj, "type");
                    obj.timestamp = tool.getXmlNodeAttr(layoutObj, "timestamp");
                    if (!tool.isBlank(obj.type)) {
                        recordInfo.layoutArray.push(obj);
                    }
                }
            }
        }
        
        eventConfig.widgetReady = true;
        // widget.activeShakehand();
        getSessionIdByALb();

    } else {
        recordInfo.playing = false;
        sendEvent("onStatus", {type: 4, explain: "not support mobile"});
    }
}

function getSessionIdByALb() {
    //去除了使用java转发请求的代码，如果要使用请使用albProxy参数
    var albParam = "?siteid=" + vodInfo.siteId + "&userid=" + vodInfo.userId + "&confid=" + vodInfo.confId + "&username=" + encodeURIComponent(vodInfo.userName) + "&onlylogin=" + vodInfo.onlyLogin;
    if (!tool.isBlank(vodInfo.hostId)) {
        albParam += "&hostid=" + vodInfo.hostId;
    }
    albParam += "&type=0" + "&r=" + new Date().getTime();
    if (!tool.isBlank(vodInfo.alb)) {
        serverParam.currentAlb = vodInfo.alb;
        var url = vodInfo.protocolPrex + wxxApi + vodInfo.alb + "/license" + albParam;
        tool.ajax({
            url: url,
            success: function (data) {
                data = data.data+'';
                if (tool.isBlank(data)) {
                    getSessionIdByBackALb();
                } else {
                    dealLicense(data);
                }
            },
            error: function(res){
                getSessionIdByBackALb();
            }
        });
    } else {
        getSessionIdByBackALb();
    }
}

function getSessionIdByBackALb() {
    if (!tool.isBlank(vodInfo.backAlb)) {
        serverParam.currentAlb = vodInfo.backAlb;
        var albParam = "?siteid=" + vodInfo.siteId + "&userid=" + vodInfo.userId + "&confid=" + vodInfo.confId + "&username=" + encodeURIComponent(vodInfo.userName) + "&onlylogin=" + vodInfo.onlyLogin;
        if (!tool.isBlank(vodInfo.hostId)) {
            albParam += "&hostid=" + vodInfo.hostId;
        }
        albParam += "&type=0" + "&r=" + new Date().getTime();
        var url = vodInfo.protocolPrex + wxxApi + vodInfo.backAlb + "/license" + albParam;
        tool.ajax({
            url: url,
            success: function (data) {
                data = data.data+'';
                if (tool.isBlank(data)) {
                    getSessionIdByBackALb();
                } else {
                    dealLicense(data);
                }
            },
            error: function () {
                // logger.log("[getSessionIdByBackALb]" + "error" + url);
                console.log("[getSessionIdByBackALb] error");
            }
        });
    }
}

function dealLicense(data) {
    var dataArray = data.split(",");
    var result = dataArray[0];
    if (result == "-1") {
        sendEvent("onStatus", {type: 6, explain: "The people is logining."});
    } else if (result == "0") {
        sendEvent("onStatus", {type: 1, explain: "There are not enough license."});
    } else if (result == undefined || result.length == 0) {
        sendEvent("onStatus", {
            type: 7,
            explain: "Request for the service cannot be fulfilled and you cannot join in."
        });
    } else {
        serverParam.sessionId = result;
        serverParam.startTime = new Date().getTime();
        initRecord();
    }
}

function keepAlive() {
    var liveTime = Math.round(new Date().getTime() - serverParam.startTime);
    var watchMaxDuration = Math.round(serverParam.watchMaxDuration) * 1000;
    var totalTime = recordInfo.duration * 1000;
    var pos = Math.round(app.globalData.currentTime * 1000);
    var tid = "tid=" + vodInfo.tid + ",t=" + liveTime + ",d=" + watchMaxDuration + ",v=" + totalTime + ",sc=" + vodInfo.sc + ",pos=" + pos;
    var keepParam = "?siteid=" + vodInfo.siteId + "&userid=" + vodInfo.userId + "&confid=" + vodInfo.confId + "&onlylogin=" + vodInfo.onlyLogin + "&type=1" + "&sessionid=" + serverParam.sessionId
        + "&needlicense=1" + "&other=" + escape(tid) + "&username=" + encodeURIComponent(vodInfo.userName) + "&r=" + new Date().getTime();
    var url = vodInfo.protocolPrex + wxxApi+ serverParam.currentAlb + "/license" + keepParam;
    tool.ajax({url: url});
}

function initRecord() {
    if (!tool.isBlank(vodInfo.xmlUrl)) {
        mediaInfo.visitUrl = vodInfo.xmlUrl.substring(0, vodInfo.xmlUrl.lastIndexOf("/") + 1);
        mediaInfo.videoUrl = mediaInfo.visitUrl + recordInfo.hls;
        mediaInfo.audioUrl = mediaInfo.visitUrl + recordInfo.hlsAudioOnly;
    }
    sendEvent("onVideoUrl", {"mediaUrl": mediaInfo.videoUrl});
    sendEvent("onAudioUrl", {"mediaUrl": mediaInfo.audioUrl});
    eventConfig.canPlay = true;
    serverParam.keepTimeId = setInterval(function(){
        keepAlive();
    }, serverParam.keepInterval);
    initScheduler();
    initTaskData();
    getRemoteData();
    var data = {};
    if (!tool.isBlank(recordInfo.jsContent)) {
        data.supportChatSync = true;
    }
    setTimeout(function(){
        channel.send("onDataReady", data);
    }, 500);
}


function initTaskData() {
    if (!tool.isEmpty(recordInfo.docArray) && recordInfo.docArray.length > 0) {
        var chapterList = {};
        chapterList.list = new Array();
        for (var i = 0; i < recordInfo.docArray.length; i++) {
            var docObj = recordInfo.docArray[i];
            docObj.hlsid = docObj.hls.replace("hls/", "").replace(".png", "");
            docObj.hls = mediaInfo.visitUrl + docObj.hls;
            tasks.addTask(TASK_TYPE.PPT, docObj, docObj.startTime * 1000, docObj.endTime * 1000, true, "between");
            var chapterObj = {
                doc: docObj.docName,
                title: docObj.title,
                starttimestamp: docObj.startTime * 1000,
                stoptimestamp: docObj.endTime * 1000
            };
            chapterList.list.push(chapterObj);
            var pageInfo = {
                hlsid: docObj.hlsid,
                starttimestamp: docObj.startTime * 1000,
                stoptimestamp: docObj.endTime * 1000,
                annodata: []
            };
            pptRecord.pageRecordInfo.push(pageInfo);
        }
        sendEvent("onChapter", chapterList);
    }

    if (!tool.isBlank(recordInfo.duration)) {
        sendEvent("onFileDuration", {duration: recordInfo.duration * 1000})
    }

    if (!tool.isEmpty(recordInfo.voteSurveyList) && recordInfo.voteSurveyList.length > 0) {
        for (var i = 0; i < recordInfo.voteSurveyList.length; i++) {
            var voteObj = recordInfo.voteSurveyList[i];
            var startTime = voteObj.startTime * 1000;
            voteObj.startTime = undefined;
            tasks.addTask(TASK_TYPE.VOTE, voteObj, startTime, null);
        }
    }

    if (!tool.isEmpty(recordInfo.lotteryArray) && recordInfo.lotteryArray.length > 0) {
        for (var i = 0; i < recordInfo.lotteryArray.length; i++) {
            var lotteryObj = recordInfo.lotteryArray[i];
            var dataObj = {};
            if (lotteryObj.cmd == "1") {
                dataObj.action = "start";
            } else if (lotteryObj.cmd == "2") {
                dataObj.action = "stop";
                dataObj.user = lotteryObj.info
            } else {
                dataObj.action = "abort";
            }
            tasks.addTask(TASK_TYPE.LOTTERY, dataObj, lotteryObj.timestamp * 1000, null);
        }
    }

    if (!tool.isEmpty(recordInfo.layoutArray) && recordInfo.layoutArray.length > 0) {
        for (var i = 0; i < recordInfo.layoutArray.length; i++) {
            var layoutObj = recordInfo.layoutArray[i];
            tasks.addTask(TASK_TYPE.LAYOUT, {focus: layoutObj.type}, layoutObj.timestamp * 1000, null);
        }
    }
}

GS_MEDIA.initMediaEvent = {
    play: function(){
        if (eventConfig.firstPlay) {
            tasks.start();
            eventConfig.firstPlay = false;
            sendEvent("loadStart", {});
        } else {
            sendEvent("onPlay", {timestamp: app.globalData.currentTime * 1000});
        }
    },
    pause: function(){
        sendEvent("onPause", {timestamp: app.globalData.currentTime * 1000});
    },
    ended: function(){
        sendEvent("onStop", {});
    },
    playing: function(){
        if (eventConfig.firstCanPlay) {
            eventConfig.firstCanPlay = false;
            sendEvent("onStatus", {type: 9, explain: "media can play"});
        }
    },
    seeked: function(){
        if (eventConfig.seeking) {
            eventConfig.seeking = false;
            var currentTime = parseFloat(app.globalData.currentTime) * 1000
            sendEvent("onSeekCompleted", {timestamp: currentTime});
            synChat.lastTime = currentTime;
            synChat.playTime = currentTime;
            pptRecord.recordSeekTime(currentTime);
        }
    },
    seeking: function(){
        eventConfig.seeking = true;
    },
    timeupdate: function(){
        var currentTime = app.globalData.currentTime;
        var currentStamp = parseFloat(currentTime) * 1000;
        pptRecord.recordDrawTime(currentStamp);
        synChat.chatCurrent(currentStamp);
    },
    timeRecord: function(){
        var currentTime = app.globalData.currentTime;
        if (currentTime > serverParam.lastTime) {
            serverParam.watchMaxDuration += currentTime - serverParam.lastTime;
        }
        serverParam.lastTime = currentTime;
    }
}

function getRemoteData() {
    if (!tool.isBlank(recordInfo.jsContent)) {
        try {
            var jshtml = mediaInfo.visitUrl + recordInfo.jsContent;
            tool.ajax({
                type: 'GET',
                url: jshtml,
                dataType: 'json',
                success: function (data) {
                    data = data.data;
                    pptGetRecord(data);
                    synChat.chatGetSyn(data);
                },
                error: function (status) {
                }
            });
        } catch (e) {
        }
    }

    if(!tool.isBlank(recordInfo.liveTextFile)){
        try {
            var url = mediaInfo.visitUrl + recordInfo.liveTextFile;
            tool.ajax({
                type: 'GET',
                url: url,
                success: function (xml) {
                    xml = tool.parseXml(xml.data);
                    var rootNode=xml.documentElement;
                    var LiveTextItems = rootNode.getElementsByTagName("LiveTextItem");
                    var liveTextArray = new Array();
                    for(var i=0;i<LiveTextItems.length;i++){
                        var liveTextObj={};
                        var liveTextNode=LiveTextItems[i];
                        liveTextObj.time = tool.getXmlNodeAttr(liveTextNode,"timestamp");
                        liveTextObj.lang = tool.getXmlNodeAttr(liveTextNode,"lang");
                        liveTextObj.content = tool.trim(liveTextNode.textContent);
                        liveTextArray.push(liveTextObj);
                    }
                    if (liveTextArray.length > 0) {
                        sendEvent("onTextWebcast", {list: liveTextArray});
                    }
                },
                error: function (status) {
                }
            });
        } catch (e) {
        }
    }
}

function checkVote(obj) {
    if(tool.isEmpty(obj) || tool.isEmpty(obj.id)){
        return {result: false, type: 2, explain: "Submission of data is empty."};
    }
    if (tool.isEmpty(obj.questions) || obj.questions.length <= 0) {
        return {result: false, type: 2, explain: "The questions is empty."};
    }
    if (tool.isEmpty(obj.skip)) {
        return {result: false, type: 2, explain: "The skip is empty."};
    }
    if (!(obj.skip == "true" || obj.skip == "false")) {
        return {result: false, type: 1, explain: "The value of skip is error."};
    }


    for (var i = 0; i < obj.questions.length; i++) {
        var question = obj.questions[i];
        if (tool.isEmpty(question.id)) {
            return {result: false, type: 2, explain: "The id of question is empty."};
        }
        if (!(question.type == "text" || question.type == "multi" || question.type == "single")) {
            return {result: false, type: 2, explain: "The type of question is empty."};
        }

        if (question.type != "text") {
            if (tool.isEmpty(question.answer) && (obj.skip != "true")) {
                return {result: false, type: 2, explain: "The answer of question is empty."};
            }
        } else {
            if (tool.isEmpty(question.text) && (obj.skip != "true")) {
                return {result: false, type: 2, explain: "The text of question is empty."};
            }
        }
    }
    return {result: true};
}

function sendVoteSurvey(commandObj) {
    var rootName = "voteSubmit";
    var bool = true;
    var xml = tool.createXml({
        nodeName: rootName,
        attrArray: [{name: "tid", value: vodInfo.tid}, 
            {name: "siteid", value: vodInfo.siteId}, 
            {name: "userid", value: vodInfo.userId}, 
            {name: "username", value: vodInfo.userName}, 
            {name: "confid", value: vodInfo.confId}, 
            {name: "live", value: "false"}]
    }, "UTF-8");
    var commandNode = tool.createNode({
        nodeName: "command",
        attrArray: [{name: "id", value: commandObj.id}]
    });
    var questionArray = commandObj.questions;
    for (var j = 0; j < questionArray.length; j++) {
        var questionObj = questionArray[j];
        var questionNode = tool.createNode({
            nodeName: "question",
            attrArray: [{name: "id", value: questionObj.id}]
        });
        if (questionObj.type == "text") {
            if (bool) {
                if (tool.trim(questionObj.text) != "") {
                    var itemNode = tool.createNode({
                        nodeName: "item",
                        value: questionObj.text,
                        attrArray: [{name: "idx", value: 0}]
                    });
                    questionNode = tool.addNode(questionNode, itemNode);
                }
            } else {
                var itemNode = tool.createNode({nodeName: "item", value: questionObj.text});
                questionNode = tool.addNode(questionNode, itemNode);
            }
        } else {
            if (tool.trim(questionObj.answer) != "") {
                var items = questionObj.answer.split(",");
                for (var k = 0; k < items.length; k++) {
                    var resultItem = items[k] - 1;
                    var itemNode = tool.createNode({
                        nodeName: "item",
                        attrArray: [{name: "idx", value: resultItem}]
                    });
                    questionNode = tool.addNode(questionNode, itemNode);
                }
            }
        }
        commandNode = tool.addNode(commandNode, questionNode);
    }
    xml = tool.addNode(xml, commandNode);
    // logger.log("[sendVoteSurvey]:", "info", xml);
    tool.ajax({type: "POST", url: vodInfo.xmlApi, data: xml});
    
}
module.exports = GS_MEDIA;
