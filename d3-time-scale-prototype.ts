/**
 * Created by meisam on 31/12/2016.
 */

import * as d3 from 'd3';

import * as moment from 'moment';
import { Linear } from './models/linear.scale';

import momentJ = require('moment-jalaali');

function d3_scaleExtent(domain) {
    let start = domain[0];
    let stop = domain[domain.length - 1];

    return start < stop ? [start, stop] : [stop, start];
}

export function getLinearScale(): Linear<number, number> {

    let linear = d3.scale.linear();

    let x = <Linear<number, number>> function(x1: number) {
        return linear(x1);
    };

    x.invert = function (x1: number) {
        console.log(`invert is called`);
        return linear.invert(x1);
        // return momentJ(linear.invert(x1)).format('jYYYY/jM/jD');
    };

    x.domainNumbers = function () {
        return linear.domain();
    };

    x.domain = function (numbers: number[]) {
        console.log(`domain is called`);
        if(!arguments.length) return linear.domain();
        linear.domain(numbers);
        return x;
    };

    let d3_time_scaleLocalFormat = d3.time.format.multi([
        [".%L", function(d) { return d.getMilliseconds(); }],
        [":%S", function(d) { return d.getSeconds(); }],
        ["%I:%M", function(d) { return d.getMinutes(); }],
        ["%I %p", function(d) { return d.getHours(); }],
        ["%a %jD", function(d) { return d.getDay() && d.getDate() != 1; }],
        ["%b %d", function(d) { return d.getDate() != 1; }],
        ["%B", function(d) { return d.getMonth(); }],
        ["%jYYYY", d => true]
    ]);

    x.tickFormat = function (count: number, format?: string) {
        console.log(`tickformat, count: ${count}, format: ${format}`);
        return function (number) {
            let ret = momentJ(number).format('jYYYY/jM/jD HH:mm');
            console.log(ret);
            return ret;
        };
    };

    let d3_time_scaleSteps = [
        1e3,    // 1-second
        5e3,    // 5-second
        15e3,   // 15-second
        3e4,    // 30-second
        6e4,    // 1-minute
        3e5,    // 5-minute
        9e5,    // 15-minute
        18e5,   // 30-minute
        36e5,   // 1-hour
        108e5,  // 3-hour
        216e5,  // 6-hour
        432e5,  // 12-hour
        864e5,  // 1-day
        1728e5, // 2-day
        6048e5, // 1-week
        2592e6, // 1-month
        7776e6, // 3-month
        31536e6 // 1-year
    ];

    let d3_time_scaleLocalMethods = [
        [d3.time.second, 1],
        [d3.time.second, 5],
        [d3.time.second, 15],
        [d3.time.second, 30],
        [d3.time.minute, 1],
        [d3.time.minute, 5],
        [d3.time.minute, 15],
        [d3.time.minute, 30],
        [d3.time.hour, 1],
        [d3.time.hour, 3],
        [d3.time.hour, 6],
        [d3.time.hour, 12],
        [d3.time.day, 1],
        [d3.time.day, 2],
        [d3.time.week, 1],
        [d3.time.month, 1],
        [d3.time.month, 3],
        [d3.time.year, 1]
    ];

    function d3_time_scaleDate(t) { return new Date(t); }

    function d3_identity(d) { return d; }

    let d3_time_scaleMilliseconds = {
        range: function(start, stop, step) { return d3.range(Math.ceil(start / step) * step, +stop, step).map(d3_time_scaleDate); },
        floor: d3_identity,
        ceil: d3_identity
    };

    function d3_scale_linearTickRange(domain, m) {
        if (m == null) m = 10;

        let extent = d3_scaleExtent(domain);
        let span = extent[1] - extent[0];
        let step = Math.pow(10, Math.floor(Math.log(span / m) / Math.LN10));
        let err = m / span * step;

        // Filter ticks to get closer to the desired count.
        if (err <= 0.15) step *= 10;
        else if (err <= 0.35) step *= 5;
        else if (err <= 0.75) step *= 2;

        // Round start and stop values to step interval.
        extent[0] = Math.ceil(extent[0] / step) * step;
        extent[1] = Math.floor(extent[1] / step) * step + step * 0.5; // inclusive
        extent[2] = step;
        return extent;
    }

    let tickMethod = function(extent, count) {
        let span = extent[1] - extent[0];
        let target = span / count;
        let i = d3.bisect(d3_time_scaleSteps, target);

        return i == d3_time_scaleSteps.length ?
            [d3.time.year, d3_scale_linearTickRange(extent.map(function(d) { return d / 31536e6; }), count)[2]] // yearly???
            : !i ? [d3_time_scaleMilliseconds, d3_scale_linearTickRange(extent, count)[2]] // milliseconds???
                : d3_time_scaleLocalMethods[target / d3_time_scaleSteps[i - 1] < d3_time_scaleSteps[i] / target ? i - 1 : i];
    };

    x.ticks = function(count?: number) {
        let extent = d3_scaleExtent(x.domainNumbers());
        console.log(`extent: ${extent}`);
        let method = count ? tickMethod(extent, count): tickMethod(extent, 10);
        let interval = 0;
        let skip = 0;

        if (method) {
            interval = method[0];
            skip = method[1];
            // console.log(`method: ${method}`);
        }

        console.log(`begining of range:  ${extent[0]}, end of range: ${d3_time_scaleDate(+extent[1] + 1)}`);

        return interval.range(extent[0], d3_time_scaleDate(+extent[1] + 1), skip < 1 ? 1 : skip); // inclusive upper bound
    };

    x.range = function (values: number[]) {
        console.log(`range is called`);
        if(!arguments.length) return linear.range();
        return linear.range(values);
    };

    x.copy = function () {
        console.log('copy is called?');
        // return getLinearScale();
        return x;
    };

    return x;
}

