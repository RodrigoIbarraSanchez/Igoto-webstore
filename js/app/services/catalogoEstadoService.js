angular.module('tiendaApp.catalogoEstadoService', [])
.service('catalogoEstadoService', ['$http', 'APP_SETTINGS', '$localStorage',
function(					  	 	$http,   APP_SETTINGS,   $localStorage){
	var api = APP_SETTINGS.api
	this.getEstados = function (onSuccess, onError) {
		$http.get(api+"api/estado",
		{headers:{'x-access-token': $localStorage.token}})
		.then(function (response) {
			//console.log(response)
			if (response.data.success) {
				onSuccess(response.data.catalogo)
			}else{
				onError(response.data.message)
			}
		},onError)
	}
}])