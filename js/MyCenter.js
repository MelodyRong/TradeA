// document.write("<script src='../js/jqueryPagination.js'></script>");
document.write("<script type='text/javascript' src='js/NetworkRequest.js'></script>");    //网络请求
document.write("<script src='js/MyAlert.js'></script>");
document.write("<script src='js/md5.js'></script>");
document.write("<script type='text/javascript' src='js/loginInOrOut.js'></script>");
document.write("<script type='text/javascript' src='js/reclassify.js'></script>");    //一二级分类
var httpheader = "http://106.14.175.148:18203/";

function httpAjax(url, retData, successHandler) {
    $.ajax({
        url: url,
        data: retData,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            successHandler(data);
        },
        error: function (data, XMLHttpRequest, textStatus, errorThrown) {

            myToast('无法连接到网络，请稍后再试');
        }
    })
}

// 上传图片的ajax
function PictureAjax(formData, formSuccess) {
    $.ajax({
        url: 'http://106.14.175.148:8095/shop/img/upload',
        type: 'POST',
        cache: false,
        data: formData,
        processData: false,
        contentType: false,
        crossDomain: true,
    }).done(function (res) {
        formSuccess(res);
    }).fail(function (res, a, b) {
        myToast('无法连接到网络，请稍后再试');
    });
}

function getMyDate(str) {  //将毫秒值转为年月日时分秒
    var oDate = new Date(str),
        oYear = oDate.getFullYear(),
        oMonth = oDate.getMonth() + 1,
        oDay = oDate.getDate(),
        oHour = oDate.getHours(),
        oMin = oDate.getMinutes(),
        oSen = oDate.getSeconds(),
        oTime = oYear + '-' + getzf(oMonth) + '-' + getzf(oDay) + ' ' + getzf(oHour) + ':' + getzf(oMin) + ':' + getzf(oSen);//最后拼接时间
    return oTime;
};

function getzf(num) {     //补0操作
    if (parseInt(num) < 10) {
        num = '0' + num;
    }
    return num;
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

var userId = window.sessionStorage.getItem("USERID");//从sess里面取到用户id，用来获取用户信息
var sessStr = window.sessionStorage.getItem("SESSIONSTR");//从sess里获取sessStr
var frimId = window.sessionStorage.getItem("FRIMID");//从sess里获取frimeid
//判断是企业账户还是个人账户，如果是企业账户则隐藏完善个人信息，如果是个人账户，则隐藏完善企业信息
var frimType = window.sessionStorage.getItem("FIRMTYPE");
if (frimType == 1) {
    //个人账户则隐藏完善企业信息
    $("#perfectQY").css("display", "none");
    $("#enterprise").css("display", "none");
    $("#MyDistribution").css("display","none");
    $("#distributionRecord").css("display", "none");
} else if (frimType == 6) {
    //企业账户则隐藏完善个人信息
    $("#perfectGR").css("display", "none");
    $("#personage").css("display", "none");
    $("#MyDistribution").css("display","none");
    $("#distributionRecord").css("display", "none");
} else if (frimType == 3) {
    //个人分销商账户则隐藏完善个人信息
    $("#perfectQY").css("display", "none");
    $("#enterprise").css("display", "none");
} else if (frimType == 5) {
    //企业分销商账户则隐藏完善个人信息
    $("#perfectGR").css("display", "none");
    $("#personage").css("display", "none");
}

//tab切换
var lis = $('.per_td');
var divs = $('.per_details');
for (var i = 0; i < lis.length; i++) {
    lis[i].index = i;//将i赋给相应的button下标
    lis[i].onclick = function () {
        for (var j = 0; j < lis.length; j++) {
            lis[j].className = 'per_td';
            divs[j].style.display = "none";
        }
        lis[this.index].className = 'red per_td';
        divs[this.index].style.display = "block";
    }
}
//用户进入个人中心页面时，就使用用户id请求用户信息，并显示在页面中，
var MyCenterData = JSON.stringify({
    "name": "userInfo",
    "ctype": "Web",
    "sessionStr": sessStr,
    "userid": userId
});
httpAjax(httpheader, MyCenterData, MyCenterSuccess);

//获取用户信息成功函数
function MyCenterSuccess(data) {
    console.log(data);
    if (data.retcode == 0) {
        var retData = data.respbody;
        //将请求回来的信息展示在个人信息页面
        $("#userName").val(retData.name);
        window.sessionStorage.setItem("USERNAME", retData.name);
        $("#userPhone").val(retData.mobile);
        $("#userCode").val(retData.invitationcode);
        //将请求回来的信息展示在完善个人信息页面
        $("#userIdName").val(retData.name);   //姓名
        $("#userIdPhone").val(retData.mobile);   //手机号码
        //所属银行firmBankName
        $("#BelongsBank").val(retData.firmBankName);
        //银行卡账号firmAccount
        $("#bankAccount").val(retData.firmAccount);
        //身份证账号paperscode
        $("#useridcard").val(retData.paperscode);
        //常用地址addressDetail
        $("#ShippingAddress").val(retData.addressDetail);
        //默认当前用户的手机号码，并且不可改
        $("#phoneCode").val(retData.mobile);
        $("#phoneCode").attr("disabled", true);

        //完善企业信息页面的信息展示
        $("#enterpriseName").val(retData.name);   //姓名
        $("#enterprisePhone").val(retData.mobile);   //手机号码
        //所属银行firmBankName
        $("#CompanyBank").val(retData.firmBankName);
        //银行卡账号firmAccount
        $("#bankCompany").val(retData.firmAccount);
        //社会统一代码
        $("#creditCode").val(retData.paperscode);
        //常用地址addressDetail
        $("#CompanyAddress").val(retData.addressDetail);
        //默认当前用户的手机号码，并且不可改
        $("#phoneCode").val(retData.mobile);
        $("#phoneCode").attr("disabled", true);
    } else {
        if (data.retcode == -17401) {
            loginOut();
            window.sessionStorage.setItem("LOGINSTATE", "flase");
            window.sessionStorage.setItem("LOGINSOURCE", 1);
            window.location.href = "loginPage.html";
        } else {
            myToast(data.msg);
        }
    }
}

// 修改登录密码
// 点击获取短信验证码
$('#btn_ver').on('click', function () {
    var userNumber = $("#phoneCode").val();
    if (userNumber == "") {
        myToast("手机号码不能为空");
        return;
    }
    var reg = /^1[3|4|5|8][0-9]\d{4,8}$/;
    if (!(reg.test(userNumber))) {
        myToast("请输入正确的手机号码");
        return;
    }
    // 后台获取验证码
    var resetpwdCode = JSON.stringify({
        "sessionStr": sessStr,
        "userid": userId,
        "name": "sendSMSCodeByUser",
        "ctype": "Web"
    });
    httpAjax(httpheader, resetpwdCode, authCodeSuccess)
});
//获取验证码成功函数
var timer;

function authCodeSuccess(data) {
    console.log(data);
    if (data.retcode == 0) {
        myToast("验证码发送成功");
        $("#btn_ver").attr("disabled", true);   //禁用按钮
        $("#btn_ver").css("backgroundColor", "#d7d7d7");   //改变按钮背景色
        $("#btn_ver").css("color", "#000");
        var number = 120;
        var timer = setInterval(function () {
            number--;
            $("#btn_ver").html(number + '后重新获取');
            if (number == 0) {
                clearInterval(timer);
                $("#btn_ver").html("获取验证码");
                $("#btn_ver").attr("disabled", false);    //开启按钮
                $("#btn_ver").css("backgroundColor", "white");
                $("#btn_ver").css("color", "red");
            } else {
                $("#btn_ver").val(number + "秒后重新获取");
            }
        }, 1000);
    } else {
        if (data.retcode == -17401) {
            loginOut();
            window.sessionStorage.setItem("LOGINSTATE", "flase");
            window.sessionStorage.setItem("LOGINSOURCE", 1);
            window.location.href = "loginPage.html";
        } else {
            myToast(data.msg);
        }
    }
}

// 点击重置
$('.reset').on('click', function () {
    var phonenumber = $("#phoneCode").val("");
    var newpwd = $('.newpwd').val("");
    var resetnewpwd = $('.resetnewpwd').val("");
    var yzm = $('.yzm').val("");
})
// 点击提交
$("#sumbit_xgPwd").on('click', function () {
    var phonenumber = $("#phoneCode").val();
    var newpwd = $('#newPwd').val(); //  新密码
    var md5newpwd = hex_md5(phonenumber + newpwd);
    var resetnewpwd = $('#cf_newPwd').val(); // 重复新密码
    var md5resetpwd = hex_md5(phonenumber + resetnewpwd);
    var yzm = $('#yzm').val();
    var regs = /^[a-zA-Z0-9]{6,}$/
    // 判断输入的手机号是否正确
    if (phonenumber == "") {
        myToast("手机号码不能为空");
        return false;
    }
    // 判断手机号输入是否正确
    if (!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(phonenumber))) {
        myToast('请输入正确的手机号码');
        return false;
    }
    // 判断新密码是否为空
    if (newpwd == "") {
        myToast("请输入新密码");
        return false;
    } else if (!(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/.test(newpwd))) {
        myToast('请输入6-20位字母+数字的密码');
        return false;
    }
    // 判断是否重复输入密码
    if (resetnewpwd == "") {
        myToast("请重复输入新密码");
        return false;
    }
    // 判断重复输入的面密码是否和新密码一致
    if (resetnewpwd !== newpwd) {
        myToast("两次输入的密码不一致，请重新输入");
        return false;
    }
    if (yzm == "") {
        myToast("请输入短信验证码");
        return false;
    }
    var submitCode = JSON.stringify({
        "reqbody": {
            "new_pwd": md5newpwd,
            "smscode": yzm
        },
        "sessionStr": sessStr,
        "userid": userId,
        "name": "changePwd",
        "ctype": "Web"
    });
    httpAjax(httpheader, submitCode, subsuccessFun);
});

//修改密码成功函数
function subsuccessFun(data) {
    console.log(data);
    if (data.retcode == 0) {
        myToast("修改密码成功");
        clearInterval(timer);
        $("#btn_ver").html("获取验证码");
    } else {
        if (data.retcode == -17401) {
            loginOut();
            window.sessionStorage.setItem("LOGINSTATE", "flase");
            window.sessionStorage.setItem("LOGINSOURCE", 1);
            window.location.href = "loginPage.html";
        } else {
            myToast(data.msg);
        }
    }
}

//点击提交请求个人完善信息接口
$("#submit").click(function () {
    //发送身份证正面
    var formDataZ = new FormData($('#uploadForm01')[0]);
    formDataZ.append('firmId', userId);
    formDataZ.append('photoType', '0');
    PictureAjax(formDataZ, formData_zSuccess);

    //上传身份证正面成功函数
    function formData_zSuccess(data) {
        console.log(data);
        if (data.retCode == 0) {
            var retData = data.retData;
            console.log(data.retMessage);
            window.sessionStorage.setItem("IDENTITYCARD_Z", retData.phtotUrl);
            //发送身份证反面
            var formDataF = new FormData($('#uploadForm02')[0]);
            formDataF.append('firmId', userId);
            formDataF.append('photoType', '1');
            PictureAjax(formDataF, formData_fSuccess);
        } else if (data.retCode == -1) {
            console.log(data.retMessage);
            myToast("请选择身份证正面照片");
        } else {
            if (data.retCode == -17401) {
                loginOut();
                window.sessionStorage.setItem("LOGINSTATE", "flase");
                window.sessionStorage.setItem("LOGINSOURCE", 1);
                window.location.href = "loginPage.html";
            } else {
                console.log(data.retMessage);
                myToast(data.retMessage)
            }

        }
    }

    //上传身份证反面成功函数
    function formData_fSuccess(data) {
        console.log(data);
        if (data.retCode == 0) {
            var retData = data.retData;
            console.log(data.retMessage);
            window.sessionStorage.setItem("IDENTITYCARD_F", retData.phtotUrl);
            //发送手持身份证
            var formDataS = new FormData($('#uploadForm03')[0]);
            formDataS.append('firmId', userId);
            formDataS.append('photoType', '2');
            PictureAjax(formDataS, formData_sSuccess);
        } else if (data.retCode == -1) {
            console.log(data.retMessage);
            myToast("请选择身份证反面照片");
        } else {
            if (data.retCode == -17401) {
                loginOut();
                window.sessionStorage.setItem("LOGINSTATE", "flase");
                window.sessionStorage.setItem("LOGINSOURCE", 1);
                window.location.href = "loginPage.html";
            } else {
                console.log(data.retMessage);
                myToast(data.retMessage)
            }
        }
    }

    //上传手持身份证成功函数
    function formData_sSuccess(data) {
        if (data.retCode == 0) {
            var retData = data.retData;
            window.sessionStorage.setItem("IDENTITYCARD_S", retData.phtotUrl);
            //完善全部信息
            //获取身份证正面地址
            var identitycard_z = window.sessionStorage.getItem("IDENTITYCARD_Z");
            //获取身份证反面地址
            var identitycard_f = window.sessionStorage.getItem("IDENTITYCARD_F");
            //获取手持身份证地址
            var identitycard_s = window.sessionStorage.getItem("IDENTITYCARD_S");
            //用户手机号
            var userIdPhone = $("#userIdPhone").val();
            //身份证账号
            var useridcard = $("#useridcard").val();
            //所属银行
            var BelongsBank = $("#BelongsBank").val();
            //收货地址
            var ShippingAddress = $("#ShippingAddress").val();
            //用户姓名
            var userIdName = $("#userIdName").val();
            //用户id     userId
            //银行卡账号
            var bankAccount = $("#bankAccount").val();
            var CompleteInformationData = JSON.stringify({
                "reqbody": {
                    "idCardType": "0",  // --0代表身份证号码
                    "photoUrl": [{
                        "photoType": 0,  // --身份证正面
                        "photoUrl": identitycard_z
                    },
                        {
                            "photoType": 1,   //--身份证反面
                            "photoUrl": identitycard_f
                        }, {
                            "photoType": 2,    //--手持身份证
                            "photoUrl": identitycard_s
                        }],
                    "mobile": userIdPhone,   //--用户手机号
                    "idCard": useridcard,  //--身份证账号
                    "bankName": BelongsBank,  		//---所属银行
                    "addressDetail": ShippingAddress,    //--收货地址
                    "realName": userIdName,   //--用户姓名
                    "firmId": frimId,      // --用户id
                    "account": bankAccount// – 银行卡账号
                },
                "sessionStr": sessStr,  // --登录时用户的str
                "userid": userId,    //--用户id
                "name": "completeUserInfo",   //---接口名称
                "ctype": "Web"
            });
            httpAjax(httpheader, CompleteInformationData, CompleteInformationSuccess);

        } else if (data.retCode == -1) {
            console.log(data.retMessage);
            myToast("请选择手持身份证照片");
        } else {
            if (data.retCode == -17401) {
                loginOut();
                window.sessionStorage.setItem("LOGINSTATE", "flase");
                window.sessionStorage.setItem("LOGINSOURCE", 1);
                window.location.href = "loginPage.html";
            } else {
                console.log(data.retMessage);
                myToast(data.retMessage)
            }
        }
    }
});

//完善个人信息成功函数
function CompleteInformationSuccess(data) {
    console.log(data);
    if (data.retcode == 0) {
        myToast(data.msg);
    } else {
        if (data.retcode == -17401) {
            loginOut();
            window.sessionStorage.setItem("LOGINSTATE", "flase");
            window.sessionStorage.setItem("LOGINSOURCE", 1);
            window.location.href = "loginPage.html";
        } else {
            console.log(data.msg);
            myToast(data.msg);
        }
    }
}

