var app = angular.module("app", ['leafcutter']);

var trunc = function(x) {
	if (x > 0) {
		return Math.floor(x);
	} else {
		return Math.ceil(x);
	}
};

app.controller("mapcontroller", function($scope, $filter, leafcuttermaps) {

	$scope.log = "";
	$scope.layer = L.layerGroup();

	$scope.plot = function() {
		var coords = $scope.coord.split(/[ ,]+/);
		if (coords.length == 2) {
			var lon = coords[0];
			var lat = coords[1];

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

			$scope.log = $scope.log + lon + " " + lat + " (" + llon + " " + llat + ")\n";

			var marker = L.marker([lat, lon]).addTo($scope.layer);
		};
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