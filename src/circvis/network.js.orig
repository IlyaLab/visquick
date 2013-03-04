

/** private **/
vq.CircVis.prototype._drawNetworkNodes = function (chr) {
    var     dataObj = this.chromoData;

    var network_radius = dataObj._network.tile_nodes ? function(node) { return dataObj._network.network_radius[chr] - (node.level * 2 * dataObj._network.node_radius(node)); } :
    function(node) { return dataObj._network.network_radius[chr];};

    var ideogram_obj = d3.select('.ideogram[data-region="'+chr+'"]');

    if(ideogram_obj.select('g.nodes').empty()) {
        ideogram_obj.append('svg:g').attr('class','nodes');
    }
    var arr = dataObj._network.nodes_array.filter(function(node) { return !node.children && node.chr == chr;});

    var node = ideogram_obj
        .select('g.nodes')
        .selectAll('circle.node')
        .data(dataObj._network.nodes_array.filter(function(node) { return !node.children && node.chr == chr;}),dataObj._network.node_key);

    var node_enter = node.enter(),
        node_exit = node.exit();

    node_enter.append('svg:circle')
        .attr('class','node')
        .attr('cx',0)
        .attr('cy',0)
        .attr('r',function(a) { return dataObj._network.node_radius(a)*4; })
        .style('fill',dataObj._network.node_fillStyle)
        .style('stroke',dataObj._network.node_strokeStyle)
        .style('fill-opacity',1e-6)
        .style('stroke-opacity',1e-6)
        .attr('transform', function(node) {
            return 'rotate('+ ((dataObj._ideograms[chr].theta(node.start) / Math.PI * 180) - 90) +')translate(' + network_radius(node) + ')';
        })
        .on('mouseover',function(d){dataObj._network.node_hovercard.call(this,d);})
        .transition()
        .duration(800)
        .attr('r',dataObj._network.node_radius)
        .style('stroke-opacity',1)
        .style('fill-opacity',1);

    node_exit
    .transition()
        .duration(800)
        .attr('r',function(a) {return dataObj._network.node_radius(a)*4; })
        .style('fill-opacity',1e-6)
                .style('stroke-opacity',1e-6)
       .remove();
};

vq.CircVis.prototype._drawNetworkLinks= function() {

    var dataObj = this.chromoData;

    var bundle = d3.layout.bundle();

    var network_radius = dataObj._network.tile_nodes ? function(node) { return dataObj._network.network_radius[node.chr] - (node.level * 2 * dataObj._network.node_radius(node)); } :
        function(node) { return dataObj._network.network_radius[node.chr];};

    var line = d3.svg.line.radial()
        .interpolate("bundle")
        .tension(.65)
        .radius(function(d) { return d.radius !== undefined ?
            d.radius :
            network_radius(d)
        })
        .angle(function(d) { return d.angle !== undefined ?
            d.angle :
            dataObj._ideograms[d.chr]._feature_angle(d.start);
        });

    var edges = d3.select('g.links').selectAll("path.link")
        .data(bundle(dataObj._network.links_array).map(function(b, index) { return _.extend(dataObj._network.links_array[index],{spline:b});}));

        edges
        .enter().insert("svg:path")
        .attr("class", function(d) {
            return "link t_" + d.source.chr + " p_"+ d.target.chr;
        })

        .style('fill','none')
        .style('stroke',dataObj._network.link_strokeStyle)
        .style('stroke-width',function(a) { return dataObj._network.link_line_width(a) * 3;})
        .style('stroke-opacity',1e-6)
        .attr("d", function(link) { return line(link.spline);})
        .on('mouseover',function(d){
            d3.select(this).style('stroke-opacity',1.0); dataObj._network.link_hovercard.call(this,d);
        })
        .on('mouseout',function(d){d3.select(this).style('stroke-opacity',dataObj._network.link_alpha(d));})
        .transition()
        .duration(800)
        .style('stroke-width',dataObj._network.link_line_width)
        .style('stroke-opacity',dataObj._network.link_alpha);

        edges.exit()
        .transition()
        .duration(800)
         .style('stroke-opacity',1e-6)
         .style('stroke-width',function(a) { return dataObj._network.link_line_width(a)*3;})
        .remove();
};

