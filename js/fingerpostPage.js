document.write("<script type='text/javascript' src='js/MyAlert.js'></script>");
document.write("<script type='text/javascript' src='js/loginInOrOut.js'></script>");
document.write("<script type='text/javascript' src='js/reclassify.js'></script>");
document.write("<script type='text/javascript' src='js/NetworkRequest.js'></script>");    //网络请求
// var httpheader = "http://106.14.175.148:18203/";

$(function(){


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