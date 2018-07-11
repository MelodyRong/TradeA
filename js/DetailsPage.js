document.write("<script type='text/javascript' src='js/MyAlert.js'></script>");   //弹框
document.write("<script type='text/javascript' src='js/loginInOrOut.js'></script>");    //判断是否登录
document.write("<script type='text/javascript' src='js/reclassify.js'></script>");   //一二级分类
document.write("<script type='text/javascript' src='js/NetworkRequest.js'></script>");    //网络请求
document.write("<script src='js/swiper-4.3.3.min.js'></script>");
// var httpheader = "http://119.90.97.146:18203/";
$(function () {
    //ajax公用函数
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
    //从sess里获取sessionStr
    var sessionStr = window.sessionStorage.getItem("SESSIONSTR");
    //从sess中获取userid
    var userId = window.sessionStorage.getItem("USERID");
    //从sess中获取frimid
    var frimId = window.sessionStorage.getItem("FRIMID");
    //从sess中获取商品id
    var commodityId = window.sessionStorage.getItem("COMMODITYID");
    //获取登录状态
    var loginState = window.sessionStorage.getItem("LOGINSTATE");
    //首期比例
    var listDepositRate;
    //可用数量
    var availableQuantity;
    //可用余额接口
    var BalanceData = JSON.stringify({
        "name": "queryFirmFunds",
        "ctype": "Web",
        "sessionStr": sessionStr,
        "userid": userId,
        "reqbody": {
            "userid": userId
        }
    });
    homePageAjax(httpheader, BalanceData, BalanceSuccess);

    function BalanceSuccess(data) {
        if(data.retcode == 0){
            var retData = data.respbody;
            console.log(retData);
            //可用资金
            $("#dealRight_left_KYZJ_span02").html(retData.balance);
        }else{
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
    //请求商品详情参数
    var commodityDetailsData = JSON.stringify({
        "ctype": "Web",
        "name": "commodityDetail",
        "reqbody": {
            "commodityId": commodityId,
            "firmId": frimId,
        },
        "sessionStr": sessionStr,
        "userid": userId
    });
    homePageAjax(httpheader, commodityDetailsData, commodityDetailsSuccess);
    //请求商品详情信息成功函数
    var collection = 0;   //收藏初始值
    function commodityDetailsSuccess(data) {
        if(data.retcode == 0) {
            console.log(data);
            var retData = data.respbody;
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
                $("#swiper-wrapper").append('<div class="swiper-slide" style="width: 100%;height: 100%;"><img src="'
                    + NewImageList[k]
                    +'"  style="width: 100%;height: 100%"/></div>')
            }

            var swiper = new Swiper('.swiper-container', {
                speed:300,
                autoplay : {
                    delay:3000
                }
            });

            //商品名称
            $("#commodityName").html(retData.name);
            //商品ID
            $("#commodityID").html(retData.commodityCode);
            //可用数量
            $("#balance02").html(retData.holdQty);
            availableQuantity = retData.holdQty;
            // 基础价
            if (retData.oriPrice == null) {
                $("#basicPrice").html("--");
            } else {
                $("#basicPrice").html(retData.oriPrice);
            }
            //最新价
            $("#newPrice").html("最新价：" + retData.price);

            // 升值幅度
            if (retData.increase == null) {
                $("#appreciation").html("--");
            } else {
                $("#appreciation").html(retData.increase + "%");
            }
            // 最高额
            if (retData.highPrice == null) {
                $("#maximumAmount").html("--");
            } else {
                $("#maximumAmount").html(retData.highPrice);
            }
            // 最低额
            if (retData.lowPrice == null) {
                $("#minimumPrice").html("--");
            } else {
                $("#minimumPrice").html(retData.lowPrice);
            }
            // 销售总量
            if (retData.sales == null) {
                $("#totalSalesVolume").html("--");
            } else {
                $("#totalSalesVolume").html(retData.sales);
            }
            // 销售总额
            if (retData.vol == null) {
                $("#totalSales").html("--");
            } else {
                $("#totalSales").html(retData.vol);
            }
            //首期比例
            listDepositRate = retData.listDepositRate;
            console.log(listDepositRate);
            //判断商品是否收藏
            // console.log(retData.collection);
            collection = retData.collection;
            if (collection == 1) {
                //已收藏
                $("#collect").css("backgroundImage", "url(img/solid.png)");
            } else if (collection == 0) {
                //未收藏
                $("#collect").css("backgroundImage", "url(img/hollow.png)");
            }

            //商品名称  retData.name
            window.sessionStorage.setItem("PRODUCTNAME", retData.name);
            //该商品是否支持分期   retData.isStage
            window.sessionStorage.setItem("ISSTAGE", retData.isStage);       //0全款1分期
            //渲染摘购和摘售表

            var ListArrX = retData.sellList;    //摘售
            if (ListArrX.length == 0) {
                var Detils_Content_listRight_contentX = document.getElementById("Detils_Content_listRight_contentC");
                Detils_Content_listRight_contentX.innerHTML = "暂无数据";
                Detils_Content_listRight_contentX.style.fontSize = "20px";
                Detils_Content_listRight_contentX.style.textAlign = "center";
                Detils_Content_listRight_contentX.style.lineHeight = "166px";
            } else {
                //商品名称  retData.name
                //该商品是否支持分期   retData.isStage   //0全款1分期
                //摘售还是摘购  ListArrX.bsFlag
                //商品ID   ListArr.commodityId
                //购买人姓名  ListArrX.firmName
                //单价  ListArrX.listPrice
                //数量 ListArrX.quantity
                //首期比例 retData.listDepositRate
                //orderId ListArrX.orderID
                //该商品是否持仓 ListArrX.status
                var sellListLenght = ListArrX.length;
                for (var i = (sellListLenght - 1); i >= 0; i--) {
                    var divWrap = document.createElement("div");
                    divWrap.className = "divWrapStyle" + " " + "sc";
                    divWrap.accessKey = ListArrX[i].firmName;  //购买人姓名
                    document.getElementById("Detils_Content_listRight_contentC").appendChild(divWrap);
                    divWrap.innerHTML = '<span class="dovWrapSpanStyle">'
                        + '售出' + (i + 1)
                        + '</span><span class="dovWrapSpanStyle" accesskey="'
                        + ListArrX[i].bsFlag   //摘售、摘购
                        + '" title="'
                        + ListArrX[i].firmName
                        +'" style="overflow: hidden;">'
                        + ListArrX[i].firmName       //购买人姓名
                        + '</span><span class="dovWrapSpanStyle" accesskey="'
                        + ListArrX[i].commodityId   //商品id
                        + '">'
                        + ListArrX[i].listPrice   //商品单价
                        + '</span><span class="dovWrapSpanStyle" accesskey="'
                        + retData.listDepositRate   //首期比例
                        + '">'
                        + ListArrX[i].quantity   //数量
                        + '</span><span class="dovWrapSpanStyle" accesskey="'
                        + ListArrX[i].status    //该商品是否有库存
                        + '"><button class="spanS" accesskey="'
                        + ListArrX[i].orderID   //orderId
                        + '">'
                        + "摘"
                        + '</button></span>';
                }
            }
            var ListArrC = retData.buyList;   //摘购
            if (ListArrC.length == 0) {
                var Detils_Content_listRight_contentC = document.getElementById("Detils_Content_listRight_contentX");
                Detils_Content_listRight_contentC.innerHTML = "暂无数据";
                Detils_Content_listRight_contentC.style.fontSize = "20px";
                Detils_Content_listRight_contentC.style.textAlign = "center";
                Detils_Content_listRight_contentC.style.lineHeight = "166px";
            } else {
                for (var c = 0; c < ListArrC.length; c++) {
                    var divWrap = document.createElement("div");
                    divWrap.className = "divWrapStyle" + " " + "cg";
                    divWrap.accessKey = ListArrC[c].firmName;  //购买人姓名
                    document.getElementById("Detils_Content_listRight_contentX").appendChild(divWrap);
                    divWrap.innerHTML = '<span class="dovWrapSpanStyle">'
                        + '采购' + (c + 1)
                        + '</span><span class="dovWrapSpanStyle" accesskey="'
                        + ListArrC[c].bsFlag   //摘售、摘购
                        + '" title="'
                        + ListArrC[c].firmName
                        +'" style="overflow: hidden;">'
                        + ListArrC[c].firmName     //购买人姓名
                        + '</span><span class="dovWrapSpanStyle" accesskey="'
                        + ListArrC[c].commodityId   //商品id
                        + '">'
                        + ListArrC[c].listPrice   //商品单价
                        + '</span><span class="dovWrapSpanStyle" accesskey="'
                        + retData.listDepositRate   //首期比例
                        + '">'
                        + ListArrC[c].quantity   //数量
                        + '</span><span class="dovWrapSpanStyle" accesskey="'
                        + ListArrC[c].status    //该商品是否有库存
                        + '"><button class="spanS" accesskey="'
                        + ListArrC[c].orderID   //orderId
                        + '">'
                        + "摘"
                        + '</button></span>';
                }
            }
            //通过摘按钮进入setOut页面
            $(".spanS").click(function () {
                var that = this;
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
                    //商品名称  retData.name
                    //window.sessionStorage.setItem("PRODUCTNAME",retData.name);
                    //摘售还是摘购  ListArrX.bsFlag
                    //商品ID   ListArr.commodityId
                    //购买人姓名  ListArrX.firmName
                    //单价  ListArrX.listPrice
                    //数量 ListArrX.quantity
                    //首期比例 retData.listDepositRate
                    //orderId ListArrX.orderID
                    //该商品是否支持分期   retData.isStage
                    //该商品是否持仓 ListArrX.status

                    var thisWrap = that.parentNode;    //按钮父元素
                    var divWrap = thisWrap.parentNode;   //按钮父元素的父元素divWrap
                    var BuyerName = divWrap.accessKey;    //购买人的姓名  父元素的父元素的accessKey
                    console.log(BuyerName);
                    window.sessionStorage.setItem("BUYSNAME", BuyerName);   //购买人名称存到sess中
                    var thisWrapsss = thisWrap.previousSibling.previousSibling.previousSibling; //摘售还是摘购   父元素上上上元素的accessKey
                    var bsFlag = thisWrapsss.accessKey;
                    console.log(bsFlag);
                    window.sessionStorage.setItem("BSFLAG", bsFlag);  //bsFlag摘售还是摘购存到sess中
                    var thisWrapss = thisWrap.previousSibling.previousSibling;    //商品ID   父元素的上上元素的accessKey
                    var commodityId = thisWrapss.accessKey;
                    console.log(commodityId);
                    window.sessionStorage.setItem("COMMODITYID", commodityId);    //将商品ID存到sess中
                    var unitPrice = thisWrapss.innerHTML;      //  商品单价   父元素的上上的值
                    console.log(unitPrice);
                    window.sessionStorage.setItem("UNITPRICE", unitPrice);    //将商品单价存到sess中
                    var thisWraps = thisWrap.previousSibling;   //数量，父元素的上的值
                    var quantity = thisWraps.innerHTML;
                    console.log(quantity);
                    window.sessionStorage.setItem("QUANTITY", quantity);    //将数量存入sess中
                    var listDepositRate = thisWraps.accessKey;     //父元素的上的accessKey
                    console.log(listDepositRate);
                    window.sessionStorage.setItem("LISTDEPOSITRATE", listDepositRate);    //将首期比例存入sess中
                    var status = thisWrap.accessKey;    //是否有持仓   父元素的accessKey
                    console.log(thisWrap);
                    console.log(status);
                    window.sessionStorage.setItem("STATUS", status);     //将是否有持仓的存入sess中
                    var orderId = that.accessKey;     //orderId   自己的accessKey
                    console.log(orderId);
                    window.sessionStorage.setItem("ORDERID", orderId);
                    var zPrice = (unitPrice) * (quantity);     //总金额  价格*数量
                    console.log(zPrice);
                    window.sessionStorage.setItem("ZBUYPRICE", zPrice);

                    //先判断是否登录
                    if (loginState == false) {
                        window.sessionStorage.setItem("LOGINSOURCE",1);
                        window.location.href = "loginPage.html";
                    }else if (bsFlag == "1") {     //bsFlag是1摘买单要卖此时查询是否有库存queryHoldCommodity
                        console.log(bsFlag);
                        var condition_storageData = JSON.stringify({    //品相和所属仓库接口
                            "name": "queryCommodityStorage",
                            "ctype": "Web",
                            "reqbody": {
                                "commodityId": commodityId
                            }
                        });
                        homePageAjax(httpheader, condition_storageData, condition_storageSuccess);
                        function condition_storageSuccess(data) {
                            if (data.retcode == 0) {
                                var retData = data.respbody;
                                var conditionID = retData.condition;
                                var storageName = retData.storageList[0].storageName;
                                var storageId = retData.storageList[0].storageID;

                                var inventoryData = JSON.stringify({    //查询库存
                                    "sessionStr": sessionStr,
                                    "reqbody": {
                                        "commodityId": commodityId,
                                        "conditionId": conditionID,
                                        "strategyId": storageId
                                    },
                                    "userid": userId,
                                    "name": "queryInventory",
                                    "ctype": "Web"
                                });
                                homePageAjax(httpheader, inventoryData, inventorySuccess);

                                function inventorySuccess(data) {
                                    if (data.retcode == 0) {
                                        var retData = data.respbody.holdQty;
                                        if (retData == 0) {
                                            myToast("该商品没有持仓数量");
                                            return false;
                                        } else if (retData < quantity) {
                                            myToast("该商品持仓数量不足");
                                            return false;
                                        } else if (retData >= quantity) {
                                            window.location.href = "setOutPage.html";
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
                    } else if (bsFlag == "2") {
                        //bsFlag是2摘卖单要买此时跳转到交易页
                        window.location.href = "setOutPage.html";
                    }
                }
            });

            //渲染商品详情
            $("#introduceName").html("商品全称：" + retData.name);   //商品全称
            $("#introduceCode").html("商品代码：" + retData.commodityCode);   //商品代码
            if(retData.isReturn == 1){  //可退换货
                retData.isReturn = "是";
            }else if(retData.isReturn == 0){    //不可退换货
                retData.isReturn = "否";
            }
            $("#introduceRefunding").html("是否可退换货：" + retData.isReturn);    //是否可退换货
            $("#introducedescribe").html("商品描述：" + retData.summary);    //商品描述


            //渲染销售记录
            //左侧销售记录只需要5条
            var tradeList = retData.tradeList;
            // console.log(tradeList);
            var newtradeListLeft = [];
            for (var i = 0; i < tradeList.length; i++) {
                if (i > 4) {
                    return;
                } else {
                    newtradeListLeft.push(tradeList[i]);
                }
            }
            function toLocaleString() {
                var M = this.getMinutes();//获取
                M = M > 9 ? M : "0" + M; //如果分钟小于10,则在前面加0补充为两位数字
                return this.getFullYear() + "年" + (this.getMonth() + 1) + "月" + this.getDate() + "日 " + this.getHours() + "：" + M;
            };
            if (tradeList.length == 0) {
                var DetailsPagesLeft_content = document.getElementById("DetailsPagesLeft_content");
                DetailsPagesLeft_content.innerHTML = "暂无数据";
                DetailsPagesLeft_content.style.fontSize = "20px";
                DetailsPagesLeft_content.style.textAlign = "center";
                DetailsPagesLeft_content.style.lineHeight = "166px";
            } else {
                //将后台返回的毫秒值换算成时间
                for (var i = 0; i < newtradeListLeft.length; i++) {
                    var ttime = new Date(tradeList[i].tradeTime).toLocaleString().replace(/:\d{1,2}$/, ' ');
                    // console.log(ttime);

                    var divWrap = document.createElement("div");
                    divWrap.className = "divWrapStyle";
                    document.getElementById("DetailsPagesLeft_content").appendChild(divWrap);
                    if(tradeList[i].buySell == 1){
                        tradeList[i].buySell = "购入";
                    }else if(tradeList[i].buySell == 2){
                        tradeList[i].buySell = "售出";
                    }
                    divWrap.innerHTML = '<span class="dovWrapSpanStyle">' + ttime + '</span><span class="dovWrapSpanStyle">' + tradeList[i].buySell + '</span><span class="dovWrapSpanStyle">' + tradeList[i].quantity + '</span>';
                }
            }
            //销售记录右边，只需要5条记录
            var newtradeListRight = [];
            for (var i = 5; i < newtradeListRight.length; i++) {
                if (i > 10) {
                    return;
                } else {
                    newtradeListRight.push(tradeList[i]);
                }
            }
            // console.log(newtradeListRight);
            if (newtradeListRight.length == 0) {
                var DetailsPagesRight_content = document.getElementById("DetailsPagesRight_content");
                DetailsPagesRight_content.innerHTML = "暂无数据";
                DetailsPagesRight_content.style.fontSize = "20px";
                DetailsPagesRight_content.style.textAlign = "center";
                DetailsPagesRight_content.style.lineHeight = "166px";
            } else {

                for (var i = 0; i < newtradeListRight.length; i++) {
                    var ttime = new Date(tradeList[i].tradeTime).toLocaleString().replace(/:\d{1,2}$/, ' ');
                    var divWrap = document.createElement("div");
                    divWrap.className = "divWrapStyle";
                    document.getElementById("DetailsPagesRight_content").appendChild(divWrap);
                    divWrap.innerHTML = '<span class="dovWrapSpanStyle">' + ttime + '</span><span class="dovWrapSpanStyle">' + newtradeListRight[i].price + '</span><span class="dovWrapSpanStyle">' + newtradeListRight[i].quantity + '</span>';
                }
            }
            //    发起购入单
            $("#dealRight_left_LJCG_btng").on("click", function () {
                var that = this;
                //先判断用户是否登录
                if (loginState == false) {
                    window.sessionStorage.setItem("LOGINSOURCE",1);
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
                        //先判断status的值是否为1
                        if (retData.status == 1) {
                            //获取用户输入的价格
                            var price = $("#price").val();
                            // 判断价格数量不能为空
                            if (price == "") {
                                myToast("请填写商品价格");
                                return false;
                            }
                            //获取用户输入的数量
                            var quantity = $("#number").val();
                            if (quantity == "") {
                                myToast('请填写商品数量');
                                return false;
                            }
                            //获取时间
                            var buyDate = $("#dealRight_left_YQInp_inp_g").val();
                            if (buyDate == "") {
                                myToast('请选择时间');
                                return false;
                            }
                            var purchaseData = JSON.stringify({      //获取是否有符合查询有关的消息
                                "ctype": "Web",
                                "name": "queryOnekeyListOrder",
                                "reqbody": {
                                    "bsFlag": "2",
                                    "commodityId": commodityId,
                                    "pageIndex": "1",
                                    "pageSize": "100",
                                    "price": price,
                                    "quantity": quantity,
                                    "status": "1",
                                    "validDate": buyDate
                                },
                                "sessionStr": sessionStr,
                                "userid": userId
                            });
                            homePageAjax(httpheader, purchaseData, purchaseSuccess);
                            function purchaseSuccess(data) {
                                if (data.retcode == 0) {
                                    console.log(data);
                                    var retData01 = data.respbody.arrayList;
                                    if (retData01.length == "0") {
                                        myToast("没有符合条件的商品");
                                    } else {
                                        //如果有符合条件的商品，将商品名称，商品ID，是否分期，用户输入的购入价，购入数量，有效期，首期付款金额，用户点击的是购入还是售出，等参数传递到购入页
                                        //PRODUCTNAME   商品名称
                                        //COMMODITYID   商品ID
                                        //ISSTAGE       该商品是否支持分期  0全款 1分期
                                        //首期比例    单价*数量*比例
                                        window.sessionStorage.setItem("LISTDEPOSITIRATE", listDepositRate);   //首期比例
                                        window.sessionStorage.setItem("PURCHASEPRICE", price);        //购入价
                                        window.sessionStorage.setItem("PURCHASEQUANTITY", quantity);   //购入数量
                                        window.sessionStorage.setItem("PURCHASEBUYDATE", buyDate);    //有效期
                                        window.sessionStorage.setItem("BUYSELL", that.accessKey);    //用户点击的购入还是售出     购入2 售出1
                                        window.location.href = "ADelistingPage.html";
                                    }
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
                            myToast('此商品暂时不能进行交易');
                        }
                    }
                }
            });
            //    发起售出单
            $("#dealRight_left_LJCG_btns").on("click", function () {
                var that = this;
                //先判断用户是否登录
                if (loginState == false) {
                    window.sessionStorage.setItem("LOGINSOURCE",1);
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
                    function deal(){
                        //先判断status的值是否为1
                        if (retData.status == 1) {
                            //获取用户输入的价格
                            var price = $("#g_price").val();
                            // 判断价格数量不能为空
                            if (price == "") {
                                myToast('请填写商品价格');
                                return false;
                            }
                            //获取用户输入的数量
                            var quantity = $("#g_number").val();
                            if (quantity == "") {
                                myToast('请填写商品数量');
                                return false;
                            }else if(availableQuantity < quantity){    //售出单数量与用户持仓可用数量做对比
                                myToast('持仓数量不足');
                                return false;
                            }
                            //获取时间
                            var buyDate = $("#dealRight_left_YQInp_inp_m").val();
                            if (buyDate == "") {
                                myToast('请选择时间');
                                return false;
                            }
                            //购入单参数
                            var workOffData = JSON.stringify({
                                "ctype": "Web",
                                "name": "queryOnekeyListOrder",
                                "reqbody": {
                                    "bsFlag": "1",
                                    "commodityId": commodityId,
                                    "pageIndex": "1",
                                    "pageSize": "100",
                                    "price": price,
                                    "quantity": quantity,
                                    "status": "1",
                                    "validDate": buyDate
                                },
                                "sessionStr": sessionStr,
                                "userid": userId
                            })
                            homePageAjax(httpheader, workOffData, workOffSuccess);

                            function workOffSuccess(data) {
                                if(data.retcode == 0) {
                                    console.log(data);
                                    var retData03 = data.respbody.arrayList;
                                    if (retData03.length == "0") {
                                        myToast("没有符合条件的商品");
                                    } else {
                                        //如果有符合条件的商品，将商品ID,商品名称,用户输入的购入价，购入数量，有效期，是否分期，用户点击的是购入还是售出，等参数传递到购入页
                                        //PRODUCTNAME   商品名称
                                        //COMMODITYID   商品ID
                                        //ISSTAGE       该商品是否支持分期   0全款 1分期
                                        //首期比例    单价*数量*比例
                                        console.log(retData.listDepositRate);
                                        window.sessionStorage.setItem("LISTDEPOSITIRATE", listDepositRate);   //首期比例
                                        window.sessionStorage.setItem("PURCHASEPRICE", price);        //购入价
                                        window.sessionStorage.setItem("PURCHASEQUANTITY", quantity);   //购入数量
                                        window.sessionStorage.setItem("PURCHASEBUYDATE", buyDate);    //有效期
                                        console.log(that.accessKey);
                                        window.sessionStorage.setItem("BUYSELL", that.accessKey);    //用户点击的购入还是售出     购入2 售出1
                                        window.location.href = "ADelistingPage.html";
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
                        } else {
                            myToast('此商品暂时不能进行交易');
                        }
                    }
                }
            })
        }else{
            if(data.retcode == -17401){
                loginOut();
                window.sessionStorage.setItem("LOGINSTATE", "flase");
                window.sessionStorage.setItem("LOGINSOURCE", 1);
            }else{
                myToast(data.msg);
            }
        }
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

//    购入有效日期
    function GetDateStr(AddDayCount) {
        var dd = new Date();
        dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
        var y = dd.getFullYear();
        var m = dd.getMonth() + 1;//获取当前月份的日期
        var d = dd.getDate();
        return y + "-" + m + "-" + d;
    }

    var nextDate = GetDateStr(1);
    $("#dealRight_left_YQInp_inp_g").val(nextDate);
    $("#dealRight_left_YQInp_inp_m").val(nextDate);


    //添加收藏
    var AddCollectionData = JSON.stringify({
        "name": "addCollection",
        "ctype": "Web",
        "sessionStr": sessionStr,
        "userid": userId,
        "reqbody": {
            "commodityId": commodityId //商品ID
        }
    });
    //点击收藏发起收藏请求

    //判断src为空心则发起添加收藏，如果为实心则发起取消收藏
    $("#collect").on("click", function () {
        var loginstate = window.sessionStorage.getItem("LOGINSTATE");
        if (loginstate == "true") {
            if (collection == 1) {
                var DelCollectionData = JSON.stringify({
                    "reqbody": {
                        "commodityId": commodityId
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
                        if(retData == -17401){
                            loginOut();
                            window.sessionStorage.setItem("LOGINSTATE", "flase");
                            window.sessionStorage.setItem("LOGINSOURCE", 1);
                            window.location.href = "loginPage.html";
                        }else{
                            myToast(data.msg);
                        }
                    }
                }
            } else if (collection == 0) {
                //添加收藏
                var AddCollectionData = JSON.stringify({
                    "name": "addCollection",
                    "ctype": "Web",
                    "sessionStr": sessionStr,
                    "userid": userId,
                    "reqbody": {
                        "commodityId": commodityId //商品ID
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
                    }else{
                        if(retData == -17401){
                            loginOut();
                            window.sessionStorage.setItem("LOGINSTATE", "flase");
                            window.sessionStorage.setItem("LOGINSOURCE",1);
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
    })
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
})