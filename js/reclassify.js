document.write('<script src="http://libs.baidu.com/jquery/2.0.0/jquery.min.js"></script>');
document.write("<script type='text/javascript' src='js/MyAlert.js'></script>");   //弹框
document.write("<script type='text/javascript' src='js/NetworkRequest.js'></script>");    //网络请求
// var httpheader = "http://106.14.175.148:18203/";
$(function () {
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

    //获取全部商品分类元素点击同样进入商品列表页
    var AllTheGoods = $("#list_top");
    AllTheGoods.on("click", function () {
        window.sessionStorage.setItem("CLASSIFY_LIST_ID", this.accessKey);
        window.location.href = "commodityList.html";
    })

    //二级分类
    function allcommodityAjax(url, retData, successFunction) {
        $.ajax({
            type: "POST",
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

    var onecommodityCode = JSON.stringify({
        "reqbody": {
            "categoryId": "0",  // 一级分类
            "marketId": "1"
        },
        "sessionStr": sessionStr,  //用户str
        "userid": userid, //用户id
        "name": "getCategory",
        "ctype": "Web"
    })
    allcommodityAjax(httpheader, onecommodityCode, allcommodityList)
    var twocommodityCode = JSON.stringify({
        "reqbody": {
            "categoryId": "1",  // 二级分类
            "marketId": "1"
        },
        "sessionStr": sessionStr,  //用户str
        "userid": userid, //用户id
        "name": "getCategory",
        "ctype": "Web"
    })
    allcommodityAjax(httpheader, twocommodityCode, allcommodityList)

    var threecommodityCode = JSON.stringify({
        "reqbody": {
            "categoryId": "2",  // 二级分类
            "marketId": "1"
        },
        "sessionStr": sessionStr,  //用户str
        "userid": userid, //用户id
        "name": "getCategory",
        "ctype": "Web"
    })
    allcommodityAjax(httpheader, threecommodityCode, allcommodityList)

    var fourcommodityCode = JSON.stringify({
        "reqbody": {
            "categoryId": "3",  // 二级分类
            "marketId": "1"
        },
        "sessionStr": sessionStr,  //用户str
        "userid": userid, //用户id
        "name": "getCategory",
        "ctype": "Web"
    })
    allcommodityAjax(httpheader, fourcommodityCode, allcommodityList)

    var fivecommodityCode = JSON.stringify({
        "reqbody": {
            "categoryId": "4",  // 二级分类
            "marketId": "1"
        },
        "sessionStr": sessionStr,  //用户str
        "userid": userid, //用户id
        "name": "getCategory",
        "ctype": "Web"
    })
    allcommodityAjax(httpheader, fivecommodityCode, allcommodityList)

    var sixcommodityCode = JSON.stringify({
        "reqbody": {
            "categoryId": "5",  // 二级分类
            "marketId": "1"
        },
        "sessionStr": sessionStr,  //用户str
        "userid": userid, //用户id
        "name": "getCategory",
        "ctype": "Web"
    })
    allcommodityAjax(httpheader, sixcommodityCode, allcommodityList)

    function allcommodityList(data) {
        if (data.retcode == 0) {
            var list = data.respbody.dataList;
            for (var i = 0; i < list.length; i++) {
                var code = list[i].categoryId;
                var codes = list[i].parentId;
                if (code == 1) {
                    var oneData = list[i].categoryName;
                    var ps = '<p class="one" accesskey="' + code + '">' + oneData + '</p>';
                    $('.listone').append(ps);
                    $('.one').on('mouseover', function () {
                        $('.son1').show();
                        $('.son2').hide();
                        $('.son3').hide();
                        $('.son4').hide();
                        $('.son5').hide();
                    })
                    $('.one').on('click', function () {
                        window.sessionStorage.setItem("CLASSIFY_LIST_ID", this.accessKey);
                        location.href = "./commodityList.html";
                    })
                }
                if (codes == 1) {
                    var firsttype = list[i].categoryName;
                    var htmls = '<li accesskey="' + code + '">' + firsttype + '</li>';
                    $('.son1').append(htmls)
                    $('.son1 li').on('mouseover', function () {
                        $(this).addClass('bgcolor').siblings().removeClass('bgcolor')
                    }).on('mouseout', function () {
                        $(this).removeClass('bgcolor')
                    })
                    $('.son1 li').on('click', function () {
                        window.sessionStorage.setItem("CLASSIFY_LIST_ID", this.accessKey);
                        location.href = "./commodityList.html";
                    })
                }
                if (code == 2) {
                    var oneData = list[i].categoryName;
                    var ps = '<p class="two" accesskey="' + code + '">' + oneData + '</p>'
                    $('.listone').append(ps)
                    $('.two').on('mouseover', function () {
                        $('.son1').hide()
                        $('.son2').show()
                        $('.son3').hide()
                        $('.son4').hide()
                        $('.son5').hide();
                    })
                    $('.two').on('click', function () {
                        window.sessionStorage.setItem("CLASSIFY_LIST_ID", this.accessKey);
                        location.href = "./commodityList.html";
                    })
                }
                if (codes == 2) {
                    var firsttype = list[i].categoryName;
                    var htmls = '<li accesskey="' + code + '">' + firsttype + '</li>';
                    $('.son2').append(htmls)
                    $('.son2 li').on('mouseover', function () {
                        $(this).addClass('bgcolor').siblings().removeClass('bgcolor');
                    }).on('mouseout', function () {
                        $(this).removeClass('bgcolor')
                    })
                    $('.son2 li').on('click', function () {
                        window.sessionStorage.setItem("CLASSIFY_LIST_ID", this.accessKey);
                        location.href = "./commodityList.html";
                    })
                }
                if (code == 3) {
                    var oneData = list[i].categoryName;
                    var ps = '<p class="three" accesskey="' + code + '">' + oneData + '</p>'
                    $('.listone').append(ps)
                    $('.three').on('mouseover', function () {
                        $('.son1').hide()
                        $('.son2').hide()
                        $('.son3').show()
                        $('.son4').hide()
                        $('.son5').hide();
                    })
                    $('.three').on('click', function () {
                        window.sessionStorage.setItem("CLASSIFY_LIST_ID", this.accessKey);
                        location.href = "./commodityList.html";
                    })
                }
                if (codes == 3) {
                    var firsttype = list[i].categoryName;
                    var htmls = '<li accesskey="' + code + '">' + firsttype + '</li>';
                    $('.son3').append(htmls)
                    $('.son3 li').on('mouseover', function () {
                        $(this).addClass('bgcolor').siblings().removeClass('bgcolor')
                    }).on('mouseout', function () {
                        $(this).removeClass('bgcolor')
                    })
                    $('.son3 li').on('click', function () {
                        window.sessionStorage.setItem("CLASSIFY_LIST_ID", this.accessKey);
                        location.href = "./commodityList.html";
                    })
                }
                if (code == 4) {
                    var oneData = list[i].categoryName;
                    var ps = '<p class="four" accesskey="' + code + '">' + oneData + '</p>'
                    $('.listone').append(ps)
                    $('.four').on('mouseover', function () {
                        $('.son1').hide()
                        $('.son2').hide()
                        $('.son3').hide()
                        $('.son4').show()
                        $('.son5').hide();
                    })
                    $('.four').on('click', function () {
                        window.sessionStorage.setItem("CLASSIFY_LIST_ID", this.accessKey);
                        location.href = "./commodityList.html";
                    })
                }
                if (codes == 4) {
                    var firsttype = list[i].categoryName;
                    var htmls = '<li accesskey="' + code + '">' + firsttype + '</li>';
                    $('.son4').append(htmls)
                    $('.son4 li').on('mouseover', function () {
                        $(this).addClass('bgcolor').siblings().removeClass('bgcolor')
                    }).on('mouseout', function () {
                        $(this).removeClass('bgcolor')
                    })
                    $('.son4 li').on('click', function () {
                        window.sessionStorage.setItem("CLASSIFY_LIST_ID", this.accessKey);
                        location.href = "./commodityList.html";
                    })
                }
                if (code == 5) {
                    var oneData = list[i].categoryName;
                    var ps = '<p class="five" accesskey="' + code + '">' + oneData + '</p>'
                    $('.listone').append(ps)
                    $('.five').on('mouseover', function () {
                        $('.son1').hide()
                        $('.son2').hide()
                        $('.son3').hide()
                        $('.son4').hide()
                        $('.son5').show();
                    })
                    $('.five').on('click', function () {
                        window.sessionStorage.setItem("CLASSIFY_LIST_ID", this.accessKey);
                        location.href = "./commodityList.html";
                    })
                }
                if (codes == 5) {
                    var firsttype = list[i].categoryName;
                    var htmls = '<li accesskey="' + code + '">' + firsttype + '</li>';
                    $('.son5').append(htmls);
                    $('.son5 li').on('mouseover', function () {
                        $(this).addClass('bgcolor').siblings().removeClass('bgcolor')
                    }).on('mouseout', function () {
                        $(this).removeClass('bgcolor')
                    })
                    $('.son5 li').on('click', function () {
                        window.sessionStorage.setItem("CLASSIFY_LIST_ID", this.accessKey);
                        location.href = "./commodityList.html";
                    })
                }

                // 全部商品分类  一级 二级分类
                $(".listone p").on('mouseover', function () {
                    $(this).addClass('bgcolor').siblings().removeClass('bgcolor')
                })
                $(".classifyUl").on('mouseout', function () {
                    $(this).find('p').removeClass('bgcolor')
                })
            }
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
})