//完善企业信息
$("#Companysubmit").click(function () {
    //发送营业执照图片
    var formDataY = new FormData($('#uploadForm05')[0]);
    formDataY.append('firmId', userId);
    formDataY.append('photoType', '3');
    PictureAjax(formDataY, formData_YSuccess);

    function formData_YSuccess(data) {
        console.log(data);
        if (data.retCode == 0) {
            var retData = data.retData;
            window.sessionStorage.setItem("IDENTITYCARD_Y", retData.phtotUrl);


            //发起完善信息接口
            //企业名称
            var firmName = $("#enterpriseName").val();
            // 联系人手机号码
            var firmPhone = $("#enterprisePhone").val();
            // 社会统一信用代码
            var firmCode = $("#creditCode").val();
            // 银行卡账号
            var firmBank = $("#bankCompany").val();
            // 所属银行
            var firmCompanyBank = $("#CompanyBank").val();
            // 收货地址
            var firmCompanyAddress = $("#CompanyAddress").val();
            // 营业执照照片
            var firmphoto = window.sessionStorage.getItem("IDENTITYCARD_Y");
            //完善信息接口
            var CompleteInformationFirmData = JSON.stringify({
                "reqbody": {
                    "idCardType": "1",  // --0代表身份证号码,1代表同意社会代码
                    "photoUrl": [{
                        "photoType": 3,  // --身份证正面
                        "photoUrl": firmphoto
                    }],
                    "mobile": firmPhone,   //--用户手机号
                    "idCard": firmCode,  //--身份证账号
                    "bankName": firmCompanyBank,  		//---所属银行
                    "addressDetail": firmCompanyAddress,    //--收货地址
                    "realName": firmName,   //--用户姓名
                    "firmId": frimId,      // --用户id
                    "account": firmBank// – 银行卡账号
                },
                "sessionStr": sessStr,  // --登录时用户的str
                "userid": userId,    //--用户id
                "name": "completeUserInfo",   //---接口名称
                "ctype": "Web"
            });
            httpAjax(httpheader, CompleteInformationFirmData, CompleteInformationFirmSuccess);
        } else {
            if (data.retCode == -17401) {
                loginOut();
                window.sessionStorage.setItem("LOGINSTATE", "flase");
                window.sessionStorage.setItem("LOGINSOURCE", 1);
                // window.location.href = "loginPage.html";
            } else {
                console.log(data.retMessage);
                myToast(data.retMessage)
            }
        }
    }
});

//完善企业信息请求成功接口
function CompleteInformationFirmSuccess(data) {
    console.log(data);
    if (data.retcode == 0) {
        myToast(data.msg);
    } else {
        if (data.retcode == -17401) {
            loginOut();
            window.sessionStorage.setItem("LOGINSTATE", "flase");
            window.sessionStorage.setItem("LOGINSOURCE", 1);
            // window.location.href = "loginPage.html";
        } else {
            console.log(data.msg);
            myToast(data.msg);
        }
    }
}

//请求用户余额
var balanceData = JSON.stringify({
    "name": "queryFirmFunds",
    "ctype": "Web",
    "sessionStr": sessStr,
    "userid": userId,
    "reqbody": {
        "userid": userId
    }
});
httpAjax(httpheader, balanceData, balanceSuccess);

//请求用户余额成功函数
function balanceSuccess(data) {
    console.log(data);
    if (data.retcode == 0) {
        var retData = data.respbody;
        //全部余额
        var BuyOutMoney = (retData.balance + retData.frozenFund).toFixed(2);
        $("#Buyout").html(BuyOutMoney);
        //可用资金
        $("#available_balance").html(retData.balance);
        //冻结资金
        $("#frozen_capital").html(retData.frozenFund);
    } else {
        if (data.retcode == -17401) {
            loginOut();
            window.sessionStorage.setItem("LOGINSTATE", "flase");
            window.sessionStorage.setItem("LOGINSOURCE", 1);
            window.location.href = "loginPage.html";
        } else {
            console.log(data.msg);
            myToast(data.msg);
        }
    }
}

//点击选择充值金额
var topUp = $(".topUp");
for (var i = 0; i < topUp.length; i++) {
    topUp[i].onclick = function () {
        for (var j = 0; j < topUp.length; j++) {
            topUp[j].className = "depositSpan";
        }
        this.className = "depositRed" + " " + "topUp";
    };
}
//点击充值按钮
$("#affirm_recharge").click(function () {
    if ($("#topUpMoney").val() == "") {
        for (var i = 0; i < topUp.length; i++) {
            if (topUp[i].className == "depositRed" + " " + "topUp") {
                var depositmoney = topUp[i].innerHTML;
            }
        }
    } else if ($("#topUpMoney").val() != "") {
        var depositmoney = $("#topUpMoney").val();
    }
    //网银支付接口
    var InternetbankData = JSON.stringify({
        "reqbody": {
            "rechargeMoney": depositmoney,
            "takeAccumulate": "0"
        },
        "sessionStr": sessStr,
        "userid": userId,
        "name": "recharge",
        "ctype": "Web"
    });
    httpAjax(httpheader, InternetbankData, InternetbankSuccess);

    function InternetbankSuccess(data) {
        console.log(data);
        if (data.retcode == 0) {
            var noCardPay = data.respbody.urlList.noCardPay;
            window.location.href = noCardPay;
        } else {
            if (data.retcode == -17401) {
                loginOut();
                window.sessionStorage.setItem("LOGINSTATE", "flase");
                window.sessionStorage.setItem("LOGINSOURCE", 1);
                window.location.href = "loginPage.html";
            } else {
                myToast(data.msg);
            }
        }
    }
});
//点击选择提现金额
var depositSpans = $(".depositSpan");
for (var i = 0; i < depositSpans.length; i++) {
    depositSpans[i].onclick = function () {
        for (var j = 0; j < depositSpans.length; j++) {
            depositSpans[j].className = "depositSpan";
        }
        this.className = "depositRed" + " " + "depositSpan";
    };
}
//点击提现按钮
$("#affirm_deposit").click(function () {
    if ($("#custom_money").val() == "") {
        for (var i = 0; i < depositSpans.length; i++) {
            if (depositSpans[i].className == "depositRed" + " " + "depositSpan") {
                var depositmoney = depositSpans[i].innerHTML;
            }
        }
    } else if ($("#custom_money").val() != "") {
        var depositmoney = $("#custom_money").val();
    }
    //申请提现参数
    var depositData = JSON.stringify({
        "ctype": "Web",
        "name": "applyWithdrawal",
        "sessionStr": sessStr,
        "userid": userId,
        "reqbody": {
            "firmId": frimId,    //用户的frimid
            "withdrawBankAccount": "",   //银行卡号
            "withdrawBankName": "",    //开户行名称
            "withdrawDateTime": "",    //时间
            "withdrawNote": "",     //
            "withdrawOperator": "",   //
            "withdrawPrice": depositmoney,    //金额
            "withdrawStatus": 0     //状态
        }
    });
    httpAjax(httpheader, depositData, depositSuccess);
});

//提现成功接口
function depositSuccess(data) {
    myToast(data.msg);
    httpAjax(httpheader, balanceData, balanceSuccess);  //提现成功刷新余额
}

//提现历史记录   0:申请状态  ，1撤回申请提现，2：驳回申请打款 3:审核通过，4 已打款
var Withdrawal_recordData = JSON.stringify({
    "ctype": "Web",
    "name": "queryWithdrawal",
    "reqbody": {
        "frimID": frimId
    },
    "sessionStr": sessStr,
    "userid": userId
});
httpAjax(httpheader, Withdrawal_recordData, Withdrawal_recordSuccess);

//提现历史记录成功函数
function Withdrawal_recordSuccess(data) {
    console.log(data);
    var Withdrawal_record = $("#Withdrawal_record");
    if (data.retcode == 0) {
        var retData = data.respbody;
        if (retData.length == 0) {
            Withdrawal_record.attr("class", "bottom_play" + " " + "Withdrawal_record");
            Withdrawal_record.html("暂无数据");
        }
        var WithdrawalRecordContent = $("#WithdrawalRecordContent");
        for (var i = 0; i < retData.length; i++) {
            var cx = "撤销";
            if (retData[i].withdrawStatus == "0") {
                retData[i].withdrawStatus = "已申请";
                WithdrawalRecordContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                    + retData[i].withdrawId
                    + '</li><li class="WithdrawalRecordContentliulli">'
                    + retData[i].withdrawPrice
                    + '</li><li class="WithdrawalRecordContentliulli">'
                    + retData[i].withdrawStatus
                    + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                    + retData[i].withdrawNote
                    + '</marquee></li><li class="WithdrawalRecordContentliulli revocationWrap"><button class="revocation cxtx" accesskey= '
                    + retData[i].withdrawId
                    + '>'
                    + cx
                    + '</button></li></ul></li>');
            } else if (retData[i].withdrawStatus == "1") {
                retData[i].withdrawStatus = "已撤回";
                WithdrawalRecordContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                    + retData[i].withdrawId
                    + '</li><li class="WithdrawalRecordContentliulli">'
                    + retData[i].withdrawPrice
                    + '</li><li class="WithdrawalRecordContentliulli">'
                    + retData[i].withdrawStatus
                    + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                    + retData[i].withdrawNote
                    + '</marquee></li><li class="WithdrawalRecordContentliulli revocationWrap"><button class="" accesskey= '
                    + ''
                    + '>'
                    + ''
                    + '</button></li></ul></li>');
            } else if (retData[i].withdrawStatus == "2") {
                retData[i].withdrawStatus = "已驳回";
                WithdrawalRecordContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                    + retData[i].withdrawId
                    + '</li><li class="WithdrawalRecordContentliulli">'
                    + retData[i].withdrawPrice
                    + '</li><li class="WithdrawalRecordContentliulli">'
                    + retData[i].withdrawStatus
                    + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                    + retData[i].withdrawNote
                    + '</marquee></li><li class="WithdrawalRecordContentliulli revocationWrap"><button class="" accesskey= '
                    + ''
                    + '>'
                    + ''
                    + '</button></li></ul></li>');
            } else if (retData[i].withdrawStatus == "3") {
                retData[i].withdrawStatus = "审核通过";
                WithdrawalRecordContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                    + retData[i].withdrawId
                    + '</li><li class="WithdrawalRecordContentliulli">'
                    + retData[i].withdrawPrice
                    + '</li><li class="WithdrawalRecordContentliulli">'
                    + retData[i].withdrawStatus
                    + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                    + retData[i].withdrawNote
                    + '</marquee></li><li class="WithdrawalRecordContentliulli revocationWrap"><button class="" accesskey= '
                    + ''
                    + '>'
                    + ''
                    + '</button></li></ul></li>');
            } else if (retData[i].withdrawStatus == "4") {
                retData[i].withdrawStatus = "已打款";
                WithdrawalRecordContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                    + retData[i].withdrawId
                    + '</li><li class="WithdrawalRecordContentliulli">'
                    + retData[i].withdrawPrice
                    + '</li><li class="WithdrawalRecordContentliulli">'
                    + retData[i].withdrawStatus
                    + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                    + retData[i].withdrawNote
                    + '</marquee></li><li class="WithdrawalRecordContentliulli revocationWrap"><button class="" accesskey= '
                    + ''
                    + '>'
                    + ''
                    + '</button></li></ul></li>');
            }
        }

        //点击撤销提现
        $(".cxtx").click(function () {
            var revocation_Withdrawal_recordData = JSON.stringify({
                "ctype": "Web",
                "name": "withdrawal",
                "reqbody": {
                    "withdrawId": this.accessKey  //提现数据的id
                },
                "sessionStr": sessStr,
                "userid": userId
            });
            httpAjax(httpheader, revocation_Withdrawal_recordData, revocation_Withdrawal_recordSuccess);
            var thisW = this.parentNode;
            var states = thisW.previousSibling.previousSibling;
            states.innerHTML = "已撤回";
            this.remove();
        });

    } else {
        if (data.retcode == -17401) {
            loginOut();
            window.sessionStorage.setItem("LOGINSTATE", "flase");
            window.sessionStorage.setItem("LOGINSOURCE", 1);
            window.location.href = "loginPage.html";
        } else {
            console.log(data.msg);
            myToast(data.msg);
        }
    }
}

//撤销提现成功函数
function revocation_Withdrawal_recordSuccess(data) {
    if (data.retcode == 0) {
        myToast(data.msg);
    } else {
        if (data.retcode == -17401) {
            loginOut();
            window.sessionStorage.setItem("LOGINSTATE", "flase");
            window.sessionStorage.setItem("LOGINSOURCE", 1);
            window.location.href = "loginPage.html";
        } else {
            console.log(data.msg);
            myToast(data.msg);
        }
    }
}

//资金流水
function capitalData(pageIndex) {
    return JSON.stringify({
        "ctype": "Web",
        "name": "queryFundFlow",
        "userid": userId,
        "sessionStr": sessStr,
        "reqbody": {
            "userid": userId,
            "pageSize": 10,
            "pageIndex": pageIndex
        }
    })
}

httpAjax(httpheader, capitalData(1), capitalSuccess);

//请求资金流水成功函数
function capitalSuccess(data) {
    console.log(data);
    if (data.retcode == 0) {
        var retData = data.respbody.fundFlowList;
        if (retData.length == "0") {
            $("#capitalBillsContent").attr("class", "bottom_play Withdrawal_record");
            $("#capitalBillsContent").html("暂无数据");
        } else {
            var capitalBillsContent = $("#capitalBillsContent");
            capitalBillsContent.empty();
            for (var i = 0; i < retData.length; i++) {
                capitalBillsContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                    + retData[i].oprName
                    + '</li><li class="WithdrawalRecordContentliulli">'
                    + retData[i].amount
                    + '</li><li class="WithdrawalRecordContentliulli">'
                    + retData[i].contractNo
                    + '</li><li class="WithdrawalRecordContentliulli">'
                    + retData[i].createTime
                    + '</li></ul></li>');
            }
        }
        //总条数
        var capitalTotalData = data.respbody.total;
        console.log(capitalTotalData);
        //总页数
        var capitalPageCount = Math.ceil(Number(capitalTotalData) / Number(retData.length));
        console.log(capitalPageCount);
        // window.sessionStorage.setItem("CAPITALPAGECOUNT", capitalPageCount);



    } else {
        if (data.retcode == -17401) {
            loginOut();
            window.sessionStorage.setItem("LOGINSTATE", "flase");
            window.sessionStorage.setItem("LOGINSOURCE", 1);
            window.location.href = "loginPage.html";
        } else {
            console.log(data.msg);
            myToast(data.msg);
        }
    }
}
// function count(){
//     return window.sessionStorage.getItem("CAPITALPAGECOUNT");//页数
// }
// $("#demo4").paginate({
//     count: 20,
//     start: 1,
//     display: 12,
//     border: false,
//     text_color: '#79B5E3',
//     background_color: 'none',
//     text_hover_color: '#2573AF',
//     background_hover_color: 'none',
//     images: false,
//     mouse: 'press',
//     onChange: function (page) {
//         console.log(page);
//     }
// });

//推荐奖励
var recommendData = JSON.stringify({
    "ctype": "Web",
    "name": "queryFundFlowAward",
    "reqbody": {
        "oprCode": 401,
        "pageIndex": 1,
        "pageSize": 10,
        "userid": userId
    },
    "sessionStr": sessStr,
    "userid": userId
});
httpAjax(httpheader, recommendData, recommendSuccess);

//推荐奖励成功函数
function recommendSuccess(data) {
    console.log(data);
    if (data.retcode == 0) {
        var retData = data.respbody.awardList;
        var recommendAwardContent = $("#recommendAwardContent");
        if (retData.length == 0) {
            recommendAwardContent.attr("class", "bottom_play Withdrawal_record");
            recommendAwardContent.html("暂无数据");
        } else {
            for (var i = 0; i < retData.length; i++) {
                recommendAwardContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                    + retData[i].contractNo
                    + '</li><li class="WithdrawalRecordContentliulli">'
                    + retData[i].createTime
                    + '</li><li class="WithdrawalRecordContentliulli">'
                    + '开户奖励'
                    + '</li><li class="WithdrawalRecordContentliulli">'
                    + retData[i].amount
                    + '</li></ul></li>');
            }
        }
    } else {
        if (data.retcode == -17401) {
            loginOut();
            window.sessionStorage.setItem("LOGINSTATE", "flase");
            window.sessionStorage.setItem("LOGINSOURCE", 1);
            window.location.href = "loginPage.html";
        } else {
            console.log(data.msg);
            myToast(data.msg);
        }
    }
}

//促销赠送
var promotionResentData = JSON.stringify({
    "ctype": "Web",
    "name": "queryFundFlowRebate",
    "reqbody": {
        "oprCode": 501,
        "pageIndex": 1,
        "pageSize": 10,
        "userid": userId
    },
    "sessionStr": sessStr,
    "userid": userId
});
httpAjax(httpheader, promotionResentData, promotionResentSuccess);

function promotionResentSuccess(data) {
    if (data.retcode == 0) {
        var retData = data.respbody.rebateList;
        var promotionPresentContent = $("#promotionPresentContent");
        if (retData.length == 0) {
            promotionPresentContent.attr("class", "bottom_play Withdrawal_record");
            promotionPresentContent.html("暂无数据");
        } else {
            for (var i = 0; i < retData.length; i++) {
                promotionPresentContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                    + retData[i].commodityName
                    + '</li><li class="WithdrawalRecordContentliulli">'
                    + retData[i].amount
                    + '</li><li class="WithdrawalRecordContentliulli">'
                    + retData[i].contractNo
                    + '</li><li class="WithdrawalRecordContentliulli">'
                    + retData[i].createTime
                    + '</li></ul></li>');
            }
        }
    } else {
        if (data.retcode == -17401) {
            loginOut();
            window.sessionStorage.setItem("LOGINSTATE", "flase");
            window.sessionStorage.setItem("LOGINSOURCE", 1);
            window.location.href = "loginPage.html";
        } else {
            myToast(data.msg);
        }
    }
}

