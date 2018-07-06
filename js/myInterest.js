document.write("<script type='text/javascript' src='js/MyAlert.js'></script>");
document.write("<script type='text/javascript' src='js/loginInOrOut.js'></script>");
document.write("<script type='text/javascript' src='js/reclassify.js'></script>");    //一二级分类
document.write("<script type='text/javascript' src='js/NetworkRequest.js'></script>");    //网络请求
// var httpheader = "http://119.90.97.146:18203/";
$(function(){

    //公用Ajax
    function homePageAjax(url,retData,successFunction){
        $.ajax({
            type:"post",
            url:url,
            contentType:'application/json;charset=UTF-8',
            dataType:'json',
            data:retData,
            success:function (data) {
                successFunction(data);
            },
            error:function(data){
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
    //从sess中获取用户登录时的sessionStr
    var sessionStr = window.sessionStorage.getItem("SESSIONSTR");
    //从sess中获取用户登录时的userid
    var userId = window.sessionStorage.getItem("USERID");
    //从sess中获取用户登录时的frimid
    var frimId = window.sessionStorage.getItem("FRIMID");
    //查询收藏
    var QueryCollectionData = JSON.stringify({
        "name": "queryCollection",
        "ctype": "Web",
        "sessionStr": sessionStr,
        "userid":userId
    });
    homePageAjax(httpheader,QueryCollectionData,QueryCollectionSuccess);
    //查询收藏成功函数
    function QueryCollectionSuccess(data) {
        if(data.retcode == 0) {
            console.log(data);
            var retData = data.respbody.dataList;
            //当前无收藏时提示暂无数据
            if (retData.length == 0) {
                $("#content_bottom").html("收藏夹已经饿扁了，快去找找自己喜欢的商品吧！");
                $("#content_bottom").css("padding", "200px");
                $("#content_bottom").css("fontSize", "20px");
                $("#content_bottom").css("textAlign", "center");
            } else {
                var Consignment = $("#Consignment");
                for (var i = 0; i < retData.length; i++) {
                    if (retData[i].marketId == 3) {     //3寄卖4促销
                        console.log(retData[i].isStage);
                        if(retData[i].isStage == 0){    //1全款 0分期
                            var li = document.createElement("li");
                            li.className = "list" + " " + "zx_jm_rx";
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
                            p1.title = retData[i].name;
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
                            var br2 = document.createElement("br");
                            div02.appendChild(br2);
                            var div02Span03 = document.createElement("span");
                            div02.appendChild(div02Span03);
                            if (retData[i].highPrice == null) {
                                retData[i].highPrice = "--";
                            }
                            div02Span03.innerHTML = "高：" + retData[i].highPrice;
                            var div02Span2 = document.createElement("span");
                            div02.appendChild(div02Span2);
                            div02Span2.innerHTML = "|";
                            div02Span2.style.marginLeft = "5px";
                            var div02Span04 = document.createElement("span");
                            div02.appendChild(div02Span04);
                            if (retData[i].lowPrice == null) {
                                retData[i].lowPrice = "--";
                            }
                            div02Span04.innerHTML = "低：" + retData[i].lowPrice;
                            div02Span04.style.marginLeft = "5px";
                        }else if(retData[i].isStage == 1){
                            var li = document.createElement("li");
                            li.className = "list" + " " + "zx_jm_rx";
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
                            p1.title = retData[i].name;
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
                            var br2 = document.createElement("br");
                            div02.appendChild(br2);
                            var div02Span03 = document.createElement("span");
                            div02.appendChild(div02Span03);
                            if (retData[i].highPrice == null) {
                                retData[i].highPrice = "--";
                            }
                            div02Span03.innerHTML = "高：" + retData[i].highPrice;
                            var div02Span2 = document.createElement("span");
                            div02.appendChild(div02Span2);
                            div02Span2.innerHTML = "|";
                            div02Span2.style.marginLeft = "5px";
                            var div02Span04 = document.createElement("span");
                            div02.appendChild(div02Span04);
                            if (retData[i].lowPrice == null) {
                                retData[i].lowPrice = "--";
                            }
                            div02Span04.innerHTML = "低：" + retData[i].lowPrice;
                            div02Span04.style.marginLeft = "5px";
                        }
                    } else if (retData[i].marketId == 4) {
                        var li = document.createElement("li");
                        li.className = "list" + " " + "zx_jm_rx";
                        li.accessKey = retData[i].commodityId;
                        li.dataAnimalType = retData[i].marketId;
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
                        p1.title = retData[i].name;
                        li.appendChild(p1);
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
            }
            $(".zx_jm_rx").on("click", function () {
                console.log(this.accessKey);
                console.log(this.title);
                if (this.dataAnimalType == 4) {
                    //促销
                    window.sessionStorage.setItem("CX_COMMODITYID", this.accessKey);
                    window.location.href = "cx_particularsPage.html";
                } else if(this.dataAnimalType == 3){
                    //寄卖
                    window.sessionStorage.setItem("COMMODITYID", this.accessKey);
                    window.location.href = "DetailsPage.html";
                }

            })
        }else{
            if(data.retcode == -17401){
                loginOut();
                window.sessionStorage.setItem("LOGINSTATE", "flase");
                window.sessionStorage.setItem("LOGINSOURCE", 1);
                window.location.href = "loginPage.html";
            }
            myToast(data.msg);
        }
    }
    //点击搜索按钮发起商品搜索
    $("#search_inpTwo").on("click",function () {
        //讲输入的内容存储在sess中一并传递
        window.sessionStorage.setItem("SEARCH",$("#search_inpOne").val());
        window.location.href = "searchPage.html";
    });
    $(document).keyup(function(event){
        if(event.keyCode ==13){
            window.sessionStorage.setItem("SEARCH", $("#search_inpOne").val());
            window.location.href = "searchPage.html";
        }
    });
})