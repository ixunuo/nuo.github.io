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
        }
    },
    created(){
        this.tid = GetQueryString('tid')
        this.nowpage = GetQueryString('page')
        this.nowpage =1

    },
    watch:{
        nowpage:function(newVal){
            var url = "https://service-ehdebvif-1300545711.sh.apigw.tencentcs.com/release/zhuanPage?tid="+this.tid+'&page='+newVal
            this.$http.jsonp(url).then(result => {
                this.page = result.body;
                this.needShow()
            },result=>{
                this.iserror = true
            });
        },
        isshowimg:function () {
            this.needShow(1)
        }
    }

});
