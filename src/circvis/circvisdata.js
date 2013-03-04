

vq.models.CircVisData = function(data) {

    vq.models.VisData.call(this, data);

    this.setDataModel();

    if (this.getDataType() == 'vq.models.CircVisData') {
        this._build_data(this.getContents());
    } else {
        console.warn('Unrecognized JSON object.  Expected vq.models.CircVisData object.');
    }
};


vq.models.CircVisData.prototype = vq.extend(vq.models.VisData);

vq.models.CircVisData.prototype.setDataModel = function() {
    this._dataModel = [
        {label: '_plot.width', id: 'PLOT.width', defaultValue: 400},
        {label: '_plot.height', id: 'PLOT.height', defaultValue: 400},
        {label : '_plot.container', id:'PLOT.container', optional : true},
        {label: '_plot.vertical_padding', id: 'PLOT.vertical_padding', defaultValue: 0},
        {label: '_plot.horizontal_padding', id: 'PLOT.horizontal_padding', defaultValue: 0},
        {label : '_plot.enable_pan', id: 'PLOT.enable_pan', cast: Boolean, defaultValue : false },
        {label : '_plot.enable_zoom', id: 'PLOT.enable_zoom', cast: Boolean, defaultValue : false },
        {label : '_plot.show_legend', id: 'PLOT.show_legend', cast: Boolean, defaultValue : false },
        {label : '_plot.legend_corner', id: 'PLOT.legend_corner', cast: String, defaultValue : 'ne' },
        {label : '_plot.legend_radius', id: 'PLOT.legend_radius', cast: Number, defaultValue : 25 },
        {label : '_plot.legend_show_rings', id: 'PLOT.legend_show_rings', cast: Boolean, defaultValue : true },
        {label : '_plot.rotate_degrees', id: 'PLOT.rotate_degrees', cast: Number, defaultValue : 0 },
        {label : '_plot.tooltip_timeout', id: 'PLOT.tooltip_timeout', cast: Number, defaultValue : 200 },

        {label: '_data.features', id: 'DATA.features', defaultValue: []},
        {label: '_data.edges', id: 'DATA.edges', defaultValue: []},       
        {label: '_data.hash', id: 'DATA.hash', defaultValue: []},       

        {label : '_chrom.keys', id: 'GENOME.DATA.key_order', defaultValue : ["1","2","3","4","5","6","7","8","9","10",
            "11","12","13","14","15","16","17","18","19","20","21","22","X","Y"] },
        {label : '_chrom.length', id: 'GENOME.DATA.key_length', defaultValue : [] },
        {label : '_chrom.reverse_list', id: 'GENOME.OPTIONS.key_reverse_list', optional : true },
        {label : '_chrom.gap_degrees', id: 'GENOME.OPTIONS.gap_degrees', cast : Number, defaultValue : 0 },
        {label : '_chrom.label_layout_style', id: 'GENOME.OPTIONS.label_layout_style', defaultValue : 'default' },
        {label : '_chrom.label_font_style', id: 'GENOME.OPTIONS.label_font_style', cast: String, defaultValue : "16px helvetica, monospaced" },
        {label : '_chrom.radial_grid_line_width', id: 'GENOME.OPTIONS.radial_grid_line_width', cast : Number, defaultValue : null },
        {label : '_chrom.listener', id: 'GENOME.OPTIONS.listener', cast: Function, defaultValue : function() {
            return null;
        }},
        {label : '_network._doRender', id: 'NETWORK.OPTIONS.render',  defaultValue: true, cast: Boolean },
        {label : '_network._outer_padding', id: 'NETWORK.OPTIONS.outer_padding',  defaultValue: 0, cast: Number },
        {label : '_network.node_listener', id: 'NETWORK.OPTIONS.node_listener', cast: Function, defaultValue : function() {
            return null;
        } },
        {label : '_network.link_listener', id: 'NETWORK.OPTIONS.link_listener', cast: Function, defaultValue : function() {
            return null;
        } },
        {label : '_network.link_tooltipItems', id: 'NETWORK.OPTIONS.link_tooltip_items',
            defaultValue :  { 'Node 1 Chr' : 'sourceNode.chr', 'Node 1 Start' : 'sourceNode.start', 'Node1 End' : 'sourceNode.end',
                'Node 2 Chr' : 'targetNode.chr', 'Node 2 Start' : 'targetNode.start', 'Node 2 End' : 'targetNode.end'} },
        {label : '_network.link_tooltipLinks', id: 'NETWORK.OPTIONS.link_tooltip_links',  defaultValue : {} },
        {label : '_network.link_line_width', id: 'NETWORK.OPTIONS.link_line_width', cast : vq.utils.VisUtils.wrapProperty,
            defaultValue : function(node, link) {
                return 1;
            }},
        {label : '_network.link_alpha', id: 'NETWORK.OPTIONS.link_alpha', cast : vq.utils.VisUtils.wrapProperty,  defaultValue : function() {
            return 0.7;
        } },
        {label : '_network.link_strokeStyle', id: 'NETWORK.OPTIONS.link_stroke_style', cast : vq.utils.VisUtils.wrapProperty, defaultValue : function() {
            return 'steelblue';
        } },
        {label : '_network.node_fillStyle', id: 'NETWORK.OPTIONS.node_fill_style', cast : vq.utils.VisUtils.wrapProperty, defaultValue : function() {
            return 'green';
        } },
        {label : '_network.node_radius', id: 'NETWORK.OPTIONS.node_radius', cast : vq.utils.VisUtils.wrapProperty, defaultValue : function() {
            return 3;
        } },
        {label : '_network.node_highlightMode', id: 'NETWORK.OPTIONS.node_highlight_mode', cast : String, defaultValue : 'brighten' },
        {label : '_network.node_tooltipFormat', id: 'NETWORK.OPTIONS.node_tooltipFormat', cast : vq.utils.VisUtils.wrapProperty, defaultValue : vq.utils.VisUtils.network_node_title },
        {label : '_network.node_tooltipItems', id: 'NETWORK.OPTIONS.node_tooltip_items', defaultValue :  { Chr : 'chr', Start : 'start', End : 'end'} },
        {label : '_network.node_tooltipLinks', id: 'NETWORK.OPTIONS.node_tooltip_links',  defaultValue : {} },
        {label : '_network.max_node_linkDegree', id: 'NETWORK.OPTIONS.max_node_linkdegree', cast : Number, defaultValue :  9999 },
        {label : '_network.min_node_linkDegree', id: 'NETWORK.OPTIONS.min_node_linkdegree', cast : Number, defaultValue :  0 },
        {label : '_network.node_overlap_distance', id: 'NETWORK.OPTIONS.node_overlap_distance', cast : Number, defaultValue :  12000000.0},
        {label : '_network.tile_nodes', id: 'NETWORK.OPTIONS.tile_nodes', cast : Boolean, defaultValue : false },
        
        {label : 'ticks.tooltipItems', id: 'TICKS.OPTIONS.tooltip_items', defaultValue :  { Chr : 'chr', Start : 'start', End : 'end', Label:'value'} },
        {label : 'ticks.tooltipLinks', id: 'TICKS.OPTIONS.tooltip_links',  defaultValue : {} },
        {label : 'ticks.label_map', id: 'TICKS.OPTIONS.label_map', defaultValue:[
            {key:'',label:''}
        ]},
        {label : 'ticks.render_ticks', id: 'TICKS.OPTIONS.render_ticks', cast : Boolean ,defaultValue: Boolean(true)},
        {label : 'ticks.label_key', id: 'TICKS.OPTIONS.label_key', defaultValue:'value',cast: String},
        {label : 'ticks.height', id: 'TICKS.OPTIONS.height', cast : Number, defaultValue: 60 },
        {label : 'ticks.wedge_width', id: 'TICKS.OPTIONS.wedge_width', cast : Number, defaultValue: 0.2 },
        {label : 'ticks.wedge_height', id: 'TICKS.OPTIONS.wedge_height', cast : Number, defaultValue: 10 },
        {label : 'ticks.outer_padding', id: 'TICKS.OPTIONS.outer_padding', cast : Number, defaultValue: 0 },
        {label : 'ticks.listener', id: 'TICKS.OPTIONS.listener', cast : Function, defaultValue : function() {
            return null;
        } },
        {label : 'ticks.display_legend', id: 'TICKS.OPTIONS.display_legend', cast : Boolean, defaultValue : true },
        {label : 'ticks.legend_corner', id: 'TICKS.OPTIONS.legend_corner', cast : String, defaultValue : 'nw' },
        {label : 'ticks.tile_ticks', id: 'TICKS.OPTIONS.tile_ticks', cast : Boolean, defaultValue: true },
        {label : 'ticks.overlap_distance', id: 'TICKS.OPTIONS.overlap_distance', cast : Number, optional: true},
        {label : 'ticks.fill_style', id: 'TICKS.OPTIONS.fill_style', cast : vq.utils.VisUtils.wrapProperty, defaultValue : function() {
            return 'red';
        }},
        {label : 'ticks.stroke_style', id: 'TICKS.OPTIONS.stroke_style', cast : vq.utils.VisUtils.wrapProperty, defaultValue : function() {
            return 'white';
        }},
        {label : '_wedge' , id:'WEDGE', optional : true}
    ];
};

