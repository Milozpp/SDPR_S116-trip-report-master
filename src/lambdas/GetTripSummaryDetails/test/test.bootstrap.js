/**
 * Stub gcv-logger during test so to speed up process, since message printing is
 * heavy. Only mocha/chai messages will be printed out.
 */
const logger = require('gcv-logger');

const emptyFn = () => { }

Object.keys(logger).forEach(key => {
    if (typeof logger[key] === 'function') {
        logger[key] = emptyFn;
    }
})