document.write("<script src='js/MyAlert.js'></script>");
document.write("<script src='js/md5.js'></script>");
document.write("<script type='text/javascript' src='js/NetworkRequest.js'></script>");    //网络请求
// var HTTPHEADER = "http://119.90.97.146:18203/";
function httpAjax(url,retData,successHandler){
    $.ajax({
        url: url,
        data: retData,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            successHandler(data);
        },
        error: function (data,XMLHttpRequest, textStatus, errorThrown) {

            myToast("无法连接到网络，请稍后再试");
        }
    })
}


$(function(){
    //从sess中获取上次登录的账号和密码
    if(localStorage.hasOwnProperty('USERMOBILE') == true){
        $("#userName").val(localStorage.getItem("USERMOBILE"));
        $("#userPassWord").val(localStorage.getItem("USERPWD"));
    }else{
        $("#userName").val("");
        $("#userPassWord").val("");
    }
    //登录请求(参数：url，retData，successFunction)
    $("#userLogin").click(function(){
        //获取登录账号
        var userName = $("#userName").val();
        if(userName == ""){
            myToast("请输入登录账号");
            return  false;
        }else if(!(/^1[3|4|5|8|6|7][0-9]\d{4,8}$/.test(userName))){
            myToast('请输入正确的手机号码');
            return false;
        }
        console.log(userName);
        //获取登录密码
        var userPassWord = $("#userPassWord").val();
        console.log(userPassWord);
        if(userPassWord == ""){
            myToast("请输入登录密码");
            return false;
        }
        //md5加密
        var pswordMd5 = hex_md5(userName + userPassWord);
        console.log(pswordMd5);

        //判断是否记住密码
        var val=$('#rememberPwd:checkbox[name="remenber"]:checked').val();
        if(val==null){
            console.log("什么也没选中!");
        }else{
            console.log("你选中了记住密码");
            localStorage.setItem("USERMOBILE",$("#userName").val());
            localStorage.setItem("USERPWD",$("#userPassWord").val());
        }

        var loginData = JSON.stringify({
            "name": "login",
            "ctype": "Web",
            "reqbody": {
                "mobile": userName,
                "pwd": pswordMd5
            }
        });
        //将用户名及密码存储到sess
        window.sessionStorage.setItem("USERNAME",userName);
        window.sessionStorage.setItem("USERPASSWORD",userPassWord);
        httpAjax(httpheader,loginData,LoginSuccess);
    })
    //登录成功函数
    function LoginSuccess(data){
        var loginSource = window.sessionStorage.getItem("LOGINSOURCE");
        if(data.retcode == 0){
            myToast("登录成功");
            window.sessionStorage.setItem("USERID",data.respbody.userid);     //登录成功sess存储true，将用户id和存储到sess
            window.sessionStorage.setItem("LOGINSTATE",true);     //将登录状态存储在sess中
            window.sessionStorage.setItem("SESSIONSTR",data.respbody.sessionStr);     //将sessStr存储在sess中
            window.sessionStorage.setItem("FRIMID",data.respbody.firmid);     //将frimId存储在sess中
            console.log(loginSource);
            if(loginSource == "1"){
                window.history.go(-1);
            }else{
                window.location.href = "index.html";
            }

        }else if(data.retcode == 17401){
            myToast("登录状态已失效，请重新登录");
        }else{
            myToast(data.msg);
        }
    }
    $("#forgetPsw").on("click",function(){    //    忘记密码
        window.location.href = "findpwd.html";
    })
});