

vq.CircVis.prototype._drawWedgeContents = function(chr, wedge_index) {
    var that = this;
    var dataObj = that.chromoData;
    var ideogram = dataObj._ideograms[chr];
    var wedge_obj = d3.select('.ideogram[data-region="'+chr+'"] .wedge[data-ring="'+wedge_index+'"]');
    var wedge_params = dataObj._wedge[wedge_index];
    switch (wedge_params._plot_type) {
        case('karyotype'):
        case('tile'):
        case('band'):
        case('heatmap'):
        case('glyph'):
            this._drawWedgeData(chr, wedge_index);
            break;
        default:
            this._drawWedge_withRange(chr, wedge_index);
    }
};

vq.CircVis.prototype._insertRingClipping = function(index) {
    var outerRadius =  this.chromoData._wedge[index]._outerRadius,
    innerRadius = this.chromoData._wedge[index]._innerRadius;

    var arc = d3.svg.arc()({innerRadius:innerRadius,outerRadius:outerRadius, startAngle:0,endAngle:2*Math.PI});

    d3.select('svg .circvis defs').append('svg:clipPath')
        .attr('id','ring_clip_'+index)
        .append('svg:path')
        .attr('d',arc);
};

/**private **/
vq.CircVis.prototype._add_wedge = function(chr) {
    var that = this;
    var dataObj = this.chromoData;
    var ideogram_obj = d3.select('.ideogram[data-region="'+chr+'"]');

    function outerRadius(index) {
        return dataObj._wedge[index]._outerPlotRadius;
    }

    function innerRadius(index) {
        return dataObj._wedge[index]._innerRadius;
    }

    var wedge_obj = ideogram_obj.append("svg:g")
        .attr('class','wedges')
        .selectAll("path")
        .data(_.range(0,dataObj._wedge.length))
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
        .endAngle( dataObj._chrom.groups[chr].angle)
    );


    wedge_obj.append("svg:g")
        .attr('class','data');

    ideogram_obj.selectAll("g.wedge")
        .each(checkAndPlot);

    function checkAndPlot(wedge_index) {
        var wedge_obj = d3.select(this);
        var wedge_params = dataObj._wedge[wedge_index];
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
        that._drawWedgeContents(chr, wedge_index);
    }
};


vq.CircVis.prototype._drawWedge_withoutRange = function( chr, wedge_index) {
    var that = this;
    var dataObj = that.chromoData;
    var ideogram = dataObj._ideograms[chr];
    var wedge_params = dataObj._wedge[wedge_index];
    var wedge = ideogram.wedge[wedge_index];
};

