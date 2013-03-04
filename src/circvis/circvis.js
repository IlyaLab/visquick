//circvis.wedge.js


// vq.CircVis = function() {
//     vq.Vis.call(this);
// };
// vq.CircVis.prototype = vq.extend(vq.Vis);

var CircVis = function(data) {
  var chromoData = new vq.models.CircVisData(data);

  var circvis = function() {

    if (chromoData.isDataReady()) {
        _render();
    } else {
        console.warn('Invalid data input.  Check data for missing or improperly formatted values.');
    }
    return this;
};

   var _render = function() {

    var width = chromoData._plot.width, 
       height = chromoData._plot.height;

    function dragmove(d,u) {
        var transform = d3.transform(d3.select(this).attr('transform'));
        var translate = transform.translate;
        var scale = transform.scale;
        var rotation = transform.rotate;
        var actual_width = (width / 2 * scale[0]), actual_height = (height / 2 * scale[1]);
        var p = [d3.event.x - actual_width, d3.event.y -actual_height];
        var q = [d3.event.x - d3.event.dx - actual_width, d3.event.y - d3.event.dy - actual_height];
        function cross(a, b) { return a[0] * b[1] - a[1] * b[0]; }
        function dot(a, b) { return a[0] * b[0] + a[1] * b[1]; }
        var angle = Math.atan2(cross(q,p),dot(q,p)) * 180 / Math.PI;
        rotation += angle;
        d3.select(this).attr('transform','translate(' + translate[0] + ',' + translate[1] + ')scale(' + scale + ')rotate(' + rotation + ')');
    }

    function dragstart(d,u) {}
    function dragend(d,u) {}

    var drag = d3.behavior.drag()
        .on("dragstart", dragstart)
        .on("drag", dragmove)
        .on("dragend", dragend);

    var id = chromoData._plot.id;

    var svg = d3.select(chromoData._plot.container)        
        .append('svg:svg')
        .attr('id', id)
        .attr('width', width)
        .attr('height', height)
        .append('svg:g')
        .attr('class', 'circvis')
        .attr("transform", 'translate(' + width / 2 + ',' + height / 2 + ')')
        .call(drag);

        svg.insert('svg:defs');

    var ideograms = svg.selectAll('g.ideogram')
        .data(chromoData._chrom.keys)
        .enter().append('svg:g')
            .attr('class','ideogram')
            .attr('data-region',function(d) { return d;})
            .attr('opacity',1.0)
            .attr('transform',function(key) { return 'rotate(' + chromoData._chrom.groups[key].startAngle * 180 / Math.PI + ')';})
            .each(draw_ideogram);
//calculate label placement as halfway along tick radial segment
    var outerRadius  = (chromoData._plot.height / 2);
    var outerTickRadius = outerRadius - chromoData.ticks.outer_padding;
    var innerRadius = outerTickRadius - chromoData.ticks.height;
    var label_height = (outerTickRadius + innerRadius) / 2;

           ideograms.append('text')
            .attr('transform',function(key) { return 'rotate(' + (chromoData._chrom.groups[key].endAngle - chromoData._chrom.groups[key].startAngle)
                   * 180 / Math.PI / 2 +
                   ' )translate(0,-'+label_height+')';})
             .attr('class','region_label')
                           .attr('stroke','black')
                           .attr('text-anchor','middle')
                            .attr('dy','.35em')
               .attr('cursor','pointer')
            .text(function(f) { return f;})
               .each(function() { $(this).disableSelection();})
            .on('mouseover',function ideogram_label_click(obj){
                   var half_arc_genome = {};
                   var region_length = chromoData.normalizedLength[obj];
                   var new_length = 1.0 - region_length;
                   var num_regions = _.size(chromoData.normalizedLength);
                   _.each(chromoData.normalizedLength,function(value,key,list){
                        half_arc_genome[key] = value / new_length / 2;
                   });
                   half_arc_genome[obj] = 0.5;
               });
    if(!_.isNull(chromoData._chrom.radial_grid_line_width)&&
                chromoData._chrom.radial_grid_line_width > 0) {

        var network_radius = chromoData._network.network_radius;
                ideograms.selectAll('path.radial_lines')
                    .data(function(chr) {
                        return [[{x:0,y:-1*outerTickRadius},{x:0,y:-1*network_radius[chr]}]];
                    })
                    .enter().insert('svg:path','.wedges')
                    .attr('class','radial_lines')
                    .attr('d',d3.svg.line()
                    .x(function(point) {return point.x;})
                    .y(function(point) {return point.y;})
                    .interpolate('linear')
                    );
   }

     
    if (chromoData._network._doRender) {
           _drawNetworkLinks(svg.insert('svg:g','.ideogram').attr('class','links'));
    }
    _(_.range(0,chromoData._wedge.length)).each(function(ring_index) {
        _draw_axes_ticklabels(ring_index);
        _insertRingClipping(ring_index);
    });

    return this;

};

var draw_ideogram = function(d) {
        _add_wedge(d);
        draw_ideogram_data(d);
};

var draw_ideogram_data = function(d) {
      if (chromoData._chrom.groups[d] === undefined) { return;}
        _(_.range(0,chromoData._wedge.length)).each(function(ring) {
          _drawWedgeData(d,ring);
        });
            _drawTicks( d);
          if ( chromoData._network._doRender) {
             _drawNetworkNodes( d);
          }
};