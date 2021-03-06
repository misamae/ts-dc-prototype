
import * as d3 from 'd3';
import * as $ from 'jquery';

import * as moment from 'moment-timezone';
// import 'moment/locale/fa';

import momentj = require('moment-jalaali');


export class D3TimePrototype {
    constructor() {
        console.log('initialised d3 time prototype');
        let d = new Date();
        // let d = new Date(1478594887000);

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

        // console.log(multiFormatter(d));

        let months = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
        let days = ["یکشنبه", "دوشنبه", "سه شنبه", "جهارشنبه", "پنحشنبه", "جمعه", "شنبه"];

        console.log(days);
        console.log(months);

        // for(let m of months) {
        //     console.log(m);
        // }

        let newLocale = d3.locale({
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
        let d1 = this.transformDate(d);

        let dayOfWeekLocale = $('#d3DayOfWeekLocale');
        dayOfWeekLocale.html(newLocale.timeFormat('%a')(d1));

        let monthNameLocale = $('#d3MonthNameLocale');
        monthNameLocale.html(newLocale.timeFormat('%B')(d1));

        let dayOfMonthLocale = $('#d3DayOfMonthLocale');
        dayOfMonthLocale.html(newLocale.timeFormat('%d')(d1));

        let hourWithTimezone = $('#d3HourWithTimezone');
        hourWithTimezone.html(newLocale.timeFormat('%H')(d1));

        let minuteWithTimezone = $('#d3MinuteWithTimezone');
        minuteWithTimezone.html(newLocale.timeFormat('%M')(d1));

    }

    transformDate(d: Date) {
        let m = momentj(d);
        let timezone = moment(d).tz('Asia/Tehran');
        console.log(timezone.format());
        console.log(timezone.hour());
        console.log(timezone.minute());
        console.log(timezone.minutes());
        return new Date(m.jYear(), m.jMonth(), m.jDate(), timezone.hour(), timezone.minutes());
    }
}

let app = new D3TimePrototype();