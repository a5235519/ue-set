/*
Vlight JS Code Highlight (Style from Visual Studio 2010)
Version 0.4
Vejis JavaScript Library 0.0.0.5 is needed.

By Vilic Vane
http://www.vilic.info/

?2010 Groinup Studio
All rights reserved.

Redistribution and use in source and binary forms,
with or without modification, are permitted provided
that the following conditions are met:
Redistributions of source code must retain the above
copyright notice, this list of conditions and the
following disclaimer.
Redistributions in binary form must reproduce the
above copyright notice, this list of conditions and
the following disclaimer in the documentation and/or
other materials provided with the distribution.
Neither the name of the Groinup Studio nor the names
of its contributors may be used to endorse or promote
products derived from this software without specific
prior written permission.
*/

vejis.ready(function () {
    var className = 'vlight', //自定义类名
        maxLineCount = 15, //最多同时显示的行数
        lineHeight = 16, //行高
        scrollBarWidth = 24, //预计滚动条宽度
        cssText = //CSS内容
        'div.vlight { position: relative; margin: 5px 0px; border: solid 1px #FFF3D0; line-height: ' + lineHeight + 'px; color: #000000; font-size: 12px; font-family: Courier New, monospace; white-space: nowrap; overflow: hidden; }' +
        'div.vlight div.vlight_top { height: 5px; background-color: #FFE8A6; font-size: 0px; }' +
        'div.vlight div.vlight_left { position: absolute; width: 65px; left: 0px; text-align: right; color: #2B91AF; overflow: hidden; }' +
        'div.vlight div.vlight_left div { position: relative; width: 40px; left: 0px; padding-right: 5px; border-left: solid 16px #F0F0F0; border-right: solid 4px #6CE26C; }' +
        'div.vlight div.vlight_main { position: relative; margin-left: 65px; padding-left: 5px; overflow-x: scroll; overflow-y: auto; }' +
        'div.vlight span.vlight_cm { color: #008000; }' +
        'div.vlight span.vlight_re { color: #000000; }' +
        'div.vlight span.vlight_st { color: #800000; }' +
        'div.vlight span.vlight_ky { color: #0000FF; }' +
        'div.vlight span.vlight_mk { color: #0000FF; }' +
        'div.vlight span.vlight_lb { color: #800000; }' +
        'div.vlight span.vlight_vn { color: #FF0000; }' +
        'div.vlight span.vlight_vl { color: #0000FF; }' +
        'div.vlight span.vlight_sl { color: #800000; }' +
        'div.vlight span.vlight_bl { color: #0000FF; }' +
        'div.vlight span.vlight_cn { color: #FF0000; }' +
        'div.vlight span.vlight_cv { color: #0000FF; }';

    cssText = cssText.replace(/vlight/g, className); //替换类名
    vejis.html.createStyleSheet(cssText); //创建样式

    var eles = vejis.html.getElementsByClassName(className); //获取元素
    var spanl = '<span class="' + className + '_', //初始化标签
        spanm = '">',
        spanr = '</span>';

    //处理每一个类名符合的元素
    vejis.foreach(eles, function (ele) {
        var div = document.createElement('div');
        div.className = className;
        div.innerHTML =
        '<div class="' + className + '_top"></div>' +
        '<div class="' + className + '_left"></div>';

        var top = div.childNodes[0],
            left = div.childNodes[1];

        var main = document.createElement('div');
        main.className = className + '_main';

        var oText;
        if (ele.tagName == 'TEXTAREA') oText = ele.value; //如果是textarea则直接取value
        else if (ele.tagName == 'PRE') oText = ele.innerText || ele.innerHTML;
        else oText = htmlToText(ele.innerHTML);

        var text;

        if (/^\s*</.test(oText)) text = convertHTML(oText);
        else {
            var temp = oText.replace(/(\/\*[\s\S]*?\*\/)/g, '').replace(/((['"])(\2|.*?([^\\]\2|\\\\\2)))/g, '');

            var cssKeysCount = (temp.match(/[\w.#]+\s*{[\s\S]*?}/g) || []).length;
            var jsKeysCount = (temp.match(/(^|[^\w])(var|for|if|else|function)[^\w]|=|\+/g) || []).length;

            text = cssKeysCount > jsKeysCount ? convertCSS(oText) : convertJS(oText);
        }

        var result = finalDeal(text); //转换文本到高亮的HTML

        main.innerHTML = result.html;
        div.appendChild(main);

        //创建行号
        var lines = ''
        for (var i = 1; i <= result.count; i++)
            lines += i + '<br />';
        left.innerHTML = '<div>' + lines + '</div>';

        //将原来的元素替换成代码高亮区域
        ele.parentNode.replaceChild(div, ele);

        //设置高宽
        left.style.height = main.style.height = lineHeight * (result.count > maxLineCount ? maxLineCount : result.count) + scrollBarWidth + 'px';
        left.childNodes[0].style.height = result.count * lineHeight + scrollBarWidth + 'px';

        //绑定事件
        vejis._event.add(window, 'resize', resize);
        vejis._event.add(main, 'scroll', scroll);

        resize(); //初始化

        function resize() {
            try {
                main.style.width = top.offsetWidth - left.offsetWidth - 5 + 'px';
            } catch (e) { }
        }

        function scroll() {
            left.childNodes[0].style.marginTop = -main.scrollTop + 'px';
        }
    });

    function htmlToText(html) {
        return html.replace(/\r?\n/g, '').replace(/<p(\s[^>]*)?>([\s\S]*?)<\/p>/gi, '$2\r\n\r\n').replace(/<div(\s[^>]*)?>([\s\S]*?)<\/div>/gi, '$2\r\n').replace(/<([a-z]+)(\s[^>]*)?>([\s\S]*?)<\/\1>/gi, '$3').replace(/<br[^>]*>/gi, '\r\n').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
    }

    function textToHTML(text) {
        return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function convertHTML(text) {
        var globalRE = /(<!\-\-[\s\S]*?\-\->)|(<script(\s[^>]*)?>[\s\S]*?<\/script>)|(<style(\s[^>]*)?>[\s\S]*?<\/style>)|(<(!doctype|\/?[a-z-_]+)([^>]*)>)/ig;

        var cmRE = /^<!\-\-[\s\S]*?\-\->$/;
        var scRE = /^(<script(\s[^>]*)?>)([\s\S]*?)(<\/script>)$/i;
        var stRE = /^(<style(\s[^>]*)?>)([\s\S]*?)(<\/style>)$/i;
        var otRE = /^<(!doctype|\/?[a-z-_]+)([^>]*)>$/i;

        var nlRE = /^(<[!\/]?)([a-z-_]+)([^>]*?(?=[\/>]))(\/?>)$/i;

        var vlGlobalRe = /[a-z_]+\s*=\s*(".*?("|(?=$))|'.*?('|(?=$))|[^\s]*)|[a-z_]+ *=|[a-z_]+|(".*?("|(?=$))|'.*?('|(?=$)))/gi;

        var vlfRE = /^([a-z_]+)(\s*=\s*)(".*?("|(?=$))|'.*?('|(?=$))|[^\s]*)$/i;
        var vlneRE = /^([a-z_]+)(\s*=)$/i;
        var vlnRE = /^([a-z_]+)$/i;
        var vlvRE = /^(".*?("|(?=$))|'.*?('|(?=$)))$/;

        text = text.replace(/&/g, '&amp;');
        text = text.replace(globalRE, function (s) {
            var parts;
            if (cmRE.test(s))
                return spanl + 'cm' + spanm + textToHTML(s) + spanr;
            if (parts = scRE.exec(s))
                return normalLabel(parts[1]) + convertJS(parts[3]) + normalLabel(parts[4]);
            if (parts = stRE.exec(s))
                return normalLabel(parts[1]) + convertCSS(parts[3]) + normalLabel(parts[4]);
            if (otRE.test(s))
                return normalLabel(s);
        });

        return text;

        function normalLabel(text) {
            var parts = nlRE.exec(text);

            return (
                spanl + 'mk' + spanm + textToHTML(parts[1]) + spanr +
                spanl + 'lb' + spanm + parts[2] + spanr +
                (parts[3] ? a = labelValues(parts[3]) : '') +
                spanl + 'mk' + spanm + textToHTML(parts[4]) + spanr
            );
        }

        function labelValues(text) {
            text = text.replace(vlGlobalRe, function (s) {
                var parts;
                if (parts = vlfRE.exec(s))
                    return (
                        spanl + 'vn' + spanm + parts[1] + spanr +
                        spanl + 'mk' + spanm + parts[2] + spanr +
                        spanl + 'vl' + spanm + parts[3] + spanr
                    );
                if (parts = vlneRE.exec(s))
                    return (
                        spanl + 'vn' + spanm + parts[1] + spanr +
                        spanl + 'mk' + spanm + parts[2] + spanr
                    );
                if (vlnRE.test(s))
                    return spanl + 'vn' + spanm + s + spanr;
                if (vlvRE.test(s))
                    return spanl + 'mk' + spanm + s + spanr;
                return s;
            });

            return text;
        }
    }

    function convertCSS(text) {
        var globalRE = /\/\*[\s\S]*?\*\/|@[a-z-]+[\s\S]*?(;|\{|$)|[^\{\}\s,]+|\{[\s\S]*?\}/gi;

        var cmRE = /^\/\*[\s\S]*?\*\/$/;
        var blRE = /^(@[a-z-]+)([\s\S]*?(;|\{|$))$/i;
        var slRE = /^[^\{\}\s,]+$/;
        var ctRE = /^\{([\s\S]+?)\}$/;
        var csRE = /([a-z-]+)( *:\s*)([\s\S]*?)(;|$)/gi;

        text = textToHTML(text); //符号处理

        //匹配
        text = text.replace(globalRE, function (s) {
            var parts;
            if (cmRE.test(s)) return spanl + 'cm' + spanm + s + spanr;
            if (parts = blRE.exec(s)) return spanl + 'bl' + spanm + parts[1] + spanr + parts[2];
            if (slRE.test(s)) return spanl + 'sl' + spanm + s + spanr;
            if (parts = ctRE.exec(s)) return '{' + cssValues(parts[1]) + '}';
            return s;
        });

        return text;

        function cssValues(text) {
            text = text.replace(csRE, function (s) {
                var parts = arguments;
                return (
                    spanl + 'cn' + spanm + parts[1] + spanr +
                    parts[2] +
                    spanl + 'cv' + spanm + parts[3] + spanr +
                    parts[4]
                );
            })

            return text;
        }

    }

    function convertJS(text) {
        var names = ['cm', 're', 'st', 'ky']; //类名的后缀

        //全局正则表达式
        var globalRE = /((\/\*[\s\S]*?\*\/|\/\/.*)|('('|.*?([^\\]'|\\\\'))|"("|.*?([^\\]"|\\\\")))|\/(\/|.*?([^\\]\/|\\\\\/))[gim]{0,3}|([^\w]|^)(break|delete|function|return|typeof|case|do|if|switch|var|catch|else|in|this|void|continue|false|instanceof|throw|while|debugger|finally|new|true|with|default|for|null|try)(?=[^\w]|$))/g;

        //拆分开的正则表达式
        var res = [
            /^(\/\*[\s\S]*?\*\/|\/\/.*)$/,
            /^\/(\/|.*?([^\\]\/|\\\\\/))[gim]{0,3}$/,
            /^'('|.*?([^\\]'|\\\\'))|"("|.*?([^\\]"|\\\\"))$/,
            /(break|delete|function|return|typeof|case|do|if|switch|var|catch|else|in|this|void|continue|false|instanceof|throw|while|debugger|finally|new|true|with|default|for|null|try)$/
        ];

        text = textToHTML(text); //符号处理

        //匹配
        text = text.replace(globalRE, function (s) {
            for (var i = 0; i < res.length; i++) {
                if (!res[i].test(s)) continue;
                var spanl2m = spanl + names[i] + spanm;

                s = s.replace(res[i], function (s) {
                    return spanl2m + s + spanr; //加标签
                });
                return s;
            }
        });

        return text;
    }

    function finalDeal(text) {
        var count = 1; //行数
        //字符处理
        text = text.replace(/\t/g, '    ').replace(/  /g, '&nbsp; ').replace(/  /g, ' &nbsp;').replace(/(\r?\n)+$/g, '').replace(/\r?\n/g, function () { count++; return '<br />'; });
        return { html: text, count: count };
    }
});