
export default class ProgressBar {

    private _mul: number;

    private readonly BAR_LENGTH: number = 50;

    constructor(private _stream: typeof process.stdout, private _max: number, private _min: number = 0) {
        this._max -= this._min;
        this._mul = 100 / this._max;
    }

    public render(value: number, others: string[] = []) {
        const perc = Math.floor((value - this._min) * this._mul);
        const eq   = this.BAR_LENGTH * perc / 100;

        this._stream.clearLine(0);
        this._stream.cursorTo(0);
        this._stream.write(`=> [${'='.repeat(eq) + ' '.repeat(this.BAR_LENGTH-eq)}] ${perc}% | ${others.join('|')}`);
    }

}









