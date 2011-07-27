/*!
* Aloha Editor
* Author & Copyright (c) 2010 Gentics Software GmbH
* aloha-sales@gentics.com
* Licensed unter the terms of http://www.aloha-editor.com/license.html
*/

/**
 * jQuery Extension
 * new Event which is triggered whenever a selection (length >= 0) is made in 
 * an Aloha Editable element
 */
jQuery.fn.GENTICS_contentEditableSelectionChange = function(callback) {
    var that = this;

    // update selection when keys are pressed
    this.keyup(function(event){
        var rangeObject = GENTICS.Aloha.Selection.getRangeObject();
        callback(event);
    });
    
    // update selection on doubleclick (especially important for the first automatic selection, when the Editable is not active yet, but is at the same time activated as the selection occurs
    this.dblclick(function(event) {
        callback(event);
    });
    
    // update selection when text is selected
    this.mousedown(function(event){
        // remember that a selection was started
        that.selectionStarted = true;
    });
    jQuery(document).mouseup(function(event) {
        GENTICS.Aloha.Selection.eventOriginalTarget = that;
        if (that.selectionStarted) {
            callback(event);
        }
        GENTICS.Aloha.Selection.eventOriginalTarget = false;
        that.selectionStarted = false;
    });
    
    return this;
};

jQuery.fn.outerHTML = function(s) {
    if (s) {
        return this.before(s).remove();
    } else {
        return jQuery("<p>").append(this.eq(0).clone()).html();
    }
};