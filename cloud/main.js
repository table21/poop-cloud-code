
Parse.Cloud.define("restrooms", function(request, response) {
  Parse.Cloud.httpRequest({
    url: 'http://www.refugerestrooms.org/api/v1/restrooms/by_location.json',
    params: {
      lat : request.params.lat,
      lng : request.params.lng
    },
    success: function(httpResponse) {
      var pointList = httpResponse.data;
      var idList = pointList.map(function(toilet) { return ("refugerestrooms_" + toilet.id); });
      var query = new Parse.Query("RefugeComment");
      query.containedIn("comment_id", idList);
      query.find({
        success: function(commentList) {
          var bathroomData = httpResponse.data.map(function(toilet) {
            var current = {};
            var currentLocation = new Parse.GeoPoint({
              latitude: toilet.latitude, 
              longitude: toilet.longitude 
            });
            current.location = currentLocation;

            current["name"] = toilet.name;
            current["id"] = "refugerestrooms_" + toilet.id;
            current["features"] = {
              "disabled": toilet.accessible
            };
            current["comments"] = response;

            return current;
          });

          var comments = {};
          commentList.forEach(function(comment) { 
            if (!comments[comment.attributes["comment_id"]]) {
              comments[comment.attributes["comment_id"]] = [];
            }
            comments[comment.attributes["comment_id"]].push(comment.attributes["text"]);
          });

          bathroomData.map(function(toilet) {
            toilet.comments = comments[toilet.id];
          });

          response.success(bathroomData);
        },
        error: function(myObject, error) {
          response.error(error);
        }
      });
    },
    error: function(httpResponse) {
      response.error('Request failed with response code ' + httpResponse.status);
    }
  });

});


