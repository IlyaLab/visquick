/*EDGES*/

circvis.size = function(width, height) {
    var w, h;

    if (width.length && width.length == 2) { //use 1st argument as array of sizes
        w = width[0];
        h = width[1];
    }
    else if (arguments.length == 1) { //set both to 1st argument
        w = h = width;
    } else {
        w = width;
        h = height;
    }

    var width_scale = w / chromoData._plot.width;
    var height_scale =  h / chromoData._plot.height;
    var svg = d3.select('#' + chromoData._plot.id).select('.circvis');
        var transform = d3.transform(svg.attr('transform'));
        var translate = transform.translate;
        var scale = transform.scale;
        var rotation = transform.rotate;
        var actual_width = (width / 2 * scale[0]), actual_height = (height / 2 * scale[1]);

    svg.transition().duration(500)
    .attr('transform','translate(' + w/2 + ',' + h/2 + ')scale(' + width_scale + ',' + height_scale + ')rotate(' + rotation + ')');


    d3.select('#' + chromoData._plot.id).transition().duration(500)
    .attr('width',w)
    .attr('height',h);

};

circvis.addEdges = function(edge_array) {
    var edges;
    if (_.isArray(edge_array)) {
        edges = this._insertEdges(edge_array);
    }
    else {
        edges = this._insertEdges([edge_array]);
    }

    var nodes = _.flatten(_.map(edges, function(edge) { return [edge.source,edge.target];}));
    this.addNodes(nodes);

    _drawNetworkLinks();

};

circvis.removeEdges = function(edge_array, ignore_nodes) {
    var ignore = _.isBoolean(ignore_nodes) ? ignore_nodes : Boolean(false);
    if (edge_array === 'all') {
            edge_array = chromoData._network.links_array;
        }

    if (_.isArray(edge_array)) {
        _.each(edge_array,function(edge) {chromoData._removeEdge(edge);});
    }
    else if ( _.isObject(edge_array)){
        chromoData._removeEdge(edge_array);
    }
    _drawNetworkLinks();

    if(ignore) {return;}

    var removable = _edgeListToNodeList(edge_array);
    var remaining_nodes = _edgeListToNodeList(chromoData._network.links_array);
    var nodes_to_remove = _.difference(removable,remaining_nodes);
    this.removeNodes(nodes_to_remove);    
};

circvis._insertEdges = function(edge_array) {
    //return the array of edges inserted
    return _.filter(_.map(edge_array, vq.models.CircVisData.prototype._insertEdge, chromoData),
        function(edge) { return !_.isNull(edge);});
};

/* NODES*/

circvis.addNodes = function(node_array) {
    
    var that = this;
    if (_.isArray(node_array)) {
       chromoData._insertNodes(node_array);
    }
    else {
        chromoData._insertNodes([node_array]);
    }
    _.each(_.uniq(_.pluck(node_array,'chr')), draw_ideogram_data);
};

circvis.removeNodes = function(node_array) {
    var that = this;
    if (_.isFunction(node_array)) {
        node_array = _.filter(chromoData._data.features, node_array);
    }

    if (_.isArray(node_array)) {
        _.each(node_array, function(node) {
            chromoData._removeNode(node);
        });
        _.each(_.uniq(_.pluck(node_array,'chr')), draw_ideogram_data);
    }
    else if (_.isObject(node_array)){
        chromoData._removeNode(node_array);
        draw_ideogram_data(node_array.chr);
    }
    //retiling too soon will break the exit transition.. need to retile later when data is not being changed.
    // chromoData._retile();

};


/*Utils*/

 function _edgeListToNodeList (edges) {
    return _.uniq(_.flatten(_.chain(edges).map(function(edge){return [edge.source || edge.node1,edge.target || edge.node2];}).value()));
};