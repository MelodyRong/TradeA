document.write("<script type='text/javascript' src='js/MyAlert.js'></script>");   //弹框
document.write("<script type='text/javascript' src='js/loginInOrOut.js'></script>");
document.write("<script type='text/javascript' src='js/reclassify.js'></script>");   //一二级分类
document.write("<script type='text/javascript' src='js/NetworkRequest.js'></script>");    //网络请求
$(function () {
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

    //从sess中取到str
    var sessionStr = window.sessionStorage.getItem("SESSIONSTR");
    //从sess中取到userid
    var userid = window.sessionStorage.getItem("USERID");
    //从sess中取到frimid
    var frimid = window.sessionStorage.getItem("FRIMID");

    //最新商品tab切换
    var btns = $('#content_top').children('span');
    var divs = $('.commodityPages');
    for (var i = 0; i < btns.length; i++) {
        btns[i].index = i;//将i赋给相应的button下标
        btns[i].onclick = function () {
            for (var j = 0; j < btns.length; j++) {
                btns[j].className = 'topSpan';
                divs[j].style.display = "none";
            }
            this.className = 'topSpan' + ' ' + 'content_top_spanOne';
            divs[this.index].style.display = "block";
        }
    }

    //最新商品
    var newCommodity = JSON.stringify({
        "reqbody": {
            "pageIndex": "1",
            "pageSize": 12
        },
        "name": "latestCommodity",
        "ctype": "Web",
        "marketId": 3
    });
    homePageAjax(httpheader, newCommodity, newCommoditySuccess);
    function newCommoditySuccess(data) {
        if (data.retcode == 0) {
            var retData = data.respbody.commodityList;
            var listWrap = $("#newCommodity");
            // 循环添加商品到页面中
            for (var i = 0; i < retData.length; i++) {
                var li = document.createElement("li");
                li.className = "list01" + " " + "zx_jm_rx";
                li.accessKey = retData[i].commodityId;
                li.dataAnimalType = retData[i].marketId;
                listWrap.append(li);
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
                    retData[i].storeqty = "--"
                }
                spanThree.innerHTML = "库存：" + retData[i].storeqty;
                spanThree.style.marginLeft = "15px";
                divTwo.appendChild(spanThree);
            }
            $(".list01").on("click", function () {
                console.log(this.accessKey);
                console.log(this.dataAnimalType);
                if (this.dataAnimalType == 4) {
                    //促销
                    window.sessionStorage.setItem("CX_COMMODITYID", this.accessKey);
                    window.location.href = "cx_particularsPage.html";
                } else {
                    //寄卖
                    window.sessionStorage.setItem("COMMODITYID", this.accessKey);
                    window.location.href = "DetailsPage.html";
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

//首页寄卖商品
    var Consignment_jm = JSON.stringify({
        "name": "homePageCommodity",
        "ctype": "Web",
        "reqbody": {
            "type": 1,
            "pageIndex": 1,
            "pageSize": 12
        }
    });
    homePageAjax(httpheader, Consignment_jm, Consignment_jmSuccess);

    function Consignment_jmSuccess(data) {
        if (data.retcode == 0) {
            var retData = data.respbody.commodityList;
            console.log(retData);
            var Consignment = $("#Consignment");
            for (var i = 0; i < retData.length; i++) {
                if (retData[i].marketId == 3) {
                    if(retData[i].isStage == 0){    //0全款1分期
                        var li = document.createElement("li");
                        li.className = "list02" + " " + "zx_jm_rx";
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
                        li.className = "list02" + " " + "zx_jm_rx";
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
            }
            $(".list02").on("click", function () {
                console.log(this.accessKey);
                window.sessionStorage.setItem("COMMODITYID", this.accessKey);
                window.location.href = "DetailsPage.html";
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

//首页促销商品
    var Consignment_cx = JSON.stringify({
        "name": "homePageCommodity",
        "ctype": "Web",
        "reqbody": {
            "type": 1,
            "pageIndex": 1,
            "pageSize": 18
        }
    });
    homePageAjax(httpheader, Consignment_cx, Consignment_cxSuccess);
    function Consignment_cxSuccess(data) {
        if (data.retcode == 0) {
            var retData = data.respbody.commodityList;
            console.log(retData);
            var Consignment_cx = $("#Consignment_cx");
            for (var i = 0; i < retData.length; i++) {
                if(retData[i].marketId == "4"){   //3寄卖4促销
                    var li = document.createElement("li");
                    li.className = "list03" + " " + "zx_jm_rx";
                    li.accessKey = retData[i].commodityId;
                    li.dataAnimalType = retData[i].marketId;
                    Consignment_cx.append(li);
                    var img = document.createElement("img");
                    img.src = retData[i].img;
                    img.className = "list_image";
                    li.appendChild(img);
                    var p = document.createElement("p");
                    p.className = "list_name";
                    p.innerHTML = retData[i].name;
                    p.title = retData[i].name;
                    li.appendChild(p);
                    var divTwo = document.createElement("div");
                    divTwo.className = "Leftmarket";
                    li.appendChild(divTwo);
                    var spanOne = document.createElement("span");
                    spanOne.innerHTML = "最新价：" + retData[i].price;
                    spanOne.style.color = "red";
                    divTwo.appendChild(spanOne);
                    var spanTwo = document.createElement("span");
                    spanTwo.innerHTML = "|";
                    divTwo.appendChild(spanTwo);
                    spanTwo.style.marginLeft = "15px";
                    var spanThree = document.createElement("span");
                    spanThree.innerHTML = "库存：" + retData[i].storeqty;
                    spanThree.style.marginLeft = "15px";
                    divTwo.appendChild(spanThree);
                }
            }
            //点击促销商品进入促销商品详情交易页
            $(".list03").on("click", function () {
                console.log(this.accessKey);
                window.sessionStorage.setItem("CX_COMMODITYID", this.accessKey);
                setTimeout(function () {
                    window.location.href = "cx_particularsPage.html";
                }, 500)
            });
        } else {
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
    //首页热销商品
    var hotCommodity_gData = JSON.stringify({
        "sessionStr": "",
        "userid": "",
        "name": "queryCategoryCommodity",
        "ctype": "Web",
        "reqbody": {
            "sortCol": "SalesVolume",
            "sortDesc": "1",   //1倒序   //0正序
            "marketId": 3,      //3寄卖    4促销
            "categoryId": 0,
            "pageSize": 4,
            "pageIndex": 1
        }
    });
    homePageAjax(httpheader, hotCommodity_gData, hotCommoditySuccess);
    function hotCommoditySuccess(data) {
        if (data.retcode == 0) {
            var retData = data.respbody.commodityList;
            console.log(retData);
            var rx_ul_jm = $("#rx_ul_jm");
            for (var i = 0; i < retData.length; i++) {
                // if(retData[i]. == ){
                //
                // }
                var li = document.createElement("li");
                li.className = "list04" + " " + "zx_jm_rx";
                li.accessKey = retData[i].commodityId;
                li.dataAnimalType = retData[i].marketId;
                rx_ul_jm.append(li);
                var divLeft = document.createElement("div");
                divLeft.className = "list01_left";
                li.append(divLeft);
                var divLeftImg = document.createElement("img");
                divLeft.append(divLeftImg);
                divLeftImg.src = retData[i].img;

                var divRight = document.createElement("div");
                li.append(divRight);
                divRight.className = "list01_right";
                var divRight_div = document.createElement("div");
                divRight_div.className = "list01_right_div";
                divRight.append(divRight_div);

                var p = document.createElement("p");
                p.innerHTML = retData[i].name + "()";
                p.style.width = "100%";
                p.style.height = "48px";
                p.style.overflow = "hidden";
                p.title = retData[i].title;
                divRight_div.append(p);

                var spanOne = document.createElement("span");
                divRight_div.append(spanOne);
                spanOne.innerHTML = "最新价：";
                var spanTwo = document.createElement("span");
                divRight_div.append(spanTwo);
                spanTwo.innerHTML = retData[i].price;
                var spanThree = document.createElement("span");
                divRight_div.append(spanThree);
                spanThree.innerHTML = "库存";
                spanThree.style.marginLeft = "20px";
                var spanFour = document.createElement("span");
                divRight_div.append(spanFour);
                spanFour.innerHTML = retData[i].storeqty;
            }
            $(".list04").on("click", function () {
                console.log(this.accessKey);
                console.log(this.dataAnimalType);
                if (this.dataAnimalType == 3) {
                    //寄卖
                    window.sessionStorage.setItem("COMMODITYID", this.accessKey);
                    window.location.href = "DetailsPage.html";
                } else {
                    //促销
                    window.sessionStorage.setItem("COMMODITYID", this.accessKey);
                    window.location.href = "cx_particularsPage.html";
                }

            })
        } else {
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
    var hotCommodity_jData = JSON.stringify({
        "sessionStr": "",
        "userid": "",
        "name": "queryCategoryCommodity",
        "ctype": "Web",
        "reqbody": {
            "sortCol": "SalesVolume",
            "sortDesc": "1",   //1倒序   //0正序
            "marketId": 4,      //3寄卖    4促销
            "categoryId": 0,
            "pageSize": 4,
            "pageIndex": 1
        }
    });
    homePageAjax(httpheader, hotCommodity_jData, hotCommodity_jSuccess);
    function hotCommodity_jSuccess(data) {
        if (data.retcode == 0) {
            var rx_ul_cx = $("#rx_ul_cx");
            var retData = data.respbody.commodityList;
            for (var i = 0; i < retData.length; i++) {
                var li = document.createElement("li");
                li.className = "list05" + " " + "zx_jm_rx";
                li.accessKey = retData[i].commodityId;
                li.dataAnimalType = retData[i].marketId;
                rx_ul_cx.append(li);
                var divLeft = document.createElement("div");
                divLeft.className = "list01_left";
                li.append(divLeft);
                var divLeftImg = document.createElement("img");
                divLeft.append(divLeftImg);
                divLeftImg.src = retData[i].img;

                var divRight = document.createElement("div");
                li.append(divRight);
                divRight.className = "list01_right";
                var divRight_div = document.createElement("div");
                divRight_div.className = "list01_right_div";
                divRight.append(divRight_div);

                var p = document.createElement("p");
                p.innerHTML = retData[i].name;
                p.style.width = "100%";
                p.style.height = "48px";
                p.style.overflow = "hidden";
                p.title = retData[i].title;
                divRight_div.append(p);

                var spanOne = document.createElement("span");
                divRight_div.append(spanOne);
                spanOne.innerHTML = "最新价：";
                var spanTwo = document.createElement("span");
                divRight_div.append(spanTwo);
                spanTwo.innerHTML = retData[i].price;
                var spanThree = document.createElement("span");
                divRight_div.append(spanThree);
                spanThree.innerHTML = "库存";
                spanThree.style.marginLeft = "20px";
                var spanFour = document.createElement("span");
                divRight_div.append(spanFour);
                spanFour.innerHTML = retData[i].storeqty;
            }
            $(".list05").on("click", function () {
                if (this.dataAnimalType == 3) {
                    //寄卖
                    window.sessionStorage.setItem("COMMODITYID", this.accessKey);
                    window.location.href = "DetailsPage.html";
                } else {
                    //促销
                    window.sessionStorage.setItem("COMMODITYID", this.accessKey);
                    window.location.href = "cx_particularsPage.html";
                }

            })
        } else {
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
});
