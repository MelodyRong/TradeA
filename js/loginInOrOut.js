document.write("<script src='http://libs.baidu.com/jquery/2.0.0/jquery.min.js'></script>");
document.write("<script type='text/javascript' src='js/MyAlert.js'></script>");
document.write("<script type='text/javascript' src='js/NetworkRequest.js'></script>");    //网络请求
// var HTTPHEADER = "http://106.14.175.148:18203/";
$(function () {
    function homePageAjax(url, retData, successFunction) {
        $.ajax({
            type: "post",
            url: url,
            contentType: 'application/json;charset=UTF-8',
            dataType: 'json',
            data: retData,
            success: function (data) {
                successFunction(data);
            },
            error: function (data) {
                myToast("无法连接到网络，请稍后再试");
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
    //从sess中取出登录状态，提示用户是否现在去登录
    var loginState = window.sessionStorage.getItem("LOGINSTATE");
    //从sess中取出sessionStr值
    var sessionStr = window.sessionStorage.getItem("SESSIONSTR");
    //如果登录状态是true，则获取用户信息，并赋值给页面头部
    var userid = window.sessionStorage.getItem("USERID");
    if (loginState == null) {
        $("#loginstate").html("登录");
        myConfirm({
            title: '提示',
            message: '您尚未登录，是否现在去登录？',
            callback: function () {
                window.location.href = "loginPage.html";
            }
        })
    } else if (loginState == "true") {
        //从sess中获取sessStr
        //如果为true请求一次个人信息获取用户名称
        var userData = JSON.stringify({
            "name": "userInfo",
            "ctype": "Web",
            "sessionStr": sessionStr,
            "userid": userid
        });
        homePageAjax(httpheader, userData, userSuccess);
        function userSuccess(data) {
            console.log(data);
            if (data.retcode == 0) {
                var retData = data.respbody;
                //将firmType存入sess中    1个人用户   3分销商用户    6企业用户
                var firmType = retData.firmType;
                window.sessionStorage.setItem("FIRMTYPE",firmType);
                //将isChecked存入sess     1已审核   0正在审核中（您的账号正在审核中，还不能进行交易）
                var isChecked = retData.isChecked;
                window.sessionStorage.setItem("ISCHECKED",isChecked);
                if (retData.name == undefined) {
                    $("#loginstate").html(retData.mobile);
                } else {
                    $("#loginstate").html(retData.name);
                }
            }else{
                if(data.retcode == -17401){
                    window.sessionStorage.setItem("LOGINSTATE", "flase");
                    window.location.href = "loginPage.html";
                }else{
                    console.log(data.msg);
                    myToast(data.msg);
                }
            }
        }

        $("#loginstate").attr('href', '#');
        //显示个人中心和/
        $("#mycentent01").css("display", "block");
        $("#mycentent02").css("display", "block");
        $("#mycentent03").css("display", "block");
        $("#mycentent04").css("display", "block");
        $("#issueBuy").css("display", "block");
        $("#issueBuyS").css("display", "block");
        $("#issueSell").css("display", "block");
        $("#issueSellS").css("display", "block");
        //隐藏注册按钮和|
        $("#register").css("display", "none");
        $("#mycentent05").css("display", "none");
        var li01 = document.createElement("li");
        li01.className = "top_dg_right_list";
        li01.innerHTML = "|";
        li01.id = "li01";
        $("#top_dg_right").append(li01);
        var li = document.createElement("li");
        li.className = "top_dg_right_list";
        li.innerHTML = "退出登录";
        li.id = "loginOut";
        $("#top_dg_right").append(li);
    }

    //    退出登录
    $("#loginOut").click(function () {
        myConfirm({
            title: '提示',
            message: '您要退出登录吗？',
            callback: function () {
                var loginOutData = JSON.stringify({
                    "name": "logout",
                    "ctype": "Web",
                    "userid": userid,
                    "sessionStr": sessionStr
                })
                homePageAjax(httpheader, loginOutData, loginOutSuccess);
            }
        })
    })

    //退出登录成功函数
    function loginOutSuccess(data) {
        if (data.retcode == 0) {
            myToast("退出登录成功");
            //取消用户名改为登录
            $("#loginstate").html("登录");
            $("#loginstate").attr("href", "loginPage.html");
            //删除退出登录按钮
            $("#li01").empty();
            $("#loginOut").empty();
            //删除sess中的用户id和改变sess中的登录状态和sessStr
            window.sessionStorage.setItem("USERID", " ");
            window.sessionStorage.setItem("LOGINSTATE", "flase");
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
        } else {
            console.log(data.msg);
            myToast(data.msg);
        }
    }
})