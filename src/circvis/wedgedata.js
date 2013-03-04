

/**
 *
 * @class Internal data model for ring plots.
 *
 * @param data {JSON Object} - Configures a single ring plot.
 * @extends vq.models.VisData
 */
vq.models.CircVisData.WedgeData = function(data) {

    vq.models.VisData.call(this, {CONTENTS:data});

    this.setDataModel();
    this._build_data(this.getContents())

};

vq.models.CircVisData.WedgeData.prototype = vq.extend(vq.models.VisData);

vq.models.CircVisData.WedgeData.prototype.setDataModel = function() {
    this._dataModel = [
        {label : '_data', id: 'DATA.data_array', defaultValue : [   ]},
        {label : '_value_key', id: 'DATA.value_key', defaultValue : 'value',cast: String },  //value to plot
        {label : '_hash', id: 'DATA.hash', optional: true ,cast: vq.utils.VisUtils.wrapProperty }, //unique identifier
        {label : 'listener', id: 'OPTIONS.listener', defaultValue :  function(a, b) {
        } },
        {label : '_plot_type', id: 'PLOT.type', defaultValue : 'histogram' },
        {label : '_plot_height', id: 'PLOT.height', cast: Number, defaultValue : 100 },
        {label : '_fillStyle', id: 'OPTIONS.fill_style', cast : vq.utils.VisUtils.wrapProperty, defaultValue : function(d) {
            return 'red';
        } },
        {label : '_strokeStyle', id: 'OPTIONS.stroke_style', cast : vq.utils.VisUtils.wrapProperty, defaultValue : function(d) {
            return 'black'; } },
        {label : '_lineWidth', id: 'OPTIONS.line_width', cast : Number, defaultValue : 0.5 },
        {label : '_shape', id: 'OPTIONS.shape', cast : vq.utils.VisUtils.wrapProperty, defaultValue : function(d) {
            return 'circle';
        } },
        {label : '_radius', id: 'OPTIONS.radius', cast : vq.utils.VisUtils.wrapProperty, defaultValue : function(d) {
            return 2;
        } },
        {label : '_outer_padding', id: 'OPTIONS.outer_padding', cast : Number, defaultValue : 1 },
        {label : '_min_plotValue', id: 'OPTIONS.min_value',  cast : Number , optional : true },
        {label : '_max_plotValue', id: 'OPTIONS.max_value',  cast : Number , optional : true },
        {label : '_base_plotValue', id: 'OPTIONS.base_value', cast: Number, optional : true },
        {label : '_legend_label', id: 'OPTIONS.legend_label', cast: String, defaultValue : '' },
        {label : '_legend_desc', id: 'OPTIONS.legend_description', cast: String, defaultValue : '' },
        {label : '_draw_axes', id: 'OPTIONS.draw_axes', cast: Boolean, defaultValue : true },
        {label : '_draw_axes', id: 'OPTIONS.show_tooltips', cast: Boolean, defaultValue : true },
        {label : '_tooltipFormat', id: 'OPTIONS.tooltipFormat', cast :vq.utils.VisUtils.wrapProperty,
            defaultValue : function(c, d) {
                return "Chr " + d + "\nStart: " + c.start + "\nEnd: " + c.end;
            }   },
        {label : '_tooltipItems', id: 'OPTIONS.tooltip_items',  defaultValue : {Chr:'chr',Start:'start',End:'end',Value:'value'} },
        {label : '_tooltipLinks', id: 'OPTIONS.tooltip_links',  defaultValue : {} },
        {label : '_tile.padding', id: 'OPTIONS.tile_padding', cast: Number, defaultValue : 5 },
        {label : '_tile.overlap_distance', id: 'OPTIONS.tile_overlap_distance', cast: Number, defaultValue : 0.1 },
        {label : '_tile.height', id: 'OPTIONS.tile_height', cast: Number, defaultValue : 5 },
        {label : '_tile.show_all_tiles', id: 'OPTIONS.tile_show_all_tiles', cast: Boolean, defaultValue : false }
    ];
};

vq.models.CircVisData.WedgeData.prototype._build_data = function(data_struct) {
    this._processData(data_struct)
};
