document.write("<script type='text/javascript' src='js/NetworkRequest.js'></script>");    //网络请求
document.write("<script type='text/javascript' src='js/MyAlert.js'></script>");
document.write("<script type='text/javascript' src='js/reclassify.js'></script>");   //一二级分类
document.write("<script type='text/javascript' src='js/loginInOrOut.js'></script>");
var httpheader = "http://119.90.97.146:18203/";
//商品ID，商品名称，商品单价，数量
var commID;
var commName;
var commPrice;
var commNumber;
var GivenCycle;   //赠送周期
var TomorrowGive;   //每次赠送
var GivingCombined;   //赠送合计
var balance;   //弹框中的可用余额

//蒙版的高度等于文档的高度
$("#maskLayer").css("height",$(document).height());

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
function showDiv() {
    document.getElementById('popWindow').style.display = 'block';
    document.getElementById('maskLayer').style.display = 'block';
}

function closeDiv() {
    document.getElementById('popWindow').style.display = 'none';
    document.getElementById('maskLayer').style.display = 'none';
}
function getMyDate(str){
    var oDate = new Date(str),
        oYear = oDate.getFullYear(),
        oMonth = oDate.getMonth()+1,
        oDay = oDate.getDate(),
        oHour = oDate.getHours(),
        oMin = oDate.getMinutes(),
        oSen = oDate.getSeconds(),
        oTime = oYear +'-'+ getzf(oMonth) +'-'+ getzf(oDay) +' '+ getzf(oHour) +':'+ getzf(oMin) +':'+getzf(oSen);//最后拼接时间
    return oTime;
};
//补0操作
function getzf(num){
    if(parseInt(num) < 10){
        num = '0'+num;
    }
    return num;
}
//    商品详情和销售记录tab切换
var DetailsSpans = $(".Details_Content_bottom_title span");
var DetailsDivs = $(".DetailsPages");
for (var i = 0; i < DetailsSpans.length; i++) {
    DetailsSpans[i].index = i;//将i赋给相应的button下标
    DetailsSpans[i].onclick = function () {
        for (var j = 0; j < DetailsSpans.length; j++) {
            DetailsSpans[j].className = '';
            DetailsDivs[j].style.display = "none";
        }
        this.className = 'spanStyle';
        DetailsDivs[this.index].style.display = "block";
    }
}
//从sess中取得sessStr
var sessionStr = window.sessionStorage.getItem("SESSIONSTR");
//从sess中取到uesrid
var userId = window.sessionStorage.getItem("USERID");
//从sess中取到frimid
var frimId = window.sessionStorage.getItem("FRIMID");
//从sess中取到促销商品id
var cx_commodiyId = window.sessionStorage.getItem("CX_COMMODITYID");
//从sess中取到登录状态
var loginState = window.sessionStorage.getItem("LOGINSTATE");
console.log(loginState);

