/*
 文字超出滚动
 */
(function ($) {
    $.fn.scrollText = function(object){
        var timer;
        $(this).each(function(){
            $(this).html('<span class="scroll">'+$(this).html()+'</span>');
        });

        $(this).bind('mouseover',function(){
            var _this = $(this).find("span.scroll");
            var Swid = _this.width();
            var maxMove = $(this).width()-Swid;
            var maxTime = -(maxMove/100)*2000;
            if(maxMove<0){
                timer = setTimeout(function(){
                    start(_this,maxMove,maxTime);
                },500);
            }
        });
        $(this).bind('mouseout',function(){
            var _this = $(this).find("span");
            clearTimeout(timer);
            sleep(_this);
        });

        function start(_this,width,timer){
            _this.stop(true).animate({"margin-left":width},timer);
        }

        function sleep(_this){
            _this.stop(true).animate({"margin-left":0},1000);
        }
    }
})(jQuery);

/*
* 背景延迟加载
* */
(function ($) {
    $.fn.lazybg = function(option){
        var obj = $.extend({
            distance: 0
        },option),
        win = $(window),
        eScroll = win.scrollTop(),
        eSize = win.height(),
        domSize = eScroll + eSize,
        len = this.length,
        imgs = this;

        var imgSrc = [],imgoffset = [];

        for(var i=0; i<imgs.length;i++){
            var img = imgs[i];
            imgoffset.push($(img).offset().top);
            imgSrc.push($(img).attr("data-lazy"));
        }

        carry();

        win.scroll(function(){
            eScroll = win.scrollTop();
            domSize = eScroll + eSize;
            // 运行
            carry();
        });

        function carry(){
            for(var i in imgoffset){
                action(i);          
            }
        }

        function action(n){
            if(imgoffset[n]>=eScroll-obj.distance&&imgoffset[n]<=domSize+obj.distance){ 
                if($(imgs[n]).css('background-image') == "none"){
                    $(imgs[n]).css("background","url("+imgSrc[n]+") top center no-repeat");
                }
            }
        }

    }
})(jQuery);