//我的提货
function pickUpData(pageIndex) {
    return JSON.stringify({
        "reqbody": {
            "pageSize": 10,     //--条数
            "pageIndex": pageIndex     // --页数
        },
        "sessionStr": sessStr,
        "userid": userId,
        "name": "queryPickupApplication",
        "ctype": "Web"
    })
}

httpAjax(httpheader, pickUpData(1), pickUpSuccess);

//提货单查询成功函数
function pickUpSuccess(data) {
    console.log(data);
    if (data.retcode == 0) {
        var retData = data.respbody.arrayList;
        var pickUpListContent = $("#pickUpListContent");
        if (retData.length == 0) {
            pickUpListContent.attr("class", "bottom_play Withdrawal_record");
            pickUpListContent.html("暂无数据");
        } else {
            for (var i = 0; i < retData.length; i++) {
                var cx = "撤销";
                if (retData[i].pickupType == "1") {
                    retData[i].pickupType = "邮寄";
                } else if (retData[i].pickupType == "2") {
                    retData[i].pickupType = "自提";
                } else if (retData[i].pickupType == "3") {
                    retData[i].pickupType = "委托提货";
                } else if (retData[i].pickupType == "0") {
                    retData[i].pickupType = "未知状态";
                }
                if (retData[i].pickupStatus == "0") {
                    retData[i].pickupStatus = "未提货";
                    cx = "撤销提货";
                    pickUpListContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                        + retData[i].commodityName
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].pickupQty
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].pickupType
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].pickupStatus
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].applicationID
                        + '</li><li class="WithdrawalRecordContentliulli revocationWrap"><button class="revocation cxth" accesskey="'
                        + retData[i].applicationID
                        + '">'
                        + cx
                        + '</button></li></ul></li>');

                    //点击撤销提货
                    $(".cxth").click(function () {
                        var that = this;
                        myConfirm({
                            title: "提示",
                            message: "确定撤销吗？",
                            callback: function () {
                                var cxthData = JSON.stringify({
                                    "ctype": "Web",
                                    "name": "cancelListPickup",
                                    "reqbody": {
                                        "applicationID": that.accessKey,
                                    },
                                    "sessionStr": sessStr,
                                    "userid": userId
                                });
                                console.log(cxthData);
                                httpAjax(httpheader, cxthData, cxthSuccess);

                                function deleteBtn(btn) {
                                    btn.remove();
                                };
                                deleteBtn(that);
                            }
                        });
                    })

                } else if (retData[i].pickupStatus == "1") {
                    retData[i].pickupStatus = "已提取";
                    pickUpListContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                        + retData[i].commodityName
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].pickupQty
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].pickupType
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].pickupStatus
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].applicationID
                        + '</li><li class="WithdrawalRecordContentliulli revocationWrap"><button class="" accesskey="'
                        + retData[i].applicationID
                        + '">'
                        + '</button></li></ul></li>');
                } else if (retData[i].pickupStatus == "2") {
                    retData[i].pickupStatus = "已撤销";
                    pickUpListContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">' + retData[i].commodityName + '</li><li class="WithdrawalRecordContentliulli">' + retData[i].pickupQty + '</li><li class="WithdrawalRecordContentliulli">' + retData[i].pickupType + '</li><li class="WithdrawalRecordContentliulli">' + retData[i].pickupStatus + '</li><li class="WithdrawalRecordContentliulli">' + retData[i].applicationID + '</li><li class="WithdrawalRecordContentliulli revocationWrap"></li></ul></li>');
                }
            }
        }
        //分页
        //总条数
        var totalCount = data.respbody.total;
        //总页数
        var totalPages = Math.ceil(Number(totalCount) / Number(retData.length));
        // $('.M-box22').pagination({
        //     pageCount: totalPages,    //总页数
        //     totalData: totalCount,     //总条数
        //     showData: 10,    //每页显示的条数
        //     isHide: true,     //总页数为0或1时隐藏分页控件
        //     mode: 'fixed',
        //     callback: function (index) {    //回调函数，参数"index"为当前页
        //         httpAjax(httpheader, pickUpData(index.getCurrent()), pickUpSuccess2);
        //     }
        // });
    } else {
        if (data.retcode == -17401) {
            loginOut();
            window.sessionStorage.setItem("LOGINSTATE", "flase");
            window.sessionStorage.setItem("LOGINSOURCE", 1);
            window.location.href = "loginPage.html";
        } else {
            console.log(data.msg);
            myToast(data.msg);
        }
    }
}

//撤销提货成功
function cxthSuccess(data) {
    console.log(data);
    if (data.retcode == 0) {
        console.log(data.msg);
        myToast("撤销成功");
        //撤销成功刷新页面，改变我的寄卖商品的值
        $("#holdPositionContent").empty();
        httpAjax(httpheader, holdPositionData(1), holdPositionSuccess);
    } else {
        if (data.msg == -17401) {
            loginOut();
            window.sessionStorage.setItem("LOGINSTATE", "flase");
            window.sessionStorage.setItem("LOGINSOURCE", 1);
            window.location.href = "loginPage.html";
        } else {
            console.log(data.msg);
            myToast(data.msg);
        }
    }
}

//我的提货分页函数
function pickUpSuccess2(data) {
    console.log(data);
    if (data.retcode == 0) {
        $("#pickUpListContent").empty();
        var retData = data.respbody.arrayList;
        var pickUpListContent = $("#pickUpListContent");
        if (retData.length == 0) {
            pickUpListContent.attr("class", "bottom_play Withdrawal_record");
            pickUpListContent.html("暂无数据");
        } else {
            for (var i = 0; i < retData.length; i++) {
                var cx = "撤销";
                if (retData[i].pickupType == "0") {
                    retData[i].pickupType = "未知状态";
                } else if (retData[i].pickupType == "1") {
                    retData[i].pickupType = "邮寄";
                } else if (retData[i].pickupType == "2") {
                    retData[i].pickupType = "自提";
                } else if (retData[i].pickupType == "3") {
                    retData[i].pickupType = "委托提货";
                }
                if (retData[i].pickupStatus == "0") {
                    retData[i].pickupStatus = "未提货";
                    cx = "撤销提货";
                    pickUpListContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                        + retData[i].commodityName
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].pickupQty
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].pickupType
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].pickupStatus
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].applicationID
                        + '</li><li class="WithdrawalRecordContentliulli revocationWrap"><button class="revocation cxth" accesskey="'
                        + retData[i].applicationID
                        + '">'
                        + cx
                        + '</button></li></ul></li>');

                    //点击撤销提货
                    $(".cxth").click(function () {
                        var cxthData = JSON.stringify({
                            "ctype": "Web",
                            "name": "cancelListPickup",
                            "reqbody": {
                                "applicationID": this.accessKey,
                            },
                            "sessionStr": sessStr,
                            "userid": userId
                        });
                        httpAjax(httpheader, cxthData, cxthSuccess);
                        var deleteBtn = function (btn) {
                            btn.remove();
                        };
                        deleteBtn(this);
                    })

                } else if (retData[i].pickupStatus == "1") {
                    retData[i].pickupStatus = "已提取";
                    cx = "撤销提取";
                    pickUpListContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                        + retData[i].commodityName
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].pickupQty
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].pickupType
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].pickupStatus
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].applicationID
                        + '</li><li class="WithdrawalRecordContentliulli revocationWrap"><button class="revocation cxtq" accesskey="'
                        + retData[i].applicationID
                        + '">'
                        + cx
                        + '</button></li></ul></li>');

                    //点击撤销提货
                    $(".cxtq").click(function () {
                        var cxthData = JSON.stringify({
                            "ctype": "Web",
                            "name": "cancelListPickup",
                            "reqbody": {
                                "applicationID": this.accessKey,
                            },
                            "sessionStr": sessStr,
                            "userid": userId
                        });
                        httpAjax(httpheader, cxthData, cxthSuccess);
                        var deleteBtn = function (btn) {
                            btn.remove();
                        };
                        deleteBtn(this);
                    })

                } else if (retData[i].pickupStatus == "2") {
                    retData[i].pickupStatus = "已撤销";
                    pickUpListContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">' + retData[i].commodityName + '</li><li class="WithdrawalRecordContentliulli">' + retData[i].pickupQty + '</li><li class="WithdrawalRecordContentliulli">' + retData[i].pickupType + '</li><li class="WithdrawalRecordContentliulli">' + retData[i].pickupStatus + '</li><li class="WithdrawalRecordContentliulli">' + retData[i].applicationID + '</li><li class="WithdrawalRecordContentliulli revocationWrap"></li></ul></li>');
                }
            }
        }
    } else {
        if (data.retcode == -17401) {
            loginOut();
            window.sessionStorage.setItem("LOGINSTATE", "flase");
            window.sessionStorage.setItem("LOGINSOURCE", 1);
            window.location.href = "loginPage.html";
        } else {
            console.log(data.msg);
            myToast(data.msg);
        }
    }
}

//我的售出
//tab切换
var spans = $('.pick_top_span');
var workOffs = $('.workOffList');
for (var i = 0; i < spans.length; i++) {
    spans[i].index = i;//将i赋给相应的button下标
    spans[i].onclick = function () {
        for (var j = 0; j < spans.length; j++) {
            spans[j].style.backgroundColor = 'whitesmoke';
            spans[j].style.color = 'black';
            workOffs[j].style.display = "none";
        }
        this.style.backgroundColor = "#e7bb1c";
        this.style.color = "white";
        workOffs[this.index].style.display = "block";
    }
}

function workOffData(status) {
    return JSON.stringify({
        "reqbody": {
            "status": status,//0：全部 ，1：未成交   2 ：已成交
            "bsFlag": 2,
            "pageSize": 10,
            "pageIndex": 1
        },
        "sessionStr": sessStr,
        "userid": userId,
        "name": "queryListOrder",
        "ctype": "Web"
    });
}

httpAjax(httpheader, workOffData(0), workOffSuccess0);//0全部
httpAjax(httpheader, workOffData(1), workOffSuccess1);//1未成交
httpAjax(httpheader, workOffData(2), workOffSuccess2);//2.已成交
//我的售出  全部分类成功函数
function workOffSuccess0(data) {
    console.log(data);
    if (data.retcode == 0) {
        var retData = data.respbody.arrayList;
        var workOffAllContent = $("#workOffAllListContent");
        if (retData.length == 0) {
            workOffAllContent.attr("class", "bottom_play Withdrawal_record");
            workOffAllContent.html("暂无数据");
        } else {
            for (var i = 0; i < retData.length; i++) {
                if (retData[i].status == "0") {
                    retData[i].status = "未支付";
                    if (retData[i].validDate == undefined) {
                        retData[i].validDate = "";
                    } else {
                        retData[i].validDate = getMyDate(retData[i].validDate);
                    }
                    workOffAllContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                        + retData[i].orderID
                        + '</li><li class="WithdrawalRecordContentliulli" title="'
                        + retData[i].commodityName
                        + '">'
                        + retData[i].commodityName
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].quantity
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].listPrice
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + getMyDate(retData[i].updateTime)
                        + '</marquee></li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].status
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + retData[i].validDate
                        + '</marquee></li><li class="WithdrawalRecordContentliulli revocationWrap"><button class="" accesskey= '
                        +
                        +'>'
                        + ''
                        + '</button></li></ul></li>');
                } else if (retData[i].status == "1") {
                    retData[i].status = "已委托";
                    if (retData[i].validDate == undefined) {
                        retData[i].validDate = "";
                    } else {
                        retData[i].validDate = getMyDate(retData[i].validDate);
                    }
                    workOffAllContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                        + retData[i].orderID
                        + '</li><li class="WithdrawalRecordContentliulli" title="'
                        + retData[i].commodityName
                        + '">'
                        + retData[i].commodityName
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].quantity
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].listPrice
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + getMyDate(retData[i].updateTime)
                        + '</marquee></li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].status
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + retData[i].validDate
                        + '</marquee></li><li class="WithdrawalRecordContentliulli revocationWrap"><button class="revocation sccd" accesskey= '
                        + retData[i].orderID
                        + '>'
                        + '撤单'
                        + '</button></li></ul></li>');

                    $(".sccd").click(function () {
                        var orderId = this.accessKey;
                        myConfirm({
                            title: '提示',
                            message: '确定撤单吗？',
                            callback: function () {
                                var cxddData = JSON.stringify({
                                    "ctype": "iOS",
                                    "name": "withdrawOrder",
                                    "reqbody": {
                                        "listOrderID": orderId
                                    },
                                    "sessionStr": sessStr,
                                    "userid": userId
                                });
                                httpAjax(httpheader, cxddData, cxddSuccess);
                            }
                        });

                        function cxddSuccess(data) {
                            if (data.retcode == 0) {
                                myToast("撤单成功，资金于一个工作日内到账");
                                //撤销订单后刷新页面数据
                                $("#workOffAllListContent").empty();
                                $("#workOffStayListContent").empty();
                                $("#workOffEndListContent").empty();
                                httpAjax(httpheader, workOffData(0), workOffSuccess0);//0全部
                                httpAjax(httpheader, workOffData(1), workOffSuccess1);//1未成交
                                httpAjax(httpheader, workOffData(2), workOffSuccess2);//2.已成交
                            } else {
                                myToast(data.msg);
                            }
                        }
                    })

                } else if (retData[i].status == "2") {
                    retData[i].status = "已成交";
                    workOffAllContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                        + retData[i].orderID
                        + '</li><li class="WithdrawalRecordContentliulli" title="'
                        + retData[i].commodityName
                        + '">'
                        + retData[i].commodityName
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].quantity
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].listPrice
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + getMyDate(retData[i].updateTime)
                        + '</marquee></li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].status
                        + '</li><li class="WithdrawalRecordContentliulli"></li><li class="WithdrawalRecordContentliulli revocationWrap"><button class="" accesskey= '
                        + ''
                        + '>'
                        + ''
                        + '</button></li></ul></li>');
                } else if (retData[i].status == "3") {
                    retData[i].status = "已撤单";
                    if (retData[i].validDate == undefined) {
                        retData[i].validDate = "";
                    } else {
                        retData[i].validDate = getMyDate(retData[i].validDate);
                    }
                    workOffAllContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                        + retData[i].orderID
                        + '</li><li class="WithdrawalRecordContentliulli" title="'
                        + retData[i].commodityName
                        + '">'
                        + retData[i].commodityName
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].quantity
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].listPrice
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + getMyDate(retData[i].updateTime)
                        + '</marquee></li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].status
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + retData[i].validDate
                        + '</marquee></li><li class="WithdrawalRecordContentliulli revocationWrap"><button class="" accesskey= '
                        + ''
                        + '>'
                        + ''
                        + '</button></li></ul></li>');
                } else if (retData[i].status == "4") {
                    retData[i].status = "已提货";
                    if (retData[i].validDate == undefined) {
                        retData[i].validDate = "";
                    } else {
                        retData[i].validDate = getMyDate(retData[i].validDate);
                    }
                    workOffAllContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                        + retData[i].orderID
                        + '</li><li class="WithdrawalRecordContentliulli" title="'
                        + retData[i].commodityName
                        + '">'
                        + retData[i].commodityName
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].quantity
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].listPrice
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + getMyDate(retData[i].updateTime)
                        + '</marquee></li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].status
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + retData[i].validDate
                        + '</marquee></li><li class="WithdrawalRecordContentliulli revocationWrap"><button class="" accesskey= '
                        + ''
                        + '>'
                        + ''
                        + '</button></li></ul></li>');
                } else if (retData[i].status == "5") {
                    retData[i].status = "已发货";
                    if (retData[i].validDate == undefined) {
                        retData[i].validDate = "";
                    } else {
                        retData[i].validDate = getMyDate(retData[i].validDate);
                    }
                    workOffAllContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                        + retData[i].orderID
                        + '</li><li class="WithdrawalRecordContentliulli" title="'
                        + retData[i].commodityName
                        + '">'
                        + retData[i].commodityName
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].quantity
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].listPrice
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + getMyDate(retData[i].updateTime)
                        + '</marquee></li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].status
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + retData[i].validDate
                        + '</marquee></li><li class="WithdrawalRecordContentliulli revocationWrap"><button class="" accesskey= '
                        + ''
                        + '>'
                        + ''
                        + '</button></li></ul></li>');
                } else if (retData[i].status == "6") {
                    retData[i].status = "订单完成";
                    if (retData[i].validDate == undefined) {
                        retData[i].validDate = "";
                    } else {
                        retData[i].validDate = getMyDate(retData[i].validDate);
                    }
                    workOffAllContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                        + retData[i].orderID
                        + '</li><li class="WithdrawalRecordContentliulli" title="'
                        + retData[i].commodityName
                        + '">'
                        + retData[i].commodityName
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].quantity
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].listPrice
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + getMyDate(retData[i].updateTime)
                        + '</marquee></li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].status
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + retData[i].validDate
                        + '</marquee></li><li class="WithdrawalRecordContentliulli revocationWrap"><button class="" accesskey= '
                        + ''
                        + '>'
                        + ''
                        + '</button></li></ul></li>');
                } else if (retData[i].status == "11") {
                    retData[i].status = "支付尾款";
                    if (retData[i].validDate == undefined) {
                        retData[i].validDate = "";
                    } else {
                        retData[i].validDate = getMyDate(retData[i].validDate);
                    }
                    workOffAllContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                        + retData[i].orderID
                        + '</li><li class="WithdrawalRecordContentliulli" title="'
                        + retData[i].commodityName
                        + '">'
                        + retData[i].commodityName
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].quantity
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].listPrice
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + getMyDate(retData[i].updateTime)
                        + '</marquee></li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].status
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + retData[i].validDate
                        + '</marquee></li><li class="WithdrawalRecordContentliulli revocationWrap"><button class="" accesskey= '
                        + ''
                        + '>'
                        + ''
                        + '</button></li></ul></li>');
                } else if (retData[i].status == "12") {
                    retData[i].status = "已过期";
                    if (retData[i].validDate == undefined) {
                        retData[i].validDate = "";
                    } else {
                        retData[i].validDate = getMyDate(retData[i].validDate);
                    }
                    workOffAllContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                        + retData[i].orderID
                        + '</li><li class="WithdrawalRecordContentliulli" title="'
                        + retData[i].commodityName
                        + '">'
                        + retData[i].commodityName
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].quantity
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].listPrice
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + getMyDate(retData[i].updateTime)
                        + '</marquee></li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].status
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + retData[i].validDate
                        + '</marquee></li><li class="WithdrawalRecordContentliulli revocationWrap"><button class="" accesskey= '
                        + ''
                        + '>'
                        + ''
                        + '</button></li></ul></li>');
                } else if (retData[i].status == "13") {
                    retData[i].status = "违约单";
                    if (retData[i].validDate == undefined) {
                        retData[i].validDate = "";
                    } else {
                        retData[i].validDate = getMyDate(retData[i].validDate);
                    }
                    workOffAllContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                        + retData[i].orderID
                        + '</li><li class="WithdrawalRecordContentliulli" title="'
                        + retData[i].commodityName
                        + '">'
                        + retData[i].commodityName
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].quantity
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].listPrice
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + getMyDate(retData[i].updateTime)
                        + '</marquee></li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].status
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + retData[i].validDate
                        + '</marquee></li><li class="WithdrawalRecordContentliulli revocationWrap"><button class="" accesskey= '
                        + ''
                        + '>'
                        + ''
                        + '</button></li></ul></li>');
                } else if (retData[i].status == "20") {
                    retData[i].status = "交易中";
                    console.log(retData[i].validDate);
                    if (retData[i].validDate == undefined) {
                        retData[i].validDate = "";
                    } else {
                        retData[i].validDate = getMyDate(retData[i].validDate);
                    }
                    workOffAllContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                        + retData[i].orderID
                        + '</li><li class="WithdrawalRecordContentliulli" title="'
                        + retData[i].commodityName
                        + '">'
                        + retData[i].commodityName
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].quantity
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].listPrice
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + getMyDate(retData[i].updateTime)
                        + '</marquee></li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].status
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + retData[i].validDate
                        + '</marquee></li><li class="WithdrawalRecordContentliulli revocationWrap"><button class="" accesskey= '
                        + ''
                        + '>'
                        + ''
                        + '</button></li></ul></li>');
                }
            }
        }
    } else {
        if (data.retcode == -17401) {
            loginOut();
            window.sessionStorage.setItem("LOGINSTATE", "flase");
            window.sessionStorage.setItem("LOGINSOURCE", 1);
            window.location.href = "loginPage.html";
        } else {
            myToast(data.msg);
        }
    }
}

