angular.module('tiendaApp.pedidoService', [])
.service('pedidoService', ['$http', 'APP_SETTINGS', '$localStorage',
function(					$http,   APP_SETTINGS,   $localStorage){
	var api = APP_SETTINGS.api+"api/pedido"
	this.obtenerListaProductosPorUsuario = function (idUsuario, onSuccess, onError) {
		$http.get(api+"/"+idUsuario,
		{headers:{'x-access-token': $localStorage.token}})
		.then(function (response) {
			//console.log(response)
			if (response.data.success) {
				onSuccess(response.data.listaProductos)
			}else{
				onError(response.data.message)
			}
		},onError)
	}
	this.registrarPedidoEfectivo = function (pedido, onSuccess, onError) {
		data = {
			pedido: pedido
		}
		$http.post(api+"/efectivo",data,
		{headers:{'x-access-token': $localStorage.token}})
		.then(function (response) {
			//console.log(response)
			if (response.data.success) {
				onSuccess(response.data.success)
			}else{
				onError(response.data.message)
			}
		},onError)
	}
	this.registrarPedidoTarjeta = function (pedido, tokenId, onSuccess, onError) {
		$http.post(api+"/tarjeta",{pedido: pedido, tokenId: tokenId},
		{headers:{'x-access-token': $localStorage.token}})
		.then(function (response) {
			//console.log(response)
			if (response.data.success) {
				onSuccess(response.data.success)
			}else{
				onError(response.data.message)
			}
		},onError)
	}
	this.registrarPedidoTransferencia = function(pedido, onSuccess, onError) {
		$http.post(api+"/transferencia",{pedido: pedido},
		{headers:{'x-access-token': $localStorage.token}})
		.then(function (response) {
			//console.log(response)
			if (response.data.success) {
				onSuccess(response.data.success)
			}else{
				onError(response.data.message)
			}
		},onError)
	}
}])