document.write("<script type='text/javascript' src='js/MyAlert.js'></script>");
document.write("<script type='text/javascript' src='js/loginInOrOut.js'></script>");
document.write("<script type='text/javascript' src='js/reclassify.js'></script>");   //一二级分类
document.write("<script type='text/javascript' src='js/NetworkRequest.js'></script>");    //网络请求
$(function () {
    //ajax
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

    //从sess中获取Str
    var sessionStr = window.sessionStorage.getItem("SESSIONSTR");
    console.log(sessionStr);
    //从sess中获取用户id
    var userID = window.sessionStorage.getItem("USERID");
    console.log(userID);
    //从sess中获取用户登录状态
    var loginStatus = window.sessionStorage.getItem("LOGINSTATE");
    console.log(loginStatus);
    //取到firmType和isChecked
    var firmType = window.sessionStorage.getItem("FIRMTYPE");
    var isChecked = window.sessionStorage.getItem("ISCHECKED");
   if (firmType == 6) {   //6企业账户
        if(isChecked == 0){   //0正在审核中
            myAlert({
                title: '提示',
                message: '您的账号正在审核中，还不能进行入库',
                callback: function () {

                }
            });
        }
    }else if (firmType == 3) {   //3企业账户
        if(isChecked == 0){   //0正在审核中
            myAlert({
                title: '提示',
                message: '您的账号正在审核中，还不能进行入库',
                callback: function () {

                }
            });
        }
    }else if (firmType == 5) {   //6企业账户
        if(isChecked == 0){   //0正在审核中
            myAlert({
                title: '提示',
                message: '您的账号正在审核中，还不能进行入库',
                callback: function () {

                }
            });
        }
    }
    function formatDateTime(inputTime) {
        var date = new Date(inputTime);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        return y + '-' + m + '-' + d ;
    }
    $("#applyDate").val(formatDateTime(new Date()));
    //商品分类
    var y_classificationData = JSON.stringify({
        "reqbody": {
            "categoryId": "0",
            "marketId": "1"
        },
        "sessionStr": "",
        "userid": "",
        "name": "getCategory",
        "ctype": "Web"
    });
    homePageAjax(httpheader, y_classificationData, y_classificationSuccess);
    var commodity = $("#commodity");

    function y_classificationSuccess(data) {
        if (data.retcode == 0) {
            console.log(data.respbody.dataList);
            var retData = data.respbody.dataList;
            for (var j = 0; j < retData.length; j++) {
                var option = document.createElement("option");
                commodity.append(option);
                option.value = retData[j].categoryId;
                option.innerHTML = retData[j].categoryName;
            }
            ejfl();
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

    function ejfl() {
        var commodityValue = commodity.val();
        var e_classificationData = JSON.stringify({
            "reqbody": {
                "categoryId": commodityValue,
                "marketId": "1"
            },
            "sessionStr": "",
            "userid": "",
            "name": "getCategory",
            "ctype": "Web"
        });
        homePageAjax(httpheader, e_classificationData, e_classificationSuccess);
    }

    function e_classificationSuccess(data) {
        if (data.retcode == 0) {
            console.log(data.respbody.dataList);
            var retData = data.respbody.dataList;
            var e_commodity = $("#e_commodity");
            e_commodity.empty();
            for (var k = 0; k < retData.length; k++) {
                var option = document.createElement("option");
                e_commodity.append(option);
                option.value = retData[k].categoryId;
                option.innerHTML = retData[k].categoryName;
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

    //根据所选的一级分类请求二级分类(监听selectedchange事件变化来请求二级分类)
    commodity.change(function () {
        ejfl();
    })
    //点击确认申请入库
    submitStorage.onclick = function () {
        //先判断用户是否登录
        if (loginStatus == false) {
            //用户没有登录，跳转至登录界面
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
                    myAlert({
                        title: '提示',
                        message: '您的账号正在审核中，还不能进行入库',
                        callback: function () {

                        }
                    });
                    return false;
                }else if(isChecked == 1){   //已审核
                    deal();
                }
            }else if (firmType == 3) {   //3企业账户
                if(isChecked == 0){   //0正在审核中
                    myAlert({
                        title: '提示',
                        message: '您的账号正在审核中，还不能进行入库',
                        callback: function () {

                        }
                    });
                    return false;
                }else if(isChecked == 1){   //已审核
                    deal();
                }
            }else if (firmType == 5) {   //6企业账户
                if(isChecked == 0){   //0正在审核中
                    myAlert({
                        title: '提示',
                        message: '您的账号正在审核中，还不能进行入库',
                        callback: function () {

                        }
                    });
                    return false;
                }else if(isChecked == 1){   //已审核
                    deal();
                }
            }
            function deal(){
                //入库商品名称
                var commodityName = $("#commodityName").val();
                console.log(typeof (commodityName));
                if (commodityName == "") {
                    myToast("请输入入库商品名称");
                    return false;
                }
                console.log(commodityName);   //name
                //入库商品数量
                var commodityNumber = $("#commodityNumber").val();
                console.log(typeof (commodityNumber));
                if (commodityNumber == "") {
                    myToast("请输入入库商品数量");
                    return false;
                }else if(commodityNumber == 0){
                    myToast("请输入大于0的入库商品数量");
                    return false;
                }else if(!(/^[0-9]+$/.test(commodityNumber))){
                    myToast("请输入整数的入库商品数量");
                    return false;
                }
                console.log(commodityNumber);  //number
                //申请日期(最小时间为今天)
                var applyDate = $("#applyDate").val();
                console.log(applyDate);
                console.log(typeof (applyDate));
                if (applyDate == "") {
                    myToast("请选择入库申请日期");
                    return false;
                } else if(new Date(Date.parse($("#applyDate").val())) < Number(new Date())-(24*60*60*1000)){
                    myToast("日期选择错误");
                    return false;
                }
                // else if (new Date($("#applyDate").val()).getTime() < new Date().getTime()) {
                //     myToast("发行时间选择错误");
                //     return false;
                // }
                //仓库ID
                var warehouseID = $("#warehouse").val();
                console.log(warehouseID);
                //确认申请入库
                var putInStorageData = JSON.stringify({
                    "ctype": "Web",
                    "name": "addStorageApplication",
                    "reqbody": {
                        "applicationStatus": 0,
                        "commodityName": commodityName,
                        "inStorageDate": applyDate,
                        "inStorageQty": commodityNumber,
                        "storageID": warehouseID
                    },
                    "sessionStr": sessionStr,
                    "userid": userID
                });
                homePageAjax(httpheader, putInStorageData, putInStorageSuccess);
            }
        }
    };

    function putInStorageSuccess(data) {
        console.log(data.retcode);
        console.log(typeof(data.retcode));
        if (data.retcode == 0) {
            // myToast('寄卖成功');
            //清空商品名称和商品数量
            $("#commodityName").val("");
            $("#commodityNumber").val("");
            myAlert({
                title: "提示",
                message: "寄卖成功,请到个人中心页查看",
                callback: function () {
                    window.location.href = "MyCenter.html";
                }
            })
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