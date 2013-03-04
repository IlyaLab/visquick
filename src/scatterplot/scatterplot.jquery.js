(function($) {
    var methods = {
      init : function( options ) {
          return this.each(function() {
              var $this = $(this);
              var vis = $(this).data("visquick.d3.scatterplot");
              if (!vis) {
                  options.CONTENTS.PLOT.container = $this.get(0);
                  $this.data("visquick.d3.scatterplot", (vis = new vq.ScatterPlot()));
                  vis.draw(options);
              }
          });
      },
      reset_data : function(data_array) {
          return this.each(function() {
              var vis = $(this).data("visquick.d3.scatterplot");
              if (vis) {
                  vis.resetData(data_array);
              }
          });
      },
      enable_zoom : function() {
          return this.each(function() {
              var vis = $(this).data("visquick.d3.scatterplot");
              if (vis) {
                  vis.enableZoom();
              }
          });
      },
      enable_brush : function() {
          return this.each(function() {
              var vis = $(this).data("visquick.d3.scatterplot");
              if (vis) {
                  vis.enableBrush();
              }
          });
      }
    };

    $.fn.scatterplot = function( method ) {
      // Method calling logic
      if ( methods[method] ){
          return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
      }
      else if ( typeof method === 'object' || ! method ) {
          return methods.init.apply( this, arguments );
      }
      else {
          $.error( 'Method ' +  method + ' does not exist on jQuery.scatterplot' );
      }
    };
})(window.jQuery);