vq.models.CircVisData.prototype._build_data = function(data_struct) {
    var data = data_struct;

    this._processData(data);

    if (this._wedge) {
        this._wedge = this._wedge.map(function(b) {
            return new vq.models.CircVisData.WedgeData(b);
        });
    }

    this._setupData();
};


vq.models.CircVisData.prototype._setupData = function() {
    var chrom_keys_order={},chrom_length_map,chrom_length_array = [],cnv_map, startAngle = {},
        cnv_array, cnv_height = [], startAngle_map = {},normalizedLength = {},
        deviation = [],median = [], theta = {}, totalChromLength;
    this.normalizedLength,this.theta = [],this.startAngle_map = {};

    var that = this;
    this._plot.id = 'C' + vq.utils.VisUtils.guid(); // div id must start with letter

//  Ideogram Data

    if (this._chrom.keys == [] || this._chrom.length == []) {
        console.warn('Chromosome/Ideogram information has not been detected.  Please verify that keys and length/key mappings have been ' +
            'passed into the GENOME.DATA object.');
        return;
    }

    var chrom_keys_array = this._chrom.keys;       //array in pre-sorted order    
    _.each(chrom_keys_array,function(val,index){chrom_keys_order[val]=index;});

    chrom_length_array = this._chrom.length.filter(function(d) {
        return chrom_keys_order[d['chr_name']] !== null;
    });
    chrom_length_array.sort(function(c, d) {
        return chrom_keys_order[c['chr_name']] - chrom_keys_order[d['chr_name']] > 0;
    });  //sort by given order
    totalChromLength = vq.sum(chrom_length_array, function(d) {
        return d['chr_length'];
    });


   var rescaleForGaps = 1-(this._chrom.gap_degrees * chrom_keys_array.length / 360);

    chrom_length_map = {};
    _.each(chrom_length_array,function(obj) {
        chrom_length_map[obj['chr_name'].toUpperCase()] = obj['chr_length'];
        normalizedLength[obj['chr_name'].toUpperCase()] =  (obj['chr_length'] *rescaleForGaps) / totalChromLength;
    });

    this.normalizedLength = normalizedLength;

    var chrom_groups = {};

    var rotation = (this._plot.rotate_degrees) * Math.PI / 180;

    var renormalize_factor =  this._chrom.gap_degrees * Math.PI / 180; //radians

    //for each index of chrom_keys ( pre-sorted)
    // sum all lengths from 1st index to last index of chrom_length (sorted to chrom_length)
    _.each(chrom_keys_array,function(d,index) {
        startAngle[d] = _.reduce(chrom_keys_array.slice(0, (chrom_keys_order[d])),
            function(a,b,index) {
                return a+(normalizedLength[chrom_keys_array[index]] * 2 * Math.PI)+renormalize_factor;
            },0);

        theta[d] = d3.scale.linear().domain([0, chrom_length_map[d.toUpperCase()]])
            .range([0, 2 * Math.PI * normalizedLength[d]]);

        if (that._chrom.reverse_list !== undefined &&
            that._chrom.reverse_list.filter(
                function(c) {
                    return c == d;
                }).length > 0) {  //defined as reversed!
            theta[d] = d3.scale.linear().domain([0, chrom_length_map[d.toUpperCase()]])
                .range([2 * Math.PI * normalizedLength[d], 0]);

        } else {
            theta[d] = d3.scale.linear().domain([0, chrom_length_map[d.toUpperCase()]])
                .range([0, 2 * Math.PI * normalizedLength[d]]);

        }
        chrom_groups[d]={key:d, startAngle: startAngle[d], endAngle: startAngle[d] + 2 * Math.PI * normalizedLength[d], theta:theta[d],
            angle: 2 * Math.PI * normalizedLength[d]};
    });

    this.theta = theta;
    this._ideograms={};
    this._data.chr = {};
    _.each(that._chrom.keys, function(d) {
        startAngle_map[d] =  startAngle[d] + rotation;
        that._ideograms[d] = _.extend(chrom_groups[d],{wedge:[],_feature_angle : function(a) { return this.startAngle + this.theta(a); }});
        that._data.chr[d] = [];
    });
    this.startAngle_map = startAngle_map;
    this._chrom.groups = chrom_groups;

//Global Data

    if (this._data.features,length) {     
       this._data.chr = _.groupBy(this._data.features,'chr');
    } 

//    Ring Data

    if (this._wedge !== undefined) {
        var _data = [], cnv_map = {};
        _.each(this._wedge, function(wedge, index) {
             // are we using the global dataset?
             wedge._globalData = true;
            if(  wedge._globalData = !Boolean(wedge._data.length)) {
                wedge._data = that._data.features;
                }
            wedge._hash = _.isUndefined(wedge._hash) ? that._data.hash : wedge._hash;

            if (wedge._plot_type == 'tile' || wedge._plot_type == 'glyph') {
                var max_tile_level = 
                wedge._tile.show_all_tiles ?
                    Math.floor((wedge._plot_height - (wedge._radius() * 2)) / (wedge._tile.height + wedge._tile.padding)) :
                    undefined;
                _data = (wedge._plot_type == 'tile' ? 
                    vq.utils.VisUtils.layoutChrTiles(wedge._data, wedge._tile.overlap_distance, max_tile_level) :
                    vq.utils.VisUtils.layoutChrTicks(wedge._data, wedge._tile.overlap_distance, max_tile_level));
                wedge._layout = {};
                _.each(_data,function(f) { wedge._layout[wedge._hash(f)] = f.level;}); //layout is a sparse map of id to level
            }

        wedge._chr = wedge._globalData ? that._data.chr : _.groupBy(wedge._data,'chr');
                    
        wedge._outerRadius =
                (that._plot.height / 2) -
                    vq.sum(that._wedge.slice(0, index), function(a) {
                        return a._plot_height + a._outer_padding;
                    }) - (that.ticks.outer_padding + that.ticks.height);

            wedge._outerPlotRadius = wedge._outerRadius - wedge._outer_padding;

            wedge._innerRadius = wedge._outerPlotRadius - wedge._plot_height;

            _.each(that._chrom.keys, function(d) {
                that._ideograms[d]._outerRadius = ( that._plot.height / 2 ) -  that.ticks.outer_padding + that.ticks.height;
                that._ideograms[d].wedge[index] = wedge._chr[d];
            });

            wedge.hovercard = vq.hovercard({
                canvas_id : that._plot.id,
                include_header : false,
                include_footer : true,
                self_hover : true,
                timeout : that._plot.tooltip_timeout,
                data_config : wedge._tooltipItems,
                tool_config : wedge._tooltipLinks
            });

            if(wedge._plot_type =='karyotype') { return;}

            var value_label = wedge._value_key;
            deviation = Math.sqrt(science.stats.variance(_.pluck(wedge._data,value_label)));
            median = science.stats.median(_.pluck(wedge._data,value_label));

            wedge._min_plotValue = (wedge._min_plotValue === undefined) ? parseFloat(((-1 * deviation) + median).toFixed(2)) : wedge._min_plotValue;
            wedge._max_plotValue = (wedge._max_plotValue === undefined) ? parseFloat((deviation + median).toFixed(2)) : wedge._max_plotValue;
            wedge._range_mean = wedge._base_plotValue != null ? wedge._base_plotValue : (wedge._min_plotValue + wedge._max_plotValue) / 2;
            wedge._y_linear = d3.scale.linear()
                .domain([wedge._min_plotValue, wedge._max_plotValue])
                .range([wedge._innerRadius,wedge._outerRadius - wedge._outer_padding]).nice();

            wedge._y_axis = d3.scale.linear().domain([wedge._min_plotValue, wedge._max_plotValue]).range([wedge._innerRadius,wedge._outerPlotRadius]);
            wedge._thresholded_innerRadius = function(d) { return Math.max(wedge._y_axis(Math.min(d,wedge._range_mean)),wedge._innerRadius); };
            wedge._thresholded_outerRadius = function(d) { return Math.min(wedge._y_axis(Math.max(d,wedge._range_mean)),wedge._outerPlotRadius); };
            wedge._thresholded_value_to_radius = function(d) { return Math.min(Math.max(wedge._y_axis(d),wedge._innerRadius),wedge._outerPlotRadius); };
            wedge._thresholded_radius = function(d) { return Math.min(Math.max(d,wedge._innerRadius),wedge._outerPlotRadius); };

            wedge._thresholded_tile_innerRadius = function(c,d) { return wedge._innerRadius + (d._tile.height + d._tile.padding) * wedge._layout[wedge._hash(c)];};
            wedge._thresholded_tile_outerRadius = function(c,d) { return wedge._innerRadius + ((d._tile.height + d._tile.padding) * wedge._layout[wedge._hash(c)]) + d._tile.height;};
            if (wedge._plot_type == 'glyph') {
                wedge._glyph_distance = function(c) { return (((wedge._tile.height + wedge._tile.padding) * wedge._layout[wedge._hash(c)])
                    + wedge._innerRadius + (wedge._radius(c)));};
                wedge._checked_endAngle = function(feature,chr) {
                    if (that._chrom.keys.length == 1) {
                        return Math.min(that.startAngle_map[chr] + that.theta[chr](feature.end||feature.start+1),that.startAngle_map[that._chrom.keys[0]] + (Math.PI * 2));
                    }
                    else if (this.parent.index+1 == that._chrom.keys.length) {
                        return Math.min(that.startAngle_map[chr] + that.theta[chr](feature.end||feature.start+1),that.startAngle_map[that._chrom.keys[0]] + (Math.PI * 2));
                    }
                    else {return Math.min(that.startAngle_map[chr] + that.theta[chr](feature.end||feature.start+1),
                        that.startAngle_map[that._chrom.keys[(this.parent.index+1)%that._chrom.keys.length]]);
                    }
                };
            }
            delete wedge._data;

        }); //foreach
    }

//    Tick Data
        
        if (that.ticks.tile_ticks) {
            if (that.ticks.overlap_distance === undefined) {
                var overlap_ratio = 7000000.0 / 3080419480;
                that.ticks.overlap_distance = overlap_ratio * totalChromLength;
            }
        
            var _tickData = 
                    vq.utils.VisUtils.layoutChrTicks(this._data.features, that.ticks.overlap_distance);
            var layout = this.ticks._layout = {};
            var hash = that._data.hash;
            _.each(_tickData,function(f) {layout[hash(f)] = f.level;}); 
        }

        this.ticks.data_map = that._data.chr;     
        
        this.ticks.hovercard =  vq.hovercard({
            canvas_id : that._plot.id,
            include_header : false,
            include_footer : true,
            self_hover : true,
            timeout : that._plot.tooltip_timeout,
            data_config : that.ticks.tooltipItems,
            tool_config : that.ticks.tooltipLinks
        });

    //------------------- NETWORK DATA
    var nodes = {};
    _.each(that._chrom.keys, function(d) {
        nodes[d] = {};
    });
    var node_parent_map = {};
    var node_array = [{parent:null, chr:null, radius:0, angle:0}];
    that._network.network_radius = {};
    that._network.layout = {};
    chrom_keys_array.forEach(function(key,index) {
        var innerRadius = that._ideograms[key].wedge.length > 0 ? that._wedge[that._ideograms[key].wedge.length-1]._innerRadius :
            (that._plot.height / 2) - that.ticks.outer_padding - that.ticks.height;
        var network_radius = that._network.network_radius[key] = innerRadius - that._network._outer_padding;
        node_parent_map[key] = index + 1;
        var node = {chr:key,parent:node_array[0],radius: network_radius / 2,
            angle : (that._chrom.groups[key].startAngle + that._chrom.groups[key].endAngle)/2};
        node_array.push(node);
    });

    this._network.node_parent_map = node_parent_map;
  
        this._network.nodes_array=node_array;
        this._network.links_array=[];

        this._network.link_hovercard  =  vq.hovercard({
            canvas_id : that._plot.id,
            include_header : false,
            include_footer : true,
            self_hover : true,
            timeout : that._plot.tooltip_timeout,
            data_config : that._network.link_tooltipItems,
            tool_config : that._network.link_tooltipLinks
        });
        this._network.node_hovercard  =  vq.hovercard({
            canvas_id : that._plot.id,
            include_header : false,
            include_footer : true,
            self_hover : true,
            timeout : that._plot.tooltip_timeout,
            data_config : that._network.node_tooltipItems,
            tool_config : that._network.node_tooltipLinks
        });

        //var edges = _.filter(_.map(that._network.data, vq.models.CircVisData.prototype._insertEdge, that),
        //function(edge) { return !_.isNull(edge);});
    this._insertEdges(that._data.edges);

    this.setDataReady(true);
};


