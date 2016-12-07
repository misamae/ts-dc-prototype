
import * as d3 from 'd3';
import * as $ from 'jquery';

export class D3TimePrototype {
    constructor() {
        console.log('initialised d3 time prototype');
        let d = new Date();

        let timestampEl = $('#timestampSample');
        timestampEl.html(d.getTime().toString());

        let dayOfWeekEl = $('#dayOfWeek');
        dayOfWeekEl.html(d3.time.format('%a')(d));

        let dateAndTimeEl = $('#d3DateAndTime');
        dateAndTimeEl.html(d3.time.format('%c')(d));

        let dayOfMonthEl = $('#d3DayOfMonth');
        dayOfMonthEl.html(d3.time.format('%d')(d));

        let weekOfYearEl = $('#d3WeekOfYear');
        weekOfYearEl.html(d3.time.format('%U')(d));

        // d3.time.scale is defined as this one?
        // what does it mean really?
        // Thus, if the specified date is not a round second, the milliseconds format (".%L") is used; otherwise, if the specified date is not a round minute, the seconds format (":%S") is used, and so on. See bl.ocks.org/4149176 for an example.
        let multiFormatter = d3.time.format.multi([
            [".%L", function(d) { return d.getMilliseconds(); }],
            [":%S", function(d) { return d.getSeconds(); }],
            ["%I:%M", function(d) { return d.getMinutes(); }],
            ["%I %p", function(d) { return d.getHours(); }],
            ["%a %d", function(d) { return d.getDay() && d.getDate() != 1; }],
            ["%b %d", function(d) { return d.getDate() != 1; }],
            ["%B", function(d) { return d.getMonth(); }],
            ["%Y", function() { return true; }]
        ]);


        console.log(multiFormatter(d));
    }
}

let app = new D3TimePrototype();