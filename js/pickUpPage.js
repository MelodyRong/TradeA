document.write("<script type='text/javascript' src='js/MyAlert.js'></script>");   //弹框
document.write("<script type='text/javascript' src='js/loginInOrOut.js'></script>");
document.write("<script type='text/javascript' src='js/reclassify.js'></script>");    //一二级分类
document.write("<script type='text/javascript' src='js/NetworkRequest.js'></script>");    //网络请求
var httpheader = "http://106.14.175.148:18203/";
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
            //
            myToast('无法连接到网络，请稍后再试');
        }
    });
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
//    从sess里面取到用户id，用来获取用户信息
var userId = window.sessionStorage.getItem("USERID");
console.log(userId);
//从sess里获取sessStr
var sessStr = window.sessionStorage.getItem("SESSIONSTR");
console.log(sessStr);
//从sess里获取frimeid
var frimId = window.sessionStorage.getItem("FRIMID");
console.log(frimId);
//提货日期
var pickUpDate;
//商品名称
var revcationfirstname = window.sessionStorage.getItem("REVCATIONfIRSTNAME");
$("#commodityName").val(revcationfirstname);
//提货数量
var revocationnumber = window.sessionStorage.getItem("REVOCATIONNUMBER");
console.log(revocationnumber);
$("#commodityNumber").val(revocationnumber);
//购买人
var username = window.sessionStorage.getItem("USERNAME");
console.log(username);
if(username == "undefined"){
    $("#commodityUserName").val("");
}else{
    $("#commodityUserName").val(username);
}

