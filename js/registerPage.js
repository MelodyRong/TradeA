document.write("<script src='js/MyAlert.js'></script>");
document.write("<script src='js/md5.js'></script>");
document.write("<script type='text/javascript' src='js/NetworkRequest.js'></script>");    //网络请求
var httpheader = "http://119.90.97.146:18203/";
var FromWhere;
$(function(){
    function registerPageAjax(url,retData,successFunction){
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
    //验证码按钮
    var YZ_code = $("#YZcode");
    //点击按钮连接后台获取验证码
    YZ_code.click(function(){
        // YZ_code.css("disabled",true);
        //获取手机账号
        var userNumber = $("#phoneCode").val();
        if(userNumber == ""){
            myToast('手机号码不能为空');
            return false;
        }
        if(!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(userNumber))){
            myToast('请输入正确的手机号码');
            return false;
        }
        //    请求获取验证码的后台数据
        var  authCode = JSON.stringify({
            "name": "sendSMS",
            "ctype": "Web",
            "reqbody": {
                "mobile": userNumber
            }
        })
        registerPageAjax(httpheader,authCode,authCodeSuccess);
    });
    //获取验证码成功函数
    function authCodeSuccess(data){
        console.log(data);
        if(data.retcode == 0){
            myToast("发送成功");
            $("#YZcode").attr("disabled", true);   //禁用按钮
            $("#YZcode").css("backgroundColor","#d7d7d7");   //改变按钮背景色
            var number = 120;
            var timer = setInterval(function(){
                number--;
                if(number == 0){
                    clearInterval(timer);
                    YZ_code.val("获取验证码");
                    $("#YZcode").attr("disabled", false);    //开启按钮
                    $("#YZcode").css("backgroundColor","red");
                }else{
                    YZ_code.val( number + "秒后重新获取");
                }
            },1000);
        }else{
            myToast(data.msg);
        }
    }
    //确认
    var inpSave = $("#inpSave");
    //点击确认按钮
    inpSave.click(function () {
        //邀请码
        var regCode = $("#regCode").val();
        //手机号
        var phoneCode = $("#phoneCode").val();
        //验证码
        var verCode = $("#verCode").val();
        //密码
        var pswCode = $("#pswCode").val();
        var md5pswCode = hex_md5(phoneCode+pswCode);
        //重复密码
        var repswCode = $("#repswCode").val();
        var md5repswCode = hex_md5(phoneCode+repswCode);
        //判断手机号码是否为空或不是符合规则的手机号码
        if(phoneCode == ""){
            myToast('手机号码不能为空');
            return false;
        }
        if(!(/^1[3|4|5|8|6|7][0-9]\d{4,8}$/.test(phoneCode))){
            myToast('请输入正确的手机号码');
            return false;
        }
        //判断密码是否为空或是否符合要求(6-20位数字+字母)
        if(pswCode == ""){
            myToast('请输入密码');
            return false;
        }else if(!(/^^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/.test(pswCode))){
            myToast('请输入6-20位字母+数字的密码');
            return false;
        }
        //判断重复输入的密码是否为空以及重复输入的密码是否和密码一致
        if(repswCode == ""){
            myToast('请重复输入密码');
            return false;
        }
        if(repswCode != pswCode){
            myToast('两次输入的密码不一致，请重新输入');
            return false;
        }
        //判断验证码是否为空
        if(verCode == ""){
            myToast('验证码不能为空');
            return false;
        }
        //判断用户是否选择商城协议
        var  UserAgreementChecked = $("#UserAgreement").prop("checked");
        if( UserAgreementChecked != true){
            myToast('请阅读并选择商城用户协议');
            return false;
        }
        var UserSharingChecked = $("#UserSharing").prop("checked");
        if(UserSharingChecked != true){
            myToast('请阅读并选择订单共享与安全');
            return false;
        }
        var UserprivacyChecked = $("#Userprivacy").prop("checked");
        if(UserprivacyChecked != true){
            myToast('请阅读并选择喝彩艺术商城隐私政策');
            return false;
        }
        //请求注册
        //判断选择的是个人账户还是企业账户？来发起不同的请求信息
        var accountType = $("#accountType");
        if(accountType.val() == 1){
            //注册请求数据
            var firmType = accountType.val();
            var registerPageData = JSON.stringify({
                "name":"register",
                "ctype": "Web",
                "reqbody": {
                    "mobile": phoneCode,    //注册手机号
                    "pwd": md5pswCode,      //密码
                    "verifycode": verCode,   //短信验证码
                    "invitationcode": regCode,  //邀请码
                    // "realName": "",    //真实姓名
                    // "paperscode": "",    //身份证号码
                    // "idPicFr": "",    //身份证照片（正面）
                    // "idPicBg": "",    //身份证照片（背面）
                    // "openid":""     //微信openID
                    "firmType": firmType    //区别企业和个人用户，个人1企业6
                }
            });
            registerPageAjax(httpheader,registerPageData,registerPageSuccess);
        }else if(accountType.val() == 6){
            // console.log(false + "企业账户");
            var firmType = accountType.val();
            //注册请求数据
            var registerPageData = JSON.stringify({
                "name":"register",
                "ctype": "Web",
                "reqbody": {
                    "mobile": phoneCode,    //注册手机号
                    "pwd": md5pswCode,      //密码
                    "verifycode": verCode,   //短信验证码
                    "invitationcode": regCode,  //邀请码
                    // "realName": "",    //真实姓名
                    // "paperscode": "",    //身份证号码
                    // "idPicFr": "",    //身份证照片（正面）
                    // "idPicBg": "",    //身份证照片（背面）
                    // "openid":""     //微信openID
                    "firmType":firmType     //区别企业和个人用户，个人1企业6
                }
            });
            registerPageAjax(httpheader,registerPageData,registerPageSuccess);
        }else if(accountType.val() == 3){
            // console.log(false + "个人分销商账户");
            var firmType = accountType.val();
            //注册请求数据
            var registerPageData = JSON.stringify({
                "name":"register",
                "ctype": "Web",
                "reqbody": {
                    "mobile": phoneCode,    //注册手机号
                    "pwd": md5pswCode,      //密码
                    "verifycode": verCode,   //短信验证码
                    "invitationcode": regCode,  //邀请码
                    // "realName": "",    //真实姓名
                    // "paperscode": "",    //身份证号码
                    // "idPicFr": "",    //身份证照片（正面）
                    // "idPicBg": "",    //身份证照片（背面）
                    // "openid":""     //微信openID
                    "firmType":firmType     //区别企业和个人用户，个人1企业6
                }
            });
            registerPageAjax(httpheader,registerPageData,registerPageSuccess);
        }else if(accountType.val() == 5){
            // console.log(false + "企业分销商账户");
            var firmType = accountType.val();
            //注册请求数据
            var registerPageData = JSON.stringify({
                "name":"register",
                "ctype": "Web",
                "reqbody": {
                    "mobile": phoneCode,    //注册手机号
                    "pwd": md5pswCode,      //密码
                    "verifycode": verCode,   //短信验证码
                    "invitationcode": regCode,  //邀请码
                    // "realName": "",    //真实姓名
                    // "paperscode": "",    //身份证号码
                    // "idPicFr": "",    //身份证照片（正面）
                    // "idPicBg": "",    //身份证照片（背面）
                    // "openid":""     //微信openID
                    "firmType":firmType     //区别企业和个人用户，个人1企业6
                }
            });
            registerPageAjax(httpheader,registerPageData,registerPageSuccess);
        }
    });

    //注册成功函数
    function registerPageSuccess(data) {
        console.log(data);
        if(data.retcode == 0){
            // myToast(data.msg);   //弹框表示注册成功
            //手机号
            var phoneCode = $("#phoneCode").val();
            //密码
            var pswCode = $("#pswCode").val();
            var md5pswCode = hex_md5(phoneCode+pswCode);
            //注册成功后自动使用账户登录，不跳到登录页，登录成功后跳到首页
            var loginData = JSON.stringify({
                "name": "login",
                "ctype": "Web",
                "reqbody": {
                    "mobile":phoneCode,
                    "pwd": md5pswCode
                }
            });
            // var httpheader = "http://47.100.243.88:18203/";
            registerPageAjax(httpheader,loginData,loginSuccess);
            function loginSuccess(data) {
                if(data.retcode == 0){
                    myToast("登录成功");
                    window.sessionStorage.setItem("USERID",data.respbody.userid);
                    window.sessionStorage.setItem("LOGINSTATE",true);    //将登录状态存储在sess中
                    window.sessionStorage.setItem("SESSIONSTR",data.respbody.sessionStr);    //将sessStr存储在sess中
                    window.sessionStorage.setItem("FRIMID",data.respbody.firmid);   //将frimId存储在sess中
                    window.sessionStorage.setItem("LOGINSOURCE",1);
                    window.location.href = "index.html";
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
})