//我的售出  未成交成功函数
function workOffSuccess1(data) {
    console.log(data);
    if (data.retcode == 0) {
        var retData = data.respbody.arrayList;
        var workOffStayListContent = $("#workOffStayListContent");
        if (retData.length == 0) {
            workOffStayListContent.attr("class", "bottom_play Withdrawal_record");
            workOffStayListContent.html("暂无数据");
        } else {
            for (var i = 0; i < retData.length; i++) {
                if (retData[i].status == "0") {
                    retData[i].status = "未支付";
                    if (retData[i].validDate == undefined) {
                        retData[i].validDate = "";
                    } else {
                        retData[i].validDate = getMyDate(retData[i].validDate);
                    }
                    workOffStayListContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                        + retData[i].orderID
                        + '</li><li class="WithdrawalRecordContentliulli" title="'
                        + retData[i].commodityName
                        + '">'
                        + retData[i].commodityName
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].quantity
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].listPrice
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + getMyDate(retData[i].updateTime)
                        + '</marquee></li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].status
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + retData[i].validDate
                        + '</marquee></li><li class="WithdrawalRecordContentliulli revocationWrap"><button class="" accesskey= '
                        + ''
                        + '>'
                        + ''
                        + '</button></li></ul></li>');
                } else if (retData[i].status == "1") {
                    retData[i].status = "已委托";
                    if (retData[i].validDate == undefined) {
                        retData[i].validDate = "";
                    } else {
                        retData[i].validDate = getMyDate(retData[i].validDate);
                    }
                    workOffStayListContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                        + retData[i].orderID
                        + '</li><li class="WithdrawalRecordContentliulli" title="'
                        + retData[i].commodityName
                        + '">'
                        + retData[i].commodityName
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].quantity
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].listPrice
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + getMyDate(retData[i].updateTime)
                        + '</marquee></li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].status
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + retData[i].validDate
                        + '</marquee></li><li class="WithdrawalRecordContentliulli revocationWrap"><button class="revocation sccd" accesskey= '
                        + retData[i].orderID
                        + '>'
                        + '撤单'
                        + '</button></li></ul></li>');

                    $(".sccd").click(function () {
                        var orderId = this.accessKey;
                        myConfirm({
                            title: '提示',
                            message: '确定撤单吗？',
                            callback: function () {
                                var cxddData = JSON.stringify({
                                    "ctype": "iOS",
                                    "name": "withdrawOrder",
                                    "reqbody": {
                                        "listOrderID": orderId
                                    },
                                    "sessionStr": sessStr,
                                    "userid": userId
                                });
                                httpAjax(httpheader, cxddData, cxddSuccess);
                            }
                        });

                        function cxddSuccess(data) {
                            if (data.retcode == 0) {
                                myToast("撤单成功，资金于一个工作日内到账");
                                //撤销订单后刷新页面数据
                                $("#workOffAllListContent").empty();
                                $("#workOffStayListContent").empty();
                                $("#workOffEndListContent").empty();
                                httpAjax(httpheader, workOffData(0), workOffSuccess0);//0全部
                                httpAjax(httpheader, workOffData(1), workOffSuccess1);//1未成交
                                httpAjax(httpheader, workOffData(2), workOffSuccess2);//2.已成交
                            } else {
                                myToast(data.msg);
                            }
                        }
                    })

                } else if (retData[i].status == "2") {
                    retData[i].status = "已成交";
                    workOffStayListContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                        + retData[i].orderID
                        + '</li><li class="WithdrawalRecordContentliulli" title="'
                        + retData[i].commodityName
                        + '">'
                        + retData[i].commodityName
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].quantity
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].listPrice
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + getMyDate(retData[i].updateTime)
                        + '</marquee></li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].status
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        +
                        +'</marquee></li><li class="WithdrawalRecordContentliulli revocationWrap"><button class="" accesskey= '
                        + ''
                        + '>'
                        + ''
                        + '</button></li></ul></li>');
                } else if (retData[i].status == "3") {
                    retData[i].status = "已撤单";
                    if (retData[i].validDate == undefined) {
                        retData[i].validDate = "";
                    } else {
                        retData[i].validDate = getMyDate(retData[i].validDate);
                    }
                    workOffStayListContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                        + retData[i].orderID
                        + '</li><li class="WithdrawalRecordContentliulli" title="'
                        + retData[i].commodityName
                        + '">'
                        + retData[i].commodityName
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].quantity
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].listPrice
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + getMyDate(retData[i].updateTime)
                        + '</marquee></li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].status
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + retData[i].validDate
                        + '</marquee></li><li class="WithdrawalRecordContentliulli revocationWrap"><button class="" accesskey= '
                        + ''
                        + '>'
                        + ''
                        + '</button></li></ul></li>');
                } else if (retData[i].status == "4") {
                    retData[i].status = "已提货";
                    if (retData[i].validDate == undefined) {
                        retData[i].validDate = "";
                    } else {
                        retData[i].validDate = getMyDate(retData[i].validDate);
                    }
                    workOffStayListContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                        + retData[i].orderID
                        + '</li><li class="WithdrawalRecordContentliulli" title="'
                        + retData[i].commodityName
                        + '">'
                        + retData[i].commodityName
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].quantity
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].listPrice
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + getMyDate(retData[i].updateTime)
                        + '</marquee></li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].status
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + retData[i].validDate
                        + '</marquee></li><li class="WithdrawalRecordContentliulli revocationWrap"><button class="" accesskey= '
                        + ''
                        + '>'
                        + ''
                        + '</button></li></ul></li>');
                } else if (retData[i].status == "5") {
                    retData[i].status = "已发货";
                    if (retData[i].validDate == undefined) {
                        retData[i].validDate = "";
                    } else {
                        retData[i].validDate = getMyDate(retData[i].validDate);
                    }
                    workOffStayListContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                        + retData[i].orderID
                        + '</li><li class="WithdrawalRecordContentliulli" title="'
                        + retData[i].commodityName
                        + '">'
                        + retData[i].commodityName
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].quantity
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].listPrice
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + getMyDate(retData[i].updateTime)
                        + '</marquee></li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].status
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + retData[i].validDate
                        + '</marquee></li><li class="WithdrawalRecordContentliulli revocationWrap"><button class="" accesskey= '
                        + ''
                        + '>'
                        + ''
                        + '</button></li></ul></li>');
                } else if (retData[i].status == "6") {
                    retData[i].status = "订单完成";
                    if (retData[i].validDate == undefined) {
                        retData[i].validDate = "";
                    } else {
                        retData[i].validDate = getMyDate(retData[i].validDate);
                    }
                    workOffStayListContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                        + retData[i].orderID
                        + '</li><li class="WithdrawalRecordContentliulli" title="'
                        + retData[i].commodityName
                        + '">'
                        + retData[i].commodityName
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].quantity
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].listPrice
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + getMyDate(retData[i].updateTime)
                        + '</marquee></li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].status
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + retData[i].validDate
                        + '</marquee></li><li class="WithdrawalRecordContentliulli revocationWrap"><button class="" accesskey= '
                        + ''
                        + '>'
                        + ''
                        + '</button></li></ul></li>');
                } else if (retData[i].status == "11") {
                    retData[i].status = "支付尾款";
                    if (retData[i].validDate == undefined) {
                        retData[i].validDate = "";
                    } else {
                        retData[i].validDate = getMyDate(retData[i].validDate);
                    }
                    workOffStayListContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                        + retData[i].orderID
                        + '</li><li class="WithdrawalRecordContentliulli" title="'
                        + retData[i].commodityName
                        + '">'
                        + retData[i].commodityName
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].quantity
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].listPrice
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + getMyDate(retData[i].updateTime)
                        + '</marquee></li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].status
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + retData[i].validDate
                        + '</marquee></li><li class="WithdrawalRecordContentliulli revocationWrap"><button class="" accesskey= '
                        + ''
                        + '>'
                        + ''
                        + '</button></li></ul></li>');
                } else if (retData[i].status == "12") {
                    retData[i].status = "已过期";
                    if (retData[i].validDate == undefined) {
                        retData[i].validDate = "";
                    } else {
                        retData[i].validDate = getMyDate(retData[i].validDate);
                    }
                    workOffStayListContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                        + retData[i].orderID
                        + '</li><li class="WithdrawalRecordContentliulli" title="'
                        + retData[i].commodityName
                        + '">'
                        + retData[i].commodityName
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].quantity
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].listPrice
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + getMyDate(retData[i].updateTime)
                        + '</marquee></li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].status
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + retData[i].validDate
                        + '</marquee></li><li class="WithdrawalRecordContentliulli revocationWrap"><button class="" accesskey= '
                        + ''
                        + '>'
                        + ''
                        + '</button></li></ul></li>');
                } else if (retData[i].status == "13") {
                    retData[i].status = "违约单";
                    if (retData[i].validDate == undefined) {
                        retData[i].validDate = "";
                    } else {
                        retData[i].validDate = getMyDate(retData[i].validDate);
                    }
                    workOffStayListContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                        + retData[i].orderID
                        + '</li><li class="WithdrawalRecordContentliulli" title="'
                        + retData[i].commodityName
                        + '">'
                        + retData[i].commodityName
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].quantity
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].listPrice
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + getMyDate(retData[i].updateTime)
                        + '</marquee></li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].status
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + retData[i].validDate
                        + '</marquee></li><li class="WithdrawalRecordContentliulli revocationWrap"><button class="" accesskey= '
                        + ''
                        + '>'
                        + ''
                        + '</button></li></ul></li>');
                } else if (retData[i].status == "20") {
                    retData[i].status = "交易中";
                    if (retData[i].validDate == undefined) {
                        retData[i].validDate = "";
                    } else {
                        retData[i].validDate = getMyDate(retData[i].validDate);
                    }
                    workOffStayListContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                        + retData[i].orderID
                        + '</li><li class="WithdrawalRecordContentliulli" title="'
                        + retData[i].commodityName
                        + '">'
                        + retData[i].commodityName
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].quantity
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].listPrice
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + getMyDate(retData[i].updateTime)
                        + '</marquee></li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].status
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + retData[i].validDate
                        + '</marquee></li><li class="WithdrawalRecordContentliulli revocationWrap"><button class="" accesskey= '
                        + ''
                        + '>'
                        + ''
                        + '</button></li></ul></li>');
                }
            }
        }
    } else {
        if (data.retcode == -17401) {
            loginOut();
            window.sessionStorage.setItem("LOGINSTATE", "flase");
            window.sessionStorage.setItem("LOGINSOURCE", 1);
            window.location.href = "loginPage.html";
        } else {
            myToast(data.msg);
        }
    }
}

//我的售出  已成交成功函数
function workOffSuccess2(data) {
    console.log(data);
    if (data.retcode == 0) {
        var retData = data.respbody.arrayList;
        var workOffEndListContent = $("#workOffEndListContent");
        if (retData.length == 0) {
            workOffEndListContent.attr("class", "bottom_play Withdrawal_record");
            workOffEndListContent.html("暂无数据");
        } else {
            for (var i = 0; i < retData.length; i++) {
                if (retData[i].validDate == undefined) {
                    retData[i].validDate = "";
                } else {
                    retData[i].validDate = getMyDate(retData[i].validDate);
                }

                if (retData[i].status == "0") {
                    retData[i].status = "未支付";
                } else if (retData[i].status == "1") {
                    retData[i].status = "已委托";
                } else if (retData[i].status == "2") {
                    retData[i].status = "已成交";
                } else if (retData[i].status == "3") {
                    retData[i].status = "已撤单";
                } else if (retData[i].status == "4") {
                    retData[i].status = "已提货";
                } else if (retData[i].status == "5") {
                    retData[i].status = "已发货";
                } else if (retData[i].status == "6") {
                    retData[i].status = "订单完成";
                } else if (retData[i].status == "11") {
                    retData[i].status = "支付尾款";
                } else if (retData[i].status == "12") {
                    retData[i].status = "已过期";
                } else if (retData[i].status == "13") {
                    retData[i].status = "违约单";
                } else if (retData[i].status == "20") {
                    retData[i].status = "交易中";
                }
                workOffEndListContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                    + retData[i].orderID
                    + '</li><li class="WithdrawalRecordContentliulli" title="'
                    + retData[i].commodityName
                    + '">'
                    + retData[i].commodityName
                    + '</li><li class="WithdrawalRecordContentliulli">'
                    + retData[i].quantity
                    + '</li><li class="WithdrawalRecordContentliulli">'
                    + retData[i].listPrice
                    + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                    + retData[i].updateTime
                    + '</marquee></li><li class="WithdrawalRecordContentliulli">'
                    + retData[i].status
                    + '</li><li class="WithdrawalRecordContentliulli"></li><li class="WithdrawalRecordContentliulli revocationWrap"><button class="" accesskey= '
                    + ''
                    + '>'
                    + ''
                    + '</button></li></ul></li>');
            }
        }
    } else {
        if (data.retcode == -17401) {
            loginOut();
            window.sessionStorage.setItem("LOGINSTATE", "flase");
            window.sessionStorage.setItem("LOGINSOURCE", 1);
            window.location.href = "loginPage.html";
        } else {
            myToast(data.msg);
        }

    }
}

