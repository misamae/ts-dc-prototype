
import * as d3 from 'd3';
import * as crossfilter from 'crossfilter';
import * as dc from 'dc';
import moment = require('moment-timezone');
import momentj = require('moment-jalaali');


export interface Truck {
    _id: string;
    registrationNumber: string;
    organisation_id: string;
    tracker: MobileTrackerDevice;
    lastLocation: DeviceLocation;
}

export interface DeviceLocation {
    time: number;
    location: GeoCoordinate;
    speed: number;
    bearing: number;
}

export interface MobileTrackerDevice {
    imei: string;
    mobileNumber: string;
    trackerType: string;
}

interface GeoCoordinate {
    latitude: number;
    longitude: number;
}

interface TransformedDataPoint {
    registrationNumber: string;
    lastUpdateTimestamp: number;
    speed: number;
    outdated: boolean;
    outdatedLabel: string;
    moving: boolean;
    movingLabel: string;
}

export interface GPSTrackerCoordinate {
    imei: string;
    timestamp: number;
    geoCoordinate: GeoCoordinate;
    speed: number;
    bearing: number;
}

interface GroupKey {
    number: number;
    total: number;
    avg:  number;
}

interface KeyGroupKey {
    key: any;
    value: GroupKey;
}

interface TransformedGPSTrackerCoordinate {
    imei: string;
    timestamp: number;
    time: Date;
    geoCoordinate: GeoCoordinate;
    speed: number;
    bearing: number;
    irDate: Date;
}

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
export class TrucksApp {

    button = document.querySelector("#redrawButton");

    constructor() {
        this.redraw();
        this.getSpeeds();
        let app = this;

        this.button.addEventListener('click', function (e) {
            app.redraw();

            app.getSpeeds();
        })
    }

    redraw() {
        d3.json('data/trucks.json', this.callback);
    }

    callback(data: Truck[]) {
        let twoHours: number = 5 * 60 * 60 * 1000;

        let f = function (truck: Truck): boolean {
            let current = new Date().getTime();
            let diff = current - truck.lastLocation.time;

            return twoHours < diff;
        };

        let transformedData: TransformedDataPoint[] = data.map(d => {
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

        let ndx = crossfilter(transformedData);

        // dimensions
        let signalDimension = ndx.dimension((d: TransformedDataPoint) => d.outdatedLabel);
        let movingDimension = ndx.dimension((d: TransformedDataPoint) => d.movingLabel);

        let signalDimensionCountGroup = signalDimension.group();
        let movingDimensionGroup = movingDimension.group();

        let signalsPie = dc.pieChart("#signals-pie");
        let movingPie = dc.pieChart("#moving-pie");

        signalsPie
            // .width(768)
            // .height(480)
            .slicesCap(4)
            .innerRadius(0)
            .dimension(signalDimension)
            .group(signalDimensionCountGroup)
            .legend(dc.legend())
            // workaround for #703: not enough data is accessible through .label() to display percentages
            // .on('pretransition', function(chart) {
            //     chart.selectAll('text.pie-slice').text(function(d) {
            //         return d.data.key + ' ' + dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI) * 100) + '%';
            //     })
            // })
        ;

        movingPie
            // .width(768)
            // .height(480)
            .slicesCap(4)
            .innerRadius(0)
            .dimension(movingDimension)
            .group(movingDimensionGroup)
            .legend(dc.legend())
            // workaround for #703: not enough data is accessible through .label() to display percentages
            // .on('pretransition', function(chart) {
            //     chart.selectAll('text.pie-slice').text(function(d) {
            //         return d.data.key + ' ' + dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI) * 100) + '%';
            //     })
            // })
        ;

        dc.renderAll();
    }

    getSpeeds () { d3.json('data/speeds.json', this.drawSpeedChart); }

    drawSpeedChart(data: GPSTrackerCoordinate[]) {
        let locale = d3.locale({
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

        let irLocale = d3.locale({
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

        let transformed: TransformedGPSTrackerCoordinate[] = data.map(d => {
            let dt = new Date(d.timestamp);
            let m = momentj(d);
            let timezone = moment(d).tz('Asia/Tehran');

            let dt1 = new Date(m.jYear(), m.jMonth(), m.jDate(), timezone.hour(), timezone.minutes());

            return {
                imei: d.imei,
                timestamp: d.timestamp,
                time: new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getHours(), dt.getMinutes()),
                geoCoordinate: d.geoCoordinate,
                speed: d.speed,
                bearing: d.bearing,
                irDate: dt1
            };
        });

        let ndx = crossfilter(transformed);
        let timeDimension = ndx.dimension((d: TransformedGPSTrackerCoordinate) => d.time);
        let speedGroup = timeDimension.group()
            .reduce((p: GroupKey, v: GPSTrackerCoordinate) => {
                ++p.number;
                p.total += +v.speed;
                p.avg = Math.round(p.total / p.number);
                return p;
            }, (p: GroupKey, v: GPSTrackerCoordinate) => {
                --p.number;
                p.total -= +v.speed;
                p.avg = (p.number == 0) ? 0 : Math.round(p.total / p.number);
                return p;
            }, function () {
                return { number: 0, total: 0, avg: 0}
            });


        console.log(speedGroup.top(10));

        let minDate = timeDimension.bottom(1)[0].time;
        let maxDate = timeDimension.top(1)[0].time;

        let chart = dc.lineChart('#speed-line');
        let tickFormat = irLocale.timeFormat.multi([
            ["%H:%M", function(d) { return d.getMinutes(); }],
            ["%H:%M", function(d) { return d.getHours(); }],
            ["%a %d", function(d) { return d.getDay() && d.getDate() != 1; }],
            ["%b %d", function(d) { return d.getDate() != 1; }],
            ["%B", function(d) { return d.getMonth(); }],
            ["%Y", function() { return true; }]
        ]);

        // axis.tickFormat(tickFormat);

        var x = d3.time.scale()
            .domain([minDate, maxDate])
            // .range([0, width])
            ;

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
            .valueAccessor((d: KeyGroupKey) => d.value.avg)
        ;

        chart.render();
    }
}

let app = new TrucksApp();


