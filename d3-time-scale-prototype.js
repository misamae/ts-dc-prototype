/**
 * Created by meisam on 31/12/2016.
 */
"use strict";
var d3 = require('d3');
var PDate = (function () {
    function PDate(timestamp) {
        this._timestamp = timestamp;
    }
    PDate.prototype.test = function () {
        return this._timestamp;
    };
    return PDate;
}());
var D3ScalePrototype = (function () {
    function D3ScalePrototype() {
        console.log('d3 scale prototype');
        this.test();
    }
    D3ScalePrototype.prototype.test = function () {
        // this is both an object and a function
        var yAxis = d3.scale.linear()
            .domain([0, 59])
            .range([100, 0])
            .nice();
        console.log(yAxis);
        console.log(yAxis.range());
        console.log(yAxis.range([10, 0]));
        console.log(yAxis.range());
        console.log("as function yAxis(0): " + yAxis(0));
        console.log("as function yAxis(10): " + yAxis(10));
        console.log("as function yAxis(5): " + yAxis(5));
        console.log("as function yAxis(100): " + yAxis(100));
        console.log("as function yAxis(-10): " + yAxis(-10));
        console.log("d3 version: " + d3.version);
    };
    return D3ScalePrototype;
}());
exports.D3ScalePrototype = D3ScalePrototype;
var app = new D3ScalePrototype();
//# sourceMappingURL=d3-time-scale-prototype.js.map