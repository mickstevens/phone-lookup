import PhoneLookup from '../../src/index';

describe('PhoneLookup', () => {

  var twilioSid = process.env.TWILIO_SID || 'accountSID';
  var twilioToken = process.env.TWILIO_TOKEN || 'token';

  var nock = require('nock');
  //var https = require('https');

  describe('Init', () => {

    it('should set auth data', () => {
      var lookup = new PhoneLookup(twilioSid, twilioToken);
      expect(lookup.sid_).to.be.equals(twilioSid);
      expect(lookup.token_).to.be.equals(twilioToken);
    });

    it('should require AccountSID', () => {
      var init = () => {
        var lookup = new PhoneLookup();
        lookup.d = 1;
      };

      expect(init).to.throw('AccountSID is required');
    });

    it('should require AuthToken', () => {
      var init = () => {
        var lookup = new PhoneLookup(twilioSid);
        lookup.d = 1;
      };

      expect(init).to.throw('AuthToken is required');
    });
  });

  describe('Data requests', () => {

    it('simple get', () => {
      nock('https://lookups.twilio.com')
        .get('/v1/PhoneNumbers/600555000?CountryCode=PL')
        .reply(200, JSON.stringify({ 'country_code': 'PL',
          'phone_number': '+48600548367',
          'national_format': '600 548 367',
          'carrier': null,
          'url': 'https://lookups.twilio.com/v1/PhoneNumbers/+48600548367' }));

      var lookup = new PhoneLookup(twilioSid, twilioToken);
      lookup.get('600555000', { countryCode: 'PL' })
        .then((r) => {
          expect(r.country_code).to.be.equals('PL');
          expect(r.phone_number).to.be.equals('+48600555000');
          expect(r.national_format).to.be.equals('600 555 000');
          expect(r.carrier).to.be.equals(null);
          expect(r.url).to.be.equals('https://lookups.twilio.com/v1/PhoneNumbers/+48600555000');
        });
    });

    it('with carrier get', () => {
      nock('https://lookups.twilio.com')
        .get('/v1/PhoneNumbers/+48600555000?Type=carrier')
        .reply(200, JSON.stringify({ 'country_code': 'PL',
          'phone_number': '+48600555000',
          'national_format': '600 555 000',
          'carrier': {},
          'url': 'https://lookups.twilio.com/v1/PhoneNumbers/+48600555000' }));

      var lookup = new PhoneLookup(twilioSid, twilioToken);
      lookup.getWithCarrier('+48600555000')
        .then((r) => {
          expect(r.country_code).to.be.equals('PL');
          expect(r.phone_number).to.be.equals('+48600555000');
          expect(r.national_format).to.be.equals('600 555 000');
          expect(r.carrier).to.be.equals({});
          expect(r.url).to.be.equals('https://lookups.twilio.com/v1/PhoneNumbers/+48600555000');
        });
    });
  });
});
