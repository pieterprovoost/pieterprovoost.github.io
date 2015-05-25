app.controller("MapController", function($scope, GbifService, $q, leafletData) {

	$scope.species = "Carcharodon carcharias";

	$scope.defaults = {
		attributionControl: false,
		zoomControl: false
	}

	$scope.world =	{
		lat: 20,
		lng: 0,
		zoom: 2
	};

	$scope.europe =	{
		lat: 51,
		lng: 2,
		zoom: 6
	};

	$scope.belgium =	{
		lat: 50.5,
		lng: 4.5,
		zoom: 8
	};

	$scope.layers = {
		baselayers: {
			carto: {
				name: 'OpenStreetMap',
				url: 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
				type: 'xyz'
			}
		}
	};

	$scope.geojson = {};

	$scope.fetch = function() {

		var promise = GbifService.occurrences($scope.species);

        $scope.loading = true;

        $q.all([promise]).then(function(res) {
        	var color = randomColor({luminosity: 'dark'});
            $scope.geojson[$scope.species] = {
                data: res[0],
                pointToLayer: function(feature, latlng) {
                    return new L.CircleMarker(latlng, {
                        radius: 5, 
                        fillOpacity: 0.5,
                        opacity: 0,
                        color: color
                    });
            	}
            };
        });

	};

	$scope.clear = function() {
		$scope.geojson = {};
		$scope.species = "";
	};

	$scope.fetch();

});