/*
* 点击波特效
* */
(function($) {
  "use strict";
  var namespace = "rippler";
  var methods = {
    init: function(options) {
      options = $.extend({
        effectClass: "rippler-effect",
        effectSize: 16,
        addElement: "div",
        duration: 600,
        svgSrc: "circle.svg"
      }, options);
      methods.includeStyleElement(options);
      return this.each(function() {
        var _this = this;
        var $this = $(this);
        var data = $this.data(namespace);
        if (!data) {
          options = $.extend({}, options);
          $this.data(namespace, {
            options: options
          });
          if (typeof document.ontouchstart != "undefined") {
            $this.on("touchstart." + namespace, function(event) {
              var $self = $(this);
              methods.elementAdd.call(_this, $self, event);
            });
            $this.on("touchend." + namespace, function(event) {
              var $self = $(this);
              methods.effect.call(_this, $self, event);
            });
          } else {
            $this.on("mousedown." + namespace, function(event) {
              var $self = $(this);
              methods.elementAdd.call(_this, $self, event);
            });
            $this.on("mouseup." + namespace, function(event) {
              var $self = $(this);
              methods.effect.call(_this, $self, event);
            });
          }
        }
      });
    },
    template: function(options) {
      var $this = $(this);
      options = $this.data(namespace).options;
      var element;
      var svgElementClass = "rippler-svg";
      var divElementClass = "rippler-div";
      var circle = '<circle cx="' + options.effectSize + '" cy="' + options.effectSize + '" r="' + options.effectSize / 2 + '">';
      var svgElement = '<svg class="' + options.effectClass + " " + svgElementClass + '" xmlns="http://www.w3.org/2000/svg" viewBox="' + options.effectSize / 2 + " " + options.effectSize / 2 + " " + options.effectSize + " " + options.effectSize + '">' + circle + "</svg>";
      var divElement = '<div class="' + options.effectClass + " " + divElementClass + '"></div>';
      if (options.addElement === "svg") {
        element = svgElement;
      } else {
        element = divElement;
      }
      return element;
    },
    elementAdd: function($self, event, options) {
      var _this = this;
      var $this = $(this);
      options = $this.data(namespace).options;
      $self.append(methods.template.call(_this));
      var $effect = $self.find("." + options.effectClass);
      var selfOffset = $self.offset();
      var eventX = methods.targetX.call(_this, event);
      var eventY = methods.targetY.call(_this, event);
      $effect.css({
        width: options.effectSize,
        height: options.effectSize,
        left: eventX - selfOffset.left - options.effectSize / 2,
        top: eventY - selfOffset.top - options.effectSize / 2
      });
      return _this;
    },
    effect: function($self, event, options) {
      var _this = this;
      var $this = $(this);
      options = $this.data(namespace).options;
      var $effect = $("." + options.effectClass);
      var selfOffset = $self.offset();
      var thisW = $this.outerWidth();
      var thisH = $this.outerHeight();
      var effectMaxWidth = methods.diagonal(thisW, thisH) * 2;
      var eventX = methods.targetX.call(_this, event);
      var eventY = methods.targetY.call(_this, event);
      $effect.css({
        width: effectMaxWidth,
        height: effectMaxWidth,
        left: eventX - selfOffset.left - effectMaxWidth / 2,
        top: eventY - selfOffset.top - effectMaxWidth / 2,
        transition: "all " + options.duration / 1e3 + "s ease-out"
      });
      return methods.elementRemove.call(_this);
    },
    elementRemove: function(options) {
      var _this = this;
      var $this = $(this);
      options = $this.data(namespace).options;
      var $effect = $("." + options.effectClass);
      setTimeout(function() {
        $effect.css({
          opacity: 0,
          transition: "all " + options.duration / 1e3 + "s ease-out"
        });
        setTimeout(function() {
          $effect.remove();
        }, options.duration * 1.5);
      }, options.duration);
      return _this;
    },
    targetX: function(event) {
      var e = event.originalEvent;
      var eventX;
      if (typeof document.ontouchstart != "undefined") {
        eventX = e.changedTouches[0].pageX;
      } else {
        eventX = e.pageX;
      }
      return eventX;
    },
    targetY: function(event) {
      var e = event.originalEvent;
      var eventY;
      if (typeof document.ontouchstart != "undefined") {
        eventY = e.changedTouches[0].pageY;
      } else {
        eventY = e.pageY;
      }
      return eventY;
    },
    diagonal: function(x, y) {
      if (x > 0 && y > 0) return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)); else return false;
    },
    destroy: function() {
      return this.each(function() {
        var $this = $(this);
        $(window).unbind("." + namespace);
        $this.removeData(namespace);
      });
    },
    includeStyleElement : function(options){
      var style = document.createElement("style");
      
      var styles = ".rippler { position: relative;overflow: hidden;cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;}"+
".rippler:focus,"+
".rippler:active {outline: none;}"+
".rippler::-moz-focus-inner {border: 0;}"+
".rippler-button {display: inline-block;}"+
".rippler-img {display: block;}"+
".rippler-circle-mask {border-radius: 50%;-webkit-mask: url("+options.svgSrc+") no-repeat;-webkit-mask-size: 100%;}"+
".rippler-effect {position: absolute;opacity: .2;}"+
".rippler-default .rippler-svg {fill: #fff;}"+
".rippler-inverse .rippler-svg {fill: #000;}"+
".rippler-bs-default .rippler-svg {fill: #000;}"+
".rippler-bs-inverse .rippler-svg {fill: #000;}"+
".rippler-bs-primary .rippler-svg {fill: #428bca;}"+
".rippler-bs-info .rippler-svg {fill: #5bc0de;}"+
".rippler-bs-success .rippler-svg {fill: #5cb85c;}"+
".rippler-bs-warning .rippler-svg {fill: #ed9c28;}"+
".rippler-bs-danger .rippler-svg {fill: #d2322d;}"+
".rippler-div {border-radius: 50%;}"+
".rippler-default .rippler-div {background-color: #fff;}"+
".rippler-inverse .rippler-div {background-color: #000;}"+
".rippler-bs-default .rippler-div {background-color: #000;}"+
".rippler-bs-inverse .rippler-div {background-color: #000;}"+
".rippler-bs-primary .rippler-div {background-color: #428bca;}"+
".rippler-bs-info .rippler-div {background-color: #5bc0de;}"+
".rippler-bs-success .rippler-div {background-color: #5cb85c;}"+
".rippler-bs-warning .rippler-div {background-color: #ed9c28;}"+
".rippler-bs-danger .rippler-div {background-color: #d2322d;}";
      style.id = "ue_rippler";
      (document.getElementsByTagName("head")[0] || document.body).appendChild(style);   
      if (style.styleSheet) { //for ie   
        style.styleSheet.cssText = styles;   
      } else {//for w3c   
        style.appendChild(document.createTextNode(styles));
      }
    }
  };
  $.fn.rippler = function(method) {
    var isIE = /msie/i.test(navigator.userAgent);
    if(!isIE){
      if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
      } else if (typeof method === "object" || !method) {
        return methods.init.apply(this, arguments);
      } else {
        $.error("Method " + method + " does not exist on jQuery." + namespace);
      }
    };
  }
})(jQuery);

