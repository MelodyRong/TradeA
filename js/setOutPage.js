document.write("<script type='text/javascript' src='js/MyAlert.js'></script>");
document.write("<script type='text/javascript' src='js/loginInOrOut.js'></script>");
document.write("<script type='text/javascript' src='js/reclassify.js'></script>");
document.write("<script type='text/javascript' src='js/NetworkRequest.js'></script>");    //网络请求
// var httpheader = "http://106.14.175.148:18203/";
function allcommodityAjax(url, retData, successFunction) {
    $.ajax({
        type: "POST",
        url: url,
        contentType: 'application/json;charset=UTF-8',
        dataType: 'json',
        data: retData,
        success: function (data) {
            successFunction(data);
        },
        error: function (data) {
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

//sess中获取商品名称
var productName = window.sessionStorage.getItem("PRODUCTNAME");
console.log(productName);
$("#pick_hang_titleName").html(productName);
//sess中获取购买人姓名
var BuyName = window.sessionStorage.getItem("BUYSNAME");
console.log(BuyName);
$("#buyname").html(BuyName);
//从sess中获取价格
var unitPrice = window.sessionStorage.getItem("UNITPRICE");
console.log(unitPrice);
console.log(typeof(unitPrice));
$("#buyprice").html(unitPrice);
//sess中获取数量
var quantity = window.sessionStorage.getItem("QUANTITY");
console.log(quantity);
$("#buynumber").html(quantity);
//sess中获取总金额
var zPrice = window.sessionStorage.getItem("ZBUYPRICE");
console.log(zPrice);
$("#span1").html(zPrice);
//sess中获取是否全款    1全款0分期
var isStage = window.sessionStorage.getItem("ISSTAGE");
console.log(isStage);
//判断采购和售出  1采购2售出
var bsFlag = window.sessionStorage.getItem("BSFLAG");
console.log(bsFlag);

//如果当期商品支持分期，那么先请求手续费，再判断支付方式后 再判断付款方式为全款还是分期，判读该操作是摘购还是摘售 如果为全款  摘购，直接下单，如果为分期  摘购  直接下单。
//如果为全款  摘售，直接下单，如果为分期  摘售  直接下单
//如果当期商品不支持分期，则请求手续费后 判断支付方式 再判断摘售 直接下单   或摘购  直接下单
//获取单选框的值   for(var i=0; i<obj.length; i ++){if(obj[i].checked){alert(obj[i].value);}}

//点击确认下单先请求手续费,然后判断付款方式为全款   买101   卖102
function serviceChargeData(expenseType) {
    return JSON.stringify({
        "ctype": "Web",
        "name": "queryfree",
        "reqbody": {
            "totalAmount": zPrice,
            "expenseType": expenseType
        },
        "sessionStr": sessionStr,
        "userid": userid
    })
}
var addressDatailData = JSON.stringify({   //完善信息参数
    "ctype": "Web",
    "name": "queryAddr",
    "reqbody": {},
    "sessionStr": sessionStr,
    "userid": userid
});
if (isStage == 1) {    //0全款  1分期   分期情况下摘购（卖）没有全款和分期的区别    摘售（买）药区分全款和分期
    $("#pick_hang_titlePaymentMethod").html("分期付款");
    var listDepositrate = window.sessionStorage.getItem("LISTDEPOSITRATE");   //取到首期比例
    $("#fqfkje").html("首期付款金额：" + Number(unitPrice) * Number(quantity) * Number(listDepositrate));  //首期付款金额：价格*数量*比例
    if (bsFlag == 1) {   //1摘购2摘售
        $("#fqfkje").css("display", "none");   //隐藏首付金额
        $("#fkfs").css("display", "none");  //隐藏付款方式选择
        $("#FQhintt").css("display","none");    //隐藏尾款支付提示
        $("#pick_hang_footerbtn").click(function () {   //点击确认下单   摘购（卖）没有全款和分期之区别    摘售（买）区分全款和分期
                allcommodityAjax(httpheader, addressDatailData, addressDatailSuccess);   //请求完善信息接口
                function addressDatailSuccess(data) {    //请求完善信息成功函数
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
                        } else {   //信息都已完善，请求手续费
                            allcommodityAjax(httpheader, serviceChargeData("102"), serviceChargeSuccess);//摘购
                            function serviceChargeSuccess(data) {
                                if (data.retcode == 0) {
                                    var orderId = window.sessionStorage.getItem("ORDERID");
                                    console.log(orderId);
                                    var qkData = JSON.stringify({
                                        "ctype": "Web",
                                        "name": "listTradeBuy",
                                        "reqbody": {
                                            "commodityName": productName,
                                            "listOrderID": orderId,
                                            "orderTotalAmount": Number(zPrice),
                                            "paidAmount": Number(zPrice)
                                        },
                                        "sessionStr": sessionStr,
                                        "userid": userid
                                    });
                                    myAlert({
                                        title: "提示",
                                        message: "商品手续费一次性" + (data.respbody.free).toFixed(2) + "元",
                                        callback: function () {
                                            allcommodityAjax(httpheader, qkData, qkSuccess);
                                            function qkSuccess(data) {
                                                if (data.retcode == 0) {
                                                    myToast("支付成功，请到个人中心-我的售出页面查询");
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
                                        console.log(data.msg);
                                        myToast(data.msg);
                                    }
                                }
                            }
                        }
                    }else{
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
    } else if (bsFlag == 2) {  //1摘购2摘售
        var radio = $(".inp");   //改变付款方式，如是全款隐藏首付金额和尾款支付提示   如是分期显示首付金额和尾款支付提示
        radio.on("change", function () {
            if (this.value == "全款") {
                $("#fqfkje").css("display", "none");
                $("#FQhintt").css("display","none");
            } else if (this.value == "分期付款") {
                $("#fqfkje").css("display", "block");
                $("#FQhintt").css("display","block");
            }
        });
        $("#pick_hang_footerbtn").click(function () {   //点击确认下单   摘购（卖）没有全款和分期之区别    摘售（买）区分全款和分期
            allcommodityAjax(httpheader, addressDatailData, addressDatailSuccess);   //请求完善信息接口
            function addressDatailSuccess(data) {
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
                        } else {  //信息都已完善，请求手续费  开始继续交易
                            allcommodityAjax(httpheader, serviceChargeData("101"), serviceChargeSuccess);     //摘售（买）  请求手续费
                            var orderId = window.sessionStorage.getItem("ORDERID");
                            function serviceChargeSuccess(data) {
                                if (data.retcode == 0) {
                                    var obj = $(".inp");
                                    for (var i = 0; i < obj.length; i++) {
                                        if (obj[i].checked) {
                                            if (obj[i].value == "全款") {
                                                var totalMoney = Number(data.respbody.free) + Number(zPrice);     //商品金额+手续费
                                                myConfirm({
                                                    title: "提示",
                                                    message: "商品手续费一次性" + (data.respbody.free).toFixed(2) + "元" + "<br/>" + "付款金额" + totalMoney.toFixed(2) + "元",
                                                    callback: function () {
                                                        var qkData = JSON.stringify({
                                                            "ctype": "Web",
                                                            "name": "listTradeSell",
                                                            "reqbody": {
                                                                "commodityName": productName,
                                                                "listOrderID": orderId,
                                                                "orderTotalAmount": Number(zPrice),
                                                                "paidAmount": Number(zPrice)
                                                            },
                                                            "sessionStr": sessionStr,
                                                            "userid": userid
                                                        });
                                                        allcommodityAjax(httpheader, qkData, qkSuccess);

                                                        function qkSuccess(data) {
                                                            if (data.retcode == 0) {
                                                                myToast("支付成功，请到个人中心-我的购入页面查询");
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
                                                                    myToast(data.msg);
                                                                }
                                                            }
                                                        }
                                                    }
                                                })
                                            } else if (obj[i].value == "分期付款") {
                                                var paidAmount = unitPrice * quantity * listDepositrate;   //首期付款金额 = 数量*单价*首期比例
                                                myConfirm({
                                                    title: "提示",
                                                    message: "首付金额" + (paidAmount).toFixed(2) + "元",
                                                    callback: function () {
                                                        var qkData = JSON.stringify({
                                                            "ctype": "Web",
                                                            "name": "listTradeSell",
                                                            "reqbody": {
                                                                "commodityName": productName,
                                                                "listOrderID": orderId,
                                                                "orderTotalAmount": Number(zPrice),
                                                                "paidAmount": paidAmount
                                                            },
                                                            "sessionStr": sessionStr,
                                                            "userid": userid
                                                        });
                                                        allcommodityAjax(httpheader, qkData, qkSuccess);

                                                        function qkSuccess(data) {
                                                            if (data.retcode == 0) {
                                                                myToast("支付成功，请到个人中心-我的购入页面查询");
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
                                                                    myToast(data.msg);
                                                                }
                                                            }
                                                        }
                                                    }
                                                })
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
                        }
                    }else{
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
        });
    }
} else if (isStage == 0) {       //0全款  1分期    商品仅支持全款的情况下，摘购（卖）和摘售（买）都不区分全款和分期
        $("#pick_hang_titlePaymentMethod").html("全款");
        $("#fqfkje").css("display", "none");   //隐藏分期付款的金额
        $("#fkfs").css("display","none");   //隐藏付款方式选择
        $("#FQhintt").css("display","none");    //隐藏尾款支付提示
        var orderId = window.sessionStorage.getItem("ORDERID");
        $("#pick_hang_footerbtn").click(function () {
                if (bsFlag == 1) {   //摘购（卖）   先请求完善信息再请求手续费
                    var addressDatailData = JSON.stringify({
                        "ctype": "Web",
                        "name": "queryAddr",
                        "reqbody": {},
                        "sessionStr": sessionStr,
                        "userid": userid
                    });
                    allcommodityAjax(httpheader, addressDatailData, addressDatailSuccess);
                    function addressDatailSuccess(data) {
                        if (data.retcode == 0) {
                            var retData = data.respbody.list;
                            if (retData.length == 0) {
                                myAlert({
                                    title: '提示',
                                    message: '请先到完善信息页面完善信息',
                                    callback: function () {
                                        window.location.href = "MyCenter.html";
                                    }
                                });
                            } else {   //信息都已完善，请求手续费
                                allcommodityAjax(httpheader, serviceChargeData("102"), serviceChargeSuccess);   //点击下单请求手续费
                                function serviceChargeSuccess(data1) {
                                    if (data1.retcode == 0) {
                                        myAlert({
                                            title: "提示",
                                            message: "商品手续费一次性" + (data1.respbody.free).toFixed(2) + "元",
                                            callback: function () {
                                                var qkData = JSON.stringify({
                                                    "ctype": "Web",
                                                    "name": "listTradeBuy",
                                                    "reqbody": {
                                                        "commodityName": productName,
                                                        "listOrderID": orderId,
                                                        "orderTotalAmount": Number(zPrice),
                                                        "paidAmount": Number(zPrice)
                                                    },
                                                    "sessionStr": sessionStr,
                                                    "userid": userid
                                                });
                                                allcommodityAjax(httpheader, qkData, qkSuccess);
                                                function qkSuccess(data) {
                                                    if (data.retcode == 0) {
                                                        myToast("支付成功，请到个人中心-我的售出页面查询");
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
                } else if (bsFlag == 2) {   //摘售（买）
                    //先检测用户信息是否完善
                    var addressDatailData = JSON.stringify({
                        "ctype": "Web",
                        "name": "queryAddr",
                        "reqbody": {},
                        "sessionStr": sessionStr,
                        "userid": userid
                    });
                    allcommodityAjax(httpheader, addressDatailData, addressDatailSuccess);
                    function addressDatailSuccess(data) {
                        if (data.retcode == 0) {
                            var retData = data.respbody.list;
                            if (retData.length == 0) {
                                myAlert({
                                    title: '提示',
                                    message: '请先到完善信息页面完善信息',
                                    callback: function () {
                                        window.location.href = "MyCenter.html";
                                    }
                                });
                            } else {
                                allcommodityAjax(httpheader, serviceChargeData("101"), serviceChargeSuccess);   //点击下单请求手续费
                                function serviceChargeSuccess(data1) {
                                    console.log(data1);
                                    if (data1.retcode == 0) {
                                        var totalMoney = Number(data1.respbody.free) + Number(zPrice);     //商品金额+手续费
                                        myConfirm({
                                            title: "提示",
                                            message: "商品手续费一次性：" + (data1.respbody.free).toFixed(2) + "元" + "<br>" + "总付金额：" + totalMoney.toFixed(2) + "元",
                                            callback: function () {
                                                var qkData = JSON.stringify({
                                                    "ctype": "Web",
                                                    "name": "listTradeSell",
                                                    "reqbody": {
                                                        "commodityName": productName,
                                                        "listOrderID": orderId,
                                                        "orderTotalAmount": Number(zPrice),
                                                        "paidAmount": Number(zPrice)
                                                    },
                                                    "sessionStr": sessionStr,
                                                    "userid": userid
                                                });
                                                allcommodityAjax(httpheader, qkData, qkSuccess);
                                                function qkSuccess(data) {
                                                    if (data.retcode == 0) {
                                                        myToast("支付成功，请到个人中心-我的购入页面查询");
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
                                                            console.log(data);
                                                            console.log(data.msg);
                                                            myToast(data.msg);
                                                        }
                                                    }
                                                }
                                            }
                                        })
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
                } else {
                    if (data1.retcode == -17401) {
                        loginOut();
                        window.sessionStorage.setItem("LOGINSTATE", "flase");
                        window.sessionStorage.setItem("LOGINSOURCE", 1);
                        window.location.href = "loginPage.html";
                    }
                }
        });
    }

//点击搜索按钮发起商品搜索
    $("#search_inpTwo").on("click", function () {
        //讲输入的内容存储在sess中一并传递
        window.sessionStorage.setItem("SEARCH", $("#search_inpOne").val());
        window.location.href = "searchPage.html";
    });


