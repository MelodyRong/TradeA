// document.write("<script src='../js/jqueryPagination.js'></script>");
document.write("<script type='text/javascript' src='js/NetworkRequest.js'></script>");    //网络请求
document.write("<script src='js/MyAlert.js'></script>");
document.write("<script src='js/md5.js'></script>");
document.write("<script type='text/javascript' src='js/loginInOrOut.js'></script>");
document.write("<script type='text/javascript' src='js/reclassify.js'></script>");    //一二级分类
var httpheader = "http://119.90.97.146:18203/";

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
        url: 'http://119.90.97.146:8095/shop/img/upload',
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
//完善信息选择银行卡所属省市
var cityJson = [
    {"item_code":"110000","item_name":"北京市"},
    {"item_code":"120000","item_name":"天津市"},
    {"item_code":"130000","item_name":"河北省"},
    {"item_code":"140000","item_name":"山西省"},
    {"item_code":"150000","item_name":"内蒙古自治区"},
    {"item_code":"210000","item_name":"辽宁省"},
    {"item_code":"220000","item_name":"吉林省"},
    {"item_code":"230000","item_name":"黑龙江省"},
    {"item_code":"310000","item_name":"上海市"},
    {"item_code":"320000","item_name":"江苏省"},
    {"item_code":"330000","item_name":"浙江省"},
    {"item_code":"340000","item_name":"安徽省"},
    {"item_code":"350000","item_name":"福建省"},
    {"item_code":"360000","item_name":"江西省"},
    {"item_code":"370000","item_name":"山东省"},
    {"item_code":"410000","item_name":"河南省"},
    {"item_code":"420000","item_name":"湖北省"},
    {"item_code":"430000","item_name":"湖南省"},
    {"item_code":"440000","item_name":"广东省"},
    {"item_code":"450000","item_name":"广西壮族自治区"},
    {"item_code":"460000","item_name":"海南省"},
    {"item_code":"500000","item_name":"重庆市"},
    {"item_code":"510000","item_name":"四川省"},
    {"item_code":"520000","item_name":"贵州省"},
    {"item_code":"530000","item_name":"云南省"},
    {"item_code":"540000","item_name":"西藏自治区"},
    {"item_code":"610000","item_name":"陕西省"},
    {"item_code":"620000","item_name":"甘肃省"},
    {"item_code":"630000","item_name":"青海省"},
    {"item_code":"640000","item_name":"宁夏回族自治区"},
    {"item_code":"650000","item_name":"新疆维吾尔自治区"},


    {"item_code":"110100","item_name":"北京市"},
    {"item_code":"120100","item_name":"天津市"},
    {"item_code":"130100","item_name":"石家庄市"},
    {"item_code":"130200","item_name":"唐山市"},
    {"item_code":"130300","item_name":"秦皇岛市"},
    {"item_code":"130400","item_name":"邯郸市"},
    {"item_code":"130500","item_name":"邢台市"},
    {"item_code":"130600","item_name":"保定市"},
    {"item_code":"130700","item_name":"张家口市"},
    {"item_code":"130800","item_name":"承德市"},
    {"item_code":"130900","item_name":"沧州市"},
    {"item_code":"131000","item_name":"廊坊市"},
    {"item_code":"131100","item_name":"衡水市"},
    {"item_code":"140100","item_name":"太原市"},
    {"item_code":"140200","item_name":"大同市"},
    {"item_code":"140300","item_name":"阳泉市"},
    {"item_code":"140400","item_name":"长治市"},
    {"item_code":"140500","item_name":"晋城市"},
    {"item_code":"140600","item_name":"朔州市"},
    {"item_code":"140700","item_name":"晋中市"},
    {"item_code":"140800","item_name":"运城市"},
    {"item_code":"140900","item_name":"忻州市"},
    {"item_code":"141000","item_name":"临汾市"},
    {"item_code":"141100","item_name":"吕梁市"},
    {"item_code":"150100","item_name":"呼和浩特市"},
    {"item_code":"150200","item_name":"包头市"},
    {"item_code":"150300","item_name":"乌海市"},
    {"item_code":"150400","item_name":"赤峰市"},
    {"item_code":"150500","item_name":"通辽市"},
    {"item_code":"150600","item_name":"鄂尔多斯市"},
    {"item_code":"150700","item_name":"呼伦贝尔市"},
    {"item_code":"150800","item_name":"巴彦淖尔市"},
    {"item_code":"150900","item_name":"乌兰察布市"},
    {"item_code":"152200","item_name":"兴安盟"},
    {"item_code":"152500","item_name":"锡林郭勒盟"},
    {"item_code":"152900","item_name":"阿拉善盟"},
    {"item_code":"210100","item_name":"沈阳市"},
    {"item_code":"210200","item_name":"大连市"},
    {"item_code":"210300","item_name":"鞍山市"},
    {"item_code":"210400","item_name":"抚顺市"},
    {"item_code":"210500","item_name":"本溪市"},
    {"item_code":"210600","item_name":"丹东市"},
    {"item_code":"210700","item_name":"锦州市"},
    {"item_code":"210800","item_name":"营口市"},
    {"item_code":"210900","item_name":"阜新市"},
    {"item_code":"211000","item_name":"辽阳市"},
    {"item_code":"211100","item_name":"盘锦市"},
    {"item_code":"211200","item_name":"铁岭市"},
    {"item_code":"211300","item_name":"朝阳市"},
    {"item_code":"211400","item_name":"葫芦岛市"},
    {"item_code":"220100","item_name":"长春市"},
    {"item_code":"220200","item_name":"吉林市"},
    {"item_code":"220300","item_name":"四平市"},
    {"item_code":"220400","item_name":"辽源市"},
    {"item_code":"220500","item_name":"通化市"},
    {"item_code":"220600","item_name":"白山市"},
    {"item_code":"220700","item_name":"松原市"},
    {"item_code":"220800","item_name":"白城市"},
    {"item_code":"222400","item_name":"延边朝鲜族自治州"},
    {"item_code":"230100","item_name":"哈尔滨市"},
    {"item_code":"230200","item_name":"齐齐哈尔市"},
    {"item_code":"230300","item_name":"鸡西市"},
    {"item_code":"230400","item_name":"鹤岗市"},
    {"item_code":"230500","item_name":"双鸭山市"},
    {"item_code":"230600","item_name":"大庆市"},
    {"item_code":"230700","item_name":"伊春市"},
    {"item_code":"230800","item_name":"佳木斯市"},
    {"item_code":"230900","item_name":"七台河市"},
    {"item_code":"231000","item_name":"牡丹江市"},
    {"item_code":"231100","item_name":"黑河市"},
    {"item_code":"231200","item_name":"绥化市"},
    {"item_code":"232700","item_name":"大兴安岭地区"},
    {"item_code":"310100","item_name":"上海市"},
    {"item_code":"320100","item_name":"南京市"},
    {"item_code":"320200","item_name":"无锡市"},
    {"item_code":"320300","item_name":"徐州市"},
    {"item_code":"320400","item_name":"常州市"},
    {"item_code":"320500","item_name":"苏州市"},
    {"item_code":"320600","item_name":"南通市"},
    {"item_code":"320700","item_name":"连云港市"},
    {"item_code":"320800","item_name":"淮安市"},
    {"item_code":"320900","item_name":"盐城市"},
    {"item_code":"321000","item_name":"扬州市"},
    {"item_code":"321100","item_name":"镇江市"},
    {"item_code":"321200","item_name":"泰州市"},
    {"item_code":"321300","item_name":"宿迁市"},
    {"item_code":"330100","item_name":"杭州市"},
    {"item_code":"330200","item_name":"宁波市"},
    {"item_code":"330300","item_name":"温州市"},
    {"item_code":"330400","item_name":"嘉兴市"},
    {"item_code":"330500","item_name":"湖州市"},
    {"item_code":"330600","item_name":"绍兴市"},
    {"item_code":"330700","item_name":"金华市"},
    {"item_code":"330800","item_name":"衢州市"},
    {"item_code":"330900","item_name":"舟山市"},
    {"item_code":"331000","item_name":"台州市"},
    {"item_code":"331100","item_name":"丽水市"},
    {"item_code":"340100","item_name":"合肥市"},
    {"item_code":"340200","item_name":"芜湖市"},
    {"item_code":"340300","item_name":"蚌埠市"},
    {"item_code":"340400","item_name":"淮南市"},
    {"item_code":"340500","item_name":"马鞍山市"},
    {"item_code":"340600","item_name":"淮北市"},
    {"item_code":"340700","item_name":"铜陵市"},
    {"item_code":"340800","item_name":"安庆市"},
    {"item_code":"341000","item_name":"黄山市"},
    {"item_code":"341100","item_name":"滁州市"},
    {"item_code":"341200","item_name":"阜阳市"},
    {"item_code":"341300","item_name":"宿州市"},
    {"item_code":"341500","item_name":"六安市"},
    {"item_code":"341600","item_name":"亳州市"},
    {"item_code":"341700","item_name":"池州市"},
    {"item_code":"341800","item_name":"宣城市"},
    {"item_code":"350100","item_name":"福州市"},
    {"item_code":"350200","item_name":"厦门市"},
    {"item_code":"350300","item_name":"莆田市"},
    {"item_code":"350400","item_name":"三明市"},
    {"item_code":"350500","item_name":"泉州市"},
    {"item_code":"350600","item_name":"漳州市"},
    {"item_code":"350700","item_name":"南平市"},
    {"item_code":"350800","item_name":"龙岩市"},
    {"item_code":"350900","item_name":"宁德市"},
    {"item_code":"360100","item_name":"南昌市"},
    {"item_code":"360200","item_name":"景德镇市"},
    {"item_code":"360300","item_name":"萍乡市"},
    {"item_code":"360400","item_name":"九江市"},
    {"item_code":"360500","item_name":"新余市"},
    {"item_code":"360600","item_name":"鹰潭市"},
    {"item_code":"360700","item_name":"赣州市"},
    {"item_code":"360800","item_name":"吉安市"},
    {"item_code":"360900","item_name":"宜春市"},
    {"item_code":"361000","item_name":"抚州市"},
    {"item_code":"361100","item_name":"上饶市"},
    {"item_code":"370100","item_name":"济南市"},
    {"item_code":"370200","item_name":"青岛市"},
    {"item_code":"370300","item_name":"淄博市"},
    {"item_code":"370400","item_name":"枣庄市"},
    {"item_code":"370500","item_name":"东营市"},
    {"item_code":"370600","item_name":"烟台市"},
    {"item_code":"370700","item_name":"潍坊市"},
    {"item_code":"370800","item_name":"济宁市"},
    {"item_code":"370900","item_name":"泰安市"},
    {"item_code":"371000","item_name":"威海市"},
    {"item_code":"371100","item_name":"日照市"},
    {"item_code":"371200","item_name":"莱芜市"},
    {"item_code":"371300","item_name":"临沂市"},
    {"item_code":"371400","item_name":"德州市"},
    {"item_code":"371500","item_name":"聊城市"},
    {"item_code":"371600","item_name":"滨州市"},
    {"item_code":"371700","item_name":"菏泽市"},
    {"item_code":"410100","item_name":"郑州市"},
    {"item_code":"410200","item_name":"开封市"},
    {"item_code":"410300","item_name":"洛阳市"},
    {"item_code":"410400","item_name":"平顶山市"},
    {"item_code":"410500","item_name":"安阳市"},
    {"item_code":"410600","item_name":"鹤壁市"},
    {"item_code":"410700","item_name":"新乡市"},
    {"item_code":"410800","item_name":"焦作市"},
    {"item_code":"410900","item_name":"濮阳市"},
    {"item_code":"411000","item_name":"许昌市"},
    {"item_code":"411100","item_name":"漯河市"},
    {"item_code":"411200","item_name":"三门峡市"},
    {"item_code":"411300","item_name":"南阳市"},
    {"item_code":"411400","item_name":"商丘市"},
    {"item_code":"411500","item_name":"信阳市"},
    {"item_code":"411600","item_name":"周口市"},
    {"item_code":"411700","item_name":"驻马店市"},
    {"item_code":"420100","item_name":"武汉市"},
    {"item_code":"420200","item_name":"黄石市"},
    {"item_code":"420300","item_name":"十堰市"},
    {"item_code":"420500","item_name":"宜昌市"},
    {"item_code":"420600","item_name":"襄樊市"},
    {"item_code":"420700","item_name":"鄂州市"},
    {"item_code":"420800","item_name":"荆门市"},
    {"item_code":"420900","item_name":"孝感市"},
    {"item_code":"421000","item_name":"荆州市"},
    {"item_code":"421100","item_name":"黄冈市"},
    {"item_code":"421200","item_name":"咸宁市"},
    {"item_code":"421300","item_name":"随州市"},
    {"item_code":"422800","item_name":"恩施土家族苗族自治州"},
    {"item_code":"430100","item_name":"长沙市"},
    {"item_code":"430200","item_name":"株洲市"},
    {"item_code":"430300","item_name":"湘潭市"},
    {"item_code":"430400","item_name":"衡阳市"},
    {"item_code":"430500","item_name":"邵阳市"},
    {"item_code":"430600","item_name":"岳阳市"},
    {"item_code":"430700","item_name":"常德市"},
    {"item_code":"430800","item_name":"张家界市"},
    {"item_code":"430900","item_name":"益阳市"},
    {"item_code":"431000","item_name":"郴州市"},
    {"item_code":"431100","item_name":"永州市"},
    {"item_code":"431200","item_name":"怀化市"},
    {"item_code":"431300","item_name":"娄底市"},
    {"item_code":"433100","item_name":"湘西土家族苗族自治州"},
    {"item_code":"440100","item_name":"广州市"},
    {"item_code":"440200","item_name":"韶关市"},
    {"item_code":"440300","item_name":"深圳市"},
    {"item_code":"440400","item_name":"珠海市"},
    {"item_code":"440500","item_name":"汕头市"},
    {"item_code":"440600","item_name":"佛山市"},
    {"item_code":"440700","item_name":"江门市"},
    {"item_code":"440800","item_name":"湛江市"},
    {"item_code":"440900","item_name":"茂名市"},
    {"item_code":"441200","item_name":"肇庆市"},
    {"item_code":"441300","item_name":"惠州市"},
    {"item_code":"441400","item_name":"梅州市"},
    {"item_code":"441500","item_name":"汕尾市"},
    {"item_code":"441600","item_name":"河源市"},
    {"item_code":"441700","item_name":"阳江市"},
    {"item_code":"441800","item_name":"清远市"},
    {"item_code":"441900","item_name":"东莞市"},
    {"item_code":"442000","item_name":"中山市"},
    {"item_code":"445100","item_name":"潮州市"},
    {"item_code":"445200","item_name":"揭阳市"},
    {"item_code":"445300","item_name":"云浮市"},
    {"item_code":"450100","item_name":"南宁市"},
    {"item_code":"450200","item_name":"柳州市"},
    {"item_code":"450300","item_name":"桂林市"},
    {"item_code":"450400","item_name":"梧州市"},
    {"item_code":"450500","item_name":"北海市"},
    {"item_code":"450600","item_name":"防城港市"},
    {"item_code":"450700","item_name":"钦州市"},
    {"item_code":"450800","item_name":"贵港市"},
    {"item_code":"450900","item_name":"玉林市"},
    {"item_code":"451000","item_name":"百色市"},
    {"item_code":"451100","item_name":"贺州市"},
    {"item_code":"451200","item_name":"河池市"},
    {"item_code":"451300","item_name":"来宾市"},
    {"item_code":"451400","item_name":"崇左市"},
    {"item_code":"460100","item_name":"海口市"},
    {"item_code":"460200","item_name":"三亚市"},
    {"item_code":"500100","item_name":"重庆市"},
    {"item_code":"510100","item_name":"成都市"},
    {"item_code":"510300","item_name":"自贡市"},
    {"item_code":"510400","item_name":"攀枝花市"},
    {"item_code":"510500","item_name":"泸州市"},
    {"item_code":"510600","item_name":"德阳市"},
    {"item_code":"510700","item_name":"绵阳市"},
    {"item_code":"510800","item_name":"广元市"},
    {"item_code":"510900","item_name":"遂宁市"},
    {"item_code":"511000","item_name":"内江市"},
    {"item_code":"511100","item_name":"乐山市"},
    {"item_code":"511300","item_name":"南充市"},
    {"item_code":"511400","item_name":"眉山市"},
    {"item_code":"511500","item_name":"宜宾市"},
    {"item_code":"511600","item_name":"广安市"},
    {"item_code":"511700","item_name":"达州市"},
    {"item_code":"511800","item_name":"雅安市"},
    {"item_code":"511900","item_name":"巴中市"},
    {"item_code":"512000","item_name":"资阳市"},
    {"item_code":"513200","item_name":"阿坝藏族羌族自治州"},
    {"item_code":"513300","item_name":"甘孜藏族自治州"},
    {"item_code":"513400","item_name":"凉山彝族自治州"},
    {"item_code":"520100","item_name":"贵阳市"},
    {"item_code":"520200","item_name":"六盘水市"},
    {"item_code":"520300","item_name":"遵义市"},
    {"item_code":"520400","item_name":"安顺市"},
    {"item_code":"520500","item_name":"毕节市"},
    {"item_code":"520601","item_name":"铜仁市"},
    {"item_code":"522300","item_name":"黔西南布依族苗族自治州"},
    {"item_code":"522600","item_name":"黔东南苗族侗族自治州"},
    {"item_code":"522700","item_name":"黔南布依族苗族自治州"},
    {"item_code":"530100","item_name":"昆明市"},
    {"item_code":"530300","item_name":"曲靖市"},
    {"item_code":"530400","item_name":"玉溪市"},
    {"item_code":"530500","item_name":"保山市"},
    {"item_code":"530600","item_name":"昭通市"},
    {"item_code":"530700","item_name":"丽江市"},
    {"item_code":"530800","item_name":"普洱市"},
    {"item_code":"530900","item_name":"临沧市"},
    {"item_code":"532300","item_name":"楚雄彝族自治州"},
    {"item_code":"532500","item_name":"红河哈尼族彝族自治州"},
    {"item_code":"532600","item_name":"文山壮族苗族自治州"},
    {"item_code":"532800","item_name":"西双版纳傣族自治州"},
    {"item_code":"532900","item_name":"大理白族自治州"},
    {"item_code":"533100","item_name":"德宏傣族景颇族自治州"},
    {"item_code":"533300","item_name":"怒江傈僳族自治州"},
    {"item_code":"533400","item_name":"迪庆藏族自治州"},
    {"item_code":"540100","item_name":"拉萨市"},
    {"item_code":"542100","item_name":"昌都地区"},
    {"item_code":"542200","item_name":"山南地区"},
    {"item_code":"542300","item_name":"日喀则地区"},
    {"item_code":"542400","item_name":"那曲地区"},
    {"item_code":"542500","item_name":"阿里地区"},
    {"item_code":"542600","item_name":"林芝地区"},
    {"item_code":"610100","item_name":"西安市"},
    {"item_code":"610200","item_name":"铜川市"},
    {"item_code":"610300","item_name":"宝鸡市"},
    {"item_code":"610400","item_name":"咸阳市"},
    {"item_code":"610500","item_name":"渭南市"},
    {"item_code":"610600","item_name":"延安市"},
    {"item_code":"610700","item_name":"汉中市"},
    {"item_code":"610800","item_name":"榆林市"},
    {"item_code":"610900","item_name":"安康市"},
    {"item_code":"611000","item_name":"商洛市"},
    {"item_code":"620100","item_name":"兰州市"},
    {"item_code":"620200","item_name":"嘉峪关市"},
    {"item_code":"620300","item_name":"金昌市"},
    {"item_code":"620400","item_name":"白银市"},
    {"item_code":"620500","item_name":"天水市"},
    {"item_code":"620600","item_name":"武威市"},
    {"item_code":"620700","item_name":"张掖市"},
    {"item_code":"620800","item_name":"平凉市"},
    {"item_code":"620900","item_name":"酒泉市"},
    {"item_code":"621000","item_name":"庆阳市"},
    {"item_code":"621100","item_name":"定西市"},
    {"item_code":"621200","item_name":"陇南市"},
    {"item_code":"622900","item_name":"临夏回族自治州"},
    {"item_code":"623000","item_name":"甘南藏族自治州"},
    {"item_code":"630100","item_name":"西宁市"},
    {"item_code":"632100","item_name":"海东地区"},
    {"item_code":"632200","item_name":"海北藏族自治州"},
    {"item_code":"632300","item_name":"黄南藏族自治州"},
    {"item_code":"632500","item_name":"海南藏族自治州"},
    {"item_code":"632600","item_name":"果洛藏族自治州"},
    {"item_code":"632700","item_name":"玉树藏族自治州"},
    {"item_code":"632800","item_name":"海西蒙古族藏族自治州"},
    {"item_code":"640100","item_name":"银川市"},
    {"item_code":"640200","item_name":"石嘴山市"},
    {"item_code":"640300","item_name":"吴忠市"},
    {"item_code":"640400","item_name":"固原市"},
    {"item_code":"640500","item_name":"中卫市"},
    {"item_code":"650100","item_name":"乌鲁木齐市"},
    {"item_code":"650200","item_name":"克拉玛依市"},
    {"item_code":"652100","item_name":"吐鲁番地区"},
    {"item_code":"652200","item_name":"哈密地区"},
    {"item_code":"652300","item_name":"昌吉回族自治州"},
    {"item_code":"652700","item_name":"博尔塔拉蒙古自治州"},
    {"item_code":"652800","item_name":"巴音郭楞蒙古自治州"},
    {"item_code":"652900","item_name":"阿克苏地区"},
    {"item_code":"653000","item_name":"克孜勒苏柯尔克孜自治州"},
    {"item_code":"653100","item_name":"喀什地区"},
    {"item_code":"653200","item_name":"和田地区"},
    {"item_code":"654000","item_name":"伊犁哈萨克自治州"},
    {"item_code":"654200","item_name":"塔城地区"},
    {"item_code":"654300","item_name":"阿勒泰地区"},
];
var sb = new StringBuffer();
$.each(cityJson,
    function(i, val) {
    if (val.item_code.substr(2, 4) == '0000') {
        sb.append("<option value='" + val.item_code + "'>" + val.item_name + "</option>");
        }
});
$("#choosePro").after(sb.toString());  //省

 // 省值变化时 处理市
