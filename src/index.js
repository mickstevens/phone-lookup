import https from 'https';

class PhoneLookup {

  constructor(accountSid, authToken) {
    if(!accountSid) {
      throw new Error('AccountSID is required');
    }
    if(!authToken) {
      throw new Error('AuthToken is required');
    }
    this.sid_ = accountSid;
    this.token_ = authToken;
  }

  get(phoneNumber, options = {}) {
    options.withCarrier = !!options.withCarrier;

    return new Promise((resolve, reject) => {
      var params = [];
      if(options.withCarrier) {
        params.push('Type=carrier');
      }
      if(options.countryCode) {
        params.push('CountryCode=' + options.countryCode);
      }
      params = params.join('&');
      if(params) {
        params = ['?', params].join('');
      }
      options = {
        hostname: 'lookups.twilio.com',
        port: 443,
        path: ['/v1/PhoneNumbers/', phoneNumber, params].join(''),
        method: 'GET',
        auth: [this.sid_, this.token_].join(':')
      };

      https.get(options, (response) => {
        var output = '';
        response.on('data', function(chunk) {
          output += chunk;
        });
        response.on('end', function() {
          var parsed = JSON.parse(output);
          if(parsed.status === 200) {
            resolve(parsed);
          }
          else {
            reject(parsed);
          }
        });
      });
    });
  }

  getWithCarrier(phoneNumber, options = {}) {
    options.withCarrier = true;
    return this.get(phoneNumber, options);
  }
}

export default PhoneLookup;
