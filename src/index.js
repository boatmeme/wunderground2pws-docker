'use strict';
const moment = require('moment');
const CronJob = require('cron').CronJob;
const Wunderground2PWS = require('./services/Wunderground2PWS');

const error = (message, status) => {
  console.log(message);
  process.exit(status);
}

const wu_pws = process.env.WU_PWS_ID;
const wu_api_key = process.env.WU_API_KEY;
const pws_id = process.env.PWS_ID;
const pws_password = process.env.PWS_PASSWORD;
const frequency = process.env.FREQUENCY || '5';
const cronTime = process.env.CRON_TIME || `*/${frequency} * * * *`;

if (!wu_pws) error('Must provide a Wunderground PWS ID from which to retrieve current conditions as an environment variable: WU_PWS_ID');
if (!wu_api_key) error('Must provide a Wunderground API Key as an environment variable: WU_API_KEY');
if (!pws_id) error('Must provide a PWSWeather.com PWS ID to update as an environment variable: PWS_ID');
if (!pws_password) error('Must provide a PWSWeather.com password as an environment variable: PWS_PASSWORD');

const wu2pws = new Wunderground2PWS({ wu_api_key, pws_password })

const onTick = () => wu2pws.synchronize({ wu_pws, pws_id })
  .then( ({status, body, message}) => {
    console.log( `${moment()} - ${status} - ${message}` );
  })
  .catch( err => console.log(`${moment()} - Error: ${err}`) );

const job = new CronJob({
  cronTime,
  onTick,
  start: true
});

console.log(`Wunderground2PWS is set to synchronize wu:${wu_pws} with pws:${pws_id} every ${frequency} minutes`);
