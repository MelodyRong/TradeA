document.write("<script src='js/MyAlert.js'></script>");
document.write("<script type='text/javascript' src='js/loginInOrOut.js'></script>");
document.write("<script type='text/javascript' src='js/NetworkRequest.js'></script>");    //网络请求
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

//从sess中获取Str
var sessionStr = window.sessionStorage.getItem("SESSIONSTR");
//从sess中获取用户id
var userID = window.sessionStorage.getItem("USERID");
//从sess中获取用户登录状态
var loginStatus = window.sessionStorage.getItem("LOGINSTATE");
var frimId = window.sessionStorage.getItem("FRIMID");
console.log(frimId);
//是否支持分期
var isFlag;
//首期比例
var listDepositRate;
//手续费
var free;
//商品品相
var condition;
//默认的有效期时间
var validityDate;

//蒙版的高度等于文档的高度
$("#maskLayer").css("height", $(document).height());

function showDiv() {
    document.getElementById('popWindow').style.display = 'block';
    document.getElementById('maskLayer').style.display = 'block';
}

function closeDiv() {
    document.getElementById('popWindow').style.display = 'none';
    document.getElementById('maskLayer').style.display = 'none';
}

//请求一级商品分类接口
var stairData = JSON.stringify({  //一级商品分类
    "reqbody": {
        "categoryId": "0",
        "marketId": "1"
    },
    "sessionStr": sessionStr,
    "userid": userID,
    "name": "getCategory",
    "ctype": "Web"
});
httpAjax(httpheader, stairData, stairSuccess);
var commodity = $("#commodity");

