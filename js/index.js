/*
 *
    * 左右切换面向对象写法
    * 占用全局变量  Banr（不带自动）  和   Banr2（带自动）
    * 启动函数  .exe()
    * */
    (function(){
    //面向对象写法
    function Banr( $ul , $pic , $tab ) {
        this.$ul = $ul;
        this.$tab = $tab;
        this.index = 0;
        this.length = $pic.length;
        this.width = $pic.width();
        this.timeOut = null;
    }
    Banr.prototype = {
        exe : function () {
            this.addEvent();
        },
        addEvent : function () {
            var This = this;
            this.$tab.mouseenter(function () {
                clearTimeout(This.timeOut);
                var $this = $(this);
                This.timeOut = setTimeout(function () {
                    This.index = This.$tab.index($this);
                    $this.addClass("on").siblings().removeClass("on");
                    This.$ul.stop().animate({
                        left : -This.width*This.index
                    },300);
                },200);
            });
        }
    };

    //继承
    function Banr2($ul , $pic , $tab , $wrap) {
        Banr.call(this,$ul , $pic , $tab);
        this.$wrap = $wrap;
        this.timer = null;
    }
    function Fn(){}
    Fn.prototype = Banr.prototype;
    Banr2.prototype = new Fn();
    Banr2.prototype.temp = Banr2.prototype.exe;
    Banr2.prototype.exe = function () {
        this.temp();
        this.auto();
        this.clearTime();
    };
    Banr2.prototype.clearTime = function () {
        var This = this;
        this.$wrap.hover(function () {
            clearInterval(This.timer);
        },function(){
            This.auto();
        });
    };
    Banr2.prototype.auto = function (){
        var This = this;
        this.timer = setInterval(function () {
            This.index ++;
            This.index %= This.length;
            This.$tab.eq(This.index).addClass("on").siblings().removeClass("on");
            This.$ul.stop().animate({
                left : -This.width*This.index
            },300);
        },3000);
    };
    window.Banr = Banr;
    window.Banr2 = Banr2;
})();

//banner
(function(){
    var $banner = $("#news").find(".banner"),
    $picUl = $banner.find(".pic ul"),
    $picLi = $picUl.children(),
    $tabLi = $banner.find(".tab ul li"),
    banner = new Banr2($picUl , $picLi , $tabLi , $banner);
    banner.exe();
})();

//inform
(function(){
    var $news = $("#news"),
    $tabLi = $news.find(".inform .tab ul li"),
    $wrapUl = $news.find(".inform .show .wrapUl"),
    $wrapLi =  $wrapUl.find(".wrapLi");
    $tabLi.mouseenter(function () {
        $(this).addClass("on").siblings().removeClass("on");
    });
    $wrapLi.each(function (i) {
        var $ul = $("<ul class='list'></ul>");
        var num = 0;
        for (var j = 0,length=newData.length; j < length; j++) {
            if (!i || newData[j].typeX === (i-1) ){
                $ul.append("<li><p><a href='javascript:void(0)'>"+newData[j].title+"</a></p><span>"+newData[j].time+"</span></li>");
                num ++;
                if (num == 5)break;
            }
        }
        $(this).append($ul);
    });
    var banner = new Banr($wrapUl,$wrapLi,$tabLi);
    banner.exe();
})();

//式神列表生成
(function () {
    var $shishenList = $("#character").find(".showMain"),
    $mainListUl = $shishenList.find(".mainList .mUl>ul");

    //生成所有的式神图标
    var count = [
    [0,null],
    [0,null],
    [0,null],
    [0,null],
    [0,null]
    ];//每个对应的计数器
    for (var i = 0,length=shishenData.length; i < length; i++) {
        var index = 0;
        switch ( shishenData[i].level ){
            case "SSR":
            index = 1;
            break;
            case "SR":
            index = 2;
            break;
            case "R":
            index = 3;
            break;
            case "N":
            index = 4;
            break;
        }
        count[0][0] ++;
        count[index][0] ++;
        if ( count[0][0] % 2 ){
            count[0][1] = $("<li class='ssList'></li>");
            $mainListUl.eq(0).append(count[0][1]);
        }
        if ( count[index][0] % 2 ){
            count[index][1] = $("<li class='ssList'></li>");
            $mainListUl.eq(index).append(count[index][1]);
        }


        var str = shishenData[i].isNew?"<i class='new'></i>":"";

        var $div = $("<div class='shishen'>" +
            "<img src='img/index/content/shishen/"+shishenData[i].id+".png'>" +
            "<p class='cover'><span>"+shishenData[i].name+"</span></p>" +
            str +
            "</div>");
        var $clone = $div.clone();
        count[0][1].append($div);
        count[index][1].append($clone);
    }
})();