//限制最小提货量
var minQuantity;
//选择委托时显示委托人填写栏
$("#pickUpWay").change(function () {
    console.log(this.value);
    if(this.value == 2){
        $("#ConsignmentContent_WTRXX").css("display","block");   //显示填写委托人信息栏
    }else{
        $("#ConsignmentContent_WTRXX").css("display","none");
    }

});
//商品所属仓库接口
// var gmusername = $("#commodityName").val();
var gmcommodityId = window.sessionStorage.getItem("REVOCATIONID");
var warehouse_conditionData = JSON.stringify({
    "name": "queryCommodityStorage",
    "ctype": "Web",
    "reqbody": {
        "commodityId": gmcommodityId
    }
});
httpAjax(httpheader,warehouse_conditionData,warehouse_conditionSuccess);
function warehouse_conditionSuccess(data){
    if(data.retcode == 0){
        console.log(data);
        var retDate = data.respbody.storageList;
        for(var i=0;i<retDate.length;i++){
            $("#warehouse").append('<option value=' + retDate[i].storageID + '>' + retDate[i].storageName +'</option>');
        }
        minQuantity = data.respbody.minPickupCount;
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
//提货申请的时间默认为明天的当前时间
var myDate = new Date();
myDate.setTime(myDate.getTime()+24*60*60*1000);
console.log(myDate.getMonth());
var MyMonth = myDate.getMonth();
if(MyMonth <10){
    MyMonth = "0" + (Number(MyMonth)+1);
}
var MyDay = myDate.getDate();
if(MyDay < 10){
    MyMonth = "0" + MyDay;
}
var s3 = myDate.getFullYear()+"-" + MyMonth + "-" + myDate.getDate();
pickUpDate = myDate.getFullYear()+"-" + MyMonth + "-" + myDate.getDate();
console.log(s3);
$("#applyDate").val(s3);
//时间
var MyHour = myDate.getHours();
if(MyHour < 10){
    MyHour = "0" + MyHour;
}
var myMinutes = myDate.getMinutes();
if(myMinutes < 10){
    myMinutes = "0" + myMinutes;
}
var s4 = MyHour + ":" + myMinutes ;
$("#applyTime").val(s4);
//提货时间发生改变时
$("#applyDate").change(function(){
    if(new Date(this.value).getTime() < new Date(pickUpDate).getTime()){
        myToast("日期选择错误");
        this.value = pickUpDate;
        return false;
    }
});
//提货方式改变时
$("#pickUpWay").change(function(){
    console.log(this.value);
    if(this.value == 1){
        $("#ConsignmentContent_WTRXX").css("display","none");
    }else if(this.value == 2){
        $("#ConsignmentContent_WTRXX").css("display","none");
    }else if(this.value == 3){
        $("#ConsignmentContent_WTRXX").css("display","block");
    }
})
//提交申请
$("#submitStorage").click(function () {
    //商品名称
    var gmusername = $("#commodityName").val();
    console.log(gmusername);
    //商品id
    var gmcommodityId = window.sessionStorage.getItem("REVOCATIONID");
    console.log(gmcommodityId);
    //提货数量
    var gmNumber = $("#commodityNumber").val();
    console.log(gmNumber);
    if ($("#commodityNumber").val() == "") {
        myToast("请输入提货数量");
        return false;
    }else if(minQuantity > $("#commodityNumber").val()){
        myToast("提货数量不能低于最小值");
        return false;
    }
    //提货仓库
    var commodityWarehouse = $("#warehouse").val();
    console.log(commodityWarehouse);
    //提货日期
    var commodityData = $("#applyDate").val();
    console.log(commodityData);
    console.log(typeof (commodityData));
    if ($("#applyDate").val() == "") {
        myToast("请选择提货日期");
        return false;
    }else if(new Date($("#applyDate").val()).getTime() < new Date().getTime()){
        myToast("日期必须大于今日");
        return false;
    }
    //提货时间
    var commodityTime = $("#applyTime").val();
    console.log(commodityTime+":00");
    var commodityTimeM = commodityTime+":00";
    console.log(typeof (commodityTime));
    if ($("#applyTime").val() == "") {
        myToast("请选择提货时间");
        return false;
    }
    //购买人
    var gmUserName = $("#commodityUserName").val();
    console.log(gmUserName);
    //提货方式val
    var pickUpWay = $("#pickUpWay").val();
    console.log(pickUpWay);
    //判断提货方式，当为委托时，填写委托人名称和身份证号码
    if(pickUpWay == 3){   //1:邮寄，2：自提 3：委托
        var consignorName = $("#consignorUserName").val();
        var consignorCode = $("#consignorUserCode").val();
        if(consignorName == ""){    //委托人信息不能为空
            myToast("委托人名称不能为空");
            return false;
        }else if(consignorCode == ""){
            myToast("委托人身份证号不能为空");
            return false;
        }else if(!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(consignorCode))){    //委托人身份证是否正确,身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
            myToast("请输入正确的委托人身份证号");
            return false;
        }
        var pickUpData = JSON.stringify({
            "name": "addPickupApplication",
            "ctype": "Web",
            "sessionStr": sessStr,
            "userid": userId,
            "reqbody": {
                "storageID": commodityWarehouse, //库房ID
                "commodityId": gmcommodityId, //商品ID
                "pickupDate": commodityData,//提货日期
                "pickupTime": commodityTimeM,//提货时间
                "pickupQty": gmNumber,//提货数量
                "pickupType": pickUpWay,  //1:邮寄，2：自提 3：委托
                "client": consignorName, //委托人
                "clientIdCard": consignorCode, //委托人身份证
                "remark": "" //备注
            }
        });
        // console.log(pickUpData)
        httpAjax(httpheader,pickUpData,pickUpListSuccess);
    }else {
        var pickUpData = JSON.stringify({
            "name": "addPickupApplication",
            "ctype": "Web",
            "sessionStr": sessStr,
            "userid": userId,
            "reqbody": {
                "storageID": commodityWarehouse, //库房ID
                "commodityId": gmcommodityId, //商品ID
                "pickupDate": commodityData,//提货日期
                "pickupTime": commodityTimeM,//提货时间
                "pickupQty": gmNumber,//提货数量
                "pickupType": pickUpWay,  //1:邮寄，2：自提 3：委托
                "client": "", //委托人
                "clientIdCard": "", //委托人身份证
                "remark": "" //备注
            }
        });
        console.log(pickUpData)
        httpAjax(httpheader,pickUpData,pickUpListSuccess);
    }

})

//提货申请成功函数
function pickUpListSuccess(data) {
    console.log(data);
    console.log(data.retcode);
    console.log(typeof (data.retcode));
    if (data.retcode == 0) {
        myToast('申请提货成功,请到个人中心-我的提货中查看');
        setInterval(function(){
            window.location.href = "MyCenter.html";
        },2000);
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