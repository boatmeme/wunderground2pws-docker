'use strict';
const WundergroundConditions = require('./WundergroundConditions');
const PWSWeatherUpdate = require('./PWSWeatherUpdate');
const moment = require('moment');

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
        const updateTime = moment(new Date(0).setUTCSeconds(conditions.observation_epoch));
        
        if (updateTime.isSameOrBefore(this.getLastUpdated(pws_id))) {
           return Promise.resolve({ status: 400, message: 'Old Data from Wunderground, skipping update...'});
        }

        return this.pwsClient.updateWithWunderground( pws_id, conditions )
          .then( results => {
            this.lastUpdated[pws_id] = updateTime;
            return Object.assign( results, { message: `Synchronized wu:${wu_pws} with pws:${pws_id}` })
          })
      });
  }
}

module.exports = Wunderground2PWS