// 图片自适应尺寸
(function ($) {
    $.fn.cutImg = function(object){
        var defaults = $.extend({},object);
        
        $(this).each(function(){

            /*
                获取原始外层高宽大小和原始图片高宽大小
            */
            proto = {
                Width : parseInt($(this).width()),
                Height : parseInt($(this).height()),
                imgWidth : parseInt($(this).find("img").width()),
                imgHeight : parseInt($(this).find("img").height())
            }
            var index = $(this);

            // ratioWidth , ratioHeight 分别为高的比例和宽的比例

            proto.ratioWidth = proto.imgWidth/(proto.imgWidth + proto.imgHeight);
            proto.ratioWidth = proto.ratioWidth.toFixed(2) * 1;
            proto.ratioHeight = proto.imgHeight/(proto.imgWidth + proto.imgHeight);
            proto.ratioHeight = proto.ratioHeight.toFixed(2) * 1;

            var obj = new start(proto,index);   
        });

    }

    function start(proto,index){
        //console.log(proto);

        var _this = this;

        /*
            经过调整后的高宽和需要调整的边距
        */

        // 当原始图片高宽都大于外层高宽时
        if(proto.imgWidth>proto.Width && proto.imgHeight>proto.Height){
            //console.log(1)
            proto.iWidth = proto.imgWidth;
            proto.iHeight = proto.imgHeight;
            proto.ml = parseInt((proto.iWidth - proto.Width)/2);
            proto.mt = parseInt((proto.iHeight - proto.Height)/2);
        }

        if(proto.imgWidth < proto.Width && proto.imgHeight < proto.Height && proto.Width == proto.Height && proto.imgWidth == proto.imgHeight){
            proto.iWidth = proto.Width;
            proto.iHeight = proto.Height;
            proto.ml = parseInt((proto.iWidth - proto.Width)/2);
            proto.mt = parseInt((proto.iHeight - proto.Height)/2);
        }

        // 算法 : 现在的宽 / 宽度的比例 - 现在的宽度
        /*
            图片的宽高,框架的宽高分别为 imgW,imgH,w,h
            1/  imgW < w , imgH > h
            2/  imgW <= w , imgH <= h , imgW <= imgH , w > h 
            3/  imgW <= w , imgH <= h , imgW > imgh , w < h
            4/  imgW <= w , imgH <= h , imgW == imgh , w > h
        */        
        if( (proto.imgWidth<proto.Width && proto.imgHeight>proto.Height) || (proto.imgWidth<=proto.Width && proto.imgHeight<=proto.Height && proto.imgWidth<=proto.imgHeight && proto.Width > proto.Height) || (proto.imgWidth<=proto.Width && proto.imgHeight<=proto.Height && proto.imgWidth>=proto.imgHeight  && proto.Width < proto.Height) || (proto.imgWidth<=proto.Width && proto.imgHeight<=proto.Height && proto.imgWidth==proto.imgHeight && proto.Width > proto.Height)){
            proto.iWidth = proto.Width;
            proto.iHeight = parseInt(proto.iWidth / proto.ratioWidth - proto.iWidth);
            proto.ml = 0;
            proto.mt = parseInt((proto.iHeight - proto.Height)/2);  
        }

        // 算法 : 现在的高 / 高度的比例 - 现在的高度
        /*
            图片的宽高,框架的宽高分别为 imgW,imgH,w,h
            1/  imgW > w , imgH < h
            2/  imgW <= w , imgH <= h , imgW < imgH , w < h 
            3/  imgW <= w , imgH <= h , imgW >= imgh , w > h
        */
        if( (proto.imgWidth>proto.Width && proto.imgHeight<proto.Height) || (proto.imgWidth<=proto.Width && proto.imgHeight<=proto.Height && proto.imgWidth<=proto.imgHeight  && proto.Width < proto.Height)  || (proto.imgWidth<=proto.Width && proto.imgHeight<=proto.Height && proto.imgWidth>proto.imgHeight && proto.Width > proto.Height)){
            //console.log("s2")
            proto.iHeight = proto.Height;
            proto.iWidth = parseInt(proto.iHeight / proto.ratioHeight - proto.iHeight);
            proto.ml = parseInt((proto.iWidth - proto.Width)/2);
            proto.mt = 0;
        }
        _this.methods(proto,index);
    }

    start.prototype.methods = function(proto,index){
        index.find("img").css({
            "width":proto.iWidth,
            "height":proto.iHeight,
            "marginLeft":-proto.ml,
            "marginTop":-proto.mt
        });
    }
})(jQuery);

