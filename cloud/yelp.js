// parse/node oauth code sourced from https://gist.github.com/aleclarson/8892714

var
CONSUMER_KEY = 'jw6p6JgbNCmO7Fj1P-_EGQ',
CONSUMER_SECRET = 'ZxFnf0ZtOrLCmtFKztGepqU80Ks',
ACCESS_TOKEN = 'Kbuaqc_NewU38XOQDtKbtxW2G-Npx7nw',
TOKEN_SECRET = 'uhIxwLysEAXxAUM0Q_-16Jqx57g',
nonceAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
ENCODING_METHOD = to_rfc3986,
crypto = require('crypto');
 
exports.request = function (opts) {
  var request = {};
  request.url = 'http://api.yelp.com/v2/search';
  request.method = opts.method || 'GET';
  request.params = params || {};
  var authProps = getAuthProperties(request);
  request.headers = {
    'Authorization': getAuthHeader(authProps),
    'User-Agent': USER_AGENT
  };
  return Parse.Cloud.httpRequest(request);
};
 
function getAuthHeader (authProps) {
  var oauth = mapObject(authProps, commaSpaceEncoding).sort();
  oauth.push(oauth.pop().replace(', ', ''));
  oauth.unshift('OAuth ');
  return oauth.join('');
};
 
function getAuthProperties (request) {
  var props = {};
  props.oauth_consumer_key = CONSUMER_KEY;
  props.oauth_nonce = getNonce();
  props.oauth_signature_method = 'HMAC-SHA1';
  props.oauth_timestamp = Math.floor(new Date() / 1000).toString();
  props.oauth_token = ACCESS_TOKEN;
  props.oauth_signature = getAuthSignature(request, props);
  return props;
};
 
function getAuthSignature (request, oauth) {
  var signingKey, body, signatureBase;
 
  signingKey =
    ENCODING_METHOD(CONSUMER_SECRET) + '&' + ENCODING_METHOD(TOKEN_SECRET);
 
  body = 
    mapObject(oauth, ampersandEncoding)
    .concat(mapObject(request.params, ampersandEncoding))
    .sort();
  // Remove trailing ampersand
  body.push(body.pop().replace('&', ''));
 
  signatureBase =
    request.method.toUpperCase() + '&' +
    ENCODING_METHOD(request.url) + '&' +
    ENCODING_METHOD(body.join(''));
 
  return crypto.createHmac('sha1', signingKey)
               .update(signatureBase)
               .digest('base64');
};
 
function getNonce () {
  var text = [];
  for(var i = 0; i < 32; i++) {
    text.push(nonceAlphabet.charAt(Math.floor(Math.random() * nonceAlphabet.length)));
  }
  return text.join('');
};
 
function mapObject (object, factory) {
  var array = [];
  for (var name in object) {
    array.push(factory(object[name], name));
  }
  return array;
};
 
// Used with mapObject() to create percent-encoded strings like this: key1=val1&key2=val2&key3=val3
function ampersandEncoding (val, key) {
  return ENCODING_METHOD(key) + '=' + ENCODING_METHOD(val) + '&';
};
 
// Used with mapObject() to create percent-encoded strings like this: key1="val1", key2="val2", key3="val3"
function commaSpaceEncoding (val, key) {
  return ENCODING_METHOD(key) + '="' + ENCODING_METHOD(val) + '", ';
};
 
// From: http://af-design.com/blog/2008/03/14/rfc-3986-compliant-uri-encoding-in-javascript/
function to_rfc3986 (string) {
  return encodeURIComponent(string).replace('!','%21').replace('*','%2A').replace('(','%28').replace(')','%29').replace("'",'%27');
};