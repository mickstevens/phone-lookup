var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

(function (global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(require("https")) : typeof define === "function" && define.amd ? define(["https"], factory) : global.PhoneLookup = factory(global.https);
})(this, function (https) {
  "use strict";

  var PhoneLookup = (function () {
    function PhoneLookup(accountSid, authToken) {
      _classCallCheck(this, PhoneLookup);

      this.sid_ = accountSid;
      this.token_ = authToken;
    }

    _createClass(PhoneLookup, {
      get: {
        value: function get(phoneNumber) {
          var _this = this;

          var withCarrier = arguments[1] === undefined ? false : arguments[1];

          return new Promise(function (resolve, reject) {
            var params = withCarrier ? "?Type=carrier" : "";
            var options = {
              hostname: "lookups.twilio.com",
              port: 443,
              path: ["/v1/PhoneNumbers/", phoneNumber, params].join(""),
              method: "GET",
              auth: [_this.sid_, _this.token_].join(":")
            };

            https.get(options, function (response) {
              var output = "";
              response.on("data", function (d) {
                output += d;
              });
              response.on("end", function () {
                var parsed = JSON.parse(output);
                if (parsed.status === 200) {
                  resolve(parsed);
                } else {
                  reject(parsed);
                }
              });
            });
          });
        }
      },
      getShort: {
        value: function getShort(phoneNumber) {
          return this.get(phoneNumber);
        }
      },
      getFull: {
        value: function getFull(phoneNumber) {
          return this.get(phoneNumber, true);
        }
      }
    });

    return PhoneLookup;
  })();

  var index = PhoneLookup;

  return index;
});
//# sourceMappingURL=./phone-lookup-dist.js.map