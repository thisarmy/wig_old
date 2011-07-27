(function($) {

var initialized = false;
var options = {
    'images-disable-sizes': ['30M'],
    'images-thumb-size': '30M',
    'selection-dialog': ''+
'<div id="wig-selection-dialog" class="wig-dialog wig-horizontal-dialog">'+
'<div class="wig-inner">'+
'<div class="wig-contents">'+
'<span class="wig-button wig-button-b">b</span>'+
'<span class="wig-button wig-button-i">i</span>'+
'<span class="wig-button wig-button-a">a</span>'+
'</div>'+
'<div class="wig-arrow-below"></div>'+
'</div>'+
'</div>',

    'remove-inline-dialog': ''+
'<div id="wig-remove-inline-dialog" class="wig-dialog wig-horizontal-dialog">'+
'<div class="wig-inner">'+
'<div class="wig-contents">'+
'<span class="wig-button wig-button-b">b</span>'+
'<span class="wig-button wig-button-i">i</span>'+
'</div>'+
'<div class="wig-arrow-below"></div>'+
'</div>'+
'</div>',

    'insert-dialog': ''+
'<div id="wig-insert-dialog" class="'+
'wig-dialog wig-vertical-dialog wig-left-dialog">'+
'<div class="wig-inner">'+
'<div class="wig-contents">'+
'<span class="wig-button wig-button-img">img</span>'+
'<span class="wig-button wig-button-html">&lt;&gt;</span>'+
'</div>'+
'<div class="wig-arrow-right"></div>'+
'</div>'+
'</div>',

    'change-block-dialog': ''+
'<div id="wig-change-block-dialog" '+
'class="wig-dialog wig-vertical-dialog wig-right-dialog">'+
'<div class="wig-inner">'+
'<div class="wig-arrow-left"></div>'+
'<div class="wig-contents">'+
'<span class="wig-button wig-button-p">p</span>'+
'<span class="wig-button wig-button-h1">h1</span>'+
'<span class="wig-button wig-button-h2">h2</span>'+
'<span class="wig-button wig-button-h3">h3</span>'+
'<span class="wig-button wig-button-h4">h4</span>'+
'<span class="wig-button wig-button-h5">h5</span>'+
'<span class="wig-button wig-button-h6">h6</span>'+
'</div>'+
'</div>'+
'</div>',

    'change-list-dialog': ''+
'<div id="wig-change-list-dialog" '+
'class="wig-dialog wig-vertical-dialog wig-right-dialog">'+
'<div class="wig-inner">'+
'<div class="wig-arrow-left"></div>'+
'<div class="wig-contents">'+
'<span class="wig-button wig-button-ul">ul</span>'+
'<span class="wig-button wig-button-ol">ol</span>'+
'<span class="wig-button wig-button-indent">&rarr;</span>'+
'<span class="wig-button wig-button-unindent">&larr;</span>'+
'</div>'+
'</div>'+
'</div>',

    'link-dialog': ''+
'<div id="wig-link-dialog" class="wig-dialog horizontal-dialog">'+
'<div class="wig-inner">'+
'<div class="wig-arrow-above"></div>'+
'<div class="wig-contents"><input type="text" name="href" value=""></div>'+
'</div>'+
'</div>',

    'insert-image-dialog': ''+
'<div id="wig-insert-image-dialog" '+
'class="wig-dialog wig-vertical-dialog wig-right-dialog">'+
'<div class="wig-inner">'+
'<div class="wig-arrow-left"></div>'+
'<div class="wig-contents">'+
'</div>'+
'</div>'+
'</div>',

    'edit-image-dialog': ''+
'<div id="wig-edit-image-dialog" class="wig-dialog">'+
'<div class="wig-contents">'+
'<div class="wig-sizes"><h1>Size</h1><ul></ul></div>'+
'<div class="wig-alignment"><h1>Alignment</h1><ul>'+
'<li class="align-center"><span>center</span></li>'+
'<li class="align-left"><span>left</span></li>'+
'<li class="align-right"><span>right</span></li>'+
'</ul></div>'+
'<div class="wig-field">'+
    '<label>Alt</label>'+
    '<input type="text" name="alt" value="http://">'+
'</div>'+
'<div class="wig-field">'+
    '<label>Link</label>'+
    '<input type="text" name="href" value="">'+
'</div>'+
'<div class="wig-add-paragraphs">'+
'<span class="wig-add-above" title="Insert paragraph above the image.">↑</span>'+
'<span class="wig-add-below" title="Insert paragraph below the image.">↓</span>'+
'</div>'+
'<div class="wig-delete">remove this image</div>'+
'</div>'+
'</div>',

    'block-code': '', // TODO

    'inline-code': '' // TODO
};

var dialogs = [];

function subscribeSelectionChanged(callback) {
    GENTICS.Aloha.EventRegistry.subscribe(GENTICS.Aloha, 'selectionChanged',
    callback);
}

function handleBackspaceDodgyness() {
    subscribeSelectionChanged(function() {
        if (!GENTICS.Aloha.activeEditable) {
            return;
        }
        var $editable = $(GENTICS.Aloha.activeEditable.obj);
        var changed = false;
        var $span = $editable
            .find('.Apple-style-span, .Apple-interchange-newline');
        while ($span.length) {
            changed = true;
            var foundMarkup = $span[0];
            var rangeObject = GENTICS.Aloha.Selection.rangeObject;
            GENTICS.Utils.Dom.removeFromDOM(foundMarkup, rangeObject, true);
            $span = $editable
                .find('.Apple-style-span, .Apple-interchange-newline');
        }
        var $meta = $editable.find('meta');
        if ($meta.length) {
            changed = true;
            $meta.remove();
        }
        $editable.find('.wig-block-code').each(function() {
            var $code = $(this);
            if ($code.find('textarea').length == 0) {
                $code.remove();
            }
        });
        if (!$editable.containsKnownBlockElements()) {
            changed = true;
            $editable.forceParagraphs();
            $editable.fillEmptyBlocks();
            if ($editable.find('p').length == 0) {
                $editable.html('<p><br class="GENTICS_ephemera"></p>');
            }
            // set a new range into the given dom object
            GENTICS.Utils.Dom.setCursorInto($editable.find('p')[0]);
            GENTICS.Aloha.Selection.updateSelection();

            /*if (!$.browser.webkit) {
                // seriously weird firefox behaviour where I can't move the
                // cursor to the newly created paragraph. But if you click on
                // it it focuses just fine. So in this rare case I just force
                // the user to refocus the editable with the mouse...
                for (var i in GENTICS.Aloha.editables) {
                    var editable = GENTICS.Aloha.editables[i];
                    if (!editable.isDisabled()) {
                        editable.disable();
                        editable.obj[0].blur();
                        setTimeout(function() {
                            editable.enable();
                            //editable.obj[0].focus();
                        }, 100);

                    }
                }
            }*/
        }
        if ($editable.find('> *').length == 1) {
            var $div = $editable.find('> div');
            if ($div.length == 1) {
                if (!$div.attr('class')) {
                    var $p = $('<p></p>');
                    $p.html($div.clone().remove().html());
                    $div.replaceWith($p);
                    GENTICS.Utils.Dom.setCursorInto($p[0]);
                }
            }
        }
        if (changed) {
            refreshSelection();
        }
    });
}

function editableDeactivated() {
    // you can certainly argue that this is a bit of a hack
    $('.wig-selected-block').removeClass('wig-selected-block');
    $('.wig-selected-li').removeClass('wig-selected-li');
    for (var i in dialogs) {
        hideDialog(dialogs[i]);
    }
}

function focusEditable() {
    if (GENTICS.Aloha.activeEditable) {
        var $d = $(document);
        var sTop = $d.scrollTop();
        var sLeft = $d.scrollLeft();
        GENTICS.Aloha.activeEditable.obj[0].focus();
        $d.scrollTop(sTop);
        $d.scrollLeft(sLeft);
    }
}

function refreshSelection() {
    focusEditable();
    GENTICS.Aloha.Selection.rangeObject.update();
    GENTICS.Aloha.Selection.rangeObject.select();
    GENTICS.Aloha.Selection.updateSelection();
};

function mergeAdjacentLists($list) {
    // first get the first previous sibling of same type
    var first = $list.get(0);
    while (first.previousSibling && first.previousSibling.nodeType == 1
    && first.previousSibling.nodeName == first.nodeName) {
        first = first.previousSibling;
    }

    var $list = $(first);
    // now merge all adjacent lists into this one
    while (first.nextSibling
    && ((first.nextSibling.nodeType == 1 && first.nextSibling.nodeName == first.nodeName) ||
    (first.nextSibling.nodeType == 3 && $.trim(first.nextSibling.data).length == 0))) {
        var $next = $(first.nextSibling);
        if (first.nextSibling.nodeType == 1) {
            $next.contents().appendTo($list);
        }
        $next.remove();
    }
};

function findTagInRange(range, tag, atEnd) {
    /*
    Return a dom node if a tag by that name is found in the range.

    tag should be the lowercase tag name you're looking for.
    */
    if (GENTICS.Aloha.activeEditable) {
        return range.findMarkup(function() {
            return this.nodeName.toLowerCase() == tag;
        }, GENTICS.Aloha.activeEditable.obj, atEnd);
    } else {
        return null;
    }
}

function findFirstInRange(range, tags, atEnd) {
    /*
    Return the first dom node in the range that matches any of tags.

    tags should be an array of lowercase tag names you're looking for.
    */
    if (GENTICS.Aloha.activeEditable) {
        return range.findMarkup(function() {
            return ($.inArray(this.nodeName.toLowerCase(), tags) != -1);
        }, GENTICS.Aloha.activeEditable.obj, atEnd);
    } else {
        return null;
    }
}

function findTagsInRange(range, tags, atEnd) {
    /*
    Return an array of dom nodes for each tag found in the range by name.

    tags should be an array of lowercase tag names you're looking for.
    */
    if (GENTICS.Aloha.activeEditable) {
        var found = [];
        for (var i in tags) {
            var tag = tags[i];
            var t = range.findMarkup(function() {
                return this.nodeName.toLowerCase() == tag;
            }, GENTICS.Aloha.activeEditable.obj, atEnd);
            if (t) {
                found.push(t);
            }
        }
        return found;
    } else {
        return [];
    }
}

var standardBlocks = 'p h1 h2 h3 h4 h5 h6'.split(' ');
var standardInlines = 'b i'.split(' ');
var knownBlocks = 'p h1 h2 h3 h4 h5 h6 li'.split(' ');

function showDialog(dialog, x, y) {
    /*
    Animate the dialog to where it should be.

    * if it is visible already, animate-move it to where it should be
    * if it isn't visible, move it to where it should be, fade it in.
    */
    if (dialog.visible) {
        dialog.jq.animate({
            'left': x+'px',
            'top': y+'px'
        }, 100);
    } else {
        if (dialog.show) {
            dialog.show();
        }
        dialog.jq.css('left', x+'px').css('top', y+'px');
        dialog.jq.fadeIn(200);
    }
    dialog.visible = true;
    dialog.x = x;
    dialog.y = y;
}
function hideDialog(dialog, immediately) {
    /*
    Animate-hide the dialog.
    */
    if (dialog.visible) {
        if (immediately) {
            dialog.jq.hide();
        } else {
            dialog.jq.fadeOut(200);
        }
        dialog.visible = false;
        if (dialog.hideCleanup) {
            dialog.hideCleanup();
        }
    }
}

function showDialogAbovePoint(dialog, x, y) {
    var l, t, w, h;

    l = x;
    t = y
    w = dialog.jq.width();
    h = dialog.jq.height();
    l = Math.floor(l - (w/2));
    t = t - h;

    t -= 3; // take into account some line height

    showDialog(dialog, l, t);
}

function showDialogAboveElement(dialog, $element) {
    // work out where to place the dialog so it points to element
    var w, h, offset, l, t;

    w = $element.outerWidth(true);
    h = $element.outerHeight(true);
    offset = $element.offset();
    l = offset.left+(w/2);
    t = offset.top;
    w = dialog.jq.width();
    h = dialog.jq.height();
    l = Math.floor(l - (w/2));
    t = t - h;

    t -= 3; // take into account some line height

    showDialog(dialog, l, t);
}

function showDialogBelowElement(dialog, $element) {
    // work out where to place the dialog so it points to element
    var w, h, offset, l, t;

    w = $element.outerWidth(true);
    h = $element.outerHeight(true);
    offset = $element.offset();
    l = Math.floor(offset.left+(w/2));
    t = offset.top+h;

    w = dialog.jq.width();
    h = dialog.jq.height();
    l = Math.floor(l - (w/2));

    t += 3; // take into account some line height

    showDialog(dialog, l, t);
}
function showDialogToLeftOfPoint(dialog, x, y) {
    var l, t, w, h;

    l = x;
    t = y
    w = dialog.jq.width();
    h = dialog.jq.height();
    l = l - w;
    t = t - Math.floor(h/2);

    showDialog(dialog, l, t);
}
function showDialogToRightOfPoint(dialog, x, y) {
    var l, t, w, h;

    l = x;
    t = y
    w = dialog.jq.width();
    h = dialog.jq.height();
    t = t - Math.floor(h/2);

    showDialog(dialog, l, t);
}
function showDialogToRightOfElement(dialog, $element) {
    // work out where to place the dialog so it points to element
    var w, h, offset, l, t;

    w = $element.outerWidth(true);
    h = $element.outerHeight(true);
    offset = $element.offset();
    l = offset.left+w;
    t = Math.floor(offset.top+(h/2));

    w = dialog.jq.innerWidth();
    h = dialog.jq.innerHeight();
    t = Math.floor(t - (h/2));

    //l += 5; // don't put it on top of chrome's blue focus border glow thing
    l += 2; // looks a little bit better if spaced a bit away

    showDialog(dialog, l, t);
}
function showDialogOnElement(dialog, $element) {
    var w, h, offset, l, t;

    w = $element.outerWidth(true);
    h = $element.outerHeight(true);
    offset = $element.offset();
    l = offset.left+(w/2);
    t = offset.top+(h/2);

    w = dialog.jq.innerWidth();
    h = dialog.jq.innerHeight();
    l -= w/2;
    t -= h/2;

    l = Math.floor(l);
    t = Math.floor(t);

    showDialog(dialog, l, t);
}

var selectionDialog = {
    visible: false,
    lastPageX: null,
    lastPageY: null,
    init: function() {
        this.id = 'wig-selection-dialog';
        $('body').append(options['selection-dialog']);
        this.jq = $('#'+this.id);
        $('#wig-selection-dialog .wig-button-b').live('click',
            this.toggleBold);
        $('#wig-selection-dialog .wig-button-i').live('click',
            this.toggleItalic);
        $('#wig-selection-dialog .wig-button-a').live('click',
            this.insertLink);
        $('#wig-selection-dialog .wig-button-span').live('click',
            this.insertSpan);
        subscribeSelectionChanged(this.selectionChanged);
    },
    toggleTag: function(tagName, markup) {
        // now focus back to the active element
        focusEditable();

        if (!markup) {
            markup = jQuery('<'+tagName+'></'+tagName+'>');
        }
        var rangeObject = GENTICS.Aloha.Selection.rangeObject;

        // check whether the markup is found in the range
        // (at the start of the range)
        var foundMarkup = rangeObject.findMarkup(function() {
            return this.nodeName.toLowerCase() == tagName;
        }, GENTICS.Aloha.activeEditable.obj);

        if (foundMarkup) {
            // remove the markup
            if (rangeObject.isCollapsed()) {
                // when the range is collapsed, remove exactly one DOM element
                GENTICS.Utils.Dom.removeFromDOM(foundMarkup, rangeObject, true);
            } else {
                // the range is not collapsed, so remove markup from the range
                GENTICS.Utils.Dom.removeMarkup(
                    rangeObject, markup, GENTICS.Aloha.activeEditable.obj);
            }
        } else {
            // when the range is collapsed, extend it to a word
            if (rangeObject.isCollapsed()) {
                GENTICS.Utils.Dom.extendToWord(rangeObject);
            }

            // add the markup
            GENTICS.Utils.Dom.addMarkup(rangeObject, markup);
        }
        // select the modified range
        //rangeObject.select();
        refreshSelection();
    },
    toggleBold: function() {
        selectionDialog.toggleTag('b');
    },
    toggleItalic: function() {
        selectionDialog.toggleTag('i');
    },
    insertLink: function() {
        selectionDialog.toggleTag('a', $('<a href="http://"></a>'));
        hideDialog(selectionDialog, true);
        // hack
        $(linkDialog.input).focus();
    },
    insertSpan: function() {
        // TODO: insertSpan
    },
    selectionChanged: function(event, rangeObject, originalEvent) {
        if (originalEvent && originalEvent.pageX) {
            selectionDialog.lastPageX = originalEvent.pageX;
            selectionDialog.lastPageY = originalEvent.pageY;
        }

        if (rangeObject.isCollapsed()) {
            hideDialog(selectionDialog);
            return;
        }

        var start = findFirstInRange(rangeObject, knownBlocks);
        var end = findFirstInRange(rangeObject, knownBlocks, true);

        var pageX, pageY;
        if (originalEvent && originalEvent.pageX) {
            pageX = originalEvent.pageX;
            pageY = originalEvent.pageY;
        } else if (selectionDialog.lastPageX) {
            var $element = $(start),
                lx = selectionDialog.lastPageX,
                ly = selectionDialog.lastPageY,
                w, h, offset, l, t;
            w = $element.outerWidth(true);
            h = $element.outerHeight(true);
            offset = $element.offset();
            l = offset.left;
            t = offset.top;
            if (lx >= l && lx <= w+l && ly >= t && ly <= h+t) {
                pageX = lx;
                pageY = ly;
            }
        }

        if (start && end && start == end) {
            //if ($.browser.webkit) {
            //if (originalEvent && originalEvent.pageX) {
            if (pageX && pageY) {
                /*
                // firefox does NOT like it when we add and remove spans -
                // it causes the selection to go away. Can't find an easy way to
                // get it back.
                // (and now also webkit)
                var startTag = $('<span id="wig-selection-start"></span>');
                var endTag = $('<span id="wig-selection-end"></span>');
                //GENTICS.Utils.Dom.insertIntoDOM(
                //    startTag, rangeObject, GENTICS.Aloha.activeEditable.obj);
                GENTICS.Utils.Dom.insertIntoDOM(
                    endTag, rangeObject, GENTICS.Aloha.activeEditable.obj, true);
                //var startOffset = $('#wig-selection-start').offset();
                var endOffset = $('#wig-selection-end').offset();

                var x = startOffset.left;
                var y = startOffset.top;
                if (Math.abs(endOffset.top - y) < 9) {
                    // place it in the middle for single-line selections
                    x = Math.floor(x + (endOffset.left-startOffset.left)/2);
                    y = endOffset.top;
                } else {
                    // use the end rather.
                    x = endOffset.left;
                    y = endOffset.top;
                }

                startTag.remove();
                endTag.remove();

                GENTICS.Utils.Dom.doCleanup({
                    merge: true,
                    removeempty: true
                }, rangeObject, rangeObject.markupEffectiveAtStart[0]);

                $('#wig-selection-dialog .wig-button')
                    .removeClass('wig-button-selected').show();

                function find(tagName) {
                    return rangeObject.findMarkup(function() {
                        return this.nodeName.toLowerCase() == tagName;
                    }, GENTICS.Aloha.activeEditable.obj);
                }

                var tags = ['a', 'b', 'i'];
                for (var i in tags) {
                    var tag = tags[i];
                    if (find(tag)) {
                        if (tag == 'a') {
                            $('#wig-selection-dialog .wig-button-'+tag).hide();
                        } else {
                            $('#wig-selection-dialog .wig-button-'+tag)
                                .addClass('wig-button-selected');
                        }
                    }
                }*/
                //var x = originalEvent.pageX;
                //var y = originalEvent.pageY;
                var x = pageX;
                var y = pageY;
                showDialogAbovePoint(selectionDialog, x, y-10);
            } else {
                // just use the closest block element
                showDialogAboveElement(selectionDialog, $(start));
            }

        } else {
            hideDialog(selectionDialog);
        }
    }
};
dialogs.push(selectionDialog);

var removeInlineDialog = {
    visible: false,
    init: function() {
        this.id = 'wig-remove-inline-dialog';
        $('body').append(options['remove-inline-dialog']);
        this.jq = $('#'+this.id);
        $('#wig-remove-inline-dialog .wig-button-b').live('click',
            this.removeBold);
        $('#wig-remove-inline-dialog .wig-button-i').live('click',
            this.removeItalic);
        subscribeSelectionChanged(this.selectionChanged);
    },
    removeTag: function(tag) {
        // now focus back to the active element
        focusEditable();
        var rangeObject = GENTICS.Aloha.Selection.rangeObject;

        var parent = findTagInRange(rangeObject, tag);
        if (!parent) {
            return;
        }

        var tagName = parent.tagName.toLowerCase();
        var markup = jQuery('<'+tagName+'></'+tagName+'>');

        // check whether the markup is found in the range
        // (at the start of the range)
        var foundMarkup = rangeObject.findMarkup(function() {
            return this.nodeName.toLowerCase() == tagName;
        }, GENTICS.Aloha.activeEditable.obj);

        if (foundMarkup) {
            // remove the markup
            if (rangeObject.isCollapsed()) {
                // when the range is collapsed, remove exactly one DOM element
                GENTICS.Utils.Dom.removeFromDOM(foundMarkup, rangeObject, true);
            } else {
                // the range is not collapsed, so remove markup from the range
                GENTICS.Utils.Dom.removeMarkup(
                    rangeObject, markup, GENTICS.Aloha.activeEditable.obj);
            }
        }
        // select the modified range
        rangeObject.select();
    },
    removeBold: function() {
        removeInlineDialog.removeTag('b');
    },
    removeItalic: function() {
        removeInlineDialog.removeTag('i');
    },
    selectionChanged: function(event, rangeObject) {
        if (!rangeObject.isCollapsed()) {
            hideDialog(removeInlineDialog);
            return;
        }

        var parent = findFirstInRange(rangeObject, ['b', 'i']);

        if (parent) {
            var $parent = $(parent);
            $('#wig-remove-inline-dialog .wig-button')
                .removeClass('wig-button-selected').hide();
            var selected = findTagsInRange(rangeObject, ['b', 'i']);
            for (var i in selected) {
                var tag = selected[i].nodeName.toLowerCase();
                $('#wig-remove-inline-dialog .wig-button-'+tag)
                    .addClass('wig-button-selected').show();
            }
            showDialogAboveElement(removeInlineDialog, $parent);
        } else {
            hideDialog(removeInlineDialog);
        }
    }
};
dialogs.push(removeInlineDialog);

var insertDialog = {
    visible: false,
    insertX: null,
    insertY: null,
    init: function() {
        this.id = 'wig-insert-dialog';
        $('body').append(options['insert-dialog']);
        this.jq = $('#'+this.id);
        $('#wig-insert-dialog .wig-button-img').live('click',
            this.insertImage);
        $('#wig-insert-dialog .wig-button-html').live('click',
            this.insertHTML);
        subscribeSelectionChanged(this.selectionChanged);
    },
    insertImage: function() {
        hideDialog(selectionDialog, true);
        hideDialog(insertDialog);

        insertImageDialog.draw();
        var x = insertDialog.insertX;
        var y = insertDialog.insertY; // extra for line height..
        insertImageDialog.jqP = insertDialog.jqP;
        showDialogToRightOfPoint(insertImageDialog, x, y);

        // TODO: once only
        var $arrow = $('#wig-insert-image-dialog .wig-arrow-left');
        var t = Math.floor((insertImageDialog.jq.outerHeight()/2)-5);
        $arrow.css('top', t+'px');
    },
    insertHTML: function() {
        hideDialog(selectionDialog, true);
        var rangeObject = GENTICS.Aloha.Selection.rangeObject;
        var p = findTagInRange(rangeObject, 'p');
        if (!p) {
            return;
        }
        var $newCode = $('<div class="wig-code wig-block-code"></div>');
        var $p = $(p);
        $p.replaceWith($newCode);
        $newCode.append(
        '<textarea></textarea>'+
        '<div class="wig-add-paragraphs">'+
        '<span class="wig-add-above" title="Insert paragraph above this block.">↑</span>'+
        '<span class="wig-add-below" title="Insert paragraph below this block.">↓</span>'+
        '</div>');
        $newCode.contentEditable(false);
        hideDialog(insertDialog);
        hideDialog(changeBlockDialog); // hack!
        $newCode.find('textarea').handleCodeTextarea();
    },
    selectionChanged: function(event, rangeObject) {
        /*if (!rangeObject.isCollapsed()) {
            hideDialog(insertDialog);
            return;
        }*/
        if (!rangeObject.isCollapsed()) {
            var start = findFirstInRange(rangeObject, knownBlocks);
            var end = findFirstInRange(rangeObject, knownBlocks, true);

            if (start && end && start == end) {
                // single-block selections aree fine
            } else {
                hideDialog(insertDialog);
                return;
            }
        }

        var startOfP = false;
        var emptyP = false;
        var insideInline = false;
        var afterImage = false;
        var inline;
        var p = findTagInRange(rangeObject, 'p');
        if (p) {
            /*if ($(p).find('> br').length == 1) {
                var looksEmpty = true;
                for (var i = 0; i < p.childNodes.length; ++i) {
                    var cnode = p.childNodes[i];
                    var cnodeName = cnode.nodeName.toLowerCase();
                    if (cnode.nodeType != 1) {
                        looksEmpty = false;
                        break;
                    }
                    if (cnode.nodeType == 1 && cnodeName != 'br') {
                        looksEmpty = false;
                        break;
                    }
                }
                if (looksEmpty) {
                    emptyP = true;
                }
            } else {
                if (p.childNodes.length == 0) {
                    emptyP = true;
                }
            }*/
            var emptyP = $(p).looksEmpty();
            if (emptyP) {
                // if it is an empty paragraph, then you must be at the start
                startOfP = true;
            } else if (rangeObject.startContainer == p.childNodes[0] &&
                       rangeObject.startOffset == 0) {
                // if you're at the start of the first text node, then you must
                // be at the start
                startOfP = true;
            } else {
                // because we control things so tightly we can be sure that only
                // these inline tags exist in the document, so if you are inside
                // one of them, and it is the first sibling, then you are
                // probably at the start. If the inline tag doesn't start at the
                // start of the paragraph, then you can't actually be right
                // inside it, so we don't have to worry about nested inline
                // tags.
                inline = findFirstInRange(rangeObject, ['a', 'b', 'i']);
                if (inline && !inline.previousSibling) {
                    if (rangeObject.startOffset == 0) {
                        // we are directly inside an inline tag that's right
                        // at the start of the paragraph.
                        startOfP = true;
                        insideInline = true;
                    }
                }
            }
        }
        if (!startOfP && rangeObject.startOffset == 0) {
            var prev = rangeObject.startContainer.previousSibling;
            if (prev && prev.nodeType == 1) {
                var name = prev.nodeName.toLowerCase();
                if (name == 'img') {
                    afterImage = true;
                } else if (name == 'a') {
                    var c = prev.childNodes[0];
                    if (c.nodeType == 1 && c.nodeName.toLowerCase() == 'img') {
                        afterImage = true;
                    }
                }
            }
        }
        //if (startOfP || afterImage) {
            insertDialog.jqP = $(p);

            var isVisible = false;
            var $codeButton = $('#wig-insert-dialog .wig-button-html');
            if (emptyP) {
                isVisible = true;
                $codeButton.show();
            } else {
                $codeButton.hide();
            }

            var $imageButton = $('#wig-insert-dialog .wig-button-img');
            var images;
            if (GENTICS.Aloha.activeEditable) {
                images = GENTICS.Aloha.activeEditable.obj.data('images');
            }
            if (images && images.length) {
                isVisible = true;
                $imageButton.show();
            } else {
                $imageButton.hide();
            }


            var offset;
            //if (insideInline) {
            //    offset = $(inline).offset();
            //} else {
                offset = $(p).offset();
            //}

            if (!isVisible || !offset) {
                hideDialog(insertDialog);
                return;
            }

            // space it out a bit and take in account line height
            var x = insertDialog.insertX = offset.left - 3;
            var y = insertDialog.insertY = offset.top + 24;
            showDialogToLeftOfPoint(insertDialog, x, y);

            // TODO: once only
            var $arrow = $('#wig-insert-dialog .wig-arrow-right');
            var t = Math.floor((insertDialog.jq.outerHeight()/2)-5);
            $arrow.css('top', t+'px');

        /*} else {
            hideDialog(insertDialog);
        }*/

    }
};
dialogs.push(insertDialog);

var insertImageDialog = {
    visible: false,
    images: null,
    init: function() {
        this.id = 'wig-insert-image-dialog';
        $('body').append(options['insert-image-dialog']);
        this.jq = $('#'+this.id);
        $('#wig-insert-image-dialog li').live('click', this.addImage)
        subscribeSelectionChanged(this.selectionChanged);
    },
    addImage: function(event) {
        var $li = $(this);
        var index = $li.index();
        var $p = insertImageDialog.jqP;
        var images = GENTICS.Aloha.activeEditable.obj.data('images');
        var image = images[index];
        var size = image.sizes['original'];
        var src = size.src;
        var width = size.width;
        var height = size.height;

        var klass = "left";
        if (width >= $p.width()) {
            klass = "center";
        }

        var html = '<div class="wig-imgwrap img-'+klass+'">'+
        '<img src="'+src+'" width="'+width+'" height="'+height+'">'+
        '</div>';

        var $img = $p.find('img:last');
        if ($img.length) {
            $img.after(html);
        } else {
            $p.prepend(html);
        }

        $p.find('.wig-imgwrap:last')
            .css('width', width+'px')
            .contentEditable(false);
        hideDialog(insertImageDialog);
    },
    selectionChanged: function(event, rangeObject) {
        hideDialog(insertImageDialog);
    },
    draw: function() {
        var html = '<ul>';
        var images = GENTICS.Aloha.activeEditable.obj.data('images');
        if (!images) {
            return;
        }
        for (var i in images) {
            var image = images[i];
            var sizeName = options['images-thumb-size'];
            var src = image.sizes[sizeName].src;
            html += '<li><img src="'+src+'"></li>';
        }
        html += '</ul>';
        $('#wig-insert-image-dialog .wig-contents').html(html);
    }
};
dialogs.push(insertImageDialog);

var changeBlockDialog = {
    visible: false,
    init: function() {
        this.id = 'wig-change-block-dialog';
        $('body').append(options['change-block-dialog']);
        this.jq = $('#'+this.id);
        $('#wig-change-block-dialog .wig-button').live('click',
            this.changeBlockTag);
        subscribeSelectionChanged(this.selectionChanged);
    },
    changeBlockTag: function() {
        // now focus back to the active element
        if (GENTICS.Aloha.activeEditable) {
            focusEditable();
        }
        var rangeObject = GENTICS.Aloha.Selection.rangeObject;
        if (!rangeObject.isCollapsed()) {
            var start = findFirstInRange(rangeObject, knownBlocks);
            var end = findFirstInRange(rangeObject, knownBlocks, true);

            if (start && end && start == end) {
                // single-block selections aree fine
            } else {
                return;
            }
        }
        var parent = findFirstInRange(rangeObject, standardBlocks);
        if (parent) {
            var tag = $.trim($(this).text());
            if (tag == 'li') {
                tag = 'ul';
            }

            if (tag == 'ul' || tag == 'ol') {
                // turn the block element into a list

                // create a new list
                var $list = $('<'+tag+'></'+tag+'>');

                // add a new list item
                var $newLi = $('<li></li>');

                // add the li into the list
                $list.append($newLi);

                // append the contents of the old dom element to the li
                $(parent).contents().appendTo($newLi);

                // replace the old dom element with the new list
                $(parent).replaceWith($list);

                // merge adjacent lists
                mergeAdjacentLists($list);

                // refresh the selection
                refreshSelection();

            } else {
                // switch the block tag to another type
                var markup = $('<'+tag+'></'+tag+'>');
                GENTICS.Aloha.Selection.changeMarkupOnSelection(markup);
            }
        }
    },
    selectionChanged: function(event, rangeObject) {
        $('.wig-selected-block').removeClass('wig-selected-block');

        if (!rangeObject.isCollapsed()) {
            var start = findFirstInRange(rangeObject, knownBlocks);
            var end = findFirstInRange(rangeObject, knownBlocks, true);

            if (start && end && start == end) {
                // single-block selections aree fine
            } else {
                hideDialog(changeBlockDialog);
                return;
            }
        }

        var parent = findFirstInRange(rangeObject, standardBlocks);
        if (parent) {
            var tag = parent.nodeName.toLowerCase();
            if (tag == 'h5' || tag == 'h6') {
                $('#wig-change-block-dialog .wig-button-h5').show();
                $('#wig-change-block-dialog .wig-button-h6').show();
            } else {
                $('#wig-change-block-dialog .wig-button-h5').hide();
                $('#wig-change-block-dialog .wig-button-h6').hide();
            }
            $('#wig-change-block-dialog .wig-button')
                .removeClass('wig-button-selected');

            $('#wig-change-block-dialog .wig-button-'+tag)
                .addClass('wig-button-selected');

            var $parent = $(parent);
            $parent.addClass('wig-selected-block');
            if ($parent.find('img').length == 0) {
                showDialogToRightOfElement(changeBlockDialog, $parent);

                // TODO: once only
                var $arrow = $('#wig-change-block-dialog .wig-arrow-left');
                var t = Math.floor((changeBlockDialog.jq.outerHeight()/2)-5);
                $arrow.css('top', t+'px');
            } else {
                // we only want images inside paragraph tags.
                hideDialog(changeBlockDialog);
            }
        } else {
            hideDialog(changeBlockDialog);
        }
    }
};
dialogs.push(changeBlockDialog);

var changeListDialog = {
    visible: false,
    init: function() {
        this.id = 'wig-change-list-dialog';
        $('body').append(options['change-list-dialog']);
        this.jq = $('#'+this.id);
        $('#wig-change-list-dialog .wig-button-indent').live('click',
            this.indentList);
        $('#wig-change-list-dialog .wig-button-ul').live('click',
            this.convertToUnordered);
        $('#wig-change-list-dialog .wig-button-ol').live('click',
            this.convertToOrdered);
        $('#wig-change-list-dialog .wig-button-unindent').live('click',
            this.unindentList);
        subscribeSelectionChanged(this.selectionChanged);
    },
    convertToUnordered: function() {
        var rangeObject = GENTICS.Aloha.Selection.rangeObject;
        var li = findTagInRange(rangeObject, 'li');
        if (li) {
            var $list = $(li).parent();

            // transform the ol into an ul
            GENTICS.Aloha.Markup.transformDomObject($list, 'ul');

            // merge adjacent lists
            mergeAdjacentLists($list);

            // refresh the selection
            refreshSelection();
        }
    },
    convertToOrdered: function() {
        var rangeObject = GENTICS.Aloha.Selection.rangeObject;
        var li = findTagInRange(rangeObject, 'li');
        if (li) {
            var $list = $(li).parent();

            // transform the ul into an ol
            GENTICS.Aloha.Markup.transformDomObject($list, 'ol');

            // merge adjacent lists
            mergeAdjacentLists($list);

            // refresh the selection
            refreshSelection();
        }
    },
    indentList: function() {
        var rangeObject = GENTICS.Aloha.Selection.rangeObject;
        var li = findTagInRange(rangeObject, 'li');
        if (li) {
            var $li = $(li);
            var $before = $li.prev('li');

            // when we are in the first li of a list, there is no indenting
            if ($before.length == 0) {
                // but we handled the TAB keystroke
                return false;
            }
            var $list = $li.parent();

            // create the new list element by cloning the list's parent
            var $newlist = $list.clone(false).empty();
            $newlist.append(li);

            // append the new list to the previous item
            $before.append($newlist);

            // merge adjacent lists
            mergeAdjacentLists($newlist);

            // refresh the selection
            refreshSelection();

            return false;
        }

        return true;
    },
    unindentList: function() {
        var rangeObject = GENTICS.Aloha.Selection.rangeObject;
        var li = findTagInRange(rangeObject, 'li');
        if (li) {
            var $li = $(li);

            // check whether the list is nested into another list
            var $list = $li.parent();

            // get the parent list
            // TODO: what if we're just not _directly_ inside another?
            var $parentList = $list.parents('ul,ol');

            // check whether the inner list is directly inserted into an li
            var $wrapLi = $list.parent('li');

            if ($parentList.length > 0
            && GENTICS.Utils.Dom.isListElement($parentList.get(0))) {
                // the list is nested into another list

                // now move the li into the higher list
                if ($wrapLi.length > 0) {
                    $wrapLi.after($li);
                } else {
                    $list.before($li);
                }

                // finally check whether there are elements left in the list
                if ($list.contents('li').length == 0) {
                    // list is completely empty, so remove it
                    $list.remove();
                }

                // check whether the wrapping li is empty now
                if ($wrapLi.length > 0 && $wrapLi.contents().length == 0) {
                    $wrapLi.remove();
                }

                // refresh the selection
                refreshSelection();
            }

            return false;
        }

        return true;
    },
    selectionChanged: function(event, rangeObject) {
        $('.wig-selected-li').removeClass('wig-selected-li');

        if (!rangeObject.isCollapsed()) {
            hideDialog(changeListDialog);
            return;
        }

        var li = findTagInRange(rangeObject, 'li');
        if (li && $(li).parents('.editable').length) {
            var $li = $(li);
            $li.addClass('wig-selected-li');

            // only the current list should be selected
            var $ul = $('#wig-change-list-dialog .wig-button-ul');
            var $ol = $('#wig-change-list-dialog .wig-button-ol');
            if (li.parentNode.nodeName.toLowerCase() == 'ol') {
                $ul.removeClass('wig-button-selected');
                $ol.addClass('wig-button-selected');
            } else {
                $ul.addClass('wig-button-selected');
                $ol.removeClass('wig-button-selected');
            }

            var $indent = $('#wig-change-list-dialog .wig-button-indent');
            var $unindent = $('#wig-change-list-dialog .wig-button-unindent');

            // only show unindent if we're not at the top of the tree
            if (li.parentNode.parentNode.nodeName.toLowerCase() == 'li') {
                $unindent.show();
            } else {
                $unindent.hide();
            }

            // only show indent if it is not the first list element
            if ($li.prev('li').length == 0) {
                $indent.hide();
            } else {
                $indent.show();
            }

            showDialogToRightOfElement(changeListDialog, $li);

            // TODO: move this to a function
            var $arrow = $('#wig-change-list-dialog .wig-arrow-left');
            var t = Math.floor((changeListDialog.jq.outerHeight()/2)-5);
            $arrow.css('top', t+'px');
        } else {
            hideDialog(changeListDialog);
        }
    }
};
dialogs.push(changeListDialog);

var linkDialog = {
    visible: false,
    link: null,
    range: null,
    init: function() {
        this.id = 'wig-link-dialog';
        $('body').append(options['link-dialog']);
        this.jq = $('#'+this.id);
        linkDialog.input = $('#wig-link-dialog input[name=href]')[0];
        $(linkDialog.input).keyup(this.updateLink).blur(this.blurInput);
        subscribeSelectionChanged(this.selectionChanged);
    },
    blurInput: function(event) {
        hideDialog(linkDialog);
        var $link = $(linkDialog.link);
        // TODO: do more URL validation: only domain-free absolute urls or
        // full-on protocol and everything urls allowed.
        if ($.inArray($.trim($link.attr('href')), ['', 'http://']) != -1) {
            linkDialog.removeLink();
        }
    },
    updateLink: function(event) {
        if (!linkDialog.link) {
            return;
        }
        var $link = $(linkDialog.link);
        var $input = $(linkDialog.input);
        var href = $input.val();
        $link.attr('href', href);
        if (event['keyCode'] == 27 || event['keyCode'] == 13) {
            $input.blur();
        }
    },
    removeLink: function() {
        var range = linkDialog.range;
        GENTICS.Utils.Dom.removeFromDOM(linkDialog.link, range, true);
        // nasty hack!
        hideDialog(selectionDialog);
    },
    selectionChanged: function(event, rangeObject) {
        var link = findTagInRange(rangeObject, 'a');
        linkDialog.link = null;
        linkDialog.range = null;
        if (link) {
            linkDialog.link = link;
            linkDialog.range = rangeObject;
            var $link = $(linkDialog.link);
            var $input = $(linkDialog.input);
            $input.attr('value', $link.attr('href'));
            showDialogBelowElement(linkDialog, $link);
        } else {
            hideDialog(linkDialog);
        }
    }
};
dialogs.push(linkDialog);

var editImageDialog = {
    visible: false,
    image: null,
    size: null,
    init: function() {
        this.id = 'wig-edit-image-dialog';
        $('body').append(options['edit-image-dialog']);
        this.jq = $('#'+this.id);

        // alt text
        $('#wig-edit-image-dialog input[name=alt]')
            .keyup(this.updateAlt).blur(this.updateAlt);
        // src
        $('#wig-edit-image-dialog .wig-sizes span')
            .live('click', this.sizeClicked);
        // link or class
        $('#wig-edit-image-dialog .wig-alignment span')
            .click(this.alignmentClicked);
        $('#wig-edit-image-dialog input[name=href]')
            .keyup(this.updateMeta).blur(this.updateMeta);
        // delete
        $('#wig-edit-image-dialog .wig-delete')
            .click(this.deleteImage);

        subscribeSelectionChanged(this.selectionChanged);
    },
    updateAlt: function(event) {
        var $img = editImageDialog.jqImage;
        var $alt = $('#wig-edit-image-dialog input[name=alt]');
        $img.attr('alt', $alt.val());
        if (event) {
            if (event['keyCode'] == 27 || event['keyCode'] == 13) {
                hideDialog(editImageDialog);
            }
        }
    },
    sizeClicked: function() {
        var $img = editImageDialog.jqImage;
        var $wrap = $img.parents('.wig-imgwrap');
        var $li = $(this).parent();
        $('#wig-edit-image-dialog .wig-sizes li').removeClass('wig-selected');
        var dimensions = $li.attr('class').split('-')[1];
        $li.addClass('wig-selected');

        var sizes = editImageDialog.image.sizes;
        for (var sizeName in sizes) {
            var size = sizes[sizeName];
            var d = size.width+'x'+size.height;
            if (d != dimensions) {
                continue;
            }
            $img.attr('src', size.src);
            $img.attr('width', size.width);
            $wrap.css('width', size.width+'px');
            $img.attr('height', size.height);
            showDialogOnElement(editImageDialog, $img);
            break;
        }
    },
    alignmentClicked: function() {
        var $img = editImageDialog.jqImage;
        var $li = $(this).parent();
        $('#wig-edit-image-dialog .wig-alignment li')
            .removeClass('wig-selected');
        $li.addClass('wig-selected');
        editImageDialog.updateMeta();
        showDialogOnElement(editImageDialog, $img);
    },
    updateMeta: function(event) {
        var $img = editImageDialog.jqImage;
        var $wrap = $img.parents('.wig-imgwrap');
        var $a = $img.parent('a');
        var $href = $('#wig-edit-image-dialog input[name=href]');
        var classes = $('#wig-edit-image-dialog .wig-alignment .wig-selected')
            .attr('class').split(' ');
        var align = 'left';
        for (var i in classes) {
            var k = classes[i];
            if (k.indexOf('align-') == 0) {
                align = k.split('-')[1];
                break;
            }
        }
        var href = $href.val();
        if (href) {
            // there should be an a tag
            if ($a.length) {
                $a.attr('href', href);
            } else {
                $img.wrap('<a href="'+href+'"></a>');
            }
        } else {
            // there shouldn't be an a tag
            if ($a.length) {
                $a.contents().unwrap();
            }
        }
        $wrap.attr('class', 'wig-imgwrap img-'+align);
        if (event) {
            if (event['keyCode'] == 27 || event['keyCode'] == 13) {
                hideDialog(editImageDialog);
            }
        }
    },
    deleteImage: function() {
        var $img = editImageDialog.jqImage;
        var $wrap = $img.parents('.wig-imgwrap');
        $wrap.remove();
        hideDialog(editImageDialog);
    },
    populate: function() {
        // sizes
        var html = '';
        if (editImageDialog.size) {
            var sizes = editImageDialog.image.sizes;
            var usedSizes = [];
            var size = editImageDialog.size;
            var selectedDimensions = size.width+'x'+size.height;
            for (var sizeName in sizes) {
                if ($.inArray(sizeName, options['images-disable-sizes']) != -1) {
                    continue;
                }
                var size = sizes[sizeName];
                var dimensions = size.width+' × '+size.height;
                var klass = size.width+'x'+size.height;
                if ($.inArray(klass, usedSizes) != -1) {
                    continue;
                }
                usedSizes.push(klass);
                html += '<li class="size-'+klass+'"><span>'+dimensions+
                    '</span></li>';
            }
        }

        var $dialog = editImageDialog.jq;

        var $img = editImageDialog.jqImage;
        var $wrap = $img.parents('.wig-imgwrap');
        var $a = $img.parent('a');
        var align = 'left';
        if ($wrap.hasClass('img-right')) {
            align = 'right';
        }
        if ($wrap.hasClass('img-center')) {
            align = 'center';
        }

        // select the size
        var $sizes = $dialog.find('.wig-sizes');
        if (editImageDialog.image) {
            $sizes.find('ul').html(html);
            $sizes.find('.size-'+selectedDimensions).addClass('wig-selected');
        } else {
            $sizes.hide();
        }

        // select the alignment
        var $alignment = $dialog.find('.wig-alignment');
        $alignment.find('li').removeClass('wig-selected');
        $alignment.find('.align-'+align).addClass('wig-selected');

        // fill in the alt text
        var $altinput = $dialog.find('input[name=alt]');
        $altinput.val($img.attr('alt'));

        // fill in the link
        var $linkinput = $dialog.find('input[name=href]');
        if ($a.length) {
            $linkinput.val($a.attr('href'));
        } else {
            $linkinput.val('');
        }
    },
    imageClicked: function(event) {
        if (!GENTICS.Aloha.activeEditable) {
            return true;
        }
        var $imgwrap = $(this).parents('.wig-imgwrap');
        var $img = $imgwrap.find('img');

        //$('.wig-imgwrap .wig-dialog').show();
        //$imgwrap.find('.wig-dialog').hide();

        editImageDialog.image = null;
        editImageDialog.size = null;

        // try and find the internal image and size
        var src = $img.attr('src');
        var images = GENTICS.Aloha.activeEditable.obj.data('images');
        for (var i in images) {
            var image = images[i];
            for (var sizeName in image.sizes) {
                var size = image.sizes[sizeName];
                if (size.src == src) {
                    editImageDialog.image = image;
                    editImageDialog.size = size;
                    break;
                }
            }
            if (editImageDialog.image) {
                break;
            }
        }

        editImageDialog.jqImage = $img;
        editImageDialog.populate();
        if (!editImageDialog.visible) {
            editableDeactivated(); // HACK
        }
        showDialogOnElement(editImageDialog, $img);
        editImageDialog.jq.find('input[name=href]').focus();

        event.preventDefault();
        event.stopPropagation();
        return false;
    },
    selectionChanged: function(event, rangeObject) {
        hideDialog(editImageDialog);
    },
    hideCleanup: function() {
        //$('.wig-imgwrap .wig-dialog').show();
    }
}
dialogs.push(editImageDialog);

var paste = {
    pasteHandlers: [],
    init: function() {
        // generate an editable div into which the pasting is done
        paste.jq = $('<div style="position:absolute; top:-100000px; left:-100000px"></div>');
        paste.jq.contentEditable(true);
        $('body').append(paste.jq);

        // subscribe to editableCreated to redirect paste events into our div
        GENTICS.Aloha.EventRegistry.subscribe(GENTICS.Aloha, 'editableCreated',
        function(event, editable) {
            // the events depend on the browser
            if (jQuery.browser.msie) {
                editable.obj.bind('beforepaste', function(event) {
                paste.redirectPaste();
            });
            } else {
                editable.obj.bind('paste', function(event) {
                    paste.redirectPaste();
                    window.setTimeout(function() {
                        paste.getPastedContent();
                    }, 10);
                });
            }
        });

        // for msie, we need to bind an event to our pasteDiv
        if ($.browser.msie) {
            paste.jq.bind('paste', function(event) {
                window.setTimeout(function() {getPastedContent();}, 10);
            });
        }
    },
    redirectPaste: function() {
        if ($('.wig-selected-block,.wig-selected-li').length == 0) {
            paste.currentRange = paste.currentEditable = null;
            return;
        }
        // store the current range
        paste.currentRange = new GENTICS.Utils.RangeObject(true);
        paste.currentEditable = GENTICS.Aloha.activeEditable;
        var $d = $(document);
        paste.sTop = $d.scrollTop();
        paste.sLeft = $d.scrollLeft();

        // empty the div
        paste.jq.text('');

        // blur the active editable
        if (paste.currentEditable) {
            paste.currentEditable.blur();
        }

        // set the cursor into the paste div
        GENTICS.Utils.Dom.setCursorInto(paste.jq.get(0));

        // focus the pasteDiv
        paste.jq.focus();
    },
    getPastedContent: function() {
        if (!(paste.currentRange && paste.currentEditable)) {
            return;
        }

        /*if ($('#before').length) {
            var h = paste.jq.clone().remove().html().replace(/</g, '\n&lt;').replace(/>/g, '&gt;');
            $('#before').html(h.replace(/\n/g, '<br>'));
        }*/

        // clean the pasted code
        paste.jq.cleanup({
            'reservedClasses': '.editable, .GENTICS_editable, '+
                '.wig-selected-block, .wig-selected-li',
            'dodgyElements': '.wig-code', //, .GENTICS_ephemera
            'validImageDomains': options.validImageDomains,
            'stripUnknown': true
        });
        paste.jq.unknownToCode({
            'blockClasses': 'wig-code wig-block-code',
            'inlineClasses': 'wig-code wig-inline-code',
            'innerClasses': 'wig-inner'
        });
        if (paste.jq.containsKnownBlockElements()) {
            paste.jq.forceParagraphs();
        }

        /*if ($('#after').length) {
            var h = paste.jq.clone().remove().html().replace(/</g, '\n&lt;').replace(/>/g, '&gt;');
            $('#after').html(h.replace(/\n/g, '<br>'));
            paste.currentRange = false;
            paste.currentEditable = false;
            paste.jq.html('');
            return;
        }*/

        // activate and focus the editable
        paste.currentEditable.activate();
        focusEditable();

        // TODO: remove selected text
        if (!paste.currentRange.isCollapsed()) {
            paste.currentRange = false;
            paste.currentEditable = false;
            paste.jq.text('');
            return; // PANIC
        }

        var pasteBlocks;

        // insert the content into the editable at the current range
        if (paste.currentRange && paste.currentEditable) {
            var contents;
            pasteBlocks = paste.jq.containsKnownBlockElements();
            if (pasteBlocks) {
                // block tags must go after the current block element
                contents = paste.jq.contents();
                var container = paste.currentRange.startContainer;
                var $container = $(container);
                var isEmpty = GENTICS.Utils.Dom.isEmpty(container);
                var $dodgybrs = $container.find('br.GENTICS_ephemera');
                var blockTag = findFirstInRange(
                    paste.currentRange, standardBlocks.concat(['ul', 'ol']));

                // panic if we're not inside any known block
                if (!blockTag) {
                    paste.currentRange = false;
                    paste.currentEditable = false;
                    paste.jq.text('');
                    return; // PANIC
                }

                // remove the existing one if it is empty
                $(blockTag).after(contents);
                if (isEmpty || $dodgybrs.length) {
                    $container.remove();
                }
            } else {
                contents = paste.jq.contents();
                // inline tags go where the cursor is
                for (var i=contents.length-1; i >= 0; i--) {
                    // insert the elements
                    // TODO: when inserting is not possible,
                    // eventually unwrap the contents and insert that?
                    GENTICS.Utils.Dom.insertIntoDOM(
                        $(contents.get(i)),
                        paste.currentRange,
                        paste.currentEditable.obj,
                        false);
                }
            }

            // set the cursor after the inserted DOM element
            if (contents.length > 0) {
                GENTICS.Utils.Dom.setCursorAfter(
                    contents.get(contents.length-1));
            } else {
                // if nothing was pasted, just reselect the old range
                //paste.currentRange.select();
                refreshSelection();
            }
        }
        paste.currentRange = false;
        paste.currentEditable = false;

        // empty the paste div
        paste.jq.text('');

        if (pasteBlocks) {
            $(document).scrollTop(paste.sTop);
            $(document).scrollLeft(paste.sLeft);
        }
    }
};

function initialize(settings) {
    if (initialized) {
        return;
    }
    initialized = true;
    for (var k in settings) {
        options[k] = settings[k];
    }
    for (var i in dialogs) {
        dialogs[i].init();
        dialogs[i].jq.mouseup(function(event) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        });
    }

    paste.init();

    GENTICS.Aloha.EventRegistry.subscribe(GENTICS.Aloha, 'editableDeactivated',
        editableDeactivated);

    handleBackspaceDodgyness();

    $('.wig-add-paragraphs .wig-add-above')
        .live('click', addParagraphAbove);
    $('.wig-add-paragraphs .wig-add-below')
        .live('click', addParagraphBelow);
}

function addParagraph(button, before) {
    var $parent = $(button).parents('.wig-block-code, .wig-dialog');
    if ($parent.length == 0) {
        return;
    }
    var $block;
    if ($parent.hasClass('wig-block-code')) {
        $block = $parent;
    } else {
        $block = editImageDialog.jqImage.parents('p');
    }
    var $p = $('<p><br class="GENTICS_ephemera"></p>');
    if (before) {
        $block.before($p);
    } else {
        $block.after($p);
    }

    var $editable = $p.parents('.GENTICS_editable');
    for (var i in GENTICS.Aloha.editables) {
        var editable = GENTICS.Aloha.editables[i];
        if (editable.obj[0] == $editable[0]) {
            editable.activate();
        }
    }

    GENTICS.Utils.Dom.setCursorInto($p[0]);
    GENTICS.Aloha.Selection.updateSelection();
}

function addParagraphAbove() {
    addParagraph(this, true);
}

function addParagraphBelow() {
    addParagraph(this, false);
}

$.fn.wig = function(settings, value) {
    if (!initialized) {
        initialize(settings);
    }

    var toDestroy = [];
    for (var i in GENTICS.Aloha.editables) {
        var editable = GENTICS.Aloha.editables[i];
        if ($(editable.obj).parents('body').length == 0) {
            toDestroy.push(editable);
        }
    }
    for (var i in toDestroy) {
        GENTICS.Aloha.unregisterEditable(toDestroy[i]);
    }

    return this.each(function() {
        var $editable = $(this);
        $editable.cleanup({
            'validImageDomains': settings.validImageDomains
        });
        $editable.unknownToCode({
            'blockClasses': 'wig-code wig-block-code',
            'inlineClasses': 'wig-code wig-inline-code',
            'innerClasses': 'wig-inner'
        });

        $editable.forceParagraphs();

        if ($.trim($editable.html()) == '') {
            $editable.html('<p><br class="GENTICS_ephemera"></p>');
        }
        $editable.bind('dragover drop', function(event){
            event.preventDefault();
            return false;
        });

        $editable.wrapImages();

        $editable.find('img').live('mouseup', editImageDialog.imageClicked);
        $editable.find('.wig-imgwrap .wig-edit').live('mouseup', editImageDialog.imageClicked);
        $editable.find('.wig-imgwrap a').live('click', function(event) {
            event.preventDefault();
            return false;
        });

        $editable.find('textarea').handleCodeTextarea();

        var $form = $editable.parents('form');
        $form.bind('form:serialize', function() {
            var html = $editable.serializeWithoutCode();
            var name = $editable.attr('id').split('-')[1];
            if ($form.find('input[name='+name+']').length == 0) {
                $editable.after('<input type="hidden" name="'+name+'">');
            }
            $form.find('input[name='+name+']').val(html);
        });

        new GENTICS.Aloha.Editable($editable);
    });
};

})(jQuery);