function stairSuccess(data) {
    if (data.retcode == 0) {
        console.log(data.respbody.dataList);
        var retData = data.respbody.dataList;
        //清空价格和数量
        $("#referenceMoney").val("");
        $("#referenceNumber").val("");
        for (var j = 0; j < retData.length; j++) {
            var option = document.createElement("option");
            commodity.append(option);
            option.value = retData[j].categoryId;
            option.className = "option";
            option.innerHTML = retData[j].categoryName;
        }
        bbb();
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

function bbb() {
    //根据所选的一级分类请求二级分类(监听selectedchange事件变化来请求二级分类)
    var commodity = $("#commodity").find('option:selected').val();
    console.log(commodity);
    var e_classificationData = JSON.stringify({
        "reqbody": {
            "categoryId": commodity,
            "marketId": "1"
        },
        "sessionStr": "",
        "userid": "",
        "name": "getCategory",
        "ctype": "Web"
    });
    httpAjax(httpheader, e_classificationData, e_classificationSuccess);

    function e_classificationSuccess(data) {
        if (data.retcode == 0) {
            console.log(data.respbody.dataList);
            var retData = data.respbody.dataList;
            var e_commodity = $("#e_commodity");
            e_commodity.empty();
            //清空价格和数量
            $("#referenceMoney").val("");
            $("#referenceNumber").val("");
            for (var k = 0; k < retData.length; k++) {
                var option = document.createElement("option");
                e_commodity.append(option);
                option.value = retData[k].categoryId;
                option.innerHTML = retData[k].categoryName;
            }
            ejfl();
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
}

function ejfl() {
//当二级分类sele发生改变时根据分类id请求商品名称
    var e_commodity = $("#e_commodity").val();
    //请求商品名称
    var commodityNameData = JSON.stringify({
        "ctype": "Web",
        "name": "queryCategoryCommodity",
        "reqbody": {
            "categoryId": e_commodity,
            "marketId": 3,
            "pageIndex": 1,
            "pageSize": 100
        }
    });
    httpAjax(httpheader, commodityNameData, commodityNameSuccess);

    function commodityNameSuccess(data) {
        if (data.retcode == 0) {
            var retData = data.respbody.commodityList;
            if (retData.length == 0) {
                $("#commodityName").empty();
                myToast("该分类下暂时没有商品");
                return false;
            } else {
                var commodityName = $("#commodityName");
                commodityName.empty();
                //清空价格和数量
                $("#referenceMoney").val("");
                $("#referenceNumber").val("");
                for (var k = 0; k < retData.length; k++) {
                    var option = document.createElement("option");
                    commodityName.append(option);
                    option.value = retData[k].commodityId;
                    option.innerHTML = retData[k].name;
                }
            }
            console.log($("#commodityName").val());   //416
            //遍历一次data数据，找到当前的val商品所对应的首期比例和是否支持分期
            for (var k = 0; k < retData.length; k++) {
                if (retData[k].commodityId == $("#commodityName").val()) {
                    //该商品是否支持分期  0全款1分期isStage
                    if (retData[k].isStage == "0") {
                        isFlag = 0;
                        //隐藏选择付款方式
                        $("#fkfs").css("display", "none");
                        $(".fxts").css("display", "none");
                    } else if (retData[k].isStage == "1") {
                        isFlag = 1;
                        //显示分期付款按钮
                        $("#fkfs").css("display", "block");
                        $(".fxts").css("display", "block");
                        //如果支持分期，首期比例是listDepositRate
                        // listDepositRate = retData[k].listDepositRate;
                        // console.log(retData[k].listDepositRate);
                        // console.log(listDepositRate);
                    }
                }
            }
            ccc();
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
}

function ccc() {
//根据用户所选商品名称id请求商品参考价和所属仓库
    var commodityName = $("#commodityName").val();
    console.log(commodityName);
    //清空价格和数量
    $("#referenceMoney").val("");
    $("#referenceNumber").val("");
    //参考价
    var referencePriceData = JSON.stringify({
        "userid": userID,
        "ctype": "Web",
        "reqbody": {
            "commodityId": commodityName,
        },
        "name": "referencePrice",
        "sessionStr": sessionStr
    });
    httpAjax(httpheader, referencePriceData, referencePriceSuccess);

    function referencePriceSuccess(data) {
        if (data.retcode == 0) {
            console.log(data);
            $("#referenceMoney").prop("placeholder", "参考价:" + data.respbody.referencePrice);
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

    //商品仓库和品相
    var warehouse_conditionData = JSON.stringify({
        "name": "queryCommodityStorage",
        "ctype": "Web",
        "reqbody": {
            "commodityId": commodityName
        }
    });
    httpAjax(httpheader, warehouse_conditionData, warehouse_conditionSuccess);

    function warehouse_conditionSuccess(data) {
        if (data.retcode == 0) {
            console.log(data);
            //提货仓库
            $("#abLager").val(data.respbody.storageList[0].storageName);
            $("#abLager").html(data.respbody.storageList[0].storageID);
            //商品品相
            if (data.respbody.condition == 1) {
                $("#commodityCondition").val("优品");
                condition = 1;
            } else if (data.respbody.condition == 2) {
                $("#commodityCondition").val("良品");
                condition = 2;
            } else if (data.respbody.condition == 3) {
                $("#commodityCondition").val("差品");
                condition = 3;
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

    //判断当前选择的商品是否支持分期，如果支持分期显示分期付款选择按钮(商品详情)
    // console.log(isFlag);
    var installmentData = JSON.stringify({
        "ctype": "Web",
        "name": "commodityDetail",
        "reqbody": {
            "commodityId": commodityName,
            "firmId": frimId,
        },
        "sessionStr": sessionStr,
        "userid": userID
    });
    httpAjax(httpheader, installmentData, installmentSuccess);

    function installmentSuccess(data) {
        console.log(data);
        var retData = data.respbody;
        var isStage = retData.isStage;
        if (isStage == 0) {   //0全款1分期
            isFlag = 0;
            //隐藏分期付款按钮
            $("#fkfs").css("display", "none");
            $(".fxts").css("display", "none");
            console.log(isStage);
            //有效期从退市时间和当前时间一个月后的时间取最小值，并且不能选择今天的日期
            var delistDate = retData.delistDate;   //退市日期
            console.log(delistDate);
            var delistDate_H = new Date(delistDate).getTime();
            console.log(delistDate_H);
            //一个月后的时间
            var ygyh = Number(new Date().getTime()) + Number(30 * 24 * 60 * 60 * 1000);

            function formatDateTime(inputTime) {
                var date = new Date(inputTime);
                var y = date.getFullYear();
                var m = date.getMonth() + 1;
                m = m < 10 ? ('0' + m) : m;
                var d = date.getDate();
                d = d < 10 ? ('0' + d) : d;
                return y + '-' + m + '-' + d;
            }

            if (delistDate_H >= ygyh) {    //退市时间大于等于一个月后的时间，
                $("#validityDate").val(formatDateTime(ygyh));
                validityDate = formatDateTime(ygyh);
            } else {
                $("#validityDate").val(formatDateTime(delistDate));
                validityDate = formatDateTime(delistDate);
            }
        } else if (isStage == 1) {
            isFlag = 1;
            //显示分期付款按钮
            $("#fkfs").css("display", "block");
            $(".fxts").css("display", "block");
            //首期比例
            listDepositRate = retData.listDepositRate;

            //有效期从退市时间和当前时间一个月后的时间取最小值，并且不能选择今天的日期
            var delistDate = retData.delistDate;   //退市日期
            console.log(delistDate);
            var delistDate_H = new Date(delistDate).getTime();
            console.log(delistDate_H);
            //一个月后的时间
            var ygyh = Number(new Date().getTime()) + Number(30 * 24 * 60 * 60 * 1000);
            console.log(ygyh);
            console.log(new Date(ygyh));

            function formatDateTime(inputTime) {
                var date = new Date(inputTime);
                var y = date.getFullYear();
                var m = date.getMonth() + 1;
                m = m < 10 ? ('0' + m) : m;
                var d = date.getDate();
                d = d < 10 ? ('0' + d) : d;
                return y + '-' + m + '-' + d;
            }

            console.log(formatDateTime(ygyh));
            console.log(formatDateTime(delistDate));
            if (delistDate_H >= ygyh) {    //退市时间大于等于一个月后的时间，
                console.log(formatDateTime(ygyh));
                $("#validityDate").val(formatDateTime(ygyh));
                validityDate = formatDateTime(ygyh);
            } else {
                console.log(formatDateTime(delistDate));
                $("#validityDate").val(formatDateTime(delistDate));
                validityDate = formatDateTime(delistDate);
            }

        }
    }
}

$("#commodity").change(function () {
    bbb();
});
$("#e_commodity").change(function () {
    ejfl();
});
$("#commodityName").change(function () {
    ccc();
})

//请求用户可用余额
var balanceData = JSON.stringify({
    "name": "queryFirmFunds",
    "ctype": "Web",
    "sessionStr": sessionStr,
    "userid": userID,
    "reqbody": {
        "userid": userID
    }
});
httpAjax(httpheader, balanceData, balanceSuccess);

function balanceSuccess(data) {
    if (data.retcode == 0) {
        var balanRetData = data.respbody;
        if (balanRetData.balance == null) {
            $("#usablePrice").val("--");
        } else {
            $("#usablePrice").val(balanRetData.balance);
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

//用户输入价格后
$("#referenceMoney").change(function () {
    //判断数量是否为空
    if ($("#referenceNumber").val() == "") {
        // myToast("");
        return false;
    } else if (!(/^[0-9]+$/.test($("#referenceNumber").val()))) {
        myToast("请输入有效整数");
        return false;
    } else {
        //不为空判断选择的是全款还是分期
        //如果当前商品仅支持全款，则不显示付款方式选择，如果支持分期，则显示
        if (isFlag == 0) {    //0全款1分期
            $(".fxts").css("display", "none");
            $(".fxts").css("display", "none");
            //总金额 = 价格*数量
            var zPrice = Number($("#referenceMoney").val()) * Number($("#referenceNumber").val());
            $("#paymentMoney").val(zPrice);
        } else if (isFlag == 1) {
            var obj = $(".inp");
            for (var i = 0; i < obj.length; i++) {
                if (obj[i].checked) {
                    if (obj[i].value == "全款") {    //总金额 = 价格*数量
                        $(".fxts").css("display", "none");
                        $(".fxts").css("display", "none");
                        var zPrice = Number($("#referenceMoney").val()) * Number($("#referenceNumber").val());
                        $("#paymentMoney").val(zPrice);
                    } else if (obj[i].value == "分期付款") {    //总金额 = 价格*数量*首期比例
                        var zPrice = Number($("#referenceMoney").val()) * Number($("#referenceNumber").val());
                        $("#paymentMoney").val((zPrice * listDepositRate).toFixed(2));
                        console.log(zPrice * listDepositRate);
                    }
                }
            }
        }
    }
})
//用户输入数量后支付金额发生变化
$("#referenceNumber").change(function () {
    //判断价格是否为空
    if ($("#referenceMoney").val() == "") {
        // myToast("请填写商品价格");
        return false;
    } else if (!(/^[0-9]+$/.test($("#referenceNumber").val()))) {
        myToast("请输入有效整数");
        return false;
    } else {
        //如果当前商品仅支持全款，则不显示付款方式选择按钮
        if (isFlag == 0) {
            $(".fxts").css("display", "none");
            $(".fxts").css("display", "none");
            //总金额 = 价格*数量
            var zPrice = Number($("#referenceMoney").val()) * Number($("#referenceNumber").val());
            $("#paymentMoney").val(zPrice);
            //根据总金额请求手续费
            var serviceData = JSON.stringify({
                "ctype": "Web",
                "name": "queryfree",
                "reqbody": {
                    "totalAmount": zPrice,
                    "expenseType": "101"//101：买       102 ：卖
                },
                "sessionStr": sessionStr,
                "userid": userID
            });
            httpAjax(httpheader, serviceData, serviceSuccess);

            function serviceSuccess(data) {
                if (data.retcode == 0) {
                    free = data.respbody.free;
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
        } else if (isFlag == 1) {
            //判断不为空的时候判断用户选择的是全款还是分期
            var obj = $(".inp");
            for (var i = 0; i < obj.length; i++) {
                if (obj[i].checked) {
                    if (obj[i].value == "全款") {
                        $(".fxts").css("display", "none");
                        $(".fxts").css("display", "none");
                        //总金额 = 价格*数量
                        var zPrice = Number($("#referenceMoney").val()) * Number($("#referenceNumber").val());
                        $("#paymentMoney").val(zPrice);
                        //根据总金额请求手续费
                        var serviceData = JSON.stringify({
                            "ctype": "Web",
                            "name": "queryfree",
                            "reqbody": {
                                "totalAmount": zPrice,
                                "expenseType": "101"//101：买       102 ：卖
                            },
                            "sessionStr": sessionStr,
                            "userid": userID
                        });
                        httpAjax(httpheader, serviceData, serviceSuccess);

                        function serviceSuccess(data) {
                            if (data.retcode == 0) {
                                free = data.respbody.free;
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
                    } else if (obj[i].value == "分期付款") {
                        //支付金额 = （价格*数量*首期比例）+手续费
                        //总金额 = 价格*数量
                        var zPrice = Number($("#referenceMoney").val()) * Number($("#referenceNumber").val());
                        $("#paymentMoney").val((zPrice * listDepositRate).toFixed(2));
                        //根据总金额请求手续费
                        var serviceData = JSON.stringify({
                            "ctype": "Web",
                            "name": "queryfree",
                            "reqbody": {
                                "totalAmount": zPrice,
                                "expenseType": "101"//101：买       102 ：卖
                            },
                            "sessionStr": sessionStr,
                            "userid": userID
                        });
                        console.log(serviceData);
                        httpAjax(httpheader, serviceData, serviceSuccess);

                        function serviceSuccess(data) {
                            if (data.retcode == 0) {
                                free = data.respbody.free;
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
                    }
                }
            }
        }
    }
});
//用户改变时间时
$("#validityDate").change(function () {
    if (new Date(this.value).getTime() > new Date(validityDate).getTime()) {
        myToast("日期不得大于退市时间或一个月");
        this.value = validityDate;
        return false;
    } else if (new Date(this.value).getTime() < new Date().getTime()) {
        myToast("日期选择错误");
        this.value = validityDate;
        return false;
    }
})
//当全款和分期按钮发生变化时，
$(".inp").change(function () {
    for (var l = 0; l < $(".inp").length; l++) {     //判断所选择的是全款还是分期   0全款1分期
        if ($(".inp")[l].checked == true) {
            if ($(".inp")[l].value == "全款") {
                $(".fxts").css("display", "none");
                //支付金额 = 价格*数量   下订单时提示商品总价和手续费
                //判断价格是否为空
                if ($("#referenceMoney").val() == "") {
                    myToast("请填写商品价格");
                    return false;
                }
                //判断数量是否为空
                if ($("#referenceNumber").val() == "") {
                    myToast("请填写商品数量");
                    return false;
                } else if (!(/^[0-9]+$/.test($("#referenceNumber").val()))) {
                    myToast("商品数量请填写有效整数");
                    return false;
                }
                $("#paymentMoney").val((Number($("#referenceMoney").val()) * Number($("#referenceNumber").val())).toFixed(2));
            } else if ($(".inp")[l].value == "分期付款") {
                //提示分期付款风险
                $(".fxts").css("display", "block");
                // //支付金额 = 价格*数量*首期比例  下单时提示总金额，首期付款金额，手续费
                if ($("#referenceMoney").val() == "") {
                    myToast("请填写商品价格");
                    return false;
                }
                if ($("#referenceNumber").val() == "") {
                    myToast("请填写商品数量");
                    return false;
                } else if (!(/^[0-9]+$/.test($("#referenceNumber").val()))) {
                    myToast("商品数量请填写有效整数");
                    return false;
                }
                $("#paymentMoney").val((Number($("#referenceMoney").val()) * Number($("#referenceNumber").val()) * listDepositRate).toFixed(2));
            }
        }
    }
});
//点击发布购入按钮，先判断用户是否登录，然后判断是否填写价格，数量，时期，判断用户选择的支付方式
$("#submitStorage").click(function () {
    if (loginStatus == false) {
        myToast("会话已失效，请重新登录");
        window.sessionStorage.setItem("LOGINSTATE", "flase");
        window.sessionStorage.setItem("LOGINSOURCE", 1);
        window.location.href = "loginPage.html";
    } else {
        //取到firmType和isChecked
        var firmType = window.sessionStorage.getItem("FIRMTYPE");
        var isChecked = window.sessionStorage.getItem("ISCHECKED");
        if (firmType == 1) {   //1个人账户
            deal();
        } else if (firmType == 6) {   //6企业账户
            if(isChecked == 0){   //0正在审核中
                myToast("您的账号正在审核中，还不能进行交易");
                return false;
            }else if(isChecked == 1){   //已审核
                deal();
            }
        }else if (firmType == 3) {   //3个人分销商账户
            if(isChecked == 0){   //0正在审核中
                myToast("您的账号正在审核中，还不能进行交易");
                return false;
            }else if(isChecked == 1){   //已审核
                deal();
            }
        }else if (firmType == 5) {   //5企业分销商账户
            if(isChecked == 0){   //0正在审核中
                myToast("您的账号正在审核中，还不能进行交易");
                return false;
            }else if(isChecked == 1){   //已审核
                deal();
            }
        }
        function deal() {
            //价格   是否填写价格，价格与参考价相比
            if ($("#referenceMoney").val() == "") {
                myToast("请填写商品价格");
                return false;
            } else if (Number($("#referenceMoney").val()) < Number($("#referenceMoney").attr("placeholder").slice(4))) {
                myToast("发布购入价不能低于发行价");
                return false;
            }
            //判断时间
            if ($("#validityDate").val() == "") {
                myToast("请选择发行时间");
                return false;
            }
            //数量
            if ($("#referenceNumber").val() == "") {
                myToast("请输入商品数量");
                return false;
            } else if (!(/^[0-9]+$/.test($("#referenceNumber").val()))) {
                myToast("商品数量请填写有效整数");
                return false;
            }
            var nmfb;
            //是否匿名
            for (var h = 0; h < $(".nmfb").length; h++) {
                if ($(".nmfb")[h].checked == true) {
                    if ($(".nmfb")[h].value == 1) {   //1匿名0实名
                        console.log($(".nmfb")[h].value);
                        nmfb = 1;
                    } else if ($(".nmfb")[h].value == 0) {
                        console.log($(".nmfb")[h].value);
                        nmfb = 0;
                    }
                }
            }
            //总金额
            var zPrice = Number($("#referenceMoney").val()) * Number($("#referenceNumber").val());
            //商品ID
            var commodityId = $("#commodityName").val();
            //商品名称
            var commodityName = $("#commodityName").text();
            //委托数量
            var referenceNumber = $("#referenceNumber").val();
            //付款
            var paymentMoney = $("#paymentMoney").val();
            //输入价格
            var referenceMoney = $("#referenceMoney").val();
            //仓库ID
            var abLager = $("#abLager").text();
            //时间
            var date = $("#validityDate").val();
            var ReleaseBuyData = JSON.stringify({
                "ctype": "Web",
                "name": "listBuy",
                "reqbody": {
                    "commodityId": commodityId,   //商品ID
                    "commodityName": commodityName,    //商品名称
                    "conditionID": condition,     //品相
                    "entrustQty": referenceNumber,   //委托数量
                    "isAnonymous": nmfb,   //匿名发布  1匿名0实名
                    "isAutoMatch": "1",    //自动匹配  0不自动匹配1自动匹配
                    "orderTotalAmount": zPrice,   //总额
                    "paidAmount": paymentMoney,   //付款
                    "price": referenceMoney,   //输入价格
                    "storageID": abLager,   //仓库ID
                    "validDate": date  //时间
                },
                "sessionStr": sessionStr,
                "userid": userID
            });
            var serviceData = JSON.stringify({    //根据总金额请求一次性手续费
                "ctype": "Web",
                "name": "queryfree",
                "reqbody": {
                    "totalAmount": zPrice,
                    "expenseType": "101"    //101：买 102 ：卖
                },
                "sessionStr": sessionStr,
                "userid": userID
            });
            httpAjax(httpheader, serviceData, serviceSuccess);

            function serviceSuccess(data) {
                if (data.retcode == 0) {
                    if (isFlag == 0) {
                        myConfirm({
                            title: "提示",
                            message: "总金额：" + (Number(zPrice)+Number(data.respbody.free)) + "元" + "<br>" + "一次性手续费：" + data.respbody.free + "元",
                            callback: function () {
                                httpAjax(httpheader, ReleaseBuyData, ReleaseBuySuccess);
                            }
                        });
                    } else if (isFlag == 1) {
                        for (var l = 0; l < $(".inp").length; l++) {     //判断所选择的是全款还是分期   0全款1分期
                            if ($(".inp")[l].checked == true) {
                                if ($(".inp")[l].value == "全款") {   //提示一个总金额一个手续费
                                    myConfirm({
                                        title: "提示",
                                        message: "总金额：" + (Number(zPrice)+Number(data.respbody.free)) + "元" + "<br>" + "一次性手续费：" + data.respbody.free + "元",
                                        callback: function () {
                                            httpAjax(httpheader, ReleaseBuyData, ReleaseBuySuccess);
                                        }
                                    });
                                } else if ($(".inp")[l].value == "分期付款") {    //支付金额
                                    myConfirm({
                                        title: "提示",
                                        message: "首付金额：" + paymentMoney + "元",
                                        callback: function () {
                                            httpAjax(httpheader, ReleaseBuyData, ReleaseBuySuccess);
                                        }
                                    })
                                }
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

            function ReleaseBuySuccess(data) {
                console.log(data);
                if (data.retcode == 0) {
                    showDiv();
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
        }
    }
});
$("#confirmPayment").click(function () {
    closeDiv();
    window.location.href = "MyCenter.html";
})

//点击搜索按钮发起商品搜索
$("#search_inpTwo").on("click", function () {    //将输入的内容存储在sess中一并传递
    window.sessionStorage.setItem("SEARCH", $("#search_inpOne").val());
    window.location.href = "searchPage.html";
});
$(document).keyup(function (event) {
    if (event.keyCode == 13) {
        window.sessionStorage.setItem("SEARCH", $("#search_inpOne").val());
        window.location.href = "searchPage.html";
    }
});
