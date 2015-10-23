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

	$scope.log = "";
	$scope.layer = L.layerGroup();
	$scope.loading = false;

	$scope.geocode = function() {
		$scope.gazetteer = {};
		$scope.loading = true;
		geocodeservice.gazetteer($scope.input).then(function(res) {
			$scope.gazetteer = res;
			$scope.loading = false;
			$scope.input = "";
		});
	};

	$scope.add = function(lon, lat) {
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
		$scope.log = $scope.log + $filter('number')(lon, 4) + " " + $filter('number')(lat, 4) + " (" + llon + " " + llat + ")\n";
		var marker = L.marker([lat, lon]).addTo($scope.layer);
	};

	$scope.plot = function() {
		var coords = $scope.coord.split(/[ ,]+/);
		if (coords.length == 2) {
			var lon = coords[0];
			var lat = coords[1];
			add(lon, lat);
		}
	};

	$scope.clear = function() {
		$scope.log = "";
		$scope.coord = "";
		$scope.layer.clearLayers();
	};

	leafcuttermaps.getMap("map").then(function(map) {
		$scope.layer.addTo(map.map);
		map.map.on('click', function(e) {
			$scope.$apply(function() {
				$scope.coord = $filter('number')(e.latlng.lng, 4) + " " + $filter('number')(e.latlng.lat, 4);
			});
		});
	});

});