vq.CircVis.prototype._drawWedge_withRange = function(chr, wedge_index) {
    var that = this;
    var dataObj = that.chromoData;
    var ideogram = dataObj._ideograms[chr];
    var wedge_params = dataObj._wedge[wedge_index];
    var wedge = ideogram.wedge[wedge_index];
    var wedge_obj = d3.select('.ideogram[data-region="'+chr+'"] .wedge[data-ring="'+wedge_index+'"]');

    if (wedge_params._draw_axes) {
        /* Circular grid lines. */
        //add a new panel each time we want to draw on top of the previously created image.
        var p = dataObj._chrom.groups[chr];
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


    that._drawWedgeData(chr, wedge_index);

};

vq.CircVis.prototype._drawWedgeData = function(chr, wedge_index) {
    var that = this;

    //draw all wedges if parameter is left out.
    var all_wedges = _.isUndefined(wedge_index) || _.isNull(wedge_index);
    //return if ill-defined wedge
    if (!all_wedges && _.isNumber(wedge_index) && _.isFinite(wedge_index) &&
        wedge_index >= that.chromoData._wedge.length) {
        console.error('drawWedgeData: Invalid wedge #:' + wedge_index);
        return;
    }

    function drawWedge(index) {
        var wedge_params = that.chromoData._wedge[index];

        var funcName = '_drawWedgeData_'+ wedge_params._plot_type;
        if (that[funcName] !==undefined) {
            that[funcName](chr,index);
        }
        //get all the data points in this wedge
        var data = d3.selectAll('.ideogram[data-region="'+chr+'"] .wedge[data-ring="'+index+'"] .data > *');
        //set listener
        data.on('mouseover',function(d) { wedge_params.hovercard.call(this,d);});
    }

    if (all_wedges) {
        _.each(_.range(0,that.chromoData._wedge.length),function(i) { drawWedge.call(that,i);});
        return;
    }
    else {
        drawWedge.call(that,wedge_index);
    }

};


vq.CircVis.prototype._drawWedgeData_barchart = function(chr, wedge_index) {
    var that = this;
    var wedge_params = that.chromoData._wedge[wedge_index];
    var wedge_data = that.chromoData._ideograms[chr].wedge[wedge_index];
    var value_key = wedge_params._value_key;
    var wedge_obj = d3.select('.ideogram[data-region="'+chr+'"] .wedge[data-ring="'+wedge_index+'"]');

    var histogramArc = function (point) {
        var _inner = wedge_params._innerRadius;
        var start = that.chromoData._ideograms[chr].theta(point.start);
        var end = that.chromoData._ideograms[chr].theta(point.end);
        return d3.svg.arc()
            .innerRadius( _inner)
            .startAngle( start)
            .endAngle(end);
    };

    var hist = wedge_obj.select('g.data')
        .selectAll("path")
        .data(wedge_data,that.chromoData._network.node_key);
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
};

vq.CircVis.prototype._drawWedgeData_histogram = vq.CircVis.prototype._drawWedgeData_barchart;

vq.CircVis.prototype._drawWedgeData_scatterplot = function(chr, wedge_index) {
    var that = this;
    var wedge_params = that.chromoData._wedge[wedge_index];
    var wedge_data = that.chromoData._ideograms[chr].wedge[wedge_index];
    var value_key = wedge_params._value_key;
    var wedge_obj = d3.select('.ideogram[data-region="'+chr+'"] .wedge[data-ring="'+wedge_index+'"]');

    var scatter = wedge_obj.select('g.data')
        .selectAll("path")
        .data(wedge_data,that.chromoData._network.node_key);
    scatter
        .enter().append('svg:path')
        .style('fill',wedge_params._fillStyle)
        .style('stroke',wedge_params._strokeStyle)
        .style('fill-opacity', 1e-6)
        .style('stroke-opacity', 1e-6)
        .attr("transform",function(point) {
            return "rotate(" + ((that.chromoData._ideograms[chr].theta(point.start) * 180 / Math.PI) - 90)+ ")translate(" +
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
};

vq.CircVis.prototype._drawWedgeData_line = function(chr, wedge_index) {
    var that = this;
    var wedge_params = that.chromoData._wedge[wedge_index];
    var wedge_data = _.sortBy(that.chromoData._ideograms[chr].wedge[wedge_index],'start');
    var value_key = wedge_params._value_key;
    var wedge_obj = d3.select('.ideogram[data-region="'+chr+'"] .wedge[data-ring="'+wedge_index+'"]');

    var line = d3.svg.line.radial()
            .interpolate('basis')
            .tension(0.8)
            .radius(function(point) { return wedge_params._thresholded_value_to_radius(point[value_key]);})
            .angle(function(point) { return that.chromoData._ideograms[chr].theta(point.start);});

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
};

vq.CircVis.prototype._drawWedgeData_band = function(chr, wedge_index) {
    var that = this;
    var wedge_params = that.chromoData._wedge[wedge_index];
    var wedge_data = that.chromoData._ideograms[chr].wedge[wedge_index];
    var value_key = wedge_params._value_key;

    var wedge_obj = d3.select('.ideogram[data-region="'+chr+'"] .wedge[data-ring="'+wedge_index+'"]');
    var band = wedge_obj.select('g.data')
        .selectAll("path")
        .data(wedge_data,that.chromoData._network.node_key);
    band
        .enter().append('svg:path')
        .style('fill',wedge_params._fillStyle)
        .style('stroke',wedge_params._strokeStyle)
        .style('fill-opacity', 1e-6)
        .style('stroke-opacity', 1e-6)
        .attr('d',d3.svg.arc()
        .innerRadius( wedge_params._innerRadius)
        .outerRadius( wedge_params._outerPlotRadius)
        .startAngle(function(point) { return that.chromoData._ideograms[chr].theta(point.start);})
        .endAngle(function(point) { return that.chromoData._ideograms[chr].theta(point.end);})
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
};

vq.CircVis.prototype._drawWedgeData_glyph = function(chr, wedge_index) {

    var that = this;
    var wedge_params = that.chromoData._wedge[wedge_index];
    var wedge_data = that.chromoData._ideograms[chr].wedge[wedge_index];
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
            return "rotate(" + ((that.chromoData._ideograms[chr].theta(point.start) * 180 / Math.PI) - 90)+ ")translate(" +
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
        .remove();
};

vq.CircVis.prototype._drawWedgeData_tile = function(chr, wedge_index) {
    var that = this;
    var wedge_params = that.chromoData._wedge[wedge_index];
    var wedge_data = that.chromoData._ideograms[chr].wedge[wedge_index];
    var value_key = wedge_params._value_key;
    var wedge_obj = d3.select('.ideogram[data-region="'+chr+'"] .wedge[data-ring="'+wedge_index+'"]');

    var tile = wedge_obj.select('g.data')
        .selectAll("path")
        .data(wedge_data,that.chromoData._network.node_key);
    tile
        .enter().append('svg:path')
        .style('fill',wedge_params._fillStyle)
        .style('stroke',wedge_params._strokeStyle)
        .style('fill-opacity', 1e-6)
                .style('stroke-opacity', 1e-6)
        .attr('d',d3.svg.arc()
        .innerRadius( function(point) { return wedge_params._thresholded_tile_innerRadius(point,wedge_params);})
        .outerRadius( function(point) { return wedge_params._thresholded_tile_outerRadius(point,wedge_params);})
        .startAngle(function(point) { return that.chromoData._ideograms[chr].theta(point.start);})
        .endAngle(function(point) { return that.chromoData._ideograms[chr].theta(point.end);})
    ) .transition()
        
        .duration(800)
        .style('fill-opacity', 1)
        .style('stroke-opacity', 1);

    tile.exit()
        .transition()
        
        .duration(800)
        .style('fill-opacity', 1e-6)
                .style('stroke-opacity', 1e-6)
        .remove();
};

vq.CircVis.prototype._drawWedgeData_karyotype = function(chr, wedge_index) {
    var that = this;
    var wedge_params = that.chromoData._wedge[wedge_index];
    var wedge_data = that.chromoData._ideograms[chr].wedge[wedge_index];
    var value_key = wedge_params._value_key;
    var wedge_obj = d3.select('.ideogram[data-region="'+chr+'"] .wedge[data-ring="'+wedge_index+'"]');
    var karyotype = wedge_obj.select('g.data')
        .selectAll("path")
        .data(wedge_data,that.chromoData._network.node_key);
    karyotype
        .enter().append('svg:path')
        .style('fill',function(point) { return point[value_key];})
        .style('stroke',wedge_params._strokeStyle)
        .style('fill-opacity', 1e-6)
                .style('stroke-opacity', 1e-6)
        .attr('d',d3.svg.arc()
        .innerRadius( wedge_params._innerRadius)
        .outerRadius( wedge_params._outerPlotRadius)
        .startAngle(function(point) { return that.chromoData._ideograms[chr].theta(point.start);})
        .endAngle(function(point) { return that.chromoData._ideograms[chr].theta(point.end);})
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
};

vq.CircVis.prototype._drawWedgeData_heatmap = function(chr, wedge_index) {
    var that = this;
    var wedge_params = that.chromoData._wedge[wedge_index];
    var wedge_data = that.chromoData._ideograms[chr].wedge[wedge_index];
    var value_key = wedge_params._value_key;
    var wedge_obj = d3.select('.ideogram[data-region="'+chr+'"] .wedge[data-ring="'+wedge_index+'"]');

    var generateArcTween = function (point) {
        var _theta = that.chromoData._ideograms[chr].theta(point.start);
        var _end = that.chromoData._ideograms[chr].theta(point.end);
        return d3.svg.arc()
            .innerRadius(function(multiplier) { return wedge_params._innerRadius - (multiplier *4);})
            .outerRadius(function(multiplier) { return wedge_params._outerPlotRadius + (multiplier * 4);})
            .startAngle(function(multiplier) { return _theta -  (multiplier * Math.PI / 360);})
            .endAngle(function(multiplier) {  return _end + (multiplier * Math.PI /  360);});
    };

    var heat = wedge_obj.select('g.data')
        .selectAll("path")
        .data(wedge_data,that.chromoData._network.node_key);
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
        .startAngle(function(point) { return that.chromoData._ideograms[chr].theta(point.start);})
        .endAngle(function(point) { return that.chromoData._ideograms[chr].theta(point.end);})
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

};

vq.CircVis.prototype._draw_axes_ticklabels = function(wedge_index) {
    var that = this;
    var dataObj = that.chromoData;
    var wedge_params = dataObj._wedge[wedge_index];
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

