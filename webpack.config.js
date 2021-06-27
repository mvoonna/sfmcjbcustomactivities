const testActivity = require('./modules/test-activity/webpack.config');
const lastMileCheckActivity = require('./modules/last-mile-check-activity/webpack.config');

module.exports = function(env, argv) {
    return [
        testActivity(env, argv),
        lastMileCheckActivity(env, argv),
    ];
};
