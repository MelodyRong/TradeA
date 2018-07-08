document.write("<script type='text/javascript' src='js/MyAlert.js'></script>");
document.write("<script type='text/javascript' src='js/loginInOrOut.js'></script>");
document.write("<script type='text/javascript' src='js/reclassify.js'></script>");
document.write("<script src='js/jqueryPagination.js'></script>");    //分页
document.write("<script type='text/javascript' src='js/NetworkRequest.js'></script>");    //网络请求
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
    function getMyDate(str){
        var oDate = new Date(str),
            oYear = oDate.getFullYear(),
            oMonth = oDate.getMonth()+1,
            oDay = oDate.getDate(),
            oHour = oDate.getHours(),
            oMin = oDate.getMinutes(),
            oSen = oDate.getSeconds(),
            oTime = oYear +'-'+ getzf(oMonth) +'-'+ getzf(oDay) +' '+ getzf(oHour) +':'+ getzf(oMin) +':'+getzf(oSen);//最后拼接时间
        return oTime;
    };
    //补0操作
    function getzf(num){
        if(parseInt(num) < 10){
            num = '0'+num;
        }
        return num;
    }
    //从sess中取到str
    var sessionStr = window.sessionStorage.getItem("SESSIONSTR");
    //从sess中取到userid
    var userid = window.sessionStorage.getItem("USERID");
    //从sess中取到frimid
    var frimid = window.sessionStorage.getItem("FRIMID");
    //重大新闻
	function informationData(column,page) {
        return JSON.stringify({
            "ctype":"Web",
            "name":"articleList",
            "reqbody": {
                "column": column,  //0全部   1重大新闻    2平台动态
                "pageIndex": page,
                "pageSize": 10
            }
        })
    }
    homePageAjax(httpheader,informationData(1,1),informationSuccess);
	function informationSuccess(data) {
	    console.log(data);
	    if(data.retcode == 0){
            var retData = data.respbody.list;
            if(retData.length == 0){
                $("#BreakingNews").html("暂无数据");
                $("#BreakingNews").css("fontSize","20px");
                $("#BreakingNews").css("textAlign","center");
                $("#BreakingNews").css("paddingTop","50px");
            }else{
                for (var i=0;i<retData.length;i++){
                    var ttime = getMyDate(retData[i].time);
                    if(retData[i].url == ""){
                        window.sessionStorage.setItem("NOTICETITLE","");
                        window.sessionStorage.setItem("NOTICEDETAILS","");
                        retData[i].url = "noticeDetailsPage.html";
                    }
                    $("#BreakingNews").append('<li style="height: 35px"><a href="'
                        + retData[i].url
                        +'" class="journalism">'
                        +'<span class="spanLeft">'
                        +retData[i].title
                        +'</span>'
                        +'<span class="spanRight">'
                        + ttime
                        +'</span>'
                        +'</a>'
                        +'</li>');
                }
                //总条数
                var totalSizes = data.respbody.total;
                //总页数
                if(totalSizes == 0){
                    var totalPages = 0;
                }else{
                    var totalPages = Math.ceil(totalSizes/(retData.length));
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
                        homePageAjax(httpheader,informationData(1,index.getCurrent()), information_PagingZDSuccess);
                    }
                });
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
    function information_PagingZDSuccess(data){
        if(data.retcode == 0) {
            var retData = data.respbody.list;
            if(retData.length == 0){
                $("#BreakingNews").html("暂无数据");
                $("#BreakingNews").css("fontSize","20px");
                $("#BreakingNews").css("textAlign","center");
                $("#BreakingNews").css("paddingTop","50px");
            }else {
                for (var i = 0; i < retData.length; i++) {
                    var ttime = getMyDate(retData[i].time);
                    if(retData[i].url == ""){
                        window.sessionStorage.setItem("NOTICETITLE","");
                        window.sessionStorage.setItem("NOTICEDETAILS","");
                        retData[i].url = "noticeDetailsPage.html";
                    }
                    $("#BreakingNews").append('<li style="height: 35px"><a href="'
                        + retData[i].url
                        +'" class="journalism">'
                        +'<span class="spanLeft">'
                        +retData[i].title
                        +'</span>'
                        +'<span class="spanRight">'
                        + ttime
                        +'</span>'
                        +'</a>'
                        +'</li>');
                }
            }
        }else{
            if(data.retcode == -17401){
                loginOut();
                window.sessionStorage.setItem("LOGINSTATE", "flase");
                window.sessionStorage.setItem("LOGINSOURCE", 1);
                window.location.href = "loginPage.html";
            }
        }
    }
    //平台动态
    homePageAjax(httpheader,informationData(2,1),stateSuccess);
	function stateSuccess(data) {
	    console.log(data);
        if(data.retcode == 0){
            var retData = data.respbody.list;
            if(retData.length == 0){
                $("#DynamicPlatform").html("暂无数据");
                $("#DynamicPlatform").css("fontSize","20px");
                $("#DynamicPlatform").css("textAlign","center");
                $("#DynamicPlatform").css("paddingTop","50px");
            }else {
                for (var i = 0; i < retData.length; i++) {
                    var ttime = getMyDate(retData[i].time);
                    if(retData[i].url == ""){
                        window.sessionStorage.setItem("NOTICETITLE","");
                        window.sessionStorage.setItem("NOTICEDETAILS","");
                        retData[i].url = "noticeDetailsPage.html";
                    }
                    $("#DynamicPlatform").append('<li style="height: 35px"><a href="'
                        + retData[i].url
                        +'" class="journalism">'
                        +'<span class="spanLeft">'
                        +retData[i].title
                        +'</span>'
                        +'<span class="spanRight">'
                        + ttime
                        +'</span>'
                        +'</a>'
                        +'</li>');
                }
            }
            //总条数
            var totalSizes = data.respbody.total;
            //总页数
            if(totalSizes == 0){
                var totalPages = 0;
            }else{
                var totalPages = Math.ceil(totalSizes/(retData.length));
            }
            //分页
            $('.M-box111').pagination({
                pageCount:totalPages,    //总页数
                totalData:totalSizes,     //总条数
                showData:12,    //每页显示的条数
                isHide:true,     //总页数为0或1时隐藏分页控件
                mode: 'fixed',
                callback:function (index) {    //回调函数，参数"index"为当前页
                    console.log("当前为第" + index.getCurrent() + "页");
                    homePageAjax(httpheader,informationData(1,index.getCurrent()), information_PagingPTSuccess);
                }
            });
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
    function information_PagingPTSuccess(data) {
        if(data.retcode == 0) {
            var retData = data.respbody.list;
            if(retData.length == 0){
                $("#DynamicPlatform").html("暂无数据");
                $("#DynamicPlatform").css("fontSize","20px");
                $("#DynamicPlatform").css("textAlign","center");
                $("#DynamicPlatform").css("paddingTop","50px");
            }else{
                for (var i = 0; i < retData.length; i++) {
                    var ttime = getMyDate(retData[i].time);
                    if(retData[i].url == ""){
                        window.sessionStorage.setItem("NOTICETITLE","");
                        window.sessionStorage.setItem("NOTICEDETAILS","");
                        retData[i].url = "noticeDetailsPage.html";
                    }
                    $("#DynamicPlatform").append('<li style="height: 35px"><a href="'
                        + retData[i].url
                        +'" class="journalism">'
                        +'<span class="spanLeft">'
                        +retData[i].title
                        +'</span>'
                        +'<span class="spanRight">'
                        + ttime
                        +'</span>'
                        +'</a>'
                        +'</li>');
                }
            }

        }else{
            if(data.retcode == 0){
                loginOut();
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