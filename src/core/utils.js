/* vq.utils.js */

/** @namespace The namespace for utility classes focused on visualization tools. **/
vq.utils = {};
/**
 *
 *
 * Used as a static class object to reserve a useful namespace.
 *
 * @class Provides a set of static functions for use in creating visualizations.
 * @namespace A set of simple functions for laying out visualizations rapidly.
 *
 */

vq.utils.VisUtils =  {};

    vq.utils.VisUtils.divify =  function(c) {
        var result = null;
             if (typeof c == "string")  {
             result = document.getElementById(c) === undefined ? null : c ;
             } else if (typeof c == 'function' ) {
                 var val = c.call() + '';
                 result = document.getElementById(val) === undefined ? null : val ;
             }
        return result;
    };
    /**
     * Utility function for the creation of a div with specified parameters.  Useful in structuring interface for
     * multi-panel cooperating visualizations.
     *
     * @static
     * @param {String} id -  the id of the div to be created.
     * @param {String} [className] - the class of the created div
     * @param {String} [innerHTML] - text to be included in the div
     * @return divObj - a reference to the div (DOM) object
     *
     */
    vq.utils.VisUtils.createDiv = function(id, className, innerHtml) {
        var divObj;
        try {
            divObj = document.createElement('<div>');
        } catch (e) {
        }
        if (!divObj || !divObj.name) { // Not in IE, then
            divObj = document.createElement('div')
        }
        if (id) divObj.id = id;
        if (className) {
            divObj.className = className;
            divObj.setAttribute('className', className);
        }
        if (innerHtml) divObj.innerHTML = innerHtml;
        return divObj;
    };

    /**
     * Ext.ux.util.Clone Function
     * @param {Object/Array} o Object or array to clone
     * @return {Object/Array} Deep clone of an object or an array
     * @author Ing. Jozef Sak�lo?
     */
    vq.utils.VisUtils.clone = function(o) {
        if(!o || 'object' !== typeof o) {
            return o;
        }
        var c = '[object Array]' === Object.prototype.toString.call(o) ? [] : {};
        var p, v;
        for(p in o) {
            if(o.hasOwnProperty(p)) {
                v = o[p];
                if(v && 'object' === typeof v) {
                    c[p] = vq.utils.VisUtils.clone(v);
                }
                else {
                    c[p] = v;
                }
            }
        }
        return c;
    }; // eo function clone

vq.utils.VisUtils.get =  function(obj,prop) {
    var parts = prop.split('.');
    for(var i = 0; i < parts.length - 1; i++) {
        var p = parts[i];
        if(obj[p] === undefined) {
            obj[p] = {};
        }
        obj = obj[p];
    }
    p=parts[parts.length -1];
    return obj[p] === undefined ?  undefined : obj[p];
};



vq.utils.VisUtils.set = function(obj,prop,value) {
    var parts = prop.split('.');
    for(var i = 0; i < parts.length - 1; i++) {
        var p = parts[i];
        if(obj[p] === undefined) {
            obj[p] = {};
        }
        obj = obj[p];
    }
    p = parts[parts.length - 1];
    obj[p] = value || null;
    return this;
};

//sorting functions, etc

vq.utils.VisUtils.natural_order = function(a,b){return a-b};

    vq.utils.VisUtils.alphanumeric = function(comp_a,comp_b) {	//sort order -> numbers -> letters
        if (isNaN(comp_a || comp_b))  { // a is definitely a non-integer
            if (isNaN( comp_b || comp_a)) {   // both are non-integers
                return [comp_a, comp_b].sort();   // sort the strings
            } else {                // just a is a non-integer
                return 1;           // b goes first
            }
        } else if (isNaN(comp_b || comp_a)) {  // only b is a non-integer
            return -1;          //a goes first
        } else {                                    // both are integers
            return Number(comp_a) - Number(comp_b);
        }
    };


//function network_node_id(node) { return node.nodeName + node.start.toFixed(4) + node.end.toFixed(4);};
    vq.utils.VisUtils.network_node_id = function(node) {
        var map = vq.utils.VisUtils.options_map(node);
        if (map != null && map['label'] != undefined)
        {return map['label'];}
        return node.nodeName + node['start'].toFixed(2) + node['end'].toFixed(2);
    };