//我的分销记录
function DistributionData() {
    return JSON.stringify({
        "reqbody": {
            "status": 0,
            "pageSize": 10,
            "pageIndex": 1
        },
        "sessionStr": sessStr,
        "userid": userId,
        "name": "querySellerOrders",
        "ctype": "Web"
    })
}
httpAjax(httpheader, DistributionData(),DistributionSuccess);
//我的分销记录  全部分类成功函数
function DistributionSuccess(data) {
    console.log(data);
    if(data.retcode == 0){
        var retData = data.respbody.arrayList;
        var distributionAllListContent = $("#distributionAllListContent");
        if (retData.length == 0) {
            distributionAllListContent.attr("class", "bottom_play Withdrawal_record");
            distributionAllListContent.html("暂无数据");
        } else {
            for (var i = 0; i < retData.length; i++) {
                //有效期
                if (retData[i].validDate == undefined) {
                    retData[i].validDate = "";
                }else if(retData[i].validDate == ""){
                    retData[i].validDate = ""
                } else {
                    retData[i].validDate = getMyDate(retData[i].validDate);
                }

                if (retData[i].status == "0") {
                    retData[i].status = "未支付";
                } else if (retData[i].status == "1") {
                    retData[i].status = "已委托";
                } else if (retData[i].status == "2") {
                    retData[i].status = "已成交";
                } else if (retData[i].status == "3") {
                    retData[i].status = "已撤单";
                } else if (retData[i].status == "4") {
                    retData[i].status = "已提货";
                } else if (retData[i].status == "5") {
                    retData[i].status = "已发货";
                } else if (retData[i].status == "6") {
                    retData[i].status = "订单完成";
                } else if (retData[i].status == "11") {
                    retData[i].status = "支付尾款";
                } else if (retData[i].status == "12") {
                    retData[i].status = "已过期";
                } else if (retData[i].status == "13") {
                    retData[i].status = "违约单";
                } else if (retData[i].status == "20") {
                    retData[i].status = "交易中";
                }
                distributionAllListContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                    + retData[i].orderID
                    + '</li><li class="WithdrawalRecordContentliulli" title="'
                    + retData[i].commodityName
                    + '">'
                    + retData[i].commodityName
                    + '</li><li class="WithdrawalRecordContentliulli">'
                    + retData[i].list[0].quantity
                    + '</li><li class="WithdrawalRecordContentliulli">'
                    + retData[i].list[0].price
                    + '</li><li class="WithdrawalRecordContentliulli">'
                    + retData[i].totalPrice
                    +'</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                    + getMyDate(retData[i].createTime)
                    + '</marquee></li><li class="WithdrawalRecordContentliulli">'
                    + retData[i].validDate
                    +'</li><li class="WithdrawalRecordContentliulli revocationWrap">'
                    + retData[i].status
                    +'</li></ul></li>');
            }
        }
    }else{
        if (data.retcode == -17401) {
            loginOut();
            window.sessionStorage.setItem("LOGINSTATE", "flase");
            window.sessionStorage.setItem("LOGINSOURCE", 1);
            window.location.href = "loginPage.html";
        } else {
            myToast(data.msg);
        }
    }
}

//我的购入
//tab切换
var BuySpans = $('.pick_top_span01');
var BuyLists = $('.pickContent01');
for (var i = 0; i < BuySpans.length; i++) {
    BuySpans[i].index = i;//将i赋给相应的button下标
    BuySpans[i].onclick = function () {
        for (var j = 0; j < BuySpans.length; j++) {
            BuySpans[j].style.backgroundColor = 'whitesmoke';
            BuySpans[j].style.color = 'black';
            BuyLists[j].style.display = "none";
        }
        this.style.backgroundColor = "#e7bb1c";
        this.style.color = "white";
        BuyLists[this.index].style.display = "block";
    }
}

function buyData(status, pageIndex) {
    return JSON.stringify({
        "reqbody": {
            "status": status,//0：全部 ，1：未成交  2 ：已成交
            "bsFlag": 1,
            "pageSize": 20,
            "pageIndex": pageIndex
        },
        "sessionStr": sessStr,
        "userid": userId,
        "name": "queryListOrder",
        "ctype": "Web"
    })
}

httpAjax(httpheader, buyData(0, 1), buySuccess0);   //0全部
httpAjax(httpheader, buyData(1, 1), buySuccess1);   //1未成交
httpAjax(httpheader, buyData(2, 1), buySuccess2);   //2已成交
//我的购入全部成功函数
function buySuccess0(data) {
    console.log(data);
    if (data.retcode == 0) {
        var BuyAllListContent = $("#BuyAllListContent");
        var retData = data.respbody.arrayList;
        if (retData.length == 0) {
            BuyAllListContent.attr("class", "bottom_play Withdrawal_record");
            BuyAllListContent.html("暂无数据");
        } else {
            for (var i = 0; i < retData.length; i++) {
                if (retData[i].status == "0") {
                    retData[i].status = "未支付";
                    if (retData[i].validDate == undefined) {
                        retData[i].validDate = "";
                    } else {
                        retData[i].validDate = getMyDate(retData[i].validDate);
                    }
                    BuyAllListContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                        + retData[i].orderID
                        + '</li><li class="WithdrawalRecordContentliulli" title="'
                        + retData[i].commodityName
                        + '">'
                        + retData[i].commodityName
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].quantity
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].listPrice
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + getMyDate(retData[i].updateTime)
                        + '</marquee></li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].status
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + retData[i].validDate
                        + '</marquee></li><li class="WithdrawalRecordContentliulli revocationWrap"><button class="" accesskey= '
                        + ''
                        + '>'
                        + ''
                        + '</button></li></ul></li>');
                } else if (retData[i].status == "1") {
                    retData[i].status = "已委托";
                    if (retData[i].validDate == undefined) {
                        retData[i].validDate = "";
                    } else {
                        retData[i].validDate = getMyDate(retData[i].validDate);
                    }
                    BuyAllListContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                        + retData[i].orderID
                        + '</li><li class="WithdrawalRecordContentliulli" title="'
                        + retData[i].commodityName
                        + '">'
                        + retData[i].commodityName
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].quantity
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].listPrice
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + getMyDate(retData[i].updateTime)
                        + '</marquee></li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].status
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + retData[i].validDate
                        + '</marquee></li><li class="WithdrawalRecordContentliulli revocationWrap" accesskey="'
                        + retData[i].orderID
                        + '"><button class="revocation cxdd" accesskey= '
                        + ''
                        + ' style="paddingTop:0">'
                        + '撤单'
                        + '</button></li></ul></li>');
                    $(".cxdd").click(function () {
                        var btnWrap = this.parentNode;
                        var btnOrderID = btnWrap.accessKey;
                        myConfirm({
                            title: '提示',
                            message: '确定撤单吗？',
                            callback: function () {
                                var cxddData = JSON.stringify({
                                    "ctype": "iOS",
                                    "name": "withdrawOrder",
                                    "reqbody": {
                                        "listOrderID": btnOrderID
                                    },
                                    "sessionStr": sessStr,
                                    "userid": userId
                                });
                                httpAjax(httpheader, cxddData, cxddSuccess);
                            }
                        });

                        function cxddSuccess(data) {
                            console.log(data);
                            if (data.retcode == 0) {
                                myToast("撤单成功，资金于一个工作日内到账");
                                //撤销订单后刷新页面数据
                                $("#BuyAllListContent").empty();
                                $("#BuyStayListContent").empty();
                                $("#BuyEndListContent").empty();
                                httpAjax(httpheader, buyData(0), buySuccess0);//0全部
                                httpAjax(httpheader, buyData(1), buySuccess1);//1未成交
                                httpAjax(httpheader, buyData(2), buySuccess2);//2已成交
                            } else {
                                myToast(data.msg);
                            }
                        }
                    })
                } else if (retData[i].status == "2") {
                    retData[i].status = "已成交";
                    if (retData[i].validDate == undefined) {
                        retData[i].validDate = "";
                    } else {
                        retData[i].validDate = getMyDate(retData[i].validDate);
                    }
                    BuyAllListContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                        + retData[i].orderID
                        + '</li><li class="WithdrawalRecordContentliulli" title="'
                        + retData[i].commodityName
                        + '">'
                        + retData[i].commodityName
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].quantity
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].listPrice
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + getMyDate(retData[i].updateTime)
                        + '</marquee></li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].status
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + retData[i].validDate
                        + '</marquee></li><li class="WithdrawalRecordContentliulli revocationWrap"><button class="" accesskey= '
                        + ''
                        + '>'
                        + ''
                        + '</button></li></ul></li>');
                } else if (retData[i].status == "3") {
                    retData[i].status = "已撤单";
                    if (retData[i].validDate == undefined) {
                        retData[i].validDate = "";
                    } else {
                        retData[i].validDate = getMyDate(retData[i].validDate);
                    }
                    BuyAllListContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                        + retData[i].orderID
                        + '</li><li class="WithdrawalRecordContentliulli" title="'
                        + retData[i].commodityName
                        + '">'
                        + retData[i].commodityName
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].quantity
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].listPrice
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + getMyDate(retData[i].updateTime)
                        + '</marquee></li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].status
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + retData[i].validDate
                        + '</marquee></li><li class="WithdrawalRecordContentliulli revocationWrap"><button class="" accesskey= '
                        + ''
                        + '>'
                        + ''
                        + '</button></li></ul></li>');
                } else if (retData[i].status == "4") {
                    retData[i].status = "已提货";
                    if (retData[i].validDate == undefined) {
                        retData[i].validDate = "";
                    } else {
                        retData[i].validDate = getMyDate(retData[i].validDate);
                    }
                    BuyAllListContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                        + retData[i].orderID
                        + '</li><li class="WithdrawalRecordContentliulli" title="'
                        + retData[i].commodityName
                        + '">'
                        + retData[i].commodityName
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].quantity
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].listPrice
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + getMyDate(retData[i].updateTime)
                        + '</marquee></li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].status
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + retData[i].validDate
                        + '</marquee></li><li class="WithdrawalRecordContentliulli revocationWrap"><button class="" accesskey= '
                        + ''
                        + '>'
                        + ''
                        + '</button></li></ul></li>');
                } else if (retData[i].status == "5") {
                    retData[i].status = "已发货";
                    if (retData[i].validDate == undefined) {
                        retData[i].validDate = "";
                    } else {
                        retData[i].validDate = getMyDate(retData[i].validDate);
                    }
                    BuyAllListContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                        + retData[i].orderID
                        + '</li><li class="WithdrawalRecordContentliulli" title="'
                        + retData[i].commodityName
                        + '">'
                        + retData[i].commodityName
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].quantity
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].listPrice
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + getMyDate(retData[i].updateTime)
                        + '</marquee></li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].status
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + retData[i].validDate
                        + '</marquee></li><li class="WithdrawalRecordContentliulli revocationWrap"><button class="" accesskey= '
                        + ''
                        + '>'
                        + ''
                        + '</button></li></ul></li>');
                } else if (retData[i].status == "6") {
                    retData[i].status = "订单完成";
                    BuyAllListContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                        + retData[i].orderID
                        + '</li><li class="WithdrawalRecordContentliulli" title="'
                        + retData[i].commodityName
                        + '">'
                        + retData[i].commodityName
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].quantity
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].listPrice
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + getMyDate(retData[i].updateTime)
                        + '</marquee></li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].status
                        + '</li><li class="WithdrawalRecordContentliulli"></li><li class="WithdrawalRecordContentliulli revocationWrap"><button class="" accesskey= '
                        + ''
                        + '>'
                        + ''
                        + '</button></li></ul></li>');
                } else if (retData[i].status == "11") {
                    retData[i].status = "支付尾款";
                    if (retData[i].validDate == undefined) {
                        retData[i].validDate = "";
                    } else {
                        retData[i].validDate = getMyDate(retData[i].validDate);
                    }
                    if (retData[i].isDelist == 0) {    //支付尾款可撤单
                        var payMoney = 0;
                        payMoney = Number(retData[i].totalCost) - Number(retData[i].paidAmount);
                        BuyAllListContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                            + retData[i].orderID
                            + '</li><li class="WithdrawalRecordContentliulli" title="'
                            + retData[i].commodityName
                            + '">'
                            + retData[i].commodityName
                            + '</li><li class="WithdrawalRecordContentliulli">'
                            + retData[i].quantity
                            + '</li><li class="WithdrawalRecordContentliulli">'
                            + retData[i].listPrice
                            + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                            + getMyDate(retData[i].updateTime)
                            + '</marquee></li><li class="WithdrawalRecordContentliulli">'
                            + retData[i].status
                            + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                            + retData[i].validDate
                            + '</marquee></li><li class="WithdrawalRecordContentliulli revocationWrap" accesskey="'
                            + retData[i].orderID
                            + '"><button class="revocatio zfwkk" accesskey='
                            + payMoney
                            + ' style="paddingTop:0;marginLeft:0;marginRight:10px">'
                            + '支付尾款'
                            + '</button><button class="revocatio wkcd" accesskey="'
                            + retData[i].isDelist
                            + '">'
                            + '撤单'
                            + '</button></li></ul></li>');
                        //尾款支付
                        $(".zfwkk").click(function () {
                            var that = this;
                            var btnPar = this.parentNode;
                            var btnOrderId = btnPar.accessKey;//orderid
                            var btnPayMoney = Number(this.accessKey);//尾款金额
                            //总金额 = 数量*单价
                            var btnListPrice = btnPar.previousSibling.previousSibling.previousSibling.previousSibling;   //单价
                            var listPrice = btnListPrice.innerHTML;
                            var btnQuantity = btnListPrice.previousSibling;    //数量
                            var quantity = btnQuantity.innerHTML;
                            var zPrice = quantity * listPrice;
                            //根据总金额请求手续费
                            var serviceChargeData = JSON.stringify({
                                "ctype": "Web",
                                "name": "queryfree",
                                "reqbody": {
                                    "totalAmount": zPrice,
                                    "expenseType": "101"
                                },
                                "sessionStr": sessStr,
                                "userid": userId
                            });
                            httpAjax(httpheader, serviceChargeData, serviceChargeSuccess);

                            function serviceChargeSuccess(data) {
                                console.log(data);
                                if (data.retcode == 0) {
                                    var sxf = data.respbody.free;
                                    var payment = btnPayMoney.toFixed(2);
                                    console.log(payment);
                                    myConfirm({
                                        title: '提示',
                                        message: '支付尾款' + btnPayMoney + "元" + "<br>" + "一次性手续费" + sxf + "元",
                                        callback: function () {
                                            var balanceData = JSON.stringify({
                                                "ctype": "Web",
                                                "name": "listBalancePay",
                                                "reqbody": {
                                                    "orderId": btnOrderId,
                                                    "payAmount": btnPayMoney
                                                },
                                                "sessionStr": sessStr,
                                                "userid": userId
                                            });
                                            console.log(balanceData);
                                            httpAjax(httpheader, balanceData, balanceSuccess);

                                            function balanceSuccess(data) {
                                                if (data.retcode == 0) {
                                                    myToast("尾款支付成功");
                                                    //尾款支付成功后刷新页面
                                                    $("#BuyAllListContent").empty();
                                                    $("#BuyStayListContent").empty();
                                                    $("#BuyEndListContent").empty();
                                                    httpAjax(httpheader, buyData(0), buySuccess0);//0全部
                                                    httpAjax(httpheader, buyData(1), buySuccess1);//1未成交
                                                    httpAjax(httpheader, buyData(2), buySuccess2);//2已成交
                                                } else {
                                                    console.log(data.msg);
                                                    myToast(data.msg);
                                                }
                                            }
                                        }
                                    })
                                } else {
                                    if (data.retcode == -17401) {
                                        loginOut();
                                        window.sessionStorage.setItem("LOGINSTATE", "flase");
                                        myToast(data.msg);
                                        window.location.href = "loginPage.html";
                                    } else {
                                        console.log(data.msg);
                                        myToast(data.msg);
                                    }
                                }
                            }
                        });
                        $(".wkcd").click(function () {    //尾款撤单
                            var isDelist = this.accessKey;
                            //可撤单
                            var btnWrap = this.parentNode;
                            var btnOrderID = btnWrap.accessKey;
                            myConfirm({
                                title: '提示',
                                message: '确定撤单吗？',
                                callback: function () {
                                    var cxddData = JSON.stringify({
                                        "ctype": "iOS",
                                        "name": "withdrawOrder",
                                        "reqbody": {
                                            "listOrderID": btnOrderID
                                        },
                                        "sessionStr": sessStr,
                                        "userid": userId
                                    });
                                    httpAjax(httpheader, cxddData, cxddSuccess);
                                }
                            });

                            function cxddSuccess(data) {
                                if (data.retcode == 0) {
                                    myToast("撤单成功，资金于一个工作日内到账");
                                    $("#BuyAllListContent").empty();
                                    $("#BuyStayListContent").empty();
                                    $("#BuyEndListContent").empty();
                                    httpAjax(httpheader, buyData(0), buySuccess0);//0全部
                                    httpAjax(httpheader, buyData(1), buySuccess1);//1未成交
                                    httpAjax(httpheader, buyData(2), buySuccess2);//2已成交
                                } else {
                                    if (data.retcode == -17401) {
                                        loginOut();
                                        window.sessionStorage.setItem("LOGINSTATE", "flase");
                                        window.sessionStorage.setItem("LOGINSOURCE", 1);
                                        window.location.href = "loginPage.html";
                                    } else {
                                        myToast(data.msg);
                                    }
                                }
                            }
                        })
                    } else if (retData[i].isDelist == 1) {   //支付尾款不可撤单
                        var payMoney = Number(retData[i].totalCost) - Number(retData[i].paidAmount);
                        if (retData[i].validDate == undefined) {
                            retData[i].validDate = "";
                        } else if (retData[i].validDate == "") {
                            retData[i].validDate = "";
                        } else {
                            retData[i].validDate = getMyDate(retData[i].validDate);
                        }
                        console.log(retData[i].validDate);
                        BuyAllListContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                            + retData[i].orderID
                            + '</li><li class="WithdrawalRecordContentliulli" title="'
                            + retData[i].commodityName
                            + '">'
                            + retData[i].commodityName
                            + '</li><li class="WithdrawalRecordContentliulli">'
                            + retData[i].quantity
                            + '</li><li class="WithdrawalRecordContentliulli">'
                            + retData[i].listPrice
                            + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                            + getMyDate(retData[i].updateTime)
                            + '</marquee></li><li class="WithdrawalRecordContentliulli">'
                            + retData[i].status
                            + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                            + retData[i].validDate
                            + '</marquee></li><li class="WithdrawalRecordContentliulli revocationWrap" accesskey="'
                            + retData[i].orderID
                            + '"><button id="lala" class="revocation zfwk" accesskey= '
                            + payMoney
                            + ' style="paddingTop:0">'
                            + '支付尾款'
                            + '</button></li></ul></li>');

                        $(".zfwk").click(function () {    //支付尾款按钮
                            var that = this;
                            var btnPar = this.parentNode;
                            var btnOrderId = btnPar.accessKey;
                            var btnPayMoney = Number(this.accessKey);
                            //总金额 = 数量*单价
                            var btnListPrice = btnPar.previousSibling.previousSibling.previousSibling.previousSibling;   //单价
                            var listPrice = btnListPrice.innerHTML;
                            var btnQuantity = btnListPrice.previousSibling;    //数量
                            var quantity = btnQuantity.innerHTML;
                            var zPrice = quantity * listPrice;
                            //根据总金额请求手续费
                            var serviceChargeData = JSON.stringify({
                                "ctype": "Web",
                                "name": "queryfree",
                                "reqbody": {
                                    "totalAmount": zPrice,
                                    "expenseType": "101"
                                },
                                "sessionStr": sessStr,
                                "userid": userId
                            });
                            httpAjax(httpheader, serviceChargeData, serviceChargeSuccess);

                            function serviceChargeSuccess(data) {
                                if (data.retcode == 0) {
                                    console.log(data);
                                    var sxf = data.respbody.free;
                                    myConfirm({
                                        title: '提示',
                                        message: '支付尾款' + that.accessKey + "<br>" + "一次性手续费" + sxf,
                                        callback: function () {
                                            var balanceData = JSON.stringify({
                                                "ctype": "Web",
                                                "name": "listBalancePay",
                                                "reqbody": {
                                                    "orderId": btnOrderId,
                                                    "payAmount": btnPayMoney,
                                                },
                                                "sessionStr": sessStr,
                                                "userid": userId
                                            });
                                            httpAjax(httpheader, balanceData, balanceSuccess);

                                            function balanceSuccess(data) {
                                                if (data.retcode == 0) {
                                                    myToast("尾款支付成功");
                                                    $("#BuyAllListContent").empty();
                                                    $("#BuyStayListContent").empty();
                                                    $("#BuyEndListContent").empty();
                                                    httpAjax(httpheader, buyData(0), buySuccess0);//0全部
                                                    httpAjax(httpheader, buyData(1), buySuccess1);//1未成交
                                                    httpAjax(httpheader, buyData(2), buySuccess2);//2已成交
                                                } else {
                                                    console.log(data.msg);
                                                    myToast(data.msg);
                                                }
                                            }
                                        }
                                    })
                                } else {
                                    if (data.retcode == -17401) {
                                        loginOut();
                                        window.sessionStorage.setItem("LOGINSTATE", "flase");
                                        window.sessionStorage.setItem("LOGINSOURCE", 1);
                                        window.location.href = "loginPage.html";
                                    } else {
                                        console.log(data.msg);
                                        myToast(data.msg);
                                    }
                                }
                            }
                        })
                    }
                } else if (retData[i].status == "12") {
                    retData[i].status = "已过期";
                    if (retData[i].validDate == undefined) {
                        retData[i].validDate = "";
                    } else if (retData[i].validDate == "") {
                        retData[i].validDate = "";
                    } else {
                        retData[i].validDate = getMyDate(retData[i].validDate);
                    }
                    BuyAllListContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                        + retData[i].orderID
                        + '</li><li class="WithdrawalRecordContentliulli" title="'
                        + retData[i].commodityName
                        + '">'
                        + retData[i].commodityName
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].quantity
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].listPrice
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + getMyDate(retData[i].updateTime)
                        + '</marquee></li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].status
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + retData[i].validDate
                        + '</marquee></li><li class="WithdrawalRecordContentliulli revocationWrap" accesskey="'
                        + retData[i].orderID
                        + '"><button class="" accesskey=“ '
                        + '”>'
                        + '</button></li></ul></li>');
                } else if (retData[i].status == "13") {
                    retData[i].status = "违约单";
                    BuyAllListContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                        + retData[i].orderID
                        + '</li><li class="WithdrawalRecordContentliulli" title="'
                        + retData[i].commodityName
                        + '">'
                        + retData[i].commodityName
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].quantity
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].listPrice
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + getMyDate(retData[i].updateTime)
                        + '</marquee></li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].status
                        + '</li><li class="WithdrawalRecordContentliulli"></li><li class="WithdrawalRecordContentliulli revocationWrap" accesskey="'
                        + retData[i].orderID
                        + '"><button class="" accesskey=“ '
                        + '”>'
                        + '</button></li></ul></li>');
                } else if (retData[i].status == "20") {
                    retData[i].status = "交易中";
                    if (retData[i].validDate == undefined) {
                        retData[i].validDate = "";
                    } else if (retData[i].validDate == "") {
                        retData[i].validDate = "";
                    } else {
                        retData[i].validDate = getMyDate(retData[i].validDate);
                    }
                    BuyAllListContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                        + retData[i].orderID
                        + '</li><li class="WithdrawalRecordContentliulli" title="'
                        + retData[i].commodityName
                        + '">'
                        + retData[i].commodityName
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].quantity
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].listPrice
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + getMyDate(retData[i].updateTime)
                        + '</marquee></li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].status
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + retData[i].validDate
                        + '</marquee></li><li class="WithdrawalRecordContentliulli revocationWrap" accesskey="'
                        + retData[i].orderID
                        + '"><button class="" accesskey=“ '
                        + '”>'
                        + '</button></li></ul></li>');
                }
            }
        }
        //分页
        //总条数
        var totalCount = data.respbody.total;
        //总页数
        var totalPages = Math.ceil(totalCount / (retData.length));
        // $('.M-box11').pagination({
        //     pageCount:totalPages,    //总页数
        //     totalData:totalCount,     //总条数
        //     showData:10,    //每页显示的条数
        //     isHide:true,     //总页数为0或1时隐藏分页控件
        //     mode: 'fixed',
        //     callback:function (index) {    //回调函数，参数"index"为当前页
        //         homePageAjax(httpheader, buyData(0,index.getCurrent()), buySuccess0s);
        //     }
        // });
    } else {
        if (data.retcode == -17401) {
            loginOut();
            window.sessionStorage.setItem("LOGINSTATE", "flase");
            window.sessionStorage.setItem("LOGINSOURCE", 1);
            window.location.href = "loginPage.html";
        } else {
            myToast(data.msg);
        }
    }
}

