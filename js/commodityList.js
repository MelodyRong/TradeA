document.write("<script type='text/javascript' src='js/MyAlert.js'></script>");
document.write("<script src='js/loginInOrOut.js'></script>");
document.write("<script type='text/javascript' src='js/reclassify.js'></script>");    //一二级分类
document.write("<script src='js/md5.js'></script>");
document.write("<script src='js/jqueryPagination.js'></script>");    //分页
document.write("<script src='js/JQ_paginations.js'></script>");
document.write("<script type='text/javascript' src='js/NetworkRequest.js'></script>");    //网络请求
var httpheader = "http://119.90.97.146:18203/";
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

//最新商品和返利商品tab切换
var btns = $('#content_top').children('span');
var divs = $('.commodityPages');
for (var i = 0; i < btns.length; i++) {
    btns[i].index = i;//将i赋给相应的button下标
    btns[i].onclick = function () {
        for (var j = 0; j < btns.length; j++) {
            btns[j].className = '';
            divs[j].style.display = "none";
        }
        this.className = 'content_top_spanOne';
        divs[this.index].style.display = "block";
    }
}
//从sess中获取sessionStr
var sessionStr = window.sessionStorage.getItem("SESSIONSTR");
//从sess中获取userid
var userId = window.sessionStorage.getItem("USERID");
//从sess中获取friemid
var frimId = window.sessionStorage.getItem("FRIMID");
//从sess获取商品分类id
var classify_list_id = window.sessionStorage.getItem("CLASSIFY_LIST_ID");

//根据不同分类动态改变title名称
document.title = "全部商品分类";


//根据商品分类的不同请求不同数据
function ForGoods(marketId,pageIndex) {
    return JSON.stringify({
        "reqbody": {
            "sortCol": "commodityId", //排序 ,   默认：commodityId    ,
            "sortDesc": "0",//逆序 0  正序 1
            "marketId": marketId,//挂牌市场 3    ，返利市场 4
            "categoryId": classify_list_id, //全部 0    ，其他 是分类ID
            "pageSize": 12,
            "pageIndex": pageIndex
        },
        "sessionStr": sessionStr,
        "userid": userId,
        "name": "queryCategoryCommodity",
        "ctype": "web"
    });
}
homePageAjax(httpheader, ForGoods(3,1), productList_gpSuccess);

