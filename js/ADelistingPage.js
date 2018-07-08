document.write("<script type='text/javascript' src='js/NetworkRequest.js'></script>");    //网络请求
document.write("<script type='text/javascript' src='js/MyAlert.js'></script>");   //弹框
document.write("<script type='text/javascript' src='js/loginInOrOut.js'></script>");   //登录
document.write("<script type='text/javascript' src='js/reclassify.js'></script>");   //一二级分类
var httpheader = "http://106.14.175.148:18203/";

//ajax函数
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

var sessionStr = window.sessionStorage.getItem("SESSIONSTR");   //sessionStr
var userId = window.sessionStorage.getItem("USERID");    //userId
var frimId = window.sessionStorage.getItem("FRIMID");    //frimId
var loginStatus = window.sessionStorage.getItem("LOGINSTATE");    //登录状态
var commodityId = window.sessionStorage.getItem("COMMODITYID");    //商品id
var commodityName = window.sessionStorage.getItem("PRODUCTNAME");   //商品名称
$("#pick_hang_titleName").html(commodityName);
var purchasePrice = window.sessionStorage.getItem("PURCHASEPRICE");//购入价
var purchaseQuantity = window.sessionStorage.getItem("PURCHASEQUANTITY");   //购入数量
var validityDate = window.sessionStorage.getItem("PURCHASEBUYDATE");   //用户查询的有效期
var isStage = window.sessionStorage.getItem("ISSTAGE");    //是否支持分期   0全款 1分期
var listDepositRate = window.sessionStorage.getItem("LISTDEPOSITIRATE");   //首期比例
var BuyOrSell = window.sessionStorage.getItem("BUYSELL");    //用户发起的购入查询还是售出查询    购入摘牌2查售出单 售出摘牌1查购入单
console.log(BuyOrSell);
//全选按钮
$("#checkAll").on("change", function () {
    console.log(this.checked);
    if (this.checked == false) {
        for (var j = 0; j < $(".checkAll").length; j++) {
            $(".checkAll")[j].checked = "";
        }
    } else if (this.checked == true) {
        for (var j = 0; j < $(".checkAll").length; j++) {
            $(".checkAll")[j].checked = "checked";
        }
    }
});
//售出摘牌（一键摘售）是当前用户要卖出商品   查询的是买单列表，不区分全款和分期  发起协议sell直接交易   交易只提示手续费
//购入摘牌（一键摘购）是当前用户要买商品    查询的是卖单列表，区别全款和分期  发起协议buy进行交易    交易提示手续费和总金额   总金额 = 商品总金额+手续费
//售出摘牌 BuyOrSell值为1，查购入单
if (BuyOrSell == 1) {
    if (isStage == 0) {  //仅支持全款
        $("#pick_hang_titlePaymentMethod").html("全款");
        $("#paymentCheck").css("display", "none");  //隐藏付款方式选择
        $("#FQhint").css("display", "none");   //隐藏分期付款提示
        $("#sqfq").css("display", "none"); //隐藏首期付款金额字幕
        $("#fqfkje").css("display", "none");  //隐藏首期付款金额
    } else if (isStage == 1) {   //支持分期
        $("#pick_hang_titlePaymentMethod").html("分期付款");
        $("#paymentCheck").css("display", "none");  //隐藏付款方式选择
        $("#FQhint").css("display", "none");   //隐藏分期付款提示
        $("#sqfq").css("display", "none"); //隐藏首期付款金额字幕
        $("#fqfkje").css("display", "none");  //隐藏首期付款金额
    }
    var SellData = JSON.stringify({
        "ctype": "Web",
        "name": "queryOnekeyListOrder",
        "reqbody": {
            "bsFlag": "1",
            "commodityId": commodityId,
            "pageIndex": "1",
            "pageSize": "100",
            "price": purchasePrice,
            "quantity": purchaseQuantity,
            "status": "1",
            "validDate": validityDate
        },
        "sessionStr": sessionStr,
        "userid": userId
    });
    homePageAjax(httpheader, SellData, SellSuccess);

    function SellSuccess(data) {
        console.log(data);
        if (data.retcode == 0) {
            //将搜索得到的数据展示在页面中
            var retData = data.respbody.arrayList;
            var BuyListWrap = $("#BuyListWrap");
            for (var i = 0; i < retData.length; i++) {
                BuyListWrap.append('<li class="BuyListWrap_Details"><ul class="BuyListUlLi"><li>'
                    + '购入' + (i + 1)
                    + '</li><li>'
                    + ''
                    + '</li><li>'
                    + retData[i].listPrice
                    + '</li><li>'
                    + retData[i].quantity
                    + '</li><li><input type="checkbox" name="checkdAll" class="checkAll" checked="checked" accesskey="'
                    + retData[i].quantity
                    + '" value="'
                    + retData[i].listPrice
                    + '"></li></ul></li>');
            }
            //计算数量和金额以及全选框的选择
            var quantityReady = 0;
            var checkedAllReady = $(".checkAll");
            for (var l = 0; l < checkedAllReady.length; l++) {
                quantityReady += Number(checkedAllReady[l].accessKey);
            }
            $("#zNumber").html(quantityReady);
            //计算总金额
            var priceReady = 0;
            for (var m = 0; m < checkedAllReady.length; m++) {
                if (checkedAllReady[m].checked == true) {
                    console.log(Number(checkedAllReady[m].accessKey));
                    console.log(Number(checkedAllReady[m].value));
                    priceReady += (Number(checkedAllReady[m].accessKey)) * (Number(checkedAllReady[m].value));
                }
            }
            $("#span1").html((priceReady).toFixed(2));
            //遍历所有的多选框，如果有一个没选中，则全选按钮不选
            var checkAll = $(".checkAll");
            for (var i = 0; i < checkAll.length; i++) {
                checkAll[i].onchange = function () {
                    //如果当前checked为false，则全选checked的为false
                    if (this.checked == false) {
                        $("#checkAll").prop("checked", false);
                    }
                    //遍历所有的复选框，如果有一个checked为false，则全选的checked也为false
                    //计算数量
                    var quantity = 0;
                    for (var k = 0; k < checkAll.length; k++) {
                        if (checkAll[k].checked == true) {
                            quantity += Number(checkAll[k].accessKey);
                        }
                    }
                    $("#zNumber").html(quantity);
                    //计算总金额
                    var price = 0;
                    for (var m = 0; m < checkAll.length; m++) {
                        if (checkAll[m].checked == true) {
                            price += (Number(checkAll[m].accessKey)) * (Number(checkAll[m].value));
                        }
                    }
                    $("#span1").html((price).toFixed(2));
                }
            }
            //点击确认下单
            $("#pick_hang_footerbtn").click(function () {
                if (loginStatus == null) {
                    loginOut();
                    window.sessionStorage.setItem("LOGINSTATE", "flase");
                    window.sessionStorage.setItem("LOGINSOURCE", 1);
                    window.location.href = "loginPage.html";
                } else {
                        //判断是否选中商品
                        var chaestVal = "";
                        for (var x = 0; x < $(".checkAll").length; x++) {
                            if ($(".checkAll")[x].checked == true) {
                                chaestVal += $(".checkAll")[x].value;
                            }
                        }
                        if (chaestVal == "") {
                            myToast("请选择商品");
                            return false;
                        }
                        var listOrderIdList = [];
                        var orderIdList = data.respbody.arrayList;
                        for (var d = 0; d < orderIdList.length; d++) {   //循环得到listOrderID
                            var listList = {};
                            listList.listOrderId = orderIdList[d].orderID;
                            listOrderIdList.push(listList);
                        }
                        var addressDatailData = JSON.stringify({    //判断是否完善信息
                            "ctype": "Web",
                            "name": "queryAddr",
                            "reqbody": {},
                            "sessionStr": sessionStr,
                            "userid": userId
                        });
                        homePageAjax(httpheader, addressDatailData, addressDetailSuccess);

                        function addressDetailSuccess(data) {
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
                                } else {   //已完善信息，请求手续费  开始交易
                                    var totalAmount = $("#span1").html();  //根据总金额请求手续费
                                    var serviceChargeData = JSON.stringify({
                                        "ctype": "Web",
                                        "name": "queryfree",
                                        "reqbody": {
                                            "totalAmount": totalAmount,
                                            "expenseType": "102"
                                        },
                                        "sessionStr": sessionStr,
                                        "userid": userId
                                    });
                                    homePageAjax(httpheader, serviceChargeData, serviceChargeSuccess);

                                    function serviceChargeSuccess(data) {    //手续费请求成功
                                        if (data.retcode == 0) {
                                            var sxf = (data.respbody.free).toFixed(2);
                                            var money = $("#span1").html();
                                            var number = $("#zNumber").html();
                                            myConfirm({
                                                title: '提示',
                                                message: '是否确定下单?' + "<br>" + "一次性手续费" + sxf + "元",
                                                callback: function () {
                                                    var QbuyData = JSON.stringify({
                                                        "userid": userId,
                                                        "ctype": "Web",
                                                        "reqbody": {
                                                            "paidAmount": Number(money),
                                                            "price": Number(money),
                                                            "commodityName": commodityName,
                                                            "listOrderIdList": listOrderIdList,
                                                            "orderTotalAmount": Number(money)
                                                        },
                                                        "name": "onekeyListTradeSell",
                                                        "sessionStr": sessionStr
                                                    });
                                                    console.log(QbuyData);
                                                    homePageAjax(httpheader, QbuyData, QSellData);
                                                    function QSellData(data2) {
                                                        console.log(data2);
                                                        if (data2.retcode == 0) {
                                                            myToast("支付成功,请到个人中心-我的售出中查看");
                                                            setInterval(function () {
                                                                // window.location.href = "MyCenter.html";
                                                            }, 2000)
                                                        } else {
                                                            if (data2.retcode == -17401) {
                                                                loginOut();
                                                                window.sessionStorage.setItem("LOGINSTATE", "flase");
                                                                window.sessionStorage.setItem("LOGINSOURCE", 1);
                                                                window.location.href = "loginPage.html";
                                                            } else {
                                                                myToast(data2.msg);
                                                            }
                                                        }
                                                    }
                                                }
                                            });
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
                myToast(data.msg);
            }
        }
    }
} else if (BuyOrSell == 2) {   //购入摘牌（一键购入），查售出单，我要买   区分全款和分期，全款支付时提示总金额和手续费，分期支付时只提示首付款，在支付尾款时CIA提示尾款和手续费
    if (isStage == 0) {  //仅支持全款
        $("#pick_hang_titlePaymentMethod").html("全款");
        $("#paymentCheck").css("display", "none");  //隐藏付款方式选择
        $("#FQhint").css("display", "none");   //隐藏分期付款提示
        $("#sqfq").css("display", "none"); //隐藏首期付款金额字幕
        $("#fqfkje").css("display", "none");  //隐藏首期付款金额

        var BuyData = JSON.stringify({
            "ctype": "Web",
            "name": "queryOnekeyListOrder",
            "reqbody": {
                "bsFlag": "2",
                "commodityId": commodityId,
                "pageIndex": "1",
                "pageSize": "100",
                "price": purchasePrice,
                "quantity": purchaseQuantity,
                "status": "1",
                "validDate": validityDate
            },
            "sessionStr": sessionStr,
            "userid": userId
        });
        homePageAjax(httpheader, BuyData, BuySuccess);
        function BuySuccess(data) {
            console.log(data);
            if (data.retcode == 0) {
                //将符合条件的记录展示在页面中
                var retData = data.respbody.arrayList;
                var retDataLength = Number(retData.length) - 1;
                var BuyListWrap = $("#BuyListWrap");
                for (var i = retDataLength; i >= 0; i--) {
                    BuyListWrap.append('<li class="BuyListWrap_Details"><ul class="BuyListUlLi"><li>'
                        + '售出' + (i + 1)
                        + '</li><li>'
                        + retData[i].firmName
                        + '</li><li>'
                        + retData[i].listPrice
                        + '</li><li>'
                        + retData[i].quantity
                        + '</li><li><input type="checkbox" name="checkdAll" class="checkAll" checked="checked" accesskey="'
                        + retData[i].quantity
                        + '" value="'
                        + retData[i].listPrice
                        + '" title="'
                        + retData[i].orderID
                        +'"></li></ul></li>');
                }
                //计算数量，金额
                //计算数量
                var quantityReady = 0;
                var checkedAllReady = $(".checkAll");
                for (var l = 0; l < checkedAllReady.length; l++) {
                    quantityReady += Number(checkedAllReady[l].accessKey);
                }
                $("#zNumber").html(quantityReady);
                //计算总金额
                var priceReady = 0;
                for (var m = 0; m < checkedAllReady.length; m++) {
                    if (checkedAllReady[m].checked == true) {
                        console.log(Number(checkedAllReady[m].accessKey));
                        console.log(Number(checkedAllReady[m].value));
                        priceReady += (Number(checkedAllReady[m].accessKey)) * (Number(checkedAllReady[m].value));
                    }
                }
                $("#span1").html((priceReady).toFixed(2));
                //遍历所有的多选框，如果有一个没选中，则全选按钮不选
                var checkAll = $(".checkAll");
                for (var i = 0; i < checkAll.length; i++) {
                    checkAll[i].onchange = function () {
                        //如果当前checked为false，则全选checked的为false
                        if (this.checked == false) {
                            $("#checkAll").prop("checked", false);
                        }
                        //遍历所有的复选框，如果有一个checked为false，则全选的checked也为false
                        //计算数量
                        var quantity = 0;
                        for (var k = 0; k < checkAll.length; k++) {
                            if (checkAll[k].checked == true) {
                                quantity += Number(checkAll[k].accessKey);
                            }
                        }
                        $("#zNumber").html(quantity);
                        //计算总金额
                        var price = 0;
                        for (var m = 0; m < checkAll.length; m++) {
                            if (checkAll[m].checked == true) {
                                price += (Number(checkAll[m].accessKey)) * (Number(checkAll[m].value));
                            }
                        }
                        $("#span1").html(price);
                    }
                }
                //点击确认下单
                $("#pick_hang_footerbtn").click(function () {
                    if (loginStatus == null) {
                        loginOut();
                        window.sessionStorage.setItem("LOGINSTATE", "flase");
                        window.sessionStorage.setItem("LOGINSOURCE", 1);
                        window.location.href = "loginPage.html";
                    } else {
                        //判断是否选中商品
                        var chaestVal = "";
                        for (var x = 0; x < $(".checkAll").length; x++) {
                            if ($(".checkAll")[x].checked == true) {
                                chaestVal += $(".checkAll")[x].value;
                            }
                        }
                        if (chaestVal == "") {
                            myToast("请选择商品");
                            return false;
                        }
                        var listOrderIdList = [];
                        for(var d=0;d<$(".checkAll").length;d++){
                            if($(".checkAll")[d].checked == true){
                                console.log($(".checkAll")[d].title);
                                var listList = {};
                                listList.listOrderId = String($(".checkAll")[d].title);
                                listOrderIdList.push(listList);
                            }
                        }
                        console.log(listOrderIdList);
                        var addressDatailData = JSON.stringify({    //判断是否完善信息
                            "ctype": "Web",
                            "name": "queryAddr",
                            "reqbody": {},
                            "sessionStr": sessionStr,
                            "userid": userId
                        });
                        homePageAjax(httpheader, addressDatailData, addressDetailSuccess);

                        function addressDetailSuccess(data) {
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
                                } else {   //已完善信息，请求手续费  开始交易
                                    var totalAmount = $("#span1").html();  //根据总金额请求手续费
                                    var serviceChargeData = JSON.stringify({
                                        "ctype": "Web",
                                        "name": "queryfree",
                                        "reqbody": {
                                            "totalAmount": totalAmount,
                                            "expenseType": "101"
                                        },
                                        "sessionStr": sessionStr,
                                        "userid": userId
                                    });
                                    homePageAjax(httpheader, serviceChargeData, serviceChargeSuccess);
                                    function serviceChargeSuccess(data) {    //手续费请求成功
                                        if (data.retcode == 0) {
                                            var sxf = data.respbody.free;
                                            var money = $("#span1").html();
                                            var zMoney = (Number(money) + Number(sxf)).toFixed(2)
                                            var number = $("#zNumber").html();
                                            myConfirm({
                                                title: '提示',
                                                message: '是否确定下单?' + "<br>" + "总金额：" + zMoney + "<br>" + "一次性手续费：" + sxf,
                                                callback: function () {
                                                    var QbuyData = JSON.stringify({
                                                        "userid": userId,
                                                        "ctype": "Web",
                                                        "reqbody": {
                                                            "paidAmount": money,
                                                            "price": money,
                                                            "commodityName": commodityName,
                                                            "listOrderIdList": listOrderIdList,
                                                            "orderTotalAmount": money
                                                        },
                                                        "name": "onekeyListTradeBuy",
                                                        "sessionStr": sessionStr
                                                    });
                                                    console.log(QbuyData);
                                                    homePageAjax(httpheader, QbuyData, QSellData);
                                                    function QSellData(data2) {
                                                        console.log(data2);
                                                        if (data2.retcode == 0) {
                                                            myToast("支付成功,请到个人中心-我的购入中查看");
                                                            setInterval(function () {
                                                                window.location.href = "MyCenter.html";
                                                            }, 2000)
                                                        } else {
                                                            if (data2.retcode == -17401) {
                                                                loginOut();
                                                                window.sessionStorage.setItem("LOGINSTATE", "flase");
                                                                window.sessionStorage.setItem("LOGINSOURCE", 1);
                                                                window.location.href = "loginPage.html";
                                                            } else {
                                                                myToast(data2.msg);
                                                            }
                                                        }
                                                    }
                                                }
                                            });
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
                    myToast(data.msg);
                }
            }
        }
    } else if (isStage == 1) {   //支持分期
        $("#pick_hang_titlePaymentMethod").html("分期付款");
        $("#paymentCheck").css("display", "block");  //显示付款方式选择
        $("#FQhint").css("display", "block");   //显示分期付款提示
        var SellData = JSON.stringify({
            "ctype": "Web",
            "name": "queryOnekeyListOrder",
            "reqbody": {
                "bsFlag": "2",
                "commodityId": commodityId,
                "pageIndex": "1",
                "pageSize": "100",
                "price": purchasePrice,
                "quantity": purchaseQuantity,
                "status": "1",
                "validDate": validityDate
            },
            "sessionStr": sessionStr,
            "userid": userId
        });
        homePageAjax(httpheader, SellData, SellSuccess);
        function SellSuccess(data) {
            console.log(data);
            if (data.retcode == 0) {
                //将查询到的记录展示在页面中
                var retData = data.respbody.arrayList;
                var BuyListWrap = $("#BuyListWrap");
                for (var i = (retData.length - 1); i >= 0; i--) {
                    BuyListWrap.append('<li class="BuyListWrap_Details"><ul class="BuyListUlLi"><li>'
                        + '售出' + (i + 1)
                        + '</li><li>'
                        + retData[i].firmName
                        + '</li><li>'
                        + retData[i].listPrice
                        + '</li><li>'
                        + retData[i].quantity
                        + '</li><li><input type="checkbox" name="checkdAll" class="checkAll" checked="checked" accesskey="'
                        + retData[i].quantity
                        + '"value="'
                        + retData[i].listPrice
                        + '"></li></ul></li>');
                }
                //保存listOrderID
                var listOrderIdList = [];
                var orderIdList = data.respbody.arrayList;
                for (var d = 0; d < orderIdList.length; d++) {
                    var listList = {};
                    listList.listOrderId = String(orderIdList[d].orderID);
                    listOrderIdList.push(listList);
                }
                //计算数量，金额等
                var quantityReady = 0;    //计算数量
                var checkedAllReady = $(".checkAll");
                for (var l = 0; l < checkedAllReady.length; l++) {
                    quantityReady += Number(checkedAllReady[l].accessKey);
                }
                $("#zNumber").html(quantityReady);
                var priceReady = 0;    //计算总金额
                for (var m = 0; m < checkedAllReady.length; m++) {
                    if (checkedAllReady[m].checked == true) {
                        priceReady += (Number(checkedAllReady[m].accessKey)) * (Number(checkedAllReady[m].value));
                    }
                }
                $("#span1").html(priceReady);
                var sfPriceReadey = priceReady * listDepositRate;  //计算首付金额
                var FixNum = Math.floor(sfPriceReadey * 100) / 100;
                $("#fqfkje").html(FixNum);
                //单选框发生改变时，当前的复选框没有被选中则全选按钮不选，如果当前的复选框被选中，则遍历所有的复选框是否被选中，如果都被选中，则全选按钮被选中
                var checkAll = $(".checkAll");
                for(var i=0;i<checkAll.length;i++){
                    checkAll[i].onchange = function () {
                        console.log(this.checked);
                        //如果当前checked为false，则全选checked的为false
                        if (this.checked == false) {
                            $("#checkAll").prop("checked", false);
                        } else {
                            for (var i = 0; i < checkAll.length; i++) {
                                if (checkAll[i].checked == true) {
                                    $("#checkAll").attr("checked",true);
                                }
                            }
                        }
                        //计算数量
                        var quantity = 0;
                        for (var k = 0; k < checkAll.length; k++) {
                            if (checkAll[k].checked == true) {
                                quantity += Number(checkAll[k].accessKey);
                            }
                        }
                        $("#zNumber").html(quantity);
                        //计算总金额
                        var price = 0;
                        for (var m = 0; m < checkAll.length; m++) {
                            if (checkAll[m].checked == true) {
                                price += (Number(checkAll[m].accessKey)) * (Number(checkAll[m].value));
                            }
                        }
                        $("#span1").html((price).toFixed(2));
                        //计算首付金额
                        var sfPrice = price * listDepositRate;
                        var FixNum = Math.floor(sfPrice * 100) / 100;
                        $("#fqfkje").html(FixNum);
                    };
                }

                //当分期和全款付款方式发生改变时，改变首付金额（分期时首付金额 = 首付金额      全款时首付金额 = 全部商品金额）
                var inp = $(".inp");
                inp.onchange = function (ev) {
                    console.log(this.value);
                    if(this.value == "全款"){   //同时隐藏尾款支付提示
                        $("#fqfkje").html(FixNum);
                        $("#FQhint").css("display","none");
                    }else if (this.value == "分期付款"){   //分期付款改变首付金额的同时，尾款支付提示显示
                        $("#fqfkje").html(priceReady);
                        $("#FQhint").css("display","block");
                    }
                }

                //点击确认下单
                $("#pick_hang_footerbtn").click(function () {
                    if (loginStatus == null) {
                        loginOut();
                        window.sessionStorage.setItem("LOGINSTATE", "flase");
                        window.sessionStorage.setItem("LOGINSOURCE", 1);
                        window.location.href = "loginPage.html";
                    } else {
                            //判断是否选中商品
                            var chaestVal = "";
                            for (var x = 0; x < $(".checkAll").length; x++) {
                                if ($(".checkAll")[x].checked == true) {
                                    chaestVal += $(".checkAll")[x].value;
                                }
                            }
                            if (chaestVal == "") {
                                myToast("请选择商品");
                            } else {
                                //请求完善信息接口
                                var addressDatailData = JSON.stringify({    //判断是否完善信息
                                    "ctype": "Web",
                                    "name": "queryAddr",
                                    "reqbody": {},
                                    "sessionStr": sessionStr,
                                    "userid": userId
                                });
                                homePageAjax(httpheader, addressDatailData, addressDetailSuccess);
                                function addressDetailSuccess(data) {
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
                                            //根据总金额请求手续费
                                            var serviceChargeData = JSON.stringify({
                                                "ctype": "Web",
                                                "name": "queryfree",
                                                "reqbody": {
                                                    "totalAmount": $("#span1").html(),
                                                    "expenseType": "101"
                                                },
                                                "sessionStr": sessionStr,
                                                "userid": userId
                                            });
                                            homePageAjax(httpheader, serviceChargeData, serviceChargeSuccess);
                                            function serviceChargeSuccess(data) {
                                                console.log(data);
                                                if (data.retcode == 0) {
                                                    var sxf = data.respbody.free;
                                                    var money = $("#span1").html();
                                                    var zMoney = (Number(money) + Number(sxf)).toFixed(2);
                                                    for (var s = 0; s < $(".inp").length; s++) {
                                                        if ($(".inp")[s].checked == true) {
                                                            if ($(".inp")[s].value == "全款") {
                                                                myConfirm({
                                                                    title: '提示',
                                                                    message: '是否确定下单?' + "<br>" + "总金额：" + zMoney + "元" + "<br>" + "一次性手续费：" + sxf + "元",
                                                                    callback: function () {
                                                                        var QsellData = JSON.stringify({
                                                                            "userid": userId,
                                                                            "ctype": "Web",
                                                                            "reqbody": {
                                                                                "paidAmount": money,
                                                                                "price": money,
                                                                                "commodityName": commodityName,
                                                                                "listOrderIdList": listOrderIdList,
                                                                                "orderTotalAmount": $("#zNumber").html()
                                                                            },
                                                                            "name": "onekeyListTradeBuy",
                                                                            "sessionStr": sessionStr
                                                                        });
                                                                        homePageAjax(httpheader, QsellData, QsellSuccess);
                                                                        function QsellSuccess(data) {
                                                                            if (data.retcode == 0) {
                                                                                myToast("支付成功,请到个人中心-我的购入中查看");
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
                                                            } else if ($(".inp")[s].value == "分期付款") {
                                                                myConfirm({
                                                                    title: '提示',
                                                                    message: '是否确定下单?' + "<br>" + "首付金额：" + $("#fqfkje").html() + "元",
                                                                    callback: function () {
                                                                        var fsellData = JSON.stringify({
                                                                            "userid": userId,
                                                                            "ctype": "Web",
                                                                            "reqbody": {
                                                                                "paidAmount": $("#fqfkje").html(),
                                                                                "price": $("#span1").html(),
                                                                                "commodityName": commodityName,
                                                                                "listOrderIdList": listOrderIdList,
                                                                                "orderTotalAmount": $("#zNumber").html()
                                                                            },
                                                                            "name": "onekeyListTradeBuy",
                                                                            "sessionStr": sessionStr
                                                                        });
                                                                        homePageAjax(httpheader, fsellData, fsellSuccess);
                                                                        function fsellSuccess(data) {
                                                                            if (data.retcode == 0) {
                                                                                myToast("支付成功,请到个人中心-我的购入中查看");
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
                                    }
                                }
                            }
                        }
                })
            }
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