vq.models.CircVisData.prototype._remove_wedge_data = function(node) {
    var that = this;
    var chr = node.chr;
    _.each(this._ideograms[chr].wedge, function(wedge,index) {
     if (wedge._globalData) {
        that._ideograms[chr].wedge[index] = _.reject(wedge,
            function(obj) { return that.same_feature(obj,node);});
    }
    });
};

vq.models.CircVisData.prototype._add_wedge_data = function(data) {
    var that = this;
    var chr = data.chr;
    _.each(this._ideograms[chr].wedge, function(wedge,index) {
        if (wedge._globalData) {
        if(_.isUndefined(data[that._wedge[index]._value_key]) || that._wedge[index]._plot_type =='karyotype') { return;}
        wedge.push(data);
        }
    });
};

vq.models.CircVisData.prototype.same_feature = function(n1,n2) {
    return this._data.hash(n1) ==  this._data.hash(n2);
};

vq.models.CircVisData.prototype.same_edge= function(edge1,edge2) {
    return this.same_feature(edge1.source,edge2.source) &&
        this.same_feature(edge1.target,edge2.target);
};

vq.models.CircVisData.prototype._retileWedge = function() {
    var that = this;
    _.each(this._wedge,function(wedge,index) {
        var data = wedge._globalData ? that._data.features : wedge._data;
        if (wedge._plot_type == 'tile' || wedge._plot_type == 'glyph') {
                var max_tile_level = 
                wedge._tile.show_all_tiles ?
                    Math.floor((wedge._plot_height - (wedge._radius() * 2)) / (wedge._tile.height + wedge._tile.padding)) :
                    undefined;
                var _data = (wedge._plot_type == 'tile' ? 
                    vq.utils.VisUtils.layoutChrTiles(data, wedge._tile.overlap_distance, max_tile_level) :
                    vq.utils.VisUtils.layoutChrTicks(data, wedge._tile.overlap_distance, max_tile_level));
                wedge._layout = {};
                _.each(_data,function(f) { wedge._layout[wedge._hash(f)] = f.level;}); //layout is a sparse map of id to level
            }
  });
};