//商品列表请求成功函数
function productList_gpSuccess(data) {
    console.log(data);
    if (data.retcode == 0) {
        var retData = data.respbody.commodityList;
        console.log(retData);
        var Consignment = $("#newCommodity");
        for (var i = 0; i < retData.length; i++) {
            if(retData[i].isStage == 0){    //1全款0分期
                var li = document.createElement("li");
                li.className = "list";
                li.accessKey = retData[i].commodityId;
                li.dataAnimalType = retData[i].marketId;
                Consignment.append(li);
                var img = document.createElement("img");
                img.src = retData[i].img;
                img.className = "list_image";
                li.appendChild(img);
                var p = document.createElement("p");
                p.className = "list_name";
                p.innerHTML = retData[i].name + "(F)";
                p.title = retData[i].name;
                li.appendChild(p);
                var p1 = document.createElement("p");
                p1.className = "list_name";
                p1.innerHTML = retData[i].commodityCode;
                li.appendChild(p1);
                var divWrap = document.createElement("div");
                divWrap.className = "list_select" + " " + "clearfix";
                li.appendChild(divWrap);
                var div01 = document.createElement("div");
                div01.className = "Leftmarkets";
                divWrap.appendChild(div01);
                var div01Span01 = document.createElement("span");
                if (retData[i].increaseValue == null) {
                    retData[i].increaseValue = "--";
                }
                div01Span01.innerHTML = retData[i].increaseValue;
                div01.appendChild(div01Span01);

                var div01Span1 = document.createElement("span");
                div01Span1.innerHTML = "|";
                div01.appendChild(div01Span1);
                div01Span1.style.marginLeft = "5px";

                var div01Span02 = document.createElement("span");
                if (retData[i].increase == null) {
                    retData[i].increase = "--";
                }
                div01Span02.innerHTML = retData[i].increase + "%";
                div01Span02.style.marginLeft = "5px";
                div01Span02.style.color = "red";
                div01.appendChild(div01Span02);
                var br1 = document.createElement("br");
                div01.appendChild(br1);
                var div01Span03 = document.createElement("span");
                div01.appendChild(div01Span03);
                if (retData[i].price == null) {
                    retData[i].price = "--";
                }
                div01Span03.innerHTML = "￥" + retData[i].price;
                div01Span03.style.color = "red";

                var div01Span2 = document.createElement("span");
                div01Span2.innerHTML = "|";
                div01.appendChild(div01Span2);
                div01Span2.style.marginLeft = "5px";

                var div01Span04 = document.createElement("span");
                if (retData[i].price == null) {
                    retData[i].price = "--";
                }
                div01Span04.innerHTML = "库存：" + retData[i].storeqty;
                div01Span04.style.marginLeft = "5px";
                div01.appendChild(div01Span04);

                var div02 = document.createElement("div");
                div02.className = "Rightpurchases";
                divWrap.appendChild(div02);
                var div02Span01 = document.createElement("span");
                div02.appendChild(div02Span01);
                if (retData[i].buyPrice == null) {
                    retData[i].buyPrice = "--";
                }
                div02Span01.innerHTML = "买：" + retData[i].buyPrice;
                var div02Span1 = document.createElement("span");
                div02.appendChild(div02Span1);
                div02Span1.innerHTML = "|";
                div02Span1.style.marginLeft = "5px";
                var div02Span02 = document.createElement("span");
                div02.appendChild(div02Span02);
                if (retData[i].sellPrice == null) {
                    retData[i].sellPrice = "--";
                }
                div02Span02.innerHTML = "卖：" + retData[i].sellPrice;
                div02Span02.style.marginLeft = "5px";
                // var br2 = document.createElement("br");
                // div02.appendChild(br2);
                // var div02Span03 = document.createElement("span");
                // div02.appendChild(div02Span03);
                // if (retData[i].highPrice == null) {
                //     retData[i].highPrice = "--";
                // }
                // div02Span03.innerHTML = "高：" + retData[i].highPrice;
                // var div02Span2 = document.createElement("span");
                // div02.appendChild(div02Span2);
                // div02Span2.innerHTML = "|";
                // div02Span2.style.marginLeft = "5px";
                // var div02Span04 = document.createElement("span");
                // div02.appendChild(div02Span04);
                // if (retData[i].lowPrice == null) {
                //     retData[i].lowPrice = "--";
                // }
                // div02Span04.innerHTML = "低：" + retData[i].lowPrice;
                // div02Span04.style.marginLeft = "5px";
            }else if(retData[i].isStage == 1){
                var li = document.createElement("li");
                li.className = "list";
                li.accessKey = retData[i].commodityId;
                li.dataAnimalType = retData[i].marketId;
                Consignment.append(li);
                var img = document.createElement("img");
                img.src = retData[i].img;
                img.className = "list_image";
                li.appendChild(img);
                var p = document.createElement("p");
                p.className = "list_name";
                p.innerHTML = retData[i].name + "(Q)";
                p.title = retData[i].name;
                li.appendChild(p);
                var p1 = document.createElement("p");
                p1.className = "list_name";
                p1.innerHTML = retData[i].commodityCode;
                li.appendChild(p1);
                var divWrap = document.createElement("div");
                divWrap.className = "list_select" + " " + "clearfix";
                li.appendChild(divWrap);
                var div01 = document.createElement("div");
                div01.className = "Leftmarkets";
                divWrap.appendChild(div01);
                var div01Span01 = document.createElement("span");
                if (retData[i].increaseValue == null) {
                    retData[i].increaseValue = "--";
                }
                div01Span01.innerHTML = retData[i].increaseValue;
                div01.appendChild(div01Span01);

                var div01Span1 = document.createElement("span");
                div01Span1.innerHTML = "|";
                div01.appendChild(div01Span1);
                div01Span1.style.marginLeft = "5px";

                var div01Span02 = document.createElement("span");
                if (retData[i].increase == null) {
                    retData[i].increase = "--";
                }
                div01Span02.innerHTML = retData[i].increase + "%";
                div01Span02.style.marginLeft = "5px";
                div01Span02.style.color = "red";
                div01.appendChild(div01Span02);
                var br1 = document.createElement("br");
                div01.appendChild(br1);
                var div01Span03 = document.createElement("span");
                div01.appendChild(div01Span03);
                if (retData[i].price == null) {
                    retData[i].price = "--";
                }
                div01Span03.innerHTML = "￥" + retData[i].price;
                div01Span03.style.color = "red";

                var div01Span2 = document.createElement("span");
                div01Span2.innerHTML = "|";
                div01.appendChild(div01Span2);
                div01Span2.style.marginLeft = "5px";

                var div01Span04 = document.createElement("span");
                if (retData[i].price == null) {
                    retData[i].price = "--";
                }
                div01Span04.innerHTML = "库存：" + retData[i].storeqty;
                div01Span04.style.marginLeft = "5px";
                div01.appendChild(div01Span04);

                var div02 = document.createElement("div");
                div02.className = "Rightpurchases";
                divWrap.appendChild(div02);
                var div02Span01 = document.createElement("span");
                div02.appendChild(div02Span01);
                if (retData[i].buyPrice == null) {
                    retData[i].buyPrice = "--";
                }
                div02Span01.innerHTML = "买：" + retData[i].buyPrice;
                var div02Span1 = document.createElement("span");
                div02.appendChild(div02Span1);
                div02Span1.innerHTML = "|";
                div02Span1.style.marginLeft = "5px";
                var div02Span02 = document.createElement("span");
                div02.appendChild(div02Span02);
                if (retData[i].sellPrice == null) {
                    retData[i].sellPrice = "--";
                }
                div02Span02.innerHTML = "卖：" + retData[i].sellPrice;
                div02Span02.style.marginLeft = "5px";
                // var br2 = document.createElement("br");
                // div02.appendChild(br2);
                // var div02Span03 = document.createElement("span");
                // div02.appendChild(div02Span03);
                // if (retData[i].highPrice == null) {
                //     retData[i].highPrice = "--";
                // }
                // div02Span03.innerHTML = "高：" + retData[i].highPrice;
                // var div02Span2 = document.createElement("span");
                // div02.appendChild(div02Span2);
                // div02Span2.innerHTML = "|";
                // div02Span2.style.marginLeft = "5px";
                // var div02Span04 = document.createElement("span");
                // div02.appendChild(div02Span04);
                // if (retData[i].lowPrice == null) {
                //     retData[i].lowPrice = "--";
                // }
                // div02Span04.innerHTML = "低：" + retData[i].lowPrice;
                // div02Span04.style.marginLeft = "5px";
            }
        }
        var listS = $(".list");
        listS.click(function () {
            //将商品id存入sess
            if (this.dataAnimalType == 3) {
                //寄卖
                window.sessionStorage.setItem("COMMODITYID", this.accessKey);
                window.location.href = "DetailsPage.html";
            } else {
                //促销
                window.sessionStorage.setItem("COMMODITYID", this.accessKey);
                window.location.href = "cx_particularsPage.html";
            }
        });

        //分页
        //总条数
        var totalCount = data.respbody.totalCount;
        console.log(totalCount);
        //总页数
        var totalPages = Math.ceil(totalCount/(retData.length));
        console.log(totalPages);
        $('.M-box11').pagination({
            pageCount:totalPages,    //总页数
            totalData:totalCount,     //总条数
            showData:12,    //每页显示的条数
            isHide:true,     //总页数为0或1时隐藏分页控件
            mode: 'fixed',
            callback:function (index) {    //回调函数，参数"index"为当前页
                console.log("当前为第" + index.getCurrent() + "页");
                homePageAjax(httpheader, ForGoods(3,index.getCurrent()), productList_PagingJMSuccess);
            }
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
//分页ajax寄卖商品
function productList_PagingJMSuccess(data) {
    console.log(data);
    if (data.retcode == 0) {
        $("#newCommodity").empty();
        var retData = data.respbody.commodityList;
        var Consignment = $("#newCommodity");
        for (var i = 0; i < retData.length; i++) {
            if(retData[i].isStage == 0){    //1全款0分期
                var li = document.createElement("li");
                li.className = "list";
                li.accessKey = retData[i].commodityId;
                li.dataAnimalType = retData[i].marketId;
                Consignment.append(li);
                var img = document.createElement("img");
                img.src = retData[i].img;
                img.className = "list_image";
                li.appendChild(img);
                var p = document.createElement("p");
                p.className = "list_name";
                p.innerHTML = retData[i].name + "(F)";
                p.title = retData[i].name;
                li.appendChild(p);
                var p1 = document.createElement("p");
                p1.className = "list_name";
                p1.innerHTML = retData[i].commodityCode;
                li.appendChild(p1);
                var divWrap = document.createElement("div");
                divWrap.className = "list_select" + " " + "clearfix";
                li.appendChild(divWrap);
                var div01 = document.createElement("div");
                div01.className = "Leftmarkets";
                divWrap.appendChild(div01);
                var div01Span01 = document.createElement("span");
                if (retData[i].increaseValue == null) {
                    retData[i].increaseValue = "--";
                }
                div01Span01.innerHTML = retData[i].increaseValue;
                div01.appendChild(div01Span01);

                var div01Span1 = document.createElement("span");
                div01Span1.innerHTML = "|";
                div01.appendChild(div01Span1);
                div01Span1.style.marginLeft = "5px";

                var div01Span02 = document.createElement("span");
                if (retData[i].increase == null) {
                    retData[i].increase = "--";
                }
                div01Span02.innerHTML = retData[i].increase + "%";
                div01Span02.style.marginLeft = "5px";
                div01Span02.style.color = "red";
                div01.appendChild(div01Span02);
                var br1 = document.createElement("br");
                div01.appendChild(br1);
                var div01Span03 = document.createElement("span");
                div01.appendChild(div01Span03);
                if (retData[i].price == null) {
                    retData[i].price = "--";
                }
                div01Span03.innerHTML = "￥" + retData[i].price;
                div01Span03.style.color = "red";

                var div01Span2 = document.createElement("span");
                div01Span2.innerHTML = "|";
                div01.appendChild(div01Span2);
                div01Span2.style.marginLeft = "5px";

                var div01Span04 = document.createElement("span");
                if (retData[i].price == null) {
                    retData[i].price = "--";
                }
                div01Span04.innerHTML = "库存：" + retData[i].storeqty;
                div01Span04.style.marginLeft = "5px";
                div01.appendChild(div01Span04);

                var div02 = document.createElement("div");
                div02.className = "Rightpurchases";
                divWrap.appendChild(div02);
                var div02Span01 = document.createElement("span");
                div02.appendChild(div02Span01);
                if (retData[i].buyPrice == null) {
                    retData[i].buyPrice = "--";
                }
                div02Span01.innerHTML = "买：" + retData[i].buyPrice;
                var div02Span1 = document.createElement("span");
                div02.appendChild(div02Span1);
                div02Span1.innerHTML = "|";
                div02Span1.style.marginLeft = "5px";
                var div02Span02 = document.createElement("span");
                div02.appendChild(div02Span02);
                if (retData[i].sellPrice == null) {
                    retData[i].sellPrice = "--";
                }
                div02Span02.innerHTML = "卖：" + retData[i].sellPrice;
                div02Span02.style.marginLeft = "5px";
                // var br2 = document.createElement("br");
                // div02.appendChild(br2);
                // var div02Span03 = document.createElement("span");
                // div02.appendChild(div02Span03);
                // if (retData[i].highPrice == null) {
                //     retData[i].highPrice = "--";
                // }
                // div02Span03.innerHTML = "高：" + retData[i].highPrice;
                // var div02Span2 = document.createElement("span");
                // div02.appendChild(div02Span2);
                // div02Span2.innerHTML = "|";
                // div02Span2.style.marginLeft = "5px";
                // var div02Span04 = document.createElement("span");
                // div02.appendChild(div02Span04);
                // if (retData[i].lowPrice == null) {
                //     retData[i].lowPrice = "--";
                // }
                // div02Span04.innerHTML = "低：" + retData[i].lowPrice;
                // div02Span04.style.marginLeft = "5px";
            }else if(retData[i].isStage == 1){
                var li = document.createElement("li");
                li.className = "list";
                li.accessKey = retData[i].commodityId;
                li.dataAnimalType = retData[i].marketId;
                Consignment.append(li);
                var img = document.createElement("img");
                img.src = retData[i].img;
                img.className = "list_image";
                li.appendChild(img);
                var p = document.createElement("p");
                p.className = "list_name";
                p.innerHTML = retData[i].name + "(Q)";
                p.title = retData[i].name;
                li.appendChild(p);
                var p1 = document.createElement("p");
                p1.className = "list_name";
                p1.innerHTML = retData[i].commodityCode;
                li.appendChild(p1);
                var divWrap = document.createElement("div");
                divWrap.className = "list_select" + " " + "clearfix";
                li.appendChild(divWrap);
                var div01 = document.createElement("div");
                div01.className = "Leftmarkets";
                divWrap.appendChild(div01);
                var div01Span01 = document.createElement("span");
                if (retData[i].increaseValue == null) {
                    retData[i].increaseValue = "--";
                }
                div01Span01.innerHTML = retData[i].increaseValue;
                div01.appendChild(div01Span01);

                var div01Span1 = document.createElement("span");
                div01Span1.innerHTML = "|";
                div01.appendChild(div01Span1);
                div01Span1.style.marginLeft = "5px";

                var div01Span02 = document.createElement("span");
                if (retData[i].increase == null) {
                    retData[i].increase = "--";
                }
                div01Span02.innerHTML = retData[i].increase + "%";
                div01Span02.style.marginLeft = "5px";
                div01Span02.style.color = "red";
                div01.appendChild(div01Span02);
                var br1 = document.createElement("br");
                div01.appendChild(br1);
                var div01Span03 = document.createElement("span");
                div01.appendChild(div01Span03);
                if (retData[i].price == null) {
                    retData[i].price = "--";
                }
                div01Span03.innerHTML = "￥" + retData[i].price;
                div01Span03.style.color = "red";

                var div01Span2 = document.createElement("span");
                div01Span2.innerHTML = "|";
                div01.appendChild(div01Span2);
                div01Span2.style.marginLeft = "5px";

                var div01Span04 = document.createElement("span");
                if (retData[i].price == null) {
                    retData[i].price = "--";
                }
                div01Span04.innerHTML = "库存：" + retData[i].storeqty;
                div01Span04.style.marginLeft = "5px";
                div01.appendChild(div01Span04);

                var div02 = document.createElement("div");
                div02.className = "Rightpurchases";
                divWrap.appendChild(div02);
                var div02Span01 = document.createElement("span");
                div02.appendChild(div02Span01);
                if (retData[i].buyPrice == null) {
                    retData[i].buyPrice = "--";
                }
                div02Span01.innerHTML = "买：" + retData[i].buyPrice;
                var div02Span1 = document.createElement("span");
                div02.appendChild(div02Span1);
                div02Span1.innerHTML = "|";
                div02Span1.style.marginLeft = "5px";
                var div02Span02 = document.createElement("span");
                div02.appendChild(div02Span02);
                if (retData[i].sellPrice == null) {
                    retData[i].sellPrice = "--";
                }
                div02Span02.innerHTML = "卖：" + retData[i].sellPrice;
                div02Span02.style.marginLeft = "5px";
                // var br2 = document.createElement("br");
                // div02.appendChild(br2);
                // var div02Span03 = document.createElement("span");
                // div02.appendChild(div02Span03);
                // if (retData[i].highPrice == null) {
                //     retData[i].highPrice = "--";
                // }
                // div02Span03.innerHTML = "高：" + retData[i].highPrice;
                // var div02Span2 = document.createElement("span");
                // div02.appendChild(div02Span2);
                // div02Span2.innerHTML = "|";
                // div02Span2.style.marginLeft = "5px";
                // var div02Span04 = document.createElement("span");
                // div02.appendChild(div02Span04);
                // if (retData[i].lowPrice == null) {
                //     retData[i].lowPrice = "--";
                // }
                // div02Span04.innerHTML = "低：" + retData[i].lowPrice;
                // div02Span04.style.marginLeft = "5px";
            }
        }
        var listS = $(".list");
        listS.click(function () {
            //将商品id存入sess
            if (this.dataAnimalType == 3) {
                //寄卖
                window.sessionStorage.setItem("COMMODITYID", this.accessKey);
                window.location.href = "DetailsPage.html";
            } else {
                //促销
                window.sessionStorage.setItem("COMMODITYID", this.accessKey);
                window.location.href = "cx_particularsPage.html";
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
homePageAjax(httpheader,  ForGoods(4,1), productList_flSuccess);

function productList_flSuccess(data) {
    console.log(data);
    if (data.retcode == 0) {
        var retData = data.respbody.commodityList;
        console.log(retData);
        var Consignment = $("#Consignment_cx");
        if(retData.length == 0){
            Consignment.html("暂无数据");
            Consignment.attr("padding","50px");
            Consignment.attr("fontSize","20px");
        }else {
            for (var i = 0; i < retData.length; i++) {
                    var li = document.createElement("li");
                    li.className = "list03" + " " + "cxsp";
                    li.accessKey = retData[i].commodityId;
                    Consignment.append(li);
                    var img = document.createElement("img");
                    img.src = retData[i].img;
                    img.className = "list_image";
                    li.appendChild(img);
                    var p = document.createElement("p");
                    p.className = "list_name";
                    p.innerHTML = retData[i].name;
                    p.title = retData[i].name;
                    li.appendChild(p);
                    var p1 = document.createElement("p");
                    p1.className = "list_name";
                    p1.innerHTML = retData[i].commodityCode;
                    li.appendChild(p1);
                    var divTwo = document.createElement("div");
                    divTwo.className = "Leftmarket";
                    li.appendChild(divTwo);
                    var spanOne = document.createElement("span");
                    if (retData[i].price == undefined) {
                        retData[i].price = "--";
                    }
                    spanOne.innerHTML = "最新价：" + retData[i].price;
                    spanOne.style.color = "red";
                    divTwo.appendChild(spanOne);
                    var spanTwo = document.createElement("span");
                    spanTwo.innerHTML = "|";
                    divTwo.appendChild(spanTwo);
                    spanTwo.style.marginLeft = "15px";
                    var spanThree = document.createElement("span");
                    if (retData[i].storeqty == undefined) {
                        retData[i].storeqty = "--";
                    }
                    spanThree.innerHTML = "库存：" + retData[i].storeqty;
                    spanThree.style.marginLeft = "15px";
                    divTwo.appendChild(spanThree);
                }
            }
            var listS = $(".list03");
            listS.click(function () {
                //将商品id存入sess
                if (this.dataAnimalType == 3) {
                    //寄卖
                    window.sessionStorage.setItem("COMMODITYID", this.accessKey);
                    // window.location.href = "DetailsPage.html";
                } else {
                    //促销
                    window.sessionStorage.setItem("CX_COMMODITYID", this.accessKey);
                    window.location.href = "cx_particularsPage.html";
                }
            });


            //分页
            //总条数
            var totalCount = data.respbody.totalCount;
            console.log(totalCount);
            //总页数
            var totalPages = Math.ceil(totalCount / (retData.length));
            console.log(totalPages);
            $('.M-box111').pagination({
                pageCount: totalPages,    //总页数
                totalData: totalCount,     //总条数
                showData: 12,    //每页显示的条数
                isHide: true,     //总页数为0或1时隐藏分页控件
                mode: 'fixed',
                callback: function (index) {    //回调函数，参数"index"为当前页
                    console.log("当前为第" + index.getCurrent() + "页");
                    homePageAjax(httpheader, ForGoods(4, index.getCurrent()), productList_PagingCXSuccess);
                }
            });

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
function productList_PagingCXSuccess(data) {
    console.log(data);
    if (data.retcode == 0) {
        $("#Consignment_cx").empty();
        var retData = data.respbody.commodityList;
        var Consignment = $("#Consignment_cx");
        for (var i = 0; i < retData.length; i++) {
            if(retData[i].isStage == 0){
                var li = document.createElement("li");
                li.className = "list03" + " " + "cxsp";
                li.accessKey = retData[i].commodityId;
                Consignment.append(li);
                var img = document.createElement("img");
                img.src = retData[i].img;
                img.className = "list_image";
                li.appendChild(img);
                var p = document.createElement("p");
                p.className = "list_name";
                p.innerHTML = retData[i].name + "(F)";
                p.title = retData[i].name;
                li.appendChild(p);
                var p1 = document.createElement("p");
                p1.className = "list_name";
                p1.innerHTML = retData[i].commodityCode;
                li.appendChild(p1);
                var divTwo = document.createElement("div");
                divTwo.className = "Leftmarket";
                li.appendChild(divTwo);
                var spanOne = document.createElement("span");
                if(retData[i].price == undefined){
                    retData[i].price = "--";
                }
                spanOne.innerHTML = "最新价：" + retData[i].price;
                spanOne.style.color = "red";
                divTwo.appendChild(spanOne);
                var spanTwo = document.createElement("span");
                spanTwo.innerHTML = "|";
                divTwo.appendChild(spanTwo);
                spanTwo.style.marginLeft = "15px";
                var spanThree = document.createElement("span");
                if(retData[i].storeqty == undefined){
                    retData[i].storeqty = "--";
                }
                spanThree.innerHTML = "库存：" + retData[i].storeqty;
                spanThree.style.marginLeft = "15px";
                divTwo.appendChild(spanThree);
            }else if(retData[i].isStage == 1){
                var li = document.createElement("li");
                li.className = "list03" + " " + "cxsp";
                li.accessKey = retData[i].commodityId;
                Consignment.append(li);
                var img = document.createElement("img");
                img.src = retData[i].img;
                img.className = "list_image";
                li.appendChild(img);
                var p = document.createElement("p");
                p.className = "list_name";
                p.innerHTML = retData[i].name + "(Q)";
                p.title = retData[i].name;
                li.appendChild(p);
                var p1 = document.createElement("p");
                p1.className = "list_name";
                p1.innerHTML = retData[i].commodityCode;
                li.appendChild(p1);
                var divTwo = document.createElement("div");
                divTwo.className = "Leftmarket";
                li.appendChild(divTwo);
                var spanOne = document.createElement("span");
                if(retData[i].price == undefined){
                    retData[i].price = "--";
                }
                spanOne.innerHTML = "最新价：" + retData[i].price;
                spanOne.style.color = "red";
                divTwo.appendChild(spanOne);
                var spanTwo = document.createElement("span");
                spanTwo.innerHTML = "|";
                divTwo.appendChild(spanTwo);
                spanTwo.style.marginLeft = "15px";
                var spanThree = document.createElement("span");
                if(retData[i].storeqty == undefined){
                    retData[i].storeqty = "--";
                }
                spanThree.innerHTML = "库存：" + retData[i].storeqty;
                spanThree.style.marginLeft = "15px";
                divTwo.appendChild(spanThree);
            }
        }
        var listS = $(".list03");
        listS.click(function () {
            //将商品id存入sess
            if (this.dataAnimalType == 3) {
                //寄卖
                window.sessionStorage.setItem("COMMODITYID", this.accessKey);
                // window.location.href = "DetailsPage.html";
            } else {
                //促销
                window.sessionStorage.setItem("CX_COMMODITYID", this.accessKey);
                window.location.href = "cx_particularsPage.html";
            }
        });
    }  else {
        if(data.retcode == -17401){
            loginOut();
            window.sessionStorage.setItem("LOGINSTATE", "flase");
            window.sessionStorage.setItem("LOGINSOURCE", 1);
            myToast(data.msg);
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





