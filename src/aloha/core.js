/*!
*   This file is part of Aloha Editor
*   Author & Copyright (c) 2010 Gentics Software GmbH, aloha@gentics.com
*   Licensed unter the terms of http://www.aloha-editor.com/license.html
*/

/*
*   Aloha Editor is free software: you can redistribute it and/or modify
*   it under the terms of the GNU Affero General Public License as published by
*   the Free Software Foundation, either version 3 of the License, or
*   (at your option) any later version.*
*
*   Aloha Editor is distributed in the hope that it will be useful,
*   but WITHOUT ANY WARRANTY; without even the implied warranty of
*   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*   GNU Affero General Public License for more details.
*
*   You should have received a copy of the GNU Affero General Public License
*   along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

if (typeof GENTICS == 'undefined' || !GENTICS) {
    /*
     * The GENTICS global namespace object. If GENTICS is already defined, the
     * existing GENTICS object will not be overwritten so that defined
     * namespaces are preserved.
     */
    var GENTICS = {};
}

/**
 * Base Aloha Object
 * @namespace GENTICS.Aloha
 * @class Aloha The Aloha base object, which contains all the core functionality
 * @singleton
 */
GENTICS.Aloha = function() {};

// determine path of aloha for configuration
GENTICS.Aloha.setAutobase = function() {
    var scriptTags = jQuery('script');
    var path = scriptTags[scriptTags.length-1].src.split('?')[0]; // use last script tag (others are not yet parsed), remove any ?query
    path = path.split('/');
    var substitute = 1;
    // included by include-js.inc so it is referenced by the "core/" path
    if ('core' === path[path.length -2]) {
        substitute = 2;
    }
    GENTICS.Aloha.prototype.autobase = path.slice(0, substitute * -1).join('/') + '/';
};
GENTICS.Aloha.setAutobase();

// provide aloha version, is automatically set during build process
GENTICS.Aloha.prototype.version='##ALOHAVERSION##';

/**
 * Array of editables that are managed by Aloha
 * @property
 * @type Array
 */
GENTICS.Aloha.prototype.editables = [];

/**
 * The currently active editable is referenced here
 * @property
 * @type GENTICS.Aloha.Editable
 */
GENTICS.Aloha.prototype.activeEditable = null;

/**
 * Flag to mark whether Aloha is ready for use. Will be set at the end of the init() Function.
 * @property
 * @type boolean
 */
GENTICS.Aloha.prototype.ready = false;

/**
 * settings object, which will contain all Aloha settings
 * @cfg {Object} object Aloha's settings
 */
GENTICS.Aloha.prototype.settings = {};


/**
 * This represents the name of the users OS. Could be:
 * 'Mac', 'Linux', 'Win', 'Unix', 'Unknown'
 * @property
 * @type string
 */
GENTICS.Aloha.prototype.OSName = "Unknown";

/**
 * Array of callback functions to call when Aloha is ready
 * @property
 * @type Array
 * @hide
 */
GENTICS.Aloha.prototype.readyCallbacks = [];

/**
 * Initialize Aloha
 * called automatically by the loader
 * @event the "alohaready" event is triggered as soon as Aloha has finished it's initialization process
 * @hide
 */
GENTICS.Aloha.prototype.init = function() {
    // check browser version on init
    // this has to be revamped, as
    if (jQuery.browser.webkit && parseFloat(jQuery.browser.version) < 532.5 || // Chrome/Safari 4
        jQuery.browser.mozilla && parseFloat(jQuery.browser.version) < 1.9 || // FF 3.5
        jQuery.browser.msie && jQuery.browser.version < 7 || // IE 7
        jQuery.browser.opera && parseFloat(jQuery.browser.version) < 11) {
        alert("Sorry, your browser is not supported at the moment.");
        return;
    }


    var that = this;

    
    // register the body click event to blur editables
    jQuery('html').mousedown(function(event) {
        // if an Ext JS modal is visible, we don't want to loose the focus on
        // the editable as we assume that the user must have clicked somewhere
        // in the modal... where else could he click?
        // losing the editable focus in this case hinders correct table
        // column/row deletion, as the table module will clean it's selection
        // as soon as the editable is deactivated. Furthermore you'd have to
        // refocus the editable again, which is just strange UX
        //if (that.activeEditable && !that.isMessageVisible()) {
        if (event.target.tagName.toLowerCase() == 'img') {
            return;
        }
        if ($(event.target)
        .parents('.wig-dialog, .wig-widget').length == 0) {
            if (that.activeEditable) {
                that.activeEditable.blur();
                //that.FloatingMenu.setScope('GENTICS.Aloha.empty');
                that.activeEditable = null;
            }
        }
    });
    

    // initialize the base path to the aloha files
    if (typeof this.settings.base == 'undefined' || !this.settings.base) {
        this.settings.base = GENTICS.Aloha.autobase;
        if (typeof GENTICS_Aloha_base != 'undefined') {
            this.settings.base = GENTICS_Aloha_base;
        }
    }

    // initialize the Log
    this.Log.init();

    // initialize the error handler for general javascript errors
    if (!(this.settings.errorhandling == false)) {
        window.onerror = function(msg, url, linenumber) {
            GENTICS.Aloha.Log.error(GENTICS.Aloha, 'Error message: ' + msg + '\nURL: ' + url + '\nLine Number: ' + linenumber);
            // TODO eventually add a message to the message line?
            return true;
        };
    }

    // OS detection
    if (navigator.appVersion.indexOf("Win") != -1) {
        this.OSName = "Win";
    }
    if (navigator.appVersion.indexOf("Mac") != -1) {
        this.OSName = "Mac";
    }
    if (navigator.appVersion.indexOf("X11") != -1) {
        this.OSName = "Unix";
    }
    if (navigator.appVersion.indexOf("Linux") != -1) {
        this.OSName = "Linux";
    }

    // set aloha ready
    this.ready = true;

    // activate registered editables
    for (var i = 0; i < this.editables.length; i++) {
        if ( !this.editables[i].ready ) {
            this.editables[i].init();
        }
    }

    GENTICS.Aloha.EventRegistry.trigger(
        new GENTICS.Aloha.Event("alohaready", GENTICS.Aloha, null)
    );
};