//我的购入未成交成功函数
function buySuccess1(data) {
    console.log(data);
    if (data.retcode == 0) {
        var BuyStayListContent = $("#BuyStayListContent");
        var retData = data.respbody.arrayList;
        if (retData.length == 0) {
            BuyStayListContent.attr("class", "bottom_play Withdrawal_record");
            BuyStayListContent.html("暂无数据");
        } else {
            for (var i = 0; i < retData.length; i++) {
                if (retData[i].status == "0") {
                    retData[i].status = "未支付";
                    if (retData[i].validDate == undefined) {
                        retData[i].validDate = "";
                    } else if (retData[i].validDate == "") {
                        retData[i].validDate = "";
                    } else {
                        retData[i].validDate = getMyDate(retData[i].validDate);
                    }
                    BuyStayListContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                        + retData[i].orderID
                        + '</li><li class="WithdrawalRecordContentliulli" title="'
                        + retData[i].commodityName
                        + '">'
                        + retData[i].commodityName
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].quantity
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].listPrice
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + getMyDate(retData[i].updateTime)
                        + '</marquee></li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].status
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + retData[i].validDate
                        + '</marquee></li><li class="WithdrawalRecordContentliulli revocationWrap"><button class="" accesskey= '
                        + ''
                        + '>'
                        + ''
                        + '</button></li></ul></li>');
                } else if (retData[i].status == "1") {
                    retData[i].status = "已委托";
                    if (retData[i].validDate == undefined) {
                        retData[i].validDate = "";
                    } else if (retData[i].validDate == "") {
                        retData[i].validDate = "";
                    } else {
                        retData[i].validDate = getMyDate(retData[i].validDate);
                    }
                    BuyStayListContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                        + retData[i].orderID
                        + '</li><li class="WithdrawalRecordContentliulli" title="'
                        + retData[i].commodityName
                        + '">'
                        + retData[i].commodityName
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].quantity
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].listPrice
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + getMyDate(retData[i].updateTime)
                        + '</marquee></li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].status
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + retData[i].validDate
                        + '</marquee></li><li class="WithdrawalRecordContentliulli revocationWrap"><button class="revocation cxdd" accesskey= '
                        + retData[i].orderID
                        + ' style="paddingTop:0">'
                        + '撤单'
                        + '</button></li></ul></li>');
                    $(".cxdd").click(function () {
                        var btnWrap = this.parentNode;
                        var btnOrderID = btnWrap.accessKey;
                        myConfirm({
                            title: '提示',
                            message: '确定撤单吗？',
                            callback: function () {
                                var cxddData = JSON.stringify({
                                    "ctype": "iOS",
                                    "name": "withdrawOrder",
                                    "reqbody": {
                                        "listOrderID": btnOrderID
                                    },
                                    "sessionStr": sessStr,
                                    "userid": userId
                                })
                                httpAjax(httpheader, cxddData, cxddSuccess);
                            }
                        })

                        function cxddSuccess(data) {
                            if (data.retcode == 0) {
                                myToast("撤单成功，资金于一个工作日内到账");
                                //撤销订单后刷新页面数据
                                $("#BuyAllListContent").empty();
                                $("#BuyStayListContent").empty();
                                $("#BuyEndListContent").empty();
                                httpAjax(httpheader, buyData(0), buySuccess0);//0全部
                                httpAjax(httpheader, buyData(1), buySuccess1);//1未成交
                                httpAjax(httpheader, buyData(2), buySuccess2);//2已成交
                            } else {
                                myToast(data.msg);
                            }
                        }
                    })
                } else if (retData[i].status == "2") {
                    retData[i].status = "已成交";
                    if (retData[i].validDate == undefined) {
                        retData[i].validDate = "";
                    } else if (retData[i].validDate == "") {
                        retData[i].validDate = "";
                    } else {
                        retData[i].validDate = getMyDate(retData[i].validDate);
                    }
                    BuyStayListContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                        + retData[i].orderID
                        + '</li><li class="WithdrawalRecordContentliulli" title="'
                        + retData[i].commodityName
                        + '">'
                        + retData[i].commodityName
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].quantity
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].listPrice
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + getMyDate(retData[i].updateTime)
                        + '</marquee></li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].status
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + retData[i].validDate
                        + '</marquee></li><li class="WithdrawalRecordContentliulli revocationWrap"><button class="" accesskey= '
                        + ''
                        + '>'
                        + ''
                        + '</button></li></ul></li>');
                } else if (retData[i].status == "3") {
                    retData[i].status = "已撤单";
                    if (retData[i].validDate == undefined) {
                        retData[i].validDate = "";
                    } else if (retData[i].validDate == "") {
                        retData[i].validDate = "";
                    } else {
                        retData[i].validDate = getMyDate(retData[i].validDate);
                    }
                    BuyStayListContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                        + retData[i].orderID
                        + '</li><li class="WithdrawalRecordContentliulli" title="'
                        + retData[i].commodityName
                        + '">'
                        + retData[i].commodityName
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].quantity
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].listPrice
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + getMyDate(retData[i].updateTime)
                        + '</marquee></li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].status
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + retData[i].validDate
                        + '</marquee></li><li class="WithdrawalRecordContentliulli revocationWrap"><button class="" accesskey= '
                        + ''
                        + '>'
                        + ''
                        + '</button></li></ul></li>');
                } else if (retData[i].status == "4") {
                    retData[i].status = "已提货";
                    if (retData[i].validDate == undefined) {
                        retData[i].validDate = "";
                    } else if (retData[i].validDate == "") {
                        retData[i].validDate = "";
                    } else {
                        retData[i].validDate = getMyDate(retData[i].validDate);
                    }
                    BuyStayListContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                        + retData[i].orderID
                        + '</li><li class="WithdrawalRecordContentliulli" title="'
                        + retData[i].commodityName
                        + '">'
                        + retData[i].commodityName
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].quantity
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].listPrice
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + getMyDate(retData[i].updateTime)
                        + '</marquee></li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].status
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + retData[i].validDate
                        + '</marquee></li><li class="WithdrawalRecordContentliulli revocationWrap"><button class="" accesskey= '
                        + ''
                        + '>'
                        + ''
                        + '</button></li></ul></li>');
                } else if (retData[i].status == "5") {
                    retData[i].status = "已发货";
                    if (retData[i].validDate == undefined) {
                        retData[i].validDate = "";
                    } else if (retData[i].validDate == "") {
                        retData[i].validDate = "";
                    } else {
                        retData[i].validDate = getMyDate(retData[i].validDate);
                    }
                    BuyStayListContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                        + retData[i].orderID
                        + '</li><li class="WithdrawalRecordContentliulli" title="'
                        + retData[i].commodityName
                        + '">'
                        + retData[i].commodityName
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].quantity
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].listPrice
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + getMyDate(retData[i].updateTime)
                        + '</marquee></li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].status
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + retData[i].validDate
                        + '</marquee></li><li class="WithdrawalRecordContentliulli revocationWrap"><button class="" accesskey= '
                        + ''
                        + '>'
                        + ''
                        + '</button></li></ul></li>');
                } else if (retData[i].status == "6") {
                    retData[i].status = "订单完成";
                    if (retData[i].validDate == undefined) {
                        retData[i].validDate = "";
                    } else if (retData[i].validDate == "") {
                        retData[i].validDate = "";
                    } else {
                        retData[i].validDate = getMyDate(retData[i].validDate);
                    }
                    BuyStayListContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                        + retData[i].orderID
                        + '</li><li class="WithdrawalRecordContentliulli" title="'
                        + retData[i].commodityName
                        + '">'
                        + retData[i].commodityName
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].quantity
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].listPrice
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + getMyDate(retData[i].updateTime)
                        + '</marquee></li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].status
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + retData[i].validDate
                        + '</marquee></li><li class="WithdrawalRecordContentliulli revocationWrap"><button class="" accesskey= '
                        + ''
                        + '>'
                        + ''
                        + '</button></li></ul></li>');
                } else if (retData[i].status == "11") {
                    retData[i].status = "支付尾款";
                    if (retData[i].isDelist == 0) {    //支付尾款可撤单
                        var payMoney = 0;
                        payMoney = Number(retData[i].totalCost) - Number(retData[i].paidAmount);
                        if (retData[i].validDate == undefined) {
                            retData[i].validDate = "";
                        } else if (retData[i].validDate == "") {
                            retData[i].validDate = "";
                        } else {
                            retData[i].validDate = getMyDate(retData[i].validDate);
                        }
                        BuyStayListContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                            + retData[i].orderID
                            + '</li><li class="WithdrawalRecordContentliulli" title="'
                            + retData[i].commodityName
                            + '">'
                            + retData[i].commodityName
                            + '</li><li class="WithdrawalRecordContentliulli">'
                            + retData[i].quantity
                            + '</li><li class="WithdrawalRecordContentliulli">'
                            + retData[i].listPrice
                            + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                            + getMyDate(retData[i].updateTime)
                            + '</marquee></li><li class="WithdrawalRecordContentliulli">'
                            + retData[i].status
                            + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                            + retData[i].validDate
                            + '</marquee></li><li class="WithdrawalRecordContentliulli revocationWrap" accesskey="'
                            + retData[i].orderID
                            + '"><button class="revocatio zfwkk" accesskey='
                            + payMoney
                            + ' style="paddingTop:0;marginLeft:0;marginRight:10px">'
                            + '支付尾款'
                            + '</button><button class="revocatio wkcd" accesskey="'
                            + retData[i].isDelist
                            + '">'
                            + '撤单'
                            + '</button></li></ul></li>');
                        //尾款支付
                        $(".zfwkk").click(function () {
                            console.log(this);
                            var that = this;
                            console.log(that.accessKey);
                            var btnPar = this.parentNode;
                            var btnOrderId = btnPar.accessKey;//orderid
                            var btnPayMoney = Number(this.accessKey);//尾款金额
                            //总金额 = 数量*单价
                            var btnListPrice = btnPar.previousSibling.previousSibling.previousSibling.previousSibling;   //单价
                            var listPrice = btnListPrice.innerHTML;
                            var btnQuantity = btnListPrice.previousSibling;    //数量
                            var quantity = btnQuantity.innerHTML;
                            var zPrice = quantity * listPrice;
                            //根据总金额请求手续费
                            var serviceChargeData = JSON.stringify({
                                "ctype": "Web",
                                "name": "queryfree",
                                "reqbody": {
                                    "totalAmount": zPrice,
                                    "expenseType": "101"
                                },
                                "sessionStr": sessStr,
                                "userid": userId
                            });
                            httpAjax(httpheader, serviceChargeData, serviceChargeSuccess);

                            function serviceChargeSuccess(data) {
                                console.log(data);
                                if (data.retcode == 0) {
                                    var sxf = data.respbody.free;
                                    var payment = btnPayMoney.toFixed(2);
                                    console.log(payment);
                                    myConfirm({
                                        title: '提示',
                                        message: '支付尾款' + btnPayMoney + "元" + "<br>" + "一次性手续费" + sxf + "元",
                                        callback: function () {
                                            var balanceData = JSON.stringify({
                                                "ctype": "Web",
                                                "name": "listBalancePay",
                                                "reqbody": {
                                                    "orderId": btnOrderId,
                                                    "payAmount": btnPayMoney,
                                                },
                                                "sessionStr": sessStr,
                                                "userid": userId
                                            });
                                            console.log(balanceData);
                                            httpAjax(httpheader, balanceData, balanceSuccess);

                                            function balanceSuccess(data) {
                                                if (data.retcode == 0) {
                                                    myToast("尾款支付成功");
                                                    //尾款支付成功后刷新页面
                                                    $("#BuyAllListContent").empty();
                                                    $("#BuyStayListContent").empty();
                                                    $("#BuyEndListContent").empty();
                                                    httpAjax(httpheader, buyData(0), buySuccess0);//0全部
                                                    httpAjax(httpheader, buyData(1), buySuccess1);//1未成交
                                                    httpAjax(httpheader, buyData(2), buySuccess2);//2已成交
                                                } else {
                                                    console.log(data.msg);
                                                    myToast(data.msg);
                                                }
                                            }
                                        }
                                    })
                                } else {
                                    if (data.retcode == -17401) {
                                        loginOut();
                                        window.sessionStorage.setItem("LOGINSTATE", "flase");
                                        myToast(data.msg);
                                        window.location.href = "loginPage.html";
                                    } else {
                                        console.log(data.msg);
                                        myToast(data.msg);
                                    }
                                }
                            }
                        });
                        $(".wkcd").click(function () {    //尾款撤单
                            var isDelist = this.accessKey;
                            //可撤单
                            var btnWrap = this.parentNode;
                            var btnOrderID = btnWrap.accessKey;
                            myConfirm({
                                title: '提示',
                                message: '确定撤单吗？',
                                callback: function () {
                                    var cxddData = JSON.stringify({
                                        "ctype": "iOS",
                                        "name": "withdrawOrder",
                                        "reqbody": {
                                            "listOrderID": btnOrderID
                                        },
                                        "sessionStr": sessStr,
                                        "userid": userId
                                    })
                                    httpAjax(httpheader, cxddData, cxddSuccess);
                                }
                            })

                            function cxddSuccess(data) {
                                if (data.retcode == 0) {
                                    myToast("撤单成功，资金于一个工作日内到账");
                                    $("#BuyAllListContent").empty();
                                    $("#BuyStayListContent").empty();
                                    $("#BuyEndListContent").empty();
                                    httpAjax(httpheader, buyData(0), buySuccess0);//0全部
                                    httpAjax(httpheader, buyData(1), buySuccess1);//1未成交
                                    httpAjax(httpheader, buyData(2), buySuccess2);//2已成交
                                } else {
                                    if (data.retcode == -17401) {
                                        loginOut();
                                        window.sessionStorage.setItem("LOGINSTATE", "flase");
                                        window.sessionStorage.setItem("LOGINSOURCE", 1);
                                        window.location.href = "loginPage.html";
                                    } else {
                                        myToast(data.msg);
                                    }
                                }
                            }
                        })
                    } else if (retData[i].isDelist == 1) {   //支付尾款不可撤单
                        var payMoney = Number(retData[i].totalCost) - Number(retData[i].paidAmount);
                        if (retData[i].validDate == undefined) {
                            retData[i].validDate = "";
                        } else if (retData[i].validDate == "") {
                            retData[i].validDate = "";
                        } else {
                            retData[i].validDate = getMyDate(retData[i].validDate);
                        }
                        BuyStayListContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                            + retData[i].orderID
                            + '</li><li class="WithdrawalRecordContentliulli" title="'
                            + retData[i].commodityName
                            + '">'
                            + retData[i].commodityName
                            + '</li><li class="WithdrawalRecordContentliulli">'
                            + retData[i].quantity
                            + '</li><li class="WithdrawalRecordContentliulli">'
                            + retData[i].listPrice
                            + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                            + getMyDate(retData[i].updateTime)
                            + '</marquee></li><li class="WithdrawalRecordContentliulli">'
                            + retData[i].status
                            + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                            + retData[i].validDate
                            + '</marquee></li><li class="WithdrawalRecordContentliulli revocationWrap" accesskey="'
                            + retData[i].orderID
                            + '"><button id="lala" class="revocation zfwk" accesskey= '
                            + payMoney
                            + ' style="paddingTop:0">'
                            + '支付尾款'
                            + '</button></li></ul></li>');

                        $(".zfwk").click(function () {    //支付尾款按钮
                            var that = this;
                            var btnPar = this.parentNode;
                            var btnOrderId = btnPar.accessKey;
                            var btnPayMoney = Number(this.accessKey);
                            //总金额 = 数量*单价
                            var btnListPrice = btnPar.previousSibling.previousSibling.previousSibling.previousSibling;   //单价
                            var listPrice = btnListPrice.innerHTML;
                            var btnQuantity = btnListPrice.previousSibling;    //数量
                            var quantity = btnQuantity.innerHTML;
                            var zPrice = quantity * listPrice;
                            //根据总金额请求手续费
                            var serviceChargeData = JSON.stringify({
                                "ctype": "Web",
                                "name": "queryfree",
                                "reqbody": {
                                    "totalAmount": zPrice,
                                },
                                "sessionStr": sessStr,
                                "userid": userId
                            });
                            httpAjax(httpheader, serviceChargeData, serviceChargeSuccess);

                            function serviceChargeSuccess(data) {
                                if (data.retcode == 0) {
                                    console.log(data);
                                    var sxf = data.respbody.free;
                                    myConfirm({
                                        title: '提示',
                                        message: '支付尾款' + that.accessKey + "<br>" + "一次性手续费" + sxf,
                                        callback: function () {
                                            var balanceData = JSON.stringify({
                                                "ctype": "Web",
                                                "name": "listBalancePay",
                                                "reqbody": {
                                                    "orderId": btnOrderId,
                                                    "payAmount": btnPayMoney,
                                                },
                                                "sessionStr": sessStr,
                                                "userid": userId
                                            });
                                            httpAjax(httpheader, balanceData, balanceSuccess);

                                            function balanceSuccess(data) {
                                                if (data.retcode == 0) {
                                                    myToast("尾款支付成功");
                                                    $("#BuyAllListContent").empty();
                                                    $("#BuyStayListContent").empty();
                                                    $("#BuyEndListContent").empty();
                                                    httpAjax(httpheader, buyData(0), buySuccess0);//0全部
                                                    httpAjax(httpheader, buyData(1), buySuccess1);//1未成交
                                                    httpAjax(httpheader, buyData(2), buySuccess2);//2已成交
                                                } else {
                                                    console.log(data.msg);
                                                    myToast(data.msg);
                                                }
                                            }
                                        }
                                    })
                                } else {
                                    if (data.retcode == -17401) {
                                        loginOut();
                                        window.sessionStorage.setItem("LOGINSTATE", "flase");
                                        window.sessionStorage.setItem("LOGINSOURCE", 1);
                                        window.location.href = "loginPage.html";
                                    } else {
                                        console.log(data);
                                        console.log(data.msg);
                                        myToast(data.msg);
                                    }
                                }
                            }
                        })
                    }
                } else if (retData[i].status == "12") {
                    retData[i].status = "已过期";
                    if (retData[i].validDate == undefined) {
                        retData[i].validDate = "";
                    } else if (retData[i].validDate == "") {
                        retData[i].validDate = "";
                    } else {
                        retData[i].validDate = getMyDate(retData[i].validDate);
                    }
                    BuyStayListContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                        + retData[i].orderID
                        + '</li><li class="WithdrawalRecordContentliulli" title="'
                        + retData[i].commodityName
                        + '">'
                        + retData[i].commodityName
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].quantity
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].listPrice
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + getMyDate(retData[i].updateTime)
                        + '</marquee></li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].status
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + retData[i].validDate
                        + '</marquee></li><li class="WithdrawalRecordContentliulli revocationWrap" accesskey="'
                        + retData[i].orderID
                        + '"><button class="" accesskey= '
                        + ''
                        + '>'
                        + ''
                        + '</button></li></ul></li>');
                } else if (retData[i].status == "13") {
                    retData[i].status = "违约单";
                    if (retData[i].validDate == undefined) {
                        retData[i].validDate = "";
                    } else if (retData[i].validDate == "") {
                        retData[i].validDate = "";
                    } else {
                        retData[i].validDate = getMyDate(retData[i].validDate);
                    }
                    BuyStayListContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                        + retData[i].orderID
                        + '</li><li class="WithdrawalRecordContentliulli" title="'
                        + retData[i].commodityName
                        + '">'
                        + retData[i].commodityName
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].quantity
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].listPrice
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + getMyDate(retData[i].updateTime)
                        + '</marquee></li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].status
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + retData[i].validDate
                        + '</marquee></li><li class="WithdrawalRecordContentliulli revocationWrap" accesskey="'
                        + retData[i].orderID
                        + '"><button class="" accesskey= '
                        + ''
                        + '>'
                        + ''
                        + '</button></li></ul></li>');
                } else if (retData[i].status == "20") {
                    retData[i].status = "交易中";
                    if (retData[i].validDate == undefined) {
                        retData[i].validDate = "";
                    } else if (retData[i].validDate == "") {
                        retData[i].validDate = "";
                    } else {
                        retData[i].validDate = getMyDate(retData[i].validDate);
                    }
                    BuyStayListContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                        + retData[i].orderID
                        + '</li><li class="WithdrawalRecordContentliulli" title="'
                        + retData[i].commodityName
                        + '">'
                        + retData[i].commodityName
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].quantity
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].listPrice
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + getMyDate(retData[i].updateTime)
                        + '</marquee></li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].status
                        + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                        + retData[i].validDate
                        + '</marquee></li><li class="WithdrawalRecordContentliulli revocationWrap" accesskey="'
                        + retData[i].orderID
                        + '"><button class="" accesskey= '
                        + ''
                        + '>'
                        + ''
                        + '</button></li></ul></li>');
                }
            }
        }
    } else {
        if (data.retcode == -17401) {
            loginOut();
            window.sessionStorage.setItem("LOGINSTATE", "flase");
            window.sessionStorage.setItem("LOGINSOURCE", 1);
            window.location.href = "loginPage.html";
        } else {
            myToast(data.msg);
        }
    }
}

