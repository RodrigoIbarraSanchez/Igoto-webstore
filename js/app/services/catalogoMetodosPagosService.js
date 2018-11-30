angular.module('tiendaApp.catalogoMetodosPagosService', [])
.service('catalogoMetodosPagosService', ['$http', 'APP_SETTINGS', '$localStorage',
function(					  			  $http,   APP_SETTINGS,   $localStorage){
	var api = APP_SETTINGS.api
	this.getMethodsPay = function (onSuccess, onError) {
		$http.get(api+"api/metodos-pago",
		{headers:{'x-access-token': $localStorage.token}})
		.then(function (response) {
			if (response.data.success) {
				onSuccess(response.data.catalogo)
			}else{
				onError(response.data.message)
			}
		},onError)
	}
}])