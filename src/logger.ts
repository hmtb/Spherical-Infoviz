import * as fs from "fs";

export class Logger {
    private _logFile: number;

    constructor(filename: string, overwrite: boolean = false) {
        if(fs.existsSync(filename) && !overwrite) {
            throw new Error(`attempting to overwrite existing log file '${filename}', abort.`);
        }
        var logFile = fs.openSync(filename, "w");
        this._logFile = logFile;
    }

    public append(timestamp: number, type: string, data: Object) {
        fs.writeSync(this._logFile, timestamp.toFixed(3) + "\t" + type + "\t" + JSON.stringify(data) + "\n");
    }
}