export class D3ScalePrototype {
    constructor() {
        console.log('d3 scale prototype');

        // let end = moment().startOf('day').unix();
        // let start = moment().subtract(7, 'day').startOf('day').unix();
        // let middle = moment().subtract(4, 'day').startOf('day').unix();

        // let end = moment().unix();
        // let start = moment().subtract(7, 'second').unix();
        // let middle = moment().subtract(4, 'second').unix();

        // let end = new Date().getTime();
        let end = moment().unix() * 1000;
        let start = moment(end).subtract(7, 'year').unix() * 1000;
        let middle = moment(end).subtract(4, 'year').unix() * 1000;

        let scaler = getLinearScale();

        scaler.domain([start, end]);
        console.log(`start: ${start}, middle: ${middle}, end: ${end}`);
        console.log(`start: ${new Date(start)}, middle: ${new Date(middle)}, end: ${new Date(end)}`);
        console.log(`scaled start: ${scaler(start)}, middle: ${scaler(middle)}, end: ${scaler(end)}`);

        let startScaled = scaler(start);
        let endScaled = scaler(end);
        let middleScaled = scaler(middle);

        console.log(`inverted start: ${scaler.invert(startScaled)}, end: ${scaler.invert(endScaled)}, middle: ${scaler.invert(middleScaled)}`);

        console.log(scaler.domainNumbers());
        console.log(d3_scaleExtent(scaler.domainNumbers()));

        let ticks = scaler.ticks(20);
        console.log(`ticks length: ${ticks.length}`);

        console.log('ticks');
    }

    testScalers() {
        // this is both an object and a function
        // let yAxis = d3.scale.linear()
        //     .domain([0, 59])
        //     .range([100, 0])
        //     .nice();
        //
        // console.log(yAxis);
        //
        // console.log(yAxis.range());
        // console.log(yAxis.range([10, 0]));
        // console.log(yAxis.range());
        //
        // console.log(`as function yAxis(0): ${yAxis(0)}`);
        // console.log(`as function yAxis(10): ${yAxis(10)}`);
        // console.log(`as function yAxis(5): ${yAxis(5)}`);
        // console.log(`as function yAxis(100): ${yAxis(100)}`);
        // console.log(`as function yAxis(-10): ${yAxis(-10)}`);
        //
        // console.log(`d3 version: ${d3.version}`);
    }

}

new D3ScalePrototype();
