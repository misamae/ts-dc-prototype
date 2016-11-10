
import * as d3 from 'd3';
import * as crossfilter from 'crossfilter';
import * as dc from 'dc';

interface GeoCoordinate {
    latitude: number;
    longitude: number;
}

interface DataPoint {
    imei: string;
    timestamp: number;
    geoCoordinate: GeoCoordinate;
    speed: number;
}

interface TransformedDataPoint {
    imei: string;
    timestamp: number;
    geoCoordinate: GeoCoordinate;
    speed: number;
    date: Date;
    dateFormatted: string;
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

/***
 * prototype to do a simple dashboard
 * bar chart points per day => DONE
 * bar chart for imei average speed => DONE
 * line chart per imei and speed => DONE

 * organisation filter
 * Imei filter
 * registration number filter

 * line chart per imei and average moving speed
 */
export class App {

    constructor() {
        d3.json('data/speeds.json', this.callback);
    }

    callback(data: DataPoint[]) {
        let transformedData: TransformedDataPoint[] = data.map(d => {
            let date = new Date(d.timestamp);
            // let dateFormatted = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
            let dateFormatted = `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`;
            let transformed: TransformedDataPoint = {
                imei: d.imei,
                timestamp: d.timestamp,
                geoCoordinate: d.geoCoordinate,
                speed: d.speed,
                date: new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), 0, 0, 0),
                dateFormatted: dateFormatted
            };

            return transformed;
        });

        let ndx = crossfilter(transformedData);

        // dimensions
        let dayDimension = ndx.dimension((d: TransformedDataPoint) => d.date);
        let dayImeiDimension = ndx.dimension((d: TransformedDataPoint) => [d.imei, d.date]);
        let imeiDimension = ndx.dimension((d:TransformedDataPoint) => d.imei);

        let signalsCountGroup = dayDimension.group();
        let speedAverageGroup = imeiDimension.group()
            .reduce((p: GroupKey, v: TransformedDataPoint) => {
                ++p.number;
                p.total += +v.speed;
                p.avg = Math.round(p.total / p.number);
                return p;
            },
                (p: GroupKey, v: TransformedDataPoint) => {
                --p.number;
                p.total -= +v.speed;
                p.avg = (p.number == 0) ? 0 : Math.round(p.total / p.number);
                return p;
            },
                () => { return {number: 0, total: 0, avg: 0};});

        let dailySpeedAverageGroup = dayImeiDimension.group()
            .reduce((p: GroupKey, v: TransformedDataPoint) => {
                ++p.number;
                p.total += +v.speed;
                p.avg = Math.round(p.total / p.number);
                return p;
            }, (p: GroupKey, v: TransformedDataPoint) => {
                --p.number;
                p.total -= +v.speed;
                p.avg = (p.number == 0) ? 0 : Math.round(p.total / p.number);
                return p;
            }, function () {
                return {number: 0, total: 0, avg: 0}
            });

        let minDate = dayDimension.bottom(1)[0].date;
        let maxDate = dayDimension.top(1)[0].date;

        let signalsBar = dc.barChart("#signals-per-day-chart");
        // let speedLineChart = dc.seriesChart("#speed-per-imei");
        let averageSpeedLineChart = dc.seriesChart("#average-speed-per-imei");
        let imeiCountBar = dc.barChart("#imei-counts");

        signalsBar
            .dimension(dayDimension)
            .group(signalsCountGroup)
            .centerBar(false)
            .transitionDuration(500)
            .x(d3.time.scale().domain([minDate, maxDate]))
            .elasticY(true)
            .renderHorizontalGridLines(true)
            .renderVerticalGridLines(true)
            .yAxis()
            .ticks(6);

        averageSpeedLineChart
            .chart(c => dc.lineChart(c))
            .x(d3.time.scale().domain([minDate, maxDate]))
            .brushOn(false)
            .yAxisLabel("Speed km/h")
            .elasticY(true)
            .dimension(dayImeiDimension)
            .group(dailySpeedAverageGroup)
            .mouseZoomable(false)
            .seriesAccessor(d => "imei: " + d.key[0])
            .keyAccessor((d: KeyGroupKey) => d.key[1])
            .valueAccessor((d: KeyGroupKey) => d.value.avg)
        ;

        imeiCountBar
            .dimension(imeiDimension)
            .group(speedAverageGroup)
            .valueAccessor((g: KeyGroupKey) => g.value.avg)
            .transitionDuration(500)
            .x(d3.scale.ordinal())
            .xUnits(dc.units.ordinal)
            .elasticY(true)
            .renderHorizontalGridLines(true)
            .renderVerticalGridLines(true)
            .yAxis()
            .ticks(6);

        dc.renderAll();
    }
}

let app = new App();

