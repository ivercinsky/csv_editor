var app = angular.module("data",["angularFileUpload"]);

app.controller("mainCtrl",['$scope','$http','FileUploader', function($scope, $http, FileUploader) {
	$scope.hola = "Holaa";
	$scope.download_csv = function() {
		$http({method: 'GET', url: '/file/data_dic.csv'}).
		  success(function(data, status, headers, config) {
		     var anchor = angular.element('<a/>');
		     anchor.attr({
			 href: 'data:attachment/csv;charset=utf-8,' + encodeURI(data),
			 target: '_blank',
			 download: 'filename.csv'
		     })[0].click();

		  }).
		  error(function(data, status, headers, config) {
		    // handle error
		  });
	};
	
	var uploader = $scope.uploader= new FileUploader({
		url: 'data_dic',
		name: 'data'
	});
	$scope.fields = []
	$scope.guardarEnServer = function(data) {
		$http.post("/guardar",{"data": data}).then(function(response) {
			
		});
	}
	$scope.addItem=function() {
		var id = $scope.fields.length;
		$scope.nuevo.id=id+1;
		$scope.nuevo.description="N/D";
		$scope.fields.push($scope.nuevo);
		$scope.nuevo= {}			
	}


	uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function(fileItem) {
            console.info('onAfterAddingFile', fileItem);
        };
        uploader.onAfterAddingAll = function(addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function(item) {
            console.info('onBeforeUploadItem', item);
        };
        uploader.onProgressItem = function(fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function(progress) {
            console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
        };
        uploader.onErrorItem = function(fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function(fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);		
	    $scope.fields = $scope.fields.concat(response);
        };
        uploader.onCompleteAll = function() {
            console.info('onCompleteAll');
        };
}]);
