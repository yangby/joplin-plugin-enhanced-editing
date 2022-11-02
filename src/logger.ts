import { Config } from './config';

export class Logger {
    constructor() {}

    log  (msg: string): void { this._inner_log(msg, console.log  ); }
    trace(msg: string): void { this._inner_log(msg, console.trace); }
    debug(msg: string): void { this._inner_log(msg, console.debug); }
    info (msg: string): void { this._inner_log(msg, console.info ); }
    warn (msg: string): void { this._inner_log(msg, console.warn ); }
    error(msg: string): void { this._inner_log(msg, console.error); }

    private _inner_log(msg: string, callback: any): void {
        const output = `[${Config.pluginId}]: ${msg}`;
        callback(output);
    }
}
