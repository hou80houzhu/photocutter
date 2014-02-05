(function($) {
    $.fn.photocutter = function(option) {
        var ops = {
            dom: this,
            data:{},
            required:true,
            sceneWidth: 800,
            sceneHeight: 600,
            picWidth: 100,
            picHeight: 100,
            rotateoffset: 5,
            zoomoffset: 50,
            jpg: true,
            png: true,
            gif: true,
            size: 5,
            zoomin: true,
            zoomout: true,
            rotateleft: true,
            rotateright: true,
            download: true,
            upload: false,
            reset: true,
            redo: true,
            info: "",
            filename: "file",
            url: "save.php",
            beforeUpload: function() {
                return true;
            },
            initfile:"",
            uploadSuccess: null,
            uploadError: null,
            success:null,
            error:null
        };
        $.extend(ops, option);
        ops.sceneHeight=this.height();
        ops.sceneWidth=this.width();
        ops.size = ops.size * 1024 * 1024;
        return new cutter(this,ops);
    };
    var cutter = function(dom,ops) {
        dom.data("photocutter",this);
        this.dom=dom;
        this.ops=ops;
        dom.empty();
        var scene = ops.dom.scene({
            background: {
                image: "images/bg.png",
                imageType: "repeat"
            },
            mousedown: function(e) {
                e = e.getSpriteLocal(chone);
                if (chone.checkPointIn(e.x, e.y)) {
                    ops.dom.css("cursor", "move");
                    this.ops.ismove = true;
                    this.ops.ox = e.x - chone.x();
                    this.ops.oy = e.y - chone.y();
                }
            },
            mouseup: function() {
                ops.dom.css("cursor", "default");
                this.ops.ismove = false;
            },
            mousemove: function(e) {
                e = e.getSpriteLocal(chone);
                if (this.ops.ismove === true) {
                    var _x = e.x - this.ops.ox;
                    var _y = e.y - this.ops.oy;
                    if (_x > chtwo.x()) {
                        _x = chtwo.x();
                    } else if (_x < chtwo.x() - chone.width() + chtwo.width()) {
                        _x = chtwo.x() - chone.width() + chtwo.width();
                    }
                    if (_y > chtwo.y()) {
                        _y = chtwo.y();
                    } else if (_y < chtwo.y() - chone.height() + chtwo.height()) {
                        _y = chtwo.y() - chone.height() + chtwo.height();
                    }
                    chone.x(_x);
                    chone.y(_y);
                    scene.draw();
                }
            }
        });
        var ksprite = $.sprite({
            name: "ksprite",
            x: 0,
            y: 0,
            width: ops.sceneWidth,
            height: ops.sceneHeight
        });
        _ch = Math.sqrt(ops.sceneWidth * ops.sceneWidth + ops.sceneHeight * ops.sceneHeight);
        var rsprite = $.sprite({
            name: "rsprite",
            x: (ops.sceneWidth - _ch) / 2,
            y: (ops.sceneHeight - _ch) / 2,
            width: _ch,
            height: _ch
        }).rotatePoint(ops.sceneWidth / 2, ops.sceneHeight / 2);
        var chone = $.sprite({
            name: "chone",
            width: ops.sceneWidth,
            height: ops.sceneHeight,
            x: (rsprite.width() - ops.sceneWidth) / 2,
            y: (rsprite.height() - ops.sceneHeight) / 2,
            background: {
                color: "rgba(102,102,102,0)"
            }
        }).rotatePoint(rsprite.width() / 2, rsprite.height() / 2);
        var chtwo = $.sprite({
            name: "chtwo",
            width: ops.picWidth,
            height: ops.picHeight,
            x: (rsprite.width() - ops.picWidth) / 2,
            y: (rsprite.height() - ops.picHeight) / 2,
            background: {
                color: "rgba(66,54,48,0.1)"
            }
        });
        var mask = $.sprite({
            name: "chtwo",
            width: ops.picWidth,
            height: ops.picHeight,
            x: (ops.sceneWidth - ops.picWidth) / 2,
            y: (ops.sceneHeight - ops.picHeight) / 2,
            border: {
                width: 2,
                color: "white"
            },
            background: {
                color: "rgba(255,255,255,0.1)"
            },
            shadow: {
                color: "#030303",
                offsetX: 3,
                offsetY: 3,
                blur: 10
            }
        });
        var left = $.sprite({
            x: 0,
            y: 0,
            width: (ops.sceneWidth - ops.picWidth) / 2,
            height: ops.sceneHeight,
            background: {
                color: "rgba(0,0,0,0.5)"
            }
        });
        var right = $.sprite({
            x: left.width() + ops.picWidth,
            y: 0,
            width: left.width(),
            height: left.height(),
            background: {
                color: "rgba(0,0,0,0.5)"
            }
        });
        var top = $.sprite({
            x: left.width(),
            y: 0,
            width: ops.picWidth,
            height: (ops.sceneHeight - ops.picHeight) / 2,
            background: {
                color: "rgba(0,0,0,0.5)"
            }
        });
        var bottom = $.sprite({
            x: left.width(),
            y: top.height() + ops.picHeight,
            width: top.width(),
            height: top.height(),
            background: {
                color: "rgba(0,0,0,0.5)"
            }
        });
        var bg = $.sprite({
            x: 0,
            y: 0,
            width: ops.sceneWidth,
            height: ops.sceneHeight
        });

        bg.appendChild(left).appendChild(top).appendChild(right).appendChild(bottom).appendChild(mask);
        rsprite.appendChild(chtwo).appendChild(chone);
        ksprite.appendChild(rsprite);
        scene.appendChild(ksprite).appendChild(bg).draw();

        this.setPicArea = function(width, height) {
            if (width < ops.sceneWidth && height < ops.sceneHeight) {
                ths.reset();
                ops.picWidth = width;
                ops.picHeight = height;
                
                left.x();
                left.y();
                left.width((ops.sceneWidth - ops.picWidth) / 2);
                left.height();
                
                right.x(left.width() + ops.picWidth);
                right.y();
                right.width(left.width());
                right.height();
                
                top.x(left.width());
                top.y();
                top.width(ops.picWidth);
                top.height((ops.sceneHeight - ops.picHeight) / 2);
                
                bottom.x(left.width());
                bottom.y(top.height() + ops.picHeight);
                bottom.width(top.width());
                bottom.height(top.height());
                
                mask.width(ops.picWidth);
                mask.height(ops.picHeight);
                mask.x((ops.sceneWidth - ops.picWidth) / 2);
                mask.y((ops.sceneHeight - ops.picHeight) / 2);

                chtwo.width(ops.picWidth);
                chtwo.height(ops.picHeight);
                chtwo.x((rsprite.width() - ops.picWidth) / 2);
                chtwo.y((rsprite.height() - ops.picHeight) / 2);
                scene.draw();
            }
        };

        
        var imageCheck = {
            filter: (function() {
                ops.info = "请选择";
                var b = [];
                if (ops.jpg) {
                    b.push(function(a) {
                        if (a.type.indexOf("jpeg") >= 0) {
                            return true;
                        } else {
                            return false;
                        }
                    });
                    ops.info += " JPG";
                }
                if (ops.png) {
                    b.push(function(a) {
                        if (a.type.indexOf("png") >= 0) {
                            return true;
                        } else {
                            return false;
                        }
                    });
                    ops.info += " PNG";
                }
                if (ops.gif) {
                    b.push(function(a) {
                        if (a.type.indexOf("gif") >= 0) {
                            return true;
                        } else {
                            return false;
                        }
                    });
                    ops.info += " GIF";
                }
                ops.info += " 格式，大小不大于" + (ops.size / 1000) + "KB";
                return b;
            })(),
            check: function(file) {
                var a = false;
                for (var i in this.filter) {
                    a = this.filter[i](file);
                    if (a) {
                        break;
                    }
                }
                if (a) {
                    if (file.size < ops.size) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            }
        };
        
        var redo = {
            list: [],
            add: function(fn, data) {
                this.list.push({
                    fn: fn,
                    data: data
                });
                return this;
            },
            redoIt: function() {
                var a = this.list.pop();
                if (a) {
                    a.fn(a.data);
                }
                return this.list.length;
            },
            reset: function() {
                this.list = [];
                return this;
            }
        };
        
        dom.addClass("photocutter");
        var ctools = "<div class='toolcon btn-group'>" +
                "<div class='pcbtn2'>" +
                    "<div class='btn open'><i class='icon-folder-open'></i></div>" +
                    "<input type='file' class='pcbtninput'/>" +
                "</div><div class='pcbtn2 btn-group' style='margin-left:5px;'>";
        if (ops.rotateleft)
            ctools += "<div class='btn rotateleft' title='rotate left'><i class='icon-rotate-left'></i></div>";
        if (ops.rotateright)
            ctools += "<div class='btn rotateright' title='rotate right'><i class='icon-rotate-right'></i></div>";
        if (ops.zoomin)
            ctools += "<div class='btn zoomin' title='zoom in'><i class='icon-zoom-in'></i></div>";
        if (ops.zoomout)
            ctools += "<div class='btn zoomout' title='zoom out'><i class='icon-zoom-out'></i></div>";
        if (ops.download)
            ctools += "<div class='btn download' title='download file'><i class='icon-file-text'></i></div>";
        if (ops.upload)
            ctools += "<div class='btn upload' title='upload file'><i class='icon-upload-alt'></i></div>";
        if (ops.reset)
            ctools += "<div class='btn reset' title='reset'><i class='icon-refresh'></i></div>";
        if (ops.redo)
            ctools += "<div class='btn redo' title='redo'><i class='icon-mail-reply'></i></div>";
        ctools+="</div>";
        var tools = $(ctools).appendTo(dom);
        
        if(ops.initfile===""){
            var wel=$("<div class='mask'><div class='mask-inner'>"+
                            "<div class='photocutter-welbtn'><div class='btn input-block-level'>点击选择文件</div><input type='file'/></div>"+
                        "</div></div>").appendTo(dom);
        }else{
            var wel={
                hide:function(){}
            };
        }
        
        var mes=$("<div class='photocutter-alert'></div>").appendTo(dom);
        var masks=$("<div class='mask' style='display:none'></div>").appendTo(dom);
        var progress=$("<div class='photocutter-progress'><div class='progress progress-striped'><div class='bar' style='width: 20%;'></div></div></div>").appendTo(dom);
        
        var loading = $("<div class='photocutterloading mask' style='display:none'>" +
                "<div class='loadingcon loading_container'>" +
                    "<div class='loadingicon loading_circle_big'></div>" +
                "</div>" +
                "</div>").appendTo(dom);
        var ths = this,hasfile=false;
        this.buildloading = function() {
            loading.show();
        };
        this.removeloading = function() {
            loading.hide();
        };
        this.rotate = function(num) {
            rsprite.rotate(rsprite.rotate() + num);
            scene.draw();
        };
        this.zoom = function(num) {
            var a = chone.width() + num; //chone.width()/chone.height()
            if (a >= chtwo.width()) {
                var b = (chone.height() / chone.width()) * a;
                chone.width(a);
                chone.height(b);
                var _x = chone.x();
                var _y = chone.y();
                if (_x > chtwo.x()) {
                    _x = chtwo.x();
                } else if (_x < chtwo.x() - chone.width() + chtwo.width()) {
                    _x = chtwo.x() - chone.width() + chtwo.width();
                }
                if (_y > chtwo.y()) {
                    _y = chtwo.y();
                } else if (_y < chtwo.y() - chone.height() + chtwo.height()) {
                    _y = chtwo.y() - chone.height() + chtwo.height();
                }
                chone.x(_x);
                chone.y(_y);
            }
            scene.draw();
        };
        this.getImageData=function(){
            return {
                uri:ksprite.getImageDate(mask.x(), mask.y(), mask.width(), mask.height()),
                blob:ksprite.getImageBlob(mask.x(), mask.y(), mask.width(), mask.height())
            };
        };
        this.upload = function(data) {
            for(var i in data){
                ops.data[i]=data[i];
            }
            masks.show();
            progress.show();
            var _c = ops.data;
            if(hasfile){
                var a = ksprite.getImageBlob(mask.x(), mask.y(), mask.width(), mask.height());
                var _post = new FormData();
                _post.append(ops.filename, a, ops.filename);
                for (var i in _c) {
                    _post.append(i, _c[i]);
                }
                $.request().set({
                    url: ops.url,
                    data: _post
                }).bind({
                    load: function(e) {
                        setTimeout(function(){
                            masks.hide();
                            progress.hide();
                            mes.show();
                            mes.html("上传完成");
                            mes.css("opacity",1).show();
                            setTimeout(function(){
                                mes.animate({
                                    opacity:0
                                },500,function(){
                                    this.hide;
                                });
                                if(ops.success)ops.success(e);
                            },2000);
                        },1000);
                    },
                    progress: function(e) {
                        var p=parseInt((e.loaded/e.total)*100);
                        progress.find(".bar").width(p+"%");
                    },
                    error: function(e) {
                        mes.html("上传失败");
                        mes.css("opacity",1).show();
                        setTimeout(function(){
                            mes.animate({
                                opacity:0
                            },500,function(){
                                this.hide;
                            });
                            if(ops.error)ops.error(e);
                        },2000);
                    }
                }).send();
            }else{
                $.ajax({
                    url:ops.url,
                    data:ops.data,
                    success:function(e){
                        if(ops.success)ops.success(e);
                    },
                    error:function(e){
                        if(ops.error)ops.error(e);
                    }
                });
            }
        };
        this.reset = function() {
            chone.width(chone.ops.iw);
            chone.height(chone.ops.ih);
            chone.x((rsprite.width() - chone.width()) / 2);
            chone.y((rsprite.height() - chone.height()) / 2);
            rsprite.rotate(0);
            scene.draw();
        };
        var saveAs = function(blob, filename) {
            var type = blob.type;
            var force_saveable_type = 'application/octet-stream';
            if (type && type !== force_saveable_type) {
                var slice = blob.slice || blob.webkitSlice || blob.mozSlice;
                blob = slice.call(blob, 0, blob.size, force_saveable_type);
            }
            var url = URL.createObjectURL(blob);
            var save_link = document.createElement('a');
            save_link.href = url;
            save_link.download = filename;
            var event = document.createEvent('MouseEvents');
            event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            save_link.dispatchEvent(event);
//            URL.revokeObjectURL(url);
        };
        this.downloadPNG = function() {
            var a = ksprite.getImageBlob(mask.x(), mask.y(), mask.width(), mask.height());
            a.name = "photocutter";
            saveAs(a, "photocutter.png");
        };
        var setfile = function(e) {
            var files = e;
            if (files.length > 0) {
                if (imageCheck.check(files[0])) {
                    hasfile=true;
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        ths.setImage(e.target.result);
                    };
                    reader.readAsDataURL(files[0]);
                } else {
                    mes.show();
                    mes.html(ops.info);
                }
            }
        };
        this.setImage=function(url){
            ths.buildloading();
            $.resource().loadImage(url, function() {
            	var image = this,_w = image.width, _h=image.height, _x = 0, _y = 0, image = this, sprite = scene;
                if (_w < chtwo.width()) {
                    _w = chtwo.width();
                    _h = (image.height / image.width) * _w;
                }
                if (_h < chtwo.height()) {
                    _h = chtwo.height();
                    _w = (image.width / image.height) * _h;
                }
                chone.ops.iw = _w;
                chone.ops.ih = _h;
                chone.width(_w);
                chone.height(_h);
                chone.x((rsprite.width() - chone.width()) / 2);
                chone.y((rsprite.height() - chone.height()) / 2);
                rsprite.rotate(0);
                chone.backgroundImage(this);
                scene.draw();
                ths.removeloading();
            });
        };
        
        this.disable=function(boolean){
            if(boolean){
                masks.show();
            }else{
                masks.hide();
            }
        };
        this.check=function(){
            var c=true;
            if(ops.required){
                if(hasfile===false){
                    c=false;
                    mes.html("请选择文件");
                    mes.css("opacity",1).show();
                    setTimeout(function(){
                        mes.animate({
                            opacity:0
                        },500,function(){
                            this.hide;
                        });
                    },2000);
                }
            }
            return c;
        };
        this.getvalue=function(){
            return null;
        };
        this.setData=function(a){
            ths.ops.data=a;
        };
        this.setURL=function(a){
            this.ops.url=a;
        };
        this.clean=function(){
            for(var i in this){
                this[i]=null;
            }
        };
        if (tools.find(".rotateright").length > 0)
            tools.find(".rotateright").click(function() {
                ths.rotate(ops.rotateoffset);
                redo.add(function() {
                    ths.rotate(-ops.rotateoffset);
                });
            });
        if (tools.find(".rotateleft").length > 0)
            tools.find(".rotateleft").click(function() {
                ths.rotate(-ops.rotateoffset);
                redo.add(function() {
                    ths.rotate(ops.rotateoffset);
                });
            });
        if (tools.find(".zoomin").length > 0)
            tools.find(".zoomin").click(function() {
                ths.zoom(ops.zoomoffset);
                redo.add(function() {
                    ths.zoom(-ops.zoomoffset);
                });
            });
        if (tools.find(".zoomout").length > 0)
            tools.find(".zoomout").click(function() {
                ths.zoom(-ops.zoomoffset);
                redo.add(function() {
                    ths.zoom(ops.zoomoffset);
                });
            });
        if (tools.find(".upload").length > 0)
            tools.find(".upload").click(function() {
                ths.upload();
            });
        if (tools.find(".download").length > 0)
            tools.find(".download").click(function() {
                ths.downloadPNG();
            });
        if (tools.find(".reset").length > 0)
            tools.find(".reset").click(function() {
                ths.reset();
                redo.reset();
            });
        if (tools.find(".redo").length > 0)
            tools.find(".redo").click(function() {
                redo.redoIt();
            });
        tools.find(".pcbtninput").bind("change", function(e) {
            var file = e.target.files || e.dataTransfer.files;
            setfile(file);
        });
        if(ops.initfile!==""){
            this.setImage(ops.initfile);
        }else{
            dom.find(".photocutter-welbtn").find("input").bind("change",function(e){
                wel.hide();
                var file = e.target.files || e.dataTransfer.files;
                setfile(file);
            });
        }
    };
})(jQuery);