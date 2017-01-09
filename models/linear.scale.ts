/**
 * Created by meisam on 05/01/2017.
 */

export interface Linear<Range, Output> {
    (x: number): Output;
    invert(y: number): number;

    domainNumbers(): number[];
    domain(numbers: number[]): Linear<Range, Output>;

    // range(): Range[];
    range(values: Range[]): Linear<Range, Output>;

    rangeRound(values: number[]): Linear<number, number>;

    interpolate(): (a: Range, b: Range) => (t: number) => Output;
    interpolate(factory: (a: Range, b: Range) => (t: number) => Output): Linear<Range, Output>;

    clamp(): boolean;
    clamp(clamp: boolean): Linear<Range, Output>;

    nice(count?: number): Linear<Range, Output>;

    ticks(count?: number): number[];

    tickFormat(count?: number, format?: string): (n: number) => string;

    copy(): Linear<Range, Output>;
}