//function network_node_id(node) { return node.nodeName + node.start.toFixed(4) + node.end.toFixed(4);};
    vq.utils.VisUtils.network_node_title = function(node) {
        var map = vq.utils.VisUtils.options_map(node);
        if (map != null && map['label'] != undefined)
        {return map['label'] + ' \n' +  'Chr: ' + node.nodeName +
                '\nStart: ' + node['start'] +
                '\nEnd: ' + node['end'];}
        return node.nodeName + ' ' +  node['start'].toFixed(2) + ' ' + node['end'].toFixed(2);
    };

//function tick_node_id(tick) { return tick.chr + tick.start.toFixed(4) + tick.end.toFixed(4);};
    vq.utils.VisUtils.tick_node_id = function(tick) { return tick.value;};

    vq.utils.VisUtils.extend = function(target,source) {
    for (var v in source) {
          target[v] = source[v];
    }
        return target;
};



    vq.utils.VisUtils.parse_pairs = function(column,assign_str,delimit_str) {
        var map = {}, pair_arr =[], pairs = [];
            pair_arr =[];
            pairs = column.split(delimit_str);
            for (var i=0;i< pairs.length; i++) {
                pair_arr = pairs[i].split(assign_str);
                if (pair_arr.length == 2) {
                    map[pair_arr[0]] = pair_arr[1];
                }
            }
        return map;
    };

    vq.utils.VisUtils.options_map = function(node) {
        var options_map = {};
        if (node.options != null) {
            options_map = vq.utils.VisUtils.parse_pairs(node.options,'=',',');
        }
        return options_map;
    };

    vq.utils.VisUtils.wrapProperty = function(property) {
        if (typeof property == 'function'){
            return property;
        } else {
            return function() {return property;}
        }
    };

vq.utils.VisUtils.layoutChrTiles = function(tiles,overlap, max_level, treat_as_points) {
    var points = treat_as_points || Boolean(false);
    var new_tiles = [], chr_arr = [];
    chr_arr = _.uniq(_.pluck(tiles,'chr')); //find the unique chr labels
    chr_arr.forEach(function(chr) { // for each chr
        new_tiles = _.union(new_tiles,  //concat together tiles being laid out by chr.
                vq.utils.VisUtils.layoutTiles(_.where(tiles,{'chr':chr}),overlap,max_level,points)); 
    });
    // tiles.forEach(function(obj) { vq.utils.VisUtils.copyTile(obj,new_tiles);});
    return new_tiles;
};

// vq.utils.VisUtils.copyTile = function(tile,tile_set) {
//             var match = null,
//             index= 0,
//             props = _.keys(tile);
//             do {
//                  match = props.every(function(prop) { return ((tile[prop] == tile_set[index][prop]) ||
//                             (isNaN(tile[prop] && isNaN(tile_set[index][prop])))) ? 1 : 0;});
//                 index++;
//             }
//           while (index < tile_set.length && match != 1);
//             tile.level = tile_set[index-1].level;
//         return tile;
// };

vq.utils.VisUtils.layoutChrTicks = function(tiles,overlap,max_level) {
    return vq.utils.VisUtils.layoutChrTiles(tiles,overlap,max_level,true);
};

//tiles : {Array} of tiles.  tile is composed of start,end
// this returns an array with tile appended with a 'level' property representing a linear layout
// of non-overlapping Tiles

vq.utils.VisUtils.layoutTiles = function(tiles,overlap,max_level, treat_as_points){
    var points = treat_as_points || Boolean(false);
    var new_tiles = new Array(tiles.length);
    new_tiles = _.map(tiles,function(b) { return _.extend({},b,{tile_length : (b.end - b.start)});});  // generate a tile length property
    new_tiles = new_tiles.sort(function(a,b) { return (a.tile_length < b.tile_length) ? -1 :
            (a.tile_length > b.tile_length) ? 1 : a.start < b.start ? -1 : 1 ;}).reverse();         //sort all tiles by tile length
    if (new_tiles.length) {new_tiles[0].level = 0;}
    _.each(new_tiles,function(tile,index,array) {
            vq.utils.VisUtils.layoutTile(tile,index,array,overlap,max_level,treat_as_points);
    });
    return new_tiles;
};

