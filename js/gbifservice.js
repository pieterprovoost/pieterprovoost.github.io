app.service('GbifService', function($q, $http){
 
	var geojson = function(data) {

        var geojson = {};
        geojson['type'] = 'FeatureCollection';
        geojson['features'] = [];

        for (var k=0; k < data.results.length; k++) {
            var o = data.results[k];
            if (o.decimalLongitude && o.decimalLatitude) {
                var newFeature = {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [o.decimalLongitude, o.decimalLatitude]
                    },
                    "properties": {
                    }
                }
                geojson['features'].push(newFeature);
            }
        }

        return geojson;

	};

    this.occurrences = function(species) {
        var deferred = $q.defer();
        var u = "http://api.gbif.org/v1/occurrence/search?limit=300&scientificName=" + species;
        $http.get(u).success(function(data) {
        	var geo = geojson(data);
            deferred.resolve(geo);
        });
        return deferred.promise;
    };

});