vq.models.CircVisData.prototype._retileTicks = function() {
    var that = this;
    var tick;
    var _tickData = 
        vq.utils.VisUtils.layoutChrTicks(this._data.features, this.ticks.overlap_distance);
    var layout = this.ticks._layout;
    var hash = that._data.hash;
    _.each(_tickData,function(f) {layout[hash(f)] = f.level;}); 
};

vq.models.CircVisData.prototype._format_network_node = function(node) {
    var that = this;
    var node_parent_map = this._network.node_parent_map;
    var hash = this._data.hash;

    function include_node(node) {
        var new_node;
        var parent = that._network.nodes_array[node_parent_map[node.chr]];
        //previously loaded this node, pull it from the node_array
        if ( !_.isUndefined(parent)) {
            new_node = _.extend({parent:parent},node);
            // parent.children.push(new_node);
            return new_node;
        }
        else {
            return null;
        }
    }

    if (_.isArray(node)) { return _.compact(_.map(node,include_node,that));}
    return include_node.call(that,node);

};


vq.models.CircVisData.prototype._remove_layouts = function(node) {
    var that = this;
    var hash = this._data.hash(node);

    delete this.ticks._layout[hash];
    delete this._network.layout[hash];

    _.each(this._wedge, function(wedge){
        if (wedge._layout && wedge._layout[hash]) { delete wedge._layout[hash];}
    });

};

