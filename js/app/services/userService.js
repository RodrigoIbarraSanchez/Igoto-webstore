angular.module('tiendaApp.userService', [])
.service('userService', ['$http', 'APP_SETTINGS', '$localStorage',
function(				  $http,   APP_SETTINGS, $localStorage){
	var api =  APP_SETTINGS.api
	this.createUser = function (usuario, onSuccess, onError) {
		$http.post(api+"api/registro", usuario)
		.then(function (response) {
			console.log(response)
			if (response.data.success) {
				onSuccess(response.data.token)
			}else{
				onError(response.data.message)
			}
		},onError)
	}

	this.authenticateUser = function (usuario, onSuccess, onError) {
		$http.post(api+"api/authenticate", usuario)
		.then(function (response) {
			console.log(response)
			if (response.data.success) {
				onSuccess(response.data.token)
			}else{
				onError(response.data.message)
			}
		},onError)
	}

	this.getUser = function (onSuccess, onError) {
		$http.get(api+"api/usuario/me", 
		{headers:{'x-access-token': $localStorage.token}})
		.then(function (response) {
			//console.log(response)
			if (response.data.success) {
				onSuccess(response.data.usuario)
			}else{
				onError(response.data.message)
			}
		},onError)
	}

	this.obtenerDatosTarjetaUsuario = function (customerId, onSuccess, onError) {
		$http.get(api+"api/usuario/tarjeta/"+customerId, 
		{headers:{'x-access-token': $localStorage.token}})
		.then(function (response) {
			console.log(response)
			if (response.data.success) {
				onSuccess(response.data.tarjeta)
			}else{
				onError(response.data.message)
			}
		},onError)
	}

	this.recuperarContrasenia = function (email, onSuccess, onError) {
		var data = {
			email: email
		}
		$http.post(api+"apilanding/recoverypassword",data)
		.then(function (response) {
			console.log(response)
			if (response.data.success) {
				onSuccess(response.data.success)
			}else{
				onError(response.data.message)
			}
		},onError)
	}
}])