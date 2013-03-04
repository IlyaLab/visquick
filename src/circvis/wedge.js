

function _drawWedgeContents (chr, wedge_index) {
    
    var ideogram = chromoData._ideograms[chr];
    var wedge_obj = d3.select('.ideogram[data-region="'+chr+'"] .wedge[data-ring="'+wedge_index+'"]');
    var wedge_params = chromoData._wedge[wedge_index];
    switch (wedge_params._plot_type) {
        case('karyotype'):
        case('tile'):
        case('band'):
        case('heatmap'):
        case('glyph'):
            _drawWedgeData(chr, wedge_index);
            break;
        default:
            _drawWedge_withRange(chr, wedge_index);
    }
};

function _insertRingClipping (index) {
    var outerRadius =  chromoData._wedge[index]._outerRadius,
    innerRadius = chromoData._wedge[index]._innerRadius;

    var arc = d3.svg.arc()({innerRadius:innerRadius,outerRadius:outerRadius, startAngle:0,endAngle:2*Math.PI});

    d3.select('svg .circvis defs').append('svg:clipPath')
        .attr('id','ring_clip_'+index)
        .append('svg:path')
        .attr('d',arc);
};

/**private **/
 function _add_wedge (chr) {
    
    var ideogram_obj = d3.select('.ideogram[data-region="'+chr+'"]');

    function outerRadius(index) {
        return chromoData._wedge[index]._outerPlotRadius;
    }

    function innerRadius(index) {
        return chromoData._wedge[index]._innerRadius;
    }

    var wedge_obj = ideogram_obj.append("svg:g")
        .attr('class','wedges')
        .selectAll("path")
        .data(_.range(0,chromoData._wedge.length))
        .enter()
        .append("svg:g")
        .attr("class",  "wedge")
        .attr("clip-path",function(index) { return "url(#ring_clip_" + index + ")";})
        .attr('data-ring',function(index) { return index;});

    wedge_obj
        .append("svg:path")
        .attr('class', 'background')
        .attr("d",d3.svg.arc()
        .innerRadius(  function(ring_index) { return innerRadius(ring_index); })
        .outerRadius( function(ring_index) { return outerRadius(ring_index);} )
        .startAngle(0)
        .endAngle( chromoData._chrom.groups[chr].angle)
    );


    wedge_obj.append("svg:g")
        .attr('class','data');

    ideogram_obj.selectAll("g.wedge")
        .each(checkAndPlot);

    function checkAndPlot(wedge_index) {
        var wedge_obj = d3.select(this);
        var wedge_params = chromoData._wedge[wedge_index];
        if ((wedge_params._plot_type != 'karyotype') &&
            (wedge_params._plot_type != 'tile') &&
            (wedge_params._plot_type != 'band') &&
            (wedge_params._plot_type != 'glyph')) {
            if (isNaN(wedge_params._min_plotValue) || isNaN(wedge_params._max_plotValue)) {
                console.warn('Range of values for ring with index (' + wedge_index + ') not detected.  Data has not been plotted.');
                return;
            }
            else if (wedge_params._min_plotValue == wedge_params._max_plotValue) {
                wedge_params._min_plotValue = wedge_params._min_plotValue - 1;
                wedge_params._max_plotValue = wedge_params._max_plotValue + 1;
                console.warn('Invalid value range detected.  Range reset to [-1,1].');
            }
        }
        _drawWedgeContents(chr, wedge_index);
    }
};


function _drawWedge_withoutRange ( chr, wedge_index) {
    
    var ideogram = chromoData._ideograms[chr];
    var wedge_params = chromoData._wedge[wedge_index];
    var wedge = ideogram.wedge[wedge_index];
};

function _drawWedge_withRange (chr, wedge_index) {
        
    var ideogram = chromoData._ideograms[chr];
    var wedge_params = chromoData._wedge[wedge_index];
    var wedge = ideogram.wedge[wedge_index];
    var wedge_obj = d3.select('.ideogram[data-region="'+chr+'"] .wedge[data-ring="'+wedge_index+'"]');

    if (wedge_params._draw_axes) {
        /* Circular grid lines. */
        //add a new panel each time we want to draw on top of the previously created image.
        var p = chromoData._chrom.groups[chr];
        var startAngle = p.startAngle;
        var endAngle = p.angle;

        // generate ticks for y_axis
        var radii = wedge_params._y_linear.ticks(4);
          wedge_obj.append("svg:g")
            .attr('class','axes')
            .selectAll("path")
            .data(radii)
            .enter().append("svg:path")
            .style("fill", "#ddd")
            .style("stroke", "#555")
            .style('stroke-width', '1.0px')
            .attr('d',d3.svg.arc()
                .innerRadius(function(d) { return wedge_params._y_linear(d);})
                .outerRadius(function(d) { return wedge_params._y_linear(d);})
                .startAngle(0)
                .endAngle(endAngle)
        ); 
    }


    _drawWedgeData(chr, wedge_index);

};

