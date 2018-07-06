document.write("<script type='text/javascript' src='js/MyAlert.js'></script>");
document.write("<script type='text/javascript' src='js/loginInOrOut.js'></script>");
document.write("<script type='text/javascript' src='js/reclassify.js'></script>");
document.write("<script type='text/javascript' src='js/NetworkRequest.js'></script>");


var noticeDetails = $("#noticeDetails");
var contentTitle = $("#contentTitle");
var contentC = $("#contentC");
var noticeTitle = window.sessionStorage.getItem("NOTICETITLE");
var resultTitle = noticeTitle.substr(0,noticeTitle.indexOf("&"));     //标题
console.log(resultTitle);
contentTitle.html(resultTitle);
var time = noticeTitle.substr(noticeTitle.indexOf("("));    //时间
console.log(time);
$("#contentTime").html(time);
var noticeContent = window.sessionStorage.getItem("NOTICEDETAILS");   //内容
contentC.html(noticeContent);


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