/* vq.hovercard.js */


/*
 * @class creates a Hovercard with options to persist the display and offer multiple actions, data, tools
 *
 * <pre>
 *     {
 *     timeout : {Number} - Milliseconds to persist the display after cursor has left the event source.  If self_hover is true, the
 *          hovercard also cancels the timer.
 *     target_mark : {HTMLElement} - Event source that represents the protovis Mark as an SVG/HTML Element
 *     data_config : {Object} - designates the display for the data section.  Each Object in the config consists of
 *              {title : property}
 *                      title : {String} - Title of the property to be displayed
 *                       property : {String/Function} - The string value of the property to be displayed or a function that returns a string.
 *                                                                  The function is passed the target's data as a parameter.
 *
 *      self_hover : {Boolean} - If true, placing the mouse cursor over the hovercard cancels the timer which hides the hovercard
 *      include_header : {Boolean} - If true, the header of the data panel is displayed.
 *       include_footer : {Boolean} - If true, the footer containing the CLOSE [X} action is displayed at the bottom of the hovercard
 *       include_frame : {Boolean} - If true, the frame that contains the hovercard actions (move,pin, etc) is displayed.
 *     </pre>
 */

vq.Hovercard = function(options) {
    this.id = vq.utils.VisUtils.guid();
    this.hovercard = document.createElement('div',this.id);
    $(this.hovercard).addClass('hovercard');
    this.lock_display = false;
    if (options) {
        this.timeout = options.timeout || 800;
        this.target_mark = options.target || null;
        this.data_config = options.data_config || null;
        this.tool_config = options.tool_config ||  null;
        this.self_hover = options.self_hover || true;
        this.include_footer = options.include_footer != null ? options.include_footer : this.self_hover || false;
        this.include_header = options.include_header != null ? options.include_header :  this.self_hover || true;
        this.include_frame = options.include_frame != null ? options.include_frame :  false;
    }
};

vq.Hovercard.prototype.show = function(anchorTarget,dataObject) {
    var that = this;
    if (!anchorTarget) { throw 'vq.Hovercard.show: target div not found.'; return;}
    this.target =  anchorTarget;
    $('<div></div>').addClass('data').html(this.renderCard(dataObject)).appendTo(that.hovercard);
    if (this.tool_config) {
        $('<div></div>').addClass('links').html(this.renderTools(dataObject)).appendTo(that.hovercard);
    }
    if (this.include_footer) $(this.hovercard).append(this.renderFooter());

    this.placeInDocument();
    this.start = function() {that.startOutTimer();};
    this.cancel = function() {
        $(that.target_mark).off('mouseout',that.start,false);
        that.cancelOutTimer();
    };
    this.close = function() {that.destroy();};
    $(this.target_mark).on('mouseout',that.start);
    $(this.getContainer()).on('mouseover',that.cancel);
    $(this.getContainer()).on('mouseout',that.start);

};

vq.Hovercard.prototype.startOutTimer =   function() {
    var that = this;
    if (!this.outtimer_id){ this.outtimer_id = window.setTimeout(function(){that.trigger();},that.timeout); }
};

vq.Hovercard.prototype.cancelOutTimer =  function() {
    if (this.outtimer_id){
        window.clearTimeout(this.outtimer_id);
        this.outtimer_id = null;
    }
};

vq.Hovercard.prototype.trigger = function (){
    if(this.outtimer_id) {
        window.clearTimeout(this.outtimer_id);
        this.outtimer_id = null;
        this.destroy();
    }
    return false;
};

vq.Hovercard.prototype.togglePin = function() {
    this.lock_display = !this.lock_display || false;
    var that = this;
    if ($(this.getContainer()).hasClass('pinned')) {
        $(this.getContainer()).on('mouseout',that.start).removeClass("pinned");
    } else {
        $(this.target_mark).off('mouseout',that.start);
        $(this.getContainer()).off('mouseout',that.start);
        this.cancelOutTimer();
        $(this.getContainer()).addClass("pinned");
    }
};

vq.Hovercard.prototype.placeInDocument = function(){
    var card = this.hovercard;
    var target = this.target;
    var offset = $(target).offset();
    card.style.display='block';
    $('body').append(card);
    $(card).offset({top: offset.top, // + offset.height,//+ (20 * this.transform.invert().k ) + 'px';
        left:  offset.left + $(card).outerWidth() > $('body').outerWidth() ? offset.left - $(card).outerWidth() : offset.left}); // + offset.width});// + (20 * this.transform.invert().k  ) + 'px';

    if (this.include_frame) {
        //$(card).prepend(hr);
        this.frame = this.renderFrame();
        $(card).prepend(this.frame);
        this.attachMoveListener();}
    $(card).show();

};

vq.Hovercard.prototype.hide = function() {
    if(!this.self_hover || !this.over_self) {
       $(this.hovercard).hide();
    }
};

