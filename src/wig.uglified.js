(function(a){function L(){J(this,!1)}function K(){J(this,!0)}function J(b,c){var d=a(b).parents(".wig-block-code, .wig-dialog");if(d.length!=0){var e;d.hasClass("wig-block-code")?e=d:e=G.jqImage.parents("p");var f=a('<p><br class="GENTICS_ephemera"></p>');c?e.before(f):e.after(f);var g=f.parents(".GENTICS_editable");for(var h in GENTICS.Aloha.editables){var i=GENTICS.Aloha.editables[h];i.obj[0]==g[0]&&i.activate()}GENTICS.Utils.Dom.setCursorInto(f[0]),GENTICS.Aloha.Selection.updateSelection()}}function I(e){if(!b){b=!0;for(var h in e)c[h]=e[h];for(var i in d)d[i].init(),d[i].jq.mouseup(function(a){a.preventDefault(),a.stopPropagation();return!1});H.init(),GENTICS.Aloha.EventRegistry.subscribe(GENTICS.Aloha,"editableDeactivated",g),f(),a(".wig-add-paragraphs .wig-add-above").live("click",K),a(".wig-add-paragraphs .wig-add-below").live("click",L)}}function y(a,b){var c,d,e,f,g;c=b.outerWidth(!0),d=b.outerHeight(!0),e=b.offset(),f=e.left+c/2,g=e.top+d/2,c=a.jq.innerWidth(),d=a.jq.innerHeight(),f-=c/2,g-=d/2,f=Math.floor(f),g=Math.floor(g),q(a,f,g)}function x(a,b){var c,d,e,f,g;c=b.outerWidth(!0),d=b.outerHeight(!0),e=b.offset(),f=e.left+c,g=Math.floor(e.top+d/2),c=a.jq.innerWidth(),d=a.jq.innerHeight(),g=Math.floor(g-d/2),f+=2,q(a,f,g)}function w(a,b,c){var d,e,f,g;d=b,e=c,f=a.jq.width(),g=a.jq.height(),e=e-Math.floor(g/2),q(a,d,e)}function v(a,b,c){var d,e,f,g;d=b,e=c,f=a.jq.width(),g=a.jq.height(),d=d-f,e=e-Math.floor(g/2),q(a,d,e)}function u(a,b){var c,d,e,f,g;c=b.outerWidth(!0),d=b.outerHeight(!0),e=b.offset(),f=Math.floor(e.left+c/2),g=e.top+d,c=a.jq.width(),d=a.jq.height(),f=Math.floor(f-c/2),g+=3,q(a,f,g)}function t(a,b){var c,d,e,f,g;c=b.outerWidth(!0),d=b.outerHeight(!0),e=b.offset(),f=e.left+c/2,g=e.top,c=a.jq.width(),d=a.jq.height(),f=Math.floor(f-c/2),g=g-d,g-=3,q(a,f,g)}function s(a,b,c){var d,e,f,g;d=b,e=c,f=a.jq.width(),g=a.jq.height(),d=Math.floor(d-f/2),e=e-g,e-=3,q(a,d,e)}function r(a,b){a.visible&&(b?a.jq.hide():a.jq.fadeOut(200),a.visible=!1,a.hideCleanup&&a.hideCleanup())}function q(a,b,c){a.visible?a.jq.animate({left:b+"px",top:c+"px"},100):(a.show&&a.show(),a.jq.css("left",b+"px").css("top",c+"px"),a.jq.fadeIn(200)),a.visible=!0,a.x=b,a.y=c}function m(a,b,c){if(GENTICS.Aloha.activeEditable){var d=[];for(var e in b){var f=b[e],g=a.findMarkup(function(){return this.nodeName.toLowerCase()==f},GENTICS.Aloha.activeEditable.obj,c);g&&d.push(g)}return d}return[]}function l(b,c,d){return GENTICS.Aloha.activeEditable?b.findMarkup(function(){return a.inArray(this.nodeName.toLowerCase(),c)!=-1},GENTICS.Aloha.activeEditable.obj,d):null}function k(a,b,c){return GENTICS.Aloha.activeEditable?a.findMarkup(function(){return this.nodeName.toLowerCase()==b},GENTICS.Aloha.activeEditable.obj,c):null}function j(b){var c=b.get(0);while(c.previousSibling&&c.previousSibling.nodeType==1&&c.previousSibling.nodeName==c.nodeName)c=c.previousSibling;var b=a(c);while(c.nextSibling&&(c.nextSibling.nodeType==1&&c.nextSibling.nodeName==c.nodeName||c.nextSibling.nodeType==3&&a.trim(c.nextSibling.data).length==0)){var d=a(c.nextSibling);c.nextSibling.nodeType==1&&d.contents().appendTo(b),d.remove()}}function i(){h(),GENTICS.Aloha.Selection.rangeObject.update(),GENTICS.Aloha.Selection.rangeObject.select(),GENTICS.Aloha.Selection.updateSelection()}function h(){if(GENTICS.Aloha.activeEditable){var b=a(document),c=b.scrollTop(),d=b.scrollLeft();GENTICS.Aloha.activeEditable.obj[0].focus(),b.scrollTop(c),b.scrollLeft(d)}}function g(){a(".wig-selected-block").removeClass("wig-selected-block"),a(".wig-selected-li").removeClass("wig-selected-li");for(var b in d)r(d[b])}function f(){e(function(){if(!!GENTICS.Aloha.activeEditable){var b=a(GENTICS.Aloha.activeEditable.obj),c=!1,d=b.find(".Apple-style-span, .Apple-interchange-newline");while(d.length){c=!0;var e=d[0],f=GENTICS.Aloha.Selection.rangeObject;GENTICS.Utils.Dom.removeFromDOM(e,f,!0),d=b.find(".Apple-style-span, .Apple-interchange-newline")}var g=b.find("meta");g.length&&(c=!0,g.remove()),b.find(".wig-block-code").each(function(){var b=a(this);b.find("textarea").length==0&&b.remove()}),b.containsKnownBlockElements()||(c=!0,b.forceParagraphs(),b.fillEmptyBlocks(),b.find("p").length==0&&b.html('<p><br class="GENTICS_ephemera"></p>'),GENTICS.Utils.Dom.setCursorInto(b.find("p")[0]),GENTICS.Aloha.Selection.updateSelection());if(b.find("> *").length==1){var h=b.find("> div");if(h.length==1&&!h.attr("class")){var j=a("<p></p>");j.html(h.clone().remove().html()),h.replaceWith(j),GENTICS.Utils.Dom.setCursorInto(j[0])}}c&&i()}})}function e(a){GENTICS.Aloha.EventRegistry.subscribe(GENTICS.Aloha,"selectionChanged",a)}var b=!1,c={"images-disable-sizes":["30M"],"images-thumb-size":"30M","selection-dialog":'<div id="wig-selection-dialog" class="wig-dialog wig-horizontal-dialog"><div class="wig-inner"><div class="wig-contents"><span class="wig-button wig-button-b">b</span><span class="wig-button wig-button-i">i</span><span class="wig-button wig-button-a">a</span></div><div class="wig-arrow-below"></div></div></div>',"remove-inline-dialog":'<div id="wig-remove-inline-dialog" class="wig-dialog wig-horizontal-dialog"><div class="wig-inner"><div class="wig-contents"><span class="wig-button wig-button-b">b</span><span class="wig-button wig-button-i">i</span></div><div class="wig-arrow-below"></div></div></div>',"insert-dialog":'<div id="wig-insert-dialog" class="wig-dialog wig-vertical-dialog wig-left-dialog"><div class="wig-inner"><div class="wig-contents"><span class="wig-button wig-button-img">img</span><span class="wig-button wig-button-html">&lt;&gt;</span></div><div class="wig-arrow-right"></div></div></div>',"change-block-dialog":'<div id="wig-change-block-dialog" class="wig-dialog wig-vertical-dialog wig-right-dialog"><div class="wig-inner"><div class="wig-arrow-left"></div><div class="wig-contents"><span class="wig-button wig-button-p">p</span><span class="wig-button wig-button-h1">h1</span><span class="wig-button wig-button-h2">h2</span><span class="wig-button wig-button-h3">h3</span><span class="wig-button wig-button-h4">h4</span><span class="wig-button wig-button-h5">h5</span><span class="wig-button wig-button-h6">h6</span></div></div></div>',"change-list-dialog":'<div id="wig-change-list-dialog" class="wig-dialog wig-vertical-dialog wig-right-dialog"><div class="wig-inner"><div class="wig-arrow-left"></div><div class="wig-contents"><span class="wig-button wig-button-ul">ul</span><span class="wig-button wig-button-ol">ol</span><span class="wig-button wig-button-indent">&rarr;</span><span class="wig-button wig-button-unindent">&larr;</span></div></div></div>',"link-dialog":'<div id="wig-link-dialog" class="wig-dialog horizontal-dialog"><div class="wig-inner"><div class="wig-arrow-above"></div><div class="wig-contents"><input type="text" name="href" value=""></div></div></div>',"insert-image-dialog":'<div id="wig-insert-image-dialog" class="wig-dialog wig-vertical-dialog wig-right-dialog"><div class="wig-inner"><div class="wig-arrow-left"></div><div class="wig-contents"></div></div></div>',"edit-image-dialog":'<div id="wig-edit-image-dialog" class="wig-dialog"><div class="wig-contents"><div class="wig-sizes"><h1>Size</h1><ul></ul></div><div class="wig-alignment"><h1>Alignment</h1><ul><li class="align-center"><span>center</span></li><li class="align-left"><span>left</span></li><li class="align-right"><span>right</span></li></ul></div><div class="wig-field"><label>Alt</label><input type="text" name="alt" value="http://"></div><div class="wig-field"><label>Link</label><input type="text" name="href" value=""></div><div class="wig-add-paragraphs"><span class="wig-add-above" title="Insert paragraph above the image.">↑</span><span class="wig-add-below" title="Insert paragraph below the image.">↓</span></div><div class="wig-delete">remove this image</div></div></div>',"block-code":"","inline-code":""},d=[],n="p h1 h2 h3 h4 h5 h6".split(" "),o="b i".split(" "),p="p h1 h2 h3 h4 h5 h6 li".split(" "),z={visible:!1,lastPageX:null,lastPageY:null,init:function(){this.id="wig-selection-dialog",a("body").append(c["selection-dialog"]),this.jq=a("#"+this.id),a("#wig-selection-dialog .wig-button-b").live("click",this.toggleBold),a("#wig-selection-dialog .wig-button-i").live("click",this.toggleItalic),a("#wig-selection-dialog .wig-button-a").live("click",this.insertLink),a("#wig-selection-dialog .wig-button-span").live("click",this.insertSpan),e(this.selectionChanged)},toggleTag:function(a,b){h(),b||(b=jQuery("<"+a+"></"+a+">"));var c=GENTICS.Aloha.Selection.rangeObject,d=c.findMarkup(function(){return this.nodeName.toLowerCase()==a},GENTICS.Aloha.activeEditable.obj);d?c.isCollapsed()?GENTICS.Utils.Dom.removeFromDOM(d,c,!0):GENTICS.Utils.Dom.removeMarkup(c,b,GENTICS.Aloha.activeEditable.obj):(c.isCollapsed()&&GENTICS.Utils.Dom.extendToWord(c),GENTICS.Utils.Dom.addMarkup(c,b)),i()},toggleBold:function(){z.toggleTag("b")},toggleItalic:function(){z.toggleTag("i")},insertLink:function(){z.toggleTag("a",a('<a href="http://"></a>')),r(z,!0),a(F.input).focus()},insertSpan:function(){},selectionChanged:function(b,c,d){d&&d.pageX&&(z.lastPageX=d.pageX,z.lastPageY=d.pageY);if(c.isCollapsed())r(z);else{var e=l(c,p),f=l(c,p,!0),g,h;if(d&&d.pageX)g=d.pageX,h=d.pageY;else if(z.lastPageX){var i=a(e),j=z.lastPageX,k=z.lastPageY,m,n,o,q,u;m=i.outerWidth(!0),n=i.outerHeight(!0),o=i.offset(),q=o.left,u=o.top,j>=q&&j<=m+q&&k>=u&&k<=n+u&&(g=j,h=k)}if(e&&f&&e==f)if(g&&h){var v=g,w=h;s(z,v,w-10)}else t(z,a(e));else r(z)}}};d.push(z);var A={visible:!1,init:function(){this.id="wig-remove-inline-dialog",a("body").append(c["remove-inline-dialog"]),this.jq=a("#"+this.id),a("#wig-remove-inline-dialog .wig-button-b").live("click",this.removeBold),a("#wig-remove-inline-dialog .wig-button-i").live("click",this.removeItalic),e(this.selectionChanged)},removeTag:function(a){h();var b=GENTICS.Aloha.Selection.rangeObject,c=k(b,a);if(!!c){var d=c.tagName.toLowerCase(),e=jQuery("<"+d+"></"+d+">"),f=b.findMarkup(function(){return this.nodeName.toLowerCase()==d},GENTICS.Aloha.activeEditable.obj);f&&(b.isCollapsed()?GENTICS.Utils.Dom.removeFromDOM(f,b,!0):GENTICS.Utils.Dom.removeMarkup(b,e,GENTICS.Aloha.activeEditable.obj)),b.select()}},removeBold:function(){A.removeTag("b")},removeItalic:function(){A.removeTag("i")},selectionChanged:function(b,c){if(!c.isCollapsed())r(A);else{var d=l(c,["b","i"]);if(d){var e=a(d);a("#wig-remove-inline-dialog .wig-button").removeClass("wig-button-selected").hide();var f=m(c,["b","i"]);for(var g in f){var h=f[g].nodeName.toLowerCase();a("#wig-remove-inline-dialog .wig-button-"+h).addClass("wig-button-selected").show()}t(A,e)}else r(A)}}};d.push(A);var B={visible:!1,insertX:null,insertY:null,init:function(){this.id="wig-insert-dialog",a("body").append(c["insert-dialog"]),this.jq=a("#"+this.id),a("#wig-insert-dialog .wig-button-img").live("click",this.insertImage),a("#wig-insert-dialog .wig-button-html").live("click",this.insertHTML),e(this.selectionChanged)},insertImage:function(){r(z,!0),r(B),C.draw();var b=B.insertX,c=B.insertY;C.jqP=B.jqP,w(C,b,c);var d=a("#wig-insert-image-dialog .wig-arrow-left"),e=Math.floor(C.jq.outerHeight()/2-5);d.css("top",e+"px")},insertHTML:function(){r(z,!0);var b=GENTICS.Aloha.Selection.rangeObject,c=k(b,"p");if(!!c){var d=a('<div class="wig-code wig-block-code"></div>'),e=a(c);e.replaceWith(d),d.append('<textarea></textarea><div class="wig-add-paragraphs"><span class="wig-add-above" title="Insert paragraph above this block.">↑</span><span class="wig-add-below" title="Insert paragraph below this block.">↓</span></div>'),d.contentEditable(!1),r(B),r(D),d.find("textarea").handleCodeTextarea()}},selectionChanged:function(b,c){if(!c.isCollapsed()){var d=l(c,p),e=l(c,p,!0);if(!d||!e||d!=e){r(B);return}}var f=!1,g=!1,h=!1,i=!1,j,m=k(c,"p");if(m){var g=a(m).looksEmpty();g?f=!0:c.startContainer==m.childNodes[0]&&c.startOffset==0?f=!0:(j=l(c,["a","b","i"]),j&&!j.previousSibling&&c.startOffset==0&&(f=!0,h=!0))}if(!f&&c.startOffset==0){var n=c.startContainer.previousSibling;if(n&&n.nodeType==1){var o=n.nodeName.toLowerCase();if(o=="img")i=!0;else if(o=="a"){var q=n.childNodes[0];q.nodeType==1&&q.nodeName.toLowerCase()=="img"&&(i=!0)}}}B.jqP=a(m);var s=!1,t=a("#wig-insert-dialog .wig-button-html");g?(s=!0,t.show()):t.hide();var u=a("#wig-insert-dialog .wig-button-img"),w;GENTICS.Aloha.activeEditable&&(w=GENTICS.Aloha.activeEditable.obj.data("images")),w&&w.length?(s=!0,u.show()):u.hide();var x;x=a(m).offset();if(!s||!x)r(B);else{var y=B.insertX=x.left-3,z=B.insertY=x.top+24;v(B,y,z);var A=a("#wig-insert-dialog .wig-arrow-right"),C=Math.floor(B.jq.outerHeight()/2-5);A.css("top",C+"px")}}};d.push(B);var C={visible:!1,images:null,init:function(){this.id="wig-insert-image-dialog",a("body").append(c["insert-image-dialog"]),this.jq=a("#"+this.id),a("#wig-insert-image-dialog li").live("click",this.addImage),e(this.selectionChanged)},addImage:function(b){var c=a(this),d=c.index(),e=C.jqP,f=GENTICS.Aloha.activeEditable.obj.data("images"),g=f[d],h=g.sizes.original,i=h.src,j=h.width,k=h.height,l="left";j>=e.width()&&(l="center");var m='<div class="wig-imgwrap img-'+l+'">'+'<img src="'+i+'" width="'+j+'" height="'+k+'">'+"</div>",n=e.find("img:last");n.length?n.after(m):e.prepend(m),e.find(".wig-imgwrap:last").css("width",j+"px").contentEditable(!1),r(C)},selectionChanged:function(a,b){r(C)},draw:function(){var b="<ul>",d=GENTICS.Aloha.activeEditable.obj.data("images");if(!!d){for(var e in d){var f=d[e],g=c["images-thumb-size"],h=f.sizes[g].src;b+='<li><img src="'+h+'"></li>'}b+="</ul>",a("#wig-insert-image-dialog .wig-contents").html(b)}}};d.push(C);var D={visible:!1,init:function(){this.id="wig-change-block-dialog",a("body").append(c["change-block-dialog"]),this.jq=a("#"+this.id),a("#wig-change-block-dialog .wig-button").live("click",this.changeBlockTag),e(this.selectionChanged)},changeBlockTag:function(){GENTICS.Aloha.activeEditable&&h();var b=GENTICS.Aloha.Selection.rangeObject;if(!b.isCollapsed()){var c=l(b,p),d=l(b,p,!0);if(!c||!d||c!=d)return}var e=l(b,n);if(e){var f=a.trim(a(this).text());f=="li"&&(f="ul");if(f=="ul"||f=="ol"){var g=a("<"+f+"></"+f+">"),k=a("<li></li>");g.append(k),a(e).contents().appendTo(k),a(e).replaceWith(g),j(g),i()}else{var m=a("<"+f+"></"+f+">");GENTICS.Aloha.Selection.changeMarkupOnSelection(m)}}},selectionChanged:function(b,c){a(".wig-selected-block").removeClass("wig-selected-block");if(!c.isCollapsed()){var d=l(c,p),e=l(c,p,!0);if(!d||!e||d!=e){r(D);return}}var f=l(c,n);if(f){var g=f.nodeName.toLowerCase();g=="h5"||g=="h6"?(a("#wig-change-block-dialog .wig-button-h5").show(),a("#wig-change-block-dialog .wig-button-h6").show()):(a("#wig-change-block-dialog .wig-button-h5").hide(),a("#wig-change-block-dialog .wig-button-h6").hide()),a("#wig-change-block-dialog .wig-button").removeClass("wig-button-selected"),a("#wig-change-block-dialog .wig-button-"+g).addClass("wig-button-selected");var h=a(f);h.addClass("wig-selected-block");if(h.find("img").length==0){x(D,h);var i=a("#wig-change-block-dialog .wig-arrow-left"),j=Math.floor(D.jq.outerHeight()/2-5);i.css("top",j+"px")}else r(D)}else r(D)}};d.push(D);var E={visible:!1,init:function(){this.id="wig-change-list-dialog",a("body").append(c["change-list-dialog"]),this.jq=a("#"+this.id),a("#wig-change-list-dialog .wig-button-indent").live("click",this.indentList),a("#wig-change-list-dialog .wig-button-ul").live("click",this.convertToUnordered),a("#wig-change-list-dialog .wig-button-ol").live("click",this.convertToOrdered),a("#wig-change-list-dialog .wig-button-unindent").live("click",this.unindentList),e(this.selectionChanged)},convertToUnordered:function(){var b=GENTICS.Aloha.Selection.rangeObject,c=k(b,"li");if(c){var d=a(c).parent();GENTICS.Aloha.Markup.transformDomObject(d,"ul"),j(d),i()}},convertToOrdered:function(){var b=GENTICS.Aloha.Selection.rangeObject,c=k(b,"li");if(c){var d=a(c).parent();GENTICS.Aloha.Markup.transformDomObject(d,"ol"),j(d),i()}},indentList:function(){var b=GENTICS.Aloha.Selection.rangeObject,c=k(b,"li");if(c){var d=a(c),e=d.prev("li");if(e.length==0)return!1;var f=d.parent(),g=f.clone(!1).empty();g.append(c),e.append(g),j(g),i();return!1}return!0},unindentList:function(){var b=GENTICS.Aloha.Selection.rangeObject,c=k(b,"li");if(c){var d=a(c),e=d.parent(),f=e.parents("ul,ol"),g=e.parent("li");f.length>0&&GENTICS.Utils.Dom.isListElement(f.get(0))&&(g.length>0?g.after(d):e.before(d),e.contents("li").length==0&&e.remove(),g.length>0&&g.contents().length==0&&g.remove(),i());return!1}return!0},selectionChanged:function(b,c){a(".wig-selected-li").removeClass("wig-selected-li");if(!c.isCollapsed())r(E);else{var d=k(c,"li");if(d&&a(d).parents(".editable").length){var e=a(d);e.addClass("wig-selected-li");var f=a("#wig-change-list-dialog .wig-button-ul"),g=a("#wig-change-list-dialog .wig-button-ol");d.parentNode.nodeName.toLowerCase()=="ol"?(f.removeClass("wig-button-selected"),g.addClass("wig-button-selected")):(f.addClass("wig-button-selected"),g.removeClass("wig-button-selected"));var h=a("#wig-change-list-dialog .wig-button-indent"),i=a("#wig-change-list-dialog .wig-button-unindent");d.parentNode.parentNode.nodeName.toLowerCase()=="li"?i.show():i.hide(),e.prev("li").length==0?h.hide():h.show(),x(E,e);var j=a("#wig-change-list-dialog .wig-arrow-left"),l=Math.floor(E.jq.outerHeight()/2-5);j.css("top",l+"px")}else r(E)}}};d.push(E);var F={visible:!1,link:null,range:null,init:function(){this.id="wig-link-dialog",a("body").append(c["link-dialog"]),this.jq=a("#"+this.id),F.input=a("#wig-link-dialog input[name=href]")[0],a(F.input).keyup(this.updateLink).blur(this.blurInput),e(this.selectionChanged)},blurInput:function(b){r(F);var c=a(F.link);a.inArray(a.trim(c.attr("href")),["","http://"])!=-1&&F.removeLink()},updateLink:function(b){if(!!F.link){var c=a(F.link),d=a(F.input),e=d.val();c.attr("href",e),(b.keyCode==27||b.keyCode==13)&&d.blur()}},removeLink:function(){var a=F.range;GENTICS.Utils.Dom.removeFromDOM(F.link,a,!0),r(z)},selectionChanged:function(b,c){var d=k(c,"a");F.link=null,F.range=null;if(d){F.link=d,F.range=c;var e=a(F.link),f=a(F.input);f.attr("value",e.attr("href")),u(F,e)}else r(F)}};d.push(F);var G={visible:!1,image:null,size:null,init:function(){this.id="wig-edit-image-dialog",a("body").append(c["edit-image-dialog"]),this.jq=a("#"+this.id),a("#wig-edit-image-dialog input[name=alt]").keyup(this.updateAlt).blur(this.updateAlt),a("#wig-edit-image-dialog .wig-sizes span").live("click",this.sizeClicked),a("#wig-edit-image-dialog .wig-alignment span").click(this.alignmentClicked),a("#wig-edit-image-dialog input[name=href]").keyup(this.updateMeta).blur(this.updateMeta),a("#wig-edit-image-dialog .wig-delete").click(this.deleteImage),e(this.selectionChanged)},updateAlt:function(b){var c=G.jqImage,d=a("#wig-edit-image-dialog input[name=alt]");c.attr("alt",d.val()),b&&(b.keyCode==27||b.keyCode==13)&&r(G)},sizeClicked:function(){var b=G.jqImage,c=b.parents(".wig-imgwrap"),d=a(this).parent();a("#wig-edit-image-dialog .wig-sizes li").removeClass("wig-selected");var e=d.attr("class").split("-")[1];d.addClass("wig-selected");var f=G.image.sizes;for(var g in f){var h=f[g],i=h.width+"x"+h.height;if(i!=e)continue;b.attr("src",h.src),b.attr("width",h.width),c.css("width",h.width+"px"),b.attr("height",h.height),y(G,b);break}},alignmentClicked:function(){var b=G.jqImage,c=a(this).parent();a("#wig-edit-image-dialog .wig-alignment li").removeClass("wig-selected"),c.addClass("wig-selected"),G.updateMeta(),y(G,b)},updateMeta:function(b){var c=G.jqImage,d=c.parents(".wig-imgwrap"),e=c.parent("a"),f=a("#wig-edit-image-dialog input[name=href]"),g=a("#wig-edit-image-dialog .wig-alignment .wig-selected").attr("class").split(" "),h="left";for(var i in g){var j=g[i];if(j.indexOf("align-")==0){h=j.split("-")[1];break}}var k=f.val();k?e.length?e.attr("href",k):c.wrap('<a href="'+k+'"></a>'):e.length&&e.contents().unwrap(),d.attr("class","wig-imgwrap img-"+h),b&&(b.keyCode==27||b.keyCode==13)&&r(G)},deleteImage:function(){var a=G.jqImage,b=a.parents(".wig-imgwrap");b.remove(),r(G)},populate:function(){var b="";if(G.size){var d=G.image.sizes,e=[],f=G.size,g=f.width+"x"+f.height;for(var h in d){if(a.inArray(h,c["images-disable-sizes"])!=-1)continue;var f=d[h],i=f.width+" × "+f.height,j=f.width+"x"+f.height;if(a.inArray(j,e)!=-1)continue;e.push(j),b+='<li class="size-'+j+'"><span>'+i+"</span></li>"}}var k=G.jq,l=G.jqImage,m=l.parents(".wig-imgwrap"),n=l.parent("a"),o="left";m.hasClass("img-right")&&(o="right"),m.hasClass("img-center")&&(o="center");var p=k.find(".wig-sizes");G.image?(p.find("ul").html(b),p.find(".size-"+g).addClass("wig-selected")):p.hide();var q=k.find(".wig-alignment");q.find("li").removeClass("wig-selected"),q.find(".align-"+o).addClass("wig-selected");var r=k.find("input[name=alt]");r.val(l.attr("alt"));var s=k.find("input[name=href]");n.length?s.val(n.attr("href")):s.val("")},imageClicked:function(b){if(!GENTICS.Aloha.activeEditable)return!0;var c=a(this).parents(".wig-imgwrap"),d=c.find("img");G.image=null,G.size=null;var e=d.attr("src"),f=GENTICS.Aloha.activeEditable.obj.data("images");for(var h in f){var i=f[h];for(var j in i.sizes){var k=i.sizes[j];if(k.src==e){G.image=i,G.size=k;break}}if(G.image)break}G.jqImage=d,G.populate(),G.visible||g(),y(G,d),G.jq.find("input[name=href]").focus(),b.preventDefault(),b.stopPropagation();return!1},selectionChanged:function(a,b){r(G)},hideCleanup:function(){}};d.push(G);var H={pasteHandlers:[],init:function(){H.jq=a('<div style="position:absolute; top:-100000px; left:-100000px"></div>'),H.jq.contentEditable(!0),a("body").append(H.jq),GENTICS.Aloha.EventRegistry.subscribe(GENTICS.Aloha,"editableCreated",function(a,b){jQuery.browser.msie?b.obj.bind("beforepaste",function(a){H.redirectPaste()}):b.obj.bind("paste",function(a){H.redirectPaste(),window.setTimeout(function(){H.getPastedContent()},10)})}),a.browser.msie&&H.jq.bind("paste",function(a){window.setTimeout(function(){getPastedContent()},10)})},redirectPaste:function(){if(a(".wig-selected-block,.wig-selected-li").length==0)H.currentRange=H.currentEditable=null;else{H.currentRange=new GENTICS.Utils.RangeObject(!0),H.currentEditable=GENTICS.Aloha.activeEditable;var b=a(document);H.sTop=b.scrollTop(),H.sLeft=b.scrollLeft(),H.jq.text(""),H.currentEditable&&H.currentEditable.blur(),GENTICS.Utils.Dom.setCursorInto(H.jq.get(0)),H.jq.focus()}},getPastedContent:function(){if(!!H.currentRange&&!!H.currentEditable){H.jq.cleanup({reservedClasses:".editable, .GENTICS_editable, .wig-selected-block, .wig-selected-li",dodgyElements:".wig-code",validImageDomains:c.validImageDomains,stripUnknown:!0}),H.jq.unknownToCode({blockClasses:"wig-code wig-block-code",inlineClasses:"wig-code wig-inline-code",innerClasses:"wig-inner"}),H.jq.containsKnownBlockElements()&&H.jq.forceParagraphs(),H.currentEditable.activate(),h();if(!H.currentRange.isCollapsed()){H.currentRange=!1,H.currentEditable=!1,H.jq.text("");return}var b;if(H.currentRange&&H.currentEditable){var d;b=H.jq.containsKnownBlockElements();if(b){d=H.jq.contents();var e=H.currentRange.startContainer,f=a(e),g=GENTICS.Utils.Dom.isEmpty(e),j=f.find("br.GENTICS_ephemera"),k=l(H.currentRange,n.concat(["ul","ol"]));if(!k){H.currentRange=!1,H.currentEditable=!1,H.jq.text("");return}a(k).after(d),(g||j.length)&&f.remove()}else{d=H.jq.contents();for(var m=d.length-1;m>=0;m--)GENTICS.Utils.Dom.insertIntoDOM(a(d.get(m)),H.currentRange,H.currentEditable.obj,!1)}d.length>0?GENTICS.Utils.Dom.setCursorAfter(d.get(d.length-1)):i()}H.currentRange=!1,H.currentEditable=!1,H.jq.text(""),b&&(a(document).scrollTop(H.sTop),a(document).scrollLeft(H.sLeft))}}};a.fn.wig=function(c,d){b||I(c);var e=[];for(var f in GENTICS.Aloha.editables){var g=GENTICS.Aloha.editables[f];a(g.obj).parents("body").length==0&&e.push(g)}for(var f in e)GENTICS.Aloha.unregisterEditable(e[f]);return this.each(function(){var b=a(this);b.cleanup({validImageDomains:c.validImageDomains}),b.unknownToCode({blockClasses:"wig-code wig-block-code",inlineClasses:"wig-code wig-inline-code",innerClasses:"wig-inner"}),b.forceParagraphs(),a.trim(b.html())==""&&b.html('<p><br class="GENTICS_ephemera"></p>'),b.bind("dragover drop",function(a){a.preventDefault();return!1}),b.wrapImages(),b.find("img").live("mouseup",G.imageClicked),b.find(".wig-imgwrap .wig-edit").live("mouseup",G.imageClicked),b.find(".wig-imgwrap a").live("click",function(a){a.preventDefault();return!1}),b.find("textarea").handleCodeTextarea();var d=b.parents("form");d.bind("form:serialize",function(){var a=b.serializeWithoutCode(),c=b.attr("id").split("-")[1];d.find("input[name="+c+"]").length==0&&b.after('<input type="hidden" name="'+c+'">'),d.find("input[name="+c+"]").val(a)}),new GENTICS.Aloha.Editable(b)})}})(jQuery)