// 滚动
(function ($) {

  $.fn.iWheel = function(object){
    var defult = {
      i : 0,   // 外部动态控制滚动值
      rep : false,   // 是否能够重复多次运行
      methodL : null , // 方法向左或者向上 为减少
      methodR : null // 方法向右或者向下 为增加
    }
    var obj = $.extend({},defult,object);
    var all = {
      noFirfox : 0,
      timer : null
    }
    
    // 判断是否火狐浏览器
    if(navigator.userAgent.indexOf("Firefox")>0){
      document.addEventListener('DOMMouseScroll',wheelStart,false);
      all.noFirfox = 0;   
    }else{
      window.onmousewheel=document.onmousewheel=wheelStart;
      all.noFirfox = 1;
    }

    function wheelStart(e){
      e = e || window.event;
      (all.noFirfox == 1) ? e = e.wheelDelta : e = e.detail;
      //console.log(e)
      if(obj.rep){
        if(all.timer) clearTimeout(all.timer);
        all.timer = setTimeout(function(){
          all.timer = false;
          wheelMethod(e);
        },300);
      }else{
        wheelMethod(e);
      }
    }

    /*
    **** 根据获取的数值来判断是向上还是向下

    **** 谷歌或其他浏览器:
        向下滚动获取的值是-120
        想上滚动获取的值是120
    **** firfox浏览器:
        向下滚动获取的值是3
        想上滚动获取的值是-3       
    */
    function wheelMethod(e){
      if(all.noFirfox == 1){
        if(e < 0){
          obj.methodR();
        }
        if(e > 0){
          obj.methodL();
        }
      }
      if(all.noFirfox == 0){
        if(e > 0){
          obj.methodR();
        }
        if(e < 0){
          obj.methodL();
        }
      }
    }
  }

})(jQuery);

/*
  图片加载组件  需要调整_load对象没有用处  url参数也可以去掉
 */
(function ($) {
  $.fn.imgLoad = function(obj){
    var _load = $(this);
    var defult = $.extend({
      url: [],
      callback: function(){}
    },obj);
    
    _load.each(function(){
      if($(this).attr("src") && $(this).attr("src") != ""){
      	defult.url.push($(this).attr("src"));
      }
    });

    var num = 0, len = defult.url.length;

    for(var i in defult.url){
      var _this = defult.url[i];
      var img = new Image();
      img.src = _this;
      if(img.complete){
        _imgload();
      }else{
        img.onload = function(){
          _imgload();
        }
      }
    }

    function _imgload(){
      num ++ ;
      if(num == len){
        defult.callback();
      }
    }
  }
})(jQuery);

/*
幻灯片切换
 */
