import { NgxLoggerLevel } from "ngx-logger";

export const environment = {
  production: true,
  apiUrl: 'http://34.100.166.202/api',
  logLevel: NgxLoggerLevel.DEBUG,
  serverLogLevel: NgxLoggerLevel.ERROR
};