//促销商品请求参数
var cx_commodiyData = JSON.stringify({
    "ctype": "Web",
    "name": "commodityDetail",
    "reqbody": {
        "commodityId": cx_commodiyId,
        "firmId": frimId,
    },
    "sessionStr": sessionStr,
    "userid": userId
});
homePageAjax(httpheader, cx_commodiyData, cx_commodiySuccess);
var collection = 0;
//转换时间
function toLocaleString() {

    var M = this.getMinutes();//获取

    M = M > 9 ? M : "0" + M; //如果分钟小于10,则在前面加0补充为两位数字
    return this.getFullYear() + "年" + (this.getMonth() + 1) + "月" + this.getDate() + "日 " + this.getHours() + "：" + M;
};
function cx_commodiySuccess(data) {
    // console.log(data);
    if (data.retcode == 0) {
        var retData = data.respbody;
        console.log(retData);
        //商品图片
        var imgList = retData.imgList;
        //将字符串转换为数组
        var newImgList = imgList.split(",");
        console.log(newImgList);
        var NewImageList = [];
        for(var j = 0;j<newImgList.length;j++){
            if(j > 0){
                newImgList[j] = "http://47.100.247.99/resources/" + newImgList[j];
                NewImageList.push(newImgList[j]);
            }else{
                NewImageList.push(newImgList[j]);
            }
        }
        console.log(NewImageList);
        for(var k=0;k<NewImageList.length;k++){
            $("#swiper-wrapper").append('<div class="swiper-slide" style="width: 100%;height: 100%;"><img src="'+ NewImageList[k] +'"  style="width: 100%;height: 100%"/></div>')
        }

        var swiper = new Swiper('.swiper-container', {
            pagination: {
                el: '.swiper-pagination',
                loop: true,
                autoplay: true,
            },
            speed:300,
            autoplay : {
                delay:3000
            }
        });
        //商品名称
        $("#commodityName").html(retData.name);
        commName = retData.name;
        //商品ID
        $("#commodityID").html(retData.commodityCode);
        commID = retData.commodityId;
        //库存
        if (retData.quantity == null) {
            $("#BasicPrice").html("--");
        } else {
            $("#BasicPrice").html(retData.quantity);
        }
        //销售总量
        if (retData.sales == null) {
            $("#market_gross").html("--");
        } else {
            $("#market_gross").html(retData.sales);
        }
        //销售总额
        if (retData.vol == null) {
            $("#market_rental").html("--");
        } else {
            $("#market_rental").html(retData.vol);
        }
        //赠送周期
        GivenCycle = (retData.rebateCycle).toFixed(2);
        console.log(GivenCycle);
        //每次赠送
        TomorrowGive = (retData.rebate).toFixed(2);
        console.log(TomorrowGive);
        // //赠送合计
        // GivingCombined
        //商品价格
        $("#purchase_price").html(retData.price + "元");
        commPrice = retData.price;

        //判断商品是否收藏
        collection = retData.collection;
        if (collection == 1) {
            //已收藏
            $("#collect").css("background", "url(img/solid.png) no-repeat left");
        } else if (collection == 0) {
            //未收藏
            $("#collect").css("background", "url(img/hollow.png) no-repeat left");
        }

        //商品详情
        $("#introduceName").html("商品全称：" + retData.name);   //商品全称
        $("#introduceCode").html("商品代码：" + retData.commodityCode);   //商品代码
        if(retData.isReturn == 1){  //可退换货
            retData.isReturn = "是";
        }else if(retData.isReturn == 0){    //不可退换货
            retData.isReturn = "否";
        }
        $("#introduceRefunding").html("是否可退换货：" + retData.isReturn);    //是否可退换货
        $("#introducedescribe").html("商品描述：" + retData.summary);    //商品描述

        //左侧销售记录只需要5条
        var tradeList = retData.tradeList;
        console.log(tradeList);
        var DetailsPagesLeft_content = document.getElementById("DetailsPagesLeft_content");
        if (tradeList.length == 0) {
            DetailsPagesLeft_content.innerHTML = "暂无数据";
            DetailsPagesLeft_content.style.fontSize = "20px";
            DetailsPagesLeft_content.style.textAlign = "center";
            DetailsPagesLeft_content.style.lineHeight = "166px";
        } else {
            for (var i = 0; i < 5; i++) {
                console.log(tradeList[i]);
                if(tradeList[i] == undefined){
                    $("#DetailsPagesLeft_content").append();
                }else{
                    $("#DetailsPagesLeft_content").append('<div class="divWrapStyle"><span class="dovWrapSpanStyle">'
                        + getMyDate(tradeList[i].tradeTime)
                        + '</span><span class="dovWrapSpanStyle">'
                        + tradeList[i].buyName
                        + '</span><span class="dovWrapSpanStyle">'
                        + tradeList[i].quantity
                        +'</span></div>');
                }
            }
        }
        //销售记录右边，只需要5条记录
        var DetailsPagesRight_content = document.getElementById("DetailsPagesRight_content");
        console.log(tradeList.length);
        if (tradeList.length < 5) {
            DetailsPagesRight_content.innerHTML = "暂无数据";
            DetailsPagesRight_content.style.fontSize = "20px";
            DetailsPagesRight_content.style.textAlign = "center";
            DetailsPagesRight_content.style.lineHeight = "166px";
        } else {
            for (var i = 5; i < 10; i++) {
                console.log(tradeList[i]);
                $("#DetailsPagesRight_content").append('<div class="divWrapStyle"><span class="dovWrapSpanStyle">'
                    + getMyDate(tradeList[i].tradeTime)
                    + '</span><span class="dovWrapSpanStyle">'
                    + tradeList[i].buyName
                    + '</span><span class="dovWrapSpanStyle">' +
                    + tradeList[i].quantity
                    + '</span></div>');
            }
        }
    } else {
        if(data.retcode == -17401){
            loginOut();
            window.sessionStorage.setItem("LOGINSTATE", "flase");
            window.sessionStorage.setItem("LOGINSOURCE", 1);
            // window.location.href = "loginPage.html";
        }else{
            myToast(data.msg);
        }
    }
}
//可用资金
var balanceData = JSON.stringify({
    "name": "queryFirmFunds",
    "ctype": "Web",
    "sessionStr": sessionStr,
    "userid": userId,
    "reqbody": {
        "userid": userId
    }
});
homePageAjax(httpheader, balanceData, balanceSuccess);

