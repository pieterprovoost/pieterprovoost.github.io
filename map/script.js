var app = angular.module("app", ['leafcutter']);

var trunc = function(x) {
	if (x > 0) {
		return Math.floor(x);
	} else {
		return Math.ceil(x);
	}
};

app.service('geocodeservice', function($q, $http, $rootScope) {

    this.gazetteer = function(q) {
        var url = "http://www.marineregions.org/rest/getGazetteerRecordsByName.json/" + q + "/true/false/?callback=?";
        var deferred = $q.defer();
        var ajax = $.ajax({
            url: url,
            dataType: 'json',
            success: function (response) {
                deferred.resolve(response);
            }, error: function() {
            	deferred.resolve({});
            }
        });
        return deferred.promise;
    };

});

app.directive('ngEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if(event.which === 13) {
                scope.$apply(function(){
                        scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };
});

app.controller("mapcontroller", function($scope, $filter, leafcuttermaps, geocodeservice) {

	$scope.loading = false;
	$scope.locations = [];
	$scope.eez = null;
	$scope.iho = null;

	$scope.geocode = function() {
		$scope.gazetteer = {};
		$scope.loading = true;
		geocodeservice.gazetteer($scope.input).then(function(res) {
			$scope.gazetteer = res;
			$scope.loading = false;
			$scope.input = "";
		});
	};

	$scope.showeez = false;

	$scope.toggleeez = function() {
		leafcuttermaps.getMap("map").then(function(map) {
			if ($scope.eez == null) {
				$scope.eez = L.tileLayer.wms("http://iobis.org/geoserver/OBIS/wms?service=WMS&version=1.1.0&request=GetMap&layers=OBIS:eezs&styles=&srs=EPSG:4326", {
					layers: 'OBIS:eezs',
					format: 'image/png',
					transparent: true
				});
				$scope.eez.addTo(map.map);
			} else {
				map.map.removeLayer($scope.eez);
				$scope.eez = null;
			}
		});
	};

	$scope.toggleiho = function() {
		leafcuttermaps.getMap("map").then(function(map) {
			if ($scope.iho == null) {
				$scope.iho = L.tileLayer.wms("http://iobis.org/geoserver/OBIS/wms?service=WMS&version=1.1.0&request=GetMap&layers=OBIS:eezs&styles=&srs=EPSG:4326", {
					layers: 'OBIS:iho',
					format: 'image/png',
					transparent: true
				});
				$scope.iho.addTo(map.map);
			} else {
				map.map.removeLayer($scope.iho);
				$scope.iho = null;
			}
		});
	};

	$scope.add = function(lon, lat, name) {

		lon = $filter('number')(lon, 4);
		lat = $filter('number')(lat, 4);

		/*
		var dlon = trunc(lon);
		var tlon = (lon - dlon) * 60;
		var mlon = trunc(tlon);
		var slon = Math.round((tlon - mlon) * 60);
		var dlat = trunc(lat);
		var tlat = (lat - dlat) * 60;
		var mlat = trunc(tlat);
		var slat = Math.round((tlat - mlat) * 60);
		var plon = "E";
		if (dlon < 0) {
			plon = "W";
		}
		var plat = "N";
		if (dlat < 0) {
			plat = "S";
		}
		var llon = plon + " " + Math.abs(dlon) + "°" + "" + Math.abs(mlon) + "'" + "" + Math.abs(slon) + "\"";
		var llat = plat + " " + Math.abs(dlat) + "°" + "" + Math.abs(mlat) + "'" + "" + Math.abs(slat) + "\"";
		var description = $filter('number')(lon, 4) + " " + $filter('number')(lat, 4) + " (" + llon + " " + llat + ")\n";
		*/

		var marker = L.marker([lat, lon]);

		leafcuttermaps.getMap("map").then(function(map) {
			marker.addTo(map.map);
		});

		var entry = {lon: lon, lat: lat, marker: marker};

		if (name !== undefined) {
			entry.name = name;
		}

		$scope.locations.push(entry);

	};

	$scope.plot = function() {
		var coords = $scope.coord.split(/[ ,]+/);
		if (coords.length == 2) {
			var lon = coords[0];
			var lat = coords[1];
			$scope.add(lon, lat);
		}
	};

	$scope.del = function(location) {
		leafcuttermaps.getMap("map").then(function(map) {
			map.map.removeLayer(location.marker);
		});
		var i = $scope.locations.indexOf(location);
		if (i != -1) {
			$scope.locations.splice(i, 1);
		}
	};

	$scope.clearcode = function() {
		$scope.input = "";
		$scope.gazetteer = [];
	};

	leafcuttermaps.getMap("map").then(function(map) {
		map.clicked = 0;
		map.map.on('click', function(e) {
			map.clicked = map.clicked + 1;
			setTimeout(function() {
				if (map.clicked == 1) {
					$scope.$apply(function() {
						$scope.add($filter('number')(e.latlng.lng, 4), $filter('number')(e.latlng.lat, 4));
					});
				}
				map.clicked = 0;
			}, 300);
		});
	});

});