/**
 * Activates editable and deactivates all other Editables
 * @param {Editable} editable the Editable to be activated
 * @return void
 */
GENTICS.Aloha.prototype.activateEditable = function(editable) {

    // blur all editables, which are currently active
    for (var i = 0; i < this.editables.length; i++) {
        if (this.editables[i] != editable && this.editables[i].isActive) {
            // remember the last editable for the editableActivated event
            var oldActive = this.editables[i];
            this.editables[i].blur();
        }
    }

    this.activeEditable = editable;
};

/**
 * Returns the current Editable
 * @return {Editable} returns the active Editable
 */
GENTICS.Aloha.prototype.getActiveEditable = function() {
    return this.activeEditable;
};

/**
 * deactivated the current Editable
 * @return void
 */
GENTICS.Aloha.prototype.deactivateEditable = function() {

    if ( typeof this.activeEditable == 'undefined' || this.activeEditable == null ) {
        return;
    }

    // blur the editable
    this.activeEditable.blur();

    // set scope for floating menu
    //this.FloatingMenu.setScope('GENTICS.Aloha.empty');

    this.activeEditable = null;
};

/**
 * Gets an editable by an ID or null if no Editable with that ID registered.
 * @param {string} id the element id to look for.
 * @return {GENTICS.Aloha.Editable} editable
 */
GENTICS.Aloha.prototype.getEditableById = function(id) {

    // serach all editables for id
    for (var i = 0; i < GENTICS.Aloha.editables.length; i++) {
        if (GENTICS.Aloha.editables[i].getId() == id) {
            return GENTICS.Aloha.editables[i];
        }
    }

    return null;
};

/**
 * Logs a message to the console
 * @param level Level of the log ("error", "warn" or "info", "debug")
 * @param component Component that calls the log
 * @param message log message
 * @return void
 * @hide
 */
GENTICS.Aloha.prototype.log = function(level, component, message) {
    GENTICS.Aloha.Log.log(level, component, message);
};

/**
 * build a string representation of a jQuery or DOM object
 * @param object to be identified
 * @return string representation of the object
 * @hide
 */
GENTICS.Aloha.prototype.identStr = function(object) {
    if (object instanceof jQuery) {
        object = object[0];
    }
    if (!(object instanceof HTMLElement)) {
        GENTICS.Aloha.Log.warn(this, '{' + object.toString() + '} provided is not an HTML element');
        return object.toString();
    }

    var out = object.tagName.toLowerCase();

    // an id should be unique, so we're okay with that
    if (object.id) {
        return out + '#' + object.id;
    }

    // as there was no id, we fall back to the objects class
    if (object.className) {
        return out + '.' + object.className;
    }

    // could not identify object by id or class name - so just return the tag name
    return out;
};

/**
 * Register the given editable
 * @param editable editable to register
 * @return void
 * @hide
 */
GENTICS.Aloha.prototype.registerEditable = function(editable) {
    this.editables.push(editable);
};

/**
 * Unregister the given editable. It will be deactivated and removed from editables.
 * @param editable editable to unregister
 * @return void
 * @hide
 */
GENTICS.Aloha.prototype.unregisterEditable = function(editable) {

    // Find the index
    //var id = this.editables.indexOf( editable );
    var id = jQuery.inArray(editable, this.editables);
    // Remove it if really found!
    if (id != -1) {
        this.editables.splice(id, 1);
    }
};

/**
 * String representation
 * @hide
 */
GENTICS.Aloha.prototype.toString = function() {
    return 'GENTICS.Aloha';
};

/**
 * Check whether at least one editable was modified
 * @method
 * @return {boolean} true when at least one editable was modified, false if not
 */
GENTICS.Aloha.prototype.isModified = function() {
    // check if something needs top be saved
    for (var i in this.editables) {
        if (this.editables[i].isModified) {
            if (this.editables[i].isModified()) {
                return true;
            }
        }
    }

    return false;
};

GENTICS.Aloha = new GENTICS.Aloha();

/**
/*
 * mark jQuery as Aloha's own version. In case someone is loading another version of jQuery this can be used
 * to detect and proclaim this problem
 */
jQuery.isAloha = true;

/**
 * Initialize Aloha when the dom is ready
 * @hide
 */
jQuery(document).ready(function() {
    // if there is no Aloha flag on jQuery, then jQuery has been overloaded
    if (!jQuery.isAloha && window.console && console.error) {
        console.error("Aloha ERROR: jQuery was included at least a second time after loading Aloha. " +
            "This will cause serious problems. You must not load other versions " +
            "of jQuery with Aloha.");
    }
    GENTICS.Aloha.init();
});
