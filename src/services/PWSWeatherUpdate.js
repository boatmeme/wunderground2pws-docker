'use strict';
const request = require('request');
const url = 'https://www.pwsweather.com/pwsupdate/pwsupdate.php';

const post = ( url, form ) => new Promise( (resolve, reject) => {
  request.post( url , { form }, (err, response, body) => err ? reject(err) : resolve({ status: response.statusCode, body }) );
});

const EXTRA_FIELDS = {
  softwaretype: 'Wunderground2PWSv1.1.0'
}

class PWSWeatherUpdate {
  constructor(password) {
    this.password = password;
  }

  update(pws_id, payload) {
    return post(`${url}`, Object.assign( payload, EXTRA_FIELDS, { ID: pws_id, action: 'updateraw', PASSWORD: this.password } ) );
  }
}

module.exports = PWSWeatherUpdate;
