"use strict";
var d3 = require('d3');
var $ = require('jquery');
// import 'moment/locale/fa';
var momentj = require('moment-jalaali');
var D3TimePrototype = (function () {
    function D3TimePrototype() {
        console.log('initialised d3 time prototype');
        var d = new Date();
        // let d = new Date(1478594887000);
        var timestampEl = $('#timestampSample');
        timestampEl.html(d.getTime().toString());
        var dayOfWeekEl = $('#dayOfWeek');
        dayOfWeekEl.html(d3.time.format('%a')(d));
        var dateAndTimeEl = $('#d3DateAndTime');
        dateAndTimeEl.html(d3.time.format('%c')(d));
        var dayOfMonthEl = $('#d3DayOfMonth');
        dayOfMonthEl.html(d3.time.format('%d')(d));
        var weekOfYearEl = $('#d3WeekOfYear');
        weekOfYearEl.html(d3.time.format('%U')(d));
        // d3.time.scale is defined as this one?
        // what does it mean really?
        // Thus, if the specified date is not a round second, the milliseconds format (".%L") is used; otherwise, if the specified date is not a round minute, the seconds format (":%S") is used, and so on. See bl.ocks.org/4149176 for an example.
        var multiFormatter = d3.time.format.multi([
            [".%L", function (d) { return d.getMilliseconds(); }],
            [":%S", function (d) { return d.getSeconds(); }],
            ["%I:%M", function (d) { return d.getMinutes(); }],
            ["%I %p", function (d) { return d.getHours(); }],
            ["%a %d", function (d) { return d.getDay() && d.getDate() != 1; }],
            ["%b %d", function (d) { return d.getDate() != 1; }],
            ["%B", function (d) { return d.getMonth(); }],
            ["%Y", function () { return true; }]
        ]);
        // console.log(multiFormatter(d));
        var months = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
        var days = ["یکشنبه", "دوشنبه", "سه شنبه", "جهارشنبه", "پنحشنبه", "جمعه", "شنبه"];
        console.log(days);
        console.log(months);
        // for(let m of months) {
        //     console.log(m);
        // }
        var newLocale = d3.locale({
            decimal: '.',
            thousands: ',',
            grouping: [3],
            currency: ['ریال', ''],
            dateTime: '',
            date: '',
            months: ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"],
            days: ["یکشنبه", "دوشنبه", "سه شنبه", "جهارشنبه", "پنحشنبه", "جمعه", "شنبه"],
            periods: ['صبح', 'ظهر'],
            shortDays: ["شنبه", "یکشنبه", "دوشنبه", "سه شنبه", "جهارشنبه", "پنحشنبه", "جمعه"],
            shortMonths: ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"],
            time: ''
        });
        // let d1 = new Date(1358, 0, 1, 0, 0);
        var d1 = this.transformDate(d);
        var dayOfWeekLocale = $('#d3DayOfWeekLocale');
        dayOfWeekLocale.html(newLocale.timeFormat('%a')(d1));
        var monthNameLocale = $('#d3MonthNameLocale');
        monthNameLocale.html(newLocale.timeFormat('%B')(d1));
        var dayOfMonthLocale = $('#d3DayOfMonthLocale');
        dayOfMonthLocale.html(newLocale.timeFormat('%d')(d1));
    }
    D3TimePrototype.prototype.transformDate = function (d) {
        var m = momentj(d);
        return new Date(m.jYear(), m.jMonth(), m.jDate(), 0, 0);
    };
    return D3TimePrototype;
}());
exports.D3TimePrototype = D3TimePrototype;
var app = new D3TimePrototype();
//# sourceMappingURL=d3-time-prototype.js.map