(function ($) {
/*
  切换效果----参数
  timer---控制定时器时间,默认为空
  events---事件控制切换,默认为click
*/
    $.fn.iswitch = function(object){
        $(this).each(function(){
            var id = $(this).attr("id");
            var index = $(this);
            $(this)._switch(id,index,object);
        });
    };

    $.fn._switch = function(id,index,object){
        var defults = {
            timer:false,
            move:false
        };
        var obj = $.extend({},defults,object);

        var timmer,i=0;
        var _this = $('ul[name=#'+id+']');
        var w =_this.find("li").width();
        var num = index.find("a").length;

        //判断是左右滚动还是
        if(obj.move){
            _this.width(w*num);
        }else{
            _this.find("li").hide().eq(0).show();
        }

        if(obj.timer){
            obj.timer = obj.timer*1000;
            timmer = setInterval(function(){
                start();
            },obj.timer);
        }

        function start(){
            if(i>=num-1){
                i = 0;
                Move(0);
            }else{
                i++;
                Move(-w*i);
            }
            index.find("a").removeClass("selected").eq(i).addClass("selected");
        }

        function Move(sum){
            if(!obj.move){
                _this.find("li").filter(":eq("+i+")").siblings("li").stop(true,true).fadeOut();
                _this.find("li").filter(":eq("+i+")").fadeIn();
            }else{
                _this.stop(true,true).animate({"left":sum});
            }
        }

        index.find("a").mouseover(function(){
            clearInterval(timmer);
            ind = $(this).index();
            i = ind;
            $(this).addClass("selected").siblings().removeClass("selected");
            Move(-w*i)
        });

        index.find("a").mouseout(function(){
            if(obj.timer){
                timmer = setInterval(function(){
                    start();
                },obj.timer);
            }
        });
    }
})(jQuery);

// 帧动画播放
(function ($) {
  $.fn.imgAnimation = function(obj){
    var _this = $(this);
    var defult = $.extend({
      width: 0,
      height: 0,
      act: 1,  //图片播放个数
      time: 100,  //播放时间
      num: true //播放次数，true为循环播放
    },obj);
    
    var i = 0, n = 0
    init(defult);
    function init(defult){
      var timer = setInterval(function(){
        if(i<defult.act){
          i++;
        }else{
          if(defult.num == true){
            i=1;
          }else{
            if(n< defult.num-1){
              n++;
              i=1;
            }else{
              clearInterval(timer);
            }
          }
        }
        var t = i-1;
        _this.css('backgroundPosition','0 '+-t*defult.height+'px')
      },defult.time);
    }
  }
})(jQuery);

//帧动画播放（仅限于背景图片，为兼容IE7及以上版本而存在）
/** 
 * 此处会返回两个方法，开始和停止，用于外部控制调用
 * @param  {[height]}  单个元素的高度（若为字符串格式，则在元素内进行查找）
 * @param {[act]}      图片播放总个数（若为字符串格式，则在元素内进行查找）
 * @param {[time]}     播放时间（若为字符串格式，则在元素内进行查找）
 * @param {[num]}      播放次数
 *
 * @return {[timer]}  返回当前是否正在执行
 * @return {[start]}  返回正在执行的方法
 * @return {[stop]}  返回停止执行的方法
 */
(function ($) {
  $.fn.bgAnimation = function(obj){
    var defult = $.extend({
      height: 0,
      act: 1,  //图片播放个数 
      time: 100,  //播放时间
      num: true //播放次数，true为循环播放
    },obj);

    var callback = [];

    var isIE6 = /msie 6/i.test(navigator.userAgent);
    if(isIE6) return;
    $(this).each(function(){
      callback.push(new bg_start($(this)));
    });

    function bg_start(i){
      var _this = this;
      var n = 0;
      _this.act = isString(i,defult.act);
      _this.h = isString(i,defult.height);
      _this.time = isString(i,defult.time);

        var call = {
            timer: null,
            stop: function(){
                clearInterval(call.timer);
                i.css('backgroundPosition','0 0');
                call.timer = null;
            },
            start: function(){
                if(call.timer) return;
                call.timer = setInterval(function(){
                    if(n<_this.act-1){
                        n++;
                    }else{
                        n = 0;
                    }
                    i.css('backgroundPosition','0 '+-n*_this.h+'px');
                },_this.time);
            }
        }

        call.start();

        return call;
    }

    function isString(i,str){ 
    	return (typeof str=='string') ? i.data(str) : defult.act;
  	}

    return callback;
  }
})(jQuery);

/*
图片延迟加载插件，并且返回控制显示方法，使外面可以控制内部显示
 */