vq.Hovercard.prototype.destroy = function() {
    this.hide();
    this.target_mark.removeEventListener('mouseout',this.start, false);
    this.getContainer().removeEventListener('mouseout',this.start,false);
    this.cancelOutTimer();
    if (this.getContainer().parentNode == document.body) {
        document.body.removeChild(this.getContainer());
    }
};

vq.Hovercard.prototype.isHidden = function() {
    return  $(this.hovercard).is(':hidden');
};

vq.Hovercard.prototype.renderCard = function(dataObject) {
    return  this.renderData(dataObject);
};

vq.Hovercard.prototype.attachMoveListener = function() {
    var that = this;
    var pos= {}, offset = {};

    function activateDrag(evt) {
        var ev = !evt?window.event:evt;
        //don't listen for mouseout if its a temp card
        if ($(that.getContainer()).hasClass("temp")) {
            $(that.getContainer()).off('mouseout',that.start);
        }
        //begin tracking mouse movement!
        $(window).on('mousemove',trackMouse);
        offset = vq.utils.VisUtils.cumulativeOffset(that.hovercard);
        pos.top = ev.clientY ? ev.clientY : ev.pageY;
        pos.left = ev.clientX ? ev.clientX : ev.pageX;
        //don't allow text selection during drag
        $(window).on('selectstart',vq.utils.VisUtils.disabler);
    }
    function disableDrag() {
        //stop tracking mouse movement!
        $(window).off('mousemove',trackMouse);
        //enable text selection after drag
        $(window).off('selectstart',vq.utils.VisUtils.disabler);
        //start listening again for mouseout if its not pinned
        if (!$(that.getContainer()).hasClass("pinned")) {
            $(that.getContainer()).on('mouseout',that.start);
        }
        pos = {};
    }
    function trackMouse(evt) {
        var ev = !evt?window.event:evt;
        var x = ev.clientX ? ev.clientX : ev.pageX;
        var y = ev.clientY ? ev.clientY : ev.pageY;
        $(that.hovercard).offset({left: offset.left + (x - pos.left),
            top : offset.top +  (y - pos.top)});
    }
    //track mouse button for begin/end of drag
    $(this.move_div).on('mousedown',activateDrag);
    $(this.move_div).on('mouseup' , disableDrag);
    //track mouse button in window, too.
    $(window).on('mouseup' , disableDrag);
};


vq.Hovercard.prototype.renderFrame = function() {
    var that = this;
    var frame = document.createElement('div');
    $(frame).addClass('tools');
    this.move_div = document.createElement('span');
    $(this.move_div).addClass('move').attr('title','Drag to move').html('<i class="icon-move"></i>').appendTo(frame);
    this.pin_div = document.createElement('span');
    $(this.pin_div).addClass('pin').attr('title','Click to pin').html('<i class="icon-pushpin"></i>')
        .on('click', pin_toggle)
        .appendTo(frame);
    function pin_toggle() {
        that.togglePin();
        return false;
    }
    return frame;
};

vq.Hovercard.prototype.renderTools = function(dataObject) {
    var get = vq.utils.VisUtils.get;
    var table = document.createElement('table');
    var tBody = document.createElement("tbody");
    $(table).append(tBody);

    if (this.tool_config) {
        for (var key in this.tool_config) {
            try {
                if (!this.tool_config.hasOwnProperty(key)) continue;
                var link = document.createElement('a');
                var href = this.tool_config[key].href;
                if (_.isFunction(href) && href(dataObject)) {
                    link.setAttribute('href',href(dataObject));
                }else if (!_.isFunction(href) && href) {
                    link.setAttribute('href', href);
                }
                else {
                    continue;
                }

                $(link).attr('target',"_blank");
                $(link).html(key);
                if(this.tool_config[key].key) {
                    var icon = document.createElement('i');
                    $(icon).addClass('icon-'+this.tool_config[key].key);
                    $(link).prepend(icon);
                }
                var trow = tBody.insertRow(-1);
                var tcell= trow.insertCell(-1);
                $(tcell).append(link);
            } catch(e) {
                console.warn('Data not found for tools in tooltip. ' + e);
            }
        }
    }
    return table;
};

