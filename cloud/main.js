
Parse.Cloud.define("hello", function(request, response) {

  Parse.Cloud.httpRequest({
    url: 'http://www.refugerestrooms.org/api/v1/restrooms/by_location.json',
    params: {
      lat : request.params.lat,
      lng : request.params.lng,
    },
    success: function(httpResponse) {
      response.success(httpResponse.data);
    },
    error: function(httpResponse) {
      response.error('Request failed with response code ' + httpResponse.status);
    }
  });

});


