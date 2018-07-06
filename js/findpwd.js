document.write("<script src='js/MyAlert.js'></script>");
document.write("<script src='js/md5.js'></script>");
document.write("<script type='text/javascript' src='js/NetworkRequest.js'></script>");    //网络请求
// var httpheader = "http://119.90.97.146:18203/";

$(function () {
    function findPageAjax(url, retData, successFunction) {
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
    // console.log($("#UserAgreement").prop("checked"));
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
    var YZ_code = $("#YZcode");
    //点击按钮连接后台获取验证码

    // 点击获取验证码
    YZ_code.click(function () {
        // alert(1);

        //获取手机账号
        var userNumber = $("#phoneCode").val();
        console.log(userNumber);
        if(userNumber == "") {
            myToast("手机号码不能为空");
            return false;
        }
        if (!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(userNumber))) {
            myToast("请输入正确的手机号码");
            return false;
        }
        //  请求获取验证码的后台数据
        var authCode = JSON.stringify({
            "name": "retrievePswCode",
            "ctype": "Web",
            "reqbody":
            {
                "mobile": userNumber,
                "captchaId": "",
                "captcha": ""
            }
        })
        findPageAjax(httpheader, authCode, authCodeSuccess);

    })

    function authCodeSuccess(data) {
        console.log(data);
        if (data.retcode == 0) {
            myToast("验证码发送成功");
            var number = 120;
            var timer = null;
            $("#YZcode").attr("disabled", true);   //禁用按钮
            $("#YZcode").css("backgroundColor","#d7d7d7");   //改变按钮背景色
            timer = setInterval(function () {
                number--;
                if (number == 0) {
                    clearInterval(timer);
                    YZ_code.val("获取验证码");
                    $("#YZcode").attr("disabled", false);    //开启按钮
                    $("#YZcode").css("backgroundColor","red");
                } else {
                    YZ_code.val(number + "秒后重新获取");
                }
            }, 1000);
            return false;
        }else{
            if(data.retcode == -17401){
                loginOut();window.sessionStorage.setItem("LOGINSTATE", "flase");
                myToast(data.msg);
            }else{
                myToast(data.msg);
            }
        }
    }

    //确认
    var inpSave = $("#inpSave");
    //点击确认按钮
    inpSave.click(function () {
        //手机号
        var phoneCode = $("#phoneCode").val();
        //验证码
        var verCode = $("#verCode").val();
        // 设置密码
        var pswCode = $("#pswCode").val();
        var md5pswCode = hex_md5(phoneCode + pswCode);
        console.log(md5pswCode);

        //重复密码
        var repswCode = $("#repswCode").val();
        var md5repswCode = hex_md5(phoneCode + repswCode);
        console.log(md5repswCode)
        //判断手机号码是否为空或不是符合规则的手机号码
        if (phoneCode == "") {
            myToast("手机号码不能为空");
            return false;
        }
        var reg = /^1[3|4|5|8][0-9]\d{4,8}$/;
        if (!(reg.test(phoneCode))) {
            myToast("请填写正确的手机号码");
            return false;
        }
        //判断验证码是否为空
        if (verCode == "") {
            myToast("验证码不能为空");
            return false;
        }
        //判断密码是否为空或是否符合要求
        if (pswCode == "") {
            myToast("密码不能为空");
            return false;
        }else if(!(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/.test(pswCode))){
            myToast('请输入6-20位字母+数字的密码');
            return false;
        }
        //判断重复输入的密码框部位空以及重复输入的密码是否和密码一致
        if (repswCode == "") {
            myToast("请重复输入密码");
            return false;
        }
        if (repswCode != pswCode) {
            myToast("两次输入的密码不一致，请重新输入");
            return false;
        }
        // 找回密码
        var findpwdCode = JSON.stringify({
            "name": "instalNewPsw",
            "ctype": "Web",
            "reqbody": {
                "mobile": phoneCode,
                "smscode": verCode,
                "newpwd": md5pswCode,
            }
        })
        findPageAjax(httpheader, findpwdCode, findpwdSuccess);
    })

    // 点击重置
    $('#inpRESET').on('click', function () {
        //手机号
        var phoneCode = $("#phoneCode").val("");
        //验证码
        var verCode = $("#verCode").val("");
        // 设置密码
        var pswCode = $("#pswCode").val("");
        //重复密码
        var repswCode = $("#repswCode").val("");
    })

    // 找回密码成功函数
    function findpwdSuccess(data) {
        if (data.retcode == 0) {
            myToast("新密码设置成功");
            location.href="./loginPage.html"
            return false;
        }else if(data.retcode == -1){
            myToast("根据手机号码未找到用户信息，请注册");
            setTimeout(function () {
                window.location.href = "registerPage.html";
            },2000)
        }else{
            if(data.retcode == -17401){
                loginOut();
                window.sessionStorage.setItem("LOGINSTATE", "flase");
                window.location.href = "loginPage.html";
            }else{
                myToast(data.msg);
            }
        }
    }

})
