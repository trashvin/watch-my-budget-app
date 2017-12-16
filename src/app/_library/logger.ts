import { environment } from "../../environments/environment";
export class Logger {
  private _source: string;
  private _type: string;
  private _function: string;
  private _max_length = 10;
  constructor(a_source?: string, a_type?: string) {
    if (a_source) {
      this.source = a_source;
    } else {
      this.source = "App";
    }
    if (a_type) {
      this.type = a_type;
    } else {
      this.type = "Generic";
    }
  }
  private set source(a_source) {
    this._source = this.fixLength(a_source);
  }
  private set type(a_type) {
    this._type = this.fixLength(a_type);
  }
  private fixLength(data): string {
    const source_length = data.length;
    if (source_length > this._max_length) {
      data = data.substring(0, this._max_length);
    } else {
      const difference = this._max_length - source_length;
      for (let i = 0; i < difference; i += 1) {
        data += " ";
      }
    }
    return data;
  }
  set functionName(a_name: string) {
    this._function = a_name;
  }
  clearFunctionName() {
    this._function = undefined;
  }
  info(message) {
    if (environment.log_level >= 1) {
      if (this._function !== undefined) {
        console.info(
          `%c [${this._type}][${this._source}] ${this
            ._function}() : ${message}`,
          "background: #CBFAC7; color: black"
        );
      } else {
        console.info(
          `%c [${this._type}][${this._source}]: ${message}`,
          "background: #CBFAC7; color: black"
        );
      }
    }
  }
  i(message) {
    this.info(message);
  }
  warn(message) {
    if (environment.log_level >= 1) {
      if (this._function !== undefined) {
        console.warn(
          `[${this._type}][${this._source}] ${this._function}() : ${message}`
        );
      } else {
        console.warn(`[${this._type}][${this._source}]: ${message}`);
      }
    }
  }
  w(message) {
    this.warn(message);
  }
  error(message) {
    if (environment.log_level >= 0) {
      if (this._function !== undefined) {
        console.error(
          `[${this._type}][${this._source}] ${this._function}() : ${message}`
        );
      } else {
        console.error(`[${this._type}][${this._source}]: ${message}`);
      }
    }
  }
  e(message) {
    this.error(message);
  }
  log(message) {
    if (environment.log_level >= 2) {
      if (this._function !== undefined) {
        console.log(
          `[${this._type}][${this._source}] ${this._function}() : ${message}`
        );
      } else {
        console.log(`[${this._type}][${this._source}]: ${message}`);
      }
    }
  }
  l(message) {
    this.log(message);
  }
  raw(message) {
    console.log("Raw Data:", message);
  }
}
