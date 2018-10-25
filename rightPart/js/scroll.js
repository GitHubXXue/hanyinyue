/*


     初始给了 display：none 之后
     获取 clientHeight  offsetHeight  scrollHeight的时候要特别注意

     */

     var oScroll = document.querySelector(".rightPart #box #scroll"),
     oBar = oScroll.children[0],
     oBox = document.querySelector(".rightPart #box"),
     oContent = document.querySelector(".rightPart #box #box_list");

    //先设定oBar的高度
    var barH = oBox.clientHeight*oBox.clientHeight / oBox.scrollHeight;
    oBar.style.height = barH + 'px';
    //获取最大值
    var maxBTop = oScroll.clientHeight - barH;
    var maxCtop = oBox.scrollHeight - oBox.clientHeight;
    oScroll.style.display = "none";


    //bar的事件
    oBar.onmousedown = function (e) {
        e = e || window.event;
        var sY = e.clientY,
        sT = this.offsetTop;
        document.onmousemove = function (e) {
            e = e || window.event;
            setTop(sT + e.clientY - sY);
        };
    };
    document.onmouseup = function () {
        this.onmousemove = null;
    };

    //给box添加滚轮事件
    mousewheel( oBox , function (e,d) {
        var top = oBar.offsetTop;
        d < 0?top += 20:top -= 20;
        setTop(top);
        return false;
    } );

    //scroll的点击事件
        //获取box距离可视区顶部的距离
        oBar.onclick = function (e) {
            e = e || window.event;
            e.cancelBubble = true;
        };
        oScroll.onclick = function (e) {
            e = e || window.event;
        // 鼠标距离可视区的top + 滚动高 - oBox距离文档的top - bar的高度一半
        // 鼠标距离可视区的top - bar的高度一半 - oBox距离文档的top + 滚动高
        var top = e.clientY - barH/2 - offset(oBox).top + (document.documentElement.scrollTop||document.body.scrollTop);
        setTop(top);
    };

    //显示scroll
    (function(){
        var flag = true , flag1 = true;//用来scroll的显示隐藏的
        oBox.onmouseenter = function () {
            flag1 = false;
            oScroll.style.display = "block";
        };
        oBox.onmouseleave = function () {
            flag1 = true;
            flag && (oScroll.style.display = "none");
        };
        oScroll.onmousedown = function () {
            flag = false;
        };
        document.addEventListener("mouseup" , function () {
            flag = true;
            flag1 && (oScroll.style.display = "none");
        });
    })();

    //设定bar和content的top值
    function setTop(top) {
        //限定top的取值范围
        top = Math.max(top , 0);
        top = Math.min(top , maxBTop);
        oBar.style.top = top + "px";

        //求出content的top
        var cTop = top*maxCtop / maxBTop;
        oContent.style.top = -cTop + 'px';
    }

    //滚轮事件
    function mousewheel(obj , Fn) {
        function eFn(e) {
            e = e || window.event;
            if ( Fn.call(this,e,e.wheelDelta/120 || -e.detail/3) === false ){
                e.preventDefault && e.preventDefault();
                e.returnValue = false;
            }
        }
        document.onmousewheel!==undefined?obj.onmousewheel=eFn:obj.addEventListener('DOMMouseScroll',eFn,false);
    }

    //获取元素到文档的距离
    function offset(obj){
        var json = {
            left : 0,
            top : 0
        };
        while ( obj !== document.body ){
            json.left += obj.offsetLeft;
            json.top += obj.offsetTop;
            obj = obj.offsetParent;
        }
        return json;
    }
