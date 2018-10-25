    (function () {
        var Tween = {
            easeBoth: function(t, b, c, d){  //加速减速曲线
                if ((t/=d/2) < 1) {
                    return c/2*t*t + b;
                }
                return -c/2 * ((--t)*(t-2) - 1) + b;
            }
        };
        function tMove( obj , json , time , type , callback ) {
            window.requestAnimationFrame = window.requestAnimationFrame||function(a){return setTimeout(a,1000/60)};
            window.cancelAnimationFrame = window.cancelAnimationFrame||clearTimeout;
            var sss = {};
            if ( typeof type === "function" ){
                callback = type;
                type = "easeBoth";
            }else{
                type = type || "easeBoth";
            }
            var cssJson = obj.currentStyle || getComputedStyle(obj);
            var start = {},S = {};
            for (var key in json) {
                start[key] = parseFloat(cssJson[key]);//储存每个属性的 初始值
                S[key] = json[key] - start[key];//存储每个属性的 总路程
                if ( !S[key] ){
                    delete start[key];
                    delete S[key];
                }
            }
            var sTime = new Date();
            (function fn() {
                var t = new Date() - sTime; //经过了多长时间
                t>= time?t=time:sss.timer=requestAnimationFrame(fn);
                for (var key in S) {
                    var val = Tween[type](t , start[key] , S[key] , time);
                    if ( key === "opacity" ){
                        obj.style[key] = val;
                        obj.style.filter = "alpha(opacity="+ val*100 +")";
                    }else{
                        obj.style[key] = val + 'px';
                    }
                }
                if(t===time)callback && callback.call( obj );
            })();
            return sss;
        }
        window.tMove = tMove;
        return tMove;
    })();
	
    (function () {
        var oBanner = document.getElementById("banner"),
            aPicLi = oBanner.querySelectorAll(".pic ul li"),
            aTabLi = oBanner.querySelectorAll(".tab ul li"),
            aBtnDiv = oBanner.querySelectorAll(".btn div"),
            length = aTabLi.length,
            index = 0,//初始的序号
            timer = null,
            timer2 = null,
            clickTime = 0;

        //tab的移入事件
        for (var i = 0; i < length; i++) {
            aTabLi[i].i = i;
            aTabLi[i].onmouseenter = function () {

                if ( index === this.i ){
                    return;
                }

                clearTimeout(timer);

                var x = this.i;

                timer = setTimeout(function () {
                    fn(function () {
                        index = x;
                    });
                } , 200);
            }
        }

        //btn的点击事件
        for (i = 0; i < 2; i++) {
            (function (i) {
                aBtnDiv[i].onclick = function () {
                    if ( new Date() - clickTime >= 500 ){
                        clickTime = new Date();
                        fn(function () {
                            if ( i ){
                                index ++;
                                index %= length;
                            }else{
                                index --;
                                if(index<0)index=length-1;
                            }
                        });
                    }
                }
            })(i);
        }

        //自动轮播
        oBanner.onmouseenter = function () {
            clearInterval(timer2);
        };
        oBanner.onmouseleave = function () {
            auto();
        };
        auto();
        function auto() {
            timer2 = setInterval(function () {
                fn(function () {
                    index ++;
                    index %= length;
                });
            },3000);
        }

        function fn( cha ) {
            //前一个的变化
            aPicLi[index].stop && cancelAnimationFrame( aPicLi[index].stop.timer );
            aPicLi[index].stop = tMove(aPicLi[index] , {opacity : 0} , 300 , function () {
                this.style.display = "none";
            });//前一个隐藏
            aTabLi[index].style.background = "#ffffff";//前一个背景变化

            //index的变化
            cha();

            //后一个的变化
            aPicLi[index].style.opacity = 0;
            aPicLi[index].style.filter = "alpha(opacity=0)";
            aPicLi[index].style.display = "block";
            aPicLi[index].stop && cancelAnimationFrame( aPicLi[index].stop.timer )
            aPicLi[index].stop = tMove(aPicLi[index] , {opacity : 1} , 300);//当前的显示
            aTabLi[index].style.background = "#db192a";//当前的背景变化
        }
    })();
   