function doProvAndCityRelation() {
    var city = $("#BelongsBankCityQ");  //所在城市
    if (city.children().length > 1) {
        city.empty();
    }
    if ($("#chooseCity").length === 0) {
        city.append("<option id='chooseCity' value='-1'>请选择您所在城市</option>");
    }

    var sb = new StringBuffer();
    $.each(cityJson,
        function(i, val) {
            console.log($("#BelongsBankProvinceQ").val());  //山西省140000
            if (val.item_code.substring(0, 2) == $("#BelongsBankProvinceQ").val().substring(0, 2) && val.item_code.substring(2, 4) != '0000'&& val.item_code.substring(2, 2) != '00' && val.item_code.substring(4, 2) != '00' ) {
                sb.append("<option value='" + val.item_code + "'>" + val.item_name + "</option>");
            }
        });
    $("#chooseCity").after(sb.toString());
}
function doProvAndCityRelationG() {
    var city = $("#BelongsBankProvinceG");  //所在城市
    if (city.children().length > 1) {
        city.empty();
    }
    if ($("#chooseProG").length === 0) {
        city.append("<option id='chooseProG' value='-1'>请选择您所在城市</option>");
    }

    var sb = new StringBuffer();
    $.each(cityJson,
        function(i, val) {
            console.log($("#BelongsBankProvinceG").val());  //山西省140000
            if (val.item_code.substring(0, 2) == $("#BelongsBankProvinceG").val().substring(0, 2) && val.item_code.substring(2, 4) != '0000'&& val.item_code.substring(2, 2) != '00' && val.item_code.substring(4, 2) != '00' ) {
                sb.append("<option value='" + val.item_code + "'>" + val.item_name + "</option>");
            }
        });
    $("#chooseProG").after(sb.toString());
}

