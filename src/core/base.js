/** @namespace Top-level namespace, vq **/

if ( _ === undefined ||  _.VERSION === undefined) { console.error("Underscore.js not detected.  Please check that is being loaded.");}
if (d3 === undefined) { console.error("d3.js not detected.  Please check it is being loaded.")}
vq = {};

vq.VERSION = '2.0';

/**
 * @class Abstract base class for VisQuick.  Handles properties of the Visualizations and the data models. *
*/
vq.Base = function() {
      this.$properties = {};
};

vq.Base.prototype.properties = {};
vq.Base.cast = {};

vq.Base.prototype.extend =  function(proto) {
  return this;
};

/** @private **/
vq.Base.prototype.property = function(name, cast) {
  if (!this.hasOwnProperty("properties")) {
    this.properties = vq.extend(this.properties);
  }
  this.properties[name] = true;

  /*
   * Define the setter-getter globally, since the default behavior should be the
   * same for all properties, and since the Protovis inheritance chain is
   * independent of the JavaScript inheritance chain. For example, anchors
   * define a "name" property that is evaluated on derived marks, even though
   * those marks don't normally have a name.
   */
    /** @private **/
  vq.Base.prototype.propertyMethod(name, vq.Base.cast[name] = cast);
  return this;
};


/** @private Sets the value of the property <i>name</i> to <i>v</i>. */
vq.Base.prototype.propertyValue = function(name, v) {
  var properties = this.$properties;
  properties[name] = v;
  return v;
};

/**
 * @private Defines a setter-getter for the specified property.
 *
 * <p>If a cast function has been assigned to the specified property name, the
 * property function is wrapped by the cast function, or, if a constant is
 * specified, the constant is immediately cast. Note, however, that if the
 * property value is null, the cast function is not invoked.
 *
 * @param {string} name the property name.
 * @param {function} [cast] the cast function for this property.
 */
vq.Base.prototype.propertyMethod = function(name, cast) {
  if (!cast) cast = vq.Base.cast[name];
  this[name] = function(v) {

      /* If arguments are specified, set the property value. */
      if (arguments.length) {
        var type = (typeof v == "function");
        this.propertyValue(name, (type & 1 && cast) ? function() {
            var x = v.apply(this, arguments);
            return (x != null) ? cast(x) : null;
          } : (((v != null) && cast) ? cast(v) : v)).type = type;
        return this;
      }

      return (this.$properties[name] != null) ? (typeof this.$properties[name] == "function") & 1 ?
             this.$properties[name].apply(this) :
              this.$properties[name] : null;
    };
};


vq.extend = function(f) {
  function g() {}
  g.prototype = f.prototype || f;
  return new g();
};
