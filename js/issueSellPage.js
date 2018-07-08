document.write("<script src='js/MyAlert.js'></script>");
document.write("<script src='js/MyAlert.js'></script>");
document.write("<script type='text/javascript' src='js/loginInOrOut.js'></script>");
document.write("<script type='text/javascript' src='js/reclassify.js'></script>");    //一二级分类
document.write("<script type='text/javascript' src='js/NetworkRequest.js'></script>");    //网络请求
var httpheader = "http://106.14.175.148:18203/";
var condition;   //品相
var MaxCount;    //持有数量
var oriPrice;    //基础价
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
console.log(sessionStr);
//从sess中获取用户id
var userID = window.sessionStorage.getItem("USERID");
console.log(userID);
//从sess中获取用户登录状态
var loginStatus = window.sessionStorage.getItem("LOGINSTATE");
console.log(loginStatus);
var firmId = window.sessionStorage.getItem("FRIMID")


//根据用户信息请求用户持有商品列表
var workOffData = JSON.stringify({
    "sessionStr": sessionStr,
    "userid": userID,
    "name": "queryHoldCommodity",
    "ctype": "Web"
});
httpAjax(httpheader, workOffData, workOffSuccess);
//用户持有商品列表
var commodityList = $("#commodityList");

function workOffSuccess(data) {
    console.log(data);
    if (data.retcode == 0) {
        var retData = data.respbody.commodityList;
        if (retData.length == 0) {
            myToast("该用户暂时没有任何持仓商品，无法发布售出");
            return false;
        } else {
            for (var j = 0; j < retData.length; j++) {
                var option = document.createElement("option");
                commodityList.append(option);
                option.value = retData[j].commodityId;
                option.innerHTML = retData[j].name;
                option.className = "option";
            }
            aaa();
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

function aaa() {
    //根据所选商品ID请求参考价和商品品相和所属仓库
    var commodityID = $("#commodityList").val();
    //清空价格和数量
    $("#referenceMoney").val("");
    $("#referenceNumber").val("");
    //参考价
    var referencePriceData = JSON.stringify({
        "userid": userID,
        "ctype": "Web",
        "reqbody": {
            "commodityId": commodityID,
        },
        "name": "referencePrice",
        "sessionStr": sessionStr
    });
    httpAjax(httpheader, referencePriceData, referencePriceSuccess);

    function referencePriceSuccess(data) {
        console.log(data);
        if (data.retcode == 0) {
            var oriPrice = data.respbody.oriPrice;
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
    //品相和仓库
    var warehouse_conditionData = JSON.stringify({
        "name": "queryCommodityStorage",
        "ctype": "Web",
        "reqbody": {
            "commodityId": commodityID
        }
    });
    console.log(warehouse_conditionData);
    httpAjax(httpheader, warehouse_conditionData, warehouse_conditionSuccess);
};
function warehouse_conditionSuccess(data) {
    console.log(data);
    if (data.retcode == 0) {
        var retdata = data.respbody.storageList[0];
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

        //查询持仓数量
        var commodityId = $("#commodityList").val();
        var storageId = $("#abLager").text();
        var queryInventoryData = JSON.stringify({
            "sessionStr": sessionStr,
            "reqbody": {
                "commodityId": commodityId,   //商品ID
                "conditionId": condition,    //品相
                "strategyId": storageId     //仓库ID
            },
            "userid": userID,
            "name": "queryInventory",
            "ctype": "Web"
        });
        httpAjax(httpheader, queryInventoryData, queryInventorySuccess);

        function queryInventorySuccess(data) {
            console.log(data);
            if (data.retcode == 0) {
                var retData = data.respbody.holdQty;
                $("#sellQuantity").val(retData);
                MaxCount = retData;

                //请求商品详情来去的退市时间
                var installmentData = JSON.stringify({
                    "ctype": "Web",
                    "name": "commodityDetail",
                    "reqbody": {
                        "commodityId": commodityId,
                        "firmId": firmId,
                    },
                    "sessionStr": sessionStr,
                    "userid": userID
                });
                httpAjax(httpheader, installmentData, installmentSuccess);

                function installmentSuccess(data) {
                    console.log(data);
                    var retData = data.respbody;
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
                        //有效期发生改变时，判断有效期是否选择正确
                        $("#validityDate").change(function () {
                            if (new Date(this.value).getTime() > ygyh) {
                                myToast("日期不得大于退市时间或一个月");
                                if (delistDate_H > ygyh) {
                                    console.log(formatDateTime(ygyh));
                                    $("#validityDate").val(formatDateTime(ygyh));
                                } else {
                                    console.log(formatDateTime(delistDate));
                                    $("#validityDate").val(formatDateTime(delistDate));
                                }
                                return false;
                            } else if (new Date(this.value).getTime() < new Date().getTime()) {
                                myToast("日期选择错误");
                                return false;
                            }
                        })
                    } else {
                        console.log(formatDateTime(delistDate));
                        $("#validityDate").val(formatDateTime(delistDate));
                        $("#validityDate").change(function () {
                            if (new Date(this.value).getTime() > delistDate) {
                                myToast("日期不得大于退市时间或一个月");
                                if (delistDate_H > ygyh) {
                                    console.log(formatDateTime(ygyh));
                                    $("#validityDate").val(formatDateTime(ygyh));
                                } else {
                                    console.log(formatDateTime(delistDate));
                                    $("#validityDate").val(formatDateTime(delistDate));
                                }
                                return false;
                            } else if (new Date(this.value).getTime() < new Date().getTime()) {
                                myToast("日期选择错误");
                                return false;
                            }
                        })
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

//当商品名称下拉框发生变化的时候改变仓库和参考价，品相
$("#commodityList").change(function () {
    aaa();
});
//点击发布售出
$("#submitStorage").click(function () {
    if (loginStatus == null) {
        myToast("会话已失效，请重新登录");
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
            var addressDatailData = JSON.stringify({
                "ctype": "Web",
                "name": "queryAddr",
                "reqbody": {},
                "sessionStr": sessionStr,
                "userid": userID
            });
            httpAjax(httpheader,addressDatailData,addressDatailSuccess);
            function addressDatailSuccess(data){
                console.log(data);
                if(data.retcode == 0){
                    var retData = data.respbody.list;
                    if (retData.length == 0) {
                        myAlert({
                            title: '提示',
                            message: '请先到完善信息页面完善信息',
                            callback: function () {
                                window.location.href = "MyCenter.html";
                            }
                        });
                    }else{
                        //价格   是否填写价格，价格与参考价相比
                        if ($("#referenceMoney").val() == "") {
                            myToast("请填写商品价格");
                            return false;
                        } else if (Number($("#referenceMoney").val()) < Number(oriPrice)) {
                            myToast("发布售出价不能低于基础价");
                            return false;
                        }
                        //判断时间
                        if ($("#validityDate").val() == "") {
                            myToast("请选择有效期");
                            return false;
                        } else if (new Date($("#validityDate").val()).getTime() < new Date().getTime()) {
                            myToast("发行时间选择错误，请选择当前时间以后的时间");
                            return false;
                        } else if ((new Date($("#validityDate").val()).getTime()) - (new Date().getTime()) > (30 * 24 * 60 * 60 * 1000)) {
                            myToast("发行时间选择错误，请选择当前时间以后一个月内的时间");
                            return false;
                        }
                        //数量
                        if ($("#referenceNumber").val() == "") {
                            myToast("请输入商品数量");
                            return false;
                        } else if ($("#referenceNumber").val() > MaxCount) {
                            myToast("售出商品数量大于持有商品数量，请重新填写");
                        }
                        //用户当前商品的可卖数量为0
                        if($("#sellQuantity").val() == 0){
                            myToast("当前商品的可卖数量为0，请重新选择商品");
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
                        var commodityId = $("#commodityList").val();
                        //商品名称
                        var commodityName = $('#commodityList .option:selected').text();
                        //委托数量
                        var referenceNumber = $("#referenceNumber").val();
                        // //付款
                        // var paymentMoney = $("#paymentMoney").val();
                        // console.log("付款金额"+paymentMoney);
                        //输入价格
                        var referenceMoney = $("#referenceMoney").val();
                        //仓库ID
                        var abLager = $("#abLager").text();
                        //时间
                        var date = $("#validityDate").val();
                        //请求一次性手续费
                        var serviceChargeData = JSON.stringify({
                            "ctype": "Web",
                            "name": "queryfree",
                            "reqbody": {
                                "totalAmount": zPrice,
                                "expenseType": "102"
                            },
                            "sessionStr": sessionStr,
                            "userid": userID
                        });
                        httpAjax(httpheader, serviceChargeData, serviceChargeSuccess);

                        function serviceChargeSuccess(data) {
                            console.log(data);
                            if (data.retcode == 0) {
                                //弹出提示框提示手续费
                                myConfirm({
                                    title: '提示',
                                    message: '一次性手续费' + data.respbody.free + "元",
                                    callback: function () {
                                        //发起发布售出
                                        var ReleaseBuyData = JSON.stringify({
                                            "ctype": "Web",
                                            "name": "listSell",
                                            "sessionStr": sessionStr,
                                            "userid": userID,
                                            "reqbody": {
                                                "price": referenceMoney,   //输入价格
                                                "entrustQty": referenceNumber,   //委托数量
                                                "commodityId": commodityId,   //商品ID
                                                "isAnonymous": nmfb,   //匿名发布  1匿名0实名
                                                "conditionID": condition,     //品相
                                                "storageID": abLager,   //仓库ID
                                                "validDate":date    //有效期
                                            }
                                        });
                                        httpAjax(httpheader, ReleaseBuyData, ReleaseBuySuccess);

                                        function ReleaseBuySuccess(data) {
                                            console.log(data);
                                            if (data.retcode == 0) {
                                                myToast("发布成功，请到个人中心查看");
                                                setInterval(function () {
                                                    window.location.href = "MyCenter.html";
                                                }, 2000)
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
                                })
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
        }
    }
});

//点击搜索按钮发起商品搜索
$("#search_inpTwo").on("click", function () {    //将输入的内容存储在sess中一并传递
    window.sessionStorage.setItem("SEARCH", $("#search_inpOne").val());
    window.location.href = "searchPage.html";
});
$(document).keyup(function(event){
    if(event.keyCode ==13){
        window.sessionStorage.setItem("SEARCH", $("#search_inpOne").val());
        window.location.href = "searchPage.html";
    }
});