(function ($) {

  $.fn.lazyImg = function(object){
    var obj = $.extend({
      vertical : true,  // 垂直滚动
      scroll : 100
    },object);

    var one = false;
    var e = $(window),
    eScroll = (obj.vertical ? e.scrollTop() : e.scrollLeft()) - obj.scroll,
    eSize = obj.vertical ? e.height() : e.width(),
    domSize = eScroll + eSize + obj.scroll,
    len = $(this).length,
    imgs = $.makeArray( $(this) );

    var imgSrc = [],imgScroll = [],n = [],hide = [];

    /*初始化*/
    if(!one){
      for(var i=0; i<imgs.length;i++){
        var img = imgs[i];
        imgScroll.push($(img).offset().top)
        imgSrc.push($(img).attr("lazy"));
        if($(imgs[i]).is(":visible")){
          if(imgScroll[i]>eScroll&&imgScroll[i]<domSize){
            action(i);
          }
        }
      }
      one = true;
    }

    e.scroll(function(){
      actionStrat();
    });

    function actionStrat(){
      eScroll = (obj.vertical ? e.scrollTop() : e.scrollLeft()) - obj.scroll;
      domSize = eScroll + eSize + obj.scroll;
      for(var i in imgScroll){
        if($(imgs[i]).is(":visible")){
          if(imgScroll[i]>eScroll&&imgScroll[i]<domSize){
            action(i);
          }
        }
      }
    }

    function action(n){
      if(imgs[n].src.indexOf(imgSrc[n]) ==-1){
        //console.log(imgs[n].src+" "+imgSrc[n])
        imgs[n].src = imgSrc[n];
        $(imgs[n]).hide().fadeIn();
      }
    }

    return actionStrat;

  }

})(jQuery);

// 雪花飘落组件
(function ($) {
    $.fn.snow = function(option){
        var obj = $.extend({
          width: 84, //雪花宽度
          height: 91, //雪花宽度
          src: 'http://ossweb-img.qq.com/images/qqgame/act/a20151215sd/xue.png',//雪花地址
            maxHeight:false   //取固定值
        },option);
        var _this = $(this);
        var num = 0,
         _class = $(this).attr("class"),
         _w = parseInt($(this).width());
        if(!obj.maxHeight) obj.maxHeight = parseInt($(this).height()) + 200;
        var cssStr = "."+_class+" i{display: block;width: "+obj.width+"px;height: "+obj.height+"px;position: absolute;background:url("+obj.src+") no-repeat;top:-91px;animation:iTop 0s linear;}"+
        "@keyframes iTop{0%{transform:translateY(0) scale(0.2) rotate(0deg);}100%{transform:translateY("+obj.maxHeight+"px) scale(1) rotate(360deg);}}";
        includeStyleElement(cssStr,"");

    var isIE = /msie/i.test(navigator.userAgent);
    if(!isIE){
        // 雪花飘落
      setInterval(function(){
          var start_timer = parseFloat((Math.random()*(0.5-3)+3).toFixed(1));
          var stop_timer = parseInt((Math.random()*(0.5-3)+3)*10);
          var scale = parseFloat(Math.random().toFixed(1));
          var opacity = parseFloat(Math.random().toFixed(1));
          var iLeft = parseFloat((Math.random()*_w).toFixed(1));
          new ixue(start_timer,stop_timer,scale,iLeft,opacity);
      },300);
    }
    // 添加CSS方法
    function includeStyleElement(styles,styleId) {   
      if (document.getElementById(styleId)) {   
        return false;
      }   

      var style = document.createElement("style");
      style.id = styleId;   
      (document.getElementsByTagName("head")[0] || document.body).appendChild(style);   
      if (style.styleSheet) { //for ie   
        style.styleSheet.cssText = styles;   
      } else {//for w3c   
        style.appendChild(document.createTextNode(styles));
      }
    } 

    // 添加雪花元素
    function ixue(start_timer,stop_timer,scale,iLeft,opacity){
          num++;
          var i = '<i class="x'+num+'" style="transform:scale('+scale+');left:'+iLeft+'px;opacity:'+opacity+';animation-duration:'+stop_timer+'s;animation-delay:'+start_timer+'s;"></i>';
          _this.append(i);
          new clear(stop_timer,num);
      }
      // 雪花关闭
      function clear(stop_timer,num){
          setTimeout(function(){
              $(".x"+num).remove();
          },stop_timer*1000);
      }
    }
})(jQuery);

/**
 * 多图轮播 
 */
