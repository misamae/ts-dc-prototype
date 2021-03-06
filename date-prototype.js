/**
 * Created by meisam on 26/11/2016.
 */
"use strict";
var $ = require('jquery');
// import * as moment from 'moment';
// import * as tz from 'moment-timezone';
var moment = require('moment-timezone');
var momentj = require('moment-jalaali');
// import tz = require('moment-timezone');
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
        // let date = new Date(1478594887000);
        var date = new Date();
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
        var m = momentj(date).tz('Asia/Tehran');
        console.log(m.format('jYYYY/jM/jD [is] YYYY/M/D')); // 1360/5/26 is 1981/8/17
        console.log(m);
        console.log("year " + m.jYear());
        console.log(date.toLocaleDateString('fa-IR'));
        this.transformDate(date);
        console.log(moment(date).tz("America/Los_Angeles").format());
        console.log(moment(date).tz("Asia/Tehran").format());
        var momentTimezoneEl = $('#momentTimezone');
        momentTimezoneEl.html(moment(date).tz("Asia/Tehran").format());
        console.log('last line');
    }
    DatePrototype.prototype.transformDate = function (d) {
        var dt1String = d.toLocaleDateString('fa-IR');
        console.log(dt1String);
        var yearString = dt1String.slice(0, 4);
        console.log(yearString);
        console.log(+"1395");
        // console.log(momentj.toJalaali(d));
        // let jun = moment("2014-06-01T12:00:00Z");
        // console.log(jun.tz('America/Los_Angeles').format('ha z'));  // 5am PDT
        // dec.tz('America/Los_Angeles').format('ha z');  // 4am PST
        //
        // jun.tz('America/New_York').format('ha z');     // 8am EDT
        // dec.tz('America/New_York').format('ha z');     // 7am EST
    };
    return DatePrototype;
}());
exports.DatePrototype = DatePrototype;
var app = new DatePrototype();
//# sourceMappingURL=date-prototype.js.map