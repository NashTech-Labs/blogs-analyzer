module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine', '@angular-devkit/build-angular'],
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-jasmine-html-reporter'),
            require('karma-coverage'),
            require('@angular-devkit/build-angular/plugins/karma')
        ],
        client: {
            clearContext: false
        },
        coverageReporter : {
            dir: require('path').join(__dirname, './coverage'),
            subdir: '.',
            reporters: [
                {type: 'html'},
                {type: 'lcovonly'},
                {type: 'text-summary'},
                {type: 'cobertura'}
            ],
            fixWebpackSourcePaths: true
        },
        reporters: ['progress', 'kjhtml','coverage'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        browsers: ['ChromeHeadless'],
        customLaunchers: {
            ChromeHeadless: {
                base: 'Chrome',
                flags: [
                    '--disable-gpu',
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--headless',
                    '--remote-debugging-port=9222']
            }
        },
        browserNoActivityTimeout: 60000,
        autoWatch: false,
        singleRun: true,
    });
};
