
Parse.Cloud.define("hello", function(request, response) {

  Parse.Cloud.httpRequest({
    url: 'http://www.refugerestrooms.org/api/v1/restrooms/by_location.json',
    params: {
      lat : request.params.lat,
      lng : request.params.lng,
    },
    success: function(httpResponse) {
      var bathroomData = httpResponse.data;

      bathroomData = bathroomData.map(function(toilet) {

        var toiletLocation = new Parse.GeoPoint({latitude: request.params.lat, longitude: request.params.lng });
        toilet.location = toiletLocation;

        var reviews = new Parse.Query("Review");
        reviews.equalTo("location", toiletLocation);
        reviews.find({
          success: function(results) {
            toilet.reviews = results;
          },
          error: function() {
            // response.error("location lookup failed");
          }
        });

        return toilet;

      })

      response.success(bathroomData);
    },
    error: function(httpResponse) {
      response.error('Request failed with response code ' + httpResponse.status);
    }
  });

});


