/** @namespace Top-level namespace, vq **/
(function (root, factory) {
   if (typeof exports === 'object' && root.require) {
     module.exports = factory(require("underscore"), require("d3"), require("jquery"), require("vq"));
   } else if (typeof define === "function" && define.amd) {
      // AMD. Register as an anonymous module.
      define(["underscore","d3", "jquery", "vq"], function(_, d3, $, vq) {
        // Use global variables if the locals are undefined.
        return factory(_ || root._, d3 || root.d3, $ || root.$, vq || root.vq);
      });
   } else {
      // RequireJS isn't being used. Assume underscore and d3 are loaded in <script> tags
      factory(_, d3, $, vq);
   }
}(this, function(_, d3, $, vq) {
