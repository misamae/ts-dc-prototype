"use strict";
var d3 = require('d3');
var crossfilter = require('crossfilter');
var dc = require('dc');
/***
 * prototype to do a simple dashboard
 * bar chart points per day => DONE
 * bar chart for imei average speed => DONE
 * line chart per imei and speed => DONE


 * line chart per imei and average moving speed

 * organisation filter
 * Imei filter
 * registration number filter

 */
var TrucksApp = (function () {
    function TrucksApp() {
        this.button = document.querySelector("#redrawButton");
        this.redraw();
        this.getSpeeds();
        var app = this;
        this.button.addEventListener('click', function (e) {
            app.redraw();
            app.getSpeeds();
        });
    }
    TrucksApp.prototype.redraw = function () {
        d3.json('data/trucks.json', this.callback);
    };
    TrucksApp.prototype.callback = function (data) {
        var twoHours = 5 * 60 * 60 * 1000;
        var f = function (truck) {
            var current = new Date().getTime();
            var diff = current - truck.lastLocation.time;
            return twoHours < diff;
        };
        var transformedData = data.map(function (d) {
            return {
                registrationNumber: d.registrationNumber,
                lastUpdateTimestamp: d.lastLocation.time,
                speed: d.lastLocation.speed,
                outdated: f(d),
                outdatedLabel: f(d) ? 'no signal' : 'active',
                moving: d.lastLocation.speed > 0,
                movingLabel: d.lastLocation.speed > 0 ? 'moving' : 'stopped'
            };
        });
        // console.log(transformedData);
        var ndx = crossfilter(transformedData);
        // dimensions
        var signalDimension = ndx.dimension(function (d) { return d.outdatedLabel; });
        var movingDimension = ndx.dimension(function (d) { return d.movingLabel; });
        var signalDimensionCountGroup = signalDimension.group();
        var movingDimensionGroup = movingDimension.group();
        var signalsPie = dc.pieChart("#signals-pie");
        var movingPie = dc.pieChart("#moving-pie");
        signalsPie
            .slicesCap(4)
            .innerRadius(0)
            .dimension(signalDimension)
            .group(signalDimensionCountGroup)
            .legend(dc.legend());
        movingPie
            .slicesCap(4)
            .innerRadius(0)
            .dimension(movingDimension)
            .group(movingDimensionGroup)
            .legend(dc.legend());
        dc.renderAll();
    };
    TrucksApp.prototype.getSpeeds = function () { d3.json('data/speeds.json', this.drawSpeedChart); };
    TrucksApp.prototype.drawSpeedChart = function (data) {
        var locale = d3.locale({
            "decimal": ",",
            "thousands": "\u00A0",
            "grouping": [3],
            "currency": ["", " руб."],
            "dateTime": "%A, %e %B %Y г. %X",
            "date": "%d.%m.%Y",
            "time": "%H:%M:%S",
            "periods": ["AM", "PM"],
            "days": ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"],
            "shortDays": ["вс", "пн", "вт", "ср", "чт", "пт", "сб"],
            "months": ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"],
            "shortMonths": ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"]
        });
        var irLocale = d3.locale({
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
        var transformed = data.map(function (d) {
            var dt = new Date(d.timestamp);
            // let m = momentj(d);
            // let dt1 = new Date(m.jYear(), m.jMonth(), m.jDate(), 0, 0);
            return {
                imei: d.imei,
                timestamp: d.timestamp,
                time: new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getHours(), dt.getMinutes()),
                geoCoordinate: d.geoCoordinate,
                speed: d.speed,
                bearing: d.bearing,
                irDate: dt
            };
        });
        var ndx = crossfilter(transformed);
        var timeDimension = ndx.dimension(function (d) { return d.time; });
        var speedGroup = timeDimension.group()
            .reduce(function (p, v) {
            ++p.number;
            p.total += +v.speed;
            p.avg = Math.round(p.total / p.number);
            return p;
        }, function (p, v) {
            --p.number;
            p.total -= +v.speed;
            p.avg = (p.number == 0) ? 0 : Math.round(p.total / p.number);
            return p;
        }, function () {
            return { number: 0, total: 0, avg: 0 };
        });
        console.log(speedGroup.top(10));
        var minDate = timeDimension.bottom(1)[0].time;
        var maxDate = timeDimension.top(1)[0].time;
        var chart = dc.lineChart('#speed-line');
        var tickFormat = irLocale.timeFormat.multi([
            ["%H:%M", function (d) { return d.getMinutes(); }],
            ["%H:%M", function (d) { return d.getHours(); }],
            ["%a %d", function (d) { return d.getDay() && d.getDate() != 1; }],
            ["%b %d", function (d) { return d.getDate() != 1; }],
            ["%B", function (d) { return d.getMonth(); }],
            ["%Y", function () { return true; }]
        ]);
        // axis.tickFormat(tickFormat);
        var x = d3.time.scale()
            .domain([minDate, maxDate]);
        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .ticks(5)
            .tickPadding(8)
            .tickFormat(tickFormat);
        // .tickFormat(irLocale.timeFormat("%B"));
        // .tickFormat(d3.time.format("%B"));
        chart
            .x(d3.time.scale().domain([minDate, maxDate]))
            .interpolate('step-before')
            .renderArea(true)
            .brushOn(false)
            .renderDataPoints(true)
            .clipPadding(10)
            .yAxisLabel("This is the Y Axis!")
            .xAxis(xAxis)
            .dimension(timeDimension)
            .group(speedGroup)
            .valueAccessor(function (d) { return d.value.avg; });
        chart.render();
    };
    return TrucksApp;
}());
exports.TrucksApp = TrucksApp;
var app = new TrucksApp();
//# sourceMappingURL=trucks.js.map