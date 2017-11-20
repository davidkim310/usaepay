var express = require('express');
var router = express.Router();
var sha256 = require('sha256');
var randomstring = require("randomstring");
var rp = require('request-promise');

router.get('/purchase', function (req, res, next) {
  res.send('Use POST method instead!');
});

router.post('/purchase', function (req, res, next) {
  console.log('BODY:', req.body);

  var authKey = generateAuthKey();

  var options = {
    method: 'POST',
    uri: 'https://sandbox.usaepay.com/api/v2/transactions',
    headers: {
      'Authorization': 'Basic ' + authKey
    },
    body: req.body,
    json: true // Automatically parses the JSON string in the response
  };

  rp(options)
    .then(function (repos) {
      console.log('RESPONSE:', repos);
      res.send(repos);
    })
    .catch(function (err) {
      console.error(err)
      throw err;
    });

});

function generateAuthKey(){
  var seed = randomstring.generate();
  var apikey = "_Fyh3F73ry7smgO1xoF3gs0HnDcr9Wj3"
  var apipin = "1234"
  var prehash = apikey + seed + apipin;
  var apihash = 's2/' + seed + '/' + sha256(prehash);
  var authKey = new Buffer(apikey + ":" + apihash).toString('base64')
  console.log("Authorization: Basic " + authKey);
  return authKey;
}

module.exports = router;
