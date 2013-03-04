/** @class The abstract base class for the VisQuick tools.  It provides the base properties.
 * @extends vq.Base
 */
vq.Vis = function() {
   vq.Base.call(this);
};
/**
 *
 *
 * @type number
 * @name vertical_padding
 *
 * @type number
 * @name horizontal_padding
 *
 * @type number
 * @name width
 *
 * @type number
 * @name height
 *
 * @type string/HTMLElement
 * @name container
 *
 */
vq.Vis.prototype = vq.extend(vq.Base);

vq.Vis.prototype
    .property("vertical_padding",Number)
    .property("horizontal_padding",Number)
    .property("width", Number)
    .property("height", Number)
    .property("container",  function(c) {
            return (vq.utils.VisUtils.divify(c)); // assume that c is the passed-in element
      });

