const app = getApp();
Component({
    /**
    * 组件的属性列表
    */
    properties: {
        //整个的高度
        lheight: {
            type: String,
            value: ''
        }
    },

    /**
    * 组件的初始数据
    */
    data: {
        currentTime: 0,
        chapterList: [],//章节信息
        condition: false//有无章节
    },

    ready: function (){
        let that = this;
        this.channel = app.globalData.channel;
        //获取章节信息
        this.channel.bind("onChapter", res=>{
            console.log('获取到章节信息');
            let list = res.data.list;
            for(let i = 0; i < list.length; i++){
                // let timeLong = list[i].stoptimestamp - list[i].starttimestamp;
                list[i].timeLong = timeDeal(list[i].starttimestamp);
            }
            that.setData({
                chapterList: list,
                condition: true
            });
        });

        let timeDeal = res=>{
            let time = parseInt(res / 1000);
            let h = parseInt(time / 3600);
            let m = parseInt((time % 3600) / 60);
            let s = time % 60;
            return numTen(h) + ':' + numTen(m) + ':' + numTen(s);
        }

        let numTen = m=>{
            return m>9?m:'0'+m;
        }

        this.t = setInterval(res=>{
            that.setData({
                currentTime: app.globalData.currentTime * 1000
            });
        }, 1000);
    },

    /**
    * 组件的方法列表
    */
    methods: {
        goSeek: res=>{
            let start = parseInt(res.currentTarget.dataset.start / 1000);
            let video = wx.createVideoContext('myVideo');
            wx.createSelectorQuery()._defaultComponent.refreshCanvas();
            video.seek(start);
        }
        
    },

    onUnload: function(res){
        clearInterval(this.t);
        this.t = null;
    }
})