function balanceSuccess(data) {
    console.log(data);
    if (data.retcode == 0) {
        var balanRetData = data.respbody;
        balance = balanRetData.balance;
        if (balanRetData.balance == null) {
            $("#purchase_expendable").html("--");
        } else {
            $("#purchase_expendable").html(balanRetData.balance);
        }
    } else {
        if(data.retcode == -17401){
            loginOut();
            window.sessionStorage.setItem("LOGINSTATE", "flase");
            window.sessionStorage.setItem("LOGINSOURCE", 1);
        }else{
            myToast(data.msg);
        }

    }
}

//判断src为空心则发起添加收藏，如果为实心则发起取消收藏
$("#collect").on("click", function () {
    //点击收藏时先判断登录状态
    var loginstate = window.sessionStorage.getItem("LOGINSTATE");
    if (loginstate == "true") {
        if (collection == 0) {
            //添加收藏
            var AddCollectionData = JSON.stringify({
                "name": "addCollection",
                "ctype": "Web",
                "sessionStr": sessionStr,
                "userid": userId,
                "reqbody": {
                    "commodityId": cx_commodiyId //商品ID
                }
            });
            //发起收藏请求
            homePageAjax(httpheader, AddCollectionData, AddCollectionSuccess);

            //请求收藏成功函数
            function AddCollectionSuccess(data) {
                var retData = data.retcode;
                if (retData == 0) {
                    $(".collect").css("background", "url(img/solid.png) no-repeat left");
                    $("#collectp").html("取消收藏");
                    myToast('收藏成功');
                    collection = 1;
                } else {
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
        } else {

            var DelCollectionData = JSON.stringify({
                "reqbody": {
                    "commodityId": cx_commodiyId
                },
                "sessionStr": sessionStr,
                "userid": userId,
                "name": "deleteCollection",
                "ctype": "Web"
            });
            homePageAjax(httpheader, DelCollectionData, DelCollectionSuccess);

            function DelCollectionSuccess(data) {
                var retData = data.retcode;
                if (retData == 0) {
                    $(".collect").css("background", "url(img/hollow.png) no-repeat left");
                    $("#collectp").html("收藏");
                    myToast('取消收藏成功');
                    collection = 0;
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
        }
    } else {
        window.sessionStorage.setItem("LOGINSOURCE",1);
        window.location.href = "loginPage.html";
    }
});
//点击购入先检测是否登录是否输入商品数量，再弹框
$("#purchase_purchase_btn").click(function(){
    if(loginState == false){
        window.sessionStorage.setItem("LOGINSOURCE",1);
        window.location.href = "loginPage.html";
    }else if(loginState == "true"){   //判断用户是否登录
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
        }
        function deal() {
            if($("#purchase_quantity_inp").val() == ""){
                myToast("请输入购买商品数量");
                return false;
            }
            //弹框中的内容
            $("#unitPrice").html("商品单价：" + commPrice + "元");   //商品单价
            $("#GivenCycle").html("赠送周期：" + GivenCycle + "天");      //赠送周期
            $("#TomorrowGive").html("每次赠送：" + ((Number(TomorrowGive)*Number($("#purchase_quantity_inp").val()))).toFixed(2) + "元");    //每次赠送    明日赠送的价格*购买数量
            $("#GivingCombined").html("赠送合计：" + ((Number(GivenCycle)*(Number(TomorrowGive)*Number($("#purchase_quantity_inp").val())))).toFixed(2) + "元");   //赠送合计
            $("#purchaseQuantity").html("购买数量：" + $("#purchase_quantity_inp").val() + "个");    //购买数量
            $("#amountTotal").html("合计金额：" + (Number(commPrice)*Number($("#purchase_quantity_inp").val())) + "元");     //合计金额
            $("#maskingBalance").html("账户余额：" + balance +  "元");
            showDiv();
        }
    }else{
        window.location.href = "loginPage.html";
    }
});
//点击确认付款发起购入单
$("#confirmPayment").click(function () {
    //收货地址
    var address;
    var addressDatailData = JSON.stringify({
        "ctype":"Web",
        "name":"queryAddr",
        "reqbody":{

        },
        "sessionStr":sessionStr,
        "userid":userId
    });
    homePageAjax(httpheader,addressDatailData,addressDetailSuccess);
    function addressDetailSuccess(data) {
        console.log(data);
        if(data.retcode == 0) {
            var retData = data.respbody.list;
            if (retData.length == 0) {
                myAlert({
                    title: '提示',
                    message: '请先到个人中心-完善信息页面完善信息',
                    callback: function () {
                            window.location.href = "MyCenter.html";
                    }
                })
                return false;
            }else{
                var purchase_quantity_inp = $("#purchase_quantity_inp").val();
                var cxplaceOrderData = JSON.stringify({
                    "ctype": "Web",
                    "name": "rebateBuy",
                    "reqbody": {
                        "addrId": 1,    //收货地址
                        "freight": 0,   //运费
                        "invoiceFlag": 0,  //是否开发票0开1不开
                        "list": [{
                            "commodityId": commID,  //商品id
                            "commodityName": commName,   //商品名称
                            "price": commPrice,    //商品单价
                            "quantity": purchase_quantity_inp   //数量
                        }],
                        "totalCost": Number(commPrice) * Number(purchase_quantity_inp),   // 总价
                    },
                    "sessionStr": sessionStr,
                    "userid": userId
                })
                homePageAjax(httpheader, cxplaceOrderData, cxplaceOrderSuccess);
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
//返利商品下单成功函数
function cxplaceOrderSuccess(data) {
    console.log(data);
    if (data.retcode == 0) {
        var retData = data.respbody;
        // console.log(retData);
        //下单成功后判断用户选择的是余额支付还是网银支付
        var obj = $(".inp");
        for(var i=0;i<obj.length;i++){
            if(obj[i].checked){
                if(obj[i].value == 0){    //0账户余额1网银支付
                    console.log(obj[i].value);
                    //发起支付单
                    var orderId = retData.orderId;
                    var orderMoney = retData.orderCost;
                    var payOrderId = retData.payId;
                    var balancePaymentData = JSON.stringify({
                        "ctype": "Web",
                        "name": "rebateBalancePay",
                        "reqbody": {
                            "orderId": orderId,
                            "orderMoney": orderMoney,
                            "payOrderId": payOrderId
                        },
                        "sessionStr": sessionStr,
                        "userid": userId
                    });
                    homePageAjax(httpheader, balancePaymentData, balancePaymentSuccess);
                    function balancePaymentSuccess(data) {
                        console.log(data);
                        console.log(data.msg);
                        if(data.retcode == 0){
                            closeDiv();   //取消弹框后弹出支付成功
                            // myToast(data.msg);
                            myAlert({
                                title:"提示",
                                message:"支付成功，请到个人中心我的促销商品中查看",
                                callback:function(){
                                    window.location.href = "MyCenter.html"
                                }
                            })
                            //发起支付成功之后发起刷新页面销售总量，总额，库存等数据
                            //先清空成交记录
                            $("#DetailsPagesLeft_content").empty();
                            $("#DetailsPagesRight_content").empty();
                            homePageAjax(httpheader, cx_commodiyData, cx_commodiySuccess);
                            //发起支付成功之后发起刷新余额接口
                            //刷新余额
                            var balanceData2 = JSON.stringify({
                                "name": "queryFirmFunds",
                                "ctype": "Web",
                                "sessionStr": sessionStr,
                                "userid": userId,
                                "reqbody": {
                                    "userid": userId
                                }
                            });
                            homePageAjax(httpheader, balanceData2, function (data) {
                                console.log(data);
                                if(data.retcode == 0){
                                    var balanRetData2 = data.respbody;
                                    if (balanRetData2.balance == null) {
                                        $("#purchase_expendable").html("--");
                                    } else {
                                        $("#purchase_expendable").html(balanRetData2.balance);
                                    }
                                }else{
                                    console.log(data.msg);
                                    if(data.retcode == -17401){
                                        loginOut();
                                        window.sessionStorage.setItem("LOGINSTATE", "flase");
                                        window.sessionStorage.setItem("LOGINSOURCE", 1);
                                        window.location.href = "loginPage.html";
                                    }else{
                                        myToast(data.msg);
                                    }
                                }
                            });
                        }else{
                            if(data.retcode == -17401){
                                loginOut();
                                window.sessionStorage.setItem("LOGINSTATE", "flase");
                                window.sessionStorage.setItem("LOGINSOURCE", 1);
                                window.location.href = "loginPage.html";
                            }else{
                                console.log(data.msg);
                                myToast(data.msg);
                            }
                        }

                    }
                }else if(obj[i].value == 1){
                    console.log(obj[i].value);
                    var noCardPay = data.respbody.urlList.noCardPay;
                    window.location.href = noCardPay;
                }
            }
        }
    } else {
        console.log(data.msg);
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


//点击搜索按钮发起商品搜索
$("#search_inpTwo").on("click", function () {
    //讲输入的内容存储在sess中一并传递
    window.sessionStorage.setItem("SEARCH", $("#search_inpOne").val());
    window.location.href = "searchPage.html";
});
$(document).keyup(function(event){
    if(event.keyCode ==13){
        window.sessionStorage.setItem("SEARCH", $("#search_inpOne").val());
        window.location.href = "searchPage.html";
    }
});