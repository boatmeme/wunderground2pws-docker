'use strict';
const WundergroundConditions = require('./WundergroundConditions');
const PWSWeatherUpdate = require('./PWSWeatherUpdate');
const moment = require('moment');
const { natural, fahrenheit, angle, percent } = require('../utils/MetricClamps');

const HUMIDITY_REGEX = /[%-]/g;
const EMPTY_STRING = '';

class Wunderground2PWS {
  constructor({ wu_api_key, pws_password }) {
    this.wuClient = new WundergroundConditions( wu_api_key );
    this.pwsClient = new PWSWeatherUpdate( pws_password );
    this.lastUpdated = {};
  }

  getLastUpdated( pws_id ) {
    return this.lastUpdated[pws_id] || moment(new Date(0));
  }

  synchronize( { wu_pws, pws_id } ) {
    return this.wuClient.get( wu_pws )
      .then( conditions => {
        const updateTime = moment.unix(conditions.observation_epoch);

        if (updateTime.isSameOrBefore(this.getLastUpdated(pws_id))) {
           return Promise.resolve({ status: 400, message: 'Old Data from Wunderground, skipping update...'});
        }
        return this.pwsClient.update( pws_id, Wunderground2PWS.mapPayload(conditions) )
          .then( results => {
            this.lastUpdated[pws_id] = updateTime;
            return Object.assign( results, { message: `Synchronized wu:${wu_pws} with pws:${pws_id}` })
          })
      });
  }

  static mapPayload({
    wind_degrees,
    wind_mph,
    wind_gust_mph,
    temp_f,
    precip_1hr_in,
    precip_today_in,
    pressure_in,
    dewpoint_f,
    relative_humidity = EMPTY_STRING,
    observation_epoch = Date.now() / 1000,
    solarradiation,
    uv
  }) {
    return {
      dateutc: moment.unix(observation_epoch).format('YYYY-MM-DD HH:mm:ss'),
      winddir: angle( wind_degrees ),
      windspeedmph: natural( wind_mph ),
      windgustmph: natural( wind_gust_mph ),
      tempf: fahrenheit( temp_f ),
      rainin: natural( precip_1hr_in ),
      dailyrainin: natural( precip_today_in ),
      baromin: natural( pressure_in ),
      dewptf: fahrenheit( dewpoint_f ),
      solarradiation: natural(solarradiation),
      UV: natural(uv),
      humidity: percent( relative_humidity.replace( HUMIDITY_REGEX, EMPTY_STRING ) )
    };
  }
}

module.exports = Wunderground2PWS