vq.models.CircVisData.prototype._remove_feature = function(node) {
    var that = this;
    var feature_index= -1;
     _.each(this._data.chr[node.chr],
        function(obj,index) { if (that.same_feature(obj,node)) { feature_index = index;} 
    });

    if (!!~feature_index)    this._data.chr[node.chr].splice(feature_index,1);

    feature_index = -1;
     _.each(this._data.features,
        function(obj,index) { if (that.same_feature(obj,node)) { feature_index = index;} 
    });

    if (!!~feature_index) this._data.features.splice(feature_index,1);
    return this;
};

vq.models.CircVisData.prototype._insertNode = function(node) {
    var that = this;
    var new_node;
    var hash = this._data.hash;
    if (!_.include(_.keys(that._chrom.groups),node.chr)) {return null;}
    
    if (new_node = _.find(that._data.features,function(feature) { return hash(feature) === hash(node);}) ) {
        return new_node;
    } else {
        that._data.features.push(node);
        that._data.chr[node.chr].push(node);
    }
    return node;
};

vq.models.CircVisData.prototype._insertNodes = function(node_array) {
    var that = this;
    var nodes = [];
    var insert_nodes = _.map(node_array,this._insertNode, this);
    this._retile();
    return insert_nodes;
};

vq.models.CircVisData.prototype._retile = function() {
    this._retileNodes();
    this._retileTicks();
    this._retileWedge();
    return this;
};

