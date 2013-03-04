

/** private **/
var _drawNetworkNodes = function (chr) {

    var hash = chromoData._data.hash;
    var level = function(node) { return chromoData._network.layout[hash(node)];};
    var center = vq.utils.VisUtils.tileCenter;
    var network_radius = chromoData._network.tile_nodes ? function(node) { return chromoData._network.network_radius[chr] - (level(node) * 2 * chromoData._network.node_radius(node)); } :
    function(node) { return chromoData._network.network_radius[chr];};

    var ideogram_obj = d3.select('.ideogram[data-region="'+chr+'"]');

    if(ideogram_obj.select('g.nodes').empty()) {
        ideogram_obj.append('svg:g').attr('class','nodes');
    }
    
    var node = ideogram_obj
        .select('g.nodes')
        .selectAll('circle.node')
        .data(_.where(chromoData._data.features,{chr:chr}),hash);

    var node_enter = node.enter(),
        node_exit = node.exit();

    node_enter.append('svg:circle')
        .attr('class','node')
        .attr('cx',0)
        .attr('cy',0)
        .attr('r',function(a) { return chromoData._network.node_radius(a)*4; })
        .style('fill',chromoData._network.node_fillStyle)
        .style('stroke',chromoData._network.node_strokeStyle)
        .style('fill-opacity',1e-6)
        .style('stroke-opacity',1e-6)
        .attr('transform', function(node) {
            return 'rotate('+ ((chromoData._ideograms[chr].theta(center(node)) / Math.PI * 180) - 90) +')translate(' + network_radius(node) + ')';
        })
        .on('mouseover',function(d){chromoData._network.node_hovercard.call(this,d);})
        .transition()
        .duration(800)
        .attr('r',chromoData._network.node_radius)
        .style('stroke-opacity',1)
        .style('fill-opacity',1);

    node_exit
    .transition()
        .duration(800)
        .attr('r',function(a) {return chromoData._network.node_radius(a)*4; })
        .style('fill-opacity',1e-6)
                .style('stroke-opacity',1e-6)
       .remove();
       // .each("end",remove_node_layout);
};


var remove_node_layout = function(node) {
    delete chromoData._network.layout[chromoData._data.hash(node)];
};

var _drawNetworkLinks= function() {

    var hash = chromoData._data.hash;
    var center = vq.utils.VisUtils.tileCenter;
    var level = function(node) { return chromoData._network.layout[hash(node)];};
    var bundle = d3.layout.bundle();

    var network_radius = chromoData._network.tile_nodes ? function(node) { return chromoData._network.network_radius[node.chr] - (level(node) * 2 * chromoData._network.node_radius(node)); } :
        function(node) { return chromoData._network.network_radius[node.chr];};

    var line = d3.svg.line.radial()
        .interpolate("bundle")
        .tension(.65)
        .radius(function(d) { return d.radius !== undefined ?
            d.radius :
            network_radius(d);
        })
        .angle(function(d) { return d.angle !== undefined ?
            d.angle :
            chromoData._ideograms[d.chr]._feature_angle(center(d));
        });

    var new_data = bundle(chromoData._network.links_array).map(function(b, index) { return _.extend(chromoData._network.links_array[index],{spline:b});});

    var edges = d3.select('g.links').selectAll("path.link")
        .data(new_data);

        edges
        .enter().insert("svg:path")
        .attr("class", function(d) {
            return "link t_" + d.source.chr + " p_"+ d.target.chr;
        })

        .style('fill','none')
        .style('stroke',chromoData._network.link_strokeStyle)
        .style('stroke-width',function(a) { return chromoData._network.link_line_width(a) * 3;})
        .style('stroke-opacity',1e-6)
        .attr("d", function(link) { return line(link.spline);})
        .on('mouseover',function(d){
            d3.select(this).style('stroke-opacity',1.0); chromoData._network.link_hovercard.call(this,d);
        })
        .on('mouseout',function(d){d3.select(this).style('stroke-opacity',chromoData._network.link_alpha(d));})
        .transition()
        .duration(800)
        .style('stroke-width',chromoData._network.link_line_width)
        .style('stroke-opacity',chromoData._network.link_alpha);

        edges.exit()
        .transition()
        .duration(800)
         .style('stroke-opacity',1e-6)
         .style('stroke-width',function(a) { return chromoData._network.link_line_width(a)*3;})
        .remove();
};

