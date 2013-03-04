/* vq.models.js */

/** @namespace The namespace for data model classes. **/
vq.models = {};

   /**
     * It contains a meta-tag for the included data, as well as the data in JSON format.
     *
     * @class The abstract base class for the data model of each VisQuick tool.  It provides the
     * necessary functionality to read, parse, analyze, and retain the input parameters.
     *
     * @param data - a JSON object
     * @param {String} data.DATATYPE - a string describing the contents of the JSON data object
     * @param {JSON} data.CONTENTS - a JSON object containing the necessary input to create the visualization
     */

vq.models.VisData = function(data){


        if (data.DATATYPE != null) {
            this.DATATYPE = data.DATATYPE;
        } else {
            this.DATATYPE = "VisData";
        }

        if (data.CONTENTS != null) {
            this.CONTENTS = data.CONTENTS;
        }
        /**@private */
        this._ready=false;
    };

/**
 *  Returns an identifying string used to specify the <i>CONTENTS</i>.  This ensures that the data is properly parsed by a visualization
 *  which may accept multiple JSON formats.
 *
 * @return {String} dataType - a string describing the contents of the JSON object. This can be used to verify that the
 *  data is the correct format for the visualization.
 */


vq.models.VisData.prototype.getDataType = function() {
    return this.DATATYPE;
};

/**
 *  Returns the JSON object used to contain the data, parameters, options, behavior functions, and other information necessary
 *  to create a visualization.
 *
 * @return {JSON} dataType -a JSON Object containing the necessary input to create the visualization.
 */

vq.models.VisData.prototype.getContents = function() {
    return this.CONTENTS;
};
vq.models.VisData.prototype.get =  function(prop) {
    var parts = prop.split('.');
    var obj = this;
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

vq.models.VisData.prototype.set = function(prop,value) {
    var parts = prop.split('.');
    var obj = this;
    for(var i = 0; i < parts.length - 1; i++) {
        var p = parts[i];
        if(obj[p] === undefined) {
            obj[p] = {};
        }
        obj = obj[p];
    }
    p = parts[parts.length - 1];
    obj[p] =  value === undefined ? null : value;
    return this;
};

    vq.models.VisData.prototype.isDataReady = function() {
        return this._ready;
    };

    vq.models.VisData.prototype.setDataReady = function(bool) {
        this._ready = Boolean(bool);
    };


vq.models.VisData.prototype.setValue = function(data,o) {
    var get = vq.utils.VisUtils.get;
    if (typeof get(data,o.id) == 'function') {
        this.set(o.label, get(data,o.id));
        return;
    }
    else {
        if(o.cast) {
            this.set(o.label, o.cast(get(data,o.id)));
            return;
        } else {
            this.set(o.label,get(data,o.id));
            return;
        }
    }
};

/** private **/

vq.models.VisData.prototype._processData = function(data) {
    var that = this;
    var get = vq.utils.VisUtils.get;

    if(!this.hasOwnProperty('_dataModel')) {
        this._dataModel = vq.extend(this._dataModel);
    }
    data = Object(data);
    this['_dataModel'].forEach(function(o) {
        try{
            if (!typeof o == 'object') { return;}
            //use default value if nothing defined
            if (!o.optional) {
                if (get(data,o.id)  === undefined) {
                    that.set(o.label,(o.defaultValue != undefined ? o.defaultValue :  o['cast'](null)));
                } else { //o.id value is found and not optional
                    that.setValue(data,o);
                }
            }  else {  // it is optional
                if (get(data,o.id)  === undefined) {
                    return;  //don't set it
                } else {
                    that.setValue(data,o);    //set it
                }
            }
        } catch(e) {
            console.warn('Unable to import property \"'+ o.id +'\": ' + e);
        }
    });
};

