function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
        var context = "";
        if (r != null)
            context = r[2];
        reg = null;
        r = null;
        return context == null || context == "" || context == "undefined" ? "" : context;
    }

var app = new Vue({
        el:'#app',
        data:{
            page:undefined,
            tid:undefined,
            nowpage:undefined,
            isshowimg:false,
            iserror:false
        },
        methods:{
            showimg:function () {
                this.isshowimg = !this.isshowimg

            },
            topage:function (pagenum) {
                if(pagenum<=this.page.totalpage){
                    this.nowpage=pagenum
                }
            },
            needShow:function (mode) {
                var Storage = window.localStorage
                if(mode){  //记忆-1
                    Storage['needShow'] =this.isshowimg
                }
                else{     //读取-0
                    if('needShow' in Storage){
                        this.isshowimg = Storage['needShow'] !== 'false';
                    }
                    else{
                        this.isshowimg = false
                    }
                }
            },
            initWebSocket(){ //初始化weosocket
                const wsuri = "ws://106.15.121.35:8899";
                this.websock = new WebSocket(wsuri);
                this.websock.onmessage = this.websocketonmessage;
                this.websock.onopen = this.websocketonopen;
                this.websock.onerror = this.websocketonerror;
            },
            websocketonopen(){ //连接建立之后执行send方法发送数据
                let actions = {
                    tid : this.tid||7112008,
                    page : this.nowpage||1
                };
                this.websock.send(JSON.stringify(actions))
            },
            websocketonerror(){//连接建立失败重连
                this.initWebSocket();
            },
            websocketonmessage(e){ //数据接收
                const resp = JSON.parse(e.data);
                if('error' in resp){
                    this.iserror = true
                }
                else{
                    this.page = resp
                    this.websock.close()
                }
            },
        },
        created(){
            this.tid = GetQueryString('tid')
            this.nowpage = GetQueryString('page')
            this.nowpage =1
            this.needShow()
            setTimeout(()=>{
                if(!this.page){
                    this.iserror = true
                }
            },5000)
        },
        watch:{
            nowpage:function(){
                this.initWebSocket()
            },
            isshowimg:function () {
                this.needShow(1)
            }
        }
    });