vq.utils.VisUtils.layoutTile = function(tile,index,array,overlap,max_level, treat_as_points) {
        var points = treat_as_points || Boolean(false);
        var levels = array.slice(0,index)
                .map(
                function(a){
                    var t1 = vq.utils.VisUtils.extend({},a);
                    if (_.isNull(a.end))  t1.end = tile.start + 0.1;
                    else if (_.isNull(tile.end)) tile.end = tile.start + 0.1;
                    return vq.utils.VisUtils._isOverlapping(t1,tile,overlap || 0, points) ? a.level : null;
                }
                );
        levels = _.filter(levels, function(a) { return _.isFinite(a);}).sort(vq.utils.VisUtils.natural_order);
        var find = 0, l_index =0;
        while (find >= levels[l_index]) {
            if (find == levels[l_index]) { find++;}
            l_index++;
        }
        if (_.isUndefined(max_level)) { tile.level = find;}
        else
        {tile.level  = find <= max_level ? find : Math.floor(Math.random() * (max_level + 1));}
    };

vq.utils.VisUtils._isOverlapping = function(tile1,tile2,overlap, treat_as_points) {
    var point = treat_as_points || Boolean(false);
    if (point) return ((tile1.start-overlap) <= tile2.start && (tile1.start + overlap) >= tile2.start);
    else
    return ((tile1.start-overlap) <= tile2.end && (tile1.end + overlap) >= tile2.start);
};

vq.utils.VisUtils.tileCenter = function(tile) {
  if (!(_.isFinite(tile.end + tile.start)) && _.isNumber(tile.start)) { return tile.start;}
  return (tile.end + tile.start) >>> 1; // divide by 2 and drop fraction/sign.
};

//taken from PrototypeJS


  vq.utils.VisUtils.cumulativeOffset = function (element) {
    var valueT = 0, valueL = 0;
    if (element.parentNode) {
      do {
        valueT += element.offsetTop  || 0;
        valueL += element.offsetLeft || 0;
        element = element.offsetParent;
      } while (element);
    }
    return {left : valueL, top: valueT};
  };

 vq.utils.VisUtils.viewportOffset = function(forElement) {
    var valueT = 0, valueL = 0, docBody = document.body;

    var element = forElement;
    do {
      valueT += element.offsetTop  || 0;
      valueL += element.offsetLeft || 0;
      if (element.offsetParent == docBody &&
        element.style.position == 'absolute') break;
    } while (element = element.offsetParent);

    element = forElement;
    do {
      if (element != docBody) {
        valueT -= element.scrollTop  || 0;
        valueL -= element.scrollLeft || 0;
      }
    } while (element = element.parentNode);
    return {left:valueL, top:valueT};
  };

vq.utils.VisUtils.scrollOffset = function (element) {
    var valueT = 0, valueL = 0;
      do {
        valueT += element.scrollTop  || 0;
  	    valueL += element.scrollLeft || 0;
      } while (element = element.parentNode);
    return {left : valueL, top: valueT};
  };

vq.utils.VisUtils.outerHTML = function(node){
        // if IE, Chrome take the internal method otherwise build one
        return node.outerHTML || (
                                 function(n){
                                     var div = document.createElement('div'), h;
                                     div.appendChild( n.cloneNode(true) );
                                     h = div.innerHTML;
                                     div = null;
                                     return h;
                                 })(node);
};

vq.utils.VisUtils.translateToReferenceCoord = function(coord,panel) {
    var offset = vq.utils.VisUtils.scrollOffset(panel.root.canvas());
    return {x:coord.x + offset.left,y:coord.y+offset.top};
};

/* found on stackoverflow.com
    credit to "broofa"
 */

vq.utils.VisUtils.guid = function() {
   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
    });
};

vq.utils.VisUtils.openBrowserTab= function(url) {
        var new_window = window.open(url,'_blank');
        new_window.focus();
} ;

vq.utils.VisUtils.disabler = function(e) {
    if(e.preventDefault) { e.preventDefault();}
    return false;
};

$.fn.disableSelection = function() {
    return this.each(function() {
        $(this).attr('unselectable', 'on')
               .css({'-moz-user-select':'none',
                    '-o-user-select':'none',
                    '-khtml-user-select':'none',
                    '-webkit-user-select':'none',
                    '-ms-user-select':'none',
                    'user-select':'none'})
               .each(function() {
                    $(this).attr('unselectable','on')
                    .bind('selectstart',function(){ return false; });
               });
    });
};


vq.utils.VisUtils.enableSelect = function(el){
    if(el.attachEvent){
        el.detachEvent("onselectstart",vq.utils.VisUtils.disabler);
    } else {
        el.removeEventListener("selectstart",vq.utils.VisUtils.disabler,false);
    }
};