vq.Hovercard.prototype.renderData = function(dataObject) {
    var get = vq.utils.VisUtils.get;
    var table = document.createElement('table');
    if (typeof dataObject == 'object') {
        if (this.include_header) {
            var thead = table.createTHead();
            var thead_row = thead.insertRow(-1);
            var thead_cell = thead_row.insertCell(-1);
            thead_cell.innerHTML = 'Property';
            thead_cell = thead_row.insertCell(-1);
            thead_cell.innerHTML = 'Value';
        }
        var tBody = document.createElement("tbody");
        table.appendChild(tBody);

        if (this.data_config) {
            for (var key in this.data_config) {
                try {
                    if (!this.data_config.hasOwnProperty(key)) continue;
                    var trow = tBody.insertRow(-1);
                    var tcell= trow.insertCell(-1);
                    tcell.innerHTML = '<b>' + key + '</b>:';
                    tcell.style.textAlign = 'right';
                    tcell= trow.insertCell(-1);
                    if (typeof  this.data_config[key] == 'function') {
                        tcell.innerHTML= '<span>' +  this.data_config[key](dataObject) + '</span>';
                    }else {
                        tcell.innerHTML= '<span>' +  get(dataObject,this.data_config[key]) + '</span>';
                    }
                } catch(e) {
                    console.warn('Data not found for tool tip: ' + e);
                }

            }
        } else {
            _.keys(dataObject).forEach(function(key) {
                try {
                    var trow = tBody.insertRow(-1);
                    var tcell= trow.insertCell(-1);
                    tcell.innerHTML = '<b>' + key + '</b>:';
                    tcell = trow.insertCell(-1);
                    tcell.innerHTML = '<span>' + get(dataObject,key) + '</span>';
                } catch (e) {
                    console.warn('Data not found for tool tip: ' + e);
                }
            });
        }

    }
    else if ( typeof dataObject == 'string') {
        return dataObject;
    }
    return table;
};

vq.Hovercard.prototype.getContainer = function() {
    return this.hovercard;
};

vq.Hovercard.prototype.renderFooter = function() {
    var that = this;
    var footer = document.createElement('div');
    $(footer).addClass('footer');
    // footer.setAttribute('style',"text-align:right;font-size:13px;margin-right:5px;color:rgb(240,10,10);cursor:pointer;");
    var close = document.createElement('span');
    function hideHovercard() {
        that.destroy();
        return false;
    }
    $(close).on('click',hideHovercard);
    $('<i></i>').addClass('icon-remove').html('CLOSE').appendTo(close);
    $(footer).append(close);
    return footer;
};

/**
 *
 * @class provides an anchor div for a target object this is "in scope" or using the mouse cursor.
 *  The anchor div's location is used to instantiate a vq.Hovercard object that
 *  provides self_hover, moveable, pin-able and tools
 *
 *
 * The configuration object has the following options:
 *
 * <pre>
 *
 * {
 *  timeout : {Number} - number of milliseconds (ms) before the box is shown. Default is 1000,
 *  close_timeout : {Number} - number of milliseconds (ms) the box continues to appear after 'mouseout' - Default is 0,
 *  param_data : {Boolean} -  If true, the object explicitly passed into the function at event (mouseover) time is used as the
 *          data.  If false, the data point underlying the event source (panel, dot, etc) is used.  Default is false.
 *  on_mark : {Boolean} - If true, the box is placed in respect to the event source mark.  If false, the box is placed in
 *          respect to the cursor/mouse position.  Defaults to false.
 *
 * include_header : {Boolean} - Place Label/Value headers at top of box.  Defaults to true.
 * include_footer : {Boolean} - Place "Close" footer at bottom of box.  Defaults to false.
 * self_hover : {Boolean} - If true, the box will remain visible when the cursor is above it.  Creates the "hovercard" effect.
 *          The footer must be rendered to allow the user to close the box.  Defaults to false.
 * data_config : {Object} - Important!  This configures the content of the hovering box.  This object is identical to the
 *          "tooltip_items" configuration in Circvis.  Ex. { Chr : 'chr', Start : 'start', End : 'end'}.  Defaults to null
 * }
 *
 * </pre>
 *
 * @param opts {JSON Object} - Configuration object defined above.
 */

vq.hovercard = function(opts) {

    var hovercard, anchor_div;
    var hovercard_div_id =  'vq_hover';

    function createHovercard(d) {
        var mark = this;
        var obj = d3.select(this);
        var info = opts.param_data ? d : obj.datum();
        var mouse_x = d3.event.pageX, mouse_y = d3.event.pageY;
        opts.canvas_id = opts.canvas_id || $('div svg').get(0);
        opts.self_hover = true;
        opts.include_frame = true;
        opts.include_footer = true;
        opts.target = mark;

        var c_id = $('#'+opts.canvas_id).first().parent().attr('id'); //this.root.canvas();
        if (!$('#' + c_id+'_rel').length) {
            $('#'+c_id).prepend('<div id='+ c_id+'_rel></div>');
            var relative_div = $('#'+c_id+'_rel');
            relative_div.css({'position':'relative','top':'0px','zIndex':'-1'});
        }
        else {
            relative_div = $('#' + c_id+'_rel');
        }

        if (!$('#'+hovercard_div_id).length) {
            $('<div id='+ hovercard_div_id + '></div>').appendTo(relative_div).css({'position':'absolute','zIndex':'-1'});
        }

        anchor_div = $('#' +hovercard_div_id).get(0);
        $(anchor_div).offset({'left': mouse_x, 'top': mouse_y});
        //opts.transform = t;

        hovercard = new vq.Hovercard(opts);
        hovercard.show(anchor_div,info);
    };
    return createHovercard;
};


