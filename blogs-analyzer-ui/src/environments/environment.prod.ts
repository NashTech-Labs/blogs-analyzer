import { NgxLoggerLevel } from "ngx-logger";

export const environment = {
  production: true,
  apiUrl: 'http://35.244.36.216/api',
  logLevel: NgxLoggerLevel.DEBUG,
  serverLogLevel: NgxLoggerLevel.ERROR
};
