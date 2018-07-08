document.write("<script type='text/javascript' src='js/MyAlert.js'></script>");
document.write("<script type='text/javascript' src='js/loginInOrOut.js'></script>");
document.write("<script type='text/javascript' src='js/reclassify.js'></script>");
document.write("<script type='text/javascript' src='js/NetworkRequest.js'></script>");    //网络请求
document.write("<script src='js/jqueryPagination.js'></script>");    //分页
// var httpheader = "http://106.14.175.148:18203/";
$(function(){
    //ajax函数
    function homePageAjax(url,retData,successFunction){
        $.ajax({
            type:"post",
            url:url,
            contentType:'application/json;charset=UTF-8',
            dataType:'json',
            data:retData,
            success:function (data) {
                successFunction(data);
            },
            error:function(data){
                myToast('无法连接到网络，请稍后再试');
            }
        })
    }
    function loginOut() {
        //取消用户名改为登录
        $("#loginstate").html("登录");
        $("#loginstate").attr("href", "loginPage.html");
        //删除退出登录按钮
        $("#li01").empty();
        $("#loginOut").empty();
        //删除sess中的用户id和改变sess中的登录状态和sessStr
        window.sessionStorage.setItem("USERID", " ");
        window.sessionStorage.setItem("LOGINSTATE", " ");
        window.sessionStorage.setItem("SESSIONSTR", " ");
        //隐藏个人中心和/
        $("#mycentent01").css("display", "none");
        $("#mycentent02").css("display", "none");
        $("#mycentent03").css("display", "none");
        $("#mycentent04").css("display", "none");
        $("#issueBuy").css("display", "none");
        $("#issueBuyS").css("display", "none");
        $("#issueSell").css("display", "none");
        $("#issueSellS").css("display", "none");
        //显示注册按钮和|
        $("#register").css("display", "block");
        $("#mycentent05").css("display", "block");
    }
    //从sess中取到str
    var sessionStr = window.sessionStorage.getItem("SESSIONSTR");
    //从sess中取到userid
    var userid = window.sessionStorage.getItem("USERID");
    //从sess中取到frimid
    var frimid = window.sessionStorage.getItem("FRIMID");


    //公告参数
    function noticeData(pageIndex) {
        return JSON.stringify({
            "ctype":"Web",
            "name":"queryAnnouncement",
            "reqbody":{
                "pageIndex":pageIndex,
                "pageSize":10,
                "type":1
            }
        })
    };
    homePageAjax(httpheader,noticeData(1),noticeSuccess);
    function noticeSuccess(data) {
        console.log(data);
        if(data.retcode == 0){
            var retData = data.respbody.announcementList;
            console.log(retData);
            if(retData.length == 0){
                $("#BreakingNews").html("暂无数据");
                $("#BreakingNews").css("fontSize","20px");
                $("#BreakingNews").css("textAlign","center");
            }else{
                function toLocaleString() {
                    var M = this.getMinutes();//获取
                    M = M > 9 ? M : "0" + M; //如果分钟小于10,则在前面加0补充为两位数字
                    return this.getFullYear() + "年" + (this.getMonth() + 1) + "月" + this.getDate() + "日 " + this.getHours() + "：" + M;
                };
                for (var i=0;i<retData.length;i++){
                    //将后台返回的毫秒值转换成时间
                    var ttime = new Date(retData[i].updatetime).toLocaleString().replace(/:\d{1,2}$/, ' ');
                    $("#BreakingNews").append('<li class="titleStyle"><a style="display: inline-flex;" class="NoticeDetails" accesskey=" ' + retData[i].content +'">'+ retData[i].title  + '&nbsp;' + "(" + ttime + ")" +'</a></li>');
                }
                //总条数
                var totalSizes = retData.length;
                //总页数
                if(totalSizes == 0){
                    var totalPages = 0;
                }else{
                    var totalPages = Math.ceil(totalSizes/12);
                }
                //分页
                $('.M-box11').pagination({
                    pageCount:totalPages,    //总页数
                    totalData:totalSizes,     //总条数
                    showData:12,    //每页显示的条数
                    isHide:true,     //总页数为0或1时隐藏分页控件
                    mode: 'fixed',
                    callback:function (index) {    //回调函数，参数"index"为当前页
                        console.log("当前为第" + index.getCurrent() + "页");
                        homePageAjax(httpheader,noticeData(index.getCurrent()), notice_PagingSuccess);
                    }
                });

                //点击公告标题进入公告详情页
                var NoticeDetails = $(".NoticeDetails");
                console.log(NoticeDetails);
                NoticeDetails.click(function () {
                    var title = this.innerHTML;
                    console.log(this.accessKey);
                    window.sessionStorage.setItem("NOTICETITLE",title);    //标题
                    window.sessionStorage.setItem("NOTICEDETAILS",this.accessKey);   //内容
                    window.location.href = "noticeDetailsPage.html";
                })
            }
        }else{
            if(data.retcode == -17401){
                loginOut();
                window.sessionStorage.setItem("LOGINSTATE", "flase");
                window.sessionStorage.setItem("LOGINSOURCE", 1);
                window.location.href = "loginPage.html";
            }else{
                myToast(data.msg);
            }
        }
    }
    function notice_PagingSuccess(data) {
        console.log(data);
        if(data.retcode == 0){
            var retData = data.respbody.announcementList;
            console.log(retData);
            if(retData.length == 0){
                $("#BreakingNews").html("暂无数据");
                $("#BreakingNews").css("fontSize","20px");
                $("#BreakingNews").css("textAlign","center");
            }else{
                function toLocaleString() {
                    var M = this.getMinutes();//获取
                    M = M > 9 ? M : "0" + M; //如果分钟小于10,则在前面加0补充为两位数字
                    return this.getFullYear() + "年" + (this.getMonth() + 1) + "月" + this.getDate() + "日 " + this.getHours() + "：" + M;
                };
                for (var i=0;i<retData.length;i++){
                    //将后台返回的毫秒值转换成时间
                    var ttime = new Date(retData[i].updatetime).toLocaleString().replace(/:\d{1,2}$/, ' ');
                    $("#BreakingNews").append('<li class="titleStyle">'+ retData[i].title  + "(" + ttime + ")" +'</li>');
                }
            }
        }else{
            if(data.retcode == -17401){
                loginOut();
                window.sessionStorage.setItem("LOGINSTATE", "flase");
                window.sessionStorage.setItem("LOGINSOURCE", 1);
                window.location.href = "loginPage.html";
            }else{
                myToast(data.msg);
            }
        }
    }

    //点击搜索按钮发起商品搜索
    $("#search_inpTwo").on("click",function () {
        //讲输入的内容存储在sess中一并传递
        window.sessionStorage.setItem("SEARCH",$("#search_inpOne").val());
        window.location.href = "searchPage.html";
    });
    $(document).keyup(function(event){
        if(event.keyCode ==13){
            window.sessionStorage.setItem("SEARCH", $("#search_inpOne").val());
            window.location.href = "searchPage.html";
        }
    });
})