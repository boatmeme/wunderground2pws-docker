'use strict';
const should = require('should');
const moment = require('moment');
const omit = require('lodash.omit');

const Wunderground2PWS = require('../services/Wunderground2PWS');
const time = new Date(Date.now() - 360000);

const wu = {
  wind_degrees: 90,
  wind_mph: 17,
  wind_gust_mph: 45,
  temp_f: 92,
  precip_1hr_in: 0.25,
  precip_today_in: 2.43,
  pressure_in: 22.93,
  dewpoint_f: 27,
  relative_humidity: '11%',
  observation_epoch: Math.floor( time / 1000 ),
  solarradiation: 762,
  uv: 9
};

const pws = {
    UV: wu.uv,
    baromin: wu.pressure_in,
    dailyrainin: wu.precip_today_in,
    dateutc: moment( time ).format('YYYY-MM-DD HH:mm:ss'),
    dewptf: wu.dewpoint_f,
    humidity: 11,
    rainin: wu.precip_1hr_in,
    solarradiation: wu.solarradiation,
    tempf: wu.temp_f,
    winddir: wu.wind_degrees,
    windgustmph: wu.wind_gust_mph,
    windspeedmph: wu.wind_mph
 }

describe('Wunderground2PWS', () => {
  describe('mapPayload()', () => {
    it('should map Wunderground conditions to PWSWeather values', () => {
      const output = Wunderground2PWS.mapPayload( wu );
      output.should.eql( pws );
    });
    it('should create a timestamp at time of processing, if one does not exist on the input', () => {
      const now = Date.now() - 1000;
      const output = Wunderground2PWS.mapPayload( omit( wu, 'observation_epoch' ));
      omit( output, 'dateutc').should.eql( omit( pws, 'dateutc') );
      output.should.have.property('dateutc').is.a.String;
      moment(output.dateutc).valueOf().should.be.greaterThan(now);
    });
    it('should constrain input values during the mapping', () => {

      const output = Wunderground2PWS.mapPayload({
        wind_degrees: 370,
        wind_mph: -1,
        wind_gust_mph: -1,
        temp_f: -500,
        precip_1hr_in: -1,
        precip_today_in: -1,
        pressure_in: -1,
        dewpoint_f: -500,
        relative_humidity: '200%',
        observation_epoch: wu.observation_epoch,
        solarradiation: -1,
        uv: -1
      });
      output.should.eql({
          UV: undefined,
          baromin: undefined,
          dailyrainin: undefined,
          dateutc: moment( time ).format('YYYY-MM-DD HH:mm:ss'),
          dewptf: undefined,
          humidity: undefined,
          rainin: undefined,
          solarradiation: undefined,
          tempf: undefined,
          winddir: undefined,
          windgustmph: undefined,
          windspeedmph: undefined
       })
    });
  });
});