(function($){
  $.fn.imglist = function(obj){
    var d = $.extend({
      iprev: false,  //上一页按钮
      inext: false,  //下一页按钮
      min_len: 0,   //能够显示的个数
      max_len: 0,    //最大的个数
      width: 0       //单个滚动宽度
    },obj);
    d.el = $(this);
    var i = 0,  //记录
        max_i = parseInt(d.max_len/d.min_len),  //总共页数
        remainder = d.max_len%d.min_len,  // 余数
        _width = d.min_len * d.width; //每屏滚动跨度
    d.iprev.click(function(){
      scrollPrev();
    });
    d.inext.click(function(){
      scrollNext();
    });

    // 上一页
    function scrollPrev(){
      i--;
      _len = d.max_len - d.min_len;
      //console.log(i)
      if(i<0){
        i = max_i;
        d.el.animate({"left":-_len*d.width});
      }else if(i == 0){
        d.el.animate({"left":0});
      }else{
        d.el.animate({"left":-i*_width});
      }
    }
    // 下一页
    function scrollNext(){
      i++;
      if(remainder != 0){
        if(i< max_i){
          d.el.animate({"left":-i*_width});
        }else if(i == max_i){
          var _w = (i-1)*_width+remainder*d.width;
          d.el.animate({"left":-_w});
        }else{
          i= 0;
          d.el.animate({"left":0});
        }
      }else{
        if(i<= max_i-1){
          d.el.animate({"left":-i*_width});
        }else{
          i= 0;
          d.el.animate({"left":0});
        }
      }
    }
  }
})(jQuery);

/*
  图片分屏加载
 */
(function ($) {

  $.fn.pageLazy = function(obj){
    var m = {};
    var defult = $.extend({
      img: ".lazy",   // 加载
      attr: "lazy",
      id: 0,
      callback: function(){}
    },obj);

    var _this = $(this);
    pageload(defult.id);

    // callback由外部传入参数
    function pageload(id,callback){
      if(callback) defult.callback = callback;
      // console.log(callback)
      m.el = _this.eq(id);
      m.imgs = $.makeArray(m.el.find(defult.img));
      m.judge = false;
      m.num = 0;
      m.len = m.imgs.length;
      pageload_start();
    }

    function pageload_start(){
      for(var i in m.imgs){
          var _src = $(m.imgs[i]).attr(defult.attr);
          var img = new Image();
          img.src = _src;
          
            new load_win(img,_src,i);         
        }
    }

    function load_win($img,$src,$i){
      if($img.complete){
        load_fun($src,$i);
      }else{
        $img.onload = function(){
          load_fun($src,$i);
        }
      }
    }

    function load_fun($src,$i){
        // console.log(src);
        // console.log(m.imgs[i]);
      $(m.imgs[$i]).attr("src",$src);

      m.num ++ ;
      if(m.num == m.len){
        defult.callback();
        m.judge = true;
        // console.log('成功');
      }
    }

    return {
      callback: pageload
    };
  }

})(jQuery);

/*
	SVG线条动画	
*/
(function ($) {

	$.fn.svganimations = function(obj){
		var defult = $.extend({
			duration: 'duration',   //获取对应path动画时间 "data-duration"
			timing: 'timing',       //获取对应path动画变换速率 "data-timing"
			delay: 'delay'          //获取对应path动画延迟时间 "data-delay"
		},obj);

		var SVGEl = {
			init: function(el,index){
				this.el = index ? el.eq(index-1) : el;
				this.draw();
			},
			draw: function(){
				var _this = this;
				_this.el.find('path').each(function(){
					var _el = $(this);
					var l = _el[0].getTotalLength();
					var duration = _el.data('duration') ? _el.data('duration') : 0;
					var timing = _el.data('timing') ? _el.data('timing') : 'linear';
					var delay = _el.data('delay') ? _el.data('delay') : 0;
					
					// 添加CSS
					_el.css({
						'stroke-dasharray': l+" "+l,
						'stroke-dashoffset': l,
						'-webkit-transition': 'none',
						'-moz-transition': 'none',
						'visibility': 'visible'
					});

					//浏览器触发布局及样式计算
					//动画前获取起始位置
					_el[0].getBoundingClientRect();

					_el.css({
						'-webkit-transition': 'stroke-dashoffset ' + duration + 's ' + timing + ' ' + delay + 's',
						'-moz-transition': 'stroke-dashoffset ' + duration + 's ' + timing + ' ' + delay + 's',
						'stroke-dashoffset': 0
					});
				});
			}
		}

		var isIE = /msie/i.test(navigator.userAgent);
		if(isIE) return false;

		$(this).each(function(){
			var el = $(this);
			SVGEl.init(el,false);
		});

	 	return SVGEl;
	}

})(jQuery);