/**
 * Created by meisam on 31/12/2016.
 */

import * as d3 from 'd3';

class PDate {
    _timestamp: number;

    constructor(timestamp: number) {
        this._timestamp = timestamp;
    }

    test() {
        return this._timestamp;
    }
}

interface Interval {
    (d: Date): Date;

    floor(d: Date): Date;

    round(d: Date): Date;

    ceil(d: Date): Date;

    range(start: Date, stop: Date, step?: number): Date[];

    offset(date: Date, step: number): Date;
}

export class D3ScalePrototype {
    constructor() {
        console.log('d3 scale prototype');

        this.test();
    }

    test() {

        // this is both an object and a function
        let yAxis = d3.scale.linear()
            .domain([0, 59])
            .range([100, 0])
            .nice();

        console.log(yAxis);

        console.log(yAxis.range());
        console.log(yAxis.range([10, 0]));
        console.log(yAxis.range());

        console.log(`as function yAxis(0): ${yAxis(0)}`);
        console.log(`as function yAxis(10): ${yAxis(10)}`);
        console.log(`as function yAxis(5): ${yAxis(5)}`);
        console.log(`as function yAxis(100): ${yAxis(100)}`);
        console.log(`as function yAxis(-10): ${yAxis(-10)}`);

        console.log(`d3 version: ${d3.version}`);

    }
}

let app = new D3ScalePrototype();