//我的购入已成交成功函数
function buySuccess2(data) {
    console.log(data);
    if (data.retcode == 0) {
        var BuyEndListContent = $("#BuyEndListContent");
        var retData = data.respbody.arrayList;
        if (retData.length == 0) {
            BuyEndListContent.attr("class", "bottom_play Withdrawal_record");
            BuyEndListContent.html("暂无数据");
        } else {
            for (var i = 0; i < retData.length; i++) {
                if (retData[i].status == "0") {
                    retData[i].status = "未支付";
                } else if (retData[i].status == "1") {
                    retData[i].status = "已委托";
                } else if (retData[i].status == "2") {
                    retData[i].status = "已成交";
                } else if (retData[i].status == "3") {
                    retData[i].status = "已撤单";
                } else if (retData[i].status == "4") {
                    retData[i].status = "已提货";
                } else if (retData[i].status == "5") {
                    retData[i].status = "已发货";
                } else if (retData[i].status == "6") {
                    retData[i].status = "订单完成";
                } else if (retData[i].status == "11") {
                    retData[i].status = "支付尾款";
                } else if (retData[i].status == "12") {
                    retData[i].status = "已过期";
                } else if (retData[i].status == "13") {
                    retData[i].status = "违约单";
                } else if (retData[i].status == "20") {
                    retData[i].status = "交易中";
                }
                BuyEndListContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                    + retData[i].orderID
                    + '</li><li class="WithdrawalRecordContentliulli" title="'
                    + retData[i].commodityName
                    + '">'
                    + retData[i].commodityName
                    + '</li><li class="WithdrawalRecordContentliulli">'
                    + retData[i].quantity
                    + '</li><li class="WithdrawalRecordContentliulli">'
                    + retData[i].listPrice
                    + '</li><li class="WithdrawalRecordContentliulli"><marquee behavior="scroll" direction="left" scrollamount="4">'
                    + getMyDate(retData[i].updateTime)
                    + '</marquee></li><li class="WithdrawalRecordContentliulli">'
                    + retData[i].status
                    + '</li><li class="WithdrawalRecordContentliulli"></li><li class="WithdrawalRecordContentliulli revocationWrap"><button class="" accesskey= '
                    + ''
                    + '>'
                    + ''
                    + '</button></li></ul></li>');
            }
        }

        //总条数
        var totalCount = data.respbody.total;
        //总页数
        var totalPages = Math.ceil(totalCount / (retData.length));
        // $('.M-box11').pagination({
        //     pageCount:totalPages,    //总页数
        //     totalData:totalCount,     //总条数
        //     showData:12,    //每页显示的条数
        //     isHide:true,     //总页数为0或1时隐藏分页控件
        //     mode: 'fixed',
        //     callback:function (index) {    //回调函数，参数"index"为当前页
        //         homePageAjax(httpheader, buyData(1,index.getCurrent()), buySuccess1s);
        //     }
        // });
    } else {
        if (data.retcode == -17401) {
            console.log(data);
            loginOut();
            window.sessionStorage.setItem("LOGINSTATE", "flase");
            window.sessionStorage.setItem("LOGINSOURCE", 1);
            window.location.href = "loginPage.html";
        } else {
            myToast(data.msg);
        }

    }
}

