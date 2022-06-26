const {v4: uuidV4} = require("uuid");

const uuid = () => uuidV4(undefined, undefined, undefined);
module.exports = uuid