vq.utils.VisUtils.insertGCFCode = function() {

    document.write(' \
<!--[if lt IE 9]> \
    <script type="text/javascript" \
     src="http://ajax.googleapis.com/ajax/libs/chrome-frame/1/CFInstall.min.js"></script> \
    <style> \
     .chromeFrameInstallDefaultStyle { \
       width: 100%;  \
       border: 5px solid blue; \
     } \
    </style> \
            <div id="notice"></div> \
            <div id="prompt"></div> \
    <script> \
          function displayGCFText() { \
            document.getElementById("notice").innerHTML = "Internet Explorer has been detected." + \
            "Please install the Google Chrome Frame if it is not already installed.  This will enable" + \
            "HTML5 features necessary for the web application.<p>"+ \
            "If the install panel does not appear, please enable Compatibility mode in your browser and reload this page."; \
            }; \
     window.attachEvent("onload", function() { \
       CFInstall.check({ \
         mode: "inline",  \
         node: "prompt" \
       }); \
     }); \
    </script> \
  <![endif]-->');
};

/**
 * @class Provides a set of static functions for use in converting
 * a google.visualization.DataTable object into a Protovis consumable
 * JSON array.
 *
 * Intended to be used as a static class object to reserve a useful namespace.
 *
 * For the Circvis project, the fundamental data element is <b>node</b> JSON object consisting of:
 *      {chromosome, start, end, value, options}
 *          {string} chromosome
 *          {integer} start
 *          {integer} end
 *          {string} value
 *          {string} options
 *
 *
 *
 */

vq.utils.GoogleDSUtils = {};

    /**     Converts any DataTable object into an array of JSON objects, each object consisting of a single row in the
     *      DataTable.  The property label is obtained from the getColumnLabel() function of the google.visualiztion.DataTable class.
     *
     *      Column types listed as a 'number' are passed in as numeric data.  All other data types are passed in as strings.
     *
     *      The returned JSON array conforms to the common input format of Protovis visualizations.
     *
     * @param googleDataTable - google.visualizations.DataTable object returned by a google datasource query
     * @return data_array - JSON array.
     */


    vq.utils.GoogleDSUtils.dataTableToArray = function(googleDataTable) {
        var table = googleDataTable,
        data_array=[],
        headers_array=[],
        column_type=[];
        if (table == null) { return [];}
        for (col=0; col<table.getNumberOfColumns(); col++){
            headers_array.push(table.getColumnLabel(col));
            column_type.push(table.getColumnType(col));
        }


        for (row=0; row<table.getNumberOfRows(); row++){
            var temp_hash={};
            for (col=0; col<table.getNumberOfColumns(); col++){
                if(column_type[col].toLowerCase() == 'number') {
                    temp_hash[headers_array[col]]=table.getValue(row,col);
                } else {
                    temp_hash[headers_array[col]]=table.getFormattedValue(row,col);
                }
            }
            data_array.push(temp_hash);
        }
        return data_array;
    };

    /**
     *  Converts a special DataTable object into a network object used by CircVis.
     *  For a DataTable with fields: chr1, start1, end1, value1, options1, chr2, start2, end2, value2, options2, linkValue
     *  the function returns an array of JSON objects consisting of two <b>node</b> JSON objects and a <b>linkValue</b>:
     *  {node1,node2,linkValue}
     *
     *  The JSON array can then be passed into the NETWORK.DATA.data_array parameter used to configure Circvis.
     *
     * @param googleDataTable - google.visualizations.DataTable object returned by a google datasource query
     * @returns network_json_array - a JSON array representation of a Google Visualizations DataTable object. The column label is assigned as the property label
     */

    vq.utils.GoogleDSUtils.dataTableToNetworkArray = function(googleDataTable) {
        var data_array = this.dataTableToArray(googleDataTable);
        return data_array.map(function(c) { return {node1 : {chr:c['chr1'],start:c['start1'],end:c['end1'],value:c['value1'],options:c['options1']},
        node2 : {chr:c['chr2'],start:c['start2'],end:c['end2'],value:c['value2'],options:c['options2']}, linkValue:c['linkValue']};});
    };

    /** @private */
    vq.utils.GoogleDSUtils.getColIndexByLabel = function(table,label) {
        for (col = 0; col < table.getNumberOfColumns(); col++) {
            if (label.toLowerCase() == table.getColumnLabel(col).toLowerCase()) {
                return col;
            }
        }
        return -1;
    };