//我的促销商品
//tab切换
var PromotionSpans = $('.pick_top_span02');
var PromotionLists = $('.pickContent02');
for (var i = 0; i < PromotionSpans.length; i++) {
    PromotionSpans[i].index = i;//将i赋给相应的button下标
    PromotionSpans[i].onclick = function () {
        for (var j = 0; j < PromotionSpans.length; j++) {
            PromotionSpans[j].style.backgroundColor = 'whitesmoke';
            PromotionSpans[j].style.color = 'black';
            PromotionLists[j].style.display = "none";
        }
        this.style.backgroundColor = "#e7bb1c";
        this.style.color = "white";
        PromotionLists[this.index].style.display = "block";
    }
}

function promotionData(status) {
    return JSON.stringify({
        "reqbody": {
            "status": status,//0:全部， 2 待收货  3 已收货
            "pageSize": 20,
            "pageIndex": 1
        },
        "sessionStr": sessStr,
        "userid": userId,
        "name": "queryOrders",
        "ctype": "Web"
    })
}

httpAjax(httpheader, promotionData(0), promotionSuccess0);   //全部
httpAjax(httpheader, promotionData(4), promotionSuccess2);   //待收货
httpAjax(httpheader, promotionData(5), promotionSuccess3);   //已收货

//我的促销商品全部成功函数
function promotionSuccess0(data) {
    console.log(data);
    if (data.retcode == 0) {
        var retData = data.respbody.arrayList;
        var promotionAllContent = $("#promotionAllContent");
        if (retData.length == 0) {
            promotionAllContent.attr("class", "bottom_play Withdrawal_record");
            promotionAllContent.html("暂无数据");
        } else {
            for (var i = 0; i < retData.length; i++) {
                if (retData[i].logisticsStatus == 1) {
                    retData[i].logisticsStatus = "未发货";
                } else if (retData[i].logisticsStatus == 2) {
                    retData[i].logisticsStatus = "已发货";
                } else if (retData[i].logisticsStatus == 3) {
                    retData[i].logisticsStatus = "已收货";
                }

                promotionAllContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                    + retData[i].orderID
                    + '</li><li class="WithdrawalRecordContentliulli">'
                    + retData[i].list[0].commodityName
                    + '</li><li class="WithdrawalRecordContentliulli">'
                    + retData[i].list[0].quantity
                    + '</li><li class="WithdrawalRecordContentliulli">'
                    + retData[i].totalPrice
                    + '</li><li class="WithdrawalRecordContentliulli">'
                    + retData[i].logisticsStatus
                    + '</li><li class="WithdrawalRecordContentliulli">'
                    + ''
                    + '</li></ul></li>');
            }
        }
    } else {
        if (data.retcode == -17401) {
            loginOut();
            window.sessionStorage.setItem("LOGINSTATE", "flase");
            window.sessionStorage.setItem("LOGINSOURCE", 1);
            window.location.href = "loginPage.html";
        } else {
            myToast(data.msg);
        }
    }
}

//我的促销商品待收货成功函数
function promotionSuccess2(data) {
    console.log(data);
    if (data.retcode == 0) {
        var retData = data.respbody.arrayList;
        var promotionCollectionContent = $("#promotionCollectionContent");
        if (retData.length == 0) {
            promotionCollectionContent.attr("class", "bottom_play Withdrawal_record");
            promotionCollectionContent.html("暂无数据");
        } else {
            for (var i = 0; i < retData.length; i++) {
                if (retData[i].logisticsStatus == 1) {
                    retData[i].logisticsStatus = "未发货";
                } else if (retData[i].logisticsStatus == 2) {
                    retData[i].logisticsStatus = "已发货";
                } else if (retData[i].logisticsStatus == 3) {
                    retData[i].logisticsStatus = "已收货";
                }
                promotionCollectionContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                    + retData[i].orderID
                    + '</li><li class="WithdrawalRecordContentliulli">'
                    + retData[i].list[0].commodityName
                    + '</li><li class="WithdrawalRecordContentliulli">'
                    + retData[i].list[0].quantity
                    + '</li><li class="WithdrawalRecordContentliulli">'
                    + retData[i].totalPrice
                    + '</li><li class="WithdrawalRecordContentliulli">'
                    + retData[i].logisticsStatus
                    + '</li><li class="WithdrawalRecordContentliulli">'
                    + ''
                    + '</li></ul></li>');
            }
        }
    } else {
        if (data.retcode == -17401) {
            loginOut();
            window.sessionStorage.setItem("LOGINSTATE", "flase");
            window.sessionStorage.setItem("LOGINSOURCE", 1);
            window.location.href = "loginPage.html";
        } else {
            myToast(data.msg);
        }
    }
}

//我的促销商品已收货成功函数
function promotionSuccess3(data) {
    console.log(data);
    if (data.retcode == 0) {
        var retData = data.respbody.arrayList;
        var promotionEndContent = $("#promotionEndContent");
        if (retData.length == 0) {
            promotionEndContent.attr("class", "bottom_play Withdrawal_record");
            promotionEndContent.html("暂无数据");
        } else {
            for (var i = 0; i < retData.length; i++) {
                if (retData[i].logisticsStatus == 1) {
                    retData[i].logisticsStatus == "未发货";
                } else if (retData[i].logisticsStatus == 2) {
                    retData[i].logisticsStatus == "已发货";
                } else if (retData[i].logisticsStatus == 3) {
                    retData[i].logisticsStatus == "已收货";
                }
                promotionEndContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                    + retData[i].orderID
                    + '</li><li class="WithdrawalRecordContentliulli">'
                    + retData[i].list[0].commodityName
                    + '</li><li class="WithdrawalRecordContentliulli">'
                    + retData[i].list[0].quantity
                    + '</li><li class="WithdrawalRecordContentliulli">'
                    + retData[i].totalPrice
                    + '</li><li class="WithdrawalRecordContentliulli">'
                    + retData[i].logisticsStatus
                    + '</li><li class="WithdrawalRecordContentliulli">'
                    + ''
                    + '</li></ul></li>');
            }
        }
    } else {
        if (data.retcode == -17401) {
            loginOut();
            window.sessionStorage.setItem("LOGINSTATE", "flase");
            window.sessionStorage.setItem("LOGINSOURCE", 1);
            window.location.href = "loginPage.html";
        } else {
            myToast(data.msg);
        }
    }
}

//我的寄卖商品
function holdPositionData(pageIndex) {
    return JSON.stringify({
        "reqbody": {
            "pageSize": 10,
            "pageIndex": pageIndex
        },
        "sessionStr": sessStr,
        "userid": userId,
        "name": "queryFirmHoldGoods",
        "ctype": "Web"

    })
}

httpAjax(httpheader, holdPositionData(1), holdPositionSuccess);

//我的寄卖商品成功函数
function holdPositionSuccess(data) {
    console.log(data);
    if (data.retcode == 0) {
        console.log(data);
        var retData = data.respbody.arrayList;
        var holdPositionContent = $("#holdPositionContent");
        if (retData.length == 0) {
            holdPositionContent.attr("class", "bottom_play" + " " + "Withdrawal_record");
            holdPositionContent.html("暂无数据");
        } else {
            //从sess中取到用户名称
            var userName = window.sessionStorage.getItem("USERNAME");
            for (var i = 0; i < retData.length; i++) {
                //商品名称
                if (retData[i].commodityName == undefined) {
                    retData[i].commodityName = "--";
                }
                //品相
                if (retData[i].conditionID == "1") {
                    retData[i].conditionID = "优品";
                } else if (retData[i].conditionID == "2") {
                    retData[i].conditionID = "良品";
                } else if (retData[i].conditionID == "3") {
                    retData[i].conditionID = "差品";
                }
                //仓库
                if (retData[i].storageID == "1") {
                    retData[i].storageID = "北京仓库";
                } else if (retData[i].storageID == "2") {
                    retData[i].storageID = "上海仓库";
                } else {
                    retData[i].storageID = "--";
                }
                var cx = "提货";
                if (retData[i].holdQty == 0) {    //如果当前商品持有数量为0，则提货按钮不能点击
                    holdPositionContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli" title="'
                        + retData[i].commodityName
                        + '">'
                        + retData[i].commodityName
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].conditionID
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].storageID
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].holdQty
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].deliveryQty
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].deliveryingQty
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].frozenQty
                        + '</li><li class="WithdrawalRecordContentliulli" accesskey="'
                        + retData[i].commodityId
                        + '">'
                        + retData[i].listQty
                        + '</li><li class="WithdrawalRecordContentliulli revocationWrap" style="margin-top: 12.5px"'
                        + '><p class="" accesskey= '
                        + retData[i].withdrawId
                        + '>'
                        + '</p></li></ul></li>');
                } else {
                    holdPositionContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli" title="'
                        + retData[i].commodityName
                        + '">'
                        + retData[i].commodityName
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].conditionID
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].storageID
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].holdQty
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].deliveryQty
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].deliveryingQty
                        + '</li><li class="WithdrawalRecordContentliulli">'
                        + retData[i].frozenQty
                        + '</li><li class="WithdrawalRecordContentliulli" accesskey="'
                        + retData[i].commodityId
                        + '">'
                        + retData[i].listQty
                        + '</li><li class="WithdrawalRecordContentliulli revocationWrap" style="margin-top: 12.5px"'
                        + '><p class="revocation djth" style="margin-left:0;margin-right: 5px;" accesskey= '
                        + retData[i].withdrawId
                        + '>'
                        + cx
                        + '</p></li></ul></li>');
                }
            }

            //点击提货按钮
            $(".djth").click(function () {
                // 商品名称
                var revocationWrap = this.parentNode.parentNode;
                var revocationFirst = revocationWrap.firstChild;
                window.sessionStorage.setItem("REVCATIONfIRSTNAME", revocationFirst.innerHTML)
                //商品ID
                var revocationId = revocationWrap.children[7];
                window.sessionStorage.setItem("REVOCATIONID", revocationId.accessKey);
                // 提货数量   this.fu.s.s.s
                var revocationNumber = revocationWrap.children[3];
                window.sessionStorage.setItem("REVOCATIONNUMBER", revocationNumber.innerHTML)
                // 购买人姓名已经在个人信息存储了
                //仓库名称
                var ThisWrap = this.parentNode;
                var storageName = ThisWrap.accessKey;
                window.sessionStorage.setItem("STORAGENAME", storageName);
                window.location.href = "pickUpPage.html";
            })


            //分页
            //总条数
            var totalCount = data.respbody.total;
            //总页数
            var totalPages = Math.ceil(totalCount / (retData.length));
            // $('#M-box11').pagination({
            //     pageCount: totalPages,    //总页数
            //     totalData: totalCount,     //总条数
            //     showData: 10,    //每页显示的条数
            //     isHide: true,     //总页数为0或1时隐藏分页控件
            //     mode: 'fixed',
            //     callback: function (index) {    //回调函数，参数"index"为当前页
            //         httpAjax(httpheader, holdPositionData(index.getCurrent()), holdPositionSuccess2);
            //     }
            // });
        }
    } else {
        if (data.retcode == -17401) {
            loginOut();
            window.sessionStorage.setItem("LOGINSTATE", "flase");
            window.sessionStorage.setItem("LOGINSOURCE", 1);
            window.location.href = "loginPage.html";
        } else {
            console.log(data.msg);
            myToast(data.msg);
        }
    }
}

//我的寄卖商品   分页成功函数
function holdPositionSuccess2(data) {
    console.log(data);
    if (data.retcode == 0) {
        $("#holdPositionContent").empty();
        var retData = data.respbody.arrayList;
        var holdPositionContent = $("#holdPositionContent");
        if (retData.length == 0) {
            holdPositionContent.attr("class", "bottom_play" + " " + "Withdrawal_record");
            holdPositionContent.html("暂无数据");
        } else {
            //从sess中取到用户名称
            var userName = window.sessionStorage.getItem("USERNAME");
            for (var i = 0; i < retData.length; i++) {
                //商品名称
                if (retData[i].commodityName == undefined) {
                    retData[i].commodityName = "--";
                }
                //品相
                if (retData[i].conditionID == "1") {
                    retData[i].conditionID = "优品";
                } else if (retData[i].conditionID == "2") {
                    retData[i].conditionID = "良品";
                } else if (retData[i].conditionID == "3") {
                    retData[i].conditionID = "差品";
                }
                //仓库
                if (retData[i].storageID == "1") {
                    retData[i].storageID = "北京仓库";
                } else if (retData[i].storageID == "2") {
                    retData[i].storageID = "上海仓库";
                } else {
                    retData[i].storageID = "--";
                }
                var cx = "提货";
                holdPositionContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul"><li class="WithdrawalRecordContentliulli">'
                    + retData[i].commodityName
                    + '</li><li class="WithdrawalRecordContentliulli">'
                    + retData[i].conditionID
                    + '</li><li class="WithdrawalRecordContentliulli">'
                    + retData[i].storageID
                    + '</li><li class="WithdrawalRecordContentliulli">'
                    + retData[i].holdQty
                    + '</li><li class="WithdrawalRecordContentliulli">'
                    + retData[i].deliveryQty
                    + '</li><li class="WithdrawalRecordContentliulli">'
                    + retData[i].deliveryingQty
                    + '</li><li class="WithdrawalRecordContentliulli">'
                    + retData[i].frozenQty
                    + '</li><li class="WithdrawalRecordContentliulli" accesskey="'
                    + retData[i].commodityId
                    + '">'
                    + retData[i].listQty
                    + '</li><li class="WithdrawalRecordContentliulli revocationWrap" accesskey="'
                    + retData[i].storageID
                    + '"><p class="revocation djth" style="margin-left:0;margin-right: 5px;" accesskey= '
                    + retData[i].withdrawId
                    + '>'
                    + cx
                    + '</p></li></ul></li>');
            }

            //点击提货按钮
            $(".djth").click(function () {
                // 商品名称
                var revocationWrap = this.parentNode.parentNode;
                var revocationFirst = revocationWrap.firstChild;
                window.sessionStorage.setItem("REVCATIONfIRSTNAME", revocationFirst.innerHTML)
                //商品ID
                var revocationId = revocationWrap.children[7];
                window.sessionStorage.setItem("REVOCATIONID", revocationId.accessKey);
                // 提货数量   this.fu.s.s.s
                var revocationNumber = revocationWrap.children[3];
                window.sessionStorage.setItem("REVOCATIONNUMBER", revocationNumber.innerHTML)
                // 购买人姓名已经在个人信息存储了
                //仓库名称
                var ThisWrap = this.parentNode;
                var storageName = ThisWrap.accessKey;
                window.sessionStorage.setItem("STORAGENAME", storageName);
                window.location.href = "pickUpPage.html";
            })
        }
    } else {
        if (data.retcode == -17401) {
            loginOut();
            window.sessionStorage.setItem("LOGINSTATE", "flase");
            window.sessionStorage.setItem("LOGINSOURCE", 1);
            window.location.href = "loginPage.html";
        } else {
            console.log(data.msg);
            myToast(data.msg);
        }
    }
}

//点击搜索按钮发起商品搜索
$("#search_inpTwo").on("click", function () {
    //讲输入的内容存储在sess中一并传递
    window.sessionStorage.setItem("SEARCH", $("#search_inpOne").val());
    window.location.href = "searchPage.html";
});
$(document).keyup(function (event) {
    if (event.keyCode == 13) {
        window.sessionStorage.setItem("SEARCH", $("#search_inpOne").val());
        window.location.href = "searchPage.html";
    }
});