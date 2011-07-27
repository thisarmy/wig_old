(function($) {
var html5InlineTags = ['a', 'abbr', 'address', 'area', 'audio', 'bm', 'cite',
    'code', 'del', 'details', 'dfn', 'command', 'datalist', 'em', 'font', 'i',
    'iframe', 'img', 'input', 'ins', 'kbd', 'label,', 'legend,', 'link,',
    'mark,', 'meter,', 'nav,', 'optgroup,', 'option,', 'q,', 'small,',
    'select,', 'source,', 'span,', 'strong,', 'sub,', 'summary,', 'sup,',
    'tbody,', 'td,', 'time,', 'var'];
var html5BlockTags = ['article', 'aside', 'blockquote', 'body', 'br', 'button',
    'canvas', 'caption', 'col', 'colgroup', 'dd', 'div', 'dl', 'dt', 'embed',
    'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3',
    'h4', 'h5', 'h6', 'header', 'hgroup', 'hr', 'li', 'map', 'object', 'ol',
    'output', 'p', 'pre', 'progress', 'section', 'table', 'tbody', 'textarea',
    'tfoot', 'th', 'thead', 'tr', 'ul', 'video'];
var html5Tags = html5InlineTags.concat(html5BlockTags);

var knownInlineTags = ['a', 'b', 'i'];
var knownBlockTags = ['p', 'ul', 'ol', 'li',
                      'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
var knownTags = knownInlineTags.concat(knownBlockTags).concat('br');
var allowedInlineTags = knownInlineTags.concat(['br', 'img']);
var knownNestedTags = allowedInlineTags.concat(['li']);

$.fn.looksEmpty = function() {
    var node = this[0];
    if (!node) {
        return true;
    }
    if (!node.childNodes.length) {
        return true;
    }
    if (node.childNodes.length == 1) {
        var tagname = node.childNodes[0].tagName;
        if (tagname) {
            tagname = tagname.toLowerCase();
        }
        if (tagname == 'br') {
            return true;
        } else if (node.childNodes[0].nodeType == 3) {
            if ($.trim(node.childNodes[0].nodeValue) == '') {
                return true;
            }
        }
    }
    return false;
};

$.fn.fillEmptyBlocks = function() {
    var selector = ['p', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].join(',');
    this.each(function() {
        var $parent = $(this);
        $parent.find(selector).each(function() {
            var $tag = $(this);
            if ($tag.looksEmpty()) {
                $tag.html('<br class="GENTICS_ephemera">');
            }
        });
    });
};

$.fn.explicitlyNotContenteditable = function() {
    var ce = this.attr("contenteditable");
    return (ce == "false" || ce == false);
};

// CLEANUP:
$.fn.cleanup = function(settings) {
    var options = $.extend({
        'reservedClasses': '.editable',
        'dodgyElements': null,
        'stripUnknown': false
    }, settings);

    this.each(function() {
        var $this = $(this);

        // remove custom stuff
        if (options.reservedClasses) {
            $this.find(options.reservedClasses).removeAttr('class');
        }
        if (options.dodgyElements) {
            $this.find(options.dodgyElements).remove();
        }

        if (options.stripUnknown) {
            // remove meta tags (added by webkit)
            $this.find('meta').remove();

            // remove top-level comments (TODO: comments lower down too)
            $this.contents().each(function() {
                if (this.nodeType == 8) {
                    $(this).remove();
                }
            });

            // strong -> b
            $this.find('strong').each(function() {
                var $strong = $(this);
                var $b = $('<b></b>');
                $b.html($strong.html());
                $strong.after($b).remove();
            });

            // em -> i
            $this.find('em').each(function() {
                var $em = $(this);
                var $i = $('<i></i>');
                $i.html($em.html());
                $em.after($i).remove();
            });
        }

        if (options.stripUnknown) {
            // remove ALL styles, classes and ids
            $this.find('*')
            .each(function() {
                var $tag = $(this);
                var tagName = this.tagName.toLowerCase();
                // only strip classes when pasting
                /*if (!options.stripUnknown) {
                    if (knownTags.indexOf(tagName) != 0 ||
                        $tag.parents().exclude(knownTags.join(',').length > 0)) {
                        return;
                    }
                }*/
                $tag.removeAttr('style');
                $tag.removeAttr('id');
                if (tagName == 'img') {
                    var $img = $tag;
                    var $a = $img.parent('a');
                    if (!$a.length) {
                        var align = 'left';
                        if ($img.hasClass('left')) {
                            align = 'left';
                        }
                        if ($img.hasClass('right')) {
                            align = 'right';
                        }
                        if ($img.hasClass('center')) {
                            align = 'center';
                        }
                        $img.removeAttr('class');
                        $img.addClass(align);
                    }
                } else if (tagName == 'a') {
                    var $a = $(this);
                    var align;
                    if ($a.hasClass('img-left')) {
                        align = 'img-left';
                    }
                    if ($a.hasClass('img-right')) {
                        align = 'img-right';
                    }
                    if ($a.hasClass('img-center')) {
                        align = 'img-center';
                    }
                    $a.removeAttr('class');
                    if (align) {
                        $a.addClass(align);
                    }

                } else if (tagName == 'br') {
                    var $br = $(this);
                    if ($br.hasClass('GENTICS_ephemera')) {
                        $br.removeAttr('class').addClass('GENTICS_ephemera');
                    } else {
                        $br.removeAttr('class');
                    }
                } else {
                    $(this).removeAttr('class');
                }
            });

            // remove some empty nodes
            var checkTags = ['div', 'font', 'span'].concat(knownBlockTags);
            var checks = [];
            for (var i in checkTags) {
                checks.push(checkTags[i]+':empty');
            }
            var selector = checks.join(',')
            $this.find(selector).remove();

            // font, span and div tags get unwrapped when pasting
            $this.find('div,font,span').contents().unwrap();
        }

        // remove from tables: border, cellspacing, cellpadding
        // remove from td: width, height, valign

        // WORD: p.MsoTitle -> h1
        // WORD: p.MsoSubtitle -> h2
        // WORD: remove remaining mso* classes
        // WORD: remove namespaced elements
        // WORD: things that should be lists

        // make non-lowercase tags lowercase

        // combine adjacent text nodes

        // if there are top-level block tags, remove top-level br tags
        if ($this.containsKnownBlockElements()) {
            $this.find('> br').remove();
        }

        // validate image domains
        if (options.validImageDomains) {
            $this.find('img').each(function() {
                var $img = $(this);
                var domain = $img.attr('src');
                if (domain.indexOf('http://') == 0) {
                    domain = domain.substr('http://'.length);
                }
                if (domain.indexOf('https://') == 0) {
                    domain = domain.substr('https://'.length);
                }
                domain = domain.split('/')[0];
                if ($.inArray(domain, options.validImageDomains) == -1) {
                    var $a = $img.parent('a');
                    if ($a.length) {
                        $a.remove();
                    } else {
                        $img.remove();
                    }
                }
            });
        }

        // add the br placeholders
        $this.fillEmptyBlocks();
    });
    return this;
};

function fixTags(s) {
    // this fixes up the bits that were added by the backend so that wig would
    // not interpret special tags.
    var tags = ['script', 'iframe', 'object', 'embed', 'param', 'style',
    'link', 'form', 'noscript', 'param'];
    var expression = '';
    for (var i in tags) {
        var tag = tags[i];
        expression += '|((<)(replaceme)('+tag+'))';
        expression += '|((</)(replaceme)('+tag+')(>))';
    }
    s = s.replace('<widget>', '');
    s = s.replace('</widget>', '');
    return s.replace(new RegExp(expression.substr(1), 'gi'), function() {
        return arguments[0].toLowerCase().replace('replaceme', '');
    });
}

function escapeTags(s) {
    var tags = ['script', 'iframe', 'object', 'embed', 'param', 'style',
    'link', 'form', 'noscript', 'param'];
    var expression = '';
    for (var i in tags) {
        var tag = tags[i];
        expression += '|((<)('+tag+'))';
        expression += '|((</)('+tag+')(>))';
    }
    return s.replace(new RegExp(expression.substr(1), 'gi'), function() {
        if (arguments[0].indexOf('</') == 0) {
            return arguments[0].toLowerCase().replace('</', '</REPLACEME');
        } else {
            return arguments[0].toLowerCase().replace('<', '<REPLACEME');
        }

    });
}

// HANDLE-UNKNOWN:
$.fn.unknownToCode = function(settings) {
    var options = $.extend({
        'blockClasses': 'code block-code',
        'inlineClasses': 'code inline-code' // ignored for now
    }, settings);

    this.each(function() {
        var $this = $(this);

        // for now only allow inline tags and li tags to be nested
        // inside block tags.
        var bits = [];
        for (var i in knownBlockTags) {
            bits.push('> '+knownBlockTags[i]);
        }
        $this.find(bits.join(', ')).each(function() {
            $(this).find('*').each(function() {
                var tagname = this.tagName.toLowerCase();
                if ($.inArray(tagname, knownNestedTags) == -1) {
                    if ($(this).contents().length == 0) {
                        $(this).remove();
                    } else {
                        $(this).contents().unwrap();
                    }
                }
            });
        });

        //if ($this.containsKnownBlockElements()) {
            // unknown block-level tags become block code
            // detect adjacent ones and combine together into the same block
            var nodes = [];
            var contents = $this.contents();
            for (var i=0; i<contents.length; i++) {
                var node = contents[i];
                if (node.nodeType == 1) {
                    var tagName = node.nodeName.toLowerCase();
                    //if ($.inArray(tagName, knownBlockTags) == -1) {
                    if ($.inArray(tagName, knownTags) == -1) {
                        // unknown
                        if (nodes.length && $.isArray(nodes[nodes.length-1])) {
                            nodes[nodes.length-1].push(node);
                        } else {
                            nodes.push([node]);
                        }
                    } else {
                        // known
                        nodes.push(node);
                    }
                } else {
                    // non-tag
                    nodes.push(node);
                }
            }

            var $div = $('<div></div>');

            var snippet;
            for (var i=0; i<nodes.length; i++) {
                if ($.isArray(nodes[i])) {
                    var code = '';
                    for (var j=0; j<nodes[i].length; j++) {
                        snippet = $('<div></div>')
                            .append($(nodes[i][j]).clone())
                            .remove().html();
                        snippet = fixTags(snippet);
                        snippet = snippet.replace(/</g, '&lt;')
                            .replace(/>/g, '&gt;')+'\n';
                        code += snippet;
                    }
                    var $code = $('<div class="'+options.blockClasses+
                        '"></div>');
                    $code.contentEditable(false);
                    $code.append(
                    '<textarea>'+code+'</textarea>'+
                    '<div class="wig-add-paragraphs">'+
                    '<span class="wig-add-above" title="Insert paragraph above this block.">↑</span>'+
                    '<span class="wig-add-below" title="Insert paragraph below this block.">↓</span>'+
                    '</div>');

                    $div.append($code);
                } else {
                    $div.append($(nodes[i]).clone());
                }
            }

            $this.html($div.remove().html());
        //}

        // TODO: unknown inline tags should become inline code
    });
    return this;
};

// CONTAINS-BLOCK:
$.fn.containsKnownBlockElements = function() {
    // known blocks or divs (unknown block tags already changed to code blocks)
    var bits = ['> widget', '> div'];
    for (var i in knownBlockTags) {
        bits.push('> '+knownBlockTags[i]);
    }
    return ($(this).find(bits.join(', ')).length > 0);
};

// FORCE PARAGRAPHS:
$.fn.forceParagraphs = function() {
    // wrap top-level text and inline tags in paragraps
    this.each(function() {
        var $this = $(this);
        var nodes = [];
        var contents = $this.contents();
        for (var i=0; i<contents.length; i++) {
            var node = contents[i];
            if (node.nodeType == 3) {
                // text
                if (nodes.length && $.isArray(nodes[nodes.length-1])) {
                    nodes[nodes.length-1].push(node);
                } else {
                    nodes.push([node]);
                }
            } else {
                // not text
                if (node.nodeType == 1) {
                    // tag
                    var tagName = node.nodeName.toLowerCase();
                    if ($.inArray(tagName, allowedInlineTags) != -1) {
                        // a, b, i, br, img
                        if (nodes.length && $.isArray(nodes[nodes.length-1])) {
                            nodes[nodes.length-1].push(node);
                        } else {
                            nodes.push([node]);
                        }
                    } else {
                        nodes.push(node);
                    }
                } else {
                    nodes.push(node);
                }
            }
        }

        var $div = $('<div></div>');
        var snippet;
        for (var i=0; i<nodes.length; i++) {
            if ($.isArray(nodes[i])) {
                var text = '';
                for (var j=0; j<nodes[i].length; j++) {
                    var node = nodes[i][j];
                    if (node.nodeType == 1) {
                         // inline tag or br
                         var snippet = $('<div></div>')
                             .append($(node).clone())
                             .remove().html();
                         text += snippet;
                    } else {
                        // assume text
                        text += node.nodeValue;
                    }
                }
                if ($.trim(text)) {
                    $div.append('<p>'+text+'</p>');
                }
            } else {
                $div.append($(nodes[i]).clone());
            }
        }
        $this.html($div.remove().html());
    });
    return this;
};

$.fn.wrapImages = function() {
    this.each(function() {
        var q = 'a.img-left,a.img-center,a.img-right,'+
            'img.left,img.center,img.right';
        $(this).find(q).each(function() {
            var $this = $(this);
            var klass;
            if ($this.hasClass('img-left') || $this.hasClass('left')) {
                klass = 'img-left';
            } else if ($this.hasClass('img-right') || $this.hasClass('right')) {
                klass = 'img-right';
            } else if ($this.hasClass('img-center')|| $this.hasClass('center')) {
                klass = 'img-center';
            }
            if (klass) {
                $this.removeAttr('class');
                var $img = $this.find('img');
                if ($img.length) {
                    $img.removeAttr('class');
                } else {
                    $img = $this;
                }
                $this.wrap('<div class="wig-imgwrap '+klass+'"></div>');
                $wrap = $this.parents('.wig-imgwrap');
                $wrap.contentEditable(false);
                //$wrap.append('<div class="wig-help wig-edit">'+
                //    'edit this image</div>');
                $wrap.width($img.width());
            }
        });
    });
    return this;
};

// SERIALIZE:
$.fn.serializeWithoutCode = function() {
    // jquery cannot clone textarea values if you changed the textarea after
    // the page loaded, so we keep it around.
    var cachedHtml = {};
    var nextId = 1;
    this.find('textarea').each(function() {
        var id = 'textarea-'+nextId;
        $(this).attr('id', id);
        cachedHtml[id] = $(this).val();
        nextId += 1;
    });

    var $clone = this.clone(true);

    var nextBlock = 1;
    var blocks = {};
    // replace code widgets with the actual code and escape it
    $clone.find('.wig-block-code').each(function() {
        var $code = $(this);
        var html = cachedHtml[$code.find('textarea').attr('id')];
        var key = '___'+nextBlock+'___'
        blocks[key] = escapeTags(html);
        $code.html(key);
        $code.contents().unwrap();
        nextBlock += 1;
    });

    $clone.find('.wig-imgwrap').each(function() {
        var $this = $(this);
        var klass = 'left';
        var prefix = '';
        if ($this.find('>a').length) {
            prefix = 'img-';
        }
        if ($this.hasClass('img-right')) {
            klass = 'right';
        }
        if ($this.hasClass('img-center')) {
            klass = 'center';
        }
        $this.find('>*').addClass(prefix+klass);
        $this.contents().unwrap();
    });

    // remove the special line breaks added by Aloha
    $clone.find('br.GENTICS_ephemera, img + br').remove();

    // remove special classes and attributes
    $clone.find('*').each(function() {
        var $this = $(this);

        try {
            $this.removeAttr('contentEditable');
            $this.removeAttr('contenteditable');
        } catch(e) {
            // firefox weirdness
        }

        var klasses = $this.attr('class').split(' ');
        for (var i in klasses) {
            var klass = klasses[i];
            if (klass.indexOf('wig-') == 0) {
                $this.removeClass(klass);
            }
            if (klass.indexOf('GENTICS_') == 0) {
                $this.removeClass(klass);
            }
        }

        if (!$this.attr('class')) {
            $this.removeAttr('class');
        }

    });

    // remove some empty nodes
    var checks = [];
    for (var i in knownBlockTags) {
        checks.push(knownBlockTags[i]+':empty');
    }
    var selector = checks.join(',')
    $clone.find(selector).remove();

    // replace the placeholders again
    var html = $clone.html();
    for (var k in blocks) {
        html = html.replace(k, blocks[k]);
    }
    return html.replace(/REPLACEME/g, '')
               .replace(/<widget>/g, '')
               .replace(/<\/widget>/g, '');
    //return fixTags(html);
};

$.fn.handleCodeTextarea = function() {
    this.each(function() {
        $(this)
            .keydown(function(event) {
                GENTICS.Aloha.activeEditable.eventHandled = false;
                event.stopPropagation();
            })
            .blur(function() {
                var $textarea = $(this);
                if ($.trim($textarea.val()) == '') {
                    $textarea.parents('.wig-block-code').remove();
                }
            })
            .contentEditable(true);
    });
    return this;
};

})(jQuery);