//式神列表的左右点击
(function () {
    var $character = $('#character'),
    $mUl = $character.find('.mainList .mUl'),
    $shishenListTab = $character.find(".shishenTab .clickBtn"),
    width = $mUl.width();

    $shishenListTab.click(function () {
        var i = $(this).index();
        $(this).addClass("on").siblings(".clickBtn").removeClass("on");
        $mUl.eq(i).show().siblings().hide().each(function () {
            var $btn = $(this).children(".btn");
            this.index = 0;
            /*this.index !== length-1?$btn.eq(1).show():$btn.eq(1).hide();
            this.index !== 0?$btn.eq(0).show():$btn.eq(0).hide();*/
            $(this).children("ul").css("marginLeft" , 0);
        });
    });

    $mUl.each(function () {
        var $ul = $(this).children("ul"),
        $li = $ul.children("li"),
        $btn = $(this).children(".btn"),
        length = Math.ceil($li.length / 6);

        this.index = 0;

        /*this.index !== length-1?$btn.eq(1).show():$btn.eq(1).hide();
        this.index !== 0?$btn.eq(0).show():$btn.eq(0).hide();*/

        $btn.click(function () {
            var i = $(this).index(),
            parent = this.parentNode;
            if ( i === 2 ){
                parent.index ++;
                if (parent.index>length-1)parent.index = length-1;
            }else{
                parent.index --;
                if (parent.index<0)parent.index = 0;
            }
            /*parent.index !== length-1?$btn.eq(1).show():$btn.eq(1).hide();
            parent.index !== 0?$btn.eq(0).show():$btn.eq(0).hide();*/

            $ul.stop().animate({
                marginLeft : parent.index * -width
            },300);
        });
    });
})();

//startegy
(function () {
    var $strategy = $("#strategy"),
    $banner = $strategy.find(".leftPart .banner"),
    $picUl = $banner.find(".pic ul"),
    $picLi = $banner.find(".pic ul li"),
    $tabLi = $banner.find(".tab ul li");
    //左侧banner
    var b1 = new Banr2($picUl , $picLi , $tabLi , $banner);
    b1.exe();
})();

//fan
(function(){
    var $fan = $("#fan"),
    $show = $fan.find(".mFan .show"),
    $tab = $fan.find(".tab .tabNav ul li"),
    length = 6;

    for (var i = 0; i < length; i++) {
        var $ul = $("<ul></ul>");
        for (var j = i*8; j < (i+1)*8; j++) {
            $ul.append('<li>\
                <div class="pic">\
                <img src="'+fanData[j].url+'" alt="">\
                <span><b></b></span>\
                </div>\
                <p class="sTitle">'+fanData[j].title+'</p>\
                </li>');
        }
        $show.append($ul);
    }

    var b1 = new Banr($show , $show.children("ul") , $tab);
    b1.exe();
})();

//登录注册页面弹窗
var $Tz_Login=$('#Tz_Login')
$(".Tz_header .btn").click(function () { //点击出现登陆界面
    tc_center();
    $(document.body).addClass("noScroll");
    $('#gray1').show();
    $('#Tz_Login').show();
});
$('#Tz_Login .title a').click(function () {//点X全部影藏
    $(document.body).removeClass("noScroll");
    $('#gray1').hide();
    $('#Tz_Login').hide();
});
function tc_center(){
    var _top=($(window).height()-$("#Login").outerHeight(true))/2;
    var _left=($(window).width()-$("#Login").outerWidth(true))/2;
    //改变Top的值
    $("#Login").css({top:_top,left:_left});
}

//
//82-jq在线客服侧边栏特效
(function(){
    var timeOut = null
    $('.side ul li').hover(function () {
        clearTimeout(timeOut)
        var This = $(this);
        timeOut = setTimeout(function () {
            This.find('.sidebox').css({
                backgroundColor: '#ae1c1c',
                opacity: 1
            }).stop().animate({width: '124px'}, 200, 'swing')
        }, 100)
    }, function () {
        clearTimeout(timeOut)
        $(this).find('.sidebox').css({backgroundColor: '#000', opacity: 0.8}).stop().animate({width: '54px'}, 200)
    })
    $('.sidetop').click(function () {
        $('html ,body').animate({scrollTop: 0}, 500)
    })
})()















