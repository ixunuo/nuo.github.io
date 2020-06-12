var app = new Vue({
    el:'#app',
    data:{
        page:undefined,
        tid:undefined,
        nowpage:'1',
        isshowimg:false,
        iserror:false,
        isloading:true,
        loadingCss:''
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
        this.nowpage = GetQueryString('page')||'1'
        // this.nowpage =1
        if(Data){
            this.isloading = false
            this.page = Data
            document.querySelector('#loading').style.display='none'
            // el.style.display='none'
        }
        else{
            this.iserror = true
            this.isloading = false
            this.loadingCss = ''
            document.querySelector('#loading').style.display='none'
        }
    },
    watch:{
        nowpage:function(newVal){
            this.loadingCss = {filter: 'blur(20px)'}
            document.querySelector('#loading').style.display='block'
            var url = "https://zhuan-vercel.now.sh/api?tid="+this.tid+'&page='+newVal
            this.$http.jsonp(url).then(result => {
                this.page = result.body;
                this.needShow()
                this.loadingCss = ''
                document.querySelector('#loading').style.display='none'
            },result=>{
                this.iserror = true
                this.loadingCss = ''
                document.querySelector('#loading').style.display='none'
            });
        },
        isshowimg:function () {
            this.needShow(1)
        }
    }

});
