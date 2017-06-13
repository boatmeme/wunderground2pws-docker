'use strict';
const Wunderground = require('wunderground');

class WundergroundConditions {
  constructor( api_key ) {
    this.client = new Wunderground(api_key);
  }

  get( pws ) {
    return new Promise( (resolve, reject) => this.client.conditions( { pws }, (err, conditions) => err ? reject(err) : resolve(conditions) ))
      .then(({current_observation}) => current_observation );
  }
}

module.exports = WundergroundConditions;
