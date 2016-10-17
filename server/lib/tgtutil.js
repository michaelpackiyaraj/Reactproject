var assert = require('assert');
var uuid = require('node-uuid');

function generateId() {
    return uuid.v4();
}

function _parseInt(value, defaultValue) {
    assert(defaultValue != null, "Param 'defaultValue' is required.");

    var result = parseInt(value);
    if (isNaN(result)) {
        result = defaultValue;
    }

    return result;
}

function handleRestError(prefix, err, res) {
    var errorId = generateId();
    console.error(prefix + "Ah CRAP (" + errorId + "): " + err);

    res.statusCode = 500;
    res.send("Now look what you did! " + errorId);
}

function getEnvVariable(name) {
    var value = process.env[name];
    assert(value, "Missing environment variable '" + name + "'.");

    var match = value.match(/^\$(.+)\$$/);
    if (match) {
        var embeddedName = match[1];
        value = getEnvVariable(embeddedName);
    }

    return value;
}

function getAllClientApiKeys() {
    var keys = getEnvVariable('TGTRAD_AS_API_AUTH_KEYS').split(',');
    return keys;
}

function getClientKey(req, res, callback) {
    const LOG_PREFIX = "CLIENT-AUTH: "

    var keys = getAllClientApiKeys();

    var clientKey = req.query.key;
    if (!clientKey || keys.indexOf(clientKey) == -1) {
        if (clientKey) {
            console.log(LOG_PREFIX + "Invalid client API key: " + clientKey);
        } else {
            console.log(LOG_PREFIX + "Missing required client API key.");
        }

        res.statusCode = 401;
        res.set('Content-Type', 'text/plain');
        return res.send("Unauthorized");
    }

    console.log(LOG_PREFIX + "Client API key: " + clientKey);

    return callback(null, clientKey);
}

module.exports = {
    generateId: generateId,
    parseInt: _parseInt,
    handleRestError: handleRestError,
    getEnvVariable: getEnvVariable,
    getAllClientApiKeys: getAllClientApiKeys,
    getClientKey: getClientKey
};