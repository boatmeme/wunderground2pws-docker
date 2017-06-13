'use strict';
const moment = require('moment');
const request = require('request');
const url = 'https://www.pwsweather.com/pwsupdate/pwsupdate.php';

const post = ( url, form ) => new Promise( (resolve, reject) => {
  request.post( url , { form }, (err, response, body) => err ? reject(err) : resolve({ status: response.statusCode, body }) );
});

const HUMIDITY_REGEX = /[%-]/g;
const EMPTY_STRING = '';
const EXTRA_FIELDS = {
  softwaretype: 'WundergroundToPWSWeatherv0.0.1'
}

class PWSWeatherUpdate {
  constructor(password) {
    this.password = password;
    this.lastUpdate = moment(new Date(0));
  }

  update(pws_id, payload) {
    return post(`${url}`, Object.assign( payload, EXTRA_FIELDS, { ID: pws_id, action: 'updateraw', PASSWORD: this.password } ) );
  }

  updateWithWunderground( pws_id, wu_payload ) {
    return this.update(pws_id, PWSWeatherUpdate.WundergroundToPWSMapper(wu_payload));
  }

  static WundergroundToPWSMapper({
    wind_degrees = EMPTY_STRING,
    wind_mph = EMPTY_STRING,
    wind_gust_mph = EMPTY_STRING,
    temp_f = EMPTY_STRING,
    precip_1hr_in = EMPTY_STRING,
    precip_today_in = EMPTY_STRING,
    pressure_in = EMPTY_STRING,
    dewpoint_f = EMPTY_STRING,
    relative_humidity = EMPTY_STRING,
    observation_epoch = new Date().getUTCSeconds(),
    solarradiation = EMPTY_STRING,
    uv = EMPTY_STRING
  }) {
    return {
      dateutc: moment(new Date(0).setUTCSeconds(observation_epoch)).format('YYYY-MM-DD HH:mm:ss'),
      winddir: wind_degrees,
      windspeedmph: wind_mph,
      windgustmph: wind_gust_mph,
      tempf: temp_f,
      rainin: precip_1hr_in,
      dailyrainin: precip_today_in,
      baromin: pressure_in,
      dewptf: dewpoint_f,
      solarradiation,
      UV: uv,
      humidity: relative_humidity.replace( HUMIDITY_REGEX, EMPTY_STRING )
    };
  }
}

module.exports = PWSWeatherUpdate;