function _drawWedgeData (chr, wedge_index) {
    var that = this;

    //draw all wedges if parameter is left out.
    var all_wedges = _.isUndefined(wedge_index) || _.isNull(wedge_index);
    //return if ill-defined wedge
    if (!all_wedges && _.isNumber(wedge_index) && _.isFinite(wedge_index) &&
        wedge_index >= chromoData._wedge.length) {
        console.error('drawWedgeData: Invalid wedge #:' + wedge_index);
        return;
    }

    function drawWedge(index) {
        var wedge_params = chromoData._wedge[index];

        var funcName =  wedge_params._plot_type;
        if (_drawWedgeData_array[funcName] !==undefined) {
            _drawWedgeData_array[funcName](chr,index);
        }
        //get all the data points in this wedge
        var data = d3.selectAll('.ideogram[data-region="'+chr+'"] .wedge[data-ring="'+index+'"] .data > *');
        //set listener
        data.on('mouseover',function(d) { wedge_params.hovercard.call(this,d);});
    }

    if (all_wedges) {
        _.each(_.range(0,chromoData._wedge.length),function(i) { drawWedge.call(that,i);});
        return;
    }
    else {
        drawWedge.call(that,wedge_index);
    }

};

var _drawWedgeData_array = {
    'barchart' : function (chr, wedge_index) {
    
    var wedge_params = chromoData._wedge[wedge_index];
    var wedge_data = chromoData._ideograms[chr].wedge[wedge_index];
    var value_key = wedge_params._value_key;
    var wedge_obj = d3.select('.ideogram[data-region="'+chr+'"] .wedge[data-ring="'+wedge_index+'"]');

    var histogramArc = function (point) {
        var _inner = wedge_params._innerRadius;
        var start = chromoData._ideograms[chr].theta(point.start);
        var end = chromoData._ideograms[chr].theta(point.end);
        return d3.svg.arc()
            .innerRadius( _inner)
            .startAngle( start)
            .endAngle(end);
    };

    var hist = wedge_obj.select('g.data')
        .selectAll("path")
        .data(wedge_data,wedge_params._hash);
    hist
        .enter().append('svg:path')
        .style('fill',wedge_params._fillStyle)
        .style('stroke',wedge_params._strokeStyle)
        .style('stroke-width',wedge_params._lineWidth)
        .style('fill-opacity',1e-6)
        .style('stroke-opacity',1e-6)
        .transition()
        
        .duration(800)
        .attrTween('d',function(a) {
            var i =d3.interpolate({outerRadius:wedge_params._innerRadius},{outerRadius:wedge_params._thresholded_outerRadius(a[value_key])});
            var arc = histogramArc(a);
            return function(t) {return arc(i(t));};
        })
        .style('fill-opacity', 1.0)
        .style('stroke-opacity', 1.0);

    hist.exit()
        .transition()
        .duration(800)
        .attrTween('d',function(a) {
            var i =d3.interpolate({outerRadius:wedge_params._thresholded_outerRadius(a[value_key])},{outerRadius:wedge_params._innerRadius});
            var arc = histogramArc(a);
            return function(t) {return arc(i(t));};
        })
        .style('fill-opacity',1e-6)
        .style('stroke-opacity',1e-6)
        .remove();
},

 'scatterplot' : function (chr, wedge_index) {
    
    var wedge_params = chromoData._wedge[wedge_index];
    var wedge_data = chromoData._ideograms[chr].wedge[wedge_index];
    var value_key = wedge_params._value_key;
    var center = vq.utils.VisUtils.tileCenter;
    var wedge_obj = d3.select('.ideogram[data-region="'+chr+'"] .wedge[data-ring="'+wedge_index+'"]');

    var scatter = wedge_obj.select('g.data')
        .selectAll("path")
        .data(wedge_data,wedge_params._hash);
    scatter
        .enter().append('svg:path')
        .style('fill',wedge_params._fillStyle)
        .style('stroke',wedge_params._strokeStyle)
        .style('fill-opacity', 1e-6)
        .style('stroke-opacity', 1e-6)
        .attr("transform",function(point) {
            return "rotate(" + ((chromoData._ideograms[chr].theta(center(point)) * 180 / Math.PI) - 90)+ ")translate(" +
                wedge_params._thresholded_value_to_radius(point[value_key]) + ")";} )
        .attr('d',d3.svg.symbol()
            .type(wedge_params._shape)
            .size(Math.pow(wedge_params._radius(),2)) )
        .transition()
        .duration(800)
        .style('fill-opacity', 1)
        .style('stroke-opacity', 1);

    scatter.exit()
        .transition()
        .duration(800)
        .style('fill-opacity', 1e-6)
        .style('stroke-opacity', 1e-6)
        .remove();
},

 'line' : function(chr, wedge_index) {
    
    var wedge_params = chromoData._wedge[wedge_index];
    var wedge_data = _.sortBy(chromoData._ideograms[chr].wedge[wedge_index],'start');
    var value_key = wedge_params._value_key;
    var center = vq.utils.VisUtils.tileCenter;
    var wedge_obj = d3.select('.ideogram[data-region="'+chr+'"] .wedge[data-ring="'+wedge_index+'"]');

    var line = d3.svg.line.radial()
            .interpolate('basis')
            .tension(0.8)
            .radius(function(point) { return wedge_params._thresholded_value_to_radius(point[value_key]);})
            .angle(function(point) { return chromoData._ideograms[chr].theta(center(point));});

    var line_plot = wedge_obj.select('g.data')
        .selectAll("path")
        .data([wedge_data]);
    line_plot
        .enter().append('svg:path')
        .style('fill',wedge_params._fillStyle)
        .style('stroke',wedge_params._strokeStyle)
        .style('fill-opacity', 1e-6) //leave opacity at 0
        .style('stroke-opacity', 1e-6)
        .attr('d',line)
        .transition()
        .duration(800)
        .style('stroke-opacity', 1);

    line_plot.exit()
        .transition()
        .duration(800)
        .style('fill-opacity', 1e-6)
        .style('stroke-opacity', 1e-6)
        .remove();
},

 'area' : function (chr, wedge_index) {
    
    var wedge_params = chromoData._wedge[wedge_index];
    var wedge_data = _.sortBy(chromoData._ideograms[chr].wedge[wedge_index],'start');
    var value_key = wedge_params._value_key;
    var center = vq.utils.VisUtils.tileCenter;
    var wedge_obj = d3.select('.ideogram[data-region="'+chr+'"] .wedge[data-ring="'+wedge_index+'"]');

    var line = d3.svg.line.radial()
            .interpolate('basis')
            .tension(0.8)
            .radius(function(point) { return wedge_params._thresholded_value_to_radius(point[value_key]);})
            .angle(function(point) { return chromoData._ideograms[chr].theta(center(point));});


    var area = d3.svg.area.radial()
            .interpolate('basis')
            .tension(0.8)
            .innerRadius(function(point) { return  wedge_params._thresholded_innerRadius(point[value_key]);})
            .outerRadius(function(point) { return wedge_params._thresholded_outerRadius(point[value_key]);})
            .angle(function(point) { return chromoData._ideograms[chr].theta(center(point));});


    var line_plot = wedge_obj.select('g.data')
        .selectAll("path")
        .data([wedge_data]);
    line_plot
        .enter().append('svg:path')
        .style('fill',wedge_params._fillStyle)
        .style('stroke',wedge_params._strokeStyle)
        .style('fill-opacity', 1e-6) //leave opacity at 0
        .style('stroke-opacity', 1e-6)
        .attr('d',line)
        .transition()
        .duration(800)
        .style('stroke-opacity', 1);

        line_plot
        .enter().append('svg:path')
        .style('fill',wedge_params._fillStyle)
        .style('stroke',wedge_params._strokeStyle)
        .style('fill-opacity', 1e-6) 
        .style('stroke-opacity', 1e-6)//leave opacity at 0
        .attr('d',area)
        .transition()
        .duration(800)
        .style('fill-opacity', 0.7);

    line_plot.exit()
        .transition()
        .duration(800)
        .style('fill-opacity', 1e-6)
        .style('stroke-opacity', 1e-6)
        .remove();
}, 

'band' : function (chr, wedge_index) {
    
    var wedge_params = chromoData._wedge[wedge_index];
    var wedge_data = chromoData._ideograms[chr].wedge[wedge_index];
    var value_key = wedge_params._value_key;

    var wedge_obj = d3.select('.ideogram[data-region="'+chr+'"] .wedge[data-ring="'+wedge_index+'"]');
    var band = wedge_obj.select('g.data')
        .selectAll("path")
        .data(wedge_data,wedge_params._hash);
    band
        .enter().append('svg:path')
        .style('fill',wedge_params._fillStyle)
        .style('stroke',wedge_params._strokeStyle)
        .style('fill-opacity', 1e-6)
        .style('stroke-opacity', 1e-6)
        .attr('d',d3.svg.arc()
        .innerRadius( wedge_params._innerRadius)
        .outerRadius( wedge_params._outerPlotRadius)
        .startAngle(function(point) { return chromoData._ideograms[chr].theta(point.start);})
        .endAngle(function(point) { return chromoData._ideograms[chr].theta(point.end);})
    )
        .transition()
        
        .duration(800)
        .style('fill-opacity', 1)
        .style('stroke-opacity', 1);

    band
        .exit()
        .transition()
        
        .duration(800)
        .style('fill-opacity', 1e-6)
        .style('stroke-opacity', 1e-6)
        .remove();
},

 'glyph' : function (chr, wedge_index) {
    var center = vq.utils.VisUtils.tileCenter;
    var wedge_params = chromoData._wedge[wedge_index];
    var wedge_data = chromoData._ideograms[chr].wedge[wedge_index];
    var value_key = wedge_params._value_key;
    var wedge_obj = d3.select('.ideogram[data-region="'+chr+'"] .wedge[data-ring="'+wedge_index+'"]');

    var glyph = wedge_obj.select('g.data')
        .selectAll("path")
        .data(wedge_data,wedge_params._hash);
    glyph
        .enter().append('svg:path')
        .style('fill',wedge_params._fillStyle)
        .style('stroke',wedge_params._strokeStyle)
        .style('fill-opacity', 1e-6)
                .style('stroke-opacity', 1e-6)
        .attr("transform",function(point) {
            return "rotate(" + ((chromoData._ideograms[chr].theta(center(point)) * 180 / Math.PI) - 90)+ ")translate(" +
                wedge_params._glyph_distance(point) + ")";} )
        .transition()
        
        .duration(800)
        .attr('d',d3.svg.symbol()
        .type(wedge_params._shape)
        .size(Math.pow(wedge_params._radius(),2))
    )
        .transition()
        
        .duration(800)
        .style('fill-opacity', 1)
        .style('stroke-opacity', 1);
    glyph.exit()
        .transition()
        .duration(800)
        .style('fill-opacity', 1e-6)
                .style('stroke-opacity', 1e-6)
        .remove()        
        .each("end",function(n) { remove_wedge_layout(n,wedge);});
},

 'tile' : function(chr, wedge_index) {
    
    var wedge_params = chromoData._wedge[wedge_index];
    var wedge_data = chromoData._ideograms[chr].wedge[wedge_index];
    var value_key = wedge_params._value_key;
    var wedge_obj = d3.select('.ideogram[data-region="'+chr+'"] .wedge[data-ring="'+wedge_index+'"]');

    var tile = wedge_obj.select('g.data')
        .selectAll("path")
        .data(wedge_data,wedge_params._hash);
    tile
        .enter().append('svg:path')
        .style('fill',wedge_params._fillStyle)
        .style('stroke',wedge_params._strokeStyle)
        .style('fill-opacity', 1e-6)
                .style('stroke-opacity', 1e-6)
        .attr('d',d3.svg.arc()
        .innerRadius( function(point) { return wedge_params._thresholded_tile_innerRadius(point,wedge_params);})
        .outerRadius( function(point) { return wedge_params._thresholded_tile_outerRadius(point,wedge_params);})
        .startAngle(function(point) { return chromoData._ideograms[chr].theta(point.start);})
        .endAngle(function(point) { return chromoData._ideograms[chr].theta(point.end);})
    ) .transition()
        
        .duration(800)
        .style('fill-opacity', 1)
        .style('stroke-opacity', 1);

    tile.exit()
        .transition()
        
        .duration(800)
        .style('fill-opacity', 1e-6)
                .style('stroke-opacity', 1e-6)
        .remove()
        .each("end",function(n) { remove_wedge_layout(n,wedge);});
},

 'karyotype' : function (chr, wedge_index) {
    
    var wedge_params = chromoData._wedge[wedge_index];
    var wedge_data = chromoData._ideograms[chr].wedge[wedge_index];
    var value_key = wedge_params._value_key;
    var wedge_obj = d3.select('.ideogram[data-region="'+chr+'"] .wedge[data-ring="'+wedge_index+'"]');
    var karyotype = wedge_obj.select('g.data')
        .selectAll("path")
        .data(wedge_data,wedge_params._hash);
    karyotype
        .enter().append('svg:path')
        .style('fill',function(point) { return point[value_key];})
        .style('stroke',wedge_params._strokeStyle)
        .style('fill-opacity', 1e-6)
                .style('stroke-opacity', 1e-6)
        .attr('d',d3.svg.arc()
        .innerRadius( wedge_params._innerRadius)
        .outerRadius( wedge_params._outerPlotRadius)
        .startAngle(function(point) { return chromoData._ideograms[chr].theta(point.start);})
        .endAngle(function(point) { return chromoData._ideograms[chr].theta(point.end);})
    )
        .transition()     
        .duration(800)
        .style('fill-opacity', 1)
        .style('stroke-opacity', 1);

    karyotype.exit()
        .transition()
        
        .duration(800)
        .style('fill-opacity', 1e-6)
                .style('stroke-opacity', 1e-6)
        .remove();
},

 'heatmap' : function (chr, wedge_index) {
    
    var wedge_params = chromoData._wedge[wedge_index];
    var wedge_data = chromoData._ideograms[chr].wedge[wedge_index];
    var value_key = wedge_params._value_key;
    var wedge_obj = d3.select('.ideogram[data-region="'+chr+'"] .wedge[data-ring="'+wedge_index+'"]');

    var generateArcTween = function (point) {
        var _theta = chromoData._ideograms[chr].theta(point.start);
        var _end = chromoData._ideograms[chr].theta(point.end);
        return d3.svg.arc()
            .innerRadius(function(multiplier) { return wedge_params._innerRadius - (multiplier *4);})
            .outerRadius(function(multiplier) { return wedge_params._outerPlotRadius + (multiplier * 4);})
            .startAngle(function(multiplier) { return _theta -  (multiplier * Math.PI / 360);})
            .endAngle(function(multiplier) {  return _end + (multiplier * Math.PI /  360);});
    };

    var heat = wedge_obj.select('g.data')
        .selectAll("path")
        .data(wedge_data,wedge_params._hash);
    heat
        .enter().append('svg:path')
        .style('fill',wedge_params._fillStyle)
        .style('stroke',wedge_params._strokeStyle)
        .style('stroke-width','1px')
        .style('fill-opacity', 1e-6)
                .style('stroke-opacity', 1e-6)
        .attr('d',d3.svg.arc()
        .innerRadius( wedge_params._innerRadius)
        .outerRadius( wedge_params._outerPlotRadius)
        .startAngle(function(point) { return chromoData._ideograms[chr].theta(point.start);})
        .endAngle(function(point) { return chromoData._ideograms[chr].theta(point.end);})
    )
        .transition()
        
        .duration(800)
        .transition()
        
        .duration(800)
        .style('fill-opacity', 1)
        .style('stroke-opacity', 1)
        .attrTween('d',function(a) {
            var i =d3.interpolate(4,0);
            var arc = generateArcTween(a);
            return function(t) {return arc(i(t));};
        });

    heat.exit()
        .transition()
        .duration(800)
        .style('fill-opacity', 1e-6)
                .style('stroke-opacity', 1e-6)
        .remove();

}
};

_drawWedgeData_array['histogram'] = _drawWedgeData_array['barchart'];

function _draw_axes_ticklabels (wedge_index) {
    
    
    var wedge_params = chromoData._wedge[wedge_index];
    //don't do this for ring without a range.
    if(!_.isFunction(wedge_params._y_linear)) { return;}

    if (wedge_params._draw_axes) {
        /* Circular grid lines. */

        // generate ticks for y_axis
        var radii = wedge_params._y_linear.ticks(4);

        d3.select('.ideogram .wedge[data-ring="'+wedge_index+'"] .axes')
            .append("svg:g")
            .attr('class','labels')
            .selectAll('g.text')
            .data(radii)
            .enter().append("svg:text")
            .each(function() {$(this).disableSelection();})
            .attr('transform',function(r) {return 'translate(0,-'+wedge_params._y_linear(r) +')';})
            .text(function(a) { return a;});
    }

};

function remove_wedge_layout(node,wedge) {
    delete wedge._layout[wedge._hash(node)];
};