var app = angular.module("app", ['leafcutter']);

app.controller("mapcontroller", function($scope, $filter, leafcuttermaps) {

	$scope.log = "";
	$scope.layer = L.layerGroup();

	$scope.plot = function() {
		var coords = $scope.coord.split(/[ ,]+/);
		if (coords.length == 2) {
			var lon = coords[0];
			var lat = coords[1];
			$scope.log = $scope.log + lon + " " + lat + "\n";
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