vq.models.CircVisData.prototype._retileNodes = function() {
    var that = this;
    if (this._network.tile_nodes && this._data.features.length) {
        nodes = vq.utils.VisUtils.layoutChrTiles(that._data.features ,that._network.node_overlap_distance);
         _.each(nodes,function(f) { that._network.layout[that._data.hash(f)] = f.level;});
    }
    return this;
};

vq.models.CircVisData.prototype._removeNode = function(node) {
    if (!_.isObject(node)) { return; }
    this._remove_feature(node);
};

vq.models.CircVisData.prototype._insertEdges = function(edge_array) {
    var that = this;
    _.each(edge_array,this._insertEdge,that);
};


vq.models.CircVisData.prototype._insertEdge = function(edge) {
    var nodes = [edge.node1,edge.node2];
    var that = this;

    //quit if either node has an unmappable location
    if(_.any(nodes,function(a){return _.isNull(a) ||
        !_.include(_.keys(that._chrom.groups),a.chr); })) {
        console.log('Unmappable chromosome in edge: 1:'+ nodes[0].chr + ', 2:' + nodes[1].chr);
        return null;
    }
    //insert/recover both nodes
    var edge_arr = _.map([nodes[0],nodes[1]],that._insertNode,that);
    if(_.any(edge_arr,function(a){return _.isNull(a);})) {
        console.error('Unable to insert node for requested edge'); return null;
    }

    //list of keys that aren't node1,node2
    var keys = _.chain(edge).keys().reject(function(a){return a=='node1'|| a== 'node2';}).value();
    edge_arr = _.map(edge_arr,this._format_network_node,this);

    //append the source,target nodes
    var insert_edge = _.chain(edge).pick(keys).extend({source:edge_arr[0],target:edge_arr[1]}).value();

    //search for edge in current data
    if (_.any(this._network.links_array,function(link) { return that.same_edge(insert_edge,link);})){
        return null;//old link
    }else {  //insert new edge
        this._network.links_array.push(insert_edge);  //add it
    }
    return insert_edge;
};

vq.models.CircVisData.prototype._removeEdge = function(edge) {
    var that = this;
    if (_.isObject(edge)) {
        var edge_index = -1;
            _.each(this._network.links_array,function(link,index) { 
                if (that.same_edge(link,_.extend(
                            {},{source:edge.node1,target:edge.node2},edge))) {
                edge_index = index;
                }
            });
        if (edge_index) this._network.links_array.splice(edge_index,1);
    }
};

vq.models.CircVisData.prototype._removeEdges = function(edge_arr) {
    var that = this;
    if (_.isArray(edge_arr)) {
        _.each(edge_arr, this._removeEdge,this);
    }
};
