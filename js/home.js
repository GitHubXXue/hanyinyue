/*window.onload = function () {
    $(document).scrollTop(0);
};*/
$(function () {

    //首屏滑动显示
    (function () {
        var $wrap = $("#wrap"),
        $swp = $wrap.find(".swp");

        $swp.eq(0).animate({
            opacity : 1,
        },1800);

        $swp.eq(1).animate({
            opacity : 1,
            right : 0
        },1800);

        $swp.eq(2).animate({
            opacity : 1,
            top : 450
        },2000);
    })();

    //视频弹窗
    /*(function () {
        var $wrap = $("#wrap"),
            $btn = $wrap.find(".videoBtn"),
            $video = $wrap.find(".video"),
            $close = $wrap.find("#video .close");

        $btn.click(function () {
            $video.show();
            $(document.body).addClass("noScroll");
        });
        $close.click(function () {
            $video.hide();
            $(document.body).removeClass("noScroll");
        });
    })();*/

    //巅峰榜banner
    (function () {

        var $game = $("#game"),
        $picLi = $game.find(".pic ul li"),
        $btn = $game.find(".btn p"),
        index = 0,
        length = $picLi.length;

        $picLi.click(function () {
            if ( $(this).index() !== index ){
                index = $(this).index();
                change();
            }
        });

        $btn.click(function () {
            if ( $(this).index() ){
                index ++;
                index %= length;
            }else{
                index --;
                if(index<0)index=length-1;
            }
            change();
        });

        function change() {
            var lIndex = index - 1,
            rIndex = index + 1;
            if ( lIndex < 0 )lIndex = length-1;
            if (rIndex >= length)rIndex = 0;
            $picLi.removeClass("left mid right");
            $picLi.eq(lIndex).addClass("left");
            $picLi.eq(index).addClass("mid");
            $picLi.eq(rIndex).addClass("right");
        }

    })();

    //滚轮延迟显示
    (function () {
        var $newinfo = $("#newinfo"),
        $title = $newinfo.find(".title"),
        $infoListLi = $newinfo.find(".infoList li"),
        objArr = [];


        init($title,$infoListLi);

        $(window).scroll(function () {
            var height = $(document).scrollTop() + $(window).height();
            for (var i = objArr.length-1; i >= 0; i--) {
                var obj = objArr[i];
                if (height >= obj.oddTop ){
                    (function () {
                        var $This = $(obj);
                        setTimeout(function () {
                            $This.removeClass("hide");
                        },($This.index()%3)*200);
                        objArr.slice(i,1);
                    })();
                }
            }
        });

        function init() {
            for (var i = 0,length=arguments.length; i < length; i++) {
                arguments[i].each(function () {
                    this.oddTop = $(this).offset().top;
                    objArr.push(this);
                });
            }
        }
    })();
});













