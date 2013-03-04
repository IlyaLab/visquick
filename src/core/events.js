/* vq.events.js */

/** @namespace The namespace for event classes. **/
vq.events = {};

vq.events.Event = function(label,source,obj) {

    this.id = label || '';
    this.source =source || null;
    this.obj = obj || {} ;
};

vq.events.Event.prototype.dispatch = function() {
    vq.events.Dispatcher.dispatch(this);
};

/*
Dispatcher
    Manages Listeners
            Two types of listeners:
                    Global - event of type X from any source
                    Distinct - event of type X from source Z

                    addListener and removeListener are overloaded to accept both kinds
                    dispatchEvent accepts an vq.events.Event object
                            Event object is Global if source == null
                            Event object is Distinct if source typeof == 'string'
 */

vq.events.Dispatcher = (function() {
    //private methods and variables
        var eventList = {};
    return {
          addListener : function(label) {
            var id,handler;
            if (label === undefined || arguments.length < 2) { return; }
            if(arguments.length == 2 && typeof arguments[1] == 'function') {
                handler = arguments[1];
                id = null;
            } else if (arguments.length == 3 && typeof arguments[1] == 'string') {
                id = arguments[1], handler = arguments[2];
            } else { return; }
                if (eventList[label] === undefined) {
                    eventList[label] = {};
                }
                if (eventList[label][id] === undefined) {
                    eventList[label][id] = [];
                }
                 eventList[label][id].push(handler);
        },

        removeListener : function(label) {
            var id,handler;
            if (label === undefined || arguments.length < 2) { return; }
            if(arguments.length == 2 && typeof arguments[1] == 'function') {
                handler = arguments[1];
                id = null;
            } else if (arguments.length == 3 && typeof arguments[1] == 'string') {
                id = arguments[1], handler = arguments[2];
            }  else { return; }
            if (eventList[label] === undefined || eventList[label][id] === undefined) {
                return;
            }
            eventList[label][id].forEach(function(e,index) {
                if (e === handler) {
                    eventList[label][id].splice(index,1);
                }
            });
        },

        dispatch : function(event) {
            var source = event.source || null;
  	    var event_id = event.id || null;
            var i = null,f = null;
            if (event_id == null || eventList[event_id] === undefined) { return;}
            if (eventList[event_id][source] !== undefined) {
                i =eventList[event_id][source].length;
                while (i--) {
                     f =  eventList[event_id][source][i];
                   f.call(event,event.obj);
                }
            }
            if (eventList[event_id][null] !== undefined) {
                 i =eventList[event_id][null].length;
                while (i--) {
                    f =  eventList[event_id][null][i];
                   f.call(event,event.obj);
                }
            }
        }
};

})();

