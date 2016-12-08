/**
 * Created by meisam on 26/11/2016.
 */
"use strict";
var $ = require('jquery');
var moment = require('moment');
// import 'moment/locale/fa';
var momentj = require('moment-jalaali');
var DatePrototype = (function () {
    function DatePrototype() {
        console.log(moment);
        console.log('started?');
        var timestampEl = $('#timestampSample');
        var el = $('#simpleDate');
        var isoElement = $('#isoDate');
        var localElement = $('#localeDate');
        var irDate = $('#irDate');
        var enGBDate = $('#enGBDate');
        var momentDateEl = $('#momentDate');
        var momentJalaaliEl = $('#momentJallali');
        var date = new Date(1478594887000);
        // let date = new Date();
        timestampEl.html(date.getTime().toString());
        el.html(date.toDateString());
        isoElement.html(date.toISOString());
        localElement.html(date.toLocaleDateString());
        enGBDate.html(date.toLocaleDateString('en-GB'));
        irDate.html(date.toLocaleDateString('fa-IR') + date.toLocaleTimeString('fa-IR'));
        momentDateEl.html(moment(date).format('LLLL'));
        momentJalaaliEl.html(momentj(date).format('jYYYY/jM/jD'));
        //Type: language
        // Subtag: ira
        // Description: Iranian languages
        // Added: 2005-10-16
        // Scope: collection
        // %%
        //<territoryCodes type="IR" numeric="364" alpha3="IRN"/>
        //<currencyCodes type="IRR" numeric="364"/>
        // irDate.html(date.toLocaleDateString('persian'));
        // console.log(new Intl.DateTimeFormat('fa-IR').resolvedOptions());
        // let m = momentj('1360/5/26', 'jYYYY/jM/jD');
        // let m = momentj('2016/12/7', 'YYYY/M/D');
        var m = momentj(date);
        console.log(m.format('jYYYY/jM/jD [is] YYYY/M/D')); // 1360/5/26 is 1981/8/17
        console.log(m);
        console.log("year " + m.jYear());
        // m.jYear() // 1360
        // m.jMonth() // 4
        // m.jDate() // 26
        // m.jDayOfYear() // 150
        // m.jWeek() // 22
        // m.jWeekYear() // 1360
        //
        // m.add(1, 'jYear')
        // m.add(2, 'jMonth')
        // m.add(3, 'day')
        // m.format('jYYYY/jM/jD') // 1361/7/29
        //
        // m.jMonth(11)
        // m.startOf('jMonth')
        // m.format('jYYYY/jM/jD') // 1361/12/1
        //
        // m.jYear(1392)
        // m.startOf('jYear')
        // m.format('jYYYY/jM/jD') // 1392/1/1
        //
        // m.subtract(1, 'jYear')
        // m.subtract(1, 'jMonth')
        // m.format('jYYYY/jM/jD') // 1390/12/1
        //
        // moment('1391/12/30', 'jYYYY/jMM/jDD').isValid() // true (leap year)
        // moment('1392/12/30', 'jYYYY/jMM/jDD').isValid() // false (common year)
        // moment.jIsLeapYear(1391) // true
    }
    return DatePrototype;
}());
exports.DatePrototype = DatePrototype;
var app = new DatePrototype();
//# sourceMappingURL=date-prototype.js.map