/**
 * @class Constructs a utility object for use with multiple-source Ajax requests.
 * If data must be retrieved from several sources before a workflow may be started, this tool can be used to
 * check that all necessary data is available.
 *
 * @param {integer} timeout number of milliseconds between checks for valid data.  Defaults to 200ms.
 * @param {total_checks}  total number of checks to perform. Defaults to 20.
 * @param {callback}    function to call if all data is successfully found
 * @param {args}    an object containing the variables which will be assigned values by the Ajax responses.
 * @param {args}    function called if timeout reached without check object being filled.
 */

vq.utils.SyncDatasources = function(timeout,total_checks,success_callback,args,fail_callback){

        if (timeout && !isNaN(timeout)) {
            this.timeout = timeout;
        } else {
            this.timeout = 200;
        }
        if (total_checks && !isNaN(total_checks)) {
            this.num_checks_until_quit = total_checks;
        } else {
            this.num_checks_until_quit = 20;
        }
        if (args instanceof Object) {
            this.args = args;
        } else {
            console.log('Error: variable array not passed to timer initialize method.');
            return;
        }
        if (success_callback instanceof Function) {
            this.success_callback = success_callback
        } else {
            console.log('Error: callback function not passed to timer initialize method.');
            return;
        }
     if (fail_callback instanceof Function) {
            this.fail_callback = fail_callback
        }
        this.num_checks_so_far = 0;
    };

    /**
     * Initiates the data object poll.  After the maximum number of checks, a log is filed on the console and the object
     *  aborts the polling operation.
     */

    vq.utils.SyncDatasources.prototype.start_poll = function() {
        var that = this;
        setTimeout(function() { that.poll_args();},that.timeout);
    };

    /** @private */
    vq.utils.SyncDatasources.prototype.check_args = function(){
        var check = true;
        for (arg in this.args) {
            if (this.args[arg] == null) { check = false;}
        }
        return check;
    };

    /** @private */
    vq.utils.SyncDatasources.prototype.poll_args = function(){
        var that=this;
        if (this.check_args()) { this.success_callback.apply(); return false;}
        this.num_checks_so_far++;
        if(this.num_checks_so_far >= this.num_checks_until_quit) {
            console.log('Maximum number of polling events reached.  Datasets not loaded.  Aborting.');
            if (this.fail_callback === undefined) { return false;}
            else {this.fail_callback.apply(); return false;}
        }
        setTimeout(function() { that.poll_args();},that.timeout);
    };


 vq.sum = function(list,func) { 
    if (typeof func =='function')  {
        return _.reduce(list,function(a,b,index){ return a+func.call({},b,index);},0);
    } else if (typeof func == 'string') {
        return _.reduce(list,function(a,b){ return a[func]+b[func];},0);
    } else {
        return _.reduce(list,function(a,b){ return a+b;},0);
};
    };

//import from science.js

(function(exports){
science = {version: "1.9.1"}; // semver
science.stats = {};
science.stats.mean = function(x) {
  var n = x.length;
  if (n === 0) return NaN;
  var m = 0,
      i = -1;
  while (++i < n) m += (x[i] - m) / (i + 1);
  return m;
};

science.stats.variance = function(x) {
  var n = x.length;
  if (n < 1) return NaN;
  if (n === 1) return 0;
  var mean = science.stats.mean(x),
      i = -1,
      s = 0;
  while (++i < n) {
    var v = x[i] - mean;
    s += v * v;
  }
  return s / (n - 1);
};

science.stats.median = function(x) {
  return science.stats.quantiles(x, [.5])[0];
};
science.stats.mode = function(x) {
  x = x.slice().sort(science.ascending);
  var mode,
      n = x.length,
      i = -1,
      l = i,
      last = null,
      max = 0,
      tmp,
      v;
  while (++i < n) {
    if ((v = x[i]) !== last) {
      if ((tmp = i - l) > max) {
        max = tmp;
        mode = last;
      }
      last = v;
      l = i;
    }
  }
  return mode;
};
// Uses R's quantile algorithm type=7.
science.stats.quantiles = function(d, quantiles) {
  d = d.slice().sort(science.ascending);
  var n_1 = d.length - 1;
  return quantiles.map(function(q) {
    if (q === 0) return d[0];
    else if (q === 1) return d[n_1];

    var index = 1 + q * n_1,
        lo = Math.floor(index),
        h = index - lo,
        a = d[lo - 1];

    return h === 0 ? a : a + h * (d[lo] - a);
  });
};

science.ascending = function(a, b) {
  return a - b;
};
})(this);