'use strict';
const should = require('should');
const { clamp, angle, fahrenheit, percent, natural, filter } = require('../utils/MetricClamps');

describe('MetricClamps', () => {
  describe('.filter()', () => {
    it('should return integer value for string value representing an integer', () => {
      const n = 5312;
      filter(`${n}`).should.eql(n);
    });
    it('should return float value for string value representing a float', () => {
      const n = -5312.62217;
      filter(`${n}`).should.eql(n);
    });
    it('should return undefined for string that will not parse to a number', () => {
      should(filter('-')).not.be.ok();
    });
    it('should return undefined for empty string ""', () => {
      should(filter('')).not.be.ok();
    });
    it('should return undefined for undefined value', () => {
      should(filter(undefined)).not.be.ok();
    });
    it('should return undefined for null value', () => {
      should(filter(null)).not.be.ok();
    });
    it('should return 0 for 0 value', () => {
      filter(0).should.eql(0);
    });
    it('should return 0 for string "0"', () => {
      filter(0).should.eql(0);
    });
    it('should return any number less than than MAX_SAFE_INTEGER', () => {
      const n = Number.MAX_SAFE_INTEGER - 1;
      filter(n).should.eql(n);
    });
    it('should return any number greater than Number.MIN_SAFE_INTEGER', () => {
      const n = Number.MIN_SAFE_INTEGER + 1
      filter(n).should.eql(n);
    });
    it('should return undefined for numbers greater than MAX_SAFE_INTEGER', () => {
      should(filter(Number.MAX_VALUE)).not.be.ok();
    });
    it('should return undefined for numbers less than MIN_SAFE_INTEGER', () => {
      should(filter(Number.NEGATIVE_INFINITY)).not.be.ok();
    });
  });
  describe('.clamp()', () => {
    it('should return integer value for string value representing an integer', () => {
      const n = 5312;
      clamp(`${n}`).should.eql(n);
    });
    it('should return float value for string value representing a float', () => {
      const n = -5312.62217;
      clamp(`${n}`).should.eql(n);
    });
    it('should return undefined for string that will not parse to a number', () => {
      should(clamp('-')).not.be.ok();
    });
    it('should return undefined for empty string ""', () => {
      should(clamp('')).not.be.ok();
    });
    it('should return undefined for undefined value', () => {
      should(undefined).not.be.ok();
    });
    it('should return undefined for null value', () => {
      should(null).not.be.ok();
    });
    it('should return 0 for 0 value', () => {
      clamp(0).should.eql(0);
    });
    it('should return 0 for string "0"', () => {
      clamp(0).should.eql(0);
    });
    it('should return any number less than than MAX_SAFE_INTEGER', () => {
      const n = Number.MAX_SAFE_INTEGER - 1;
      clamp(n).should.eql(n);
    });
    it('should return any number greater than Number.MIN_SAFE_INTEGER', () => {
      const n = Number.MIN_SAFE_INTEGER + 1
      clamp(n).should.eql(n);
    });
    it('should return MAX_SAFE_INTEGER for numbers greater than MAX_SAFE_INTEGER', () => {
      clamp(Number.MAX_VALUE).should.eql(Number.MAX_SAFE_INTEGER);
    });
    it('should return MIN_SAFE_INTEGER for numbers less than MIN_SAFE_INTEGER', () => {
      clamp(Number.NEGATIVE_INFINITY).should.eql(Number.MIN_SAFE_INTEGER);
    });
  });
  describe('.angle()', () => {
    it('should return undefined for less than 0', () => {
      should(angle(-1)).not.be.ok();
    });
    it('should return undefined for more than 360', () => {
      should(angle(361)).not.be.ok();
    });
    it('should return value between 0 and 360', () => {
      angle(180.45).should.eql(180.45);
    });
  });

  describe('.fahrenheit()', () => {
    it('should return undefined for less than Absolute Zero', () => {
      const ABSOLUTE_ZERO = -459.67;
      should(fahrenheit(ABSOLUTE_ZERO - 1)).not.be.ok();
    });
    it('should return undefined for more than Planck Temperature', () => {
      const MORE_THAN_PLANCK_TEMPERATURE = 2.56e+32;
      should(fahrenheit(MORE_THAN_PLANCK_TEMPERATURE)).not.be.ok();
    });
    it('should return the highest recorded temperature', () => {
      const HIGHEST_RECORDED_TEMPERATURE = 134;
      fahrenheit(HIGHEST_RECORDED_TEMPERATURE).should.eql(HIGHEST_RECORDED_TEMPERATURE);
    });

    it('should return the lowest recorded temperature', () => {
      const LOWEST_RECORDED_TEMPERATURE = -128.6;
      fahrenheit(LOWEST_RECORDED_TEMPERATURE).should.eql(LOWEST_RECORDED_TEMPERATURE);
    });
  });

  describe('.percent()', () => {
    it('should return undefined for less than 0', () => {
      should(percent(-622.17)).not.be.ok();
    });
    it('should return undefined for more than 100', () => {
      should(percent(522.12)).not.be.ok();
    });
    it('should return a valid percent value', () => {
      percent(75.6).should.eql(75.6);
    });
  });

  describe('.natural()', () => {
    it('should return undefined for less than 0', () => {
      should(natural(-1.25)).not.be.ok();
    });
    it('should return undefined for more than Number.MAX_SAFE_INTEGER', () => {
      should(natural(Number.MAX_VALUE)).not.be.ok();
    });
  });
});