function StringBuffer(str) {
    var arr = [];
    str = str || "";
    var size = 0; // 存放数组大小
    arr.push(str);
    // 追加字符串
    this.append = function(str1) {
        arr.push(str1);
        return this;
    };
    // 返回字符串
    this.toString = function() {
        return arr.join("");
    };
    // 清空
    this.clear = function(key) {
        size = 0;
        arr = [];
    };
    // 返回数组大小
    this.size = function() {
        return size;
    };
    // 返回数组
    this.toArray = function() {
        return buffer;
    };
    // 倒序返回字符串
    this.doReverse = function() {
        var str = buffer.join('');
        str = str.split('');
        return str.reverse().join('');
    };
}


//点击提交请求个人完善信息接口
$("#submit").click(function () {
    var UserriskChecked = $("#UserriskG").prop("checked");
    if(UserriskChecked != true){
        myToast('请阅读并选择喝彩艺术商城风险管理办法');
        return false;
    }
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
            //银行卡所属省份

            //银行卡所属市区

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
    var UserriskChecked = $("#UserRiskQ").prop("checked");
    if(UserriskChecked != true){
        myToast('请阅读并选择喝彩艺术商城风险管理办法');
        return false;
    }
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
var depositmoney;
$("#affirm_deposit").click(function () {
    if ($("#custom_money").val() == "") {
        for (var i = 0; i < depositSpans.length; i++) {
            if (depositSpans[i].className == "depositRed" + " " + "depositSpan") {
                depositmoney = depositSpans[i].innerHTML;
            }
        }
    } else if ($("#custom_money").val() != "") {
        depositmoney = $("#custom_money").val();
    }
    console.log(depositmoney);
    if(depositmoney == undefined){
        myToast("请选择金额或输入自定义提现金额");
        return false;
    }else{
        //请求提现费率
        var WithdrawalRateData = JSON.stringify({
            "name":"queryWithdrawFee",
            "ctype": "Web"
        });
        httpAjax(httpheader, WithdrawalRateData, WithdrawalRateSuccess);
        //请求提现费率成功函数
        function WithdrawalRateSuccess(data) {
            console.log(data);
            console.log(depositmoney);
            var feilv;
            if(depositmoney < 1000){
                feilv = 2;
            }else if(depositmoney * (data.repbody.withdrawFee) > data.repbody.maxWithdrawFee){
                feilv = 25;
            }else{
                feilv = depositmoney * (data.repbody.withdrawFee);
            }
            if(data.retcode == 0){
                myConfirm({
                    title: '提示',
                    message: '提现金额：' + depositmoney + "元" + "<br>" + "费率：" + feilv + "元",
                    callback: function () {
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
                    }
                });
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
    }
});

//提现成功接口
function depositSuccess(data) {
    console.log(data);
    if(data.retcode == 0){
        myToast(data.msg);
        httpAjax(httpheader, balanceData, balanceSuccess);  //提现成功刷新余额
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
                    + '推荐奖励'
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
                if (retData[i].updateTime == undefined) {
                    retData[i].updateTime = "";
                } else {
                    retData[i].updateTime = getMyDate(retData[i].updateTime);
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
                        console.log(cxddData);
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
                            console.log(serviceChargeData);
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
                        var btnOrderID = this.accessKey;
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
                                console.log(cxddData);
                                httpAjax(httpheader,cxddData,cxddSuccess);
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
                //提货中
                if(retData[i].deliveryingQty == undefined){
                    retData[i].deliveryingQty = "--";
                }
                var cx = "提货";
                if (retData[i].holdQty == 0) {    //如果当前商品持有数量为0，则提货按钮不能点击
                    holdPositionContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul particulars" accesskey="'
                        + retData[i].commodityId
                        +'"><li class="WithdrawalRecordContentliulli" title="'
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
                    holdPositionContent.append('<li class="WithdrawalRecordContentli"><ul class="WithdrawalRecordContentliul particulars" accesskey="'
                        + retData[i].commodityId
                        +'"><li class="WithdrawalRecordContentliulli" title="'
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

            //点击跳转至商品详情
            $(".particulars").click(function(){
               window.sessionStorage.setItem("COMMODITYID",this.accessKey);
               window.location.href = "DetailsPage.html";
            });
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