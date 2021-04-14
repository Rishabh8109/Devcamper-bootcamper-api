const NodeGeocoder = require('node-geocoder');

const options = {
  provider: 'mapquest',
  httpAdapter : 'https',
  apiKey: 'LMM3k7aATbjAGAgw1vfiPydrCcnAWXBX', // for Mapquest, OpenCage, Google Premier
  formatter: null // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);
module.exports = geocoder;